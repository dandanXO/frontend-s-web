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

// function canInstallPWA() {
//   document.querySelectorAll(".modal-open .content-logo .logo-ios").forEach((el) => (el.style.display = "none"));
//   document.querySelectorAll(".modal-open .content-logo .logo-android").forEach((el) => (el.style.display = "block"));

//   const isSecureContext = window.isSecureContext; // Check if the page is served over HTTPS
//   const supportsServiceWorker = "serviceWorker" in navigator; // Check Service Worker support
//   const supportsManifest =
//     document.head.querySelector('link[rel="manifest"]') !== null ||
//     document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content === "yes"; // Check for manifest or iOS web app capability
//   const isIosSafari =
//     /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
//     /safari/.test(navigator.userAgent.toLowerCase()) &&
//     !/crios|fxios|chrome/.test(navigator.userAgent.toLowerCase()); // iOS Safari detection

//   // iOS Safari can install PWA without "BeforeInstallPromptEvent"
//   const supportsAddToHomeScreen = "BeforeInstallPromptEvent" in window || isIosSafari;

//   alert(`
//     isSecureContext: ${isSecureContext},
//     supportsServiceWorker: ${supportsServiceWorker},
//     supportsManifest: ${supportsManifest},
//     isIosSafari: ${isIosSafari},
//     supportsAddToHomeScreen: ${supportsAddToHomeScreen}
//     `);

//   if (isIosSafari) {
//     document.querySelectorAll(".modal-open .content-logo .logo-ios").forEach((el) => (el.style.display = "block"));
//     document.querySelectorAll(".modal-open .content-logo .logo-android").forEach((el) => (el.style.display = "none"));
//     document.querySelector(".modal-open .content-text").textContent =
//       "Please copy the following URL and paste it into Safari";
//   }

//   return isSecureContext && supportsServiceWorker && supportsManifest && supportsAddToHomeScreen;
// }

// Display logic
// function detectDeviceAndBrowser() {
//   if (canInstallPWA()) {
//     console.log("Device and browser support PWA installation.");
//   } else {
//     console.log("Device or browser does not support PWA installation.");
//     document.querySelectorAll(".modal-open").forEach((el) => (el.style.display = "block"));
//   }
// }

function isChromeInstalled() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/.test(userAgent);
  const isHuawei = /huawei/.test(userAgent);

  if (isAndroid && !isHuawei) {
    const chromeIntentUrl = `intent://#Intent;scheme=https;package=com.android.chrome;end`;

    // Attempt to open Chrome
    window.location.href = chromeIntentUrl;

    // Use a small timeout to determine if Chrome was launched
    return new Promise((resolve) => {
      setTimeout(() => {
        // If window has not redirected, assume Chrome is not installed
        resolve(!document.hidden);
      }, 500); // Timeout of 500ms
    });
  }

  return false;
}

function detectDeviceAndBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  // Device detection
  const isIphone = /iphone/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isHuawei = /huawei/.test(userAgent);
  const isPC = !isIphone && !isAndroid;

  // Browser detection
  const isSafari = /safari/.test(userAgent) && !/crios/.test(userAgent) && !/chrome/.test(userAgent);
  const isChrome =
    (/chrome/.test(userAgent) && !/edge|heytapbrowser|mibrowser/.test(userAgent)) || /crios/.test(userAgent);
  const isFirefox = /firefox/.test(userAgent);
  const isEdge = /edg/.test(userAgent);

  // alert(userAgent);

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

  document.querySelectorAll(".modal-open .content-logo .logo-ios").forEach((el) => (el.style.display = "none"));
  document.querySelectorAll(".modal-open .content-logo .logo-android").forEach((el) => (el.style.display = "block"));

  // check this device got installed chrome app or not
  if (isIphone && !isSafari) {
    console.log("User is on iPhone but not using Safari.");
    document.getElementById("id-open-btn").style.display = "none";
    document.querySelectorAll(".modal-open").forEach((el) => (el.style.display = "block"));
    document.querySelectorAll(".modal-open .content-logo .logo-ios").forEach((el) => (el.style.display = "block"));
    document.querySelectorAll(".modal-open .content-logo .logo-android").forEach((el) => (el.style.display = "none"));
    document.querySelector(".modal-open .content-text").textContent =
      "Please copy the following URL and paste it into Safari";
  } else if (isAndroid && (!isChrome || isUnsupportedBrowser)) {
    console.log("User is on Android but using an unsupported browser.");
    document.querySelectorAll(".modal-open").forEach((el) => (el.style.display = "block"));
  } else if (isPC && !isChrome && !isFirefox && !isEdge) {
    console.log("User is on PC but not using Chrome/Firefox/Edge.");
    document.querySelectorAll(".modal-open").forEach((el) => (el.style.display = "block"));
  } else if (isHuawei) {
    console.log("User is on Huawei.");
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

// Add button trigger to PWA supported browser
document.getElementById("id-open-btn").addEventListener("click", function () {
  var textURL = document.getElementById("id-url-input").textContent;
  openLinkInPreferredBrowser(
    textURL,
    "https://files.j9zwvu1ogrg.com/app/18/affiliate/1866429275899731969/android/apk/1.0.1_20241210184000.apk"
  );
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

// Function to openLink in Chrome / Safari
function openLinkInPreferredBrowser(url, newLink) {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  if (isIos) {
    // For iOS, open the link in Safari (default browser) // this will be now located in google chrome or firefox or ... just not in safari for here
    window.location.href = url;
  } else if (isAndroid) {
    // For Android, check if Chrome is installed using the intent:// scheme
    const chromeIntentUrl = `intent://${url.replace(
      /^https?:\/\//,
      ""
    )}#Intent;scheme=https;package=com.android.chrome;end`;

    const fallbackTimer = setTimeout(() => {
      // If Chrome is not installed, open the external link
      alert("No supported browser found. App downloaded in apk format");
      window.open(newLink, "_self");
    }, 1500);

    // Attempt to open in Chrome
    window.location.href = chromeIntentUrl;

    // Clear fallback if Chrome is detected
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(fallbackTimer);
      }
    });
  } else {
    // For other platforms, open the link in the default browser
    window.open(url, "_self");
  }
}
