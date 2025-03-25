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
        <div class="item-img with-btn">
          <div class="flex-item">
            <img src="../../assets/images/earn-money/pot-item-01.png" />
          </div>
        </div>
        <div class="item-desc">{{ $t("earnMoney.reward.myTotalIncome") }}</div>
        <div class="item-amount">
          RS
          {{
            convertToCommaAmount(getRewardAmount("ONE_TIME") + getRewardAmount("DEPOSIT") + getRewardAmount("BET")) ||
            0.0
          }}
        </div>
      </div>
      <div class="pot-item pot-item__2">
        <div class="item-img"><img src="../../assets/images/earn-money/pot-item-02.png" /></div>
        <div class="item-desc">
          {{ $t("earnMoney.reward.myTotalNumberOfInvites") }}
          <div class="item-amount">{{ memberDetail.totalRefer ? memberDetail.totalRefer : "0" }}</div>
        </div>
        <!--        -->
      </div>
    </div>
    <!-- banner.redirectUrl.includes("https://") -->
    <div class="earn-money-details-grid">
      <!-- <div class="details-item" v-if="isShowOnetime"> -->
      <div class="details-item">
        <div class="item-amount">
          Rs
          <span>{{ convertToCommaAmount(getRewardAmount("ONE_TIME")) }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.invite") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-01.png" /></div>
      </div>

      <!-- <div class="details-item" v-if="isShowDeposit"> -->
      <div class="details-item">
        <div class="item-amount">
          Rs
          <span>{{ convertToCommaAmount(getRewardAmount("DEPOSIT")) }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.reward.topUp") }}</div>
        <div class="item-icon"><img src="../../assets/images/earn-money/details-icon-02.png" /></div>
      </div>
    </div>
    <div class="earn-money-details-grid">
      <!-- <div class="details-item details-item" v-if="isShowBet"> -->
      <div class="details-item details-item">
        <div class="item-amount">
          Rs
          <span>{{ convertToCommaAmount(getRewardAmount("BET")) }}</span>
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
        <ShareIcons :is-invite="true" :url="selfTgurl" />
      </div>
    </div>

    <div class="earn-money-invitation-rewards earn-money-card">
      <div class="earn-money-card-title">
        {{ $t("earnMoney.reward.title") }}
      </div>
      <table class="card-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <thead>
          <tr>
            <th>{{ $t("earnMoney.reward.level") }}</th>
            <th>{{ $t("earnMoney.reward.totalNoOfValidPlayersInvited") }}</th>
            <th>{{ $t("earnMoney.reward.invitationRewards") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in oneTimeBonusSetting.settingList" :key="index">
            <td>
              <template v-if="index < 3">
                <img :src="require(`../../assets/images/earn-money/no${index + 1}.png`)" alt="Level Image" />
              </template>
              LEVEL {{ index + 1 }}
            </td>
            <td>{{ item.minReferCount }} ~ {{ item.maxReferCount }}</td>
            <td>
              <div class="reward-coin-container">
                <img class="reward-coin" src="../../assets/images/earn-money/invite-reward-coin.png" />
                {{ item.bonusAmount }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="earn-money-betting-commission earn-money-card">
      <div class="earn-money-card-title">
        {{ $t("earnMoney.reward.bettingCommission") }}
      </div>
      <table class="card-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <thead>
          <tr>
            <th>{{ $t("earnMoney.reward.betting_table.header.description") }}</th>
            <th>{{ $t("earnMoney.reward.betting_table.header.commission") }}</th>
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
          <tr>
            <th>{{ $t("earnMoney.reward.deposit_table.header.description") }}</th>
            <th>{{ $t("earnMoney.reward.deposit_table.header.commission") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="index in 1" :key="index">
            <td>{{ $t(`earnMoney.reward.deposit_table.row${index}.description`) }}</td>
            <td>{{ $t(`earnMoney.reward.deposit_table.row${index}.commission`) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="q-pa-md">
        <div class="q-mt-md" v-html="$t('earnMoney.reward.note')"></div>
        <div class="q-mt-sm grey-txt" v-html="$t('earnMoney.reward.eligibility_tips')"></div>
        <div class="q-mt-sm red-txt" v-html="$t('earnMoney.reward.multiple_acc_hint')"></div>
      </div>
    </div>

    <!-- <div class="earn-money-friendcount">
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

      <div class="table-hint q-pa-md">
        <div class="q-mt-sm" v-html="$t('earnMoney.reward.eligibility_tips')"></div>

        <div class="q-mt-sm" v-html="$t('earnMoney.reward.betting_tips')"></div>

        <div class="q-mt-sm" v-html="$t('earnMoney.reward.deposit_tips')"></div>

        <div class="q-mt-sm high-light" v-html="$t('earnMoney.reward.multiple_acc_hint')"></div>
      </div>
    </div> -->

    <div class="earn-money-amt">
      <div class="earn-money-amt-title">
        <div class="earn-money-amt-icon"></div>
        {{ $t("earnMoney.reward.award") }}
      </div>
      <div class="earn-money-sent-ytd">
        <div class="sent-ytd-amount" v-if="oneTimeBonusSetting.totalAmount">
          {{ $t("earnMoney.reward.totalAmountSentAsOfYesterday") }}
          <span>
            <div class="sent-ytd-icon">
              <img src="../../assets/images/earn-money/sent-ytd-icon.png" />
            </div>
            {{ store.currency.value }} {{ convertToCommaAmount(oneTimeBonusSetting.totalAmount) }}
          </span>
        </div>
      </div>

      <div class="earn-money-friendcount">
        <table border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
          <!-- <tbody>
          <tr>
            <td style="color: #8c968f; font-size: 120%; width: 60%">{{ $t("earnMoney.reward.player") }}</td>
            <td style="color: #8c968f; font-size: 120%; width: 40%">{{ $t("earnMoney.reward.money") }}</td>
          </tr>
        </tbody> -->
        </table>
        <div class="table-container" ref="tableContainer">
          <table border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
            <template v-if="inviteesRecords && inviteesRecords.length === 0">
              <tr>
                <td colspan="2">{{ $t("notify.noRecord") }}</td>
              </tr>
            </template>
            <template v-else>
              <template v-for="(pair, index) in inviteesRecords" :key="index">
                <tr>
                  <td style="width: 25%">
                    <div class="player-details">
                      {{ pair[0]?.loginName }}
                    </div>
                  </td>
                  <td style="width: 25%">{{ store.currency.value }} {{ pair[0]?.finalAmount }}</td>

                  <td v-if="pair[1]" style="width: 25%">
                    <div class="player-details">
                      {{ pair[1]?.loginName }}
                    </div>
                  </td>
                  <td v-if="pair[1]" style="width: 25%">{{ store.currency.value }} {{ pair[1]?.finalAmount }}</td>
                </tr>
              </template>
            </template>
          </table>
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
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { copyToClipboard, useQuasar } from "quasar";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useI18n } from "vue-i18n";
import moment from "moment";
import ShareIcons from "../ShareIcons.vue";
import { convertToCommaAmount } from "src/boot/utils";

const $q = useQuasar();
const store = userStore();
const { t } = useI18n();
const ui = useUI();

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

        // inviteesRecords.value = response.data.records;
        // inviteesRecords.value.push(...inviteesRecords.value);
        // inviteesRecords.value.push(...inviteesRecords.value);
        // inviteesRecords.value.push(...inviteesRecords.value);
        // inviteesRecords.value.push(...inviteesRecords.value);

        // Duplicate records 5 times dynamically
        const repeatedRecords = Array(5)
          .fill([...response.data.records])
          .flat();

        // Pair the records
        const chunkedRecords = [];
        for (let i = 0; i < repeatedRecords.length; i += 2) {
          chunkedRecords.push([repeatedRecords[i], repeatedRecords[i + 1]]);
        }

        // Assign to inviteesRecords
        inviteesRecords.value = chunkedRecords;
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
const instagramRef = ref();
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

const handleShareToInstagram = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  copyToClipboard(shareText);
  instagramRef.value.click();
};

const handleShareToYoutube = (url) => {
  const shareText = t("earnMoney.reward.shareText", { url });
  const youtubeShareUrl = `https://www.youtube.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
    shareText
  )}`;
  window.open(youtubeShareUrl, "_blank");
};

const handleShareToFacebookPost = (url) => {};

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
    gap: 24px;
    background: #373c3d;
    padding: 10px;
    border-radius: 10px;

    .pot-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 10px;
      text-align: center;
      position: relative;
      &:nth-child(1) {
        &:after {
          content: "";
          background: #434949;
          height: 60%;
          width: 1px;
          position: absolute;
          right: -5px;
        }
      }
      // background-image: url("../../assets/images/earn-money/pot-bg-01.png");
      // background-repeat: no-repeat;
      // background-position: center center;
      // background-size: cover;
      // display: flex;
      // gap: 8px;
      // flex-direction: column;
      // padding: 28px 20px;
      // border-radius: 8px;
      // position: relative;

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
        width: 48px;
        img {
          width: 100%;
        }
      }
      // .item-img {
      //   position: absolute;
      //   display: flex;
      //   align-items: center;
      //   gap: 5px;
      //   right: 0;
      //   top: 50%;
      //   transform: translateY(-50%);

      //   .flex-item {
      //     display: flex;
      //     gap: 3px;
      //     justify-content: center;
      //     align-items: center;
      //     flex-direction: column;
      //   }

      //   .amount-div {
      //     display: flex;
      //     align-content: center;
      //     align-items: center;
      //     gap: 8px;
      //   }

      //   &.with-btn {
      //     right: 4px;
      //     top: 50%;
      //     padding-right: 4px;
      //   }

      //   .title {
      //     font-style: italic;
      //     text-transform: uppercase;
      //     position: relative;
      //     font-size: 14px;
      //     font-weight: bold;
      //     line-height: 20.61px;
      //     color: #fff;
      //     //text-shadow:
      //     //  -1px 1px 0 #fff,
      //     //  1px 1px 0 #fff,
      //     //  1px -1px 0 #fff,
      //     //  -1px -1px 0 #fff;

      //     //&::before {
      //     //  content: attr(data-text);
      //     //  position: absolute;
      //     //  inset: 0;
      //     //  z-index: -1;
      //     //  -webkit-text-stroke: 1px #fff;
      //     //}
      //   }

      //   img {
      //     display: block;
      //     width: 100%;
      //     max-width: 56px;
      //   }

      //   .amount {
      //     position: relative;
      //     background: linear-gradient(180deg, #fffee1 24.43%, #ffe69d 76.41%);
      //     background-clip: text;
      //     font-size: 18px;
      //     font-weight: bold;
      //     line-height: 20px;
      //     color: transparent;

      //     &::before {
      //       content: attr(data-text);
      //       position: absolute;
      //       inset: 0;
      //       z-index: -1;
      //       -webkit-text-stroke: 2px #ff3e27;
      //     }
      //   }

      //   .currency {
      //     position: relative;
      //     font-size: 16px;
      //     font-weight: bold;
      //     line-height: 20.61px;
      //     color: #ff3e27;
      //     text-shadow: -1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff;

      //     &::before {
      //       content: attr(data-text);
      //       position: absolute;
      //       inset: 0;
      //       z-index: -1;
      //       -webkit-text-stroke: 1px #fff;
      //     }
      //   }
      // }
    }
  }

  .earn-money-details-grid {
    // display: flex;
    // grid-template-columns: repeat(2, 1fr);
    // grid-gap: 12px;
    // gap: 12px;
    margin-top: 16px;
    // flex-wrap: wrap;
    background: #373c3d;
    border-radius: 10px;
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;

    .details-item {
      img {
        width: 16px;
      }
      &:nth-child(1) {
        &:after {
          content: "";
          background: #434949;
          height: 60%;
          width: 1px;
          position: absolute;
          right: -5px;
        }
      }
      display: flex;
      width: calc(50% - 6px);
      flex-direction: column-reverse;
      min-height: 100px;
      align-items: center;
      justify-content: center;
      // background-color: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      position: relative;
      gap: 10px;

      &__full {
        width: 100%;
      }

      .item-amount {
        color: #ffffff;
        font-size: 24px;
        line-height: 1;
        font-weight: bold;
      }

      .item-title {
        font-size: 16px;
        color: #8c968f;
      }

      // .item-icon {
      //   position: absolute;
      //   top: 12px;
      //   left: 12px;

      //   img {
      //     display: block;
      //     width: 24px;
      //   }
      // }
    }
  }

  .earn-money-invite {
    // background-color: rgba(255, 255, 255, 0.05);
    background: #373c3d;
    margin-top: 16px;
    border-radius: 10px;
    padding: 16px;

    .invite-title {
      font-size: 20px;
      color: #ffffff;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: capitalize;
    }
    .invite-desc {
      font-size: 14px;
      color: #8c968f;
    }

    .invite-listing {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .listing-item {
        // border: 1px solid #ffffff0d;
        // background-color: rgba(255, 255, 255, 0.02);
        background: #292d2e;
        border-radius: 4px;
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
      background-color: #292d2e;
      padding: 4px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;

      .link-href {
        padding: 10px 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 11px;
      }
      .link-copy {
        color: #ffffff;
        background: #ffffff0f;

        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 70px;
        font-weight: bold;
        border-radius: 12px;
        letter-spacing: -1px;
      }
    }

    .invite-share-social {
      // display: grid;
      // grid-template-columns: repeat(4, 1fr);
      grid-gap: 12px;
      margin-top: 16px;
      // display: none !important;
      display: flex;
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
          // background: #ffffff0d;
        }

        .player-details {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        td:nth-child(2n) {
          color: #21ef89;
          font-weight: 700;
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
  //         color: #21EF89;
  //       }
  //     }
  //   }
  // }

  .table-hint {
    color: #8c968f;
    text-align: left;
    .high-light {
      color: #b81212;
    }
  }

  .earn-money-amt {
    background: #323738;
    margin: 15px 0;
    border-radius: 10px;
    padding: 15px;
    .earn-money-amt-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 14.45px;
      line-height: 23.12px;
      vertical-align: middle;
      text-transform: uppercase;
      text-align: center;
      .earn-money-amt-icon {
        position: relative;
        width: 16px;
        height: 16px;
        &::before {
          content: "";
          background: #45d81f4d;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 0;
        }
        &::after {
          content: "";
          background: #45d81f;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          position: absolute;
          left: 4px;
          top: 4px;
        }
      }
    }
  }
  .earn-money-sent-ytd {
    margin-top: 16px;
    // background: #ffffff0d;
    // padding: 8px 16px;
    // border-radius: 12px;
    // display: flex;
    // justify-content: space-around;
    // align-items: center;
    // gap: 16px;

    .sent-ytd-amount {
      color: #8c968f;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 10px;
      width: 100%;
      span {
        font-family: Poppins;
        font-weight: 900;
        font-size: 16.94px;
        line-height: 16.94px;
        color: #21ef89;
        letter-spacing: 0%;
        vertical-align: middle;
        text-transform: capitalize;
        border: 1px solid #ffffff14;
        border-radius: 4px;
        padding: 15px;
        width: 100%;
        text-align: right;
        background: #292d2e;
        position: relative;
        .sent-ytd-icon {
          position: absolute;
          width: 60px;
          top: -5px;
          left: 0;
          img {
            display: block;
            max-width: 80px;
            width: 100%;
          }
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
    border: 1px solid #466a45;
    padding: 5px 4px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      font-weight: bold;
      background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
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

.earn-money-card {
  background: #373c3d;
  margin-top: 16px;
  border-radius: 10px;
  padding: 16px 0 0 0;

  .earn-money-card-title {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 14.45px;
    line-height: 23.12px;
    vertical-align: middle;
    text-transform: uppercase;
    text-align: center;

    img {
      width: 80%;
      // margin-top: -2%;
      margin-top: -6%;
    }
  }

  .card-table {
    text-align: center;
    font-family: "Manrope", sans-serif;
    font-size: 10px;
    color: #000;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    thead {
      // background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
      // background: linear-gradient(180deg, #21b29c 0%, #87c646 100%);

      background: #373c3d;

      th {
        color: #ffffff80;

        font-weight: 700;
        font-size: 12px;
        min-width: 100px;
      }
    }

    tbody {
      td {
        color: #fff;
        padding: 10px 4px;
        font-size: 12px;
        // border: 1px solid #ffffff1a;
        &:last-child {
          color: #21ef89;
        }
      }

      tr {
        &:nth-child(odd) {
          background: #ffffff0d;
        }

        .player-details {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
      }
    }
  }
}

.earn-money-invitation-rewards {
  .reward-coin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .reward-coin {
      // height: 16px;
      width: 24px;
      // margin-right: 4px;
      display: block;
    }
  }
}

.earn-money-deposit-commission {
  .grey-txt {
    color: #9f9f9f;
  }
  .red-txt {
    color: #ffc300;
  }
}
</style>
