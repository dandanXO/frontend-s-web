<template>
  <a-modal
    class="appmodal"
    v-model:visible="isAppModal"
    :footer="null"
    width="90%"
    :mask-closable="false"
    destroy-on-close
    centered
  >
    <div class="title">APP download gift</div>
    <div class="innercontents">
      <DownloadApp />
      <div class="claim">
        <div class="claimimg">
          <img src="../../assets/images/promotion/hotpromo/p4wapp/claimimg.png" />
        </div>
        <img @click="claimItem" class="claimbtn" src="../../assets/images/promotion/hotpromo/p4wapp/claimbtn.png" />
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
<script setup id="appModal">
import DownloadApp from "@/components/DownloadApp";
import { claimBonusItem } from "@/api/index/promo";
import { ref, defineExpose, nextTick } from "vue";
const isAppModal = ref(false);
const openModal = (v) => {
  if (v === "close") {
    isAppModal.value = false;
  } else {
    isAppModal.value = true;
  }
};
const open = async () => {
  isAppModal.value = true;
};
const privilegeClaimedModalVisible = ref(false);
const amount = ref(0);
const claimItem = () => {
  claimBonusItem("P4W-DOWNLOAD-BONUS")
    .then((res) => {
      if (res.code === 0) {
        amount.value = "$" + res.data;
        privilegeClaimedModalVisible.value = true;
        store.getBalance();
        isAppModal.value = false;
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
  .ant-modal.appmodal {
    .ant-modal-content {
      background: #15141a;
    }
  }
}
.ant-modal.appmodal {
  max-width: 1000px;
  .ant-modal-content {
    background: #ffffff;
    .title {
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
        .claimimg {
          background: url(../../assets/images/promotion/hotpromo/p4wapp/shine.png) no-repeat center center;
          background-size: contain;
          padding: 50%;
          margin: -60% -60% -30% -60%;
          text-align: center;
          img {
            width: 80%;
            margin: 0 auto;
          }
        }
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

.modal-div {
  width: 340px;
  position: relative;
  margin: 0 auto;
  .img-item {
    color: rgb(255, 255, 255);
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    top: 61%;
    text-align: center;
    .inner-contents {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  .amount {
    font-size: 60px;
    line-height: 65px;
  }
  .bonus {
    color: rgb(228, 0, 35);
    font-size: 35px;
    font-weight: bold;
    line-height: 38px;
  }
}
</style>
