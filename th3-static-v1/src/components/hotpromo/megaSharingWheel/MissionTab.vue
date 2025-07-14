<template>
  <div class="mission-tab-wrapper">
    <span class="mission-description">{{ $t("hotPromo.megaSharingWheel.missionDescription") }}</span>
    <ProgressBar class="mission-total-progress" :progress="totalProgress" />
    <div class="mission-list">
      <div v-for="(mission, index) in missionDetails" :key="index" class="mission-item">
        <div class="mission-item__description-wrapper">
          <span class="mission-item__title">
            {{ mission.title }}
            <span class="mission-item__title-amount">{{ mission.total }}</span>
          </span>
          <button
            class="mission-item__action"
            :class="{ completed: mission.current / mission.total >= 1 }"
            @click="handleConfirmBtnClick(mission)"
          >
            {{ mission.current / mission.total >= 1 ? $t("btn.completed") : mission.actionBtnName }}
          </button>
        </div>
        <ProgressBar class="mission-item__progress" :progress="(mission.current / mission.total) * 100">
          <template #text>
            {{ mission.current }}
          </template>
        </ProgressBar>
        <div class="mission-item__amount">
          <span>0</span>
          <span>{{ mission.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import ProgressBar from "./ProgressBar.vue";
import { useI18n } from "vue-i18n";

const router = useRouter();
const props = defineProps(["missionDetails", "totalProgress"]);
const { t } = useI18n();
const route = useRoute();

const closeMegaSharingWheelDialog = route.path === "/home" ? inject("closeMegaSharingWheelDialog") : null;

const handleConfirmBtnClick = (mission) => {
  const isCompleted = mission.current / mission.total >= 1;
  if (!isCompleted) {
    switch (mission.title) {
      case t("hotPromo.megaSharingWheel.invitersUsersDeposit"):
        router.push("/deposit");
        break;
      case t("hotPromo.megaSharingWheel.invitersUsersValidBet"):
        if (route.path !== "/home") {
          router.push("/home");
        } else if (closeMegaSharingWheelDialog) {
        }

        break;
      default:
        router.push("/earn-money");
    }
    closeMegaSharingWheelDialog();
  }
};
</script>
<style lang="scss" scoped>
.mission-tab-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  padding: 0 20px;

  .mission-description {
    margin-bottom: 14px;
    font-size: 12px;
    line-height: 16.8px;
  }
  .mission-total-progress {
    width: 100%;
    margin-bottom: 16px;
  }

  .mission-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    .mission-item {
      padding: 12px;
      background-color: #5f5f5f;
      border-radius: 8px;
      .mission-item__description-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .mission-item__title {
          font-size: 10px;
          line-height: 16px;
          font-weight: 600;
        }
        .mission-item__title-amount {
          font-size: 10px;
          line-height: 16px;
          font-weight: 600;
          color: #ffb200;
        }
        .mission-item__action {
          background: url(../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/claim-btn.png) no-repeat;
          background-size: cover;
          border: none;
          aspect-ratio: 80/24;
          width: 80px;
          font-size: 12px;
          font-weight: 700;
          line-height: 18px;
          color: #863100;
          cursor: pointer;
          &:hover {
            filter: brightness(1.2);
          }
          &.completed {
            filter: grayscale(100%) opacity(0.5);
          }
        }
      }
      .mission-item__progress {
        width: 100%;
        margin-bottom: 2px;
      }
      .mission-item__amount {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
      }
    }
  }
}
</style>
