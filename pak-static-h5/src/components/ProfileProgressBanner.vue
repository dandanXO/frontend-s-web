<template>
  <div class="progress-container">
    <div class="left-container">
      <div class="profile-pic">
        <q-avatar size="50px">
          <img :src="profileImagePath" />
        </q-avatar>

        <div class="vip-details" @click="onVipClick">
          <img
            class="bg"
            :src="require(`../assets/images/index/vip-badge/vip-${store.vip.replace('VIP', '')}.png`)"
            alt=""
          />
        </div>
      </div>

      <div class="nickname">{{ store.realName ? store.realName : store.nickName }}</div>
    </div>

    <div class="right-container">
      <div class="amount-progress-container">
        <div class="vip-text">{{ store.vip }}</div>
        <div v-if="store.vip.replace('VIP', '') !== '12'" class="progress-num">{{ `${progressRef} / ${maxProgress}` }}</div>
      </div>
      <q-linear-progress
        reverse
        rounded
        size="8px"
        :value="progressBarRef"
        class="progress-bar"
        color="grey-9"
      ></q-linear-progress>
      <div class="win-gift-text">{{ $t("settings.depositMonthlytoWinGifts") }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { userStore } from "stores/index";
import { convertToCommaAmount } from "src/boot/utils";

const store = userStore();

// progress bar
const maxProgress = store.levelUpDeposit.toFixed(2);
const progressRef = ref(store.currentDeposit.toFixed(2));

/**
 * NOTE: q-linear-progress
 * the coloring on the bar done w/ css props "background" & "color"
 * figma required linear-gradient which wasn't available in "color"
 * hence switch "background" to "color" & "color" to "background", reverse value 1 - result.
 */
let progressBarRef = ref();
progressBarRef.value = 1 - progressRef.value / maxProgress;

const randomProfileImg = computed(() => {
  const storedImg = sessionStorage.getItem("PROFILE_IMG");
  if (storedImg) {
    return storedImg;
  } else {
    const randomIndex = Math.floor(Math.random() * 24) + 1;
    const imgPath = `image-${randomIndex}`;
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});

const profileImagePath = computed(() => {
  return require(`../assets/images/account/profile/${randomProfileImg.value}.png`);
});
</script>

<style lang="scss" scoped>
.progress-container {
  
  display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0 1rem 0;
    border-radius: 8px;
    min-height: 130px;

  .left-container {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 100px;

    .profile-pic {
      margin: 0 15px 15px;

      .vip-details {
        position: relative;
        margin-left: 20px;
        margin-bottom: 5px;
        margin-top: -10px;

        img {
          display: block;
          width: 60px;
          position: absolute;
          top: -2px;
          left: -25px;
        }

        .vip-level {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          line-height: 1.1;
          padding-top: 2px;
          padding-bottom: 4px;
          z-index: 3;
          color: #00ae00;
          font-weight: bold;
        }
      }
    }

    .nickname {
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: auto;
    }
  }

  .right-container {
    position: relative;
    top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    font-weight: bold;

    width: 100%;
    background: linear-gradient(90deg, #323738 0%, #404F4E 100%);
    padding: 15px;
    border-radius: 10px;
    .amount-progress-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

    }

    .progress-bar {
      // border: 1px solid #fed87d;
      // background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      // background: linear-gradient(356.25deg, #00430b -0.21%, #00ae00 93.65%);
      border-radius: 100px;
      color: #320b5b;
      // background: linear-gradient(90deg, #2CED88 0%, #9EE871 100%);

    }

    .vip-text {
      font-size: 20px;
      font-weight: 700;
    }

    .win-gift-text {
      margin-top: 5px;
      text-align: right;
      color: #B2BDBF;
      font-weight: 400;
    }
  }
}
</style>
