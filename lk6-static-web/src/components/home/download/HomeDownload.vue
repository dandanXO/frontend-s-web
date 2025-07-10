<template>
  <div class="download-section">
    <img v-if="languageVal === 'en'" src="../../../assets/home/download/download-section-title-en.svg" width="1100px"
      style="display:flex;margin:0 auto;" />
    <img v-else src="../../../assets/home/download/download-section-title.svg" width="1100px"
      style="display:flex;margin:0 auto;" />
    <div class="download-container">
      <div class="left-container" data-aos="fade-left">
        <div class="tab-wrapper">
          <div class="dl-tab">
            <div class="tab-title">{{ $t('download.title') }}</div>
            <div class="tab-desc">
              {{ $t('download.desc') }}
            </div>
            <div class="download">
              <div class="dl-wrapper">
                <VueQRCodeComponent :size="90" :text="ui.downloadUrl" class="dl-frame" />
                <div class="link-desc">{{ $t('download.scan') }}</div>
                <div class="link">
                  <a :href="ui.downloadUrl" target="_blank">{{ ui.downloadUrl }}</a>
                </div>
              </div>
              <div class="dl-wrapper">
                <div class="five-logo" />
                <div class="link-desc">{{ $t('download.download') }}</div>
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
import { uiStore } from "@/store/ui";
import VueQRCodeComponent from "vue-qrcode-component";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'

const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)

const activeKey = ref("1");
const ui = uiStore();

onMounted(() => { });
</script>

<style lang="scss" scoped>
.download-section {
  margin: 0 auto;
  width: 1200px;

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
            max-width: 400px;
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
                background-image: url(../../../assets/home/download/5-logo.png);
                background-position: center center;
                background-size: auto 100%;
                width: 120px;
                height: 120px;
                border-radius: 16px;
                margin-bottom: 20px;
              }
            }

            .dl-frame {
              background: linear-gradient(180deg, #9CC9FF 0%, #2194FF 104.03%);
              border: 0.74px solid #ABD2FF;
              box-shadow: 0px 3.69px 7.38px 0px #CCEDFF inset;
              display: flex;
              border-radius: 16px;
              padding: 25px;
              width: 120px;
              height: 120px;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }

            .qr-wrapper,
            .dl-wrapper {

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
                /* 1.165rem */
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
                /* 1.165rem */
              }
            }
          }
        }
      }
    }
  }
}
</style>
