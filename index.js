import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import { fetchArticles, handleSearchSubmit } from "./api";

const router = new Navigo("/");

async function render(state) {
  try {
    document.querySelector("#root").innerHTML = `${Header(state)}${Nav(
      state
    )}${Main(state)}${Footer(state)}`;
    await afterRender(state);
  } catch (error) {
    console.error("Render Error:", error);
    displayError("An error occurred while rendering the page.");
  }
}

async function afterRender(state) {
  commonEventHandlers();
  await specificViewHandlers(state);
}

function commonEventHandlers() {
  const compassElement = document.querySelector(".fa-regular.fa-compass");
  if (compassElement) {
    compassElement.addEventListener("click", toggleMobileMenu);
  }
}

function toggleMobileMenu() {
  document.querySelector("nav > ul").classList.toggle("hidden--mobile");
}

async function specificViewHandlers(state) {
  const viewHandlers = {
    Home: homeViewHandlers,
    Article: articleViewHandlers,
    Contact: contactViewHandlers,
    Search: searchViewHandlers
  };

  if (viewHandlers[state.view]) {
    await viewHandlers[state.view]();
  }
}

function displayError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  } else {
    console.error("Error container not found in DOM.");
  }
}

async function homeViewHandlers() {
  try {
    const articles = await fetchArticles();
    const articlesContainer = document.getElementById("articles-container");
    if (articlesContainer) {
      articlesContainer.innerHTML = articles
        .map(
          article => `
                <article>
                    <h2>${article.title}</h2>
                    <p>${article.summary}</p>
                    <!-- Add more article details here -->
                </article>
            `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error in Home View:", error);
    displayError("Unable to load articles.");
  }
}

async function articleViewHandlers() {
  // Since the Article view only displays articles, no specific event handlers are needed here.
}

async function contactViewHandlers() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      // Handle the form submission here
      // Example: const formData = new FormData(contactForm);
      // Send formData to a server or handle it as needed
    });
  }
}

async function searchViewHandlers() {
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearchSubmit);
  }
}

router.hooks({
  before: async (done, params) => {
    if (params && params.view) {
      const capitalizedView = capitalize(params.view);
      if (store.Page[capitalizedView]) {
        store.Page.currentView = capitalizedView;
      }
    }
    done();
  }
});

router
  .on({
    "/": () => render(store.Page.Home),
    ":view": params => {
      const viewName = capitalize(params.view);
      const page = store.Page[viewName];
      page ? render(page) : render(store.Page.Error404);
    }
  })
  .resolve();
