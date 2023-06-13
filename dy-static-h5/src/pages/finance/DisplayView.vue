<template>
  <div id="renderArea">
    <form ref="formRef" method="post" style="display: none"></form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { cashier } from "src/boot/axios";

const request = ref({});
const formRef = ref();
function getRequest(url) {
  if (!url) {
    url = window.location.search;
  }
  let theRequest = {};
  if (url.indexOf("?") != -1) {
    url = url.substr(1);
  }
  let strs = url.split("&");
  for (let i = 0; i < strs.length; i++) {
    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
  return theRequest;
}

function renderOrSubmit() {
  let type = request.value.payResultType;
  switch (type) {
    case "POST_SUBMIT":
      postSubmit();
      break;
    case "IMAGE_BASE64":
      break;
    case "GENERATION_QR_CODE":
      break;
    case "RENDER_HTML":
      renderHtml();
      break;
  }
}

function renderHtml() {
  document.write(request.value.data);
}

function postSubmit() {
  formRef.value.action = request.value.requestUrl;
  delete request.value.requestUrl;
  delete request.value.payResultType;
  delete request.value.paramKey;
  for (let x in request.value) {
    let p =
      "<input type='text' name='" + x + "' value='" + request.value[x] + "'/>";
    formRef.value.append(p);
  }
  formRef.value.submit();
}

onMounted(async () => {
  request.value = getRequest();
  if (request.value.paramKey) {
    const d = await cashier.get(`/param/key/${key}`, request.value.paramKey).then(() => {
      if (request.value.payResultType == "POST_SUBMIT") {
        request.value = Object.assign({}, getRequest(d.data), request.value);
      } else {
        request.value.data = d.data;
      }
    })
  }
  renderOrSubmit();
});
</script>
