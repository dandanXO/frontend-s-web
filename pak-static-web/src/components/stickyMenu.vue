<template>
  <div class="txt-center right-tools-wrapper">
    <div
      class="quick-item"
      @click.stop.prevent="
        openWindow(
          `https://csweb01.bcxu3ia8w.com/?partnerCode=Play4WinCS&lang=en&way=${regDevice}&token=${store.token}`,
          'Chat Server',
          350,
          650
        )
      "
    >
      <img src="../assets/images/common/customer-service.svg">
    </div>
  </div>
</template>

<script setup>
import { RiCustomerService2Fill } from "vue-remix-icons";

import { userStore } from "@/store";

import { getDevice } from "@/utils/utils";

const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";

const store = userStore();

const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
  var left = (screen.width - popupWinWidth) * 2;
  var top = (screen.height - popupWinHeight) / 4;

  window.open(
    pageURL,
    pageTitle,
    "resizable=yes, width=" +
      popupWinWidth +
      ", height=" +
      popupWinHeight +
      ", top=" +
      top +
      ", left=" +
      left
  );
};
</script>

<style scoped lang="scss">
.right-tools-wrapper {
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
  color: #fff;


  & > * {
    aspect-ratio: 1/1;
    width: 42px;
    cursor: pointer;
  }

  .quick-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0094FF3B;
    border-radius: 50%;
    width: 50px;
    height: 50px;

    svg {
      fill: $text-color;
      aspect-ratio: 1/1;
      width: 1.65rem;
    }
  }

  @media (max-width: 767px) {
    display: none;
  }
}
</style>
