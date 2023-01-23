const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const SPACEX_APIURL = "https://api.spacexdata.com/v4/launches/query";
const DEFAULT_FLIGHT_NUMBER = 100;

async function loadLaunches() {
  const spaceXLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (spaceXLaunch) {
    console.log("Data already loaded");
  } else await populateLaunches();
}

async function populateLaunches() {
  console.log("downloading launches");

  try {
    const response = await axios.post(SPACEX_APIURL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    });

    const launchDocs = response.data.docs;
    for (const launchItem of launchDocs) {
      const customers = launchItem.payloads.flatMap((payload) => {
        return payload.customers;
      });

      const launch = {
        flightNumber: launchItem.flight_number,
        mission: launchItem.name,
        rocket: launchItem.rocket.name,
        launchDate: launchItem.date_local,
        upcoming: launchItem.upcoming,
        success: launchItem.success,
        customers,
      };

      saveLaunch(launch);
    }
  } catch (error) {
    console.error(
      "Error while downloading launches data from SpaceX API",
      error
    );
  }
}

async function getAllLaunches(limit, skip) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleLaunch(launch) {
  //Checks if planet is a valid target (Referential Integrity)
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) throw new Error("Launch target is not a valid planet");

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

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function findLaunchById(id) {
  return await findLaunch({ flightNumber: id });
}

module.exports = {
  loadLaunches,
  getAllLaunches,
  scheduleLaunch,
  abortLaunch,
  findLaunchById,
};
