const { getAllLaunches, createNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpCreateLaunch(req, res){
  const newLaunch = res.body;

  createNewLaunch(newLaunch);

  return res.status(201);
}

module.exports = { httpGetAllLaunches };
