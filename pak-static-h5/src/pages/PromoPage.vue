<template>
  <!-- <q-card-section class="page-title">优惠活动</q-card-section> -->
  <ProfileSummary :homeProfile="true" />
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

  <!-- <q-tabs
    scroll-target=".q-tab--active"
    v-if="!isPromoDetail"
    v-model="tab"
    align="justify"
    class="promo-cat-tab extension-tab"
  >
    <q-tab v-for="(tab, i) in tabItems" :key="i" :name="tab.name" :label="tab.label" />
  </q-tabs> -->

  <!-- <pre>promoState.promoList{{ promoState.promoList }}</pre> -->

  <div class="promo-container">
    <div class="promo">
      <q-tabs v-if="!isPromoDetail" v-model="tab" align="justify">
        <q-tab v-for="(tab, i) in tabItems" :key="i" :name="tab.name" :label="$t(tab.label)" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
          <div class="all-promotions" v-if="!isPromoDetail">
            <div class="promo-main-container">
              <div class="promo-type-wrapper"></div>
              <div class="promo-list-wrapper">
                <div v-for="(promo, i) in filteredArray" :key="i">
                  <!-- data-aos="zoom-in"
                  data-aos-easing="ease-out"
                  data-aos-duration="1000" -->
                  <div class="promo-item" v-if="promo.promoType.toLowerCase().split(',').includes(tab.name)">
                    <a @click="showPromoDetails(promo)">
                      <!-- <div class="pad-title">
                        <span class="pad-right">查看详情&gt;&gt;</span>
                      </div> -->
                      <!-- <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div> -->
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>

                      <!-- <div class="pad-label label-new">最新活动</div> -->
                    </a>
                  </div>

                  <div class="promo-item" v-if="tab.name === 'all'">
                    <a @click="showPromoDetails(promo)">
                      <!-- <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div> -->
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="selected-promo">
            <div class="selected-promo-wrapper">
              <q-btn dense rounded icon="close" class="back-btn text-white" size="16px" @click="backToPromoList()" />
              <div class="banner-container">
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
                  :src="imgURL + selectedPromo.mobileBannerUrl"
                  style="display: block; width: 100%"
                />
                <!-- </div> -->
              </div>

              <div class="promo-content-inner">
                <div class="content-title">{{ selectedPromo.title }}</div>
                <div class="content-para" v-if="parsedParamSub">{{ parsedParamSub }}</div>
                <div class="content-date" v-if="parsedParamDate">
                  <div><img src="../assets/images/promotion/calendar-icon.png" /></div>
                  {{ parsedParamDate }}
                </div>
              </div>

              <div class="inner">
                <div v-if="selectedPromo.hasPromo">
                  <!-- <pre>selectedPromo{{ selectedPromo }}</pre>
                  <template v-if="selectedPromo.promoCode === 'pak-red-envelope-rain'">
                    <div>asdasd</div>
                  </template>
                  <template v-else><HotPromotion :list="selectedPromo" /></template> -->
                  <HotPromotion :list="selectedPromo" />
                  <!-- promo.redirectUrl -->
                </div>
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
    <MoneyRainModal />
    <q-btn icon="close" round dense v-close-popup @click="backToPromoList()" class="money-rain-close" />
  </q-dialog>
</template>

<script lang="js">
import {ref, computed, defineComponent, onMounted, reactive, watch, onBeforeUnmount, onActivated} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useUI} from "stores/ui";
import {userStore} from "stores/index";
// import { loadPromo } from "src/api/index/promo.js";
// import { loadPromoBanner } from "src/api/index/promo";
import ProfileSummary from "components/ProfileSummary.vue";
import HotPromotion from 'components/HotPromotion'
import GameModal from "components/modal/GameModal.vue";
import { t } from "src/boot/lang";
// import HotPromotion from 'components/HotPromotion'
import MoneyRainModal from "components/modal/MoneyRainModal.vue";

export default defineComponent({
  name: "PromoView",
  components: {
    GameModal,
    HotPromotion,
    ProfileSummary,
    MoneyRainModal
  },
  setup() {
    const store = userStore();
    const imgURL = process.env.IMAGE_CDN + '/promo/';
    const banner = ref([]);
    const vipPromoTab = ref("promo");
    const promoState = reactive({
      active: {value: 'ALL', label: 'ALL'},
      promoList: [],
    });
    const promoTypes = ref([
      {code: "ALL", img: 'all', label: '所有游戏'},
      {code: "ESPORTS", img: 'esport', label: '电竞'},
      {code: "SPORTS", img: 'sport', label: '体育'},
      {code: "POKER", img: 'poker', label: '棋牌'},
      {code: "LIVE CASINO", img: 'live', label: '真人娱乐'},
      {code: "FISH", img: 'game', label: '老虎机/捕鱼'},
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
      if (route.query.name) {
        isPromoDetail.value = true;
      }

      loadBanner();
      loadAll();
      updateCountdown();
      store.getUnreadTotal();
    });

    // onMounted(() => {
    //   loadAll();
    // });

    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.name
        ui.setScrollPosition("vertical", 0, 200);
      }
    });

    watch(() => vipPromoTab.value, () => {
      if (vipPromoTab.value === 'vip') {
        router.push('/vip');
      }
    })

    watch(() => route.path, () => {
      if (route.path === '/promo') {
        vipPromoTab.value = 'promo';
      }
    })

    const isPromoDetailPage = ref(false);

    const backToPromoList = () => {
      router.push('/promo');
      isPromoDetailPage.value = false
    }

    const loadBanner = () => {
      // loadPromoBanner("PROMO").then((res) => {
      //   if (res.code === 0) {
      //       banner.value = res.data[0]
      //   }
      // })
      api
        .get("/promo/banner?category=PROMO")
        .then((response) => {
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
        })
    }

    const isMoneyRainModal = ref(false);

    const showPromoDetails = (promo) => {
      if (!store.token) {
        // isDisplayLogin.value = true

        $q.notify({
          color: "negative",
          position: "top",
          message: t("notify.plsLoginToContinue"),
          icon: "report_problem"
        });
        router.push(`/login`)
      } else {
        if (promo.redirectUrl && promo.redirectUrl.includes("page-vip")) {
          router.push({path: '/account/vip'});
        } else {
          if (promo.redirectUrl === 'pak-redpacketrain') {
            isMoneyRainModal.value = true;
          } else {
            if (route.query.fromAccount) {
              router.push({path: '/promo', query: {name: promo.redirectUrl, fromAccount: true}})
            } else {
              router.push({path: '/promo', query: {name: promo.redirectUrl}})
            }
            isPromoDetail.value = true
            selectedPromo.value = promo
          }
        }
      }
    }
    const switchPromoType = (type) => {
      promoTabActive.value = type.value;
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {
          return promo.promoType.toLowerCase().split(',').includes(type.value.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList
      }
    };

    const loadAll = () => {
      const platformApiUrl = store.token ? "/session/loggedInPromoPages" : "/promo/page";

      api.get(platformApiUrl).then((res) => {
        if (res.code === 0) {
          promoState.promoList = [];
          var promoItems = res.data;
          // promoState.promoList.push(...res.data);

          promoItems.forEach(element => {
            if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
              // promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
            } else {
              promoState.promoList.push(element);

              if (route.query.name && String(element.redirectUrl) === route.query.name) {
                showPromoDetails(element)
              }
            }
          });

          switchPromoType(promoState.active)
        }
      }).catch((e) => {
        console.log("error", e);
      });

    }

    const goToJoinNow = () => {
      // console.log(selectedPromo.value);
      if (selectedPromo.value.param) {
        try {
          const paramJson = JSON.parse(selectedPromo.value.param);
          console.log(paramJson);
          if (paramJson && paramJson.page) {
            router.push(paramJson.page)
          } else if (paramJson && paramJson.html) {
            window.open(paramJson.html, "_blank");
          } else if (paramJson && paramJson.game) {
            const openPattern = /^\/open\/(.*)/;
            const extractedUrl = paramJson.game.match(openPattern)[1];
            const [gameName, platformCode, gameCode, gameStatus, gameType, gameId] = extractedUrl.split("/");
            playGame(gameName, platformCode, gameCode, gameStatus, gameType, gameId);
          }else if (paramJson && paramJson.api) {
            const apiParams = (paramJson && paramJson.params) ? paramJson.params : {};
            api.get(paramJson.api, {params: apiParams}).then((res) => {
              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "Success.",
                  icon: "check_circle_outline"
                })
              }
            }).catch((e) => {
              $q.notify({
                color: "negative",
                position: "top",
                message: e.message,
                icon: "report_problem"
              })
            });
          }
        } catch (e) {
          console.log("PArse Error");
        }
      } else if (selectedPromo.value.redirectUrl === "EarnMoney") {
        router.push('/earn-money')
      } else if (selectedPromo.value.redirectUrl === "VIPrewards") {
        router.push('/vip')
      } else if (selectedPromo.value.redirectUrl === "Deposit") {
        router.push('/deposit?from=/promo');
      } else if (selectedPromo.value.redirectUrl === "Withdraw") {
        router.push('/withdraw?from=/promo');
      } else if (selectedPromo.value.redirectUrl.indexOf("https://") > -1 || selectedPromo.value.redirectUrl.indexOf("http://") > -1) {
        window.open(selectedPromo.value.redirectUrl, "_blank");
      } else if (selectedPromo.value.redirectUrl) {
        router.push(selectedPromo.value.redirectUrl);
      }
    }

    const allGames = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
      allGames.value.open(gameName, platformCode, gameCode, gameType);
    };

    const goToVip = () => {
      router.push('/vip')
    }

    // promo timer
    const endDate = new Date('01/8/2024 12:00:00').getTime();
    const countdown = ref('');
    const isPromotionEnded = ref(false);

    function getCountdown() {
      const now = new Date().getTime();
      const timeRemaining = endDate - now;

      if (timeRemaining <= 0) {
        isPromotionEnded.value = true;
        return 'Promotion Ended';
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

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
    const swipeRight = () => {
    };

    const fullGameDialog = ref(false);
    const closeFullGameDialog = () => {
      fullGameDialog.value = false;
    };

    const tab = ref("all");
    const tabItems = [
      { name: "all", label: 'promo.all' },
      { name: "earn", label: 'promo.earn' },
      { name: "hot", label: 'promo.hot' },
      { name: "new user", label: 'promo.new_user' },
      { name: "sports", label: 'promo.sports' },
      { name: "live", label: "promo.live" },
      { name: "slot", label: "promo.slot" },
      { name: "vip", label: "promo.vip" },
    ];

    // promo param split.
    const parsedParam = computed(() => {
      try {
        if (selectedPromo.value && selectedPromo.value.param) {
          return JSON.parse(selectedPromo.value.param);
        }
        return {};
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return {};
      }
    });

    const parsedParamSub = computed(() => parsedParam.value.sub || '');
    const parsedParamDate = computed(() => parsedParam.value.date || '');

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
      isMoneyRainModal
    }
  },
});
</script>
<style lang="scss" scoped>
.vip-promo-tab-wrapper {
  width: 90%;
  margin: 0 auto;

  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    color: #5f6061;
    font-weight: 400;
    width: 50%;
  }

  .vip-promo-tab-toggle {
    background: url(../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: white;
      // background: url(../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
      // background-size: 100% 100%;
      background: linear-gradient(
        180deg,
        rgba(97, 255, 0, 0) 0%,
        rgba(97, 255, 0, 0.25) 50.5%,
        rgba(97, 255, 0, 0) 100%
      );
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      &:before {
        content: "";
        background-color: #70bc62;
        height: 3px;
        border-radius: 4px;
        width: 30%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
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
    padding-bottom: 20px;
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
        // margin-top: 30px;
        // display: grid;
        // margin-top: 20px;
        // grid-template-columns: 1fr;

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
          // background: radial-gradient(68.92% 68.92% at 50% 50%, #1d341d 0%, #466a45 100%);
          box-shadow: 0px 7.5px 20px 0px #1411321a;
          background: rgba(255, 255, 255, 0.1);

          img {
          }

          cursor: pointer;

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            // border-radius: 10px 10px 0 0;

            .promo-bg {
              transition: all 0.5s ease;
              // background-size: cover;
              background-position: center center;
              background-size: 100% 100%;
              margin: 0;
              // border-radius: 10px 10px 0 0;
              // border-radius: 17px;

              &:hover {
                transform: scale(1.2);
              }

              display: flex;
              // height: 160px;
              justify-content: center;
              align-items: flex-start;
              gap: 30px;

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
            // position: absolute;
            // text-align: right;
            // border-radius: 0 0 10px 10px;

            // left: 0;
            // bottom: 0;
            // width: 100%;
            // background-color: #272c3d;
            // display: flex;
            // justify-content: flex-end;
            // align-items: center;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background: #2b2b2b;

            .viewdetail {
              // background: #002a35;
              color: #ffffff;
              font-size: 14px;
              // position: absolute;
              position: relative;
              width: 100%;
              z-index: 2;
              bottom: 0px;
              height: 40px;
              overflow: hidden;
              line-height: 40px;
              padding: 0 100px 0 16px;
              font-weight: 500;
              // background: linear-gradient(356.25deg, rgba(0, 0, 0, 0.6) -0.21%, rgba(0, 0, 0, 0.6) 93.65%);
              background: #2b2b2b;
              font-family: Poppins;
              font-size: 15.3px;
              font-weight: 700;

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
        &:after {
          content: "";
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(255, 255, 255, 0));
          position: absolute;
          top: 0;
          left: 0;
          height: 80px;
          width: 100%;
        }

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
        margin: 20px auto;
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

          th {
            padding: 5px;
            text-align: center;
            // background-image: linear-gradient(0deg, #07414c 0, #058096 100%), linear-gradient(#d0d1d3, #d0d1d3);
            background: linear-gradient(180deg, #70bc62 0%, #33562d 100%);

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
          // background: #272c3d;
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
    // background: #2b501d;
    width: calc(100% - 40px);
    margin: 10px 20px 0;
  }

  .q-tab {
    min-height: 40px;
    color: #8c968f;
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

  .q-tab--inactive {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  .q-tab--active .q-tab__indicator {
    width: 100%;
    height: 2px;
    background: #70bc62;
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
</style>
