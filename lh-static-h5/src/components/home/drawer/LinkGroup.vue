<template>
  <div class="link-group-wrapper">
    <linkable-button v-for="link in links" :key="link.href" :to="link.href" :login-needed="link.loginNeeded">
      <div class="link-content-wrapper">
        <img style="width: 20xp; height: 20px" :src="$q.dark.isActive ? link.iconDark : link.icon" />
        <span>{{ link.label }}</span>
      </div>
    </linkable-button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useSessionStorage } from "@vueuse/core";

import LinkableButton from "components/home/drawer/LinkableButton.vue";
import LinkCommunicationImg from "assets/images/home/link-communication.svg";
import LinkVipImg from "assets/images/home/link-vip.svg";
import LinkCustomerServiceImg from "assets/images/home/link-customer-service.svg";
import LinkCommunicationDarkImg from "assets/images/home/link-communication-dark.svg";
import LinkVipDarkImg from "assets/images/home/link-vip-dark.svg";
import LinkCustomerDarkServiceImg from "assets/images/home/link-customer-service-dark.svg";
import LinkCustomerService2Img from "assets/images/home/link-customer-service2.svg";
import LinkCustomerDarkService2Img from "assets/images/home/link-customer-service2-dark.svg";

const customService = useSessionStorage("CUSTOM_SERVICE", "");

const links = ref([
  {
    icon: LinkCustomerService2Img,
    label: "专属客服",
    href: "/promo?name=lh-official-gift",
    iconDark: LinkCustomerDarkService2Img,
    loginNeeded: true
  },
  { icon: LinkCommunicationImg, label: "消息中心", href: "/account/inbox", iconDark: LinkCommunicationDarkImg },
  { icon: LinkVipImg, label: "VIP特权", href: "/account/vip", iconDark: LinkVipDarkImg },
  { icon: LinkCustomerServiceImg, label: "联系客服", href: "/liveChat", iconDark: LinkCustomerDarkServiceImg }
]);
</script>
<style scoped lang="scss">
.link-group-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  a {
    width: 100%;
    &:active,
    &:hover {
      background-color: #4877f60d;
    }
  }
}

.link-content-wrapper {
  display: flex;
  gap: 16px;
  align-items: center;
  img {
    max-width: 20px;
  }
}
</style>
