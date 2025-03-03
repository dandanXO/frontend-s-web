<template>
  <div class="account-container">
    <div class="account-container-wrap">
      <div class="account-box account-menu-wrapper">
        <account-menu />
      </div>
      <div class="account-content-wrapper">
        <div class="account-box account-balance">
          <a @click="refreshBalance" class="balance-container">
            <div>
              <span>账户余额：</span>
              <span class="trans-tip">（游戏前，请将余额转到相应场馆）</span>
            </div>
            <div class="bal">
              <div class="balance-txt">
                <span v-if="isLoadingBalance">Loading...</span>
                <span v-if="!isLoadingBalance">￥{{ store.balance }}</span>
              </div>
              <el-icon><Refresh /></el-icon>
            </div>
          </a>
          <div class="forever-web">
            <span>专属网址：</span>
            <span id="vipUrl" class="badge badge-info">{{ store.evip.web }}</span>
          </div>
        </div>
        <div class="account-box account-contents">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, ref } from "vue";
import AccountMenu from "@/components/account/AccountMenu.vue";
import "@/scss/account.scss";
import { userStore } from "@/store";
import { Refresh } from '@element-plus/icons-vue'

export default defineComponent({
  name: "PersonalLayoutView",
  components: {
    AccountMenu,
    Refresh
  },
  setup() {

    const isLoadingBalance = ref(false)
    const refreshBalance = () => {
      isLoadingBalance.value = true;
      store.getBalance().then(() => {
        isLoadingBalance.value = false;
      })
    };
    const store = userStore();
    return {
      store,
      isLoadingBalance,
      refreshBalance,
    };
  }
});
</script>

<style lang="scss">
.account-container {
  font-size: 14px;
  padding: 20px;
  background: #141414;

  .account-container-wrap {
    width: 100%;
    max-width: $maxwidth;
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
    align-items: stretch;
    gap: 20px;
    color: #b8b8b8;

    .account-box {
      // background-color: #1d212e;
      background: #1b1b1c;
      box-shadow: 0 5px 8px 0 rgb(0 0 0 / 25%);
      border-radius: 12px;
    }
    .account-menu-wrapper {
      width: 260px;
      padding-top: 20px;
      padding-bottom: 30px;
    }
    .account-content-wrapper {
      text-align: left;
      width: calc(100% - 260px);
      display: flex;
      flex-direction: column;
      gap: 20px;
      .account-balance {
        font-size: 14px;
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        .balance-container {
          gap: 10px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
          margin-right: 10px;
          color: #b8b8b8;
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 600;
          padding: 20px 0px;
          .bal {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .balance-txt {
            color: #ffffff;
            font-size: 20px;
          }
          .trans-tip {
            color: #b8b8b8;
          }
          svg {
            color: #32ceed;
          }
        }
      }
      .forever-web {
        color: #ffffff;
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        background: url(../../assets/images/account/foreverwebbg.png) no-repeat center center;
        background-size: contain;
        padding: 15px 60px 15px 15px;
      }
      .account-contents {
        height: calc(100% - 50px);
        padding: 20px;
        position: relative;
      }
    }
    .account-menu-container {
      .account-info-wrapper {
        width: 100%;
        .account-avatar {
          border-radius: 50%;
          width: 63px;
          height: 63px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          margin: 10px auto;
          align-items: center;
          img {
            width: 100%;
          }
        }
        .account-name {
          color: #b8b8b8;
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 600;
          line-height: 22.4px;
          .vipbg {
            font-family: Arial Narrow;
            font-size: 10px;
            font-style: italic;
            font-weight: 700;
            line-height: 10px;
            background: url(../../assets/images/account/viplinebg.png) no-repeat center center;
            background-size: contain;
            padding: 0px 10px 0px 24px;
          }
        }
      }
      .web-menu {
        .account-menu-title {
          text-align: left;
          padding: 20px 30px;
          margin-top: 50px;
          color: #b8b8b8;
        }
        .account-menu-list {
          display: flex;
          gap: 10px;
          justify-content: space-between;
          align-items: center;
          width: 90%;
          margin: 20px auto;
          border-bottom: 1px solid #ffffff1a;
          padding: 10px 0 30px 0;
          .account-menu-item {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            text-decoration: none;
            color: #b8b8b8;
            gap: 10px;
            font-size: 12px;

            svg,
            .sideicon {
              fill: #32ceed;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              padding: 10px;
              background: #141414;
            }
            .sideicon {
              display: flex;
              &.hover {
                display: none;
              }
            }
            &:hover,
            &.router-link-exact-active {
              color: #ffffff;
              font-weight: 600;
              svg,
              .sideicon {
                fill: #ffffff;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                padding: 10px;
                background: linear-gradient(180deg, #32ceed 0%, #1c7587 100%);
              }
              .sideicon {
                display: none;
                &.hover {
                  display: flex;
                }
              }
            }
          }
        }
        .account-menu-last {
          display: flex;
          width: 90%;
          margin: 20px auto;
          flex-direction: column;
          font-family: PingFang SC;
          font-size: 14px;
          gap: 5px;
          .account-menu-item {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            gap: 20px;
            align-items: center;
            text-decoration: none;
            color: #b8b8b8;
            border-radius: 8px;
            padding: 10px 60px;

            svg {
              height: 20px;
              fill: #b8b8b8;
            }
            .sideicon {
              display: flex;
              &.hover {
                display: none;
              }
            }
            &:hover,
            &.router-link-exact-active {
              font-weight: 600;
              color: #32ceed;
              background: #242425;
              svg {
                fill: #45fdfb;
              }
              .sideicon {
                display: none;
                &.hover {
                  display: flex;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
