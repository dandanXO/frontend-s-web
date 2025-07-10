<template>
  <div class="service-section">
    <img v-if="languageVal === 'en'" src="../../../assets/home/service/service-section-title-en.svg" width="1100px" style="display:flex;margin:0 auto;" />
    <img v-else src="../../../assets/home/service/service-section-title.svg" width="1100px" style="display:flex;margin:0 auto;" />
    <div class="service-container">
      <div class="top-container" data-aos="fade-down">
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <!-- <div class="type">CURRENT SPEED</div> -->
              <Vue3Autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="Math.floor(Math.random() * 31) + 50"
                :duration="1"
                separator=","
                :autoinit="true"
              />
              <div class="unit">{{ $t('service.seconds') }}</div>
            </div>
          </div>
          <div v-if="languageVal === 'en'" class="title">{{ $t('service.averageDepositTime') }}</div>
          <template v-else>
            <div class="title">平均存款时间</div>
            <div class="title-en">Average Time To Deposit</div>
          </template>
        </div>
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <!-- <div class="type">TOTALLY AMOUNT</div> -->
              <Vue3Autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="14"
                :duration="3"
                separator=","
                :autoinit="true"
              />
              <div class="unit">{{ $t('service.partners') }}</div>
            </div>
          </div>
          <div v-if="languageVal === 'en'" class="title">{{ $t('service.coopPaymentPlatform') }}</div>
          <template v-else>
            <div class="title">合作支付平台</div>
            <div class="title-en">Cooperative Payment Platform</div>
          </template>
        </div>
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <!-- <div class="type">CURRENT SPEED</div> -->
              <Vue3Autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="Math.floor(Math.random() * 31) + 70"
                :duration="2"
                separator=","
                :autoinit="true"
              />
              <div class="unit">{{ $t('service.seconds') }}</div>
            </div>
          </div>
          <div class="title" v-if="languageVal === 'en'">{{ $t('service.averageWithdrawTime') }}</div>
          <template v-else>
            <div class="title">平均取款时间</div>
            <div class="title-en">Average time To Withdraw</div>
          </template>
        </div>
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <!-- <div class="type">TOTALLY AMOUNT</div> -->
              <Vue3Autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="90"
                :duration="3"
                separator=","
                :autoinit="true"
              />
              <div class="unit">{{ $t('service.partners') }}</div>
            </div>
          </div>

          <div v-if="languageVal === 'en'" class="title">{{ $t('service.coopGamingPlatform') }}</div>
          <template v-else>
            <div class="title">合作游戏平台</div>
            <div class="title-en">Cooperative Gaming Platform</div>
          </template>
        </div>
      </div>
      <div class="bot-container" data-aos="fade-up">
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/deposit.svg" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">{{ $t('service.tagline01_title') }}</div>
              <div class="desc">
                {{ $t('service.tagline01_desc') }}
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/category.svg" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">{{ $t('service.tagline02_title') }}</div>
              <div class="desc">
                {{ $t('service.tagline02_desc') }}
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/security.svg" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">{{ $t('service.tagline03_title') }}</div>
              <div class="desc">
                {{ $t('service.tagline03_desc') }}
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/mobile.svg" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">{{ $t('service.tagline04_title') }}</div>
              <div class="desc">
                {{ $t('service.tagline04_desc') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Vue3Autocounter  from "vue3-autocounter";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'

const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
const loadCircleBg = () => require("../../../assets/home/service/circle-bg.png");

onMounted(() => {});
</script>

<style scoped lang="scss">
.service-section {
  width: 1300px;
  margin: 0 auto;

  .service-container {
    margin: 2.5rem 0 0 0;

    .top-container {
      display: flex;
      justify-content: space-between;
      padding: 0 5rem;
      margin: 2.5rem 0;

      .counter {
        .circle {
          width: 10rem;
          height: 10rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          //border: 3px solid #94baf8;
          //background: linear-gradient(180deg, #93f2ff 3.39%, #3a69f7 100%);
          background-image: url("../../../assets/home/service/circle-bg.svg");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100% 100%;
          //box-shadow: 0px 4px 20px 0px rgba(255, 255, 255, 0.88) inset;
          margin: 0 0 2rem 0;

          .inner-circle {
            width: 9rem;
            height: 9rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 15px;

            .type {
              color: #333;
              text-align: center;
              font-family: "PingFang SC";
              font-size: 0.71319rem;
            }

            .auto-counter {
              filter: drop-shadow(0px 2px #c4effa);
              font-family: FZHanZhenGuangBiaoS-GB;
              font-size: 2.82869rem;
              font-weight: 400;
              line-height: normal;
              letter-spacing: 0.14144rem;
              background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              -webkit-text-stroke-width: 0.1px;
              -webkit-text-stroke-color: white;
            }

            .unit {
              color: #333;
              text-align: center;
              font-family: PingFang SC;
              font-size: 1rem;
              font-weight: 400;
              line-height: normal;
            }
          }
        }

        .title {
          font-weight: 600;
          font-size: 18px;
          line-height: 100%;
          letter-spacing: 0%;
          text-align: center;
          color: #3A5178;
          font-family: 'PingFang SC';
        }

        .title-en {
          font-weight: 400;
          font-size: 12px;
          line-height: 100%;
          letter-spacing: 0%;
          text-align: center;
          color: #44484B;
          font-family: 'PingFang SC';
        }
      }
    }

    .bot-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1.5rem;

      .item-wrapper {
        padding: 0.5rem;
        width: calc((100% - 2rem) / 2);
        background: url('../../../assets/home/service/item-wrapper-bg.png') center center no-repeat;
        background-size: 100% 100%;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 20px;

          .left-container {
            .circle-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;

              .circle {
                width: 7.5rem;
              }

              .icon {
                height: 40px;
                width: 40px;
                position: absolute;
              }
            }
          }

          .right-container {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .title {
              font-weight: 600;
              font-size: 22px;
              line-height: 100%;
              letter-spacing: 5%;
              color: #3A5178;
            }
            .desc {
              font-weight: 400;
              font-size: 14px;
              line-height: 23px;
              letter-spacing: 5%;
              color: #7A80A1;
            }
          }
        }
      }
    }
  }
}
</style>
