<template>
  <div class="promo-container">
    <div
      class="promo"
      :style="
        'background-image: url(' +
        imgURL +
        (selectedPromo.mobileImgBackgroundUrl ? selectedPromo.mobileImgBackgroundUrl : '') +
        ')'
      "
    >
      <q-tabs
        v-if="!isPromoDetail"
        v-model="tab"
        align="justify"
        class="promo-cat-tab"
        :class="extensionState ? 'extension-tab' : ''"
      >
        <q-tab
          v-for="(tab, i) in currentTabItems"
          :key="i"
          :name="tab.name"
          :label="langVal === 'vi' ? tab.label_vi : tab.label"
          no-caps
        />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="(tab, i) in currentTabItems" :key="i" :name="tab.name">
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
                  <div
                    class="promo-item"
                    v-if="tab.name === 'all' || promo.promoType.toLowerCase().split(',').includes(tab.name)"
                  >
                    <a @click="showPromoDetails(promo)">
                      <div>
                        <div class="promo-label" v-if="promo.labelType !== 2">
                          <div
                            class="promo-ribbon"
                            :class="{
                              labelhot: promo.labelType === 1,
                              labelrecommend: promo.labelType === 3 || promo.labelType === 5,
                              labellimit: promo.labelType === 6,
                              labelnew: promo.labelType === 0,
                              labelother:
                                promo.labelType !== 6 &&
                                promo.labelType !== 1 &&
                                promo.labelType !== 0 &&
                                promo.labelType !== 3 &&
                                promo.labelType !== 5
                            }"
                          >
                            {{ getPromoLabel(promo.labelType) }}
                          </div>
                          <div
                            class="promo-item-date"
                            v-if="parsedParam(promo.param).date"
                            v-html="parsedParam(promo.param).date"
                          />
                        </div>

                        <div class="promo-item-title">{{ promo.title }}</div>
                        <div
                          class="promo-item-deal"
                          v-if="parsedParam(promo.param).sub"
                          v-html="parsedParam(promo.param).sub"
                        />
                        <div>
                          <q-btn
                            :label="$t('lang.view_detail')"
                            no-caps
                            dense
                            color="brightbtn"
                            class="promo-item-btn"
                          />
                        </div>

                        <div class="promo-item-side-img">
                          <img :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="selected-promo">
            <div class="loader" v-if="isFetchingPromo" />

            <div class="selected-promo-wrapper">
              <div class="banner-container" v-if="selectedPromo && selectedPromo.mobileBannerUrl">
                <img
                  class="promo-content"
                  :src="imgURL + selectedPromo.mobileBannerUrl"
                  style="display: block; width: 100%"
                />
              </div>
              <div
                class="inner"
                :class="{
                  isEurocup24: selectedPromo.redirectUrl === 'vnm-eurocup24',
                  isEurocup24Bet: selectedPromo.redirectUrl === 'vnm-euro-2024-bet-reward',
                  isEurocupLucky: selectedPromo.redirectUrl === 'vnm-eurocup-luckydraw',
                  'new-player': selectedPromo.redirectUrl === 'vnm-newplayer-welcome'
                }"
              >
                <!-- <h2>{{ selectedPromo.title }}</h2> -->

                <div v-if="selectedPromo.hasPromo">
                  <HotPromotion :list="selectedPromo" />
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
                  <div v-if="selectedPromo.redirectUrl !== 'vnm-xmas-new-year-lucky-draw'" v-html="selectedPromo.pageContent"></div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <q-dialog class="modal-common-div" width="100%" v-model="isDisplayLogin">
    <q-card style="width: 100%; padding: 10px 12px 20px" class="bg-white text-black text-center">
      <div class="headers">
        <div style="width: 2.4em">&nbsp;</div>
        <div class="titles">{{ $t("lang.system_hint") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <q-card-section class="q-mb-lg">
        <div class="contents">{{ $t("lang.system_please_login") }}</div>
      </q-card-section>
      <router-link to="/login?redirect=/promo">
        <q-btn class="common-md-btn" :label="$t('lang.system_confirm')" />
      </router-link>
    </q-card>
  </q-dialog>
</template>

<script lang="js">
import { ref, defineComponent, onActivated, reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { cached } from "boot/cache";
import { useUI } from "stores/ui";
import { userStore } from "stores/index";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";
import LocalStorage from "boot/local-storage";
import { useLocalStorage } from "@vueuse/core";
import HotPromotion from "components/HotPromotion";
import { useI18n } from "vue-i18n";
import { EDITION } from "src/constant/edition";

export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion
  },
  setup() {
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    const banner = ref([]);
    const { t } = useI18n();

    const langVal = localStorage.getItem("languageLocale") || "vi";
    const promoState = reactive({
      active: { value: "ALL", label: "ALL" },
      promoList: []
    });
    const promoTypes = ref([{ code: "ALL", img: "all", label: t("lang.type_all") }]);

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

    // const routeQuery  = computed(() => route.query || {});

    const tab = ref("all");
    const tabItems = ref([
      { name: "all", label: t("lang.type_all") },
      { name: "sport", label: t("lang.type_sport") },
      { name: "live casino", label: t("lang.type_livecasino") },
      { name: "slot game", label: t("lang.type_slot") },
      // { name: "esport", label: t("lang.type_esport") },
      // {name: "fish", label: '捕鱼'},
      { name: "others", label: t("lang.type_others") }
    ]);
    const slotTabItems = computed(() => [
      { name: "all", label: t("lang.type_all"), label_vi: t("lang.type_all") },
      { name: "slot welcome", label: t("lang.type_slot_welcome"), label_vi: t("lang.type_slot_welcome") },
      { name: "slot daily", label: t("lang.type_slot_daily"), label_vi: t("lang.type_slot_daily") },
      { name: "slot other", label: t("lang.type_slot_other"), label_vi: t("lang.type_slot_other") }
    ]);
    const currentTabItems = computed(() => {
      return tabItems.value;
      // switch (ui.edition) {
      //   case EDITION.SLOT:
      //     return slotTabItems.value;
      //   case EDITION.NORMAL:
      //   default:
      //     return tabItems.value;
      // }
    });

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
          // console.log(banner.value)
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: ret.message,
          //   icon: "report_problem"
          // });
        }
      });
    };
    const showPromoDetails = (promo) => {
      // extension
      if (extensionState.value) {
        if (promo.redirectUrl.includes("page-vip")) {
          router.push({ path: "/vip", query: { token: extensionToken.value } });
        } else {
          router.push({ path: currentPath.value, query: { name: promo.redirectUrl, token: extensionToken.value } });
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
          router.push("/account/vip?from=promo");
        } else {
          if (isAndroid()) {
            // modalVisible.value= true;
            var preUrl = "https://" + store.h5Url + `/promoapp?name=${promo.redirectUrl}&token=${store.token}`;
            // alert(preUrl);
            console.log(preUrl);
            // promoSrc.value= preUrl;
            var ref = cordova.InAppBrowser.open(preUrl, "_blank", "location=no,zoom=no,footer=no");

            ref.addEventListener("loadstart", function (event) {
              var url = event.url;
              // alert("This" + url);
              if (url.indexOf("vnmapp:") > -1) {
                var message = url.split("vnmapp:")[1];
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
        // }
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
    const loadTabs = async () => {
      var params = "HOME";
      switch (ui.edition) {
        case EDITION.SLOT:
          params = "SLOT";
          break;
        case EDITION.NORMAL:
        default:
          params = "HOME";
      }

      const key = "PROMOTION_TYPES";
      cached
        .get(key, () => api.get(`/promo/type?category=${params}`))
        .then((res) => {
          tabItems.value = res.map(({ value, name, iconUrl }) => ({
            code: value,
            name: value.toLowerCase(),
            label: name ? JSON.parse(name).H5 : "",
            label_vi: name ? JSON.parse(name).H5_vi : ""
          }));

          if (params === "SLOT") {
            const allItem = tabItems.value.find((item) => item.code === "ALL");
            const slotGameItem = tabItems.value.find((item) => item.code === "SLOT GAME");
            const filteredArr = tabItems.value.filter((item) => item.code !== "ALL" && item.code !== "SLOT GAME");
            const newArr = [];
            if (allItem) newArr.push(allItem); // 放到第一位
            if (slotGameItem) newArr.push(slotGameItem); // 放到第二位
            newArr.push(...filteredArr); // 添加其余的项目

            tabItems.value = newArr;
          }

          if (tabItems.value.length > 0) {
            promoTabActive.value = tabItems.value[0].name;
          } else {
            console.warn("No promo types loaded, using default promo types.");
          }
        });
    };

    const loadAll = async () => {
      await loadTabs();
      const platformApiUrl = "/opt-session/promo/page";
      let siteType;
      switch (ui.edition) {
        case EDITION.SLOT:
          siteType = "SLOT";
          break;
      }

      isFetchingPromo.value = window.location.pathname === "/promoapp";

      api
        .get(platformApiUrl, { params: { siteType } })
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

              if (
                (route.query.name === "lh1-invite-2" || route.query.name === "lh1-invite-3") &&
                String(element.redirectUrl) === "lh1-invite"
              ) {
                showPromoDetails(element);
              }

              if (route.query.name && String(element.redirectUrl) === route.query.name) {
                showPromoDetails(element);
              }

              if (route.query.name === "/vip") {
                router.push("/account/vip");
              }
              // }
            });

            // console.log("route.query.name", route.query.name);

            switchPromoType(promoState.active);
            isFetchingPromo.value = false;
          }
        })
        .catch((e) => {
          console.log("error", e);
          isFetchingPromo.value = false;
        });
    };

    // extension
    const currentPath = ref(route.path);
    const extensionState = ref(false);
    const extensionToken = ref("");

    const checkExtension = () => {
      if (currentPath.value === "/promoapp") {
        // const eToken = ref(route.query.name);
        extensionToken.value = route.query.token;
        extensionState.value = true;
      }
    };

    const parsedParam = (paramData) => {
      const newData = JSON.parse(paramData);
      return newData;
    };

    const getPromoLabel = (labelType) => {
      switch (labelType) {
        case 0:
          return "Mới nhất";
        case 1:
          return "Hot";
        case 3:
          return "Đề xuất";
        case 4:
          return "Hàng ngày";
        case 5:
          return "Thành viên mới";
        case 6:
          return "TIME Thời gian";
        default:
          return "";
      }
    };

    onActivated(() => {
      isPromoDetail.value = false;
      selectedPromo.value = {};
      // if promo name is present, do not show promo list on first load
      if (route.query.name) {
        isPromoDetail.value = true;
      }

      checkExtension();
      // loadBanner();
      loadAll();
    });

    return {
      promoState,
      langVal,
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
      parsedParam,
      getPromoLabel,
      checkExtension,
      currentPath,
      extensionState,
      extensionToken,
      isFetchingPromo,
      currentTabItems
    };
  }
});
</script>

<style lang="scss">
.promo-container {
  min-height: 100vh;
  background: $secondary;
  color: $dark;

  .promo {
    background-position: bottom center;
    background-size: cover;
    background-attachment: fixed;
  }

  a {
    color: $primary;
    font-size: 1rem;
    display: block;
    line-height: 1;
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

      img {
        width: 100%;
      }
    }

    .promo-main-container {
      width: $box-width;
      margin-left: auto;
      margin-right: auto;

      .promo-type-wrapper {
        display: flex;
        justify-content: center;

        ::-webkit-scrollbar {
          display: none;
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
        margin-top: 1rem;
        flex-direction: column;

        .promo-item {
          position: relative;
          transform: scale(1);
          animation-name: scalein;
          animation-duration: 1s;
          transition: 0.4s ease-in;
          margin-bottom: 1rem;
          overflow: hidden;
          cursor: pointer;
          background-image: url(../assets/images/promo/promo-item-bg.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          padding: 32px 24px 16px;
          position: relative;
          border-radius: 12px;

          .promo-label {
            height: 24px;
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
          }

          .promo-ribbon {
            position: relative;
            color: #ffffff;
            font-size: 0.75rem;
            overflow: hidden;
            padding: 4px 20px 4px 8px;
            background: linear-gradient(90deg, #464cc2 0.15%, #aea2ef 94.25%);

            &:after {
              content: "";
              position: absolute;
              top: 0;
              right: 0;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 40px 25px 30px 0;
              border-color: transparent #f6f8fc transparent transparent;
              overflow: hidden;
            }

            &.labelhot {
              background: linear-gradient(89.92deg, #d7353f 0.06%, #fea4a4 106.89%, #a4ceff 106.9%);
            }

            &.labellimit {
              background: linear-gradient(89.92deg, #454bc2 0.06%, #b1a5f0 106.9%);
            }

            &.labelnew {
              background: linear-gradient(89.92deg, #eaa318 0.06%, #f0dba5 106.9%);
            }

            &.labelrecommend {
              background: linear-gradient(89.92deg, #6db73f 0.06%, #a5f0b6 106.9%);
            }

            &.labelother {
              background: linear-gradient(89.92deg, #4da9ff 0.06%, #a4ceff 106.9%);
            }
          }

          .promo-item-date {
            color: #606479;
            font-size: 0.825rem;
            font-weight: bold;
            padding-left: 12px;
            // position: absolute;
            // top: 5px;
            // left: 100px;
          }

          .promo-item-title {
            color: $primary;
            font-weight: bold;
            font-size: 1rem;
            max-width: 160px;
            font-family: "Roboto";
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 3.3rem;
            display: flex;
            align-items: center;

            @media (min-width: 500px) {
              max-width: calc(100% - 220px);
            }
          }

          .promo-item-deal {
            color: $grey-color;
            font-weight: bold;
            font-size: 0.875rem;
            max-width: 160px;

            @media (min-width: 500px) {
              max-width: calc(100% - 220px);
            }

            & > span {
              color: $primary;
            }
          }

          .promo-item-btn {
            padding-left: 16px;
            padding-right: 16px;
            border-radius: 8px;
            font-size: 0.75rem;
            margin-top: 6px;
          }

          .promo-item-side-img {
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
            // height: 70%;

            img {
              display: block;
              height: 100%;
              max-height: 112px;
              width: auto;
              margin-left: auto;

              @media (min-width: 500px) {
                max-height: 130px;
              }
            }
          }

          img {
            width: 100%;
            height: auto;
          }

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;

            .promo-bg {
              transition: all 0.5s ease;
              background-size: cover;
              background-position: center center;
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 30px;

              &:hover {
                opacity: 0.9;
              }

              &:active {
                filter: brightness(0.85);
                transform: translate(0px, 1px);
              }

              .promo-content {
                width: 100%;
                //width: unset;
                height: auto;

                &.isDesktop {
                  display: block;
                }

                &.isMobile {
                  display: none;
                }
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
      .banner-container {
        width: 100%;

        .promo-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          overflow: hidden;
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

        &.isEurocup24 {
          width: 100%;
          margin: 0px;
        }
        &.isEurocup24Bet {
          width: 100%;
          margin: 0px;
          background: #e7f1fd;
        }
        &.isEurocupLucky {
          background: #e7f1fd;
          margin: 0px;
          width: 100%;
        }
        &.new-player {
          background: #e7f1fd;
          margin: 0px;
          width: 100%;
        }

        h2 {
          font-size: 18px;
          font-weight: bold;
          margin: 5px auto 6px;
          line-height: 20px;
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
            background-color: #e7f3ff;
          }

          td {
            padding: 5px;
            text-align: center;
            background-color: #ffffff;
            border: 1px solid #ecedf0;
          }
        }

        img {
          width: 100%;
          display: block;
        }

        // .hot-promo {
        //   background: #272c3d;
        //   border-radius: 10px;
        // }
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
  bottom: 10px;
  left: 0;
  width: 100%;
}

.promo {
  .q-tabs {
    background: $secondary;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 8px;
    // box-shadow: 0px -6px 6px 0px #c3d4e6 inset;

    .q-tab {
      color: $font-1;
      font-size: 1rem;
    }

    .q-tab__label {
      font-size: 1rem;
      font-weight: normal;
    }

    .q-tab--active {
      color: $primary;
      opacity: 1;

      .q-tab__label {
        color: $primary;
        font-weight: bold;
      }
    }

    .q-tab__content {
      min-width: 26px;
    }
  }

  .q-tab {
    min-height: 40px;
  }

  .q-tab__content {
    width: 100%;
  }

  // .q-tab--active .q-tab__indicator {
  //   background-color: $primary;
  //   background-size: 20px 10px;
  //   width: 80%;
  //   margin: 0 auto 3px;
  //   height: 3px;
  // }

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

.promo-cat-tab {
  position: sticky;
  top: 42px;
  z-index: 3;

  &.extension-tab {
    top: 0;
  }
}
</style>
