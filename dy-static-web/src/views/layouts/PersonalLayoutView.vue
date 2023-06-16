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
              专属网址: <el-tag color="#37cde6" effect="dark">https://www.xf882.com</el-tag>
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
  background: #f4f8f9;
  .account-container-wrap {
    width: 100%;
    max-width: $maxwidth;
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
    align-items: stretch;
    gap: 20px;
    color: #000000;
    .account-box {
      
    }
    .account-menu-wrapper {
      width: 225px;
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
        height: 80px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 40px;
        background-color: #fff;
        box-shadow: 0 5px 8px 0 rgba(206,223,227,.25);
        border-radius: 3px;
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
          width: 225px;
    font-size: 12px;
          color: #3d4b66;
        }
        }
      }
      .account-contents {
        height: calc(100% - 50px);
        padding: 20px 40px;
        background-color: #fff;
        box-shadow: 0 5px 8px 0 rgba(206,223,227,.25);
        border-radius: 3px;
      }
    }
    .account-menu-container {
      .account-info-wrapper {
        text-align: center;
        padding: 1.6rem 1rem;
        width: calc(100% - 2rem);
        background-color: #fff;
        box-shadow: 0 5px 8px 0 rgba(206,223,227,.25);
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }
      .web-menu {
        .menu-box {
          background-color: #fff;
          box-shadow: 0 5px 8px 0 rgba(206,223,227,.25);
          border-radius: 3px;
          padding-top: 1rem;
          margin-top: 20px;
          width: 100%;
        }
        .account-menu-title {
          padding-left: 20px;
          display: block;
          height: 28px;
          font-size: 16px;
          font-weight: 400;
          line-height: 30px;
          color: #707f9d;
          border-left: 5px solid #0e42db;
        }
        .account-menu-list {
          margin: 0;
          padding: 20px 0;
          .account-menu-item {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            text-decoration: none;
            color: #4a556c;
            padding: 10px 50px 15px 10px;
              border-left: 4px solid transparent;
            margin-left: -10px;
            padding-left: 10px;
            svg {
              height: 28px;
              fill: #3d4b66;
              &.pink {
                fill: #f789cf;
              }
              &.blue {
                fill: #00a9f2;
              }
              &.grey {
                fill: #4a556c;
              }
              &.green {
                fill: #74c8cb;
              }
              &.orange {
                fill: #f38046;
              }
            }
            &:hover, &.router-link-exact-active {
              // background-image: linear-gradient(90deg,#2d4551 0,#2a313e 100%);
                background: url(../../assets/common/hover.png)no-repeat;
                background-size: contain;
                background-position: -4px 2px;
                color: #d8e4ff;
              &:after {
              }
              color: #d8e4ff;
              svg {
                fill: #d8e4ff;
              }
            }
          }
        }
      }
    }
  }

}
</style>
