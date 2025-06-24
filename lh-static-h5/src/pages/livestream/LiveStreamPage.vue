<template>
  <div class="livestream-page-container" :class="$q.dark.isActive ? 'dark' : 'white'">
    <div class="livestream-page-header-wrapper">
      <div class="livestream-page-header-inner">
        <q-tabs v-model="moduleTab" class="livestream-page-header__module-tabs">
          <q-tab class="livestream-page-header__module-tab-item" name="livestream" label="赛事直播" />
          <q-tab class="livestream-page-header__module-tab-item" name="competition" label="赛程" />
        </q-tabs>
      </div>
    </div>
    <q-tab-panels v-model="moduleTab" class="content-panels" animated keep-alive>
      <q-tab-panel class="content-panel" name="livestream">
        <livestreamList
          :livestream-list="liveStreamList"
          :is-loading="isLivestreamListLoading"
          @livestream-click="handleLivestreamClick"
        />
      </q-tab-panel>
      <q-tab-panel class="content-panel" name="competition">
        <hot-match-list v-model="selectedCompetitionType" :hot-matches @bet-click="handleBetClick" />
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <GameModal ref="gameRef" />
</template>

<script setup>
import { onMounted, ref, computed, reactive, watch, onUnmounted, onBeforeUnmount } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import GameModal from "components/modal/GameModal.vue";
import { userStore } from "stores/index";
import { isAndroid } from "boot/utils";
import { useRoute, useRouter } from "vue-router";
import { useNotify } from "src/hooks/notify";
import { useLocalStorage, useSessionStorage } from "@vueuse/core";
import { LocalStorage, SessionStorage } from "quasar";
import LivestreamList from "components/livestream/LivestreamList.vue";
import HotMatchList from "components/livestream/HotMatchList.vue";

const tabValue = ref("liveStream");
const hotMatches = ref([]);
const competitionTypes = ref([]);
const selectedCompetitionType = ref();

const moduleTab = ref("livestream");

const store = userStore();
const route = useRoute();
const router = useRouter();
const notify = useNotify();

const gameRef = ref();
const selectionContainerRef = ref();
const currentPage = ref(1);
const maxPage = ref(1);
const isLivestreamListLoading = ref(false);

const openGame = (gameName, code, gameCode) => {
  gameRef.value.open(gameName, code, gameCode);
};

const liveStreamList = ref([]);

const getLiveUrlList = () => {
  isLivestreamListLoading.value = true;
  api
    .post(`/opt-session/live/list`)
    .then((res) => {
      if (res.code === 0) {
        liveStreamList.value.push(...res.data.streamList);
        maxPage.value = res.data.pages;
        currentPage.value++;
      }
    })
    .finally(() => {
      isLivestreamListLoading.value = false;
    });
};

const handleLivestreamClick = (livestream) => {
  if (!livestream.liveStatus) {
    notify({
      message: "直播未开始",
      timeout: 500,
      type: "info"
    });
    return;
  }

  if (extensionState.value) {
    router.push({
      path: `${currentPath.value}/streamplayer`,
      query: { streamId: livestream.streamId, token: extensionToken.value }
    });
  } else {
    router.push({
      path: "/livestream/streamplayer",
      query: {
        streamId: livestream.streamId
      }
    });
  }
};

const handleListScroll = () => {
  const threshold = 50;
  const isBottom =
    selectionContainerRef.value.scrollHeight - selectionContainerRef.value.scrollTop <=
    selectionContainerRef.value.clientHeight + threshold;

  if (isBottom && currentPage.value < maxPage.value && !isLivestreamListLoading.value) {
    getLiveUrlList();
  }
};

const handleBetClick = (match) => {
  if (route.path === "/livestreampage") {
    handleAppBetClick(match.platformName, match.platformId, match.platformCode);
  } else {
    openGame(match.platformName, match.platformCode, match.gameCode);
  }
};

const handleAppBetClick = (platformName, platformId, platformCode) => {
  document.location.href = `app://to_platform?platformName=${platformName}&platformId=${platformId}&platformCode=${platformCode}`;
};

watch(selectionContainerRef, (val) => {
  if (!val) return;
  // selectionContainerRef.value.addEventListener("scroll", handleListScroll);
});

// extension
const currentPath = ref(route.path);
const extensionState = ref(false);
const extensionToken = ref("");

const checkExtension = () => {
  if (currentPath.value === "/livestreampage") {
    extensionToken.value = route.query.token;
    extensionState.value = true;
  }
};

const showLivestreamDetails = () => {
  // extension
  if (extensionState.value) {
    router.push({ path: currentPath.value, query: { token: extensionToken.value } });
    if (isAndroid()) {
      LocalStorage.set("TOKEN", extensionToken.value, 86400);
    } else {
      SessionStorage.set("TOKEN", extensionToken.value);
    }
    store.token = extensionToken.value;
  } else {
    // console.log("no extension");
  }
};

onMounted(() => {
  api.get("/platform-competition").then((res) => {
    if (res.code === 0) {
      const uniqueCompetitionTypes = Array.from(new Set(res.data.map(({ competitionType }) => competitionType)));
      competitionTypes.value = uniqueCompetitionTypes.reverse();
      if (uniqueCompetitionTypes.length > 0) {
        selectedCompetitionType.value = uniqueCompetitionTypes[1];
        // selectedCompetitionType.value = tabValue.value;
        hotMatches.value = res.data;
      }
    }
  });

  getLiveUrlList();
  checkExtension();
  showLivestreamDetails();
});

onUnmounted(() => {
  // if (selectionContainerRef.value) {
  //   selectionContainerRef.value.removeEventListener("scroll", handleListScroll);
  // }
});
</script>

<style lang="scss" scoped>
.livestream-page-container {
  height: calc(100vh - 64px);
  // padding-bottom: 20px;
}

.content-panels {
  background: transparent;
  height: 100%;
  padding-bottom: 64px;
  .content-panel {
    padding: 0 16px 20px;
  }
}
.white {
  background: url("../../assets/images/livestream/livestream-bg-light.png") no-repeat center center;
  background-size: 100% 100%;
  .hot-match-container {
    box-shadow: 0px -2.78px 2.78px 0px rgba(195, 212, 230, 1) inset, 0px 1.39px 0px 0px rgba(167, 194, 221, 1);
    margin: 8px 10px;
    border-radius: 8px;
  }
}

.livestream-page-header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
  background: url("../../assets/images/livestream/header-bg.png") no-repeat center center;
  background-size: 100% 100%;
  padding-top: env(safe-area-inset-top);

  .livestream-page-header-inner {
    padding-top: 20px;
    box-shadow: 0px -2.78px 2.78px 0px #c3d4e6 inset, 0px 1.39px 0px 0px #a7c2dd;
    .livestream-page-header__module-tabs {
      :deep(.q-tabs__content) {
        justify-content: center;
        margin-bottom: 6px;
      }
      .livestream-page-header__module-tab-item {
        min-height: unset;
        flex-grow: 0;
        color: #95a3c8;

        &.q-tab--active {
          color: #424f72;
        }

        :deep(.q-tab__label) {
          font-size: 1.2rem;
          font-weight: 600;
        }

        :deep(.q-tab__indicator) {
          left: calc(50% - 15px);
          right: unset;
          width: 30px;
          background-color: #329eff;
        }
      }
    }
  }
}

.dark {
  background: url("../../assets/images/livestream/livestream-bg-dark.png") no-repeat top center;
  background-color: #1a2338;

  .livestream-page-header-wrapper {
    background-image: url("../../assets/images/livestream/header-bg-dark.png");
    .livestream-page-header-inner {
      box-shadow: 0px 4px 4px 0px #00000040;

      .livestream-page-header__module-tabs {
        .livestream-page-header__module-tab-item {
          &.q-tab--active {
            color: #fff;
          }

          :deep(.q-tab__indicator) {
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
// .top-toggle-menu {
//   width: 100%;
//   padding: 6px;
//   background: transparent;
//   // background: #ffffff;
//   // box-shadow: 0px -1px 3.66px 0px #a2bff4 inset;
//   display: flex;
//   gap: 12px;

//   :deep(.q-btn-item) {
//     width: 100%;
//     padding-top: 8px;
//     padding-bottom: 8px;

//     &.bg-primary {
//       border-radius: 50px;
//       background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%) !important;
//     }
//   }

//   .float-stream {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
// }

.no-data {
  display: flex;
  justify-content: center;
  grid-column: 1 / span 2;
}
</style>
