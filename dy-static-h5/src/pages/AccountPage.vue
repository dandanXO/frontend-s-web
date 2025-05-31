<template>
  <q-page>
    <div class="acc-head"></div>
    <div class="profile">
      <div class="left">
        <div class="avatar">
          <img src="../assets/images/account/avatar.png" />
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

          <span v-if="store.evip">
            专属网址:
            <a style="text-decoration: none; color: #000000; font-size: 17px" :href="selfTgurl" target="_blank">
              {{ store.evip }}
            </a>
          </span>
          <span v-if="appVersionNo">版本：{{ appVersionNo }}</span>
        </div>
      </div>
      <router-link to="/liveChat" class="livechat cs-web-id">在线客服</router-link>
    </div>
    <div class="vipcard">
      <q-card-section class="top-section">
        <!-- <div class="name">{{ header }}</div> -->
        <q-card-section class="acct-section">
          <div class="left-sect">
            <div class="label">
              <img src="../assets/images/account/wallet.svg" />
              中心钱包:
            </div>
            <div class="amt" @click="getBalance">
              {{ !isLoadingBalance ? mainWallet : "加载中..." }}
              <img class="svg" src="~assets/account/refresh-line.svg" />
            </div>
          </div>
          <div class="right-sect">
            <q-btn
              label="存款"
              rounded
              color="primary"
              style="width: 80px; font-size: 16px; height: 36px; min-height: 36px"
              @click="openDeposit"
            />

            <q-btn
              label="提款"
              rounded
              color="secondary"
              style="width: 80px; font-size: 16px; height: 36px; min-height: 36px"
              to="finance/withdraw"
            />

            <q-btn
              label="转账"
              rounded
              color="accent"
              style="width: 80px; font-size: 16px; height: 36px; min-height: 36px"
              to="account/transfer"
            />
          </div>
        </q-card-section>

        <!-- <q-separator /> -->

        <q-card class="bluecard vip-info-board" @click="goToVip">
          <div class="vipline q-mt-sm">
            <div class="circle">
              <span class="bigV">v</span>
              <span class="small">{{ vipLevel }}</span>
            </div>
            <div class="middle">
              <div class="row items-center justify-between">
                <div class="left">晋级流水（元）</div>
                <div class="right">{{ store.currentDeposit }}/{{ store.levelUpDeposit }}</div>
              </div>

              <q-linear-progress :value="vip_progress" rounded class="q-mt-xs" color="white" />
            </div>
            <div class="circle">
              <span class="bigV">v</span>
              <span class="small">{{ vipLevel + 1 }}</span>
            </div>
          </div>

          <div class="vip-get-div row justify-between items-center q-mt-sm">
            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon>
              <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" />
              <span>晋级礼金</span>
            </div>
            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon>

              <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" />
              <span>生日礼金</span>
            </div>
            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon>

              <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" />
              <span>会员日红包</span>
            </div>
            <div class="vip-getpromo-div">
              <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon>
              <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" />
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

    <div class="privilege-vip-div">
      <router-link to="/account/vip?redirect=account">
        <img src="../assets/account/vip_button_icon.png" alt="" />
      </router-link>
    </div>

    <q-item-section class="acct-nav">
      <div class="acct-title">
        <div class="acct-title-1">我的功能</div>
        <!-- <div id="vipDomain" class="vipurl">专属网址：{{ store.evip }}</div> -->
      </div>
      <div class="acct-menu" id="id-acct-menu">
        <router-link to="/account/records">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_record.svg" />
            <div class="acct-nav-label">交易记录</div>
          </div>
        </router-link>
        <router-link to="/account/invite">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_share.svg" />
            <div class="acct-nav-label">推广赚钱</div>
          </div>
        </router-link>
        <router-link to="/promo?redirect=account">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_promo.svg" />
            <div class="acct-nav-label">优惠领取</div>
          </div>
        </router-link>
        <router-link to="/account/personal">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_personal.svg" />
            <div class="acct-nav-label">个人信息</div>
          </div>
        </router-link>
        <router-link to="/account/changePwd">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_changePwd.svg" />
            <div class="acct-nav-label">修改密码</div>
          </div>
        </router-link>
        <router-link to="/account/withdraw">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_bank.svg" />
            <div class="acct-nav-label">银行信息</div>
          </div>
        </router-link>
        <router-link v-if="!store.isApp()" to="/account/download">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_download.svg" />
            <div class="acct-nav-label">下载中心</div>
          </div>
        </router-link>
        <router-link to="/account/announcement">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_announcement.svg" />
            <div class="acct-nav-label">系统公告</div>
          </div>
        </router-link>
        <router-link to="/account/inbox">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_mailbox.svg" />
            <div class="acct-nav-label">
              消息中心 {{ store.unreadInboxMail > 0 ? `(${store.unreadInboxMail})` : "" }}
            </div>
            <!--            ({{ store.unreadInboxMail }})-->
          </div>
        </router-link>
        <router-link to="/account/mail">
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_mailbox.svg" />
            <div class="acct-nav-label">反馈奖励</div>
            <!--            ({{ store.unreadInboxMail }})-->
          </div>
        </router-link>
        <router-link to="/affiliate">
          <!--        <a href="https://dy2-affiliate.mndofithly.com/" target="_blank">-->
          <div class="acct-nav-item">
            <img src="../assets/images/account/menu_affiliate.svg" />
            <div class="acct-nav-label">加盟</div>
          </div>
        </router-link>
        <!--        </a>-->
        <!--        <a @click="logout">-->
        <!--          <div class="acct-nav-item">-->
        <!--            <img src="../assets/account/btn-logout.png"/>-->
        <!--            <div class="acct-nav-label">退出</div>-->
        <!--          </div>-->
        <!--        </a>-->
      </div>
    </q-item-section>

    <q-card class="card-account-banner" v-if="btm_banners.length > 0">
      <q-card-section>
        <q-carousel
          class="account"
          autoplay
          navigation
          v-model="slide"
          swipeable
          transition-next="slide-left"
          transition-prev="slide-right"
          animated
          infinite
        >
          <template v-slot:navigation-icon="{ active, onClick }">
            <q-btn
              padding="3px"
              v-if="active"
              size="xs"
              color="white"
              @click="onClick"
              style="border: 1px solid #ffffff; border-radius: 50%; margin: 6px 8px"
            />
            <q-btn
              padding="3px"
              v-else
              size="xs"
              color="transparent"
              @click="onClick"
              style="border: 1px solid #aaaaaa; border-radius: 50%; margin: 6px 8px"
            />
          </template>

          <q-carousel-slide
            v-for="(banner, i) in btm_banners"
            :key="i"
            :name="i"
            class="column no-wrap flex-center"
            :img-src="imgURL + banner.mobileImageUrl"
            @click="gotoPromo(banner)"
          ></q-carousel-slide>
        </q-carousel>
      </q-card-section>
    </q-card>
    <a @click="logout">
      <div class="acct-logout">
        <img src="../assets/images/account/menu_logout.svg" />
        <div class="acct-nav-label">退出登录</div>
      </div>
    </a>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
// import { App } from "@capacitor/app";
import { api } from "boot/axios";
import { useLocalStorage } from "@vueuse/core";

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
    };

    const timerBalance = ref();
    const mainWallet = computed(() => {
      return store.balance.toFixed(2);
    });
    // const getVersionNo = async () => {
    //   if (store.getDeviceType() == "ANDROID") {
    //     const info = await App.getInfo();
    //     var current_version = info.version + "." + info.build;
    //     appVersionNo.value = current_version;
    //   } else if (store.getDeviceType() == "IOS") {
    //     appVersionNo.value = "iOS v0.6";
    //   } else {
    //   }
    // };
    const isLoadingBalance = ref(false);

    const selfTgurl = ref("https://" + store.evip);

    onMounted(() => {
      getBalance();
      store.getBalance();
      // store.getUnreadTotal();
      // getVersionNo();
      getPromoImage();
      if (store.isApp()) {
        var btmSwiper = document.getElementById("id-acct-menu");
        btmSwiper.classList.add("shorter-menu");
      }
    });

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    const btm_banners = ref([]);
    const getPromoImage = () => {
      api
        .get("/opt-session/promo/banner?category=CENTERPROMO")
        .then((res) => {
          if (res.code === 0) {
            btm_banners.value = res.data;
            if (btm_banners.value.length === 1) {
              btm_banners.value.push(res.data[0]);
            }
          }
        })
        .catch(() => {});
    };
    const gotoPromo = (banner) => {
      const redirectU = "/promo?name=" + banner.redirectUrl;
      router.push(`${redirectU}`);
    };

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
        isLoadingBalance.value = false;
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
      goToVip,
      btm_banners,
      imgURL,
      gotoPromo,
      slide: ref(0)
    };
  }
});
</script>
<style scoped lang="scss">
.acc-head {
  background: url(../assets/images/common/bgheader.png) no-repeat center center;
  background-size: cover;
  height: 0px;
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
    background: #0089ed;
    color: #ffffff;
    border-radius: 50px;
    cursor: pointer;
    padding: 5px 15px;
    font-size: 16px;
    width: auto;
    white-space: nowrap;
    margin-top: 6px;
    text-decoration: none;
  }
}

.vipcard {
  margin: 15px auto;
  border-radius: 15px;
  width: 95%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;

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
    align-items: flex-start;
    // border-bottom: 1px solid #2e3445;
    width: 100%;
    color: #000000;
    margin-bottom: 12px;

    .left-sect {
      flex-wrap: nowrap;

      .label {
        font-size: 14px;
        line-height: 17px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-top: 5px;
        gap: 5px;

        svg {
          fill: #0089ed;
        }

        img {
          display: block;
          margin-bottom: 3px;
        }
      }
    }

    .right-sect {
      //border: 1px solid #0089ED;
      //background-image: linear-gradient(180deg, #52ACFF 0, #3559DA 100%),
      //linear-gradient(#52ACFF, #3559DA);
      //padding: 5px 15px;
      display: flex;
      justify-content: space-between;
      //border-radius: 20px;
      max-width: 260px;
      gap: 6px;

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

    img {
      height: 20px;
      fill: #434343;
    }
  }

  .bluecard {
    width: 98%;
    margin: 0 0px !important;
    background: url(../assets/images/common/bgheader.png) no-repeat top right;
    padding: 20px 15px;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;

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
        background: linear-gradient(180deg, #aad6ff, #0075e1);

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

.privilege-vip-div {
  width: 95%;
  margin: 10px auto 16px;

  img {
    width: 100%;
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
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 30px;
    gap: 20px;
    row-gap: 20px;
    height: auto;
    margin-bottom: 10px;
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // gap: 6%;

    &.shorter-menu {
      grid-template-rows: repeat(2, 1fr);
    }

    a {
      text-decoration: none;
      font-size: 14px;
      height: 80px;
      display: block;

      .acct-nav-item {
        font-size: 14px;
        gap: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #000;
        text-decoration: none;

        img {
          height: 50px;
          fill: white;
          padding: 0;
        }
      }
    }
  }
}

.acct-logout {
  padding: 12px;
  border: 1px solid #0089ed;
  text-align: center;
  font-size: 20px;
  color: #0089ed;
  border-radius: 30px;
  line-height: 15px;
  width: 90%;
  letter-spacing: 1px;
  margin: 20px auto 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
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
    gap: 4px;

    .getpromo-icon {
      width: 16px;
      background: #fff;
      border-radius: 50%;
      height: 16px;
      line-height: 16px;
    }

    img {
      width: 16px;
    }

    span {
      color: #fff;
      font-size: 15px;
      text-decoration: none;
    }
  }
}

.card-account-banner {
  margin: 10px 10px 0px;
  border-radius: 10px 10px 0px 0px;

  .account-banner-img {
    width: 100%;
    border-radius: 10px 10px 0px 0px;
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

  .vipcard .acct-section {
    flex-direction: column;
    gap: 8px;
  }
  .vipcard .acct-section .right-sect {
    width: 100%;
    text-align: center;
  }

  .q-carousel.home {
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
