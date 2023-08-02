require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const app = express();
app.use(formidableMiddleware());
const cors = require("cors");
app.use(cors());

app.post("/relayVoucher", async (req, res) => {
  let { txId } = req.fields;

  console.log("------txId------", txId);

  if (txId) {
    res.status(200).json({ txId });
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
