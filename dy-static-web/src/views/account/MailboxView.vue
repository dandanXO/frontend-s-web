<template>
  <div>
    <Mail
      v-if="showMailId || showMailId === 0"
      :mail="showMailId ? mailboxState.mailboxList.inbox.list[showMailId] : mailboxState.mailboxList.inbox.list[0]"
      :closeMail="closeTheMail"
    />
    <!-- <div class="menu-title-container">
      <span class="menu-title">收发信息</span>
    </div> -->
    <template v-else>
      <div class="account-content mail">
        <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
          <el-tab-pane key="inbox" name="inbox" :label="'消息中心'">
            <div>
              <el-tabs v-model="mailboxMessageTab" type="card" @tab-click="changeMailboxType">
                <el-tab-pane v-for="(item, index) in mailboxMessageTypeData" :key="index" :name="item.type">
                  <template #label>
                    <span class="mailTab-label">
                      <div class="red-dot-icon" v-if="hasUnreadMessages(item.type)" />
                      <span>
                        {{ item.name }}
                      </span>
                    </span>
                  </template>

                  <template v-if="mailboxState.mailboxList.inbox.list.length > 0">
                    <div class="quick-btn">
                      <el-button type="primary" @click="readAllMsg(mailboxMessageType)">
                        <el-icon>
                          <MessageBox />
                        </el-icon>
                        全部已读
                      </el-button>
                      <el-button color="grey" @click="deleteAllMsg(mailboxMessageType)">
                        <el-icon>
                          <Delete />
                        </el-icon>
                        全部删除
                      </el-button>
                      <div style="margin-left: auto">
                        <el-button v-if="hasMailSelected && isShowSelect" type="primary" @click="readMultipleMsg()">
                          <el-icon>
                            <MessageBox />
                          </el-icon>
                          读取
                        </el-button>

                        <el-button v-if="hasMailSelected && isShowSelect" color="grey" @click="deleteMultipleMsg()">
                          <el-icon>
                            <Delete />
                          </el-icon>
                          删除
                        </el-button>

                        <el-switch
                          v-model="isShowSelect"
                          inline-prompt
                          active-text="选择多个"
                          inactive-text="选择多个"
                          style="margin-left: 16px"
                        />
                      </div>
                    </div>

                    <div class="mailbox-list" :class="isShowSelect && 'select-state'">
                      <template v-for="(m, mi) in mailboxState.mailboxList.inbox.list" :key="m.id">
                        <div :class="`mailbox-item`" @click="openMsg(m, mi)">
                          <div class="mailbox-preview">
                            <div :class="`mailbox-title ${m.readTime ? 'read' : 'unread'}`">
                              <img src="../../assets/images/mail/read-mail.png" v-if="m.readTime" />
                              <img src="../../assets/images/mail/unread-mail.png" v-else />
                              <div v-html="m.title" />
                            </div>
                            <ArrowDown :class="`mailbox-accordion ${m.isOpen ? 'open' : ''}`"></ArrowDown>
                          </div>

                          <div v-if="isShowSelect" class="mailbox-checkbox">
                            <el-checkbox @click.stop v-model="selectedIds[m.id]" size="large" />
                          </div>
                        </div>

                        <div :class="`mailbox-content-wrapper ${m.isOpen ? 'open' : ''}`">
                          <div class="mailbox-content" v-html="m.content.replace(/\n/g, '<br/>') || '加载中...'"></div>
                          <div class="mailbox-date">
                            <el-icon>
                              <Calendar />
                            </el-icon>
                            <div>{{ new Date(m.sendTime).toLocaleString("zh-CN") }}</div>
                            <el-icon class="delete-btn">
                              <Delete @click="deleteMsg(m.id, mi)" />
                            </el-icon>
                          </div>
                        </div>
                      </template>
                    </div>

                    <div class="pagination-wrapper">
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>

  <el-dialog
    v-model="msgModalVisible"
    :footer="null"
    width="600px"
    :title="'标题: ' + msgTitleTxt"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="msg-content">
      <div class="content-title">内容:</div>
      <div class="content-txt">
        {{ msgContentTxt }}
      </div>
    </div>

    <div class="msg-date">
      <el-icon>
        <Calendar />
      </el-icon>
      <div>{{ mailboxState.mailboxList.inbox.list.sendTime }}</div>
    </div>

    <div class="msg-button">
      <el-button type="primary" @click="msgModalVisible = false">确认</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import {
  mailInbox,
  clearMailInboxCache,
  mailOutbox,
  readMail,
  readMultipleMail,
  readAllMail,
  deleteMail,
  deleteMultipleMail,
  deleteAllMail,
  getUnreadMailTotal
} from "@/api/personal/mailbox";
import { ElMessage } from "element-plus";
import { Calendar, Delete, MessageBox, ArrowDown, Check } from "@element-plus/icons-vue";
import moment from "moment";
import { userStore } from "@/store";
import Mail from "@/components/mailbox/Mail.vue";
import { useRoute, useRouter } from "vue-router";

const loadingBtn = ref(false);
const mailboxData = ref([]);
const mailboxNotifyData = ref([]);
// const mailboxMessageType = ref(["NOTIFICATION", "ACTIVITY", "ANNOUNCEMENT", "PAYMENT"]);
const mailboxMessageTypeData = ref([
  { num: 1, type: "NOTIFICATION", name: "通知" },
  { num: 5, type: "MATCH", name: "赛事" },
  { num: 2, type: "ACTIVITY", name: "活动" },
  { num: 3, type: "ANNOUNCEMENT", name: "公告" },
  { num: 4, type: "PAYMENT", name: "充提" }
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

const mailboxNotifyState = reactive({
  NOTIFICATION: [],
  ACTIVITY: [],
  ANNOUNCEMENT: [],
  PAYMENT: [],
  MATCH: [],
  ALL: []
});
const hasMailSelected = computed(() => Object.values(selectedIds.value).includes(true));
const mailboxState = reactive({
  active: "inbox",
  mailboxList: {
    inbox: {
      list: [],
      pageNum: 1,
      pageSize: 20,
      total: 0
    },
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 20,
      total: 0
    },
    write: {
      title: "",
      content: ""
    }
  }
});

const route = useRoute();
const router = useRouter();

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
      const response = res;
      mailboxNotifyState.value = response.records;

      response.records.forEach((record) => {
        var type = record.type;
        mailboxNotifyState[type].push(record);
        mailboxNotifyState["ALL"].push(record);
      });

      console.log(mailboxNotifyState);
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

const hasUnreadMessages = (type) => {
  if (type === "ALL") {
    return mailboxNotifyState["ALL"].some((item) => item.readTime === null);
  }
  return mailboxNotifyState[type].some((item) => item.type === type && item.readTime === null);
};

const isAnyReadTimeNull = (mailboxList) => {
  return mailboxList.inbox.list.some((item) => item.readTime === null);
};

const shouldDisplayTrue = ref(false);

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
        const response = res;
        mailboxState.mailboxList[mailboxState.active].list.push(...response.records);
        mailboxState.mailboxList[mailboxState.active].total = response.total;

        // Check if readTime is null
        shouldDisplayTrue.value = isAnyReadTimeNull(mailboxState.mailboxList);
      })
      .catch((error) => {
        console.log(error);
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

const store = userStore();
const msgModalVisible = ref(false);
const msgTitleTxt = ref();
const msgContentTxt = ref();
const msgDateTxt = ref();
const showMailId = ref();

const openMsg = (m, idx) => {
  const { id, readTime } = m;

  showMailId.value = idx;

  mailboxNotifyState[mailboxMessageTab.value].forEach((mail) => {
    if (mail.id === id) {
      mail.readTime = moment().format("YYYY-MM-DD");
    }
  });

  // if (m.isOpen === undefined) m.isOpen = false;
  // m.isOpen = !m.isOpen;
  m.readTime = true;

  // if (!m.content) {
  readMail({ id })
    .then((res) => {
      const { code, data } = res;

      clearMailInboxCache();
      checkMailboxUnread();
      // loadPersonalMailbox();
      // if (code === 0) m.content = data.content;
    })
    .catch((error) => {
      console.log(error);
    });
  // }
};

const checkMailboxUnread = () => {
  getUnreadMailTotal()
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

const readAllMsg = (m) => {
  const readType = m === null ? "ALL" : m;
  mailboxNotifyState[readType].forEach((mail) => {
    mail.readTime = moment().format("YYYY-MM-DD");
  });

  readAllMail(m)
    .then((res) => {
      if (res.code === 0) {
        ElMessage({
          message: "已全部已读",
          type: "success"
        });

        checkMailboxUnread();
        clearMailInboxCache();
        loadPersonalMailbox();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteMsg = (id, spliceIndex, callback) => {
  deleteMail({ id })
    .then((res) => {
      const { code } = res;
      if (code === 0) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });

        if (spliceIndex !== null) mailboxState.mailboxList[mailboxState.active].list.splice(spliceIndex, 1); // fake delete

        clearMailInboxCache();
        checkMailboxUnread();
        loadPersonalMailbox();

        callback && callback();
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
    mailboxNotifyState.MATCH = [];
    mailboxNotifyState.ALL = [];
  } else {
    mailboxNotifyState[readType] = [];
    mailboxNotifyState["ALL"] = mailboxNotifyState["ALL"].filter((item) => item.type !== m);
  }

  deleteAllMail(m)
    .then((res) => {
      if (res.code === 0) {
        ElMessage({
          message: "已删除全部消息",
          type: "success"
        });

        checkMailboxUnread();
        clearMailInboxCache();
        loadPersonalMailbox();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const selectedIds = ref({});
// const checkedCheckboxCount = computed(() => {
//   return Object.values(selectedIds.value).filter((val) => val).length;
// });

const isShowSelect = ref(false);

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

  mailboxNotifyState[mailboxMessageTab.value].forEach((mail) => {
    if (formattedIds.indexOf(mail.id) > -1) {
      mail.readTime = moment().format("YYYY-MM-DD");
    }
  });

  readMultipleMail(formattedIds)
    .then((res) => {
      if (res.code === 0) {
        ElMessage({
          message: "读取已选择的消息",
          type: "success"
        });

        clearMailInboxCache();
        checkMailboxUnread();
        loadPersonalMailbox();

        isShowSelect.value = false;
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
        ElMessage({
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

        clearMailInboxCache();
        checkMailboxUnread();
        loadPersonalMailbox();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  loadPersonalMailbox();
  loadNotifyMailbox();
  checkMailboxUnread();
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
});
</script>

<style scoped lang="scss">
.account-container {
  .account-content-wrapper {
    .account-content.mail {
      min-height: 740px;
      margin-bottom: 0;
      padding: 0;

      .ant-form.ant-form-horizontal .ant-form-item .ant-form-item-control-input-content .ant-input {
        background: #16151c;
      }

      :deep(.ant-form-horizontal .ant-form-item-label) {
        text-align: left;
      }

      :deep(.ant-tabs-tabpane) {
        padding: 20px;
      }
    }

    .pagination-wrapper {
      text-align: center;
      padding-top: 20px;
    }

    :deep(.ant-tabs-nav .ant-tabs-tab) {
      font-size: 16px;
    }

    :deep(.ant-tabs-nav .ant-tabs-tabpane) {
      padding: 20px 30px;
    }

    .mailTab-label {
      display: flex;
      align-items: center;
    }

    .quick-btn {
      margin: 0 0 18px 0;
      display: flex;

      i {
        margin: 0 5px 0 0;
      }
    }

    .mailbox-list {
      min-height: 450px;
      font-size: 14px;
      width: 100%;
      transition: 0.3s all;

      &.select-state {
        width: calc(100% - 50px);
      }

      .mailbox-item,
      .mailbox-content-wrapper {
        margin-bottom: 8px;
        padding: 0 15px;
      }

      .mailbox-checkbox {
        position: absolute;
        right: -20px;
        top: 0;
      }

      .mailbox-item {
        position: relative;
        overflow: visible;
        padding: 15px;
        text-align: left;
        transition: all 0.3s;
        background: #f7f8fb;
        cursor: pointer;
        border-radius: 10px;

        &:hover {
          background: #eeeeee;
        }

        .mailbox-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .mailbox-title {
            font-size: 14px;
            line-height: 14px;
            color: #7a80a1;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'PingFang SC';

            :deep(p) {
              margin: 0 !important;
            }

            &.read {
            }

            &.unread {
              font-weight: bold;
            }
          }

          .mailbox-accordion {
            width: 15px;
            transform: rotate(-90deg);
            transition: 0.3s;

            &.open {
              transform: rotate(0);
            }
          }
        }
      }

      .mailbox-content-wrapper {
        max-height: 0;
        overflow: hidden;
        transition: 0.5s;
        color: #7a80a1;

        &.open {
          max-height: 100px;
        }

        .mailbox-content {
          width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
          word-break: break-word;
        }

        .mailbox-date {
          text-align: right;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;

          .delete-btn {
            margin: 0 0 0 10px;
            cursor: pointer;
          }
        }
      }
    }

    .mail-txtarea {
      height: 180px;
    }

    .write-btn {
      width: 300px;
      height: 50px;
      font-size: 18px;
      line-height: 50px;
      border: none;
      background-color: #ffd800;
      cursor: pointer;
    }
  }
}

.msg-content {
  display: flex;
  gap: 20px;
}

.msg-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.content-title {
  min-width: 40px;
  font-size: 16px;
}

.content-txt {
  font-size: 16px;
}

.msg-date {
  margin-top: 20px;
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  color: #a1a1a1;
}

.red-dot-icon {
  height: 10px;
  width: 10px;
  background: #db0011;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
