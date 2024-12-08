<template>
  <div class="asean-container">
    <router-link to="/promotion?name=trotaidudoan-asean2024"  @click="handlePromoClick('trotaidudoan-asean2024')">
      <img src="@/components/hotpromo/aseanM2024/img/1.png">
    </router-link>
    <router-link to="/promotion?name=dudoan-asean2024">
      <img src="@/components/hotpromo/aseanM2024/img/2.png"  @click="handlePromoClick('dudoan-asean2024')">
    </router-link>
    <router-link to="/promotion?name=baohiemvon-20%asean"  @click="handlePromoClick('baohiemvon-20%asean')">
      <img src="@/components/hotpromo/aseanM2024/img/3.png">
    </router-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handlePromoClick = (promoName) => {
  router.push({ path: '/promotion', query: { name: promoName } }).then(() => {
    location.reload();
  });
};
</script>
<style lang="scss">
  .asean-container {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 1050px;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 auto;
    a {
      width: 49%;
      display: block;
    }
    img {
      width: 100%;
      display: block;
    }
  }
</style>