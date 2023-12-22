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
    ${Nav(store.Links)}
    ${Main(state)}
    ${Footer()}
  `;

  router.updatePageLinks();
  afterRender();
}

function afterRender() {
  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector("nav > ul").classList.toggle("hidden--mobile");
    console.log("afterRender called. Current page:", store.currentPage);
  });

  if (store.currentPage === "Search") {
    handleSearchSubmit();
  }
}

function handleSearchSubmit() {
  document.querySelector("#urlForm").addEventListener("submit", e => {
    e.preventDefault();
    const urlToSearch = document.querySelector("#urlInput").value;
    console.log("Form submitted. URL to search:", urlToSearch);
    searchDomain(urlToSearch);
  });
}

function searchDomain(url) {
  console.log(`Initiating API call with URL: ${url}`);
  axios
    .get(
      `https://fullhunt.io/api/v1/domain/${encodeURIComponent(url)}/details`,
      {
        headers: {
          "X-API-KEY": process.env.FullHunt_API
        }
      }
    )
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

router.hooks({
  before: (done, params) => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Search";

    if (view === "Search") {
      done();
    } else {
      // ... other view handling ...
      done();
    }
  },
  already: params => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Search";
    render(store[view] || store.Search);
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
        render(store.Viewnotfound);
        console.log(`View ${view} not defined`);
      }
    }
  })
  .resolve();

// add menu toggle to bars icon in nav bar
// document.querySelector(".fa-bars").addEventListener("click", () => {
//   document.querySelector("nav > ul").classList.toggle("hidden--mobile");
// });
