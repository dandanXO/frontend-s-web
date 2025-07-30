<template>
  <div>
    <div v-for="(img, index) in images" :key="index" @click="openDialog(index)">
      <img :src="img" width="100%" style="cursor: zoom-in" />
    </div>

    <q-dialog v-model="dialog" persistent full-width full-height>
      <q-card flat class="bg-black column items-center justify-center q-pa-md" style="height: 100vh">
        <q-btn icon="close" flat round color="white" class="self-end q-mb-sm" @click="dialog = false" />
        <img :src="selectedImg" class="zoomable" style="max-width: 100%; max-height: 90vh" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dialog = ref(false);
const selectedImg = ref("");

const images = [
  new URL("./../../../assets/images/promotion/hotpromo/become-an-agent/agent-img-01.png", import.meta.url).href,
  new URL("./../../../assets/images/promotion/hotpromo/become-an-agent/agent-img-02.png", import.meta.url).href,
  new URL("./../../../assets/images/promotion/hotpromo/become-an-agent/agent-img-03.png", import.meta.url).href
];

const openDialog = (index) => {
  selectedImg.value = images[index];
  dialog.value = true;
};
</script>

<style scoped>
.zoomable {
  touch-action: none;
  transition: transform 0.2s ease;
}
</style>
