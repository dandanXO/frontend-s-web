<template>
  <div>
    <!-- <div class="menu-title-container">
      <span class="menu-title">收发信息</span>
    </div> -->
    <div class="account-content mail">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
        <el-tab-pane key="inbox" name="inbox" :label="'消息中心'">
          <div>
            <el-tabs v-model="mailboxMessageTab" type="card" @tab-click="changeMailboxType">
              <el-tab-pane
                v-for="(item, index) in mailboxMessageTypeData"
                :key="index"
                :label="item.name"
                :name="item.type"
              >
                <template v-if="mailboxState.mailboxList.inbox.list.length > 0">
                  <div class="quick-btn">
                    <el-button type="primary" @click="readAllMsg(mailboxMessageType)">
                      <el-icon><MessageBox /></el-icon>
                      全部已读
                    </el-button>
                    <el-button color="grey" @click="deleteAllMsg(mailboxMessageType)">
                      <el-icon><Delete /></el-icon>
                      全部删除
                    </el-button>
                  </div>

                  <div class="mailbox-list">
                    <template v-for="(m, mi) in mailboxState.mailboxList.inbox.list" :key="m.id">
                      <div :class="`mailbox-item`" @click="openMsg(m)">
                        <div class="mailbox-preview">
                          <div :class="`mailbox-title ${m.readTime ? 'read' : 'unread'}`">{{ m.title }}</div>
                          <ArrowDown :class="`mailbox-accordion ${m.isOpen ? 'open' : ''}`"></ArrowDown>
                        </div>
                      </div>
                      <div :class="`mailbox-content-wrapper ${m.isOpen ? 'open' : ''}`">
                        <div class="mailbox-content" v-html="m.content || '加载中...'"></div>
                        <div class="mailbox-date">
                          <el-icon><Calendar /></el-icon>
                          <div>{{ new Date(m.sendTime).toLocaleString("zh-CN") }}</div>
                          <el-icon class="delete-btn"><Delete @click="deleteMsg(m.id, mi)" /></el-icon>
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

            <!-- <div class="quick-btn">
              <el-button type="primary" @click="readAllMsg(mailboxMessageType)">
                <el-icon><MessageBox /></el-icon>
                全部已读
              </el-button>
              <el-button color="grey" @click="deleteAllMsg()">
                <el-icon><Delete /></el-icon>
                全部删除
              </el-button>
            </div> -->

            <!-- <pre>{{ mailboxState.mailboxList.inbox.list }}</pre> -->

            <!-- <div class="mailbox-list">
              <template v-for="(m, mi) in mailboxState.mailboxList.inbox.list" :key="m.id">
                <div :class="`mailbox-item`" @click="openMsg(m)">
                  <div class="mailbox-preview">
                    <div :class="`mailbox-title ${m.readTime ? 'read' : 'unread'}`">{{ m.title }}</div>
                    <ArrowDown :class="`mailbox-accordion ${m.isOpen ? 'open' : ''}`"></ArrowDown>
                  </div>
                </div>
                <div :class="`mailbox-content-wrapper ${m.isOpen ? 'open' : ''}`">
                  <div class="mailbox-content" v-html="m.content || '加载中...'"></div>
                  <div class="mailbox-date">
                    <el-icon><Calendar /></el-icon>
                    <div>{{ new Date(m.sendTime).toLocaleString("zh-CN") }}</div>
                    <el-icon class="delete-btn"><Delete @click="deleteMsg(m.id, mi)" /></el-icon>
                  </div>
                </div>
              </template>
            </div> -->
            <!-- <div class="pagination-wrapper">
              <el-pagination
                @current-change="changePage"
                :total="mailboxState.mailboxList.inbox.total"
                :current-page="mailboxState.mailboxList.inbox.pageNum"
                :page-size="mailboxState.mailboxList.inbox.pageSize"
              />
            </div> -->
          </div>
          <!-- <div style="display: flex; justify-content: center; align-items: center; height: 300px" v-else>暂无记录</div> -->
        </el-tab-pane>
      </el-tabs>
    </div>
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
      <el-icon><Calendar /></el-icon>
      <div>{{ mailboxState.mailboxList.inbox.list.sendTime }}</div>
    </div>

    <div class="msg-button">
      <el-button type="primary" @click="msgModalVisible = false">确认</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { mailInbox, mailOutbox, wirteMail, readMail, readAllMail, deleteAllMail } from "@/api/personal/mailbox";
// import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import { Calendar, Delete, MessageBox, ArrowDown } from "@element-plus/icons-vue";

const loadingBtn = ref(false);
const mailboxData = ref([]);
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
        console.log(res);
        // if (res.code === 0) {
        //   const response = res.data;
        //   mailboxState.mailboxList[mailboxState.active].list.push(...response.records);
        //   mailboxState.mailboxList[mailboxState.active].total = response.total;
        // }
        const response = res;
        mailboxState.mailboxList[mailboxState.active].list.push(...response.records);
        mailboxState.mailboxList[mailboxState.active].total = response.total;
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

const msgModalVisible = ref(false);
const msgTitleTxt = ref();
const msgContentTxt = ref();
const msgDateTxt = ref();

// const openMsg = (m) => {
//   msgModalVisible.value = true;
//   msgTitleTxt.value = m.title;
//   msgContentTxt.value = m.content;
//   msgDateTxt.value = m.sendTime;
// }

const openMsg = (m) => {
  const { id } = m;

  if (m.isOpen === undefined) m.isOpen = false;
  m.isOpen = !m.isOpen;
  m.readTime = true;

  // if (!m.content) {
  readMail({ id })
    .then((res) => {
      const { code, data } = res;

      // console.log(id, "#$%#^%$^%$^");
      // if (code === 0) m.content = data.content;
    })
    .catch((error) => {
      console.log(error);
    });
  // }
};

const readAllMsg = (m) => {
  readAllMail(m)
    .then((res) => {
      if (res.code === 0) {
        ElMessage({
          message: "已全读部消息",
          type: "success"
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteAllMsg = (m) => {
  deleteAllMail(m)
    .then((res) => {
      if (res.code === 0) {
        ElMessage({
          message: "已删除全部消息",
          type: "success"
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  loadPersonalMailbox();
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
});

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
const onSubmit = () => {
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

    .quick-btn {
      margin: 0 0 18px 0;

      i {
        margin: 0 5px 0 0;
      }
    }
    .mailbox-list {
      min-height: 450px;
      font-size: 14px;

      .mailbox-item,
      .mailbox-content-wrapper {
        margin-bottom: 10px;
        padding: 0 15px;
      }

      .mailbox-item {
        position: relative;
        overflow: visible;
        padding: 10px 15px;
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
</style>
