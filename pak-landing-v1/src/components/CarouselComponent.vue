<template>
  <div class="carousel-component" :style="{ margin: margin }">
    <q-carousel
      v-model="slide"
      transition-prev="jump-right"
      transition-next="jump-left"
      swipeable
      animated
      infinite
      :autoplay="autoplay"
      class="text-white rounded-borders"
      :class="{ bg: hasBg }"
      @transition="checkAutoplay"
    >
      <q-carousel-slide
        v-for="(carouselItem, i) in carouselData"
        :key="carouselItem.id"
        :name="i"
        class="column no-wrap flex-center"
      >
        <div
          v-if="
            carouselItem.media.data?.attributes &&
            carouselItem.media.data.attributes.ext === '.mp4'
          "
          class="video-container"
          :class="{ 'min-height': carouselData.length > 1 }"
        >
          <video
            ref="carouselVideo"
            style="width: 100%"
            controls
            autoplay
            @play="autoplay = false"
            @pause="autoplay = 5000"
          >
            <source
              :src="`${BASE_STRAPI_URL}${carouselItem.media.data.attributes.url}`"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div
          v-if="
            carouselItem.media.data?.attributes &&
            (carouselItem.media.data.attributes.ext === '.jpg' ||
              carouselItem.media.data.attributes.ext === '.png')
          "
          class="carousel-media"
          :style="{
            backgroundImage: `url(${BASE_STRAPI_URL}${carouselItem.media.data.attributes.url})`,
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
        <div class="carousel-description q-pt-xs q-pl-xs q-pr-xs">
          <span>{{ carouselItem.description }}</span>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div
      v-if="carouselData.length > 1"
      class="carousel-nav"
      :class="{ bg: hasBg }"
    >
      <span
        v-for="(carouselItem, i) in carouselData"
        :key="i"
        :class="['dot', { active: slide == i }]"
        @click="onCarouselNavDotClick(i)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { BASE_STRAPI_URL } from "src/constants/constants";

const props = defineProps(["carouselData", "hasBg", "margin"]);
const slide = ref(0);
const carouselVideo = ref(null);
const autoplay = ref(false);

const onCarouselNavDotClick = (i) => {
  if (slide.value != i) {
    slide.value = i;
  }
};

onMounted(() => {
  if (props.carouselData.length > 1) {
    checkAutoplay();
  }
});

const checkAutoplay = () => {
  setTimeout(() => {
    if (carouselVideo.value && carouselVideo.value[0]) {
      autoplay.value = carouselVideo.value[0].paused ? 5000 : false;
    } else {
      autoplay.value = 5000;
    }
  }, "1000");
};
</script>

<style scoped lang="scss">
.carousel-component {
  display: flex;
  flex-direction: column;
  margin: 12px;
}

.video-container {
  width: 100%;
  min-height: 170px;
  &.min-height {
    min-height: 200px;
  }
}

.carousel-media {
  width: 100%;
  height: 0;
  max-height: 200px;
  background-size: cover;
  background-position: center center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-repeat: no-repeat;
  padding-bottom: 63.47%;
  iframe {
    border-radius: 8px;
  }
}

.carousel-description {
  overflow-wrap: anywhere;
  text-align: center;
  font-weight: 500;
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
