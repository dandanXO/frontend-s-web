import { redirectToGame } from "./redirect.js";

if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
  const fbclid = localStorage.getItem("fbclid");
  const click_id = localStorage.getItem("click_id");
  redirectToGame(fbclid, click_id);
} else {
  window.location.replace(`${window.location.origin}/register`);
}
