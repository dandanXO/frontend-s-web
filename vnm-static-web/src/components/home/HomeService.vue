<template>
  <div class="service-section">
    <HomeTitle title="TF88 Service"></HomeTitle>
    <div class="service-container">
      <div class="bot-container" data-aos="fade-up">
        <div class="item-wrapper">
          <div class="item">
            <div class="left-container">
              <div class="circle-wrapper">
                <img class="circle" src="../../assets/home/service/circle-bg.png" />
                <img class="icon" src="../../assets/home/service/security.png" alt="Network security" />
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
                <img class="icon" src="../../assets/home/service/trust.png" alt="Trustworthy" />
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
                <img class="icon" src="../../assets/home/service/service.png" alt="Product Service" />
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

onMounted(() => { });
</script>

<style scoped lang="scss">
.service-section {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  font-family: 'Be Vietnam Pro', sans-serif;

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
        height: 210px;
        flex: 1;

        .item {
          align-items: center;
          justify-content: space-evenly;
          border-radius: 0.8125rem;
          border: 1px solid #5c9fff;
          height: 100%;
          display: grid;
          grid-template-columns: 0.3fr 0.7fr;

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
