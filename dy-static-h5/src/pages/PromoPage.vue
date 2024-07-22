<template>
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
                  v-for="(promo, i) in filteredArray"
                  :key="i"
                  data-aos="zoom-in"
                  data-aos-easing="ease-out"
                  data-aos-duration="1000"
                >
                  <div class="promo-item" v-if="promo.promoType.toLowerCase().split(',').includes(tab.name)">
                    <a @click="showPromoDetails(promo)">
                      <div>
                        <div class="promo-label">
                          <div class="promo-ribbon" v-if="promo.labelType !== -1 && promo.labelType !== 2">
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
                          <q-btn label="查看详情" dense color="brightbtn" class="promo-item-btn" />
                        </div>

                        <div class="promo-item-side-img">
                          <img loading="lazy" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div class="promo-item" v-if="tab.name === 'all'">
                    <a @click="showPromoDetails(promo)">
                      <div>
                        <div class="promo-label">
                          <div class="promo-ribbon" v-if="promo.labelType !== -1 && promo.labelType !== 2">
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
                          <q-btn label="查看详情" dense color="brightbtn" class="promo-item-btn" />
                        </div>

                        <div class="promo-item-side-img">
                          <img loading="lazy" :src="imgURL + promo.mobileImgUrl" />
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="selected-promo"
            :class="{
              euroCup: selectedPromo.promoCode === 'lh1-eurocup-2024',
              'europe-first-shoot': selectedPromo.promoCode === 'lh1-eurocup-firstshoot'
            }"
          >
            <div class="loader" v-if="isFetchingPromo" />
            <div
              class="selected-promo-wrapper"
              :style="[selectedPromo.promoCode === 'lh1-slot-lucky8' ? 'background:#E7F1FD;' : '']"
            >
              <div
                class="banner-container"
                v-if="
                  selectedPromo &&
                  selectedPromo.mobileBannerUrl &&
                  !isSpecialPromo &&
                  selectedPromo.promoCode !== 'lh1-ftd-promo' &&
                  selectedPromo.promoCode !== 'lh1-aijiasu' &&
                  selectedPromo.promoCode !== 'lh1-eurocup-regen'
                "
              >
                <img
                  loading="lazy"
                  class="promo-content"
                  :src="imgURL + selectedPromo.mobileBannerUrl"
                  style="display: block; width: 100%"
                />
              </div>
              <BlastPremierMarquee v-if="selectedPromo?.redirectUrl === 'dy2-cs2-blast-2024'" />
              <div
                class="inner"
                :class="{
                  lhstepgame:
                    selectedPromo.promoCode === 'lh1-game-steps' ||
                    selectedPromo.promoCode === 'lh-sport-zhongchao' ||
                    selectedPromo.promoCode === 'lh-lpl-summer24',
                  lhcs2: selectedPromo.promoCode === 'lh-cs2-copenhagen-major-2024',
                  lhworldcup: selectedPromo.promoCode === 'lh1worldcup',
                  lhftd: selectedPromo.promoCode === 'lh1-ftd-promo' || selectedPromo.promoCode === 'lh1-intel-esl',
                  lhduanwu:
                    selectedPromo.promoCode === 'lh-duanwujie24' || selectedPromo.promoCode === 'lh1-deposit-rebates',
                  lheuromanual: selectedPromo.promoCode === 'lh-eurocup-manual',
                  meizhoubei: selectedPromo.promoCode === 'lh1meizhoubei',
                  aijiasu: selectedPromo.promoCode === 'lh1-aijiasu',
                  euroRegen: selectedPromo.promoCode === 'lh1-eurocup-regen'
                }"
                :style="[
                  selectedPromo.promoCode === 'lh-eurocup-manual' || selectedPromo.promoCode === 'lh1-deposit-rebates'
                    ? 'background-image: url(' +
                      imgURL +
                      (selectedPromo.mobileImgBackgroundUrl ? selectedPromo.mobileImgBackgroundUrl : '') +
                      ')'
                    : selectedPromo?.promoCode === 'lh1-intel-esl'
                      ? 'url(' + require(`../assets/promo/intel-esl-24/bg.png`) + ')'
                      : ''
                ]"
              >
                <div v-if="selectedPromo.hasPromo">
                  <HotPromotion :list="selectedPromo" />
                </div>
                <div
                  v-if="
                    selectedPromo.promoType &&
                    selectedPromo.promoCode !== 'lh1-game-steps' &&
                    selectedPromo.promoCode !== 'lh-eurocup-manual' &&
                    selectedPromo.promoCode !== 'lh1-aijiasu'
                  "
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
                <div v-if="['lh-cs2-blast-2024'].includes(selectedPromo.promoCode)" class="corner-decor">
                  <img
                    loading="lazy"
                    v-if="selectedPromo.promoCode === 'lh-cs2-blast-2024'"
                    src="../assets/images/promo/hotpromo/CS2CCTPromo/bg.png"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="all-promotions" v-if="!isPromoDetail">
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
                      </div>
                      <div class="pad-label label-new" v-if="!!getPromoLabel(promo.labelType)">
                        {{ getPromoLabel(promo.labelType) }}
                      </div>
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="selected-promo">
            <div class="loader" v-if="isFetchingPromo" />
            <div class="selected-promo-wrapper">
              <div class="banner-container" v-if="!isSpecialPromo">
                <div>
                  <img
                    v-if="!!imgURL && !!selectedPromo.mobileBannerUrl"
                    :src="imgURL + selectedPromo.mobileBannerUrl"
                    style="width: 100%; display: block"
                  />
                </div>
              </div>
              <BlastPremierMarquee v-if="selectedPromo?.redirectUrl === 'dy2-cs2-blast-2024'" />
              <div
                class="inner"
                :class="{
                  lhworldcup: selectedPromo.promoCode === 'dy2worldcup',
                  cny2024: selectedPromo.promoCode === 'dy2-cny2024-promo',
                  hongbaoyu: selectedPromo.promoCode === 'hongbaoyu',
                  cnystepgame: selectedPromo.promoCode === 'dy2-cny-step-game',
                  dy2gamesteps: selectedPromo.promoCode === 'dy2-game-steps',
                  cs2:
                    selectedPromo.promoCode === 'dy2-cs2-copenhagen-major-2024' ||
                    selectedPromo.promoCode === 'dy2-cs2-blast-2024',
                  msi: selectedPromo.promoCode === 'dy2-msi-promo',
                  dyEurocupHongbao: selectedPromo.promoCode === 'dy2-eurocup-hongbao',
                  lplSummer2024: selectedPromo.promoCode === 'dy2-lpl-summer24',
                  eurocupManual: selectedPromo.promoCode === 'dy2-eurocup-manual',
                  duanwujie: selectedPromo.promoCode === 'dy-duanwujie24'
                }"
                :style="{
                  backgroundImage: selectedPromo?.mobileImgBackgroundUrl
                    ? `url(${imgURL + selectedPromo.mobileImgBackgroundUrl})`
                    : 'none'
                }"
              >
                <div v-if="selectedPromo.hasPromo || selectedPromo.id === 259">
                  <HotPromotion :list="selectedPromo" />
                </div>
                <div
                  v-if="
                    selectedPromo.promoType &&
                    selectedPromo.promoCode !== 'dy2-cny-step-game' &&
                    selectedPromo.promoCode !== 'dy2-game-steps'
                  "
                  :class="{
                    welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
                    sport: selectedPromo.promoType.toLowerCase() === 'sport',
                    eSport: selectedPromo.promoType.toLowerCase() === 'esport',
                    fish: selectedPromo.promoType.toLowerCase() === 'fish',
                    liveCasino: selectedPromo.promoType.toLowerCase() === 'livecasino',
                    slot: selectedPromo.promoType.toLowerCase() === 'slot game'
                  }"
                >
                  <div
                    v-if="selectedPromo.id !== 259 && selectedPromo.id !== 241"
                    v-html="selectedPromo.pageContent"
                  ></div>
                </div>
              </div>
            </div>
          </div> -->
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDisplayLogin">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black text-right">
      <q-card-section class="q-mb-md gologin-popup">
        <strong>
          <img class="svg" src="~assets/promo/error-warning-line.svg" />
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
import { ref, defineComponent, onActivated, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useUI } from "stores/ui";
import { userStore } from "stores/index";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";
import LocalStorage from "boot/local-storage";
import HotPromotion from "components/HotPromotion";
// import HotPromotion from 'components/HotPromotion'
import BlastPremierMarquee from "src/components/hotpromo/BlastPremierPromo/BlastPremierMarquee.vue";
export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion,
    BlastPremierMarquee
  },
  setup() {
    const store = userStore();
    const imgURL = process.env.IMAGE_CDN + "/promo/";
    const banner = ref([]);
    const promoState = reactive({
      active: { value: "ALL", label: "ALL" },
      promoList: []
    });
    const promoTypes = ref([
      { code: "ALL", img: "all", label: "所有游戏" },
      { code: "WELCOME", img: "esport", label: "新人" },
      { code: "ESPORTS", img: "esport", label: "电竞" },
      { code: "SPORTS", img: "sport", label: "体育" },
      { code: "POKER", img: "poker", label: "棋牌" },
      { code: "SLOT", img: "game", label: "电子" },
      { code: "VIP", img: "game", label: "VIP" },
      { code: "LIMITED", img: "live", label: "限时" },
      { code: "FTD", img: "live", label: "充提" }
      // { code: "LIVE CASINO", img: "live", label: "真人娱乐" },
      // { code: "FISH", img: "game", label: "老虎机/捕鱼" }
    ]);
    const getPromoLabel = (labelType) => {
      switch (labelType) {
        case 0:
          return "最新";
        case 1:
          return "热门";
        case 3:
          return "推荐";
        case 4:
          return "日常";
        case 5:
          return "新人";
        case 6:
          return "限时";
        default:
          return "";
      }
    };
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
      { name: "all", label: "全部" },
      { name: "welcome", label: "新人" },
      { name: "esport", label: "电竞" },
      {
        name: "sport",
        label: "体育"
      },
      { name: "live casino", label: "真人" },
      {
        name: "slot game",
        label: "电游"
      },
      {
        name: "vip",
        label: "VIP"
      },
      {
        name: "limited",
        label: "限时"
      },
      {
        name: "ftd",
        label: "充提"
      }
      // {
      //   name: "other",
      //   label: "其它"
      // }
    ];

    watch(
      () => route.query,
      () => {
        if (route.query === null) {
          isPromoDetail.value = false;
        } else {
          isPromoDetail.value = route.query.name;
        }
      }
    );
    const loadBanner = () => {
      api.get("/promo/banner?category=PROMO").then((response) => {
        if (response.code === 0) {
          banner.value = response.data[0];
        }
      });
    };
    const isSpecialPromo = ref(false);
    const showPromoDetails = (promo) => {
      if (promo.promoCode === "dy2-cny-step-game" || promo.promoCode === "dy2-game-steps") {
        isSpecialPromo.value = true;
      } else {
        isSpecialPromo.value = false;
      }

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
        // non extension
        if (!store.token) {
          isDisplayLogin.value = true;
        } else {
          if (promo.redirectUrl.includes("page-vip")) {
            router.push({ path: "/account/vip" });
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

    const switchPromoType = (type) => {
      promoTabActive.value = type.value;
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {
          return (
            promo.promoType.toLowerCase().includes(type.value.toLowerCase()) &&
            promo.param !== null &&
            parsedParam(promo.param).date !== "" &&
            parsedParam(promo.param).sub !== ""
          );
        });
      } else {
        filteredArray.value = promoState.promoList.filter(
          (promo) => promo.param !== null && parsedParam(promo.param).date !== "" && parsedParam(promo.param).sub !== ""
        );
      }
    };

    const parsedParam = (paramData) => {
      const newData = JSON.parse(paramData);
      return newData;
    };

    const loadAll = () => {
      const platformApiUrl =
        store.hasToken() || (window.location.pathname === "/promotion" && extensionState.value === true)
          ? "/session/loggedInPromoPages"
          : "/promo/page";

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
          console.log("error", e);
          isFetchingPromo.value = false;
        });
    };

    // extension
    const currentPath = ref(route.path);
    const extensionState = ref(false);
    const extensionToken = ref("");

    const checkExtension = () => {
      if (currentPath.value === "/promotion") {
        extensionToken.value = route.query.token;
        extensionState.value = true;
      }
    };

    onActivated(() => {
      // if promo name is present, do not show promo list on first load
      if (route.query.name) {
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
      isFetchingPromo,
      isSpecialPromo,
      parsedParam
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

    &:hover {
      filter: inherit;
    }
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

      img {
        width: 100%;
      }
    }

    .promo-main-container {
      width: calc(100% - 2rem);
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
            // position: absolute;
            // top: 0;
            // left: 0;
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

            @media (min-width: 500px) {
              max-width: calc(100% - 220px);
            }
          }

          .promo-item-deal {
            color: #a4aabb;
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
            background: linear-gradient(270deg, #3080f4, #70b1ff);
          }

          .promo-item-side-img {
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
            // height: 70%;

            img {
              display: block;
              // height: 100%;
              // width: auto;
              width: 100%;
              max-width: calc(100% - 180px);
              margin-left: auto;
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
          height: 220px;
        }
      }

      .inner {
        max-width: 600px;
        width: 90%;
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;

        &.lhworldcup {
          background: #e7f1fd;
          margin: 0px;
          width: 100%;
          padding: 0px 16px 20px;

          img {
            padding-top: 10px;
            padding-bottom: 10px;
          }

          table {
            p {
              margin: 0px;
            }

            tr:first-child {
              td {
                background-image: linear-gradient(0deg, #0094ff, #19c6ff), linear-gradient(#2e3039, #2e3039);
                color: #fff;
              }
            }

            th {
              background-color: inherit;
            }

            td {
              background-color: inherit;
            }
          }
        }

        &.eurocupManual {
          margin: 0;
          width: 100%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center center;
        }

        &.duanwujie {
          margin: 0px;
          width: 100%;
          background-size: 100% 100% !important;
          padding-top: 0px !important;
        }

        &.lplSummer2024 {
          margin: 0;
          width: 100%;

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.dyEurocupHongbao {
          margin: 0;
          width: 100%;

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.hongbaoyu {
          margin: 0px;
          width: 100%;

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.cnystepgame {
          margin: 0px;
          width: 100%;
          gap: 0px;

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.dy2gamesteps {
          margin: 0px;
          width: 100%;
          gap: 0px;

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.cny2024 {
          width: 100%;
        }
        &.cs2 {
          margin: 0;
          padding: 10px;
          width: 100%;
        }
        // &.cs2 {
        //   margin: 0px;
        //   width: 100%;
        //   gap: 0px;
        //   padding: 10px;
        //   background: url(../assets/images/promotion/hotpromo/cs2/bg.png) no-repeat center center;
        //   p {
        //     padding: 12px;
        //     color: #00dede;
        //     font-family: Microsoft Yahei UI;
        //     max-width: 100%;
        //   }
        // }

        &.msi {
          margin: 0px;
          width: 100%;
          gap: 0px;
          padding: 10px;
          background: url(../assets/images/promotion/hotpromo/LOL-msi/h6bgbg.jpg) no-repeat center center;
        }

        img {
          margin-bottom: 10px;
        }

        ol,
        ul {
          margin: 0;
          padding: 15px 18px;

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
            white-space: normal;
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
    color: #414c74;
    padding: 2px 10px 0;
    background: transparent;
  }

  .q-tab__content {
    width: 100%;
    padding: 10px 0;
  }

  .q-tab--active {
    background: linear-gradient(90deg, #57b7fc 0, #cf74ff 100%);
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
