import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";

const router = new Navigo("/");

function render(state = store.Home) {
  document.querySelector("#root").innerHTML = `
    ${Header(state)}
    ${Nav(store.Links)}
    ${Main(state)}
    ${Footer()}
  `;

  router.updatePageLinks();
}

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

// document.addEventListener("DOMContentLoaded", function() {
//   console.log("DOM fully loaded and parsed");

//   var navbarToggler = document.querySelector(".navbar-toggler");
//   var navbarMenu = document.querySelector(".navbar-collapse");

//   console.log("Navbar Toggler:", navbarToggler); // Should log the navbar toggler element
//   console.log("Navbar Menu:", navbarMenu); // Should log the navbar menu element

//   if (navbarToggler) {
//     navbarToggler.addEventListener("click", function() {
//       console.log("Navbar toggler clicked"); // This should log when you click the toggler
//       navbarMenu.classList.toggle("active");
//     });
//   } else {
//     console.log("Navbar toggler not found");
//   }
// });
