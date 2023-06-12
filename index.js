require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const app = express();
app.use(formidableMiddleware());
const fcl = require("@onflow/fcl");
const sdk = require("@onflow/sdk");
const cors = require("cors");
app.use(cors());

fcl.config({
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
  "accessNode.api": "https://rest-testnet.onflow.org",
});

app.post("/relayVoucher", async (req, res) => {
  let { envelopeSigs, payloadSigs, computeLimit, cadence } = req.fields;

  const proposer = {
    addr: fcl.sansPrefix(envelopeSigs[0].address),
    keyId: Number(envelopeSigs[0].keyId),
    signature: envelopeSigs[0].sig,
  };

  const signer = {
    addr: fcl.sansPrefix(payloadSigs[0].address),
    keyId: Number(payloadSigs[0].keyId),
    signature: payloadSigs[0].sig,
  };

  // building interaction from voucher
  const builtInteraction = await fcl.build([
    fcl.transaction(cadence),
    fcl.limit(computeLimit),
    fcl.proposer(proposer),
    fcl.payer(proposer),
    fcl.authorizations([signer]),
  ]);
  console.log("--------------builtInteraction", builtInteraction);

  //sending interaction to the network
  const response = await fcl.send([builtInteraction]);
  const decoded = await fcl.decode(response);
  console.log("--------------decoded", decoded);

  if (response) {
    res.status(200).json({ txId: decoded });
  } else {
    res.status(400).json({ message: "Data not found" });
  }
});

app.all("*", function (req, res) {
  res.json({ message: "Not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Committee app on port ${process.env.PORT}`);
});

module.exports = app;
