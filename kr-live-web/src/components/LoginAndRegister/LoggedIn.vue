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
          {{ $t('lang.menu_my_page') }}
        </div>
      </div>
      <div class="right-group">
        <div class="primary-button yellow" style="width:100px;height:30px;font-size:14px;" @click="onLogoutSubmit">
          {{ $t('lang.logout') }}
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
          {{ $t('lang.menu_my_page') }}
        </div>
        <div class="primary-button yellow-square" style="width:100px;height:30px;font-size:14px;"
          @click="onLogoutSubmit">
          {{ $t('lang.logout') }}
        </div>
      </div>
      <div class="actions-bottombar-controls" v-if="!props.isH5TopBar">
        <router-link class="primary-button blue-square" style="width:100px;height:30px;font-size:14px;"
          to="/?page=finance/deposit">
          {{ $t('lang.menu_deposit') }}
        </router-link>
        <router-link class="primary-button yellow-square" style="width:100px;height:30px;font-size:14px;"
          to="/?page=finance/withdraw">
          {{ $t('lang.menu_withdraw') }}
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
