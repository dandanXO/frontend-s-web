<template>
  <footer class="footer">
    <div class="top-footer">
      <div class="top-footer-inner">
        <!-- <div class="top-ft-left">
        <div class="icon firefox" @mouseover="isFireFox = true" @mouseout="isFireFox = false" :class="{hovering: isFireFox}"></div>
        <div class="icon chrome" @mouseover="isChrome = true" @mouseout="isChrome = false" :class="{hovering: isChrome}"></div>
        <div class="brush"><RiStarFill /><i class="remixicon-star-s-fill" style="font-size: 22px;"></i>一键收藏网站</div>
      </div> -->
        <div class="top-ft-rgt">
          <span class="s1">博彩责任：</span>
          <span class="footPayIcon gameCore" title="GameCore"></span>
          <span class="footPayIcon eighteenadd" title="18+"></span>
          <span class="s1">推荐浏览器：</span>
          <span class="recBrowser bchrome" title="Chrome"></span>
          <span class="recBrowser bfirefox" title="Firefox"></span>
        </div>
        <div class="top-ft-rgt">
          <span class="s1">合作伙伴:</span>
          <span class="hzhb-icon ag" title="ag"></span>
          <span class="hzhb-icon sw" title="sw"></span>
          <span class="hzhb-icon pt" title="pt"></span>
          <span class="hzhb-icon cq" title="cq"></span>
          <span class="hzhb-icon mg" title="mg"></span>
          <span class="hzhb-icon bbin" title="bbin"></span>
          <span class="hzhb-icon xj" title="xj"></span>
        </div>
        <div class="top-ft-rgt">
          <span class="s1">支付方式：</span>
          <span class="footPayIcon usdt" title="USDT"></span>
          <span class="footPayIcon unionpay" title="中国银联"></span>
          <span class="footPayIcon numberpay" title="数字人民币"></span>
          <span class="footPayIcon alipayf" title="支付宝"></span>
          <span class="footPayIcon wechat" title="Wechat"></span>
          <span class="footPayIcon qq" title="QQ"></span>
          <!--          <span class="footPayIcon visa" title="VISA"></span>-->
          <!--          <span class="footPayIcon masterCard" title="MasterCard"></span>-->
          <!--          <span class="footPayIcon chineseBank" title="中国银联"></span>-->
          <!--          <span class="footPayIcon fastBank" title="本地银行转账"></span>-->
        </div>
      </div>
    </div>
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
              href="http://download.microsoft.com/download/A/C/9/AC924EA1-9F39-4DFD-99DF-2C1DEB922174/EIE11/WOL/EIE11_EN-US_WOL_WIN764.EXE"
            >
              IE9浏览器
            </a>
          </li>
          <li>
            <a href="http://download.firefox.com.cn/releases-sha2/stub/official/zh-CN/Firefox-latest.exe">火狐浏览器</a>
          </li>
        </ul>
      </div>
      <div class="bottom-footer-inner">
        <ul>
          <li>
            <router-link to="/about?id=us">
              <div style="display: flex; align-items: center; gap: 5px">
                <img src="@/assets/footer/footer-lh-logo.png" />
                <div>关于雷火</div>
              </div>
            </router-link>
          </li>
          <li><router-link to="/about?id=guide">新手引导</router-link></li>
          <li><router-link to="/about?id=sportrule">体育投注规则</router-link></li>
          <li><router-link to="/about?id=aboutQaGame">游戏问题</router-link></li>
          <li><router-link to="/about?id=responsibility">竞猜责任</router-link></li>
          <li><router-link to="/about?id=cooperate">合作商户</router-link></li>
          <li>
            <a :href="'https://lh1-affiliate.phoicynxeey.com/lh/login?agent=' + (affCode ? affCode : '')">加盟代理</a>
          </li>
          <li><router-link to="/about?id=rule">规则与条款</router-link></li>
          <li><router-link to="/about?id=privacy">隐私保护规则</router-link></li>
          <li><router-link to="/about?id=contact">联系我们</router-link></li>
        </ul>
        <!-- <div class="tagline">雷火是全球领先的合法博彩公司，拥有菲律宾政府PAGCOR 所颁发的离岸博彩许可证，并受其监管</div> -->
      </div>
    </div>
  </footer>
  <!--
  <RegisterModal ref="regModal" /> -->
</template>
<script>
import { defineComponent, ref } from "vue";
import { userStore } from "@/store";

export default defineComponent({
  components: {},
  setup() {
    const isFireFox = ref(false);
    const isChrome = ref(false);
    const store = userStore();
    const openRegPage = () => {
      store.regPageVisible = true;
    };
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      isFireFox,
      isChrome,
      store,
      openRegPage,
      affCode
    };
  }
});
</script>

<style scoped lang="scss">
.footer {
  font-size: 0.8rem;
  .top-footer {
    .top-footer-inner {
      border-bottom: 1px solid $font-1;
      background-color: $footer-black;
      margin: 0 auto;
      display: flex;
      gap: 50px;
      justify-content: center;
      padding: 10px 0;
      .top-ft-left {
        display: flex;
        justify-content: center;
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
      .top-ft-rgt {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        .s1 {
          color: #ffffff;
          font-size: 16px;
          min-width: 100px;
        }
        .footPayIcon {
          height: 40px;
          cursor: pointer;
          &.numberpay {
            width: 40px;
            background-repeat: no-repeat;
            background-image: url("../../assets/footer/number.png");

            &:hover,
            &:active {
              background-image: url("../../assets/footer/number-active.png");
            }
          }
          &.usdt {
            border-radius: 4px;
            width: 40px;
            background-repeat: no-repeat;
            background-image: url("../../assets/footer/usdt.png");

            &:hover,
            &:active {
              background-image: url("../../assets/footer/usdt-active.png");
            }
          }
          &.unionpay {
            width: 64px;
            background-image: url("../../assets/footer/union.png");

            &:hover,
            &:active {
              background-image: url("../../assets/footer/union-active.png");
            }
          }
          &.alipayf {
            border-radius: 4px;
            width: 40px;
            background-repeat: no-repeat;
            background-image: url("../../assets/footer/zhifu.png");
            &:hover {
              background-image: url("../../assets/footer/zhifu-active.png");
            }
          }
          &.wechat {
            width: 48px;
            background-repeat: no-repeat;
            background-position: initial;
            background-image: url("../../assets/footer/wechat.png");
            filter: grayscale(100%);

            &:hover {
              filter: none;
            }
          }
          &.qq {
            width: 36px;
            background-repeat: no-repeat;
            background-position: initial;
            background-image: url("../../assets/footer/qq.png");
            filter: grayscale(130%);

            &:hover {
              filter: none;
            }
          }

          &.visa {
            width: 55px;
            background-position: -266px -2px;
            &:hover {
              background-position-y: -48px;
            }
          }
          &.masterCard {
            width: 55px;
            background-position: -348px -2px;
            &:hover {
              background-position-y: -48px;
            }
          }
          &.chineseBank {
            width: 77px;
            background-position: -422px -2px;
            &:hover {
              background-position-y: -48px;
            }
          }
          &.fastBank {
            width: 67px;
            background-position: -602px -2px;
            &:hover {
              background-position-y: -48px;
            }
          }

          &.gameCore {
            width: 30px;
            background-position: 450px 0px;
            &:hover {
              background-position-y: -46px;
            }
          }
          &.eighteenadd {
            width: 30px;
            background-position: 380px -2px;
            &:hover {
              background-position-y: -48px;
            }
          }
        }

        .hzhb-icon {
          width: 55px;
          height: 40px;
          background-image: url(../../assets/footer/footer-hzhb.png);
          background-position-y: -2px;
          cursor: pointer;
          &.ag {
            width: 55px;
            background-position: -10px -10px;
            &:hover {
              background-position-y: -60px;
            }
          }
          &.sw {
            width: 55px;
            background-position: -70px -10px;
            &:hover {
              background-position-y: -60px;
            }
          }
          &.pt {
            width: 55px;
            background-position: -130px -10px;
            &:hover {
              background-position-y: -60px;
            }
          }
          &.cq {
            width: 55px;
            background-position: -190px -10px;
            &:hover {
              background-position-y: -60px;
            }
          }
          &.mg {
            width: 55px;
            background-position: -250px -10px;
            &:hover {
              background-position-y: -60px;
            }
          }
          &.bbin {
            width: 55px;
            background-position: -310px -10px;
            &:hover {
              background-position-y: -60px;
            }
          }
          &.xj {
            width: 55px;
            background-position: -370px -10px;
            &:hover {
              background-position-y: -60px;
            }
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
      width: 1000px;
      margin: 0 auto;
      flex-direction: column;
      ul {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          a {
            display: block;
            padding: 10px 10px;
            color: $color-white;
            text-decoration: none;
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

.dark {
  .footer {
    .top-footer {
      .top-footer-inner {
        background-color: #0a0c16;
        border: none;

        .top-ft-rgt {
          .s1 {
            color: $font-3-dark;
          }
        }
      }
    }
    .bottom-footer {
      background: #010105;
      .bottom-footer-inner {
        ul {
          li {
            a {
              color: $font-3-dark;
              &:hover {
                color: $color-white;
              }
            }
          }
        }
      }
    }
  }
}
</style>
