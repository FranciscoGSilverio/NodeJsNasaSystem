const request = require("supertest");
const app = require("./../../app");
const { mongoConnect, mongoDisconnect } = require("./../../services/mongo");
const launches = require("./../../models/launches.mongo");
const { loadPlanets } = require("./../../models/planets.model");

const MOCK_LAUNCH = {
  mission: "Brazilian air force",
  rocket: "BRA 2023-D",
  target: "Kepler-1652 b",
  launchDate: "January 5, 2030",
};

const MOCK_LAUNCH_WITHOUT_DATE = {
  mission: "Brazilian air force",
  rocket: "BRA 2023-D",
  target: "Kepler-1652 b",
};

const MOCK_LAUNCH_WITH_INVALID_DATE = {
  mission: "Brazilian air force",
  rocket: "BRA 2023-D",
  target: "Kepler-1652 b",
  launchDate: "Invalid Date Format",
};

const INITIAL_LAUNCH = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "CTL", "NASA"],
  upcoming: true,
  success: true,
};

const INITIAL_LAUNCH_AFTER_ABORTING = {
  ...INITIAL_LAUNCH,
  launchDate: "2030-12-27T03:00:00.000Z",
  upcoming: false,
  success: false,
};

describe("API CRUD", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanets();
    await launches.updateOne(
      { flightNumber: INITIAL_LAUNCH.flightNumber },
      INITIAL_LAUNCH,
      { upsert: true }
    );
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  it("Should respond the get launches request with 200 success", async () => {
    await request(app)
      .get("/v1/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("Should respond the post launch request with 201 success", async () => {
    const response = await request(app)
      .post("/v1/launches")
      .send(MOCK_LAUNCH)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(MOCK_LAUNCH.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toEqual(responseDate);
    expect(response.body).toMatchObject(MOCK_LAUNCH_WITHOUT_DATE);
  });

  it("Should return the missing required property error message", async () => {
    const response = await request(app)
      .post("/v1/launches")
      .send(MOCK_LAUNCH_WITHOUT_DATE)
      .expect(400);

    const errorMessage = response.body;

    expect(errorMessage).toStrictEqual({
      error: "Missing required property for launch",
    });
  });

  it("Should return the invalid date format error message", async () => {
    const response = await request(app)
      .post("/v1/launches")
      .send(MOCK_LAUNCH_WITH_INVALID_DATE)
      .expect(400);

    const errorMessage = response.body;

    expect(errorMessage).toStrictEqual({ error: "Invalid date format" });
  });

  it("Should change the success and upcoming object properties after aborting launch", async () => {
    const response = await request(app).delete("/v1/launches/100").expect(200);

    expect(response.body).toStrictEqual({ message: "Flight aborted" });
  });
});
