<template>
  <q-dialog
    width="100%"
    style="padding-bottom: env(safe-area-inset-bottom)"
    :modelValue="modelValue"
    presistent
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <div class="player-guide">
      <div class="svc">
        <a class="cs-icon cs" :href="ui.CSAUrl" target="_blank">
          <img src="../../assets/images/newplayerguide/service.png" />
          <span class="svc-txt">{{ $t("playerGuide.service") }}</span>
        </a>
      </div>
      <div class="close-dialog" @click="closeDialog">
        <img src="../../assets/images/newplayerguide/close-btn.png" />
      </div>
      <template :key="index" v-for="(step, index) in steps">
        <div class="step" :class="`step-${index + 1}`" v-if="currentStep === (index + 1).toString()">
          <div class="top">
            <img :src="require(`../../assets/images/newplayerguide/step-top-${index + 1}.png`)" />
            <div class="title">{{ step.title }}</div>
          </div>
          <div class="main-box">
            <div class="inner" v-if="!isVideo">
              <div v-if="index + 1 === 1" class="language" @click="gotoLang()">
                {{ $t("sideNav.language") }}
                <span class="pen"><img src="../../assets/images/newplayerguide/edit.png" /></span>
              </div>

              <div v-if="index + 1 === 6" class="congrats-step">
                <div class="txt">{{ step.instruction }}</div>
                <div class="amt">RS {{ step.earnableAmt }}</div>
              </div>
              <div v-else class="other-steps">
                <div class="midimg" v-if="index + 1 === 1 || index + 1 === 2">
                  <img :src="require(`../../assets/images/newplayerguide/step-mid-${index + 1}.png`)" />
                </div>
                <div class="mid-content" :class="{ show: index + 1 === 4 }">
                  <div class="ins">{{ step.instruction }}</div>
                  <div class="amt">{{ step.earnableAmt }}RS</div>
                </div>
              </div>
              <div v-if="index + 1 === 1">
                <div class="welcome">
                  {{ t("playerGuide.welcomeMessage") }}
                  <span class="yellow">B9GAME!</span>
                  {{ t("playerGuide.teachingHowToEarn") }}
                  <!-- Welcome to <span class="yellow">B9GAME!</span> Let us teach you how to make money easily! -->
                </div>
              </div>

              <div v-if="index + 1 === 2">
                <div class="hotgames">
                  <img class="abs-line" src="../../assets/images/newplayerguide/line-hot-1.png" />
                  <div class="abs-box"></div>
                  <div class="hottitle">
                    <img src="../../assets/images/newplayerguide/hotgameicon.png" />
                    <span>{{ t("playerGuide.hotGames") }}</span>
                  </div>
                  <div class="hotitems">
                    <div class="hotitem" v-for="i in 3" :key="i">
                      <span class="hot"><img src="../../assets/images/newplayerguide/tophot.png" /></span>
                      <img
                        @click="showVideo(index, i)"
                        :src="require(`../../assets/images/newplayerguide/hot-0${i}.png`)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="index + 1 === 3">
                <div>
                  <div class="deposit-section">
                    <div class="deposititems">
                      <div class="deposititem" v-for="i in 3" :key="i">
                        <img :src="require(`../../assets/images/newplayerguide/deposit-0${i}.png`)" />
                      </div>
                    </div>
                  </div>
                  <div class="deposit-steps">
                    <div class="dep-step">
                      <img src="../../assets/images/newplayerguide/step-01.png" />
                      {{ $t("playerGuide.bankTransfer") }}
                    </div>
                    <div class="dep-step">
                      <img src="../../assets/images/newplayerguide/step-02.png" />
                      Easypaisa/JazzCash
                    </div>
                    <div class="dep-step">
                      <img src="../../assets/images/newplayerguide/step-03.png" />
                      USDT {{ $t("playerGuide.digitalCurrency") }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="index + 1 === 4">
                <div class="share-steps">
                  <div class="share-step">
                    <img src="../../assets/images/newplayerguide/step-01.png" />
                    <div>
                      {{ t("playerGuide.maxReward") }}
                      <span class="yellow">1000</span>
                      {{ t("playerGuide.rs") }}
                    </div>
                  </div>

                  <div class="share-step">
                    <img src="../../assets/images/newplayerguide/step-02.png" />
                    <div>
                      <span class="yellow">5%</span>
                      {{ t("playerGuide.extraBonus") }}
                    </div>
                  </div>

                  <div class="share-step">
                    <img src="../../assets/images/newplayerguide/step-03.png" />
                    <div>
                      {{ t("playerGuide.lifetimeCommission") }}
                      <span class="yellow">0.6%</span>
                      {{ t("playerGuide.commissionDetails") }}
                    </div>
                  </div>
                </div>

                <div class="invite-share-link">
                  <div class="link-href">{{ selfTgurl }}</div>
                  <div class="link-copy" @click="copyHrefLink">{{ $t("earnMoney.reward.copyLink") }}</div>
                </div>
              </div>

              <div v-if="index + 1 === 5">
                <div class="withdraw-section">
                  <div class="withdrawitems">
                    <div class="withdrawitem" v-for="i in 3" :key="i">
                      <img :src="require(`../../assets/images/newplayerguide/withdraw-0${i}.png`)" />
                    </div>
                  </div>
                </div>
                <div class="withdraw-steps">
                  <div class="withdraw-step">
                    <img src="../../assets/images/newplayerguide/step-01.png" />
                    {{ $t("playerGuide.bankAccountWithdrawal") }}
                  </div>
                  <div class="withdraw-step">
                    <img src="../../assets/images/newplayerguide/step-02.png" />
                    Easypaisa/JazzCash
                  </div>
                  <div class="withdraw-step">
                    <img src="../../assets/images/newplayerguide/step-03.png" />
                    USDT {{ $t("playerGuide.digitalCurrencyWithdrawal") }}
                  </div>
                </div>
                <ul class="note">
                  <li>
                    {{ t("playerGuide.arrivalTime") }}
                    <span class="yellow">5-30</span>
                    {{ t("playerGuide.minutes") }}
                  </li>
                  <li>{{ t("playerGuide.successfulWithdrawal") }}</li>
                </ul>
              </div>
            </div>
            <div v-if="!isVideo && step.video" @click="showVideo(index)" class="videolink">
              <img src="../../assets/images/newplayerguide/video.png" />
              {{ step.video }}
            </div>

            <div v-if="isVideo" class="video-portion">
              <span
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
                  align-items: flex-end;
                  margin: 5px auto;
                  cursor: pointer;
                "
                @click="isVideo = !isVideo"
              >
                {{ $t("btn.close") }}
              </span>
              <video width="100%" height="100%" controls>
                <source v-if="index + 1 === 3" :src="`${videoUrl}how_to_deposit_668mnf.mp4`" type="video/mp4" />
                <source
                  v-if="index + 1 === 2 && selectedGame === '7up7down'"
                  :src="`${videoUrl}how_to_play_7up7down_668mnf.mp4`"
                  type="video/mp4"
                />
                <source
                  v-if="index + 1 === 2 && selectedGame === 'aviator'"
                  :src="`${videoUrl}how_to_play_aviator_668mnf.mp4`"
                  type="video/mp4"
                />
                <source
                  v-if="index + 1 === 2 && selectedGame === 'mines'"
                  :src="`${videoUrl}how_to_play_mines_668mnf.mp4`"
                  type="video/mp4"
                />
                <source v-if="index + 1 === 4" :src="`${videoUrl}how_to_refer_668mnf.mp4`" type="video/mp4" />
                <source v-if="index + 1 === 5" :src="`${videoUrl}how_to_withdraw_668mnf.mp4`" type="video/mp4" />
                {{ $t("playerGuide.noSupport") }}
              </video>
              <!-- <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dRPcJyisLUI?si=ok64lVuE9jWtcnGr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> -->
            </div>
            <div class="buttons">
              <div class="bottom-button" @click="runInnerSteps(index + 1)">
                <!--              <span v-if="index + 1 === 4">-->
                <!--                <img src="../../assets/images/newplayerguide/share-icon.png" />-->
                <!--              </span>-->
                {{ step.buttonTxt }}
              </div>
              <div class="next-button" @click="nextDialog(index + 1, true)">
                {{ $t("playerGuide.next") }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </q-dialog>

  <!-- Sticky Bottom Panel -->
  <q-dialog v-model="isBottomShareDialog" transition-show="fade" transition-hide="fade">
    <div class="dialog-wrapper">
      <q-card class="bottom-panel">
        <q-card-section class="row justify-center">
          <div class="share-icons">
            <a
              class="social-item"
              :href="`https://wa.me/?text=${encodeURIComponent($t('earnMoney.reward.shareText', { url: selfTgurl }))}`"
              target="_blank"
            >
              <img src="../../assets/images/newplayerguide/whatsapp-icon.png" />
            </a>
            <a
              class="social-item"
              :href="`instagram://sharesheet?text=${encodeURIComponent(
                $t('earnMoney.reward.shareText', { url: selfTgurl })
              )}`"
              target="_blank"
            >
              <img src="../../assets/images/newplayerguide/insta-icon.png" />
            </a>
            <a class="social-item" @click="handleShareToTikTok(selfTgurl)">
              <img src="../../assets/images/newplayerguide/tiktok-icon.png" />
            </a>
            <a ref="tiktokRef" href="tiktok://" target="_blank" :style="{ display: 'none' }" />
            <a class="social-item" @click="modalSocialShare = true">
              <img src="../../assets/images/newplayerguide/social-more.png" />
            </a>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="modalSocialShare" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />

      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("playerGuide.shareandearn") }}</div>
        <!-- <div class="txt-content q-mt-md text-center">Share and Earn</div> -->
        <div class="modal-invite-share-social">
          <a class="social-item" @click="handleShareToYoutube(selfTgurl)">
            <img src="../../assets/images/earn-money/social-youtube.png" />
          </a>
          <a class="social-item" @click="handleShareToFacebookPost(selfTgurl)">
            <img src="../../assets/images/earn-money/social-facebook.png" />
          </a>
          <a class="social-item" @click="handleShareToSMS(selfTgurl)">
            <img src="../../assets/images/earn-money/social-sms.png" />
          </a>
          <a class="social-item" @click="handleShareToEmail(selfTgurl)">
            <img src="../../assets/images/earn-money/social-email.png" />
          </a>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { useUI } from "stores/ui";
import { ref, defineExpose, watch, toRefs, onMounted, computed } from "vue";
import { api, eventapi } from "src/boot/axios";
import { userStore } from "stores/index";
import { copyToClipboard, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { convertToCommaAmount } from "src/boot/utils";
import { useRouter } from "vue-router";
import { useCustomerTrigger } from "src/hooks/trigger";
import lang from "src/boot/lang";

const store = userStore();
const $q = useQuasar();
const ui = useUI();
const { t } = useI18n();
const router = useRouter();
const emit = defineEmits(["update:modelValue", "update:currentStep", "update:showSteps", "update:runAviator"]);

const videoUrl = process.env.IMAGE_CDN + "/media/pak/";
const selectedGame = ref();
const showVideo = (i, vidIndex) => {
  isVideo.value = !isVideo.value;
  if (i + 1 === 2) {
    const gameOptions = ["aviator", "mines", "7up7down"];
    let randomIndex = Math.floor(Math.random() * gameOptions.length);

    if (vidIndex) {
      randomIndex = vidIndex - 1;
    }
    selectedGame.value = gameOptions[randomIndex];
  }
};
const props = defineProps(["modelValue", "currentStep"]);
const { modelValue, currentStep } = toRefs(props);
const isBottomShareDialog = ref(false);
// Define the steps
// const steps = [
//   { title: "Welcome!", instruction: "Complete registration and log in successfully", earnableAmt: "10", buttonTxt: "START NOW", video: "" },
//   { title: "Hot Games", instruction: "Experience the game and try it out without recharging", earnableAmt: "10", buttonTxt: "TRY IT OUT", video: "Watch the game tutorial video" },
//   { title: "Recharging", instruction: "After recharging, download the app and log in to get 28 extra bonuses", earnableAmt: "28", buttonTxt: "DEPOSIT NOW", video: "Deposit Tutorial" },
//   { title: "Invite Friends", instruction: "Invite 1 person and get a reward of 250 RS (maximum 1000 RS/person)", earnableAmt: "250", buttonTxt: "SHARE NOW" },
//   { title: "Withdrawal", instruction: "Unlock subsequent invitation reward tasks", earnableAmt: "250", buttonTxt: "WITHDRAW NOW", video: "Withdraw Tutorial" },
//   { title: "Congratulations!", instruction: "Congratulations on completing the novice mission!", earnableAmt: "1000", buttonTxt: "START GAME", video: "Watch the expert gameplay guide" },
// ];
const steps = computed(() => [
  {
    title: t("playerGuide.welcome"),
    instruction: t("playerGuide.completeRegistration"),
    earnableAmt: "10",
    buttonTxt: t("playerGuide.startNow"),
    video: ""
  },
  {
    title: t("playerGuide.hotGames"),
    instruction: t("playerGuide.experienceGame"),
    earnableAmt: "10",
    buttonTxt: t("playerGuide.tryItOut"),
    video: t("playerGuide.watchGameTutorial")
  },
  {
    title: t("playerGuide.recharging"),
    instruction: t("playerGuide.rechargeDownloadApp"),
    earnableAmt: "28",
    buttonTxt: t("playerGuide.depositNow"),
    video: t("playerGuide.depositTutorial")
  },
  {
    title: t("playerGuide.inviteFriends"),
    instruction: t("playerGuide.inviteReward"),
    earnableAmt: "250",
    // buttonTxt: t("playerGuide.tryItOut"),
    buttonTxt: t("playerGuide.shareNow"),
    video: t("playerGuide.referTutorial")
  },
  {
    title: t("playerGuide.withdrawal"),
    instruction: t("playerGuide.unlockTasks"),
    earnableAmt: "250",
    buttonTxt: t("playerGuide.withdrawNow"),
    video: t("playerGuide.withdrawTutorial")
  }
  // { title: t('playerGuide.congratulations'), instruction: t('playerGuide.completeNoviceMission'), earnableAmt: "1000", buttonTxt: t('playerGuide.startGame'), video: t('playerGuide.expertGameplayGuide') },
]);
const isVideo = ref(false);

const gotoLang = () => {
  router.push("/language");
  localStorage.setItem(`completedlangguide`, JSON.stringify(true));
  setTimeout(() => {
    nextDialog(1);
  }, 100); // You can adjust this timeout if needed
};

// const afterMounted = useCustomerTrigger(loadCustomerAddress);
//
// const loadCustomerAddress = () => {
//   cached
//     .get("customerAddress", () =>
//       api.get("/config/customerAddress/v2").then((res) => {
//         return res;
//       })
//     )
//     .then((data) => {
//       console.log(data);
//       var url = data.liveUrl1;
//       ui.CSAUrl = url;
//
//       if (data.studioUrl) {
//         var lvUrl = data.studioUrl;
//         ui.LiveUrl = lvUrl;
//         isLiveUrlShow.value = true;
//
//         csDragPos.value = [10, 70];
//       }
//     });
// };
const runInnerSteps = (index) => {
  if (index === 1) {
    nextDialog(index);
  } else if (index === 2) {
    nextDialog(index);
    // emit("update:modelValue", false);
    // emit("update:showSteps", index);
  } else if (index === 3) {
    emit("update:showSteps", index);
  } else if (index === 4) {
    // emit("update:showSteps", index);
    isBottomShareDialog.value = true;
  } else if (index === 5) {
    emit("update:showSteps", index);
  }
};
const closeDialog = () => {
  let nextStep = "END";
  // Update localStorage
  localStorage.setItem("newPlayerGuide", nextStep);

  // Emit the updated step to the parent component
  emit("update:modelValue", false); // Close the dialog
  emit("update:currentStep", nextStep); // Pass the next step to the parent component
};
// Close the dialog and move to the next step
const nextDialog = (index, goNext) => {
  if (isVideo.value === false) {
    const gameOptions = ["aviator", "mines", "7up7down"];
    const randomIndex = Math.floor(Math.random() * gameOptions.length);
    selectedGame.value = gameOptions[randomIndex];
  }
  isVideo.value = false;
  if (goNext === true) {
    if (index === 3) {
      localStorage.setItem(`completeddepositguide`, JSON.stringify(true));
      emit("update:showSteps", 4);
    }
    setTimeout(() => {
      emit("update:modelValue", true); // Open the dialog again
    }, 100);
  } else {
    if (index === 2) {
      emit("update:runAviator", selectedGame.value);
    } else if (index === 3) {
      router.push("/deposit");
    } else if (index === 5) {
      router.push("/withdraw");
    } else if (index === 4) {
      isBottomShareDialog.value = true;
      return;
    } else {
      setTimeout(() => {
        emit("update:modelValue", true); // Open the dialog again
      }, 100); // You can adjust this timeout if needed
    }
  }

  let nextStep = (Number(currentStep.value) + 1).toString();
  if (Number(currentStep.value) === 5) {
    nextStep = "END";
  }

  // Update localStorage
  localStorage.setItem("newPlayerGuide", nextStep);

  // Emit the updated step to the parent component
  emit("update:modelValue", false); // Close the dialog
  emit("update:currentStep", nextStep); // Pass the next step to the parent component

  // Optionally, trigger the dialog to open to the next step
};
// Share

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
      message: "Clipboard API not supported, using fallback method.",
      color: "negative",
      position: "top",
      timeout: 2000,
    });
    fallbackCopyTextToClipboard(textToCopy);
  }
};
const selfTgurl = ref("");
const waUrl = ref("");
const tiktokRef = ref();
const youtubeRef = ref();

const handleShareToTikTok = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  copyToClipboard(shareText);
  tiktokRef.value.click();
};

const handleShareToYoutube = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  // const youtubeShareUrl = `https://www.youtube.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
  //   shareText
  // )}`;
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

const modalSocialShare = ref(false);

const completedDepoGuide = JSON.stringify(localStorage.getItem("completeddepositguide"));
const completedReferGuide = JSON.stringify(localStorage.getItem("completeddreferguide"));

watch(
  () => modelValue.value,
  (newValue) => {
    if (completedDepoGuide === "true") {
      if (completedReferGuide !== "true") {
        emit("update:showSteps", 4);
      }
    }
  },
  { immediate: true }
);
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
});
defineExpose({ showVideo });
</script>
<style lang="scss" scoped>
.bottom-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  height: 120px;
  background: #131313;
  padding: 40px 10px 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  border-radius: 12px 12px 0 0;
  margin: 0;
  &:before {
    content: "";
    position: absolute;
    top: 4px;
    left: 0;
    right: 0;
    border-radius: 8px;
    width: 100px;
    height: 5px;
    margin: 10px auto;
    background: #2a2a2a;
  }
  .share-icons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    width: 90%;
    margin: 0 auto;
    img {
      width: 50px;
    }
  }
}

.player-guide {
  width: 85%;
  // overflow: unset;
  max-width: 460px;
  margin: 0 auto;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  .close-dialog {
    position: absolute;
    right: 0;
    top: 0;
    width: 5vh;
    cursor: pointer;
    z-index: 99;
    img {
      width: 100%;
    }
  }
  .svc {
    position: absolute;
    top: 50px;
    right: 0;
    width: 10vh;
    max-width: 65px;
    z-index: 99;
    img {
      width: 100%;
    }
    a {
      position: relative;

      .svc-txt {
        position: absolute;
        bottom: 6px;
        color: #1dab98;
        -webkit-text-stroke: 0.5px white;
        right: 0;
        left: 0;
        margin: auto;
        text-align: center;
        font-family: "Poppins";
        font-weight: 900;
        letter-spacing: -1px;
      }
    }
  }
  .step {
    padding-bottom: 40px;
    width: 100%;
    // &.step-5 .top {
    //   width: 80%;
    //   margin: 0 auto;
    //   .title {
    //     bottom: 20px;
    //   }
    // }

    &.step-5 .main-box .withdraw-section .withdrawitems {
      width: 80%;
    }

    &.step-2 .main-box .other-steps .midimg {
      margin: -10px auto -35px;
    }
    &.step-2 .mid-content {
      margin-top: -30px;
    }
    &.step-1 .other-steps {
      margin-top: -15px;
    }
    .top {
      width: 100%;
      position: relative;
      z-index: 1;
      .title {
        position: absolute;
        font-family: Inter;
        font-weight: 700;
        // font-size: 5.6vw;
        font-size: 25px;
        line-height: 30px;
        // line-height: 71.12px;
        text-align: center;
        color: #ffffff;
        text-shadow: -1px -1px 0 #215f25, 1px -1px 0 #215f25, -1px 1px 0 #215f25, 1px 1px 0 #215f25;
        text-transform: uppercase;
        bottom: 14%;
        width: 80%;
        margin: 0 auto;
        left: 0;
        right: 0;

        @media screen and (min-width: 500px) {
          bottom: 17%;
          font-size: 30px;
        }
      }
      img {
        width: 100%;
      }
    }
    .main-box {
      .inner {
        width: 100%;
      }
      background: linear-gradient(325.86deg, rgba(14, 30, 8, 0.85) 5.38%, rgba(27, 96, 38, 0.85) 98.11%);
      box-shadow: 0px 0px 37.43px 0px #b479ff40 inset;
      backdrop-filter: blur(10px);
      border: 1px solid #24ee89;
      padding: 25px 10px 15px;
      // margin: -45px auto 0;
      margin: -30px auto 0;
      border-radius: 16px;
      display: flex;
      // gap: 15px;
      > div:not(:last-child) {
        margin-bottom: 15px;
      }
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 85%;
      .congrats-step {
        display: flex;
        flex-direction: column;
        gap: 0px;
        justify-content: center;
        align-items: center;
        padding-top: 30px;

        .txt {
          color: #90e974;
          font-family: Poppins;
          font-weight: 700;
          font-size: 2.4vh;
          line-height: 3.4vh;
          letter-spacing: 0%;
          text-align: center;
          text-shadow: 0px 4px 4px #00000040;
          @media screen and (min-width: 500px) {
            font-size: 2.5vh;
            line-height: 4.2vh;
          }
        }
        .amt {
          height: 14vh;
          background: url(../../assets/images/newplayerguide/present.png) no-repeat center center;
          background-size: contain;
          width: 80%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Poppins;
          font-weight: 700;
          font-size: 3.5vh;
          line-height: 2.5vh;
          letter-spacing: 0%;
          text-align: center;
          text-shadow: 0px 4px 4px #00000040;
          padding-left: 10vh;
        }
      }
      .other-steps {
        .midimg {
          text-align: center;
          width: 35vh;
          margin: 0 auto;
          max-width: 100%;
          margin-bottom: -20px;
          img {
            width: 90%;
            margin: 0 auto;
          }
        }
        .mid-content {
          min-height: 45px;
          background: linear-gradient(
            270deg,
            rgba(69, 181, 121, 0) 0%,
            rgba(69, 181, 121, 0.5) 46.5%,
            rgba(69, 181, 121, 0) 100%
          );
          display: none;
          &.show {
            display: flex;
            margin-top: 15px;
          }
          justify-content: center;
          align-items: center;
          padding: 5px;
          gap: 5px;
          font-family: Poppins;
          font-weight: 700;
          .ins {
            color: #90e974;
            font-size: 1.5vh;
            line-height: 1.8vh;
          }
          .amt {
            color: #ffc664;

            font-size: 2vh;
            line-height: 2.5vh;
          }
        }
      }
      .language {
        cursor: pointer;
        width: 160px;
        position: relative;
        box-shadow: 0px 4px 4px 0px #00000040;
        background: #ffffff4d;
        padding: 5px 10px 5px 15px;
        border-radius: 15px;
        display: flex;
        gap: 5px;
        margin-left: auto;
        // margin-top: 30px;

        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
        z-index: 999;
        .pen {
          width: 35px;
          height: 35px;
          background: #7bb381;
          border-radius: 50%;
          border: 1px solid #1d7920;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            height: 90%;
          }
        }
      }
      .welcome {
        color: #caffd0;
        text-shadow: 0px 2px 0px #1d7920;
        .yellow {
          color: #ffc664;
        }
        font-family: "Poppins";
        font-weight: 900;
        font-size: 2vh;
        text-align: center;
        margin: 20px auto 0;
      }
      .hotgames {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // gap: 10px;
        > div:not(:last-child) {
          margin-bottom: 10px;
        }
        position: relative;
        .abs-line {
          position: absolute;
          // width: 33vh;
          // z-index: 9999;
          // top: 0px;
          // left: -10vh;
          width: 74%;
          z-index: 9999;
          top: 0px;
          left: -20%;
          pointer-events: none;
        }
        .abs-box {
          position: absolute;
          height: 66px;
          z-index: 9999;
          border-radius: 10px;
          width: 47%;
          margin: 0 auto;
          left: -29%;
          right: 0;
          top: 134%;
          border: 2px dotted #08f437;
          box-shadow: 0px 0px 20px 0px #00e60091;
          pointer-events: none;
          @media screen and (min-width: 500px) {
            top: 123%;
            width: 50%;
            height: 60px;
          }

          @supports (-webkit-touch-callout: none) {
            top: 30svh;
          }
        }
        .hottitle {
          // margin: 10px 0 0;
          // gap: 10px;
          // display: flex;
          // justify-content: flex-start;
          // align-self: flex-start;
          margin: 10px auto 0 0;
          font-weight: bold;
          img {
            max-width: 12px;
            margin-right: 10px;
          }
        }
        .hotitems {
          display: flex;
          justify-content: center;
          align-items: center;
          // gap: 10px;
          > div:not(:last-child) {
            margin-right: 10px;
          }
          .hotitem {
            position: relative;
            .watchTutorial {
              // position: absolute;
              // transform: translate(50%, 50%);
              // width: 100%;
              // top: 0;
              // bottom: 0;
              // margin: auto;
            }
            .hot {
              position: absolute;
              top: -5px;
              right: -5px;
              img {
                width: 30px;
              }
            }
            img {
              width: 100%;
            }
          }
        }
      }
      .deposit-section {
        .deposititems {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 90%;
          margin: 5px auto;
          // gap: 10px;
          > div:not(:last-child) {
          margin-right: 10px;
        }
          .deposititem {
            img {
              width: 100%;
            }
          }
        }
      }
      .deposit-steps {
        display: flex;
        flex-direction: column;
        // gap: 5px;
        width: 90%;
        margin: 0 auto;
        > div:not(:last-child) {
          margin-bottom: 5px;
        }
        .dep-step {
          display: flex;
          // gap: 10px;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 2.5vh;
            margin-right: 10px;
          }
        }
      }

      .share-steps {
        display: flex;
        flex-direction: column;
        margin: 10px auto;
        font-size: 12px;

        > * {
          margin-top: 5px;
        }
        .share-step {
          display: flex;
          > * {
            &:first-child {
              margin-right: 10px;
            }
          }
          justify-content: flex-start;
          align-items: flex-start;
          .yellow {
            color: #ffc664;
          }
          img {
            width: 2.5vh;
          }
        }
      }

      .invite-share-link {
        margin-top: 12px;
        background-color: #0f0b0b;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 0 auto;
        font-size: 12px;

        .link-href {
          padding: 5px 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 11px;
          // line-height: 40px;
          word-break: break-all;
          // height: 50px;
          height: 35px;
          line-height: 25px;
        }
        .link-copy {
          cursor: pointer;
          color: #0f0b0b;
          background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 120px;
          font-weight: bold;
          border-radius: 12px;
          letter-spacing: -1px;
          padding: 4px;
        }
      }

      .withdraw-section {
        .withdrawitems {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 90%;
          // margin: 20px auto;
          margin: 5px auto;
          // gap: 10px;
        
          > div:not(:last-child) {
            margin-right: 10px;
          }
          .withdrawitem {
            img {
              width: 100%;
            }
          }
        }
      }

      .note {
        margin: 0;
        padding: 0 0 0 25px;
        color: #ff0000;
        font-size: 1.5vh;
        line-height: 2vh;
        .yellow {
          color: #ffe500;
        }
      }
      .withdraw-steps {
        display: flex;
        flex-direction: column;
        // gap: 0px;
        margin: 5px auto;
        .withdraw-step {
          font-weight: bold;
          display: flex;
          font-size: 10px;
          // gap: 10px;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 2.5vh;
            margin-right: 10px;
          }
        }
      }
      .videolink {
        display: flex;
        justify-content: flex-end;
        align-self: flex-end;
        align-items: center;
        gap: 5px;
        color: #f3d235cc;
        border-bottom: 1px solid #f3d235cc;
        font-family: Poppins;
        font-weight: 700;
        // font-size: 1.5vh;
        // line-height: 2vh;
        font-size: 8px;
        line-height: 18px;
        padding-bottom: 5px;
        cursor: pointer;

        img {
          width: 15px;
        }
      }
      .video-portion {
        margin: 45px auto 0;
      }
      .step-no {
        color: #90e974;
        margin: 0px auto 15px;
        text-align: center;
      }
      .buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        // gap: 20px;
        :not(:last-child) {
          margin-right: 15px;
        }

      }
      .next-button {
        text-transform: uppercase;
        cursor: pointer;
        background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        padding: 10px;
        font-family: Poppins;
        font-weight: 700;
        // font-size: 2vh;
        // line-height: 2vh;
        padding: 15px 10px;
        font-size: 15px;
        line-height: 18px;
        // padding: 8px 30px;
        letter-spacing: 0px;
        text-align: center;
        color: #000000;
        border-radius: 8px;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
      .bottom-button {
        cursor: pointer;
        background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        padding: 10px;
        font-family: Poppins;
        font-weight: 700;
        // font-size: 2vh;
        // line-height: 2vh;
        padding: 15px 10px;
        font-size: 15px;
        line-height: 18px;
        // padding: 8px 30px;
        letter-spacing: 0px;
        text-align: center;
        color: #000000;
        border-radius: 8px;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        img {
          width: 25px;
        }
        &:after {
          position: absolute;
          content: "";
          background: url(../../assets/images/newplayerguide/finger.png) no-repeat center center;
          width: 10vh;
          background-size: contain;
          height: 10vh;
          bottom: 0;
          right: 0;
          z-index: 9999;
          animation: moveFinger 1.5s ease-in-out infinite;
          @media screen and (min-width: 400px) {
            width: 70px;
            height: 70px;
          }
        }

        @media screen and (min-width: 400px) {
          font-size: 16px;
        }
      }
    }
  }
}

/* Keyframe animation to simulate finger moving from bottom-right to top-left */
// @keyframes moveFinger {
//   0% {
//     bottom: -30px;  /* Start at the bottom-right */
//     right: 10px;   /* Start at the bottom-right */
//   }
//   25% {
//     bottom: -25px;  /* Move up slightly */
//     right: 15px;   /* Move left */
//   }
//   50% {
//     bottom: -20px;  /* Move further up */
//     right: 20px;   /* Move further left */
//   }
//   75% {
//     bottom: -10px;  /* Move up even further */
//     right: 25px;  /* Move left even further */
//   }
//   100% {
//     bottom: 0px;  /* End at top-left */
//     right: 30px;  /* End at top-left */
//   }
// }

/* Keyframe animation to simulate finger moving towards the button */
@keyframes moveFinger {
  0% {
    bottom: -4vh; /* Start position */
    right: -2vh; /* Start on the right */
  }
  25% {
    bottom: -4.5vh; /* Move up slightly */
    right: -1vh; /* Move left slightly (towards the center) */
  }
  50% {
    bottom: -5vh; /* Move up further */
    right: 0vh; /* Move further left */
  }
  75% {
    bottom: -4.5vh; /* Move back down slightly */
    right: -1vh; /* Move back to the center */
  }
  100% {
    bottom: -4vh; /* End position */
    right: -2vh; /* Back to the original position on the right */
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
