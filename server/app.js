import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import articlesRouter from "./routers/articles.js";
import axios from "axios";
// Load environment variables from .env file
dotenv.config();

const app = express();

mongoose.set("debug", true);

const MONGODB = process.env.MONGODB || "mongodb://localhost/article";

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error:"));
db.once(
  "open",
  console.log.bind(console, "Successfully opened connection to Mongo!")
);

const PORT = process.env.PORT || 4040;

// CORS Middleware
const cors = (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

// Logging Middleware
const logging = (request, response, next) => {
  console.log(
    `${request.method} ${request.url} ${new Date().toLocaleString("en-us")}`
  );
  next();
};

app.use(express.json());
app.use(cors);
app.use(logging);

// Proxy endpoint
app.get("/fullhunt/:domain", async (req, res) => {
  const domain = req.params.domain;
  const fullHuntUrl = `https://fullhunt.io/api/v1/domain/${domain}/details`;

  try {
    const response = await axios.get(fullHuntUrl, {
      headers: { "X-API-KEY": process.env.FULLHUNT_API_KEY } // Store your API key in .env
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from FullHunt:", error);
    res.status(500).json({ message: "Failed to fetch data from FullHunt" });
  }
});

// NOTE: MIDDLEWARE GOES BEFORE THE CREATION OF THE ROUTES :)

// Request handlers go here
app.get("/status", (request, response) => {
  response.status(200).json({ message: "Service healthy" });
});

// Create a new route for articles
app.use("/articles", articlesRouter);

// Create a new route to handle 3rd party api FullHunt

app.listen(PORT, () => console.log("Listening on port 4040"));
