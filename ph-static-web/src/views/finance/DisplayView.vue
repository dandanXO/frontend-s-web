<template>
  <div class="menu-title-container">
    <span class="menu-title">Bank Infomation</span>
  </div>
  <div v-if="submitMessage" class="submit-message">
    <div class="line"><span class="bankname">{{ submitMessage[0] }}</span></div>
    <div class="line" @click="copyCode(copyText1)"><span>Bank Account Number </span><span ref="copyText1">{{ submitMessage[1] }}<RiFileCopyLine /></span></div>
    <div class="line" @click="copyCode(copyText2)"><span>Bank Card Number </span><span ref="copyText2">{{ submitMessage[2] }}<RiFileCopyLine /></span></div>
    <div class="line depositt"><span>Deposit Amount </span><span>{{ submitMessage[3] }}</span></div>
  </div>
  <div v-else id="renderArea">
    <form ref="formRef" method="post" style="display: none"></form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getParamKey } from "@/api/personal/common";
import { isEmpty } from "@/utils/utils";
import { RiFileCopyLine } from "vue-remix-icons";

const request = ref({});
const formRef = ref();
const submitMessage = ref([]);
const copyText1 = ref(null);
const copyText2 = ref(null);

function copyCode(copyText) {
  let range = document.createRange()
  range.selectNodeContents(copyText)
  window.getSelection().removeAllRanges()
  window.getSelection().addRange(range)
  document.execCommand("copy")
};
function getRequest(url) {
  if (isEmpty(url)) {
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
  submitMessage.value = request.value.data.split(',');
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
  if (!isEmpty(request.value.paramKey)) {
    const d = await getParamKey(request.value.paramKey);
    if (request.value.payResultType == "POST_SUBMIT") {
      request.value = Object.assign({}, getRequest(d.data.data), request.value);
    } else {
      request.value.data = d.data.data;
    }
  }
  renderOrSubmit();
});
</script>
<style lang="scss">
.submit-message {
  width: 400px;
  margin: 100px auto;
  gap: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  color:#ffffff;
  box-shadow: 2px 2px 10px 1px #000000;
  border-radius: 20px;
  background-image: linear-gradient(to right, #de4545, #db7e42);
  padding: 30px;
  .bankname {
    font-weight: bold;
    font-size: 20px;
  }
  .line {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
    &.depositt {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 0;
      span {
        &:last-child {
          font-size: 20px;
        }
      }
    }
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    .remixicon {
      width: 15px;
      fill: white;
      cursor: pointer;
    }
  }
}
</style>
