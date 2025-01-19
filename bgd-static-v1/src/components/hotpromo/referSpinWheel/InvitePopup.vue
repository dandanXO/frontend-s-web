<template>
  <div class="invite-popup">
    <img
      class="close-icon"
      v-close-popup
      src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/close-icon.svg"
    />
    <div>{{ $t("hotPromo.referWheel.inviteFriendsHelp") }}</div>
    <div class="socials">
      <div class="social-item">
        <a
          class="social-item"
          :href="`https://wa.me/?text=${encodeURIComponent(
            $t('hotPromo.referWheel.shareSocialText', { url: selfTgurl })
          )}`"
          target="_blank"
        >
          <img class="social-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/whatsapp-icon.svg" />
        </a>
        <span class="social-label">Whatsapp</span>
      </div>

      <div class="social-item">
        <a
          class="social-item"
          :href="`https://wa.me/?text=${encodeURIComponent(
            $t('hotPromo.referWheel.shareSocialText', { url: selfTgurl })
          )}`"
          target="_blank"
        >
          <img class="social-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/facebook-icon.svg" />
        </a>
        <span class="social-label">Facebook</span>
      </div>

      <div class="social-item">
        <a class="social-item" @click="handleShareToTikTok(selfTgurl)">
          <img class="social-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/tiktok-icon.svg" />
        </a>
        <a ref="tiktokRef" href="tiktok://" target="_blank" :style="{ display: 'none' }" />
        <span class="social-label">TikTok</span>
      </div>

      <!-- <div class="social-item">
                <a
                    class="social-item"
                    :href="`https://wa.me/?text=${encodeURIComponent($t('hotPromo.referWheel.shareSocialText', { url: selfTgurl }))}`"
                    target="_blank"
                    >
                    <img class="social-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/telegram-icon.svg" />
                </a>
                <span class="social-label">Telegram</span>
            </div> -->

      <div class="social-item">
        <a
          class="social-item"
          :href="`instagram://sharesheet?text=${encodeURIComponent(
            $t('hotPromo.referWheel.shareSocialText', { url: selfTgurl })
          )}`"
          target="_blank"
        >
          <img class="social-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/instagram-icon.svg" />
        </a>
        <span class="social-label">Instagram</span>
      </div>
    </div>
    <div>{{ $t("hotPromo.referWheel.shareThisReferralLink") }}</div>
    <div class="copy-section">
      <div class="referral-link">{{ selfTgurl }}</div>
      <img
        @click="copyHrefLink"
        class="copy-btn"
        src="../../../assets/images/promotion/hotpromo/refer-spinwheel/copy-icon.svg"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { api, eventapi } from "src/boot/axios";
import { useQuasar, copyToClipboard } from "quasar";
import { useI18n } from "vue-i18n";
import { userStore } from "src/stores";

const props = defineProps(["selfTgurl"]);
const selfTgurl = props.selfTgurl;
const { t } = useI18n();
const $q = useQuasar();
const store = userStore();
const tiktokRef = ref();

const handleShareToTikTok = (url) => {
  const shareText = t("hotPromo.referWheel.shareSocialText", { url });
  copyToClipboard(shareText);
  tiktokRef.value.click();
};

const copyHrefLink = () => {
  navigator.clipboard
    .writeText(props.selfTgurl)
    .then(() => {
      $q.notify({
        message: t("notify.linkCopiedToClipboard"),
        color: "positive",
        position: "top",
        timeout: 2000
      });
    })
    .catch(() => {
      $q.notify({
        message: t("notify.failedToCopyLink"),
        color: "negative",
        position: "top",
        timeout: 2000
      });
    });
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.invite-popup {
  display: flex;
  flex-direction: column;
  background: #232524;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
  position: relative;

  .socials {
    display: flex;
    gap: 15px;

    .social-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .social-label {
        color: #ffffff80;
      }
    }
  }

  .close-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }

  .copy-section {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 5px;
    background: #494949;
    padding: 10px 15px;
    border-radius: 10px;

    .referral-link {
    }
  }
}
</style>
