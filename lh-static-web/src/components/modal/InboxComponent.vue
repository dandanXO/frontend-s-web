<template>
  <div class="announcement-component">
    <el-carousel class="banner-slider" :autoplay="false" :interval="5000" :navigation="false">
      <el-carousel-item class="banner-container" v-for="item in mailData" :key="item.id">
        <div class="announcement-container">
          <div class="announcement-title" v-html="item.title"></div>
          <template v-if="item.content">
            <div class="announcement-content" v-html="item.content"></div>
          </template>
        </div>

        <div class="announcement-footer">
          <div class="footer-button" @click="store.openLiveChat()">
            联系客服
            <img src="@/assets/images/home/sticky-sidebar/cs-icon.svg" />
          </div>
          <!--          v-show="item.redirectType !== 'NONE'"-->
          <div class="footer-button detail" @click="goToMailDetail(item)">
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
.dialog-wrapper {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 12px;
  height: 515px;

  .dialog-title {
    display: flex;
    justify-content: center;
    margin-top: -20px;

    img {
      display: block;
      width: 100px;
    }
  }
}

.banner-container {
  min-height: 380px;
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding-bottom: 100px;
}

.announcement-container {
  margin: 16px;
  background: #f2f8ff;
  border: 1px solid #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  height: 240px;
}

.announcement-component {
  // padding: 10px 12px 16px;
  // height: 500px;
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
  // margin-bottom: 70px;
  margin-top: -20px;
  padding: 0 16px;
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
  padding: 0 16px;

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

:deep(.el-carousel__container) {
  height: 380px;
  width: 100%;
}

.dark {
  .announcement-container {
    background: #3d4d74;
    color: #ffffff;
    border: 0;
  }

  .announcement-content {
    color: #ffffff;
  }
  .announcement-footer .footer-button:first-child {
    color: #ffffff;
    border: 1px solid #369eff;

    img {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%)
        contrast(100%);
    }
  }

  .announcement-title {
    color: #fff;
  }

  .announcement-footer {
    .footer-button {
      &.detail {
        background: url("../../assets/home/announcement/blue-bg-title.png");
        background-repeat: no-repeat;
      }

      .el-icon {
        filter: brightness(0) invert(1);
      }
    }
  }
}
</style>
