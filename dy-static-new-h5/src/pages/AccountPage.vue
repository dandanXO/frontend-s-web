<template>
  <q-page>
    <div class="acc-head"></div>
    <div class="profile">
      <div class="left">
        <div class="avatar">
          <img src="../assets/images/account/avatar.png"/>
        </div>
        <div class="pro-details">
          <span class="nickname-span">{{ store.nickName }}</span>
          <!-- <span v-if="vipLevel === 1">
            <img id="personal_vip_img" src="../assets/vip/vip_text_1.png" />
          </span>
          <span v-else-if="vipLevel === 2">
            <img id="personal_vip_img" src="../assets/vip/vip_text_2.png" />
          </span>
          <span v-else-if="vipLevel === 3">
            <img id="personal_vip_img" src="../assets/vip/vip_text_3.png" />
          </span>
          <span v-else-if="vipLevel === 4">
            <img id="personal_vip_img" src="../assets/vip/vip_text_4.png" />
          </span>
          <span v-else-if="vipLevel === 5">
            <img id="personal_vip_img" src="../assets/vip/vip_text_5.png" />
          </span>
          <span v-else-if="vipLevel === 6">
            <img id="personal_vip_img" src="../assets/vip/vip_text_6.png" />
          </span>
          <span v-else-if="vipLevel === 7">
            <img id="personal_vip_img" src="../assets/vip/vip_text_7.png" />
          </span>
          <span v-else-if="vipLevel === 8">
            <img id="personal_vip_img" src="../assets/vip/vip_text_8.png" />
          </span>
          <span v-else-if="vipLevel === 9">
            <img id="personal_vip_img" src="../assets/vip/vip_text_9.png" />
          </span>
          <span v-else-if="vipLevel === 10">
            <img id="personal_vip_img" src="../assets/vip/vip_text_10.png" />
          </span>
          <span v-else-if="vipLevel === 11">
            <img id="personal_vip_img" src="../assets/vip/vip_text_11.png" />
          </span>
          <span v-else-if="vipLevel === 12">
            <img id="personal_vip_img" src="../assets/vip/vip_text_12.png" />
          </span> -->

          <span v-if="store.evip">专属网址: <a style="text-decoration: none; color: #000000; font-size: 17px;"
                                               :href="selfTgurl" target="_blank">{{ store.evip }}</a></span>
          <span v-if="appVersionNo">版本：{{ appVersionNo }}</span>
        </div>
      </div>
      <router-link to="/liveChat" class="livechat">
        在线客服
      </router-link>
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
          <div class="left-sect">
            <div class="label"><img src="../assets/images/account/wallet.svg">中心钱包:</div>
          </div>
          <div class="right-sect">
            <router-link to="/" @click="openDeposit" class="button">
              存款
            </router-link>
            <router-link to="finance/withdraw" class="button">
              提款
            </router-link>
            <router-link to="account/transfer" class="button">
              转账
            </router-link>
          </div>
        </q-card-section>
        <div class="amt" @click="getBalance">{{ !isLoadingBalance ? mainWallet : 'Loading...' }}
          <RiRefreshLine/>
        </div>
        <!-- <q-separator /> -->

        <q-card class="bluecard vip-info-board" @click="goToVip">

          <div class="vipline q-mt-sm">
            <div class="circle"><span class="bigV">v</span><span class="small">{{ vipLevel }}</span></div>
            <div class="middle">
              <div class="row items-center justify-between">
                <div class="left">成长值</div>
                <div class="right">{{ store.currentDeposit }}/{{ store.levelUpDeposit }}</div>
              </div>

              <q-linear-progress :value="vip_progress" rounded class="q-mt-xs" color="white"/>

            </div>
            <div class="circle"><span class="bigV">v</span><span class="small">{{ vipLevel + 1 }}</span></div>
          </div>

          <div class="vip-get-div row justify-between items-center q-mt-sm">

            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel===0" size="13px" name="close" class="getpromo-icon" rounded></q-icon>
              <img v-if="vipLevel!==0" src="../assets/account/vip-tick-icon.png"/>
              <span>晋级礼包</span>
            </div>
            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel===0" size="13px" name="close" class="getpromo-icon" rounded></q-icon>

              <img v-if="vipLevel!==0" src="../assets/account/vip-tick-icon.png"/>
              <span>生日礼金</span>
            </div>
            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel===0" size="13px" name="close" class="getpromo-icon" rounded></q-icon>

              <img v-if="vipLevel!==0" src="../assets/account/vip-tick-icon.png"/>
              <span>每月活动</span>
            </div>
            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel===0" size="13px" name="close" class="getpromo-icon" rounded></q-icon>
              <img v-if="vipLevel!==0" src="../assets/account/vip-tick-icon.png"/>
              <span>专属活动</span>
            </div>
          </div>
        </q-card>
        <!-- <q-card-section class="bot-section">
          <router-link to="/" @click="openDeposit" class="button">
            <img src="../assets/images/index/deposit_icon.png" />
            存款
          </router-link>
          <router-link to="finance/withdraw" class="button">
            <img src="../assets/images/index/withdrawal_icon.png" />
            提款
          </router-link>
          <router-link to="account/transfer" class="button">
            <img src="../assets/images/index/transfer_icon.png" />
            转账
          </router-link>
          <router-link to="account/vip" class="button">
            <img src="../assets/images/account/vip_icon.png" />
            VIP详情
          </router-link>
        </q-card-section> -->
      </q-card-section>
    </div>
    <q-item-section class="acct-nav">
      <!-- <div class="acct-header-icon">
        <img
          src="../assets/images/account/personal_menu_title_icon.png"
          width="10"
        />
      </div> -->
      <div class="acct-title">
        <div class="acct-title-1">我的功能</div>
        <!-- <div id="vipDomain" class="vipurl">专属网址：{{ store.evip }}</div> -->
      </div>
      <div class="acct-menu">
        <router-link to="/account/records">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_record.svg"/>
            <div class="acct-nav-label">交易记录</div>
          </div>
        </router-link>
        <router-link to="/account/invite">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_share.svg"/>
            <div class="acct-nav-label">呼朋唤友</div>
          </div>
        </router-link>
        <router-link to="/promo?redirect=account">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_promo.svg"/>
            <div class="acct-nav-label">优惠领取</div>
          </div>
        </router-link>
        <router-link to="/account/personal">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_personal.svg"/>
            <div class="acct-nav-label">个人信息</div>
          </div>
        </router-link>
        <router-link to="/account/changePwd">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_changePwd.svg"/>
            <div class="acct-nav-label">密码</div>
          </div>
        </router-link>
        <router-link to="/account/withdraw">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_bank.svg"/>
            <div class="acct-nav-label">银行信息</div>
          </div>
        </router-link>
        <router-link v-if="!store.isApp()" to="/account/download">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_download.svg"/>
            <div class="acct-nav-label">下载中心</div>
          </div>
        </router-link>
        <router-link to="/account/announcement">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_announcement.svg"/>
            <div class="acct-nav-label">系统公告</div>
          </div>
        </router-link>
        <router-link to="/account/mail">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_mailbox.svg"/>
            <div class="acct-nav-label">站内信</div>
            <!--            ({{ store.unreadInboxMail }})-->
          </div>
        </router-link>
<!--        <a href="https://agt.wrxjpo3vh.com/" target="_blank">-->
<!--          <div class="acct-nav-item">-->
<!--            <img src="../assets/images/account/menu_affiliate.svg"/>-->
<!--            <div class="acct-nav-label">加盟</div>-->
<!--          </div>-->
<!--        </a>-->
        <a @click="logout">
          <div class="acct-nav-item">
            <img src="../assets/account/btn-logout.png"/>
            <div class="acct-nav-label">退出</div>
          </div>
        </a>

      </div>
    </q-item-section>

    <q-card class="card-account-banner">
      <q-card-section>
        <img class="account-banner-img" src="../assets/account/account-banner-img.png"/>
      </q-card-section>
    </q-card>
    <!--    <a @click="logout">-->
    <!--      <div class="acct-logout">-->
    <!--        <img src="../assets/images/account/menu_logout.svg"/>-->
    <!--        <div class="acct-nav-label">退出</div>-->
    <!--      </div>-->
    <!--    </a>-->
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from "vue";
import {userStore} from "stores/index";
import {useRouter} from "vue-router";
import {App} from "@capacitor/app";
import {RiRefreshLine} from "vue-remix-icons";

export default defineComponent({
  name: "AccountPage",
  components: {RiRefreshLine},
  setup() {
    const router = useRouter();
    const store = userStore();
    const logout = () => {
      store.memberLogout().then(() => {
        router.push("/");
      });
    };
    const appVersionNo = ref(null);
    const vipLevel = computed(() => {
      if (store.vip == "VIP0") {
        return 0;
      } else if (store.vip == "VIP1") {
        return 1;
      } else if (store.vip == "VIP2") {
        return 2;
      } else if (store.vip == "VIP3") {
        return 3;
      } else if (store.vip == "VIP4") {
        return 4;
      } else if (store.vip == "VIP5") {
        return 5;
      } else if (store.vip == "VIP6") {
        return 6;
      } else if (store.vip == "VIP7") {
        return 7;
      } else if (store.vip == "VIP8") {
        return 8;
      } else if (store.vip == "VIP9") {
        return 9;
      } else if (store.vip == "VIP10") {
        return 10;
      } else if (store.vip == "VIP11") {
        return 11;
      } else if (store.vip == "VIP12") {
        return 12;
      }
      return store.vip;
    });
    const vip_progress = ref(store.currentDeposit / store.levelUpDeposit);
    const goToVip = () => {
      router.push("/account/vip?redirect=account");
    }

    const timerBalance = ref();
    const mainWallet = computed(() => {
      return store.balance.toFixed(2);
    });
    const getVersionNo = async () => {
      if (store.getDeviceType() == "ANDROID") {
        const info = await App.getInfo();
        var current_version = info.version + "." + info.build;
        appVersionNo.value = current_version;
      } else if (store.getDeviceType() == "IOS") {
        appVersionNo.value = "iOS v0.2";
      } else {
      }
    };
    const isLoadingBalance = ref(false)

    const selfTgurl = ref('https://' + store.evip);


    onMounted(() => {
      getBalance();
      store.getBalance();
      // store.getUnreadTotal();
      getVersionNo();
    });
    onBeforeUnmount(() => {
      clearInterval(timerBalance.value);
    });
    const openDeposit = () => {
      // to="finance/deposit"
      localStorage.setItem("isOpenFromAccount", JSON.stringify(true));
      router.push("finance/deposit");
    };
    const getBalance = () => {
      isLoadingBalance.value = true;
      store.getBalance().then(() => {
        isLoadingBalance.value = false
      });
      timerBalance.value = setInterval(function () {
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
      vipLevel,
      store,
      openDeposit,
      appVersionNo,
      isLoadingBalance,
      selfTgurl,
      vip_progress,
      goToVip
    };
  }
});
</script>
<style scoped lang="scss">
.acc-head {
  background: url(../assets/images/common/bgheader.png) no-repeat center center;
  background-size: cover;
  height: 80px;
}

.profile {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  gap: 10px;
  width: 100%;

  .left {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
    width: 100%;
  }

  .avatar {
    width: 60px;
    max-width: 60px;
    min-width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
    }

    flex: 1;
  }

  .pro-details {
    flex: 3;
    font-size: 14px;
    line-height: 17px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .nickname-span {
      font-size: 18px;
      line-height: 21px;
      font-weight: 700;
      word-break: break-all;
    }
  }

  .livechat {
    background: #0089ED;
    color: #ffffff;
    border-radius: 50px;
    cursor: pointer;
    padding: 5px 15px;
    font-size: 16px;
    width: 120px;
    margin-top: 6px;
    text-decoration: none;
  }
}

.vipcard {
  margin: 15px auto;
  border-radius: 15px;
  width: 95%;
  box-shadow: 0px 0px 30px -15px #000;
  background: #ffffff;

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
    justify-content: space-between;
    align-items: center;
    padding: 15px;
  }

  .acct-section {
    display: flex;
    text-align: left;
    justify-content: space-evenly;
    align-items: flex-end;
    // border-bottom: 1px solid #2e3445;
    width: 100%;
    color: #000000;

    .left-sect {

      .label {
        font-size: 14px;
        line-height: 17px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-top: 5px;
        gap: 5px;

        svg {
          fill: #0089ED;
        }

        img {
          display: block;
          margin-bottom: 3px;
        }
      }

    }

    .right-sect {
      border: 1px solid #0089ED;
      background-image: linear-gradient(180deg, #52ACFF 0, #3559DA 100%),
      linear-gradient(#52ACFF, #3559DA);
      padding: 5px 15px;
      display: flex;
      justify-content: space-between;
      border-radius: 20px;
      max-width: 215px;

      a {
        font-size: 16px;
        display: block;
        //color: #0089ed;
        color: #fff;
        text-decoration: none;
      }
    }

  }

  .amt {
    font-size: 24px;
    width: calc(100% - 25px);
    margin-left: 25px;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      height: 20px;
      fill: #434343;
    }
  }

  .bluecard {
    width: 90%;
    margin: 0 10px;
    background: url(../assets/images/common/bgheader.png) no-repeat top right;
    padding: 10px;
    background-size: 100% 100%;

    .vipline {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 5px;

      .middle {
        color: #fff;
        flex: 6;
      }

      .circle {
        border: 1px solid #ffffff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        background: linear-gradient(180deg, #AAD6FF, #0075E1);

        .bigV {
          font-weight: 700;
          font-size: 25px;
          line-height: 13px;
        }

        .small {
          font-size: 13px;
          line-height: 13px;
        }
      }
    }
  }

  .bot-section {
    display: flex;
    justify-content: space-evenly;
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
  width: 95%;
  margin: 10px auto;
  padding: 5px;
  gap: 10px;

  a {
    padding: 5px;
    display: block;
  }

  .acct-title {
    display: flex;
    margin-top: 4px;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    color: #000;
    // .acct-header-icon

    .acct-title-1 {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      font-size: 16px;

      // &:before {
      //   content: "";
      //   // background: #33bcd4;
      //   height: 19px;
      //   width: 10px;
      //   background: url(../assets/images/account/personal_menu_title_icon.png)
      //     no-repeat center;
      //   background-size: 100%;
      //   display: inline-block;
      //   margin-left: -5px;
      // }
    }
  }

  .acct-menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
    gap: 20px;
    row-gap: 20px;
    height: 300px;
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // gap: 6%;

    a {
      text-decoration: none;
      font-size: 14px;
      height: 80px;
      display: block;

      .acct-nav-item {
        gap: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #000;
        text-decoration: none;

        img {
          height: 46px;
          fill: white;
          padding: 0;
        }
      }
    }
  }
}

.acct-logout {
  padding: 8px;
  border: 1px solid #0089ED;
  text-align: center;
  color: #0089ED;
  border-radius: 30px;
  line-height: 15px;
  width: 90%;
  margin: 10px auto 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.vip-badge {
  position: absolute;
  left: 10px;
  top: -40px;
}

.vip-info-board {
  margin-top: 10px !important;

  .vip-getpromo-div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 3px;

    .getpromo-icon {
      width: 13px;
      background: #fff;
      border-radius: 50%;
      height: 13px;
      line-height: 13px;
    }

    span {
      color: #fff;
      font-size: 13px;
      text-decoration: none;
    }
  }
}

.card-account-banner {
  margin: 10px 10px 0px;
  border-radius: 10px 10px 0px 0px;

  .account-banner-img {
    width: 100%;
  }
}


#personal_vip_img {
  height: 14px;
}

@media (max-width: 430px) {
  .acct-nav {
    .acct-menu {

      grid-template-columns: repeat(4, 1fr);

    }
  }
}

@media (max-width: 350px) {
  .acct-nav {
    .acct-menu {

      grid-template-columns: repeat(3, 1fr);
      height: 380px;
    }
  }
}
</style>
