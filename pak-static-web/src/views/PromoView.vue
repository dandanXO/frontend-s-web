<template>
  <div class="promo-container">
    <div v-if="!isPromoDetail" class="all-promotions">
      <div v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl" class="banner-container">
        <div class="promo-bg isDesktop" :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'" />
        <div class="promo-bg isMobile" :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'" />
      </div>
      <div class="promo-main-container">
        <div class="promo-type-wrapper">
          <div class="type-list">
            <div
              v-for="p in promoTypes"
              :key="p"
              class="type-item"
              :class="{ active: p.value === promoTabActive }"
              @click="switchPromoType(p)"
            >
              <!-- <RiFunctionLine v-if="p && p.value === 'ALL'" />
              <template v-else>
                {{ p.label }}
                </template> -->
              {{ $t(p.label) }}
            </div>
          </div>
        </div>
        <div class="promo-list-wrapper">
          <div
            v-for="(promo, i) in filteredArray"
            :key="i"
            class="promo-item"
            data-aos="zoom-in"
            data-aos-easing="ease-out"
            data-aos-duration="1000"
          >
            <a @click="showPromoDetails(promo)">
              <div class="promo-img-wrapper">
                <div class="promo-bg">
                  <img class="promo-content isDesktop" :src="imgURL + promo.desktopImgUrl" />
                  <img class="promo-content isMobile" :src="imgURL + promo.mobileImgUrl" />
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
        <div class="banner-container" v-if="!isSpecialPromoBanner">
          <div
            class="promo-bg isDesktop"
            :style="'background-image: url(' + imgURL + selectedPromo.desktopImgUrl + ')'"
          />
          <div
            class="promo-bg isMobile"
            :style="'background-image: url(' + imgURL + selectedPromo.mobileImgUrl + ')'"
          />
        </div>
        <div class="promo-content-inner">
          <div class="content-title">{{ selectedPromo.title }}</div>
          <div class="content-para" v-if="parsedParamSub">{{ parsedParamSub }}</div>
          <div class="content-date" v-if="parsedParamDate">
            <div><img src="../assets/images/promotion/calendar-icon.png" /></div>
            {{ parsedParamDate }}
          </div>
        </div>

        <div class="inner" :class="{ hasMaxWidth: !isSpecialPromo }">
          <div v-if="selectedPromo.hasPromo" :class="{ 'hot-promo': !isSpecialPromo }">
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
              slot: selectedPromo.promoType.toLowerCase() === 'slot game'
            }"
          >
            <div v-if="selectedPromo.pageContent === '<p>&nbsp;</p>'" class="game-title">Promotion</div>
            <div class="rich-content-control" v-html="selectedPromo.pageContent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted, reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RiFunctionLine } from 'vue-remix-icons'
import { loadPromo } from "@/api/index/promo.js";
import { loadPromoBanner } from "@/api/index/promo";
import { userStore } from "@/store"
import { useI18n } from "vue-i18n";

import HotPromotion from '@/components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    RiFunctionLine,
    HotPromotion
  },
  setup() {
    const { t } = useI18n();
    const store = userStore()
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/promo/';
    const banner = ref([]);
    const promoState = reactive({
      active: { value:'ALL', label: t('promo.all')},
      promoList: [],
    });
    const isSpecialPromo = ref(false);
    const isSpecialPromoBanner = ref(false);
    const promoTypes = ref([
      {
        value: "ALL",
        label: 'promo.all',
      },
      {
        value: "EARN",
        label: 'promo.earn'
      },
      {
        value: "HOT",
        label: 'promo.hot'
      },
      {
        value: "NEW USER",
        label: 'promo.new_user'
      },
      {
        value: "SPORTS",
        label: 'promo.sports'
      },
      {
        value: "LIVE",
        label: 'promo.live'
      },
      {
        value: "SLOT",
        label: 'promo.slot'
      },
      {
        value: "VIP",
        label: 'promo.vip'
      }
      // { value: "SPORT", label:"SPORT"},
      // { value: "LIVE CASINO", label:"LIVE CASINO"},
      // { value: "SLOT", label:"SLOT"},
    ]);
    const promoTabActive = ref(promoTypes.value[0]);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.code
        loadAll()
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
      // if (promo.promoCode === 'P4W-DOWNLOAD-BONUS' || promo.promoCode === 'P4W-ROULETTE-TOTO' || promo.promoCode === 'P4W-VIP-DAILY-CHECKIN-BONUS' || promo.promoCode === 'P4W-TOP-BET') {
      //   isSpecialPromo.value = true
      //   isSpecialPromoBanner.value = true
      //   if (promo.promoCode === 'P4W-DOWNLOAD-BONUS' || promo.promoCode === 'P4W-ROULETTE-TOTO') {
      //     isSpecialPromoBanner.value = false
      //   }
      // } else {
      //   isSpecialPromo.value = false
      //   isSpecialPromoBanner.value = false
      // }
      router.push({name: 'promotion', query: {code: promo.redirectUrl}})
      isPromoDetail.value = true
      selectedPromo.value = promo
    }
    const switchPromoType = (type) => {
      promoTabActive.value = type.value;
      if (type.value !== "ALL") {
        filteredArray.value = promoState.promoList.filter(function(promo) {
          return (promo.promoType.toLowerCase()).includes(type.value.toLowerCase());
        });
      } else {
        filteredArray.value = promoState.promoList
      }
    };
    const loadAll = () => {
      promoState.promoList = []
      loadPromo().then((res) => {
        if(res.code === 0) {

          // if (store.memberType !== 'TEST' ) {
          //   res.data = res.data.filter((privilege) => {
          //     return privilege.privilegeStatus === 'OPEN';
          //   });
          //   res.data.forEach((privilege) => {
          //     console.log(privilege.privilegeStatus)
          //   })
          // }

          promoState.promoList.push(...res.data);
          promoState.promoList.forEach(element => {
            if (element.redirectUrl.toString() === route.query.code) {
              showPromoDetails(element)
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

    // promo param split.
    const parsedParam = computed(() => {
      try {
        if (selectedPromo.value && selectedPromo.value.param) {
          return JSON.parse(selectedPromo.value.param);
        }
        return {};
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return {};
      }
    });

    const parsedParamSub = computed(() => parsedParam.value.sub || '');
    const parsedParamDate = computed(() => parsedParam.value.date || '');

    // onMounted(() => {
    //   loadAll()
    //   if (route.query) {
    //     console.log(route.query)
    //   }
    // });
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
      isSpecialPromoBanner,
      parsedParamSub,
      parsedParamDate
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
  }
  a {
    color: $primary-color-lightest;
    font-size: 17px;
    &.common-btn {
      color: #ffffff;
    }
  }
  .ant-pagination a {
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  // padding-bottom: 80px;

  min-height: 70vh;

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
        height: 430px;
      }
      &.isMobile {
        display: none;
        height: 220px;
      }
    }
    .promo-main-container {
      max-width: $container-width;
      width: 95%;
      margin-left: auto;
      margin-right: auto;
      .promo-type-wrapper {
        display: flex;
        justify-content: flex-start;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
        border-bottom: 3px solid #ffffff0d;
        .type-list {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          gap: 20px;
          padding: 1rem 0.2em 0;
          overflow: auto;
          .type-item {
            padding: 5px 10px;
            cursor: pointer;
            white-space: nowrap;

            svg {
              width: 20px;
              fill: currentColor;
              display: block;
            }
            img {
              max-height: 20px;
              filter: grayscale(1);
            }
            &.active,
            &:hover {
              // background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
              color: #fff;
              display: flex;
              flex-direction: column;
              position: relative;
              &:after {
                content: "";
                background: #70bc62;
                height: 2px;
                width: 100%;
                position: absolute;
                bottom: 0;
                border-radius: 4px;
                left: 0;
              }

              img {
                filter: grayscale(0);
              }
            }
          }
        }
      }
      .promo-list-wrapper {
        // margin: 30px 0;
        padding: 30px 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 18px;
        .promo-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          img {
          }
          cursor: pointer;

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 10px 10px 0 0;
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
            border-radius: 0 0 10px 10px;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: #ffffff1a;
            align-items: center;
            padding: 7px 14px;
            .viewdetail {
              font-size: 15.3px;
              line-height: 22.96px;
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
          border-radius: 10px;
          &.isDesktop {
            display: block;
            min-height: 22vw;
            aspect-ratio: 1560/490;
          }
          &.isMobile {
            display: none;
            height: 220px;
          }
        }
      }
      .inner {
        &.hasMaxWidth {
          max-width: $container-width;
        }
        width: 100%;
        margin: 0px auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        .hot-promo {
          padding: 20px;
          border-radius: 10px;
        }
        .promo-view-container {
          background-repeat: no-repeat;
          background-position: 95% 90%;
          padding: 10px 20px;
          border-radius: 10px;
          overflow: auto;
          &.welcome {
            background-image: url("../assets/images/promotion/hotpromo/common/welcome.png");
          }
          &.sport {
            background-image: url("../assets/images/promotion/hotpromo/common/sport.png");
          }
          &.esport {
            background-image: url("../assets/images/promotion/hotpromo/common/esport.png");
          }
          &.fish {
            background-image: url("../assets/images/promotion/hotpromo/common/fish.png");
          }
          &.livecasino {
            background-image: url("../assets/images/promotion/hotpromo/common/livecasino.png");
          }
          &.slot {
            background-image: url("../assets/images/promotion/hotpromo/common/slot.png");
          }
          .game-title {
            color: $primary-color;
            margin: 10px auto 10px;
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
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
@media (max-width: 767px) {
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

// promo content-inner
.promo-content-inner {
  padding: 12px 0px;
  margin: 0 12px;
  border-bottom: 1px solid #ffffff1a;
  .content-title {
    color: #ffffff;
    font-size: 28px;
    font-weight: bold;
  }
  .content-para {
    font-size: 16px;
    padding-top: 4px;
    color: #9f9f9f;
  }
  .content-date {
    padding-top: 6px;
    color: #9f9f9f;
    display: flex;
    align-items: center;
    gap: 4px;
    img {
      display: block;
      width: 30px;
    }
  }
}
</style>
