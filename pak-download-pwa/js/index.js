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
const qrcode = new QRCode(qrcodeCanvas, window.location.href);
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
});
