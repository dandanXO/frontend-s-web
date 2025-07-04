<template>
  <el-dialog
    v-model="visible"
    destroyOnClose
    :append-to-body="true"
    :show-close="false"
    width="540px"
    class="announcement-modal"
  >
    <div>
      <div class="dialog-wrapper">
        <div class="dialog-header only-inbox">
          <div
            class="dialog-tab-item"
            :class="currentTab === 'announcement' ? 'active' : ''"
            @click="currentTab = 'announcement'"
            v-if="announceData.length > 0"
          >
            <img
              v-if="currentTab === 'announcement'"
              src="../../assets/home/announcement/tab-announcement-active.png"
              alt=""
            />
            <p v-else>重要公告</p>
          </div>

          <div class="dialog-tab-item" :class="currentTab === 'inbox' ? 'active' : ''" @click="currentTab = 'inbox'">
            <img
              v-if="currentTab === 'inbox'"
              :src="require(`../../assets/home/announcement/tab-inbox-active${isDark ? '-dark' : ''}.png`)"
              alt=""
            />
            <p v-else>站內信</p>
          </div>
        </div>
        <div class="dialog-content">
          <InboxComponent v-if="currentTab === 'inbox' && mailData.length > 0" :mailData="mailData" />
          <AnnouncementComponent
            v-if="currentTab === 'announcement' && announceData.length > 0"
            :announceData="announceData"
          />
        </div>
      </div>
      <div class="dialog-action">
        <div class="dialog-action-row today-not-remind">
          <div class="dialog-action-item">
            <el-checkbox v-model="checked" style="color: white" text-color="white">今天不再提醒</el-checkbox>
          </div>
        </div>

        <div class="dialog-action-row">
          <div class="dialog-action-item close-icon" @click="visible = false">
            <el-icon size="32px">
              <img src="../../assets/home/close-circle-fill.svg" />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { useDark } from "@vueuse/core/index";
import { ref, watch, onMounted } from "vue";
import InboxComponent from "./InboxComponent.vue";
import AnnouncementComponent from "./AnnouncementComponent.vue";
import { popupMailBox } from "@/api/personal/mailbox";
import { userStore } from "@/store";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";

const store = userStore();
const isDark = useDark();

const lastAnnouncementDateStr = useLocalStorage("LH_LAST_ANNOUNCEMENT_DATE", null);

const visible = ref(false);
const currentTab = ref("inbox");
const checked = ref(false);
const mailData = ref([]);
const announceData = ref([]);

onMounted(() => {
  if (!store.token) return;

  if (lastAnnouncementDateStr.value) {
    const today = moment();
    const lastAnnouncementDate = moment(lastAnnouncementDateStr.value);
    const diff = today.diff(lastAnnouncementDate, "days");
    if (!diff) return;
  }
  popupMailBox()
    .then((res) => {
      if (res.code === 0) {
        mailData.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      if (mailData.value.length > 0) {
        visible.value = true;
      }
    });
});

watch(
  () => store.token,
  () => {
    if (store.token) {
      if (lastAnnouncementDateStr.value) {
        const today = moment();
        const lastAnnouncementDate = moment(lastAnnouncementDateStr.value);
        const diff = today.diff(lastAnnouncementDate, "days");
        if (!diff) return;
      }

      popupMailBox()
        .then((res) => {
          if (res.code === 0) {
            mailData.value = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (mailData.value.length > 0) {
            visible.value = true;
          }
        });
    }
  }
);
watch(checked, (val) => {
  if (val) {
    lastAnnouncementDateStr.value = moment().format("YYYY-MM-DD");
  } else {
    lastAnnouncementDateStr.value = null;
  }
});
</script>

<style lang="scss" scoped>
.dialog-header {
  background: linear-gradient(0deg, #3480f9 0%, #6cadff 100%);
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px 12px 0 0;
  position: relative;
  cursor: pointer;

  &.only-inbox {
    background: #fff;
    height: 52px;
    border-bottom: 1px solid #999;
  }

  .dialog-tab-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    border-radius: 12px 12px 0 0;
    overflow: hidden;

    &.active {
      img {
        height: 50px;
      }
    }
  }

  p {
    margin: 0;
    color: white;
    font-size: 20px;
    white-space: nowrap;
  }
}

.dialog-footer {
  background: #e8f0fd;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 12px 12px;
  gap: 4px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #bbcbdb;

    &.active {
      background: #2792fd;
      width: 20px;
      border-radius: 56px;
    }
  }
}

.dialog-action {
  position: absolute;
  right: 0;
  width: 100%;

  .dialog-action-row {
    display: flex;
    align-items: center;
    justify-content: center;

    &.today-not-remind {
      justify-content: flex-end;
    }
  }

  .dialog-action-item {
    &.close-icon {
      justify-content: center;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #ffffff99;
      border: 1px solid #ffffffb2;
      fill: black;
    }
  }
}

::v-deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: white !important;
}

:deep(.el-carousel__indicators) {
  width: 100%;
  text-align: center;
}

.dark {
  .dialog-header {
    &.only-inbox {
      background: #2d4065;
    }
  }

  .dialog-content {
    background: #2d4065;
  }
}
</style>
