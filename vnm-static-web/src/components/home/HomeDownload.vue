<template>
  <div class="download-section" ref="appDownloadSectionRef">
    <HomeTitle :title="t('home.appDownload')"></HomeTitle>

    <div class="download-container">
      <div class="left-container" data-aos="fade-left">
        <img v-if="ui.edition === EDITION.SLOT" src="../../assets/home/download/download-bg-slot-edition.png"
          width="100%" alt="App screenshot showing task management features" />
        <img v-else src="../../assets/home/download/download-bg.png" width="100%"
          alt="App screenshot showing task management features" />
      </div>

      <div class="right-container" data-aos="fade-right">
        <HomeContentTitle :title="t('home.downloadTheApp')"></HomeContentTitle>

        <div class="tab-wrapper">
          <div class="dl-tab">
            <div class="tab-title"><img src="../../assets/logo.svg" /></div>
            <div class="tab-desc">
              {{ $t("home.futureGaming") }}
            </div>
            <div class="download-desc">
              {{ $t("home.scanToDownload") }}
            </div>
            <div class="download">
              <div class="dl-wrapper">
                <span class="dl-frame qr-placeholder" v-if="ui.isFetchingDownloadUrl">{{ $t('common.loading')
                  }}...</span>
                <VueQRCodeComponent v-else :size="90" :text="ui.downloadUrl" class="dl-frame" />
                <img src="../../assets/home/download/download-on-app-store-btn.svg"
                  alt="QR code to download the iOS TF88 app" />
              </div>
              <div class="dl-wrapper">
                <span class="dl-frame qr-placeholder" v-if="ui.isFetchingDownloadUrl">{{ $t('common.loading')
                  }}...</span>
                <VueQRCodeComponent v-else :size="90" :text="ui.downloadUrl" class="dl-frame" />
                <img src="../../assets/home/download/get-on-play-store-btn.svg"
                  alt="QR code to download the Android TF88 app">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import HomeTitle from "@/atoms/HomeTitle.vue";
import HomeContentTitle from "@/atoms/HomeContentTitle.vue";
import { uiStore } from "@/store/ui";
import VueQRCodeComponent from "vue-qrcode-component";
import { useI18n } from "vue-i18n";
import { EDITION } from "@/constant/edition";
import { useIntersectionObserver } from '@vueuse/core';

const { t } = useI18n();

const appDownloadSectionRef = ref(null);
const ui = uiStore();
const isAppDownloadSectionVisible = ref(false);
const { stop: stopIntersectionObserver } = useIntersectionObserver(
  appDownloadSectionRef,
  ([{ isIntersecting }]) => {
    isAppDownloadSectionVisible.value = isIntersecting
  },
);

watch(() => isAppDownloadSectionVisible.value, () => {
  if (isAppDownloadSectionVisible.value === true && !ui.downloadUrl) {
    ui.getAppDownloadUrl();
    stopIntersectionObserver();
  }
});
</script>

<style lang="scss">
.download-section {
  width: 80%;
  max-width: 1250px;
  margin: 0 auto;
  font-family: "Be Vietnam Pro", sans-serif;

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
            color: $font-5;
            font-size: 1.25rem;
            font-weight: 400;
            line-height: 1.875rem;
            margin: 1rem;
          }

          .download-desc {
            font-weight: 700;
            color: #424f72;
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
              padding: 4ch 12px 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 6px;
              width: 130px;
            }

            .qr-placeholder {
              width: 130px;
              height: 150px;
            }

            .qr-wrapper,
            .dl-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;

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
                line-height: 116.5%;
                margin: 0.25rem 0;
              }

              .link {
                color: #468cff;
                font-family: PingFang SC;
                font-size: 0.75rem;
                text-align: center;
                margin: 0 auto;
                font-weight: 400;
                line-height: 116.5%;
              }
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
