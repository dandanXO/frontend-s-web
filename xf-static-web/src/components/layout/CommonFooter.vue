<template>
  <footer class="footer">
    <div class="top-footer">
      <div class="top-footer-inner">
        <div class="top-ft-left">
          <div
            class="icon firefox"
            @mouseover="isFireFox = true"
            @mouseout="isFireFox = false"
            :class="{ hovering: isFireFox }"
          ></div>
          <div
            class="icon chrome"
            @mouseover="isChrome = true"
            @mouseout="isChrome = false"
            :class="{ hovering: isChrome }"
          ></div>
          <div class="brush" @click="bookmarkPopout">
            <RiStarFill />
            <i class="remixicon-star-s-fill" style="font-size: 22px"></i>
            一键收藏网站
          </div>
        </div>
        <div class="top-ft-rgt">
          <span class="s1">支付方式：</span>
          <span class="footPayIcon usdt" title="USDT"></span>
          <span class="footPayIcon unionpay" title="中国银联"></span>
          <span class="footPayIcon numberpay" title="数字人民币"></span>
          <span class="footPayIcon alipayf" title="支付宝"></span>
          <span class="footPayIcon wechat" title="Wechat"></span>
          <span class="footPayIcon qq" title="QQ"></span>
        </div>
      </div>
    </div>
    <div class="bottom-footer">
      <div class="bottom-footer-inner">
        <ul>
          <li><router-link to="/about?id=us">关于兴發</router-link></li>
          <li><router-link to="/about?id=guide">新手引导</router-link></li>
          <li><router-link to="/about?id=sportrule">体育投注规则</router-link></li>
          <li><router-link to="/about?id=aboutQaGame">游戏问题</router-link></li>
          <li><router-link to="/about?id=responsibility">竞猜责任</router-link></li>
          <li><router-link to="/about?id=cooperate">合作商户</router-link></li>
          <li><router-link to="/about?id=rule">规则与条款</router-link></li>
          <li><router-link to="/about?id=privacy">隐私保护规则</router-link></li>
          <li><router-link to="/about?id=contact">联系我们</router-link></li>
          <li><router-link to="/agent">代理加盟</router-link></li>
        </ul>
        <div class="tagline">
          兴發娱乐是全球领先的合法博彩公司，拥有菲律宾政府PAGCOR所颁发的离岸博彩许可证，并受其监管
        </div>
      </div>
    </div>
  </footer>
  <!--
  <RegisterModal ref="regModal" /> -->
</template>
<script>
import { defineComponent, ref } from "vue";
import { RiStarFill } from "vue-remix-icons";
import { ElMessageBox } from "element-plus";

export default defineComponent({
  components: {
    RiStarFill
  },
  setup() {
    const isFireFox = ref(false);
    const isChrome = ref(false);

    const alertBookmark = () => {
      ElMessageBox.alert("请使用 Ctrl + D 收藏该网站", {
        showClose: false,
        confirmButtonText: "确认",
        type: "info",
        draggable: false,
        buttonSize: "small"
      });
    };

    const bookmarkPopout = () => {
      const isWindows = /win/i.test(navigator.platform);
      const isMacOS = /mac/i.test(navigator.platform);

      if (isWindows) {
        alertBookmark("请使用 Ctrl + D 收藏该网站");
      } else if (isMacOS) {
        alertBookmark("请使用 Command + D 收藏该网站");
      }
    };

    return {
      isFireFox,
      isChrome,
      alertBookmark,
      bookmarkPopout
    };
  }
});
</script>

<style scoped lang="scss">
.footer {
  font-size: 0.8rem;
  .top-footer {
    background: $footer-top;
    .top-footer-inner {
      max-width: $maxwidth;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
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
        }
        .footPayIcon {
          height: 36px;
          cursor: pointer;
          &.numberpay {
            width: 36px;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url("../../assets/footer/number.png");

            &:hover,
            &:active {
              background-image: url("../../assets/footer/number-active.png");
            }
          }
          &.usdt {
            border-radius: 4px;
            width: 36px;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url("../../assets/footer/usdt.png");

            &:hover,
            &:active {
              background-image: url("../../assets/footer/usdt-active.png");
            }
          }
          &.unionpay {
            width: 58px;
            background-size: contain;
            background-image: url("../../assets/footer/union.png");

            &:hover,
            &:active {
              background-image: url("../../assets/footer/union-active.png");
            }
          }
          &.alipayf {
            border-radius: 4px;
            width: 36px;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url("../../assets/footer/zhifu.png");
            &:hover {
              background-image: url("../../assets/footer/zhifu-active.png");
            }
          }
          &.wechat {
            width: 43px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: initial;
            background-image: url("../../assets/footer/wechat.png");
            filter: grayscale(100%);

            &:hover {
              filter: none;
            }
          }
          &.qq {
            width: 32px;
            background-size: contain;
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
      max-width: $maxwidth;
      margin: 0 auto;
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
            padding: 20px 10px;
            color: $footer-link;
            text-decoration: none;
          }

          a:hover,
          a:active {
            color: #fff;
          }
        }
      }
    }
    .tagline {
      padding: 10px;
      color: $footer-link;
      font-size: 0.8rem;
      text-align: center;
    }
  }
}
</style>
