<template>
  <div class="service-section">
    <!-- <HomeTitle title="优质服务" subtitle="EXCELLENT SERVICE"></HomeTitle> -->
    <div class="service-container">
      <div class="top-container" data-aos="fade-down">
        <div class="counter">
          <div class="circle">
            <div class="inner-circle">
              <div class="type">CURRENT SPEED</div>
              <div class="count-circle"></div>
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
              <div class="count-circle" style="border-right-color: transparent;"></div>
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
              <div class="count-circle" style="border-top-color: transparent;border-bottom-color: transparent;border-right-color: transparent;"></div>
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
              <div class="count-circle"></div>
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
                <img src="@/assets/home/service-1.png">
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
                <img src="@/assets/home/service-2.png">
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
                
                <img src="@/assets/home/service-3.png">
                
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
                
                
                <img src="@/assets/home/service-4.png">
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
import Vue3Autocounter  from "vue3-autocounter";

onMounted(() => {});
</script>

<style scoped lang="scss">
.count-circle {
  width: 125px;
  height: 125px;
  border: 5px solid transparent;
  border-top-color: #32CEED;
  border-left-color: #32CEED; 
  border-right-color: #32CEED; 
  border-radius: 50%; 
  transform: rotate(-45deg);
  position: absolute;
  box-sizing: border-box;
  animation: spin-circle 3s ease-out forwards;
}
@keyframes spin-circle {
  0% {
    border-bottom-color: transparent;
    border-left-color: transparent;
    transform: rotate(0deg);
  }
  75% {
    border-bottom-color: #32CEED;
    border-left-color: #32CEED;
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
          // background-image: url("../../assets/home/blue-circle.png");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100% 100%;
          //box-shadow: 0px 4px 20px 0px rgba(255, 255, 255, 0.88) inset;
          // margin: 0 0 2rem 0;

          .inner-circle {
            width: 9rem;
            height: 9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            // background: linear-gradient(180deg, #fafcff 31.57%, #e3eaf8 54.21%, rgba(202, 211, 239, 0) 100%);
            background: url(@/assets/home/svccirclebg.png)no-repeat center center;
            background-size: cover;
            .type {
              color: #333;
              text-align: center;
              font-family: "PingFang SC";
              font-size: 0.71319rem;
              display: none;
            }

            .auto-counter {
              // filter: drop-shadow(0px 2px #c4effa);
              // font-family: FZHanZhenGuangBiaoS-GB;
              // font-size: 2.82869rem;
              // font-weight: 600;
              // line-height: normal;
              // letter-spacing: 0.14144rem;
              // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
              // background-clip: text;
              // -webkit-background-clip: text;
              // -webkit-text-fill-color: transparent;
              // -webkit-text-stroke-width: 0.1px;
              // -webkit-text-stroke-color: white;
              font-family: Arial;
              font-size: 46.25px;
              font-weight: 500;
              color: #32CEED;
            }

            .unit {
              color: #32CEED;
              text-align: center;
              font-family: PingFang SC;
              font-size: 1rem;
              font-weight: 400;
              line-height: normal;
              margin-top: 15px;
            }
          }
        }

        .title {
          color: #B8B8B8;
          text-align: center;
          font-family: PingFang SC;
          font-size: 18px;
          font-weight: 500;
        }

        .title-en {
          color: #ADADAD;
          text-align: center;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .bot-container {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      align-items: stretch;
      font-size: "PingFang SC";

      .item-wrapper {
        border-radius: 1.25rem;
        background: #1A2338;
        margin-bottom: 80px;
        flex: 1;
        // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.22);
        // padding: 0.5rem;
        // width: calc((100% - 2rem) / 2);

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 2rem;
          gap: 16px;
          text-align: center;
          img {
            width: 80px;
          }

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
                position: absolute;
              }
            }
          }

          .right-container {
            .title {
              color: #FFFFFF;
              font-size: 20px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .desc {
              text-align: justify;
              line-height: 24px;
              font-size: 14px;
              color: #B8B8B8;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}

</style>
