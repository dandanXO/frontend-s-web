<template>
  <div class="profile-wrapper">
    <linkable-button :to="isLogin ? '/account' : '/login'" class="profile-link-button">
      <div class="profile-info">
        <div class="avatar">
          <img v-if="!store.token" :src="DefaultAvatarImg" />
          <img v-if="isLogin && profilePhoto && profilePhoto.includes('default')" :src="require(`../../../assets/images/profile/${store.profilePhoto}.png`)" />
          <img v-if="isLogin && profilePhoto && !profilePhoto.includes('default')" :src="imageDir + store.profilePhoto + '?v=' + timestamp" />

        </div>
        <span>{{ isLogin ? nickName : "未登录" }}</span>
      </div>
      <span class="color-font-1" v-if="!isLogin">登录/注册后查看</span>
    </linkable-button>
    <div class="finance-wrapper">
      <router-link to="finance/deposit">
        <finance-button class="finance-button">
          <img :src="DrawerDeposit" />
          <span>存款</span>
        </finance-button>
      </router-link>
      <router-link to="finance/withdraw">
        <finance-button class="finance-button">
          <img :src="DrawerWithdraw" />
          <span>提款</span>
        </finance-button>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { userStore } from "stores/index";
import {useLocalStorage} from "@vueuse/core"
import moment from "moment"

import LinkableButton from "components/home/drawer/LinkableButton.vue";
import FinanceButton from "components/home/drawer/FinanceButton.vue";
import DefaultAvatarImg from "assets/images/home/default-avatar.png";
import DrawerDeposit from "assets/images/home/drawer-deposit.svg";
import DrawerWithdraw from "assets/images/home/drawer-withdraw.svg";

const isLogin = ref(false);

const imageDir = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/profile/";
const timestamp= moment().unix();

var qs = require('qs')
const store = userStore();
const { profilePhoto, nickName } = storeToRefs(store);
const { hasToken } = store;

console.log(profilePhoto);

onMounted(() => {
  isLogin.value = hasToken();
});
</script>
<style scoped lang="scss">
.profile-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 18px;
  width: 100%;

  .profile-link-button {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }

  .profile-info {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 8px;

    .avatar {
      width: 50px;
      height: 50px;
      max-width: 60px;
      min-width: 60px;
      img {
        aspect-ratio: 1/1;
        width:50px;
        height: 50px;
        border-radius:50%;
      }
    }
  }

  .finance-wrapper {
    display: flex;
    gap: 14px;
    padding: 0 20px;
    a {
      flex: 1;
      .finance-button {
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;
        img {
          max-width: 18px;
        }
      }
    }
  }
}
</style>
