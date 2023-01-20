const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

let latestFlightNumber = 100;

// const launch = {
//   flightNumber: 100,
//   mission: "Kepler Exploration X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "CTL", "NASA"],
//   upcoming: true,
//   success: true,
// };

// launches.set(launch.flightNumber, launch);

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

function createNewLaunch(launch) {
  try {
    scheduleLaunch(launch);
  } catch (error) {
    console.error(`Unable to save launch to database ${error}`);
  }
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

function abortLaunch(id) {
  const aborted = launches.get(id);

  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

function findLaunchById(id) {
  return launches.has(id);
}

module.exports = {
  getAllLaunches,
  scheduleLaunch,
  abortLaunch,
  findLaunchById,
};
