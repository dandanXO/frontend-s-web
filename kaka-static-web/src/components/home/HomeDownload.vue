<template>
  <div class="download-section">
    <HomeTitle :title="t('home.appDownload')"></HomeTitle>
    <div class="download-container">
      <div class="left-container"
           data-aos="fade-left">
        <img src="../../assets/home/download/download-bg.png" width="100%" />
      </div>

      <div class="right-container"
           data-aos="fade-right">
        <HomeContentTitle :title="t('home.downloadTheApp')"></HomeContentTitle>

        <div class="tab-wrapper">
          <div class="dl-tab">
            <div class="tab-title"><img src="../../assets/logo.svg"></div>
            <div class="tab-desc">
              {{ $t('home.futureGaming') }}
            </div>
            <div class="download-desc">
              {{ $t('home.scanToDownload') }}
            </div>
            <div class="download">
              <div class="dl-wrapper">
                <VueQRCodeComponent :size="90" :text="ui.downloadUrl" class="dl-frame" />
                <img src="../../assets/home/download/ios.png" >
              </div>
              <div class="dl-wrapper">
                <VueQRCodeComponent :size="90" :text="ui.downloadUrl" class="dl-frame" />
                <!-- <div class="link-desc">手机免费下载地址</div>
                <div class="link"><a :href="ui.downloadUrl" target="_blank">{{ ui.downloadUrl }}</a></div> -->
                <img src="../../assets/home/download/android.png" >
              </div>
            </div>
          </div>

          <!-- <el-tabs class="tab" v-model="activeKey" type="card"> -->
          <!-- <el-tab-pane name="1" label="全站APP"> -->
          <!-- <div class="tab-title">综合客户端下载</div>
              <div class="tab-desc">
                引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web,H5,更有iOS,Android原生APP，让您随时随地，娱乐
                投注！
              </div>
              <div class="download"> -->
          <!--                <div class="qr-wrapper">-->
          <!--                  <img src="../../assets/home/download/app.png" />-->
          <!--                  <div class="link-desc">扫码进入下载页面</div>-->
          <!--                  <div class="link">www.leihuo.com</div>-->
          <!--                </div>-->
          <!-- <div class="dl-wrapper">
                  <VueQRCodeComponent :size="140" :text="ui.downloadUrl" />
                  <div class="link-desc">手机免费下载地址</div>
                  <div class="link">{{ui.downloadUrl}}</div>
                </div>
              </div> -->
          <!-- </el-tab-pane> -->
          <!--            <el-tab-pane name="2"  label="电竞APP">-->
          <!--              <div class="tab-title">电竞App下载</div>-->
          <!--              <div class="tab-desc">-->
          <!--                引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web,H5,更有iOS,Android原生APP，让您随时随地，娱乐-->
          <!--                投注！-->
          <!--              </div>-->
          <!--              <div class="download">-->
          <!--                <div class="qr-wrapper">-->
          <!--                  <img src="../../assets/home/download/app.png" />-->
          <!--                  <div class="link-desc">扫码进入下载页面</div>-->
          <!--                  <div class="link">www.leihuo.com</div>-->
          <!--                </div>-->
          <!--                <div class="dl-wrapper">-->
          <!--                  <img src="../../assets/home/download/app.png" />-->
          <!--                  <div class="link-desc">手机免费下载地址</div>-->
          <!--                  <div class="link">www.leihuo.com</div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </el-tab-pane>-->
          <!--            <el-tab-pane key="3" label="体育APP" >-->
          <!--              <div class="tab-title">体育App下载</div>-->
          <!--              <div class="tab-desc">-->
          <!--                引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web,H5,更有iOS,Android原生APP，让您随时随地，娱乐-->
          <!--                投注！-->
          <!--              </div>-->
          <!--              <div class="download">-->
          <!--                <div class="qr-wrapper">-->
          <!--                  <img src="../../assets/home/download/app.png" />-->
          <!--                  <div class="link-desc">扫码进入下载页面</div>-->
          <!--                  <div class="link">www.leihuo.com</div>-->
          <!--                </div>-->
          <!--                <div class="dl-wrapper">-->
          <!--                  <img src="../../assets/home/download/app.png" />-->
          <!--                  <div class="link-desc">手机免费下载地址</div>-->
          <!--                  <div class="link">www.leihuo.com</div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </el-tab-pane>-->
          <!-- </el-tabs> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import HomeTitle from "@/atoms/HomeTitle.vue";
import HomeContentTitle from "@/atoms/HomeContentTitle.vue";
import { uiStore } from "@/store/ui";
import VueQRCodeComponent from "vue-qrcode-component";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const activeKey = ref("1");
const ui = uiStore();

onMounted(() => {});
</script>

<style lang="scss">
.download-section {
  width: 80%;
  max-width: 1250px;
  margin: 0 auto;

  .download-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .left-container {
      width: 60%;
      z-index: 1;

      img {
        transform: scale(1.6);
        margin-top: 4rem;
        // width: 35rem;
        position: relative;
        // right: 2.5rem;
      }
    }

    .right-container {
      z-index: 2;
      width: 40%;

      .tab-wrapper {
        border-radius: 1.25rem;
        background: #fff;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.22);
        padding: 0.5rem;

        .dl-tab {
          margin: 6px;
          border: 1px solid #5c9fff;
          border-radius: 0.8125rem;
          padding: 1rem;
          text-align: left;
          .tab-title {
            color: #7a80a1;
            font-size: 1.79594rem;
            font-weight: 700;
            line-height: normal;
            margin-bottom: 1rem;
            text-align: center;
          }

          .tab-desc {
            color: #A4AABB;
            font-size: 1.25rem;
            font-weight: 400;
            line-height: 1.875rem;
            margin: 1rem;
          }
          .download-desc {
            font-weight: 700;
            color: #ffffff;
            font-size: 1.3rem;
            margin: 1rem;
          }

          .download {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 25px;
            margin: 1rem 0 0.5rem 0;
            text-align: center;
            .dl-mobile-img {
              width: 60%;
            }
            .dl-frame {
              background-image: url(../../assets/home/download/qr-frame.png);
              background-position: center center;
              background-size: 100% 100%;
              padding: 3ch 12px 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 6px;
              width: 130px;
            }

            .qr-wrapper,
            .dl-wrapper {
              // border-radius: 0.875rem;
              // background: #e3f5ff;
              // text-align: center;
              // padding: 0.5rem 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              // gap: 3px;

              div {
                text-align: center;
              }

              canvas {
                text-align: center;
              }

              .link-desc {
                color: #7a80a1;
                font-family: PingFang SC;
                font-size: 1rem;
                font-weight: 400;
                line-height: 116.5%; /* 1.165rem */
                margin: 0.25rem 0;
              }

              .link {
                color:  #FD3C31;
                font-family: PingFang SC;
                font-size: 0.75rem;
                text-align: center;
                margin:0 auto;
                font-weight: 400;
                line-height: 116.5%; /* 1.165rem */

              }
            }

            .qr-wrapper {
            }
            .dl-wrapper {
            }
          }

          .tab {
            border-radius: 0.8125rem;
            border: 1px solid #5c9fff;
            padding: 1rem;

            .el-tabs__header {
              border-bottom: unset;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 3.0625rem;
              background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
              box-shadow: 0px 2px 4.58px 0px #FFA09A inset, 0px -1px 3.664px 0px #ffa09a inset;
              padding: 0.25rem 0;
              color:  #FD3C31;
              font-size: 0.875rem;
              font-weight: 400;
              line-height: normal;
            }
          }
        }
      }
    }
  }
}
</style>
