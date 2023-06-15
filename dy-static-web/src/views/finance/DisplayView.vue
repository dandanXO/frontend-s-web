<template>
  <div v-if="submitMessage" class="submit-message">
    <div class="line"><span>银行名称：</span> <span>{{submitMessage[0]}}</span></div>
    <div class="line"><span>银行账号：</span> <span>{{submitMessage[1]}}</span></div>
    <div class="line"><span>银行卡号：</span> <span>{{submitMessage[2]}}</span></div>
    <div class="line"><span>存款金额：</span> <span>{{submitMessage[3]}}</span></div>
  </div>
  <div v-else id="renderArea">
    <form ref="formRef" method="post" style="display: none">
      <input
        type="text"
        v-for="input in data"
        :key="input"
        :value="input.value"
        :name="input.name"
      />
      <button type="submit" id="submitBtn">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from "vue";
import { getParamKey } from "@/api/personal/common";
import { isEmpty } from "@/utils/utils";

const request = ref({});
const formRef = ref();
const data = reactive([]);
const submitMessage = ref([]);

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
    var dd = {
      name: x,
      value: request.value[x],
    };
    data.push(dd);
  }

  nextTick(() => {
    document.getElementById("submitBtn").click();
  });
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
  margin: 0 auto;
  height:100%;
  gap: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  color:#ffffff;
  .line {
    display: flex;
    gap: 10px;
  }
}
</style>
