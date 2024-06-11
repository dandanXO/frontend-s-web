<template>
  <div class="p4w-redpacket">
    <div class="app-banner">
      <img src="../../assets/images/promotion/hotpromo/p4wredpacket/banner.png" />
    </div>
    <div class="claim-section">
      <div class="claimimg">
        <img src="../../assets/images/promotion/hotpromo/p4wredpacket/claimimg.png" />
      </div>
      <img
        class="claim-btn"
        @click="$emit('claim-slot')"
        src="../../assets/images/promotion/hotpromo/p4wredpacket/claimbtn.png"
      />
    </div>
    <div class="event-rules">
      <div class="rule-title">Activity rules</div>
      <p>Offical government licenseGood user reputationExcellent product experience</p>
      <p>
        The account name, contact number, the bank card and E-wallet binded to the active member cannot be duplicated.
      </p>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss">
.p4w-redpacket {
  background: url(../../assets/images/promotion/hotpromo/p4wredpacket/bg.jpg) no-repeat center center;
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
      width: 40%;
      padding: 8%;
      margin: -8%;
      margin-top: -18%;
      background: url(../../assets/images/promotion/hotpromo/p4wredpacket/shine.png) no-repeat center center;
      background-size: contain;
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
      width: 14vw;
    }
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
  }
}
.dark-theme {
  .p4w-redpacket {
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
</style>
