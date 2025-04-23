<template>
  <!-- <q-card-section class="page-title">优惠活动</q-card-section> -->

  <ProfileSummary v-if="!extensionState && !isWebview" :homeProfile="true" />
  <div class="vip-promo-tab-wrapper" v-if="!isPromoDetail">
    <q-tabs
      v-model="vipPromoTab"
      dense
      no-caps
      class="vip-promo-tab-toggle"
      indicator-color="transparent"
      align="justify"
    >
      <q-tab name="promo" :label="$t('header.promotion')" />
      <q-tab name="vip" :label="$t('header.vip')" />
    </q-tabs>
  </div>

  <div
    class="promo-container"
    style="background: #090b19"
    v-touch-swipe.left="swipeLeft"
    v-touch-swipe.right="swipeRight"
  >
    <div class="promo">
      <!-- <q-tabs v-if="!isPromoDetail" v-model="tab" align="justify"> -->
      <!-- <q-tab v-for="(tab, i) in tabItems" :key="i" :name="tab.name" :label="tab.label" /> -->
      <!-- </q-tabs> -->

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
          <div class="all-promotions" v-if="!isPromoDetail">
            <div class="promo-main-container">
              <div class="promo-type-wrapper"></div>
              <div class="promo-list-wrapper">
                <div
                  v-for="(promo, i) in filteredArray"
                  :key="i"
                  v-bind:data-aos="!isWebview ? 'zoom-in' : null"
                  v-bind:data-aos-easing="!isWebview ? 'ease-out' : null"
                  v-bind:data-aos-duration="!isWebview ? '1000' : null"
                >
                  <div class="promo-item" v-if="promo.promoType.toLowerCase().split(',').includes(tab.name)">
                    <a @click="showPromoDetails(promo)">
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div class="promo-item" v-if="tab.name === 'all'">
                    <a @click="showPromoDetails(promo)">
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="selected-promo">
            <div v-if="isFetchingPromo" class="spinner-container">
              <q-spinner color="yellow" size="70px" :thickness="5" />
            </div>
            <div class="selected-promo-wrapper">
              <q-btn dense rounded icon="close" class="back-btn text-white" size="16px" @click="backToPromoList()" />
              <div class="banner-container">
                <img
                  class="promo-content"
                  :src="imgURL + selectedPromo.mobileBannerUrl"
                  style="display: block; width: 100%"
                />
              </div>
              <div class="inner">
                <div
                  v-if="selectedPromo.promoType"
                  :class="{
                    welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
                    sport: selectedPromo.promoType.toLowerCase() === 'sport',
                    eSport: selectedPromo.promoType.toLowerCase() === 'esport',
                    fish: selectedPromo.promoType.toLowerCase() === 'fish',
                    liveCasino: selectedPromo.promoType.toLowerCase() === 'live casino',
                    slot: selectedPromo.promoType.toLowerCase() === 'slot game'
                  }"
                >
                  <div class="top-float" v-if="!selectedParam || (selectedParam && !selectedParam.hidefloat)">
                    <div class="top-title">{{ selectedPromo.title }}</div>
                  </div>
                  <div class="promo-content-inner" v-if="!selectedParam || (selectedParam && !selectedParam.hidetitle)">
                    <div class="content-title">{{ selectedPromo.title }}</div>
                  </div>

                  <div class="hot-promo-div" v-if="selectedPromo.hasPromo">
                    <HotPromotion :list="selectedPromo" />
                  </div>
                  <div v-html="selectedPromo.pageContent"></div>

                  <div
                    class="join-container"
                    v-if="!selectedParam || (selectedParam && !selectedParam.hidebottom)"
                    :style="{
                      bottom: extensionState ? '0' : `calc(72px + ${ui.bottomInsetHeight}px)`
                    }"
                  >
                    <div class="promo-date">
                      <div class="date-txt">{{ $t("promo.promotionEnds") }}</div>
                      <div class="date-timer">
                        <img src="../assets/images/promotion/timer-icon.svg" alt="" />
                        <q-icon name="all_inclusive" size="22px"></q-icon>
                      </div>
                    </div>
                    <q-btn
                      class="btn-join-now"
                      :class="isFtdPromoEnded ? 'btn-disabled' : ''"
                      :disable="isFtdPromoEnded"
                      no-caps
                      :label="$t('btn.joinNow')"
                      @click="goToJoinNow()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <GameModal
    v-if="route.path !== '/account/profile'"
    ref="allGames"
    :closeFullGameDialog="closeFullGameDialog"
  ></GameModal>

  <q-dialog width="100%" v-if="isOpenExtension" v-model="isOpenExtension" class="dark-grey-dialog">
    <div class="dialog-mid-text">Loading...</div>
  </q-dialog>
</template>

<script lang="js">
import { computed, defineComponent, onActivated, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { api } from "@/boot/axios";
import HotPromotion from "@/components/HotPromotion";
import GameModal from "@/components/modal/GameModal.vue";
import ProfileSummary from "@/components/ProfileSummary.vue";
import { userStore } from "@/stores/index";
import { t } from "@/boot/lang";
import { useUI } from "@/stores/ui";
import {useQuasar,SessionStorage} from "quasar";
import {isAndroid} from "boot/utils";
import { i18nStore } from "src/router/language";
export default defineComponent({
  name: "PromoView",
  components: {
    GameModal,
    HotPromotion,
    ProfileSummary
  },
  setup() {
    const store = userStore();
    const imgURL = process.env.IMAGE_CDN + "/promo/";
    const banner = ref([]);
    const vipPromoTab = ref("promo");
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
    const i18nStoreLanguage = i18nStore();

    const isFetchingPromo = ref(false);
    const extensionState = ref(false);
    const isWebview = ref(false)
    const extensionToken = ref("");
    const isOpenExtension = ref(false);

    const langVal = computed(() => i18nStoreLanguage.languageVal)

    const checkExtension = () => {
      if (route.path === "/promotion") {
        // const eToken = ref(route.query.name);
        extensionToken.value = route.query.token;
        extensionState.value = true;
      }
    };

    const checkWebview = () => {
      if (route.path === "/wv-promotion") {
        isWebview.value = true
      }
    }

    const tab = ref("all");
    const tabItems = [
      { name: "all", label: "全部" }
      // { name: "slot game", label: '电子'},
      // { name: "fish", label: '捕鱼'},
      // { name: "live casino", label: '真人'},
      // { name: "poker", label: '棋牌'},

      // {
      //   name: "all",
      //   label: "全部",
      // },
      // {
      //   name: "sport",
      //   label: "体育",
      // },
      // {
      //   name: "esport",
      //   label: "电竞",
      // },
      // {
      //   name: "live casino",
      //   label: "真人",
      // },
      // {
      //   name: "slot game",
      //   label: "电游",
      // },
    ];

    onActivated(() => {
      // if promo name is present, do not show promo list on first load
      if (route.query.name && !isAndroid()) {
        isPromoDetail.value = true;
      }

      loadBanner();
      loadAll();
      updateCountdown();
      store.getUnreadTotal();
    });

    watch(
      () => route.query,
      () => {
        if (route.query === null || isAndroid()) {
          isPromoDetail.value = false;
        } else {
          isPromoDetail.value = route.query.name;
          ui.setScrollPosition("vertical", 0, 200);
        }
      }
    );

    watch(
      () => vipPromoTab.value,
      () => {
        if (isWebview.value) {
          router.push(`/wv-vip?token=${SessionStorage.getItem("TOKEN")}`)
        }
        else if (vipPromoTab.value === "vip") {
          router.push("/vip");
        }
      }
    );

    watch(
      () => route.path,
      () => {
        if (route.path === "/promo" || route.path === "/wv-promotion") {
          vipPromoTab.value = "promo";
        }
      }
    );

    const isPromoDetailPage = ref(false);

    const backToPromoList = () => {
      if (isWebview.value) {
        router.replace(`/wv-promotion?token=${SessionStorage.getItem("TOKEN")}`)
        isPromoDetail.value = false
      }
      else if (window.location.pathname === "/promotion") {
        window.location.href = "xfapp:/promo";
      } else {
        router.push("/promo");
      }
      isPromoDetailPage.value = false;
    };

    const isFtdPromoEnded = computed(() => {
      if (selectedPromo.value && selectedPromo.value.promoCode === "pk3-slot-ftd" && store.ftd === true) {
        return true;
      }

      return false;
    });

    const loadBanner = () => {
      // loadPromoBanner("PROMO").then((res) => {
      //   if (res.code === 0) {
      //       banner.value = res.data[0]
      //   }
      // })
      api.get("/opt-session/promo/banner?category=PROMO").then((response) => {
        if (response.code === 0) {
          banner.value = response.data[0];
          // console.log(banner.value)
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: ret.message,
          //   icon: "report_problem"
          // });
        }
        // banners.value = response.data;
      });
    };
    const showPromoDetails = (promo) => {
      if (!store.token) {
        $q.notify({
          color: "negative",
          position: "top",
          message: t('notify.plsLoginToContinue'),
          icon: "report_problem"
        });
        router.push(`/login`);
      } else {
        scrollToTop();

        if (promo.redirectUrl && promo.redirectUrl.includes("page-vip")) {
          router.push({ path: "/account/vip" });
        } else if (promo.redirectUrl && promo.redirectUrl.includes("SigninBonus")) {
          router.push({ path: "/activities-details" });
        } else {
          // if (route.query.fromAccount) {
          //   router.push({path: '/promo', query: {name: promo.redirectUrl, fromAccount: true}})
          // } else {
          //   router.push({path: '/promo', query: {name: promo.redirectUrl}})
          // }
          // isPromoDetail.value = true
          // selectedPromo.value = promo

          if (extensionState.value) {
            isPromoDetail.value = true;

            selectedPromo.value = promo;
            if (isAndroid()) {
              LocalStorage.set("TOKEN", extensionToken.value, 86400);
            } else {
              SessionStorage.set("TOKEN", extensionToken.value);
            }
            store.token = extensionToken.value;
          } else if (isAndroid()) {
            // store.h5Url = "http://192.168.68.86:9090/";
            var preUrl = store.h5Url + `promotion?name=${promo.redirectUrl}&token=${store.token}&lang=${langVal.value}`;
            // alert(preUrl);
            console.log(preUrl);
            // promoSrc.value= preUrl;
            var ref = cordova.InAppBrowser.open(preUrl, "_blank", "location=no,zoom=no,footer=no,toolbar=no,fullscreen=yes,hidden=yes");
            isOpenExtension.value = true;

            ref.addEventListener("message", async function(event) {
              if (event.data.action === "qrcode") {
                // alert(event.data.item);
                const dataUrl = event.data.item;
                // alert(dataUrl)
                // Save the image to the photo gallery
                await Filesystem.writeFile({
                  path: `Pictures/myreferral-${Date.now()}.jpg`,
                  data: dataUrl,
                  directory: Directory.Documents,
                  recursive: true
                });

              }
            });

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

            ref.addEventListener('loadstop', function() {
              setTimeout(()=>{
                ref.show();
              },500)
            });

            ref.addEventListener("exit", function () {
              isOpenExtension.value = false;
            });
        } else {
          if (isWebview.value) {
            isPromoDetail.value = true;
            selectedPromo.value = promo;
          }
          else if (route.query.fromAccount) {
            router.push({ path: "/promo", query: { name: promo.redirectUrl, fromAccount: true } });
          } else {
            router.push({ path: "/promo", query: { name: promo.redirectUrl } });
          }
          if(!isAndroid()){
              isPromoDetail.value = true;
              selectedPromo.value = promo;
              // selectedPromoDate.value = '';
            }
          }

          if(selectedPromo.value.param){
            let promoDate = JSON.parse(selectedPromo.value.param).promoDate;

            // if(promoDate) {
            //   selectedPromoDate.value = promoDate;
            // }
          }
        }
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
    };

    const loadAll = () => {
      const randNum = Math.floor(Math.random() * 1000) + 1;
      const platformApiUrl = `/opt-session/promo/page?v=${randNum}`;

      isFetchingPromo.value = window.location.pathname === "/promotion";

      api
        .get(platformApiUrl)
        .then((res) => {
          if (res.code === 0) {
            promoState.promoList = [];
            var promoItems = res.data;
            // promoState.promoList.push(...res.data);

            promoItems.forEach((element) => {
              // if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
                // promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
              // } else {
                promoState.promoList.push(element);

                if (route.query.name && String(element.redirectUrl) === route.query.name) {
                  showPromoDetails(element);
                }
              // }
            });

            switchPromoType(promoState.active);

            isFetchingPromo.value = false;
          }
        })
        .catch((e) => {
          isFetchingPromo.value = false;
          console.log("error", e);
        });
    };

    const selectedParam = computed(() => {
      if (selectedPromo.value && selectedPromo.value.param) {
        const paramJson = JSON.parse(selectedPromo.value.param);
        return paramJson;
      } else {
        return null;
      }
    });

    const goToJoinNow = () => {
      // console.log(selectedPromo.value);
      if (selectedPromo.value.param) {
        try {
          const paramJson = JSON.parse(selectedPromo.value.param);
          console.log(paramJson);
          if (paramJson && paramJson.page) {
            if (isWebview.value) {
              if(paramJson.page.includes("vip")){
                document.location.href = "app://vip"
              }else if(paramJson.page.includes("earn-money")){
                document.location.href = "app://earn-money"
              }
            }else{
              router.push(paramJson.page);
            }
          } else if (paramJson && paramJson.html) {
            window.open(paramJson.html, "_blank");
          } else if (paramJson && paramJson.game) {
            const openPattern = /^\/open\/(.*)/;
            const extractedUrl = paramJson.game.match(openPattern)[1];
            const [gameName, platformCode, gameCode, gameStatus, gameType, gameId] = extractedUrl.split("/");
            playGame(gameName, platformCode, gameCode, gameStatus, gameType, gameId);
          } else if (paramJson && paramJson.api) {
            const apiParams = paramJson && paramJson.params ? paramJson.params : {};
            api
              .get(paramJson.api, { params: apiParams })
              .then((res) => {
                if (res.code === 0) {
                  $q.notify({
                    color: "positive",
                    position: "top",
                    message: "Success.",
                    icon: "check_circle_outline"
                  });
                }
              })
              .catch((e) => {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: e.message,
                  icon: "report_problem"
                });
              });
          }
        } catch (e) {
          console.log("PArse Error");
        }
      } else if (selectedPromo.value.redirectUrl === "EarnMoney") {
        if (isWebview.value) {
          document.location.href = "app://earn-money"
        }else{
          router.push("/earn-money");
        }
      } else if (selectedPromo.value.redirectUrl === "VIPrewards") {
        if (isWebview.value) {
          router.push(`/wv-vip?token=${SessionStorage.getItem("TOKEN")}`)
        }else{
          router.push("/vip");
        }
      } else if (selectedPromo.value.redirectUrl === "Deposit") {
        if (isWebview.value) {
          document.location.href = "app://deposit"
        }else{
          router.push("/deposit?from=/promo");
        }

      } else if (selectedPromo.value.redirectUrl === "Withdraw") {
        router.push("/withdraw?from=/promo");
      } else if (
        selectedPromo.value.redirectUrl.indexOf("https://") > -1 ||
        selectedPromo.value.redirectUrl.indexOf("http://") > -1
      ) {
        window.open(selectedPromo.value.redirectUrl, "_blank");
      } else if (selectedPromo.value.redirectUrl) {
        router.push(selectedPromo.value.redirectUrl);
      }
    };

    const allGames = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
      allGames.value.open(gameName, platformCode, gameCode, gameType);
    };

    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };

    const goToVip = () => {
      router.push("/vip");
    };

    // promo timer
    const endDate = new Date("01/8/2024 12:00:00").getTime();
    const countdown = ref("");
    const isPromotionEnded = ref(false);

    function getCountdown() {
      const now = new Date().getTime();
      const timeRemaining = endDate - now;

      if (timeRemaining <= 0) {
        isPromotionEnded.value = true;
        return "Promotion Ended";
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    const updateCountdown = () => {
      countdown.value = getCountdown();
    };

    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Cleanup the interval when the component is unmounted
    onBeforeUnmount(() => {
      clearInterval(countdownInterval);
    });

    onMounted(() => {
      checkExtension();
      checkWebview();
    });

    const swipeLeft = () => {
      router.push("/vip");
    };

    // Handle swipe right
    const swipeRight = () => {};

    const fullGameDialog = ref(false);
    const closeFullGameDialog = () => {
      fullGameDialog.value = false;
    };

    return {
      promoState,
      promoTypes,
      promoTabActive,
      switchPromoType,
      filteredArray,
      isPromoDetail,
      showPromoDetails,
      selectedPromo,
      banner,
      imgURL,
      store,
      tab,
      tabItems,
      vipPromoTab,
      backToPromoList,
      isPromotionEnded,
      countdown,
      getCountdown,
      selectedParam,
      updateCountdown,
      countdownInterval,
      goToVip,
      goToJoinNow,
      ui,
      swipeLeft,
      swipeRight,
      route,
      allGames,
      closeFullGameDialog,
      isFtdPromoEnded,
      isFetchingPromo,
      extensionState,
      isWebview,
      isOpenExtension
    };
  }
});
</script>

<style lang="scss" scoped>
.vip-promo-tab-wrapper {
  width: 90%;
  margin: 0 auto;

  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    background: #101114;
    color: #5c6c86;
    font-weight: 400;
  }

  .vip-promo-tab-toggle {
    background-color: #1b2232;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: #fff;
      background: linear-gradient(0deg, #5c46e7, #5c46e7), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
      box-shadow: 0px 1px 2px 0px #0000000d;
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}

.promo-container {
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

.back-btn {
  background: rgb(255, 255, 255, 0.4);
  margin: 12px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
}
</style>

<style lang="scss">
.promo-container {
  color: #ffffff;
  min-height: calc(100vh - 160px);

  .all-promotions {
    padding-bottom: 20px;
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
      height: 170px;
      margin: 10px;

      img {
        width: 100%;
      }
    }

    .promo-main-container {
      max-width: 1400px;
      width: 90%;
      margin-left: auto;
      margin-right: auto;

      .promo-type-wrapper {
        display: flex;
        justify-content: center;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
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

      @keyframes scalein {
        from {
          transform: scale(0.5);
        }
        to {
          transform: scale(1);
        }
      }

      .promo-list-wrapper {
        display: flex;
        margin-top: 20px;
        flex-direction: column;

        .promo-item {
          position: relative;
          // overflow: hidden;
          cursor: pointer;
          transform: scale(1);
          animation-name: scalein;
          animation-duration: 1s;
          transition: 0.4s ease-in;
          margin-bottom: 20px;
          overflow: hidden;
          padding-top: 40px;
          border-radius: 17px;
          background: #4f366c;
          box-shadow: 0px 7.5px 20px 0px #1411321a;
          cursor: pointer;

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
              border-radius: 17px;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 30px;

              &:hover {
                transform: scale(1.2);
              }

              .promo-content {
                width: 100%;
                // width: unset;
                // height: 100%;

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
              // background: #002a35;
              color: #ffffff;
              font-size: 14px;
              position: absolute;
              width: 100%;
              z-index: 2;
              top: 0;
              height: 40px;
              overflow: hidden;
              line-height: 40px;
              padding: 0 100px 0 10px;
              font-weight: 500;

              // &:before {
              //   background: #043d4f;
              //   content: "";
              //   display: block;
              //   height: 100%;
              //   position: absolute;
              //   right: 0;
              //   top: 0;
              //   width: 70px;
              // }

              // &:after {
              //   border-left: 20px solid transparent;
              //   border-right: 30px solid transparent;
              //   border-top: 30px solid #043d4f;
              //   clear: both;
              //   content: "";
              //   display: block;
              //   height: 0;
              //   position: absolute;
              //   right: 50px;
              //   top: 0;
              //   transform: rotate(180deg);
              //   width: 0;
              // }
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
      .banner-container {
        width: 100%;

        &:after {
          content: "";
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(255, 255, 255, 0));
          position: absolute;
          top: 0;
          left: 0;
          height: 80px;
          width: 100%;
        }

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
        margin: 20px auto 35px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;
        padding-bottom: 40px;

        p {
          font-size: 14px;
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
            border: 1px solid #2e3039;
          }
        }

        img {
          width: 100%;
          display: block;
        }

        .hot-promo-div img {
          width: initial;
          display: initial;
          margin-bottom: initial;
        }

        .hot-promo {
          //background: #272c3d;
          //border-radius: 10px;
          //display: none;
        }

        .promo-view-container {
          background: #272c3d;
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
  // position: absolute;
  // top: -7px;
  // right: 5px;
  // z-index: 3;
  font-size: 12px;
  // color: #3e5cc0;
  color: #ffffff;
  // right: 5px;
  // top: 5px;
  z-index: 3;
}

.pad-label.label-new {
  //   background: url(../assets/promo/yh_label_new.png) no-repeat;
  // background-size: 100%;
  background-size: 78px 45px;
  font-size: 12px;
  color: #ffffff;
  padding: 12px 7px;
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
}

.promo {
  .q-tabs {
    // background: rgba(113, 125, 146, 0.2);
    background: #063c50;
    width: 100%;
    margin: 0 auto;
  }

  .q-tab {
    min-height: 40px;
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active {
    color: #fff;
  }

  .q-tab__label {
    font-size: 13px;
  }

  .q-tab--active .q-tab__indicator {
    // background: url("../assets/images/promotion/tab_bg.png") no-repeat center center;
    background-size: 20px 10px;
    width: 100%;
    height: 10px;
    // background: salmon !important;
    filter: hue-rotate(311deg);
  }

  .q-tab__label {
    z-index: 1;
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

// promo content-inner
.promo-content-inner {
  .content-title {
    background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    font-size: 24px;
    font-weight: 700;
    line-height: 26px;
    margin-bottom: 8px;
  }
}

// top float
.top-float {
  position: absolute;
  top: 16px;
  left: 16px;

  .top-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.2;
  }

  .top-title {
    color: #fff;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
  }
}

// join now
.join-container {
  background: #3b2e95;
  padding: 12px 12px;
  position: fixed;
  //top: calc(100vh - 127px);
  //bottom: 66px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn-join-now {
    border-radius: 100px;
    background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
    color: #000;
    font-weight: 600;
    font-size: 12px;
    height: 30px;
  }

  .promo-date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .date-txt {
    color: rgba(255, 255, 255, 0.7);
  }

  .date-timer {
    color: #fe9a9a;
    display: flex;
    align-items: center;
    line-height: 1 !important;
    font-size: 14px;

    img {
      width: 14px !important;
      margin-right: 8px;
    }
  }
}

.btn-disabled {
  filter: brightness(0.6);
}

.dark-grey-dialog {
  background: linear-gradient(180deg, #3e1474 0%, #101114 96.35%);
  // background: #3e1474;
  background-size: contain;

  .dialog-mid-text {
    display: flex;
    align-content: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    text-align: center;
    position: relative;
    top: 48%;
  }
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
}
</style>
