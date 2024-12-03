<template>
  <div class="game-item-div" :class="underMaintenance && 'maintenance-on'">
    <router-link class="game-board" :to="link" @click="onClick">
      <div class="game-img">
        <img :src="gameImage()" />
      </div>
      <div class="game-platform-img">
        <img :src="platformImage()" :alt="name" />
      </div>

      <div class="game-title">
        <h3 :class="title.length > 8 && 'small-size'">{{ title }}</h3>
        <div class="game-title-logo">
          <img :src="logoImage()" :alt="name" />
        </div>
        <q-btn class="game-btn" dense rounded>
          {{ underMaintenance ? "维护中" : "立即进入" }}
        </q-btn>
      </div>

      <!-- <div class="maintenance-box" v-if="underMaintenance"> -->
      <!-- <p>维护中</p> -->
      <!-- <template v-if="maintenanceStartTime && maintenanceEndTime">
          <div class="small-size q-mt-md">维护时间：</div>
          <p class="small-size">
            {{ formatTime(maintenanceStartTime) }}
          </p>
          <p class="small-size">-</p>
          <p class="small-size">
            {{ formatTime(maintenanceEndTime) }}
          </p>
        </template> -->
      <!-- </div> -->
    </router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";

// Props
const props = defineProps({
  title: String,
  name: String,
  code: String,
  icon: String,
  underMaintenance: Boolean,
  maintenanceStartTime: String,
  maintenanceEndTime: String,
  link: String,
  onClick: Function,
  item: Array // for testing. pls remove after done test
});

const router = useRouter();

// Fallback image paths
const defaultGameImage = require("../../assets/images/games/game-img.png");
const defaultLogoImage = require("../../assets/images/games/game-img.png");

// Computed images with error handling
const gameImage = () => {
  return require("../../assets/images/games/game-platform.png");
};

const platformImage = () => {
  try {
    return require(`../../assets/images/games/game-${props.icon.toLowerCase()}-${props.name.toLowerCase()}.png`);
  } catch (e) {
    return defaultGameImage;
  }
};
const logoImage = () => {
  try {
    return require(`../../assets/images/games/logo/plat_logo_${props.name.toLowerCase()}.png`);
  } catch (e) {
    return defaultLogoImage;
  }
};

// Format maintenance time
const formatTime = (time) => moment(time).format("YYYY/MM/DD hh:mm:ss A");
</script>

<style scoped>
/* Add any specific styling here */
</style>
