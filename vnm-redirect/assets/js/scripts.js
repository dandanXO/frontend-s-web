const isWaitClick = "false";
const urlLists = ["https://p886866.com", "https://p886866.com"];
const randNum = Math.floor(Math.random() * 2) + 1;
var next = urlLists[randNum - 1];
var hostname = window.location.hostname;
console.log(hostname);
if (
  hostname.indexOf("ft609.cc") > -1 ||
  hostname.indexOf("ro396.cc") > -1 ||
  hostname.indexOf("pt505.cc") > -1 ||
  hostname.indexOf("ai007.cc") > -1 ||
  hostname.indexOf("qa289.cc") > -1
) {
  next = "https://vb88123.com/register";
}

let timeoutId;
if (isWaitClick === "false") {
  timeoutId = setTimeout(() => {
    window.location = next;
  }, 3000);
}
const existsContent = "An ninh trang web";

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
