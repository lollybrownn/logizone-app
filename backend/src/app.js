const express = require("express");
const cors = require("cors");
require("dotenv").config()
const routes = require("./routes")

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "LogiZone WMS Backend running",
  });
});
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
})
module.exports = app;
