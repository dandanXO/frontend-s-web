<template>
  <div class="b9-style-container">
    <div v-if="!isLoading">
      <div
        v-for="item in arr"
        :key="item.id"
        class="row"
        @click="openUrl(item.url)"
      >
        <div class="col-3" :style="{ background: `url(${item.thumbnail})` }">
          <q-icon name="play_circle" class="pseudo-play-btn" />
        </div>

        <div class="txt-container col-9">
          <div class="txt title">{{ item.title }}</div>
          <!--          <div class="txt-item-wrap">-->
          <!--            <div class="txt description">-->
          <!--              {{ item.description }}-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="txt info">
            <div class="views">
              <q-icon name="visibility" />
              <span>{{ item.views }}</span>
            </div>
            <span class="time">{{ item.uploadTime }} ago</span>
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading v-else :showing="isLoading" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { strapi } from "boot/axios";

const rndUploadTime = [
  "3h 15m",
  "45m",
  "6h 2m",
  "12h 50m",
  "8h 30m",
  "5h 10m",
  "2h 5m",
  "7h 55m",
  "23h 10m",
  "18h 40m",
];

const arr = ref([]);
const isLoading = ref(true);

onMounted(() => {
  strapi
    .get("/api/b9-style?populate[videos][populate]")
    .then((res) => {
      arr.value = res.data.attributes.videos;
      arr.value.forEach((el) => {
        const min = 1000;
        const max = 10000;
        el.views = Math.floor(Math.random() * (max - min + 1)) + min;
        el.uploadTime = rndUploadTime[Math.floor(Math.random() * 10)];
        el.thumbnail = getThumbnailUrl(el.url);
      });
    })
    .catch((e) => {})
    .finally(() => {
      isLoading.value = false;
    });
});

const getVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|.*[?&]v=)|youtu\.be\/)([^&\n?]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getThumbnailUrl = (url) => {
  const regex =
    /(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|.*[?&]v=)|youtu\.be\/)([^&\n?]{11})/;
  const match = url.match(regex);
  return match ? `https://img.youtube.com/vi/${match[1]}/default.jpg` : null;
};

const openUrl = (url) => {
  const videoId = getVideoId(url);
  window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
};
</script>

<style scoped lang="scss">
.b9-style-container {
  height: calc(100vh - 182px);
  .row {
    line-height: 0;
    margin: 12px;
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    min-height: 90px;

    .col-3 {
      position: relative;
      background-size: cover;
      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .pseudo-play-btn {
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        font-size: 2rem;
      }
    }

    .txt-container {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      background-color: #2c2a28;
      padding: 10px;
      .txt-item-wrap {
        display: flex;
      }
      .txt {
        height: 100%;
        display: flex;
        align-items: center;
        font-weight: 500;
      }
      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* Limit to 1 lines */
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5;
        font-weight: bold;
        max-height: 4.5em;
        font-size: 18px;
      }
      .description {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* Limit to 2 lines */
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5;
        max-height: 4.5em;
        font-size: 10px;
      }
      .info {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 14px;
        line-height: 1.5;
        .views {
          color: #17db5d;
          .q-icon {
            margin-right: 3px;
          }
        }
        .time {
          color: #ffffff80;
        }
      }
    }
  }
  .iframe-container {
    position: relative;
    width: 100%;
    height: 80px;
  }

  iframe {
    width: 100%;
    height: 100%;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0);
    z-index: 1;
  }
}
</style>
