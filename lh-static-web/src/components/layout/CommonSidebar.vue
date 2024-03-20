<template>
  <div
    class="sticky-sidebar"
    @mouseleave="customerHovered = false"
  >
    <div class="additional-info-items" v-if="customerHovered">
      <div
        class="additional-info-item"
        @click.stop.prevent="store.openLiveChat()"
      >
        <img src="../../assets/images/home/sticky-sidebar-headphone-icon.png" />
        <span>24小时在线客服</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar-mail-icon.png" />
        <span style="margin-left: 5px">cs@lh8080.com</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar-phone-icon.png" />
        <span style="margin-left: 5px"
        ><span class="customer_phone">+85281701071</span></span
        >
      </div>
    </div>
    <div class="sticky-sidebar-items">
      <router-link to="/promotion" class="sticky-sidebar-item" @mouseover="customerHovered = false">
        <img src="../../assets/images/home/sticky-sidebar-hot-promo-icon.png" />
        <div>热门活动</div>
      </router-link>
      <div class="sticky-sidebar-item"
           @mouseover="customerHovered = true"
      >
        <img src="../../assets/images/home/sticky-sidebar-cs-icon.png" />
        <div>客服中心</div>
      </div>
      <div @mouseover="customerHovered = false">
        <router-link to="/app" class="sticky-sidebar-item">
          <img src="../../assets/images/home/sticky-sidebar-app-dl-icon.png" />
          <div>APP下载</div>
        </router-link>
      </div>
      <div @mouseover="customerHovered = false" class="sticky-sidebar-item" @click="scrollToTop">
        <img src="../../assets/images/home/sticky-sidebar-back-top-icon.png" />
        <div>返回顶部</div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { userStore } from "@/store";
import { getAppDownloadUrlFromServer } from "@/api/index/site";
import { uiStore } from "@/store/ui";


export default defineComponent({
  components: {},
  setup() {
    const customerHovered = ref(false);
    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };
    const store = userStore();
    const ui = uiStore();

    const downloadUrl = ref("");
    const getAppDownloadUrl = () => {
      getAppDownloadUrlFromServer()
        .then((res) => {
          downloadUrl.value = res.downloadPageUrl;
          ui.downloadUrl = downloadUrl.value;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    onMounted(() => {
      getAppDownloadUrl();
    });

    return {
      store,
      customerHovered,
      scrollToTop,
      downloadUrl
    };
  }
});
</script>

<style scoped lang="scss">

.additional-info-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0px;
  background: #fff;
  height: min-content;
  border-radius: 25px;

  .additional-info-item {
    display: flex;
    align-items: center;
    color: #424F72;
    gap: 10px;
    cursor: pointer;
    padding: 10px 25px;

    &:hover {
      background-color: #E5F5FF;
    }
  }
}

.sticky-sidebar-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #FFFFFF;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  box-shadow: 0px 0px 8px 0px #00000038;

  .sticky-sidebar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000;
    gap: 5px;
    cursor: pointer;

    &:hover {
      img {
        filter: brightness(1.05);
      }

      color: #4E93FF;
    }
  }
}

.sticky-sidebar {
  position: fixed;
  right: 0;
  bottom: 60px;
  z-index: 300;
  display: flex;
  flex-direction: row;
  background: transparent;
  border-radius: 6px 0 0 6px;
  -webkit-transition: right 0.3s ease-out;
  transition: right 0.3s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
</style>
