<template>
  <div class="welcome-page">
    <div class="logo">
      <img src="../assets/welcome/logo.png">
    </div>
    <div class="promotionlist">
      <span v-for="(promo, i) in promoList" :key="i">
        <img
          @click="checkPromo(promo.promoImg)"
          :src="require(`../assets/welcome/promo-${promo.promoImg}.png`)"
        />
      </span>
    </div>
    <router-link to="/register"> สมัคร </router-link>
    <div class="slogan">
      www.Jolly88.com &nbsp; | &nbsp; Casino Online and Slot Game Betting
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const promoId = ref(null);
    const promoList = ref([
      {
        promoImg: 1,
        promoId: 29,
      },
      {
        promoImg: 2,
        promoId: 28,
      },
      {
        promoImg: 3,
        promoId: 31,
      },
      {
        promoImg: 8,
        promoId: 47,
      },
      {
        promoImg: 7,
        promoId: 50,
      },
      {
        promoImg: 4,
        promoId: 30,
      },
      {
        promoImg: 5,
        promoId: 48,
      },
      {
        promoImg: 6,
        promoId: 46,
      },
    ]);
    const checkPromo = (promo) => {
      promoList.value.forEach((el) => {
        if (promo === el.promoImg) {
          promoId.value = el.promoId
          router.push(`/promo?id=${promoId.value}`);
        }
      });
    };
    return {
      router,
      checkPromo,
      promoList,
    };
  },
});
</script>

<style scoped lang="scss">
  .welcome-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('../assets/welcome/welcome-bg-h5.png')no-repeat center center;
    background-size: cover;
    min-height: 100vh;
    width: 100%;
    padding: 20px 0;
    .promotionlist {
      justify-content: center;
      align-items: center;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: 33.3% 33.3% 33.3%;
      img {
        width: 100%;
        cursor: pointer;
      }
      span {
        &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(6), &:nth-child(7), &:nth-child(8) {
          grid-column: span 2;
        }
        &:nth-child(4), &:nth-child(5) { /* the last 4 boxes */
          grid-column: span 3;
          img {
            width: 75%
          }
        }

        &:nth-child(4) {
          text-align: right;
          img {
            width: 65%;
            margin-top: -5px;
          }
        }
      }
    }
    a {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url('../assets/welcome/button.png')no-repeat center center;
      background-size: cover;
      color: #000000;
      font-size: 20px;
      line-height: 40px;
      max-width: 180px;
      margin: 10px auto;
      padding-bottom: 8px;
    }
    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 240px;
      width: 80%;
      margin-bottom: 30px;
      img {
        width: 100%;
      }
    }
    .slogan {
      color: #ffffff;
      text-transform: uppercase;
      font-weight: bold;
      text-align: center;
        font-size: 10px;
        // margin: 0 10px 60px;
    }
  }
</style>
