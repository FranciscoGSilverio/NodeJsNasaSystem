const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function scheduleLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  //Checks if planet is a valid target (Referential Integrity)
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) throw new Error("Launch target is not a valid planet");

  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flighNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function getLatestFlightNumber() {
  //Sort the collection by descending order and select the latest
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  //if the collection is empty
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

async function abortLaunch(id) {
  const aborted = await findLaunchById(id);

  const response = await launchesDatabase.updateOne(
    { flightNumber: id },
    { upcoming: false, success: false }
  );

  return response;
}

async function findLaunchById(id) {
  return await launchesDatabase.findOne({ flightNumber: id });
}

module.exports = {
  getAllLaunches,
  scheduleLaunch,
  abortLaunch,
  findLaunchById,
};
