const API_URL = process.env.REACT_APP_APIURL || "http://localhost:8000";

async function httpGetPlanets() {
  try {
    const res = await fetch(`${API_URL}/v1/planets`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

async function httpGetLaunches() {
  try {
    const res = await fetch(`${API_URL}/v1/launches`);
    const launches = await res.json();

    const sortedLaunches = launches.sort((a, b) => a - b);

    return sortedLaunches;
  } catch (error) {
    console.log(error);
  }
}

async function httpSubmitLaunch(launch) {
  try {
    const res = await fetch(`${API_URL}/v1/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });

    return res;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    const res = await fetch(`${API_URL}/v1/launches/${id}`, {
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
