<template>
  <div class="share-view-container">
    <div class="menu-title-container">
      <span class="menu-title">{{ $t("shareView.title") }}</span>
    </div>

    <div class="content-wrapper">
      <div class="left-side">
        <div class="share-summary-wrapper">
          <div class="share-summary-item income">
            <div class="share-summary-item__info-wrapper">
              <h3 class="share-summary-item__title">
                ₨ {{ getRewardAmount("ONE_TIME") + getRewardAmount("DEPOSIT") + getRewardAmount("BET") }}
              </h3>
              <span class="share-summary-item__description">{{ $t("shareView.summary.income") }}</span>
            </div>
            <img class="share-summary-item__pic" src="@/assets/images/account/share/income-pic.png" />
          </div>
          <div class="share-summary-item invitees">
            <div class="share-summary-item__info-wrapper">
              <h3 class="share-summary-item__title">{{ memberDetail.totalRefer }}</h3>
              <span class="share-summary-item__description">{{ $t("shareView.summary.invitees") }}</span>
            </div>
            <img class="share-summary-item__pic" src="@/assets/images/account/share/invitees-pic.png" />
          </div>
        </div>

        <div class="invitation-link-wrapper">
          <h2 class="invitation-link-title">{{ $t("shareView.inviteLink.title") }}</h2>
          <p class="invitation-link-description">{{ $t("shareView.inviteLink.description") }}</p>
          <div class="invitation-link__invitation-step-wrapper">
            <div class="invitation-link__invitation-step">
              <span>{{ $t("shareView.inviteLink.step1") }}</span>
            </div>
            <div class="invitation-link__invitation-step">
              <span>{{ $t("shareView.inviteLink.step2") }}</span>
            </div>
            <div class="invitation-link__invitation-step">
              <span>{{ $t("shareView.inviteLink.step3") }}</span>
            </div>
          </div>
          <div class="invitation-link__link-wrapper">
            <!-- <a-input class="invitation-link__link" readonly /> -->
            <div class="invitation-link__link-inner">
              {{ selfTgurl }}
              <button class="common-btn invitation-link__copt-btn" @click="copyHrefLink">
                {{ $t("shareView.inviteLink.copyButton") }}
              </button>
            </div>
            <div class="invitation-link__action-wrapper">
              <a :href="`https://wa.me/?text=${encodeURIComponent(selfTgurl)}`" target="_blank">
                <img src="@/assets/images/account/share/logo_whatsapp.png" alt="Whatsapp" />
              </a>
              <a :href="`https://www.tiktok.com/upload?url=${encodeURIComponent(selfTgurl)}`" target="_blank">
                <img src="@/assets/images/account/share/logo_tik-tok.png" alt="TikTok" />
              </a>
              <a :href="`https://www.instagram.com/?url=${encodeURIComponent(selfTgurl)}`" target="_blank">
                <img src="@/assets/images/account/share/logo_ins.png" alt="Instagram" />
              </a>
              <button class="invitation-link__action-more">
                <RiMoreFill />
              </button>
            </div>
          </div>
        </div>

        <div class="earned-amount-wrapper">
          <img class="earned-amount__pic" src="@/assets/images/account/share/earn-money-pic.png" />
          <div class="earned-amount__total-wrapper">
            <h2 class="earned-amount__total-title">{{ $t("shareView.earnYesterday.title") }}</h2>
            <span class="earned-amount__total-amount">{{ convertToCommaAmount(oneTimeBonusSetting.totalAmount) }}</span>
          </div>
          <div class="earned-amount__divider" />
          <div class="earned-amount__invited-friend-wrapper">
            <div class="earned-amount__invited-friend-info-wrapper">
              <span class="earned-amount__invited-friend-header">
                {{ $t("shareView.earnYesterday.table.header.player") }}
              </span>
              <div v-for="(friend, index) in inviteesRecords" :key="index" class="earned-amount__invited-friend-info">
                <img
                  v-if="friend.profilePhoto"
                  :src="friend.profilePhoto"
                  class="earned-amount__invited-friend-record-pseudo-photo"
                />
                <div v-else class="earned-amount__invited-friend-record-pseudo-photo" />
                <span>{{ friend.loginName }}</span>
              </div>
            </div>

            <div class="earned-amount__invited-friend-info-wrapper">
              <span class="earned-amount__invited-friend-header">
                {{ $t("shareView.earnYesterday.table.header.money") }}
              </span>
              <div v-for="(friend, index) in inviteesRecords" :key="index" class="earned-amount__invited-friend-amount">
                {{ store.currency.value }} {{ friend.finalAmount }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-side">
        <div class="share-info-wrapper">
          <div class="share-info-item">
            <div class="share-info-item__icon-wrapper">
              <img src="@/assets/images/account/share/bet-icon.svg" />
            </div>
            <div class="share-info-item__info-wrapper">
              <span class="share-info-item__info">
                ₨
                <span class="share-info-item__info-num">{{ getRewardAmount("BET") }}</span>
              </span>
              <span class="share-info-item__description">{{ $t("shareView.info.bet") }}</span>
            </div>
          </div>
          <div class="share-info-item">
            <div class="share-info-item__icon-wrapper">
              <img src="@/assets/images/account/share/achievement-icon.svg" />
            </div>
            <div class="share-info-item__info-wrapper">
              <span class="share-info-item__info">
                ₨
                <span class="share-info-item__info-num">
                  {{ memberDetail.eligibleRefer ? memberDetail.eligibleRefer : "0" }}
                </span>
              </span>
              <span class="share-info-item__description">{{ $t("shareView.info.eligibleRefer") }}</span>
            </div>
          </div>
          <div class="share-info-item">
            <div class="share-info-item__icon-wrapper">
              <img src="@/assets/images/account/share/invite-icon.svg" />
            </div>
            <div class="share-info-item__info-wrapper">
              <span class="share-info-item__info">
                ₨
                <span class="share-info-item__info-num">{{ getRewardAmount("ONE_TIME") }}</span>
              </span>
              <span class="share-info-item__description">{{ $t("shareView.info.invite") }}</span>
            </div>
          </div>
          <div class="share-info-item">
            <div class="share-info-item__icon-wrapper">
              <img src="@/assets/images/account/share/top-up-icon.svg" />
            </div>
            <div class="share-info-item__info-wrapper">
              <span class="share-info-item__info">
                ₨
                <span class="share-info-item__info-num">{{ getRewardAmount("DEPOSIT") }}</span>
              </span>
              <span class="share-info-item__description">{{ $t("shareView.info.topUp") }}</span>
            </div>
          </div>
        </div>

        <table class="share-bonus-ranking-wrapper">
          <tr class="share-bonus-ranking-header">
            <td>{{ $t("shareView.bonus.table.header.friendCount") }}</td>
            <td>{{ $t("shareView.bonus.table.header.inviteBonus") }}</td>
          </tr>
          <tr v-for="(item, index) in oneTimeBonusSetting.settingList" :key="index">
            <td class="share-bonus-ranking-label">{{ item.minReferCount }} ~ {{ item.maxReferCount }}</td>
            <td class="share-bonus-ranking-amount">{{ store.currency.value }} {{ item.bonusAmount }}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- <div class="share-wrapper">
      <div class="sharing-container">
        <div class="qr-container">
          <VueQRCodeComponent :size="100" :text="referralLink" />
          <qr-code :text="referralLink" error-level="L"></qr-code>
          <img src="../../assets/images/account/share/qr_code.png" />
        </div>
        <div class="right-container">
          <div class="share-content">
            Share the QR code or link with your friends. Once they register or download the APP. you will get bonus
            amount every day. this bonus works for the lifetime
          </div>
        </div>
      </div>
      <div class="share-link-wrapper">
        <input ref="copyinput" v-model="referralLink" @blur="blurCode" />
        <button class="common-btn copy-btn" @blur="blurCode" @click="copyCode">
          {{ copybtntxt }}
        </button>
      </div>
      <div class="otherlinks">
        <span class="note">Note: Your referral bonus will not be shared</span>

        <div class="links">
          <RiFacebookCircleLine />
          <RiWhatsappLine />
          <RiTelegramLine />
          <RiTwitterLine />
          <RiInstagramLine />
        </div>
      </div>

      <div class="friendlist-container">
        <div class="title">Friend List</div>

        <table class="friendlist-table" style="border-collapse: collapse" border="1">
          <tr>
            <td>Login Name</td>
            <td>Registered At</td>
            <td>Deposit Amount</td>
          </tr>
          <tr v-for="(friend, friendIndex) in friendList" :key="`friend-${friendIndex}`">
            <td>{{ friend.loginName }}</td>
            <td>{{ friend.regTime }}</td>
            <td>{{ friend.depositAmount ?? "-" }}</td>
          </tr>
        </table>
      </div>
    </div> -->
    <!-- <div> -->
    <!-- <div class="account-title-container">
        <span class="account-title">ข้อมูลอ้างอิง</span>
      </div>
      <div class="account-content last">
        <div class="preferred">
          <div class="account-tip-text query-tip">
            <RiSpamLine /> คำถามประจำเดือน
          </div>
          <div class="txt-center">
            <a-date-picker
              v-model:value="searchForm.date"
              :inputReadOnly="true"
            />
          </div>
        </div>
        <div class="share-tab-wrapper">
          <a-table :columns="columns" />
        </div>
      </div> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
import { defineComponent, reactive, ref, onMounted } from "vue";
import {
  getReferralLink,
  getFriendList,
  getOneTimeBonus,
  getMemberDetailAPI,
  getLatestInviteesAPI
} from "@/api/personal/share";
import { ElMessage } from "element-plus";
import {
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiTelegramLine,
  RiTwitterLine,
  RiInstagramLine,
  RiMoreFill
} from "vue-remix-icons";
import moment from "moment";
import VueQRCodeComponent from "vue-qrcode-component";
import { userStore } from "@/store/index";
import { convertToCommaAmount } from "@/utils/utils";
import { server } from "@/utils/request";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const store = userStore();
const copyHrefLink = () => {
  navigator.clipboard
    .writeText(selfTgurl.value)
    .then(() => {
      ElMessage.success(t("shareView.inviteLink.copySuccess"));
    })
    .catch(() => {
      ElMessage.error(t("shareView.inviteLink.copyFail"));
    });
};
const searchForm = reactive({
  date: moment("2022-03-03", "YYYY-MM-DD")
});
const friendList = ref([]);
const selfTgurl = ref("");
const waUrl = ref("");
const copybtntxt = ref("Copy");
const copyinput = ref(null);
const copyCode = () => {
  const copyText = copyinput.value;
  copyText.select();
  document.execCommand("copy");
  copybtntxt.value = "Copied!";
};
const blurCode = () => {
  copybtntxt.value = "Copy";
};

const oneTimeBonusSetting = ref([]);
const memberDetail = ref([]);
const latestInvitees = ref([]);
const inviteesRecords = ref([]);
let currentIndex = 0;
let intervalId = null;

const getOneTimeBonusSetting = () => {
  getOneTimeBonus()
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
  getMemberDetailAPI()
    .then((response) => {
      if (response.code === 0) {
        memberDetail.value = response.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getLatestInvitees = () => {
  getLatestInviteesAPI()
    .then((response) => {
      if (response.code === 0) {
        latestInvitees.value = response.data;
        inviteesRecords.value = response.data.records;
        // startDisplayingRows();
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

// const fakeFriendList = [
//   { profilePhoto: null, loginName: "2312342313", depositAmount: 120 },
//   { profilePhoto: null, loginName: "1512352213", depositAmount: 120 },
//   { profilePhoto: null, loginName: "7334234713", depositAmount: 120 }
// ];

// const bonusRankingList = [
//   { friendCount: "1", bonusAmount: 120 },
//   { friendCount: "2~4", bonusAmount: 120 },
//   { friendCount: "5~10", bonusAmount: 120 },
//   { friendCount: "11~30", bonusAmount: 120 },
//   { friendCount: "31~50", bonusAmount: 120 },
//   { friendCount: "51~500", bonusAmount: 120 },
//   { friendCount: "501~999", bonusAmount: 120 },
//   { friendCount: "1000~3000", bonusAmount: 120 },
//   { friendCount: "3001~9999", bonusAmount: 120 },
//   { friendCount: "10000~99999", bonusAmount: 120 }
// ];
// const columns = [
//   {
//     title: "ชื่อ",
//     dataIndex: "name",
//     key: "name",
//   },
//   {
//     title: "ฝาก",
//     dataIndex: "deposit",
//     key: "deposit",
//   },
// ];
// const getReferral = () => {
//   getReferralLink()
//     .then((res) => {
//       if (res.code === 0) {
//         referralLink.value = `${location.origin}/refer/${res.data}`;
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
// const initFriendList = () => {
//   getFriendList()
//     .then((res) => {
//       if (res.code === 0) {
//         friendList.value = res.data.records;
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
// onMounted(() => {
//   getReferral();
//   initFriendList();
// });
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
      startDisplayingRows(); // Restart the loop
    }
  }, 1000);
};
onMounted(() => {
  getOneTimeBonusSetting();
  getMemberDetail();
  getLatestInvitees();

  let tgDomain = window.location.origin + "/";

  getReferralLink().then((res) => {
    if (res.code === 0) {
      selfTgurl.value = tgDomain + "refer/" + res.data;
    }
  });
});
</script>
<style scoped lang="scss">
.share-view-container {
  margin: 29px 40px;
  margin-left: calc($menu-width + 40px);
}

.menu-title-container {
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 20px;
}

.content-wrapper {
  display: flex;
  gap: 18px;

  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 2;

    .share-summary-wrapper {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 20px;

      .share-summary-item {
        flex: 1;
        padding: 29px;
        position: relative;
        border-radius: 10px;

        &.income {
          background: url(@/assets/images/account/share/background-mask.png) left center no-repeat,
            linear-gradient(90deg, #ff3d00 0%, #ffb800 100%);
          .share-summary-item__pic {
            top: -48px;
          }
        }

        &.invitees {
          background: url(@/assets/images/account/share/background-mask.png) left center no-repeat,
            linear-gradient(90deg, #057903 0%, #0047ff 100%);
          .share-summary-item__pic {
            top: -40px;
          }
        }

        .share-summary-item__info-wrapper {
          display: flex;
          flex-direction: column;
          gap: 11px;

          .share-summary-item__title {
            font-size: 32px;
            font-weight: 700;
            line-height: 32px;
            color: #ffffff;
          }

          .share-summary-item__description {
            font-size: 16px;
            font-weight: 500;
            line-height: 16px;
            color: #ffffff99;
          }
        }

        .share-summary-item__pic {
          position: absolute;
          right: 0px;
        }
      }
    }

    .invitation-link-wrapper {
      display: flex;
      flex-direction: column;
      color: #8c968f;
      padding: 28px;
      border: 1px solid #ffffff0d;
      border-radius: 10px;
      background: linear-gradient(275.28deg, #0e0e0e 0%, #161716 100%);
      margin-bottom: 23px;

      .invitation-link-title {
        font-size: 32px;
        font-weight: 700;
        line-height: 32px;
        color: #ffffff;
        margin-bottom: 28px;
      }

      .invitation-link-description {
        margin-bottom: 13px;
        font-size: 20px;
        font-weight: 400;
        line-height: 32px;
      }

      .invitation-link__invitation-step-wrapper {
        display: flex;
        align-items: center;
        gap: 32px;
        border: 1px solid #ffffff0d;
        border-radius: 10px;
        counter-reset: num;
        padding: 14px 20px;
        background: #ffffff05;
        margin-bottom: 34px;

        .invitation-link__invitation-step {
          display: flex;
          align-items: center;
          flex: 1;
          font-size: 16px;
          font-weight: 400;
          line-height: 16px;
          white-space: nowrap;

          > span {
            flex: 1;
          }

          &::before {
            counter-increment: num;
            content: counter(num);
            font-size: 24px;
            font-weight: 900;
            line-height: 32px;
            color: #ffd600;
            margin-right: 14px;
          }

          &:not(:last-child) {
            &::after {
              content: url(@/assets/images/account/share/step-icon.svg);
            }
          }
        }
      }

      .invitation-link__link-wrapper {
        display: flex;
        align-items: center;
        gap: 32px;
        margin-bottom: 12px;

        .invitation-link__link-inner {
          padding: 14px 26px;
          padding-right: 181px;
          background-color: #0f0b0b;
          border-radius: 10px;
          position: relative;
          font-size: 18px;
          font-weight: 400;
          line-height: 32px;
          color: #ffffff;

          .invitation-link__copt-btn {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 155px;
            font-size: 20px;
            font-weight: 700;
            line-height: 20px;
            color: #131313;
          }
        }

        .invitation-link__action-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;

          img {
            max-width: 46px;
          }

          .invitation-link__action-more {
            display: flex;
            align-items: center;
            background-color: #ffffff0d;
            width: 46px;
            height: 46px;
            border-radius: 7px;

            svg {
              fill: #ffffff;
            }
          }
        }
      }
    }

    .earned-amount-wrapper {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 21px 28px;
      background-color: #ffffff05;
      border-radius: 10px;

      .earned-amount__pic {
        margin-right: 23px;
      }

      .earned-amount__total-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 19px;
        flex: 2;
        margin-right: 62px;

        .earned-amount__total-title {
          font-size: 18px;
          font-weight: 500;
          line-height: 18px;
          color: #8c968f;
        }

        .earned-amount__total-amount {
          align-self: stretch;
          padding: 14px 0;
          background: #ffffff05;
          border: 1px solid #ffffff0d;
          border-radius: 10px;
          font-size: 32px;
          font-weight: 900;
          line-height: 32px;
          text-align: center;
          color: #ffd600;
        }
      }

      .earned-amount__divider {
        width: 1px;
        background-color: #a4aabb1a;
        height: 100px;
        margin-right: 35px;
      }

      .earned-amount__invited-friend-wrapper {
        display: flex;
        justify-content: space-between;
        flex: 1;
        height: 140px;
        overflow: scroll;
        padding-right: 20px;
        .earned-amount__invited-friend-info-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;

          .earned-amount__invited-friend-header {
            margin-bottom: 4px;
            font-size: 16px;
            font-weight: 500;
            line-height: 16px;
            color: #8c968f;
          }

          .earned-amount__invited-friend-info {
            display: flex;
            align-items: center;
            align-self: start;
            gap: 8px;
            font-size: 16px;
            font-weight: 400;
            line-height: 16px;

            .earned-amount__invited-friend-record-pseudo-photo {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              overflow: hidden;
              background-color: #ffffff0d;
            }
          }

          .earned-amount__invited-friend-amount {
            font-size: 16px;
            font-weight: 500;
            line-height: 32px;
            color: #70bc62;
          }
        }
      }
    }
  }

  .right-side {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;
    flex: 1;

    .share-info-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 13px 16px;
      margin-bottom: 13px;

      .share-info-item {
        display: flex;
        align-items: center;
        gap: 45px;
        padding: 11px 17px;
        background-color: #ffffff05;
        border-radius: 10px;

        .share-info-item__icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #ffffff4d;
          width: 36px;
          height: 36px;
        }

        .share-info-item__info-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .share-info-item__info {
            font-size: 20.62px;
            font-weight: 500;
            line-height: 20.62px;

            .share-info-item__info-num {
              font-size: 30.93px;
              font-weight: 700;
              line-height: 46.39px;
              color: #70bc62;
            }
          }

          .share-info-item__description {
            font-size: 18.04px;
            font-weight: 500;
            line-height: 27.06px;
            color: #8c968f;
          }
        }
      }
    }

    .share-bonus-ranking-wrapper {
      border: none;
      border-radius: 10px;
      width: 100%;

      > :nth-child(odd) {
        background-color: #ffffff05;
      }

      td {
        padding: 13px 0;
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        text-align: center;
      }

      .share-bonus-ranking-header {
        padding: 20px 0;
        color: #8c968f;
      }

      .share-bonus-ranking-label {
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
      }

      .share-bonus-ranking-amount {
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        color: #70bc62;
      }
    }
  }
}
</style>
<!-- <style scoped lang="scss">
.dark-theme {
  .account-container {
    .account-content-wrapper {
      .share-wrapper {
        .share-link-wrapper {
          border: 1px solid #48a7ff29;
          background: #ffffff0f;
        }

        .friendlist-container {
          .friendlist-table {
            background: #ffffff0f;
          }
        }
      }
    }
  }
}
.account-container {
  .account-content-wrapper {
    .share-wrapper {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      gap: 20px;
      .sharing-container {
        // box-shadow: 0px 0px 20px 1px #10101c;
        width: 100%;
        margin: 10px auto;
        display: flex;
        justify-content: center;
        border-radius: 12px;
        overflow: hidden;
        flex: 2;

        .qr-container {
          background: #ffffff05;

          padding: 10px;
          border-radius: 12px;
          border: 1px solid #48a7ff29;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 120px;
            margin: 0 auto;
          }
        }
        .right-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .share-content {
            padding: 10px 30px;
          }
        }
      }
      .share-link-wrapper {
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 1em;
        border-radius: 12px;

        input {
          width: 100%;
          border: 0;
          padding-inline: 0.7em;
          background: transparent;
          flex: 8;
        }
        .common-btn {
          flex: 1;
        }
      }
      .otherlinks {
        display: flex;
        gap: 10px;
        flex-direction: column;
        .links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          svg {
            width: 30px;
            fill: #4832e5;
          }
        }
        .note {
          font-size: 12px;
        }
      }

      .friendlist-container {
        padding: 0 30px 10px;
        position: relative;
        width: 100%;

        .title {
          color: #9d9d9d;
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .friendlist-table {
          width: auto !important;
          overflow: auto;
          display: inline-block;
          margin-block: 2rem;
          border: 1px solid #eaeaea;
          background: #ffffff;
          border-radius: 12px;
          color: #83a3ca;

          td,
          th {
            padding: 10px;
            &:first-child {
              border-left: 0 !important;
            }
            &:last-child {
              border-right: 0 !important;
            }
          }

          th {
            background: #ecf5ff;
            color: #2b2b82;
          }
          tr:first-child {
            td,
            th {
              border-top: 0 !important;
            }
            td {
              background: #ecf5ff;
              color: #2b2b82;

              text-align: center;
            }
            td:first-child {
              border-radius: 12px 0 0 0;
            }
          }

          tr:last-child {
            td,
            th {
              border-bottom: 0 !important;
            }
          }
        }
      }
    }
    .preferred {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
  .account-container {
    .account-content-wrapper {
      .share-wrapper {
        flex-direction: column;
        margin-bottom: 50px;
        align-items: center;
        .sharing-container {
          flex-direction: column;
          .share-link-wrapper {
            flex-direction: column;
          }
        }
      }
    }
  }
}
</style> -->
