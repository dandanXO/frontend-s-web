<template>
  <!-- <pre>token: {{ extensionToken }}</pre>
  <pre>state: {{ extensionState }}</pre>
  <pre>path: {{ currentPath }}</pre>
  <pre>store: {{ store }}</pre> -->
  <div class="promo-container">
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
                  class="promo-item"
                  v-for="(promo, i) in filteredArray"
                  :key="i"
                  data-aos="zoom-in"
                  data-aos-easing="ease-out"
                  data-aos-duration="1000"
                >
                  <template v-if="promo.promoType.toLowerCase().split(',').includes(tab.name)">
                    <a @click="showPromoDetails(promo)">
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                        <!-- <span class="detaildate">活动时间：{{ promo.date }}</span> -->
                      </div>
                      <div class="pad-label label-new" v-if="!!getPromoLabel(promo.labelType)">
                        {{ getPromoLabel(promo.labelType) }}
                      </div>
                    </a>
                  </template>

                  <template v-if="tab.name === 'all'">
                    <a @click="showPromoDetails(promo)">
                      <div class="promo-img-wrapper">
                        <div class="promo-bg">
                          <img class="promo-content" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                      <div class="promo-info">
                        <span class="viewdetail">{{ promo.title }}</span>
                        <!-- <span class="detaildate">活动时间：{{ promo.date }}</span> -->
                      </div>
                      <div class="pad-label label-new" v-if="!!getPromoLabel(promo.labelType)">
                        {{ getPromoLabel(promo.labelType) }}
                      </div>
                    </a>
                  </template>

                  <!-- <template v-if="tab.name === promo.promoType.toLowerCase()"> -->

                  <!-- </template> -->
                </div>
              </div>
            </div>
          </div>
          <div v-else class="selected-promo">
            <div class="loader" v-if="isFetchingPromo" />
            <div class="selected-promo-wrapper">
              <div class="banner-container">
                <!-- <div
                  class="promo-bg"
                  :style="
                    'background-image: url(' +
                    imgURL +
                    (selectedPromo.mobileBannerUrl
                      ? selectedPromo.mobileBannerUrl
                      : selectedPromo.mobileImgUrl) +
                    ')'
                  "
                ></div> -->
                <div>
                  <img
                    v-if="!!imgURL && !!selectedPromo.mobileBannerUrl"
                    :src="imgURL + selectedPromo.mobileBannerUrl"
                    style="width: 100%; display: block"
                  />
                </div>
              </div>
              <div class="inner">
                <div v-if="selectedPromo.hasPromo || selectedPromo.id === 259">
                  <HotPromotion :list="selectedPromo" />
                </div>
                <div
                  v-if="selectedPromo.promoType"
                  :class="{
                    welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
                    sport: selectedPromo.promoType.toLowerCase() === 'sport',
                    eSport: selectedPromo.promoType.toLowerCase() === 'esport',
                    fish: selectedPromo.promoType.toLowerCase() === 'fish',
                    liveCasino: selectedPromo.promoType.toLowerCase() === 'livecasino',
                    slot: selectedPromo.promoType.toLowerCase() === 'slot game'
                  }"
                >
                  <div v-if="selectedPromo.id !== 259" v-html="selectedPromo.pageContent"></div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDisplayLogin">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black text-right">
      <q-card-section class="q-mb-md gologin-popup">
        <strong>
          <RiErrorWarningLine />
          系统提示
        </strong>
        请登录后再操作
      </q-card-section>
      <router-link to="/login?redirect=/promo">
        <q-btn label="确认" color="dyblue" />
      </router-link>
    </q-card>
  </q-dialog>
</template>

<script lang="js">
import {ref, defineComponent, onActivated, reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useUI} from "stores/ui";
import {userStore} from "stores/index";
import {RiErrorWarningLine} from "vue-remix-icons";
import {isAndroid} from "boot/utils";
import {SessionStorage} from "quasar";
import LocalStorage from "boot/local-storage";
// import { loadPromo } from "src/api/index/promo.js";
// import { loadPromoBanner } from "src/api/index/promo";

import HotPromotion from "components/HotPromotion";
// import HotPromotion from 'components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion, RiErrorWarningLine,
  },
  setup() {
    const store = userStore();
    const imgURL = process.env.IMAGE_CDN + "/promo/";
    const banner = ref([]);
    const promoState = reactive({
      active: {value: "ALL", label: "ALL"},
      promoList: []
    });
    const promoTypes = ref([
      {code: "ALL", img: "all", label: "所有游戏"},
      {code: "ESPORTS", img: "esport", label: "电竞"},
      {code: "SPORTS", img: "sport", label: "体育"},
      {code: "POKER", img: "poker", label: "棋牌"},
      {code: "LIVE CASINO", img: "live", label: "真人娱乐"},
      {code: "FISH", img: "game", label: "老虎机/捕鱼"}
    ]);
    const getPromoLabel = (labelType) => {
      switch(labelType) {
        case 0:
          return '最新';
        case 1:
          return '热门';
        case 3:
          return '推荐';
        case 4:
          return '日常';
        case 5:
          return '新人';
        case 6:
          return '限时';
        default:
          return '';
      }
    }
    const isFetchingPromo = ref(false);
    const promoTabActive = ref(promoTypes.value[0].value);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
        const $q = useQuasar();
    const ui = useUI();
    const isDisplayLogin = ref(false);

    const tab = ref("all");
    const tabItems = [
      {name: "all", label: '全部'},
      {
        name: "sport",
        label: "体育"
      },
      {name: "fish", label: '捕鱼'},
      {name: "live casino", label: '真人'},
      {
        name: "slot game",
        label: "电子"
      }
    ];

    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false;
      } else {
        isPromoDetail.value = route.query.name;
        // ui.setScrollPosition("vertical", 0, 200);
      }
    });
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
      // extension
      if(extensionState.value) {
        if (promo.redirectUrl.includes("page-vip")) {
          router.push({path: "/vip", query: {token: extensionToken.value}});
        }else{
          router.push({path: currentPath.value, query: {name: promo.redirectUrl, token: extensionToken.value}});
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
        // non extension
        if (!store.token) {
          isDisplayLogin.value = true;
        } else {
          if (promo.redirectUrl.includes("page-vip")) {
            router.push({path: "/account/vip"});
          } else {
            if (route.query.fromAccount) {
              router.push({path: "/promo", query: {name: promo.redirectUrl, fromAccount: true}});
            } else {
              router.push({path: "/promo", query: {name: promo.redirectUrl}});
            }
            isPromoDetail.value = true;
            selectedPromo.value = promo;
          }
        }
      }
    };

    const switchPromoType = (type) => {
      promoTabActive.value = type.value;
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {

          return (promo.promoType.toLowerCase()).includes(type.value.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList;
      }
    };

    const loadAll = () => {
      const platformApiUrl = (store.hasToken() && window.location.pathname !== "/promotion") ? "/session/loggedInPromoPages" : "/promo/page";

      isFetchingPromo.value = window.location.pathname === "/promotion";

      api.get(platformApiUrl).then((res) => {
        if (res.code === 0) {
          promoState.promoList = [];
          var promoItems = res.data;

          promoItems.forEach((element) => {
            if ((store.memberType !== "TEST" && element.privilegeStatus === "TEST")) {
            } else {
              promoState.promoList.push(element);
              // console.log(promoState.promoList);

              if (route.query.name && String(element.redirectUrl) === route.query.name) {
                showPromoDetails(element);
              }
            }
          });
          // console.log("Final Promos");
          // console.log(promoState.promoList);
          switchPromoType(promoState.active);
          isFetchingPromo.value = false;
        }
      }).catch((e) => {
        console.log("error", e);
        isFetchingPromo.value = false;
      });
    };

    // extension
    const currentPath = ref(route.path);
    const extensionState = ref(false)
    const extensionToken = ref('')


    const checkExtension = () => {
      if (currentPath.value === "/promotion"){
        // const eToken = ref(route.query.name);
        extensionToken.value = route.query.token;
        extensionState.value = true;
      }

    }

    onActivated(() => {
      // if promo name is present, do not show promo list on first load
      if(route.query.name) {
        isPromoDetail.value = true;
      }

      checkExtension();
      loadBanner();
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
      banner,
      imgURL,
      store,
      tab,
      tabItems,
      isDisplayLogin,
      getPromoLabel,
      checkExtension,
      currentPath,
      extensionState,
      extensionToken,
      isFetchingPromo
    };
  }
});
</script>
<style lang="scss">
.promo-container {
  h3 {
    font-size: 18px;
  }
  .selected-promo {
    ol {
      padding: 0 15px;
    }
    table {
      margin: 10px auto 20px;
      width: 98%;
      overflow-x: auto;
      white-space: nowrap;
      border: 0;

      &:not(:has(thead)) {
        tr:first-child td {
          background-image: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
          color: #ffffff;
          border: 0;
        }
      }

      tr {
        td {
          padding: 10px 20px;
          border-bottom: 1px solid #272c3d;

          p {
            margin: 0;
          }
        }
      }

      tbody {
        //display: table;
        table-layout: fixed;
        width: 100%;
      }

      th {
        background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
      }
    }
  }

  a {
    color: #000000;
    font-weight: 600;
    font-size: 17px;
  }
}
</style>
<style lang="scss">
.promo-container {
  color: #000;

  table {
    tbody {
      width: 100%;
      table-layout: fixed;
      //display: table;
    }
  }

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
      // height: 40vw;
      // max-height: 130px;
      // margin: 10px;

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
        display: grid;
        grid-template-columns: 1fr;

        .promo-item {
          position: relative;
          // overflow: hidden;
          cursor: pointer;
          transform: scale(1);
          animation-name: scalein;
          animation-duration: 1s;
          transition: 0.4s ease-in;

          a {
            margin-bottom: 15px;
            display: block;
            box-shadow: 0px 0px 30px -15px #000;
            border-radius: 10px;
            overflow: hidden;
          }

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
              background: #ffffff;
              // border-radius: 4px;
              border-radius: 10px 10px 0 0;

              &:hover {
                transform: scale(1.2);
              }

              display: flex;
              justify-content: center;
              align-items: center;
              gap: 30px;

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
            align-items: flex-start;
            padding: 10px;
            flex-direction: column;

            .viewdetail {
              // color: #000;
              // padding: 0 4px;
              // position: absolute;
              // top: -5px;
              // left: -2px;
              // font-size: 12px;
              // color: #3a3a3a;
              // z-index: 2;
              // width: 100%;
              // // padding: 4px;
              // background: #d2d2de;

              // &:before {
              //   display: block;
              //   content: "";
              //   background: #ffffff;
              //   height: 100%;
              //   width: 70px;
              //   position: absolute;
              //   top: -2px;
              //   right: -2px;
              // }

              // &:after {
              //   display: block;
              //   content: "";
              //   top: -2px;
              //   right: 48px;
              //   position: absolute;
              //   width: 0;
              //   height: 0;
              //   border-left: 20px solid transparent;
              //   border-right: 20px solid transparent;
              //   border-top: 20px solid #ffffff;
              //   transform: rotate(180deg);
              //   clear: both;
              // }
            }

            .detaildate {
              color: #858585;
              font-weight: 400;
              font-size: 14px;
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

        .promo-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          overflow: hidden;
          height: 220px;
        }
      }

      .inner {
        max-width: 1400px;
        width: 90%;
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;

        img {
          margin-bottom: 10px;
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
            background: linear-gradient(0deg, #4fb2ff 0, #6daddf 100%), linear-gradient(#d0d1d3, #d0d1d3);
          }

          td {
            padding: 5px;
            text-align: center;
            background-color: #ffffff;
            border: 1px solid #d0d1d3;
            white-space: pre-wrap;
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

.pad-label.label-new {
  font-size: 12px;
  color: #ffffff;
  padding: 5px;
  position: absolute;
  top: 0px;
  left: 10px;
  background: linear-gradient(180deg, #ff4d42, #ca0c00);
  border-radius: 0 0 10px 10px;
  font-weight: 600;
}

.promo {
  .q-tabs {
    // background: rgba(113, 125, 146, 0.2);
    background: #ffffff;
    box-shadow: 0px 0px 25px -15px #000;
    // width: 100%;
    // margin: 0 auto;
    margin: 10px;
    border-radius: 50px;
    overflow: hidden;
    padding: 5px;
    // font-family: 'Courier Prime';
  }

  .q-tab {
    min-height: unset;
    border-radius: 50px;
    color: #858585;
    padding: 2px 10px 0;
  }

  .q-tab__content {
    width: 100%;
    padding: 10px 0;
  }

  .q-tab--active {
    background: #68bcec;
    color: #ffffff;
  }

  .q-tab__label {
    font-size: 16px;
    line-height: 16px;
    // font-weight: 600;
  }

  .q-tab--active .q-tab__indicator {
    display: none;
    background: url("../assets/images/promotion/tab_bg.png") no-repeat center center;
    background-size: 20px 10px;
    width: 100%;
    height: 10px;
    // background: salmon !important;
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

.gologin-popup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #6c6c6e;
  gap: 15px;

  strong {
    color: #000000;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 20px;
    font-weight: 700;

    svg {
      fill: #0089ed;
    }
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
