
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
  location.href = resp.requestUrl;
}

function postSubmit(resp) {
  if (!resp.paramKey || resp.paramKey === null || resp.paramKey === "") {
    location.href = `display?${resp.data}&payResultType=${resp.payResultType}&requestUrl=${resp.requestUrl}`;
  } else {
    location.href = `display?paramKey=${resp.paramKey}&payResultType=${resp.payResultType}&requestUrl=${resp.requestUrl}`;
  }
}

function renderPage(resp) {
  if (!resp.paramKey || resp.paramKey === null || resp.paramKey === "") {
    location.href = `display?data=${resp.data}&payResultType=${resp.payResultType}`;
  } else {
    location.href = `display?paramKey=${resp.paramKey}&payResultType=${resp.payResultType}`;
  }
}
