<template>
  <q-scroll-area>
    <q-dialog v-model="visible">
      <div style="overflow: unset; width: 90%">
        <div class="dialog-wrapper">
          <div class="dialog-header">
            Tin Nhắn
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              size="12px"
              class="close-icon"
              @click="handleDialogeClose"
            />
          </div>
          <div class="dialog-content">
            <InboxComponent
              @chageSlide="hChageSlide"
              v-if="currentTab === 'inbox' && mailData.length > 0"
              ref="inboxComponentRef"
              :slide="activeDot"
              :mailData="mailData"
            />
            <!-- <AnnouncementComponent
              @chageSlide="hChageSlide"
              v-if="currentTab === 'announcement'"
              ref="announcementComponentRef"
              :slide="activeDot"
              :announceData="announceData"
            /> -->
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
            <div class="button-wrapper">
              <q-btn
                text-color="white"
                :label="$t('lang.inbox_contactCS')"
                style="background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%)"
                @click="handleService"
              />
              <q-btn
                text-color="#7A80A1"
                :label="$t('lang.inbox_viewDetails')"
                style="
                  background: linear-gradient(180deg, rgba(214, 233, 255, 0.83) 5.34%, rgba(255, 255, 255, 0) 102.78%);
                "
                @click="handleDetail(currentComponentData[activeDot])"
              />
            </div>
            <q-checkbox v-model="checked" :label="$t('lang.inbox_noMoreToday')" />
          </div>
        </div>
        <div class="dialog-action">
          <div class="dialog-action-row"></div>
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
import { useRouter } from "vue-router";
import qs from "qs";

const store = userStore();
const router = useRouter();
const lastAnnouncementDateStr = useLocalStorage("LH_LAST_ANNOUNCEMENT_DATE", moment("1990-12-25"));

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

const handleDialogeClose = () => {
  if (mailData.value.length > 0) {
    const promises = mailData.value.map((mail) => {
      if (mail.readTime === null || mail.readTime === 'null') {
        return api.post(
          "/session/pm/inbox/read",
          qs.stringify({
            id: mail.id
          })
        );
      }
      return Promise.resolve();
    });

    Promise.all(promises).then(() => {
      visible.value = false;
    }).catch(()=>{
      visible.value = false;
    });
  } else {
    visible.value = false;
  }

  
};

const hChageSlide = (val) => {
  activeDot.value = val;
};

const handleService = () => {
  router.push("/liveChat");
};

const handleDetail = (mail) => {
  router.push({
    path: "/account/inbox",
    query: {
      id: mail.id,
      type: mail.type
    }
  });
};

const getInbox = () => {
  return api.get("/session/pm/inbox/popup");
};
const handleDotClick = ()=>{
  visible.value = false;
}
onMounted(() => {
  if (!store.token) return;

  if (lastAnnouncementDateStr.value) {
    const today = moment();
    const lastAnnouncementDate = moment(lastAnnouncementDateStr.value);
    const diff = today.diff(lastAnnouncementDate, "days");
    if (!diff) return

    lastAnnouncementDateStr.value = moment()
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
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  font-size: 20px;
  font-weight: 600;
  color: white;
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
  background: white;
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  .dot-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin-bottom: 24px;
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

  .button-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 5px;

    > .q-btn {
      flex: 1;
      line-height: 17px;
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

.close-icon {
  position: absolute;
  right: 16px;
}
</style>
