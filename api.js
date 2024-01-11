import axios from "axios";
import * as store from "./store";

function displayError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  } else {
    console.error("Error container not found in DOM.");
  }
}

export function fetchArticles() {
  return axios
    .get(`${process.env.ARTICLE_API}/articles`)
    .then(response => {
      store.Article.articles = response.data;
    })
    .catch(error => {
      // Use the specific error message
      displayError(`Unable to fetch articles: ${error.message}`);
    });
}

export function handleSearchSubmit(e) {
  e.preventDefault();
  const urlInput = e.target.elements.urlInput;
  const urlToSearch = urlInput ? urlInput.value : "";

  axios
    .post("https://article-api-lp1o.onrender.com/api/search", {
      url: urlToSearch
    })
    .then(response => {
      store.updateState({ domainDetails: response.data });
    })
    .catch(error => {
      displayError("Error fetching domain details. Please try again.");
      store.updateState({ error: error.message });
    });
}
