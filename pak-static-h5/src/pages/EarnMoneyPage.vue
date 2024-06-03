<template>
  <ProfileSummary :homeProfile="true" />

  <!-- <pre>oneTimeBonusSetting--{{ oneTimeBonusSetting }}</pre> -->
  <!-- <pre>memberDetail--{{ memberDetail }}</pre> -->
  <!-- <pre>latestInvitees--{{ latestInvitees }}</pre> -->
  <!-- <pre>selfTgurl{{ selfTgurl }}</pre> -->

  <div class="earn-money-wrapper">
    <div class="earn-money-container">
      <div class="earn-money-title">Bonus Pot Arrived</div>
      <div class="earn-money-pots">
        <div class="pot-item">
          <div class="item-amount">
            RS {{ getRewardAmount("ONE_TIME") + getRewardAmount("DEPOSIT") + getRewardAmount("BET") }}
          </div>
          <div class="item-desc">My Total Income</div>
          <div class="item-img"><img src="../assets/images/earn-money/pot-item-01.png" /></div>
        </div>
        <div class="pot-item pot-item__2">
          <div class="item-amount">{{ memberDetail.totalRefer }}</div>
          <div class="item-desc">My Total Number Of Invites</div>
          <div class="item-img"><img src="../assets/images/earn-money/pot-item-02.png" /></div>
        </div>
      </div>

      <div class="earn-money-details-grid">
        <div class="details-item">
          <div class="item-amount">
            Rs
            <span>{{ getRewardAmount("ONE_TIME") }}</span>
          </div>
          <div class="item-title">Invite</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-01.png" /></div>
        </div>

        <div class="details-item">
          <div class="item-amount">
            Rs
            <span>{{ getRewardAmount("DEPOSIT") }}</span>
          </div>
          <div class="item-title">Top Up</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-02.png" /></div>
        </div>

        <div class="details-item details-item__full">
          <div class="item-amount">
            Rs
            <span>{{ getRewardAmount("BET") }}</span>
          </div>
          <div class="item-title">Bet</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-03.png" /></div>
        </div>

        <!-- <div class="details-item">
          <div class="item-amount">
            Rs
            <span>0</span>
          </div>
          <div class="item-title">Achievement</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-04.png" /></div>
        </div> -->
      </div>

      <div class="earn-money-invite">
        <div class="invite-title">Invite friends via link</div>
        <div class="invite-desc">How to get invitation bonus</div>

        <div class="invite-listing">
          <div class="listing-item">
            <span class="list-num">1</span>
            Invite friends via invitation link
          </div>

          <div class="listing-item">
            <span class="list-num">2</span>
            Register via link
          </div>

          <div class="listing-item">
            <span class="list-num">3</span>
            Complete deposit after registration
          </div>
        </div>

        <div class="invite-share-link">
          <div class="link-href">{{ selfTgurl }}</div>
          <div class="link-copy" @click="copyHrefLink">Copy Link</div>
        </div>

        <div class="invite-share-social">
          <div class="social-item"><img src="../assets/images/earn-money/social-whatsapp.png" /></div>
          <div class="social-item"><img src="../assets/images/earn-money/social-instagram.png" /></div>
          <div class="social-item"><img src="../assets/images/earn-money/social-tiktok.png" /></div>
          <div class="social-item"><img src="../assets/images/earn-money/social-more.png" /></div>
        </div>
      </div>

      <div class="earn-money-friendcount">
        <table border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
          <tr>
            <td style="color: #8c968f; font-size: 120%">Friend Count</td>
            <td style="color: #8c968f; font-size: 120%">Invite Bonus</td>
          </tr>

          <template v-for="(item, index) in oneTimeBonusSetting.settingList" :key="index">
            <tr>
              <td>{{ item.minReferCount }} ~ {{ item.maxReferCount }}</td>
              <td>{{ store.currency.value }} {{ item.bonusAmount }}</td>
            </tr>
          </template>
          <!-- <tr>
            <td>1</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>2~4</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>5~10</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>11~30</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>31~50</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>51~500</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>501~999</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>1000~3000</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>3001~9999</td>
            <td>Rs 120.0</td>
          </tr>

          <tr>
            <td>10000~999999</td>
            <td>Rs 120.0</td>
          </tr> -->
        </table>
      </div>

      <div class="earn-money-sent-ytd">
        <div class="sent-ytd-icon">
          <img src="../assets/images/earn-money/sent-ytd-icon.png" />
        </div>

        <div class="sent-ytd-amount">
          Total amount sent as of yesterday
          <span>{{ oneTimeBonusSetting.totalAmount }}</span>
        </div>
      </div>

      <div class="earn-money-friendcount">
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
                    <img src="../assets/images/earn-money/profile-img-1.png" width="30" />
                    {{ item.loginName }}
                  </div>
                </td>
                <td>{{ store.currency.value }} {{ item.finalAmount }}</td>
              </tr>
            </template>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProfileSummary from "components/ProfileSummary.vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { userStore } from "stores/index";

const hrefLink = ref("https://b9.game/refer/JnAlZ6");
const $q = useQuasar();
const store = userStore();

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
const latestInvitees = ref([]);

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
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const selfTgurl = ref("");

const getRewardAmount = (type) => {
  const rewards = memberDetail.value.rewardAmountByType;
  if (rewards && Array.isArray(rewards)) {
    const reward = rewards.find((reward) => reward.rewardType === type);
    return reward ? reward.totalAmount : 0;
  }
  return 0;
};

onMounted(() => {
  getOneTimeBonusSetting();
  getMemberDetail();
  getLatestInvitees();

  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.h5Url;
  }

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) selfTgurl.value = tgDomain + "refer/" + res.data;
  });
});
</script>

<style scoped lang="scss">
.earn-money-wrapper {
  padding: 20px;
  .earn-money-container {
    .earn-money-title {
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
    }

    .earn-money-pots {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 24px;

      .pot-item {
        background-image: url("../assets/images/earn-money/pot-bg-01.png");
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
          background-image: url("../assets/images/earn-money/pot-bg-02.png");
        }

        .item-amount {
          color: #ffffff;
          font-size: 24px;
          line-height: 1;
          font-weight: bold;
        }

        .item-desc {
          color: #ffffff99;
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
          word-break: break-all;
          font-size: 11px;
        }
        .link-copy {
          color: #0f0b0b;
          background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 90px;
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
      width: calc(100% + 40px);
      margin-left: -20px;
      margin-right: -20px;
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
}
</style>
