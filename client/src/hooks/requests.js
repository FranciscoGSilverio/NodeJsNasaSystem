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
  try {
    const res = await fetch(`${API_URL}/launches`);
    const launches = await res.json();

    const sortedLaunches = launches.sort((a, b) => a - b);

    return sortedLaunches;
  } catch (error) {
    console.log(error);
  }
}

async function httpSubmitLaunch(launch) {
  try {
    const res = await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
