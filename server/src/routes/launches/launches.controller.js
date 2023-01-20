const {
  getAllLaunches,
  scheduleLaunch,
  abortLaunch,
  findLaunchById,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpCreateLaunch(req, res) {
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

  if (isNaN(newLaunch.launchDate.valueOf()))
    return res.status(400).json({ error: "Invalid date format" });
  await scheduleLaunch(newLaunch);

  return res.status(201).json(newLaunch);
}

function httpAbortLaunch(req, res) {
  const id = +req.params.id;

  const launchExists = findLaunchById(id);

  if (launchExists) {
    const aborted = abortLaunch(id);

    return res.status(200).json(aborted);
  } else return res.status(404).json({ message: "Launch not found" });
}

module.exports = { httpGetAllLaunches, httpCreateLaunch, httpAbortLaunch };
