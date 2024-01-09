import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

const router = new Navigo("/");

function render(state = store.Home) {
  console.log("Rendering state:", state);
  document.querySelector("#root").innerHTML = `
    ${Header(state)}
    ${Nav(store.Links, state)}
    ${Main(state)}
    ${Footer()}
  `;

  router.updatePageLinks();
  afterRender(state);
}

function afterRender(state) {
  console.log("After Render called for state:", state);
  document
    .querySelector(".fa-regular.fa-compass")
    .addEventListener("click", () => {
      document.querySelector("nav > ul").classList.toggle("hidden--mobile");
    });

  if (state.view === "Home") {
    // Do this stuff
    document.getElementById("Search Here").addEventListener("click", event => {
      event.preventDefault();

      router.navigate("/Search");
    });
  }
  const form = document.querySelector("#urlForm");
  if (form) {
    form.addEventListener("submit", handleSearchSubmit);
  } else {
    console.error("Form #urlForm not found on this page.");
  }

  console.log("afterRender called. Current page:", state.view === "View");
}

function handleSearchSubmit(e) {
  e.preventDefault();

  const urlInput = e.target.elements.urlInput;
  const urlToSearch = urlInput ? urlInput.value : "";
  console.log("Form submitted. URL to search:", urlToSearch);

  searchDomain(urlToSearch);
}

function searchDomain(url) {
  console.log(`Initiating API call with URL: ${url}`);
  axios
    .get(`/fullhunt/${encodeURIComponent(url)}`)
    .then(response => {
      console.log("API call successful. Response data:", response.data);
      store.Search.domainDetails = response.data;
      render(store.Search);
    })
    .catch(error => {
      console.error("Error fetching domain details:", error);
      store.Search.error = error;
      render(store.Search);
    });
}
function fetchArticles() {
  console.log("Initiating API call to fetch articles");
  return axios
    .get(`${process.env.ARTICLE_API}/articles`) // Make sure your environment variable is correctly set
    .then(response => {
      console.log("API call successful. Response data:", response.data);
      store.Article.articles = response.data;
      render(store.Article);
    })
    .catch(error => {
      console.error("Error fetching articles:", error);
      render(store.Article);
    });
}

export default fetchArticles;

router.hooks({
  before: (done, params) => {
    console.log("Router 'before' hook for params:", params);
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Search";
    console.log("before hook called for view:", view);

    if (view === "Search") {
      done();
    } else if (view === "Article") {
      fetchArticles().then(() => {
        console.log("Articles fetched, proceeding with rendering...");
        done();
      });
    } else {
      // ... other view handling ...
      done();
    }
  },
  already: params => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home";

    render(store[view]);
  }
});

router
  .on({
    "/": () => render(),
    ":view": params => {
      let view = capitalize(params.data.view);
      if (view in store) {
        render(store[view]);
      } else {
        if (store.Viewnotfound) {
          render(store.Viewnotfound);
        } else {
          console.error("Viewnotfound not defined");
        }
      }
    }
  })
  .resolve();
