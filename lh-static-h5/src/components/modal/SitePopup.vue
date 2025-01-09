<template>
  <q-dialog v-model="displayPopup" width="100%" @hide="setExpiryBanner">
    <div class="popup-container">
      <div class="popup-title">
        <img src="../../assets/images/home/site-popup/title.png" />
      </div>

      <q-carousel
        v-model="slide"
        ref="carouselRef"
        class="popup-carousel"
        transition-prev="slide-right"
        transition-next="slide-left"
        animated
        swipeable
        infinite
      >
        <q-carousel-slide
          v-for="(item, index) in popupList"
          :key="index"
          :name="index"
          class="popup-carousel-slide"
          @click="clickHomePopupImg(item.path)"
        >
          <img class="popup-carousel-img" :src="`${imgURL}${item.mobileImgUrl}`" draggable="false" />
        </q-carousel-slide>
      </q-carousel>

      <div class="popup-info">
        <span class="popup-info-title">{{ currentPopup?.title }}</span>
        <br />
        <span class="popup-info-time">
          {{ moment(currentPopup?.displayStartTime).format("YYYY.MM.DD") }}
          {{ moment(currentPopup?.displayEndTime).format("YYYY.MM.DD") }}
        </span>
      </div>

      <div class="popup-navigation">
        <template v-for="(_, index) in popupList" :key="index">
          <div v-if="index === slide" class="popup-navigation-dot active" />

          <div v-else class="popup-navigation-dot" @click="slide = index" />
        </template>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import { api } from "src/boot/axios";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const emit = defineEmits(["go-game"]);

const router = useRouter();

const displayPopup = ref(false);
const popupList = ref([]);
const swiperInterval = ref(null);
const slide = ref(0);
const carouselRef = ref();
const homePopupFrequencyNum = ref(0);

const currentPopup = computed(() => {
  return popupList.value[slide.value];
});

const clickHomePopupImg = (urlString) => {
  displayPopup.value = false;

  const openPattern = /^\/open\/(.*)/;
  if (urlString.match(openPattern)) {
    const extractedUrl = urlString.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");
    // /open/FB体育/FB/XXXX-123/OPEN

    emit("go-game", gameName, platformCode, gameCode, "OPEN");
    return;
  }

  let regexUrl = new RegExp(/^(https:\/\/)/g);
  if (regexUrl.test(urlString)) {
    // 跳轉
    location.href = urlString;
    return;
  }
  let regexName = new RegExp(/^(name|\?name)/g);
  if (regexName.test(urlString)) {
    //去優惠
    router.push(`/promo${urlString}`);
    return;
  }

  router.push(`/promo?name=${urlString}`);
};

const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const setExpiryBanner = () => {
  if (homePopupFrequencyNum.value !== 0) {
    setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
  }
};

const setWithExpiry = (key, value, interval) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + interval,
    id: popupList.value[0]?.id,
    frequency: popupList.value[0]?.frequency
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getPopups = () => {
  const siteType = "main";

  const lastTime = sessionStorage.getItem("indexImgTop");

  if (lastTime) {
    const diff = new Date().getTime() - Number(lastTime);
    if (diff > 1000 * 60 * 60 * 12) {
      isFirstView.value = true;
    }
  } else {
    api.get("/member/site-popout-list", { params: { siteType } }).then((res) => {
      if (res.code === 0) {
        popupList.value = res.data;
        const isImpt = getWithExpiry("isImpt");
        if (isImpt === null) {
          switch (res.data[0]["frequency"]) {
            case "EVERYTIME":
              homePopupFrequencyNum.value = 0;
              break;
            case "EVERYDAY":
              homePopupFrequencyNum.value = 86400000; // 24hrs
              break;
            case "SESSION":
              homePopupFrequencyNum.value = 7866432000; // 3months
              break;
            default:
              homePopupFrequencyNum.value = 10000;
              break;
          }
          displayPopup.value = true;
        }

        if (res.data.length > 0) {
          if (!swiperInterval.value) {
            swiperInterval.value = setInterval(() => {
              carouselRef.value.next();
            }, 3000);
          }
        }
      }
    });
  }
};

onMounted(() => {
  getPopups();
});
</script>
<style scoped lang="scss">
.popup-container {
  margin: 0 12px;
  background: url("../../assets/images/home/site-popup/popup-bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 16px 20px;
  width: 100%;
  max-width: 500px;

  .popup-title {
    width: 100%;
    padding: 8px 0;
    text-align: center;
    background-color: #e8f0fd;
    border-radius: 10px;
    margin-bottom: 8px;
    img {
      width: 33%;
      max-width: 100%;
    }
  }

  .popup-carousel {
    margin-bottom: 12px;
    max-width: 100%;
    aspect-ratio: 319 / 229;
    .popup-carousel-slide {
      padding: unset;
      .popup-carousel-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .popup-info {
    background-color: #fff;
    padding: 8px;
    margin-bottom: 12px;
    border: 1px solid #9dc4ff;
    .popup-info-title {
      line-height: 1.5rem;
      color: #2792fd;
    }
    .popup-info-time {
      color: #56586d;
      font-size: 0.75rem;
      line-height: 1rem;
    }
  }

  .popup-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 12px;
    .popup-navigation-dot {
      height: 4px;
      width: 12px;
      border-radius: 8px;
      background-color: #d9d9d9;
      &.active {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #2792fd;
      }
    }
  }
}
</style>
