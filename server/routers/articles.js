import { Router } from "express";
import Article from "../models/Article.js";
import RSSParser from "rss-parser";

const router = Router();
const parser = new RSSParser();

// Endpoint to retrieve articles for the frontend
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ published: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles" });
  }
});

// Scheduled task to update articles daily
router.get("/update", async (req, res) => {
  try {
    const feed = await parser.parseURL("https://www.cisa.gov/news.xml");
    feed.items.forEach(async item => {
      const existingArticle = await Article.findOne({ link: item.link });
      if (!existingArticle) {
        const newArticle = new Article({
          title: item.title,
          link: item.link,
          published: new Date(item.pubDate),
          description: item.contentSnippet || ""
        });
        await newArticle.save();
      }
    });
    res.status(200).json({ message: "Articles updated successfully" });
  } catch (error) {
    console.error("Failed to fetch or update articles:", error);
    res.status(500).json({ message: "Failed to update articles" });
  }
});

export default router;
