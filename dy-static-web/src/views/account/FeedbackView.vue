<template>
  <div>
    <!-- <div class="menu-title-container">
      <span class="menu-title">收发信息</span>
    </div> -->
    <div class="account-content mail">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
        <el-tab-pane key="sent" name="sent" :label="'我的反馈'">
          <div v-if="mailboxState.mailboxList.sent.list.length > 0">
            <div class="quick-btn">
              <el-button type="primary" @click="readAllMsg()">
                <el-icon><MessageBox /></el-icon>
                全部已读
              </el-button>
              <el-button color="grey" @click="deleteAllMsg()">
                <el-icon><Delete /></el-icon>
                全部删除
              </el-button>
            </div>

            <div class="mailbox-list">
              <template v-for="m in mailboxState.mailboxList.sent.list" :key="m.id">
                <div :class="`mailbox-item ${m.readTime ? 'read' : 'unread'}`" @click="openMsg(m)">
                  <div class="mailbox-title">{{ m.title }}</div>
                  <!-- <div class="mailbox-content" v-html="m.content"></div> -->
                  <div class="mailbox-date">
                    <el-icon><Calendar /></el-icon>
                    <div>{{ new Date(m.sendTime).toLocaleString("zh-CN") }}</div>
                  </div>
                </div>
              </template>
            </div>
            <div class="pagination-wrapper" :class="{ hidden: mailOpened }">
              <el-pagination
                @current-change="changePage"
                :total="mailboxState.mailboxList[mailboxState.active].total"
                :current-page="mailboxState.mailboxList[mailboxState.active].pageNum"
                :page-size="mailboxState.mailboxList[mailboxState.active].pageSize"
              />
            </div>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; height: 300px" v-else>暂无记录</div>
        </el-tab-pane>

        <el-tab-pane name="write" :label="'意见反馈'">
          <div>
            <el-form
              ref="formRef"
              hideRequiredMark="true"
              :model="mailboxState.mailboxList.write"
              :rules="rules"
              :colon="false"
              :label-col="{ span: 2 }"
              label-width="100"
            >
              <el-select
                class="feedback-select"
                placeholder="意见类型选择"
                v-model="mailboxState.mailboxList.write.feedbackType"
              >
                <el-option
                  v-for="(feedback, feedbackIndex) in feedbackTypes"
                  :key="`feedback-${feedbackIndex}`"
                  :value="feedback"
                >
                  {{ feedback }}
                </el-option>
              </el-select>
              <el-form-item ref="title" prop="title" label="标题" :wrapperCol="{ span: 6 }">
                <el-input v-model="mailboxState.mailboxList.write.title" placeholder="请输入标题" />
              </el-form-item>
              <el-form-item ref="content" prop="content" label="内容">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8 }"
                  v-model="mailboxState.mailboxList.write.content"
                  placeholder="请输入内容"
                  show-word-limit
                  maxlength="500"
                />
              </el-form-item>
              <el-form-item>
                <template #label></template>
                <el-button :loading="loadingBtn" size="large" class="common-btn" type="submit" @click="onSubmit">
                  提交
                </el-button>
              </el-form-item>
            </el-form>
          </div>
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
      <div>{{ msgDateTxt }}</div>
    </div>

    <div class="msg-button">
      <el-button type="danger" @click="deleteMsg(msgId)">删除</el-button>
      <el-button type="primary" @click="msgModalVisible = false">确认</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getFeedbackType,
  getFeedbackReplies,
  readFeedback,
  deleteFeedback,
  submitFeedback
} from "@/api/personal/mailbox";
import { ElMessage } from "element-plus";
import { Calendar, Delete, MessageBox } from "@element-plus/icons-vue";

const feedbackTypes = ref("");
const loadFeedbackType = () => {
  getFeedbackType()
    .then((res) => {
      const { code, data } = res;
      if (code === 0) feedbackTypes.value = data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const mailboxState = reactive({
  active: "write",
  mailboxList: {
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 4,
      total: 0
    },
    write: {
      feedbackType: "",
      title: "",
      content: ""
    }
  }
});
const loadFeedbackReplies = () => {
  getFeedbackReplies()
    .then((res) => {
      const { code, data } = res;
      if (code === 0) {
        mailboxState.mailboxList[mailboxState.active].list = [];
        mailboxState.mailboxList[mailboxState.active].list.push(...data.records);
        mailboxState.mailboxList[mailboxState.active].total = data.total;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const changePage = (key) => {
  mailboxState.mailboxList[mailboxState.active].pageNum = key;
  loadFeedbackReplies();
};

const mailTabChange = (nk) => {
  mailboxState.active = nk.props.name;
  if (nk.props.name !== "write") {
    const mailList = mailboxState.mailboxList[nk.props.name].list;
    if (mailList.length === 0) {
      loadFeedbackReplies();
    }
  }
};

const msgModalVisible = ref(false);
const msgId = ref();
const msgTitleTxt = ref();
const msgContentTxt = ref();
const msgDateTxt = ref();
const openMsg = (m) => {
  const { id, title, content, sendTime } = m;

  msgModalVisible.value = true;
  msgId.value = id;
  msgTitleTxt.value = title;
  msgContentTxt.value = content;
  msgDateTxt.value = new Date(sendTime).toLocaleString("zh-CN");

  readFeedback({ id })
    .then((res) => {
      const { code, data } = res;
      if (code === 0) {
        msgContentTxt.value = data.content;
        loadFeedbackReplies();
      }
    })
    .catch((error) => {
      console.log(error);
    });
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

const loadingBtn = ref(false);
const onSubmit = () => {
  loadingBtn.value = true;

  formRef.value
    .validate()
    .then(() => {
      submitFeedback(mailboxState.mailboxList.write)
        .then((response) => {
          if (response.code === 0) {
            ElMessage({
              message: "成功",
              type: "success"
            });
            loadFeedbackReplies();

            mailboxState.mailboxList.write.feedbackType = "";
            mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      loadingBtn.value = false;
    });
};

const readAllMsg = () => {};

const deleteMsg = (ids) => {
  deleteFeedback({ ids })
    .then((res) => {
      const { code } = res;
      if (code === 0) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });

        if (msgModalVisible.value) msgModalVisible.value = false;
        loadFeedbackReplies();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteAllMsg = () => {
  let ids = "";
  mailboxState.mailboxList.sent.list.forEach((e) => {
    const { id } = e;
    if (!ids) ids = id;
    else ids += `,${id}`;
  });

  deleteMsg(ids);
};

onMounted(() => {
  loadFeedbackType();
  loadFeedbackReplies();
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
      :deep(.el-tabs__content) {
        overflow: visible;
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
      .mailbox-item {
        position: relative;
        overflow: visible;
        box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
        border-radius: 3px;
        margin-bottom: 15px;
        padding: 24px;
        text-align: left;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          background: #eeeeee;
        }

        &.read,
        &.unread {
          &::after {
            position: absolute;
            right: -7.5px;
            top: -7.5px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
          }
        }

        &.read {
          &::after {
            content: "";
            background-color: #7cfc00;
          }
        }

        &.unread {
          &::after {
            content: "";
            background-color: #ee3537;
          }
        }

        .mailbox-title {
          font-size: 12px;
          line-height: 16px;
          margin-bottom: 20px;
          color: #16151c;
        }

        .mailbox-content {
          width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
          color: #838383;
        }

        .mailbox-date {
          text-align: right;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 12px;
          gap: 6px;
          color: #a1a1a1;
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

    .feedback-select {
      width: 89.8%;
      margin: 0 0 18px 100px;
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
