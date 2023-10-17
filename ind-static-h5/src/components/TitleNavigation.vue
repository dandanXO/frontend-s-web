<template>
  <q-card-section class="page-title-container">
    <img class="back-btn" src="../assets/images/index/back-btn.png" alt="" @click="backButton()" />
    <div class="page-title-wrapper">
      <img src="../assets/images/index/hot-elephant-left.png" alt="" />
      <div class="title-container">
        <span class="title">{{ title }}</span>
      </div>
      <img src="../assets/images/index/hot-elephant-right.png" alt="" />
    </div>
  </q-card-section>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps(["title"]);

const router = useRouter();
const backButton = () => {
  router.push("/");
};
</script>

<style lang="scss">
.page-title-container {
  display: flex;
  align-items: center;
  background: transparent;
  padding: 1rem;

  .back-btn {
    width: 2.25rem;
  }

  .page-title-wrapper {
    display: flex;
    justify-content: center;
    margin: 0 0 0 2.75rem;

    img {
      width: 2.25rem;
    }

    .title-container {
      background-image: url(../assets/images/index/hot-games-title.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14rem;
      margin: 0 0.5rem;

      .title {
        background-color: #f3ec78;
        background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
        background-size: 100%;
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-text-fill-color: transparent;
        line-height: 1.25;
        font-size: 1.25rem;
        font-weight: 800;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #a94700;
      }
    }

    svg {
      width: 250px;
    }
  }
}
</style>
