<template>
  <div>
    <MainTabComponent v-if="!isLoading" :tab-data="tabData"></MainTabComponent>
    <q-inner-loading v-else :showing="isLoading" />
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
      "/api/event-sponsorship?populate[charityGallery][populate]=media&populate[bannerTop][populate]=media&populate[bannerMid][populate]=media&populate[bannerBtm][populate]=media"
    )
    .then((res) => {
      tabData.value = res.data.attributes;
    })
    .catch((e) => {})
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style scoped lang="scss"></style>
