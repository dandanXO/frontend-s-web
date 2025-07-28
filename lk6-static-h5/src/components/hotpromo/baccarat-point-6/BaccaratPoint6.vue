<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg v2">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div class="claim-title-icon-v2"></div>
            {{ $t("hotpromo.baccaratBonus.claimSection.title") }}
          </div>
          <div class="reward-desc">
            <i18n-t keypath="hotpromo.baccaratBonus.claimSection.desc" tag="span">
              <template #telegram>
                <span class="link" @click="openTelegram">@xy6vip</span>
              </template>
            </i18n-t>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="openTelegram">
            <img
              v-if="languageVal !== 'en'"
              src="../../../assets/images/promotion/hotpromo/common/claim-btn4.png"
              alt=""
              width="100%"
            />
            <img v-else src="../../../assets/images/promotion/hotpromo/common/claim-btn4-en.png" alt="" width="100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { i18nStore } from "src/router/language";
import { useUI } from "src/stores/ui";

const { languageVal } = storeToRefs(i18nStore());
const ui = useUI();

const openTelegram = () => {
  window.open(ui.telegramUrl, "_blank");
};
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}

.livepoker-rebate-container {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 20px 12px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promotion/hotpromo/common/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  &.v2 {
    background-image: url("../../../assets/images/promotion/hotpromo/common/section-bg-v2.png");
    padding-bottom: 0;
  }

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;

    .reward-desc {
      .link {
        color: #ff0000;
      }
    }
  }

  .livepoker-rebate-section-right {
    width: 180px;
    margin-top: 20px;

    .bonus-image {
      width: 100%;
      cursor: pointer;

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }

      &.disabled {
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
      }

      &.loading {
        cursor: not-allowed;
        opacity: 0.8;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
}

.reward-info {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.reward-info-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: black;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}
</style>
