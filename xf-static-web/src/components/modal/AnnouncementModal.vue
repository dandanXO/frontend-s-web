<template>
  <el-dialog
    v-model="isAnnouncementModalVisible"
    destroyOnClose
    :append-to-body="true"
    :show-close="false"
    width="520px"
    class="announcement-modal"
  >
    <div class="header">
      <img class="header-icon" src="../../assets/home/announcement/mail-icon.svg" />
      <span class="header-title">站内信</span>
      <img class="close-icon" src="../../assets/home/announcement/close-icon.svg" @click="isAnnouncementModalVisible = false" />
    </div>
    <div class="content">
      <div class="item" :class="{'unread-status': !inboxItem.readTime}" v-for="inboxItem, index in inboxData">
        <input type="checkbox" :id="`toggle-${index}`">
        <label :for="`toggle-${index}`" class="content-title">
          <div class="title-label" v-html="inboxItem.title" />
          <div class="read-status" v-if="inboxItem.readTime">已读</div>
          <img class="collapse-arrow" src="../../assets/home/announcement/right-arrow.svg" @click.stop="goToMailDetail(inboxItem)" />
        </label>
        <div class="content-desc" v-html="inboxItem.content" />
      </div>
    </div>

    <div class="actions">
      <div class="cs-btn"  @click="store.openLiveChat()">
        <img src="../../assets/home/announcement/cs-icon.svg" />联系客服</div>
    </div>
  </el-dialog>
</template>

<script setup>
import { popupMailBox } from "@/api/personal/mailbox";
import { userStore } from "@/store";
import { ref, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import { useRouter } from "vue-router";

const router = useRouter();
const isAnnouncementModalVisible = ref(false);
const inboxData = ref([]);
const store = userStore();
const lastAnnouncementDateStr = useLocalStorage("XF_LAST_ANNOUNCEMENT_DATE", null);
const checked = ref(false);

const goToMailDetail = (mail) => {
  router.push(`/center/message?mailid=${mail.id}&type=${mail.type}`);
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
            inboxData.value = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (inboxData.value.length > 0) {
            isAnnouncementModalVisible.value = true;
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
.header {
  background: linear-gradient(180deg, #00C7C0 0%, #0996C7 100%);
  color: #f8f8f8;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 520px;
  height: 48px;

  .header-icon {
    margin-left: 20px;
  }

  .close-icon {
    margin-left: auto;
    margin-right: 20px;
    cursor: pointer;
  }

  .header-title {
    font-family: Inter;
    font-weight: 500;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
  }
}

.content {
  background-color: #1E212D;
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  overflow-y: scroll;

  .item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-bottom: 1px solid #d7d7d7;
    justify-content: center;

    .content-title {
      display: flex;
      gap: 10px;
      font-family: 'PingFang SC';
      font-weight: 400;
      font-size: 18px;
      line-height: 20px;

      .title-label {
        display: flex;
        align-items: center;
        color: #fff;
        
        :deep(p) {
          margin: 0 !important;
        }
      }
    }

    .content-desc {
      font-family: 'PingFang SC';
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      padding: 0 10px;
      color: #fff;
    }

    input {
      display: none;
    }

    input:checked ~ .content-desc {
      max-height: 500px; /* Set a larger max-height to ensure smooth expansion */
      opacity: 1;
      padding: 10px;
    }

    .collapse-arrow {
      transition: transform 0.3s ease-in-out;
      color: #d9d9d9;
      font-size: 14px;
      margin-left: auto;
    }

    input:checked ~ .content-title .collapse-arrow {
      transform: rotate(90deg);
    }

    .read-status {
      background: #D9D9D9;
      color: #808080;
      width: 40px;
      height: 20px;
      border-radius: 4px;
      font-family: 'PingFang SC';
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
    }

    &.unread-status {
      .content-title {
        .title-label {
          color: #fff;
          font-weight: 700;

          &:after {
            content: "";
            width: 8px;
            height: 8px;
            background-color: red;
            border-radius: 50%;
            display: inline-block;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.actions {
  display: flex;
  justify-content: center;
  background-color: #1E212D;
  padding: 20px;

  .cs-btn, .redirect-btn {
    cursor: pointer;

    &:hover {
      filter: brightness(0.9);
    }

    &:active {
      transform: translateY(2px);
    }
  }

  .cs-btn {
    background: linear-gradient(180deg, #00C7C0 0%, #0996C7 100%);
    box-shadow: 0px 1px 2px 0px #FFFFFF inset;
    width: 230px;
    height: 40px;
    border-radius: 100px;
    gap: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
  }

  .redirect-btn {
    width: 480px;
    height: 41px;
    border-radius: 100px;
    background: linear-gradient(180deg, #52ACFF 0%, #3559DA 100%);
    width: 230px;
    height: 40px;
    border-radius: 100px;
    gap: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
  }
}

</style>
<style lang="scss">
.announcement-modal {
  background: transparent !important;

  .el-dialog__body {
    padding: 0;
    border-radius: 10px;
    overflow: hidden;

  }
}
</style>