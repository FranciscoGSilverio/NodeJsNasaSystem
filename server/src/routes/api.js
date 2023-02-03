const express = require("express");
const { version } = require("./../../package.json");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");


const api = express.Router();

// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Nasa Launch System",
//       version,
//     },
//   },

//   apis: ["./launches/launches.router.js", "./planets/planets.router.js"],
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// console.log(swaggerDocs);

// api.use("/docs", swaggerUi.serve);
// api.get("/docs", swaggerUi.setup(swaggerDocs));

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;
