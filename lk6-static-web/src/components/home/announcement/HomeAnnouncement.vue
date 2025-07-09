<template>
  <el-dialog
    v-model="isStationNotice"
    :maskClosable="false"
    :footer="null"
    style="border-radius: 8px; width: 800px"
    class="notice-modal"
    :show-close="false"
  >
    <div class="notice-header">
      公告列表
      <div @click="isStationNotice = false">
        <img src="../../../assets//home/announcement/close-btn.png" />
      </div>
    </div>

    <div>
      <el-tabs type="card" class="announcement-tabs" v-model="announcementActive" @tab-click="announcementTabChange">
        <el-tab-pane
          v-for="(tab, ind) in announcementTypes"
          :key="tab.id"
          :tab="ind"
          :label="tab.name"
          :name="tab.name"
        >
          <el-collapse accordion v-model="typeActive">
            <template v-for="(ann, idx) in announcementList" :key="idx">
              <template v-if="ann.typeId === tab.id">
                <el-collapse-item :name="idx" :title="ann.title" class="announcement-content">
                  <p class="announcement-p" v-html="ann.content"></p>
                </el-collapse-item>
              </template>
            </template>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>

  <div class="top-bar-wrapper">
    <div class="top-bar-inner">
      <div class="station-notice-container">
        <div class="station-notice-box">
          <img
            class="announcement-img"
            :class="{ loading: isLoading }"
            src="../../../assets/home/announcement/announcement-img.png"
            @click="openPopup(announcementList)"
          />
          <div v-if="isLoading === false" class="station-notice">
            <div v-if="!announcementList.length">暂无公告</div>
            <div v-else class="marquee-wrapper">
              <Vue3Marquee
                :clone="false"
                :duration="calculateMaxContentLength() < 30 ? calculateMaxContentLength() * 1 + 10 : 70"
              >
                <div
                  v-for="(word, index) in announcementList"
                  :key="index"
                  v-html="word.content"
                  @click="openPopup(word)"
                  class="station-notice-item"
                ></div>
              </Vue3Marquee>
            </div>
            <img src="../../../assets/home/announcement/hot-matches.png" height="30px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAnnouncement } from "@/api/personal/personal";
import { Vue3Marquee } from "vue3-marquee";
import { useNotify } from "@/hooks/notify";

const notify = useNotify();

const typeActive = ref("");
const announcementActive = ref("");
const announcementList = ref([]);
const announcementTypes = ref([]);
const isLoading = ref(false);

const loadAnnouncement = () => {
  isLoading.value = true;

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
      notify({
        type: "error",
        message: res.message
      });
    }
  }).catch(() => {
    isLoading.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
};

const announcementTabChange = () => {
  // homeState.tabMatchs.forEach(element => {
  //   if (nk === element.gameId) {
  //     getMatchData(element);
  //   }
  // });
};

const isStationNotice = ref(false);
const noticeTitle = ref("");
const openPopup = (noticeType) => {
  if (noticeType) {
    // announcementActive.value = "3";
    noticeTitle.value = noticeType.title;
    isStationNotice.value = true;
  }
};

const calculateMaxContentLength = () => {
  let maxLength = 0;

  if(announcementList.value) {
    for (const announcement of announcementList.value) {
      if (announcement.content.length > maxLength) {
        maxLength = announcement.content.length;
      }
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
  font-family: "Inter Bold";
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

.announcement-content {
  color: #7a80a1;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
  max-width: 1150px;
  height: auto;
  margin-top: 20px;
  padding: 0px 10px;

  .announcement-p {
    color: #7a80a1;
  }
}

.top-bar-wrapper {
  color: #696d70;
  border-radius: 2.1875rem;
  background: #FEFEFE;
  box-shadow: 0px 4px 4px 0px #C4D3E280;
  width: 1300px;
  height: 45px;
  border-radius: 7px;
  margin: 0 auto;
  animation: expandBackground 0.5s ease-out forwards;

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
      width: 100%;
      flex: 3;

      .station-notice-box {
        display: flex;
        gap: 5px;
        padding: 0 10px 0 10px;
        overflow: hidden;
        justify-content: space-around;

        .announcement-img {
          aspect-ratio: 119/126;
          width: 36px;
          animation: pulse 2.5s ease-in-out infinite;
          
          &.loading {
            animation: spin 1s linear infinite;
          }
        }

        .station-notice {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

          .station-notice-item {
            color: #7a80a1;
            margin-right: 50px;
            font-size: 15px;
            line-height: 15px;

             p {
              margin: 0;
              padding: 0;
            }
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.85;
  }
}

.marquee-wrapper {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* Left and right fade overlays */
.marquee-wrapper::before,
.marquee-wrapper::after {
  content: "";
  position: absolute;
  top: 0;
  width: 40px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.marquee-wrapper::before {
  left: 0;
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}

.marquee-wrapper::after {
  right: 0;
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}

/* White background expansion */
@keyframes expandBackground {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
