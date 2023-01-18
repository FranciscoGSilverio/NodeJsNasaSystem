const {
  getAllLaunches,
  createNewLaunch,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpCreateLaunch(req, res) {
  const newLaunch = req.body;

  if (
    !newLaunch.mission ||
    !newLaunch.rocket ||
    !newLaunch.launchDate ||
    !newLaunch.target
  ) {
    return res.status(400).json({
      error: "Missing required property for launch",
    });
  }
  newLaunch.launchDate = new Date(newLaunch.launchDate);

  createNewLaunch(newLaunch);

  return res.status(201).json(newLaunch);
}

module.exports = { httpGetAllLaunches, httpCreateLaunch };
