<template>
  <el-dialog
    align-center
    v-model="isShowAnnouncementDialog"
    :maskClosable="false"
    :footer="null"
    style="border-radius: 8px; width: 800px"
    class="notice-modal"
  >
    <div class="notice-header">
      {{ $t("home.announcementList") }}
      <!-- <div @click="toggleAnnouncementDialog">
        <img src="../../../assets//home/announcement/close-btn.png" />
      </div> -->
    </div>

    <div class="announcement-wrapper">
      <el-collapse accordion v-model="typeActive">
        <template v-for="(ann, idx) in announcementList" :key="idx">
          <el-collapse-item :name="idx" :title="ann.title" class="announcement-content">
            <div class="announcement-date">{{ moment(ann.createTime).format("YYYY/MM/DD") }}</div>
            <p class="announcement-p">{{ ann.content }}</p>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAnnouncement } from "@/api/personal/personal";
import { Vue3Marquee } from "vue3-marquee";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { userStore } from "@/store";
import moment from "moment";

const typeActive = ref("");
const announcementActive = ref("");
const announcementList = ref([]);
const announcementTypes = ref([]);
const store = userStore();
const { isShowAnnouncementDialog } = storeToRefs(store);
const loadAnnouncement = () => {
  getAnnouncement().then((res) => {
    if (res.code === 0) {
      const d = res.data.announcements;
      announcementTypes.value = res.data.type;
      if (res.data.type && res.data.type.length > 0) {
        announcementActive.value = res.data.type[0].name;
      }
      announcementList.value = d;
      // announcementList.value = d.announcements
      // announcementList.value = res.data.announcements
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      });
    }
  });
};

const noticeTitle = ref("");
const openPopup = (noticeType) => {
  if (noticeType) {
    // announcementActive.value = "3";
    noticeTitle.value = noticeType.title;
    store.toggleAnnouncementDialog();
  }
};

const calculateMaxContentLength = () => {
  let maxLength = 0;
  for (const announcement of announcementList.value) {
    if (announcement.content.length > maxLength) {
      maxLength = announcement.content.length;
    }
  }
  return maxLength;
};

onMounted(() => {
  loadAnnouncement();
});
</script>

<style scoped lang="scss">
.notice-header {
  color: #468cff;
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.announcement-tabs {
  width: 100%;
}

.announcement-wrapper {
  :deep(.el-collapse-item__header) {
    padding: 0 10px;
    &.is-active {
      background: linear-gradient(312deg, #0286ff, #00ff85);
    }
  }
  :deep(.el-collapse-item__wrap) {
    padding: 10px;
  }
}

.announcement-content {
  color: #7a80a1;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
  max-width: 1150px;
  height: auto;
  // margin-top: 20px;
  // padding: 0px 10px;

  .announcement-date {
    text-align: right;
    color: #7a80a1;
  }

  .announcement-p {
    white-space: pre-line;
    color: #7a80a1;
  }
}

.top-bar-wrapper {
  padding: 5px;
  color: #696d70;
  border-radius: 2.1875rem;
  background: #fff;
  box-shadow: 0px -20px 30px 0px rgba(158, 180, 210, 0.41) inset, 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 0 auto;
  max-width: 1350px;
  overflow: hidden;
  .top-bar-inner {
    max-width: $maxwidth;
    width: 100%;
    margin: 0 auto;
    display: flex;
    font-size: 0.75em;
    line-height: 1.2em;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;

    .station-notice-container {
      flex: 3;

      .station-notice-box {
        display: flex;
        gap: 5px;
        padding: 0 10px 0 5px;
        overflow: hidden;

        .announcement-img {
          width: 36px;
        }

        .station-notice {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

          .station-notice-item {
            color: #444444;
            margin-right: 50px;
            font-size: 15px;
            line-height: 15px;
            height: 16px;
          }
        }
      }
    }

    .right-contents {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .common-link {
        cursor: pointer;
        color: #78919d;
      }
    }
  }
}
</style>
<style>

.notice-modal .el-dialog__header .el-dialog__headerbtn {
    
    top: 10px;
    right: 10px;
}
.notice-modal .notice-header {
  
  padding: 0 0 10px;
}
</style>
