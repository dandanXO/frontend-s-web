<template>
  <q-scroll-area>
    <q-dialog v-model="visible">
      <div style="overflow: unset; width: 90%">
        <div class="dialog-wrapper">
          <div class="dialog-header only-inbox">
            <div
              class="dialog-tab-item announcement"
              :class="currentTab === 'announcement' ? 'active' : ''"
              @click="changeTab('announcement')"
              v-if="announceData.length > 0"
            >
              <div v-if="currentTab === 'announcement'">
                <img class="bg-img" src="../../assets/images/home/announcement/tab-active-background-2.png" alt="" />
                <p class="text">{{ $t('lang.inbox_imptAnnouncement') }}</p>
              </div>
              <p v-else>{{ $t('lang.inbox_imptAnnouncement') }}</p>
            </div>
            <div
              class="dialog-tab-item inbox"
              :class="currentTab === 'inbox' ? 'active' : ''"
              @click="changeTab('inbox')"
            >
              <div v-if="currentTab === 'inbox'">
                <img class="bg-img" src="../../assets/images/home/announcement/tab-active-background.png" alt="" />
                <p class="text">
                  <img
                    src="../../assets/images/home/announcement/icon-mail.svg"
                    alt=""
                    style="width: 24px; height: 24px"
                  />
                  {{ $t('lang.inbox_mailBox') }}
                </p>
              </div>
              <p v-else>{{ $t('lang.inbox_mailBox') }}</p>
            </div>
          </div>
          <div class="dialog-content">
            <InboxComponent
              @chageSlide="hChageSlide"
              v-if="currentTab === 'inbox'"
              ref="inboxComponentRef"
              :slide="activeDot"
              :mailData="mailData"
            />
            <AnnouncementComponent
              @chageSlide="hChageSlide"
              v-if="currentTab === 'announcement'"
              ref="announcementComponentRef"
              :slide="activeDot"
              :announceData="announceData"
            />
          </div>
          <div class="dialog-footer">
            <div class="dot-wrapper">
              <div
                class="dot"
                :class="{ active: index === activeDot }"
                v-for="(item, index) in currentComponentData"
                :key="index"
                @click="handleDotClick(index)"
              ></div>
            </div>
            <q-checkbox v-model="checked" :label="$t('lang.inbox_noMoreToday')" />
          </div>
        </div>
        <div class="dialog-action">
          <div class="dialog-action-row">
            <q-btn
              rounded
              class="dialog-action-item close-icon"
              icon="close"
              size="12px"
              @click="visible = false"
            ></q-btn>
          </div>
        </div>
      </div>
    </q-dialog>
  </q-scroll-area>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import InboxComponent from "./InboxComponent.vue";
import AnnouncementComponent from "./AnnouncementComponent.vue";
import { userStore } from "src/stores";
import { api } from "boot/axios";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";

const store = userStore();
const lastAnnouncementDateStr = useLocalStorage("LH_LAST_ANNOUNCEMENT_DATE", null);

const visible = ref(false);
const currentTab = ref("inbox");
const checked = ref(false);
const activeDot = ref(0);

const mailData = ref([]);
const announceData = ref([]);

const currentComponentData = computed(() => {
  return currentTab.value === "inbox" ? mailData.value : announceData.value;
});

const changeTab = (name) => {
  currentTab.value = name;
  activeDot.value = 0;
};

const handleDotClick = (index) => {
  activeDot.value = index;
};

const hChageSlide = (val) => {
  activeDot.value = val;
};

const getInbox = () => {
  return api.get("/session/pm/inbox/popup");
};

onMounted(() => {
  if (!store.token) return;

  if (lastAnnouncementDateStr.value) {
    const today = moment();
    const lastAnnouncementDate = moment(lastAnnouncementDateStr.value);
    const diff = today.diff(lastAnnouncementDate, "days");
    if (!diff) return;
  }

  getInbox()
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
      getInbox().then((res) => {
        if (res.code === 0) {
          mailData.value = res.data;
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
.dialog-wrapper {
  max-width: 90%;
  margin: 0 auto;
}

.dialog-header {
  background: linear-gradient(0deg, #3480f9 0%, #6cadff 100%);
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px 12px 0 0;
  position: relative;
  cursor: pointer;
  padding: 0 32px;

  &.only-inbox {
    height: 52px;
    background: #fff;
    border-bottom: 1px solid #999;

    .dialog-tab-item {
      justify-content: center !important;
    }
  }

  .dialog-tab-item {
    display: flex;
    align-items: center;
    flex: 1;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    height: 42px;

    &.inbox {
      justify-content: flex-end;
    }

    &.announcement {
      justify-content: flex-start;
    }

    &.inbox.active {
      .bg-img {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 50px;
      }

      .text {
        position: relative;
        z-index: 0;
        color: #2792fd;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    &.announcement.active {
      .bg-img {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 50px;
      }

      .text {
        position: relative;
        z-index: 0;
        color: #2792fd;
        display: flex;
        align-items: center;
        gap: 8px;
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
  border-radius: 0 0 12px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  .dot-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

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
    margin-top: 20px;
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

::v-deep(.q-dialog__inner > div) {
  overflow: unset;
}
</style>
