<template>
  <div class="activities-container">
    <div class="activities-title"><img src="../assets/images/promotion/activities/title-activities.png" /></div>
    <div class="activities-content">
      The more consecutive days of deposit requirements you complete, the more extra bonus you will get
    </div>
    <div class="activities-btn">
      <img src="../assets/images/promotion/activities/btn-deposit.png" />
    </div>
    <div class="activities-stats-container">
      <div class="stats-info">
        <div class="info-title">Deposits of the day</div>
        <div class="info-progress">
          <q-linear-progress :value="progressDeposit" rounded size="16px" class="info-linear-progress">
            <div class="info-label">
              {{ progressDepositLabel }}
            </div>
          </q-linear-progress>
          <div class="info-linear-amt">
            5000
            <br />
            RS
          </div>
        </div>
      </div>
      <div class="stats-info">
        <div class="info-title">Number of daily wager</div>
        <div class="info-progress">
          <q-linear-progress :value="progressDailyWager" rounded size="16px" class="info-linear-progress">
            <div class="info-label">
              {{ progressDailyWagerLabel }}
            </div>
          </q-linear-progress>
          <div class="info-linear-amt">
            25000
            <br />
            RS
          </div>
        </div>
      </div>
    </div>
    <div class="activities-days-container">
      <div class="days-box">
        <div class="box-ribbon">Day1</div>
        <div class="box-img"><img src="../assets/images/promotion/activities/day-01.png" /></div>
        <div class="box-title">Free 88rs</div>
        <div class="box-subtitle">
          Wager x5
          <br />
          Deposit 1000rs
        </div>
      </div>
      <div class="days-box">
        <div class="box-ribbon">Day2</div>
        <div class="box-img"><img src="../assets/images/promotion/activities/day-02.png" /></div>
        <div class="box-title">Free 188rs</div>
        <div class="box-subtitle">
          Wager x5
          <br />
          Deposit 2000rs
        </div>
      </div>
      <div class="days-box">
        <div class="box-ribbon">Day3</div>
        <div class="box-img"><img src="../assets/images/promotion/activities/day-03.png" /></div>
        <div class="box-title">Free 288rs</div>
        <div class="box-subtitle">
          Wager x5
          <br />
          Deposit 3000rs
        </div>
      </div>
      <div class="days-box">
        <div class="box-ribbon">Day4</div>
        <div class="box-img"><img src="../assets/images/promotion/activities/day-04.png" /></div>
        <div class="box-title">Free 688rs</div>
        <div class="box-subtitle">
          Wager x5
          <br />
          Deposit 4000rs
        </div>
      </div>
      <div class="days-box">
        <div class="box-ribbon">Day5</div>
        <div class="box-img"><img src="../assets/images/promotion/activities/day-05.png" /></div>
        <div class="box-title">Free 888rs</div>
        <div class="box-subtitle">
          Wager x5
          <br />
          Deposit 5000rs
        </div>
      </div>
      <div class="days-box">
        <div class="box-ribbon">Day6</div>
        <div class="box-img"><img src="../assets/images/promotion/activities/day-06.png" /></div>
        <div class="box-title">Free 1288rs</div>
        <div class="box-subtitle">
          Wager x5
          <br />
          Deposit 6000rs
        </div>
      </div>
      <div class="days-box days-box__last">
        <div class="box-ribbon">Day7</div>
        <div class="box-img"><img src="../assets/images/promotion/activities/day-07.png" /></div>
        <div>
          <div class="box-title">Free 1288rs</div>
          <div class="box-subtitle">
            Wager x5
            <br />
            Deposit 6000rs
          </div>
        </div>
        <div>&nbsp;</div>
      </div>
    </div>
    <div class="activities-notice">
      <div class="notice-img"><img src="../assets/images/promotion/activities/alert-img.png" /></div>
      <div>Notice : This promotion is not counted towards CASINO and SPORTS wager!</div>
    </div>
    <div class="activities-title q-mt-md"><img src="../assets/images/promotion/activities/title-activities.png" /></div>
    <div class="activities-rules-container">
      1. Example: On the first day, if you deposit 1000rs, you will be given 88rs after the turnover is full. No deposit
      on the second day, but deposit on the third day, it will be recalculated as the first day.
      <br />
      2. The bonus for the day can only be claimed once, for example: each account can only claim 88rs on the first day.
      <br />
      3. After the deposit requirement is met, you must play slot machines to start calculating the turnover, and the
      bonus will be given after the turnover is completed.
      <br />
      4. After the requirements are met, the system will automatically issue the bonus
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const progressDeposit = ref(0.55);
const progressDailyWager = ref(0.78);

const progressDepositLabel = computed(() => (progressDeposit.value * 100).toFixed(2) + "%");
const progressDailyWagerLabel = computed(() => (progressDailyWager.value * 100).toFixed(2) + "%");
</script>

<style lang="scss" scoped>
.activities-container {
  padding: 1rem;

  .activities-title {
    display: flex;
    justify-content: center;
    img {
      display: block;
      width: 100%;
      max-width: 160px;
    }
  }

  .activities-content {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    color: #98a6b4;
    border-radius: 8px;
    margin-top: 1rem;
  }

  .activities-btn {
    margin: 1rem 0;

    img {
      display: block;
      width: 100%;
      max-width: 500px;
    }
  }

  .activities-stats-container {
    background: #5817AA99;
    padding: 1rem;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;

    .stats-info {
      text-align: center;

      .info-title {
        margin-bottom: 0.5rem;
      }

      .info-progress {
        display: flex;
        align-items: center;
        gap: 1rem;
        .info-linear-progress {
          border-radius: 20px;
          width: 100%;
          display: flex;

          :deep(.q-linear-progress__model--determinate) {
            background: linear-gradient(90deg, #fff501 0%, #beff06 100%);
            border-radius: 20px;
          }

          .info-label {
            position: absolute;
            top: 0px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            font-size: 12px;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7), -1px -1px 2px rgba(0, 0, 0, 0.7),
            1px -1px 2px rgba(0, 0, 0, 0.7), -1px 1px 2px rgba(0, 0, 0, 0.7), 1px 1px 2px rgba(255, 255, 255, 0.7),
            -1px -1px 2px rgba(255, 255, 255, 0.7), 1px -1px 2px rgba(255, 255, 255, 0.7),
            -1px 1px 2px rgba(255, 255, 255, 0.7);
          }
        }
        .info-linear-amt {
          min-width: 40px;
          width: 40px;
          font-size: 10px;
        }
      }
    }
  }

  .activities-days-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
    row-gap: 1rem;
    margin-top: 1rem;
    .days-box {
      background: #3B156E4D;

      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      position: relative;

      &__last {
        grid-column: span 3;
        flex-direction: row;
        justify-content: space-evenly;
      }

      .box-ribbon {
        position: absolute;
        top: 10px;
        right: 0;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        color: rgba(255, 255, 255, 0.8);
        background: #4F004B;
        width: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 6px;
        height: 20px;
        font-size: 12px;
      }

      .box-img {
        height: 50px;
        display: flex;
        align-items: center;
        img {
          display: block;
        }
      }

      .box-title {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        margin-top: 4px;
        white-space: nowrap;
      }

      .box-subtitle {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
        margin-top: 4px;
      }
    }
  }

  .activities-notice {
    background: rgba(234, 0, 28, 0.1);
    height: 50px;
    width: 100%;
    padding: 0 12px;
    text-align: center;
    color: #ea001c;
    display: flex;
    font-size: 12px;
    margin-top: 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    position: relative;
    padding-left: 40px;

    .notice-img {
      position: absolute;
      left: -10px;
      top: -10px;
      img {
        display: block;
        width: 70px;
      }
    }
  }
  .activities-rules-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    color: #98a6b4;
    margin-top: 6px;
  }
}
</style>
