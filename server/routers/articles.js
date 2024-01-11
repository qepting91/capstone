import { Router } from "express";
import {
  fetchAndProcessArticles,
  getArticles,
  getArticleById
} from "./articleController.js";

const router = Router();
router.get("/fetch", async (req, res) => {
  try {
    await fetchAndProcessArticles();
    res.status(200).send("Articles fetched and processed");
  } catch (error) {
    res.status(500).send(`Error fetching articles: ${error.message}`);
  }
});

router.get("/", getArticles);
router.get("/:id", getArticleById);

export default router;
