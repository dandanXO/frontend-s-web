<template>
  <a-modal
    class="claimmodal"
    v-model:visible="isClaimModal"
    :footer="null"
    width="90%"
    :mask-closable="false"
    destroy-on-close
    centered
  >
    <div class="title">Login with courtesy</div>
    <div class="innercontents">
      <div class="claim">
        <div class="claimimg">
          <img src="../../assets/images/promotion/hotpromo/p4wredpacket/claimimg.png" />
        </div>
        <div class="claimtext">
          Login from 18:00 to 24:00 on 2/9
          <br />
          to receive red envelopes
        </div>
        <img
          @click="claimItem"
          class="claimbtn"
          src="../../assets/images/promotion/hotpromo/p4wredpacket/claimbtn.png"
        />
      </div>
    </div>
  </a-modal>
  <a-modal v-model:visible="privilegeClaimedModalVisible" centered>
    <div class="modal-div">
      <span class="img-item">
        <div class="inner-contents">
          <div class="amount">{{ amount }}</div>
          <div class="bonus">BONUS</div>
        </div>
      </span>
      <img src="../../assets/images/index/bonus.svg" />
    </div>
  </a-modal>
</template>
<script setup id="claimModal">
import { claimBonusItem } from "@/api/index/promo";
import { ref, defineExpose, nextTick } from "vue";
const isClaimModal = ref(false);
const openModal = (v) => {
  if (v === "close") {
    isClaimModal.value = false;
  } else {
    isClaimModal.value = true;
  }
};
const open = async () => {
  isClaimModal.value = true;
};
const privilegeClaimedModalVisible = ref(false);
const amount = ref(0);
const claimItem = () => {
  claimBonusItem("P4W-CNY-VIP-RED-PACKET")
    .then((res) => {
      if (res.code === 0) {
        amount.value = "$" + res.data;
        privilegeClaimedModalVisible.value = true;
        store.getBalance();
        isClaimModal.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
defineExpose({
  open
});
</script>
<style lang="scss">
.dark-theme {
  .ant-modal.claimmodal {
    .ant-modal-content {
      background: #15141a;
    }
  }
}
.ant-modal.claimmodal {
  max-width: 500px;
  .ant-modal-content {
    background: #ffffff;
    text-align: center;
    .title {
      font-family: "Poppins Bold";
      font-size: 30px;
    }
    .innercontents {
      display: flex;
      gap: 50px;
      .og-download-app-section {
        background: unset;
        .rgtside {
          display: none;
        }
      }
      .claim {
        width: 320px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 20px auto;
        gap: 30px;
        .claimtext {
          color: #83a3ca;
          font-family: "Poppins Medium";
          font-size: 20px;
        }
        // .claimimg {
        //   background: url(../../assets/images/promotion/hotpromo/p4wapp/shine.png) no-repeat center center;
        //   background-size: contain;
        //   padding: 50%;
        //   margin: -60% -60% -30% -60%;
        //   text-align: center;
        //   img {
        //     width: 80%;
        //     margin: 0 auto;
        //   }
        // }
        img {
          width: 80%;
        }
        .claimbtn {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
