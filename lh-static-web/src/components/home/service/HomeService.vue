<template>
  <div class="service-section">
    <!-- <HomeTitle title="优质服务" subtitle="EXCELLENT SERVICE"></HomeTitle> -->
    <HomeTitleV2 title="优质服务?" subtitle="EXCELLENT SERVICE"/>
    <div class="service-container">
      <div class="top-container" data-aos="fade-down">
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <div class="type">CURRENT SPEED</div>
              <Vue3Autocounter
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
              <Vue3Autocounter
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
              <Vue3Autocounter
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
              <Vue3Autocounter
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
      </div>
      <div class="bot-container" data-aos="fade-up">
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/deposit.png" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">极速存取转款</div>
              <div class="desc">
                最新技术自主研发的财务处理系统真正做到极速存、取、转 独家网络优化技术,为您提供一流的游戏体验,
                最大优化网络延迟。
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/category.png" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">海量赛事种类</div>
              <div class="desc">
                每天为您提供近干场精彩体育赛事,更有真人、彩票、 电子游戏等多种娱乐方式选择,让您拥有完美游戏体验。
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/security.png" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">加密安全管理</div>
              <div class="desc">
                独家开发,采用128位加密技术和严格的安全管理体系, 客户资金得到最完善的保障,让您全情尽享娱乐、赛事投注、
                无后顾之忧!
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" :src="loadCircleBg()" />
                <img class="icon" src="../../../assets/home/service/mobile.png" />
              </div>
            </div>
            <div class="right-container">
              <div class="title">三端任您选择</div>
              <div class="desc">
                引领市场的卓越技术,自主研发了全套终端应用,让您 随时随地,娱乐投注随心所欲! 7x24小时在线客服提供
                最贴心、最优质的服务。
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
import HomeTitleV2 from "@/atoms/HomeTitleV2.vue";
import Vue3Autocounter  from "vue3-autocounter";
import { useDark } from "@vueuse/core";

const isDark = useDark();

const loadCircleBg = () => {
  return isDark.value
    ? require("../../../assets/home/service/circle-bg-dark.png")
    : require("../../../assets/home/service/circle-bg.png");
};

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
          background-image: url("../../../assets/home/blue-circle.png");
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
        background: #eef8ff;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.22);
        padding: 0.5rem;
        width: calc((100% - 2rem) / 2);

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
                width: 7.5rem;
              }

              .icon {
                height: 80px;
                width: 80px;
                position: absolute;
              }
            }
          }

          .right-container {
            .title {
              color: #7a80a1;
              font-size: 20px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .desc {
              color: #a4aabb;
            }
          }
        }
      }
    }
  }
}

.dark {
  .service-section {
    .service-container {
      .top-container {
        .counter {
          .circle {
            background-image: url("@/assets/home/blue-circle-dark.png");

            .inner-circle {
              background: #14110d;
              box-shadow: 0px 4px 20px 0px #0a4479f0 inset;

              .type {
                color: #dce6f1;
              }
              .auto-counter {
                background: linear-gradient(180deg, #b1ecff 0%, #3ebdf3 100%);
                background-clip: text;
                -webkit-text-stroke-width: 0;
              }
              .unit {
                color: $font-3-dark;
              }
            }
          }

          .title,
          .title-en {
            color: $font-3-dark;
          }
        }
      }

      .bot-container {
        .item-wrapper {
          @include content-block-dark;

          .item {
            .right-container {
              .title {
                color: $active-color-dark;
              }
              .desc {
                color: $font-3-dark;
              }
            }
          }
        }
      }
    }
  }
}
</style>
