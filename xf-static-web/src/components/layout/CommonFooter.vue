<template>
  <footer class="footer">
    <div class="top-footer">
      <div class="top-footer-inner">
      <div class="top-ft-left">
        <div class="icon firefox" @mouseover="isFireFox = true" @mouseout="isFireFox = false" :class="{hovering: isFireFox}"></div>
        <div class="icon chrome" @mouseover="isChrome = true" @mouseout="isChrome = false" :class="{hovering: isChrome}"></div>
        <div class="brush"><RiStarFill /><i class="remixicon-star-s-fill" style="font-size: 22px;"></i>一键收藏网站</div>
      </div>
      <div class="top-ft-rgt">
        <span class="s1">支付方式：</span>
        <span class="footPayIcon visa" title="VISA"></span>
        <span class="footPayIcon masterCard" title="MasterCard"></span>
        <span class="footPayIcon chineseBank" title="中国银联"></span>
        <span class="footPayIcon fastBank" title="本地银行转账"></span>
        <span class="footPayIcon alipayf" title="支付宝"></span>
      </div>
      </div>
    </div>
    <div class="bottom-footer">
      <div class="bottom-footer-inner">
        <ul>
          <li><router-link to="/about?id=about">关于兴發</router-link></li>
          <li><router-link to="/about?id=contactus">联系我们</router-link></li>
          <li><router-link to="/about?id=terms">法律依据</router-link></li>
          <li><router-link to="/about?id=privacy">隐私条款</router-link></li>
          <li><router-link to="/about?id=service">服务条款</router-link></li>
          <li><router-link to="/agent">代理加盟</router-link></li>
        </ul>
        <div class="tagline">兴發娱乐是全球领先的合法博彩公司，拥有菲律宾政府PAGCOR所颁发的离岸博彩许可证，并受其监管</div>
      </div>
    </div>
  </footer>
  <!-- 
  <RegisterModal ref="regModal" /> -->
</template>
<script>
import { defineComponent, ref } from 'vue'
import { RiStarFill } from "vue-remix-icons";

export default defineComponent({
  components: {
    RiStarFill
  },
  setup() {
    const isFireFox = ref(false);
    const isChrome = ref(false);
    return {
      isFireFox,
      isChrome
    }
  },
})
</script>

<style scoped lang="scss">
.footer {
  font-size: .8rem;
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
          background-image: url('../../assets/footer/download.png');
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
        .s1 { 
          color: #ffffff;
        }
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        .footPayIcon {
          width: 55px;
          height: 40px;
          background-image: url(../../assets/footer/footerlogo-list.png);
          background-position-y: -2px;
          cursor: pointer;
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
          &.alipayf {
              width: 67px;
              background-position: -770px -2px;
              &:hover {
                background-position-y: -48px;
              }
          }
        }
      }
      .brush {
        width: 130px;
        height: 40px;
        background-color: #1D212D;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        cursor: pointer;
        font-size: .8rem;
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
            padding: 30px 10px;
            color: $footer-link;
            text-decoration: none;
          }
        }
      }
    }
    .tagline {
      padding: 10px;
            color: $footer-link;
            font-size: .8rem;
    }
  }
}

</style>