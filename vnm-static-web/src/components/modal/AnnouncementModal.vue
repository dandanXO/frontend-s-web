<template>
  <el-dialog
    v-model="visible"
    destroyOnClose
    :append-to-body="true"
    height="760px"
    width="400px"
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
              :src="require(`../../assets/home/announcement/tab-announcement-active-${languageVal}.png`)"
              alt=""
            />
            <p v-else>{{ $t("inbox.imptAnnouncement") }}</p>
          </div>
          <div class="dialog-tab-item" :class="currentTab === 'inbox' ? 'active' : ''" @click="currentTab = 'inbox'">
            <!-- <img v-if="currentTab === 'inbox'" :src="require(`../../assets/home/announcement/tab-inbox-active-${languageVal}.png`)" alt="" /> -->
            <div style="width: 33.3%; height: 1px"></div>
            <div>
              <p>{{ $t("inbox.mailBox") }}</p>
            </div>
            <div style="width: 34%; display: flex; justify-content: flex-end; align-items: center;" @click="handleClose">
              <img
                style="height: 14px; width: 14px;"
                :src="require(`../../assets/home/close.svg`)"
              />
            </div>
          </div>
        </div>
        <div class="dialog-content">
          <InboxComponent v-if="currentTab === 'inbox' && mailData.length > 0" :mailData="mailData" />
          <AnnouncementComponent
            v-if="currentTab === 'announcement' && announceData.length > 0"
            :announceData="announceData"
          />
        </div>
        <div class="dialog-action-row today-not-remind">
          <div class="dialog-action-item">
            <el-checkbox
              v-model="checked"
              style="color: rgba(142, 142, 142, 1); font-size: 14px; font-weight: 400;"
              text-color="black"
            >
              {{ $t("inbox.noMoreToday") }}
            </el-checkbox>
          </div>
        </div>
      </div>
      <!-- <div class="dialog-action">

        <div class="dialog-action-row">
          <div class="dialog-action-item close-icon" @click="visible = false">
            <el-icon size="32px">
              <img src="../../assets/home/close-circle-fill.svg" />
            </el-icon>
          </div>
        </div>
      </div> -->
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import InboxComponent from "./InboxComponent.vue";
import AnnouncementComponent from "./AnnouncementComponent.vue";
import { popupMailBox, readMail } from "@/api/personal/mailbox";
import { userStore } from "@/store";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";


import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";
const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);

const store = userStore();
const lastAnnouncementDateStr = useLocalStorage("LH_LAST_ANNOUNCEMENT_DATE", moment("1990-12-25"));

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
    if (!diff) return

    lastAnnouncementDateStr.value = moment()
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

const handleClose = () => {
  if (mailData.value.length > 0) {
    const promises = mailData.value.map(mail => {
      if (mail.readTime === null || mail.readTime === 'null') {
        return readMail({ id: mail.id });
      }
      return Promise.resolve();
    });
    Promise.all(promises).then(() => {
      visible.value = false;
    }).catch(() => {
      visible.value = false;
    });
  } else {
    visible.value = false;
  }
};

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
}

.dialog-action-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
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

::v-deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: white !important;
}

::v-deep(.el-checkbox__inner) {
  border-color: #8e8e8e;
}
</style>
