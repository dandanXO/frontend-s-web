<template>
  <div class="b9-style-container">
    <div v-if="!isLoading" class="row">
      <div v-for="item in arr" :key="item.id" class="col-4">
        <iframe
          width="100%"
          :src="item.videoUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { strapi } from "boot/axios";

const arr = ref([]);
const isLoading = ref(true);

onMounted(() => {
  strapi
    .get("/api/b9-styles")
    .then((res) => {
      arr.value = res.data;
    })
    .catch((e) => {})
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style scoped lang="scss">
.b9-style-container {
  height: calc(100vh - 182px);
  .row {
    line-height: 0;
  }
  iframe {
    border: none;
    box-sizing: border-box;
  }
}
</style>
