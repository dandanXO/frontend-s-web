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

const qrcodeCanvas = document.getElementById("qrcode");
const qrcode = new QRCode(qrcodeCanvas, {
  text: window.location.href,
  width: 256,
  height: 256,
  correctLevel: QRCode.CorrectLevel.M, // Higher error correction
  version: 20 // Increase version (default is auto)
});
qrcode.makeCode(window.location.href);

installBtn.addEventListener("click", async () => {
  if (loading.classList.contains("loading--show")) return;
  switch (container.getAttribute("data-type")) {
    case "INSTALL":
      if (!deferredPrompt) {
        window.open("https://b9game0.com/register", "_blank");
      } else {
        const { outcome } = await deferredPrompt.prompt();
        if (outcome === "accepted") {
          const redirectInfo = getRedirectInfo();
          localStorage.setItem(PWA_DATA_KEY, JSON.stringify(redirectInfo));
          localStorage.setItem(INSTALLATION_STATUS_KEY, "INSTALLING");
          container.setAttribute("data-type", "INSTALLING");
          iconLoading.classList.add("active");
          installationCountdown();
          handleInstallationProgress();
          console.log("user accepted");
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
    }, (1000 * INSTALL_COUNTDOWN) / 100);
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
  countdown.innerHTML = `${INSTALL_COUNTDOWN}`;
});

/** browser detect **/
document.getElementById("id-url-input").textContent = window.location.href;
document.getElementById("id-url-install").textContent = window.location.origin;

function detectDeviceAndBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  alert(navigator.userAgent.toLowerCase());
  const isIphone = /iphone/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isHuawei = /huawei/.test(userAgent);
  const isPC = !isIphone && !isAndroid;

  const isSafari =
    /safari/.test(userAgent) && !/crios/.test(userAgent) && !/chrome/.test(userAgent) & !/webview/.test(userAgent);
  const isChrome =
    (/chrome/.test(userAgent) && !/edge|heytapbrowser|mibrowser/.test(userAgent)) || /crios/.test(userAgent);
  const isFirefox = /firefox/.test(userAgent);
  const isEdge = /edg/.test(userAgent);
  const isHeytap = /heytapbrowser/.test(userAgent);
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
    /silk/,
    /opr/,
    /wv/
  ];
  const isUnsupportedBrowser =
    unsupportedBrowsers.some((regex) => regex.test(userAgent)) ||
    (/samsungbrowser/.test(userAgent) && !/samsungbrowser\/(6|7|8|9|10|11|12|13|14)/.test(userAgent)) ||
    (isAndroid && /safari/.test(userAgent));

  document.querySelectorAll(".modal-open .content-logo .logo-ios").forEach((el) => (el.style.display = "none"));
  document.querySelectorAll(".modal-open .content-logo .logo-android").forEach((el) => (el.style.display = "block"));
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
    if (isHeytap) {
      document.getElementById("id-open-btn").style.display = "none";
    }
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

document.getElementById("id-copy-btn").addEventListener("click", function () {
  var textToCopy = document.getElementById("id-url-input").textContent;
  copyTextToClipboard(textToCopy);
  alert("URL copied successfully");
});

document.getElementById("id-open-btn").addEventListener("click", function () {
  var textURL = document.getElementById("id-url-input").textContent;
  openLinkInPreferredBrowser(textURL);
});

document.getElementById("id-ios-close").addEventListener("click", function () {
  document.querySelectorAll(".ios-modal").forEach((el) => (el.style.display = "none"));
});

function copyTextToClipboard(text) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function openLinkInPreferredBrowser(url) {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isHuawei = /huawei/.test(userAgent);

  // const affiliateCodePwa = "6805B0";
  const { url: redirectUrl } = getRedirectInfo();
  // console.log(affiliateCodePwa);

  if (isIos) {
    window.location.href = url;
  } else if (isAndroid && !isHuawei) {
    const chromeIntentUrl = `intent://${url.replace(
      /^https?:\/\//,
      ""
    )}#Intent;scheme=https;package=com.android.chrome;end`;

    const fallbackTimer = setTimeout(() => {
      // alert("Nenhum navegador suportado encontrado. O aplicativo será baixado em formato apk");
      // window.open(newLink, "_self");
      window.open(redirectUrl, "_self");
    }, 1500);

    window.location.href = chromeIntentUrl;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(fallbackTimer);
      }
    });
  } else if (isHuawei) {
    // alert("Nenhum navegador suportado encontrado. O aplicativo será baixado em formato apk");
    // window.open(newLink, "_self");
    window.open(redirectUrl, "_self");
  } else {
    window.open(url, "_blank");
  }
}
