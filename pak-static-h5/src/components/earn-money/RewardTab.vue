<template>
  <div class="reward-wrapper">
    <div class="earn-money-pots">
      <div class="pot-item">
        <div class="item-amount">
          RS {{ getRewardAmount("ONE_TIME") + getRewardAmount("DEPOSIT") + getRewardAmount("BET") }}
        </div>
        <div class="item-desc">{{ $t("earnMoney.reward.myTotalIncome") }}</div>
        <div class="item-img"><img src="../../assets/images/earn-money/pot-item-01.png" /></div>
      </div>
      <div class="pot-item pot-item__2">
        <div class="item-amount">{{ memberDetail.totalRefer ? memberDetail.totalRefer : "0" }}</div>
        <div class="item-desc">{{ $t("earnMoney.reward.myTotalNumberOfInvites") }}</div>
        <div class="item-img"><img src="../../assets/images/earn-money/pot-item-02.png" /></div>
      </div>
    </div>
    <!-- banner.redirectUrl.includes("https://") -->
    <div class="earn-money-details-grid">
      <div class="details-item" v-if="isShowOnetime">
        <div class="item-amount">
          Rs
          <span>{{ getRewardAmount("ONE_TIME") }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.invite") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-01.png" /></div>
      </div>

      <div class="details-item" v-if="isShowDeposit">
        <div class="item-amount">
          Rs
          <span>{{ getRewardAmount("DEPOSIT") }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.topUp") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-02.png" /></div>
      </div>

      <div class="details-item details-item" v-if="isShowBet">
        <div class="item-amount">
          Rs
          <span>{{ getRewardAmount("BET") }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.bet") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-03.png" /></div>
      </div>

      <div class="details-item details-item">
        <div class="item-amount">
          <span>{{ memberDetail.eligibleRefer ? memberDetail.eligibleRefer : "0" }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.eligibleRefer") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-04.png" /></div>
      </div>

      <!-- <pre>memberDetail{{ memberDetail }}</pre> -->

      <!-- <div class="details-item">
          <div class="item-amount">
            Rs
            <span>0</span>
          </div>
          <div class="item-title">Achievement</div>
          <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-04.png" /></div>
        </div> -->
    </div>

    <div class="earn-money-invite">
      <div class="invite-title">{{ $t("earnMoney.reward.inviteFriendsViaLink") }}</div>
      <div class="invite-desc">{{ $t("earnMoney.reward.howToGetInvitationBonus") }}</div>

      <div class="invite-listing">
        <div class="listing-item">
          <span class="list-num">1</span>
          {{ $t("earnMoney.reward.inviteList_01") }}
        </div>

        <div class="listing-item">
          <span class="list-num">2</span>
          {{ $t("earnMoney.reward.inviteList_02") }}
        </div>

        <div class="listing-item">
          <span class="list-num">3</span>
          {{ $t("earnMoney.reward.inviteList_03") }}
        </div>
      </div>

      <div class="invite-share-link">
        <div class="link-href">{{ selfTgurl }}</div>
        <div class="link-copy" @click="copyHrefLink">{{ $t("earnMoney.reward.copyLink") }}</div>
      </div>

      <div class="invite-share-social">
        <a
          class="social-item"
          :href="`https://wa.me/?text=${encodeURIComponent($t('earnMoney.reward.shareText', { url: selfTgurl }))}`"
          target="_blank"
        >
          <img src="../../assets/images/earn-money/social-whatsapp.png" />
        </a>
        <a
          class="social-item"
          :href="`instagram://sharesheet?text=${encodeURIComponent(
            $t('earnMoney.reward.shareText', { url: selfTgurl })
          )}`"
          target="_blank"
        >
          <img src="../../assets/images/earn-money/social-instagram.png" />
        </a>
        <a class="social-item" @click="handleShareToTikTok(selfTgurl)">
          <img src="../../assets/images/earn-money/social-tiktok.png" />
        </a>
        <a ref="tiktokRef" href="tiktok://" target="_blank" :style="{ display: 'none' }" />
        <a class="social-item" @click="modalSocialShare = true">
          <img src="../../assets/images/earn-money/social-more.png" />
        </a>
      </div>
    </div>

    <div class="earn-money-friendcount">
      <table border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <tr>
          <td style="color: #8c968f; font-size: 120%">{{ $t("earnMoney.reward.friendCount") }}</td>
          <td style="color: #8c968f; font-size: 120%">{{ $t("earnMoney.reward.inviteBonus") }}</td>
        </tr>

        <template v-for="(item, index) in oneTimeBonusSetting.settingList" :key="index">
          <tr>
            <td>{{ item.minReferCount }} ~ {{ item.maxReferCount }}</td>
            <td>{{ store.currency.value }} {{ item.bonusAmount }}</td>
          </tr>
        </template>
      </table>

      <div class="table-hint q-pa-md">{{ $t("earnMoney.reward.eligibility_tips") }}</div>
    </div>

    <div class="earn-money-sent-ytd">
      <div class="sent-ytd-icon">
        <img src="../../assets/images/earn-money/sent-ytd-icon.png" />
      </div>

      <div class="sent-ytd-amount">
        {{ $t("earnMoney.reward.totalAmountSentAsOfYesterday") }}
        <span>{{ oneTimeBonusSetting.totalAmount }}</span>
      </div>
    </div>

    <!-- <div class="earn-money-friendcount">
        <table border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
          <tr>
            <td style="color: #8c968f; font-size: 120%">Player</td>
            <td style="color: #8c968f; font-size: 120%">Money</td>
          </tr>

          <template v-if="latestInvitees.records && latestInvitees.records.length === 0">
            <tr>
              <td colspan="2">No Records</td>
            </tr>
          </template>
          <template v-else>
            <template v-for="(item, index) in latestInvitees.records" :key="index">
              <tr>
                <td>
                  <div class="player-details">
                    <img src="../../assets/images/earn-money/profile-img-1.png" width="30" />
                    {{ item.loginName }}
                  </div>
                </td>
                <td>{{ store.currency.value }} {{ item.finalAmount }}</td>
              </tr>
            </template>
          </template>
        </table>
      </div> -->

    <div class="earn-money-friendcount">
      <table border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <tr>
          <td style="color: #8c968f; font-size: 120%; width: 60%">{{ $t("earnMoney.reward.player") }}</td>
          <td style="color: #8c968f; font-size: 120%; width: 40%">{{ $t("earnMoney.reward.money") }}</td>
        </tr>
      </table>
      <div class="table-container" ref="tableContainer">
        <table border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
          <template v-if="inviteesRecords && inviteesRecords.length === 0">
            <tr>
              <td colspan="2">{{ $t("notify.noRecord") }}</td>
            </tr>
          </template>
          <template v-else>
            <template v-for="(item, index) in inviteesRecords" :key="index">
              <tr>
                <td style="width: 60%">
                  <div class="player-details">
                    <img :src="getRandomImage(index)" width="30" />
                    {{ item.loginName }}
                  </div>
                </td>
                <td style="width: 40%">{{ store.currency.value }} {{ item.finalAmount }}</td>
              </tr>
            </template>
          </template>
        </table>
      </div>
    </div>

    <q-dialog width="100%" v-model="modalSocialShare" presistent>
      <div class="popout-dialog">
        <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />

        <div class="popout-dialog-container">
          <div class="txt-title">Share and Earn</div>
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
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { copyToClipboard, useQuasar } from "quasar";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const store = userStore();
const { t } = useI18n();

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

const oneTimeBonusSetting = ref([]);
const memberDetail = ref([]);
const activeSetting = ref([]);
const latestInvitees = ref([]);
const inviteesRecords = ref([]);
let currentIndex = 0;
let intervalId = null;

const getOneTimeBonusSetting = () => {
  api
    .get("/session/refer-rebate/one-time-bonus-setting")
    .then((response) => {
      if (response.code === 0) {
        oneTimeBonusSetting.value = response.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getMemberDetail = () => {
  api
    .get("/session/refer-rebate/member-detail")
    .then((response) => {
      if (response.code === 0) {
        memberDetail.value = response.data;
        activeSetting.value = response.data.activeSetting;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getLatestInvitees = () => {
  api
    .get("/session/refer-rebate/latest-invitees")
    .then((response) => {
      if (response.code === 0) {
        latestInvitees.value = response.data;

        inviteesRecords.value = response.data.records;
        inviteesRecords.value.push(...inviteesRecords.value);
        inviteesRecords.value.push(...inviteesRecords.value);
        inviteesRecords.value.push(...inviteesRecords.value);
        inviteesRecords.value.push(...inviteesRecords.value);
        // startDisplayingRows();
        // setTimeout(startDisplayingRows, 10000);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const selfTgurl = ref("");
const waUrl = ref("");
const tiktokRef = ref();
const youtubeRef = ref();

const getRewardAmount = (type) => {
  const rewards = memberDetail.value.rewardAmountByType;
  if (rewards && Array.isArray(rewards)) {
    const reward = rewards.find((reward) => reward.rewardType === type);
    return reward ? reward.totalAmount : 0;
  }
  return 0;
};

const startDisplayingRows = () => {
  // Display the first item initially
  if (currentIndex === 0) {
    currentIndex++;
  }

  intervalId = setInterval(() => {
    if (currentIndex < inviteesRecords.value.length) {
      inviteesRecords.value.unshift(inviteesRecords.value[10]);
      currentIndex++;
    } else {
      clearInterval(intervalId);
      currentIndex = 0;
      // startDisplayingRows(); // Restart the loop
    }
  }, 2000);
};

const tableContainer = ref(null);

const startAutoScroll = () => {
  const container = tableContainer.value;
  const rowHeight = container.querySelector("tr").offsetHeight;
  let scrollPosition = 0;

  setInterval(() => {
    scrollPosition += 46;
    if (scrollPosition >= container.scrollHeight) {
      // scrollPosition = 0; // Reset scroll position if we reach the bottom
      // startDisplayingRows();
      // inviteesRecords.value.unshift(inviteesRecords.value);
      // getLatestInvitees();
    }
    container.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });
  }, 2000); // Adjust the interval as needed
};

const isShowOnetime = ref(false);
const isShowDeposit = ref(false);
const isShowBet = ref(false);

const checkIsShowDetail = () => {
  isShowOnetime.value = activeSetting.value.includes("ONE_TIME");
  isShowDeposit.value = activeSetting.value.includes("DEPOSIT");
  isShowBet.value = activeSetting.value.includes("BET");
};

const getRandomImage = (index) => {
  const randomNumber = (index % 10) + 1; // Ensures a number between 1 and 10
  return require(`../../assets/images/earn-money/profile-img-${randomNumber}.png`);
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

// const profileImagePath = computed(() => {
//   return require(`../../assets/images/account/${randomProfileImg.value}.png`);
// });

const modalSocialShare = ref(false);

onMounted(() => {
  getOneTimeBonusSetting();
  getMemberDetail();
  getLatestInvitees();
  startAutoScroll();
  checkIsShowDetail();

  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.h5Url;
  }

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) {
      selfTgurl.value = tgDomain + "refer/" + res.data;
    }
  });
});

watch(activeSetting, checkIsShowDetail);

// onUnmounted(() => {
//   clearInterval(scrollInterval.value);
// });
</script>
<style scoped lang="scss">
.reward-wrapper {
  .earn-money-pots {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .pot-item {
      background-image: url("../../assets/images/earn-money/pot-bg-01.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      display: flex;
      gap: 4px;
      flex-direction: column;
      padding: 28px 20px;
      border-radius: 8px;
      position: relative;

      &__2 {
        background-image: url("../../assets/images/earn-money/pot-bg-02.png");
      }

      .item-amount {
        color: #ffffff;
        font-size: 24px;
        line-height: 1;
        font-weight: bold;
      }

      .item-desc {
        color: #ffffff99;
        font-size: 12px;
      }

      .item-img {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);

        img {
          display: block;
          width: 100%;
          max-width: 160px;
        }
      }
    }
  }

  .earn-money-details-grid {
    display: flex;
    // grid-template-columns: repeat(2, 1fr);
    // grid-gap: 12px;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;

    .details-item {
      display: flex;
      width: calc(50% - 6px);
      flex-direction: column;
      min-height: 100px;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      position: relative;

      &__full {
        width: 100%;
      }

      .item-amount {
        span {
          font-size: 24px;
          font-weight: bold;
          color: #70bc62;
        }
      }

      .item-title {
        font-size: 16px;
        color: #8c968f;
      }

      .item-icon {
        position: absolute;
        top: 12px;
        left: 12px;

        img {
          display: block;
          width: 24px;
        }
      }
    }
  }

  .earn-money-invite {
    background-color: rgba(255, 255, 255, 0.05);
    margin-top: 16px;
    border-radius: 10px;
    padding: 16px;

    .invite-title {
      font-size: 22px;
      color: #ffffff;
      font-weight: bold;
    }
    .invite-desc {
      font-size: 16px;
      color: #8c968f;
    }

    .invite-listing {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .listing-item {
        border: 1px solid #ffffff0d;
        background-color: rgba(255, 255, 255, 0.02);
        border-radius: 12px;
        display: flex;
        padding: 8px 16px;
        align-items: center;
        line-height: 1;
        gap: 12px;
        color: #8c968f;

        span.list-num {
          width: 14px;
          font-size: 24px;
          color: #ffd600;
          font-weight: bold;
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
  }

  .earn-money-friendcount {
    margin-top: 16px;
    width: 100%;
    .table-container {
      max-height: 181px;
      overflow-y: auto;
      position: relative;
      pointer-events: none;

      tr:first-child {
        position: relative;

        // &:after {
        //   content: "";
        //   background: #0e1311;
        //   width: 100%;
        //   height: 100%;
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   opacity: 0;
        //   animation: blink 1.1s infinite;
        // }
      }
    }
    .table-container::-webkit-scrollbar {
      display: none; /* Hide scrollbar for better aesthetics */
    }
    table {
      tr {
        &:nth-child(even) {
          background: #ffffff0d;
        }

        .player-details {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        td:last-child {
          color: #70bc62;
        }
      }
    }
  }

  // .earn-money-friendcount {
  //   margin-top: 16px;
  //   width: calc(100% + 40px);
  //   margin-left: -20px;
  //   margin-right: -20px;
  //   table {
  //     tr {
  //       &:nth-child(even) {
  //         background: #ffffff0d;
  //       }

  //       .player-details {
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         gap: 8px;
  //       }

  //       td:last-child {
  //         color: #70bc62;
  //       }
  //     }
  //   }
  // }

  .table-hint {
    color: #8c968f;
    text-align: center;
  }

  .earn-money-sent-ytd {
    margin-top: 16px;
    background: #ffffff0d;
    padding: 8px 16px;
    border-radius: 12px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 16px;

    .sent-ytd-icon {
      img {
        display: block;
        max-width: 80px;
        width: 100%;
      }
    }

    .sent-ytd-amount {
      color: #8c968f;
      font-size: 14px;
      span {
        display: block;
        width: 100%;
        color: #ffd600;
        font-size: 140%;
        font-weight: bold;
        background: #ffffff05;
        text-align: center;
        padding: 2px;
        margin-top: 8px;
        border: 1px solid #ffffff0d;
        border-radius: 8px;
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

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
