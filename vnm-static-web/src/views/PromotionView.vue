<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail" :class="{ slot: ui.edition === EDITION.SLOT }">
      <div class="promo-main-container">
        <div class="promo-type-wrapper">
          <div style="position: sticky; top: 0">
            <div class="type-list">
              <div class="promo-title">
                <div class="linebefore"></div>
                {{ $t("promo.promo") }}
                <div class="lineafter"></div>
              </div>
              <div
                class="type-item"
                v-for="p in currentPromoTypes"
                :class="{ active: p.code === promoTabActive, slot: ui.edition === EDITION.SLOT }"
                :key="p.code"
                @click="switchPromoType(p.code)"
              >
                <img v-if="p.iconUrl" :src="p.iconUrl" />
                <img v-else-if="p.img" :src="require('../assets/promo/menu-' + p.img + '.png')" />
                <span v-else></span>
                <span style="width: 100px" class="label">{{ languageVal === "en" ? p.label.en : p.label.vn }}</span>
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
                  <div
                    class="label-type"
                    :class="{
                      labelhot: promo.labelType === 1,
                      labelrecommend: promo.labelType === 3 || promo.labelType === 5,
                      labellimit: promo.labelType === 6,
                      labelnew: promo.labelType === 0,
                      labelother:
                        promo.labelType !== 6 &&
                        promo.labelType !== 1 &&
                        promo.labelType !== 0 &&
                        promo.labelType !== 3 &&
                        promo.labelType !== 5
                    }"
                    v-if="promo.labelType !== 2"
                  >
                    {{ getPromoLabel(promo.labelType) }}
                  </div>
                  <div class="label-date">{{ JSON.parse(promo.param).date }}</div>
                </div>
                <div
                  class="promo-details"
                  :class="{
                    nopaddingtop: promo.labelType === 2
                  }"
                >
                  <div class="front-title">{{ promo.title }}</div>
                  <div class="front-sub">{{ JSON.parse(promo.param).sub }}</div>
                  <div class="front-btn">{{ $t("home.moreDetails") }}</div>
                </div>
                <div class="promo-bg">
                  <img class="promo-content isDesktop" :src="imgURL + promo.desktopImgUrl" />
                  <img class="promo-content isMobile" :src="imgURL + promo.mobileImgUrl" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <PromoDetail v-else />
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted, reactive, provide, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadPromo } from "@/api/index/promo.js";
import { useI18n } from "vue-i18n";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { useLocalStorage } from "@vueuse/core";
import { uiStore } from "@/store/ui";
import { EDITION } from "@/constant/edition";
import { loadPromoTypes } from "@/api/index/promo.js";

const PromoDetail = defineAsyncComponent(() => import('@/components/promo/PromoDetail.vue'));

export default defineComponent({
  name: "PromoView",
  components: {
    PromoDetail
  },
  setup() {
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    const ui = uiStore()
    const { t } = useI18n();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + '/promo/';
    const banner = ref([]);
    const promoState = reactive({
      active: "ALL",
      promoList: [],
    });
    const currentPromoType = ref([])
    const promoTypesSlot = ref( [
      { code:"ALL", img: 'all', label: {en: t('promo.all'), vn: t('promo.all')} },
      { code: "SLOT WELCOME", img: 'sport', label: {en:  t('promo.slotWelcome'),vn:  t('promo.slotWelcome')} },
      { code: "SLOT DAILY", img: 'live', label: {en: t('promo.slotDaily'), vn: t('promo.slotDaily')}},
      { code: "SLOT OTHER", img: 'slot', label: {en: t('promo.slotOther'), vn: t('promo.slotOther')}},
    ])
    const currentPromoTypes = computed(() =>{
      return  currentPromoType.value;
    })
    const promoTabActive = ref('ALL');
    const filteredArray = ref([]);
    const isPromoDetail = computed(() => {
      if (route.query && route.query?.name) {
        return true;
      }
      return false;
    })
    const selectedPromo = ref({});
    provide('selectedPromo', selectedPromo);
    const route = useRoute();
    const router = useRouter();
    const showPromoDetails = (promo) => {
      if (promo.redirectUrl.includes("page-vip")) {
        router.push("/vip");
      } else if (promo.redirectUrl.includes("lh1-invite")) {
        router.push("/privilege/invite");
      } else {
        router.push({ name: 'promotion', query: { name: promo.redirectUrl } })
        selectedPromo.value = promo
      }
    }



    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };

    const switchPromoType = (type) => {
      scrollToTop();

      promoTabActive.value = type;
      if (type !== "ALL") {
        if (type === 'OTHERS') {
          filteredArray.value = promoState.promoList.filter(function (promo) {
            const promoTypes = promo.promoType.toLowerCase().split(",");
            return promoTypes.includes("slot game") || promoTypes.includes("welcome") || promoTypes.includes("fish") || promoTypes.includes("poker");
          });
        } else {
          filteredArray.value = promoState.promoList.filter(function (promo) {
            return promo.promoType.toLowerCase().split(',').includes(type.toLowerCase());
          });
        }

      } else {
        filteredArray.value = promoState.promoList
      }
    };
    const loadAll = async () => {
      let siteType
      switch (ui.edition) {
        case EDITION.SLOT:
          siteType = "SLOT";
          break
      }


      await loadPromoTypes().then((res) => {
        currentPromoType.value = res.map((item) => {
          return {
            code: item.value,
            img: 'all',
            iconUrl: imgURL + item.iconUrl,
            label: JSON.parse(item.name)
          }
        })
      });
      console.log(currentPromoType.value)

      if(siteType==="SLOT"){
        const allItem = currentPromoType.value.find(item => item.code === 'ALL');
        const slotGameItem = currentPromoType.value.find(item => item.code === 'SLOT GAME');

        const filteredArr = currentPromoType.value.filter(item => item.code !== 'ALL' && item.code !== 'SLOT GAME');

        const newArr = [];
        if (allItem) newArr.push(allItem);  // 放到第一位
        if (slotGameItem) newArr.push(slotGameItem);  // 放到第二位
        newArr.push(...filteredArr);  // 添加其余的项目

        currentPromoType.value= newArr;
      }





      loadPromo(siteType).then((res) => {
        if (res.code === 0) {
          promoState.promoList.push(...res.data);
          res.data.forEach(element => {
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
            // }
          });
        }
      }).catch((e) => { console.log("error", e); });
      switchPromoType(promoState.active)
    }

    const getPromoLabel = (labelType) => {
      switch (labelType) {
        case 0:
          return "Mới nhất";
        case 1:
          return "Hot";
        case 3:
          return "Đề xuất";
        case 4:
          return "Hàng ngày";
        case 5:
          return "Thành viên mới";
        case 6:
          return "TIME Thời gian giới hạn";
        default:
          return "";
      }
    };
    onMounted(() => {
      loadAll();
    });

    return {
      promoState,
      promoTabActive,
      switchPromoType,
      filteredArray,
      isPromoDetail,
      showPromoDetails,
      selectedPromo,
      banner,
      imgURL,
      getPromoLabel,
      languageVal,
      currentPromoTypes,
      ui,
      EDITION
    }
  },
});
</script>
<style lang="scss">
.promo-container {
  min-height: 600px;

  .all-promotions {
    background: url(../assets/promo/bg-top2.jpg) no-repeat center top;
    width: 100%;
    background-size: 100% auto;
    padding: 50px;
    position: relative;
    padding-top: max(270px, 15vw);
    background-color: #f3f7fd;

    &.slot {
      background-image: url(@/assets/promo/bg-top-slot.png);
    }
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  .all-promotions {
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
      // max-width: $maxwidth;
      max-width: 1050px;
      margin: 0 auto;
      padding: 10px 0;
      display: flex;
      gap: 30px;
      position: relative;

      .rebates-container {
        position: absolute;
        top: -80px;
        background: url(../assets/promo/rebate/rebatebg.png) no-repeat center center;
        background-size: contain;
        width: 100%;
        height: 65px;
      }

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
          gap: 20px;
          min-height: 818px;
          position: sticky;
          top: 100px;

          .promo-title {
            color: #4c88f8;
            font-size: 20px;
            color: #4c88f8;
            font-size: 20px;
            display: flex;
            gap: 10px;

            .linebefore {
              display: flex;
              justify-content: center;
              gap: 5px;
              flex-direction: column;
              align-items: flex-end;

              &:before {
                content: "";
                width: 13px;
                height: 2px;
                background: #4c88f8;
              }

              &:after {
                content: "";
                width: 40px;
                height: 2px;
                background: #4c88f8;
              }
            }

            .lineafter {
              display: flex;
              justify-content: center;
              gap: 5px;
              flex-direction: column;
              align-items: flex-start;

              &:before {
                content: "";
                width: 13px;
                background: #4c88f8;
                height: 2px;
              }

              &:after {
                content: "";
                width: 40px;
                height: 2px;
                background: #4c88f8;
              }
            }
          }

          .type-item {
            cursor: pointer;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding: 12px 40px;
            position: relative;
            width: 100%;
            // max-width: 120px;
            border-radius: 30px;
            box-shadow: 0px -1.6610169410705566px 6.085966110229492px 0px #a2bff4 inset;

            .label {
              z-index: 0;
              color: #468cff;
              font-size: 16px;
            }

            &:before {
            }

            img {
              max-height: 30px;
              filter: grayscale(0);
            }

            &.active,
            &:hover {
              background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
              box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

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

            &.slot {
              &::after {
                content: "";
                display: block;
                background: url(@/assets/images/promotion/slot-mask.png) no-repeat;
                background-size: cover;
                position: absolute;
                right: -7px;
                width: 61px;
                height: 61px;
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
          background-size: 100% 100%;
          box-shadow: 0px 4px 26px 0px #00000026;
          border-radius: 13px;
          cursor: pointer;

          &:hover {
            .promo-content {
              transform: scale(1.1);
            }
          }

          .promo-img-wrapper {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 50px;
            position: relative;

            .promo-label {
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              align-items: center;
              height: 42px;

              .label-type {
                padding: 10px 30px 10px 50px;
                color: #ffffff;
                position: relative;

                &:after {
                  content: "";
                  display: inline-block;
                  position: absolute;
                  left: 100%;
                  top: 0;
                }

                &.labelhot {
                  background: linear-gradient(89.92deg, #d7353f 0.06%, #fea4a4 106.89%, #a4ceff 106.9%);

                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #fea4a4;
                  }
                }

                &.labellimit {
                  background: linear-gradient(89.92deg, #454bc2 0.06%, #b1a5f0 106.9%);

                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #b1a5f0;
                  }
                }

                &.labelnew {
                  background: linear-gradient(89.92deg, #eaa318 0.06%, #f0dba5 106.9%);

                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #f0dba5;
                  }
                }

                &.labelrecommend {
                  background: linear-gradient(89.92deg, #6db73f 0.06%, #a5f0b6 106.9%);

                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #a5f0b6;
                  }
                }

                &.labelother {
                  background: linear-gradient(89.92deg, #4da9ff 0.06%, #a4ceff 106.9%);

                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #a4ceff;
                  }
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
              font-family: "Roboto";
              margin: 20px 0;
              padding: 50px 0 10px 0;
              display: flex;
              gap: 5px;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;

              &.nopaddingtop {
                padding-top: 10px;
              }

              .front-date {
                color: #606479;
                font-size: 18px;
                font-weight: 700;
              }

              .front-title {
                color: #4c88f8;
                font-size: 20px;
                font-weight: 700;
                font-family: "Be Vietnam Pro";
              }

              .front-sub {
                color: #7a80a1;
                font-size: 18px;
                font-weight: 700;
                font-family: "Be Vietnam Pro";
              }

              .front-btn {
                color: #ffffff;
                padding: 5px 30px;
                background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
                font-family: "Be Vietnam Pro";
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
              height: 170px;

              .promo-content {
                height: 100%;
                transition: all 0.5s;

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
}
</style>
<style scoped lang="scss"></style>
