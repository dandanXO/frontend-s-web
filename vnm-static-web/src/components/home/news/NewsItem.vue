<template>
  <h1 v-if="props.isLoading">{{ $t("common.loading") }}...</h1>
  <div v-else-if="props.newsListArr" class="news-listing">
    <div class="news" v-for="news in props.newsListArr.slice(0, 5)">
      <div class="news-image">
        <img :src="news.pictureurl" :alt="news.title" />
      </div>
      <div class="news-contents">
        <div class="news-title">{{ news.title }}</div>
        <div class="news-content" v-html="news.excerpt"></div>
        <button class="standard-button btn-color-blue" @click="open(news.url)">
          {{ $t("home.moreDetails") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["newsListArr", "isLoading"]);

const open = (url) => {
  window.open(url);
};
</script>

<style lang="scss" scoped>
.news-listing {
  font-family: "Be Vietnam Pro", sans-serif;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  .news {
    width: 48%;
    display: flex;
    gap: 20px;

    &:first-child {
      width: 100%;

      .news-image {
        width: 556px;
        height: 240px;
      }

      .news-contents {
        flex: 4;
        max-width: none;

        .news-content {
          height: 150px;
        }
      }
    }

    .news-image {
      flex: 2;
      width: 270px;
      height: 165px;
      overflow: hidden;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 100%;
      }
    }

    .news-contents {
      max-width: 376px;
      position: relative;
      padding: 0 30px 30px 0;
      flex: 3;
      cursor: pointer;

      .news-title {
        color: #444444;
        font-size: 20px;
        font-weight: 700;
        height: 30px;
        overflow: hidden;
      }

      .news-content {
        height: 60px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #444444;
        margin: 15px 0;
      }

      .standard-button {
        position: absolute;
        bottom: 0px;
        right: 30px;
      }
    }
  }
}
</style>
