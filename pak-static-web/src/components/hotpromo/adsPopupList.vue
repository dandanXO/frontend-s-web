<template>
  <div class="ads-popup-list-dialog-container">
    <a-modal
      v-model:visible="visible"
      :footer="null"
      width="80%"
      destroy-on-close
      centered
      class="ads-popup-list-dialog"
    >
      <div class="ads-popup-container">
        <img class="top-hat" src="../../assets/images/promotion/adsPopupList/top-hat.png" />
        <img class="bottom-coins" src="../../assets/images/promotion/adsPopupList/bottom-coins.png" />
        <img class="left-coin" src="../../assets/images/promotion/adsPopupList/left-coin.png" />
        <img class="right-coin" src="../../assets/images/promotion/adsPopupList/right-coin.png" />
        <div class="do-not-remind-ribbon">
          <input class="do-not-remind-checkbox" type="checkbox" @change="toggleDoNotRemind" />
          <span class="do-not-remind-text">Do not remind me today</span>
        </div>
        <div class="ads-popup-list-container">
          <div class="left">
            <div
              :class="`promo-title-wrapper ${selectedAdDetails?.promoCode === ad.promoCode ? 'active' : ''}`"
              v-for="ad in adsList"
              @click="selectedAdCode = ad.promoCode"
            >
              <img
                :style="selectedAdDetails?.promoCode === ad.promoCode ? 'visibility:visible' : 'visibility:hidden'"
                src="../../assets/images/promotion/adsPopupList/active-tab-icon.png"
              />
              <span>{{ ad.title }}</span>
            </div>
          </div>
          <div class="right">
            <img
              class="close-btn"
              src="../../assets/images/promotion/adsPopupList/close-btn.png"
              @click.prevent="visible = false"
            />
            <template v-if="selectedAdDetails">
              <div class="promo-banner" @click="visible = false">
                <router-link :to="`/promotion?code=${selectedAdDetails.promoCode}`">
                  <img
                    class="promo-banner-img"
                    style="width: 100%"
                    :src="`${imgURL}/promo/${selectedAdDetails.imageUrl}`"
                  />
                </router-link>
              </div>
              <div class="promo-inner">
                <div class="promo-content" v-html="selectedAdDetails.content"></div>

                <router-link :to="`/promotion?code=${selectedAdDetails.promoCode}`">
                  <div class="btn-join-now" @click="visible = false">Join Now</div>
                </router-link>
              </div>
            </template>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineExpose } from "vue";
import { getAdsPopupList } from "@/api/index/promo";
import moment from "moment";
import { userStore } from "@/store";
import { useRouter } from "vue-router";

const visible = ref(false);
const adsList = ref([]);
const selectedAdCode = ref();
const imgURL = process.env.VUE_APP_IMAGE_CDN;
const store = userStore();
const router = useRouter();

const selectedAdDetails = computed(() => {
  if (selectedAdCode.value) {
    return adsList.value.find(({ promoCode }) => promoCode === selectedAdCode.value);
  }

  return null;
});

const toggleDoNotRemind = (ev) => {
  const isChecked = ev.target.value === "on";

  if (isChecked) {
    localStorage.setItem("ADS_POPUP", moment().format("YYYY-MM-DD"));
  } else {
    localStorage.removeItem("ADS_POPUP");
  }
};

const initAdsPopupList = () => {
  if (store.currentDeposit === "0.0000" || parseInt(store.currentDeposit) === 0) {
    router.push("/promotion");
  }

  if (store.token) {
    const doNotRemindDate = localStorage.getItem("ADS_POPUP");

    if (
      !doNotRemindDate ||
      (doNotRemindDate && moment(doNotRemindDate).isValid() && moment().isAfter(moment(doNotRemindDate), "date"))
    ) {
      getAdsPopupList().then((res) => {
        if (res.code === 0) {
          adsList.value = res.data;

          if (adsList.value.length > 0) {
            selectedAdCode.value = res.data[0].promoCode;
            visible.value = true;
          }
        }
      });
    }
  }
};

const initGetAdsPopupList = () => {
  getAdsPopupList().then((res) => {
    if (res.code === 0) {
      adsList.value = res.data;

      if (adsList.value.length > 0) {
        selectedAdCode.value = res.data[0].promoCode;
        visible.value = true;
      }
    }
  });
};

defineExpose({
  initAdsPopupList,
  initGetAdsPopupList
});
</script>

<style lang="scss">
.ads-popup-list-dialog {
  .ant-modal-close {
    display: none;
  }

  .ant-modal-body {
    padding: 0px !important;
    margin-left: -60px;
  }

  .ant-modal-content {
    background: transparent !important;
    box-shadow: none !important;
  }
}
</style>
<style lang="scss" scoped>
.ads-popup-container {
  position: relative;
  background: none;
  padding: 100px;
  width: 1340px;
  height: 650px;
  margin: auto;

  .top-hat {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-45%, -10%);
    z-index: 1;
  }

  .bottom-coins {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 60%);
    z-index: -1;
  }

  .left-coin {
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translate(-15%, 20%);
  }

  .right-coin {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translate(70%, -50%);
  }

  .do-not-remind-ribbon {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(-20%, 185%);
    z-index: 1;
    background: url("../../assets/images/promotion/adsPopupList/do-not-remind-ribbon.png");
    background-size: 100% 100%;
    width: 304px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: #fff;
  }
}

.ads-popup-list-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  width: 1240px;
  height: 550px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;

  .left {
    display: flex;
    flex-direction: column;
    background: #ecf5ff;
    padding: 20px 0px;

    .promo-title-wrapper {
      color: #83a3ca;
      font-size: 18px;
      font-weight: 400;
      line-height: 20px;
      padding: 10px;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 5px;

      &:hover,
      &.active {
        color: #2b2b82;
        font-weight: 700;
        background: linear-gradient(270deg, rgba(7, 91, 232, 0.2) 0%, rgba(7, 91, 232, 0) 100%);
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  .right {
    max-height: 650px;
    overflow: auto;
    padding: 20px;
    background: url("../../assets/images/promotion/adsPopupList/coins.png") no-repeat bottom right;
    background-size: contain;
    position: relative;
    background-color: #f7fbff;

    .close-btn {
      position: absolute;
      right: 30px;
      top: 30px;
      cursor: pointer;
    }

    .promo-banner {
      .promo-banner-img {
        border-radius: 10px;
      }
    }

    .promo-inner {
      position: relative;

      .btn-join-now {
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        border-radius: 12px;
        width: 225px;
        height: 48px;
        line-height: 48px;
        color: #fff;
        font-family: "Inter Medium";
        font-size: 15px;
        text-align: center;

        position: absolute;
        right: 0px;
        top: 30px;

        &:hover {
          opacity: 0.9;
        }

        &:active {
          filter: brightness(0.85);
          transform: translate(0px, 1px);
        }
      }
    }

    .promo-content {
      background: #ecf5ff66;
      border-radius: 10px;
      padding: 30px 16px;
      width: calc(100% - 225px);
    }
  }
}

.dark-theme {
  .ads-popup-list-container {
    background-color: #15141a;

    .left {
      background: #ffffff0a;

      .promo-title-wrapper {
        color: #83a3ca;

        &:hover,
        &.active {
          color: #ffffff;
          background: linear-gradient(270deg, rgba(7, 91, 232, 0.2) 0%, rgba(7, 91, 232, 0) 100%);
        }
      }
    }

    .right {
      background-color: #ffffff05;

      .promo-content {
        background: transparent;
      }
    }
  }
}
</style>
