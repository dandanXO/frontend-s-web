<template>
  <div class="video-wrapper">
    <div class="video-container">
      <!-- :src="getVideoUrl(media)" -->
      <!-- <pre>{{ media }}</pre> -->
      <iframe
        :src="getVideoUrl(media)"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

const props = defineProps(["media"]);

const mediaSettingsData = ref([]);

const displayUrlMap = {
  HOMEPAGE: "/home",
  PROMO_PAGE: "/promo",
  DEPOSIT_PAGE: "/deposit",
  WITHDRAW_PAGE: "/withdraw",
  PERSONAL_CENTRE: "/account/profile"
};

const getVideoUrl = (media) => {
  if (media) {
    let url = media;
    const autoplay = media.autoplay === "ON" ? "1" : "0";
    const mute = autoplay === "1" ? "1" : "0"; // Mute the video if autoplay is enabled

    // Transform the URL to the proper YouTube embed URL
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/")[3]?.split("?")[0];
    if (videoId) {
      url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
    }
    return url;
  }
  return "";
};

const route = useRoute();

const filteredMediaSettings = computed(() => {
  if (mediaSettingsData.value) {
    return mediaSettingsData.value.filter((media) => {
      return displayUrlMap[media.displayUrl] === route.path;
    });
  }
  return [];
});

onMounted(() => {
  // loadMediaSettings();
});
</script>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
}

.video-container {
  position: relative;
  aspect-ratio: 16 / 9;
  max-width: 100%;
  background: #000;
  margin-bottom: 20px;
  height: 300px;
  width: 100%;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-container p {
  color: #fff;
  text-align: center;
  margin-top: 10px;
}
</style>
