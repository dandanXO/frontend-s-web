<template>
  <div class="list-item" id="whatapp-icon" @click="openWhatsApp()">
    <img class="btn-icon" 
      :src="require(`../assets/images/auth/whatsapp-${isInvite ? 'neon' : 'colored'}.png`)" />
      <img class="absolute-hot" src="../assets/images/index/hot.gif" />
    <!-- <div>WhatsApp</div> -->
  </div>
  <div v-if="isInvite" class="list-item" @click="openFacebook()">
    <img class="btn-icon" id="facebook-icon"
      :src="require(`../assets/images/auth/facebook-${isInvite ? 'neon' : 'colored'}.png`)" />
  </div>
  <a ref="tiktokRef" href="https://www.tiktok.com" target="_blank" :style="{ display: 'none' }" />
  <div class="list-item" @click="openTiktok()">
    <img class="btn-icon" id="tiktok-icon"
      :src="require(`../assets/images/auth/tiktok-${isInvite ? 'neon' : 'colored'}.png`)" />
    <!-- <div>Tiktok</div> -->
  </div>
  <a ref="instagramRef" href="https://www.instagram.com" target="_blank" :style="{ display: 'none' }" />
  <div class="list-item" @click="openInsta()">
    <img class="btn-icon" id="insta-icon"
      :src="require(`../assets/images/auth/insta-${isInvite ? 'neon' : 'colored'}.png`)" />
    <!-- <div>WhatsApp</div> -->
  </div>
  <div class="list-item" @click="openYoutube()">
    <img class="btn-icon" id="youtube-icon"
      :src="require(`../assets/images/auth/youtube-${isInvite ? 'neon' : 'colored'}.png`)" />
    <!-- <div>Youtube</div> -->
  </div>
  <div v-if="isInvite" class="list-item" @click="openSMS()">
    <img class="btn-icon" id="mail-icon"
      :src="require(`../assets/images/auth/sms-${isInvite ? 'neon' : 'grey'}.png`)" />
  </div>
  <div v-if="isInvite" class="list-item" @click="openMail()">
    <img class="btn-icon" id="mail-icon"
      :src="require(`../assets/images/auth/mail-${isInvite ? 'neon' : 'grey'}.png`)" />
  </div>
  <div v-if="!isInvite" class="list-item" @click="openCharity()">
    <img class="btn-icon" id="charity-icon"
      :src="require(`../assets/images/auth/charity-${isInvite ? 'neon' : 'colored'}.png`)" />
    <!-- <div>Charity</div> -->
  </div>
  <div class="list-item" v-if="!isAndroid() && !ui.hideDownload && !isInvite" @click="downloadApp()">
    <img class="btn-icon" id="download-icon"
      :src="require(`../assets/images/auth/app-${isInvite ? 'neon' : 'grey'}.png`)" />
    <!-- <div>{{ $t("btn.downloadApp") }}</div> -->
  </div>
</template>
<script setup>
import { ref } from "vue";
import { isAndroid } from "boot/utils";
import { useUI } from "stores/ui";
import { useI18n } from "vue-i18n";
import { copyToClipboard } from "quasar";

const waUrl = ref("");
const tiktokRef = ref();
const instagramRef = ref();
const youtubeRef = ref();
const { t } = useI18n();
const props = defineProps(["isInvite", "url"])
const ui = useUI();
const openWhatsApp = () => {
  if (!props.isInvite) {
    window.open(ui.whatsappUrl, "_blank");
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(t('earnMoney.reward.shareText', { url: props.url }))}`);
  }

};

const openInsta = () => {
  if (!props.isInvite) {
    window.open(ui.instagramUrl, "_blank");
  } else {
    const shareText = t("earnMoney.reward.shareText", { url: props.url });
    copyToClipboard(shareText);
    instagramRef.value.click();
  }
};

const openTiktok = () => {
  if (!props.isInvite) {
    window.open(ui.tiktokUrl, "_blank");
  } else {
    const shareText = t("earnMoney.reward.shareText", { url: props.url });
    copyToClipboard(shareText);
    tiktokRef.value.click();
  }
};

const openYoutube = () => {
  window.open(ui.youtubeUrl, "_blank");
};

const openCharity = () => {
  window.open(ui.charityUrl, "_blank");
};
const openFacebook = () => {
  if (!props.isInvite) {

  } else {
    const shareText = t("earnMoney.reward.shareText");
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      props.url
    )}&quote=${encodeURIComponent(shareText)}`;
    copyToClipboard(shareText);
    window.open(facebookShareUrl, "_blank");
  }
}
const openSMS = () => {
  if (!props.isInvite) {

  } else {
    const shareText = t("earnMoney.reward.shareText", { url: props.url });
    const smsBody = `${shareText}`;
    const smsShareUrl = `sms:?body=${encodeURIComponent(smsBody)}`;
    window.location.href = smsShareUrl;
  }
}
const openMail = () => {
  if (!props.isInvite) {

  } else {
    const shareText = t("earnMoney.reward.shareText", { url: props.url });
    const shareTitle = t("earnMoney.reward.shareTitle");
    const emailSubject = encodeURIComponent(`${shareTitle}`);
    const emailBody = encodeURIComponent(`${shareText}`);
    const emailShareUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.open(emailShareUrl, "_self");
  }
}
const downloadApp = () => {
  if (ui.downloadAppUrl) {
    window.open(ui.downloadAppUrl, "_blank");
  } else {
    ui.getTopDownloadUrl().then(() => window.open(ui.downloadAppUrl, "_blank"));
  }
};
</script>
<style lang="scss" scoped>
.invite-share-social {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  .list-item {


    img {
      display: block;
      width: 100%;
      max-width: 50px;
      margin: auto;
    }
  }
}

.btn-lists {
  display: flex;
  justify-content: space-evenly;
  gap: 0px;
  width: 100%;
  margin: 10px auto;
  align-items: flex-start;
  text-align: center;

  .list-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    color: #9f9f9f;
    font-size: 11px;
    flex: 1;
  }


  .absolute-hot {
    position: absolute;
    right: 3px;
    top: -6px;
    width: 18px;
    height: unset;
    img { 
      width: 18px;
    }
  }
  .btn-icon {
    width: 40px;
    height: 40px;
    &:active {
      filter: brightness(0.85);
      transform: translate(0px, 1px);
    }
  }

  #cs-icon {
    width: 70px;
    height: 70px;
  }

  #whatapp-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
  }

  #charity-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 0.4s;
  }

  #youtube-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 0.8s;
  }

  #tiktok-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 1.2s;
  }

  #insta-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 1.2s;
  }

  #download-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 1.6s;
    //filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);;
  }
}

@keyframes smallbeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  14% {
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  42% {
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }

  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>