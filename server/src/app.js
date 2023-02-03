const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger_output.json");

const { join } = require("path");
const api = require("./routes/api");

const webappPath = join(__dirname, "..", "public");
const webappIndexPath = join(__dirname, "..", "public", "index.html");

const app = express();

app.use(
  // cors({
  //   origin: "http://localhost:8000",
  // })
  cors()
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(morgan("combined"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(webappPath));

app.use("/v1", api);

app.get("/*", (req, res) => {
  return res.sendFile(webappIndexPath);
});

module.exports = app;
