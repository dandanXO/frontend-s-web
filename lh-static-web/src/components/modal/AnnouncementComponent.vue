<template>
  <div class="announcement-component">
    <el-carousel class="banner-slider" :autoplay="false" :interval="5000">
      <el-carousel-item class="banner-container" v-for="item in 2" :key="item">
        <div class="announcement-title">体育场馆维护公告{{ item }}</div>
        <div class="announcement-content">
          尊敬的会员，恭喜您于 2023/08/1 使用 PAY 钱包、USDT
          进行提款，产生一笔幸运订单。彩金已经派发至您的游戏账户内请您当日内查收。恭喜您于 2023/08/1 使用 PAY 钱包、USDT
          进行提款，产生一笔幸运订单。彩金已经派发至您的游戏账户内请您当日内查收。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。
        </div>
        <div class="announcement-footer">
          <div class="footer-button" @click="store.openLiveChat()">
            联系客服
            <img src="@/assets/images/home/sticky-sidebar/cs-icon.svg" />
          </div>
          <div class="footer-button detail" @click="handleDetail">
            查看详情
            <el-icon :size="20">
              <img src="../../assets/home/arrow-drop-right-line.svg" />
            </el-icon>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { userStore } from "@/store";

const props = defineProps({
  announceData: {
    type: Array,
    default: () => []
  }
});
const store = userStore();

const handleDetail = () => {
  console.log("handleDetail");
};
</script>

<style lang="scss" scoped>
.banner-container {
  min-height: 400px;
  height: 100%;
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
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;

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
  }
}
</style>
