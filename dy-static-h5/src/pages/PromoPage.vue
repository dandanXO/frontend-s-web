<template>
  <div class="promo-container">
    <div class="promo">
      <q-tabs v-if="!isPromoDetail" v-model="tab" align="justify">
        <q-tab
          v-for="(tab, i) in tabItems"
          :key="i"
          :name="tab.name"
          :label="tab.label"
        />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="(tab, i) in tabItems" :key="i" :name="tab.name">
          <div class="all-promotions" v-if="!isPromoDetail">
            <div class="promo-main-container">
              <div class="promo-type-wrapper"></div>
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
                    <div class="pad-title">
                      <span class="pad-right">查看详情&gt;&gt;</span>
                    </div>
                    <div class="promo-info">
                      <span class="viewdetail">{{ promo.title }}</span>
                    </div>
                    <div class="promo-img-wrapper">
                      <div class="promo-bg">
                        <img
                          class="promo-content"
                          :src="imgURL + promo.mobileImgUrl"
                        />
                      </div>
                    </div>
                    <div class="pad-label label-new">最新活动</div>
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
                  <HotPromotion :list="selectedPromo" />
                </div>
                <div
                  :class="{
                    welcome:
                      selectedPromo.promoType.toLowerCase() === 'welcome',
                    sport: selectedPromo.promoType.toLowerCase() === 'sport',
                    eSport: selectedPromo.promoType.toLowerCase() === 'esport',
                    fish: selectedPromo.promoType.toLowerCase() === 'fish',
                    liveCasino:
                      selectedPromo.promoType.toLowerCase() === 'livecasino',
                    slot: selectedPromo.promoType.toLowerCase() === 'slot game'
                  }"
                >
                  <!-- <div v-html="selectedPromo.pageContent"></div> -->
                  <div>
                    <div class="title-box">
                      <img
                        src="https://jsn92.czxinbang.com/xf-resource/wap/images/promo/package/package_active.png"
                      />
                    </div>
                    <div class="active-content">
                      <p>
                        感谢兴發全体会员，特开启红包雨活动，红包雨每日15:00:00分、20:00:00
                        分开启两次，每次开启将随机派发三个奖金1888元红包，此活动在特定时间
                        开启，逢节假日将增加大量现金红包及实物奖品随机派发。
                      </p>
                      <p>
                        活动时间：2020-12-24 00:00:00 至 2022-12-31 23:59:59
                      </p>
                    </div>
                    <div class="title-box">
                      <img
                        src="https://jsn92.czxinbang.com/xf-resource/wap/images/promo/package/package_ruler.png"
                      />
                    </div>
                    <ul class="rule-list poker-tab">
                      <li>
                        用户单笔充值金额≥200元即可报名一次，获得红包奖金将直接添加到主账户中。
                      </li>
                      <li>
                        活动开启时间为每日15:00:00分、20:00:00分两次系统自动开启，未及时参与活动无任何补偿。
                      </li>
                      <li>获得奖金完成一倍流水即可提款。</li>
                      <li>
                        开启活动节假日：春节、元宵节、劳动节、端午节、七夕节、中秋节、国庆节、元旦节日当天开启两次。
                      </li>
                      <li>
                        每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的用户，保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
                      </li>
                      <li>
                        所有电竞/体育赔率均为欧洲盘，且投注赔率低于1.75和无效的、取消的、同局中对冲投注将不计算在有效投注内。
                      </li>
                      <li>
                        凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDisplayLogin">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black text-center">
      <q-card-section class="q-mb-md">
        <strong>系统提示</strong><br /><br />
        请登录后再操作
      </q-card-section>
      <q-btn href="/login?redirect=/promo" label="确认" color="dyblue" />
    </q-card>
  </q-dialog>

</template>

<script lang="js">
import {ref, defineComponent, onMounted, reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import { useUI } from "stores/ui";
import { userStore } from "stores/index";
// import { loadPromo } from "src/api/index/promo.js";
// import { loadPromoBanner } from "src/api/index/promo";

import HotPromotion from 'components/HotPromotion'
// import HotPromotion from 'components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion
  },
  setup() {
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
      {value: "SPORT", label: "SPORT"},
      {value: "LIVE CASINO", label: "LIVE CASINO"},
      {value: "SLOT", label: "SLOT"},
    ]);
    const promoTabActive = ref(promoTypes.value[0].value);
    const filteredArray = ref([]);
    const isPromoDetail = ref(false);
    const selectedPromo = ref({});
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const ui= useUI();
    const isDisplayLogin = ref(false);

    const tab = ref("all");
    const tabItems = [
      {
        name: "all",
        label: "全部",
      },
      {
        name: "esport",
        label: "电竞",
      },
      {
        name: "sport",
        label: "体育",
      },
      {
        name: "livecasino",
        label: "真人",
      },
      {
        name: "slots",
        label: "电游",
      },
    ];

    watch(() => route.query, () => {
      if (route.query === null) {
        isPromoDetail.value = false
      } else {
        isPromoDetail.value = route.query.name
        ui.setScrollPosition("vertical", 0, 200);
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
        .then((response) => {
          if (response.code === 0) {
            banner.value = response.data[0];
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
    const showPromoDetails = (promo) => {
      if (!store.token) {
        isDisplayLogin.value = true
      } else {

        if (route.query.fromAccount) {
          router.push({path: '/promo', query: {name: promo.redirectUrl, fromAccount: true}})
        } else {
          router.push({path: '/promo', query: {name: promo.redirectUrl }})
        }
        isPromoDetail.value = true
        selectedPromo.value = promo
      }
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
      api.get("/promo/page").then((res) => {
        if (res.code === 0) {
          promoState.promoList.push(...res.data);

          if (route.query.name) {
            promoState.promoList.forEach(element => {
              if (String(element.redirectUrl) === route.query.name) {
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
      store,
      tab,
      tabItems,
      isDisplayLogin
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
        td {
          padding: 10px 20px;
          border-bottom: 1px solid #272c3d;

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
}
</style>
<style lang="scss">
.promo-container {
  color: #000;
  .all-promotions {
    padding-bottom: 20px;
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
      height: 40vw;
      max-height: 130px;
      margin: 10px;
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
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 20px;
            background: #272c3d;
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
          transform: scale(0.5);
        }
        to {
          transform: scale(1);
        }
      }

      .promo-list-wrapper {
        margin-top: 30px;
        display: grid;
        margin-top: 20px;
        grid-template-columns: 1fr;
        grid-gap: 18px;

        .promo-item {
          position: relative;
          // overflow: hidden;
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
            // border-radius: 10px 10px 0 0;

            .promo-bg {
              transition: all 0.5s ease;
              background-size: cover;
              background-position: center center;
              margin: 0;
              background: #ffffff;
              padding: 25px 3px 3px;
              border-radius: 4px;
              // border-radius: 10px 10px 0 0;

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
            // text-align: right;
            // border-radius: 0 0 10px 10px;

            // left: 0;
            // bottom: 0;
            // width: 100%;
            // background-color: #272c3d;
            // display: flex;
            // justify-content: flex-end;
            // align-items: center;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .viewdetail {
              // color: #000;
              // padding: 0 4px;
              position: absolute;
              top: -5px;
              left: -2px;
              font-size: 12px;
              color: #3a3a3a;
              z-index: 2;
              width: 100%;
              // padding: 4px;
              background: #d2d2de;

              &:before {
                display: block;
                content: "";
                background: #ffffff;
                height: 100%;
                width: 70px;
                position: absolute;
                top: -2px;
                right: -2px;
              }

              &:after {
                display: block;
                content: "";
                top: -2px;
                right: 48px;
                position: absolute;
                width: 0;
                height: 0;
                border-left: 20px solid transparent;
                border-right: 20px solid transparent;
                border-top: 20px solid #ffffff;
                transform: rotate(180deg);
                clear: both;
              }
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
        }
      }

      .inner {
        max-width: 1400px;
        width: 90%;
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;
        img {
          margin-bottom: 10px;
        }

        ol,
        ul {
          margin: 0;
          padding: 15px;
          li {
            margin-bottom: 20px;
          }
        }
        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          th {
            padding: 5px;
            text-align: center;
            background-image: linear-gradient(0deg, #07414c 0, #058096 100%),
              linear-gradient(#d0d1d3, #d0d1d3);
          }
          td {
            padding: 5px;
            text-align: center;
            background-color: #202228;
            border: 1px solid #2e3039;
          }
        }
        img {
          width: 100%;
          display: block;
        }
        .hot-promo {
          background: #272c3d;
          border-radius: 10px;
        }

        .promo-view-container {
          background: #272c3d;
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

.pad-title {
  position: absolute;
  top: -7px;
  right: 5px;
  z-index: 3;
  font-size: 12px;
  color: #3e5cc0;
}

.pad-label.label-new {
  background: url(../assets/promo/yh_label_new.png) no-repeat;
  // background-size: 100%;
  background-size: 78px 45px;
  font-size: 12px;
  color: #ffffff;
  padding: 12px 7px;
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
}

.promo {
  .q-tabs {
    // background: rgba(113, 125, 146, 0.2);
    background: #ffffff;
    width: 100%;
    margin: 0 auto;
  }
  .q-tab {
    min-height: 40px;
  }
  .q-tab__content {
    width: 100%;
  }
  .q-tab--active {
    color: #3e5cc0;
  }
  .q-tab__label {
    font-size: 13px;
  }
  .q-tab--active .q-tab__indicator {
    background: url("../assets/images/promotion/tab_bg.png") no-repeat center
      center;
    background-size: 20px 10px;
    width: 100%;
    height: 10px;
    // background: salmon !important;
  }
  .q-tab__label {
    z-index: 1;
  }
  .q-tab-panels {
    background: none;
    // padding: 10px;
    padding: 0;
  }
  .q-tab-panel {
    padding: 0;
  }
  .download-item {
    background: #ffffff;
    padding: 10px;
    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: flex-start;
      img {
        width: 40px;
      }
    }
    .download {
      width: 120px;
      margin-left: auto;
      display: block;
    }
  }
}
</style>
