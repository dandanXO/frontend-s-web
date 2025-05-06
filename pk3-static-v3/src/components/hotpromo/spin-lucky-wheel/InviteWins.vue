<template>
  <div class="invite-win-container">
    <div class="referral-link-wrapper invite-win-section">
      <div class="link">
        <q-spinner style="width: 100%; margin: 0 auto" v-if="isLoading" :size="30" />
        <span v-else>{{ selfTgurl }}</span>
      </div>
      <q-icon class="copy-btn" name="content_copy" @click="copyShareLink(selfTgurl)" />
    </div>

    <div class="qr-wrapper invite-win-section">
      <q-spinner v-if="isLoading" :size="30" />
      <VueQRCodeComponent v-else id="the-qrcode" :size="120" :text="selfTgurl" class="qr-code" />
      <span class="desc">
        Do you want to unlock your {{ `${store.currency.value} 5,000` }} reward right away? Invite your friends for a
        free spin!
      </span>
      <q-btn label="Save" :size="'150'" class="save-btn" @click="downloadQRImg()" />
    </div>
  </div>
  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import VueQRCodeComponent from "vue-qrcode-component";
import html2canvas from "html2canvas";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useRoute } from "vue-router";

const $q = useQuasar();
const store = userStore();
const route = useRoute();
const isLoading = ref(false);

const selfTgurl = ref("");
const copyinput = ref(null);
const text_copied = ref("");
const copyShareLink = () => {
  const copiedText = `Do you want to unlock your ${store.currency.value} 5,000 reward right away? Click the link: ${selfTgurl.value}`;
  text_copied.value = copiedText;
  setTimeout(() => {
    const copyText = copyinput.value;
    console.log(copyText);

    copyText.select();
    document.execCommand("copy");

    $q.notify({
      color: "positive",
      position: "top",
      message: `${selfTgurl.value} copied to clipboard`,
      icon: "check_circle_outline"
    });
  }, 100);
};

const downloadQRImg = async () => {
  if (route.path === "/wv-promotion") {
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
  } else if (window.location.pathname === "/promotion") {
    try {
      html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
        document.body.appendChild(canvas);
        const dataUrl = canvas.toDataURL("image/jpeg");
        // console.log(dataUrl);

        const target = window["cordova_iab"] ?? window["webkit"].messageHandlers["cordova_iab"];
        target.postMessage(
          JSON.stringify({
            action: "qrcode",
            item: dataUrl
          })
        );

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
    try {
      html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
        document.body.appendChild(canvas);
        const dataUrl = canvas.toDataURL("image/jpeg");
        // console.log(dataUrl);

        const link = window.document.createElement("a");
        link.href = dataUrl;
        link.download = "myreferral";

        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);

        canvas.style.display = "none";
        document.body.removeChild(canvas);
      });
    } catch (error) {
      console.error("Error saving QR Code image:", error);
    }
  }
};

onMounted(() => {
  isLoading.value = true;

  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.h5Url;
  }

  api
    .get("/session/member/referralCode")
    .then((res) => {
      if (res.code === 0) {
        selfTgurl.value = tgDomain + "refer/" + res.data;
        isLoading.value = false;
      }
    })
    .catch(() => {
      isLoading.value = false;
    })
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style scoped lang="scss">
.invite-win-container {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .referral-link-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    margin: 10px 0 0 0;
    height: 50px;
    padding: 10px;

    .link {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      margin: 0 auto;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25px;

    .qr-code {
      padding: 10px;
      border-radius: 0.625rem;
      background: #fff;
      margin-bottom: 10px;
    }

    .save-btn {
      width: 50%;
      color: #fff;
      font-weight: 700;
      border-radius: 0.5rem;
      background: linear-gradient(180deg, #ffa600 0%, #ff3b00 100%);
      border: 1px solid #e8c4ff33;
      margin-top: 10px;
    }
  }
}

.invite-win-section {
  background: #1e1f24;
  border: 1px solid #cd91ff;
  border-radius: 4px;
}

@media screen and (max-width: 400px) {
  .invite-win-container {
    gap: 10px;

    .referral-link-wrapper {
      gap: 5px;
      margin: 5px 0 0 0;
      height: 40px;
      padding: 5px;
    }

    .qr-wrapper {
      padding: 10px;
    }
  }
}

@media screen and (max-width: 350px) {
  .invite-wins {
    padding: 35px 15px 0;
  }
  .invite-win-container {
    gap: 10px;

    .referral-link-wrapper {
      gap: 5px;
      margin: 5px 0 0 0;
      height: 40px;
      padding: 5px;
    }

    .qr-wrapper {
      padding: 10px;
    }
  }
}

.desc {
  line-height: 15px;
  font-size: 12px;
  letter-spacing: 0px;
  text-align: center;
}
</style>
