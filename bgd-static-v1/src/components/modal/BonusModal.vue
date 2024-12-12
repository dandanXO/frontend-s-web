<template>
  <div class="bonus-container" :class="{ 'has-top-download': hasTopDownload }">
    <q-btn icon="close" round dense flat v-close-popup class="bonus-close" />
    <div class="bonus-content-wrapper">
      <div v-for="(mission, index) in missions" :key="index" class="mission-item">
        <img class="mission-icon" :src="mission.icon" />
        <div class="mission-title-wrapper">
          <div class="mission-title">
            <span>{{ mission.title }}</span>
            <div v-if="mission.name === 'wheel-reward'" class="mission-title-extra">$15 12d 14:42:44</div>
          </div>
          <q-icon name="help_outline">
            <q-tooltip>
              {{ mission.description }}
            </q-tooltip>
          </q-icon>
        </div>
        <q-btn flat :class="mission.status" :disabled="mission.status !== 'receive'">
          <template v-if="mission.status === 'receive'">
            {{ $t("btn.receive") }}
          </template>
          <template v-else-if="mission.status === 'received'">
            {{ $t("btn.received") }}
          </template>
          <template v-else>
            {{ $t("btn.noRewardYet") }}
          </template>
        </q-btn>
      </div>
    </div>
    <div class="bonus-header"><img src="../../assets/images/index/modal/bonus-header.png" /></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  hasTopDownload: Boolean
});

const { t } = useI18n();

const missions = computed(() => [
  {
    name: "wheel-of-fortune",
    title: t("home.popup.bonus.wheelOfFortuneTitle"),
    description: t("home.popup.bonus.wheelOfFortuneDescription"),
    status: "no-reward",
    icon: require("../../assets/images/index/modal/bonus-wheel.png")
  },
  {
    name: "cash-back",
    title: t("home.popup.bonus.cashBackTitle"),
    description: t("home.popup.bonus.cashBackTitle"),
    status: "received",
    icon: require("../../assets/images/index/modal/bonus-cash.png")
  },
  {
    name: "activity-bonus",
    title: t("home.popup.bonus.activityBonusTitle"),
    description: t("home.popup.bonus.activityBonusTitle"),
    status: "receive",
    icon: require("../../assets/images/index/modal/bonus-coupon.png")
  },
  {
    name: "give-back",
    title: t("home.popup.bonus.giveBackTitle"),
    description: t("home.popup.bonus.giveBackTitle"),
    status: "receive",
    icon: require("../../assets/images/index/modal/bonus-clock.png")
  },
  {
    name: "hierarchy",
    title: t("home.popup.bonus.hierarchyTitle"),
    description: t("home.popup.bonus.hierarchyTitle"),
    status: "receive",
    icon: require("../../assets/images/index/modal/bonus-vip.png")
  },
  {
    name: "wheel-reward",
    title: t("home.popup.bonus.wheelRewardTitle"),
    description: t("home.popup.bonus.wheelRewardTitle"),
    status: "receive",
    icon: require("../../assets/images/index/modal/bonus-wheel.png")
  }
]);
</script>

<style lang="scss" scoped>
.bonus-container {
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px !important;
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;
  margin-bottom: -100px;
  margin-top: 60px;

  &:before {
    content: "";
    background-image: url(../../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: rotate(180deg) translateY(-100%) scaleX(-1);
    z-index: -1;
  }

  &.has-top-download {
    margin-top: 116px;
  }

  .bonus-header {
    display: flex;
    justify-content: center;
    margin-top: -18px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      max-width: 248px;
      margin-bottom: -24px;
    }
  }

  .bonus-content-wrapper {
    margin: 0 auto 29px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .mission-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 8px 8px 8px 6px;
      background-color: #81ff9e1a;
      border-radius: 8px;

      .mission-icon {
        width: 40px;
        max-width: 10vw;
      }
      .mission-title-wrapper {
        display: flex;
        align-items: center;
        flex-grow: 1;
        > :first-child {
          margin-right: 7px;
        }

        .mission-title {
          display: flex;
          flex-direction: column;
          font-weight: 700;
          color: #fff;
        }

        .mission-title-extra {
          color: #00ff44;
        }
      }

      .q-btn {
        border-radius: 4px;
        font-weight: 700;
        text-transform: none;

        &.receive {
          background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
          color: #000a01;
        }

        &.received,
        &.no-reward {
          background: linear-gradient(90deg, rgba(36, 238, 137, 0.156) 0%, rgba(36, 238, 137, 0.078) 100%);
          box-shadow: 0px 0px 5px 0px #ffffff4a inset;
          color: #ffffff99;
        }
      }
    }
  }
}

.bonus-close {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
