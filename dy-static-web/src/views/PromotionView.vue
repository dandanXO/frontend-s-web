<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">
      <div class="promo-main-container">
        <div class="promo-type-wrapper">
          <div class="type-list">
            <div
              class="type-item"
              v-for="p in promoTypes"
              :class="{ active: p.code === promoTabActive }"
              :key="p.code"
              @click="switchPromoType(p.code)"
            >
              <img v-if="p.img" :src="imgURL + p.img" />
              <span class="label">{{ p.label }}</span>
            </div>
          </div>
        </div>
        <div class="loading" v-if="isLoadingPromo">
          <img class="loading-img" src="../assets/logo.png" />
        </div>
        <div class="promo-list-wrapper" v-else>
          <div
            class="promo-item"
            v-for="(promo, i) in filteredArray"
            :key="i"
            data-aos="zoom-in"
            data-aos-easing="ease-out"
            data-aos-duration="1000"
          >
            <a @click="showPromoDetails(promo)">
              <div class="promo-info">
                <span class="time">{{ JSON.parse(promo.param).date }}</span>
                <template v-if="JSON.parse(promo.param).title">
                  <span class="viewdetail" v-html="JSON.parse(promo.param).title"></span>
                </template>
                <template v-else>
                  <span class="viewdetail" v-html="promo.title"></span>
                </template>

                <span class="sub-viewdetail">{{ JSON.parse(promo.param).sub }}</span>
              </div>
              <div class="promo-img-wrapper">
                <div class="promo-bg">
                  <img class="promo-content isDesktop" :src="imgURL + promo.desktopImgUrl" />
                  <img class="promo-content isMobile" :src="imgURL + promo.mobileImgUrl" />
                </div>
              </div>
              <div class="pad-label label-new" v-if="!!getPromoLabel(promo.labelType)">
                <span>{{ getPromoLabel(promo.labelType) }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="selected-promo"
      :class="{
        isMSIPromo: selectedPromo.promoCode === 'dy2-msi-promo',
        'bbdacha-cs2': selectedPromo?.promoCode === 'dy2-bb-dacha-cs-bonus'
      }"
    >
      <div class="selected-promo-wrapper">
        <div
          class="banner-container"
          v-if="
            selectedPromo.promoCode !== 'dy2-cny-step-game' &&
            selectedPromo.promoCode !== 'dy2-game-steps' &&
            selectedPromo.promoCode !== 'dy2-msi-promo' &&
            selectedPromo.redirectUrl !== 'dy2-christmas-gashapon'
          "
          :class="{
            isCSBanner:
              selectedPromo.promoCode === 'dy2-cs2-copenhagen-major-2024' ||
              selectedPromo.promoCode === 'dy2-cs2-blast-2024' ||
              selectedPromo.redirectUrl === 'dy2-livepoker-rebate' ||
              selectedPromo.redirectUrl === 'dy2-football' ||
              selectedPromo.redirectUrl === 'dy2-blackmyth-wukong' ||
              selectedPromo.redirectUrl === 'dy1-ag-yuanxiaohongbao' ||
              selectedPromo.promoCode === 'dy2-intel-esl' ||
              selectedPromo.promoCode === 'dy2-duan-wu-rewards',
            isEurocupManualBanner: selectedPromo.promoCode === 'dy2-eurocup-manual',
            isDuanwuBanner: selectedPromo.promoCode === 'dy-duanwujie24',
            iseurocupBanner: selectedPromo.promoCode === 'dy2-eurocup-hongbao',
            isMidAutumnWukong: selectedPromo.promoCode === 'dy2-midautumn-spinwheel',
            isNationalDay24: selectedPromo.promoCode === 'dy2-national-day-2024',
            isYallaCompass: selectedPromo.promoCode === 'dy2-yalla-compass',
            isBbdachaBelgrade: selectedPromo.promoCode === 'dy2-bbdacha-belgrade',
            isValorantChampionTour2024: selectedPromo.promoCode === 'dy2-valorant-champion-tour-2024',
            'dy1-2025-pgl-s3': selectedPromo.promoCode === 'dy1-2025-pgl-s3'
          }"
        >
          <div
            class="promo-bg isDesktop"
            :style="
              'background-image: url(' +
              imgURL +
              (selectedPromo.desktopBannerUrl ? selectedPromo.desktopBannerUrl : selectedPromo.desktopImgUrl) +
              ''
            "
          ></div>
          <div
            class="promo-bg isMobile"
            :style="
              'background-image: url(' +
              imgURL +
              (selectedPromo.mobileBannerUrl ? selectedPromo.mobileBannerUrl : selectedPromo.mobileImgUrl) +
              ''
            "
          ></div>
        </div>

        <BlastPremierMarquee
          v-if="
            selectedPromo?.redirectUrl === 'dy2-cs2-blast-2024' || selectedPromo?.redirectUrl === 'bounty-blast-premier'
          "
        />
        <div
          class="inner"
          :class="{
            isCS:
              selectedPromo.promoCode === 'dy2-cs2-copenhagen-major-2024' ||
              selectedPromo?.promoCode === 'dy2-football' ||
              selectedPromo.promoCode === 'dy2-olympic-match',
            isMSI: selectedPromo.promoCode === 'dy2-msi-promo' || selectedPromo.promoCode === 'dy2-blackmyth-wukong',
            isEurocupManual: selectedPromo.promoCode === 'dy2-eurocup-manual',
            esl: selectedPromo.promoCode === 'dy2-intel-esl',
            isMidAutumnWukong: selectedPromo.promoCode === 'dy2-midautumn-spinwheel',
            dy2quiz: selectedPromo.promoCode === 'dy2-quiz',
            fullwidth:
              selectedPromo?.promoCode === 'dy2-duan-wu-rewards' ||
              selectedPromo.promoCode === 'dy2-cny2024-promo' ||
              selectedPromo.promoCode === 'dy2-cny-step-game' ||
              selectedPromo.promoCode === 'dy2-game-steps' ||
              selectedPromo.promoCode === 'dy2-eurocup-hongbao' ||
              selectedPromo.promoCode === 'dy2-lpl-summer24' ||
              selectedPromo.promoCode === 'dy2-intel-esl' ||
              selectedPromo.promoCode === 'dy2-eurocup-manual' ||
              selectedPromo.promoCode === 'dy2-midautumn-spinwheel' ||
              selectedPromo.promoCode === 'dy2-s14-vote' ||
              selectedPromo.promoCode === 'dy2-elisa-gift' ||
              selectedPromo.promoCode === 'dy2-blast-premier-treasure' ||
              selectedPromo.redirectUrl === 'dy2-christmas-gashapon' ||
              selectedPromo.redirectUrl === 'dy2-cny2025-red-envelope',
            duanwujie:
              selectedPromo.promoCode === 'dy2-duan-wu-rewards' || selectedPromo.redirectUrl === 'lh-blackmyth-wukong',
            dyworldcup: selectedPromo?.promoCode === 'dy2worldcup' || selectedPromo?.promoCode === 'dy2worldcupdota2',
            'livepoker-rebate-bg': selectedPromo?.promoCode === 'dy2-livepoker-rebate',
            dyfootball: selectedPromo?.promoCode === 'dy2-football',
            dota2Pgql: selectedPromo?.promoCode === 'dy2-dota2-pgl' || selectedPromo.redirectUrl === 'dy1-2025-pgl-s3',
            isYallaCompass: selectedPromo?.promoCode === 'dy2-yalla-compass',
            isBbdachaBelgrade: selectedPromo?.promoCode === 'dy2-bbdacha-belgrade',
            isValorantChampionTour2024: selectedPromo.promoCode === 'dy2-valorant-champion-tour-2024'
          }"
          :style="{
            backgroundImage: selectedPromo?.desktopImgBackgroundUrl
              ? `url(${imgURL + selectedPromo.desktopImgBackgroundUrl})`
              : 'none',
            margin: ['dy1-ag-yuanxiaohongbao', 'dy1-lantern-festival-bonus', 'dy2-duan-wu-rewards'].includes(
              selectedPromo.redirectUrl
            )
              ? '0px auto'
              : '20px auto',
            'max-width': ['dy1-ag-yuanxiaohongbao', 'dy1-lantern-festival-bonus', 'dy2-duan-wu-rewards'].includes(
              selectedPromo.redirectUrl
            )
              ? 'unset'
              : '1400px',
            width: ['dy1-ag-yuanxiaohongbao', 'dy1-lantern-festival-bonus', 'dy2-duan-wu-rewards'].includes(
              selectedPromo.redirectUrl
            )
              ? '100%'
              : '95%'
          }"
        >
          <div class="hot-promo" v-if="selectedPromo.hasPromo">
            <HotPromotion :list="selectedPromo" />
          </div>
          <div
            class="promo-view-container"
            :class="{
              welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
              sport: selectedPromo.promoType.toLowerCase() === 'sport',
              eSport: selectedPromo.promoType.toLowerCase() === 'esport',
              fish: selectedPromo.promoType.toLowerCase() === 'fish',
              liveCasino: selectedPromo.promoType.toLowerCase() === 'livecasino',
              slot: selectedPromo.promoType.toLowerCase() === 'slot game',
              isHide: selectedPromo.promoCode === 'dy2-msi-promo',
              football1: selectedPromo.promoCode === 'dy2-football'
            }"
          >
            <div v-if="selectedPromo.redirectUrl === 'dy2-mesa-nomadic-masters-spring-2025'">
              <MesaPromo :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2-nba-water-battle'">
              <NBAWaterBattle :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2-yalla-compass'">
              <YallaCompass :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2-valorant-masters-toronto-2025'">
              <TorontoMasters :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2-fifa-2025'">
              <Fifa2025Promo :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2-blast-tv-austin-major-2025'">
              <BlastAustin :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2-bbdacha-belgrade'">
              <BbdachaBelgrade />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2-valorant-champion-tour-2024'">
              <ValorantChampionTour2024 :promo-code="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'dy2laohuji'">
              <Dy2DailySlotBonus :promo-code="selectedPromo.promoCode" />
            </div>
            <div :class="{ isSpecial: !isSpecialPromo }" v-html="selectedPromo.pageContent"></div>
            <div
              v-if="['dy2-cs2-blast-2024'].includes(selectedPromo.redirectUrl)"
              class="corner-decor"
              style="position: absolute; left: 0px; bottom: 0px"
            >
              <img
                v-if="selectedPromo.redirectUrl === 'dy2-cs2-blast-2024'"
                src="@/assets/images/promotion/hotpromo/blastpremier/bg.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted, reactive, watch, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadPromo } from "@/api/index/promo.js";
import { loadPromoBanner, loadPromoTypes } from "@/api/index/promo";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
import BlastPremierMarquee from "@/components/hotpromo/BlastPremierPromo/BlastPremierMarquee.vue";

import HotPromotion from "@/components/HotPromotion";
import { useLocalStorage } from "@vueuse/core";
import NBAWaterBattle from "@/components/hotpromo/nba-water-battle/NBAWaterBattle.vue";

const MesaPromo = defineAsyncComponent(() => import("@/components/hotpromo/mesa/MesaPromo.vue"));
const YallaCompass = defineAsyncComponent(() => import("@/components/hotpromo/yalla-compass/YallaCompass.vue"));
const BbdachaBelgrade = defineAsyncComponent(() => import("@/components/hotpromo/bbdacha-belgrade/BbdachaBelgrade.vue"));
const ValorantChampionTour2024 = defineAsyncComponent(() => import("@/components/hotpromo/valorant-champion-tour-2024/ValorantChampionTour2024.vue"));
const BlastAustin = defineAsyncComponent(() => import("@/components/hotpromo/blast-austin/BlastAustin.vue"));
const TorontoMasters = defineAsyncComponent(() => import("@/components/hotpromo/toronto-masters/TorontoMasters.vue"));
const Fifa2025Promo = defineAsyncComponent(() => import("@/components/hotpromo/fifa-2025/Fifa2025Promo.vue"));
const Dy2DailySlotBonus = defineAsyncComponent(() => import("@/components/hotpromo/dy2-daily-slot-bonus/Dy2DailySlotBonus.vue"));

export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion,
    BlastPremierMarquee,
    NBAWaterBattle,
    YallaCompass,
    BbdachaBelgrade,
    ValorantChampionTour2024,
    MesaPromo,
    BlastAustin,
    TorontoMasters,
    Fifa2025Promo,
    Dy2DailySlotBonus
  },
  setup() {
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
    const banner = ref([]);
    const promoState = reactive({
      active: "ALL",
      promoList: []
    });
    const promoTypes = ref([])
    const promoTabActive = ref('');
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    const isLoadingPromo = ref(false);

    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false;
      } else {
        isPromoDetail.value = route.query.name;
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });
    const loadBanner = () => {
      loadPromoBanner("PROMO").then((res) => {
        if (res.code === 0) {
          banner.value = res.data[0];
        }
      });
    };

    const loadTabs = async() => {
      loadPromoTypes().then((res) => {
        promoTypes.value = res.map(({ value, name, iconUrl }) => ({
          code: value,
          label: name ? JSON.parse(name).zh : '',
          img: iconUrl
        }));
        if (promoTypes.value.length > 0) {
          promoTabActive.value = promoTypes.value[0].code
        } else {
          console.warn('No promo types loaded, using default promo types.');
        }
      })
    }
    const isSpecialPromo = ref(false)
    const showPromoDetails = (promo) => {
      // if (!store.token) {
      //   ElMessageBox.alert("请登录后再操作", "系统提示", {
      //     // if you want to disable its autofocus
      //     // autofocus: false,
      //     center: true,
      //     confirmButtonText: "确认",
      //     showClose: false,
      //     buttonSize: "large"
      //   }).then(() => {
      //     store.loginPageVisible = true;
      //   });
      //   return;
      // } else {
        if (promo.redirectUrl.includes("page-vip")) {
          router.push("/vip");
        } else if (promo.redirectUrl.includes("Dongying-refer")) {
          router.push("/privilege/invite");
        } else if (promo.redirectUrl.includes("hongbaoyu")) {
          router.push("/privilege/hongbaoyu");
        }else {
          console.log(promo)
          if (promo.redirectUrl === 'dy2-cs2-copenhagen-major-2024' || promo.redirectUrl === 'dy2-dream-league-s25' || promo.redirectUrl === 'dy2-msi-promo' || promo.redirectUrl === 'dy2-quiz' || promo.redirectUrl === 'dy2-christmas-gachapon') {
            isSpecialPromo.value = true;
          } else {
            isSpecialPromo.value = false;
          }
          router.push({ name: "promotion", query: { name: promo.redirectUrl } });
          isPromoDetail.value = true;
          selectedPromo.value = promo;
        }
      // }
    };

    const switchPromoType = (type) => {
      promoTabActive.value = type;
      if (type !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function(promo) {
          return promo.promoType.toLowerCase().split(",").includes(type.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList;
      }
    };
    const getPromoLabel = (labelType) => {
      switch (labelType) {
        case 0:
          return "最新";
        case 1:
          return "热门";
        case 2:
          return "正常";
        case 3:
          return "推荐";
        case 4:
          return "日常";
        case 5:
          return "新人";
        case 6:
          return "限时";
        case 7:
          return "精选";
        default:
          return "";
      }
    };
    const loadAll = async () => {
      isLoadingPromo.value = true;

      const isLogin = !!store.hasToken();
      await loadTabs();
      loadPromo(isLogin).then((res) => {
        isLoadingPromo.value = false;

        if (res.code === 0) {
          promoState.promoList.push(...res.data);

          res.data.forEach(element => {
            // if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
            //   promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
            // } else {
              if (route.query.name === "dy2-football-fight-2" || route.query.name === "dy2-football-fight-3") {
                if (element.redirectUrl === "dy2-football-fight") {
                  showPromoDetails(element);
                }
              }
              if (element.redirectUrl === route.query.name) {
                showPromoDetails(element);
              }
            // }
          });

          if (promoTypes.value.length > 0) {
            switchPromoType(promoState.active);
          }
        }
      }).catch((e) => {
        isLoadingPromo.value = false;
        console.log("error", e);
      }).finally(() => {
        isLoadingPromo.value = false;
      });
    };
    onMounted(() => {
      if(route.query.name === 'page-vip'){
        router.push('/vip');
        return
      }
      loadBanner();
      loadAll();
    });

    watch(() => route.query.name, () => {
      if (!route.query.name) {
        isPromoDetail.value = false;
      }
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
      getPromoLabel,
      isSpecialPromo,
      isLoadingPromo
    };
  }
});
</script>
<style lang="scss">
.promo-container {
  h3 {
    font-size: 16px;
  }
  // background: #090b19;
  .all-promotions {
    min-height: calc(100vh - 310px);
    padding: 16px 50px 50px;
    position: relative;
    background-color: #ebf4ff;

    margin: 0 auto;
    //max-width: 1920px;
  }

  .all-promotions-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0.5;
  }

  .promo-view-container {
    line-height: 30px;

    &.isHide {
      display: none;
    }

    ol {
      padding: 0 15px;
    }

    img {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px auto;

      &:nth-child(1) {
        padding-top: 20px;
      }
    }

    table {
      margin: 10px auto;
      min-width: 80%;
      text-align: center;
      &:not(:has(thead)) {
        tr:first-child td {
          background-image: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
          color: #ffffff;
          border: 0;
        }
      }

      border-collapse: collapse;

      tr:first-child td:first-child {
        border-top-left-radius: 10px;
      }
      tr:first-child td:last-child {
        border-top-right-radius: 10px;
      }

      th,
      td {
        padding: 10px;
        p {
          margin: 0;
          line-height: 21px;
        }
      }

      tbody {
        display: table;
        table-layout: fixed;
        width: 100%;
      }

      th {
        background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
        color: white;
      }

      td {
        // background-color: #202228;
        border: 1px solid #dcdce8;
      }
    }
  }

  a {
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  .banner-container {
    min-height: 500px;
  }

  .promo-top {
    display: flex;
    justify-content: space-around;
    padding: 0 20px;
    position: relative;
    z-index: 1;

    .promo-top-img1 {
      width: 543px;
    }

    .promo-top-img2 {
      width: 305px;
    }
  }

  .all-promotions {
    @keyframes fadein {
      100% {
        opacity: 1;
      }
    }

    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;

      &.isDesktop {
        display: block;
        height: 500px;
      }

      &.isMobile {
        display: none;
        // height: 220px;
        min-height: 60vw;
      }
    }

    .promo-main-container {
      width: 100%;
      max-width: $maxwidth;
      margin: 0 auto;
      padding: 10px 0;

      .promo-type-wrapper {
        display: flex;
        justify-content: center;
        /* width */
        ::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          // display: none;
        }

        .type-list {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 10px 0 20px;
          overflow: auto;
          width: 90%;
          font-family: "PingFang SC";

          .type-item {
            cursor: pointer;
            // border-radius: 20px;
            // background: #201f29;
            // box-shadow: 0 0 10px -3px #000000;
            // white-space: nowrap;
            margin: 0 10px;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            position: relative;
            width: 122px;
            height: 36px;

            .label {
              z-index: 0;
              color: #414c74;
            }

            &:before {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              // box-shadow: 0 3px 4px 0 rgb(0 0 0 / 15%);
              box-shadow: 0px 3px 7px 1px rgba(0, 0, 0, 0.15);
              border-radius: 30px;
            }

            img {
              max-height: 30px;
              filter: grayscale(0);
            }

            &.active,
            &:hover {
              // background: #4b4e66;
              // box-shadow: 0 0 5px #ffffff;
              // background-image: linear-gradient(90deg,#35d8f2 0,#2188c9 100%),linear-gradient(#5243bd,#5243bd);
              .label {
                color: #ffffff;
              }

              &:before {
                background-image: linear-gradient(90deg, #57b7fc 0, #cf74ff 100%);
              }

              img {
                filter: grayscale(1) brightness(100);
              }
            }
          }
        }
      }

      .promo-list-wrapper {
        width: 90%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;

        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background-color: #f2f6ff;
          box-shadow: 0 3px 9px 0 rgba(112, 122, 143, 0.4);
          border-radius: 16px;
          width: 285px;
          height: 310px;

          a {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            // border-radius: 10px 10px 0 0;
            .promo-bg {
              transition: all 0.5s ease;
              background-size: cover;
              background-position: center center;

              display: flex;
              justify-content: center;
              align-items: center;
              gap: 30px;
              height: 180px;

              .promo-content {
                height: 100%;

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
            text-align: left;
            padding: 8px 16px;
            left: 0;
            bottom: 0;
            width: 100%;
            gap: 5px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            box-sizing: border-box;
            flex: 1;

            .time {
              font-size: 12px;
              font-weight: 400;
              color: #6f7582;
              margin-bottom: 4px;
            }

            .viewdetail {
              color: #414c74;
              font-size: 28px;
              overflow: hidden;
              text-align: left;
              width: 220px;
              white-space: pre-wrap;
              word-wrap: break-word;
              font-weight: bold;
              line-height: 2rem;
            }

            .sub-viewdetail {
              color: #5e73a1;
              font-size: 14px;
              font-weight: 600;
            }

            .detail-arrow {
              margin-right: 20px;
              height: 100%;
            }
          }

          .pad-label.label-new {
            font-size: 12px;
            font-weight: 400;
            color: #ffffff;
            position: absolute;
            top: -2px;
            right: 0px;
            background: url("../assets/images/promotion/hotpromo/common/promo-label-ribbon.png") no-repeat 100%/100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 60px;
            height: 34px;
            font-family: "PingFang SC";

            > span {
              padding-right: 13px;
              padding-bottom: 4px;
            }
          }
        }
      }
    }
  }

  .selected-promo {
    width: 100%;

    &.isMSIPromo {
    }

    &.bbdacha-cs2 {
      background-color: #e7f1fd;

      .selected-promo-wrapper {
        .banner-container {
          .promo-bg.isDesktop {
            aspect-ratio: 1920 / 568;
            max-height: 568px;
            height: unset;
          }
        }
      }
    }

    .selected-promo-wrapper {
      .banner-container {
        width: 100%;
        max-width: 1920px;
        margin: 0 auto;

        &.isYallaCompass,
        &.isBbdachaBelgrade,
        &.isValorantChampionTour2024 {
          max-width: 100%;
          .promo-bg.isDesktop {
            height: 568px !important;
          }
        }
        &.dy1-2025-pgl-s3 {
          background: #1c0d18;
        }

        &.isNationalDay24 {
          .promo-bg.isDesktop {
            height: 585px !important;
          }
        }

        &.isCSBanner {
          aspect-ratio: 3840/1136;
          max-width: none;

          .promo-bg {
            height: 100% !important;
            aspect-ratio: 3840/1136;
            //min-height: 550px !important;
            background-size: 100% 100%;
          }
        }

        &.isDuanwuBanner {
          height: 376px !important;
          min-height: 376px;

          .promo-bg.isDesktop {
            height: 376px !important;
            min-height: 376px;
          }
        }

        &.isMidAutumnWukong {
          .promo-bg {
            height: 585px !important;
          }
        }

        &.iseurocupBanner {
          max-width: none;
          aspect-ratio: 1920/500;

          .promo-bg {
            height: auto !important;
            aspect-ratio: 1920/500;
          }
        }

        .promo-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: top center;

          &.isDesktop {
            display: block;
            height: 500px;
          }

          &.isMobile {
            display: none;
            height: 220px;
          }
        }

        &.isEurocupManualBanner {
          max-width: 100%;

          .promo-bg {
            height: 500px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center center;
          }
        }
      }

      .inner {
        max-width: 1400px;
        width: 95%;
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        gap: 20px;

        &.isYallaCompass,
        &.isBbdachaBelgrade,
        &.isValorantChampionTour2024 {
          background: #e7f1fd;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding-bottom: 50px;
        }

        &.dy2quiz {
          background: #e7f1fd;
          width: 100%;
          max-width: 100%;
          margin: 0;
        }

        &.isEurocupManual {
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100% 100%;
        }

        &.isMidAutumnWukong {
          background-repeat: no-repeat;
          background-size: 100% auto;
        }

        &.isMSI {
          padding: 0px 0 0px;
          margin: 0 auto;
          max-width: none;
          width: 100%;
          background-size: cover;
          position: relative;
        }
        &.esl {
          background-size: cover;
        }

        &.fullwidth {
          width: 100%;
          max-width: 100%;
          margin: 0;

          .promo-view-container {
            display: none;
          }

          .hot-promo {
            border-radius: 0px;
          }
        }

        &.dyworldcup {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
          background-color: #e7f1fd;

          table {
            width: 1920px;
          }
        }

        &.dota2Pgql {
          background-color: #e7f1fd;
          width: 100% !important;
          max-width: 1920px !important;
          margin: 0 auto !important;
        }

        &.duanwujie {
          background-size: 100% auto;
          padding-bottom: 100px;
        }
        &.isCS {
          padding: 30px 0;
          margin: 0 auto !important;
          max-width: 1920px !important;
          background: url(../assets/images/promotion/hotpromo/cs2/bg.png);
          width: 100% !important;
          background-size: cover;
          position: relative;
          //&:after {
          //  content: "";
          //  position: absolute;
          //  bottom: 0;
          //  left: -10px;
          //  background: url(../assets/images/promotion/hotpromo/cs2/bottombg.png) no-repeat center center;
          //  width: 180px;
          //  height: 340px;
          //  background-size: cover;
          //  z-index: -1;
          //}
        }

        .hot-promo {
          // background: #201f29;
          border-radius: 10px;
        }

        .promo-view-container {
          margin: 0 auto;
          max-width: $maxwidth;
          width: 95%;
          text-align: left;
          padding: 20px;
          overflow: auto;

          &.football1 {
            table {
              th,
              td {
                border: 1px solid #999;
              }
            }
          }
          ol {
            li {
              margin: 20px 0;
            }
          }

          .game-title {
            color: #ffd800;
            margin: 30px auto 50px;
            text-align: center;
          }
          .isSpecial {
            color: #7f4c00;
          }
        }
      }
    }
  }
}

.loading {
  height: 25vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "PingFang SC";

  .loading-img {
    animation-name: fade-in-out;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    width: 100px;
  }
}

@keyframes fade-in-out {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .promo-container {
    .all-promotions {
      .banner-container {
        .promo-bg {
          &.isDesktop {
            display: none;
          }

          &.isMobile {
            display: block;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .promo-container {
    .all-promotions {
      .promo-main-container {
        .promo-type-wrapper {
          width: 100vw;

          .type-list {
            flex-wrap: wrap;
          }
        }
        .promo-list-wrapper {
          width: calc(100vw - 80px);
          margin: 0;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));

          .promo-item {
            width: 210px;
            height: 280px;

            .promo-info {
              .viewdetail {
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
