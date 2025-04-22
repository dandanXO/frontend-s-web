import { redirectToGame, getRedirectInfo } from "./redirect.js";

if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
  const fbclid = localStorage.getItem("fbclid");
  redirectToGame(fbclid);
} else {
  const redirectInfo = getRedirectInfo();
  window.location.replace(redirectInfo.url);
}
