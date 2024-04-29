<template>
  <div class="container">
    <div class="content">
      <div class="left-content">
        <div v-for="(item, index) in iconInfo" :key="index" @click="item.goPage()" class="credit-info cursor-pointer">
          <img :src="item.iconUrl" alt="" />
          <div class="info-text">{{ item.info }}</div>
        </div>
      </div>
      <div class="right-content">
        <div v-if="store.hasToken()" class="login-box"><LoggedIn /></div>
        <div v-if="!store.hasToken()" class="login-box"><NotLoggedIn /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoggedIn from "./LoggedIn.vue";
import NotLoggedIn from "./NotLoggedIn.vue";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
const store = userStore();

const router = useRouter();
const iconInfo = reactive([
  { info: "송금신청",
    iconUrl: require("../../assets/icon/deposit.svg"),
    goPage: () => {
      router.push(`/?page=finance/deposit`);
    }
  },
  {
    info: "출금신청",
    iconUrl: require("../../assets/icon/withdrawMoney.svg"),
    goPage: () => {
      router.push(`/?page=finance/withdraw`);
    }
  },
  {
    info: "공지사항",
    iconUrl: require("../../assets/icon/notify.svg"),
    goPage: () => {
      router.push(`/?page=notify`);
    }
  },
  {
    info: "고객센터",
    iconUrl: require("../../assets/icon/customerService.svg"),
    goPage: () => {
      router.push(`/?page=customer/service`);
    }
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
  flex-wrap: wrap;
}

.left-content {
  display: flex;
  flex-wrap: wrap;
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
  cursor: pointer;
  display: flex;
  align-items: center;
}

.login-box{
  display: flex;
  justify-content: flex-end;
}
</style>
