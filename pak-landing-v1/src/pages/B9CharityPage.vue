<template>
  <div>
    <MainTabComponent v-if="!isLoading" :tab-data="tabData"></MainTabComponent>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { strapi } from "boot/axios";
import MainTabComponent from "src/components/MainTabComponent.vue";

const tabData = ref(null);
const isLoading = ref(true);

onMounted(() => {
  strapi
    .get(
      "/api/b9-charity?populate[charityGallery][populate]=media&populate[bannerTop][populate]=media&populate[bannerMid][populate]=media&populate[bannerBtm][populate]=media"
    )
    .then((res) => {
      tabData.value = res.data;
    })
    .catch((e) => {})
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style scoped lang="scss"></style>
