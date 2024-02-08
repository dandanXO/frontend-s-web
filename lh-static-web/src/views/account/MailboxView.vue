<template>
  <div class="account-box account-contents">
    <div class="menu-title-container">
      <div class="menu-title">消息中心</div>
    </div>

    <div class="account-content mail mail-content">
      <el-tabs v-model="mailboxMessageTab" @tab-click="changeMailboxType" type="card">
        <el-tab-pane :key="index" :name="item.type" v-for="(item, index) in mailboxMessageTypeData">
          <template #label>
            <div class="mail-category-label">
              <div class="red-dot-icon" v-if="hasUnreadMessages(item.type)" />
              <span>
                    {{ item.name }}
                  </span>
            </div>
          </template>
          <template v-if="mailboxState.mailboxList.inbox.list.length > 0">
            <div class="mail-action-container">
              <div class="mail-action">
                <div><img src="../../assets/images/account/icon-maildelete.png" /></div>
                全部删除
              </div>
              <div class="mail-action">
                <div><img src="../../assets/images/account/icon-mailopen.png" /></div>
                全部已读
              </div>
            </div>
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item v-for="item in mailboxState.mailboxList.inbox.list" :key="item.id">
                <template #title>标题：{{ item.title }}</template>
                <div>
                  <div>正文：{{ item.content }}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div class="mail-pagination-wrapper">
              <el-pagination
                @current-change="changePage"
                :total="mailboxState.mailboxList.inbox.total"
                :current-page="mailboxState.mailboxList.inbox.pageNum"
                :page-size="mailboxState.mailboxList.inbox.pageSize"
              />
            </div>
          </template>

          <template v-else>
            <div style="display: flex; justify-content: center; align-items: center; height: 300px">暂无记录</div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { mailInbox, mailOutbox, wirteMail } from "@/api/personal/mailbox";
// import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";

const loadingBtn = ref(false);
const mailboxData = ref([]);
const mailboxNotifyData = ref([]);
// const mailboxMessageType = ref(["NOTIFICATION", "ACTIVITY", "ANNOUNCEMENT", "PAYMENT"]);
const mailboxMessageTypeData = ref([
  { num: 1, type: "NOTIFICATION", name: "通知" },
  { num: 2, type: "ACTIVITY", name: "活动" },
  { num: 3, type: "ANNOUNCEMENT", name: "公告" },
  { num: 4, type: "PAYMENT", name: "充提" },
  { num: 5, type: "ALL", name: "全部" }
]);
const mailboxMessageType = ref(mailboxMessageTypeData.value[0].type);
const mailboxMessageTab = ref(mailboxMessageTypeData.value[0].type);
const changeMailboxType = (nk) => {
  mailboxMessageTab.value = nk.props.name;

  if (mailboxMessageTab.value === "ALL") {
    mailboxMessageType.value = null;
  } else {
    mailboxMessageType.value = nk.props.name;
  }

  loadPersonalMailbox();
};

const mailboxNotifyState = reactive({
  NOTIFICATION: [],
  ACTIVITY: [],
  ANNOUNCEMENT: [],
  PAYMENT: [],
  ALL: []
});
const mailboxState = reactive({
  active: "inbox",
  mailboxList: {
    inbox: {
      list: [],
      pageNum: 1,
      pageSize: 4,
      total: 0
    },
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 4,
      total: 0
    },
    write: {
      title: "",
      content: ""
    }
  }
});

const loadNotifyMailbox = () => {
  mailboxNotifyData.value = {
    type: null,
    orderBy: "sendTime",
    current: 1,
    size: 20,
    messageType: null
  };
  mailInbox(mailboxNotifyData.value)
    .then((res) => {
      const response = res.data;
      mailboxNotifyState.value = response.records;

      response.records.forEach((record) => {
        var type = record.type;
        mailboxNotifyState[type].push(record);
        mailboxNotifyState["ALL"].push(record);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const hasUnreadMessages = (type) => {
  if (type === "ALL") {
    return mailboxNotifyState["ALL"].some((item) => item.readTime === null);
  }
  return mailboxNotifyState[type].some((item) => item.type === type && item.readTime === null);
};

const isAnyReadTimeNull = (mailboxList) => {
  return mailboxList.inbox.list.some((item) => item.readTime === null);
};


const loadPersonalMailbox = () => {
  mailboxState.mailboxList[mailboxState.active].list = [];
  if (mailboxState.active === "inbox") {
    mailboxData.value = {
      type: null,
      current: mailboxState.mailboxList[mailboxState.active].pageNum,
      size: mailboxState.mailboxList[mailboxState.active].pageSize,
      orderBy: "sendTime",
      messageType: mailboxMessageType.value
    };
    mailInbox(mailboxData.value)
      .then((res) => {
        if (res.code === 0) {
          const response = res.data;
          mailboxState.mailboxList[mailboxState.active].list.push(...response.records);
          mailboxState.mailboxList[mailboxState.active].total = response.total;
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
      orderBy: "createTime",
      messageType: mailboxMessageType.value
    };
    mailOutbox(mailboxData.value)
      .then((response) => {
        if (response.code === 0) {
          mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
          mailboxState.mailboxList[mailboxState.active].total = response.data.total;
        }
      })
      .catch((error) => {
        console.log(error);
        // message.error(error.message, 4)
      });
  }
};

const changePage = (key) => {
  mailboxState.mailboxList[mailboxState.active].pageNum = key;
  loadPersonalMailbox();
};

const mailTabChange = (nk) => {
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

onMounted(() => {
  loadPersonalMailbox();
  loadNotifyMailbox();
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
});
</script>

<style scoped lang="scss">
.mail-content {
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
    justify-content: flex-end;
    gap: 20px;
    margin-bottom: 20px;
    margin-top: 10px;
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
</style>
