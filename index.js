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
    txHash
  } = req.fields;

  console.log("------txHash------", txHash);
  
  if (txHash) {
    res.status(200).json({ txHash });
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
