<template>
  <div>
    <!-- <div class="menu-title-container">
      <span class="menu-title">收发信息</span>
    </div> -->
    <div class="account-content mail">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
        <el-tab-pane key="sent" name="sent" :label="'我的反馈'">
          <div v-if="mailboxState.mailboxList.sent.list.length > 0">
            <div class="mailbox-list">
              <template v-for="m in mailboxState.mailboxList.sent.list" :key="m.id">
                <div class="mailbox-item" @click="openMsg(m)">
                  <div class="mailbox-title">{{ m.title }}</div>
                  <div class="mailbox-content" v-html="m.content"></div>
                  <div class="mailbox-date">
                    <el-icon><Calendar /></el-icon>
                    <div>{{ new Date(m.createTime).toLocaleString("zh-CN") }}</div>
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
      <el-button type="primary" @click="msgModalVisible = false">确认</el-button>
    </div>
  </el-dialog>
</template>

<script lang="js">
import { ref, defineComponent, reactive, onMounted } from "vue";
import { mailInbox, mailOutbox, wirteMail } from "@/api/personal/mailbox";
// import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import { Calendar } from "@element-plus/icons-vue";


export default defineComponent({
  name: "MailboxView",
  components: {
    Calendar
  },
  setup() {
    const loadingBtn = ref(false)
    const mailboxData = ref([])
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
        },
      },
    });

    const loadPersonalMailbox = () => {
      mailboxState.mailboxList[mailboxState.active].list = []
      if (mailboxState.active === "inbox") {
        mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList[mailboxState.active].pageNum,
          size: mailboxState.mailboxList[mailboxState.active].pageSize,
          orderBy: "sendTime"
        }
        mailInbox(mailboxData.value).then((res) => {
          if (res.code === 0) {
            const response = res.data
            mailboxState.mailboxList[mailboxState.active].list.push(...response.records);
            mailboxState.mailboxList[mailboxState.active].total = (response.total);
          }
        }).catch((error) => {
          console.log(error);
          // message.error(error.message, 4)
        });
      } else {
        mailboxData.value = {
          type: null,
          current: mailboxState.mailboxList[mailboxState.active].pageNum,
          size: mailboxState.mailboxList[mailboxState.active].pageSize,
          orderBy: "createTime"
        }
        mailOutbox(mailboxData.value).then((response) => {
          if (response.code === 0) {
            mailboxState.mailboxList[mailboxState.active].list.push(...response.data.records);
            mailboxState.mailboxList[mailboxState.active].total = response.data.total;
          }
        }).catch((error) => {
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

    const msgModalVisible = ref(false);
    const msgTitleTxt = ref()
    const msgContentTxt = ref()
    const msgDateTxt = ref()

    const openMsg = (m) => {
      msgModalVisible.value = true;
      msgTitleTxt.value = m.title;
      msgContentTxt.value = m.content;
      msgDateTxt.value = new Date(m.createTime).toLocaleString("zh-CN")
    }

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
    };
    const onSubmit = () => {
      loadingBtn.value = true
      formRef.value
        .validate()
        .then(() => {
            wirteMail(mailboxState.mailboxList.write)
              .then((response) => {
                if(response.code === 0) {
                    ElMessage({
                      message: '成功',
                      type: 'success',
                    })
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
        loadingBtn.value = false
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
      loadingBtn,
      msgModalVisible,
      openMsg,
      msgTitleTxt,
      msgContentTxt,
      msgDateTxt
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
        box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
        border-radius: 3px;
        margin-bottom: 15px;
        padding: 24px;
        text-align: left;
        transition: all 0.3s;
        cursor: pointer;
        // &:before {
        //   content: "";
        //   background: #ffffff;
        //   position: absolute;
        //   left: -2px;
        //   top: 0;
        //   height: 40px;
        //   width: 6px;
        // }

        &:hover {
          background: #eeeeee;
        }

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
          // color: #ffffff;
          color: #16151c;
        }
        .mailbox-content {
          width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
          color:#838383;
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
