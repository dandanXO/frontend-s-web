<template>
  <div class="promo-container">
    <div
      class="promo"
      :class="{
        unfixed: selectedPromo.redirectUrl === 'lh1-app-hongbao',
        midAutumnWukong: selectedPromo.redirectUrl === 'lh1-midautumn-spinwheel',
        lh1Vip: selectedPromo.redirectUrl === 'lh1-vip',
        hongbaoyu2025: selectedPromo.redirectUrl === 'hongbaoyu-2025'
      }"
      :style="
        isPromoDetail
          ? 'background-image: url(' +
            imgURL +
            ($q.dark.isActive && selectedPromo.mobileImgBackgroundUrlDark
              ? selectedPromo.mobileImgBackgroundUrlDark
              : selectedPromo.mobileImgBackgroundUrl
              ? selectedPromo.mobileImgBackgroundUrl
              : '') +
            ')'
          : ''
      "
    >
      <q-tabs
        scroll-target=".q-tab--active"
        v-if="!isPromoDetail"
        v-model="tab"
        align="justify"
        class="promo-cat-tab"
        :class="extensionState ? 'extension-tab' : ''"
      >
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
                  <div
                    class="promo-item"
                    v-if="tab.name === 'all' || promo.promoType.toLowerCase().split(',').includes(tab.name)"
                  >
                    <a @click="showPromoDetails(promo)">
                      <div class="promo-item-inner">
                        <div class="promo-label">
                          <div class="promo-ribbon" v-if="promo.labelType !== -1 && promo.labelType !== 2">
                            {{ getPromoLabel(promo.labelType) }}
                          </div>

                        </div>
                        <div
                          style="padding-left: 0; font-weight: 400"
                          class="promo-item-date"
                          v-if="parsedParam(promo.param).date && $q.dark.isActive"
                          v-html="parsedParam(promo.param).date"
                        />
                        <div
                            class="promo-item-date"
                            v-if="parsedParam(promo.param).date && !$q.dark.isActive"
                            v-html="parsedParam(promo.param).date"
                          />
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
                          <img
                            v-if="$q.dark.isActive && promo.mobileImgUrlDark"
                            loading="lazy"
                            :src="imgURL + promo.mobileImgUrlDark"
                          />
                          <img v-else loading="lazy" :src="imgURL + promo.mobileImgUrl" />
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
              'europe-first-shoot': selectedPromo.promoCode === 'lh1-eurocup-firstshoot'
            }"
          >
            <div class="loader" v-if="isFetchingPromo" />
            <div class="selected-promo-wrapper" :class="selectedPromoWrapperClass">
              <!--              <div class="loader" v-if="isFetchingPromo">-->
              <!--                <img class="loading-img" src="../assets/logo.svg" />-->
              <!--              </div>-->
              <div
                @click="showRuleDialog = true"
                v-if="selectedPromo.promoCode === 'lh1-daily-checkin'"
                class="open-rule"
              >
                <img src="../components/hotpromo/DailyCheckin/images/prize-icon.png" />
                活动规则
              </div>
              <div
                class="banner-container"
                v-if="
                  selectedPromo &&
                  (selectedPromo.mobileBannerUrl || selectedPromo.mobileBannerUrlDark) &&
                  !isSpecialPromo &&
                  selectedPromo.promoCode !== 'lh1-ftd-promo' &&
                  selectedPromo.promoCode !== 'lh1-aijiasu' &&
                  selectedPromo.promoCode !== 'lh1-eurocup-regen' &&
                  selectedPromo.redirectUrl !== 'lh1-christmas-gashapon'
                "
              >
                <img
                  loading="lazy"
                  class="promo-content"
                  :src="imgURL + ($q.dark.isActive ? selectedPromo.mobileBannerUrlDark : selectedPromo.mobileBannerUrl)"
                  style="display: block; width: 100%"
                />
              </div>
              <BlastPremierMarquee
                :type="selectedPromo?.redirectUrl === 'bounty-blast-premier' ? 'bounty' : null"
                v-if="selectedPromo?.redirectUrl === 'bounty-blast-premier'"
              />
              <div
                class="inner"
                :class="{
                  lhstepgame:
                    selectedPromo.promoCode === 'lh1-game-steps' ||
                    selectedPromo.promoCode === 'lh-sport-zhongchao' ||
                    selectedPromo.promoCode === 'lh-lpl-summer24' ||
                    selectedPromo.redirectUrl === 'lh1-christmas-gashapon',
                  lhcs2: selectedPromo.promoCode === 'lh-cs2-copenhagen-major-2024',
                  lhworldcup:
                    selectedPromo.promoCode === 'lh1worldcup' ||
                    selectedPromo.promoCode === 'lh1worldcupdota2' ||
                    selectedPromo.promoCode === 'lh1-football-fight' ||
                    selectedPromo.redirectUrl === 'lh1-ag-yuanxiaohongbao',
                  lhftd: selectedPromo.promoCode === 'lh1-ftd-promo' || selectedPromo.promoCode === 'lh1-intel-esl',
                  lhinvite: selectedPromo.promoCode === 'lh1-invite',
                  lheuromanual:
                    selectedPromo.promoCode === 'lh-eurocup-manual' || selectedPromo.promoCode === 'lh1-daily-checkin',
                  meizhoubei:
                    selectedPromo.promoCode === 'lh1meizhoubei' || selectedPromo.promoCode === 'lh1-olympic-fund',
                  aijiasu: selectedPromo.promoCode === 'lh1-aijiasu',
                  euroRegen: selectedPromo.promoCode === 'lh1-eurocup-regen',
                  'lh1-2025-pgl-s3': selectedPromo.promoCode === 'lh1-2025-pgl-s3'
                }"
                :style="[
                  selectedPromo.promoCode === 'lh-eurocup-manual' ||
                  selectedPromo.promoCode === 'lh1-deposit-rebates' ||
                  selectedPromo.redirectUrl === 'lh-blackmyth-wukong' ||
                  selectedPromo.redirectUrl === 'lh1-ag-yuanxiaohongbao' ||
                  selectedPromo.promoCode === 'lh1-daily-checkin' ||
                  selectedPromo.promoCode === 'lh1-2025-pgl-s3' ||
                  selectedPromo.promoCode === 'lh1-duan-wu-rewards'
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
                    slot: selectedPromo.promoType.toLowerCase() === 'slot game',
                    olympicCheckin: selectedPromo.promoCode === 'lh1-olympic-checkin'
                  }"
                >
                  <div v-if="selectedPromo.redirectUrl === 'lh1-mesa-nomadic-masters-spring-2025'">
                    <MesaPromo :promoCode="selectedPromo.promoCode" />
                  </div>
                  <div v-if="selectedPromo.redirectUrl === 'lh1-nba-water-battle'">
                    <NBAWaterBattle :promoCode="selectedPromo.promoCode" />
                  </div>
                  <div
                    v-if="selectedPromo.redirectUrl !== 'lh1-christmas-gashapon'"
                    :class="`content-` + selectedPromo.redirectUrl"
                    v-html="selectedPromo.pageContent"
                  ></div>
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
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <q-dialog class="modal-common-div" width="100%" v-model="store.isDisplayLogin">
    <q-card
      style="width: 100%; padding: 10px 12px 20px"
      class="text-center text-black"
      :class="$q.dark.isActive ? '' : 'bg-white'"
    >
      <div class="headers">
        <div style="width: 2.4em">&nbsp;</div>
        <div class="titles">系统提示</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <q-card-section class="q-mb-lg">
        <div class="contents">请登录后再操作</div>
      </q-card-section>
      <router-link to="/login?redirect=/promo">
        <q-btn class="common-md-btn" label="确认" />
      </router-link>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div danaaa" v-model="showRuleDialog">
    <q-card class="text-center text-black" style="background: transparent">
      <q-card-section class="items-center justify-center row">
        <div class="dialog-header-2">
          <img
            class="closeX"
            @click="showRuleDialog = false"
            :src="require('../components/hotpromo/DailyCheckin/images/icon-close.png')"
          />
          <div class="secend-rule">
            <div class="title">活动规则</div>
            <div style="width: 100%; text-align: left">
              <img
                style="width: 104px; height: 28px"
                :src="require('../components/hotpromo/DailyCheckin/images/rule-time.png')"
              />
              <div class="text">
                {{ JSON.parse(selectedPromo.param).activity_date }}
              </div>
            </div>
            <div style="width: 100%; text-align: left">
              <img
                style="width: 104px; height: 28px"
                :src="require('../components/hotpromo/DailyCheckin/images/rule-content.png')"
              />
              <div class="text" style="margin-left: -20px; overflow: scroll; height: 250px">
                <ul>
                  <li>
                    所有雷火电竞会员存款达到相应 VIP
                    等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款 +
                    奖金）*相应流水倍数即可提款。
                  </li>
                  <li>各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。</li>
                  <li>
                    此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP
                    地址，同一网络环境等将可以作为判定是否独立玩家的条件。对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
                  </li>
                  <li>各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。</li>
                  <li>
                    所有雷火电竞会员存款达到相应 VIP
                    等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款 +
                    奖金）*相应流水倍数即可提款。
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="js">
import { ref, defineComponent, onActivated, reactive, watch, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useUI } from "stores/ui";
import { userStore } from "stores/index";
import { isAndroid } from "boot/utils";
import { SessionStorage } from "quasar";
import LocalStorage from "boot/local-storage";
import { useLocalStorage } from "@vueuse/core";

import HotPromotion from "components/HotPromotion";
import BlastPremierMarquee from "src/components/hotpromo/bounty-blast/BlastPremierMarquee.vue";
import AijiasuPromo from "src/components/hotpromo/aijiasu/AijiasuPromo.vue";
import { useNotify } from "src/hooks/notify";
import { cached } from "src/boot/cache";
import NBAWaterBattle from "src/components/hotpromo/nba-water-battle/NBAWaterBattle.vue";
import MesaPromo from "src/components/hotpromo/mesa/MesaPromo.vue";
import { useCloudWiseHelper } from "src/hooks/cloudWiseHelper";


export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion,
    NBAWaterBattle,
    BlastPremierMarquee,
    MesaPromo
  },
  setup() {
    const notify = useNotify();
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    useCloudWiseHelper({
      pageName: "promo"
    })

    const banner = ref([]);
    const promoState = reactive({
      active: { value: "ALL", label: "ALL" },
      promoList: []
    });
    const showRuleDialog = ref(false)
    const isFetchingPromo = ref(false);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const ui = useUI();
    const isDisplayLogin = ref(false);

    const selectedPromoWrapperClass = computed(() => ({
      "challenge-comeback": ['lh1-cycle-loss-refund', 'lh1-olympic-fund'].includes(selectedPromo.value.promoCode),
      "challenge-comeback1": ['lh-official-gift'].includes(selectedPromo.value.promoCode),
      "slot-lucky8": selectedPromo.value.promoCode === 'lh1-lucky-slot' || selectedPromo.value.promoCode === 'lh1-olympic-checkin',
      'livepoker-rebate': selectedPromo.value.promoCode === 'lh1-livepoker-rebate',
      'lh1-football': selectedPromo.value.promoCode === 'lh1-football',
    }))

    // const routeQuery  = computed(() => route.query || {});

    const tab = ref("all");
    const tabItems = ref([
      { name: "all", label: "全部优惠" },
      { name: "welcome", label: "新人" },
      { name: "hot", label: "热门" },
      { name: "esport", label: "电竞" },
      { name: "sport", label: "体育" },
      // {name: "slot game", label: '老虎机'},
      // {name: "fish", label: '捕鱼'},
      { name: "live casino", label: "真人" },
      { name: "slot game", label: "电游" },
      { name: "ftd", label: "存款" },
      { name: "vip", label: "VIP" }
    ]);

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

    const isSpecialPromo = ref(false);
    const showPromoDetails = (promo) => {
      if (promo.promoCode === "lh1-game-steps") {
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
        if (promo.redirectUrl.includes("page-vip")) {
            router.push("/account/vip?from=promo");
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
    };
    const switchPromoType = (type) => {
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {
          return promo.promoType.toLowerCase().split(",").includes(type.value.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList;
      }
    };

    const loadAll = async () => {
      const key = "PROMOTION_TYPES"
      cached.get(key, () => api.get("/promo/type")).then((res) => {
        if (res.length > 0) {
          tabItems.value = [];
          res.forEach(element => {
            const obj = {
              name: element.value.toLowerCase(),
              label: JSON.parse(element.name).H5
            };
            tabItems.value.push(obj);
          });
          switchPromoType(promoState.active)
        } else {
          console.warn('No promo types loaded, using default promo types.');
        }
      })
      const platformApiUrl = "/opt-session/promo/page";

      isFetchingPromo.value = window.location.pathname === "/promotion" || window.location.pathname === "/promo";

      api
        .get(platformApiUrl)
        .then((res) => {
          if (res.code === 0) {
            promoState.promoList = [];
            var promoItems = res.data;
            // promoState.promoList.push(...res.data);

            promoItems.filter(promo => !($q.dark.isActive && ['lh1-dark-mode'].includes(promo.redirectUrl))).forEach((element) => {
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
      if (currentPath.value === "/promotion") {
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

    onActivated(() => {
      isPromoDetail.value = false;
      selectedPromo.value = {};
      // if promo name is present, do not show promo list on first load
      if (route.query.name) {
        isPromoDetail.value = true;
      }

      checkExtension();
      loadAll();
    });

    return {
      promoState,
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
      isSpecialPromo,
      selectedPromoWrapperClass,
      showRuleDialog,
      // routeQuery
    };
  }
});
</script>

<style lang="scss">
.dialog-header-2 {
  position: relative;
  width: 315px;
  height: 450px;
  padding: 0 24px;
  background: transparent;
  background-image: url("../components/hotpromo/DailyCheckin/images/bg-5.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .closeX {
    right: 10px;
    top: 6px;
    position: absolute;
  }
}
.secend-rule {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    font-size: 20px;
    width: 100%;
    height: 28px;
    margin-top: 16px;
    margin-bottom: 12px;
    text-align: center;
    color: #fff;
  }
  .text {
    text-align: left;
    color: #fff;
    font-size: 12px;
    margin-top: 8px;
    margin-bottom: 12px;
  }
}
.promo-container {
  min-height: 100vh;
  background: $secondary;
  color: $dark;

  .promo {
    background-position: bottom center;
    background-size: cover;
    background-attachment: fixed;

    &.hongbaoyu2025 {
      background-position: top;
      background-size: 100% auto;
      background-attachment: unset;
    }

    &.midAutumnWukong {
      background-position: top;
      background-size: 100% auto;
      background-attachment: unset;
    }

    &.unfixed {
      background-attachment: scroll;

      .challenge-comeback1 {
        background: transparent !important;
      }
    }

    &.lh1Vip {
      background-color: #fff;
    }
  }

  a {
    color: $primary;
    font-size: 1rem;
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

          .promo-item-inner {
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .promo-item-deal {
              margin-bottom: auto;
            }
          }

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
            color: #A4AABB;
            font-size: 0.825rem;
            font-weight: lighter;
            // padding-left: 12px;
            // position: absolute;
            // top: 5px;
            // left: 100px;
          }

          .promo-item-title {
            color: $primary;
            font-weight: bold;
            font-size: 1.15rem;
            line-height: 1.2;
            max-width: 160px;
            margin-bottom: 2px;
            margin-top: 2px;
            letter-spacing: 0.5px;
            font-family: 'PingFang SC', 'PingFang', sans-serif;

            @media (min-width: 500px) {
              max-width: calc(100% - 220px);
            }
          }

          .promo-item-deal {
            color: $grey-color;
            font-weight: 600;
            font-size: 0.875rem;
            max-width: 160px;
            letter-spacing: 0.5px;
            font-family: 'PingFang SC', 'PingFang', sans-serif;

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
            border-radius: 4px;
            font-size: 0.75rem;
            margin-top: 6px;
            background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
            box-shadow: 0px -0.75px 0.75px 0px #275EC1 inset;
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
              max-width: calc(100% - 170px);
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

    &.euroCup {
      background: #010333;
    }

    &.europe-first-shoot {
      background-color: #0d3173;
    }

    .selected-promo-wrapper {
      .open-rule {
        text-decoration: underline;
        color: #fff;
        display: flex;
        align-items: center;
        line-height: 20px;
        position: absolute;
        top: 0;
        right: 3px;
      }
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
        margin: 14px auto 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;
        .olympicCheckin {
          border: 1px solid #acd4f6;
          border-radius: 10px;
          padding: 10px;
          background: #f2f8fe;
        }
        &.aijiasu {
          width: 100%;
          gap: 0px;
          margin: 0px;
        }
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
              border: 1px solid #999;
              background-color: inherit;
            }

            td {
              border: 1px solid #999;
              background-color: inherit;
            }
          }
        }
        &.euroRegen {
          width: 100%;
          gap: 0px;
          margin: 0px;
        }
        &.meizhoubei {
          margin: 5px auto;
        }
        &.lhinvite {
          width: 100%;
        }
        &.lh1-2025-pgl-s3 {
          margin: 0px;
          width: 100%;
          gap: 0px;
          padding: 0px 16px 20px;
          background-color: #1c0d18;
        }
        &.lheuromanual {
          margin: 0px;
          width: 100%;
          gap: 0px;
          background-size: 100% 100%;

          .hot-promo {
            border-radius: 0px;
            padding: 15px 12px;
          }
        }

        &.lhftd {
          margin: 0px;
          width: 100%;
          gap: 0px;

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.lhstepgame {
          margin: 0px;
          width: 100%;
          gap: 0px;

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.lhcs2 {
          margin-top: 0px;
        }

        &:has(.corner-decor) {
          position: relative;
        }

        img {
          margin-bottom: 5px;
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

        .corner-decor {
          position: absolute;
          left: -5%;
          bottom: -20px;

          img {
            margin: 0;
          }
        }

        // .hot-promo {
        //   background: #272c3d;
        //   border-radius: 10px;
        // }
        .promo-card {
          background-color: #ffffff;
          color: #7a8eb9;
        }

        // for lh1ouzhoubeibaopei
        .sport {
          em {
            color: #c24f4a;
            font-style: normal;
          }
        }

        @media (max-width: 400px) {
          width: calc(100% - 20px);
        }
        @media (max-width: 350px) {
          width: calc(100% - 12px);
        }
      }

      &.slot-lucky8,
      &.challenge-comeback {
        background: #e7f1fd;
      }

      &.challenge-comeback1 {
        background: #e7f1fd;
      }

      &.livepoker-rebate {
        background: #e7f1fd;
      }
      &.lh1-football {
        background: #e7f1fd;
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
  background-color: #e7f1fd;
  .q-tabs {
    background: $secondary;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 8px;
    // box-shadow: 0px -6px 6px 0px #c3d4e6 inset;

    .q-tab {
      color: $font-1;
      font-size: 1rem;
      padding: 0 8px;
    }

    .q-tab__label {
      font-size: 1rem;
      font-weight: normal;
    }

    .q-tab--active {
      color: $primary;
      opacity: 1;

      .q-tab__label {
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
  top: 51px;
  z-index: 3;

  &.extension-tab {
    top: 0;
  }
}

.body--dark {
  .promo-container {
    background: $background-dark;

    .all-promotions {
      .promo-main-container {
        .promo-list-wrapper {
          .promo-item {
            background-image: url(../assets/images/promo/promo-item-bg-dark.png);
            // aspect-ratio: 702/208;
            border-radius: 8px;
            overflow: hidden;

            .promo-item-inner {
              min-height: 120px;
            }

            .promo-label {
              top: 0px;
              left: 0px;
              font-family: "YouSheBiaoTiHei";
            }
            .promo-ribbon {
              background: #1475e1;
              clip-path: polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
              &::after {
                display: none;
              }
            }
            .promo-item-date {
              color: $grey-color;
            }
            .promo-item-title {
              color: $font-3-dark;
              font-family: "YouSheBiaoTiHei";
              font-weight: 400;
            }
            .promo-item-deal {
              color: $grey-color;
            }
            .promo-item-btn {
              background: url("../assets/images/promo/promo-info-btn-bg.svg") no-repeat center center;
              background-size: cover;
              box-shadow: none;
              border-radius: 4px;
              border: 1px solid #3a93ce;
            }
          }
        }
      }
    }

    .selected-promo {
      .selected-promo-wrapper {
        .open-rule {
          text-decoration: underline;
          color: #fff;
          position: absolute;
          top: 0;
          right: 3px;
        }
        .inner {
          table {
            th {
              background: $background-dark-header;
              color: $white;
            }
            td {
              background: $background-dark-light;
              border-color: $border-dark;
              color: $white;
            }
            tbody > tr:first-child td {
              background: $background-dark-header;
              color: $white;
            }
          }

          .promo-card {
            @include content-block-dark;
            color: $font-1;
          }

          // for lh1ouzhoubeibaopei
          .sport {
            em {
              color: #f04918;
              font-style: normal;
            }
          }
          .content-lh1-feedback-award {
            color: #fff;
            img {
              filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(232deg) brightness(100%)
                contrast(106%);
            }
          }
        }

        &.challenge-comeback1 {
          background: transparent;
        }
      }
    }
  }

  .promo:not(.unfixed) {
    .q-tabs {
      background: #1a2338;
      .q-tab--active {
        color: #fff;
      }
      .q-tab--active .q-tab__indicator {
        width: 60%;
        margin: auto;
      }
    }
    .q-tab-panels {
      background: $background-dark;
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

//.loader {
//  width: 100%;
//  height: calc(100vh - 150px);
//  display: flex;
//  justify-content: center;
//  align-items: center;
//
//  .loading-img {
//      animation-name: fade-in-out;
//      animation-duration: 1s;
//      animation-iteration-count: infinite;
//      width: 100px;
//  }
//}
//
//@keyframes fade-in-out{
//  0%{
//    opacity: 1;
//  }
//   50%{
//    opacity: 0;
//  }
//  100%{
//    opacity: 1;
//  }
//}
</style>
