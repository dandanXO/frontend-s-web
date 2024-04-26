<template>
  <div v-if="submitMessage.length > 0" class="inner-cont">
    <div  class="submit-message">
    <div class="linebox"><span>{{$t('common.bankName') }}：</span> <span class="info" ref="subMsg0">{{submitMessage[0]}}</span><button @blur="blurCode" @click="copyMessage('0')" class="common-btn">{{ copybtntxt0 }}</button></div>
    <div class="linebox"><span>{{$t('common.bankAcc') }}：</span> <span class="info" ref="subMsg1">{{submitMessage[1]}}</span><button @blur="blurCode" @click="copyMessage('1')" class="common-btn">{{ copybtntxt1 }}</button></div>
    <div class="linebox"><span>{{$t('common.bankCard') }}：</span> <span class="info" ref="subMsg2">{{submitMessage[2]}}</span><button @blur="blurCode" @click="copyMessage('2')" class="common-btn">{{ copybtntxt2 }}</button></div>
    <div class="linebox"><span>{{$t('common.depositAmount') }}：</span> <span class="info" ref="subMsg3">{{submitMessage[3]}}</span><button @blur="blurCode" @click="copyMessage('3')" class="common-btn">{{ copybtntxt3 }}</button></div>
  </div>
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
      <button type="submit" id="submitBtn">{{$t('common.submit')}}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from "vue";
import { getParamKey } from "@/api/personal/common";
import { isEmpty } from "@/utils/utils";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const request = ref({});
const formRef = ref();
const data = reactive([]);
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const copybtntxt0 = ref(t('common.copy'));
const copybtntxt1 = ref(t('common.copy'));
const copybtntxt2 = ref(t('common.copy'));
const copybtntxt3 = ref(t('common.copy'));
const copyMessage = (position) => {
  let copyText = null;
    copyText = eval(`subMsg${position}.value.innerText`);
  // Create a temporary textarea element
  const tempTextarea = document.createElement('textarea');
  tempTextarea.value = copyText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it
  tempTextarea.select();
  document.execCommand('copy');

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt[position].value = t('common.copied');
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};

const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt.forEach(element => {
    element.value = '复制';
  });
};


function getRequest(url) {
  if (isEmpty(url)) {
    url = decodeURIComponent(window.location.search);
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
.inner-cont {  
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.submit-message {
  width: calc(100% - 40px);
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  height: auto;
  gap: 1px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  color:#000000;
  .linebox {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: calc(100% - 30px);
    align-items: center;
    font-size: 16px;
    align-items: center;
    background: #dddddd;
    padding: 15px;
    span:first-child {
      flex: 1;
      color: #4669f8;
    }
    span.info {
      flex: 3;
    }
    button {
      width: 80px;
    }
  }
}
</style>
