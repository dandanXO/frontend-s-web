<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    "
  ></div>
</template>
<script setup>
import { onMounted } from "vue";
import { doIt } from "boot/action";
import { cashier } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import i18n from "../i18n/index";
import liff from "@line/liff";
// import {Preferences} from "@capacitor/preferences";
import { useRouter } from "vue-router";

const qs = require("qs");

// async function pDepo(deposit) {

//   const obj = {
//     bankCardId: deposit.bankCardId,
//     localAmount: deposit.localAmount,
//     paymentId: deposit.paymentId
//   };

//   if (deposit.privilegeId) {
//     obj.privilegeId = deposit.privilegeId;
//   }
//   await cashier
//     .post("/session/payment/submit", qs.stringify(obj))
//     .then((res) => {
//       // const res = ret.data
//       if (res.code === 0) {
//         doIt(res).then(() => {
//           if (!Platform.is.desktop) {
//             setTimeout(() => {
//               router.go(-1);
//             }, 1000);
//           }
//           $q.loading.hide();
//           postMessage({ msg: "success" }, "*");
//         });
//       } else {
//         // console.log(res);
//         postMessage({ msg: res.message }, "*");
//         closeWindowOrBack();
//       }
//     })
//     .catch((error) => {
//       postMessage(
//         {
//           msg: error.message
//         },
//         "*"
//       );
//       closeWindowOrBack();
//     });
// }

function closeWindowOrBack() {
  if (
    (Platform.is.desktop || Platform.is.webkit) &&
    !Platform.is.capacitor &&
    Platform.is.name !== "webkit" &&
    !liff.isInClient()
  ) {
    window.close();
  } else {
    router.go(-1);
  }
}

function postMessage(item1, item2) {
  if (
    (Platform.is.desktop || Platform.is.webkit) &&
    !Platform.is.capacitor &&
    Platform.is.name !== "webkit" &&
    !liff.isInClient()
  ) {
    window.opener.postMessage(item1, item2);
  } else {
    window.postMessage(item1, item2);
  }
}

// function pDepo(data) {
//   postDeposit(data)
//     .then((d) => {
//       if (d.code === 0) {
//         doIt(d);
//         window.opener.postMessage({ msg: "success" }, "*");
//       }
//       return d;
//     })
//     .catch((error) => {
//       window.opener.postMessage({ msg: error.message }, "*");
//       window.close();
//     });
// }
const $q = useQuasar();
const router = useRouter();

onMounted(async () => {
  $q.loading.show({
    message: "加载中..."
  });
  if (
    (Platform.is.desktop || Platform.is.webkit) &&
    !Platform.is.capacitor &&
    Platform.is.name !== "webkit" &&
    !liff.isInClient()
  ) {
    let params = localStorage.getItem("formDetails");
    params = params ? JSON.parse(params) : "";
    // var form = params;
    console.log(params);
    doIt(params);
  }

  // console.log(form);

  // cashier
  //   .get(
  //     "/session/payment/" +
  //       form.paymentId +
  //       "/amount/" +
  //       form.localAmount +
  //       "/verify"
  //   )
  //   .then((d) => {
  //     if (d.code === 0) {
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
  //       postMessage({ msg: d.message }, "*");
  //       closeWindowOrBack();
  //     }
  //   })
  //   .catch((error) => {
  //     postMessage({ msg: error.message }, "*");
  //     closeWindowOrBack();
  //   });
});
</script>
