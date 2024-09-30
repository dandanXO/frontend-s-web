<template>
  <div class="main-tab-container q-pl-md q-pr-md q-pb-md">
    <CarouselComponent :carousel-data="carouselTop"> </CarouselComponent>

    <div class="btn-container q-pb-lg q-pt-xs">
      <img alt="" src="~assets/imgs/yt_btn.png" />
      <img alt="" src="~assets/imgs/wa_btn.png" />
      <img alt="" src="~assets/imgs/tt_btn.png" />
      <img alt="" src="~assets/imgs/ig_btn.png" />
    </div>

    <div class="carousel-container">
      <CarouselComponent :carousel-data="carouselMid"> </CarouselComponent>
      <div class="q-pt-md">
        <CarouselComponent :carousel-data="carouselBtm" :has-bg="true">
        </CarouselComponent>
      </div>
    </div>

    <template v-if="galleryItems.length > 0">
      <div class="title q-pt-sm">Charitable Associations</div>
      <div class="subtitle q-pt-sm">CHARITY PROJECTS</div>
    </template>

    <div class="row q-col-gutter-md q-pt-md">
      <template
        v-for="(item, i) in Math.ceil(galleryItems.length / 2)"
        :key="i"
      >
        <div class="image-row col-6">
          <div class="image-container">
            <img
              v-if="galleryItems[i * 2]?.media"
              alt=""
              :src="galleryItems[i * 2]?.media.url"
            />
            <iframe
              v-else-if="galleryItems[i * 2]?.videoUrl"
              :src="galleryItems[i * 2]?.videoUrl"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div v-if="galleryItems[i * 2 + 1]" class="image-row col-6">
          <div class="image-container">
            <img
              v-if="galleryItems[i * 2 + 1].media"
              alt=""
              :src="galleryItems[i * 2 + 1].media.url"
            />
            <iframe
              v-else-if="galleryItems[i * 2 + 1]?.videoUrl"
              :src="galleryItems[i * 2 + 1]?.videoUrl"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div v-else class="image-row col-6"></div>

        <div class="description-row col-6">
          <span>{{ galleryItems[i * 2]?.description }}</span>
        </div>

        <div v-if="galleryItems[i * 2 + 1]" class="description-row col-6">
          <span>{{ galleryItems[i * 2 + 1].description }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import CarouselComponent from "src/components/CarouselComponent.vue";

const props = defineProps(["tabData"]);

const galleryItems = computed(() => {
  return props.tabData?.charityGallery ?? [];
});

const carouselTop = computed(() => {
  return props.tabData?.bannerTop ?? [];
});

const carouselMid = computed(() => {
  return props.tabData?.bannerMid ?? [];
});

const carouselBtm = computed(() => {
  return props.tabData?.bannerBtm ?? [];
});
</script>

<style scoped lang="scss">
.main-tab-container {
  padding-bottom: 72px;
}

.btn-container {
  display: flex;
  justify-content: space-evenly;
}

.carousel-container {
  border: 1px solid transparent;
  border-radius: 4px;
  background-image: linear-gradient(#131313, #131313),
    linear-gradient(180deg, #33b085 0%, #68bd5c 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.title {
  background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 4px;
  text-align: center;
}

.subtitle {
  color: #fff;
  opacity: 0.2;
  font-weight: 800;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 4px;
  text-align: center;
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
  }
  iframe {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
}

.image-row {
  display: flex;
  align-items: flex-end;
}

.description-row {
  display: flex;
  justify-content: center;
  padding-top: 4px;
  text-align: center;
  span {
    padding: 0 8px;
    overflow-wrap: anywhere;
  }
}
</style>
