<template>
  <div class="progress-container">
    <div class="receive-reward-text" v-if="props.isEligibleClaimPrize">
      <img width="20" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/money-icon.png" />
      <span>Please receive your reward</span>
    </div>
    <div>
      <div class="congrats-text" v-if="props.isEligibleClaimPrize">Congratulations! Lucky star, you win!!</div>
      <div class="money-info">
        <div class="money-icon">
          <img width="50" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/money-icon.png" />
        </div>
        <div class="money-num">₱ {{ props.prize }}</div>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-bar-container">
        <div class="outer-bar transparent">
          <div class="inner-bar transparent" :style="{ width: props.progress + '%' }" />
          <div class="progress-num">{{ props.progress }}%</div>
        </div>
        <div class="outer-bar">
          <div class="inner-bar" :style="{ width: props.progress + '%' }" />
        </div>
      </div>
    </div>

    <div class="remaining-progress">
      <div v-if="props.progress >= 0 && props.progress <= 100">
        <span class="highlight">{{ 100 - props.progress }}</span>
        % is still required to withdraw
      </div>
    </div>

    <div class="helpers-list">
      <div class="helper" v-for="(helper, index) in props.helpersList" :key="index">
        <div class="login-name">{{ helper.loginName }}</div>
        <div class="progress">{{ `+ ${helper.progress}%` }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(["prize", "progress", "isEligibleClaimPrize", "helpersList"]);
</script>

<style lang="scss" scoped>
.progress-container {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background-color: #f2f5fc;
  padding: 5px 15px;
  gap: 5px;

  .receive-reward-text {
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      font-size: 16px;
      font-weight: 700;
    }
  }

  .congrats-text {
    color: #3887ff;
    text-align: center;
    font-size: 14px;
  }

  .money-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;

    .money-num {
      color: #2b2b82;
      font-size: 3rem;
      font-weight: 700;
    }
  }

  .progress-bar {
    .progress-bar-container {
      width: 100%;
      display: flex;
      flex-direction: column;

      .outer-bar {
        border-radius: 16px;
        background: #cad7eb;

        width: 100%;
        overflow: hidden;

        display: flex;
        align-items: center;

        &.transparent {
          background: transparent;
          border-radius: 0px;
        }

        .progress-num {
          margin-bottom: 5px;
          color: #000;
        }
      }

      .inner-bar {
        color: #fff;
        border-radius: 16px;
        background: #5406e8;
        height: 12px;
        position: relative;
      }
    }
  }

  .remaining-progress {
    text-align: center;
    color: #92acd2;

    .highlight {
      color: #3887ff;
    }
  }

  .helpers-list {
    display: flex;
    flex-direction: column;

    .helper {
      display: flex;
      justify-content: space-between;
      font-size: 16px;

      .login-name {
        color: #92acd2;
      }

      .progress {
        color: #3887ff;
      }
    }
  }
}

.body--dark {
  .progress-container {
    background-color: rgba(223, 238, 255, 0.1);

    .receive-reward-text {
      color: #fff;
    }

    .money-info {
      .money-num {
        color: #fff;
      }
    }

    .progress-bar {
      .progress-bar-container {
        .inner-bar {
          background-color: #49ace7;
        }

        .outer-bar {
          .progress-num {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
