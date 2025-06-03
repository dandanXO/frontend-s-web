<template>
  <q-page>
    <div class="profile q-pa-md">
      <div class="avatar">
        <img src="../assets/images/account/profile-img.png" />
      </div>
      <div class="pro-details">
        <div class="nickname-span">{{ store.nickName }}</div>

        <div class="details-span">
          专属网址:
          <a style="text-decoration: none" :href="selfTgurl" target="_blank">
            {{ store.evip }}
          </a>
        </div>

        <div class="details-span" v-if="appVersionNo">版本：{{ appVersionNo }}</div>
      </div>

      <router-link v-if="!store.isApp() && isH5" to="/account/download" class="q-ml-auto q-mt-auto">
        <div class="acct-top-menu">
          <img src="../assets/images/account/menu_download.png" />
        </div>
      </router-link>
    </div>

    <div class="q-px-md">
      <div class="vipcard">
        <div class="row items-center">
          <div class="label">中心钱包:</div>
          <q-btn unelevated :disable="isRefreshingMainWallet" @click="refreshMainWallet()" dense rounded>
            <q-icon name="autorenew" size="24px" :class="{ rotating: isRefreshingMainWallet }" />
          </q-btn>

          <div class="acc-btns-container row q-gutter-x-sm q-ml-auto">
            <q-btn color="brightbtn" @click="openDeposit" rounded>存款</q-btn>
            <q-btn color="brightbtn" to="finance/withdraw" rounded>提款</q-btn>
            <q-btn color="brightbtn" to="account/transfer" rounded>转账</q-btn>
          </div>
        </div>

        <div class="amt q-mb-sm">{{ isRefreshingMainWallet ? "刷新中..." : store.currency.value + mainWallet }}</div>

        <q-separator />

        <div class="card_btm">
          <div class="progress-container">
            <div class="progress-vip-stat">
              <img :src="getVipImage(vipLevel)" />
              VIP {{ vipLevel }}
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: vipLevel < 10 && vipItems[vipLevel] ? progessPercentage(vipItems[vipLevel].upgrade) + '%' : '100%' }"></div>
            </div>
            <template v-if="vipLevel < 10">
              <div class="progress-vip-stat">
                VIP {{ vipLevel + 1 }}
                <img :src="getVipImage(vipLevel + 1)" />
              </div>
            </template>
          </div>

          <div class="amt-info">
            <span v-if="vipLevel < 10 && vipItems[vipLevel]">
              晋级存款（元）{{ convertToCommaAmount(currentDepositAmount) }} /
              {{ convertToCommaAmount(vipItems[vipLevel].upgrade) }}
            </span>
            <span v-else>
              您已达到最高晋级存款
            </span>
          </div>
        </div>

        <router-link to="account/vip" class="vip-ribbon-btn">
          <img src="../assets/images/account/vip-ribbon.png" />
        </router-link>
      </div>
    </div>

    <div class="q-pa-md">
      <q-item-section class="acct-nav">
        <div class="acct-title">
          <div class="acct-title-1">我的功能</div>
          <div id="vipDomain" class="vipurl">
            专属网址：
            <a :href="selfTgurl" target="_blank">
              {{ store.evip }}
            </a>
          </div>
        </div>
        <div class="acct-menu">
          <router-link to="/account/records">
            <div class="acct-nav-item">
              <img src="../assets/images/account/menu_record.png" />
              <div class="acct-nav-label">交易记录</div>
            </div>
          </router-link>
          <router-link to="/account/invite">
            <div class="acct-nav-item">
              <img src="../assets/images/account/menu_share.png" />
              <div class="acct-nav-label">推广赚钱</div>
            </div>
          </router-link>
          <!-- <router-link v-if="!store.isApp() && isH5" to="/account/download">
            <div class="acct-nav-item">
              <img src="../assets/images/account/menu_download.png" />
              <div class="acct-nav-label">下载中心</div>
            </div>
          </router-link> -->
          <router-link to="/promo">
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
          <router-link to="/account/announcement">
            <div class="acct-nav-item">
              <img src="../assets/images/account/menu_announcement.png" />
              <div class="acct-nav-label">系统公告</div>
            </div>
          </router-link>
          <router-link to="/account/mail">
            <div class="acct-nav-item">
              <img src="../assets/images/account/menu_mailbox.png" />
              <div class="acct-nav-label">反馈奖励</div>
              <!--          ({{ store.unreadInboxMail }})-->
            </div>
          </router-link>
          <router-link to="/account/message">
            <div class="acct-nav-item">
              <img src="../assets/images/account/menu_message.png" />
              <div class="acct-nav-label">消息中心</div>
              <div class="unread" v-if="store.unreadInboxMail > 0">
                {{ store.unreadInboxMail > 99 ? "99+" : store.unreadInboxMail.toString() }}
              </div>
              <!--          ({{ store.unreadInboxMail }})-->
            </div>
          </router-link>
        </div>
      </q-item-section>
    </div>

    <div>
      <div class="acct-logout q-mx-md" @click="isLogout = true">
        <div class="acct-nav-label">退出登录</div>
        <div class="acct-logout-img">
          <img src="../assets/images/account/menu_logout.png" />
        </div>
      </div>
    </div>
  </q-page>

  <q-dialog width="100%" v-model="isLogout" no-backdrop-dismiss no-esc-dismiss>
    <div class="dialog-card q-ma-md q-pa-md">
      <div class="dialog-title">温馨提示</div>
      <div class="dialog-desc">确认退出登录吗？</div>

      <div class="dialog-actions">
        <div class="action-btn">
          <q-btn @click="isLogout = false" color="blueborderbtn" label="取消" rounded size="md" style="width: 100%" />
        </div>
        <div class="action-btn">
          <q-btn @click="logout()" color="brightbtn" label="确定" rounded size="md" style="width: 100%" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { App } from "@capacitor/app";
import { eventapi } from "boot/axios";
import { Platform } from "quasar";
import { convertToCommaAmount } from "src/boot/utils.js";
import { userStore } from "stores/index";
import { computed, onActivated, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = userStore();

const isLogout = ref(false);
const logout = () => {
  store.memberLogout().then(() => {
    router.push("/");
  });
};

const appVersionNo = ref(null);

const vipLevel = computed(() => {
  const match = store.vip.match(/^VIP(\d+)$/);
  const level = match ? parseInt(match[1], 10) : null;
  return level !== null && level >= 0 ? level : 0;
});

const timerBalance = ref();

const getVipImage = (level) => {
  return require(`../assets/images/account/vip-level-${level}.png`);
};

const vip = computed(() => {
  return store.vip;
});
const selfTgurl = ref("https://" + store.evip);

const getVersionNo = async () => {
  if (store.getDeviceType() == "ANDROID") {
    const info = await App.getInfo();
    var current_version = info.version;
    appVersionNo.value = current_version;
  } else if (store.getDeviceType() == "IOS") {
    appVersionNo.value = "1.0.0`";
  } else {
  }
};

const mainWallet = computed(() => {
  return store.balance.toFixed(2);
});

const isRefreshingMainWallet = ref(false);

const refreshMainWallet = () => {
  store.getBalance();

  isRefreshingMainWallet.value = true;

  setTimeout(() => {
    isRefreshingMainWallet.value = false;
  }, 3000);
};

const openDeposit = () => {
  // to="finance/deposit"
  localStorage.setItem("isOpenFromAccount", JSON.stringify(true));
  router.push("finance/deposit");
};

const getBalance = () => {
  timerBalance.value = setInterval(function () {
    if (store.hasToken()) {
      store.getBalance();
    }
  }, 20000);
};

const isH5 = ref(false);
const checkPlatform = () => {
  //Is iOS Webclip App || Is Android Apk
  if (
    (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
    (Platform.is.android && Platform.is.capacitor)
  ) {
    isH5.value = false;
  } else {
    isH5.value = true;
  }
};

const currentBetAmount = ref(0);
const currentDepositAmount = ref(0);

const getVipDetails = () => {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  eventapi.get(`/vip-bonus/get-detail?v=${randNum}`).then((res) => {
    currentBetAmount.value = res.data.currentBetAmount;
    currentDepositAmount.value = res.data.currentDepositAmount;
  });
};

// const vipLevel = ref('');

const vipItems = [
  {
    vipLevel: "1",
    upgrade: 5000,
    monthly: "",
    birthday: "",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥500元, 返现15%, 最高188元"
  },
  {
    vipLevel: "2",
    upgrade: 20000,
    monthly: "188",
    birthday: "",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥500元, 返现15%, 最高258元"
  },
  {
    vipLevel: "3",
    upgrade: 200000,
    monthly: "688",
    birthday: "888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥500元,返现15%, 最高288元"
  },
  {
    vipLevel: "4",
    upgrade: 500000,
    monthly: "1,588",
    birthday: "2,888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥1000元,返现25%, 最高388元"
  },
  {
    vipLevel: "5",
    upgrade: 2000000,
    monthly: "2,888",
    birthday: "5,888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥1000元,返现25%, 最高588元"
  },
  {
    vipLevel: "6",
    upgrade: 5000000,
    monthly: "6,888",
    birthday: "8,888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥1000元,返现25%, 最高688元"
  },
  {
    vipLevel: "7",
    upgrade: 8000000,
    monthly: "18,888",
    birthday: "48,888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥2000元,返现35%, 最高888元"
  },
  {
    vipLevel: "8",
    upgrade: 10000000,
    monthly: "18,888",
    birthday: "48,888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥2000元,返现35%, 最高1288元"
  },
  {
    vipLevel: "9",
    upgrade: 20000000,
    monthly: "18,888",
    birthday: "48,888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥2000元,返现35%, 最高1888元"
  },
  {
    vipLevel: "10",
    upgrade: 30000000,
    monthly: "18,888",
    birthday: "48,888",
    monthlySaving: "",
    oneMonthSaving: "每月单笔≥2000元,返现40%, 最高2888元"
  }
];

const progessPercentage = (upgradeAmt) => {
  return (currentDepositAmount.value / upgradeAmt) * 100;
};

onActivated(() => {
  store.getUnreadTotal();
});

onMounted(() => {
  getBalance();
  // store.getUnreadTotal();
  store.getBalance();
  getVersionNo();
  checkPlatform();
  store.getUnreadTotal();
  getVipDetails();
});

onBeforeUnmount(() => {
  clearInterval(timerBalance.value);
});

// return {
//   logout,
//   mainWallet,
//   getBalance,
//   store,
//   openDeposit,
//   vipLevel,
//   appVersionNo,
//   isH5,
//   checkPlatform,
//   selfTgurl,
//   refreshMainWallet,
//   isRefreshingMainWallet,
//   convertToCommaAmount,
//   currentBetAmount,
//   currentDepositAmount,
//   vipItems,
//   progessPercentage,
//   isLogout
// };
</script>

<style lang="scss">
.dialog-card {
  background: linear-gradient(0deg, #213057, #213057),
    linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
  width: 100%;

  .dialog-title {
    font-size: 20px;
  }

  .dialog-desc {
    padding-top: 16px;
  }

  .dialog-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding-top: 24px;

    .action-btn {
      display: flex;
      width: 100%;
    }
  }
}
</style>

<style scoped lang="scss">
.profile {
  // background: url(../assets/images/account/account-bg.png) no-repeat center
  //   center;
  // display: flex;
  // justify-content: flex-start;
  // align-items: flex-start;
  // padding: 30px 10px;
  // gap: 10px;
  display: flex;
  gap: 8px;
  align-items: center;

  .avatar {
    width: 50px;

    img {
      width: 100%;
    }
  }

  .pro-details {
    font-size: 12px;
    line-height: 15px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .nickname-span {
      font-size: 14px;
      line-height: 1;
    }

    .details-span {
      font-size: 10px;
      color: #7a80a1;

      a {
        text-decoration: none;
        color: #7a80a1;
      }
    }
  }
}

.acct-top-menu {
  img {
    dispaly: block;
    width: 32px;
  }
}

.vipcard {
  background: linear-gradient(180deg, #384e79 0%, #212e4b 100%);
  border-radius: 6px;
  padding: 16px;
  position: relative;

  .amt {
    font-size: 20px;
    font-weight: 600;
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
      color: #bacef1;

      img {
        height: 30px;
      }
    }

    .q-btn__content {
      font-size: 12px;
      color: #bacef1;
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

.acc-btns-container {
  .q-btn {
    font-size: 12px;
    min-width: 60px;
  }
}

.acct-nav {
  background: linear-gradient(180deg, #384e79 0%, #212e4b 100%);
  border-radius: 8px;
  overflow: hidden;

  .acct-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    background: #445f95;
    padding: 12px;
    font-size: 16px;
    font-weight: 600;

    .acct-title-1 {
      display: flex;
      align-items: center;
      position: relative;

      &:before {
        content: "";
        background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
        box-shadow: 0px 1px 2px 0px #ffffff inset;

        height: 24px;
        width: 5px;
        display: block;
        position: absolute;
        left: -12px;
        top: 0;
      }
    }

    .vipurl {
      font-size: 12px;
      color: #00c7c0;

      a {
        text-decoration: none;
        color: #00c7c0;
      }
    }
  }

  .acct-menu {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 12px 0;

    a {
      width: 33.33%;
      text-decoration: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      height: 80px;

      .acct-nav-item {
        gap: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #bacef1;
        text-decoration: none;
        padding: 10px;
        position: relative;

        .acct-nav-label {
          font-size: 14px;
        }

        .unread {
          position: absolute;
          border-radius: 50%;
          background: #ff0000;
          left: 70%;
          top: -3px;
          color: #ffffff;
          padding: 1px 5px;
          font-size: 10px;
        }

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
  background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
  text-align: center;
  border-radius: 8px;
  color: #7a80a1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  img {
    display: block;
    width: 100%;
    max-width: 18px;
  }
}

.vip-badge {
  position: absolute;
  left: 10px;
  top: -40px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotate 1s linear infinite;
}

.card_btm {
  flex: 1;
  width: 100%;
  position: relative;
  // max-width: 300px;
  margin-top: 16px;
  .amt-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: #98a7b5;
  }

  .progress-container {
    display: flex;
    gap: 12px;
    padding: 6px 0 12px;

    .progress-bar-container {
      width: 100%;
      height: 6px;
      border-radius: 15px;
      overflow: hidden;
      background: #0996c733;
      margin-top: 6px;
      margin-bottom: 6px;
    }

    .progress-bar {
      height: 100%;
      width: 75%;
      background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);

      transition: width 0.5s;
    }

    .progress-vip-stat {
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;

      img {
        display: block;
        width: 36px;
      }
    }
  }
}

.vip-ribbon-btn {
  display: flex;
  position: absolute;
  bottom: 0;
  right: 0;
  img {
    width: 100%;
    max-width: 120px;
  }
}
</style>
