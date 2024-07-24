const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api/indexApi");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(express.static(path.resolve(__dirname, "./public")));

app.use((req, res) => {
  res.status(404).json({ message: `Not found - ${req.path}` });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
});

module.exports = app;
