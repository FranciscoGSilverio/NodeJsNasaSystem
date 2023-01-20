// const launches = require('./../routes/launches/launches.mongo');

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "CTL", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function createNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
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
  createNewLaunch,
  abortLaunch,
  findLaunchById,
};
