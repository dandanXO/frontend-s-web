<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">
      <div
        v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl"
        class="banner-container"
      >
        <div
          class="promo-bg isDesktop"
          :style="
            'background-image: url(' + imgURL + banner.desktopImageUrl + ')'
          "
        ></div>
        <div
          class="promo-bg isMobile"
          :style="
            'background-image: url(' + imgURL + banner.mobileImageUrl + ')'
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
                <span class="viewdetail">View Details</span>
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
              selectedPromo.desktopImgUrl +
              ')'
            "
          ></div>
          <div
            class="promo-bg isMobile"
            :style="
              'background-image: url(' +
              imgURL +
              selectedPromo.mobileImgUrl +
              ')'
            "
          ></div>
        </div>
        <div class="inner">
          <div class="hot-promo" v-if="selectedPromo.hasPromo">
            <!-- {{ selectedPromo.id = 40 }} -->
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
              slot: selectedPromo.promoType.toLowerCase() === 'slot game',
            }"
          >
            <div class="game-title">Terms and Conditions</div>
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
import { RiFunctionLine } from 'vue-remix-icons'
import { loadPromo } from "@/api/index/promo.js";
import { loadPromoBanner } from "@/api/index/promo";
import { userStore } from "@/store"

import HotPromotion from '@/components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    RiFunctionLine,
    HotPromotion
  },
  setup() {
    const store = userStore()
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/';
    const banner = ref([]);
    const promoState = reactive({
      active: { value:'ALL', label:'ALL'},
      promoList: [],
    });
    const promoTypes = ref([
      { value: "ALL", label:"ALL"},
      { value: "WELCOME", label:"WELCOME"},
      { value: "SPORT", label:"SPORT"},
      { value: "LIVE CASINO", label:"LIVE CASINO"},
      { value: "SLOT", label:"SLOT"},
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
        isPromoDetail.value = route.query.id
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
      router.push({name: 'promotion', query: {id: promo.id}})
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
          promoState.promoList.push(...res.data);
          res.data.forEach(element => {
            if (element.id.toString() === route.query.id) {
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
      store
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
    table {
      margin: 0 15px 20px;
      width: 98%;
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      border: 0;
      tr {
        th {
          color: #db7e42;
          padding: 10px 20px;
          p {
            margin: 0;
          }
        }
        td {
          padding: 10px 20px;
          border-bottom: 1px solid #2b2b4b;
          p {
            margin: 0;
          }
        }
        &:first-child {
          td {
            color: #db7e42;
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
    color: #db7e42;
    font-size: 17px;
  }
  .ant-pagination a {
    color: #ffffff;
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  padding-bottom: 80px;
  background: linear-gradient(to bottom, #23263c, #190f25);

  min-height: 70vh;
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
      max-width: 1400px;
      width: 95%;
      margin-left: auto;
      margin-right: auto;
      .promo-type-wrapper {
        display: flex;
        justify-content: center;
        // border-bottom: 4px solid rgb(255 255 255 / 15%);
        .type-list {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          overflow: hidden;
          gap: 20px;
          padding: 30px;
          overflow: auto;
          .type-item {
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
      .promo-list-wrapper {
        margin-top: 30px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
            // position: absolute;
            text-align: right;
            border-radius: 0 0 10px 10px;

            left: 0;
            bottom: 0;
            width: 100%;
            background-color: #23263c;
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
          &.isDesktop {
            display: block;
            height: 430px;
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
            background-image: linear-gradient(to right, #de4545, #db7e42);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 30px auto 50px;
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
