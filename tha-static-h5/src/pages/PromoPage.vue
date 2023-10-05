<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">

      <div
          v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl"
          class="banner-container"
      >
        <div
            class="promo-top-bg"
            :style="
          (!$q.screen.gt.sm) ?
            'background-image: url(' + banner.mobileImageUrl + ')'
            :  'background-image: url(' + banner.desktopImageUrl + ')'
          "
        ></div>
      </div>

      <div class="promo-main-container">
        <div class="promo-type-wrapper">
          <div class="type-list">
            <div
                class="type-item"
                v-for="p in promoTypes"
                :class="{ active: p.value === promoTabActive }"
                :key="p"
                @click="switchPromoType(p)"
            >
              <RiFunctionLine v-if="p && p.value === 'ALL'"/>
              <template v-else>{{ p.label }}</template>
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
                      class="promo-content"
                      :src="imgURL + promo.mobileImgUrl"
                  />
                </div>
              </div>
              <div class="promo-info">
                <span class="viewdetail">{{ $t('lang.view_detail')}}</span>
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
              class="promo-bg"
              :style="
              'background-image: url(' +
              imgURL +
              selectedPromo.mobileImgUrl +
              ')'
            "
          ></div>
        </div>
        <div class="inner">
          <div v-if="selectedPromo.hasPromo">
            <HotPromotion :list="selectedPromo"/>
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
            <div class="menu-title">{{ $t('lang.tnc') }}</div>
            <div v-html="selectedPromo.pageContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import {ref, defineComponent, onMounted, reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {RiFunctionLine} from 'vue-remix-icons'
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useUI} from "stores/ui";
import {userStore} from "stores/index";
// import { loadPromo } from "src/api/index/promo.js";
// import { loadPromoBanner } from "src/api/index/promo";

import HotPromotion from 'components/HotPromotion'
import {useI18n} from "vue-i18n";
// import HotPromotion from 'components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    RiFunctionLine,
    HotPromotion
  },
  setup() {
    const {t} = useI18n()
    const store = userStore();
    const imgURL = process.env.IMAGE_CDN + '/promo/';
    const banner = ref([]);
    const promoState = reactive({
      active: {value: 'ALL', label: t('lang.all')},
      promoList: [],
    });
    const promoTypes = ref([
      {value: "ALL", label: t('lang.all')},
      {value: "WELCOME", label: t('lang.welcome')},
      {value: "SPORT", label: t('lang.sport_header') },
      {value: "LIVE CASINO", label: t('lang.live_header') },
      {value: "SLOT", label: t('lang.slot_header') },
    ]);
    const promoTabActive = ref(promoTypes.value[0].value);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const ui = useUI();

    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.id
        ui.setScrollPosition("vertical", 0, 200);
      }
    });
    const loadBanner = () => {
      //TODO:: HardCoded.
      banner.value = {
        mobileImageUrl: require("../assets/home/banner1.png"),
        desktopImageUrl: require("../assets/home/web-banner1.png")
      }

      // loadPromoBanner("PROMO").then((res) => {
      //   if (res.code === 0) {
      //       banner.value = res.data[0]
      //   }
      // })
      api
          .get("/promo/banner?category=PROMO")
          .then((res) => {
            const ret = res.data
            if (ret.code === 0) {
              // banner.value = ret.data[0];
            } else {
            }
          })
    }
    const showPromoDetails = (promo) => {
      router.push({path: '/promo', query: {id: promo.id}})
      isPromoDetail.value = true
      selectedPromo.value = promo
    }
    const switchPromoType = (type) => {
      promoTabActive.value = type.value;
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function (promo) {
          return (promo.promoType.toLowerCase()).includes(type.value.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList
      }
    };
    const loadAll = () => {
      api.get("/promo/page").then((ret) => {
        const res = ret.data
        if (res.code === 0) {
          promoState.promoList.push(...res.data);

          if (route.query.id) {
            promoState.promoList.forEach(element => {
              if (String(element.id) === route.query.id) {
                showPromoDetails(element)
              }
            });
          }
        }
      }).catch((e) => {
        console.log("error", e);
      });

      // loadPromo().then((res) => {
      //   if(res.code === 0) {
      //     promoState.promoList.push(...res.data);
      //   }
      // }).catch((e) => { console.log("error", e); });
      switchPromoType(promoState.active)
    }
    onMounted(() => {
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
      store
    }
  },
});
</script>
<style lang="scss">
.promo-container {
  padding-bottom: 20px;

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
          border-bottom: 1px solid #2b2b4b;

          p {
            margin: 0;
          }
        }

        &:first-child {
          td {
            color: $header-color;
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
    color: $lightblue-color;
    font-size: 17px;
  }
}
</style>
<style scoped lang="scss">
.banner-container .promo-top-bg {
  border-radius: 20px;
  margin: 10px;
  height: auto;
  width: calc(100% - 20px);
  aspect-ratio: 1000/445;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center top;
}

.promo-container {
  color: #ffffff;

  .all-promotions {
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
      height: 60vw;
      max-height: 240px;
      //aspect-ratio: 536/335;
      margin: 10px;
      border-radius: 10px;

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
            text-transform: uppercase;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 20px;
            background: #2b2b4b;
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
          transform: scale(.5);
        }
        to {
          transform: scale(1);
        }
      }

      .promo-list-wrapper {
        display: grid;
        margin-top: 20px;
        grid-template-columns: 1fr;
        grid-gap: 18px;

        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transform: scale(1);
          animation-name: scalein;
          animation-duration: 1s;
          transition: .4s ease-in;

          img {
          }


          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 10px 10px 0 0;

            .promo-bg {
              transition: all 0.5s ease;
              background-size: cover;
              background-position: center center;
              margin: 0;
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
            text-align: right;
            border-radius: 0 0 10px 10px;

            left: 0;
            bottom: 0;
            width: 100%;
            background-color: $secondary;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .viewdetail {
              color: #ffffff;
              padding: 15px;
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
          margin: 10px;
          border-radius: 10px;
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
          background: #2b2b4b;
          border-radius: 10px;
        }

        .promo-view-container {
          background: #2b2b4b;
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

@media (min-width: 768px){
  .banner-container .promo-top-bg {
    aspect-ratio: 100/25;
  }

}
</style>
