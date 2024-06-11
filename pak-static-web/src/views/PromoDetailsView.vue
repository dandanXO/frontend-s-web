<template>
  <div class="promo-container">
    <div class="banner-container">
      <!-- <img src="../assets/images/promotion/banner.jpg" /> -->
    </div>
    <div class="hot-promo">
      <HotPromotion :list="[{ name: '122' }]" />
    </div>
    <div class="promo-view-container">Other promo details</div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import HotPromotion from '@/components/HotPromotion'
export default defineComponent({
  name: "PromoView",
  components: {
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
  min-height: 70vh;

  .banner-container {
    font-size: 30px;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    .btn-wrapper {
      width: 95%;
      max-width: $container-width;
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

        .page-headline {
          font-size: 150px;
          line-height: 150px;
        }
        .page-subline {
          font-size: 60px;
          line-height: 60px;
          margin-bottom: 10px;
        }
        .page-blend {
          background-image: linear-gradient(to right, #de4545, #db7e42);

          font-size: 60px;
          line-height: 60px;
          padding: 15px;
          border-radius: 20px;
          margin-bottom: 10px;
          .pesos {

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
    max-width: $container-width;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    .promo-type-wrapper {
      display: flex;
      justify-content: center;
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
          border-radius: 10px;

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
          display: none;

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
@media (max-width: 767px) {
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
@media (max-width: 767px) {
  .promo-container {
    padding-bottom: 60px;
    min-height: 100vh;
    .web-only-box {
      display: none;
    }
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
