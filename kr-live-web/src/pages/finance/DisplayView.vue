<template>
  <div v-if="submitMessage" class="submit-message">
    <div class="line">
      <span>ธนาคาร：</span>
      <span class="info" ref="subMsg0">{{
        encodeURIComponent(submitMessage[0]).replace(/%20/g, " ")
      }}</span>
      <q-btn @blur="blurCode" @click="copyMessage('0')" class="common-btn" color="brand">{{ copybtntxt0 }}</q-btn>
    </div>
    <div class="line">
      <span>เลขบัญชีธนาคาร：</span>
      
      <span class="info" ref="subMsg1">{{
        encodeURIComponent(submitMessage[1]).replace(/%20/g, " ")
      }}</span>
      <q-btn @blur="blurCode" @click="copyMessage('1')" class="common-btn" color="brand">{{ copybtntxt1 }}</q-btn>
    </div>
    <div class="line">
      <span>เลขบัญชีธนาคาร：</span>
      <span class="info" ref="subMsg2">{{
        encodeURIComponent(submitMessage[2]).replace(/%20/g, " ")
      }}</span>
      <q-btn @blur="blurCode" @click="copyMessage('2')" class="common-btn" color="brand">{{ copybtntxt2 }}</q-btn>
    </div>
    <div class="line">
      <span>จำนวนเงิน：</span>
      
      <span class="info" ref="subMsg3">{{
        encodeURIComponent(submitMessage[3]).replace(/%20/g, " ")
      }}</span>
      <q-btn @blur="blurCode" @click="copyMessage('3')" class="common-btn" color="brand">{{ copybtntxt3 }}</q-btn>
    </div>
  </div>
  <div v-else id="renderArea">
    <form ref="formRef" method="post" style="display: none">
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { cashier } from "src/boot/axios";

const request = ref({});
const formRef = ref();
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const copybtntxt0 = ref("คัดลอก");
const copybtntxt1 = ref("คัดลอก");
const copybtntxt2 = ref("คัดลอก");
const copybtntxt3 = ref("คัดลอก");
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
  copybtntxt[position].value = 'คัดลอกแล้ว';
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};

const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt.forEach(element => {
    element.value = 'คัดลอก';
  });
};

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
  if (request.value.paramKey) {
    const d = await cashier.get(`/param/key/${key}`, request.value.paramKey).then(() => {
      if (request.value.payResultType == "POST_SUBMIT") {
        request.value = Object.assign({}, getRequest(d.data.data), request.value);
      } else {
        request.value.data = d.data.data;
      }
    })
  }
  renderOrSubmit();
});
</script>
<style lang="scss">
.submit-message {
  width: 90%;
  margin: 50px auto;
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
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    
    span:first-child {
      flex: 2;
    }
    span.info {
      flex: 3;
    }
    .q-btn {
      width: 100px;
    }
  }
}
</style>
