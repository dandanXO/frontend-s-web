<template>
  <div class="slot-game-wrapper">
    <div class="slot-game-platform-wrapper">
      <button
        v-for="(platform, index) in displaySlotPlatforms"
        class="slot-game-platform-btn"
        :key="index"
        :disabled="!isPlatformLoaded"
        :class="{ active: selected === platform.code }"
        :style="{ 'background-image': getBtnBg(platform.code) }"
        @click="handlePlatformClick(platform)"
      >
        <span class="slot-game-platform-btn__text">{{ platform.code }}</span>
        <!--        <img-->
        <!--          v-if="platform.code.toLowerCase() === 'pt'"-->
        <!--          src="@/assets/images/home/new-ribbon-sm.svg"-->
        <!--          class="new-ribbon"-->
        <!--        />-->
      </button>
    </div>
    <div v-if="isLoading" class="slot-game-loading-wrapper">
      <q-spinner-hourglass :color="ui.themeColor" size="8em" />
    </div>
    <div v-else class="slot-game-game-wrapper">
      <a
        v-for="(game, index) in gameListData"
        class="slot-game-game-item"
        :key="index"
        @click="$emit('game-click', game.name, selected, game.code)"
      >
        <Transition name="in-view">
          <q-list>
            <q-img
              loading="lazy"
              :src="game.icon"
              :placeholder-src="game.default"
              fit="cover"
              spinner-color="white"
              position="50% 20%"
              style="border-radius: 10px; overflow: hidden"
            >
              <template v-slot:loading>
                <img :src="game.default" />
              </template>
            </q-img>
            <div class="slot-game-game-item__name">{{ game.name }}</div>
            <!-- <img
              class="slot-game-game-item__logo"
              :src="require(`../../../assets/images/home/slotEdition/${selected.toLocaleLowerCase()}-logo.png`)"
            /> -->
          </q-list>
        </Transition>
      </a>
      <router-link class="slot-game-game-item more-game" :to="{ path: '/slot', query: { platform: selected } }">
        <Transition name="in-view">
          <q-list>
            <q-img
              loading="lazy"
              src="../../../assets/images/home/slotEdition/more-game-img.png"
              fit="contain"
              spinner-color="white"
              position="50% 20%"
              style="border-radius: 10px; overflow: hidden; max-height: 78px"
            />

            <button>{{ $t("lang.slotEdition.moreGame") }}</button>
          </q-list>
        </Transition>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { Platform } from "quasar";
import { useLocalStorage } from "@vueuse/core";
import { api } from "src/boot/axios";
import { userStore } from "src/stores";
import { cached } from "src/boot/cache";
import { SLOT_PLATFORM_CACHE } from "src/constant/cache";
import { useUI } from "src/stores/ui";

const props = defineProps({
  slotPlatforms: Array
});

defineEmits(["game-click", "platform-click"]);

const store = userStore();
const ui = useUI();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;

const selected = ref("");
const selectedId = ref(-1);
const isLoading = ref(false);
const gameListData = ref([]);

const isPlatformLoaded = computed(() => !!props.slotPlatforms.length);
const displaySlotPlatforms = computed(() => (isPlatformLoaded.value ? props.slotPlatforms : SLOT_PLATFORM_CACHE));

const getBtnBg = (code) => {
  const transferredCode = code.toLowerCase();
  try {
    if (selected.value === code) {
      return `url(${require(`../../../assets/images/home/slotEdition/${transferredCode}-platform-icon-active.png`)})`;
    } else {
      return `url(${require(`../../../assets/images/home/slotEdition/${transferredCode}-platform-icon.png`)})`;
    }
  } catch (e) {
    if (selected.value === code) {
      return `url(${require("../../../assets/images/home/slotEdition/blank-platform-icon-active.png")})`;
    } else {
      return `url(${require("../../../assets/images/home/slotEdition/blank-platform-icon.png")})`;
    }
  }
};

const handlePlatformClick = (platform) => {
  selected.value = platform.code;
  selectedId.value = platform.id || -1;
  if (selectedId.value > -1) loadGameList();
};

const loadGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const code = selectedId.value;
  const gameType = "SLOT";
  const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
  var way = store.getDeviceType();

  isLoading.value = true;
  cached
    .get(key, () =>
      api
        .get("/platformGames", {
          params: { platformId: code, gameType: gameType, device: regDevice, way: way }
        })
        .then((res) => {
          if (res.code === 0) {
            isLoading.value = false;
            return res;
          }
        })
        .catch((err) => {
          isLoading.value = false;
        })
    )
    .then((res) => {
      res.forEach((element) => {
        element.default = require("../../../assets/images/games/aviator/default.png");
        element.icon = `${imgURL}/game/${element.icon}`;
      });
      gameListData.value = res.filter((_, index) => index < 8);
      isLoading.value = false;
    });
};

watch(
  () => props.slotPlatforms,
  (val) => {
    console.log(val);
    if (val.length) handlePlatformClick(val[0]);
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.slot-game-wrapper {
  width: calc(100% - 2rem);
  margin: 20px auto 20px;
  .slot-game-platform-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 64px);
    justify-content: space-between;
    gap: 10px 6px;
    margin-bottom: 1rem;
    .slot-game-platform-btn {
      position: relative;
      aspect-ratio: 1;
      border: none;
      background-size: contain;

      &.active {
        .slot-game-platform-btn__text {
          font-weight: 900;
          color: #fff;
        }
      }
      .slot-game-platform-btn__text {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.1rem;
        color: #6c7ba8;
      }
      .new-ribbon {
        position: absolute;
        right: -5px;
        top: -5px;
        width: 20px;
      }
    }
  }
  .slot-game-loading-wrapper {
    display: flex;
    justify-content: center;
  }
  .slot-game-game-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    .slot-game-game-item {
      display: block;
      padding: 4px;
      background-color: #fff;
      box-shadow: 0px 0px 3.78px 0px #0000001a;
      border-radius: 5px;
      margin-bottom: 4px;
      .slot-game-game-item__name {
        margin-bottom: 4px;
        padding-top: 3px;
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 1rem;
        color: #7a80a1;
        text-align: center;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }
      .slot-game-game-item__logo {
        max-height: 1rem;
      }
      &.more-game {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        .q-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 17px;
          button {
            background-color: #fff;
            border: none;
            border-radius: 11px;
            padding: 4px 10px;
            font-size: 0.75rem;
            font-weight: 600;
            line-height: 1rem;
            color: #73b2ff;
          }
        }
      }
      .q-img {
        aspect-ratio: 1/1;
      }
    }
  }
}
</style>
