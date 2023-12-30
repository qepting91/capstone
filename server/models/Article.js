import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: String,
  link: String,
  published: Date,
  description: String
});

const Article = mongoose.model("Article", articleSchema);
export default Article;
