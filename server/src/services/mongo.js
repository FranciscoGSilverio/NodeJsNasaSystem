const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGODB_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDb connected succesfully");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
