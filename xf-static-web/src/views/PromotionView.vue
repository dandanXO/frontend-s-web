<template>
  <div class="promo-container">
    <div class="all-promotions" v-if="!isPromoDetail">
      <!-- <div v-if="banner.desktopImgUrl" class="banner-container"> -->
      <!-- <div
          class="promo-bg isDesktop"
          :style="
            'background-image: url(' + imgURL + banner.desktopImageUrl + ''
          "
        ></div>
        <div
          class="promo-bg isMobile"
          :style="
            'background-image: url(' + imgURL + banner.mobileImageUrl + ''
          "
        ></div> -->
      <!-- <div class="promo-bg">
          <img src="../assets/promo/bg-top.jpg">
        </div> -->
      <!-- </div> -->
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
              <!-- <img
                v-if="p && p.code === 'ALL'"
                src="../assets/images/index/game_icon_all.png"
              />
              <template v-else>{{ p.label }}</template> -->
              <!-- <img :src="require('../assets/promo/menu-' + p.img + '.png')" /> -->
              <img :src="p.iconUrl" />
              {{ p.label.zh || p.label }}
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
      <div class="selected-promo-wrapper" :class="`bg__${selectedPromo.promoCode}`">
        <div
          class="banner-container"
          :style="{
            'min-height': selectedPromo.redirectUrl === 'xf1-ag-yuanxiaohongbao' ? 'unset' : '500px'
          }"
          v-if="selectedPromo.redirectUrl !== 'cny-hongbaoyu' || selectedPromo.redirectUrl !== 'xf-eurocup-hongbao'"
        >
          <template v-if="selectedPromo.promoCode === 'cny-spinwheel'">
            <img
              src="../assets/images/promotion/hotpromo/bonus-spinwheel/banner1.png"
              style="display: block; width: 100%"
            />
          </template>
          <template v-else>
            <div
              class="promo-bg isDesktop"
              :style="'background-image: url(' + imgURL + selectedPromo.desktopBannerUrl + ''"
            ></div>
            <div
              class="promo-bg isMobile"
              :style="'background-image: url(' + imgURL + selectedPromo.mobileImgUrl + ''"
            ></div>
          </template>
        </div>
        <div
          class="inner"
          :class="{
            hongbao:
              selectedPromo.promoCode === 'cny-hongbaoyu' ||
              selectedPromo.redirectUrl === 'cny-hongbaoyu' ||
              selectedPromo.promoCode === 'xf-eurocup-hongbao' ||
              selectedPromo.redirectUrl === 'xf-eurocup-hongbao',
            fullwidth: selectedPromo.redirectUrl === 'xf1-cny2025-red-envelope'
          }"
          :style="{
            backgroundImage: selectedPromo?.desktopImgBackgroundUrl
              ? `url(${imgURL + selectedPromo.desktopImgBackgroundUrl})`
              : 'none',
            margin: ['xf1-ag-yuanxiaohongbao', 'xf1-lantern-festival-bonus'].includes(selectedPromo.redirectUrl)
              ? '0px auto'
              : '20px auto',
            'max-width': ['xf1-ag-yuanxiaohongbao', 'xf1-lantern-festival-bonus'].includes(selectedPromo.redirectUrl)
              ? 'unset'
              : '1400px',
            width: ['xf1-ag-yuanxiaohongbao', 'xf1-lantern-festival-bonus'].includes(selectedPromo.redirectUrl)
              ? '100%'
              : '95%'
          }"
        >
          <div class="hot-promo" v-if="selectedPromo.hasPromo">
            <HotPromotion :list="selectedPromo" />
          </div>
          <div
            class="promo-view-container"
            v-if="selectedPromo.promoCode !== 'xf-eurocup-hongbao'"
            :class="{
              welcome: selectedPromo.promoType.toLowerCase() === 'welcome',
              sport: selectedPromo.promoType.toLowerCase() === 'sport',
              eSport: selectedPromo.promoType.toLowerCase() === 'esport',
              fish: selectedPromo.promoType.toLowerCase() === 'fish',
              liveCasino: selectedPromo.promoType.toLowerCase() === 'livecasino',
              slot: selectedPromo.promoType.toLowerCase() === 'slot game'
            }"
          >
            <!-- <div class="game-title"><img src="../assets/images/promotion/hotpromo/common/title_txt_content.png"></div> -->
            <div v-html="selectedPromo.pageContent"></div>
            <!-- <table><colgroup><col><col><col><col></colgroup><tbody><tr><th><p>Bonus Type</p></th><th><p>Bonus%</p></th><th><p>Max bonus</p></th><th><p>Turnover</p></th></tr><tr><td><p>Welcome Bonus</p></td><td><p>100%</p></td><td><p>MYR 300</p></td><td><p>12x</p></td></tr></tbody></table>
            活动内容：最低存款 100 即可参加，最高奖金无限制，参与次数无限制。

活动时间：每天下午的 19:00 至 23:59 之间。

会员等级	存送比例	提款要求	指定场馆
所有兴發会员	30%	18 倍	老虎机
申请方式：在存款页面下方选择 30% 存送优惠，奖金与存款同时到账，最低存款 100，参与次数无限制，仅限每天下午 19:00 至 23:59

投注要求：会员选择并申请 30% 限时存优惠，需在老虎机有效游戏中投注存款加奖金的指定倍数，方可申请提款，不可转账投注其他游戏。

例如：会员选择 30% 限时存送并且成功存款了 500 元人民币，奖金=500 X 30%=150 元。 -->

            <!-- <div class="game-title"><img src="../assets/images/promotion/hotpromo/common/title_txt_rule.png"></div>
            <div v-html="selectedPromo.pageRules"></div> -->
            <!-- <ol>
              <li>优惠开始于 10 月 13 日 00:00，结束时间为 12 月 31 日 23:59</li>
              <li>本优惠存款 100 元或以上即可申请；无最高奖金上限，存的越多送的越多。</li>
              <li>如需取消存送优惠，须在开始游戏前联系“在线客服”并待处理完毕后，才可开始游戏。如已进行转账、游戏，将无法取消存送优惠。</li>
              <li>本优惠奖金仅限转账进行老虎机游戏，并以老虎机有效游戏计算流水，不允许转账进行其他类型的游戏，任何违规行为一经发现，将扣除所有盈利及奖金额度，产生的负盈利不予退还。</li>
              <li>兴發保留对此活动作出修改，终止的权利。</li>
              <li>有任何疑问请随时咨询在线客服。</li>
            </ol> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted, reactive, watch } from "vue";
import { userStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { loadPromo, loadPromoTypes } from "@/api/index/promo.js";
import { loadPromoBanner } from "@/api/index/promo";

import HotPromotion from "@/components/HotPromotion";
import {useLocalStorage} from "@vueuse/core";

export default defineComponent({
  name: "PromoView",
  components: {
    HotPromotion
  },
  setup() {
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
    const banner = ref([]);
    const promoState = reactive({
      active: "ALL",
      promoList: []
    });
    const promoTypes = ref([
      { code: "ALL", img: "all", label: "全部优惠" },
      { code: "SLOT GAME", img: "game", label: "电子优惠" },
      { code: "FISH", img: "game", label: "捕鱼优惠" },
      { code: "LIVE CASINO", img: "spade", label: "真人优惠" },
      { code: "POKER", img: "dice", label: "棋牌优惠" }
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
    // const showPromoDetails = (promo) => {
    //   if (promo.redirectUrl.includes("page-vip")) {
    //     router.push("/vip");
    //   } else {
    //     router.push({name: 'promotion', query: {name: promo.redirectUrl}})
    //     isPromoDetail.value = true
    //     selectedPromo.value = promo
    //   }
    // }
    const showPromoDetails = (promo) => {
        if (promo.redirectUrl.includes("page-vip")) {
          router.push("/vip");
        }
        else if (promo.redirectUrl.includes("invitefriend")) {
          router.push("/privilege/invite");
        }
        else {
          router.push({ name: "promotion", query: { name: promo.redirectUrl } });
          isPromoDetail.value = true;
          selectedPromo.value = promo;
        }
        window.scroll({ behavior: "smooth", left: 0, top: 0 });
      }

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
    const loadAll = async() => {
      await loadPromoTypes().then((res) => {
        if (res.length > 0) {
          promoTypes.value = [];
          res.forEach(element => {
            const obj = {
              code: element.value,
              img: 'all',
              iconUrl: imgURL + element.iconUrl,
              label: JSON.parse(element.name)
            };
            promoTypes.value.push(obj);
          });
          switchPromoType(promoTypes.value[0])
        } else {
          console.warn('No promo types loaded, using default promo types.');
        }
      });
      const isLogin = !!store.token;
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
      imgURL
    };
  }
});
</script>
<style lang="scss">
.promo-container {
  background: #090b19;

  .all-promotions {
    background: url(../assets/promo/bg-top.jpg) no-repeat center top;
    // background-size: cover;
    // min-height: 40vh;
    // padding: 50px;
    position: relative;

    padding-top: 420px;
    padding-bottom: 20px;
    background-color: #0e121b;
    background-repeat: no-repeat;
    background-position: top 120px;
  }

  .promo-view-container {
    line-height: 30px;

    ol {
      padding: 0 15px;
    }

    // table {
    //   margin: 0 15px 20px;
    //   width: 98%;
    //   display: block;
    //   overflow-x: auto;
    //   white-space: nowrap;
    //   border: 0;
    //   tr {
    //     td {
    //       padding: 10px 20px;
    //       border-bottom: 1px solid #201f29;
    //       border: 0;
    //       p {
    //         margin: 0;
    //       }
    //     }
    //     &:first-child {
    //       td {
    //         color: #ffd800;
    //         white-space: nowrap;
    //       }
    //     }
    //     td:nth-child(odd) {
    //       background: #2e2e45;
    //     }
    //     td:nth-child(even) {
    //       background: #2e2e45;
    //     }
    //   }
    // }
    // table {
    //       border-collapse: collapse;
    //       th, td {
    //         padding: 10px;
    //       }
    //   th {
    //     background-image: linear-gradient(0deg,#07414c 0,#058096 100%),linear-gradient(#d0d1d3,#d0d1d3);
    //   }
    //   td {
    //         background-color: #202228;
    //         border: 1px solid #2e3039;
    //   }
    // }
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
      border-collapse: collapse;

      tr:first-child td {
        background-image: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
        color: #ffffff;
        border: 0;
      }

      th,
      td {
        padding: 10px;
      }

      th {
        background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
      }

      td {
        // background-color: #202228;
        border: 1px solid #dcdce8;
      }
    }
  }

  a {
    color: #ffd800;
    font-size: 17px;
  }
}
</style>
<style scoped lang="scss">
.promo-container {
  padding-bottom: 80px;

  min-height: 70vh;
  color: #ffffff;

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
        height: 430px;
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
      background-color: #222a34;
      box-shadow: 0 5px 8px 0 rgb(0 0 0 / 30%);
      border-radius: 8px;
      margin: 0 auto;

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
          border-radius: 20px;
          gap: 20px;
          padding: 30px;
          overflow: auto;

          .type-item {
            padding: 5px 10px;
            cursor: pointer;
            // border-radius: 20px;
            // background: #201f29;
            // box-shadow: 0 0 10px -3px #000000;
            // white-space: nowrap;
            background-color: #333b44;
            box-shadow: 0 3px 4px 0 rgb(0 0 0 / 15%);
            border-radius: 25px;
            margin: 0 auto;
            font-size: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            padding: 10px 30px;

            img {
              max-height: 30px;
              filter: grayscale(0);
            }

            &.active,
            &:hover {
              // background: #4b4e66;
              // box-shadow: 0 0 5px #ffffff;
              background-image: linear-gradient(90deg, #35d8f2 0, #2188c9 100%), linear-gradient(#5243bd, #5243bd);

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
              max-height: 200px;

              &:hover {
                transform: scale(1.2);
              }

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
            // border-radius: 0 0 10px 10px;

            left: 0;
            bottom: 0;
            width: 100%;
            // background-color: #333b44;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .viewdetail {
              color: #ffffff;
              padding: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
      &.bg__xf1-cny2025-red-envelope {
        .inner {
          width: 100%;
          max-width: 100%;
          margin: 0;
        }

        .banner-container {
          .promo-bg {
            background-size: 100% 100%;

            &.isDesktop {
              min-height: 569px;
              aspect-ratio: unset;
            }
          }
        }
      }

      &.bg__xf-eurocup-hongbao {
        padding-bottom: 0px;
        background-color: #090b18;

        .banner-container {
          display: none;
        }

        .inner {
          height: 100%;
          justify-content: space-between;
          max-width: none;
          width: 100%;
          margin: 0 auto;
        }
      }

      &.bg__xf-deposit-award {
        background-image: url("../assets/images/promotion/hotpromo/deposit-award/bg.jpg");
        // background-size: cover;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: top center;
        padding-bottom: 0px;
        background-color: #770201;

        .banner-container {
          display: none;
        }

        .inner {
          height: 100%;
          justify-content: space-between;
          max-width: none;
          width: 100%;
          margin: 0 auto;
        }
      }

      &.bg__xf-return-promo {
        background-image: url("../assets/images/promotion/hotpromo/return-promo/bg.png");
        // background-size: cover;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: top center;
        padding-bottom: 0px;
        background-color: #770201;

        .banner-container {
          display: none;
        }

        .inner {
          height: 100%;
          justify-content: space-between;
          max-width: none;
          width: 100%;
          margin: 0 auto;
        }
      }

      &.bg__cny-spinwheel {
        background-image: url("../assets/images/promotion/hotpromo/bonus-spinwheel/bg.jpg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: top center;
        padding-bottom: 0px;

        .inner {
          height: 100%;
          justify-content: space-between;
          max-width: none;
          width: 100%;
          margin: 0 auto;
        }

        .hot-promo {
          width: 95%;
          max-width: 1400px;
          margin: 0 auto 10px;
        }

        .promo-view-container {
          max-width: none !important;
          width: 100% !important;
          background-color: #a1211d;

          > div {
            max-width: 1400px;
            margin: 0 auto;
          }
        }

        .hongbaoyu-modal {
          .el-dialog__header .el-dialog__headerbtn {
            display: none !important;
          }
        }

        .banner-container {
          min-height: 0 !important;

          .promo-bg {
            &.isDesktop {
              display: none !important;
              height: 0px !important;
            }

            &.isMobile {
              display: none !important;
              height: 0px !important;
            }
          }
        }
      }

      .banner-container {
        width: 100%;

        .promo-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;

          &.isDesktop {
            display: block;
            min-height: 430px;
            aspect-ratio: 1920/500;
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

        &.hongbao {
          margin: 0px;
          width: 100%;
          max-width: none;
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
          overflow: auto;

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

    //.selected-promo {
    //  overflow: hidden;
    //
    //  .selected-promo-wrapper {
    //    .banner-container {
    //      .promo-bg {
    //        &.isDesktop {
    //          display: none;
    //        }
    //
    //        &.isMobile {
    //          display: block;
    //        }
    //      }
    //    }
    //  }
    //}
  }
}
</style>
