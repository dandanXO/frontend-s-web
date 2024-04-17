<template>
  <div class="link-group-wrapper">
    <linkable-button v-for="link in links" :key="link.href" :to="link.href">
      <div class="link-content-wrapper">
        <img :src="link.icon" />
        <span>{{ link.label }}</span>
      </div>
    </linkable-button>
  </div>
</template>
<script setup>
import { ref } from "vue";

import LinkableButton from "components/home/drawer/LinkableButton.vue";
import LinkCommunicationImg from "assets/images/home/link-communication.png";
import LinkVipImg from "assets/images/home/link-vip.png";
import LinkCustomerServiceImg from "assets/images/home/link-customer-service.png";

const links = ref([
  { icon: LinkCommunicationImg, label: "消息中心", href: "/account/inbox" },
  { icon: LinkVipImg, label: "VIP特权", href: "/account/vip" },
  { icon: LinkCustomerServiceImg, label: "联系客服", href: "/liveChat" }
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
}
</style>
