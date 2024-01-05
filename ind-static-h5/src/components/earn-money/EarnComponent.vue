<template>
  <div class="earn">
    <div class="agency-policy-main-img"><img src="../../assets/images/earn-money/about-bg.png" /></div>

    <div class="title">Invite to Earn</div>
    <div class="desc-title-wrapper">
      <div class="number">1</div>
      <div class="desc-title">Share your referral link or QR code below</div>
    </div>
    <div class="desc-content">Just copy or screenshot and send it to your friends</div>

    <div class="desc-title-wrapper">
      <div class="number">2</div>
      <div class="desc-title">Get your friends to start playing</div>
    </div>
    <div class="desc-content">You can check your referred friends who registered with your code.</div>

    <div class="desc-title-wrapper">
      <div class="number">3</div>
      <div class="desc-title">Start earning daily commissions</div>
    </div>
    <div class="desc-content">
      You will be rewarded, regardless if they win or lose. The more friends you refer to Skyace Club, the bigger your
      daily reward. Start earning daily commissions
    </div>

    <div class="earn-separator"></div>
    <div class="earn-title">My Referral Link</div>
    <div class="earn-separator"></div>

    <div class="referral-link-wrapper">
      <q-icon size="xs" name="insert_link" />
      <div class="link">{{ selfTgurl }}</div>
      <q-icon class="copy-btn" name="content_copy" @click="copyShareLink(selfTgurl)" />
    </div>

    <div class="qr-wrapper">
      <VueQRCodeComponent id="the-qrcode" :size="150" :text="selfTgurl" class="qr-code" />

      <q-btn label="Save" :size="'150'" class="save-btn" @click="downloadQRImg()" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, copyToClipboard, Platform } from "quasar";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import VueQRCodeComponent from "vue-qrcode-component";
import html2canvas from "html2canvas";
import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";

const $q = useQuasar();
const store = userStore();

const selfTgurl = ref("");
const copyShareLink = (selfTgurl) => {
  copyToClipboard(selfTgurl)
    .then(() => {
      $q.notify({
        color: "position",
        position: "top",
        message: `${selfTgurl} copied to clipboard`,
        icon: "check_circle_outline"
      });
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed",
        icon: "report_problem"
      });
    });
};

const downloadQRImg = async () => {
  if (Platform.is.capacitor && Platform.is.android) {
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
    gap: 5px;

    .number {
      background: red;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 6.25rem;
      background: rgba(252, 245, 104, 0.2);
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
    gap: 10px;
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
