import { redirectToGame } from "./redirect.js";

if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
  redirectToGame();
} else {
  window.location.replace("/index.html");
}
