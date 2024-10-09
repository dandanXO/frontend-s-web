<template>
  <div class="b9-style-container">
    <div v-if="!isLoading">
      <div v-for="item in arr" :key="item.id" class="row" @click="openUrl">
        <div class="col-3" @click.stop>
          <div class="iframe-container">
            <div class="overlay" @click.stop="openUrl(item.url)"></div>
            <iframe
              width="100%"
              :src="`${item.url}`"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div class="txt-container col-9">
          <div class="txt title">{{ item.title }}</div>
          <div class="txt-item-wrap">
            <div class="txt description">
              {{ item.description }}
            </div>
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

const arr = ref([]);
const isLoading = ref(true);

onMounted(() => {
  strapi
    .get("/api/b9-style?populate[videos][populate]")
    .then((res) => {
      arr.value = res.data.attributes.videos;
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
    cursor: pointer;
    .txt-container {
      display: grid;
      grid-template-rows: 40% 60%;
      background-color: #2c2a28;
      padding: 10px;
      .txt-item-wrap {
        display: flex;
        align-self: center;
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
        max-height: 4.5em;
        font-size: 14px;
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
