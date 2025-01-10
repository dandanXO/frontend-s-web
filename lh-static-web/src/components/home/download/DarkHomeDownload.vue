<template>
    <div class="download-section">
      <img style="display:flex;margin:auto;width:850px;" src="../../../assets//home/download/app-download-title-dark.png" />
      <div class="app-download-wrapper">
        <div class="dl-frame">
            <VueQRCodeComponent :size="80" :text="ui.downloadUrl" class="qr-code" />
            <span class="dl-text">免费下载地址</span>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { onMounted, ref } from "vue";
  import { uiStore } from "@/store/ui";
  import VueQRCodeComponent from "vue-qrcode-component";

  const activeKey = ref("1");
  const ui = uiStore();

  onMounted(() => {});
  </script>

  <style lang="scss" scoped>
  .download-section {
    width: 100%;
    margin: 0 auto;

    .app-download-wrapper {
        background: url('../../../assets/home/download/app-download-dark.png') no-repeat center center;
        background-size: 100% 100%;
        aspect-ratio: 2776 / 1634;
        position: relative;
        margin: 0 auto;
        width: 1170px;
        height: auto;
        margin-top: -30px;

        .dl-frame {
            position: absolute;
            bottom: 9.7%;
            right: 18.8%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5px;

            .qr-code {
                background: white;
                padding: 10px;
                border-radius: 15px;
            }

            .dl-text {
                color: #fff;
                text-align: center;
                font-size: 1rem;
                font-family: PingFang SC;
            }
        }
    }

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
