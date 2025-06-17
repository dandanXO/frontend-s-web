<template>
  <div class="progress-container">
    <div class="left-container">
      <div class="profile-pic">
        <q-avatar size="50px">
          <img :src="profileImagePath" />
        </q-avatar>

        <div class="vip-details" @click="onVipClick">
          <img src="../assets/images/index/vip-row.png" alt="" />
          <div class="vip-level">
            {{ store.vip }}
          </div>
        </div>
      </div>

      <!-- <div class="nickname">{{ store.realName ? store.realName : store.nickName }}</div> -->
    </div>

    <div class="right-container">
      <div class="amount-progress-container">
        <div class="vip-text">{{ store.vip }}</div>
        <div class="progress-num">{{ `${progressRef} / ${maxProgress}` }}</div>
      </div>
      <q-linear-progress
        reverse
        rounded
        size="15px"
        :value="progressBarRef"
        class="progress-bar"
        color="white"
      ></q-linear-progress>
      <div class="win-gift-text">{{ $t("settings.depositMonthlytoWinGifts") }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { userStore } from "@/stores/index";

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

const profileImg = [
  {
    imgPath: ["profile-pic"]
  }
];
const randomProfileImg = computed(() => {
  const storedImg = sessionStorage.getItem("PROFILE_IMG");
  if (storedImg) {
    return storedImg;
  } else {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});

const profileImagePath = computed(() => {
  return require(`../assets/images/account/${randomProfileImg.value}.png`);
});
</script>

<style lang="scss" scoped>
.progress-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;
  margin: 1.5rem 0 1rem 0;
  background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  border-radius: 8px;
  min-height: 130px;
  padding: 14px;

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
          width: 100px;
          position: absolute;
          top: -17px;
          left: -45px;
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
          color: #334ad6;
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

    .amount-progress-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-bar {
      border: 1px solid #fed87d;
      // background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
      border-radius: 100px;
      color: #320b5b;
    }

    .vip-text {
      font-size: 20px;
      font-weight: 700;
    }

    .win-gift-text {
      text-align: right;
    }
  }
}
</style>
