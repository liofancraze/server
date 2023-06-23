require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const app = express();
app.use(formidableMiddleware());
const cors = require("cors");
app.use(cors());
const axios = require("axios");
const { sansPrefix } = require("@onflow/util-address");

encodeCustom = (str) => Buffer.from(str).toString("base64");

app.post("/relayVoucher", async (req, res) => {
  let {
    cadence,
    refBlock,
    computeLimit,
    arguments,
    proposalKey,
    payer,
    authorizers,
    payloadSigs,
    envelopeSigs
  } = req.fields;

  let payload_signatures = [
        {
            address: sansPrefix(payloadSigs[0].address),
            key_index: String(payloadSigs[0].keyId),
            signature: payloadSigs[0].sig,
        }
    ]

  let envelope_signatures = [
        {
          address: sansPrefix(envelopeSigs[0].address),
          key_index: String(envelopeSigs[0].keyId),
          signature: envelopeSigs[0].sig,
        }
    ]

  proposalKey = {
    address: sansPrefix(proposalKey.address),
    key_index: String(proposalKey.keyId),
    sequence_number: String(proposalKey.sequenceNum),
  };

  const payload = {
    script: encodeCustom(cadence),
    arguments: [
      "eyJ0eXBlIjogIlVGaXg2NCIsICJ2YWx1ZSI6ICIxLjAwMDAwMDAwfQ==",
      "eyB0eXBlOiAnQWRkcmVzcycsIHZhbHVlOiAnMHgzMTY2N2FiMzE0Y2FiZWMwJyB9",
    ],
    reference_block_id: refBlock,
    gas_limit: computeLimit.toString(),
    payer: sansPrefix(payer),
    proposal_key: proposalKey,
    authorizers: [sansPrefix(authorizers[0])],
    payload_signatures,
    envelope_signatures,
  };

  console.log( "--------payload", payload);
  let response;
  try {
    response = await axios.post(
      "https://rest-testnet.onflow.org/v1/transactions",
      payload
    );
  } catch (error) {
    console.log(error.response.data);
  }

  console.log("response", response);
  
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
