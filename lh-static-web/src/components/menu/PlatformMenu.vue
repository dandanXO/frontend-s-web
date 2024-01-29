<template>
  <div class="platform-menu-container">
    <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
    <template v-for="(item, index) in platforms" :key="index">
      <div class="platform-menu-item">
        <div class="platform-menu-title" v-html="item.name" />
        <div class="platform-menu-caption" v-if="item.caption" v-html="item.caption" />
        <div class="platform-menu-img">
          <img
            :src="
              require('../../assets/' + props.platformType + '/' + props.platformType + '-item-' + item.image + '.png')
            "
          />
        </div>
        <div class="platform-menu-btn"><a>进入场馆</a></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";

const props = defineProps({
  platforms: Array,
  platformType: String,
  platformGameType: String
});

const store = userStore();
const platformsList = ref([]);
const platformsListDisplay = ref([]);
const getPlatformList = () => {
  const fetchFunction = store.memberType === "TEST" ? getLoggedInPlatformList : getPlatformListDisplay;

  fetchFunction().then((res) => {
    platformsList.value = res;
    platformsListDisplay.value = platformsList.value.filter((element) =>
      element.gameType.includes(props.platformGameType)
    );
  });
};

const filteredPlatforms = computed(() => {
  return props.platforms.filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code));
});

onMounted(() => {
  getPlatformList();
});
</script>

<style scoped lang="scss" src="../../scss/pages/submenu.scss" />
