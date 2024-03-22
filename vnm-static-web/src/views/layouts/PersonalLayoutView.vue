<template>
  <div class="account-container">
    <div class="account-container-wrap">
      <div class="account-box account-menu-wrapper">
        <account-menu />
      </div>
      <div class="account-content-wrapper">
        
        <!-- <div class="account-box account-contents"> -->
        <router-view />
        <!-- </div> -->
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
    const evips = store.evip ? JSON.parse(store.evip) : '';
    return {
      store,
      evips,
      isLoadingBalance,
      refreshBalance,
    };
  }
});
</script>

<style lang="scss">
.account-container {
  background-image: url("../../assets/images/home/main-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top center;
  font-size: 14px;
  padding: 20px;
  // background: #f4f8f9;
  //background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 188px);
  // background: salmon;
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
      // background-color: #fff;
      // box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
      // border-radius: 15px;
    }
    .account-menu-wrapper {
      width: 280px;
      padding-bottom: 0px;
    }
    .account-content-wrapper {
      text-align: left;
      width: calc(100% - 280px);
      display: flex;
      flex-direction: column;
      gap: 14px;
      .account-balance {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    padding: 20px 40px;
        background-color: #fff;
        box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
        border-radius: 15px;
        gap: 15px;

        .balance-details {
          display: flex;
          align-items: center;
        }

        .balance-container {
          gap: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          // border-right: 1px solid #2a313e;
          margin-right: 10px;
          padding: 5px 0px;
          .balance-txt {
            font-weight: 600;
            // color: #30a73b;
          }
          .trans-tip {
            width: 225px;
            font-size: 14px;
            color: $font-2;
          }
        }
      }
      .account-contents {
        // height: calc(100% - 50px);
        padding: 20px 40px;
        background: url(../../assets/images/account/bg.png)no-repeat center center;
        background-color: #fff;
        background-size: contain;
        box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
        border-radius: 15px;
        height: 100%;
      }
    }
    .account-menu-container {
      background-color: #fff;
      box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
      border-radius: 15px;
      height: 100%;

      .account-info-wrapper {
        text-align: center;
        width: 100%;
        background: linear-gradient(180deg, #8ec1ff 0%, #3981ff 100%);
        box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
        border-radius: 15px;
        position: relative;

        .account-info-bg {
          background-image: url(../../assets/images/account/personal-bg.png);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
          padding: 1.6rem 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 100%;
        }
      }
      .web-menu {
        .menu-box {
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
          padding: 20px 0 40px;
          .account-menu-item {
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            align-items: center;
            text-decoration: none;
            padding: 10px 20px 15px 10px;
            font-size: 1.125rem;
            color: $font-0;
            margin: 5px 10px;
            border-radius: 8px;
            transition: 0.3s all;

            img {
              height: 28px;
              width: 28px;
            }
            &:hover,
            &.router-link-exact-active {
              // background-color: $lightblue;
              color: $font-2;
              position: relative;
              font-weight: 600;

              // &:before {
              //   content: "";
              //   background-image: url(../../assets/images/account/menu-icon-active.png);
              //   background-repeat: no-repeat;
              //   position: absolute;
              //   top: 50%;
              //   transform: translateY(-50%);
              //   left: 0;
              //   width: 7px;
              //   height: 27px;
              // }
            }
          }
        }
      }
    }
  }
}
</style>
