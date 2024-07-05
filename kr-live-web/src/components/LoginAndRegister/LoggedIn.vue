<template>
  <div class="logginedin-container">
    <div class="information">
      <div class="member">
        <img src="../../assets/images/login/member.svg" alt="" />
        <div>{{ store.name2 || store.realName || store.nickName }}</div>
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
        <div class="primary-button blue" style="width:100px;height:30px;font-size:14px;" @click="goToPersonalInfo">
          마이페이지
        </div>
      </div>
      <div class="right-group">
        <div class="primary-button yellow" style="width:100px;height:30px;font-size:14px;" @click="onLogoutSubmit">
          로그 아웃
        </div>
      </div>
    </div>
    <div class="actions-topbar">
      <div class="name-balance-info" v-if="props.isH5TopBar">
        <div>{{ store.nickName }}</div>
        <div class="money-topbar">
          <span>₩</span>
          <span class="balance">{{ store.balance }}</span>
          <span>원</span>
        </div>
      </div>
      <div class="actions-topbar-controls">
        <div class="primary-button blue-square" style="width:100px;height:30px;font-size:14px;"
          @click="goToPersonalInfo">
          마이페이지
        </div>
        <div class="primary-button yellow-square" style="width:100px;height:30px;font-size:14px;"
          @click="onLogoutSubmit">
          로그 아웃
        </div>
      </div>
      <div class="actions-bottombar-controls" v-if="!props.isH5TopBar">
        <router-link class="primary-button blue-square" style="width:100px;height:30px;font-size:14px;"
          to="/?page=finance/deposit">
          송금신청
        </router-link>
        <router-link class="primary-button yellow-square" style="width:100px;height:30px;font-size:14px;"
          to="/?page=finance/withdraw">
          출금신청
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

const props = defineProps(['isH5TopBar']);
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
  white-space: nowrap;
  row-gap: 8px;
  column-gap: 24px;
  width: 60%;
  font-size: 16px;
  justify-content: center;
  align-items: center;
  padding: 0px 10px;

  @media (max-width: 768px) {
    display: none;
  }
}

.member,
.letter,
.money,
.item {
  display: flex;
  align-items: center;
  gap: 5px;

  span {
    color: #03fff2;
  }
}

.btn-group {
  display: flex;
  align-items: flex-start;

  @media (max-width: 768px) {
    display: none;
  }
}

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

.actions-topbar {
  display: none;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;

  .name-balance-info {
    display: flex;
    align-items: center;
  }

  .actions-topbar-controls,
  .actions-bottombar-controls {
    display: none;
  }

  @media (max-width: 768px) {
    display: flex;

    .actions-bottombar-controls {
      display: flex;
      padding: 10px 0;
    }
  }

  .money-topbar {
    display: flex;
    gap: 5px;
    background-color: #2E324B;
    border-radius: 4px;
    padding: 5px 10px;
    min-width: 100px;
    min-height: 30px;
    font-size: 14px;
    margin: auto 10px;

    .balance {
      color: #00FFFF;
    }
  }
}
</style>
