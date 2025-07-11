<template>
  <div class="announcement-component">
    <el-carousel class="banner-slider" :autoplay="false" :interval="5000">
      <el-carousel-item class="banner-container" v-for="item in mailData" :key="item.id">
        <div class="announcement-title" v-html="item.title"></div>
        <template v-if="item.content">
          <div class="announcement-content" v-html="item.content"></div>
        </template>

        <div class="announcement-footer">
          <div class="footer-button" @click="store.openLiveChat()">
            联系客服
            <img src="@/assets/images/home/sticky-sidebar/cs-icon.svg" />
          </div>
          <div class="footer-button detail" @click="goToMailDetail(item)">
            查看详情
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { userStore } from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  mailData: {
    type: Array,
    default: () => []
  }
});
const store = userStore();

const goToMailDetail = (mail) => {
  console.log(mail);
  router.push(`/center/mailbox?mailid=${mail.id}&type=${mail.type}`);
};
</script>

<style lang="scss" scoped>
.banner-container {
  min-height: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 46px;
}
.announcement-component {
  padding: 10px 12px 16px;
}

.announcement-title {
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
  height: 80px;
  overflow: auto;
}

.announcement-content {
  font-size: 16px;
  color: #666666;
  margin-bottom: 12px;
  flex: 1;
  overflow: auto;
  margin-bottom: 70px;
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 50px;

  .footer-button {
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    height: 48px;
    font-size: 16px;
    flex: 1;
    gap: 2px;
    color: $color-white;
    background: url('../../assets/images/common/blue-btn-bg.svg') center center no-repeat;
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94C3FF 0%, #4B91F5 100%);
    border: 1px solid #FFFFFF;
    box-shadow: 0px 2px 0px 0px #9AB0FF70;
    background-size: 100% 100%;

    &:hover {
      filter: brightness(0.9);
    }
    &:active {
      transform: translate(0px, 1px);
      opacity: 0.9;
    }
  }
}

:deep(.el-carousel__container) {
  height: 600px;
  width: 100%;
}
</style>
