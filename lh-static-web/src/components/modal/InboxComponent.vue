<template>
  <div class="announcement-component">
    <el-carousel height="auto" class="banner-slider"  :autoplay="false" :interval="5000">
      <el-carousel-item class="banner-container" v-for="item in mailData" :key="item.id">
        <div class="announcement-title" v-html="item.title"></div>
        <div class="announcement-content" v-html="item.content"></div>
        <div class="announcement-footer">
          <div class="footer-button" @click="store.openLiveChat()">联系客服
            <img src="@/assets/images/home/sticky-sidebar/cs-icon.svg" />
          </div>
          <div class="footer-button detail" v-show="item.redirectType !== 'NONE'" @click="handleDetail(item)">{{ item.redirectButton ?? '查看详情' }}
            <el-icon :size="20">
              <RiArrowDropRightLine />
            </el-icon>
          </div>
        </div>  
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { userStore } from "@/store";
import { RiArrowDropRightLine } from "vue-remix-icons";
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  mailData: {
    type: Array,
    default: () => []
  }
})
const store = userStore();

const handleDetail = (mail) => {
  if (mail.redirectType === 'INNER') {
    router.push({ path: mail.redirectUrl })
  } else if (mail.redirectType === 'OUTER') {
    window.open(mail.redirectUrl, '_blank')
  }
}
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
}

.announcement-content {
  font-size: 16px;
  color: #666666;
  margin-bottom: 12px;
  flex: 1;
  overflow: auto;
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
