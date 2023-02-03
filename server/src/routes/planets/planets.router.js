const express = require("express");
const { httpGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

/**
 * @openapi
 * /planets:
 *  get:
 *   description: Get all kepler planets 
 *   responses:
 *    200:
 *   description: Success
 */

planetsRouter.get("/", httpGetAllPlanets);

module.exports = planetsRouter;