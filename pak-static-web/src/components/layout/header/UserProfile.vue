<template>
  <div class="user-profile-wrapper">
    <div class="user-profile-info-wrapper">
      <span class="user-profile-info__name">{{ nickName }}</span>
      <span class="user-profile-info__balance">₨: {{ balance.toFixed(2) }}</span>
    </div>
    <router-link class="user-profile-photo" to="/center/personal">
      <img v-if="profilePhoto" :src="profilePhoto" />
      <img v-else src="@/assets/images/account/default-profile.png" />
    </router-link>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { userStore } from "@/store";

const store = userStore();
const { profilePhoto, nickName, balance } = storeToRefs(store);
</script>
<style scoped lang="scss">
.user-profile-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;

  .user-profile-info-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .user-profile-info__name {
      font-size: 20px;
      font-weight: 500;
      line-height: 20px;
      text-align: right;
      color: #ffffff;
    }

    .user-profile-info__balance {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: right;
      color: #57585c;
    }
  }

  .user-profile-photo {
    border-radius: 50%;
    border: 2px solid #13e25c;
    width: 60px;
    height: 60px;
    background-color: #ffffff0d;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
