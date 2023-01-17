const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const { join } = require("path");

const webappPath = join(__dirname, "..", "public");
const webappIndexPath = join(__dirname, "..", "public", "index.html");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(webappPath));

app.use(planetsRouter);
app.use(launchesRouter);

app.get("/*", (req, res) => {
  return res.sendFile(webappIndexPath);
});

module.exports = app;
