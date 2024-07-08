<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">
      <div class="promo-main-container">
        <div class="promo-top">
          <div class="promo-top-img1">
            <img src="../assets/promo/bg-top-img1.png" alt="" width="100%" />
          </div>
          <div class="promo-top-img2">
            <img src="../assets/promo/bg-top-img2.png" alt="" width="100%" />
          </div>
        </div>
        <div class="promo-type-wrapper">
          <div class="type-list">
            <div
              class="type-item"
              v-for="p in promoTypes"
              :class="{ active: p.code === promoTabActive }"
              :key="p.code"
              @click="switchPromoType(p.code)"
            >
              <img :src="require('../assets/promo/menu-' + p.img + '.svg')" />
              <span class="label">{{ p.label }}</span>
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
          >
            <a @click="showPromoDetails(promo)">
              <div class="promo-info">
                <span class="time">{{ JSON.parse(promo.param).date }}</span>
                <span class="viewdetail" v-html="JSON.parse(promo.param).title"></span>
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
      <img src="../assets/promo/bg-top.png" alt="" class="all-promotions-bg" />
    </div>

    <div
      v-else
      class="selected-promo"
      :class="{
        isMSIPromo: selectedPromo.promoCode === 'dy2-msi-promo'
      }"
    >
      <div class="selected-promo-wrapper">
        <div
          class="banner-container"
          v-if="
            selectedPromo.promoCode !== 'dy2-cny-step-game' &&
            selectedPromo.promoCode !== 'dy2-game-steps' &&
            selectedPromo.promoCode !== 'dy2-msi-promo'
          "
          :class="{
            isCSBanner:
              selectedPromo.promoCode === 'dy2-cs2-copenhagen-major-2024' ||
              selectedPromo.promoCode === 'dy2-cs2-blast-2024',
            isEurocupManualBanner: selectedPromo.promoCode === 'dy2-eurocup-manual',
            isDuanwuBanner: selectedPromo.promoCode === 'dy-duanwujie24',
            iseurocupBanner: selectedPromo.promoCode === 'dy2-eurocup-hongbao'
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

        <div
          class="inner"
          :class="{
            isCS: selectedPromo.promoCode === 'dy2-cs2-copenhagen-major-2024',
            isMSI: selectedPromo.promoCode === 'dy2-msi-promo',
            isEurocupManual: selectedPromo.promoCode === 'dy2-eurocup-manual',
            fullwidth:
              selectedPromo.promoCode === 'dy2-cny2024-promo' ||
              selectedPromo.promoCode === 'dy2-cny-step-game' ||
              selectedPromo.promoCode === 'dy2-game-steps' ||
              selectedPromo.promoCode === 'dy2-eurocup-hongbao' ||
              selectedPromo.promoCode === 'dy2-lpl-summer24' ||
              selectedPromo.promoCode === 'dy2-eurocup-manual' ||
              selectedPromo.promoCode === 'dy2-cs2-blast-2024',
            duanwujie: selectedPromo.promoCode === 'dy-duanwujie24',
            dyworldcup: selectedPromo?.promoCode === 'dy2worldcup' || selectedPromo?.promoCode === 'dy2worldcupdota2'
          }"
          :style="{
            backgroundImage: selectedPromo?.desktopImgBackgroundUrl
              ? `url(${imgURL + selectedPromo.desktopImgBackgroundUrl})`
              : 'none'
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
              isHide: selectedPromo.promoCode === 'dy2-msi-promo'
            }"
          >
            <div :class="{ isSpecial: !isSpecialPromo }" v-html="selectedPromo.pageContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted, reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadPromo } from "@/api/index/promo.js";
import { loadPromoBanner } from "@/api/index/promo";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";

import HotPromotion from "@/components/HotPromotion";

export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion
  },
  setup() {
    const store = userStore();
    const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";
    const banner = ref([]);
    const promoState = reactive({
      active: "ALL",
      promoList: []
    });
    const promoTypes = ref([
      { code: "ALL", img: "all", label: "所有优惠" },
      { code: "ESPORT", img: "esport", label: "电竞" },
      { code: "SPORT", img: "sport", label: "体育" },
      // { code: "POKER", img: 'poker', label: '棋牌'},
      { code: "LIVE CASINO", img: "live", label: "真人娱乐" },
      { code: "FISH", img: "game", label: "老虎机/捕鱼" }
    ]);
    const promoTabActive = ref(promoTypes.value[0].code);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();

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
    const isSpecialPromo = ref(false)
    const showPromoDetails = (promo) => {
      if (!store.token) {
        ElMessageBox.alert("请登录后再操作", "系统提示", {
          // if you want to disable its autofocus
          // autofocus: false,
          center: true,
          confirmButtonText: "确认",
          showClose: false,
          buttonSize: "large"
        }).then(() => {
          store.loginPageVisible = true;
        });
        return;
      } else {
        if (promo.redirectUrl.includes("page-vip")) {
          router.push("/vip");
        } else if (promo.redirectUrl.includes("Dongying-refer")) {
          router.push("/privilege/invite");
        } else if (promo.redirectUrl.includes("hongbaoyu")) {
          router.push("/privilege/hongbaoyu");
        }else {
          console.log(promo)
          if (promo.redirectUrl === 'dy2-cs2-copenhagen-major-2024' || promo.redirectUrl === 'dy2-msi-promo') {
            isSpecialPromo.value = true;
          } else {
            isSpecialPromo.value = false;
          }
          router.push({ name: "promotion", query: { name: promo.redirectUrl } });
          isPromoDetail.value = true;
          selectedPromo.value = promo;
        }
      }
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
    const loadAll = () => {
      const isLogin = !!store.hasToken();
      loadPromo(isLogin).then((res) => {
        if (res.code === 0) {
          promoState.promoList.push(...res.data);

          res.data.forEach(element => {
            // if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
            //   promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
            // } else {
              if (element.redirectUrl === route.query.name) {
                showPromoDetails(element);
              }
            // }
          });
        }
      }).catch((e) => {
        console.log("error", e);
      });
      switchPromoType(promoState.active);
    };
    onMounted(() => {
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
      getPromoLabel
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
    min-height: 40vh;
    padding: 50px;
    position: relative;
    background-color: #ebf4ff;

    margin: 0 auto;
    max-width: 1920px;
  }

  .all-promotions-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0.5;
    pointer-events: none;
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

      th,
      td {
        padding: 10px;
        p {
          margin: 0;
          line-height: 21px;
        }
      }

      tbody {
        //display: table;
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
  // padding-bottom: 80px;

  // min-height: 70vh;
  // color: #ffffff;
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
          padding: 20px 0;
          overflow: auto;
          width: 90%;
          margin-bottom: 20px;
          margin-top: 16px;

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
        padding-bottom: 50px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 15px;

        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background-color: #f2f6ff;
          box-shadow: 0 3px 9px 0 rgba(112, 122, 143, 0.4);
          border-radius: 16px;

          a {
            display: flex;
            flex-direction: column;
            height: 100%;
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
            text-align: right;
            padding: 16px;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: start;
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
              width: 100%;
              font-family: PingFang SC;
              font-weight: 600;
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
            top: 0px;
            right: 0px;
            background: url("../assets/images/promotion/hotpromo/common/promo-label-ribbon.png") no-repeat 100%/100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 60px;
            height: 34px;

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

    .selected-promo-wrapper {
      .banner-container {
        width: 100%;
        max-width: 1920px;
        margin: 0 auto;

        &.isCSBanner {
          min-height: 660px;
          max-width: none;

          .promo-bg {
            min-height: 660px !important;
            background-size: 100% 100%;
          }
        }

        &.isDuanwuBanner {
          height: 376px !important;
          min-height: 376px;

          .promo-bg {
            height: 376px !important;
            min-height: 376px;
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

        &.isEurocupManual {
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100% 100%;
        }

        &.isMSI {
          padding: 0px 0 0px;
          margin: 0 auto;
          max-width: none;
          width: 100%;
          background-size: cover;
          position: relative;
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
        &.duanwujie {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
          background-image: url(../assets/images/promotion/web-bg.jpg) !important;

          .promo-view-container {
            display: none;
          }

          .hot-promo {
            border-radius: 0px;
          }
        }
        &.isCS {
          padding: 30px 0;
          margin: 0 auto;
          max-width: 1920px;
          background: url(../assets/images/promotion/hotpromo/cs2/bg.png);
          width: 100%;
          background-size: cover;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: -10px;
            background: url(../assets/images/promotion/hotpromo/cs2/bottombg.png) no-repeat center center;
            width: 180px;
            height: 340px;
            background-size: cover;
            z-index: -1;
          }
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

          ol {
            li {
              margin: 20px 0;
            }
          }

          overflow: auto;

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
</style>
