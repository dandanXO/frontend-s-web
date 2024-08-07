<template>
    <div class="platform-menu-container">
      <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
      <template v-for="(item, index) in platformsListDisplay.slice(0, numberToShow)" :key="index">
        <!--      <router-link :to="`${props.platformName}?plat=${item.code}`">-->
        <div
          class="platform-menu-item"
          @click="gotoGame(item, platformType)"
          :class="item.underMaintenance === true ? 'maintenance' : ''"
        >
          <div class="maintenance-box" v-if="item.underMaintenance === true">
            <p>维护中</p>
            <p v-if="item.maintenanceStartTime && item.maintenanceEndTime" class="small-size">
              维护时间：
              <br />
              {{ moment(item.maintenanceStartTime).format("YYYY/MM/DD HH:mm") }}
              <br />
              -
              {{ moment(item.maintenanceEndTime).format("YYYY/MM/DD HH:mm") }}
            </p>
            <p class="small-size">请先前往其他场馆娱乐</p>
          </div>
  
          <div class="platform-menu-title" v-html="item.cnname" />
          <div class="platform-menu-caption" v-if="item.caption" v-html="item.caption" />
          <div class="platform-menu-img">
            <img
              :src="
                require(
                  '../../../assets/' +
                    props.platformType +
                    '/' +
                    props.platformType +
                    '-item-' +
                    item.code.toLowerCase() +
                    '-dark.png'
                )
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
  import { ref, onMounted } from "vue";
  import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
  import { userStore } from "@/store";
  import { useRouter } from "vue-router";
  import moment from "moment";
  
  const props = defineProps({
    platforms: Array,
    platformName: String,
    platformType: String,
    platformGameType: String
  });
  const emits = defineEmits(["load-game"]);
  const store = userStore();
  const platformsList = ref([]);
  const numberToShow = ref(5);
  const platformsListDisplay = ref([]);
  const getPlatformList = () => {
    const fetchFunction = store.token ? getLoggedInPlatformList : getPlatformListDisplay;
  
    fetchFunction().then((res) => {
      platformsList.value = res;
      platformsListDisplay.value = platformsList.value.filter((element) =>
        element.gameType.split(",").some((type) => type.trim().toUpperCase() === props.platformGameType.toUpperCase())
      );
  
      platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
        const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
        return { ...matchingItem, ...item1 };
      });
    });
  };
  
  // const filteredPlatforms = computed(() => {
  //   return props.platforms.filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code));
  // });
  
  const router = useRouter();
  const gotoGame = (item, platformType) => {
    // debugger;
    // console.log(platformType);
    if (platformType === "slot") {
      router.push(`/slot?plat=${item.code}`);
    } else {
      const platName = item.alias ?? item.cnname ?? item.name;
      emits("load-game", platName, item.code, item.gameCode);
      // emits("load-game", item);
    }
  };
  const checkWindowSize = () => {
    // console.log('resize');
    // Access and modify the ref here
    if (window.innerWidth < 1700) {
      numberToShow.value = 5;
    }
    if (window.innerWidth > 1700) {
      numberToShow.value = 6;
    }
    if (window.innerWidth > 1900) {
      numberToShow.value = 7;
    }
    if (window.innerWidth > 2000) {
      numberToShow.value = 10;
    }
  };
  
  onMounted(() => {
    getPlatformList();
    checkWindowSize();
  });
  </script>
  
  <style scoped lang="scss" src="../../../scss/pages/submenu.scss" />
  