<template>
  <el-dialog align-center v-model="isStationNotice" :maskClosable="false" :footer="null"
    style="border-radius: 8px; width: 800px" class="notice-modal">
    <AnnouncementDialog :announcementList="announcementList" :announcementTypes="announcementTypes"
      :announcementActive="announcementActive" />
  </el-dialog>

  <div class="top-bar-wrapper">
    <div class="top-bar-inner">
      <div class="station-notice-container">
        <div class="station-notice-box">
          <img class="announcement-img" src="../../assets/home/announcement/announcement-img.png" alt="announcement"
            @click="openPopup(announcementList)" />
          <div ref="marqueeWrapperRef" class="station-notice">
            <div ref="marqueePseudoRef" class="marquee-pseudo">
              <div v-for="(word, index) in announcementList" :key="index" v-html="word.content" @click="openPopup(word)"
                class="station-notice-item"></div>
            </div>
            <Vue3Marquee :clone="false" :duration="marqueeDuration">
              <div v-for="(word, index) in announcementList" :key="index" v-html="word.content" @click="openPopup(word)"
                class="station-notice-item"></div>
            </Vue3Marquee>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { getAnnouncement } from "@/api/personal/personal";
import { Vue3Marquee } from "vue3-marquee";
import { ElMessage } from "element-plus";
import { EDITION } from "@/constant/edition";
import { uiStore } from "@/store/ui";
import "vue3-marquee/dist/style.css";

const AnnouncementDialog = defineAsyncComponent(() =>
  import('@/components/home/announcement/AnnouncementDialog.vue')
);

const ui = uiStore();

const marqueeWrapperRef = ref();
const marqueePseudoRef = ref();
const marqueeDuration = ref(0);
const announcementActive = ref("");
const announcementList = ref([]);
const announcementTypes = ref([]);
const loadAnnouncement = () => {
  const params = (() => {
    switch (ui.edition) {
      case EDITION.SLOT:
        return "SLOT";
      case EDITION.NORMAL:
      default:
    }
  })();

  getAnnouncement(params).then((res) => {
    if (res.code === 0) {
      announcementTypes.value = res.data.type;
      if (res.data.type && res.data.type.length > 0) {
        announcementActive.value = res.data.type[0].name;
      }
      announcementList.value = res.data.announcements;
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      });
    }
  });
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

const calculateMarqueeDuration = () => {
  if (!marqueePseudoRef.value || !marqueeWrapperRef.value) return;

  const marqueeWidth = marqueePseudoRef.value.scrollWidth;
  const wrapperWidth = marqueeWrapperRef.value.clientWidth;
  marqueeDuration.value = (marqueeWidth / wrapperWidth) * 16;
};

onMounted(() => {
  loadAnnouncement();
  if (marqueePseudoRef.value) {
    new ResizeObserver(calculateMarqueeDuration).observe(marqueePseudoRef.value);
  }
});
</script>

<style scoped lang="scss">
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
          position: relative;
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

          .marquee-pseudo {
            display: flex;
            position: absolute;
            visibility: hidden;
            width: max-content;
            z-index: -1;
            overflow: hidden;

            .station-notice-item {
              flex: 0 0 auto;
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
</style>
