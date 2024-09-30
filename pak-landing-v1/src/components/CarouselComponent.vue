<template>
  <div class="carousel-component">
    <q-carousel
      v-model="slide"
      transition-prev="jump-right"
      transition-next="jump-left"
      swipeable
      animated
      class="text-white rounded-borders"
      :class="{ bg: hasBg }"
    >
      <q-carousel-slide
        v-for="(carouselItem, i) in carouselData"
        :key="carouselItem.id"
        :name="i"
        class="column no-wrap flex-center"
      >
        <div
          v-if="carouselItem.media"
          class="carousel-media"
          :style="{
            backgroundImage: `url(${carouselItem.media.url})`,
          }"
        ></div>
        <div v-else-if="carouselItem.videoUrl" class="carousel-media">
          <iframe
            :src="carouselItem?.videoUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="carousel-description q-pt-xs q-pl-md q-pr-md">
          <span>{{ carouselItem.description }}</span>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div class="carousel-nav" :class="{ bg: hasBg }">
      <span
        v-for="(carouselItem, i) in carouselData"
        :key="i"
        :class="['dot', { active: slide === i }]"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["carouselData", "hasBg"]);
const slide = ref(0);
</script>

<style scoped lang="scss">
.carousel-component {
  display: flex;
  flex-direction: column;
  margin: 12px;
}

.carousel-media {
  width: 270px;
  height: 180px;
  background-size: cover;
  background-position: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  iframe {
    border-radius: 8px;
  }
}

.carousel-description {
  overflow-wrap: anywhere;
  text-align: center;
}

.q-carousel {
  background-color: #131313;
  height: auto;
  &.bg {
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
  }
}

.carousel-nav {
  align-self: center;
  &.bg {
    bottom: -22px;
  }
}

.dot {
  height: 7px;
  width: 7px;
  margin: 0 5px;
  background-color: #6e6e6e;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.dot.active {
  background: linear-gradient(180deg, #13a89e 0%, #8cc63f 100%);
}

.q-carousel__slide,
.q-carousel .q-carousel--padding {
  padding: 8px;
}
</style>
