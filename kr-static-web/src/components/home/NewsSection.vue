<template>
  <div class="news-section">
    <el-card>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane :label="t('home.footballNews')" name="first">
          <div class="news-listing">
            <div class="news" v-for="news in footballNewsList.slice(0, 5)" @click="open(news.url)">
              <div class="news-contents">
                <div class="news-title">{{ news.title }}</div>
                <div class="news-date">{{ news.date }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('home.esportNews')" name="second">
          <div class="news-listing">
            <div class="news" v-for="news in esportNewsList.slice(0, 5)">
              <div class="news-contents" @click="open(news.url)">
                <div class="news-title">{{ news.title }}</div>
                <div class="news-date">{{ news.date }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('home.soccerBetting')" name="third">
          <div class="news-listing">
            <div class="news" v-for="news in soccerBettingList.slice(0, 5)">
              <div class="news-contents">
                <div class="news-title">{{ news.title }}</div>
                <div class="news-date">{{ news.date }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('home.bettingGuide')" name="fourth">
          <div class="news-listing">
            <div class="news" v-for="news in bettingGuideList.slice(0, 5)">
              <div class="news-contents">
                <div class="news-title">{{ news.title }}</div>
                <div class="news-date">{{ news.date }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from "vue-i18n";
import { getNews } from '../../api/index/news.js'

const { t } = useI18n();
const activeName = ref('first')
const footballNewsList = ref([]);
const soccerBettingList = ref([]);
const esportNewsList = ref([]);
const bettingGuideList = ref([]);

const loadNews = () => {
  getNews().then((res) => {
    if (res.code === 0) {
      footballNewsList.value = res.data.filter((news) => news.category.includes("Soi kèo bóng đá"));
      soccerBettingList.value = res.data.filter((news) => news.category.includes("Tin bóng đá"));
      esportNewsList.value = res.data.filter((news) => news.category.includes("Tin Esport"));
      bettingGuideList.value = res.data.filter((news) => news.category.includes("Hướng dẫn cá cược"));
    } else ElMessage.error({
      type: "error",
      message: res.message
    });
  });
};

const open = (url) => {
  window.open(url);
}

onMounted(() => {
  loadNews();
});
</script>
<style lang="scss">
.news-section {
  max-width: 1350px;
  margin: 30px auto 50px;

  .demo-tabs {
    border: 1px solid #5C9FFF;
    border-radius: 15px;
    padding: 20px;
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
    background-color: #EAF4FF;
  }

  .news-listing {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    .news {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 20px;
      background-color: #9AB9E330;
      padding: 20px;
      border-radius: 15px;

      .news-contents {
        position: relative;
        flex: 3;
        cursor: pointer;
        display: flex;
        justify-content: space-between;

        .news-title {
          color: #7A80A1;
          font-size: 16px;
          font-weight: 400;
          overflow: hidden;
        }

        .news-date {
          color: #92959F;
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
}
</style>
