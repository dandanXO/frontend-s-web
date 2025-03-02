<template>
  <div class="hotgames-carousel">
    <el-carousel height="400px" :interval="4000" :autoplay="false" :loop="true" :indicator-position="'none'">
      <el-carousel-item v-for="(page, index) in paginatedItems" :key="index">
        <div class="carousel-grid">
          <div
            @click="openGame(item.label, item.platformCode, item.code)"
            class="carousel-item"
            v-for="item in page"
            :key="item.id"
          >
            <div class="image-container">
              <img
                :src="`${imgURL}/game/${item.icon}` || defaultImage"
                alt="Item image"
                class="carousel-image"
                @error="onImageError"
              />
            </div>
            <div class="name-container">
              {{ item.name }}
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <GameModal ref="modalGame"></GameModal>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import defaultImage from "@/assets/images/games/aviator/default.png"; // Adjust path to your actual file
import { getHotPlatformGames } from "@/api/index/promo";
import { useLocalStorage } from "@vueuse/core";
import GameModal from "@/components/modal/GameModal";
const modalGame = ref(null);
const openGame = (gameName, code, gameCode) => {
  modalGame.value.open(gameName, code, gameCode);
};
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
const hotGamesList = ref([]);

const itemsPerPage = 10;

const paginatedItems = computed(() => {
  const pagesArray = [];
  for (let i = 0; i < hotGamesList.value.length; i += itemsPerPage) {
    pagesArray.push(hotGamesList.value.slice(i, i + itemsPerPage));
  }
  return pagesArray;
});
function onImageError(event) {
  event.target.src = defaultImage; // Replace with defaultImage if loading fails
}
onMounted(() => {
  getHotPlatformGames().then((res) => {
    if (res.code === 0) {
      hotGamesList.value = res.data;
    }
  });
});
</script>
<style lang="scss" scoped>
.hotgames-carousel {
  ::v-deep(.el-carousel__container) {
    margin: 0px 100px;
  }
  ::v-deep(.el-carousel__arrow) {
    width: 40px; /* Adjust arrow size */
    height: 40px;
    transform: translateY(-50%);
    top: 50%;
    background: transparent;
    border: 1px solid #b8b8b8;
    border-radius: 50%;
  }
  ::v-deep(.el-carousel__arrow--left) {
    left: -50px; /* Move left arrow outside */
  }

  ::v-deep(.el-carousel__arrow--right) {
    right: -50px; /* Move right arrow outside */
  }

  .el-carousel__arrow {
    font-size: 35px;
    background: transparent;
    border: 1px solid #b8b8b8;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    &--left,
    &--right {
      border-radius: 50%;
    }
  }
  margin-top: -100px;
  .carousel-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* Adjust for layout */
    grid-template-rows: repeat(2, 1fr); /* 5 columns, 2 rows = 10 items */
    gap: 50px; /* Optional spacing between items */
  }

  .carousel-item {
    background-color: #2d2d2e;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    flex-direction: column;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 40px;
    width: 100%;
    cursor: pointer;
    .image-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 16px;
    }
    img {
      max-height: 120px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    &:hover {
      filter: brightness(110%);
    }
    &:active {
      filter: brightness(90%);
    }
  }
}
</style>
