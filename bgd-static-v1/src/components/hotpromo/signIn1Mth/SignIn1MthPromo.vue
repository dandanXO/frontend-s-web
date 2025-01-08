<template>
  <div>
    <div class="check-in-container content-card">
      <div class="header-amt">300,000,000BDT</div>
      <div class="check-in-days-visual">
        <div class="day-card" v-for="n in 30" :key="n" :class="{ active: checkInDay === n }">
          <span>{{ checkInDay === n ? "TODAY" : n }}</span>
          <img
            class="day-card-img"
            :class="{ closed: n >= checkInDay }"
            :src="
              require(`../../../assets/images/promotion/hotpromo/signin-1mth/day-range-${getChestDesign(n)}-icon${
                n < checkInDay ? '-open' : ''
              }.png`)
            "
          />
        </div>
      </div>
      <div class="check-in-btm">
        <div class="sign-in-btn">
          <span>SIGN IN NOW</span>
        </div>
        <div class="bonus-progress-bar">
          <div class="bonus-progress-bar-fill" :style="{ width: 20 + '%' }"></div>
        </div>
        <div class="total-bet-txt">TOTAL BET：100/1000 BDT</div>
      </div>
    </div>
    <div class="reward-mech-container content-card">
      <div class="content-card-title">
        <img src="../../../assets/images/promotion/hotpromo/signin-1mth/reward-mech-title.png" />
      </div>
      <div class="q-mb-sm">Progressive Reward System + Dynamic Treasure Chest Incentives</div>
      <div class="reward-day-range" v-for="(item, index) in rewardProbability" :key="index">
        <img
          class="day-range-img"
          :src="require(`../../../assets/images/promotion/hotpromo/signin-1mth/day-range-${index + 1}-icon.png`)"
        />
        <span>
          Day
          <b>{{ item.dayRange }}</b>
          Rewards: Claim the Welfare Chest with a random maximum bonus of {{ convertToCommaAmount(item.maxReward) }}BDT
        </span>
      </div>
      <div class="missed-rules-txt">
        *Rules for Missed Sign-ins: If a user misses a day, they must start again from Day 1.
      </div>
      <img
        class="subtitle-img"
        src="../../../assets/images/promotion/hotpromo/signin-1mth/reward-probability-dist-title.png"
      />
      <table class="card-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <thead>
          <tr>
            <th>{{ $t("earnMoney.reward.grade") }}</th>
            <th>{{ $t("earnMoney.reward.totalNoOfValidPlayersInvited") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rewardProbability" :key="index">
            <td>Days {{ item.dayRange }}</td>
            <td>
              <div class="reward-coin-container">
                <img
                  class="reward-coin"
                  src="../../../assets/images/promotion/hotpromo/signin-1mth/reward-probability-coin.png"
                />
                {{ convertToCommaAmount(item.maxReward, false) }} BDT
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <img
        class="subtitle-img"
        src="../../../assets/images/promotion/hotpromo/signin-1mth/reward-claim-conditions-title.png"
      />
      <div class="q-mb-sm" style="text-transform: uppercase">
        Users must meet the daily betting minimum to claim rewards:
      </div>
      <div class="reward-claim-condition">
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 1</span>
            : No betting required; reward can be claimed once.
            <br />
            <span style="margin-top: 8px; margin-bottom: 4px; display: inline-block">
              &nbsp;&nbsp;&bull; If re-starting on Day 1: Minimum cumulative bet of
              <span style="font-size: 14px; color: #11ff00">100 BDT</span>
              required
            </span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 2-3</span>
            : No betting required; reward can be claimed once.
            <br />
            <span style="margin-top: 8px; margin-bottom: 4px; display: inline-block">
              &nbsp;&nbsp;&bull; If re-starting on Days 2-3: Minimum cumulative bet of
              <span style="font-size: 14px; color: #11ff00">100 BDT</span>
              required
            </span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 4</span>
            :
            <span style="font-size: 14px; color: #11ff00">100 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 5</span>
            :
            <span style="font-size: 14px; color: #11ff00">100 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 6</span>
            :
            <span style="font-size: 14px; color: #11ff00">200 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 7</span>
            :
            <span style="font-size: 14px; color: #11ff00">300 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 8-13</span>
            : Minimum cumulative bets of
            <span style="font-size: 14px; color: #11ff00">500 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 14-29</span>
            : Minimum cumulative bets of
            <span style="font-size: 14px; color: #11ff00">600 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">Day 30</span>
            : Minimum cumulative bets of
            <span style="font-size: 14px; color: #11ff00">1,000 BDT</span>
          </span>
        </div>
      </div>
      <div class="misuse-warning-txt">
        Users must meet the betting requirements before claiming rewards to prevent misuse by low-value users.
      </div>
    </div>
    <div class="activity-rule-container">
      <img
        class="activity-rule-img"
        src="../../../assets/images/promotion/hotpromo/signin-1mth/activity-rule-title.png"
      />
      <ul class="activity-rule-list">
        <li>Activity time: January 1 - January 31, 2025</li>
        <li>Bonus rollover requirement: 1x rollover</li>
        <li>
          Bonus distribution: After the event, the rewards will be automatically distributed to your wallet account.
        </li>
      </ul>
    </div>
    <!-- <div class="ranking-list-container">
      <img src="../../../assets/images/promotion/hotpromo/signin-1mth/ranking-list-title.png" />
      <div class="podium-div">
        <img class="podium" src="../../../assets/images/promotion/hotpromo/signin-1mth/podium.png" />
        <img class="medal-1" src="../../../assets/images/promotion/hotpromo/signin-1mth/medal-1.png" />
        <img class="medal-2" src="../../../assets/images/promotion/hotpromo/signin-1mth/medal-2.png" />
        <img class="medal-3" src="../../../assets/images/promotion/hotpromo/signin-1mth/medal-3.png" />
      </div>
    </div> -->
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { convertToCommaAmount } from "src/boot/utils";

const rewardProbability = [
  {
    dayRange: "1-7",
    maxReward: 999
  },
  {
    dayRange: "8-13",
    maxReward: 9999
  },
  {
    dayRange: "14-29",
    maxReward: 99999
  },
  {
    dayRange: "30",
    maxReward: 999999
  }
];

const checkInDay = ref(3);
const getChestDesign = (i) => {
  if (i < 8) {
    return 1;
  } else if (i < 14) {
    return 2;
  } else if (i < 30) {
    return 3;
  }
  return 4;
};
</script>

<style lang="scss">
.content-card {
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px;
  padding: 0 16px 16px;
  margin-top: calc(2% + 16px);
  width: 100%;

  .content-card-title {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    img {
      width: 80%;
      margin-top: -2%;
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
      background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);

      th {
        color: #076b2c;
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
        border: 1px solid #ffffff1a;
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
.check-in-container {
  padding: 0;

  .header-amt {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-image: url("../../../assets/images/promotion/hotpromo/signin-1mth/check-in-header-bg.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    color: #fff96f;
    font-size: 21px;
    font-weight: 700;
    text-align: center;
    padding: 6px 0;
  }

  .check-in-days-visual {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    margin-top: 20px;
    padding: 0 14px;
    height: 80px;
    .day-card {
      display: flex;
      position: relative;
      background: #9dd29466;
      color: #7be0ac;
      border-radius: 8px;
      width: 50px;
      min-width: 50px;
      height: 60px;
      justify-content: center;
      span {
        position: absolute;
        top: 0;
        transform: translateY(70%);
      }
      .day-card-img {
        position: absolute;
        bottom: 0;
        transform: translateY(60%);
        height: 40px;
        &.closed {
          width: 40px;
        }
      }
      &.active {
        background: linear-gradient(180deg, rgba(0, 255, 76, 0.6) 0%, rgba(15, 99, 0, 0.6) 100%);
        color: #fff;
        span {
          font-weight: 700;
          font-size: 11px;
        }
      }
    }
  }
}

.check-in-btm {
  padding: 20px 14px;
  .sign-in-btn {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 28px;
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    color: #000;
    span {
      font-size: 16px;
      font-weight: 700;
    }
    &.is-disabled {
      pointer-events: none;
      filter: brightness(0.4);
    }
    &:active {
      transform: translate(0px, 1px);
      filter: brightness(0.85);
    }
  }

  .bonus-progress-bar {
    height: 8px;
    border-radius: 100px;
    background-color: #ffffff1a;
    margin-top: 10px;

    .bonus-progress-bar-fill {
      height: 100%;
      border-radius: 100px;
      background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
      width: 10%;
    }
  }

  .total-bet-txt {
    margin-top: 6px;
    text-align: end;
  }
}

.reward-mech-container {
  .reward-day-range {
    display: flex;
    margin-top: 4px;
    .day-range-img {
      width: 18px !important;
      height: 18px;
      margin-right: 10px;
    }
  }

  .missed-rules-txt {
    color: #ff0000;
    font-weight: 700;
    font-size: 12px;
    margin-top: 10px;
  }

  .subtitle-img {
    margin: 20px 0 !important;
    width: 80% !important;
    place-self: center;
  }

  .reward-coin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    .reward-coin {
      height: 16px;
      width: 16px !important;
      margin-right: 8px;
    }
  }

  .reward-claim-condition {
    .reward-claim-condition-item {
      margin-top: 4px;
    }
  }
  .misuse-warning-txt {
    color: #c1c400;
    font-weight: 700;
    margin-top: 4px;
  }
}

.activity-rule-container {
  margin: 20px 10px;

  .activity-rule-img {
    margin-bottom: 20px !important;
  }

  .activity-rule-list {
    li {
      color: #fff !important;
    }
  }
}

.ranking-list-container {
  .podium-div {
    padding-top: 100px;
    position: relative;
    display: flex;
    justify-content: center;
    .podium {
      width: 70% !important;
    }
    .medal-1 {
      width: 10% !important;
      position: absolute;
      top: 10%;
      left: 18%;
    }
    .medal-2 {
      width: 10% !important;
      position: absolute;
      top: 0;
    }
    .medal-3 {
      width: 10% !important;
      position: absolute;
      top: 10%;
      right: 18%;
    }
  }
}
</style>
