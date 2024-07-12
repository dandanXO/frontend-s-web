const contendI18nMap = {
  network: {
    zh: "安全检测完成，网路状况良好",
    vi: "Kiểm tra an toàn hoàn thành, Mạng ở trong tình trạng tốt",
    en: "Security check completed, Network in good condition"
  },
  security: {
    zh: "站点安全",
    vi: "Bảo mật trang web.",
    en: "Site security"
  },
  enter: {
    zh: "点击进入",
    vi: "Nhấp để truy cập",
    en: "Click to enter"
  },
  loading: {
    zh: "进行安全检测中",
    vi: "Đang kiểm tra an toàn",
    en: "Security check in progress"
  },
  footer: {
    zh: "安全软件提供技术支持",
    vi: "Security software provides technical support",
    en: "Security software provides technical support"
  }
};

let language = "zh";

const setContendI18n = () => {
  try {
    const lang = navigator.language.split("-")[0];
    if (contendI18nMap["network"][lang]) {
      language = lang;
    }

    if (document.getElementById("redirect-btn")) {
      document.getElementById("redirect-btn").innerHTML = contendI18nMap["enter"][language];
    }
    if (document.getElementById("contend")) {
      if (existsContent == contendI18nMap["network"][language]) {
        document.getElementById("contend").innerHTML = contendI18nMap["network"][language];
      } else {
        document.getElementById("contend").innerHTML = contendI18nMap["security"][language];
      }
    }

    document.getElementById("footer-text").innerHTML = contendI18nMap["footer"][language];
  } catch (error) {
    console.error(error);
  }
};

const setFooterYear = () => {
  const year = new Date().getFullYear();
  document.getElementById("footer-year").innerHTML = year;
};

const handleOnLoad = () => {
  setContendI18n();
  setFooterYear();
};

const handleClick = () => {
  // show loading
  document.querySelector(".status .text").innerHTML = contendI18nMap["loading"][language];
  document.querySelector(".status .loader").style.display = "flex";
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  setTimeout(() => {
    window.location = next;
  }, 1000);
};

window.addEventListener("load", handleOnLoad);
