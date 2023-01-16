const http = require("http");
const app = require("./app");
const { loadPlanets } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startup = async () => {
  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
  });
}

startup();
