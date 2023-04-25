<template>
  <div class="promo-container">
    <div class="banner-container">
      <img src="../assets/images/promotion/banner.jpg">
      <!-- <div class="btn-wrapper">
        <div class="center">
          <div class="page-headline">Daily</div>
          <div class="page-subline">Deposit 10%</div>
          <div class="page-blend">UP TO <span class="pesos">₱</span>5,000</div>
          <div class="page-liner">
            Araw-araw na 10% deposito, hanggang 5,000 pesos
          </div>
        </div>
      </div> -->
    </div>
    <div class="hot-promo">
      <HotPromotion :list="[{ name: '122'}]" />
    </div>
    <div class="promo-view-container">
      Other promo details
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import {RiFunctionLine} from 'vue-remix-icons'
import { loadPromo } from "@/api/index/promo.js";
import HotPromotion from '@/components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
    RiFunctionLine,
    HotPromotion
  },
  setup() {
    const route = useRoute();
    onMounted(() => {
      console.log(route.params)
    });
    return {
    }
  },
});
</script>

<style scoped lang="scss">
.promo-container {
  padding-bottom: 80px;
  background: linear-gradient(to bottom, #23263c, #190f25);

  min-height: 70vh;
  color: #ffffff;
  .banner-container {
    font-size: 30px;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    .btn-wrapper {
      width: 95%;
      max-width: 1400px;
      margin: auto;
      position: relative;
      text-align: right;
      display: flex;
      justify-content: flex-end;

      .center {
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 52%;
        color: #ffffff;
        .page-headline {
          font-size: 150px;
          line-height: 150px;
          font-family: Wave;
        }
        .page-subline {
          font-size: 60px;
          line-height: 60px;
          margin-bottom: 10px;
          font-family: Wave;
        }
        .page-blend {
          background-image: linear-gradient(to right, #de4545, #db7e42);
          font-family: Wave;
          color: #ffffff;
          font-size: 60px;
          line-height: 60px;
          padding: 15px;
          border-radius: 20px;
          margin-bottom: 10px;
          .pesos {
            font-family: sans-serif;
            font-weight: bold;
          }
        }
        .page-liner {
          font-size: 20px;
          text-transform: none;
        }
        img {
          max-width: unset;
        }
        .common-btn.getnow {
          background: #ffffff;
          color: #000000;
          border: transparent;
          &:hover {
            background: #ffd800;
          }
        }
      }
    }
  }
  .promo-main-container {
    max-width: 1400px;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    .promo-type-wrapper {
      display: flex;
      justify-content: center;
      // border-bottom: 4px solid rgb(255 255 255 / 15%);
      .type-list {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        overflow: hidden;
        gap: 20px;
        padding: 30px;
        .type-item {
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 20px;
          background: #2b2b4b;
          box-shadow: 0 0 10px -3px #000000;
          white-space: nowrap;
          svg {
            width: 20px;
            fill: white;
            display: block;
          }
          img {
            max-height: 20px;
            filter: grayscale(1);
          }
          &.active,
          &:hover {
            background: #4b4e66;
            box-shadow: 0 0 5px #ffffff;
            img {
              filter: grayscale(0);
            }
          }
        }
      }
      //   display: flex;
      //   align-items: center;
      //   gap: 10px;
      //   overflow-x: auto;
      //   padding-bottom: 20px;
      //   .type-item {
      //   font-size:15px;
      //   line-height: 20px;
      //     cursor: pointer;
      //     white-space: nowrap;
      //     padding: 10px 28px;
      //     border-radius: 30px;
      //     background-image: linear-gradient(to right, #4c4c4c, #858585);
      //     // &.active {
      //     //   color: $color-primary-active;
      //     //   border-bottom: 4px solid #1bcef1;
      //     //   margin-bottom: -1px;
      //     // }
      //     svg {
      //       width: 20px;
      //       display: block;
      //       fill: #ffffff;
      //     }
      //     img {
      //       filter: grayscale(1);
      //       max-height: 30px;
      //     }
      //     &.active {
      //       // color: #db7e42;
      //       // */
      //       background-image: linear-gradient(to right, #de4545, #db7e42);

      //       img {
      //         filter: grayscale(0);
      //       }
      //       svg {
      //         // fill: #db7e42;
      //       }

      //       // border-bottom: 4px solid #db7e42;
      //     }
      //   }
      // }
    }
    .promo-list-wrapper {
      margin-top: 30px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 18px;
      .promo-item {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          transition: all 0.5s ease;
          &:hover {
            transform: scale(1.2);
          }
        }
        cursor: pointer;

        .promo-img-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 10px 10px 0 0;

          .promo-img {
            // position: absolute;
            // left: 0;
            // top: 0;
            width: 100%;
            height: 100%;
          }
        }
        .promo-info {
          // position: absolute;
          text-align: right;
          border-radius: 0 0 10px 10px;

          left: 0;
          bottom: 0;
          width: 100%;
          background-color: #23263c;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .viewdetail {
            padding: 15px;
          }
          .detail-arrow {
            margin-right: 20px;
            height: 100%;
          }
          // .detail-arrow {
          //   border-top: 10px solid transparent;
          //   border-bottom: 10px solid transparent;
          //   border-left: 20px solid #1bcef1;
          //   display: inline-block;
          //   margin-bottom: -4px;
          //   margin-left: 30px;
          // }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .promo-container {
    .banner-container {
      background-position: 30% 50%;
      .btn-wrapper {
        .center {
          max-width: 200px;
          width: 100%;
          .page-headline {
            font-size: 5rem;
            line-height: 5rem;
          }
          .page-blend {
            font-size: 1.7rem;
            line-height: 1.7rem;
            padding: 10px;
          }
          .page-subline {
            font-size: 2rem;
            line-height: 2rem;
          }
          .page-liner {
            font-size: 0.7rem;
            line-height: 1rem;
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .promo-container {
    padding-bottom: 60px;
    min-height: 100vh;
    .web-only-box {
      display: none;
    }
    // .banner-container {
    //   font-size: 1rem;
    //   padding: 130px 0;
    //   background-size: cover;
    //   // height: 10rem;
    //   height: unset;
    //   background-image: url("../assets/images/promotion/banner-mob.png");
    //   background-position: center center;
    //   .title-container {
    //     width: 100%;
    //     &.large {
    //       padding: 0;
    //       .game-title {
    //         font-size: 2.4rem;
    //         &:before {
    //           display: none;
    //         }
    //         &:after {
    //           display: none;
    //         }
    //       }
    //     }
    //   }
    // }
    .promo-main-container {
      width: 95%;
      .promo-type-wrapper {
        .type-list {
          font-size: 14px;
          .type-item {
          }
        }
      }
      .promo-list-wrapper {
        margin-top: 20px;
        grid-template-columns: 1fr;
        .promo-item {
          width: 100%;
          // height: 140px;
          .promo-info {
            height: 40px;
            padding-left: 40px;
            line-height: 40px;
          }
          .promo-img {
            width: 100%;
            height: unset;
          }
        }
      }
    }
  }
}
</style>
