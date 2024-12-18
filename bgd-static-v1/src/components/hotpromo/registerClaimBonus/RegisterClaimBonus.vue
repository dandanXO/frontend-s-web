<template>
  <div class="wrapper">
    <div class="bonus-wrapper">
      <img src="./img/bonus-title.png" alt="" class="bonus-title" />

      <div class="bonus-container">
        <div class="bonus-main">
          <img src="./img/bonus-main.png" alt="" />
        </div>
        <div class="bonus-info">
          <div class="bonus-info-item">
            <div class="label">Trial bonus balance:</div>
            <div class="value">0.00</div>
          </div>
          <div class="bonus-info-item">
            <div class="label">Amount available:</div>
            <div class="value">0.00</div>
          </div>
          <div class="bonus-info-item">
            <div class="label">Amount to be unlocked:</div>
            <div class="value">0.00</div>
          </div>
        </div>

        <div class="bonus-progress">
          <div class="bonus-progress-title">
            <div class="bonus-progress-title-left">
              Complete
              <span class="highlight">1/5</span>
              tasks to receive it
            </div>
            <div class="bonus-progress-title-right">
              <img src="./img/clock.png" alt="">
              Thirty Days</div>
          </div>
          <div class="bonus-progress-bar">
            <div class="bonus-progress-bar-fill"></div>
          </div>
          <div class="bonus-progress-text">
            <div class="bonus-progress-text-left">Completed： 1</div>
            <div class="bonus-progress-text-right">Target: 5</div>
          </div>
        </div>

        <div class="bonus-claim-button">Claim now</div>
      </div>
    </div>
    <div class="task-container">
      <div class="task-container-header">
        Task 1: Recharge to unlock
        <div class="status-button progress">in progress</div>
      </div>
      <div class="task-container-content">
        Users need to complete the minimum recharge before they can unlock the withdrawal rights for trial funds and
        earnings.
      </div>

      <div class="bonus-progress">
        <div class="bonus-progress-bar">
          <div class="bonus-progress-bar-fill"></div>
        </div>
        <div class="bonus-progress-text">
          <div class="bonus-progress-text-left">Already recharged: 40</div>
          <div class="bonus-progress-text-right">Amount: 200</div>
        </div>
      </div>
      <div class="task-container-footer">
        Minimum recharge amount: 200, which can unlock all trial funds and income withdrawal rights.
        <br />
        <span class="highlight">30% (recharge + bonus requires double turnover)</span>
      </div>
    </div>

    <div class="task-container">
      <div class="task-container-header">
        Task 2: Invitation Unlocked
        <div class="status-button completed">Completed</div>
      </div>
      <div class="task-container-content">
        Invite 1 friend, and the friend's recharge is ≥200
      </div>

      <div class="bonus-progress">
        <div class="bonus-progress-bar">
          <div class="bonus-progress-bar-fill"></div>
        </div>
        <div class="bonus-progress-text">
          <div class="bonus-progress-text-left">Already recharged: 40</div>
          <div class="bonus-progress-text-right">Amount: 200</div>
        </div>
      </div>
      <div class="task-container-footer">
        Invite 1 friend, and the friend's recharge is ≥200, you can unlock all trial funds and income withdrawal rights.
        <br />
        <span class="highlight">30% (bonus needs to be rolled over twice)</span>
      </div>
    </div>

    <div class="task-container">
      <div class="task-container-header">
        Task 3: Invitation Unlocked
        <div class="status-button progress">in progress</div>
      </div>
      <div class="task-container-content">
        Invite 1 friend again, and the friend's recharge is ≥200
      </div>

      <div class="bonus-progress">
        <div class="bonus-progress-bar">
          <div class="bonus-progress-bar-fill"></div>
        </div>
        <div class="bonus-progress-text">
          <div class="bonus-progress-text-left">Already recharged: 40</div>
          <div class="bonus-progress-text-right">Amount: 200</div>
        </div>
      </div>
      <div class="task-container-footer">
        Invite a friend again, and the friend's recharge is ≥200, you can unlock all trial funds and income withdrawal rights.
        <br />
        <span class="highlight">40% (bonus needs to be rolled over twice)</span>
      </div>
    </div>

    <div class="task-container">
      <div class="task-container-header">
        Task 4: Additional rewards
        <div class="status-button not-completed">Not completed</div>
      </div>
      <div class="task-container-content">
        Invite 1 friend again, and the friend's recharge is ≥200
      </div>

      <div class="bonus-progress">
        <div class="bonus-progress-bar">
          <div class="bonus-progress-bar-fill"></div>
        </div>
        <div class="bonus-progress-text">
          <div class="bonus-progress-text-left">Already recharged: 40</div>
          <div class="bonus-progress-text-right">Amount: 200</div>
        </div>
      </div>
      <div class="task-container-footer">
        Invite a friend again, and the friend's recharge is ≥200, you can unlock all trial funds and income withdrawal rights.
        <br />
        <span class="highlight">40% (bonus needs to be rolled over twice)</span>
      </div>
    </div>

    <div class="task-container">
      <div class="task-container-header">
        Task 5: Additional rewards
        <div class="status-button completed">Completed</div>
      </div>
      <div class="task-container-content">
        Invite a friend again, and the friend recharges ≥200, and you will get an additional 150 cashback.
      </div>

      <div class="bonus-progress">
        <div class="bonus-progress-bar">
          <div class="bonus-progress-bar-fill"></div>
        </div>
        <div class="bonus-progress-text">
          <div class="bonus-progress-text-left">Already recharged: 40</div>
          <div class="bonus-progress-text-right">Amount: 200</div>
        </div>
      </div>
      <div class="task-container-footer">
        Invite a friend again, and the friend recharges ≥200, and you will get an additional 150 cashback.
        <br />
        <span class="highlight">(The bonus needs to be doubled)</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "src/stores";
import { api } from "boot/axios";

const router = useRouter();

const store = userStore();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

const isFtdPromoEnded = computed(() => {
  if (store.ftd !== "OPEN") {
    return true;
  }
  return false;
});

const gotoDepositPage = () => {
  const redirectPage = params && params.page ? params.page : "/deposit?from=/promo";
  router.push(redirectPage);
};

const loadAppTabs = () => {
  api.get("/opt-session/getPakAppTabs").then((res) => {
    if (res.code === 0) {
      const { data } = res;
      if (data && data.hasOwnProperty("ftd")) {
        store.ftd = data.ftd;
      }
    }
  });
};

onMounted(() => {
  loadAppTabs();
});
</script>
<style lang="scss" scoped>
.bonus-wrapper {
  position: relative;
  padding-top: 10px;
  margin-bottom: 16px;

  .bonus-title {
    width: 80% !important;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0px;
  }

  .bonus-container {
    background-color: #1e371f;
    border: 1px solid #337e3a;
    padding-top: 72px;
    border-radius: 10px;

    .bonus-main {
      background-image: url("./img/bonus-main-bg.png");
      background-size: cover;
      margin-bottom: 16px;

      img {
        width: 80% !important;
        margin: 0 auto;
      }
    }

    .bonus-info {
      background-color: #ffffff1a;
      padding: 0 12px;
      margin: 0 12px 16px;
      border-radius: 4px;

      .bonus-info-item {
        font-size: 12px;
        font-weight: bold;
        border-bottom: 1px solid #ffffff1a;
        padding: 8px 0 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
          color: white;
        }

        .value {
          color: #fff96f;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }

    .bonus-claim-button {
      background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
      box-shadow: 0px 2px 0px 0px #1dca6a;
      color: #000000;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      margin: 12px;
      border-radius: 28px;
      padding: 12px 0;
    }
  }
}

.task-container {
  border: 1px solid #337e3a;
  border-radius: 10px;
  overflow: hidden;
  padding-bottom: 12px;
  margin-bottom: 16px;

  .task-container-header {
    background: linear-gradient(180deg, #70bc62 0%, #33562d 100%), linear-gradient(90deg, #24ee89 0%, #9fe871 100%),
      linear-gradient(180deg, #70bc62 0%, #33562d 100%);
    color: white;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    padding: 12px;

    .status-button {
      font-size: 10px;
      font-weight: bold;
      border-radius: 100px;
      width: 100px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.not-completed {
        color: #3b3b3b;
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
        linear-gradient(90deg, #888888 0%, #a0a0a0 100%);
      }

      &.completed {
        color: #076300;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
          linear-gradient(90deg, #24ee89 0%, #9fe871 100%);

        &::after {
          content: "";
          display: inline-block;
          width: 10px;
          height: 7px;
          background-image: url("./img/check-icon.png");
          margin-left: 4px;
          background-size: cover;
        }
      }

      &.progress {
        color: #624400;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
          linear-gradient(90deg, #eeab24 0%, #e8de71 100%);
      }
    }
  }

  .task-container-content {
    color: white;
    font-size: 12px;
    padding: 12px;
  }

  .task-container-footer {
    background: #ffffff1a;
    color: white;
    font-size: 9px;
    padding: 6px;
    margin: 0 12px;
    border-radius: 4px;
  }
}

.bonus-progress {
  margin: 0 12px;

  .bonus-progress-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
    color: #ffffff;
    font-weight: bold;

    .bonus-progress-title-right {
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        width: 16px !important;
        height: 16px !important;
        margin: 0 !important;
      }
    }
  }

  .bonus-progress-bar {
    height: 8px;
    border-radius: 100px;
    background-color: #ffffff1a;

    .bonus-progress-bar-fill {
      height: 100%;
      border-radius: 100px;
      background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
      width: 10%;
    }
  }

  .bonus-progress-text {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    font-size: 12px;
    color: #ffffff;
    font-weight: bold;
  }
}

.highlight {
  color: #fff96f;
}
</style>
