<template>
  <div class="welcome-page">
    <!--    <div class="logo">-->
    <!--    </div>-->
    <!--    <div class="promotionlist">-->
    <!--      <span v-for="i in 4" :key="i">-->
    <!--      <img @click="checkPromo(i)" :src="require(`../assets/welcome/promo-${i}.png`)">-->
    <!--      </span>-->
    <!--    </div>-->
    <!--    <router-link to="/register">-->
    <!--      สมัคร-->
    <!--    </router-link>-->
    <!--    <div class="slogan">-->
    <!--      www.jolly88.com &nbsp; | &nbsp; Casino Online and Slot Game Betting-->
    <!--    </div>-->
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
      router.push(`/promo?id=${promoId.value}`);
    };
    return {
      router,
      checkPromo
    };
  }
});
</script>

<style scoped lang="scss">
.welcome-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-size: cover;
  min-height: 100%;
  width: 100%;
  padding: 50px 0;
  .promotionlist {
    justify-content: center;
    align-items: center;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    padding: 40px 20px 0;
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
    background-size: cover;
    color: #000000;
    font-size: 35px;
    line-height: 77px;
    max-width: 300px;
    margin: 20px auto;
    padding-bottom: 15px;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 400px;
    img {
      width: 100%;
    }
  }
  .slogan {
    color: #ffffff;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
    margin: 0 10px 60px;
  }
}
</style>
