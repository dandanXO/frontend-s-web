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
              <img :src="require('../assets/promo/menu-' + p.img + '.png')" />
              <span class="label"> {{ p.label }}</span>
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
              <div class="promo-img-wrapper">
                <div class="promo-bg">
                  <img
                    class="promo-content isDesktop"
                    :src="imgURL + promo.desktopImgUrl"
                  />
                  <img
                    class="promo-content isMobile"
                    :src="imgURL + promo.mobileImgUrl"
                  />
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
    <div v-else class="selected-promo">
      <div class="selected-promo-wrapper">
        <div class="banner-container">
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
        <div class="inner">
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
              liveCasino:
                selectedPromo.promoType.toLowerCase() === 'livecasino',
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
import { ElMessageBox } from "element-plus";

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
      { code:"ALL", img: 'all', label: '所有优惠' },
      { code: "ESPORT", img: 'esport', label: '电竞'},
      { code: "SPORT", img: 'sport', label: '体育'},
      // { code: "POKER", img: 'poker', label: '棋牌'},
      { code: "LIVE CASINO", img: 'live', label: '真人娱乐'},
      { code: "FISH", img: 'game', label: '老虎机/捕鱼'},
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
        } else {
          router.push({name: 'promotion', query: {name: promo.redirectUrl}})
          isPromoDetail.value = true
          selectedPromo.value = promo
        }
      }
    }
    const switchPromoType = (type) => {
      promoTabActive.value = type;
      if (type !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function(promo) {
          return promo.promoType.toLowerCase().split(',').includes(type.toLowerCase());
        });
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
              if (element.redirectUrl === route.query.name) {
                showPromoDetails(element)
              }
            }
          });
        }
      }).catch((e) => { console.log("error", e); });
      switchPromoType(promoState.active)
    }
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
      imgURL
    }
  },
});
</script>
<style lang="scss">
.promo-container {
  // background: #090b19;
  .all-promotions {
    background: url(../assets/promo/bg-top.jpg) no-repeat center top;
    min-height: 40vh;
    padding: 50px;
    position: relative;
    padding-top: 370px;
    background-color: #f0f1f6;
    background-repeat: no-repeat;
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
        background-image: linear-gradient(0deg, #0094ff 0, #19c6ff 100%),
          linear-gradient(#2e3039, #2e3039);
        color: #ffffff;
        border: 0;
      }
      border-collapse: collapse;
      th,
      td {
        padding: 10px;
      }
      tbody{
        display:table;
        table-layout: fixed;
        width: 100%;
      }
      th {
        background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%),
          linear-gradient(#d0d1d3, #d0d1d3);
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
      background-color: #ffffff;
      margin: 0 auto;
      padding: 10px 0;
      .promo-type-wrapper {
        display: flex;
        justify-content: center;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
        /* width */
        ::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          // display: none;
        }
        .type-list {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
          overflow: auto;
          width: 90%;
          border-bottom: 1px solid #9ca5b9;
          margin-bottom: 20px;
          .type-item {
            padding: 5px 10px;
            cursor: pointer;
            // border-radius: 20px;
            // background: #201f29;
            // box-shadow: 0 0 10px -3px #000000;
            // white-space: nowrap;
            margin: 0 10px;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            padding: 12px 30px;
            position: relative;
            width: 100%;
            .label {
              z-index: 0;
              color: #626a7d;
            }
            &:before {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              // box-shadow: 0 3px 4px 0 rgb(0 0 0 / 15%);
              box-shadow: 0px 3px 7px 1px rgba(0, 0, 0, 0.15);
              transform: skewX(15deg);
              border-radius: 4px 15px;
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
                background-image: linear-gradient(
                    90deg,
                    #2d74f6 0,
                    #7abdfc 100%
                  ),
                  linear-gradient(#3077f6, #3077f6);
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
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 15px;
        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background-color: #f2f6ff;
          box-shadow: 0 3px 9px 0 rgba(112, 122, 143, 0.4);
          a {
            display: block;
          }
          &:hover {
            .promo-info {
              background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%),
                linear-gradient(#3077f6, #3077f6);
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
            // border-radius: 10px 10px 0 0;
            .promo-bg {
              transition: all 0.5s ease;
              background-size: cover;
              background-position: center center;
              &:hover {
                transform: scale(1.2);
              }
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
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          &.isDesktop {
            display: block;
            height: 500px;
          }
          &.isMobile {
            display: none;
            height: 220px;
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
