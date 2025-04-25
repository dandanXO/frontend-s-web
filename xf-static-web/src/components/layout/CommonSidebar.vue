<template>
  <div class="customer-right" :style="!customerHovered ? 'right: -170px;' : 'right: 0;'">
    <div class="customer-right-logo">
      <div class="hot-activity customer-div">
        <router-link to="/promotion">
          <RiPaletteLine />
          <div style="margin-top: 15px">热门活动</div>
        </router-link>
      </div>
      <div
        class="customer-center customer-div"
        @mouseover="customerHovered = true"
        @mouseleave="customerHovered = false"
      >
        <RiCustomerServiceLine />
        <div style="margin-top: 15px">客服中心</div>
        <div class="customer-right-content">
          <div class="customer-content" @click.stop.prevent="store.openLiveChat()">
            <RiCustomerServiceFill />
            <span>24小时在线客服</span>
          </div>
          <!--<div class="content-line"></div>
                  <div class="customer-qq">
                      <div class="remixicon-qq-fill"></div>
                      <span style="margin-left: 2px;">QQ号：<span class="customer_qq_number">2853531804</span></span>
                  </div>-->
          <div class="content-line"></div>
          <div class="customer-email">
            <RiMailFill />
            <span style="margin-left: 5px">cs@xf969.com</span>
          </div>
          <!--          <div class="content-line"></div>-->
          <!--          <div class="customer-num">-->
          <!--            <RiPhoneFill />-->
          <!--            <span style="margin-left: 5px">-->
          <!--              <span class="customer_phone">852-81929166</span>-->
          <!--            </span>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="app-download customer-div">
        <router-link to="/app">
          <RiDownloadCloudLine />
          <div class="remixicon-download-cloud-line"></div>
          <div style="margin-top: 15px">APP下载</div>
        </router-link>
      </div>
      <div class="back-top customer-div" @click="scrollToTop">
        <RiRocketLine />
        <div class="remixicon-rocket-line"></div>
        <div style="margin-top: 15px">返回顶部</div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import {
  RiPaletteLine,
  RiCustomerServiceLine,
  RiCustomerServiceFill,
  RiMailFill,
  RiPhoneFill,
  RiDownloadCloudLine,
  RiRocketLine
} from "vue-remix-icons";
import { userStore } from "@/store";

export default defineComponent({
  components: {
    RiPaletteLine,
    RiCustomerServiceLine,
    RiCustomerServiceFill,
    RiMailFill,
    RiPhoneFill,
    RiDownloadCloudLine,
    RiRocketLine
  },
  setup() {
    const customerHovered = ref(false);
    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };
    const store = userStore();
    return {
      store,
      customerHovered,
      scrollToTop
    };
  }
});
</script>

<style scoped lang="scss">
.customer-right {
  position: fixed;
  bottom: 50px;
  width: 240px;
  z-index: 99;
  display: flex;
  flex-direction: row;
  // background: #e4eefe;
  background: #222a34;
  border-radius: 6px 0 0 6px;
  -webkit-transition: right 0.3s ease-out;
  transition: right 0.3s ease-out;
}

.customer-right .customer-right-logo {
  width: 75px;
  font-size: 12px;
  line-height: 1px;
  color: #4080ff;
  border-radius: 6px 0 0 6px;
  // background-color: #fcfcfc;
  background-color: #222a34;
  box-shadow: 2px 3px 10px 0 rgba(61, 60, 60, 0.28);
}

.customer-right .customer-right-content {
  width: 170px;
  height: 264px;
  // background-color: #e4edff;
  background-color: #222a34;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 12px;
  line-height: 22px;
  // color: #74a1f4;
  position: absolute;
  left: 75px;
  top: -66px;
}

.customer-right-logo .customer-div {
  width: 75px;
  height: 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  position: relative;
}

.customer-right-logo .customer-div:hover {
  color: #32ceed !important;

  a {
    color: #32ceed !important;
  }

  svg {
    fill: #32ceed !important;
  }
}

.customer-right-content .customer-content {
  width: 134px;
  height: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-image: linear-gradient(36deg, #1e293f 1%, #29585a 100%), linear-gradient(#000, #000);
  background-blend-mode: normal, normal;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 1px;
  color: #fff;
  margin: 50px auto 22px;
}

.customer-right .customer-right-content .content-line {
  height: 2px;
  width: 150px;
  background-color: #3d8183;
  margin: 0 auto;
}

.customer-right-content .customer-email,
.customer-right-content .customer-qq {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0px;
}

.customer-right-content .customer-num {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 0;
}

.customer-right .customer-div.active {
  background-color: #1d212e;
  color: #fff;
}

.customer-right .back-top {
  padding-bottom: 15px;
}

.customer-right .customer-div svg {
  width: 22px;
  fill: #ffffff;
}

.customer-right .customer-div svg.ri-customer-service-fill {
  fill: #ffffff;
}

.customer-right .customer-right-logo .customer-div a {
  color: #3d8183;
  text-align: center;
  text-decoration: none;
}
.customer-right .customer-right-logo .customer-div {
  color: #3d8183;
  text-align: center;
  text-decoration: none;
}
.customer-right .customer-right-content svg {
  fill: #ffffff;
}
</style>
