import { getAdjustUrl } from "./adjust.js";
import { INSTALLATION_STATUS_KEY, PWA_DATA_KEY } from "./const.js";
import { getRedirectInfo, redirectToGame } from "./redirect.js";

const INSTALL_COUNTDOWN = 10;
let currentInstallCountdown = INSTALL_COUNTDOWN;
let installationProgressNumber = 0;
let deferredPrompt;

const header = document.getElementById("header");
const container = document.getElementById("container");
const countdown = document.getElementById("countdown");
const installBtn = document.getElementById("install-btn");
const iconLoading = document.getElementById("iconLoading");
const installationProgress = document.getElementById("installProgress");
const loading = document.getElementById("loading");
const iframeContainer = document.getElementById("iframe-container");

const qrcodeCanvas = document.getElementById("qrcode");
const qrcode = new QRCode(qrcodeCanvas, window.location.href);
qrcode.makeCode(window.location.href);

installBtn.addEventListener("click", async () => {
  if (loading.classList.contains("loading--show")) return;
  switch (container.getAttribute("data-type")) {
    case "INSTALL":
      if (!deferredPrompt) {
        window.open("https://bra.55ace.com/register", "_blank");
      } else {
        const { outcome } = await deferredPrompt.prompt();
        if (outcome === "accepted") {
          const redirectUrl = getAdjustUrl();

          // alert(redirectUrl);
          const iframeTag = document.createElement("iframe");
          iframeTag.classList.add("blank-iframe");
          iframeTag.src = redirectUrl;
          iframeTag.addEventListener(
            "load",
            () => {
              const redirectInfo = getRedirectInfo();
              localStorage.setItem(PWA_DATA_KEY, JSON.stringify(redirectInfo));
              localStorage.setItem(INSTALLATION_STATUS_KEY, "INSTALLING");
              container.setAttribute("data-type", "INSTALLING");
              iconLoading.classList.add("active");
              installationCountdown();
              handleInstallationProgress();
              console.log("user accepted");
            },
            { once: true }
          );
          iframeContainer.appendChild(iframeTag);
        }
      }
      break;
    case "PLAY":
      window.open("/pwa-index.html", "_blank");
      break;
  }
});

function handleInstallationProgress() {
  if (installationProgressNumber < 100) {
    installationProgressNumber++;
    if (installationProgressNumber > 100) installationProgressNumber = 100;
    installationProgress.innerText = `${installationProgressNumber}%`;
    setTimeout(() => {
      requestAnimationFrame(handleInstallationProgress);
    }, 100);
  }
  installationProgress;
}

function installationCountdown() {
  setTimeout(() => {
    console.log(currentInstallCountdown);
    if (currentInstallCountdown--) {
      countdown.innerHTML = `${currentInstallCountdown}`;
      installationCountdown();
    } else {
      container.setAttribute("data-type", "PLAY");
      iconLoading.classList.remove("active");
      localStorage.setItem(INSTALLATION_STATUS_KEY, "PLAY");
      currentInstallCountdown = INSTALL_COUNTDOWN;
    }
  }, 1000);
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener("load", () => {
  if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
    redirectToGame();
  }

  const installationStatus = localStorage.getItem(INSTALLATION_STATUS_KEY);
  if (installationStatus === "INSTALLING") {
  } else if (installationStatus) {
    container.setAttribute("data-type", installationStatus);
  }

  setTimeout(() => {
    if (deferredPrompt && installationStatus === "PLAY") {
      localStorage.removeItem(INSTALLATION_STATUS_KEY);
      container.setAttribute("data-type", "INSTALL");
    }
    loading.classList.remove("loading--show");
  }, 3000);

  detectDeviceAndBrowser();
});

/** browser detect **/
document.getElementById("id-url-input").textContent = window.location.href;

function detectDeviceAndBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  // Device detection
  const isIphone = /iphone/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isPC = !isIphone && !isAndroid;

  // Browser detection
  const isSafari = /safari/.test(userAgent) && !/crios/.test(userAgent) && !/chrome/.test(userAgent);
  const isChrome =
    (/chrome/.test(userAgent) && !/edge|heytapbrowser|mibrowser/.test(userAgent)) || /crios/.test(userAgent);
  const isFirefox = /firefox/.test(userAgent);
  const isEdge = /edg/.test(userAgent);

  // Unsupported browsers
  const unsupportedBrowsers = [
    /heytapbrowser/,
    /mibrowser/,
    /vivobrowser/,
    /miuibrowser/,
    /ucbrowser/,
    /qqbrowser/,
    /baidubrowser/,
    /opera mini/,
    /msie|trident/,
    /silk/
  ];
  const isUnsupportedBrowser =
    unsupportedBrowsers.some((regex) => regex.test(userAgent)) ||
    (/samsungbrowser/.test(userAgent) && !/samsungbrowser\/(6|7|8|9|10|11|12|13|14)/.test(userAgent));

  if (isIphone && !isSafari) {
    console.log("User is on iPhone but not using Safari.");
    document.querySelectorAll(".modal-open").forEach((el) => (el.style.display = "block"));
    document.querySelector(".modal-header span").textContent = "Please copy the following URL and paste it into Safari";
  } else if (isAndroid && (!isChrome || isUnsupportedBrowser)) {
    console.log("User is on Android but using an unsupported browser.");
    document.querySelectorAll(".modal-open").forEach((el) => (el.style.display = "block"));
  } else if (isPC && !isChrome && !isFirefox && !isEdge) {
    console.log("User is on PC but not using Chrome/Firefox/Edge.");
    document.querySelectorAll(".modal-open").forEach((el) => (el.style.display = "block"));
  } else {
    console.log("No conditions met for displaying the modal.");
  }
}

// Add click event listener to the element with id "id-copy-btn"
document.getElementById("id-copy-btn").addEventListener("click", function () {
  var textToCopy = document.getElementById("id-url-input").textContent;
  copyTextToClipboard(textToCopy);
  alert("URL copied successfully");
});

// Function to copy text to clipboard
function copyTextToClipboard(text) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
