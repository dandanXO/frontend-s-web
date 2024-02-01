<template>
  <div class="platform-menu-container">
    <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
    <template v-for="(item, index) in platformsListDisplay" :key="index">
<!--      <router-link :to="`${props.platformName}?plat=${item.code}`">-->
        <div class="platform-menu-item"
             @click="gotoGame(item)"
        >
          <div class="platform-menu-title" v-html="item.name" />
          <div class="platform-menu-caption" v-if="item.caption" v-html="item.caption" />
          <div class="platform-menu-img">
            <img
              :src="
                require('../../assets/' +
                  props.platformType +
                  '/' +
                  props.platformType +
                  '-item-' +
                  item.name.toLowerCase() +
                  '.png')
              "
            />
          </div>
          <div class="platform-menu-btn"><a>进入场馆</a></div>
        </div>
<!--      </router-link>-->
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
const props = defineProps({
  platforms: Array,
  platformName: String,
  platformType: String,
  platformGameType: String
});
const emits = defineEmits(["load-game"]);
const store = userStore();
const platformsList = ref([]);
const platformsListDisplay = ref([]);
const getPlatformList = () => {
  const fetchFunction = store.token ? getLoggedInPlatformList : getPlatformListDisplay;

  fetchFunction().then((res) => {
    platformsList.value = res;
    platformsListDisplay.value = platformsList.value.filter((element) =>
      element.gameType.split(",").some((type) => type.trim().toUpperCase() === props.platformGameType.toUpperCase())
    );
  });
};

const filteredPlatforms = computed(() => {
  return props.platforms.filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code));
});


const router= useRouter();
const gotoGame = (item) => {
  // debugger;
  // debugger;
  console.log(item);
  if(item.gameType==='SLOT' || item.gameType === 'FISH'){
    router.push(`${props.platformName}?plat=${item.code}`);
  }else{

    emits('load-game', item)
    // emits("load-game", item);
  }

};
onMounted(() => {
  getPlatformList();
});
</script>

<style scoped lang="scss" src="../../scss/pages/submenu.scss" />
