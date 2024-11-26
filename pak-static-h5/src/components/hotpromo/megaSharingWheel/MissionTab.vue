<template>
  <div class="mission-tab-wrapper">
    <span class="mission-description">{{ $t("hotPromo.megaSharingWheel.missionDescription") }}</span>
    <ProgressBar class="mission-total-progress" :progress="totalProgress" />
    <div class="mission-list">
      <div v-for="(mission, index) in missionDetail" :key="index" class="mission-item">
        <div class="mission-item__description-wrapper">
          <span class="mission-item__title">
            {{ mission.title }}
            <span class="mission-item__title-amount">{{ mission.total }}</span>
          </span>
          <button class="mission-item__action">{{ $t("btn.confirm") }}</button>
        </div>
        <ProgressBar class="mission-item__progress" :progress="mission.progress * 100">
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
import { computed, ref, toRefs } from "vue";
import ProgressBar from "./ProgressBar.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const missionDetail = computed(() => [
  { title: t("hotPromo.megaSharingWheel.invitedUsersDeposit"), progress: 0, total: 2, current: 0 },
  { title: t("hotPromo.megaSharingWheel.invitedUsersValidBet"), progress: 0.3, total: 1000, current: 300 },
  { title: t("hotPromo.megaSharingWheel.EligibleInvitedUsers"), progress: 0.4, total: 5, current: 2 }
]);
const totalProgress = computed(() => {
  const finishedMissionLength = missionDetail.value.filter((item) => item.progress >= item.total).length;
  return (finishedMissionLength / missionDetail.value.length) * 100;
});
</script>
<style lang="scss" scoped>
.mission-tab-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
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
