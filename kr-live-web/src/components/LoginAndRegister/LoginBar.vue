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
  {
    info: "송금신청",
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
  background: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;

  @media (min-width: 769px) {
    background: linear-gradient(#292b31, #191b1e);
    border-width: 1px 0px 1px 0px;
    border-style: solid;
    border-color: #333333;
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: 769px) {
    width: 1200px;
    flex-direction: row;
    height: 80px;
  }
}

.left-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 68px;
  background: linear-gradient(#292b31, #191b1e);
  border-width: 1px 0px 1px 0px;
  border-style: solid;
  border-color: #333333;
  padding-left: 8px;
  @media (min-width: 769px) {
    width: 40%;
    height: 100%;
    border: none;
  }
}

.right-content {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: transparent;
  margin-top: 16px;
  padding-right: 8px;
  @media (min-width: 769px) {
    background: linear-gradient(#292b31, #191b1e);
    width: 60%;
    justify-content: flex-end;
    margin-top: 0px;
  }
}

.info-text {
  font-size: 14px;
  font-weight: 500;
  color: #a5a6a7;
  line-height: 28px;
  margin-left: 5px;

  @media (min-width: 769px) {
    font-size: 20px;
    line-height: 19.6px;
  }
}

.credit-info {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 20px;
  }
  @media (min-width: 769px) {
    flex-direction: row;
    align-items: center;
    img {
      width: 24px;
    }
  }
}

.login-box {
  display: flex;
  justify-content: center;
  @media (min-width: 769px) {
    justify-content: flex-end;
  }
}
</style>
