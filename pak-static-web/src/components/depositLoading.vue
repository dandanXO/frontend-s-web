<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    "
  >
    <a-spin />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { verifyAmount, postDeposit } from "@/api/personal/deposit";
import { doIt } from "@/utils/action";
import {useRouter} from "vue-router";

const router= useRouter()
function pDepo(data) {
  postDeposit(data)
    .then((d) => {
      if (d.code === 0) {
        doIt(d);
        postMessage({msg: "Success"}, "*");
      }
      // else {
      //   window.opener.postMessage({ msg: d.message }, "*");
      //   window.close();
      // }
      else {
        // alert(d)
        postMessage({msg: d.data.message,}, "*");
        closeWindowOrBack();
      }
    })
    .catch((error) => {
      postMessage({msg: error.message}, "*");
      closeWindowOrBack();
      // window.opener.postMessage(
      //   {
      //     msg: error.message === "too often request" ? "คำขอบ่อยเกินไป" : error.message,
      //   },
      //   "*"
      // );
      // window.close();
    });
}
onMounted(async () => {
  const params = localStorage.getItem("formDetails");
  var form = params ? JSON.parse(params) : "";
  await verifyAmount(form.paymentId, form.localAmount)
    .then((d) => {
      if (d.code == 0) {
        // newWin.location.href = d.data;
        // newWin.location.href = resp
        const copy = { ...form };
        const data = {};
        Object.entries(copy).forEach(([key, value]) => {
          if (value) {
            data[key] = value;
          }
        });
        data.bankCardId = 0;
        pDepo(data);
      } else {
        postMessage({msg: d.message}, "*");
        closeWindowOrBack();
      }
    })
    .catch((error) => {
      postMessage({msg: error.message}, "*");
      closeWindowOrBack();
    });
});

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
function closeWindowOrBack() {
  if(!isSafari){
    window.close();
  } else {
    window.close();
  }
}

function postMessage(item1, item2) {
  if(!isSafari){
    window.opener.postMessage(item1, item2);
  } else {
    window.opener.postMessage(item1, item2);
  }
}
</script>
