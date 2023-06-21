<template>
  <div class="customer-right" :style="!customerHovered ? 'right: -170px;':'right: 0;'">
    <div class="customer-right-logo">
        <div class="hot-activity customer-div">
            <a data-toggle="modal" data-target="#hotPromoModal" onclick="urlOpen('/personal/main.html?page=privilege')">
                <RiPaletteLine />
                <div style="margin-top: 15px;">热门活动</div>
            </a>
        </div>
        <div class="customer-center customer-div" @mouseover="customerHovered = true" @mouseleave="customerHovered = false">
            <RiCustomerServiceLine />
            <div style="margin-top: 15px;">客服中心</div>
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
                    <span style="margin-left: 5px;">cs@dyvip99.com</span>
                </div>
                <div class="content-line"></div>
                <div class="customer-num">
                    <RiPhoneFill />
                    <span style="margin-left: 5px;"><span class="customer_phone">852-81932110</span></span>
                </div>
            </div>
        </div>
        <div class="app-download customer-div">
            <a href="/download.html">

                <RiDownloadCloudLine />
                <div class="remixicon-download-cloud-line"></div>
                <div style="margin-top: 15px;">APP下载</div>
            </a>
        </div>
        <div class="back-top customer-div" @click="scrollToTop">

                <RiRocketLine />
            <div class="remixicon-rocket-line"></div>
            <div style="margin-top: 15px;">返回顶部</div>
        </div>
    </div>
</div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { RiPaletteLine, RiCustomerServiceLine, RiCustomerServiceFill,RiMailFill, RiPhoneFill, RiDownloadCloudLine,RiRocketLine } from 'vue-remix-icons'
import {userStore} from "@/store";

export default defineComponent({
  components: {
    RiPaletteLine,
    RiCustomerServiceLine,
    RiCustomerServiceFill,
    RiMailFill, RiPhoneFill, RiDownloadCloudLine,RiRocketLine
  },
  setup() {
    const customerHovered = ref(false);
    const scrollToTop = () => {
        window.scroll({ behavior: 'smooth', left: 0, top: 0 })
    };
    const store = userStore();
    return {
        store,
        customerHovered,
        scrollToTop
    }
  },
})
</script>


<style scoped lang="scss">.customer-right {
    position: fixed;
    top: 520px;
    width: 240px;
    z-index: 99999;
    display: flex;
    flex-direction: row;
    background: #e4eefe;
    border-radius: 6px 0 0 6px;
    -webkit-transition: right .3s ease-out;
    transition: right .3s ease-out;
}

.customer-right .customer-right-logo {
    width: 75px;
    font-size: 12px;
    line-height: 1px;
    color: #4080ff;
    border-radius: 6px 0 0 6px;
    background-color: #fcfcfc;
    box-shadow: 2px 3px 10px 0 rgba(168,168,168,.28);
}

.customer-right .customer-right-content {
    width: 170px;
    height: 264px;
    background-color: #e4edff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 12px;
    line-height: 22px;
    color: #74a1f4;
    position: absolute;
    left: 75px;
    top: -66px
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
    background-color: #e4edff
}

.customer-right-content .customer-content {
    width: 134px;
    height: 28px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-image: linear-gradient(36deg,#2f76f6 1%,#68b4fc 100%),linear-gradient(#000,#000);
    background-blend-mode: normal,normal;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    letter-spacing: 1px;
    color: #fff;
    margin: 50px auto 22px
}

.customer-right .customer-right-content .content-line {
    height: 2px;
    width: 150px;
    background-color: #2f76f6;
    margin: 0 auto
}

.customer-right-content .customer-email,.customer-right-content .customer-qq {
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
    color: #fff
}

.customer-right .back-top {
    padding-bottom: 15px
}

.customer-right .customer-div svg {
    width: 22px;
    fill: #4080ff;
}

.customer-right .customer-div svg.ri-customer-service-fill {
    fill: #ffffff;
}

.customer-right .customer-right-logo .customer-div a {
    color: #4080ff;
    text-align: center
}
.customer-right .customer-right-content svg {
    fill: #74a1f4;
}


</style>
