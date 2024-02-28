<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">
      <div class="promo-main-container">
        <div class="promo-type-wrapper">
          <el-affix :offset="80">
            <div class="type-list">
              <img src="../assets/promo/menu-title.png" />
              <div
                class="type-item"
                v-for="p in promoTypes"
                :class="{ active: p.code === promoTabActive }"
                :key="p.code"
                @click="switchPromoType(p.code)"
              >
                <img :src="require('../assets/promo/menu-' + p.img + '.png')" />
                <span style="width: 100px" class="label">{{ p.label }}</span>
              </div>
            </div>
          </el-affix>
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
              <div class="promo-img-wrapper">
                <div class="promo-label">
                  <div class="label-type">{{ getPromoLabel(promo.labelType) }}</div>
                  <div class="label-date">{{ JSON.parse(promo.param).date }}</div>
                </div>

                <div class="promo-details">
                  <!-- <div class="front-date">{{ JSON.parse(promo.param).date }}</div> -->
                  <div class="front-title">{{ promo.title }}</div>
                  <div class="front-sub">{{ JSON.parse(promo.param).sub }}</div>
                  <div class="front-btn">查看详情</div>
                </div>
                <div class="promo-bg">
                  <img class="promo-content isDesktop" :src="imgURL + promo.desktopImgUrl" />
                  <img class="promo-content isMobile" :src="imgURL + promo.mobileImgUrl" />
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
      <div class="selected-promo-wrapper">
        <div class="banner-container">
          <div class="promo-bg isDesktop">
            <img
              :src="
                imgURL + (selectedPromo.desktopBannerUrl ? selectedPromo.desktopBannerUrl : selectedPromo.desktopImgUrl)
              "
            />
          </div>
          <!-- <div
            class="promo-bg isDesktop"
            :style="
              'background-image: url(' +
              imgURL +
              (selectedPromo.desktopBannerUrl ? selectedPromo.desktopBannerUrl : selectedPromo.desktopImgUrl) +
              ''
            "
          ></div> -->
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
          :style="
            selectedPromo.desktopImgBackgroundUrl
              ? `background-image: url(${imgURL + selectedPromo.desktopImgBackgroundUrl})`
              : 'background-image: url(../assets/promo/web-bg.jpg)'
          "
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
              slot: selectedPromo.promoType.toLowerCase() === 'slot game'
            }"
          >
            <div v-html="selectedPromo.pageContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadPromo } from "@/api/index/promo.js";
import { loadPromoBanner } from "@/api/index/promo";
import { userStore } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";

import HotPromotion from '@/components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion
  },
  setup() {
    const store = userStore();
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/promo/';
    const banner = ref([]);
    const promoState = reactive({
      active: "ALL",
      promoList: [],
    });
    const promoTypes = ref([
      { code:"ALL", img: 'all', label: '全站优惠' },
      { code: "ESPORT", img: 'esport', label: '电竞优惠'},
      { code: "SPORT", img: 'sport', label: '体育优惠'},
      // { code: "POKER", img: 'poker', label: '棋牌'},
      { code: "LIVE CASINO", img: 'live', label: '真人娱乐'},
      // { code: "FISH", img: 'fish', label: '捕鱼'},
      { code: "OTHERS", img: 'slot', label: '其他优惠'},
    ]);
    const promoTabActive = ref(promoTypes.value[0].code);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    watch(() => route.query, () => {
      if (route.query === null) {
       isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.name
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });
    const loadBanner = () => {
      loadPromoBanner("PROMO").then((res) => {
        if (res.code === 0) {
            banner.value = res.data[0]
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    const showPromoDetails = (promo) => {

      if (!store.token) {
          ElMessageBox.alert('请登录后再操作', '系统提示', {
              // if you want to disable its autofocus
              // autofocus: false,
              center: true,
              confirmButtonText: '确认',
              showClose: false,
              buttonSize: 'large'
          }).then(() => {
              store.loginPageVisible = true
          })
          return
      } else {
        if (promo.redirectUrl.includes("page-vip")) {
          router.push("/vip");
        } else if (promo.redirectUrl.includes("lh1-invite")) {
          router.push("/privilege/invite");
        } else {
          router.push({name: 'promotion', query: {name: promo.redirectUrl}})
          // if (route.query.name === 'lh1-invite-2' || route.query.name === 'lh1-invite-3' || route.query.name === 'lh1-football-fight-2' || route.query.name === 'lh1-football-fight-3') {
          //   router.push({name: 'promotion', query: {name: route.query.name}})
          // } else {
          //   router.push({name: 'promotion', query: {name: promo.redirectUrl}})
          // }
          isPromoDetail.value = true
          selectedPromo.value = promo
        }
      }
    }

    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };

    const switchPromoType = (type) => {
      scrollToTop();
    
      promoTabActive.value = type;
      if (type !== "ALL") {
        if(type ==='OTHERS'){
          filteredArray.value = promoState.promoList.filter(function(promo) {
            const promoTypes = promo.promoType.toLowerCase().split(",");
            return promoTypes.includes("slot game") || promoTypes.includes("welcome") || promoTypes.includes("fish");
          });
          console.log(filteredArray.value);
        }else{
          filteredArray.value = promoState.promoList.filter(function(promo) {
            return promo.promoType.toLowerCase().split(',').includes(type.toLowerCase());
          });
        }

      } else {
        filteredArray.value = promoState.promoList
      }
    };
    const loadAll = () => {
      loadPromo().then((res) => {
        if(res.code === 0) {
          promoState.promoList.push(...res.data);
          res.data.forEach(element => {
            if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
              promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
            } else {
              if (route.query.name === 'lh1-invite-2' || route.query.name === 'lh1-invite-3') {
                if (element.redirectUrl === 'lh1-invite') {
                  showPromoDetails(element)
                }
              }
              if (route.query.name === 'lh1-football-fight-2' || route.query.name === 'lh1-football-fight-3') {
                if (element.redirectUrl === 'lh1-football-fight') {
                  showPromoDetails(element)
                }
              }
              if (element.redirectUrl === route.query.name) {
                showPromoDetails(element)
              }
            }
          });
        }
      }).catch((e) => { console.log("error", e); });
      switchPromoType(promoState.active)
    }

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
      loadBanner();
      loadAll();
    });

    watch(() => route.query.name, () => {
      if (!route.query.name) {
        isPromoDetail.value = false
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
    }
  },
});
</script>
<style lang="scss">
.promo-container {
  .all-promotions {
    background: url(../assets/promo/bg-top2.jpg) no-repeat center top;
    width: 100%;
    background-size: 100% auto;
    padding: 50px;
    position: relative;
    padding-top: max(300px, 22vw);
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
        &:last-child {
          td:first-child {
            border-radius: 20px 0 0 0;
          }
        }
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
      .promo-type-wrapper {
        display: flex;
        box-shadow: 0px 4px 22px 0px #00000026;
        border-radius: 20px;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
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
          padding: 20px;
          overflow: auto;
          width: 280px;
          flex-direction: column;
          gap: 35px;
          min-height: 818px;
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
            img {
              max-height: 30px;
              filter: grayscale(0);
            }
            &.active,
            &:hover {
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
        display: flex;
        flex-direction: column;
        gap: 20px;
        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: url(../assets/promo/front-bg.png) no-repeat center center;
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
              .label-type {
                background: linear-gradient(89.92deg, #454bc2 0.06%, #b1a5f0 106.9%);
                padding: 10px 30px 10px 50px;
                color: #ffffff;
                position: relative;
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
                padding-left: 30px;
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
                border-radius: 30px;
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
        background-size: 100%;
        background-position: top center;
        gap: 20px;
        background-repeat: no-repeat;
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
          ol {
            li {
              margin: 20px 0;
            }
          }
          // background: #201f29;
          // background-repeat: no-repeat;
          // background-position: 95% 90%;
          // padding: 20px;
          // border-radius: 10px;
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
</style>
