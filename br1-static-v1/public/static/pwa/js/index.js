// import { getAdjustUrl } from "./adjust.js";
import { FBQ_INITIALIZED, fbqLists, INSTALLATION_STATUS_KEY, PWA_DATA_KEY } from "./const.js";
import { getRedirectInfo, redirectToGame } from "./redirect.js";

const INSTALL_COUNTDOWN = 5;
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
const qrcode = new QRCode(qrcodeCanvas, {
  text: window.location.href,
  width: 256,
  height: 256,
  correctLevel: QRCode.CorrectLevel.M, // Higher error correction
  version: 20 // Increase version (default is auto)
});
qrcode.makeCode(window.location.href);

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
    .join("&");
}

installBtn.addEventListener("click", async () => {
  if (loading.classList.contains("loading--show")) return;

  const getFclidFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("fclid") || null;
  };

  switch (container.getAttribute("data-type")) {
    case "INSTALL":
      const isFbqInitialized = sessionStorage.getItem(FBQ_INITIALIZED);
      if (isFbqInitialized) fbq("track", "SubmitApplication");

      // Get the current URL
      const urlParams = new URLSearchParams(window.location.search);
      const fbclid = urlParams.get("fbclid");
      const referral = urlParams.get("refer");
      const click_id = urlParams.get("click_id");
      // const referralSpin = urlParams.get("referSpin");
      // if (referralSpin) {
      //   localStorage.setItem("SPIN_REFERRAL_CODE", referralSpin);
      // }
      if (referral) {
        localStorage.setItem("PWA_REFERRAL_CODE", referral);
      }
      if (fbclid) {
        localStorage.setItem("fbclid", fbclid);
        localStorage.setItem("click_id", click_id);

        // Retrieve _fbp directly
        const getCookie = (name) => {
          const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
          return match ? decodeURIComponent(match[1]) : null;
        };

        // const fbp = getCookie("_fbp");
        // Extract the last portion of _fbp
        const fbp = (() => {
          const rawFbp = getCookie("_fbp");
          return rawFbp ? rawFbp.split(".").pop() : null;
        })();

        const fbc = fbclid;
        const siteCode = "BR1";

        // Create payload in form format
        const payload = new URLSearchParams({
          fbp: fbp || "",
          fbc: fbc || "",
          siteCode: siteCode
        });

        // Make the POST request
        fetch("https://ap1d5gcci.4kcjx19nzj8.com/app/facebookInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: payload.toString()
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      if (!deferredPrompt) {
        const userAgent = navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        if (isIos) {
          document.querySelectorAll(".ios-modal").forEach((el) => (el.style.display = "flex"));
        } else {
          window.open("https://bra.55ace.com/register", "_blank");
        }
      } else {
        const { outcome } = await deferredPrompt.prompt();
        if (outcome === "accepted") {
          // const redirectUrl = getAdjustUrl();

          // console.log("REd Url");
          // console.log(redirectUrl);

          // alert(redirectUrl);
          // const iframeTag = document.createElement("iframe");
          // iframeTag.classList.add("blank-iframe");
          // iframeTag.src = redirectUrl;
          // iframeTag.addEventListener(
          //   "load",
          //   () => {
          const redirectInfo = getRedirectInfo();
          localStorage.setItem(PWA_DATA_KEY, JSON.stringify(redirectInfo));
          localStorage.setItem(INSTALLATION_STATUS_KEY, "INSTALLING");
          container.setAttribute("data-type", "INSTALLING");
          iconLoading.classList.add("active");
          installationCountdown();
          handleInstallationProgress();
          console.log("user accepted");
          //   },
          //   { once: true }
          // );
          // iframeContainer.appendChild(iframeTag);
        }
      }
      break;
    case "PLAY":
      window.open(`/static/pwa/pwa-index.html`, "_blank");
      break;
  }
});

function isQRCodeScannerWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Detect known QR Scanner App patterns
  if (/QRScanner|QRCode|FreeScanner/i.test(ua)) {
    return true;
  }

  // Detect Generic WebView (iOS & Android)
  const isIOSWebView = /iPhone|iPod|iPad/i.test(ua) && !/Safari/i.test(ua);
  const isAndroidWebView = /Android/i.test(ua) && /Version\/\d+\.\d+/i.test(ua) && !/Chrome/i.test(ua);

  if (isIOSWebView || isAndroidWebView) {
    return true;
  }

  // Feature detection for blocked popups
  const testWindow = window.open("about:blank");
  if (!testWindow || testWindow.closed) {
    return true;
  }
  testWindow.close();

  return false;
}

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

function getDomainWithoutSubdomain() {
  let hostname = window.location.hostname;
  let parts = hostname.split(".");

  // 处理 localhost 和 IP
  if (parts.length <= 2 || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname === "localhost") {
    return hostname; // 直接返回 IP 或 localhost
  }

  return parts.slice(1).join("."); // 去掉第一个 subdomain
}

window.addEventListener("load", () => {
  const hostname = window.location.hostname.replace("www.", "");
  sessionStorage.setItem("IS_PWA", "1");

  const fbqId = fbqLists[hostname]?.id;
  if (fbqId) {
    fbq("init", fbqId);
    fbq("track", "PageView");
    sessionStorage.setItem(FBQ_INITIALIZED, "1");
  }

  if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
    const fbclid = localStorage.getItem("fbclid");
    const click_id = localStorage.getItem("click_id");
    redirectToGame(fbclid, click_id);
  }

  const installationStatus = localStorage.getItem(INSTALLATION_STATUS_KEY);
  if (installationStatus === "INSTALLING") {
  } else if (installationStatus) {
    container.setAttribute("data-type", installationStatus);
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);

  setTimeout(() => {
    if (deferredPrompt && installationStatus === "PLAY") {
      localStorage.removeItem(INSTALLATION_STATUS_KEY);
      container.setAttribute("data-type", "INSTALL");
    }
    loading.classList.remove("loading--show");

    if (isIos) {
      const currentDomain = window.location.origin;
      window.location.href = `${currentDomain}/home`;
      // window.location.href = `https://ind.55ace.com/home`;
    } else {
      // const isTest = window.location.hostname.includes("localhost") || window.location.hostname.includes("di1yf4");
      // if (isTest) {
      //   alert("IN WebView:" + isInWebView());
      //   alert("Is Support Pwa:" + supportsPWA());
      //   alert("Defer: " + deferredPrompt);
      // }
      // if (isInWebView() || !supportsPWA() || !deferredPrompt) {
      //   redirectToChromeIfUnsupported();
      // }
    }
  }, 2500);

  detectDeviceAndBrowser();
  countdown.innerHTML = `${INSTALL_COUNTDOWN}`;

  // const userAgent = navigator.userAgent.toLowerCase();
  // const isIos = /iphone|ipad|ipod/.test(userAgent);
  // if (isIos) {
  //   // document.querySelectorAll(".ios-modal").forEach((el) => (el.style.display = "flex"));
  //   const currentDomain = window.location.origin;
  //   // window.location.href = `${currentDomain}/home`;
  //   window.location.href = `https://ind.55ace.com/home`
  // }
});

/** browser detect **/
document.getElementById("id-url-input").textContent = window.location.href;
document.getElementById("id-url-install").textContent = window.location.origin;

function supportsPWA() {
  return (
    "serviceWorker" in navigator || window.matchMedia("(display-mode: standalone)").matches || "standalone" in navigator
  );
}

function isInWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Log User-Agent for debugging
  console.log("User-Agent:", ua);

  // Common WebView indicators
  const webViewPatterns = [
    /FBAN|FBAV|Instagram/i, // Facebook, Instagram
    /MicroMessenger/i, // WeChat
    /QQ\//i, // QQ
    /Line/i, // LINE
    /Weibo/i, // Weibo
    /AlipayClient/i, // Alipay
    /UBrowser|Quark|2345Explorer|baidubrowser/i, // Other Chinese browsers
    /QRScanner|QRCode|FreeScanner/i // Possible QR Code scanners
  ];

  // User-Agent matching
  if (webViewPatterns.some((pattern) => pattern.test(ua))) {
    return true;
  }

  // WebView environments often do not match "display-mode: browser"
  if (!window.matchMedia("(display-mode: browser)").matches) {
    return true;
  }

  // WebView may lack full navigator properties
  if (typeof navigator.standalone !== "undefined" && navigator.standalone === false) {
    return true;
  }

  // Try opening a new window (many WebViews block this)
  const testWindow = window.open("about:blank");
  if (!testWindow || testWindow.closed) {
    return true;
  }
  testWindow.close();

  return false;
}

function redirectToChromeIfUnsupported() {
  const url = window.location.href;

  // Android 使用 `intent://` 跳转到 Chrome
  if (/Android/i.test(navigator.userAgent)) {
    window.location.href = `intent://${url.replace(
      /^https?:\/\//,
      ""
    )}#Intent;scheme=https;package=com.android.chrome;end;`;
  }
  // iOS 提示用户手动打开
  else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // alert("请使用 Safari 浏览器打开，以获得更好的体验。");
    window.location.href = url; // 仍然跳转
  }
}

function isChromeInstalled() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/.test(userAgent);
  const isHuawei = /huawei/.test(userAgent);

  if (isAndroid && !isHuawei) {
    const chromeIntentUrl = `intent://#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = chromeIntentUrl;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(!document.hidden);
      }, 500);
    });
  }

  return false;
}

function detectDeviceAndBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIphone = /iphone/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isHuawei = /huawei/.test(userAgent);
  const isPC = !isIphone && !isAndroid;

  const isSafari = /safari/.test(userAgent) && !/crios/.test(userAgent) && !/chrome/.test(userAgent);
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
    /opr/
  ];
  const isUnsupportedBrowser =
    unsupportedBrowsers.some((regex) => regex.test(userAgent)) ||
    (/samsungbrowser/.test(userAgent) && !/samsungbrowser\/(6|7|8|9|10|11|12|13|14)/.test(userAgent));

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
  alert("URL copiada com sucesso");
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
  const redirectInfo = JSON.stringify(getRedirectInfo());
  const codeMatch = redirectInfo.match(/\/([^\/"]+)"\}$/);
  const affiliateCodePwa = codeMatch ? codeMatch[1] : null;
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
      window.open(
        `https://tc1ar.cc/?p0=${affiliateCodePwa}&p1={{campaign.name}}&p2={{campaign.id}}&p3={{adset.name}}&p4={{adset.id}}&p5={{ad.name}}&p6={{ad.id}}`,
        "_self"
      );
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
    window.open(
      `https://tc1ar.cc/?p0=${affiliateCodePwa}&p1={{campaign.name}}&p2={{campaign.id}}&p3={{adset.name}}&p4={{adset.id}}&p5={{ad.name}}&p6={{ad.id}}`,
      "_self"
    );
  } else {
    window.open(url, "_blank");
  }
}

insertRandomImages();

function insertRandomImages() {
  const defaultScrollList = document.querySelector("#scroll-lists");

  var imageUrls = [];
  var extraStyle = "";

  var fileCountLists = [5];
  // var fileNum = Math.floor(Math.random() * 5) + 1;
  var fileNum = 0;
  var fileDirec = "img" + fileNum;

  // var fileLength = fileCountLists[fileNum - 1];
  var fileLength = fileCountLists[fileNum];
  console.log(fileDirec);
  var fileArray = [];
  for (var i = 0; i < fileLength; i++) {
    fileArray.push(i + 1);
  }
  shuffleArray(fileArray);
  // console.log(fileArray);

  var fileLists = [];
  const numbers = new Set();
  while (fileLists.length < 5) {
    const random = Math.floor(Math.random() * fileLength) + 1;
    if (!numbers.has(random)) {
      numbers.add(random);
      fileLists.push(random);
    }
  }
  console.log(fileLists);

  fileLists.forEach((file) => {
    var fileName = `images/${fileDirec}/${file}.jpg`;
    imageUrls.push(fileName);
  });

  if (fileNum === 2 || fileNum === 4) {
    extraStyle = `style="height:300px;"`;
    defaultScrollList.style.height = "300px";
  } else {
    extraStyle = `style="width:65vw;max-width: 180px;"`;
    defaultScrollList.style.height = "auto";
  }

  imageUrls.forEach((imageUrl) => {
    var innerHtml = `
<div class="ULeU3b Utde2e" role="listitem">
                                        <div class="Atcj9b"><img src="${imageUrl}" class="T75of B5GQxf"
                                        ${extraStyle}
                                                                 alt="55Ace" loading="lazy"></div>
</div>
`;
    // Append the image to the container
    defaultScrollList.innerHTML += innerHtml;
  });

  defaultScrollList.style.display = "flex";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
