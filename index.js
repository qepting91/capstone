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

  // Ensure elements exist before adding event listeners
  const compassElement = document.querySelector(".fa-regular.fa-compass");
  if (compassElement) {
    compassElement.addEventListener("click", () => {
      document.querySelector("nav > ul").classList.toggle("hidden--mobile");
    });
  }

  if (state.view === "Home") {
    const callToActionElement = document.getElementById("callToAction");
    if (callToActionElement) {
      callToActionElement.addEventListener("click", event => {
        event.preventDefault();
        router.navigate("/Search");
      });
    }
  }

  const form = document.querySelector("#urlForm");
  if (form) {
    form.addEventListener("submit", handleSearchSubmit);
  } else {
    console.error("Form #urlForm not found on this page.");
  }

  // Event listener for the Export to CSV button
  const exportCsvButton = document.getElementById("exportCsvButton");
  if (exportCsvButton) {
    exportCsvButton.addEventListener("click", () => {
      exportToCsv(store.Search.domainDetails.hosts);
    });
  }

  console.log("afterRender called. Current page:", state.view === "View");
}

function handleSearchSubmit(e) {
  e.preventDefault();
  const urlInput = e.target.elements.urlInput;
  const urlToSearch = urlInput ? urlInput.value : "";

  axios
    .post("https://article-api-lp1o.onrender.com/api/search", {
      url: urlToSearch
    })
    .then(response => {
      console.log("Data from FullHunt:", response.data);
      store.Search.domainDetails = response.data;
      render(store.Search);
    })
    .catch(error => {
      console.error("Error fetching domain details:", error);
    });
}

function fetchArticles() {
  console.log("Initiating API call to fetch articles");
  // Assuming the ARTICLE_API is set in the environment where this script runs
  return axios
    .get(`${process.env.ARTICLE_API}/articles`)
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

function exportToCsv(hosts) {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Host URL,IP Address,Cloud Provider,Region,Live,Ports,Tags\n"; // Header

  hosts.forEach(host => {
    let row = [
      host.host,
      host.ip_address,
      host.cloud.provider,
      host.cloud.region,
      host.is_live ? "Yes" : "No",
      host.network_ports.join("; "),
      host.tags.join("; ")
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "domain_details.csv");
  link.click();
}

// Router configuration
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
