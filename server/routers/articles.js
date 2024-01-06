import { Router } from "express";
import Article from "../models/Article.js";
import RSSParser from "rss-parser";
import cron from "node-cron";

const router = Router();
const parser = new RSSParser();

// Fetch and Parse XML Function
async function fetchAndParseXML() {
  try {
    const feed = await parser.parseURL("https://www.cisa.gov/news.xml");
    return feed.items;
  } catch (error) {
    console.error("Failed to fetch or parse XML:", error);
    throw error;
  }
}

// Save Articles to DB Function
async function saveArticlesToDB(articles) {
  for (const item of articles) {
    try {
      const exists = await Article.findOne({ link: item.link });
      if (!exists) {
        const newArticle = new Article({
          title: item.title,
          link: item.link,
          published: item.isoDate,
          description: item.contentSnippet || item.content
        });
        await newArticle.save();
      }
    } catch (error) {
      console.error("Failed to save article:", error);
    }
  }
}

// async function initialFetchAndSave() {
//   console.log("Performing initial fetch and save of articles...");
//   const articles = await fetchAndParseXML();
//   await saveArticlesToDB(articles);
//   console.log("Initial fetch and save complete.");
// }

// Call the function to perform the initial fetch and save
// initialFetchAndSave();
// Scheduled Task for Updating Articles Daily
cron.schedule("0 0 * * *", async () => {
  console.log("Updating articles...");
  const articles = await fetchAndParseXML();
  await saveArticlesToDB(articles);
});

// Route to get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ published: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const article = new Article({
    title: req.body.title,
    link: req.body.link,
    published: new Date(req.body.published), // Make sure to parse the date
    description: req.body.description,
    creator: req.body.creator
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to get an article by ID
router.get("/:id", getArticle, (req, res) => {
  res.json(res.article);
});

router.get("/dates", async (req, res) => {
  try {
    // Fetch all articles and sort them by the 'published' field in descending order
    const articles = await Article.find().sort({ published: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Middleware to get an article by ID
async function getArticle(req, res, next) {
  let article;
  try {
    article = await Article.findById(req.params.id);
    if (article == null) {
      return res.status(404).json({ message: "Cannot find article" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.article = article;
  next();
}

export default router;
