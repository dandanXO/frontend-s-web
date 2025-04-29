<template>
  <div class="progress-container">
    <div class="left-container" :class="`vipitem${store.vip.replace('VIP', '')}`">
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

    <div class="right-container" :class="`vipitem${store.vip.replace('VIP', '')}`">
      <div class="amount-progress-container">
        <div class="vip-text">{{ store.vip }}</div>
        <div v-if="store.vip.replace('VIP', '') !== '12'" class="progress-num">{{ `${progressRef} / ${maxProgress}` }}</div>
      </div>
      <div class="progress-bar-outer">
        <q-linear-progress
          reverse
          rounded
          size="8px"
          :value="progressBarRef"
          class="custom-progress-bar"
          color="grey-5"
        />
        <div
          class="progress-circle"
          :style="{ right: `calc(${progressBarRef * 100}% - 12px)` }"
        ></div>
      </div>
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


$textcolors: (
  #4a75d9,
  #523014,
  #780f70,
  #be2526,
  #076b0a,
  #172266,
  #5a0c3a,
  #4b6b7a,
  #230e6b,
  #6e191a,
  #0a1d5c,
  #2a161b,
  #523014
);

@for $i from 1 through length($textcolors) {
  $color: nth($textcolors, $i);
  .vipitem#{$i - 1} .win-gift-text, .vipitem#{$i - 1} .amount-progress-container {
    color: $color;
  }
}
$colors: (
  #6D98FC,
  #CD9321,
  #D46ECC,
  #F43F40,
  #4CB759,
  #6487EC,
  #F130A1,
  #728BAD,
  #A43FFF,
  #9769EA,
  #5370E0,
  #806888,
  #1090ED
);

@for $i from 1 through length($colors) {
  $color: nth($colors, $i);
  .vipitem#{$i - 1} .q-avatar {
    border: 2px solid $color;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
}
@for $i from 0 through length($colors) - 1 {
  .vipitem#{$i} {
    &.right-container {
      background: nth($colors, $i + 1);
    }
  }
}
$gradients: (
  linear-gradient(90deg, #9ec2fa 0%, #4077de 100%),
  linear-gradient(90deg, #e5b888 0%, #b08240 100%),
  linear-gradient(90deg, #e268d9 0%, #780f70 100%),
  linear-gradient(90deg, #ff5f60 0%, #ae0536 100%),
  linear-gradient(90deg, #35a042 0%, #7ee98b 100%),
  linear-gradient(90deg, #121f55 0%, #6e91f6 100%),
  linear-gradient(90deg, #f534a5 0%, #ffa2d9 100%),
  linear-gradient(90deg, #4b6b7a 0%, #c5ddff 100%),
  linear-gradient(90deg, #f330d7 0%, #8448ff 100%),
  linear-gradient(90deg, #fa5540 0%, #ffa397 100%),
  linear-gradient(90deg, #0a1d5c 0%, #8c52d5 100%),
  linear-gradient(90deg, #ad95b5 0%, #2a161b 100%),
  linear-gradient(90deg, #0e9bef 0%, #977fb2 100%)
);

@for $i from 0 through length($gradients) - 1 {
  .vipitem#{$i} {
    .custom-progress-bar {
      background: nth($gradients, $i + 1);
    }
  }
}
.progress-bar-outer {
  position: relative;
  height: 16px;
  width: 100%;
}

.custom-progress-bar {
  position: relative;
  z-index: 1;
}

.progress-circle {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background-color: #21EF89;
  display: none;
  border: 4px solid rgb(59 143 102);
  border-radius: 50%;
  z-index: 2;
  transition: left 0.3s ease;
}
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
    // gap: 8px;
    font-size: 12px;
    font-weight: bold;

    width: 100%;
    // background: linear-gradient(90deg, #323738 0%, #404F4E 100%);
    // padding: 15px;
    padding: 5px 15px;
    border-radius: 10px;
    
    :not(:last-child) {
      margin-bottom: 8px;
    }
    .amount-progress-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

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
      // margin-top: 5px;
      text-align: right;
      // color: #B2BDBF;
      font-weight: 400;
    }
  }
}
</style>
