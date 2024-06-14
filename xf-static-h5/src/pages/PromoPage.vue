<template>
  <q-card-section v-if="!isPromoDetail" class="page-title">优惠活动</q-card-section>

  <div class="promo-container" style="background: #090b19">
    <div class="promo">
      <q-tabs v-if="!isPromoDetail" v-model="tab" align="justify">
        <q-tab v-for="(tab, i) in tabItems" :key="i" :name="tab.name" :label="tab.label" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
          <div class="all-promotions" v-if="!isPromoDetail">
            <div class="promo-main-container">
              <div class="promo-type-wrapper"></div>
              <div class="promo-list-wrapper">
                <div
                  v-for="(promo, i) in filteredArray"
                  :key="i"
                  data-aos="zoom-in"
                  data-aos-easing="ease-out"
                  data-aos-duration="1000"
                >
                  <div class="promo-item" v-if="promo.promoType.toLowerCase().split(',').includes(tab.name)">
                    <a @click="showPromoDetails(promo)">
                      <div class="pad-title">
                        <span class="pad-right">查看详情&gt;&gt;</span>
                      </div>
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                      <div class="pad-label label-new">最新活动</div>
                    </a>
                  </div>

                  <div class="promo-item" v-if="tab.name === 'all'">
                    <a @click="showPromoDetails(promo)">
                      <div class="pad-title">
                        <span class="pad-right">查看详情&gt;&gt;</span>
                      </div>
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                      </div>
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                      <div class="pad-label label-new">最新活动</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="selected-promo">
            <div class="loader" v-if="isFetchingPromo" />

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

<script lang="js">
import {ref, defineComponent, onMounted, reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {AppFullscreen, useQuasar} from "quasar";
import {useUI} from "stores/ui";
import {userStore} from "stores/index";
import {isAndroid, isHuaweiPhone} from "boot/utils";
import { SessionStorage } from "quasar";
import LocalStorage from "boot/local-storage";
import {useLocalStorage} from "@vueuse/core";

import HotPromotion from 'components/HotPromotion'
// import HotPromotion from 'components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion
  },
  setup() {
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + '/promo/';
    const banner = ref([]);
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
    const isSpecialPromo= ref(false);

    const modalVisible = ref(false);
    const promoSrc= ref("");

    const isFetchingPromo = ref(false);

    // extension
    const currentPath = ref(route.path);
    const extensionState = ref(false);
    const extensionToken = ref("");

    const isAppPromo= ref(false);
    const promoUrl= ref('https://' + store.evip);
    // const appPromoUrl= ref("");

    const checkExtension = () => {
      if (currentPath.value === "/promotion") {
        // const eToken = ref(route.query.name);
        extensionToken.value = route.query.token;
        extensionState.value = true;
      }
    };

    const tab = ref("all");
    const tabItems = [

      { name:"all", label: '全部' },
      { name: "slot game", label: '电子'},
      { name: "fish", label: '捕鱼'},
      { name: "live casino", label: '真人'},
      { name: "poker", label: '棋牌'},
    ];

    const loadGame = () => {
      if (promoSrc.value !== "") {
        logoShow.value = false;
      }
    };


    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.name;
        ui.setScrollPosition("vertical", 0, 200);
      }
    });
    const loadBanner = () => {
      api
        .get("/promo/banner?category=PROMO")
        .then((response) => {
          if (response.code === 0) {
            banner.value = response.data[0];
            // console.log(banner.value)
          } else {
          }
        })
    }
    const showPromoDetails = (promo) => {
      if (promo.promoCode === "cny-hongbaoyu" || promo.promoCode === "xf-eurocup-hongbao" || promo.promoCode === "cny-spinwheel" || promo.redirectUrl === "cny-hongbaoyu" || promo.redirectUrl === "xf-return-promo" || promo.redirectUrl === "xf-deposit-award" || promo.redirectUrl === "xf-eurocup-hongbao") {
        isSpecialPromo.value = true
      } else {
        isSpecialPromo.value = false
      }

      // debugger;
      if (extensionState.value) {

        if (promo.redirectUrl.includes("page-vip")) {
          router.push({path: '/account/vip'});
        } else {
          isAppPromo.value= true;
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

      }else {
          if (promo.redirectUrl.includes("page-vip")) {
            router.push({path: '/account/vip'});
          } else {

            if(true || isAndroid()){
              // modalVisible.value= true;

              var preUrl = `http://192.168.79.121:9090/promotion?name=${promo.redirectUrl}&token=${store.token}`;
              // alert(preUrl);
              // promoSrc.value= preUrl;
              var ref = cordova.InAppBrowser.open(
                preUrl,
                "_blank",
                "location=no,zoom=no"
              );

              window.addEventListener('message', function(event) {
                console.log("Message received from InAppBrowser: ", event.data);
                alert(event.data);
              }, false);

            }else{

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

    const logoShow = ref(true);
    const closeDialog = () => {
      modalVisible.value = false;
      promoSrc.value = "";
    };

    const loadAll = () => {
      const platformApiUrl = (store.hasToken() || (window.location.pathname === "/promotion" && extensionState.value === true)) ? "/session/loggedInPromoPages" : "/promo/page";

      isFetchingPromo.value = window.location.pathname === "/promotion";

      api.get(platformApiUrl).then((res) => {
        if (res.code === 0) {
          promoState.promoList = [];
          var promoItems = res.data;
          promoItems.forEach(element => {
            promoState.promoList.push(element);
            if (route.query.name && String(element.redirectUrl) === route.query.name) {
              showPromoDetails(element)
            }
          });

          switchPromoType(promoState.active)
          isFetchingPromo.value = false;
        }
      }).catch((e) => {
        isFetchingPromo.value = false;
        console.log("error", e);
      });

    }
    onMounted(() => {
      //TODO:: 我觉得没有Banner，所以我隐藏了
      // loadBanner();

      checkExtension();
      loadAll();
    });

    return {
      promoState,
      promoTypes,
      promoTabActive,
      switchPromoType,
      filteredArray,
      isPromoDetail,
      showPromoDetails,
      selectedPromo,
      isSpecialPromo,
      banner,
      imgURL,
      store,
      tab,
      tabItems,
      isDisplayLogin,
      isFetchingPromo,
      // appPromoUrl,
      isAppPromo,
      modalVisible,
      promoSrc,
      closeDialog,
      logoShow,
      loadGame
    }
  },
});
</script>
<style lang="scss">
.promo-container {
  min-height: 100vh;
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
<style lang="scss">
.promo-container {
  color: #ffffff;

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
      //height: 40vw;
      //max-height: 130px;
      margin: 10px;

      img {
        width: 100%;
      }
    }

    .promo-main-container {
      max-width: 1400px;
      width: 95%;
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
          padding-top: 30px;

          img {
          }

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

              &:hover {
                transform: scale(1.2);
              }

              display: flex;
              justify-content: center;
              //align-items: center;
              gap: 30px;

              .promo-content {
                // width: 100%;
                width: 100%;
                //aspect-ratio: 1004/252;
                height: auto;

                //height: 100%;

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
      &.bg__xf-eurocup-hongbao {
        background-color: #090b18;
      }

      &.bg__xf-deposit-award {
        // background-image: url("../assets/images/promotion/hotpromo/deposit-award/bg-img.png");
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
        margin: 20px auto;
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
            border: 1px solid #2e3039;
          }
        }

        img {
          width: 100%;
          display: block;
        }

        .hot-promo {
          background: #272c3d;
          border-radius: 10px;
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
  position: absolute;
  // top: -7px;
  // right: 5px;
  // z-index: 3;
  font-size: 12px;
  // color: #3e5cc0;
  color: #ffffff;
  right: 5px;
  top: 5px;
  z-index: 3;
}

.pad-label.label-new {
  background: url(../assets/promo/yh_label_new.png) no-repeat;
  // background-size: 100%;
  background-size: 78px 45px;
  font-size: 12px;
  color: #ffffff;
  padding: 12px 7px;
  position: absolute;
  bottom: 0px;
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
    background: url("../assets/images/promotion/tab_bg.png") no-repeat center center;
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
</style>
<style scoped lang="scss">
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
