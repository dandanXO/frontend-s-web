<template>
  <div class="info-wrapper q-mt-md">
    <div class="info-container">

      <div class="card">
        <div class="link-info">
          <section>
            <p class="item">Create referral link</p>
            <p class="count">2/20</p>
          </section>
          <section>
            <p class="item">friends</p>
            <p class="count">20</p>
          </section>
        </div>
        <q-btn flat class="btn-purple" @click="clickBuildLink()">
          BUILD LINK
        </q-btn>
      </div>

      <div class="card">
        <div class="table-header">
          <div class="name">Name</div>
          <div class="link">Link</div>
          <div class="friends">Friends</div>
        </div>
        <div class="table-items" v-for="(item, i) in shareDataList" :key="i">
          <div class="name">{{ item.name }}</div>
          <div class="link">
            <span>{{ item.link }}</span>
            <span @click="clickLinkCopy(item.link)">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.02734 1.68215V3.02898H8.37567C9.255 3.02898 9.97018 3.74416 9.97018 4.62625V9.97168H11.3198C11.9709 9.97168 12.4996 9.44574 12.4996 8.79465V1.68215C12.4996 1.03106 11.9709 0.502223 11.3198 0.502223H4.20438C3.55329 0.502223 3.02734 1.03092 3.02734 1.68215Z" fill="white" fill-opacity="0.7"/>
              <path d="M0.500977 4.62585V11.7384C0.500977 12.1586 0.840441 12.498 1.26067 12.498H8.37593C8.79326 12.498 9.13562 12.1586 9.13562 11.7384V4.62585C9.13562 4.20562 8.7934 3.8634 8.37593 3.8634H1.26067C0.840441 3.8634 0.500977 4.20576 0.500977 4.62585Z" fill="white" fill-opacity="0.7"/>
            </svg>
        </span>
          </div>
          <div class="friends">
            <span>{{ item.friends }}</span>
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 13.5L7 7.5L0.999999 1.5" stroke="#949498" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog width="100%" v-model="shareDialog">
    <div class="popout-dialog">
      <div class="qr-code-container" style="position:relative;">
        <q-btn icon="close" flat round dense @click="shareDialog = false" class="dialog-close-btn" />
        <p class="qr">QR</p>
        <div class="qr-code-bg">
          <VueQRCodeComponent id="the-qrcode" :size="110" :text="selfTgurl" class="qr-code" />
        </div>
        <div>
          Invite new users to register using your exclusive referral link or QR code and receive three generous rewards:
        </div>
        <div class="copy-link-container">
          <img src="../../assets/images/earn-money/share-referral.png" />
          <div class="link-wrapper" @click="copyShareLink(selfTgurl)">
            <div class="link">{{ selfTgurl }}</div>
            <div class="vertical-separator"></div>
            <img src="../../assets/images/earn-money/share-copy-link.png" />
          </div>
        </div>
        <div class="save-qr-btn" @click="shareDialog = false">Confirm</div>
      </div>
    </div>
  </q-dialog>

  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api, eventapi } from "boot/axios";
import { userStore } from "stores/index";
import { useRoute } from "vue-router";
import { Platform, useQuasar } from "quasar";
import VueQRCodeComponent from "vue-qrcode-component";
import { Directory, Filesystem } from "@capacitor/filesystem";
import html2canvas from "html2canvas";

const store = userStore();
const route = useRoute();
const $q = useQuasar();



const selfTgurl = ref("");
const shareDialog = ref(false);
const shareDataList = ref([ // fakeData
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
  {
    name: '888888',
    link: '51522wlwl',
    friends: 3
  },
]);
const shareData = ref({
  total: 0,
  valid: 0,
  todayValid: 0,
  todayRebate: 0,
  rebateLevel: 0,
  rebateAmount: 0,
  totalRebate: 0
});
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
      message: `${selfTgurl.value} copied to clipboard`,
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

          setTimeout(() => {
            canvas.style.display = "none";
          }, 750);
        });
      } catch (e) {}
    }
  } else if (Platform.is.capacitor && Platform.is.android) {
    try {
      html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
        const dataUrl = canvas.toDataURL("image/jpeg").split(",")[1]; // 仅保留 base64
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        await Filesystem.writeFile({
          path: `myreferral-${timestamp}.jpg`,
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

        canvas.remove(); // 从 DOM 中移除
      });
    } catch (error) {
      console.error("Error saving QR Code image:", error);
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed to save image.",
        icon: "error_outline"
      });
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

const getShareInitData = () => {
  //TODO: update shareDataList.value
  eventapi
    .get("/privi/ind-refer-rebate")
    .then((res) => {
      if (res.code === 0) {
        shareData.value = res.data;
      }
    })
    .catch(() => {});
};

const getReferralCode = () => {
  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.h5Url;
  }

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) selfTgurl.value = tgDomain + "refer/" + res.data;
  });
};

const clickBuildLink = () => {
  //TODO
}

const clickLinkCopy = (link) => {
  //TODO 更換彈窗資料
  shareDialog.value = true;
}

onMounted(() => {
  getShareInitData();
  getReferralCode();
});
</script>
<style scoped lang="scss">
.share-banner-img {
  img {
    width: 100%;
  }
}
.info-wrapper {
  .info-container {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
  }
}

.card {
  background: linear-gradient(180deg, #8b36f859 0%, #334ad657 100%);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  .link-info {
    display: flex;
    width: 100%;
    margin-bottom: 15px;
    section {
      flex: 1;
      .item {
        color: #ffffffcc;
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: 500;
      }
      .count {
        color: #ffffff;
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
  .btn-purple {
    background: #5c46e7;
    color: #ffffff;
    width: 100%;
    font-weight: bold;
  }
  .table-header {
    display: flex;
    justify-content: space-between;
    margin: 20px auto;
  }

  .table-items {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ffffff1a;
    padding: 10px 0;
    svg {
      margin-left: 8px;
      cursor: pointer;
    }
    .friends {
      span {
        color: #30E3FFCC;
        font-weight: 500;
      }
    }
  }
}

.qr-code-container {
  background: #1A1A1A;
  border-radius: 12px;
  padding: 12px;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  .dialog-close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
  }
  .qr {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
  .qr-code-bg {
    border-radius: 0.5rem;
    background-color: #fff;
    padding: 5px;
    margin: 0 auto 30px;
    > img {
      width: 40%;
      min-width: 120px;
    }
  }

  .save-qr-btn {
    background-color: #8B00FF;
    border-radius: 6px;
    width: 40%;
    min-width: 160px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 14px 0;
    font-size: 14px;
    font-weight: bold;
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

  :deep(thead) {
    th:nth-child(3) {
      white-space: normal;
    }
  }

}

.copy-link-container {
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 8px;
  > img {
    width: 27px;
    height: 27px;
    margin: 0 6px;
  }
  .link-wrapper {
    background: linear-gradient(325.86deg, #1e1236 5.38%, #2f1661 98.11%);
    border: 2px solid #3f237a;
    // border-image-source: linear-gradient(148.87deg, #7753c2 -14.01%, #3f237a 51.97%, #7753c2 115.36%);
    border-radius: 6px;
    box-shadow: 0px 0px 20px 0px #b479ff40 inset;
    width: calc(100% - 50px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    padding: 0 10px;
    > img {
      width: 16px;
      height: 16px;
    }
    .vertical-separator {
      width: 1px;
      background-color: #c29bff;
      margin: 0 1rem;
      height: 50%;
    }
    .link {
      width: calc(100% - 40px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
