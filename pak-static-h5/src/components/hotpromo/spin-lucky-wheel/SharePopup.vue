<template>
  <q-dialog position="top" class="share-popup" v-model="_modelValue" @hide="hideSharePopup" @show="handleDialogShow">
    <div class="top">
      <a v-close-popup>
        <img src="../../../assets/images/index/btn-back.png" width="30" />
      </a>
      <div class="page-title-wrapper">
        <div class="title-container">
          <span class="title">{{ $t("hotPromo.share") }}</span>
        </div>
      </div>
      <div />
    </div>
    <div class="carousel-container" ref="captureRef">
      <!-- <q-carousel
        v-model="slide"
        transition-prev="fade-right"
        transition-next="fade-left"
        swipeable
        navigation
        nopadding
        class="sharepopupslider q-pa-md q-mb-xl"
      >
        <q-carousel-slide
          v-for="i in 6"
          :key="i"
          :name="i"
          class="rounded-borders"
          style="width: 100%; margin: 0 auto; border-radius: 20px"
        >
          <q-img class="rounded-borders col-6 full-height" :src="require(`../spin-lucky-wheel/img/share-${i}.png`)" />

          <VueQRCodeComponent class="qr-code" size="200" :text="qrCode" />
        </q-carousel-slide>
      </q-carousel> -->
      <Carousel v-bind="carouselSettings" class="custom-carousel sharepopupslider">
        <Slide v-for="i in 6" :key="i">
          <div class="slide-content">
            <img class="slide-img" :src="require(`../spin-lucky-wheel/img/share-${i}.png`)" alt="Slide Image" />
            <VueQRCodeComponent class="qr-code" size="200" :text="qrCode" />
          </div>
        </Slide>

        <template #addons>
          <Pagination />
        </template>
      </Carousel>
    </div>
    <div class="bottom-panel">
      <div class="share-icons">
        <div class="invite-share-social">
          <a class="social-item" @click="modalSocialShare = true">
            <img src="../spin-lucky-wheel/img/share-icon.png" />
            <span class="grey">{{ $t("hotPromo.share") }}</span>
          </a>
          <a class="social-item" @click="takeScreenshot">
            <img src="../spin-lucky-wheel/img/download-icon.png" />
            <span class="grey">{{ $t("hotPromo.save_image") }}</span>
          </a>
          <a class="social-item" @click="copyHrefLink">
            <!-- <div class="link-href">{{ selfTgurl }}</div> -->

            <img src="../spin-lucky-wheel/img/copy-icon.png" />
            <span class="grey">{{ $t("earnMoney.reward.copyLink") }}</span>
          </a>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog class="flex-end" width="100%" v-model="modalSocialShare" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />

      <div class="popout-dialog-container">
        <div class="txt-title">Share and Earn</div>
        <!-- <div class="txt-content q-mt-md text-center">Share and Earn</div> -->
        <div class="modal-invite-share-social">
          <a
            class="social-item"
            :href="`https://wa.me/?text=${encodeURIComponent($t('earnMoney.reward.shareText', { url: selfTgurl }))}`"
            target="_blank"
          >
            <img src="../../../assets/images/earn-money/social-green-whatsapp.png" />
          </a>

          <a class="social-item" @click="handleShareToFacebookPost(selfTgurl)">
            <img src="../../../assets/images/earn-money/social-facebook.png" />
          </a>

          <a
            class="social-item"
            :href="`instagram://sharesheet?text=${encodeURIComponent(
              $t('earnMoney.reward.shareText', { url: selfTgurl })
            )}`"
            target="_blank"
          >
          <img src="../../../assets/images/earn-money/social-green-instagram.png" />
        </a>
        
        <a class="social-item" @click="handleShareToTikTok(selfTgurl)">
          <img src="../../../assets/images/earn-money/social-green-tiktok.png" />
        </a>
        <a ref="tiktokRef" href="tiktok://" target="_blank" :style="{ display: 'none' }" />

          <a class="social-item" @click="handleShareToYoutube(selfTgurl)">
            <img src="../../../assets/images/earn-money/social-youtube.png" />
          </a>
          
          <a class="social-item" @click="handleShareToSMS(selfTgurl)">
            <img src="../../../assets/images/earn-money/social-sms.png" />
          </a>

          <a class="social-item" @click="handleShareToEmail(selfTgurl)">
            <img src="../../../assets/images/earn-money/social-email.png" />
          </a>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { useUI } from "stores/ui";
import { computed, onMounted, ref, nextTick } from "vue";
import { copyToClipboard, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import VueQRCodeComponent from "vue-qrcode-component";
import html2canvas from "html2canvas";

import "vue3-carousel/dist/carousel.css";
// import { Carousel, Slide, Navigation } from 'vue3-carousel';
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
const { t } = useI18n();
const slide = ref(1);
const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue", "hide"]);

const carouselSettings = ref({
  itemsToShow: 1.2, // Ensures peeking effect
  snapAlign: "center",
  wrapAround: true,
  transition: 500,
  height: 200,
  gap: 30
});
const captureRef = ref(null);

const takeScreenshot = async () => {
  await nextTick(); // Ensure the DOM is fully updated

  if (captureRef.value) {
    html2canvas(captureRef.value, {
      backgroundColor: null // Ensures transparency
    })
      .then((canvas) => {
        const ctx = canvas.getContext("2d");

        // Original image dimensions
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;

        // Crop dimensions (80% height)
        const cropWidth = originalWidth * 0.78;
        const cropHeight = originalHeight * 0.98;

        // Calculate the starting Y position (centered crop)
        const startX = (originalWidth - cropWidth) / 2; // Keep full width
        const startY = (originalHeight - cropHeight) / 2; // Center vertically

        // Create a new canvas for cropped image
        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;
        const croppedCtx = croppedCanvas.getContext("2d");

        // Enable transparency
        croppedCtx.clearRect(0, 0, cropWidth, cropHeight);
        croppedCtx.drawImage(
          canvas,
          startX,
          startY,
          cropWidth,
          cropHeight, // Source (original)
          0,
          0,
          cropWidth,
          cropHeight // Destination (cropped canvas)
        );

        // Convert to image and download
        const timeStamp = Date.now();
        const image = croppedCanvas.toDataURL("image/png");

        if (window.location.pathname === "/promotion") {
          const target = window["cordova_iab"] ?? window["webkit"].messageHandlers["cordova_iab"];
          target.postMessage(
            JSON.stringify({
              action: "qrcode",
              item: image,
              filename: `b9share-1-${timeStamp}.png`
            })
          );
        } else {
          const link = document.createElement("a");
          link.href = image;
          link.download = `b9share-1-${timeStamp}.png`;
          link.click();
        }

        $q.notify({
          color: "positive",
          position: "top",
          message: "QR Code image saved to photo gallery.",
          icon: "check_circle_outline"
        });
      })
      .catch((err) => console.error("Screenshot error:", err));
  }
};
// const showInviteWins = () => (isShowInviteWins.value = true);
// const isShowTextAmount = ref(false);

// defineExpose({
//   showInviteWins
// });

const ui = useUI();
const modalSocialShare = ref(false);
const copybtntxt = ref("Copy");
const copyinput = ref(null);
const copyCode = () => {
  const copyText = copyinput.value;
  copyText.select();
  document.execCommand("copy");
  copybtntxt.value = "Copied";
};
// const isShowInviteWins = ref(false);

const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

const hideSharePopup = () => {
  // isShowInviteWins.value = false;
  // isShowTextAmount.value = false;
  emit("hide");
};

const handleDialogShow = () => {
  // isShowTextAmount.value = true;
};

const handleShareToTikTok = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  copyToClipboard(shareText);
  tiktokRef.value.click();
};

const handleShareToYoutube = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  copyToClipboard(shareText);
  const youtubeShareUrl = ui.youtubeUrl;
  window.open(youtubeShareUrl, "_self");
};

const handleShareToFacebookPost = (url) => {
  const shareText = t("earnMoney.reward.shareText");
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}&quote=${encodeURIComponent(shareText)}`;
  copyToClipboard(shareText);
  window.open(facebookShareUrl, "_blank");
};

const handleShareToSMS = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  const smsBody = `${shareText}`;
  const smsShareUrl = `sms:?body=${encodeURIComponent(smsBody)}`;
  window.location.href = smsShareUrl;
};

const handleShareToEmail = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  const shareTitle = t("earnMoney.reward.shareTitle");
  const emailSubject = encodeURIComponent(`${shareTitle}`);
  const emailBody = encodeURIComponent(`${shareText}`);
  const emailShareUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  window.open(emailShareUrl, "_self");
};

const $q = useQuasar();
const store = userStore();
const selfTgurl = ref("");
const tiktokRef = ref();
const fallbackCopyTextToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const copyHrefLink = () => {
  const textToCopy = selfTgurl.value;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        $q.notify({
          message: "Link copied to clipboard",
          color: "positive",
          position: "top",
          timeout: 2000,
        });
      })
      .catch(() => {
        $q.notify({
          message: "Failed to copy link, using fallback method.",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        fallbackCopyTextToClipboard(textToCopy);
      });
  } else {
    $q.notify({
      message: "Link copied to clipboard",
      color: "positive",
      position: "top",
      timeout: 2000,
    });
    fallbackCopyTextToClipboard(textToCopy);
  }
};

const qrCode = computed(() => {
  return selfTgurl.value;
});
onMounted(() => {
  let tgDomain = location.origin;
  if (store.isApp()) {
    tgDomain = "https://" + store.evip;
  }

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) {
      selfTgurl.value = tgDomain + "/referSpin/" + res.data;
    }
  });
});
</script>
<style>
.share-popup {
  .q-dialog__inner {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 500px;
  }
}
</style>
<style lang="scss" scoped>
.share-popup {
  display: flex;
  max-width: 500px;
  flex-direction: column;
  margin: 0 auto;
  .top {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}
.carousel-container {
  width: 100%;
  // height: 900px;
  // margin-bottom: 15vh;
  // width: 320px;
  // height: 470px;

  // margin-top: -30vh;
  position: relative;
  max-width: 500px; /* Make it as small as you need */
  margin: 0 auto;
  overflow: hidden; /* Ensures no vertical scrolling */
  /* Small Parent Container */
  /* Carousel Styling */
  .custom-carousel {
    width: 100%;
  }

  // /* Slide Content */
  // .slide-content {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: center;
  //   padding: 0 5px
  // }
  .slide-content {
    padding: 0 10px;
  }

  :deep(.carousel__pagination-button) {
    background-color: #f34648 !important;
  }

  :deep(.carousel__pagination-button--active) {
    background-color: #e8282a !important;
    width: 30px !important;
  }

  /* Slide Image */
  .slide-img {
    width: 100%;
    border-radius: 20px;
    border: 2.76px solid #e8282a;
  }
}
.sharepopupslider {
  .qr-code {
    background: #ffffff;
    border-radius: 5px;
    padding: 10px;
    position: absolute;
    // right: 50px;
    // bottom: 68px;
    width: 28vw;
    max-width: 123px;

    // right: 13%;
    // bottom: 12%;
    right: 10%;
    bottom: 4%;

    :deep(img) {
      max-width: 100%;
    }
    :deep(canvas) {
      max-width: 100%;
    }
  }
  background: transparent;
  // &.q-carousel {
  //   width: 90%;
  //   max-width: 400px;
  //   margin: 0 auto;
  //   height: unset;

  //   // max-width: 280px;
  //   position: relative;
  //   // :deep(.q-carousel__navigation) {
  //   //   bottom: -15px;
  //   // }
  //   :deep(.q-carousel__navigation .q-btn) {
  //     margin: 0px;
  //     padding: 0;
  //   }
  //   :deep(.q-carousel__navigation-icon--active) {
  //     width: 40px;
  //     width: 40px;
  //     height: 6px;
  //     background: #21ef89;
  //     min-height: 1.6em;
  //     min-width: 15%;
  //     border-radius: 10px;
  //     font-size: 0px !important;
  //   }
  //   :deep(.q-img__container) {
  //     background: #434343;
  //     padding: 2px;
  //     border-radius: 20px;
  //     background: linear-gradient(
  //       154.65deg,
  //       rgba(5, 160, 0, 0.45) 6.41%,
  //       rgba(11, 92, 8, 0.45) 22.98%,
  //       rgba(62, 234, 56, 0.45) 43.48%,
  //       rgba(6, 63, 4, 0.45) 72.71%,
  //       rgba(5, 160, 0, 0.45) 93.64%
  //     );
  //     height: 96%;
  //   }
  //   :deep(.q-btn .q-icon, .q-btn .q-spinner) {
  //     font-size: 0.715em;
  //   }
  //   // .q-img__image--loaded {

  //   //   height: 85%;
  //   //   border-radius: 20px;
  //   //   padding: 2px;

  //   // }
  // }
}

.back-btn {
  width: 2.25rem;
  margin: 0.5rem 0 0 0;
}

.page-title-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 1rem 0px;
  height: 60px;

  img {
    width: 2.25rem;
  }

  .title-container {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14rem;
    margin: 0 0.5rem;
    font-size: 16px;
    font-weight: bold;
  }

  svg {
    width: 250px;
  }
}
.bottom-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  // height: 120px;
  // box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  border-radius: 12px 12px 0 0;
  margin: auto;
  .choices {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    div {
      width: 100%;
      padding: 15px;
      text-align: center;
      &:last-child {
        border-top: 1px solid #ffffff;
      }
    }
  }
  .invite-share-link {
    margin-top: 12px;
    background-color: #0f0b0b;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;

    .link-href {
      padding: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 11px;
    }
    .link-copy {
      color: #0f0b0b;
      background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      min-width: 98px;
      font-weight: bold;
      border-radius: 12px;
      letter-spacing: -1px;
      padding: 4px;
    }
  }

  .invite-share-social {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
    width: 95%;
    margin: 10px auto 16px;
    // display: none !important;
    .social-item {
      position: relative;
      background: #ffffff;
      border-radius: 30px;
      padding: 10px 5px 10px 40px;
      img {
        display: block;
        width: 100%;
        max-width: 50px;
        margin: 0 auto 5px;
        position: absolute;
        left: -5px;
        top: -10px;
      }
      text-decoration: none;
      .grey {
        color: #000000;
        font-size: 9px;
        text-decoration: none;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        font-family: Poppins;
        font-weight: 700;
        font-size: 10px;
        line-height: 16.47px;
        letter-spacing: 0px;
      }
    }
  }
}

.modal-invite-share-social {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 12px;
  margin-top: 16px;
  // display: none !important;
  .social-item {
    img {
      display: block;
      width: 100%;
      max-width: 50px;
      margin: auto;
    }
  }
}
</style>
