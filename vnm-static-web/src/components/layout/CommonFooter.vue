<template>
  <footer class="footer">
    <div class="bottom-footer">
      <div class="sitemap" style="display: none">
        <ul class="index_bottom_des">
          <li>关于雷火</li>
          <li><router-link to="/promotion">优惠活动</router-link></li>
          <li @click="openRegPage">免费开户</li>
          <!--              <li><router-link to="/agent">代理加盟</router-link></li>-->
        </ul>
        <ul class="index_bottom_des">
          <li>产品服务</li>
          <li><router-link to="/sports">体育</router-link></li>
          <li><router-link to="/fishing">捕鱼</router-link></li>
          <li><router-link to="/slot">电子游戏</router-link></li>
          <li><router-link to="/live-casino">真人娱乐</router-link></li>
        </ul>
        <ul class="index_bottom_des">
          <li>帮助中心</li>
          <li><router-link to="/about?id=finance">存款指南</router-link></li>
          <li><router-link to="/about?id=privacy">新手学堂</router-link></li>
          <li><router-link to="/about?id=service">常见问题</router-link></li>
          <li><router-link to="/about?id=service">游戏规则</router-link></li>
        </ul>
        <!-- <ul class="index_bottom_des">
              <li>设为首页</li>
              <li @click="addToBookmark">加入收藏</li>
          </ul> -->
        <ul class="index_bottom_des">
          <li>浏览器下载</li>
          <li>
            <a href="https://s3-ap-northeast-1.amazonaws.com/brows/googlechromestandaloneenterprise64.msi">
              谷歌浏览器
            </a>
          </li>
          <li>
            <a
              href="http://download.microsoft.com/download/A/C/9/AC924EA1-9F39-4DFD-99DF-2C1DEB922174/EIE11/WOL/EIE11_EN-US_WOL_WIN764.EXE">
              IE9浏览器
            </a>
          </li>
          <li>
            <a href="http://download.firefox.com.cn/releases-sha2/stub/official/zh-CN/Firefox-latest.exe">火狐浏览器</a>
          </li>
        </ul>
      </div>
      <div class="bottom-footer-inner">
        <div>
          <router-link to="/about?id=aboutus">
            <div style="display: flex; align-items: center; gap: 5px">
              <img src="@/assets/footer/logo.png" alt="TF88 logo" />
            </div>
          </router-link>
        </div>
        <ul>
          <li>
            <router-link to="/about?id=aboutus">{{ $t("about.aboutus") }}</router-link>
          </li>
          <li>
            <router-link to="/about?id=info">{{ $t("about.collectInformation") }}</router-link>
          </li>
          <li>
            <router-link to="/about?id=law">{{ $t("about.legalBasis") }}</router-link>
          </li>
          <li>
            <router-link to="/about?id=rule">{{ $t("about.bettingRules") }}</router-link>
          </li>
          <li>
            <a :href="'https://vnm-affiliate.th80to83w1.com?agent=' + (affCode ? affCode : '')">
              {{ $t("about.affiliate") }}
            </a>
          </li>
          <li>
            <router-link to="/about?id=blame">{{ $t("about.blame") }}</router-link>
          </li>
        </ul>
        <!-- <div class="tagline">雷火是全球领先的合法博彩公司，拥有菲律宾政府PAGCOR 所颁发的离岸博彩许可证，并受其监管</div> -->
      </div>
    </div>
    <div class="top-footer">
      <div class="top-footer-inner">
        <!-- <div class="top-ft-left">
        <div class="icon firefox" @mouseover="isFireFox = true" @mouseout="isFireFox = false" :class="{hovering: isFireFox}"></div>
        <div class="icon chrome" @mouseover="isChrome = true" @mouseout="isChrome = false" :class="{hovering: isChrome}"></div>
        <div class="brush"><RiStarFill /><i class="remixicon-star-s-fill" style="font-size: 22px;"></i>一键收藏网站</div>
      </div> -->
        <div style="display: flex; flex-direction: column; gap: 10px">
          <div class="title">{{ $t("about.partner") }}</div>
          <div class="top-ft-rgt">
            <img src="../../assets/footer/games/AG.png" alt="AG logo" />
            <img src="../../assets/footer/games/CMD368.png" alt="CMD368 logo" />
            <img src="../../assets/footer/games/DG.png" alt="DG logo" />
            <img src="../../assets/footer/games/WE.png" alt="WE logo" />
            <img src="../../assets/footer/games/Rich88.png" alt="RICH88 logo" />
            <img src="../../assets/footer/games/TCG.png" alt="TCG logo" />
            <img src="../../assets/footer/games/SABA.png" alt="SABA logo" />
            <img src="../../assets/footer/games/SBO.png" alt="SBO logo" />
            <img src="../../assets/footer/games/WM.png" alt="WM logo" />
            <img src="../../assets/footer/games/AE.png" alt="AE logo" />
            <img src="../../assets/footer/games/KingMaker.png" alt="KingMaker logo" />
            <img src="../../assets/footer/games/EVO.png" alt="EVO logo" />
            <img src="../../assets/footer/games/KingPoker.png" alt="KingPoker logo" />
            <img src="../../assets/footer/games/PP.png" alt="PP logo" />
            <img src="../../assets/footer/games/V8.png" alt="V8 logo" />
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px">
          <div class="title">{{ $t("about.paymentMethod") }}</div>
          <div class="top-ft-rgt">
            <!-- <img src="../../assets/footer/payment/VCB.png" />
          <img src="../../assets/footer/payment/Sacombank.png" />
          <img src="../../assets/footer/payment/MB.png" />
          <img src="../../assets/footer/payment/Exim.png" />
          <img src="../../assets/footer/payment/Viettin.png" />
          <img src="../../assets/footer/payment/Techcombank.png" />
          <img src="../../assets/footer/payment/VP.png" />
          <img src="../../assets/footer/payment/BIDV.png" />
          <img src="../../assets/footer/payment/ACB.png" /> -->
            <!--            <img src="../../assets/footer/payment/bank-logo.png" alt="bank" />-->
            <img src="../../assets/footer/payment/napas247.png" alt="napas24/7" />
            <img src="../../assets/footer/payment/vietqr.png" alt="ViettelPay" />
            <img src="../../assets/footer/payment/momo.png" alt="momo" />
            <img src="../../assets/footer/payment/ZaloPay.png" alt="ZaloPay" />
            <!--            <img src="../../assets/footer/payment/scratch-card-logo.png" alt="scratch card" />-->
            <img src="../../assets/footer/payment/ViettelPayRed.png" alt="viettelpay" />
            <img src="../../assets/footer/payment/tether-logo.png" alt="tether" />
            <!--            <img src="../../assets/footer/payment/lotterycard.png" alt="lotteryCard" />-->
            <!--            <img src="../../assets/footer/payment/bank-transfer.png" alt="bankTransfer" />-->
          </div>
        </div>
      </div>
    </div>
  </footer>
  <!--
  <RegisterModal ref="regModal" /> -->
</template>
<script>
import { defineComponent, ref } from "vue";
import { userStore } from "@/store";
import { useRoute } from "vue-router";

import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";
import { uiStore } from "@/store/ui";
export default defineComponent({
  components: {},
  setup() {
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const isFireFox = ref(false);
    const isChrome = ref(false);
    const store = userStore();
    const ui = uiStore();
    const route = useRoute();
    console.log(route);
    const openRegPage = () => {
      store.regPageVisible = true;
    };
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      isFireFox,
      isChrome,
      store,
      openRegPage,
      affCode,
      languageVal,
      ui,
      route
    };
  }
});
</script>

<style scoped lang="scss">
.footer {
  // z-index: 2;
  // position: absolute;
  // left: 0;
  // right: 0;
  // margin: auto;
  font-size: 0.8rem;
  position: relative;
  background-color: #f3f7fd;

  .top-footer {
    background-color: $footer-black;
    padding-bottom: 16px;

    .top-footer-inner {
      border-top: 1px solid $font-1;
      margin: 0 auto;
      display: flex;
      gap: 50px;
      justify-content: center;
      padding: 10px 0;
      align-items: flex-start;
      width: 100%;
      max-width: $maxwidth;

      .top-ft-left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 10px;

        .icon {
          width: 40px;
          height: 40px;
          background-repeat: no-repeat;
          background-image: url("../../assets/footer/download.png");
          cursor: pointer;

          &.firefox {
            background-position: -40px -160px;

            &.hovering {
              background-position-x: -137px;
            }
          }

          &.chrome {
            background-position: -40px -110px;

            &.hovering {
              background-position-x: -137px;
            }
          }
        }
      }

      .title {
        color: #a4aabb;
        text-decoration: none;
        font-size: 15px;
        display: block;
        white-space: nowrap;
      }

      .top-ft-rgt {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap;

        .s1 {
          color: #ffffff;
          font-size: 16px;
        }

        img {
          height: 25px;
          // filter: grayscale(1);
          filter: brightness(0.5);
          mix-blend-mode: luminosity;

          &:hover {
            mix-blend-mode: normal;
            filter: brightness(1);
          }
        }

        .recBrowser {
          width: 40px;
          height: 40px;
          background-image: url(../../assets/footer/download.png);
          background-position-y: -2px;

          &.bchrome {
            background-position: -40px -110px;

            &:hover {
              background-position-x: -137px;
            }
          }

          &.bfirefox {
            background-position: -40px -160px;

            &:hover {
              background-position-x: -137px;
            }
          }
        }
      }

      .brush {
        width: 130px;
        height: 40px;
        background-color: #1d212d;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        cursor: pointer;
        font-size: 0.8rem;
        color: #c2c2c2;

        svg {
          width: 20px;
          fill: #c2c2c2;
        }
      }
    }
  }

  .bottom-footer {
    background: $footer-black;

    .bottom-footer-inner {
      color: #ffffff;
      display: flex;
      width: 100%;
      max-width: 1350px;
      margin: 0 auto;
      padding: 20px 0px;
      gap: 50px;

      img {
        height: 60px;
      }

      ul {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        list-style-type: none;
        margin: 0;
        padding: 0;
        flex-wrap: wrap;

        li {
          a {
            display: block;
            padding: 10px 10px;
            color: #a4aabb;
            text-decoration: none;
            font-size: 22px;
          }
        }
      }
    }

    .sitemap {
      max-width: $maxwidth;
      margin: 0px auto;
      padding: 20px 0;
      display: flex;
      justify-content: space-evenly;
      align-items: flex-start;

      ul {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 5px;
        margin: 0;
        padding: 0;

        li {
          list-style: none;
          cursor: pointer;
          font-size: 12px;
          color: #899dc7;
          letter-spacing: -0.46px;

          &:first-child {
            font-family: PingFangSC-Semibold;
            font-size: 14px;
            color: #fff;
            letter-spacing: -0.45px;
          }

          a {
            text-decoration: none;
            color: #899dc7;
          }
        }
      }
    }

    .tagline {
      padding: 10px;
      text-align: center;
      color: $color-white;
      font-size: 0.8rem;
    }
  }
}
</style>
