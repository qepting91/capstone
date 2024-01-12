import Article from "../models/Article.js";
import Parser from "rss-parser";

const parser = new Parser();

const fetchAndProcessArticles = async () => {
  try {
    const feed = await parser.parseURL(
      "https://www.cisa.gov/cybersecurity-advisories/all.xml"
    );
    const savePromises = feed.items.map(async item => {
      const existingArticle = await Article.findOne({ link: item.link });
      if (!existingArticle) {
        const newArticle = new Article({
          title: item.title,
          link: item.link,
          published: item.isoDate,
          description: item.contentSnippet,
          creator: item.creator
        });
        return newArticle.save();
      }
    });

    await Promise.all(savePromises);
  } catch (error) {
    throw new Error(`Error fetching or processing articles: ${error.message}`);
  }
};

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (error) {
    res.status(500).send(`Error getting articles: ${error.message}`);
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("Article not found");
    }
    res.json(article);
  } catch (error) {
    res.status(500).send(`Error getting article: ${error.message}`);
  }
};

export { fetchAndProcessArticles, getArticles, getArticleById };
