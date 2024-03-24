<template>
  <div class="account-box account-contents">
    <div class="menu-title-container">
      <div class="menu-title">{{ t('menu.mailbox') }}</div>
    </div>
    <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange">
      <el-tab-pane name="inbox" :label="t('mail.inbox')">
        <el-collapse v-if="mailboxState.mailboxList.inbox.list.length > 0" v-model="activeNames" @change="handleChange" accordion>
          <el-collapse-item v-for="mail in mailboxState.mailboxList[mailboxState.active].list" :title="mail.title" :name="mail.id">
            {{ mail.content }}
          </el-collapse-item>
        </el-collapse>
        <div v-else><emptyData /></div>
      </el-tab-pane>
      <el-tab-pane name="outbox" :label="t('mail.outbox')">
        <el-collapse v-if="mailboxState.mailboxList.outbox.list.length > 0" v-model="activeNames" @change="handleChange" accordion>
          <el-collapse-item v-for="mail in mailboxState.mailboxList[mailboxState.active].list" :title="mail.title" :name="mail.id">
            {{ mail.content }}
          </el-collapse-item>
        </el-collapse>
        <div v-else><emptyData /></div>
      </el-tab-pane>
      <el-tab-pane class="write" name="write" :label="t('mail.write')">
        <el-form label-width="100px">
          <el-form-item prop="title" :label="t('mail.title')">
            <el-input :placeholder="t('placeholder.title')" v-model="mailboxState.mailboxList.write.title" />
          </el-form-item>
          <el-form-item prop="content" :label="t('mail.content')">
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="t('placeholder.content')"
            v-model="mailboxState.mailboxList.write.content">
          </el-input>
          </el-form-item>
          <div class="btn-container">
          <button @click="resetFields" type="button" class="standard-button">{{ $t('common.clear') }}</button>
          <button @click="onSubmit" type="submit"  class="standard-button btn-color-blue">{{ $t('common.submit') }}</button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  mailInbox,
  mailOutbox,
  wirteMail,
} from "@/api/personal/mailbox";
import moment from "moment";
import { ElMessage } from "element-plus";
import { userStore } from "@/store";
import { useI18n } from 'vue-i18n';
import  emptyData from '@/components/emptyData.vue'
components: {
  emptyData
}
const { t } =  useI18n();
const loadingBtn = ref(false);
const mailboxData = ref([]);
const mailboxNotifyData = ref([]);
const activeNames = ref();


const handleChange= () => {

}

const mailboxState = reactive({
  active: "inbox",
  mailboxList: {
    inbox: {
      list: [],
      pageNum: 1,
      pageSize: 5,
      total: 0
    },
    outbox: {
      list: [],
      pageNum: 1,
      pageSize: 5,
      total: 0
    },
    write: {
      title: "",
      content: ""
    }
  }
});



const loadPersonalMailbox = () => {
  mailboxState.mailboxList[mailboxState.active].list = [];
  if (mailboxState.active === "inbox") {
    mailboxData.value = {
      type: null,
      current: mailboxState.mailboxList[mailboxState.active].pageNum,
      size: mailboxState.mailboxList[mailboxState.active].pageSize,
      orderBy: "sendTime"
    };
    mailInbox(mailboxData.value)
      .then((res) => {
        if (res.code === 0) {
          const response = res.data;
          mailboxState.mailboxList[mailboxState.active].list.push(...response.records);
          mailboxState.mailboxList[mailboxState.active].total = response.total;
        } else {
          ElMessage.error(res.message)
        }
      })
      .catch((error) => {
        console.log(error);
        // message.error(error.message, 4)
      });
  } else {
    mailboxData.value = {
      type: null,
      current: mailboxState.mailboxList[mailboxState.active].pageNum,
      size: mailboxState.mailboxList[mailboxState.active].pageSize,
      orderBy: "createTime"
    };
    mailOutbox(mailboxData.value)
      .then((response) => {
        if (response.code === 0) {
          mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
          mailboxState.mailboxList[mailboxState.active].total = response.data.total;
        } else {
          ElMessage.error(response.message)
        }
      })
      .catch((error) => {
        console.log(error);
        // message.error(error.message, 4)
      });
  }
};
const mailTabChange = (nk) => {
  console.log(nk)
  mailboxState.active = nk.props.name;
  if (nk.props.name !== "write") {
    const mailList = mailboxState.mailboxList[nk.props.name].list;
    if (mailList.length === 0) {
      loadPersonalMailbox();
    }
  }
};

const formRef = ref();
const rules = {
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur"
    },
    {
      max: 255,
      message: "长度为 255",
      trigger: "change"
    }
  ],
  content: [
    {
      required: true,
      message: "请输入内容",
      trigger: "blur"
    },
    {
      max: 500,
      message: "长度应少过 500 字",
      trigger: "change"
    }
  ]
};
const onSubmit = (e) => {
  e.preventDefault();
  loadingBtn.value = true;
  formRef.value
    .validate()
    .then(() => {
      wirteMail(mailboxState.mailboxList.write)
        .then((response) => {
          if (response.code === 0) {
            ElMessage({
              message: "成功",
              type: "success"
            });
            loadPersonalMailbox();

            mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
          } else {
            ElMessage.error(response.message)
            // message.error(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
          // message.error(error.message, 4)
        });
    })
    .catch((error) => {
      console.log(error);
      // message.error(error.message, 4)
    });
  loadingBtn.value = false;
};
const resetFields = (e) => {
  
  mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
}

onMounted(() => {
  loadPersonalMailbox();
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
});
</script>

<style scoped lang="scss">
.write {
  
  :deep(.el-form-item) {
    flex-direction: row;
  }
}
.btn-container {
  display: flex;
  gap:10px;
}
:deep(.el-collapse) {
  .el-collapse-item__header {
    background: #F7F8FB;
    border-bottom: 0;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 0 10px;
    color:#7A80A1;
    font-weight: 600;
    height: 40px;
  }
}
.mail-content {
  .mailbox-checkbox {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .title-text {
    font-weight: normal;

    &.unread {
      font-weight: bold;
    }
  }

  :deep(.el-collapse-item__header) {
    background: #f7f8fb;
    color: $font-1;
    border-radius: 10px;
    margin-bottom: 12px;
    padding: 0 16px;
    font-weight: 600;
    color: $font-1;
    font-size: 1rem;
  }

  :deep(.el-collapse-item__content) {
    padding: 0 16px 16px;
    color: $font-1;
    font-size: 0.875rem;
  }

  :deep(.el-collapse-item__wrap),
  :deep(.el-collapse-item__header),
  :deep(.el-collapse) {
    border-bottom: 0px;
  }

  .mail-action-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
    margin-top: 10px;

    .left, .right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .left, .right {
      .mail-action {
        display: flex;
        align-items: center;
        gap: 6px;
        line-height: 1;
        color: $font-1;
        cursor: pointer;

        &:hover {
          filter: brightness(0.8);
        }

        img {
          display: block;
          width: 17px;
        }
      }
    }
  }

  .mail-input-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;

    .input-title-container {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .input-title {
      font-size: 1rem;
      color: #424f72;
    }

    .input-fill {
      :deep(.el-form-item__label) {
        width: 80px;
      }

      :deep(.el-input__wrapper) {
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
        border-radius: 10px;
        background: #f7f8fb;
        height: 42px;
      }

      :deep(.el-textarea__inner) {
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
        border-radius: 10px;
        background: #f7f8fb;
      }
    }
  }

  .mail-btn-group {
    display: flex;
    justify-content: flex-end;
  }

  .mail-pagination-wrapper {
    margin-top: 20px;
  }

  .mail-category-label {
    display: flex;
    align-items: center;

    .red-dot-icon {
      height: 10px;
      width: 10px;
      background: #db0011;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
}

.read-badge{
  width: 35px;
  height: 16px;
  border-radius: 25px;
  text-align: center;
  color:#fff;
  background: #4086ff;
  font-size: 10px;
  line-height: 16px;
  margin-right: 10px;
}
</style>
