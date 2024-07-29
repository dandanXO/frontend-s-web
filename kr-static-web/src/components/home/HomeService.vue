<template>
  <div class="service-section">
    <HomeTitle title="CITY8 Service"></HomeTitle>
    <div class="service-container">
      <!-- <div class="top-container" data-aos="fade-down">
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <div class="type">CURRENT SPEED</div>
              <Vue3autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="Math.floor(Math.random() * 31) + 50"
                :duration="1"
                separator=","
                :autoinit="true"
              />
              <div class="unit">秒</div>
            </div>
          </div>
          <div class="title">平均存款时间</div>
          <div class="title-en">Average Time To Deposit</div>
        </div>
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <div class="type">TOTALLY AMOUNT</div>
              <Vue3autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="14"
                :duration="3"
                separator=","
                :autoinit="true"
              />
              <div class="unit">家</div>
            </div>
          </div>
          <div class="title">合作支付平台</div>
          <div class="title-en">Cooperative Payment Platform</div>
        </div>
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <div class="type">CURRENT SPEED</div>
              <Vue3autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="Math.floor(Math.random() * 31) + 70"
                :duration="2"
                separator=","
                :autoinit="true"
              />
              <div class="unit">秒</div>
            </div>
          </div>
          <div class="title">平均取款时间</div>
          <div class="title-en">Average time To Withdraw</div>
        </div>
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <div class="type">TOTALLY AMOUNT</div>
              <Vue3autocounter
                class="auto-counter"
                :startAmount="0"
                :endAmount="90"
                :duration="3"
                separator=","
                :autoinit="true"
              />
              <div class="unit">家</div>
            </div>
          </div>
          <div class="title">合作游戏平台</div>
          <div class="title-en">Cooperative Gaming Platform</div>
        </div>
      </div> -->
      <div class="bot-container" data-aos="fade-up">
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" src="../../assets/home/service/circle-bg.png" />
                <img class="icon" src="../../assets/home/service/security.png" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">{{ $t("home.networkSecurity") }}</div>
              <div class="desc">
                <span>{{ $t("home.networkSecurityPt1") }}</span>
                <span>{{ $t("home.networkSecurityPt2") }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" src="../../assets/home/service/circle-bg.png" />
                <img class="icon" src="../../assets/home/service/trust.png" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">{{ $t("home.trustWorthy") }}</div>
              <div class="desc">
                <span>{{ $t("home.trustWorthyPt1") }}</span>
                <span>{{ $t("home.trustWorthyPt2") }}</span>
                <span>{{ $t("home.trustWorthyPt3") }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" src="../../assets/home/service/circle-bg.png" />
                <img class="icon" src="../../assets/home/service/service.png" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">{{ $t("home.productService") }}</div>
              <div class="desc">
                <span>{{ $t("home.productServicePt1") }}</span>
                <span>{{ $t("home.productServicePt2") }}</span>
                <span>{{ $t("home.productServicePt3") }}</span>
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
import HomeTitle from "@/atoms/HomeTitle.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

onMounted(() => {});
</script>

<style scoped lang="scss">
.service-section {
  width: 100%;
  max-width: 1300px;
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
          background-image: url("../../assets/home/blue-circle.png");
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
            border-radius: 50%;
            border: 3px solid #fff;
            background: linear-gradient(180deg, #fafcff 31.57%, #e3eaf8 54.21%, rgba(202, 211, 239, 0) 100%);
            box-shadow: 0px 4px 20px 0px rgba(255, 255, 255, 0.94) inset;

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
              font-weight: 600;
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
          color: #44484b;
          text-align: center;
          font-family: PingFang SC;
          font-size: 1.125rem;
          font-weight: 400;
          line-height: normal;
        }

        .title-en {
          color: #44484b;
          text-align: center;
          font-family: PingFang SC;
          font-size: 0.75rem;
          font-weight: 400;
          line-height: normal;
        }
      }
    }

    .bot-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1.5rem;

      .item-wrapper {
        border-radius: 1.25rem;
        background: #ffffff;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.22);
        padding: 0.5rem;
        width: calc((100% - 4rem) / 3);

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.8125rem;
          border: 1px solid #5c9fff;
          padding: 2rem;
          gap: 16px;

          .left-container {
            .circle-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;

              .circle {
                width: 5.5rem;
              }

              .icon {
                position: absolute;
              }
            }
          }

          .right-container {
            .title {
              color: #444444;
              font-size: 20px;
              margin-bottom: 5px;
              font-weight: 600;
            }
            .desc {
              color: #444444;
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
