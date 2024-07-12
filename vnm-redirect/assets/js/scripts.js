const isWaitClick = "false";
const urlLists = ["https://p886866.com", "https://p886866.com"];
const randNum = Math.floor(Math.random() * 2) + 1;
const next = urlLists[randNum - 1];
let timeoutId;
if (isWaitClick === "false") {
  timeoutId = setTimeout(() => {
    window.location = next;
  }, 3000);
}
const existsContent = "An ninh trang web";

var hostname = window.location.hostname;
console.log(hostname);
// var hostname= "ozqak6.me"
// debugger;
if (hostname.indexOf("ozqak6.me") > -1) {
  console.log("Track");
  LA.init({ id: "KUuHLNSqfmpgTSpF", ck: "KUuHLNSqfmpgTSpF" });
} else if (hostname.indexOf("w6krqopavplu.com") > -1) {
  console.log("Track 2");
  LA.init({ id: "KUuHT7D1qIZ0U9N0", ck: "KUuHT7D1qIZ0U9N0" });
}
