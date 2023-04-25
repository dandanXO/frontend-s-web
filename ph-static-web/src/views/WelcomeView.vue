<template>
  <div class="welcome-page">
    <div class="promotionlist">
      <span v-for="i in 4" :key="i">
        <img
          @click="checkPromo(i)"
          :src="require(`../assets/images/welcome/promo-${i}.png`)"
        />
      </span>
    </div>
    <router-link to="/register"> Register </router-link>
    <div class="logo">
      <img src="../assets/images/welcome/logo.png" />
    </div>
    <div class="slogan">
      www.jolly88.com &nbsp; | &nbsp; Casino Online and Slot Game Betting
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
    const checkPromo = (promo) => {
      if (promo === 1) {
        promoId.value = 29;
      }
      if (promo === 2) {
        promoId.value = 28;
      }
      if (promo === 3) {
        promoId.value = 31;
      }
      if (promo === 4) {
        promoId.value = 30;
      }
      router.push(`/promotion?id=${promoId.value}`);
    };
    return {
      router,
      checkPromo,
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
  background: url("../assets/images/welcome/welcome-bg.png") no-repeat center
    center;
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  .promotionlist {
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    display: flex;
    padding: 140px 20px 0;
    img {
      width: 100%;
      cursor: pointer;
    }
  }
  a {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../assets/images/welcome/button.png") no-repeat center
      center;
    background-size: cover;
    color: #000000;
    font-size: 35px;
    line-height: 77px;
    max-width: 300px;
    margin: 50px auto;
    padding-bottom: 15px;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 700px;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  .slogan {
    color: #ffffff;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 30px;
    text-align: center;
    margin: 30px 0 140px;
  }
}
@media (max-width: 768px) {
  .welcome-page {
    background: url("../assets/images/welcome/welcome-bg-h5.png") no-repeat
      center center;
    background-size: cover;
    .promotionlist {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding-top: 160px;
      grid-gap: 10px;
    }
    a {
      margin: 20px auto;
    }
    .logo {
      max-width: 400px;
      position: absolute;
      top: 25px;
      left: 25px;
      right: 25px;
    }
    .slogan {
      font-size: 20px;
      margin: 0 0 140px;
    }
  }
}
</style>
