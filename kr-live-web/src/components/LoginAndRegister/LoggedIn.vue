<template>
  <div class="logginedin-container">
    <div class="information">
      <div class="member">
        <img src="../../assets/images/login/member.svg" alt="" />
        <div>ID 1587655</div>
      </div>
      <div class="letter">
        <img src="../../assets/images/login/letter.svg" alt="" />
        <div>
          쪽지
          <span>（0）</span>
        </div>
      </div>
      <div class="money">
        <img src="../../assets/images/login/money.svg" alt="" />
        <div>
          0
          <span>원</span>
        </div>
      </div>
      <div class="item">
        <img src="../../assets/images/login/item.svg" alt="" />
        <div>
          0
          <span>P</span>
        </div>
      </div>
    </div>

    <div class="btn-group">
      <div class="left-group">
        <div class="points-conversion">
          <div class="register-text" @click="goToTransfer">포인트전환</div>
        </div>
        <div class="my-page">
          <div class="register-text" @click="goToPersonalInfo">마이페이지</div>
        </div>
      </div>
      <div class="right-group">
        <div class="other-points-conversion" @click.prevent="onLogoutSubmit">
          <div class="register-text">Logout</div>
        </div>
        <div class="other-points-conversion">
          <div class="register-text" @click="goToTransfer">포인트전환</div>
        </div>
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
  router.push('/?page=personal/info');
}

const goToTransfer = () => {
  router.push('/?page=transaction/transfer');
}

const onLogoutSubmit = () => {
  store.memberLogout();
};
</script>

<style scoped lang="scss">
.logginedin-container {
  width: 528px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (min-width: 760px) {
    flex-direction: row;
    justify-content: space-between;
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
  width: 40%;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  @media (min-width: 1200px) {
    margin-top: 0px;
  }
}

.left-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 16px;
}
.right-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 12px;
  row-gap: 16px;
}

.points-conversion,
.my-page {
  width: 80px;
  height: 28px;
  background-image: url("../../assets/images/login/loggin-after-btn-1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (min-width: 1200px) {
    width: 100px;
  }
  .register-text {
    font-size: 12px;
    line-height: 16.8px;
    color: #fff;
    @media (min-width: 1200px) {
      font-size: 16px;
      line-height: 22.4px;
    }
  }
}

.other-points-conversion {
  width: 80px;
  height: 28px;
  background-image: url("../../assets/images/login/loggin-after-btn-2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (min-width: 1200px) {
    width: 100px;
  }
  .register-text {
    font-size: 12px;
    line-height: 16.8px;
    color: #fff;
    @media (min-width: 1200px) {
      font-size: 16px;
      line-height: 22.4px;
    }
  }
}
</style>
