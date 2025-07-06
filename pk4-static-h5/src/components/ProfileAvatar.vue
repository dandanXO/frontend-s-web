<template>
  <div class="left-container" :class="`vipitem${store.vip.replace('VIP', '')}`">
      <div class="profile-pic">
        <q-avatar :size="isHeader ? '40px' : '50px'">
          <img :src="profileImagePath" />
        </q-avatar>

        <div class="vip-details" :class="{ isHeader: props.isHeader }" @click="onVipClick">
          <img
            class="bg"
            :src="require(`../assets/images/index/vip-badge/vip-${store.vip.replace('VIP', '')}.png`)"
            alt=""
          />
        </div>
      </div>

      <div class="nickname" v-if="!props.isHeader">{{ store.realName ? store.realName : store.nickName }}</div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { userStore } from "stores/index";

const props = defineProps(['isHeader']);

const store = userStore();

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
  #072569,
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
  linear-gradient(90deg, #002560 0%, #002262 100%),
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

        &.isHeader {
            img {
                width: 45px;
            }
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
</style>
