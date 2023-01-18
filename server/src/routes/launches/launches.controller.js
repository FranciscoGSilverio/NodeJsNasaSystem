const {
  getAllLaunches,
  createNewLaunch,
  abortLaunch,
  findLaunchById,
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

function httpAbortLaunch(req, res) {
  const id = +req.params.id;

  const launchExists = findLaunchById(id);

  console.log("exists", launchExists);

  if (launchExists) {
    const aborted = abortLaunch(id);

    return res.status(200).json(aborted);
  } else return res.status(404).json({ message: "Launch not found" });
}

module.exports = { httpGetAllLaunches, httpCreateLaunch, httpAbortLaunch };
