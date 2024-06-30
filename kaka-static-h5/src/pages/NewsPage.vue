<template>
  <div class="home-header">
    <div class="header-left" @click="router.push('/')">
      <img alt="logo" src="../assets/logo-web.svg" />
    </div>
    <div class="header-middle" v-if="!store.token">
      <q-btn rounded no-caps color="brightbtn" @click="router.push('/login')">
        {{ $t("lang.login") }}
      </q-btn>
      <q-btn rounded no-caps color="lightbluebtn" @click="router.push('/register')">
        {{ $t("lang.register") }}
      </q-btn>
    </div>
    <div class="header-lang">
      <LangOptions />
    </div>
  </div>

  <div class="news-wrapper">
    <div class="news-img-large"><img src="../assets/images/news/news-img-large.png" width="100%" /></div>

    <div class="news-content-title">Hướng dẫn cá cược TF88</div>

    <div class="news-container">
      <div v-for="item in newsItems" :key="item.id" class="news-item">
        <div class="item-img"><img :src="require(`../assets/images/news/${item.imageUrl}.png`)" width="100%" /></div>
        <div class="item-details">
          <div class="details-title">{{ truncateText(item.title, 28) }}</div>
          <div class="details-desc">{{ truncateText(item.description, 120) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, onActivated, reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import LangOptions from "components/LangOptions";

const store = userStore();
const route = useRoute();
const router = useRouter();

const truncateText = (text, limit) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

const newsItems = ref([
  {
    id: 1,
    title: "Rồng hổ TF88 là gì? Kinh nghiệm Kinh nghiệm Kinh nghiệm",
    description:
      "Rồng hổ TF88 là một trò chơi casino trực tuyến được rất nhiều anh em Việt Nam yêu thích. Sở hữu luật chơi đơn giản, cửa đặt cược tỷ lệ",
    imageUrl: "news-img-small"
  },
  {
    id: 2,
    title: "Rồng hổ TF88 là gì? Kinh nghiệm...",
    description:
      "Rồng hổ TF88 là một trò chơi casino trực tuyến được rất nhiều anh em Việt Nam yêu thích. Sở hữu luật chơi đơn giản, cửa đặt cược tỷ lệ thắng cao, cùng với đó là hàng ngàn chương trình khuyến mãi hấp dẫn tạo điều kiện thuận lợi cho người chơi  ",
    imageUrl: "news-img-small"
  },
  {
    id: 1,
    title: "Rồng hổ TF88 là gì? Kinh nghiệm...",
    description:
      "Rồng hổ TF88 là một trò chơi casino trực tuyến được rất nhiều anh em Việt Nam yêu thích. Sở hữu luật chơi đơn giản, cửa đặt cược tỷ lệ",
    imageUrl: "news-img-small"
  },
  {
    id: 1,
    title: "Rồng hổ TF88 là gì? Kinh nghiệm...",
    description:
      "Rồng hổ TF88 là một trò chơi casino trực tuyến được rất nhiều anh em Việt Nam yêu thích. Sở hữu luật chơi đơn giản, cửa đặt cược tỷ lệ",
    imageUrl: "news-img-small"
  }
]);
</script>

<style scoped lang="scss">
.news-wrapper {
  padding: 16px;

  .news-img-large {
  }

  .news-content-title {
    font-size: 18px;
    font-weight: 800;
    margin-top: 12px;
    margin-bottom: 6px;
  }

  .news-container {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .news-item {
      background-color: #fcfdfe;
      // background: salmon;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0px -8px 8px 0px #E6C3C3 inset;
      // box-shadow: 0px 4px 0px 0px #a7c2dd;
      display: flex;
      gap: 12px;

      .item-img {
        min-width: 100px;
        width: 100px;
      }
      .item-details {
        .details-title {
          font-size: 16px;
          font-weight: 700;
          color: #7a80a1;
        }
        .details-desc {
          font-size: 12px;
          color: #a4aabb;
        }
      }
    }
  }
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: $box-width;
  margin: 0 auto;
  padding: 4px;

  .header-left {
    // height: 50px;

    // @media (max-width: 400px) {
    //   height: 40px;
    // }

    img {
      // height: 100%;
      // width: auto;
      width: 100%;
      max-width: 135px;
    }
  }

  .header-middle {
    margin-left: auto;
    margin-right: 12px;
    display: flex;
    gap: 12px;

    :deep(.q-btn) {
      min-height: 12px;
      font-weight: bold;
      @media (max-width: 400px) {
        font-size: 80%;
      }
    }
  }

  .header-lang {
    // .lang-container {
    //   img {
    //     display: block;
    //     width: 30px;
    //     height: 30px;
    //   }

    //   :deep(.q-field__marginal) {
    //     min-height: 40px;
    //     height: 40px;
    //     display: none;
    //   }

    //   :deep(.q-field__native) {
    //     min-height: 30px;
    //     height: 30px;
    //     padding: 0;
    //   }
    // }
  }

  .header-right {
    height: 25px;
    position: relative;

    img {
      height: 100%;
      width: auto;
    }

    .red-dot {
      height: 10px;
      width: 10px;
      background: #db0011;
      border-radius: 50%;
      position: absolute;
      top: -3px;
      right: -3px;
    }
  }
}
</style>

<style lang="scss">
.q-select__dialog {
  label {
    img {
      width: 30px;
      height: 30px;
    }
    display: none;
  }
}
</style>
