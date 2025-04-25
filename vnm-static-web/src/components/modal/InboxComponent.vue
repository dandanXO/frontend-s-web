<template>
  <div class="announcement-component">
    <el-carousel class="banner-slider" :autoplay="false" :interval="5000" @change="handleChange">
      <el-carousel-item class="banner-container" v-for="item in mailData" :key="item.id">
        <div class="announcement-title" v-html="item.title"></div>
        <template v-if="item.content">
          <div class="announcement-content" v-html="item.content"></div>
        </template>
      </el-carousel-item>
    </el-carousel>
    <div class="announcement-footer">
      <div class="footer-button-1" @click="store.openLiveChat()">
        {{ $t("inbox.contactCS") }}
        <!-- <img src="@/assets/images/home/sticky-sidebar/cs-icon.svg" /> -->
      </div>

      <div class="footer-button-2" @click="goToMailDetail()">
        {{ $t("inbox.viewDetails") }}
        <!-- <el-icon :size="20">
          <img src="../../assets/home/arrow-drop-right-line.svg" />
        </el-icon> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { ref, defineProps } from "vue";

const router = useRouter();
const carouselIndex = ref(0);
const props = defineProps({
  mailData: {
    type: Array,
    default: () => []
  }
});
const store = userStore();
const handleChange = (index) => {
  carouselIndex.value = index;
};
const goToMailDetail = () => {
  router.push(
    `/center/mailbox?mailid=${props.mailData[carouselIndex.value].id}&type=${props.mailData[carouselIndex.value].type}`
  );
};
</script>

<style lang="scss" scoped>
.banner-container {
  min-height: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
}
.announcement-component {
  padding: 10px 12px 16px;
}

.announcement-title {
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
}

.announcement-content {
  font-size: 16px;
  color: #666666;
  margin-bottom: 12px;
  flex: 1;
  overflow: auto;
  margin-bottom: 7px;
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;

  .footer-button-1 {
    box-shadow: 0px 1.59px 1.59px 0px rgba(147, 199, 255, 1) inset;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    color: #fff;
    height: 38px;
    width: 170px;
    border-radius: 6px;
    padding: 2px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer-button-2 {
    background: linear-gradient(180deg, rgba(214, 233, 255, 0.83) 5.34%, rgba(255, 255, 255, 0) 102.78%);
    box-shadow: 0px 1.59px 1.59px 0px rgba(147, 199, 255, 1) inset;
    box-shadow: 0px -1.27px 1.27px 0px rgba(39, 94, 193, 1) inset;

    color: rgba(122, 128, 161, 1);
    height: 38px;
    width: 170px;
    border-radius: 6px;
    padding: 2px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  .footer-button {
    cursor: pointer;
    color: #2f3244;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    height: 48px;
    font-size: 16px;
    border: 1px solid #2f3244;
    flex: 1;
    gap: 2px;

    &.detail {
      background: #2792fd;
      color: white;
      border: none;
    }

    &:hover {
      filter: brightness(0.9);
    }
    &:active {
      transform: translate(0px, 1px);
      opacity: 0.9;
    }
  }
}
.banner-slider {
  height: 400px;
}
</style>
