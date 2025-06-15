<template>
  <div class="promo-container">
    <div class="promo-banner" v-if="!isPromoDetail">
      <div class="promo-banner-image">
        <img v-if="!isDark" src="../../assets/promo/top-promo-banner.jpg" />
        <img v-else src="../../assets/promo/promo-banner-dark.png" />
      </div>
    </div>

    <div class="all-promotions" v-if="!isPromoDetail">
      <div class="promo-main-container">
        <div class="promo-type-wrapper">
          <div style="width: 100%">
            <div class="type-list">
              <!-- <img class="type-list-title-img" src="../../assets/promo/menu-title.png" /> -->
              <div class="type-item header">
                <span style="width: 100px" class="label">优惠活动</span>
              </div>
              <div
                class="type-item"
                v-for="p in promoTypes"
                :class="{ active: p.code === promoTabActive }"
                :key="p.code"
                @click="switchPromoType(p.code)"
              >
                <img
                  v-if="p.code === promoTabActive"
                  class="active-arrow"
                  :src="require('../../assets/promo/promo-type-active-arrow.png')"
                />
                <span style="width: 100px" class="label">{{ p.label.zh }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="promo-list-wrapper">
          <div
            class="promo-item"
            v-for="(promo, i) in filteredArray"
            :key="i"
            data-aos="zoom-in"
            data-aos-easing="ease-out"
            data-aos-duration="1000"
            data-aos-offset="-300"
          >
            <a @click="showPromoDetails(promo)">
              <div class="promo-img-wrapper">
                <div class="promo-label">
                  <div class="label-type" v-if="promo.labelType !== 2 && promo.labelType !== -1">
                    {{ getPromoLabel(promo.labelType) }}
                  </div>
                  <div class="label-date">{{ JSON.parse(promo.param).date }}</div>
                </div>

                <div class="promo-details">
                  <!-- <div class="front-date">{{ JSON.parse(promo.param).date }}</div> -->
                  <div class="front-title">{{ promo.title }}</div>
                  <div class="front-sub">{{ JSON.parse(promo.param).sub }}</div>
                  <div class="front-btn">查看详情</div>
                </div>
                <div class="promo-bg">
                  <img class="promo-content isDesktop" :src="imgURL + promo.desktopImgUrlDark" />
                  <img class="promo-content isMobile" :src="imgURL + promo.desktopImgUrlDark" />
                </div>
              </div>
              <!-- <div class="promo-info">
                  <span class="viewdetail">{{ promo.title }}</span>
                </div> -->
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="selected-promo">
      <div class="selected-promo-wrapper" :class="{ darkbluebg: selectedPromo.promoCode === 'lh1-eurocup-2024' }">
        <div
          class="banner-container"
          v-if="
            (selectedPromo?.desktopBannerUrlDark || selectedPromo?.desktopBannerUrl) &&
            selectedPromo.promoCode !== 'lh1-game-steps' &&
            selectedPromo.promoCode !== 'lh1-ftd-promo' &&
            selectedPromo.promoCode !== 'lh1-aijiasu' &&
            selectedPromo.promoCode !== 'lh1-eurocup-regen' &&
            selectedPromo.redirectUrl !== 'lh1-christmas-gashapon'
          "
        >
          <div class="promo-bg isDesktop">
            <img
              :src="
                imgURL +
                (selectedPromo.desktopBannerUrlDark
                  ? selectedPromo.desktopBannerUrlDark
                  : selectedPromo.desktopBannerUrl)
              "
            />
          </div>
          <!--          <div-->
          <!--            class="promo-bg isMobile"-->
          <!--            :style="-->
          <!--              'background-image: url(' +-->
          <!--              imgURL +-->
          <!--              (selectedPromo.displayMobileBannerUrl-->
          <!--                ? selectedPromo.displayMobileBannerUrl-->
          <!--                : selectedPromo.displayMobileImgUrl) +-->
          <!--              ''-->
          <!--            "-->
          <!--          ></div>-->
        </div>
        <BlastPremierMarquee
          :type="selectedPromo?.redirectUrl === 'bounty-blast-premier' ? 'bounty' : null"
          v-if="
            selectedPromo?.redirectUrl === 'lh-cs2-blast-2024' ||
            selectedPromo?.redirectUrl === 'lh1-blast-premier-treasure' ||
            selectedPromo?.redirectUrl === 'bounty-blast-premier'
          "
        />
        <div
          class="inner"
          :style="{
            backgroundColor:
              (selectedPromo?.promoCode === 'lh1worldcup' ||
                selectedPromo?.promoCode === 'lh1worldcupdota2' ||
                selectedPromo?.promoCode === 'lh-official-gift' ||
                selectedPromo?.promoCode === 'lh1-newplayer-guide' ||
                selectedPromo?.promoCode === 'lh-nba24-match' ||
                selectedPromo?.promoCode === 'lh1-slot-lucky8' ||
                selectedPromo?.promoCode === 'lh1-olympic-checkin') &&
              !isDark
                ? '#E7F1FD'
                : selectedPromo?.promoCode === 'lh-sport-zhongchao'
                ? '#F5F6F8'
                : selectedPromo?.promoCode === 'lh-lpl-summer24'
                ? '#1D1D1E'
                : '',
            backgroundImage:
              selectedPromo?.displayDesktopImgBackgroundUrl ||
              selectedPromo?.promoCode === 'lh-sport-zhongchao' ||
              selectedPromo?.promoCode === 'lh-nba24-match' ||
              selectedPromo?.promoCode === 'lh-lpl-summer24'
                ? `url(${imgURL + selectedPromo.displayDesktopImgBackgroundUrl})`
                : ''
          }"
          :class="{
            fullwidth:
              selectedPromo.promoCode === 'lh1-game-steps' ||
              selectedPromo.promoCode === 'lh1-ftd-promo' ||
              selectedPromo.promoCode === 'lh-eurocup-manual' ||
              selectedPromo.promoCode === 'lh-lpl-summer24' ||
              selectedPromo.promoCode === 'lh1-intel-esl' ||
              selectedPromo.promoCode === 'lh1-eurocup-regen' ||
              selectedPromo.redirectUrl === 'lh1-christmas-gashapon',
            aijiasubg: selectedPromo.promoCode === 'lh1-aijiasu',
            'europe-first-shoot': selectedPromo.promoCode === 'lh1-eurocup-firstshoot',
            shoutouxinxiu: selectedPromo.promoCode === 'lh1-shoutouxinxiu',
            bgautosize: selectedPromo.promoCode === 'lh1-eurocup-2024'
          }"
        >
          <div class="hot-promo" v-if="selectedPromo.hasPromo">
            <HotPromotion :list="selectedPromo" />
          </div>
          <div
            class="promo-view-container"
            :class="{
              welcome: selectedPromo.promoType?.toLowerCase() === 'welcome',
              sport: selectedPromo.promoType?.toLowerCase() === 'sport',
              eSport: selectedPromo.promoType?.toLowerCase() === 'esport',
              fish: selectedPromo.promoType?.toLowerCase() === 'fish',
              liveCasino: selectedPromo.promoType?.toLowerCase() === 'livecasino',
              slot: selectedPromo.promoType?.toLowerCase() === 'slot game',
              olympicCheckin: selectedPromo.promoCode === 'lh1-olympic-checkin'
            }"
            v-if="selectedPromo.promoCode !== 'lh-eurocup-manual' && selectedPromo.pageContent"
          >
            <div v-if="selectedPromo.redirectUrl === 'lh1-mesa-nomadic-masters-spring-2025'">
              <MesaPromo :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'lh1-nba-water-battle'">
              <NBAWaterBattle :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'lh1-valorant-masters-toronto-2025'">
              <TorontoMasters :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'lh1-fifa-2025'">
              <Fifa2025Promo :promoCode="selectedPromo.promoCode" />
            </div>
            <div v-if="selectedPromo.redirectUrl === 'lh1-blast-tv-austin-major-2025'">
              <BlastAustin :promoCode="selectedPromo.promoCode" />
            </div>
            <div
              v-if="selectedPromo.redirectUrl !== 'lh1-christmas-gashapon'"
              :class="`content-` + selectedPromo.redirectUrl"
              v-html="selectedPromo.pageContent"
            ></div>
          </div>
          <div
            v-if="['lh-cs2-copenhagen-major-2024', 'lh-cs2-blast-2024'].includes(selectedPromo.redirectUrl)"
            class="corner-decor"
            style="position: absolute; left: 0px; bottom: 0px"
          >
            <img
              width="125px"
              v-if="selectedPromo.redirectUrl === 'lh-cs2-copenhagen-major-2024'"
              src="../../assets/images/promotion/hotpromo/cs2/bottombg.png"
            />
            <img
              v-if="selectedPromo.redirectUrl === 'lh-cs2-blast-2024'"
              src="@/assets/images/promotion/hotpromo/blastpremier/bg.png"
            />
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
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
import moment from "moment";
import { useDark } from "@vueuse/core";
import { loadPromoTypes } from "@/api/index/promo.js";
import HotPromotion from "@/components/HotPromotion";
import { useLocalStorage } from "@vueuse/core";
import BlastPremierMarquee from "@/components/hotpromo/BlastPremierPromo/BlastPremierMarquee.vue";
import NBAWaterBattle from "@/components/hotpromo/nba-water-battle/NBAWaterBattle.vue";
import MesaPromo from "@/components/hotpromo/mesa/MesaPromo.vue";

const BlastAustin = defineAsyncComponent(() => import("@/components/hotpromo/blast-austin/BlastAustin.vue"));
const TorontoMasters = defineAsyncComponent(() => import("@/components/hotpromo/toronto-masters/TorontoMasters.vue"));
const Fifa2025Promo = defineAsyncComponent(() => import("@/components/hotpromo/fifa-2025/Fifa2025Promo.vue"));

export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion,
    NBAWaterBattle,
    BlastPremierMarquee,
    MesaPromo,
    BlastAustin,
    TorontoMasters,
    Fifa2025Promo
  },
  setup() {
    const isDark = useDark();

    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
    const banner = ref([]);
    const promoState = reactive({
      active: "ALL",
      promoList: []
    });
    const promoTypes = ref([
      { code: "ALL", img: "all", label: "全站优惠" },
      { code: "FTD", img: "deposit", label: "新人优惠" },
      { code: "ESPORT", img: "esport", label: "电竞优惠" },
      { code: "SPORT", img: "sport", label: "体育优惠" },
      { code: "LIVE CASINO", img: "live", label: "真人优惠" },
      { code: "POKER", img: "poker", label: "棋牌优惠" },
      // { code: "FISH", img: 'fish', label: '捕鱼'},
      { code: "DAILY", img: "daily", label: "日常优惠" },
      { code: "OTHER", img: "slot", label: "其他优惠" }
    ]);
    const promoTabActive = ref(promoTypes.value[0].code);
    const filteredArray = ref([]);
    const isPromoDetail = computed(() => {
      if (route.query && route.query?.name) {
        return true;
      }
      return false;
    });
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();

    const countDay = ref(5);
    const euroCupStartDate = moment("2024-06-15");
    countDay.value = euroCupStartDate.diff(moment(), "days");
    if (countDay.value <= 0) {
      countDay.value = 0;
    }

    // watch(() => route.query, () => {
    //   if (route.query === null) {
    //    isPromoDetail.value = false
    //   } else {
    //     isPromoDetail.value = route.query.name
    //   }
    // });
    // const loadBanner = () => {
    //   loadPromoBanner("PROMO").then((res) => {
    //     if (res.code === 0) {
    //       banner.value = res.data[0]
    //     } else {
    //       ElMessage.error(res.message)
    //     }
    //   })
    // }
    const showPromoDetails = (promo) => {
      // if (!store.token) {
      //   ElMessageBox.alert("请登录后再操作", "系统提示", {
      //     // if you want to disable its autofocus
      //     // autofocus: false,sd
      //     center: true,
      //     confirmButtonText: "确认",
      //     showClose: false,
      //     buttonSize: "large"
      //   }).then(() => {
      //     // router.push('/login');
      //     store.loginPageVisible = true;
      //   });
      //   return;
      // } else {
      // }
      if (promo.redirectUrl.includes("page-vip")) {
          router.push("/vip");
        } else if (promo.redirectUrl.includes("lh1-invite")) {
          router.push("/privilege/invite");
        } else {
          router.push({ name: "promotion", query: { name: promo.redirectUrl } });
          // if (route.query.name === 'lh1-invite-2' || route.query.name === 'lh1-invite-3' || route.query.name === 'lh1-football-fight-2' || route.query.name === 'lh1-football-fight-3') {
          //   router.push({name: 'promotion', query: {name: route.query.name}})
          // } else {
          //   router.push({name: 'promotion', query: {name: promo.redirectUrl}})
          // }
          // isPromoDetail.value = true;

          console.log(promo, "promo");
          selectedPromo.value = promo;
        }
    };

    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };

    const switchPromoType = (type) => {
      scrollToTop();

      promoTabActive.value = type;
      if (type !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {
          return promo.promoType.toLowerCase().split(",").includes(type.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList;
      }
    };

    const loadAll = async () => {
      await loadPromoTypes().then((res) => {
        if (res.length > 0) {
          promoTypes.value = [];
          res.forEach(element => {
            const obj = {
              code: element.value,
              img: 'all',
              iconUrl: imgURL + element.iconUrl,
              label: JSON.parse(element.name)
            };
            promoTypes.value.push(obj);
          });
          switchPromoType(promoTypes.value[0].code)
        } else {
          console.warn('No promo types loaded, using default promo types.');
        }
      });
      loadPromo()
        .then((res) => {
          if (res.code === 0) {
            if (promoState.promoList.length === 0) {
              promoState.promoList.push(...res.data);
              const processedData = res.data.filter(promo => !['lh1-dark-mode'].includes(promo.redirectUrl)).map(promo => ({
                ...promo,
                displayDesktopBannerUrl: promo.desktopBannerUrlDark ?? promo.desktopBannerUrl,
                displayDesktopImgBackgroundUrl: promo.desktopImgBackgroundUrlDark ?? promo.desktopImgBackgroundUrl,
                displayDesktopImgUrl: promo.desktopImgUrlDark ?? promo.desktopImgUrl,
                displayMobileBannerUrl: promo.mobileBannerUrlDark ?? promo.mobileBannerUrl,
                displayMobileImgBackgroundUrl: promo.mobileImgBackgroundUrlDark ?? promo.mobileImgBackgroundUrl,
                displayMobileImgUrl: promo.mobileImgUrlDark ?? promo.mobileImgUrl,
              }))
              if (promoState.promoList.length === 0) {
                promoState.promoList.push(...processedData);
                promoState.promoList.push(...res.data);
              }
              promoState.promoList.forEach((element) => {
                // if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
                //   promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
                // } else {
                if (route.query.name === "lh1-invite-2" || route.query.name === "lh1-invite-3") {
                  if (element.redirectUrl === "lh1-invite") {
                    showPromoDetails(element);
                  }
                }
                if (route.query.name === "lh1-football-fight-2" || route.query.name === "lh1-football-fight-3") {
                  if (element.redirectUrl === "lh1-football-fight") {
                    showPromoDetails(element);
                  }
                }
                if (element.redirectUrl === route.query.name) {
                  showPromoDetails(element);
                }
                // }
              });
            }


          }
        })
        .catch((e) => {
          console.log("error", e);
        });
      switchPromoType(promoState.active);
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
    onMounted(() => {
      //COMMENT: I GUESS We not Using This So I Remove it.
      // loadBanner();
      if(route.query.name === 'page-vip'){
        router.push('/vip');
        return
      }
      loadAll();
    });

    watch(
      () => route.query.name,
      () => {
        if (route.query.name) {
          loadAll();
        }
      }
    );

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
      countDay,
      isDark
    };
  }
});
</script>

<style lang="scss" scoped>
.promo-container {
  //overflow-x: hidden;
  min-height: 600px;

  .promo-banner {
    //background: #f3f7fd;
    width: 100%;
    display: flex;
    justify-content: center;

    .promo-banner-image {
      position: relative;
      overflow: hidden;

      img {
        margin-top: 21px;
        height: 305px;
      }
    }
  }

  .all-promotions {
    // background: url(../../assets/promo/top-promo-banner.jpg) no-repeat center top;
    // background-size: 100% auto;
    // padding-top: max(110px, 16vw);
    width: 100%;
    padding: 30px 50px 50px;
    position: relative;
    background-color: #f3f7fd;
  }
  .promo-view-container {
    line-height: 30px;
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

      tr:first-child td {
        background-image: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
        color: #ffffff;
        border: 0;
      }
      tr:first-child td:first-child {
        border-top-left-radius: 10px;
      }
      tr:first-child td:last-child {
        border-top-right-radius: 10px;
      }

      border-collapse: collapse;
      th,
      td {
        padding: 10px;
      }
      tbody {
        display: table;
        table-layout: fixed;
        width: 100%;
      }
      th {
        // background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
        background: #e7f3ff;
        p {
          margin: 0;
        }
        &:first-child {
          border-top-left-radius: 20px;
        }
        &:last-child {
          border-top-right-radius: 20px;
        }
      }
      td {
        // background-color: #202228;
        border: 1px solid #dcdce8;
        color: #7a8eb9;
      }
      tr {
        p {
          margin: 0px;
        }
      }
    }

    .content-lh1-poker-refund {
      //color: #fff;
      padding: 0px 24px 30px;
    }
    .content-LH-baccarat-win {
      padding: 0px 24px 30px;
    }
    .content-lh1-feedback-award {
      color: #fff;
      :deep(img) {
        filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(232deg) brightness(100%)
          contrast(106%);
      }
    }
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  // padding-bottom: 80px;

  // min-height: 70vh;
  // color: #ffffff;
  .banner-container {
    // min-height: 500px;
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
        img {
          width: 100%;
        }
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
      display: flex;
      gap: 30px;
      min-height: 1250px;
      align-items: flex-start;
      .promo-type-wrapper {
        display: flex;
        box-shadow: 0px 4px 22px 0px #00000026;
        border-radius: 20px;
        min-width: 250px;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
        /* width */
        align-self: flex-start;
        position: sticky;
        top: 120px;
        ::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          // display: none;
        }
        .type-list {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 20px;
          overflow: auto;
          width: 100%;
          flex-direction: column;
          gap: 25px;
          // position: sticky;
          // top: 100px;
          .type-item {
            cursor: pointer;
            // border-radius: 20px;
            // background: #201f29;
            // box-shadow: 0 0 10px -3px #000000;
            // white-space: nowrap;
            // margin: 0 10px;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding: 12px 40px;
            position: relative;
            width: 100%;
            border-radius: 30px;
            box-shadow: 0px -1.6610169410705566px 6.085966110229492px 0px #a2bff4 inset;

            .active-arrow {
              position: absolute;
              left: -4px;
            }

            .label {
              z-index: 0;
              color: #468cff;
              font-size: 23px;
            }

            &:before {
              // content: "";
              // position: absolute;
              // width: 100%;
              // height: 100%;
              // // box-shadow: 0 3px 4px 0 rgb(0 0 0 / 15%);
              // box-shadow: 0px 3px 7px 1px rgba(0, 0, 0, 0.15);
              // transform: skewX(15deg);
              // border-radius: 4px 15px;
            }
            &.active {
              background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
              box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

              // background: #4b4e66;
              // box-shadow: 0 0 5px #ffffff;
              // background-image: linear-gradient(90deg,#35d8f2 0,#2188c9 100%),linear-gradient(#5243bd,#5243bd);
              .label {
                color: #ffffff;
              }

              &:before {
                background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#3077f6, #3077f6);
              }
            }
          }
        }
      }
      .promo-list-wrapper {
        width: 90%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: url(../../assets/promo/front-bg.png) no-repeat center center;
          background-size: cover;
          box-shadow: 0px 4px 26px 0px #00000026;

          border-radius: 20px;
          a {
            display: block;
          }
          &:hover {
            .promo-info {
              background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#3077f6, #3077f6);
              background-blend-mode: normal, normal;
              .viewdetail {
                color: #fefefe;
              }
            }
          }
          img {
          }
          cursor: pointer;

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 50px;
            // border-radius: 10px 10px 0 0;
            position: relative;

            .promo-label {
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              align-items: center;
              height: 42px;
              gap: 60px;
              padding: 20px;

              .label-type {
                background: linear-gradient(89.92deg, #454bc2 0.06%, #b1a5f0 106.9%);
                color: #ffffff;
                position: relative;
                width: 100px;
                font-weight: bold;

                &:after {
                  content: "";
                  border-left: 0 solid transparent;
                  border-right: 20px solid transparent;
                  border-top: 42px solid #a89eed;
                  display: inline-block;
                  position: absolute;
                  left: 100%;
                  top: 0;
                }
              }

              .label-date {
                color: #606479;
                font-size: 18px;
                font-weight: 700;
              }
            }
            .promo-type {
              position: absolute;
              left: 0;
              top: 0;
              background: linear-gradient(89.92deg, #454bc2 0.06%, #b1a5f0 106.9%);
              padding: 10px 30px 10px 50px;
              color: #ffffff;
              &:after {
                content: "";
                border-left: 0 solid transparent;
                border-right: 20px solid transparent;
                border-top: 42px solid #a89eed;
                display: inline-block;
                position: absolute;
                left: 100%;
                top: 0;
              }
            }
            .promo-details {
              font-family: "Microsoft Yahei UI";
              margin: 20px 0;
              padding: 50px 0 10px 0;
              display: flex;
              gap: 5px;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              .front-date {
                color: #606479;
                font-size: 18px;
                font-weight: 700;
              }
              .front-title {
                color: #4c88f8;
                font-size: 30px;
                font-weight: 700;
              }
              .front-sub {
                color: #7a80a1;
                font-size: 18px;
                font-weight: 700;
              }
              .front-btn {
                color: #ffffff;
                padding: 5px 30px;
                background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);

                box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

                box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                border-radius: 8px;
              }
            }
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
            // position: absolute;
            text-align: right;
            // border-radius: 0 0 10px 10px;

            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .viewdetail {
              color: #232323;
              padding: 20px 10px;
              overflow: hidden;
              font-size: 12px;
              text-align: center;
              width: 100%;
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
      &.darkbluebg {
        background-color: #0d3173;
        .inner {
          margin-top: -100px;
          background-position: 0 160px;
        }
      }
      .banner-container {
        width: 100%;
        .promo-bg {
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: center center;
          &.isDesktop {
            display: block;
            img {
              width: 100%;
              display: block;
            }
          }
          &.isMobile {
            display: none;
            height: 220px;
          }
        }
      }
      .inner {
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        background-size: 100% 100%;
        background-position: top center;
        gap: 20px;
        background-repeat: no-repeat;

        &.bgautosize {
          background-size: 100% auto;
        }

        &.fullwidth {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;

          .hot-promo {
            border-radius: 0px;
          }

          .promo-view-container {
            display: none;
          }
        }

        &.aijiasubg {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background-size: 100% auto;
          background-attachment: fixed;

          .hot-promo {
            border-radius: 0px;
          }

          .promo-view-container {
            display: none;
          }
        }

        &:has(.corner-decor) {
          position: relative;
        }

        &.europe-first-shoot {
          background-color: #0d3173;
          background-image: none !important;
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
          color: #7a8eb9;
          font-size: 20px;
          overflow: auto;

          ol {
            li {
              margin: 20px 0;
            }
          }

          &.olympicCheckin {
            border: 1px solid #acd4f6;
            border-radius: 10px;
            padding: 10px 10px 10px 30px;
            background: #f2f8fe;
            max-width: 1200px;
            margin: 0 auto;
            img:nth-child(1) {
              padding: 0;
            }
          }
          .game-title {
            color: #ffd800;
            margin: 30px auto 50px;
            text-align: center;
          }
        }
      }
    }
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
    padding-bottom: 60px;
    min-height: 100vh;
    .all-promotions {
      .web-only-box {
        display: none;
      }
      .promo-main-container {
        width: 95%;
        .promo-type-wrapper {
          .type-list {
            justify-content: flex-start;
            font-size: 14px;
            .type-item {
            }
          }
        }
        .promo-list-wrapper {
          margin-top: 20px;
          grid-template-columns: 1fr;
          .promo-item {
            width: 100%;
            .promo-info {
              height: 40px;
              padding-left: 40px;
              line-height: 40px;
              .viewdetail {
                padding: 5px 10px;
              }
            }
            .promo-img-wrapper {
              .promo-bg {
                .promo-content {
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
      }
    }
    .selected-promo {
      overflow: hidden;
      .selected-promo-wrapper {
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
}

.dark {
  .promo-container {
    background: url("../../assets/promo/promo-page-bg-dark.jpg") no-repeat top center;
    background-size: 100vw 100vh;
    background-attachment: fixed;

    .all-promotions {
      background: transparent;

      .promo-main-container {
        .promo-type-wrapper {
          // @include content-block-dark;
          border: 1px solid rgba(120, 171, 219, 1);
          overflow: hidden;

          .type-list {
            padding: 0px;
            gap: 5px;

            .type-item {
              background: linear-gradient(90deg, #2a3755 0%, #1a2338 100%);
              box-shadow: none;
              border-radius: 0px;

              &.header {
                background: linear-gradient(180deg, #18437c 0%, #182537 100%);
                border-bottom: 1px solid rgba(120, 171, 219, 1);
              }

              &.active {
                background: linear-gradient(90deg, #455884 0%, #1a2338 100%);
                box-shadow: none;
              }

              .label {
                color: $color-white;
              }
            }
          }
        }

        .promo-list-wrapper {
          .promo-item {
            background: url("../../assets/promo/promo-item-bg-dark.png") no-repeat top center;
            background-size: 100% 100%;
            border-radius: 0px;
            // background: url(../../assets/promo/front-bg-dark.png) no-repeat center center;
            // background-size: cover;

            .promo-img-wrapper {
              .promo-label {
                .label-type {
                  background: transparent;
                  &::after {
                    display: none;
                    border: none;
                    bottom: 0;
                    left: calc(100% - 1px);
                    background: $active-color-dark-linear;
                    width: 20px;
                    clip-path: polygon(0 0, 0% 110%, 100% 0);
                  }
                }

                .label-date {
                  color: rgba($color-white, 90%);
                }
              }

              .promo-details {
                .front-title {
                  color: #fff;
                }

                .front-sub {
                  color: $color-white;
                }

                .front-btn {
                  background: url("../../assets/promo/promo-check-info-btn.png");
                  background-size: 100% 100%;

                  &:hover {
                    filter: brightness(1.2);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
