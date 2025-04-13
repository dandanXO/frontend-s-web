<template>
  <div class="tabs-lists">
    <div class="tab-button" :class="filterType === 'today' ? 'active' : ''" @click="selectByDayType('today')">
      {{ $t("records.bytoday") }}
    </div>
    <div class="tab-button" :class="filterType === 'yesterday' ? 'active' : ''" @click="selectByDayType('yesterday')">
      {{ $t("records.byyesterday") }}
    </div>
    <div class="tab-button" :class="filterType === 'all' ? 'active' : ''" @click="selectByDayType('all')">
      {{ $t("records.all") }}
    </div>
  </div>

  <q-inner-loading class="loading-spinner-div" :showing="isLoading">
    <q-spinner-gears size="50px" color="brightbtn" />
    <div class="label" style="color: #fff">Loading...</div>
  </q-inner-loading>

  <div class="reward-wrapper">
    <div class="earn-money-pots">
      <div class="pot-item">
        <div class="item-amount">
          RS {{ getRewardAmount("ONE_TIME") + getRewardAmount("DEPOSIT") + getRewardAmount("BET") }}
        </div>
        <div class="item-desc">{{ $t("earnMoney.reward.myTotalIncome") }}</div>
        <div class="item-img with-btn">
          <div class="flex-item">
            <!--          <img src="../../assets/images/earn-money/pot-item-01.png" />-->
          </div>
        </div>
      </div>
      <div class="pot-item pot-item__2">
        <div class="item-amount">{{ memberDetail.totalRefer ? memberDetail.totalRefer : "0" }}</div>
        <div class="item-desc">{{ $t("earnMoney.reward.myTotalNumberOfInvites") }}</div>
        <div class="item-img"><img src="../../assets/images/earn-money/pot-item-02.png" /></div>
      </div>
    </div>
    <!-- banner.redirectUrl.includes("https://") -->
    <div class="earn-money-details-grid">
      <!-- <div class="details-item" v-if="isShowOnetime"> -->
      <div class="details-item">
        <div class="item-amount">
          Rs
          <span>{{ getRewardAmount("ONE_TIME") }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.invite") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-01.png" /></div>
      </div>

      <!-- <div class="details-item" v-if="isShowDeposit"> -->
      <div class="details-item">
        <div class="item-amount">
          Rs
          <span>{{ getRewardAmount("DEPOSIT") }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.topUp") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-02.png" /></div>
      </div>

      <!-- <div class="details-item details-item" v-if="isShowBet"> -->
      <div class="details-item details-item">
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
          <td style="color: #424f72; font-size: 120%">{{ $t("earnMoney.reward.level") }}</td>
          <td style="color: #424f72; font-size: 120%">{{ $t("earnMoney.reward.friendCount") }}</td>
          <td style="color: #424f72; font-size: 120%">{{ $t("earnMoney.reward.inviteBonus") }}</td>
        </tr>

        <template v-for="(item, index) in oneTimeBonusSetting.settingList" :key="index">
          <tr>
            <td>
              LEVEL {{ index + 1 }}
            </td>
            <td>{{ item.minReferCount }} ~ {{ item.maxReferCount }}</td>
            <td>{{ store.currency.value }} {{ item.bonusAmount }}</td>
          </tr>
        </template>
      </table>

      <div class="earn-money-betting-commission earn-money-card">
      <div class="earn-money-card-title">
        {{ $t("earnMoney.reward.bettingCommission") }}
      </div>
      <table class="card-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <thead>
          <tr>
            <th style="color:#424f72; font-weight: normal;">{{ $t("earnMoney.reward.betting_table.header.description") }}</th>
            <th style="color:#424f72; font-weight: normal;">{{ $t("earnMoney.reward.betting_table.header.commission") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ $t(`earnMoney.reward.betting_table.row1.description`) }}</td>
            <td>{{ $t(`earnMoney.reward.betting_table.row1.commission`) }}</td>
          </tr>
          <tr v-for="index in 3" :key="index">
            <td>
              {{ $t(`earnMoney.reward.betting_table.row${index + 1}.description`) }}
            </td>
            <td>
              {{ $t(`earnMoney.reward.betting_table.row${index + 1}.commission`) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="earn-money-deposit-commission earn-money-card">
      <div class="earn-money-card-title">
        {{ $t("earnMoney.reward.depositCommission") }}
      </div>
      <table class="card-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <thead>
        </thead>
        <tbody>
          <tr>
            <td style="color:#424f72; font-weight: normal;">{{ $t("earnMoney.reward.deposit_table.header.description") }}</td>
            <td style="color:#424f72; font-weight: normal;">{{ $t("earnMoney.reward.deposit_table.header.commission") }}</td>
          </tr>
          <tr v-for="index in 1" :key="index">
            <td>{{ $t(`earnMoney.reward.deposit_table.row${index}.description`) }}</td>
            <td>{{ $t(`earnMoney.reward.deposit_table.row${index}.commission`) }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="q-pa-md">
        <div class="q-mt-md" v-html="$t('earnMoney.reward.note')"></div>
        <div class="q-mt-sm grey-txt" v-html="$t('earnMoney.reward.eligibility_tips')"></div>
        <div class="q-mt-sm red-txt" v-html="$t('earnMoney.reward.multiple_acc_hint')"></div>
      </div> -->
    </div>
      <div class="table-hint q-pa-md">
        <div class="q-mt-sm" v-html="$t('earnMoney.reward.eligibility_tips')"></div>

        <!-- <div class="q-mt-sm" v-html="$t('earnMoney.reward.betting_tips')"></div>

        <div class="q-mt-sm" v-html="$t('earnMoney.reward.deposit_tips')"></div> -->

      </div>
      <div class="note-hint q-pa-md">
        <div style="color: #ffa900;" v-html="$t('earnMoney.reward.multiple_acc_hint')"></div>
      </div>
    </div>

    <div class="earn-money-sent-ytd">
      <div class="sent-ytd-icon">
        <img src="../../assets/images/earn-money/sent-ytd-icon.png" />
      </div>

      <div class="sent-ytd-amount">
        {{ $t("earnMoney.reward.totalAmountSentAsOfYesterday") }}
        <div class="sent-ytd-amount__amount">
          <span>{{ oneTimeBonusSetting.totalAmount }}</span>
        </div>
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
                    <img :src="getRandomImage(index)" width="30" style="margin-right: 8px;" />
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
import { onMounted, ref, watch, computed } from "vue";
import { copyToClipboard, useQuasar } from "quasar";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { convertToCommaAmount } from "src/boot/utils";

const $q = useQuasar();
const store = userStore();
const { t } = useI18n();

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
        fallbackCopyTextToClipboard(textToCopy);
      });
  } else {
    fallbackCopyTextToClipboard(textToCopy);
  }
};
const fallbackCopyTextToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  $q.notify({
    message: "Link copied to clipboard",
    color: "positive",
    position: "top",
    timeout: 2000,
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

const filterType = ref("today");
const isLoading = ref(false);
const selectByDayType = (type) => {
  if (type !== filterType.value) {
    filterType.value = type;
    getMemberDetail();
  }
};

const getMemberDetail = () => {
  var recordDate = "";

  if (filterType.value === "today") {
    recordDate = moment().format("YYYY-MM-DD 00:00:00") + "," + moment().format("YYYY-MM-DD 23:59:59");
  } else if (filterType.value === "yesterday") {
    recordDate =
      moment().add(-1, "day").format("YYYY-MM-DD 00:00:00") +
      "," +
      moment().add(-1, "day").format("YYYY-MM-DD 23:59:59");
  } else {
    recordDate = "2024-06-05 00:00:00" + "," + moment().format("YYYY-MM-DD 23:59:59");
  }
  isLoading.value = true;
  memberDetail.value = [];
  api
    .get(`/session/refer-rebate/member-detail?recordDate=${recordDate}`)
    .then((response) => {
      isLoading.value = false;
      if (response.code === 0) {
        memberDetail.value = response.data;
        activeSetting.value = response.data.activeSetting;
      }
    })
    .catch((e) => {
      isLoading.value = false;
      console.log(e);
    });
  setTimeout(() => {
    isLoading.value = false;
  }, 5000);
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
    tgDomain = store.evip ? "https://" + store.evip + "/" : store.h5Url;
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
    // gap: 24px;

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
      margin-bottom: 24px;

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

        .flex-item {
          display: flex;
          gap: 3px;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .amount-div {
          display: flex;
          align-content: center;
          align-items: center;
          gap: 8px;
        }

        &.with-btn {
          right: 4px;
          top: 50%;
          padding-right: 4px;
        }

        .title {
          font-style: italic;
          text-transform: uppercase;
          position: relative;
          font-size: 14px;
          font-weight: bold;
          line-height: 20.61px;
          color: #fff;
          //text-shadow:
          //  -1px 1px 0 #fff,
          //  1px 1px 0 #fff,
          //  1px -1px 0 #fff,
          //  -1px -1px 0 #fff;

          //&::before {
          //  content: attr(data-text);
          //  position: absolute;
          //  inset: 0;
          //  z-index: -1;
          //  -webkit-text-stroke: 1px #fff;
          //}
        }

        .amount {
          position: relative;
          background: linear-gradient(180deg, #fffee1 24.43%, #ffe69d 76.41%);
          background-clip: text;
          font-size: 18px;
          font-weight: bold;
          line-height: 20px;
          color: transparent;

          &::before {
            content: attr(data-text);
            position: absolute;
            inset: 0;
            z-index: -1;
            -webkit-text-stroke: 2px #ff3e27;
          }
        }

        .currency {
          position: relative;
          font-size: 16px;
          font-weight: bold;
          line-height: 20.61px;
          color: #ff3e27;
          text-shadow: -1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff;

          &::before {
            content: attr(data-text);
            position: absolute;
            inset: 0;
            z-index: -1;
            -webkit-text-stroke: 1px #fff;
          }
        }
      }
    }
  }

  .earn-money-details-grid {
    display: flex;
    // grid-template-columns: repeat(2, 1fr);
    // grid-gap: 12px;
    // gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;

    .details-item {
      display: flex;
      width: calc(50% - 6px);
      flex-direction: column;
      min-height: 100px;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      box-shadow: 0px 4px 4px 0px #0000001a;
      border-radius: 10px;
      position: relative;
      margin-bottom: 12px;
      margin-right: 6px;

      &__full {
        width: 100%;
      }

      .item-amount {
        span {
          font-size: 24px;
          font-weight: bold;
          color: #73b2ff;
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
    background-color: #fff;
    box-shadow: 0px 4px 4px 0px #0000001a;
    margin-top: 16px;
    border-radius: 10px;
    padding: 16px;

    .invite-title {
      font-size: 22px;
      color: #424f72;
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
      // gap: 12px;

      .listing-item {
        background-color: #f7f8fb;
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
        border-radius: 12px;
        display: flex;
        padding: 8px 16px;
        align-items: center;
        line-height: 1;
        gap: 12px;
        color: #8c968f;
        margin-bottom: 12px;

        span.list-num {
          width: 14px;
          font-size: 24px;
          background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #3080f4;
          font-weight: bold;
          margin-right: 8px;
        }
      }
    }

    .invite-share-link {
      margin-top: 12px;
      background-color: #66a7ff1a;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;

      .link-href {
        padding: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 11px;
        color: #424f72;
      }
      .link-copy {
        color: #fff;
        background: $linear-bg;
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
    .earn-money-card-title {
      padding: 10px;
    }
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
          background: #d7e9ff;
        }

        .player-details {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        td {
          color: #424f72;
        }

        td:last-child {
          // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          // background-clip: text;
          // color: transparent;
          color: #73b2ff;
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
    text-align: left;
  }

  .earn-money-sent-ytd {
    margin-top: 16px;
    background: #66a7ff1a;
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
      .sent-ytd-amount__amount {
        background: #fff;
        padding: 7px auto;
        border-radius: 5px;
        span {
          display: block;
          width: 100%;
          // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          // background-clip: text;
          // color: transparent;
          color: #73b2ff;
          font-size: 140%;
          font-weight: bold;
          text-align: center;
          padding: 2px;
          margin-top: 8px;
          border: 1px solid #ffffff0d;
          border-radius: 8px;
        }
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

.tabs-lists {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 4px auto 16px;

  .tab-button {
    width: 30vw;
    text-align: center;
    border-radius: 4px;
    background: linear-gradient(180deg, rgba(115, 178, 255, 0.1) 0%, rgba(57, 129, 255, 0.1) 100%);
    // border: 1px solid #466a45;
    padding: 5px 4px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #424f72;

    &.active {
      font-weight: bold;
      background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);
      color: #fff;
    }

    &:active {
      transform: translate(0px, 1px);
      filter: brightness(0.86);
    }
  }
}

.loading-spinner-div {
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 9999;
}
</style>
