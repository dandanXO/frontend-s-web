<template>
  <div class="logginedin-container">
    <div class="information">
      <div class="member">
        <img src="../../assets/images/login/member.svg" alt="" />
        <div>{{ store.nickName }}</div>
      </div>
      <div class="money">
        <img src="../../assets/images/login/money.svg" alt="" />
        <div>
          {{ store.balance }}
          <span>원</span>
        </div>
      </div>
    </div>

    <div class="btn-group">
      <div class="left-group">
        <q-btn class="primary-button blue" rounded flat style="width:100px;height:30px;font-size:14px;" @click="goToPersonalInfo" :label="'마이페이지'" />
      </div>
      <div class="right-group">
        <q-btn class="primary-button yellow" rounded flat style="width:100px;height:30px;font-size:14px;" @click="onLogoutSubmit" :label="'로그 아웃'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();

const goToPersonalInfo = () => {
  router.push("/?page=personal/info");
};

const goToTransactions = () => {
  router.push("/?page=transaction/records");
};

const onLogoutSubmit = () => {
  store.memberLogout();
};
</script>

<style scoped lang="scss">
.logginedin-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.information {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 24px;
  width: 60%;
  font-size: 16px;
  justify-content: center;
  align-items: center;
  @media (min-width: 1200px) {
  }
}
.member,
.letter,
.money,
.item {
  width: 125px;
  display: flex;
  align-items: center;
  img {
    padding-right: 12px;
  }
  span {
    color: #03b3ff;
  }
}

.btn-group {
  display: flex;
  align-items: flex-start;
}

.points-conversion,
.my-page {
  width: 80px;
  height: 36px;
  background-image: url("../../assets/home/btn-blue.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(2px);
  }

  @media (min-width: 1200px) {
    width: 100px;
  }
  .register-text {
    font-size: 12px;
    line-height: 16.8px;
    color: #fff;
    @media (min-width: 1200px) {
      font-size: 14px;
      line-height: 1;
    }
  }
}

.other-points-conversion {
  width: 80px;
  height: 36px;
  background-image: url("../../assets/home/btn-orange.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(2px);
  }

  @media (min-width: 1200px) {
    width: 100px;
  }
  .register-text {
    font-size: 12px;
    line-height: 16.8px;
    color: #fff;
    @media (min-width: 1200px) {
      font-size: 14px;
      line-height: 1;
    }
  }
}
</style>
