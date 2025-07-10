<template>
  <div class="account-box account-contents">
    <Mail
      v-if="showMailId || showMailId === 0"
      :mail="showMailId ? mailboxState.mailboxList.inbox.list[showMailId] : mailboxState.mailboxList.inbox.list[0]"
      :closeMail="closeTheMail"
    />
    <template v-else>
      <div class="menu-title-container">
        <div class="menu-title">消息中心</div>
      </div>

      <div class="account-content mail mail-content">
        <el-tabs v-model="mailboxMessageTab" @tab-click="changeMailboxType" type="card">
          <el-tab-pane :key="index" :name="item.type" v-for="(item, index) in mailboxMessageTypeData">
            <template #label>
              <div class="mail-category-label">
                <!-- <div class="red-dot-icon" v-if="hasUnreadMessages(item.type)" /> -->
                <div class="red-dot-icon" v-if="unreadCount[item.type]" color="red">
                  {{ unreadCount[item.type] }}
                </div>
                <span>
                  {{ item.name }}
                </span>
              </div>
            </template>
            <template v-if="mailboxState.mailboxList.inbox.list.length > 0">
              <div class="mail-action-container">
                <div class="left">
                  <div v-if="isShowSelect" class="mail-action" @click="deleteMultipleMsg()">
                    <div><img src="../../assets/images/account/icon-maildelete.png" /></div>
                    删除
                  </div>
                  <div v-if="isShowSelect" class="mail-action" @click="readMultipleMsg()">
                    <div><img src="../../assets/images/account/icon-mailopen.png" /></div>
                    读取
                  </div>
                </div>
                <div class="right">
                  <div class="mail-action" @click="deleteAllMsg(item.type)">
                    <div><img src="../../assets/images/account/icon-maildelete.png" /></div>
                    全部删除
                  </div>
                  <div class="mail-action" @click="readAllMsg(item.type)">
                    <div><img src="../../assets/images/account/icon-mailopen.png" /></div>
                    全部已读
                  </div>

                  <el-switch v-model="isShowSelect" inline-prompt active-text="选择多个" inactive-text="选择多个" />
                </div>
              </div>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item
                  v-for="(item, index) in mailboxState.mailboxList.inbox.list"
                  :key="index"
                  @click="openMsg(item, index)"
                  class="mail-collapse-item"
                >
                  <template #title>
                    <div v-if="isShowSelect" class="mailbox-checkbox" @click.stop="">
                      <el-checkbox v-model="selectedIds[item.id]" size="large" />
                    </div>
                    <div v-if="item.readTime" class="read-badge">
                      <img src="../../assets/images/mail/read-mail.png" />
                    </div>
                    <div v-else class="read-badge">
                      <img src="../../assets/images/mail/unread-mail.png" />
                    </div>
                    <div class="title-wrapper">
                      <div
                        :class="`title-text ${item.readTime ? '' : 'unread'}`"
                        :title="item.title"
                        v-html="item.title"
                      ></div>
                      <div
                        v-if="item.sendTime"
                        class="send-time"
                        :title="`发送时间: ${moment(item.sendTime).format('YYYY-MM-DD HH:mm:ss')}`"
                      >
                        <i>{{ moment(item.sendTime).format("MM-DD") }}</i>
                      </div>
                    </div>
                  </template>
                  <div>
                    <div>
                      正文：
                      <div v-html="item.content.replace(/\n/g, '<br/>')"></div>
                    </div>
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
              <div
                class="no-record-text"
                style="display: flex; justify-content: center; align-items: center; height: 300px"
              >
                暂无记录
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import {
  mailInbox,
  mailOutbox,
  wirteMail,
  readAllMail,
  deleteAllMail,
  readMultipleMail,
  deleteMultipleMail,
  getUnreadTotal,
  readMail
} from "@/api/personal/mailbox";
import moment from "moment";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import Mail from "@/components/mailbox/Mail.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const notify = useNotify();

const loadingBtn = ref(false);
const mailboxData = ref([]);
const mailboxNotifyData = ref([]);
const isShowSelect = ref(false);
const selectedIds = ref({});
const store = userStore();
const showMailId = ref();
const router = useRouter();

const activeNames = ref();

const mailboxMessageTypeData = ref([
  { num: 1, type: "NOTIFICATION", name: "通知" },
  { num: 5, type: "MATCH", name: "赛事" },
  { num: 2, type: "ACTIVITY", name: "活动" },
  { num: 3, type: "ANNOUNCEMENT", name: "公告" },
  { num: 4, type: "PAYMENT", name: "充提" }
  // { num: 6, type: "ALL", name: "全部" }
  // { num: 5, type: "ALL", name: "全部" }
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

  // reset to page 1 when change tab
  changePage(1);
};

const closeTheMail = () => {
  showMailId.value = undefined;

  removeQueryParam();
};

const removeQueryParam = (queryParam) => {
  const { params, name } = router.currentRoute.value;

  // Create a new query object without the query parameter you want to remove
  const newQuery = {};

  router.replace({ name, params, query: newQuery });
};

const handleChange = () => {};

const mailboxNotifyState = reactive({
  NOTIFICATION: [],
  ACTIVITY: [],
  ANNOUNCEMENT: [],
  PAYMENT: [],
  MATCH: [],
  ALL: []
});
const mailboxState = reactive({
  active: "inbox",
  mailboxList: {
    inbox: {
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    write: {
      title: "",
      content: ""
    }
  }
});

const route = useRoute();

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

      if (isMailDetail.value) {
        // debugger;
        const mailIndex = mailboxNotifyState[mailboxMessageTab.value].findIndex(
          (mail) => mail.id === parseInt(route.query.mailid)
        );
        if (mailIndex > -1) {
          console.log(mailIndex);
          const mailItem = mailboxNotifyState[mailboxMessageTab.value].find(
            (mail) => mail.id === parseInt(route.query.mailid)
          );
          openMsg(mailItem, mailIndex);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const unreadCount = computed(() => {
  return Object.keys(mailboxNotifyState).reduce((result, key) => {
    if (key === "ALL") {
      result[key] = mailboxNotifyState[key].filter((item) => item.readTime === null).length;
    } else {
      result[key] = mailboxNotifyState[key].filter((item) => item.type === key && item.readTime === null).length;
    }
    return result;
  }, {});
});

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
  // debugger;
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
        } else {
          notify.error(res.message);
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
        } else {
          notify.error(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
        // message.error(error.message, 4)
      });
  }
};

const readAllMsg = (m) => {
  const readType = m === null ? "ALL" : m;
  mailboxNotifyState[readType].forEach((mail) => {
    mail.readTime = moment().format("YYYY-MM-DD");
  });

  readAllMail(m)
    .then((res) => {
      if (res.code === 0) {
        notify({
          message: "已全部已读",
          type: "success"
        });

        checkMailboxUnread();
        loadPersonalMailbox();
      } else {
        notify.error(res.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const isMailDetail = ref(false);
watch(
  () => route.query,
  () => {
    if (route.query && route.query.mailid) {
      isMailDetail.value = true;
    }
    if (route.query && route.query.type) {
      mailboxMessageType.value = route.query.type;
      mailboxMessageTab.value = route.query.type;
    }
  },
  { immediate: true }
);

const readMultipleMsg = () => {
  const selectedMessages = mailboxState.mailboxList.inbox.list.filter((m) => selectedIds.value[m.id]);
  const selectedIdsArray = selectedMessages.map((msg) => msg.id);
  const formattedIds = selectedIdsArray.join(",");

  // console.log(mailboxMessageTab.value);
  mailboxNotifyState[mailboxMessageTab.value].forEach((mail) => {
    if (formattedIds.indexOf(mail.id) > -1) {
      mail.readTime = moment().format("YYYY-MM-DD");
    }
  });

  readMultipleMail(formattedIds)
    .then((res) => {
      if (res.code === 0) {
        notify({
          message: "读取已选择的消息",
          type: "success"
        });

        checkMailboxUnread();
        loadPersonalMailbox();

        isShowSelect.value = false;
      } else {
        notify.error(res.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const openMsg = (mail, idx) => {
  console.log('here', mail, idx)
  const { id, readTime } = mail;

  showMailId.value = idx;
  // showMailId.value = id;
  mail.readTime = moment().format("YYYY-MM-DD");

  // console.log(mail);
  mailboxNotifyState[mailboxMessageTab.value].forEach((mail) => {
    if (mail.id === id) {
      mail.readTime = moment().format("YYYY-MM-DD");
    }
  });
  // console.log(mailboxNotifyState[mailboxMessageTab.value]);

  if (!readTime) {
    readMail({ id })
      .then((res) => {
        if (res.code === 0) {
          checkMailboxUnread();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const checkMailboxUnread = () => {
  getUnreadTotal()
    .then((res) => {
      const { code, data } = res;
      if (code === 0) {
        store.unreadTotal = data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteMultipleMsg = () => {
  const selectedMessages = mailboxState.mailboxList.inbox.list.filter((m) => selectedIds.value[m.id]);
  const selectedIdsArray = selectedMessages.map((msg) => msg.id);
  const formattedIds = selectedIdsArray.join(",");

  selectedIdsArray.forEach((delnum) => {
    let index = mailboxNotifyState[mailboxMessageTab.value].filter((obj) => obj.id == delnum);
    if (index !== -1) {
      mailboxNotifyState[mailboxMessageTab.value].splice(index, 1);
    }

    let index2 = mailboxNotifyState["ALL"].filter((obj) => obj.id == delnum);
    if (index2 !== -1) {
      mailboxNotifyState["ALL"].splice(index2, 1);
    }
  });

  deleteMultipleMail(formattedIds)
    .then((res) => {
      if (res.code === 0) {
        notify({
          message: "删除已选择的消息",
          type: "success"
        });

        isShowSelect.value = false;

        selectedMessages.forEach((msg) => {
          const index = mailboxState.mailboxList.inbox.list.findIndex((item) => item.id === msg.id);

          if (index !== -1) {
            mailboxState.mailboxList.inbox.list.splice(index, 1);
          }
        });

        Object.keys(selectedIds.value).forEach((key) => {
          selectedIds.value[key] = false;
        });

        checkMailboxUnread();
        loadPersonalMailbox();
      } else {
        notify.error(res.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteAllMsg = (m) => {
  const readType = m === null ? "ALL" : m;

  if (m === "ALL") {
    mailboxNotifyState.NOTIFICATION = [];
    mailboxNotifyState.ACTIVITY = [];
    mailboxNotifyState.ANNOUNCEMENT = [];
    mailboxNotifyState.PAYMENT = [];
    mailboxNotifyState.ALL = [];
  } else {
    mailboxNotifyState[readType] = [];
    mailboxNotifyState["ALL"] = mailboxNotifyState["ALL"].filter((item) => item.type !== m);
  }

  // if { type: "ALL" }, not needed to be passed as params
  const params = m === "ALL" ? undefined : m;

  deleteAllMail(params)
    .then((res) => {
      if (res.code === 0) {
        notify({
          message: "已删除全部消息",
          type: "success"
        });

        checkMailboxUnread();
        loadPersonalMailbox();
      } else {
        notify.error(res.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
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
            notify({
              message: "成功",
              type: "success"
            });
            loadPersonalMailbox();

            mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
          } else {
            notify.error(response.message);
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
  checkMailboxUnread();
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
});
</script>

<style scoped lang="scss">
:deep(.el-tabs__content) {
  overflow: unset;
}
.mail-content {
  overflow-wrap: break-word;
  .mailbox-checkbox {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .title-text {
    font-weight: normal;
    font-family: 'PingFang SC';
    max-height: 45px;

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
    box-shadow: 0px 0px 2.78px 0px #A9C9EA inset;
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

    .left,
    .right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .right {
      z-index: 101;
      position: absolute;
      right: 0;
      top: -50px;
    }

    .left,
    .right {
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
      // height: 10px;
      // width: 10px;
      padding: 1px 6px;
      background: #db0011;
      border-radius: 25px;
      margin-right: 5px;
      font-size: 10px;
      color: #fff;
    }
  }
}

.read-badge {
  width: 18px;
  height: 18px;
  //border-radius: 25px;
  text-align: center;
  //color: #fff;
  //background: #4086ff;
  //font-size: 10px;
  line-height: 18px;
  margin-right: 10px;

  img {
    width: 100%;
  }
}

.title-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;

  .title-text {
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    p {
      margin: 0px;
      margin-bottom: 0 !important;
    }
  }

  .send-time {
    font-size: 0.8rem;
    font-weight: 400;
    margin: 0 10px;
  }
}

.dark {
  .no-record-text {
    color: #fff;
  }

  .menu-title {
    color: $color-white;
  }

  .mail-content {
    &:deep(.el-collapse) {
      .el-collapse-item__header {
        background: $background-content-block-lighter-dark;
        color: $font-0;
      }
    }
  }
}

.title-text {
  p {
    margin-bottom: 0;
    margin-top: 0px;
  }
}
</style>

<style lang="scss">
.mail-collapse-item {
  .el-collapse-item__title {
    display: flex;
    align-items: center;
  }
}

.title-text {
  p {
    margin: 0px;
    line-height: 45px;
  }
}
</style>
