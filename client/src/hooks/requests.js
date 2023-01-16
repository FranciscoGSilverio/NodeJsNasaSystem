const API_URL = process.env.REACT_APP_APIURL || "http://localhost:8000";

async function httpGetPlanets() {
  try {
    const res = await fetch(`${API_URL}/planets`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
