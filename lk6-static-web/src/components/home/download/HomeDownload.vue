<template>
  <div class="download-section">
    <img src="../../../assets/home/download/download-section-title.svg" width="1100px" style="display:flex;margin:0 auto;" />
    <div class="download-container">
      <div class="left-container" data-aos="fade-left">
        <div class="tab-wrapper">
          <div class="dl-tab">
            <div class="tab-title">综合客户端下载</div>
            <div class="tab-desc">
              引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web,H5,更有iOS,Android原生APP，让您随时随地，娱乐
              投注！
            </div>
            <div class="download">
              <div class="dl-wrapper">
                <VueQRCodeComponent :size="120" :text="ui.downloadUrl" class="dl-frame" />
                <div class="link-desc">手机免费下载地址</div>
                <div class="link">
                  <a :href="ui.downloadUrl" target="_blank">{{ ui.downloadUrl }}</a>
                </div>
              </div>
              <div class="dl-wrapper">
                <div class="five-logo" />
                <div class="link-desc">手机免费下载地址</div>
                <div class="link">
                  <a :href="ui.downloadUrl" target="_blank">{{ ui.downloadUrl }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-container" data-aos="fade-right">
        <img src="../../../assets/home/download/download-section-right-decor.png" width="100%" />
        </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import HomeTitle from "@/atoms/HomeTitle.vue";
import HomeTitleV2 from "@/atoms/HomeTitleV2.vue";
import HomeContentTitle from "@/atoms/HomeContentTitle.vue";
import { uiStore } from "@/store/ui";
import VueQRCodeComponent from "vue-qrcode-component";

const activeKey = ref("1");
const ui = uiStore();

onMounted(() => {});
</script>

<style lang="scss" scoped>
.download-section {
  margin: 0 auto;
  width: 1300px;

  .download-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .right-container {
      width: 60%;

      img {
        // width: 35rem;
        width: 80%;
        display: flex;
        margin: auto;
        position: relative;
        // right: 2.5rem;
      }
    }

    .left-container {
      width: 40%;

      .tab-wrapper {
        border-radius: 1.25rem;
        padding: 0.5rem;

        .dl-tab {
          margin: 6px;
          border-radius: 0.8125rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 20px;

          .tab-title {
            font-weight: 700;
            font-size: 40px;
            line-height: 100%;
            letter-spacing: 0%;
            color: #3A5178;
          }

          .tab-desc {
            font-weight: 400;
            font-size: 20px;
            line-height: 28px;
            letter-spacing: 0%;
            color: #3A5178;
          }

          .download {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 10px;
            margin: 1rem 0 0.5rem 0;

            .dl-mobile-img {
              width: 60%;
            }

            .dl-wrapper {
              width: 40%;
              background-image: url(../../../assets/home/download/qr-frame.svg);
              background-position: center center;
              background-size: 100% 100%;
              width: 196px;
              height: 254px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              .five-logo {
                background-image: url(../../../assets/home/download/5-logo.svg);
                background-position: center center;
                background-size: auto 100%;
                width: 150px;
                height: 172px;
                border-radius: 16px;
              }
            }

            .dl-frame {
              background: linear-gradient(180deg, #9CC9FF 0%, #2194FF 104.03%);
              border: 0.74px solid #ABD2FF;
              box-shadow: 0px 3.69px 7.38px 0px #CCEDFF inset;
              display: flex;
              border-radius: 16px;
              padding: 25px;
              width: 150px;
              height: 172px;
              align-items: center;
              justify-content: center;
            }

            .qr-wrapper,
            .dl-wrapper {
              // border-radius: 0.875rem;
              // background: #e3f5ff;
              // text-align: center;
              // padding: 0.5rem 1rem;
              // display: flex;
              // flex-direction: column;
              // align-items: center;
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
                color: #468cff;
                font-family: PingFang SC;
                font-size: 0.75rem;
                text-align: center;
                margin: 0 auto;
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
              box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.664px 0px #a2bff4 inset;
              padding: 0.25rem 0;
              color: #468cff;
              font-family: Microsoft YaHei;
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
