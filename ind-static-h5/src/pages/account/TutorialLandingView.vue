<template>
  <div class="tutorial-container">
    <div class="tutorial-title q-mb-md"><img src="../../assets/images/account/tutorial-title.png" /></div>

    <video controls class="q-my-md" width="100%">
      <source :src="tutorialVideoUrl" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="btn-submit" @click="goBinance">Download Binance</div>

    <p class="q-mt-md">
      Please make sure you have completed identity verification and enabled at least one two-factor authentication (2FA)
      device, such as Google Authenticator.
    </p>

    <div class="list-container">
      <div class="tutorial-list-title">
        <p>
          <strong><span>1. On the official Binance website, click [Trade] - [P2P].</span></strong>
        </p>
      </div>

      <div class="q-mb-sm">
        <img
          src="../../assets/images/account/tutorial-img-01.png"
          width="100%"
          @click="showImage('tutorial-img-01.png')"
        />
      </div>
      <p>
        You may use
        <span>[Express]</span>
        or
        <span>[P2P]</span>
        mode to trade.
      </p>

      <p>
        <strong><span>1. Express Mode</span></strong>
      </p>
      <p>
        <span>1.1</span>
        Click
        <span>[Express]</span>
        to enter the Express trading mode. Select the crypto you want to buy or enter the amount you want to pay with.
        Let’s take buying USDT as an example.

        <br />
        Click
        <span>[Buy USDT]</span>
        .
        <br />
        The orders are matched based on the best crypto price available in the P2P markets.
      </p>
      <p>
        <span>1.2.</span>
        Select your preferred payment method and click
        <span>[Confirm Purchase]</span>
      </p>

      <div class="tutorial-list-title">
        <p>
          <strong><span>2. P2P Mode</span></strong>
        </p>
      </div>

      <p>
        Alternatively, you can also choose [P2P] mode to trade, and manually select advertisements posted by users or
        merchants. Buying USDT as an example.
      </p>

      <p>
        <span>2.1.</span>
        Click
        <span>[Buy]</span>
        , and choose the fiat currency you want to pay with. Select the cryptocurrency you want to purchase. Please pay
        attention to the available quantity and limit for each ad.
        <br />
        Then, select the seller you want to buy from, and click
        <span>[Buy USDT]</span>
        to place your order.
      </p>

      <div class="q-mb-sm">
        <img
          src="../../assets/images/account/tutorial-img-02.png"
          width="100%"
          @click="showImage('tutorial-img-01.png')"
        />
      </div>

      <p>
        <span>2.2.</span>
        Enter the quantity or amount you want to purchase. Please read the seller’s terms and conditions carefully
        before placing the order.
      </p>

      <p>
        <span>2.3.</span>
        Click
        <span>[Buy USDT]</span>
        to generate your order. By placing an order, the platform will immediately secure an equivalent amount of the
        seller's digital assets for the transaction.
      </p>

      <div class="q-mb-sm">
        <img
          src="../../assets/images/account/tutorial-img-03.png"
          width="100%"
          @click="showImage('tutorial-img-03.png')"
        />
      </div>

      <p>
        <span>2.4.</span>
        If you want to cancel the order, click
        <span>[Cancel Order]</span>
        . Please note that “Buy Crypto” will be suspended for the day if you cancel three orders within a day. Select
        the reason for canceling and click
        <span>[Confirm Cancelation]</span>
        .
      </p>

      <div class="q-mb-sm">
        <img
          src="../../assets/images/account/tutorial-img-04.png"
          width="100%"
          @click="showImage('tutorial-img-04.png')"
        />
      </div>

      <p>
        <span>2.5.</span>
        After the payment process is completed, select
        <span>[Transferred, Notify Seller]</span>
        and the order status will be changed to
        <span>[Releasing]</span>
        . The platform, having secured the equivalent digital assets from the seller, waits for the seller to confirm
        your offline payment. You may use the chat box on the right side to chat with the seller directly
      </p>

      <div class="q-mb-sm">
        <img
          src="../../assets/images/account/tutorial-img-05.png"
          width="100%"
          @click="showImage('tutorial-img-05.png')"
        />
      </div>

      <div class="q-mb-sm">
        <img
          src="../../assets/images/account/tutorial-img-06.png"
          width="100%"
          @click="showImage('tutorial-img-06.png')"
        />
      </div>

      <p>
        <span>2.6.</span>
        If you do not receive the cryptocurrency within the designated release time frame, you can click
        <span>[Appeal]</span>
        to contact Binance Customer Support agents for assistance. Important Note: You need to transfer the payment
        directly to the seller through a bank transfer or other third-party payment platforms based on the seller's
        payment information. If you have already transferred payment to the seller, do not click
        <span>[Cancel]</span>
        unless you have already received a refund from the seller in your payment account. Do not click
        <span>[Transferred, Notify Seller]</span>
        unless you have paid the seller.
      </p>
      <p>
        <span>2.7.</span>
        Upon successful verification, the seller will release the crypto to you and the transaction is considered
        completed. You can click
        <span>[View my balance]</span>
        to view the assets.
      </p>

      <div class="q-mb-sm">
        <img
          src="../../assets/images/account/tutorial-img-07.png"
          width="100%"
          @click="showImage('tutorial-img-07.png')"
        />
      </div>
    </div>
  </div>

  <q-dialog v-model="isImageDialogOpen" class="dialog-content">
    <div>
      <img :src="require(`../../assets/images/account/${zoomedImageSrc}`)" :style="{ width: `${zoomLevel * 100}%` }" />
    </div>
    <div class="controls">
      <q-btn icon="zoom_in" @click="zoomIn" flat />
      <q-btn icon="zoom_out" @click="zoomOut" flat />
      <q-btn icon="close" @click="closeDialog" flat />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";

const tutorialVideoUrl = ref(process.env.IMAGE_CDN + `/media/ind-deposit_guide.mp4`);
const isImageDialogOpen = ref(false);
const zoomedImageSrc = ref("");
const zoomLevel = ref(1);

const showImage = (imageName) => {
  zoomLevel.value = 1;
  isImageDialogOpen.value = true;
  zoomedImageSrc.value = imageName;
};

const zoomIn = () => {
  if (zoomLevel.value <  3) {
    zoomLevel.value += 0.3;
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 1) {
    zoomLevel.value -= 0.3;
  }
};

const closeDialog = () => {
  isImageDialogOpen.value = false;
};

const goBinance = () => {
  const randomParam = Math.random().toString(36).substring(2, 15);
  const url = `https://app1.conjlnuljy.com/BNApp64.apk?v=${randomParam}`;
  window.open(url, "_self");
};
</script>

<style lang="scss" scoped>
.tutorial-container {
  padding: 1rem;

  p {
    color: rgba(255, 255, 255, 0.6);

    span {
      color: #7f39f4;
    }
  }
}

.list-container {
  padding-left: 16px;
}

.tutorial-title {
  display: flex;
  justify-content: center;
  img {
    display: block;
    width: 100%;
    max-width: 300px;
  }
}

.tutorial-list-title {
  position: relative;
  &:before {
    content: "";
    position: absolute;
    background-image: url(../../assets/images/account/tutorial-ribbon.png);
    background-size: 100% 100%;
    width: 30px;
    height: 10px;
    right: calc(100% + 6px);
    top: 5px;
  }
}

.btn-submit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  height: 46px;
  width: 100%;
  max-width: 220px;
  transition: 0.3s all;
  color: #ffffff;
  margin: auto;
  border-radius: 6px;
  background: #5c46e7;
  aspect-ratio: 335/46;
  cursor: pointer;
  text-decoration: none;

  &:before {
    box-shadow: none;
  }

  &.disabled {
    opacity: 0.7;
  }
}

.dialog-content {
  position: relative;
  text-align: center;
  overflow: auto;
  max-height: 90vh;
  max-width: 90vw;

  .img {
    cursor: grab;
    transition: width 0.2s;
  }
}

.controls {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
}
</style>
