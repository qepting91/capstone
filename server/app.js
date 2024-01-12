import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import articles, { fetchAndProcessArticles } from "./routers/articles.js";
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
  // Allow only your Netlify frontend domain
  const allowedOrigins = [
    "https://riskradar.netlify.app",
    "http://localhost:4040"
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept, Authorization, Origin"
  );
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
app.post("/api/search", async (req, res) => {
  try {
    const url = req.body.url;
    const response = await axios.get(
      `https://fullhunt.io/api/v1/domain/${encodeURIComponent(url)}/details`,
      {
        headers: {
          "X-API-KEY": process.env.FullHunt_API
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error in FullHunt API call:", error);
    res.status(500).send("Error fetching data");
  }
});

// NOTE: MIDDLEWARE GOES BEFORE THE CREATION OF THE ROUTES :)
fetchAndProcessArticles()
  .then(() => {
    console.log("Articles fetched on server start-up");
  })
  .catch(error => {
    console.error("Error fetching articles on start-up:", error);
  });
// Request handlers go here
app.get("/status", (request, response) => {
  response.status(200).json({ message: "Service healthy" });
});

// Create a new route for articles
app.use("/articles", articles);

// Create a new route to handle 3rd party api FullHunt

app.listen(PORT, () => console.log("Listening on port 4040"));
