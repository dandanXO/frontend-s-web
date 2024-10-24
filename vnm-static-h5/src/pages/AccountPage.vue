<template>
  <q-page>
    <div class="profile">
      <div class="left">
        <div class="avatar">
          <img src="../assets/images/account/avatar.png" />
        </div>
        <div class="pro-details">
          <span class="nickname-span">{{ store.nickName }}</span>

          <span v-if="appVersionNo">{{ $t("lang.version_no") }}: {{ appVersionNo }}</span>
        </div>
      </div>

      <div class="q-mt-sm">
        <LangOptions />
      </div>
    </div>

    <div class="vipcard">
      <q-card-section class="top-section">
        <q-card-section class="acct-section">
          <div class="left-sect">
            <div class="label">
              <img src="../assets/images/account/account-wallet-icon.png" />
              <span>{{ $t("lang.central_wallet") }}</span>
              <div class="refresh-btn" @click="getBalance">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAoCAMAAAChHKjRAAAAOVBMVEUAAAD///////////////////////////////////////////////////////////////////////8KOjVvAAAAEnRSTlMAoCAQv0DPYN/vgDBwkFCvb3+yRuHQAAABGElEQVQ4y42UWZKEIBBEEShZtXvq/oedMUE0WCe/BF5UJgUoig4l1tK7+gfEoAKRVBMIVHDMbD9GDqBCQVuLqYO5ohqMLHNLWXozJs/qb7hCS6/zRHyYL0PvTsmtokKqHR4EWEpA75FWzV5QzKV5fHfbjZUNheDV7Z3aYXjjRnRFCPJHoxCmRoZKmFxoUsrc7EgW0TVchzqunQsHdCSkceJy83OIV9AJaGEXYbcj2SL4hkMcQjuM4rSZMq0qHM/0WGR6JUzjQtgWTa6KzYVQannphHSgZPf6Fg/DGPWf4nmPfftiCWVwYhXFuz9B/GiuGDgi12vDkDNVRz6FKil12xejK0r3++t1oeLsUgfKv0MPaKUIaKUn9i9rNhpnjIgaUQAAAABJRU5ErkJggg==" />
              </div>
            </div>
            <div class="amt">
              {{ !isLoadingBalance ? "VNDP " + mainWallet : $t("lang.loading") }}
            </div>
          </div>
        </q-card-section>
        <q-card-section class="acct-btm-section">
          <div class="vip-level-detail">
            <div class="vip-link">{{ store.vip }}</div>

            <div class="vip-progress">
              <q-linear-progress size="10px" :value="vipProgress" />
            </div>

            <div class="vip-link">{{ updatedVip() }}</div>
          </div>

          <div class="list-reward-wapper" style="display: none">
            <div class="list-reward-received">
              <div class="list-item collected">
                <div><img src="../assets/images/account/list-tick.png" /></div>
                <div>每周红包</div>
              </div>
              <div class="list-item collected">
                <div><img src="../assets/images/account/list-tick.png" /></div>
                <div>晋级礼金</div>
              </div>
              <div class="list-item">
                <div><img src="../assets/images/account/list-cross.png" /></div>
                <div>专属豪礼</div>
              </div>
              <div class="list-item">
                <div><img src="../assets/images/account/list-cross.png" /></div>
                <div>生日礼金</div>
              </div>
            </div>
          </div>

          <div class="btm-sect-btns">
            <q-btn :label="$t('lang.deposit_btn')" no-caps class="btn-main btn-pointer" @click="openDeposit" />

            <q-btn :label="$t('lang.withdraw_btn')" no-caps class="btn-main btn-pointer" @click="openWithdraw" />
            <q-btn :label="$t('lang.menu_rebate')" no-caps class="btn-main btn-pointer" @click="getRebateAmt" />
            <!-- <q-btn :label="$t('lang.transfer_btn')" no-caps class="btn-main btn-pointer" @click="openTransfer" /> -->
          </div>
          <div class="eshare-div">
            <span v-if="store.evip">
              {{ $t("lang.personal_exclusiveurl") }}:
              <a class="share-link" :href="'https://' + store.evip" target="_blank">
                {{ "https://" + store.evip }}
              </a>
              <!-- <img
                class="copy-btn btn-pointer"
                src="../assets/images/account/account-copy-icon.png"
                @click="copyLink"
              /> -->
            </span>
          </div>
        </q-card-section>
      </q-card-section>
    </div>

    <q-item-section class="acct-nav">
      <div class="acct-title">
        <div class="acct-title-1">{{ $t("lang.account_title") }}</div>
        <router-link class="acct-title-link" to="/promo?redirect=account">
          {{ $t("lang.account_bonus_redeem") }}
          <q-icon name="chevron_right" size="20px" />
        </router-link>
      </div>
      <div class="acct-menu" id="id-acct-menu">
        <router-link to="/account/personal">
          <div class="acct-nav-item">
            <div class="personal-icon" />
            <div class="acct-nav-label">
              {{ $t("lang.mine_personal_info") }}
            </div>
          </div>
        </router-link>

        <router-link to="/account/withdraw">
          <div class="acct-nav-item">
            <div class="bank-card-icon" />
            <div class="acct-nav-label">
              {{ $t("lang.mine_bank") }}
            </div>
          </div>
        </router-link>

        <router-link to="/account/records">
          <div class="acct-nav-item">
            <div class="transaction-icon" />
            <div class="acct-nav-label">
              {{ $t("lang.mine_transaction") }}
            </div>
          </div>
        </router-link>

        <router-link to="/account/letters">
          <div class="acct-nav-item">
            <div class="mailbox-icon" />
            <div class="acct-nav-label">
              {{ $t("lang.mine_mailbox") }}
            </div>
            <q-badge v-if="store.unreadInboxMail" color="red" class="unread-count" rounded>
              {{ store.unreadInboxMail }}
            </q-badge>
          </div>
        </router-link>

        <router-link to="/account/invite">
          <div class="acct-nav-item">
            <div class="refer-icon" />
            <div class="acct-nav-label">
              {{ $t("lang.mine_refer_friend") }}
            </div>
          </div>
        </router-link>

        <router-link to="/account/changePwd">
          <div class="acct-nav-item">
            <div class="change-password-icon" />
            <div class="acct-nav-label">
              {{ $t("lang.mine_change_password") }}
            </div>
          </div>
        </router-link>

        <router-link to="/affiliate">
          <div class="acct-nav-item">
            <div class="affiliate-icon" />
            <div class="acct-nav-label">
              {{ $t("lang.mine_apply_for_partnership") }}
            </div>
          </div>
        </router-link>

        <router-link to="/about">
          <div class="acct-nav-item">
            <div class="about-icon" />
            <div class="acct-nav-label">{{ $t("lang.page_about") }}</div>
          </div>
        </router-link>
      </div>
    </q-item-section>

    <a @click="isLogoutModal = true">
      <div class="acct-logout btn-pointer">
        <div class="acct-nav-label">{{ $t("lang.mine_logout") }}</div>
        <div class="logout-icon" />
      </div>
    </a>
  </q-page>

  <q-dialog width="100%" class="modal-common-div" v-model="isLogoutModal" show-cancel-button :showCancelButton="false"
    :showConfirmButton="false">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="titles">{{ $t("lang.logout_title") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <div class="contents">{{ $t("lang.logout_desc") }}</div>
      <div class="btnsreas">
        <div class="confirmsbtns common-md-btn btn-standard-height" @click="logout">
          {{ $t("lang.logout_confirm") }}
        </div>
        <div class="cacnels common-md-white-btn btn-standard-height" @click="isLogoutModal = false">
          {{ $t("lang.logout_cancel") }}
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" class="modal-common-div" v-model="isRebateModalVisible" show-cancel-button
    :showCancelButton="false" :showConfirmButton="false">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="titles">{{ $t("lang.menu_rebate") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <div class="contents" style="font-size: 30px; color: #468cff">{{ rebateAmt }}</div>
      <div class="btnsreas">
        <div class="confirmsbtns common-md-btn btn-standard-height" @click="claimRebateAmt">
          {{ $t("lang.rebate_claim_now") }}
        </div>
        <div class="cacnels common-md-white-btn btn-standard-height" @click="isRebateModalVisible = false">
          {{ $t("lang.cancel") }}
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";
import { useLocalStorage } from "@vueuse/core";
import { api, eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import LangOptions from "components/LangOptions";

export default defineComponent({
  name: "AccountPage",
  components: { LangOptions },
  setup() {
    const router = useRouter();
    const store = userStore();
    const $q = useQuasar();

    const isLogoutModal = ref(false);
    const isHideLevelUp = ref(false);

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
      return store.balance.toLocaleString("en-US", { maximumFractionDigits: 0 });
    });
    const getVersionNo = async () => {
      if (store.getDeviceType() == "ANDROID") {
        const info = await App.getInfo();
        var current_version = info.version;
        appVersionNo.value = current_version;
      } else if (store.getDeviceType() == "IOS") {
        appVersionNo.value = "iOS v0.6";
      } else {
      }
    };
    const isLoadingBalance = ref(false);

    const selfTgurl = ref("https://" + store.evip);

    const copyLink = () => {
      const copyText = store.evip;
      const textarea = document.createElement("textarea");
      textarea.value = copyText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      $q.notify({
        color: "positive",
        position: "top",
        message: "已复制专属网址",
        icon: "check_circle_outline"
      });
    };

    onMounted(() => {
      getBalance();
      // store.getBalance();
      // store.getUnreadTotal();
      getVersionNo();
      getPromoImage();
      if (store.isApp()) {
        var btmSwiper = document.getElementById("id-acct-menu");
        btmSwiper.classList.add("shorter-menu");
      }
      getVipProgress();
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
        .catch(() => { });
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
    const openWithdraw = () => {
      router.push("finance/withdraw");
    };
    const openTransfer = () => {
      router.push("account/transfer");
    };

    const isRebateModalVisible = ref(false);
    const rebateAmt = ref(0);
    const getRebateAmt = () => {
      eventapi.get("/daily-rebate/available-amount").then((res) => {
        if (res.code === 0) {
          rebateAmt.value = res.data;
          isRebateModalVisible.value = true;
        } else {
        }
      });
    };
    const claimRebateAmt = () => {
      eventapi.put("/bonus/claim/vnm-daily-rebate").then((res) => {
        if (res.code === 0) {
          isRebateModalVisible.value = false;
        } else {
        }
      });
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

    const vipProgress = ref(0);

    const formatNumber = (numberString) => {
      const number = parseFloat(numberString);
      if (!isNaN(number)) {
        return number.toLocaleString("en-US");
      }
      return "";
    };

    const updatedVip = () => {
      const currentVip = parseInt(store.vip.match(/\d+/)[0]);
      const updatedVip = currentVip + 1;

      if (currentVip < 12) {
        return "VIP" + updatedVip.toString();
      } else {
        getVipProgress(true);
        isHideLevelUp.value = true;
        return "已满级";
      }
    };

    const getVipProgress = (max) => {
      if (max) {
        vipProgress.value = parseFloat(store.currentDeposit) / parseFloat(store.currentDeposit);
      } else {
        vipProgress.value = parseFloat(store.currentDeposit) / parseFloat(store.levelUpDeposit);
      }
    };

    return {
      header: "Account",
      logout,
      mainWallet,
      getBalance,
      vipLevel,
      store,
      openDeposit,
      openWithdraw,
      openTransfer,
      appVersionNo,
      isLoadingBalance,
      selfTgurl,
      vip_progress,
      goToVip,
      btm_banners,
      imgURL,
      gotoPromo,
      slide: ref(0),
      isLogoutModal,
      copyLink,
      vipProgress,
      getVipProgress,
      formatNumber,
      updatedVip,
      isHideLevelUp,
      isRebateModalVisible,
      rebateAmt,
      getRebateAmt,
      claimRebateAmt,
      LangOptions
    };
  }
});
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 15px 4px;
  gap: 10px;
  width: 100%;
  box-shadow: 0px -2px 6px 0px #c3d4e6 inset;

  .left {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
    width: 100%;
  }

  .avatar {
    width: 50px;
    max-width: 50px;
    min-width: 50px;
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
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 6px;

    .nickname-span {
      color: $dark;
      font-size: 1.15rem;
      line-height: 1.15rem;
      font-weight: 700;
      word-break: break-all;
    }

    .join-span {
      font-size: 0.9rem;
      line-height: 0.9rem;
      color: $font-1;
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
  margin: 8px auto 6px;
  border-radius: 15px;
  width: $box-width;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;

  .q-card__section--vert {
    padding: 0;
  }

  .btn-main {
    background-image: url("../assets/images/account/account-btn.png");
    background-size: 100% 100%;
    color: #fff;
    min-width: 60px;
    padding-left: 12px;
    padding-right: 12px;
    text-align: center;
    white-space: nowrap;
    font-size: 1rem;
    // aspect-ratio: 122/68;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
  }

  .top-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: url("../assets/images/account/account-bg.png");
    background-size: 100% 100%;

    align-items: center;
    padding: 10px 14px;
  }

  .acct-section {
    display: flex;
    text-align: left;
    justify-content: space-evenly;
    align-items: flex-start;
    width: 100%;
    color: $grey-color;
    margin-bottom: 8px;

    >div {
      flex: 1;
    }

    .left-sect {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 10px;

      .refresh-btn {
        width: 15px;
        height: 16.66px;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAoCAMAAAChHKjRAAAAOVBMVEUAAAD///////////////////////////////////////////////////////////////////////8KOjVvAAAAEnRSTlMAoCAQv0DPYN/vgDBwkFCvb3+yRuHQAAABGElEQVQ4y42UWZKEIBBEEShZtXvq/oedMUE0WCe/BF5UJgUoig4l1tK7+gfEoAKRVBMIVHDMbD9GDqBCQVuLqYO5ohqMLHNLWXozJs/qb7hCS6/zRHyYL0PvTsmtokKqHR4EWEpA75FWzV5QzKV5fHfbjZUNheDV7Z3aYXjjRnRFCPJHoxCmRoZKmFxoUsrc7EgW0TVchzqunQsHdCSkceJy83OIV9AJaGEXYbcj2SL4hkMcQjuM4rSZMq0qHM/0WGR6JUzjQtgWTa6KzYVQannphHSgZPf6Fg/DGPWf4nmPfftiCWVwYhXFuz9B/GiuGDgi12vDkDNVRz6FKil12xejK0r3++t1oeLsUgfKv0MPaKUIaKUn9i9rNhpnjIgaUQAAAABJRU5ErkJggg==');
        background-size: 100% 100%;
      }

      .label {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-top: 0px;
        gap: 8px;

        span {
          font-size: 1rem;
          line-height: 1rem;
          width: 55px;
        }

        img {
          display: block;
          width: 15px;
          margin-bottom: 3px;
        }
      }
    }

    .right-sect {
      display: flex;
      justify-content: space-between;
      max-width: 220px;
      gap: 20px;

      a {
        font-size: 16px;
        display: block;
        //color: #0089ed;
        color: #fff;
        text-decoration: none;
      }
    }
  }

  .btm-sect-btns {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
  }

  .amt {
    color: $white;
    font-size: 1rem;
    font-weight: bold;
    width: calc(100% - 135px);
    // margin-left: 25px;
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      height: 1.2rem;
    }
  }

  .acct-btm-section {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;

    .vip-info-div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: 4px;

      .vip-txt-left {
        display: flex;
        color: $grey-color;
        font-size: 0.875rem;

        &.opacity-0 {
          opacity: 0;
        }
      }
    }
  }

  .eshare-div {
    margin-right: auto;
    width: 100%;
    color: #a4aabb;
    font-size: 1rem;
    // font-weight: bold;

    >span {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    }

    .copy-btn {
      width: 20px;
    }

    .share-link {
      color: $white;
      font-weight: bold;
      text-decoration: none;
    }
  }

  //.bluecard {
  //  width: 98%;
  //  margin: 0 0px !important;
  //  background: url(../assets/images/common/bgheader.png) no-repeat top right;
  //  padding: 20px 15px;
  //  background-size: 100% 100%;
  //  display: flex;
  //  flex-direction: column;
  //  gap: 15px;
  //
  //  .vipline {
  //    display: flex;
  //    justify-content: space-between;
  //    align-items: flex-start;
  //    gap: 5px;
  //
  //    .middle {
  //      color: #fff;
  //      flex: 6;
  //    }
  //
  //    .circle {
  //      border: 1px solid #ffffff;
  //      border-radius: 50%;
  //      width: 40px;
  //      height: 40px;
  //      display: flex;
  //      justify-content: center;
  //      align-items: center;
  //      color: #ffffff;
  //      background: linear-gradient(180deg, #aad6ff, #0075e1);
  //
  //      .bigV {
  //        font-weight: 700;
  //        font-size: 25px;
  //        line-height: 13px;
  //      }
  //
  //      .small {
  //        font-size: 13px;
  //        line-height: 13px;
  //      }
  //    }
  //  }
  //}
}

.acct-nav {
  width: $box-width;
  margin: 0px auto;
  padding: 0px;
  gap: 0px;

  a {
    padding: 5px;
    display: block;
  }

  .acct-title {
    display: flex;
    padding: 12px 4px 8px;
    margin-top: 4px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: $font-2;
    // background-color: $lightblue;
    background: rgba(203, 229, 255, 1);
    position: relative;
    border-radius: 20px 20px 0px 0px;
    position: relative;

    .acct-title-1 {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      padding-left: 10px;
      font-size: 1.2rem;
      color: #0e436c;
    }

    .acct-title-link {
      background: linear-gradient(271.61deg, #0d8be6 22.35%, #68e4eb 100%);
      color: #ffffff;
      position: absolute;
      top: 0;
      right: 0;
      border-top-right-radius: 12px;
      border-bottom-left-radius: 12px;
      width: auto;
      min-width: 130px;
      height: 30px;
      padding-left: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }
  }

  .acct-menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 10px;
    gap: 10px;
    row-gap: 10px;
    height: auto;
    margin-bottom: 10px;
    background-color: $white;
    border-radius: 0px 0px 20px 20px;
    padding: 24px 0px 28px;
    box-shadow: 0px -4px 4px 0px #c3d4e6 inset;

    &.shorter-menu {
      grid-template-rows: repeat(2, 1fr);
    }

    a {
      text-decoration: none;
      height: 80px;
      display: block;

      .acct-nav-item {
        font-size: 1rem;
        gap: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        text-decoration: none;
        padding: 6px;
        border-radius: 4px;
        position: relative;

        .acct-nav-label {
          // white-space: nowrap;
          color: $font-1;
          font-size: 12px;
        }

        img {
          height: 32px;
          fill: white;
          padding: 0;
        }

        .unread-count {
          position: absolute;
          right: 1rem;
          top: 0;
        }

        &:active {
          background: rgba(0, 0, 0, 0.2);
          filter: brightness(0.9);
        }
      }
    }
  }
}

.acct-logout {
  padding: 12px;
  box-shadow: 0px -2px 8px 0px #c3d4e6 inset;
  text-align: center;
  font-size: 1.2rem;
  background: $white;
  color: $font-1;
  border-radius: 20px;
  line-height: 15px;
  width: $box-width;
  letter-spacing: 1px;
  margin: 6px auto 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;

  img {
    width: 25px;
  }
}

.vip-badge {
  position: absolute;
  left: 10px;
  top: -40px;
}

.card-account-banner {
  width: calc(100% - 2rem);
  margin: auto;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;

  .account-banner-img {
    width: 100%;
    border-radius: 10px 10px 0px 0px;
  }
}

#personal_vip_img {
  height: 14px;
}

.list-reward-wapper {
  overflow: hidden;
  /* Hide horizontal scrollbar from the wrapper */
  width: 100%;
}

.list-reward-received {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  /* Make the section scrollable horizontally */
  overflow-y: hidden;
  /* Hide vertical scrollbar */
  // padding-bottom: 16px; /* Add padding to ensure space for scrollbar */
}

.list-reward-received::-webkit-scrollbar {
  display: none;
  /* Hide scrollbar for WebKit (Chrome, Safari) */
}

.list-item {
  border-radius: 24px;
  height: 25px;
  padding-left: 5px;
  padding-right: 9px;
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.875rem;
  color: #ffffff;
  background: rgba(207, 235, 255, 0.25);
  opacity: 0.5;

  &.collected {
    opacity: 1;
  }

  img {
    width: 15px;
    display: block;
  }
}

.vip-level-detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 8px;
}

.vip-progress {
  width: 100%;
  margin: 0 6px;

  :deep(.q-linear-progress) {
    border-radius: 30px;
  }

  :deep(.q-linear-progress__model) {
    background: linear-gradient(180deg, #32a9ff 0%, #3b5afe 100%);
  }

  :deep(.q-linear-progress__track) {
    opacity: 1;
    background: linear-gradient(180deg, #f8ffff 0%, #85e2ff 100%);
  }
}

.vip-link {
  background: linear-gradient(180deg, #32a9ff 0%, #3b5afe 100%);
  min-width: 60px;
  height: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 0.875rem;
  padding-left: 10px;
  margin-left: 10px;
  position: relative;
  line-height: 1;
  padding-top: 2px;

  &:before {
    content: "";
    background-image: url("../assets/images/account/vip-diamond.png");
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: -10px;
    width: 25px;
    height: 21px;
  }
}

@media (max-width: 430px) {
  .acct-nav {
    .acct-menu {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .vipcard .acct-section .right-sect {
    gap: 10px;
  }

  // .vipcard .btn-main {
  //   min-height: 14px;
  //   width: 50px;
  // }

  .profile .avatar {
    max-width: 50px;
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
}

@media (max-width: 380px) {
  .acct-nav {
    .acct-menu {
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
    }
  }

  .acct-nav .acct-menu a .acct-nav-item img {
    height: 32px;
  }
}
</style>
