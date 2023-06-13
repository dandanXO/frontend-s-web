<template>
  <q-page>
    <div class="profile">
      <div class="avatar">
        <img src="../assets/images/account/profile-img.png" />
      </div>
      <div class="pro-details">
        {{ store.nickName }} VIP{{ store.vip }}<br />
        专属网址: {{ store.evip }}
      </div>
    </div>
    <div class="vipcard">
      <q-card-section class="top-section">
        <!-- <div class="vip-badge">
        <img
          v-if="vip === 'VIP0'"
          src="../assets/vip/badge/badge-0.png"
        />
        <img
          v-if="vip === 'VIP1'"
          src="../assets/vip/badge/badge-1.png"
        />
        <img
          v-if="vip === 'VIP2'"
          src="../assets/vip/badge/badge-2.png"
        />
        <img
          v-if="vip === 'VIP3'"
          src="../assets/vip/badge/badge-3.png"
        />
        <img
          v-if="vip === 'VIP4'"
          src="../assets/vip/badge/badge-4.png"
        />
        <img
          v-if="vip === 'VIP5'"
          src="../assets/vip/badge/badge-5.png"
        />
        <img
          v-if="vip === 'VIP6'"
          src="../assets/vip/badge/badge-6.png"
        />
        <img
          v-if="vip === 'VIP7'"
          src="../assets/vip/badge/badge-7.png"
        />
      </div> -->
        <!-- <div class="name">{{ header }}</div> -->
        <q-card-section class="acct-section">
          <div class="label">中心钱包:</div>
          <div class="amt">{{ mainWallet }}</div>
        </q-card-section>
        <!-- <q-separator /> -->
        <q-card-section class="bot-section">
          <router-link to="/" @click="openDeposit" class="button"
            ><img
              src="../assets/images/index/deposit_icon.png"
            />存款</router-link
          >
          <router-link to="finance/withdraw" class="button"
            ><img
              src="../assets/images/index/withdrawal_icon.png"
            />提款</router-link
          >
          <router-link to="account/transfer" class="button"
            ><img
              src="../assets/images/index/transfer_icon.png"
            />转账</router-link
          >
          <router-link to="vip" class="button"
            ><img
              src="../assets/images/account/vip_icon.png"
            />VIP详情</router-link
          >
        </q-card-section>
      </q-card-section>
    </div>
    <q-item-section class="acct-nav">
      <!-- <div class="acct-header-icon">
        <img
          src="../assets/images/account/personal_menu_title_icon.png"
          width="10"
        />
      </div> -->
      <div class="acct-title">我的功能</div>
      <div class="acct-menu">
        <router-link to="/account/records">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_record.png" />
            <div class="acct-nav-label">交易记录</div>
          </div>
        </router-link>
        <router-link to="/account/records">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_share.png" />
            <div class="acct-nav-label">呼朋唤友</div>
          </div>
        </router-link>
        <router-link to="/account/promotion">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_promo.png" />
            <div class="acct-nav-label">优惠领取</div>
          </div>
        </router-link>
        <router-link to="/account/personal">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_personal.png" />
            <div class="acct-nav-label">个人信息</div>
          </div>
        </router-link>
        <router-link to="/account/changePwd">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_changePwd.png" />
            <div class="acct-nav-label">密码</div>
          </div>
        </router-link>
        <router-link to="/account/withdraw">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_bank.png" />
            <div class="acct-nav-label">银行信息</div>
          </div>
        </router-link>
        <router-link to="/account/download">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_download.png" />
            <div class="acct-nav-label">下载中心</div>
          </div>
        </router-link>
        <router-link to="/account/announcement">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_announcement.png" />
            <div class="acct-nav-label">系统公告</div>
          </div>
        </router-link>
        <router-link to="/account/mail">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_mailbox.png" />
            <div class="acct-nav-label">
              站内信({{ store.unreadInboxMail }})
            </div>
          </div>
        </router-link>
        <a href="https://partner.dyvip90.com" target="_blank">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_agent.png" />
            <div class="acct-nav-label">加盟</div>
          </div>
        </a>
      </div>
    </q-item-section>
    <a @click="logout">
      <div class="acct-logout">
        <div class="acct-nav-label">退出登录</div>
      </div>
    </a>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AccountPage",
  setup() {
    const router = useRouter();
    const store = userStore();
    const logout = () => {
      store.memberLogout().then(() => {
        router.push("/");
      });
    };

    const vip = computed(() => {
      return store.vip;
    });

    const mainWallet = computed(() => {
      return store.balance.toFixed(2);
    });
    onMounted(() => {
      getBalance();
      store.getBalance();
    });

    const openDeposit = () => {
      // to="finance/deposit"
      localStorage.setItem("isOpenFromAccount", JSON.stringify(true));
      router.push("finance/deposit");
    };

    const getBalance = () => {
      setInterval(function () {
        if (store.hasToken()) {
          store.getBalance();
        }
      }, 20000);
    };
    return {
      header: "Account",
      logout,
      mainWallet,
      getBalance,
      vip,
      store,
      openDeposit,
    };
  },
});
</script>
<style scoped lang="scss">
.profile {
  background: url(../assets/images/account/personal_bg.png) no-repeat center
    center;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 30px 10px;
  gap: 10px;
  .avatar {
    width: 60px;
    img {
      width: 100%;
    }
  }
  .pro-details {
    font-size: 12px;
    line-height: 15px;
    margin-top: 5px;
  }
}
.vipcard {
  margin: -20px auto 0;
  border-radius: 15px;
  width: 95%;
  background: url(../assets/images/account/personal_details_bg.png) no-repeat
    center center;
  background-size: cover;
  .q-card__section--vert {
    padding: 0;
    > div {
      flex: 1;
    }
  }
  .q-card__actions .q-btn {
    min-width: 60px;
  }

  .top-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }

  .acct-section {
    display: flex;
    flex-direction: column;
    text-align: left;
    justify-content: space-evenly;
    padding: 10px 20px;
    // border-bottom: 1px solid #2e3445;
    width: 100%;
    color: #000000;
    .label {
      font-size: 11px;
      line-height: 12px;
    }
    .amt {
      font-size: 26px;
    }
  }
  .bot-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0px 20px 10px;
    .button {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 5px;
      font-size: 11px;
      line-height: 25px;
      text-decoration: none;
      color: #000;
      img {
        height: 30px;
      }
    }
    .q-btn__content {
      font-size: 12px;
      color: #000;
      display: flex;
      flex-direction: column;
      svg {
        fill: #ffffff;
        width: 25px;
        display: block;
        padding: 0;
      }
    }
  }
}
.acct-nav {
  background: #f2f5f6;
  width: 95%;
  margin: 10px auto;
  padding: 5px;
  gap: 10px;
  .acct-title {
    display: flex;
    margin-top: 4px;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    color: #000;
    // .acct-header-icon
    &:before {
      content: "";
      // background: #33bcd4;
      height: 19px;
      width: 10px;
      background: url(../assets/images/account/personal_menu_title_icon.png)
        no-repeat center;
      background-size: 100%;
      display: inline-block;
      margin-left: -5px;
    }
  }
  .acct-menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content: stretch;
    a {
      text-decoration: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;

      .acct-nav-item {
        gap: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #000;
        text-decoration: none;
        padding: 10px;
        img {
          height: 40px;
          fill: white;
          padding: 0;
        }
      }
    }
  }
}
.acct-logout {
  padding: 10px;
  margin: 5px 10px;
  background-color: #5b80e7;
  text-align: center;
  color: #ffffff;
}
.vip-badge {
  position: absolute;
  left: 10px;
  top: -40px;
}
</style>
