<template>
  <div class="promo-container">
    <div class="promo">
      <template v-if="allLoading">
        <div class="q-pa-md q-gutter-y-md">
          <div class="loader" />
        </div>
      </template>

      <template v-else>
        <q-header v-if="!isPromoDetail">
          <q-card-section class="page-title">优惠活动</q-card-section>
        </q-header>

        <div class="tab-wrapper" v-if="!isPromoDetail">
          <RoundTab
            v-if="!isPromoDetail"
            v-model:tab="tab"
            :items="tabItems"
            :border-radius="50"
            background-color="#183249;"
          />
        </div>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
            <div class="all-promotions" v-if="!isPromoDetail">
              <div class="promo-main-container">
                <div class="promo-type-wrapper"></div>
                <div class="promo-list-wrapper">
                  <!-- data-aos="zoom-in"
                    data-aos-easing="ease-out"
                    data-aos-duration="1000" -->
                  <div v-for="(promo, i) in filteredArray" :key="i">
                    <div
                      class="promo-item"
                      v-if="tab.name === 'all' || promo.promoType.toLowerCase().split(',').includes(tab.name)"
                    >
                      <a @click="showPromoDetails(promo)">
                        <div class="promo-img-wrapper">
                          <div class="promo-bg">
                            <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                          </div>
                        </div>
                        <div v-if="promo.label" class="trapezium">
                          {{ promo.label }}
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="selected-promo">
              <div class="selected-promo-wrapper" :class="`bg__${selectedPromo.promoCode}`">
                <div class="banner-container" v-if="!isSpecialPromo">
                  <img
                    class="promo-content"
                    :src="imgURL + selectedPromo.mobileBannerUrl"
                    style="display: block; width: 100%"
                  />
                </div>
                <div class="inner" :class="isSpecialPromo ? 'special-promo' : ''">
                  <div v-if="selectedPromo.hasPromo">
                    <HotPromotion :list="selectedPromo" />
                  </div>
                  <div
                    v-if="selectedPromo.promoCode !== 'xf-eurocup-hongbao'"
                    :class="{
                      welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
                      sport: selectedPromo.promoType.toLowerCase() === 'sport',
                      eSport: selectedPromo.promoType.toLowerCase() === 'esport',
                      fish: selectedPromo.promoType.toLowerCase() === 'fish',
                      liveCasino: selectedPromo.promoType.toLowerCase() === 'live casino',
                      slot: selectedPromo.promoType.toLowerCase() === 'slot game'
                    }"
                  >
                    <div v-html="selectedPromo.pageContent"></div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDisplayLogin">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black text-center">
      <q-card-section class="q-mb-md">
        <strong>系统提示</strong>
        <br />
        <br />
        请登录后再操作
      </q-card-section>
      <router-link to="/login?redirect=/promo">
        <q-btn label="确认" color="brightbtn" />
      </router-link>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useLocalStorage } from "@vueuse/core";
import { api } from "boot/axios";
import LocalStorage from "boot/local-storage";
import { isAndroid } from "boot/utils";
import HotPromotion from "components/HotPromotion";
import RoundTab from "components/RoundTab.vue";
import { SessionStorage, useQuasar } from "quasar";
import { cached } from "src/boot/cache";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const store = userStore();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
const banner = ref([]);
const promoState = reactive({
  active: { value: "ALL", label: "ALL" },
  promoList: []
});
const promoTypes = ref([
  { code: "ALL", img: "all", label: "所有游戏" },
  { code: "ESPORTS", img: "esport", label: "电竞" },
  { code: "SPORTS", img: "sport", label: "体育" },
  { code: "POKER", img: "poker", label: "棋牌" },
  { code: "LIVE CASINO", img: "live", label: "真人娱乐" },
  { code: "FISH", img: "game", label: "老虎机/捕鱼" }
]);
const promoTabActive = ref(promoTypes.value[0].value);
const filteredArray = ref([]);
const isPromoDetail = ref(false);
const selectedPromo = ref({});
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const ui = useUI();
const isDisplayLogin = ref(false);
const isSpecialPromo = ref(false);

const modalVisible = ref(false);
const promoSrc = ref("");

const isFetchingPromo = ref(false);

// extension
const currentPath = ref(route.path);
const extensionState = ref(false);
const extensionToken = ref("");

const isAppPromo = ref(false);
const promoUrl = ref("https://" + store.evip);

const checkExtension = () => {
  if (currentPath.value === "/promotion") {
    // const eToken = ref(route.query.name);
    extensionToken.value = route.query.token;
    extensionState.value = true;
  }
};

const tab = ref("all");
const tabItems = ref([
  { name: "all", label: "全部" },
  { name: "slot game", label: "电子" },
  { name: "fish", label: "捕鱼" },
  { name: "live casino", label: "真人" },
  { name: "poker", label: "棋牌" }
]);

const loadGame = () => {
  if (promoSrc.value !== "") {
    logoShow.value = false;
  }
};

watch(
  () => route.query,
  () => {
    if (route.query === null) {
      isPromoDetail.value = false;
    } else {
      isPromoDetail.value = route.query.name;
      ui.setScrollPosition("vertical", 0, 200);
    }
  }
);

const loadBanner = () => {
  api.get("/opt-session/promo/banner?category=PROMO").then((response) => {
    if (response.code === 0) {
      banner.value = response.data[0];
    }
  });
};

const showPromoDetails = (promo) => {
  if (
    promo.promoCode === "cny-hongbaoyu" ||
    promo.promoCode === "xf-eurocup-hongbao" ||
    promo.promoCode === "cny-spinwheel" ||
    promo.redirectUrl === "cny-hongbaoyu" ||
    promo.redirectUrl === "xf-return-promo" ||
    promo.redirectUrl === "xf-deposit-award" ||
    promo.redirectUrl === "xf-eurocup-hongbao"
  ) {
    isSpecialPromo.value = true;
  } else {
    isSpecialPromo.value = false;
  }

  // debugger;
  if (extensionState.value) {
    if (promo.redirectUrl.includes("page-vip")) {
      router.push({ path: "/account/vip" });
    } else {
      isAppPromo.value = true;
      // appPromoUrl.value= promoUrl.value + "/promotion?name=" + promo.redirectUrl + "&token=" + extensionToken.value;
    }
    isPromoDetail.value = true;

    selectedPromo.value = promo;
    if (isAndroid()) {
      LocalStorage.set("TOKEN", extensionToken.value, 86400);
    } else {
      SessionStorage.set("TOKEN", extensionToken.value);
    }
    store.token = extensionToken.value;
  } else {
    if (promo.redirectUrl.includes("page-vip")) {
      router.push({ path: "/account/vip" });
    } else {
      if (isAndroid()) {
        // modalVisible.value= true;
        var preUrl = "https://" + store.h5Url + `/promotion?name=${promo.redirectUrl}&token=${store.token}`;
        // alert(preUrl);
        console.log(preUrl);
        // promoSrc.value= preUrl;
        var ref = cordova.InAppBrowser.open(preUrl, "_blank", "location=no,zoom=no,footer=no");

        ref.addEventListener("loadstart", function (event) {
          var url = event.url;
          // alert("This" + url);
          if (url.indexOf("xfapp:") > -1) {
            var message = url.split("xfapp:")[1];
            console.log("Message received from InAppBrowser: ", decodeURIComponent(message));
            // alert(message);
            ref.close();
            router.push(message);
          }
        });
      } else {
        if (route.query.fromAccount) {
          router.push({ path: "/promo", query: { name: promo.redirectUrl, fromAccount: true } });
        } else {
          router.push({ path: "/promo", query: { name: promo.redirectUrl } });
        }
        isPromoDetail.value = true;
        selectedPromo.value = promo;
      }
    }
  }
};

const getPromoLabel = (labelType) => {
  switch (labelType) {
    case 0:
      return "NEW 最新";
    case 1:
      return "HOT 热门";
    case 3:
      return "RECOMMEND 推荐";
    case 4:
      return "DAILY 日常";
    case 5:
      return "NEWBIE 新人";
    case 6:
      return "TIME 限时";
    default:
      return "";
  }
};

const switchPromoType = (type) => {
  promoTabActive.value = type.value;
  if (type.value !== "ALL") {
    filteredArray.value = promoState.promoList.filter(function (promo) {
      return promo.promoType.toLowerCase().split(",").includes(type.value.toLowerCase());
    });
  } else {
    filteredArray.value = promoState.promoList;
  }
  filteredArray.value = filteredArray.value.map((item) => ({
    ...item,
    label: getPromoLabel(item.labelType)
  }));
};

const logoShow = ref(true);
const closeDialog = () => {
  modalVisible.value = false;
  promoSrc.value = "";
};

const allLoading = ref(false);

const loadAll = () => {
  allLoading.value = true;
  const key = "PROMOTION_TYPES";
  cached
    .get(key, () => api.get("/promo/type"))
    .then((res) => {
      if (res.length > 0) {
        tabItems.value = [];
        res.forEach((element) => {
          const obj = {
            name: element.value.toLowerCase(),
            label: JSON.parse(element.name).H5
          };
          tabItems.value.push(obj);
        });
        switchPromoType(promoState.active);
      } else {
        console.warn("No promo types loaded, using default promo types.");
      }
    });
  const platformApiUrl = "/opt-session/promo/page";

  isFetchingPromo.value = window.location.pathname === "/promotion";

  api
    .get(platformApiUrl)
    .then((res) => {
      if (res.code === 0) {
        promoState.promoList = [];
        var promoItems = res.data;
        promoItems.forEach((element) => {
          promoState.promoList.push(element);
          if (route.query.name && String(element.redirectUrl) === route.query.name) {
            showPromoDetails(element);
          }
        });

        switchPromoType(promoState.active);
        isFetchingPromo.value = false;
      }
    })
    .catch((e) => {
      isFetchingPromo.value = false;
      console.log("error", e);
    })
    .finally(() => {
      setTimeout(() => {
        allLoading.value = false;
      }, 500);
    });
};
onMounted(() => {
  //TODO:: 我觉得没有 Banner，所以我隐藏了
  // loadBanner();

  checkExtension();
  loadAll();
});
</script>

<style scoped lang="scss">
.promo-container {
  min-height: calc(100vh - 120px);
  .promo-view-container {
    ol {
      padding: 0 15px;
    }

    table {
      margin: 0 15px 20px;
      width: 98%;
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      border: 0;

      tr {
        td {
          padding: 10px 20px;
          border-bottom: 1px solid #272c3d;

          p {
            margin: 0;
          }
        }

        &:first-child {
          td {
            color: #db7e42;
            white-space: nowrap;
          }
        }

        td:nth-child(odd) {
          background: #3c3c6a;
        }

        td:nth-child(even) {
          background: #3c3c6a;
        }
      }
    }
  }

  a {
    color: #db7e42;
    font-size: 17px;
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  color: #ffffff;
  // background-color: #090b18;

  .all-promotions {
    padding: 0 20px 20px 20px;
    @keyframes fadein {
      100% {
        opacity: 1;
      }
    }

    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center bottom;
      overflow: hidden;
      margin: 10px;

      img {
        width: 100%;
      }
    }

    .promo-main-container {
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;

      .promo-type-wrapper {
        display: flex;
        justify-content: center;
        ::-webkit-scrollbar {
          display: none;
        }

        .type-list {
          display: flex;
          align-items: center;
          border-radius: 20px;
          overflow: auto;
          gap: 20px;
          padding: 10px;

          .type-item {
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 20px;
            background: #272c3d;
            box-shadow: 0 0 10px -3px #000000;
            white-space: nowrap;

            svg {
              width: 20px;
              fill: white;
              display: block;
              padding: 0;
            }

            img {
              max-height: 20px;
              filter: grayscale(1);
            }

            &.active,
            &:hover {
              background: #4b4e66;
              box-shadow: 0 0 5px #ffffff;

              img {
                filter: grayscale(0);
              }
            }
          }
        }
      }

      // @keyframes scalein {
      //   from {
      //     transform: scale(0.5);
      //   }
      //   to {
      //     transform: scale(1);
      //   }
      // }

      .promo-list-wrapper {
        display: flex;
        flex-direction: column;

        .promo-item {
          position: relative;
          // overflow: hidden;
          cursor: pointer;
          // transform: scale(1);
          // animation-name: scalein;
          // animation-duration: 1s;
          // transition: 0.4s ease-in;
          margin-bottom: 20px;
          overflow: hidden;
          padding-top: 10px;
          border-radius: 8px;

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            // border-radius: 10px 10px 0 0;

            .promo-bg {
              transition: all 0.5s ease;
              background-size: cover;
              background-position: center center;
              margin: 0;
              // border-radius: 10px 10px 0 0;
              display: flex;
              justify-content: center;
              //align-items: center;
              gap: 30px;

              &:hover {
                transform: scale(1.2);
              }

              .promo-content {
                width: 100%;
                height: auto;
                border-radius: 8px;
                padding: 1px;
                background: linear-gradient(180deg, #a98f7c 0%, rgba(169, 143, 124, 0) 100%);

                &.isDesktop {
                  display: block;
                }

                &.isMobile {
                  display: none;
                }
              }

              .promo-img {
                height: 200px;
              }
            }
          }

          .promo-info {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .viewdetail {
              background: #002a35;
              color: #ffffff;
              font-size: 12px;
              position: absolute;
              width: 100%;
              z-index: 2;
              top: 0;
              height: 30px;
              overflow: hidden;
              line-height: 27px;
              padding: 0 100px 0 10px;

              &:before {
                background: #043d4f;
                content: "";
                display: block;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
                width: 70px;
              }

              &:after {
                border-left: 20px solid transparent;
                border-right: 30px solid transparent;
                border-top: 30px solid #043d4f;
                clear: both;
                content: "";
                display: block;
                height: 0;
                position: absolute;
                right: 50px;
                top: 0;
                transform: rotate(180deg);
                width: 0;
              }
            }

            .detail-arrow {
              margin-right: 20px;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .selected-promo {
    width: 100%;

    .selected-promo-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      &.bg__xf-eurocup-hongbao {
        background-color: #090b18;
      }

      &.bg__xf-deposit-award {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: top center;

        .banner-container {
          display: none;
        }

        .welcome {
          width: calc(100% - 30px);
          margin: 0 auto;
          padding-bottom: 60px;
        }
      }

      &.bg__xf-return-promo {
        // background-image: url("../assets/images/promotion/hotpromo/return-promo/bg-img.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: top center;

        .banner-container {
          display: none;
        }

        .welcome {
          width: calc(100% - 30px);
          margin: 0 auto;
          padding-bottom: 60px;
        }
      }

      &.bg__cny-spinwheel {
        background-image: url("../assets/images/promotion/hotpromo/bonus-spinwheel/bg.jpg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: top center;
        background-color: #a1211d;

        .welcome {
          width: calc(100% - 30px);
          margin: 0 auto;
          padding-bottom: 60px;
        }
      }

      .banner-container {
        width: 100%;

        .promo-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          overflow: hidden;
          height: 220px;
        }
      }

      h1,
      h2,
      h3,
      h4 {
        margin-top: 15px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 22px;
      }

      .inner {
        max-width: 1400px;
        width: 90%;
        margin: 20px 14px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;

        &.special-promo {
          width: 100%;
          margin: 0 auto;
        }

        img {
          margin-bottom: 5px;
        }

        ol,
        ul {
          margin: 0;
          padding: 15px;

          li {
            margin-bottom: 20px;
          }
        }

        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;

          th {
            padding: 5px;
            text-align: center;
            background-image: linear-gradient(0deg, #07414c 0, #058096 100%), linear-gradient(#d0d1d3, #d0d1d3);
          }

          td {
            padding: 5px;
            text-align: center;
            background-color: #202228;
            border: 1px solid #d3d3d3;
          }
        }

        img {
          width: 100%;
          display: block;
        }

        .hot-promo {
          // background: #272c3d;
          border-radius: 10px;
        }

        .promo-view-container {
          // background: #272c3d;
          background-repeat: no-repeat;
          background-position: 95% 90%;
          padding: 20px;
          border-radius: 10px;
          overflow: auto;
          // &.welcome {
          //   background-image: url("../assets/images/promotion/hotpromo/common/welcome.png");
          // }
          // &.sport {
          //   background-image: url("../assets/images/promotion/hotpromo/common/sport.png");
          // }
          // &.esport {
          //   background-image: url("../assets/images/promotion/hotpromo/common/esport.png");
          // }
          // &.fish {
          //   background-image: url("../assets/images/promotion/hotpromo/common/fish.png");
          // }
          // &.livecasino {
          //   background-image: url("../assets/images/promotion/hotpromo/common/livecasino.png");
          // }
          // &.slot {
          //   background-image: url("../assets/images/promotion/hotpromo/common/slot.png");
          // }
        }
      }
    }
  }
}

.pad-title {
  position: absolute;
  font-size: 12px;
  // color: #3e5cc0;
  color: #ffffff;
  right: 5px;
  top: 5px;
  z-index: 3;
}

.trapezium {
  position: absolute;
  top: 10px;
  left: 0;
  font-size: 12px;
  color: #ffffff;
  padding: 2px 20px 2px 8px;
  background-color: #1475e1;
  clip-path: polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%);
  border-top-left-radius: 8px;
}

.promo {
  .tab-wrapper {
    padding: 20px 20px 16px 20px;
    background-color: #1b2437;
    position: sticky;
    top: 46px;
    z-index: 4;
    border-bottom: 2px solid #1b2437;
    .q-tabs {
      margin: 0;
    }

    .q-tab {
      padding: 0;
    }
  }

  .q-tab-panels {
    background: none;
    // padding: 10px;
    padding: 0;
  }

  .q-tab-panel {
    padding: 0;
  }

  .download-item {
    background: #ffffff;
    padding: 10px;

    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: flex-start;

      img {
        width: 40px;
      }
    }

    .download {
      width: 120px;
      margin-left: auto;
      display: block;
    }
  }
}

.q-toolbar {
  height: calc(100%);
  max-height: unset !important;
  max-width: unset !important;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 0;

  .topActions {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 26px;
  }
}

.promo-iframe {
  height: calc(100%);
  position: fixed;
  width: 100vw;
  z-index: 1;
  top: 0px;
  bottom: 0px;

  &.promo-header-iframe {
    height: calc(100% - 26px);

    top: 26px;
  }
}

.loader {
  margin: auto;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
