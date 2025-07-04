<template>
    <div class="service-section">
      <!-- <HomeTitle title="优质服务" subtitle="EXCELLENT SERVICE"></HomeTitle> -->
      <!-- <HomeTitleV2 title="优质服务" subtitle="EXCELLENT SERVICE"/> -->
      <div class="service-container">
        <div  data-aos="fade-down">
          <img style="display:flex;margin:auto;width:850px;" src="../../../assets//home/service/excellent-service-title-dark.png" />
          <div class="top-container">
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
                  <div class="unit">秒</div>
                </div>
              </div>
              <div class="title">平均存款时间</div>
              <div class="title-en">Average Time To Deposit</div>
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
                  <div class="unit">家</div>
                </div>
              </div>
              <div class="title">合作支付平台</div>
              <div class="title-en">Cooperative Payment Platform</div>
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
                  <div class="unit">秒</div>
                </div>
              </div>
              <div class="title">平均取款时间</div>
              <div class="title-en">Average time To Withdraw</div>
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
                  <div class="unit">家</div>
                </div>
              </div>
              <div class="title">合作游戏平台</div>
              <div class="title-en">Cooperative Gaming Platform</div>
            </div>
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
    margin-top: -50px;

    .service-container {
      margin: 0;

      .top-container {
        display: flex;
        justify-content: center;
        padding: 0 6rem;
        margin: 0;
        gap: 40px;

        .counter {
          .circle {
            width: 13rem;
            height: 13rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url("../../../assets/home/blue-circle.png");
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
            margin: 0 0 .5rem 0;

            .inner-circle {
              width: 19rem;
              height: 17rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: linear-gradient(180deg, #fafcff 31.57%, #e3eaf8 54.21%, rgba(202, 211, 239, 0) 100%);
              box-shadow: 0px 4px 20px 0px rgba(255, 255, 255, 0.94) inset;

              .type {
                color: #333;
                text-align: center;
                font-family: "PingFang SC";
                font-size: 0.71319rem;
              }

              .auto-counter {
                // filter: drop-shadow(0px 2px #c4effa);
                font-family: serif;
                font-size: 3rem;
                font-weight: 600;
                line-height: normal;
                letter-spacing: 0.14144rem;
                color: #fff;
                line-height: 50px;
                letter-spacing: 0.04em;

                // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
                // background-clip: text;
                // -webkit-background-clip: text;
                // -webkit-text-fill-color: transparent;
                // -webkit-text-stroke-width: 0.1px;
                // -webkit-text-stroke-color: white;
              }

              .unit {
                font-family: 'PingFang SC';
                font-size: 18px;
                font-weight: 400;
                line-height: 25.2px;
                letter-spacing: 0.04em;
                text-align: center;

              }
            }
          }

          .title {
            color: #fff;
            font-family: 'PingFang SC';
            font-size: 18px;
            font-weight: 400;
            line-height: 30.8px;
            letter-spacing: 0.04em;
            text-align: center;

          }

          .title-en {
            color: #fff;
            font-family: 'PingFang SC';
            font-size: 13px;
            font-weight: 400;
            line-height: 22.4px;
            text-align: center;

          }
        }
      }

      .bot-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .item-wrapper {
          background: #eef8ff;
          padding: 0.5rem;
          width: calc((100% - 2rem) / 2);

          .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0px 10px;
            gap: 5px;

            .left-container {
              .circle-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .circle {
                  width: 100px;
                  visibility: hidden;
                }

                .icon {
                  position: absolute;
                }
              }
            }

            .right-container {
              .title {
                color: #fff;
                margin-bottom: 10px;
                font-family: "PingFang SC";
                font-size: 20px;
                font-weight: 500;
                line-height: 33.6px;
                text-align: center;

              }
              .desc {
                color: #fff;
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                letter-spacing: 0.03em;
                text-align: left;

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
                background: none;
                box-shadow: none;
                border: none;

                .type {
                  color: #dce6f1;
                }
                .auto-counter {
                //   background: linear-gradient(180deg, #b1ecff 0%, #3ebdf3 100%);
                //   background-clip: text;
                //   -webkit-text-stroke-width: 0;
                }
                .unit {
                  color: #fff;
                }
              }
            }

            .title,
            .title-en {
              color: #fff;
            }
          }
        }

        .bot-container {
          .item-wrapper {
            // @include content-block-dark;
            background: url("../../../assets/home/service/bg.png") no-repeat center center;
            background-size: 100% 100%;
            width: 250px;
            height: 365px;
            padding: 40px;
          }
        }
      }
    }
  }
  </style>
