import { redirectToGame } from "./redirect.js";

if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
  const fbclid = localStorage.getItem("fbclid");
  redirectToGame(fbclid);
} else {
  window.location.replace(`${window.location.origin}/register`)
}
