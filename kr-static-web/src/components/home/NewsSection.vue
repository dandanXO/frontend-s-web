<template>
  <div class="news-section">
    <el-card>
      <img class="logo" src="../../assets/logo.svg" />
      <el-tabs v-model="activeName" class="demo-tabs" >
        <el-tab-pane :label="t('home.footballNews')" name="first">
          <div class="news-listing">
            <div class="news" v-for="news in footballNewsList.slice(0,5)" @click="open(news.url)">
              <div class="news-image">
                <img :src="news.pictureurl" />
              </div>
              <div class="news-contents">
                <div class="news-title">{{ news.title }}</div>
                <div class="news-content" v-html="news.excerpt"></div>
                <button class="standard-button btn-color-blue">
                  {{ $t("home.moreDetails") }}
                </button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('home.esportNews')" name="second">
          <div class="news-listing">
            <div class="news" v-for="news in esportNewsList.slice(0,5)">
              <div class="news-image">
                <img :src="news.pictureurl" />
              </div>
              <div class="news-contents" @click="open(news.url)">
                <div class="news-title">{{ news.title }}</div>
                <div class="news-content" v-html="news.excerpt"></div>
                <button class="standard-button btn-color-blue">
                  {{ $t("home.moreDetails") }}
                </button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('home.soccerBetting')" name="third">
          <div class="news-listing">
            <div class="news" v-for="news in soccerBettingList.slice(0,5)">
              <div class="news-image">
                <img :src="news.pictureurl" />
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
        </el-tab-pane>
        <el-tab-pane :label="t('home.bettingGuide')" name="fourth">
          <div class="news-listing">
            <div class="news" v-for="news in bettingGuideList.slice(0,5)">
              <div class="news-image">
                <img :src="news.pictureurl" />
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
<style  lang="scss">
.news-section {
  max-width: 1350px;
  margin: 30px auto 50px;
img {
  &.logo {
    max-width: 100px;
  }
}
  .el-tabs{
    margin-top: -40px;
  }

  .el-tabs__nav-wrap{
    padding-left: 140px;
    padding-bottom: 10px;
  }

  .el-tabs__item{
   padding: 0 20px !important;
  }

  .el-tabs__item.is-active:after{
    width: 100px;
    height: 3px;
  }

  .el-card {
    border-radius: 15px;
  }
  .news-listing {
    // font-family: 'Roboto';
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
        .news-contents {flex: 4;
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
        img {
          height: 100%;
        }
      }
      .news-contents {
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
}
</style>
