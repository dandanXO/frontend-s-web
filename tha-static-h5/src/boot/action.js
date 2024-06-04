import { Platform, useQuasar } from "quasar";

export function doIt(resp) {
  return new Promise((resolve) => {
    switch (resp.data.result.payResultType) {
      case "OFFLINE":
        break;
      case "IMAGE_BASE64":
      case "GENERATION_QR_CODE":
      case "RENDER_HTML":
        renderPage(resp.data.result);
        break;
      case "POST_SUBMIT":
        postSubmit(resp.data.result);
        break;
      case "GET_SUBMIT":
        locationUrl(resp.data.result);
        break;
    }
    resolve(resp);
  });
}

function locationUrl(resp) {
  if (Platform.is.ios && Platform.is.mobile && Platform.is.safari) {
    const newWin = window.open(`/`, `_self`);
    if (newWin) {
      newWin.location.href = resp.requestUrl;
    } else {
      const $q = useQuasar();
      $q.notify({
        color: "negative",
        position: "top",
        message:
          'ไม่สามารถเปิดหน้าเติมเงินได้ กรุณาตรวจสอบว่าเบราว์เซอร์บล็อกหน้าต่างป๊อปอัพหรือไม่ และแก้ไขเป็น "อนุญาตให้แสดงหน้าต่างป๊อปอัพ" ก่อนทำการเติมเงิน',
        icon: "report_problem"
      });
    }
  } else {
    location.href = resp.requestUrl;
  }
}

function postSubmit(resp) {
  if (resp.paramKey === null || resp.paramKey === "") {
    location.href = `/display?${resp.data}&payResultType=${resp.payResultType}&requestUrl=${resp.requestUrl}`;
  } else {
    location.href = `/display?paramKey=${resp.paramKey}&payResultType=${resp.payResultType}&requestUrl=${resp.requestUrl}`;
  }
}

function renderPage(resp) {
  if (resp.paramKey === null || resp.paramKey === "") {
    location.href = `/display?data=${resp.data}&payResultType=${resp.payResultType}`;
  } else {
    location.href = `/display?paramKey=${resp.paramKey}&payResultType=${resp.payResultType}`;
  }
}
