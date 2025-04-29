<template>
  <!-- <q-card-section class="page-title">优惠活动</q-card-section> -->
  <ProfileSummary v-if="!extensionState" :homeProfile="true" />
  <div class="vip-promo-tab-wrapper" v-if="!isPromoDetail">
    <q-tabs
      v-model="vipPromoTab"
      dense
      no-caps
      class="vip-promo-tab-toggle"
      indicator-color="transparent"
      align="justify"
    >
      <q-tab name="promo" :label="$t('settings.promo')" />
      <q-tab name="vip" :label="$t('settings.vip')" />
    </q-tabs>
  </div>

  <div class="promo-container">
    <div class="promo">
      <q-tabs v-if="!isPromoDetail" v-model="tab" align="justify" active-color="white">
        <q-tab
          v-for="(tab, i) in tabItems"
          :key="i"
          :name="tab.name"
          :label="langVal === 'ur' ? tab.label_ur : tab.label"
        />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
          <div class="all-promotions" v-if="!isPromoDetail">
            <div class="promo-main-container">
              <div class="promo-type-wrapper"></div>
              <div class="promo-list-wrapper">
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
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                        <span class="date">
                          {{ $t("hotPromo.promoEndsOn") }}: {{ moment(promo.displayEndTime).format("YYYY-MM-DD") }}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <!--              <MediaSettingsComponent />-->
            </div>
          </div>
          <div v-else class="selected-promo">
            <!-- <div class="loader" v-if="isFetchingPromo" /> -->
            <div v-if="isFetchingPromo" class="spinner-container">
              <q-spinner color="yellow" size="70px" :thickness="5" />
            </div>

            <div class="selected-promo-wrapper">
              <q-btn dense rounded icon="close" class="back-btn text-white" size="16px" @click="backToPromoList()" />
              <div
                class="banner-container"
                v-if="
                  selectedPromo.redirectUrl !== 'pak-jackpot-aviator' ||
                  selectedPromo.redirectUrl !== 'new-player-acc-deposit'
                "
              >
                <!-- <div
                    class="promo-bg"
                    :style="
                    'background-image: url(' +
                    imgURL +
                    (selectedPromo.mobileBannerUrl ? selectedPromo.mobileBannerUrl : selectedPromo.mobileImgUrl) +
                    ')'
                  "
                ></div> -->
                <!-- <div class="promo-bg"> -->
                <img
                  class="promo-content"
                  :class="
                    (selectedPromo.redirectUrl === 'pak-deposit-spinner-rewards' ? 'dpsr' : 'usual',
                    selectedPromo.redirectUrl === 'new-player-acc-deposit' ? 'npad' : 'usual')
                  "
                  :src="imgURL + selectedPromo.mobileBannerUrl"
                />
                <!-- </div> -->
              </div>

              <div
                class="promo-content-inner"
                v-if="
                  selectedPromo.redirectUrl !== 'pak-jackpot-aviator' &&
                  selectedPromo.redirectUrl !== 'spin-lucky-wheel'
                "
                :style="selectedPromo.redirectUrl === 'pak-deposit-spinner-rewards' ? 'border:0; padding: 0;' : ''"
              >
                <RouterLink
                  v-if="parsedParam.showEarnMoney"
                  class="content-go-earn-money-btn"
                  :class="isFtdPromoEnded ? 'is-disabled' : ''"
                  to="/earn-money"
                >
                  <img src="../assets/images/bonus/share-icon.png" />
                  <span>{{ $t("hotPromo.earnMoney.earnMoney") }}</span>
                </RouterLink>
                <div class="content-title" v-if="selectedPromo.redirectUrl !== 'pak-deposit-spinner-rewards'">
                  {{ selectedPromo.title }}
                </div>
                <div class="content-para" v-if="parsedParamSub">{{ parsedParamSub }}</div>
                <div class="content-date" v-if="parsedParamDate">
                  <div><img src="../assets/images/promotion/calendar-icon.png" /></div>
                  {{ parsedParamDate }}
                </div>
              </div>

              <div
                class="inner"
                :class="{
                  isJackpotAviator: selectedPromo.redirectUrl === 'pak-jackpot-aviator',
                  isNewPlayerAccDeposit: selectedPromo.redirectUrl === 'new-player-acc-deposit',
                  isDepositSpinnerRewards: selectedPromo.redirectUrl === 'pak-deposit-spinner-rewards',
                  isSpinLuckyWheel:
                    selectedPromo.redirectUrl === 'spin-lucky-wheel' && ui.promoBg === 'spin-lucky-wheel-envelope'
                }"
              >
                <div v-if="selectedPromo.hasPromo">
                  <!-- <pre>selectedPromo{{ selectedPromo }}</pre>
                  <template v-if="selectedPromo.promoCode === 'pak-red-packet-rain'">
                    <div>asdasd</div>
                  </template>
                  <template v-else><HotPromotion :list="selectedPromo" /></template> -->
                  <!-- <HotPromotion :list="selectedPromo" /> -->
                  <component v-if="HotPromotion" :is="HotPromotion" :list="selectedPromo" />
                  <!-- promo.redirectUrl -->
                </div>
                <div
                  v-if="selectedPromo.promoType"
                  class="select-promo-html"
                  :class="{
                    welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
                    sport: selectedPromo.promoType.toLowerCase() === 'sport',
                    eSport: selectedPromo.promoType.toLowerCase() === 'esport',
                    fish: selectedPromo.promoType.toLowerCase() === 'fish',
                    liveCasino: selectedPromo.promoType.toLowerCase() === 'live casino',
                    slot: selectedPromo.promoType.toLowerCase() === 'slot game',
                    isSpinLuckyWheel: selectedPromo.redirectUrl === 'spin-lucky-wheel',
                    isGoldenEgg: selectedPromo.redirectUrl === 'pak-aviator-golden-egg'
                  }"
                >
                  <!-- <div class="top-float">
                    <div class="top-subtitle">Get unlimited rewards!</div>
                    <div class="top-title">{{ selectedPromo.title }}</div>
                  </div> -->

                  <div v-html="selectedPromo.pageContent"></div>
                  <!-- <div class="join-container" :style="`bottom: calc(72px + ${ui.bottomInsetHeight}px`">
                    <div class="promo-date">
                      <div class="date-txt">Promotion Ends</div>
                      <div class="date-timer">
                        <img src="../assets/images/promotion/timer-icon.svg" alt="" />
                        <q-icon name="all_inclusive" size="22px"></q-icon>
                      </div>
                    </div>
                    <q-btn class="btn-join-now" no-caps label="Join Now" @click="goToJoinNow()" />
                  </div> -->

                  <!-- <div class="join-container">
                    <div class="promo-date">
                      <div class="date-txt">Promotion Ends</div>
                      <div class="date-timer">01/01/2024</div>
                    </div>
                    <q-btn class="btn-join-now" no-caps label="Join Now" />
                  </div> -->
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

  <q-dialog width="100%" v-model="isDisplayLogin">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black text-center">
      <q-card-section class="q-mb-md">
        <strong>System Prompt</strong>
        <br />
        <br />
        Please log in before performing the operation
      </q-card-section>
      <router-link to="/login?redirect=/promo">
        <q-btn label="Login" color="primary" />
      </router-link>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isMoneyRainModal" width="100%">
    <MoneyRainModal @closeModal="isMoneyRainModal = false" />
    <q-btn icon="close" round dense v-close-popup @click="backToPromoList()" class="money-rain-close" />
  </q-dialog>

  <q-dialog v-model="isMegaSharingWheelModal" full-width class="mega-sharing-wheel-dialog">
    <q-btn class="mega-sharing-wheel-dialog-close" icon="close" round dense v-close-popup />
    <MegaSharingWheelModal />
  </q-dialog>

  <q-dialog width="100%" v-if="isOpenExtension" v-model="isOpenExtension" class="dark-grey-dialog">
    <div class="dialog-mid-text">{{ $t("btn.loading") }}...</div>
  </q-dialog>
</template>

<script lang="js">
import { ref, computed, defineComponent, onMounted, reactive, watch, onBeforeUnmount, onActivated, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached } from "src/boot/cache";
import { useQuasar } from "quasar";
import { useUI } from "stores/ui";
import { userStore } from "stores/index";
import { i18nStore } from "src/router/language";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";
import moment from "moment";
// import { loadPromo } from "src/api/index/promo.js";
// import { loadPromoBanner } from "src/api/index/promo";
import ProfileSummary from "components/ProfileSummary.vue";
import GameModal from "components/modal/GameModal.vue";
import { t } from "src/boot/lang";
import MoneyRainModal from "components/modal/MoneyRainModal.vue";
import MegaSharingWheelModal from "src/components/hotpromo/megaSharingWheel/MegaSharingWheelModal.vue";
import { Directory, Filesystem } from "@capacitor/filesystem";
// import MediaSettingsComponent from "components/MediaSettingsComponent.vue";

export default defineComponent({
  name: "PromoView",
  components: {
    GameModal,
    ProfileSummary,
    MoneyRainModal,
    MegaSharingWheelModal,
    // MediaSettingsComponent
  },
  setup() {
    const store = userStore();
    const i18nStoreLanguage = i18nStore();
    const imgURL = process.env.IMAGE_CDN + "/promo/";
    const banner = ref([]);
    const vipPromoTab = ref("promo");

    const popupPromo = ref("");

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

    const isOpenExtension = ref(false);

    const isFetchingPromo = ref(false);
    const extensionState = ref(false);
    const extensionToken = ref("");

    const HotPromotion = computed(() => process.env.MODE === 'spa' ?
      defineAsyncComponent(() => import('components/HotPromotion.vue')) :
      null
    );

    const checkExtension = () => {
      if (route.path === "/promotion") {
        // const eToken = ref(route.query.name);
        extensionToken.value = route.query.token;
        extensionState.value = true;
      }
    };

    // const tab = ref("all");
    // const tabItems = [

    //   {name: "all", label: '全部'},
    //   // { name: "slot game", label: '电子'},
    //   // { name: "fish", label: '捕鱼'},
    //   // { name: "live casino", label: '真人'},
    //   // { name: "poker", label: '棋牌'},

    //   // {
    //   //   name: "all",
    //   //   label: "全部",
    //   // },
    //   // {
    //   //   name: "sport",
    //   //   label: "体育",
    //   // },
    //   // {
    //   //   name: "esport",
    //   //   label: "电竞",
    //   // },
    //   // {
    //   //   name: "live casino",
    //   //   label: "真人",
    //   // },
    //   // {
    //   //   name: "slot game",
    //   //   label: "电游",
    //   // },
    // ];

    onActivated(() => {
      // if promo name is present, do not show promo list on first load
      if (route.query.name && !isAndroid()) {
        isPromoDetail.value = true;
      }

      loadBanner();
      loadAll();
      updateCountdown();
      store.getUnreadTotal();

      if(sessionStorage.getItem('SPIN_LUCKY_WHEEL_POPUP')) {
        sessionStorage.removeItem('SPIN_LUCKY_WHEEL_POPUP');
      }
    });

    onMounted(() => {
      checkExtension();

      if(sessionStorage.getItem('SPIN_LUCKY_WHEEL_POPUP')) {
        sessionStorage.removeItem('SPIN_LUCKY_WHEEL_POPUP');
      }
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
        if (currentPromoDetail.value) showPromoDetails(currentPromoDetail.value);
      }
    );

    watch(
      () => vipPromoTab.value,
      () => {
        if (vipPromoTab.value === "vip") {
          router.push("/vip");
        }
      }
    );

    watch(
      () => route.path,
      () => {
        if (route.path === "/promo") {
          vipPromoTab.value = "promo";
        }
      }
    );

    const isPromoDetailPage = ref(false);

    const backToPromoList = () => {
      if (window.location.pathname === "/promotion") {
        window.location.href = "xfapp:/promo";
      } else {
        router.push("/promo");
      }
      isPromoDetailPage.value = false;
    };

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

    const isMoneyRainModal = ref(false);
    const isMegaSharingWheelModal = ref(false);

    const showPromoDetails = (promo) => {
      // debugger;
      if (!store.token) {
        $q.notify({
          color: "negative",
          position: "top",
          message: t("notify.plsLoginToContinue"),
          icon: "report_problem"
        });
        router.push(`/login`);
      } else {
        if (promo.redirectUrl && promo.redirectUrl.includes("page-vip")) {
          router.push({ path: "/account/vip" });
        } else {
          if (promo.redirectUrl === "pak-redpacketrain") {
            isMoneyRainModal.value = true;
          } else if (promo.redirectUrl === "pak-mega-sharing-wheel") {
            isMegaSharingWheelModal.value = true;
            popupPromo.value = "mega-sharing-wheel"
          }else {
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
              // store.evip = "192.168.68.93:9090";
              const tgDomain = "https://" + store.evip;
              var preUrl = tgDomain + `/promotion?name=${promo.redirectUrl}&token=${store.token}&lang=${langVal.value}`;
              // alert(preUrl);
              console.log(preUrl);
              // promoSrc.value= preUrl;
              var ref = cordova.InAppBrowser.open(
                preUrl,
                "_blank",
                "location=no,zoom=no,footer=no,toolbar=no,fullscreen=yes,hidden=yes"
              );
              isOpenExtension.value = true;

              ref.addEventListener("loadstop", function () {
                setTimeout(() => {
                  ref.show();
                }, 500);
              });

              ref.addEventListener("message", async function (event) {
                if(event.data.action === "qrcode") {
                  const dataUrl = event.data.item;
                  await Filesystem.writeFile({
                    path: `Picture/${event.data.filename}`,
                    data: dataUrl,
                    directory: Directory.Documents,
                    recursive: true
                  })
                }
                var message = event.data;
                console.log("Message received from InAppBrowser: ", message);
                if (message === "close") {
                  ref.close();
                  isOpenExtension.value = false;
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

              ref.addEventListener("exit", function () {
                isOpenExtension.value = false;
              });
            } else {
              if (route.query.fromAccount) {
                router.push({ path: "/promo", query: { name: promo.redirectUrl, fromAccount: true } });
              } else {
                router.push({ path: "/promo", query: { name: promo.redirectUrl } });
              }
              if (!isAndroid()) {
                isPromoDetail.value = true;
                selectedPromo.value = promo;
              }
            }
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

      // remove to show faq as promo item at promo list
      filteredArray.value = [...filteredArray.value].filter(({ promoCode }) => promoCode !== "pak-faq");
    };

    const loadAll = () => {
      const key = "PROMOTION_TYPES"
      cached.get(key, () => api.get("/promo/type")).then((res) => {
        if (res.length > 0) {
          tabItems.value = [];
          res.forEach(element => {
            const obj = {
              name: element.value.toLowerCase(),
              label: JSON.parse(element.name).en,
              label_ur: JSON.parse(element.name).H5_ur
            };
            tabItems.value.push(obj);
          });
          switchPromoType(promoState.active)
        } else {
          console.warn('No promo types loaded, using default promo types.');
        }
      })

      const platformApiUrl = "/opt-session/promo/page";

      // isFetchingPromo.value = window.location.pathname === "/promotion";
      isFetchingPromo.value = true;

      api
        .get(platformApiUrl)
        .then((res) => {
          if (res.code === 0) {
            promoState.promoList = [];
            var promoItems = res.data;
            // promoState.promoList.push(...res.data);
            promoState.promoList.push(...promoItems);
            if (currentPromoDetail.value) showPromoDetails(currentPromoDetail.value);
            // promoItems.forEach((element) => {
            //   // if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
            //   // promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
            //   // } else {
            //   promoState.promoList.push(element);

            //   if (route.query.name && String(element.redirectUrl) === route.query.name) {
            //     showPromoDetails(element);
            //   }
            //   // }
            // });

            switchPromoType(promoState.active);

            isFetchingPromo.value = false;
          }
        })
        .catch((e) => {
          isFetchingPromo.value = false;
          console.log("error", e);
        });
    };

    const goToJoinNow = () => {
      // console.log(selectedPromo.value);
      if (selectedPromo.value.param) {
        try {
          const paramJson = JSON.parse(selectedPromo.value.param);
          console.log(paramJson);
          if (paramJson && paramJson.page) {
            router.push(paramJson.page);
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
        router.push("/earn-money");
      } else if (selectedPromo.value.redirectUrl === "VIPrewards") {
        router.push("/vip");
      } else if (selectedPromo.value.redirectUrl === "Deposit") {
        router.push("/deposit?from=/promo");
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

    // onMounted(() => {
    //   loadBanner();
    //   loadAll();
    //   updateCountdown();
    // });

    const swipeLeft = () => {
      // router.push('/vip')
    };

    // Handle swipe right
    const swipeRight = () => {};

    const fullGameDialog = ref(false);
    const closeFullGameDialog = () => {
      fullGameDialog.value = false;
    };

    const tab = ref("all");
    const tabItems = ref([]);

    const langVal = computed(() => i18nStoreLanguage.languageVal);

    // promo param split.
    const parsedParam = computed(() => {
      try {
        if (selectedPromo.value && selectedPromo.value.param) {
          return JSON.parse(selectedPromo.value.param);
        }
        return {};
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return {};
      }
    });

    const parsedParamSub = computed(() => parsedParam.value.sub || "");
    const parsedParamDate = computed(() => parsedParam.value.date || "");

    const currentPromoDetail = computed(() => {
      if (!route.query.name || !promoState.promoList.length) return null;

      const targetPromo = promoState.promoList.find((promo) => promo.redirectUrl === route.query.name);
      return targetPromo || null;
    });

    return {
      langVal,
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
      isDisplayLogin,
      vipPromoTab,
      backToPromoList,
      isPromotionEnded,
      countdown,
      getCountdown,
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
      parsedParamSub,
      parsedParamDate,
      MoneyRainModal,
      isMoneyRainModal,
      isFetchingPromo,
      extensionState,
      isOpenExtension,
      parsedParam,
      isMegaSharingWheelModal,
      popupPromo,
      HotPromotion,
      moment
      // MediaSettingsComponent
    };
  }
});
</script>
<style lang="scss" scoped>
.loader {
  margin: auto;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  position: absolute;
  top: 150px;
}

.vip-promo-tab-wrapper {
  width: 90%;
  margin: 0 auto;

  .q-tab {
    min-height: 44px;
    border-radius: 8px;
    color: #ffffff80;
    font-weight: 400;
    width: 50%;
  }

  .vip-promo-tab-toggle {
    // background: url(../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background: #3237384D;
    background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 700;
      // color: #FFFFFF80;
    }

    :deep(.q-tab--active) {
      color: white;
      // background: url(../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
      // background-size: 100% 100%;
      // background: linear-gradient(
      //   180deg,
      //   rgba(97, 255, 0, 0) 0%,
      //   rgba(97, 255, 0, 0.25) 50.5%,
      //   rgba(97, 255, 0, 0) 100%
      // );
      // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      // &:before {
      //   content: "";
      //   background-color: #21EF89;
      //   height: 3px;
      //   border-radius: 4px;
      //   width: 30%;
      //   position: absolute;
      //   bottom: 0;
      //   left: 50%;
      //   transform: translateX(-50%);
      // }
      background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}
</style>
<style scoped lang="scss">
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
  margin: 12px !important;
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  z-index: 9;
}
</style>
<style lang="scss">
.promo-container {
  color: #ffffff;
  min-height: calc(100vh - 160px);

  .all-promotions {
    // padding-bottom: 20px;
    @keyframes fadein {
      100% {
        opacity: 1;
      }
    }

    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center top;
      overflow: hidden;

      // max-height: 130px;
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
          // padding-top: 40px;
          border-radius: 17px;
          box-shadow: 0px 7.5px 20px 0px #1411321a;
          background: rgba(255, 255, 255, 0.1);

          .promo-img-wrapper {
            position: relative;
            max-height: 145px;
            overflow: hidden;
            // border-radius: 10px 10px 0 0;

            .promo-bg {
              transition: all 0.5s ease;
              // background-size: cover;
              background-position: center center;
              background-size: 100% 100%;
              margin: 0;

              display: flex;
              // height: 160px;
              justify-content: center;
              align-items: flex-start;
              gap: 30px;

              &:hover {
                transform: scale(1.2);
              }

              .promo-content {
                width: 100%;

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
            align-items: flex-start;
            background: #292d2e;

            padding: 10px 20px;
            gap: 0px;
            flex-direction: column;
            .viewdetail {
              // background: #002a35;
              color: #ffffff;

              // position: absolute;
              position: relative;
              width: 100%;
              z-index: 2;
              height: 30px;
              overflow: hidden;
              line-height: 30px;
              font-family: Poppins;
              font-size: 15.3px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .date {
              color: #b2bdbf;
              font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-weight: 400;
              font-size: 12px;
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
        .promo-content {
          &.usual {
            display: block;
            width: 100%;
          }
          &.dpsr {
            display: block;
            width: 90%;
            border-radius: 15px;
            margin: 20px auto;
          }
          &.npad {
            display: none;
          }
        }

        .promo-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          overflow: hidden;
          height: 220px;
        }

        &:after {
          content: "";
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(255, 255, 255, 0));
          position: absolute;
          top: 0;
          left: 0;
          height: 80px;
          width: 100%;
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
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;
        padding-bottom: 40px;

        &.isSpinLuckyWheel {
          background: url("../assets/images/promotion/hotpromo/spin-lucky-wheel/envelope-stage/bg.png") no-repeat top
            center;
          background-size: cover;
          width: 100%;
          margin-top: 0;
          padding-bottom: 0;
        }
        &.isJackpotAviator {
          width: 100%;
        }
        &.isDepositSpinnerRewards {
          border-radius: 0;
          width: 100%;
          padding: 0;
          margin: 0;
          > div:nth-child(2) {
            display: none;
          }
        }
        &.isNewPlayerAccDeposit {
          width: 100%;

          .select-promo-html {
            padding: 16px;
          }
        }

        .select-promo-html {
          &.isSpinLuckyWheel {
            display: none;
          }
          &.isGoldenEgg {
            table {
              p {
                margin: 0;
              }
              border: none;
              td {
                border: 0;
                padding: 15px 0;
              }
              td:first-child {
                border-right: 1px solid #ffffff1a;
              }
              tr:first-of-type td {
                background: #3237384D;
                color: #ffffff80;
                border: 0;
                &:first-child {
                  border-radius: 10px 0 0 0;
                }
                &:last-child {
                  border-radius: 0 10px 0 0;
                }
              }
              tr:nth-child(even) td {
                background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
              }
              tr:nth-child(odd) td {
                background: #3237384D;
              }
              tr:not(:first-of-type) td:last-child {
                color: #ffd400;
              }
            }
          }
        }

        p {
          font-size: 14px;
        }

        img {
          margin-bottom: 5px;
        }

        ol,
        ul {
          margin: 0;
          padding: 0 15px;

          li {
            margin-bottom: 10px;
            color: #9f9f9f;
          }
        }

        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          margin-bottom: 20px;

          p {
            font-size: 12px;
          }

          th {
            padding: 5px;
            text-align: center;

            background: linear-gradient(180deg, #21ef89 0%, #33562d 100%);

            &:first-child {
              border-top-left-radius: 8px;
            }

            &:last-child {
              border-top-right-radius: 8px;
            }
          }

          td {
            padding: 5px;
            text-align: center;
            background-color: #1c241b;
            border: 1px solid #2e3039;
          }
        }

        img {
          width: 100%;
          display: block;
        }

        .hot-promo {
          border-radius: 10px;
          // display: none;
        }

        .promo-view-container {
          background: #272c3d;
          background-repeat: no-repeat;
          background-position: 95% 90%;
          padding: 20px;
          border-radius: 10px;
          overflow: auto;
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
    // background: #2b501d;
    width: calc(100% - 40px);
    margin: 10px 20px 0;
  }

  .q-tab {
    min-height: 16px;
    color: #8c968f;
    padding: 0 10px;
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active {
    color: #fff;
    background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
    border-radius: 20px;
    font-weight: 700;
    font-size: 12px;
  }

  .q-tab__label {
    font-size: 13px;
    line-height: 1rem;
  }

  .q-tab .q-tab__indicator {
    display: none;
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
  padding: 12px 0px;
  margin: 0 12px;
  border-bottom: 1px solid #ffffff1a;
  .content-title {
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
  }
  .content-para {
    font-size: 14px;
    padding-top: 4px;
    color: #9f9f9f;
  }
  .content-date {
    padding-top: 6px;
    color: #9f9f9f;
    display: flex;
    align-items: center;
    gap: 4px;
    img {
      display: block;
      width: 30px;
    }
  }
  .content-go-earn-money-btn {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px 0;
    border-radius: 5px;
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    text-decoration: none;

    &.is-disabled {
      pointer-events: none;
      filter: brightness(0.4);
    }

    img {
      width: 28px !important;
      margin: 0px;
      display: inline-block;
      height: auto;
      margin-right: 10px;
    }

    span {
      color: #000;
      font-size: 20px;
      font-weight: 700;
    }

    &:active {
      transform: translate(0px, 1px);
      filter: brightness(0.85);
    }
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
  background: #252b37;
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
    gap: 8px;
    font-size: 14px;

    img {
      width: 14px !important;
    }
  }
}

.money-rain-close {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.dark-grey-dialog {
  background: linear-gradient(#000000b3, #000000b3);
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

.mega-sharing-wheel-dialog-close {
  position: absolute;
  top: 16px;
  right: 0;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: all;
}
</style>
