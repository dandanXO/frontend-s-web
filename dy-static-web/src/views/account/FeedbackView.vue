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

            <div v-if="!isLoading" class="mailbox-list">
              <template v-for="(m, mi) in mailboxState.mailboxList.sent.list" :key="m.id">
                <div :class="`mailbox-item`" @click="openMsg(m)">
                  <div class="mailbox-preview">
                    <div :class="`mailbox-title ${m.readTime ? 'read' : 'unread'}`">
                      <el-tag type="info" v-if="m.readTime">已读</el-tag>
                      <el-tag type="danger" v-else>未读</el-tag>
                      {{ m.title }}
                    </div>
                    <ArrowDown :class="`mailbox-accordion ${m.isOpen ? 'open' : ''}`"></ArrowDown>
                  </div>
                </div>
                <div :class="`mailbox-content-wrapper ${m.isOpen ? 'open' : ''}`">
                  <div class="mailbox-content">
                    <div class="content-p">正文：
                      <div v-html="m.content || '加载中...'"></div>
                    </div>
                    <div v-if="m.replyMessageContent" style="margin-top: 10px;" class="content-p">回复:
                    <div class="mailbox-content" v-html="m.replyMessageContent || '加载中...'"></div>
                    </div>
                    <div class="mailbox-date">
                      <el-icon><Calendar /></el-icon>
                      <div>{{ new Date(m.sendTime).toLocaleString("zh-CN") }}</div>
                      <el-icon class="delete-btn"><Delete @click="deleteMsg(m.id, mi)" /></el-icon>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div v-else class="mailbox-list">
              <div class="empty-text">加载中...</div>
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
              <el-form-item ref="feedbackType" prop="feedbackType" label="意见类型" :wrapperCol="{ span: 6 }">
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
              </el-form-item>
              <el-form-item ref="title" prop="title" label="标题" :wrapperCol="{ span: 6 }">
                <el-input v-model="mailboxState.mailboxList.write.title" placeholder="请输入标题" />
              </el-form-item>
              <el-form-item ref="photo" prop="photo" label="上传图片" :wrapperCol="{ span: 6 }">
                
                <div class="input-fill">
                  <FileUpload class="upload-photo-board" @photo-response="getImageLink" ref="uploadFileRef" />
                </div>
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
import { Calendar, Delete, MessageBox, ArrowDown } from "@element-plus/icons-vue";
import FileUpload from "@/components/feedback/FileUpload.vue";

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
const uploadFileRef = ref();
const getImageLink = (linkId) => {
  mailboxState.mailboxList.write.photo = linkId;
  if (linkId) {
    ElMessage.success({
      type: "success",
      message: "上传成功"
    });
  }
};

const mailboxState = reactive({
  active: "write",
  mailboxList: {
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 8,
      total: 0
    },
    write: {
      feedbackType: "",
      title: "",
      content: "",
      photo: ""
    }
  }
});
const isLoading = ref(false);
const loadFeedbackReplies = () => {
  
  isLoading.value = true
  const query = { 
    type: null,
    current: mailboxState.mailboxList[mailboxState.active].pageNum,
    size: mailboxState.mailboxList[mailboxState.active].pageSize,
    orderBy: "sendTime"
  }
  getFeedbackReplies(query)
    .then((res) => {
      isLoading.value = false
      const { code, data } = res;
      if (code === 0) {
        mailboxState.mailboxList[mailboxState.active].list = [];
        mailboxState.mailboxList[mailboxState.active].list.push(...data.records);
        mailboxState.mailboxList[mailboxState.active].total = data.total;
        mailboxState.mailboxList[mailboxState.active].pageSize = data.size;
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
  mailboxState.mailboxList["sent"].pageNum = 1
  mailboxState.active = nk.props.name;
  if (nk.props.name !== "write") {
    const mailList = mailboxState.mailboxList[nk.props.name].list;
    // if (mailList.length === 0) {
    //   loadFeedbackReplies();
    // }
    
    loadFeedbackReplies();
  }
};

const openMsg = (m) => {
  const { id } = m;

  if (m.isOpen === undefined) m.isOpen = false;
  m.isOpen = !m.isOpen;
  m.readTime = true;

  if (!m.content) {
    readFeedback({ id })
      .then((res) => {
        const { code, data } = res;
        if (code === 0) m.content = data.content;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const formRef = ref();
const rules = {
  feedbackType: [{ required: true, message: "请选择意见类型" }],
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
            uploadFileRef.value.clear();
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

const deleteMsg = (ids, spliceIndex, callback) => {
  deleteFeedback({ ids })
    .then((res) => {
      const { code } = res;
      if (code === 0) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });

        if (spliceIndex !== null) mailboxState.mailboxList[mailboxState.active].list.splice(spliceIndex, 1); // fake delete
        callback && callback();
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

  deleteMsg(ids, null, () => {
    loadFeedbackReplies();
  });
};

onMounted(() => {
  loadFeedbackType();
  loadFeedbackReplies();
});
</script>

<style scoped lang="scss">
.empty-text {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  color: #000000;
}
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
          max-height: 200px;
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

    .feedback-select {
      width: 100%;
      margin: 0;
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
