<template>
  <div class="container">
    <div class="top-header">
      <div @click="toggleNav()"><img src="../../assets/home/menu-icon.png" /></div>
    </div>

    <div class="content">
      <div class="left-content" :class="navActive && 'active'" @click="navActive = false">
        <div
          v-for="(item, index) in iconInfo"
          :key="index"
          @click="store.token || item?.requireLogin === false ? item.goPage() : showNotify()"
          class="credit-info cursor-pointer"
        >
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
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
const store = userStore();
const $q = useQuasar();

const router = useRouter();

const navActive = ref(false);
const toggleNav = () => {
  navActive.value = !navActive.value;
};

const showNotify = () => {
  $q.notify({
    color: "negative",
    position: "top",
    message: "로그인 해주세요",
    icon: "report_problem"
  });
};

const iconInfo = reactive([
  // {
  //   info: "송금신청",
  //   iconUrl: require("../../assets/icon/deposit.svg"),
  //   goPage: () => {
  //     router.push(`/?page=finance/deposit`);
  //   }
  // },
  {
    info: "공지사항",
    iconUrl: require("../../assets/icon/icon-notify.svg"),
    goPage: () => {
      router.push(`/?page=notify`);
    }
  },
  // {
  //   info: "이벤트",
  //   iconUrl: require("../../assets/icon/icon-promo.svg"),
  //   goPage: () => {
  //     router.push(`/?page=promo/all`);
  //   }
  // },
  {
    info: "충전",
    iconUrl: require("../../assets/icon/icon-deposit.svg"),
    goPage: () => {
      router.push(`/?page=finance/deposit`);
    }
  },
  {
    info: "환전",
    iconUrl: require("../../assets/icon/icon-withdrawal.svg"),
    goPage: () => {
      router.push(`/?page=finance/withdraw`);
    }
  },
  // {
  //   info: "배팅내역",
  //   iconUrl: require("../../assets/icon/icon-betting.svg"),
  //   goPage: () => {
  //     router.push(`/?page=transaction/records`);
  //   }
  // },
  {
    info: "쪽지함",
    iconUrl: require("../../assets/icon/icon-message.svg"),
    goPage: () => {
      router.push(`/?page=personal/messages`);
    }
  },
  {
    info: "고객센터",
    iconUrl: require("../../assets/icon/icon-service.svg"),
    goPage: () => {
      window.open(`https://csweb01.amv4xjcbd.com/?partnerId=12&lang=kr`);
    },
    requireLogin: false
  },
]);
</script>

<style scoped lang="scss">
.top-header {
  display: flex;
  justify-content: space-between;
  background: salmon;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 12px;
  background: rgba(18, 17, 33, 0.6);

  img{
    width: 40px;
    height: 40px;
  }

  @media (min-width: 769px) {
    display: none;
  }
}
.container {
  // background: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: rgba(18, 17, 33, 1);

  @media (min-width: 769px) {
    // background: linear-gradient(#292b31, #191b1e);
    background: rgba(18, 17, 33, 0.6);
    border-width: 2px 0px 2px 0px;
    border-style: solid;
    border-color: #2a306c;
    backdrop-filter: blur(6px);
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: 769px) {
    width: 1280px;
    flex-direction: row;
    height: 80px;

    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.left-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 68px;
  // background: linear-gradient(#292b31, #191b1e);
  border-width: 1px 0px 1px 0px;
  border-style: solid;
  border-color: #333333;
  padding-left: 8px;
  display: none;

  &.active {
    display: flex;
    position: absolute;
    top: 54px;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(18, 17, 33, 0.9);
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 12px;
    gap: 16px;
    z-index: 9;

    .credit-info {
      flex-direction: row;

      .info-text {
        font-size: 16px;
      }
    }
  }

  // display: none;
  @media (min-width: 769px) {
    display: flex;
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
    // background: linear-gradient(#292b31, #191b1e);
    justify-content: flex-end;
    margin-top: 0px;
  }
}

.info-text {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  line-height: 28px;
  margin-left: 5px;

  @media (min-width: 769px) {
    font-size: 16px;
    line-height: 1;
  }
}

.credit-info {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover .info-text {
    color: #01d9ab;
  }

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
