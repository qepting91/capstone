import { Router } from "express";
import Article from "../models/Article.js";
import RSSParser from "rss-parser";
import cron from "node-cron";

const router = Router();
const parser = new RSSParser();
const xmlURL = "https://www.cisa.gov/cybersecurity-advisories/all.xml";

// Function to fetch and parse XML from URL
async function fetchAndParseXML() {
  try {
    const feed = await parser.parseURL(xmlURL);
    return feed.items;
  } catch (error) {
    console.error("Failed to fetch or parse XML:", error);
    throw error;
  }
}

// Function to check if an article exists in the DB
async function doesArticleExist(link) {
  return await Article.findOne({ link });
}

// Function to save a single article to the DB
async function saveArticle(item) {
  const newArticle = new Article({
    title: item.title,
    link: item.link,
    published: item.isoDate,
    description: item.contentSnippet || item.content
  });
  await newArticle.save();
}

// Function to process and save articles
async function processAndSaveArticles(articles) {
  for (const item of articles) {
    try {
      if (!(await doesArticleExist(item.link))) {
        await saveArticle(item);
      }
    } catch (error) {
      console.error("Failed to save article:", error);
    }
  }
}

// Scheduled Task for Updating Articles Daily
cron.schedule("0 1 * * *", async () => {
  console.log("Updating articles...");
  const articles = await fetchAndParseXML();
  await processAndSaveArticles(articles);
});

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ published: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new article
router.post("/", async (req, res) => {
  try {
    const newArticle = await saveArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Middleware to get an article by ID
async function getArticle(req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Cannot find article" });
    }
    res.article = article;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Get an article by ID
router.get("/:id", getArticle, (req, res) => {
  res.json(res.article);
});

export default router;
