const swaggerAutogen = require("swagger-autogen");

const outputFile = "./swagger/swagger_output.json";
const endpointFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointFiles);
