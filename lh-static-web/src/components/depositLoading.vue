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
import { postDeposit } from "@/api/personal/deposit";
// import i18n from "../i18n/index";

function pDepo(data) {
  postDeposit(data)
    .then((d) => {
      if (d.code === 0) {
        // doIt(d);
        window.opener.postMessage({ msg: "success" }, "*");
      }
      // else {
      //   window.opener.postMessage({ msg: d.message }, "*");
      //   window.close();
      // }
      else {
        // alert(d)
        window.opener.postMessage(
          {
            msg: d.data.message
          },
          "*"
        );
        window.close();
      }
    })
    .catch((error) => {
      window.opener.postMessage(
        {
          msg: error.message
        },
        "*"
      );
      window.close();
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
  // const params = localStorage.getItem("formDetails");
  // var form = params ? JSON.parse(params) : "";
  // await verifyAmount(form.paymentId, form.localAmount)
  //   .then((d) => {
  //     if (d.code == 0) {
  //       // newWin.location.href = d.data;
  //       // newWin.location.href = resp
  //       const copy = { ...form };
  //       const data = {};
  //       Object.entries(copy).forEach(([key, value]) => {
  //         if (value) {
  //           data[key] = value;
  //         }
  //       });
  //       data.bankCardId = 0;
  //       pDepo(data);
  //     } else {
  //       window.opener.postMessage({ msg: d.message }, "*");
  //       window.close();
  //     }
  //   })
  //   .catch((error) => {
  //     window.opener.postMessage({ msg: error.message }, "*");
  //     window.close();
  //   });
});
</script>
