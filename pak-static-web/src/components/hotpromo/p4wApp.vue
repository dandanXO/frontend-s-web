<template>
  <div class="p4w-app">
    <!-- <div class="app-banner">
      <img src="../../assets/images/promotion/hotpromo/p4wapp/banner.png" />
    </div> -->
    <div class="claim-section">
      <div class="claimimg">
        <img src="../../assets/images/promotion/hotpromo/p4wapp/claimimg.png" />
      </div>
      <img
        class="claim-btn"
        @click="$emit('claim-slot')"
        src="../../assets/images/promotion/hotpromo/p4wapp/claimbtn.png"
      />
    </div>
    <div class="rules-box">
      <div v-html="props.pageContent"></div>
      <!--      <div class="rule-title">Activity rules</div>-->
      <!--      <p>App download reward contents 88P, Withdraw requires turnover 10X.</p>-->
      <!--      <p>Each player can only claim it once.</p>-->
      <!--      <p>-->
      <!--        Members must complete KYC and the account name, real name, identification number, contact number, bank card-->
      <!--        information, E-wallet information and IP registered can not be duplicated with other play4win member-->
      <!--        information.-->
      <!--      </p>-->
    </div>
    <DownloadApp />
  </div>
</template>
<script setup>
import DownloadApp from "@/components/DownloadApp";
const props = defineProps({
  promoCode: {
    type: String,
    default: null
  },
  pageContent: {
    type: String,
    required: false
  }
});
</script>
<style lang="scss">
.p4w-app {
  background: url(../../assets/images/promotion/hotpromo/p4wapp/bg.jpg) no-repeat center bottom;
  padding: 20px;
  min-height: 100vh;
  background-size: cover;
  .app-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 90vw;
    }
  }
  .claim-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    .claimimg {
      width: 45%;
      padding: 10%;
      margin: -10%;
      margin-top: 5%;
      // margin-top: -18%;
      background: url(../../assets/images/promotion/hotpromo/p4wapp/shine.png) no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80%;
      }
    }
    .claim-btn {
      cursor: pointer;
    }
    img {
      width: 200px;
    }
  }

  .rules-box {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 30px;
    margin-right: 20px;
    margin-top: 60px;
    margin-bottom: 60px;
    color: #fff;
  }

  .event-rules {
    max-width: 1480px;
    width: 90%;
    margin: 60px auto;
    .rule-title {
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 10px;
    }
    p {
      color: #83a3ca;
      position: relative;
      padding-left: 20px;
      &:before {
        content: "";
        width: 8px;
        height: 8px;
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        position: absolute;
        transform: rotateZ(45deg);
        left: 0px;
        top: 5px;
      }
    }
  }
  .og-download-app-section {
    background: unset;
    .leftside {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .rgtside {
      display: none;
    }
    h2 {
      color: #ffffff;
    }
    .og-qr-phone .is-light {
      display: none;
    }
    .og-qr-phone .is-dark {
      display: block;
    }
  }
}
.dark-theme {
  .p4w-app {
    .event-rules {
      .rule-title {
        color: #ffffff;
      }
    }
    .og-download-app-section {
      background: unset;
      .og-qr-phone .is-light {
        display: none;
      }
      .og-qr-phone .is-dark {
        display: block;
      }
    }
  }
}
</style>
