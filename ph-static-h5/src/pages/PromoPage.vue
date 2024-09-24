<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">
      <div v-if="banner && banner.mobileBannerUrl" class="banner-container">
        <div class="promo-bg" :style="'background-image: url(' + imgURL + banner.mobileBannerUrl + ')'"></div>
      </div>
      <div class="promo-main-container">
        <div class="promo-type-wrapper" style="display: none">
          <div class="type-list">
            <div
              class="type-item"
              v-for="p in promoTypes"
              :class="{ active: p.value === promoTabActive }"
              :key="p"
              @click="switchPromoType(p)"
            >
              <RiFunctionLine v-if="p && p.value === 'ALL'" />
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
                  <img class="promo-content" :src="imgURL + promo.mobileBannerUrl" />
                </div>
              </div>
              <!-- <div class="promo-info">
                <span class="viewdetail">View Details</span>
              </div> -->
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="selected-promo">
      <div class="selected-promo-wrapper">
        <div v-if="!isSpecialPromoBanner" class="banner-container">
          <div class="promo-bg" :style="'background-image: url(' + imgURL + selectedPromo.mobileBannerUrl + ')'"></div>
        </div>
        <div class="inner" :class="{ wpadding: !isSpecialPromo }">
          <div v-if="selectedPromo.hasPromo">
            <HotPromotion :list="selectedPromo" />
          </div>
          <div
            v-if="!isSpecialPromo"
            class="promo-view-container"
            :class="{
              welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
              sport: selectedPromo.promoType.toLowerCase() === 'sport',
              eSport: selectedPromo.promoType.toLowerCase() === 'esport',
              fish: selectedPromo.promoType.toLowerCase() === 'fish',
              liveCasino: selectedPromo.promoType.toLowerCase() === 'livecasino',
              slot: selectedPromo.promoType.toLowerCase() === 'slot game',
              ['full-page-promo']: isFullPagePromo
            }"
          >
            <div class="section-header">Terms and Conditions</div>
            <div v-html="selectedPromo.pageContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import {ref, defineComponent, onMounted, reactive, watch, computed, onActivated} from "vue";
import {useRoute, useRouter} from "vue-router";
import {RiFunctionLine} from 'vue-remix-icons'
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useUI} from "stores/ui";
import {userStore} from "stores/index";

import HotPromotion from 'components/HotPromotion'
// import HotPromotion from 'components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    RiFunctionLine,
    HotPromotion
  },
  setup(props) {
    const store = userStore();
    const imgURL = process.env.IMAGE_CDN + '/promo/';
    const banner = ref([]);
    const promoState = reactive({
      active: {value: 'ALL', label: 'ALL'},
      promoList: [],
    });

    const promoTypes = ref([
      {value: "ALL", label: "ALL"},
      {value: "WELCOME", label: "WELCOME"},
      { value: "VIP", label:"VIP"},
      // {value: "SPORT", label: "SPORT"},
      // {value: "LIVE CASINO", label: "LIVE CASINO"},
      // {value: "SLOT", label: "SLOT"},
    ]);
    const promoTabActive = ref(promoTypes.value[0].value);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const user= userStore()
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const ui = useUI();

    const isFullPagePromo = computed(() => {
      const promoIdsArr = [31];
      return promoIdsArr.includes(selectedPromo.value.code);
    })

    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.code
        props?.scrollPageRef?.setScrollPosition("vertical", 0, 200);
        // loadAll();
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
          .then((res) => {

            if (res.code === 0) {
              banner.value = res.data[0];
              console.log(banner)
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: ret.message,
              //   icon: "report_problem"
              // });
            }
            // banners.value = response.data;
          })
    }
    const isSpecialPromo = ref(false);
    const isSpecialPromoBanner = ref(false);
    const showPromoDetails = (promo) => {
      if (promo.promoCode === 'P4W-DOWNLOAD-BONUS' || promo.promoCode === 'P4W-ROULETTE-TOTO' || promo.promoCode === 'P4W-VIP-DAILY-CHECKIN-BONUS' || promo.promoCode === 'P4W-TOP-BET') {
        isSpecialPromo.value = true
        isSpecialPromoBanner.value = true
        if (promo.promoCode === 'P4W-DOWNLOAD-BONUS' || promo.promoCode === 'P4W-ROULETTE-TOTO') {
          isSpecialPromoBanner.value = false
        }
      } else {
        isSpecialPromo.value = false
        isSpecialPromoBanner.value = false
      }
      router.push({path: '/promo', query: {code: promo.promoCode}})
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
      const promoApiUrl = store.token ? "/session/loggedInPromoPages" : "/promo/page";

      api.get(promoApiUrl).then((res) => {

        if (res.code === 0) {
          const currentPromoIds = promoState.promoList.map(({id}) => id);
          const newPromos = res.data.filter(({id}) => !currentPromoIds.includes(id));
          promoState.promoList.push(...newPromos);

          if (route.query.code) {
            promoState.promoList.forEach(element => {
              if (String(element.promoCode.toString()) === route.query.code) {
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
    });

    onActivated(() => {
      loadAll();
    })

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
      isSpecialPromo,
      isSpecialPromoBanner
    }
  },
});
</script>
<style lang="scss">
.promo-container {
  .promo-view-container {
    ol {
      padding: 0 15px;
    }

    tbody {
      display: inline-table;
      width: 100%;
    }

    table {
      margin: 0px 0px 20px;
      width: 100%;
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      border: 0;

      tr {
        td {
          padding: 10px 20px;
          //border-bottom: 1px solid $primary;

          p {
            margin: 0;
          }
        }

        &:first-child {
          background-color: #ecf5ff;

          td {
            font-weight: 700;
            color: #2b2b82;
            white-space: pre-wrap;
          }
        }

        td:nth-child(odd) {
          //background: #3c3c6a;
        }

        td:nth-child(even) {
          //background: #3c3c6a;
        }
      }
    }
  }

  a {
    color: #db7e42;
    font-size: 17px;
  }
}

.body--dark {
  .promo-container {
    .promo-view-container {
      table {
        tr {
          &:first-child {
            background: #2b3656;

            td {
              color: #d5d7dd;
              white-space: pre-wrap;
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  color: $text-color;

  .banner-container .promo-bg {
    border-radius: 20px;
    margin: 10px;
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
      background-position: center bottom;
      overflow: hidden;
      //max-height: 240px;
      margin: 10px;
      border-radius: 10px;
      aspect-ratio: 2000/500;
    }

    .promo-main-container {
      max-width: 1400px;
      width: 95%;
      margin-left: auto;
      margin-right: auto;

      .promo-type-wrapper {
        display: flex;
        justify-content: center;
        white-space: nowrap;
        overflow-x: auto;
        background: #fff;
        box-shadow: 0px 9px 25px rgba(20, 17, 50, 0.1);
        border-radius: 100px;
        padding: 0.1rem;

        ::-webkit-scrollbar {
          display: none;
        }

        .type-list {
          display: flex;
          align-items: center;
          border-radius: 16px;
          overflow: auto;
          flex-wrap: nowrap;
          gap: 6px;
          padding: 4px;

          .type-item {
            padding: 10px 10px;
            cursor: pointer;
            border-radius: 20px;
            background: #fff;
            color: #000;
            //box-shadow: 0 0 10px -3px #000000;
            white-space: nowrap;

            svg {
              width: 20px;
              fill: #000;
              display: block;
              padding: 0;
            }

            img {
              max-height: 20px;
              filter: grayscale(1);
            }

            &.active,
            &:hover {
              background: #0071ed;
              box-shadow: 0 0 5px #ffffff;
              color: #fff;

              img {
                filter: grayscale(0);
              }

              svg {
                width: 20px;
                fill: #fff;
                display: block;
                padding: 0;
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
        margin-top: 10px;
        grid-template-columns: 1fr;
        grid-gap: 18px;

        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transform: scale(1);
          animation-name: scalein;
          animation-duration: 1s;
          transition: 0.4s ease-in;

          img {
          }

          cursor: pointer;

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 10px;

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
            position: absolute;
            text-align: center;
            right: 8px;
            bottom: 5px;
            padding: 0.25rem 0.4rem;
            border-radius: 60px;
            background-color: $primary;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .viewdetail {
              color: #ffffff;
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
          //height: 220px;
          margin: 10px;
          aspect-ratio: 2000/500;
          border-radius: 10px;
        }
      }

      .inner {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 0px;
        &.wpadding {
          padding: 10px;
        }

        .section-header {
          font-size: 20px;
          font-weight: 700;
          padding-bottom: 10px;
        }

        .hot-promo {
          background: #2b2b4b;
          // border-radius: 10px;
        }

        .promo-view-container {
          background: rgba(0, 0, 0, 0);
          background-repeat: no-repeat;
          background-position: 95% 90%;
          padding: 10px 0px;
          border-radius: 10px;
          overflow: auto;
          color: #000;

          &.full-page-promo {
            max-width: 1400px;
            width: 95%;
            margin: 10px auto;
          }
        }
      }
    }
  }
}

.body--dark {
  .selected-promo .selected-promo-wrapper .inner .promo-view-container {
    color: #83a3ca;
  }

  .section-header {
    color: #d0d4db;
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .promo-container {
    min-height: 100vh;

    .all-promotions {
      padding-bottom: 60px;

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
          margin-top: 10px;
          grid-template-columns: 1fr;

          .promo-item {
            position: relative;
            width: 100%;

            .promo-info {
              height: 26px;
              line-height: 26px;

              .viewdetail {
                padding: 3px 8px;
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
