<template>
  <div class="news-section" ref="newsSectionRef">
    <el-card>
      <img src="../../assets/logo.svg" alt="TF88 logo" />
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane :label="t('home.footballNews')" name="footballTab">
          <NewsItem :newsListArr="footballNewsList" :isLoading="isLoading" />
        </el-tab-pane>
        <el-tab-pane :label="t('home.esportNews')" name="esportTab">
          <NewsItem :newsListArr="esportNewsList" :isLoading="isLoading" />
        </el-tab-pane>
        <el-tab-pane :label="t('home.soccerBetting')" name="soccerBettingTab">
          <NewsItem :newsListArr="soccerBettingList" :isLoading="isLoading" />
        </el-tab-pane>
        <el-tab-pane :label="t('home.bettingGuide')" name="bettingGuide">
          <NewsItem :newsListArr="bettingGuideList" :isLoading="isLoading" />
        </el-tab-pane>
        <el-tab-pane :label="t('home.weeklyTournament')" name="weeklyTournament">
          <NewsItem :newsListArr="weeklyTournamentList" :isLoading="isLoading" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="js" setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from "vue-i18n";
import { getNews } from '../../api/index/news.js';
import { useIntersectionObserver } from '@vueuse/core';
import NewsItem from './news/NewsItem.vue';

const { t } = useI18n();
const activeName = ref('footballTab');
const newsSectionRef = ref(null);
const isNewsSectionVisible = ref(false);
const newsListArr = ref([]);
const isLoading = ref(false);

const { stop: stopIntersectionObserver } = useIntersectionObserver(
  newsSectionRef,
  ([{ isIntersecting }]) => {
    isNewsSectionVisible.value = isIntersecting
  },
);

const footballNewsList = computed(() => newsListArr.value.filter((news) => news.category.includes("Soi kèo bóng đá")));
const soccerBettingList = computed(() => newsListArr.value.filter((news) => news.category.includes("Tin bóng đá")));
const esportNewsList = computed(() => newsListArr.value.filter((news) => news.category.includes("Tin Esport")));
const bettingGuideList = computed(() => newsListArr.value.filter((news) => news.category.includes("Hướng dẫn cá cược")));
const weeklyTournamentList = computed(() => newsListArr.value.filter((news) => news.category.includes("Công bố Kết quả")));

watch(() => isNewsSectionVisible.value, () => {
  if (isNewsSectionVisible.value === true && !newsListArr.value.length) {
    initNewsArticles();
    stopIntersectionObserver();
  }
});

const initNewsArticles = () => {
  isLoading.value = true;

  getNews().then((res) => {
    if (res.code === 0) {
      newsListArr.value = res.data;
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      });
    }
  }).catch(() => {
    isLoading.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
};

</script>

<style lang="scss">
.news-section {
  max-width: 1350px;
  margin: 30px auto 50px;
  font-family: "Be Vietnam Pro", sans-serif;

  .el-tabs {
    margin-top: -40px;
  }

  .el-tabs__nav-wrap {
    padding-left: 140px;
    padding-bottom: 10px;
  }

  .el-tabs__item {
    padding: 0 20px !important;
  }

  .el-tabs__item.is-active:after {
    width: 100px;
    height: 3px;
  }

  .el-card {
    border-radius: 15px;
  }
}
</style>
