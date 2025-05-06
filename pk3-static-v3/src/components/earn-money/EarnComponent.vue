<template>
  <div class="earn">
    <div class="agency-policy-main-img"><img src="@/assets/images/earn-money/about-bg.png" /></div>
    <div class="title">{{ $t("earnMoney.earn.inviteToEarn") }}</div>
    <div class="desc-title-wrapper">
      <div class="number">1</div>
      <div class="desc-title">{{ $t("earnMoney.earn.point_01_title") }}</div>
    </div>
    <div class="desc-content">{{ $t("earnMoney.earn.point_01_desc") }}</div>
    <div class="desc-title-wrapper">
      <div class="number">2</div>
      <div class="desc-title">{{ $t("earnMoney.earn.point_02_title") }}</div>
    </div>
    <div class="desc-content">{{ $t("earnMoney.earn.point_02_desc") }}</div>
    <div class="desc-title-wrapper">
      <div class="number">3</div>
      <div class="desc-title">{{ $t("earnMoney.earn.point_03_title") }}</div>
    </div>
    <div class="desc-content">{{ $t("earnMoney.earn.point_03_desc") }}</div>
    <div class="earn-separator"></div>
    <div class="earn-title">{{ $t("earnMoney.earn.myReferralLink") }}</div>
    <div class="earn-separator"></div>

    <div class="referral-link-wrapper">
      <q-icon size="xs" name="insert_link" />
      <div class="link">{{ selfTgurl }}</div>
      <q-icon class="copy-btn" name="content_copy" @click="copyShareLink(selfTgurl)" />
    </div>

    <div class="qr-wrapper">
      <VueQRCodeComponent id="the-qrcode" :size="150" :text="selfTgurl" class="qr-code" />

      <q-btn :label="$t('earnMoney.earn.save')" :size="'150'" class="save-btn" @click="downloadQRImg()" />
    </div>
  </div>
  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";
import { Platform, useQuasar } from "quasar";

import { api } from "@/boot/axios";
import { t } from "@/boot/lang";
import { userStore } from "@/stores/index";
import { Directory, Filesystem } from "@capacitor/filesystem";
import html2canvas from "html2canvas";
import { useRoute } from "vue-router";

const $q = useQuasar();
const store = userStore();
const route = useRoute();

const selfTgurl = ref("");
const copyinput = ref(null);
const text_copied = ref("");
const copyShareLink = (text) => {
  text_copied.value = text;
  setTimeout(() => {
    const copyText = copyinput.value;

    copyText.select();
    document.execCommand("copy");

    $q.notify({
      color: "positive",
      position: "top",
      message: `${selfTgurl.value} ${t("earnMoney.earn.copiedtoClipboard")}`,
      icon: "check_circle_outline"
    });
  }, 100);
};

const downloadQRImg = async () => {
  if (route.path === "/wv-earn-money") {
    if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
      try {
        html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
          document.body.appendChild(canvas);
          const dataUrl = canvas.toDataURL("image/jpeg");

          window.flutter_inappwebview.callHandler("downloadBase64Image", dataUrl);

          setTimeout(()=>{
            canvas.style.display = "none";
          },750)
        });
      } catch (e) {}
    }
  } else if (Platform.is.capacitor && Platform.is.android) {
    try {
      html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
        document.body.appendChild(canvas);
        const dataUrl = canvas.toDataURL("image/jpeg");
        // console.log(dataUrl);

        // Save the image to the photo gallery
        await Filesystem.writeFile({
          path: `Pictures/myreferral.jpg`,
          data: dataUrl,
          directory: Directory.Documents,
          recursive: true
        });

        console.log("QR Code image saved to gallery.");

        $q.notify({
          color: "positive",
          position: "top",
          message: "QR Code image saved to photo gallery.",
          icon: "check_circle_outline"
        });

        canvas.style.display = "none";
      });
    } catch (error) {
      console.error("Error saving QR Code image:", error);
    }
  } else {
    const link = window.document.createElement("a");
    const imgElement = document.querySelector('img[alt="Scan me!"]');
    link.href = imgElement.src;
    link.download = "myreferral";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

onMounted(() => {
  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.h5Url;
  }
  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) selfTgurl.value = tgDomain + "refer/" + res.data;
  });
});
</script>

<style scoped lang="scss">
.earn {
  img {
    width: 100%;
  }

  .title {
    background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 15px 0;
  }

  .desc-title-wrapper {
    display: flex;
    align-items: center;

    .number {
      background: red;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 6.25rem;
      background: rgba(252, 245, 104, 0.2);
      margin-right: 5px;
    }

    .desc-title {
      background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }
  }

  .desc-content {
    margin: 0 0 15px 0;
  }

  .earn-separator {
    background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
    height: 2px;
  }

  .earn-title {
    background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin: 1px 0;
  }

  :deep(.q-item) {
    padding: 0;
  }

  :deep(.q-expansion-item) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  ul {
    padding-inline-start: 1rem;

    li {
      list-style-type: decimal;
      font-size: 0.95rem;
      line-height: 1.25rem;
      text-align: left;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 0.75rem 0;
    }

    .dot-style {
      list-style-type: disc;
    }
  }

  :deep(.q-table__container) {
    background: transparent !important;
    border-radius: 12px;
  }

  .table-container {
    :deep(thead) {
      background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
    }

    :deep(tbody) {
      background: #652c93;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      tr {
        &:nth-child(2n) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: #502175;
        }
      }
    }

    .text-center {
      font-size: 0.95rem;
      font-weight: 700;
      width: 2rem;
      border-bottom-width: 0;
      border-right-width: 1px;
      border-color: black;
      padding: 0 0.25rem;
    }
  }

  .referral-link-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 10px 0 0 0;
    border-radius: 0.75rem 0.75rem 0rem 0rem;
    background: #392e7b;
    height: 50px;
    padding: 10px;
    justify-content: space-between;

    .link {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .copy-btn {
      border-radius: 6.25rem;
      background: rgba(255, 255, 255, 0.2);
      width: 25px;
      height: 25px;
      font-size: 12px;
    }
  }

  .qr-wrapper {
    border-radius: 0rem 0rem 0.75rem 0.75rem;
    background: #6759c0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25px;

    .qr-code {
      padding: 10px;
      border-radius: 0.625rem;
      background: #fff;
    }

    .save-btn {
      width: 50%;
      color: #5c46e7;
      font-weight: 700;
      border-radius: 0.5rem;
      background: linear-gradient(188deg, rgba(255, 255, 255, 0.8) 5.77%, #8eb5ff 93.57%);
      margin-top: 10px;
    }
  }
}

.agency-policy-main-img {
  margin-left: -16px;
  margin-right: -16px;

  &:after {
    content: "";
    background: linear-gradient(to bottom, rgba(17, 19, 31, 0.9), rgba(255, 255, 255, 0));
    position: absolute;
    top: 0;
    left: 0;
    height: 100px;
    width: 100%;
  }
}
</style>
