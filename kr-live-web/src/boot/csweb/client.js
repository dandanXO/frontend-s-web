import * as $ from "jquery";
import each from "lodash/each";
import isString from "lodash/isString";
import isNaN from "lodash/isNaN";
import isNumber from "lodash/isNumber";
import "./cs-client.css";

var MESSAGEHISTORY = "MESSAGEHISTORY";
var NOTICEHISTORY = "NOTICEHISTORY";

var originUrl;

var parentUrl;
let prevUrl = undefined;
var url;

var way;
var lang;
var type;
var partnerId;
var partnerCode;
var userToken;

var btnId;

var winHeight;
var winWidth;

var winLeft;
var winRight;
var winTop;
var winBottom;

var getLeft;
var getRight;
var getTop;
var getBottom;

var getWidth;
var getHeight;
var getBorderRadius;

var borderRadius;

var openTabUrl = "/liveChat";

var initTimer;
var urlTimer;
var msgInterval;
var noticeInterval;

var isInited = false;
var isMinimized = false;

var startSize = "100px";

var initBtm;
var initLeft;

var IdMsgRemindDiv = "divChatCount1";
var isLogin = false;
var isBtnCount = true;
var isOpenAnimation = true;

var timeoutCloseTimer;
var timeoutTimer;

var notificationItem;
var msgBgColor = "orange";
var msgSpeed = 5000;
var msgType = "normal";
var msgBdSize = 1;

var designItem;
var iconBottom;
var iconRight;
var iconUrl;
var iconSize;

class CsClient {
  constructor(pId, wId, tLang, tType, mode = "prod", geturl = "") {
    // console.log("Cs Client Start Construct");
    // console.log("Current Time: " + moment().format("YYYY-MM-DD HH:mm:ss"));
    // console.log("Check ParseInt");
    // console.log(parseInt(pId));
    // console.log(wId);
    // console.log(tType);
    if (isNumber(pId) || !isNaN(parseInt(pId))) {
      partnerId = pId;
      partnerCode = "";
    } else {
      partnerCode = pId;
      partnerId = "";
    }

    way = wId;
    type = tType;
    lang = tLang;

    // console.log(window.innerHeight);

    if (mode == "dev") {
      originUrl = geturl !== "" ? geturl : "http://207.148.120.129:9003";
    } else if (mode == "local") {
      originUrl = "http://localhost:8080";
    } else if (mode == "test") {
      originUrl = geturl !== "" ? geturl : "http://192.168.1.203:8080";
    } else if (mode == "prod") {
      originUrl = geturl !== "" ? geturl : "https://csweb01.amv4xjcbd.com/";
    } else {
      originUrl = "https://csweb01.c8nhwrqx4.com/";
    }

    var checkLogin = window.localStorage.getItem("isLogin");
    if (checkLogin) {
      isLogin = true;
    }
  }

  set(key, value) {
    if (key == "btnid") {
      btnId = value;
    } else if (key == "left") {
      getLeft = value;
    } else if (key == "right") {
      getRight = value;
    } else if (key == "top") {
      getTop = value;
    } else if (key == "bottom") {
      getBottom = value;
    } else if (key == "width") {
      getWidth = value;
    } else if (key == "height") {
      getHeight = value;
    } else if (key == "radius") {
      getBorderRadius = value;
    } else if (key == "pageurl") {
      openTabUrl = value;
    } else if (key == "token") {
      userToken = value;
    } else if (key == "btncount") {
      isBtnCount = value == "0" ? false : true;
    } else if (key == "notification-type") {
      notificationItem = value;
      msgBgColor = notificationItem["color"] ? notificationItem["color"] : msgBgColor;
      msgSpeed = notificationItem["speed"] ? notificationItem["speed"] : msgSpeed;
      msgType = notificationItem["type"] ? notificationItem["type"] : msgType;
      msgBdSize = notificationItem["size"] ? notificationItem["size"] : msgBdSize;
    } else if (key == "openanimation") {
      isOpenAnimation = value;
    } else if (key == "design") {
      designItem = value;
      iconBottom = designItem["bottom"] ? designItem["bottom"] : "48px";
      iconRight = designItem["right"] ? designItem["right"] : "48px";
      iconUrl = designItem["icon"] ? designItem["icon"] : "http://npr101.com/sloth/quasar.png";
      iconSize = designItem["size"] ? designItem["size"] : "48px";
    }
  }

  //add Login.
  login(token) {
    // console.log("CALL LOGIN");
    userToken = token;

    var partnerText = "";
    if (partnerCode) {
      partnerText = `partnerCode=${partnerCode}`;
    } else {
      partnerText = `partnerId=${partnerId}`;
    }

    url = `${originUrl}?${partnerText}&way=${way}&lang=${lang}&type=${type}`;
    if (userToken) {
      url += `&token=${userToken}`;
    }
    // console.log("NEw Url");
    // console.log(url);

    const iframe = document.querySelector("iframe");
    iframe.src = url;

    // console.log("Create Iframe Check Created Timer.");
    initTimer = setInterval(() => {
      if ($("#iframeChatBox1").length) {
        // console.log("Call Child;")
        // console.log($('#iframeChatBox1')[0]);
        $("#iframeChatBox1")[0].contentWindow.postMessage("changeurl:" + parentUrl, "*");
      }
    }, 100);
  }

  init() {
    // alert("STart");
    setTimeout(() => {
      // console.log("Ok Start NOW");
      if (!btnId) {
        btnId = "csweb-btn-id";
      }
      // console.log("Btn ID:" + btnId);
      // console.log("Check Token: " + userToken);

      var partnerText = "";
      if (partnerCode) {
        partnerText = `partnerCode=${partnerCode}`;
      } else {
        partnerText = `partnerId=${partnerId}`;
      }

      url = `${originUrl}?${partnerText}&way=${way}&lang=${lang}&type=${type}`;
      if (userToken) {
        url += `&token=${userToken}`;
      }

      if (type == "1") {
        //Init By Btn.
        // $('.customer-content').click(initUrl);
        $("." + btnId).click(initUrlByBtn);

        initUrlByBtn();
      } else if (type == "2") {
        //Init By Tab.
        initUrlByTab(false);
      } else if (type == "3") {
        //Open at Btm Right side.
        $("." + btnId).click(initUrlRightBtm);

        initUrlRightBtm();
      } else if (type == "4") {
        //OPen In New WIndow
        $("." + btnId).click(initUrlByNew);
      } else {
        //ELSE: OPen In New WIndow
        $("." + btnId).click(initUrlByNew);
      }
      addRouteCheckEvent();
    }, 100);
  }

  receiveListener(type, fn) {
    msgInterval = setInterval(() => {
      var msg_item = window.localStorage.getItem(MESSAGEHISTORY);
      if (msg_item && type === "message") {
        fn(msg_item);
        window.localStorage.removeItem(MESSAGEHISTORY);
      }
    }, 750);

    noticeInterval = setInterval(() => {
      var notice = window.localStorage.getItem(NOTICEHISTORY);
      // console.log(msg_item);
      if (notice && type === "notice") {
        fn(true);
        window.localStorage.removeItem(NOTICEHISTORY);
      }
    }, 750);
  }

  get minimized() {
    return isMinimized;
  }

  onDestroy() {
    // console.log("on Destroy");
  }
}

function checkLoginStatus() {}

// Type 1.
function initUrlByBtn() {
  // console.log("Start Init Type 1");
  getLayerValue();

  // console.log(getBottom);

  initBtm = "15px";
  initLeft = "50px";

  initWinValue();

  // console.log(parentUrl);

  if ($("#iframeChatBox1").length) {
    // console.log("CHECK");
    // console.log($('#iframeChatBox1:visible').length);
    // console.log(winHeight);

    if ($("#iframeChatBox1:visible").length == 0) {
      $("#iframeChatBox1").show();
      $("#iframeChatBox1").animate({
        height: winHeight
      });
      setTimeout(() => {
        const iframe = document.querySelector("iframe");
        iframe.contentWindow.postMessage("openwindow", "*");

        // iframe.contentWindow.postMessage("parenturl", "*", parentUrl);
        isMinimized = false;
        $("#iframeChatBox1").css("height", winHeight);
      }, 600);

      if ($("#" + IdMsgRemindDiv).length) {
        $("#" + IdMsgRemindDiv).remove();
      }
    } else {
      $("#iframeChatBox1").animate({
        height: "0px"
      });
      setTimeout(() => {
        $("#iframeChatBox1").hide();
        isMinimized = true;
      }, 500);
    }
  } else {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    iframe.id = "iframeChatBox1";
    iframe.style.height = winHeight;
    iframe.style.width = winWidth;
    iframe.style.position = "fixed";
    iframe.style.bottom = winBottom;
    iframe.style.left = winLeft;
    iframe.style.right = winRight;
    iframe.style.top = winTop;
    iframe.style.zIndex = "999999";
    iframe.style.borderRadius = borderRadius;
    iframe.style.transformOrigin = "center bottom";
    iframe.style.maxHeight = "100%";
    iframe.style.transition =
      "height 0s ease 0s, transform 0.7s cubic-bezier(0.76, 0, 0.16, 1) 0s, opacity 0.35s cubic-bezier(0.76, 0, 0.16, 1) 0.125s";
    iframe.style.transform = "scale(1) translateY(0px)";
    iframe.style.borderWidth = "0px";
    iframe.style.backgroundColor = "#fff";

    // console.log(lang);
    document.body.appendChild(iframe);

    if (isInited) {
      setTimeout(() => {
        isMinimized = false;
        $("#iframeChatBox1").fadeIn(250);
      }, 100);
    } else {
      // alert("HEE");
      // console.log("INit")
      isInited = true;
      isMinimized = true;
    }

    createMessageListener(iframe);
  }
}

//Type 2.
function initUrlByTab(isUrl = false) {
  // console.log("Start Type 2");

  getLayerValue();

  initBtm = getBottom ? getBottom : "60px";
  initLeft = "50%";

  initWinValue();

  // console.log(url);
  // console.log(winHeight);

  if ($("#iframeChatBox1").length) {
    // console.log("Got IframeChatBox1")

    if ($("#iframeChatBox1:visible").length === 0) {
      if (isOpenAnimation) {
        timeoutTimer = 600;
        $("#iframeChatBox1").show();
        $("#iframeChatBox1").animate({
          height: winHeight
        });
      } else {
        timeoutTimer = 100;
      }

      setTimeout(() => {
        const iframe = document.querySelector("iframe");
        iframe.contentWindow.postMessage("openwindow", "*");
        isMinimized = false;

        $("#iframeChatBox1").css("display", "initial");
        $("#iframeChatBox1").css("height", winHeight);
      }, timeoutTimer);

      if ($("#" + IdMsgRemindDiv).length) {
        $("#" + IdMsgRemindDiv).remove();
      }
    } else {
      if (isOpenAnimation) {
        timeoutCloseTimer = 500;

        $("#iframeChatBox1").css({ top: "auto" });
        $("#iframeChatBox1").animate({
          height: "0px"
        });
      } else {
        timeoutCloseTimer = 100;
      }

      setTimeout(() => {
        $("#iframeChatBox1").hide();
        isMinimized = true;
      }, timeoutCloseTimer);
    }
  } else {
    // console.log("Generate Iframe");

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    iframe.id = "iframeChatBox1";
    iframe.style.height = winHeight;
    iframe.style.width = winWidth;
    iframe.style.maxWidth = "500px";
    iframe.style.position = "fixed";
    iframe.style.bottom = winBottom;
    iframe.style.left = winLeft;
    iframe.style.zIndex = "999999";
    // iframe.style.borderRadius = "20px";
    iframe.style.transformOrigin = "center bottom";
    iframe.style.maxHeight = "100%";
    iframe.style.transition =
      "height 0s ease 0s, transform 0.7s cubic-bezier(0.76, 0, 0.16, 1) 0s, opacity 0.35s cubic-bezier(0.76, 0, 0.16, 1) 0.125s";
    iframe.style.transform = "scale(1) translateY(0px) translateX(-50%)";
    iframe.style.borderWidth = "0px";
    iframe.style.backgroundColor = "#fff";

    // console.log(lang);

    iframe.style.position = "absolute";
    iframe.style.right = "0px";
    iframe.style.top = "0px";

    if (isUrl) {
      setTimeout(() => {
        document.body.append(iframe);
        isInited = true;
        initUrlByTab();
      }, 300);
    }

    createMessageListener(iframe);
  }
}

//Type 3.
function initUrlRightBtm() {
  // console.log("Start Init Type 3 Right Bottom");

  if (way == "WEB") {
    winHeight = "600px";
    winWidth = "550px";

    winBottom = "15px";
    winRight = "160px";
  } else {
    winHeight = "100%";
    winWidth = "100%";

    winBottom = "0px";
    winRight = "0px";
  }

  // console.log(url);

  if ($("#iframeChatBox1").length) {
    if ($("#iframeChatBox1:visible").length == 0) {
      $("#iframeChatBox1").show();
      $("#iframeChatBox1").animate({
        height: winHeight
      });
      setTimeout(() => {
        const iframe = document.querySelector("iframe");
        iframe.contentWindow.postMessage("openwindow", "*");

        // iframe.contentWindow.postMessage("parenturl", "*", parentUrl);
        isMinimized = false;
      }, 600);

      if ($("#" + IdMsgRemindDiv).length) {
        $("#" + IdMsgRemindDiv).remove();
      }

      if (type == "3" && $("." + btnId).length) {
        $("." + btnId).fadeOut();
      }
    } else {
      $("#iframeChatBox1").animate({
        height: "0px"
      });
      setTimeout(() => {
        $("#iframeChatBox1").hide();
        isMinimized = true;
      }, 500);
      if (type == "3") {
        $("." + btnId).fadeIn(600);
      }
    }
  } else {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    iframe.id = "iframeChatBox1";
    iframe.style.height = winHeight;
    iframe.style.width = winWidth;
    iframe.style.position = "fixed";

    iframe.style.bottom = winBottom;
    iframe.style.right = winRight;

    iframe.style.zIndex = "999999";
    iframe.style.borderRadius = "20px";
    iframe.style.transformOrigin = "center bottom";
    iframe.style.maxHeight = "100%";
    iframe.style.transition =
      "height 0s ease 0s, transform 0.7s cubic-bezier(0.76, 0, 0.16, 1) 0s, opacity 0.35s cubic-bezier(0.76, 0, 0.16, 1) 0.125s";
    iframe.style.transform = "scale(1) translateY(0px)";
    iframe.style.borderWidth = "0px";
    iframe.style.backgroundColor = "#fff";

    // console.log(lang);
    document.body.appendChild(iframe);

    //Add A Button At RightBtm.
    const triggerBtn = document.createElement("div");
    triggerBtn.classList.add(btnId);
    triggerBtn.classList.add("csweb-btn");
    triggerBtn.style.display = "flex";
    triggerBtn.style.alignItems = "center";
    triggerBtn.style.justifyContent = "center";
    triggerBtn.style.width = "64px";
    triggerBtn.style.height = "64px";
    triggerBtn.style.backgroundColor = "#fff";
    triggerBtn.style.borderRadius = "50%";
    triggerBtn.style.zIndex = "9999";
    triggerBtn.style.borderWidth = "1px";
    triggerBtn.style.borderStyle = "solid";
    triggerBtn.style.borderColor = "#666";
    triggerBtn.style.position = "fixed";
    triggerBtn.style.right = iconRight;
    triggerBtn.style.textAlign = "center";
    triggerBtn.style.bottom = iconBottom;
    triggerBtn.style.cursor = "pointer";

    const triggerImg = document.createElement("img");
    triggerImg.style.width = iconSize;
    triggerImg.style.height = iconSize;
    triggerImg.src = iconUrl;

    triggerBtn.appendChild(triggerImg);

    document.body.appendChild(triggerBtn);
    triggerBtn.addEventListener("click", initUrlRightBtm);

    // $(document).on(".csweb-btn", "mouseenter",  initUrlRightBtm());

    if (isInited) {
      setTimeout(() => {
        isMinimized = false;
        $("#iframeChatBox1").fadeIn(250);
      }, 100);
    } else {
      // alert("HEE");
      // console.log("INit")
      isInited = true;
      isMinimized = true;
    }

    //
    createMessageListener(iframe);
  }
}

//Type 4.
function initUrlByNew() {
  // console.log("4 Start Init New Url");

  var win = window.open(
    url,
    "newWindow",
    "height=723px, width=625px,menubar=no,directories=no,resizable=no,toolbar=no," +
      "titlebar=no,status=no,scrollbars=no"
  );
  win.moveTo(350, 15);
}

//Create a Listener For Child Iframe Listen.
function createMessageListener(iframe) {
  window.addEventListener("message", function (event) {
    // console.log("Message received from the child: " + event.data + " -> " + isMinimized); // Message received from child

    if (event.data == "receiveurl") {
      // console.log("RECEIVE PARENT URL");
      clearInterval(initTimer);
      checkLoginStatus();
    }

    if (event.data == "minimize") {
      $("#iframeChatBox1").css({ top: "auto" });
      $("#iframeChatBox1").animate({
        height: "0px"
      });
      setTimeout(() => {
        $("#iframeChatBox1").hide();
        isMinimized = true;
      }, 500);
      if (type == "3") {
        $("." + btnId).fadeIn(600);
      }
      $("." + btnId).css("background-color", "");
    }

    if (event.data == "loadnewfinish") {
      // console.log("Send Start New Parent Url");
      $("#iframeChatBox1")[0].contentWindow.postMessage("updateurl:" + parentUrl, "*");
    }

    if (!isMinimized) {
      if (event.data == "startnew") {
        iframe.style.height = startSize;
        iframe.style.width = startSize;
        iframe.style.backgroundColor = "#fff";
      } else if (event.data == "loadedfinish") {
        iframe.style.height = winHeight;
        iframe.style.width = winWidth;
        iframe.style.backgroundColor = "#fff";
      }
    } else {
      if (isString(event.data) && event.data.indexOf("receivemsg") === 0) {
        // var current_color = $("#csweb-btn-id").css("background-color");

        // console.log(event.data);
        if (event.data != "receivemsg:notice") {
          var msg_item = event.data.replaceAll("receivemsg:", "");
          window.localStorage.setItem(MESSAGEHISTORY, msg_item);
        } else {
          window.localStorage.setItem(NOTICEHISTORY, "1");
        }

        if (msgType == "normal") {
          $("." + btnId).css("background-color", msgBgColor);
          $("." + btnId).click(function (e) {
            $("." + btnId).css("background-color", "");
          });
        } else if (msgType == "border") {
          $("." + btnId).css("border-style", "solid");
          $("." + btnId).css("border-color", msgBgColor);
          $("." + btnId).css("border-width", msgBdSize + "px");
          $("." + btnId).click(function (e) {
            $("." + btnId).css("border-style", "");
            $("." + btnId).css("border-color", "");
            $("." + btnId).css("border-width", 0);
          });
        } else if (msgType == "breathing") {
          var secondSpeed = msgSpeed / 2000;
          var rgbaColor = hexToRgb(msgBgColor);
          // console.log(rgbaColor);

          var msgCssStyle = document.createElement("style");
          msgCssStyle.type = "text/css";
          var keyFrames = `
@keyframes breathing-color {
    from
    {
        background-color: ${msgBgColor};
    }
    to
    {
        background-color: rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, 20%);
    }
}
                    `;

          msgCssStyle.innerHTML = keyFrames;
          document.getElementsByTagName("head")[0].appendChild(msgCssStyle);

          $("." + btnId).css("animation", secondSpeed + "s infinite alternate ease-out breathing-color");
          $("." + btnId).click(function (e) {
            $("." + btnId).css("animation", "");
          });
        } else if (msgType == "none") {
        }

        if (type != "2" && isBtnCount == true) {
          if ($("#" + IdMsgRemindDiv).length) {
            var currentCount = $("#" + IdMsgRemindDiv).text();
            $("#" + IdMsgRemindDiv).text(parseInt(currentCount) + 1);
          } else {
            const countDiv = document.createElement("div");

            countDiv.id = IdMsgRemindDiv;
            countDiv.style.height = "20px";
            countDiv.style.width = "20px";
            countDiv.style.position = "absolute";
            if (type == "1") {
              countDiv.style.top = "-8px";
              countDiv.style.right = "-8px";
            } else {
              countDiv.style.top = "-4px";
              countDiv.style.right = "-4px";
            }

            countDiv.style.zIndex = "999999";
            countDiv.style.borderRadius = "50%";
            countDiv.style.backgroundColor = "#ff0000";
            countDiv.style.textAlign = "center";
            countDiv.style.color = "#fff";
            countDiv.style.lineHeight = "20px";
            countDiv.innerHTML = "1";

            // $("#" + btnId).parent().css("position", "relative");

            if (type == "1") {
              $("." + btnId)
                .parent()
                .append(countDiv);
            } else {
              $("." + btnId).append(countDiv);
            }
          }
        }
      }
    }
  });

  window.addEventListener("resize", function (event) {
    if (type == "2" && $("#iframeChatBox1").length) {
      winHeight = (window.innerHeight - pxToInt(winBottom)).toString() + "px";
      winWidth = "100%";

      $("#iframeChatBox1").css("height", winHeight);
      $("#iframeChatBox1").css("width", winWidth);
    }
  });
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function addRouteCheckEvent() {
  urlTimer = setInterval(() => {
    var currUrl = window.location.href;
    if ((way == "H5" || way == "ANDROID" || way == "IOS") && currUrl.indexOf("http://localhost/") > -1) {
      currUrl = currUrl.replace("http://localhost/", "app://");
    }
    if (currUrl != prevUrl) {
      // URL changed
      prevUrl = currUrl;
      parentUrl = currUrl;
      // console.log(`Timer Detect Url : ${parentUrl}`);

      if (type == "2" && parentUrl.indexOf(openTabUrl) > -1) {
        // console.log("Imn Live Chat.");
        initUrlByTab(true);
      } else {
        isMinimized = true;
        isInited = false;

        if (type == "2") {
          if (isOpenAnimation) {
            timeoutCloseTimer = 500;
            $("#iframeChatBox1").css({ top: "auto" });
            $("#iframeChatBox1").animate({
              height: "0px"
            });
          } else {
            timeoutCloseTimer = 0;
          }

          setTimeout(() => {
            $("#iframeChatBox1").hide();
            isMinimized = true;
          }, timeoutCloseTimer);
        }
      }

      if ($("#iframeChatBox1").length) {
        $("#iframeChatBox1")[0].contentWindow.postMessage("updateurl:" + parentUrl, "*");
      }
    }
  }, 750);

  // console.log("Create Iframe Check Created Timer.");
  initTimer = setInterval(() => {
    if ($("#iframeChatBox1").length) {
      // console.log("Call Child;")
      // console.log($('#iframeChatBox1')[0]);
      $("#iframeChatBox1")[0].contentWindow.postMessage("changeurl:" + parentUrl, "*");
    }
  }, 100);
}

function intToPx(val) {
  if (val != "" && val.toString().indexOf("%") === -1 && val.toString().indexOf("px") === -1) {
    val = val.toString() + "px";
  }
  return val;
}

function pxToInt(val) {
  val.replaceAll("px", "");
  return parseInt(val);
}

function getLayerValue() {
  each(window.dataLayer, function (data, index) {
    if (data.length == 2 && data[0] == "bottom") {
      getBottom = data[1];
    }
    if (data.length == 2 && data[0] == "top") {
      getTop = data[1];
    }
    if (data.length == 2 && data[0] == "left") {
      getLeft = data[1];
    }
    if (data.length == 2 && data[0] == "right") {
      getRight = data[1];
    }
    if (data.length == 2 && data[0] == "width") {
      getWidth = data[1];
    }
    if (data.length == 2 && data[0] == "height") {
      getHeight = data[1];
    }
    if (data.length == 2 && data[0] == "radius") {
      getBorderRadius = data[1];
    }
    if (data.length == 2 && data[0] == "chaturl") {
      openTabUrl = data[1];
    }
    if (data.length == 2 && data[0] == "btncount") {
      isBtnCount = data[1] == "0" ? false : true;
    }
  });
}

function initWinValue() {
  //Initial Value.
  if (way == "WEB") {
    winBottom = `${initBtm}`;
    winLeft = `${initLeft}`;
    winRight = "";
    winTop = "";

    winHeight = "600px";
    winWidth = "550px";

    borderRadius = "20px";
  } else {
    winBottom = `${initBtm}`;
    winLeft = "0px";
    winRight = "";
    winTop = "";

    winHeight = (window.innerHeight - pxToInt(winBottom)).toString() + "px";
    winWidth = "100%";

    borderRadius = "0px";

    if (type == "2") {
      winLeft = `${initLeft}`;
    }
  }

  //If Got Value, Change This.
  if (getBottom) {
    winBottom = intToPx(getBottom);
  }
  if (getTop) {
    winTop = intToPx(getTop);
  }
  if (getLeft) {
    winLeft = intToPx(getLeft);
    if (!getRight) {
      winRight = "";
    }
  }
  if (getRight) {
    winRight = intToPx(getRight);
    if (!getLeft) {
      winLeft = "";
    }
  }
  if (getWidth) {
    winWidth = intToPx(getWidth);
  }
  if (getHeight) {
    winHeight = intToPx(getHeight);
  }
  if (getBorderRadius) {
    borderRadius = intToPx(getBorderRadius);
  }
}

export default CsClient;
