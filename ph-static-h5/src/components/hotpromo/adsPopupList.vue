<template>
  <div class="ads-popup-list-dialog-container">
    <q-dialog v-model="visible" class="ads-popup-list-dialog" persistent>
      <div class="ads-popup-container">
        <img class="top-hat" src="../../assets/images/promotion/adsPopupList/top-hat.png" />
        <div class="ads-popup-list-container">
          <q-icon class="close-btn" name="cancel" size="lg" @click="visible = false" color="white" />
          <div class="left">
            <div
              :class="`promo-title-wrapper ${selectedAdDetails?.promoCode === ad.promoCode ? 'active' : ''}`"
              v-for="ad in adsList"
              :key="ad.promoCode"
              @click="selectedAdCode = ad.promoCode"
            >
              {{ ad.title }}
            </div>
          </div>
          <div class="right">
            <template v-if="selectedAdDetails">
              <div class="promo-banner" @click="visible = false">
                <router-link :to="`/promo?code=${selectedAdDetails.promoCode}`">
                  <img
                    class="promo-banner-img"
                    style="width: 100%"
                    :src="`${imgURL}/promo/${selectedAdDetails.imageUrl}`"
                  />
                </router-link>
              </div>
              <div class="promo-content" v-html="selectedAdDetails.content"></div>

              <router-link :to="`/promo?code=${selectedAdDetails.promoCode}`">
                <div class="btn-join-now" @click="visible = false">Join Now</div>
              </router-link>
            </template>
          </div>
        </div>
        <div class="do-not-remind-ribbon">
          <input class="do-not-remind-checkbox" type="checkbox" @change="toggleDoNotRemind" />
          <span class="do-not-remind-text">Do not remind me today</span>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineExpose } from "vue";
import { getAdsPopupList } from "src/api/index/promo";
import moment from "moment";
import { userStore } from "stores/index";

const visible = ref(false);
const adsList = ref([]);
const selectedAdCode = ref();
const imgURL = process.env.IMAGE_CDN;
const store = userStore();

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

const initGetAdsList = () => {
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
  initGetAdsList
});
</script>

<style lang="scss" scoped>
.ads-popup-container {
  position: relative;
  background: none;
  width: 350px;
  height: 500px;
  padding: 50px 0px;
  background: none !important;

  .top-hat {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 20%);
    z-index: 1;
    height: 50px;
  }

  .do-not-remind-ribbon {
    position: absolute;
    bottom: 0px;
    right: 0px;
    transform: translate(-10%, -195%);
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
  grid-template-rows: auto 1fr;
  width: 350px;
  height: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;

  .close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    z-index: 1;
  }

  .left {
    display: flex;
    background: #ecf5ff;
    padding: 20px;
    gap: 10px;
    overflow: auto;
    position: relative;

    .promo-title-wrapper {
      background-color: #bdd3f6;
      color: #707a8c;
      font-family: "Inter Regular";
      font-size: 12px;
      font-weight: 400;
      height: fit-content;
      padding: 10px 20px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;

      &.active {
        font-family: "Inter Bold";
        color: #fff;
        font-weight: 700;
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      }
    }
  }

  .right {
    max-height: 400px;
    overflow: auto;
    padding: 20px;
    background: url("../../assets/images/promotion/adsPopupList/coins.png") no-repeat bottom right;
    background-size: contain;
    position: relative;
    background-color: #f7fbff;

    .promo-banner {
      .promo-banner-img {
        border-radius: 10px;
      }
    }

    .promo-content {
      background: #ecf5ff66;
      border-radius: 10px;
      padding: 30px;
    }

    .btn-join-now {
      background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      border-radius: 12px;
      width: 100%;
      max-width: 300px;
      margin: 6px auto 10px;
      height: 48px;
      line-height: 48px;
      color: #fff;
      font-family: "Inter Medium";
      font-size: 15px;
      text-align: center;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }
    }
  }
}

.body--dark {
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
