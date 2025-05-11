<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">收发信息</span>
    </div>
    <div class="account-content mail">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
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
              <el-form-item ref="feedback" prop="feedback" label="意见类型" :wrapperCol="{ span: 6 }">
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
                <FileUpload class="upload-photo-board" @photo-response="getImageLink" ref="uploadFileRef" />
              </el-form-item>

              <el-form-item ref="content" prop="content" label="内容">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4 }"
                  v-model="mailboxState.mailboxList.write.content"
                  placeholder="请输入内容"
                  show-word-limit
                  maxlength="500"
                />
              </el-form-item>
              <el-form-item>
                <template #label></template>
                <el-button type="submit" @click="onSubmit">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane key="sent" name="sent" :label="'我的反馈'">
          <div
            style="display: flex; justify-content: center; align-items: center; height: 300px"
            v-if="!isLoading['outbox']"
          >
            载入中
          </div>
          <div v-else-if="mailboxState.mailboxList.sent.list.length > 0">
            <el-collapse v-model="activeNames">
              <el-collapse-item
                v-for="item in mailboxState.mailboxList.sent.list"
                :key="item.id"
                @click="openMsg(item)"
              >
                <template #title>
                  <p class="title-p">标题：{{ item.title }}</p>
                </template>
                <div>
                  <div class="content-p">正文：{{ item.content }}</div>
                  <div v-if="item.replyMessageContent" style="margin-top: 10px;" class="content-p">回复: {{ item.replyMessageContent }}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div class="pagination-wrapper" :class="{ hidden: mailOpened }">
              <!-- <el-pagination
                v-model:current="
                  mailboxState.mailboxList[mailboxState.active].pageNum
                "
                :total="mailboxState.mailboxList[mailboxState.active].total"
                show-less-items
                hideOnSinglePage
                :defaultPageSize="2"
                :pageSize="
                  mailboxState.mailboxList[mailboxState.active].pageSize
                "
                @change="changePage(mailboxState.active)"
              /> -->

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
        <!--        <el-tab-pane key="inbox" name="inbox" :label="'收件箱'">-->
        <!--          <div-->
        <!--              style="-->
        <!--              display: flex;-->
        <!--              justify-content: center;-->
        <!--              align-items: center;-->
        <!--              height: 300px;-->
        <!--            "-->
        <!--              v-if="!isLoading['inbox']"-->
        <!--          >-->
        <!--            载入中-->
        <!--          </div>-->
        <!--          <div v-else-if="mailboxState.mailboxList.inbox.list.length > 0">-->
        <!--            <div class="mailbox-list">-->
        <!--              <div-->
        <!--                class="mailbox-item"-->
        <!--                v-for="m in mailboxState.mailboxList.inbox.list"-->
        <!--                :key="m.id"-->
        <!--              >-->
        <!--                <div class="mailbox-title">{{ m.title }}</div>-->
        <!--                <div class="mailbox-content" v-html="m.content"></div>-->
        <!--                <div class="mailbox-date"><el-icon><Calendar /></el-icon>{{ m.sendTime }}</div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--            <div class="pagination-wrapper">-->
        <!--              <el-pagination-->
        <!--                @current-change="changePage"-->
        <!--                :total="mailboxState.mailboxList.inbox.total"-->
        <!--                :current-page="mailboxState.mailboxList.inbox.pageNum"-->
        <!--                :page-size="mailboxState.mailboxList.inbox.pageSize"-->
        <!--              />-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div-->
        <!--            style="-->
        <!--              display: flex;-->
        <!--              justify-content: center;-->
        <!--              align-items: center;-->
        <!--              height: 300px;-->
        <!--            "-->
        <!--            v-else-->
        <!--          >-->
        <!--            暂无记录-->
        <!--          </div>-->
        <!--        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, reactive, onMounted } from "vue";
import { mailInbox, mailOutbox, submitFeedback, getFeedbackType } from "@/api/personal/mailbox";
// import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import { Calendar } from "@element-plus/icons-vue";
import { userStore } from "@/store";
import FileUpload from "@/components/feedback/FileUpload.vue";


export default defineComponent({
  name: "MailboxView",
  components: {
    Calendar,
    FileUpload
  },
  setup() {
const store = userStore();
    const mailboxData = ref([]);
    const isLoading= reactive({
      inbox: false,
      outbox: false
    })
    const mailboxState = reactive({
      active: "write",
      mailboxList: {
        inbox: {
          list: [],
          pageNum: 1,
          pageSize: 4,
          total: 0,
        },
        sent: {
          list: [],
          pageNum: 1,
          pageSize: 4,
          total: 0,
        },
        write: {
          title: "",
          content: "",
          feedbackType: "",
          photo: ""
        },
      },
    });

    const loadPersonalMailbox = () => {
      mailboxState.mailboxList[mailboxState.active].list = []
      if (mailboxState.active === "inbox") {
        mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList["inbox"].pageNum,
          size: mailboxState.mailboxList["inbox"].pageSize,
          orderBy: "sendTime"
        }
        mailInbox(mailboxData.value).then((res) => {
          isLoading["inbox"]=true;
          if (res.code === 0) {
            const response = res.data
            // mailboxState.mailboxList["inbox"].list.push(...response.records);
            mailboxState.mailboxList["inbox"].list = response.records;
            mailboxState.mailboxList["inbox"].total = (response.total);
          }
        }).catch((error) => {
          isLoading["inbox"]=true;
          console.log(error);
          // message.error(error.message, 4)
        });
      } else {
        mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList["sent"].pageNum,
          size: mailboxState.mailboxList["sent"].pageSize,
          orderBy: "createTime"
        }
        mailOutbox(mailboxData.value).then((response) => {
          isLoading["outbox"]=true;
          if (response.code === 0) {
            // mailboxState.mailboxList["sent"].list.push(...response.data.records);
            mailboxState.mailboxList["sent"].list = response.data.records;
            mailboxState.mailboxList["sent"].total = response.data.total;
          }
        }).catch((error) => {
          isLoading["outbox"]=true;
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
      mailboxState.active = nk.props.name
      if(nk.props.name !== "write") {
        const mailList = mailboxState.mailboxList[nk.props.name].list;
        if(mailList.length === 0) {
          loadPersonalMailbox();
        }
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
    onMounted(() => {
      loadPersonalMailbox();
      if (store.token) {
        loadFeedbackType();
      }
      // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
    });

    const formRef = ref();
    const rules = {
      title: [
        {
          required: true,
          message: "请输入标题",
          trigger: "blur",
        },
        {
          max: 255,
          message: "长度为 255",
          trigger: "change",
        },
      ],
      content: [
        {
          required: true,
          message: "请输入内容",
          trigger: "blur",
        },
        {
          max: 500,
          message: "长度应少过 500 字",
          trigger: "change",
        },
      ],
      feedback: [
        {
          // required: true,
          message: "选择意见类型",
          trigger: "blur",
        },
      ]
    };
    const onSubmit = (e) => {
  e.preventDefault();
      formRef.value
        .validate()
        .then(() => {
          submitFeedback(mailboxState.mailboxList.write)
            .then((response) => {
              if (response.code === 0) {
                ElMessage({
                  message: "提交成功",
                  type: "success"
                });
                loadPersonalMailbox();

                mailboxState.mailboxList.write.feedbackType = "";
                mailboxState.mailboxList.write.title = "";
                mailboxState.mailboxList.write.content = "";
                uploadFileRef.value.clear();
              } else {
                ElMessage.error(response.message);
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
    };
    return {
      mailboxState,
      mailboxData,
      loadPersonalMailbox,
      mailTabChange,
      changePage,
      formRef,
      rules,
      onSubmit,
      isLoading,
      feedbackTypes,
      FileUpload,
      uploadFileRef,
      getImageLink,
      openMsg
    }
  },
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
    .mailbox-list {
      min-height: 450px;
      font-size: 14px;
      .mailbox-item {
        background-color: #2a313e;
        border-radius: 3px;
        margin-bottom: 15px;
        padding: 24px;
        text-align: left;
        // &:before {
        //   content: "";
        //   background: #ffffff;
        //   position: absolute;
        //   left: -2px;
        //   top: 0;
        //   height: 40px;
        //   width: 6px;
        // }
        &.read,
        &.unread {
          &::after {
            position: absolute;
            right: -10px;
            top: 10px;
            width: 90px;
            height: 40px;
            color: #000000;
            line-height: 40px;
            text-align: center;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            font-weight: bold;
            cursor: pointer;
          }
        }
        &.read {
          &::after {
            content: "Read";
            background-color: #ffd800;
          }
        }
        &.unread {
          &::after {
            content: "Unread";
            background-color: #ee3537;
          }
        }
        .mailbox-title {
          font-size: 12px;
          line-height: 16px;
          margin-bottom: 20px;
          color: #ffffff;
        }
        .mailbox-content {
          width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .mailbox-date {
          text-align: right;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
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
</style>
