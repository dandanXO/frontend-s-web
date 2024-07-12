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

const handleClick = () => {
  // show loading
  document.querySelector(".status .loader").style.display = "flex";
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  setTimeout(() => {
    window.location = next;
  }, 1000);
};
