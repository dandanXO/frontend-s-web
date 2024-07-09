<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">
      <div class="promo-main-container">
        <!-- <div class="rebates-container">
          <img src="../assets/promo/rebate/coin.png" />
          <div class="rebatebtn">{{$t('rebate.totalVNDP')}}</div>
          <div class="input">{{ rebateAmt }}</div>
          <div class="rebatebtn">{{$t('rebate.claimNow')}}</div>
        </div> -->
        <div class="promo-type-wrapper">
          <div style="position:sticky; top: 0;">
            <div class="type-list">
              <!-- <img src="../assets/promo/menu-title.png" /> -->
              <div class="promo-title">
                <div class="linebefore"></div>
                {{ $t('promo.promo') }}
                <div class="lineafter"></div>
              </div>
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
                  <div class="label-type"
                       :class="{
                          labelhot: promo.labelType === 1,
                          labelrecommend: promo.labelType === 3 || promo.labelType === 5,
                          labellimit: promo.labelType === 6,
                          labelnew: promo.labelType === 0,
                        labelother: promo.labelType !== 6 && promo.labelType !== 1 && promo.labelType !== 0 && promo.labelType !== 3 && promo.labelType !== 5,
                       }"
                       v-if="promo.labelType !== 2">{{ getPromoLabel(promo.labelType) }}</div>
                  <div class="label-date">{{ JSON.parse(promo.param).date }}</div>
                </div>
                <div class="promo-details"
                     :class="{
                    nopaddingtop : promo.labelType === 2
                  }"
                >
                  <!-- <div class="front-date">{{ JSON.parse(promo.param).date }}</div> -->
                  <div class="front-title">{{ promo.title }}</div>
                  <div class="front-sub">{{ JSON.parse(promo.param).sub }}</div>
                  <div class="front-btn">{{ $t('home.moreDetails')}}</div>
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
        <div class="banner-container"
             v-if="selectedPromo?.desktopBannerUrl || selectedPromo?.mobileBannerUrl"
        >
          <div class="promo-bg isDesktop">
            <img
              :src="
                imgURL + (selectedPromo.desktopBannerUrl ? selectedPromo.desktopBannerUrl : selectedPromo.desktopImgUrl)
              "
            />
          </div>
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
            'isEurocup24': selectedPromo.redirectUrl === 'vnm-eurocup24',
            'isEurocupLucky': selectedPromo.redirectUrl === 'vnm-eurocup-luckydraw'
          }"
          :style="
            selectedPromo?.desktopImgBackgroundUrl
              ? `background-image: url(${imgURL + selectedPromo.desktopImgBackgroundUrl})`
              : 'background-image: url(' + require(`../assets/promo/web-bg.jpg`) + '\''
          "
        >
          <!--          <h2 class="text-center" style="font-family: 'Roboto'; color: #0060d3; font-weight: 900; font-size: 30px;">{{selectedPromo.title}}</h2>-->
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
              slot: selectedPromo.promoType?.toLowerCase() === 'slot game'
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
import { ref, defineComponent, onMounted, reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadPromo } from "@/api/index/promo.js";
import { loadPromoBanner } from "@/api/index/promo";
import { userStore } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
import HotPromotion from '@/components/HotPromotion'
import { useLocalStorage } from "@vueuse/core";
export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion
  },
  setup() {
    const { t } = useI18n();
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + '/promo/';
    const banner = ref([]);
    const promoState = reactive({
      active: "ALL",
      promoList: [],
    });
    const promoTypes = ref([
      { code:"ALL", img: 'all', label: t('promo.all') },
      { code: "SPORT", img: 'sport', label:  t('promo.sports')},
      { code: "LIVE CASINO", img: 'live', label: t('promo.casino')},
      { code: "SLOT GAME", img: 'slot', label: t('promo.slot')},
      { code: "POKER", img: 'poker', label: t('promo.poker')},
      { code: "LOTTERY", img: 'lottery', label: t('promo.lottery')},
      { code: "FISH", img: 'fish', label: t('promo.fish')},
    ]);
    const promoTabActive = ref(promoTypes.value[0].code);
    const filteredArray = ref([]);
    const isPromoDetail = computed(() => {
      if(route.query && route.query?.name ){
        return true;
      }
      return false;
    })
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    // watch(() => route.query, () => {
    //   if (route.query === null) {
    //    isPromoDetail.value = false
    //   } else {
    //     isPromoDetail.value = route.query.name
    //   }
    // });
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
      // if (!store.token) {
      //     ElMessageBox.alert(t('bankError.loginbeforeAction'), t('common.systemError'), {
      //         // if you want to disable its autofocus
      //         // autofocus: false,sd
      //         center: true,
      //         confirmButtonText: t('common.confirm'),
      //         showClose: false,
      //         buttonSize: 'large'
      //     }).then(() => {
      //       // router.push('/login');
      //         store.loginPageVisible = true
      //     })
      //     return
      // } else {
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
        // isPromoDetail.value = true;
        selectedPromo.value = promo
      }
      // }
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
            return promoTypes.includes("slot game") || promoTypes.includes("welcome") || promoTypes.includes("fish") || promoTypes.includes("poker");
          });
          // console.log(filteredArray.value);
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
        console.log(res,'dan')
        if(res.code === 0) {
          promoState.promoList.push(...res.data);
          res.data.forEach(element => {
            // if (store.memberType !== "TEST" && element.privilegeStatus === "TEST") {
            //   promoState.promoList.splice(promoState.promoList.indexOf(element), 1);
            // } else {
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
      // loadBanner();
      loadAll();
    });

    watch(languageVal, (newValue, oldValue) => {
      promoTypes.value = [
        { code:"ALL", img: 'all', label: t('promo.all') },
        { code: "SPORT", img: 'sport', label:  t('promo.sports')},
        { code: "POKER", img: 'poker', label: t('promo.poker')},
        { code: "LIVE CASINO", img: 'live', label: t('promo.casino')},
        { code: "SLOT GAME", img: 'slot', label: t('promo.slot')},
        { code: "FISH", img: 'fish', label: t('promo.fish')},
        { code: "LOTTERY", img: 'lottery', label: t('promo.lottery')},
      ];
    });

    // watch(() => route.query.name, () => {
    //   if (!route.query.name) {
    //     isPromoDetail.value = false
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
      getPromoLabel,
      languageVal
    }
  },
});
</script>
<style lang="scss">
.promo-container {
  min-height: 600px;

  .all-promotions {
    background: url(../assets/promo/top-promo-icon.png) no-repeat center top;
    width: 100%;
    background-size: 100% auto;
    padding: 50px;
    position: relative;
    padding-top: max(270px, 15vw);
    background-color: #1E212C
  ;
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
        background-image: linear-gradient(180deg, #FD897E 0%, #FD3126 100%);
        color: #ffffff;
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
        background: #FFE7E7;
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
        border: 1px solid #1E212C;
        color: #ffffff;
        background: #ffffff0d;
      }
      tr {
        &:first-child {
          td:first-child {
            border-radius: 20px 0 0 0;
          }
          td:last-child {
            border-radius: 0 20px 0 0;
          }
        }
        &:last-child {
          td:first-child {
            border-radius: 0 0 0 20px;
          }
          td:last-child {
            border-radius: 0 0 20px 0;
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
        background: url(../assets/promo/rebate/rebatebg.png)no-repeat center center;
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
          gap: 35px;
          min-height: 818px;
          position: sticky;
          top: 100px;
          background: #ffffff;
          border-radius: 10px;
          .promo-title {
            color: #FD574C;
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
                content: '';
                width: 13px;
                height: 2px;
                background: #FD574C;
              }
              &:after {
                content: '';
                width: 55px;
                height: 2px;
                background: #FD574C;
              }
            }
            .lineafter {
              display: flex;
              justify-content: center;
              gap: 5px;
              flex-direction: column;
              align-items: flex-start;
              &:before {
                content: '';
                width: 13px;
                background: #FD574C;
                height: 2px;
              }
              &:after {
                content: '';
                width: 55px;
                height: 2px;
                background: #FD574C;
              }

            }
          }
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

            box-shadow: 0px -1.66px 6.09px 0px #F4A2A2 inset;

            .label {
              z-index: 0;
              color:  #FD3C31;
              font-size: 16px;
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
              background: linear-gradient(180deg, #FD897E 0%, #FD3126 100%);
              box-shadow: 0px -1.66px 6.09px 0px #F4A2A2 inset;
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
            // display: flex;
            justify-content: space-between;
            align-items: center;
            // padding: 0 50px;
            // border-radius: 10px 10px 0 0;
            position: relative;

            .promo-label {
              position: absolute;
              left: 0;
              top: 0;
              // display: flex;
              display:none;
              align-items: center;
              height: 42px;
              .label-type {
                //background: linear-gradient(89.92deg, #454bc2 0.06%, #b1a5f0 106.9%);
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

                &.labelhot{
                  background: linear-gradient(89.92deg, #D7353F 0.06%, #FEA4A4 106.89%, #A4CEFF 106.9%);

                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid  #FEA4A4;
                  }
                }

                &.labellimit{
                  background: linear-gradient(89.92deg, #454BC2 0.06%, #B1A5F0 106.9%);
                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #B1A5F0;
                  }
                }

                &.labelnew{
                  background: linear-gradient(89.92deg, #EAA318 0.06%, #F0DBA5 106.9%);
                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #F0DBA5;
                  }
                }

                &.labelrecommend{
                  background: linear-gradient(89.92deg, #6DB73F 0.06%, #A5F0B6 106.9%);
                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #A5F0B6;
                  }
                }

                &.labelother{
                  background: linear-gradient(89.92deg, #4DA9FF 0.06%, #A4CEFF 106.9%);
                  &:after {
                    border-left: 0 solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 42px solid #A4CEFF;
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
              display: none;
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
              // display: flex;
              display: none;
              gap: 5px;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;

              &.nopaddingtop{
                padding-top: 10px;
              }
              .front-date {
                color: #606479;
                font-size: 18px;
                font-weight: 700;
              }
              .front-title {
                color: #FD574C;
                font-size: 20px;
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
                background: linear-gradient(180deg, #FD897E 0%, #FD3126 100%);
                box-shadow: 0px -1.66px 6.09px 0px #F4A2A2 inset;
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
              height: 250px;
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
        background-size: 100% 100%;
        background-position: top center;
        gap: 20px;
        background-repeat: no-repeat;
        background-color: #1e212c;

        &.isEurocup24 {
          padding: 0px;
        }
        &.isEurocupLucky {
          //background: #E7F1FD;
        }

        .hot-promo {
          // background: #201f29;
          border-radius: 10px;
        }
        .promo-view-container {
          margin: 0 auto;
          max-width: 1050px;
          width: 100%;
          text-align: left;
          padding: 10px 0;
          color: #ffffff;
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
