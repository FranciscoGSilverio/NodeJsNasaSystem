const {
  getAllLaunches,
  scheduleLaunch,
  abortLaunch,
  findLaunchById,
} = require("../../models/launches.model");
const definePagination = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { limit, skip } = definePagination(req.query);

  return res.status(200).json(await getAllLaunches(limit, skip));
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

async function httpAbortLaunch(req, res) {
  const id = +req.params.id;

  const launchExists = await findLaunchById(id);

  if (launchExists) {
    const aborted = await abortLaunch(id);

    // return res.status(200).json(aborted);

    if (aborted.modifiedCount === 1) {
      return res.status(200).json({ message: "Flight aborted" });
    } else
      return res.status(400).json({ error: "Unable to abort the flight " });
  } else return res.status(404).json({ message: "Launch not found" });
}

module.exports = { httpGetAllLaunches, httpCreateLaunch, httpAbortLaunch };
