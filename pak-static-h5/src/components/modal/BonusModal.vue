<template>
  <div class="bonus-container" :class="{ 'has-top-download': hasTopDownload }">
    <q-btn icon="close" round dense flat v-close-popup class="bonus-close" />
    <div class="bonus-content-wrapper">
      <div v-if="!store.hasDeposit" class="mission-item">
        
        <img class="mission-icon" src="../../assets/images/earn-money/newplayericon.png" />
        <div class="mission-title-wrapper">
          <div class="mission-title">
            <span>New Player Guide</span>
          </div>
        </div>
        <a @click="openNewPlayerGuide">
          <q-btn flat class="details">{{ $t("btn.details") }}</q-btn>
        </a>
      </div>
      <div v-for="(mission, index) in promoList" :key="index" class="mission-item">
        <img class="mission-icon" :src="imgURL + mission.mobileFastAccessIconImgUrl" />
        <div class="mission-title-wrapper">
          <div class="mission-title">
            <span>{{ mission.title }}</span>
            <!-- <div v-if="mission.name === 'wheel-reward'" class="mission-title-extra">$15 12d 14:42:44</div> -->
          </div>
          <!-- <q-icon name="help_outline">
            <q-tooltip>
              {{ mission.description }}
            </q-tooltip>
          </q-icon> -->
        </div>
        <RouterLink :to="{ path: '/promo', query: { name: mission.redirectUrl } }">
          <q-btn flat class="details">{{ $t("btn.details") }}</q-btn>
        </RouterLink>
      </div>
    </div>
    <div class="bonus-header">
      <img :src="require(`../../assets/images/index/modal/bonus-header-${$t('lang.langVal')}.png`)" />
    </div>
  </div>
</template>

<script setup>
import { userStore } from "stores/index";
const emit = defineEmits(["open-new-player"]); 
const store = userStore();
const props = defineProps({
  hasTopDownload: Boolean,
  promoList: Array,
});

const imgURL = process.env.IMAGE_CDN + "/promo/";
const openNewPlayerGuide = () => {
  localStorage.setItem("newPlayerGuide", 1);
  localStorage.removeItem("completeddepositguide");
  localStorage.removeItem("completedreferguide");
  localStorage.removeItem("completedwithdrawguide");
  emit("open-new-player");
}
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
    background-image: url(../../assets/images/index/modal/bonus-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 370px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  &.has-top-download {
    margin-top: 116px;
  }

  .bonus-header {
    display: flex;
    justify-content: center;
    // margin-top: -18px;
    // z-index: 2;
    position: absolute;
    bottom: 5px;
    width: 100%;

    img {
      display: block;
      width: 100%;
      max-width: 248px;
      margin-bottom: -24px;
      margin-right: 24px;
    }
  }

  .bonus-content-wrapper {
    margin: 0 auto 29px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 60vh;
    overflow-y: auto;
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

        &.details {
          background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
          color: #000a01;
        }

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
