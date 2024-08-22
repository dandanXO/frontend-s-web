<template>
  <div class="download-section">
    <!-- <HomeTitle title="APP下载" subtitle="APP DOWNLOAD"></HomeTitle> -->
    <HomeTitleV2 title="APP下载" subtitle="APP DOWNLOAD" />
    <div class="download-container">
      <div class="left-container" data-aos="fade-left">
        <img src="../../../assets/home/download/download-bg.png" width="100%" />
      </div>

      <div class="right-container" data-aos="fade-right">
        <HomeContentTitle title="APP下载"></HomeContentTitle>

        <div class="tab-wrapper">
          <div class="dl-tab">
            <div class="tab-title">综合客户端下载</div>
            <div class="tab-desc">
              引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web,H5,更有iOS,Android原生APP，让您随时随地，娱乐
              投注！
            </div>
            <div class="download">
              <div class="dl-mobile-img">
                <img src="../../../assets/home/download/mobile-img2.png" width="100%" />
              </div>
              <div class="dl-wrapper">
                <VueQRCodeComponent :size="120" :text="ui.downloadUrl" class="dl-frame" />
                <div class="link-desc">手机免费下载地址</div>
                <div class="link">
                  <a :href="ui.downloadUrl" target="_blank">{{ ui.downloadUrl }}</a>
                </div>
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
          <!--                  <img src="../../../assets/home/download/app.png" />-->
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
          <!--                  <img src="../../../assets/home/download/app.png" />-->
          <!--                  <div class="link-desc">扫码进入下载页面</div>-->
          <!--                  <div class="link">www.leihuo.com</div>-->
          <!--                </div>-->
          <!--                <div class="dl-wrapper">-->
          <!--                  <img src="../../../assets/home/download/app.png" />-->
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
          <!--                  <img src="../../../assets/home/download/app.png" />-->
          <!--                  <div class="link-desc">扫码进入下载页面</div>-->
          <!--                  <div class="link">www.leihuo.com</div>-->
          <!--                </div>-->
          <!--                <div class="dl-wrapper">-->
          <!--                  <img src="../../../assets/home/download/app.png" />-->
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
  width: 80%;
  max-width: 1040px;
  margin: 0 auto;

  .download-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .left-container {
      width: 50%;

      img {
        // width: 35rem;
        position: relative;
        // right: 2.5rem;
      }
    }

    .right-container {
      width: 50%;

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

          .tab-title {
            color: #7a80a1;
            font-family: Microsoft YaHei;
            font-size: 1.79594rem;
            font-weight: 700;
            line-height: normal;
            margin-bottom: 1rem;
            text-align: center;
          }

          .tab-desc {
            color: #a4aabb;
            font-family: Microsoft YaHei;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1.375rem; /* 157.143% */
            margin: 1rem;
          }

          .download {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 25px;
            margin: 1rem 0 0.5rem 0;

            .dl-mobile-img {
              width: 60%;
            }

            .dl-wrapper {
              width: 40%;
            }

            .dl-frame {
              background-image: url(../../../assets/home/download/qr-frame.png);
              background-position: center center;
              background-size: 100% 100%;
              padding: 40px 12px 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 6px;
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

.dark {
  .download-section {
    .download-container {
      .right-container {
        .tab-wrapper {
          @include content-block-dark;
          .tab-title {
            color: $active-color-dark;
          }
          .tab-desc {
            color: $font-3-dark;
          }
          .dl-tab{
            .download{
              .dl-wrapper{
                .link-desc{
                  color: $font-3-dark;
                }
                .dl-frame {
                  background-image: url(../../../assets/home/download/qr-frame-dark.png);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
