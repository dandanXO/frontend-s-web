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
    <div class="download-page-container">
      <div class="download-block">
        <div class="download-group-container">
          <div class="download-icon">
            <img :src="require('../../assets/download/iphone-dark.png')" />
          </div>
          <div class="download-device-text">iPhone</div>

          <div class="download-app-download">
            <a href="https://p4w.app/" target="_blank">
              <img src="../../assets/download/app-download.png" />
            </a>
          </div>
        </div>
        <div class="download-group-container">
          <div class="download-icon">
            <img :src="require('../../assets/download/android-dark.png')" />
          </div>
          <div class="download-device-text">Android</div>

          <div class="download-app-download">
            <a href="https://p4w.app/" target="_blank">
              <img src="../../assets/download/app-download.png" />
            </a>
          </div>
        </div>
      </div>

      <div class="download-image-block">
        <div class="download-image">
          <img src="../../assets/download/bottom-image.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  loadingClaim: {
    type: Boolean,
    default: false
  },
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
  background: url(../../assets/images/promotion/hotpromo/p4wapp/bg.png) no-repeat center center;
  min-height: 100vh;
  background-size: cover;
  .app-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }
  }
  .claim-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    .claimimg {
      width: 100%;
      padding: 18%;
      margin: -18%;
      margin-top: -10%;
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

      &:active {
        //opacity: 0.9;
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }
    }
    img {
      width: 180px;
    }
  }

  .rules-box {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 30px;
    margin-right: 20px;
    margin-top: 50px;
    margin-bottom: 50px;
    color: #fff;
  }

  .event-rules {
    max-width: 1480px;
    width: 90%;
    margin: 60px auto;
    .rule-title {
      font-family: Poppins Bold;
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
    }
  }
}
.download-page-container {
  display: flex;
  flex-direction: column;
}
.header-title {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 10px;

  img {
    width: 211px;
    height: 42px;
  }
}

.description-text {
  display: flex;
  width: 100%;
  padding: 1.5rem;
  color: #83a3ca;
  font-weight: 500;
  font-size: 14px;
  line-height: 16.8px;
}

.download-block {
  display: flex;
  width: 95%;
  gap: 20px;
  flex-wrap: wrap;
  margin: 0 auto;
  justify-content: space-evenly;
  align-items: center;
}
.download-group-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.download-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  img {
    height: 100%;
  }
}
.download-device-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter Medium";
  font-weight: 500;
  font-size: 14px;
  line-height: 16.8px;
  color: #ffffff;
}
.download-app-download {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.download-image-block {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  position: relative;
  width: 100%;
  transition: transform 5s ease;
}
.download-image {
  display: flex;
  padding-top: 2rem;
  width: 100%;
  justify-content: center;
  img {
    width: 100%;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
