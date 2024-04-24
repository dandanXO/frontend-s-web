<template>
  <div class="container">
    <div class="content">
      <div class="left-content">
        <div v-for="(item, index) in iconInfo" :key="index" class="credit-info">
          <img :src="item.iconUrl" alt="" />
          <div class="info-text">{{ item.info }}</div>
        </div>
      </div>
      <div class="right-content">
        <div v-if="true" class="login-box"><LoggedIn /></div>
        <div v-if="false" class="login-box"><NotLoggedIn /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoggedIn from "./LoggedIn.vue";
import NotLoggedIn from "./NotLoggedIn.vue";
import { reactive, ref } from "vue";

const iconInfo = reactive([
  { info: "송금신청", iconUrl: require("../../assets/icon/deposit.svg") },
  {
    info: "출금신청",
    iconUrl: require("../../assets/icon/withdrawMoney.svg")
  },
  {
    info: "공지사항",
    iconUrl: require("../../assets/icon/notify.svg")
  },
  {
    info: "고객센터",
    iconUrl: require("../../assets/icon/customerService.svg")
  }
]);
</script>

<style scoped lang="scss">
.container {
  background: linear-gradient(#292b31, #191b1e);
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 1200px;
  display: flex;
}

.left-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 40%;
}

.right-content {
  width: 60%;
}

.info-text {
  font-size: 20px;
  font-weight: 500;
  color: #a5a6a7;
  line-height: 28px;
  margin-left: 5px;
}

.credit-info {
  display: flex;
  align-items: center;
}

.login-box{
  display: flex;
  justify-content: flex-end;
}
</style>
