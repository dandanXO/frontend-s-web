<template>
  <div class="account-container">
    <div
      class="account-container-wrap"
    >
      <div class="account-box account-menu-wrapper">
        <account-menu />
      </div>
      <div class="account-content-wrapper">
        <div class="account-box account-balance">
          
            
               <a @click="refreshBalance" class="balance-container">
                  <span>账户余额：</span>
                  <div class="balance-txt"><span v-if="isLoadingBalance">Loading...</span><span v-if="!isLoadingBalance">￥{{ store.balance }}</span></div>
                  <el-icon><Refresh /></el-icon>
                 <div class="trans-tip">（游戏前，请将余额转到相应场馆）</div>
              </a>
专属网址: https://www.xf882.com
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
  .account-container-wrap {
    width: 100%;
    max-width: $maxwidth;
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
    align-items: stretch;
    gap: 20px;
    color: #a0bcd6;
    .account-box {
      background-color: #1d212e;
      box-shadow: 0 5px 8px 0 rgb(0 0 0 / 25%);
      border-radius: 3px;
    }
    .account-menu-wrapper {
      width: 225px;
      padding-top: 20px;
      padding-bottom: 30px;
    }
    .account-content-wrapper {
      text-align: left;
      width: calc(100% - 225px);
      display: flex;
      flex-direction: column;
      gap: 20px;
      .account-balance {
          font-size: 14px;
        height: 100px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 40px;
        .balance-container {
          gap: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid #2a313e;
          margin-right: 10px;
          padding: 5px 0px;
        .balance-txt {
          color:#30a73b;
        }
        .trans-tip {
          color: #436aa0;
        }
        }
      }
      .account-contents {
        height: calc(100% - 50px);
        padding: 20px 40px;
      }
    }
    .account-menu-container {
      .account-info-wrapper {
        width: 100%;
      }
      .web-menu {
        .account-menu-title {
          text-align: left;
          padding: 20px 30px;
          margin-top: 50px;
          color: #a0bcd6;
        }
        .account-menu-list {
          margin: 0;
          .account-menu-item {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            text-decoration: none;
            color: #a0bcd6;
            padding: 15px 40px 15px 10px;
              border-left: 4px solid transparent;
            svg {
              height: 20px;
              fill: #3d4b66;
            }
            &:hover, &.router-link-exact-active {
              border-left: 4px solid #45fdfb;
              background-image: linear-gradient(90deg,#2d4551 0,#2a313e 100%);
              color: #ffffff;
              svg {
                fill: #45fdfb;
              }
            }
          }
        }
      }
    }
  }

}
</style>
