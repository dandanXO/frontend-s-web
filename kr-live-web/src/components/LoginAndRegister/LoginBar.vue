<template>
  <div class="container">
    <div class="content">
      <div class="left-content">
        <div
          v-for="(item, index) in iconInfo"
          :key="index"
          @click="store.token ? item.goPage() : showNotify()"
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
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
const store = userStore();
const $q = useQuasar();

const router = useRouter();

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
  {
    info: "이벤트",
    iconUrl: require("../../assets/icon/icon-promo.svg"),
    goPage: () => {
      router.push(`/`);
    }
  },
  {
    info: "문의함",
    iconUrl: require("../../assets/icon/icon-service.svg"),
    goPage: () => {
      router.push(`/`);
    }
  },
  {
    info: "입금신청",
    iconUrl: require("../../assets/icon/icon-deposit.svg"),
    goPage: () => {
      router.push(`/`);
    }
  },
  {
    info: "출금신청",
    iconUrl: require("../../assets/icon/icon-withdrawal.svg"),
    goPage: () => {
      router.push(`/?page=finance/withdraw`);
    }
  },
  {
    info: "배팅내역",
    iconUrl: require("../../assets/icon/icon-betting.svg"),
    goPage: () => {
      router.push(`/`);
    }
  },
  {
    info: "쪽지함",
    iconUrl: require("../../assets/icon/icon-message.svg"),
    goPage: () => {
      router.push(`/`);
    }
  }
  // {
  //   info: "고객센터",
  //   iconUrl: require("../../assets/icon/icon-service.svg"),
  //   goPage: () => {
  //     router.push(`/?page=customer/service`);
  //   }
  // }
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
  @media (min-width: 769px) {
    width: 70%;
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
    width: 30%;
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
    font-size: 20px;
    line-height: 19.6px;
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
