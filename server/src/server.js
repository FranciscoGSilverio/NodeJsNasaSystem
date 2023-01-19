const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanets } = require("./models/planets.model");

require("dotenv").config();

const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

const MONGO_URL = process.env.MONGODB_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDb connected succesfully");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

const startup = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  });

  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
  });
};

startup();
