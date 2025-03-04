<template>
  <q-dialog v-model="_modelValue" @hide="hideSharePopup" @show="handleDialogShow">
  
    <a @click="hideSharePopup" class="q-mt-sm">
          <img src="../../../assets/images/index/btn-back.png" width="30" />
      </a>
      <div class="page-title-wrapper">
        <div class="title-container">
          <span class="title">Share</span>
        </div>
      </div>
    <q-carousel
      v-model="slide"
      transition-prev="fade-right"
      transition-next="fade-left"
      swipeable
      animated
      navigation
      nopadding
      height="70vh"
      class="sharepopupslider q-pa-md q-mb-xl"
    >
      <q-carousel-slide 
        v-for="i in 6" 
        :key="i" 
        :name="i" 
        class="rounded-borders"
        style="width: 80%; margin: 0 auto; border-radius: 20px;"
      >
        <q-img class="rounded-borders col-6 full-height" :src="require(`../spin-lucky-wheel/img/share-${i}.png`)" />
      </q-carousel-slide>
    </q-carousel>
    <div class="bottom-panel">
      <div class="share-icons">
        <div class="invite-share-social">
        <a
          class="social-item"
          :href="`https://wa.me/?text=${encodeURIComponent($t('earnMoney.reward.shareText', { url: selfTgurl }))}`"
          target="_blank"
        >
          <img src="../../../assets/images/earn-money/social-green-whatsapp.png" />
          <span class="grey">Whatsapp</span>
        </a>
        <a
          class="social-item"
          :href="`instagram://sharesheet?text=${encodeURIComponent(
            $t('earnMoney.reward.shareText', { url: selfTgurl })
          )}`"
          target="_blank"
        >
          <img src="../../../assets/images/earn-money/social-green-instagram.png" />
          <span class="grey">Instagram</span>
        </a>
        <a class="social-item" @click="handleShareToTikTok(selfTgurl)">
          <img src="../../../assets/images/earn-money/social-green-tiktok.png" />
          <span class="grey">Tik Tok</span>
        </a>
        <a ref="tiktokRef" href="tiktok://" target="_blank" :style="{ display: 'none' }" />
        <a class="social-item" @click="modalSocialShare = true">
          <img src="../../../assets/images/earn-money/social-green-more.png" />
          <span class="grey">Other Share</span>
        </a>
        <a class="social-item" @click="copyHrefLink">
          <!-- <div class="link-href">{{ selfTgurl }}</div> -->
          
          <img src="../../../assets/images/earn-money/social-green-copy.png" />
          <span class="grey">{{ $t("earnMoney.reward.copyLink") }}</span>
        </a>
      </div>

      </div>
    </div>
  </q-dialog>
  
  <q-dialog width="100%" v-model="modalSocialShare" presistent>
      <div class="popout-dialog">
        <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />

        <div class="popout-dialog-container">
          <div class="txt-title">Share and Earn</div>
          <!-- <div class="txt-content q-mt-md text-center">Share and Earn</div> -->
          <div class="modal-invite-share-social">
            <a class="social-item" @click="handleShareToYoutube(selfTgurl)">
              <img src="../../../assets/images/earn-money/social-youtube.png" />
            </a>
            <a class="social-item" @click="handleShareToFacebookPost(selfTgurl)">
              <img src="../../../assets/images/earn-money/social-facebook.png" />
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
import { computed, onMounted, ref } from "vue";
import { copyToClipboard, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { userStore } from "stores/index";
const { t } = useI18n();
const slide = ref(1);
const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue", "hide"]);
// const showInviteWins = () => (isShowInviteWins.value = true);
// const isShowTextAmount = ref(false);

// defineExpose({
//   showInviteWins
// });


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
  const youtubeShareUrl = `https://www.youtube.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
    shareText
  )}`;
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
const copyHrefLink = () => {
  navigator.clipboard
    .writeText(selfTgurl.value)
    .then(() => {
      $q.notify({
        message: "Link copied to clipboard",
        color: "positive",
        position: "top",
        timeout: 2000
      });
    })
    .catch(() => {
      $q.notify({
        message: "Failed to copy link",
        color: "negative",
        position: "top",
        timeout: 2000
      });
    });
};

onMounted(() => {
  
  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.evip ? "https://" + store.evip + "/" : store.h5Url;
  }

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) {
      selfTgurl.value = tgDomain + "refer/" + res.data;
    }
  });
})
</script>
<style lang="scss" scoped>
.sharepopupslider {
  background: transparent;
  &.q-carousel {
    width: 90%;
    // :deep(.q-carousel__navigation) {
    //   bottom: -15px;
    // }
    :deep(.q-carousel__navigation .q-btn) {
      margin: 0px;padding: 0;
    }
    :deep(.q-carousel__navigation-icon--active) {
      width: 40px;
      width: 40px;
      height: 6px;
      background: #21EF89;
      min-height: 1.6em;
      min-width: 15%;
      border-radius: 10px;
      font-size: 0px !important;
    }
    :deep(.q-img__container) {
      background: #434343;
      padding: 2px;
      border-radius: 20px;
      background: linear-gradient(154.65deg, rgba(5, 160, 0, 0.45) 6.41%, rgba(11, 92, 8, 0.45) 22.98%, rgba(62, 234, 56, 0.45) 43.48%, rgba(6, 63, 4, 0.45) 72.71%, rgba(5, 160, 0, 0.45) 93.64%);
      height: 96%;
    }
    :deep(.q-btn .q-icon, .q-btn .q-spinner) {
      font-size: 0.715em;
    }
    // .q-img__image--loaded {
      
    //   height: 85%;
    //   border-radius: 20px;
    //   padding: 2px;
      

    // }
  }
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
  margin: 0;
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
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 12px;
      margin-top: 16px;
      margin-bottom: 10px;
      // display: none !important;
      .social-item {
        img {
          display: block;
          width: 100%;
          max-width: 40px;
          margin: 0 auto 5px;
        }
        text-decoration: none;
        .grey {
          color: #9F9F9F;
          font-size: 9px;
          text-decoration: none;
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          
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
