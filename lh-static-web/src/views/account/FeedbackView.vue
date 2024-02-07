<template>
  <div class="account-box account-contents">
    <div class="account-content mail mail-content">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
        <el-tab-pane key="inbox" name="inbox" :label="'消息中心'">
          <template v-if="mailboxState.mailboxList.inbox.list.length > 0">
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
        </el-tab-pane>
        <el-tab-pane key="write" name="write" :label="'意见反馈'">
          <el-form
            ref="formRef"
            :model="mailboxState.mailboxList.write"
            :rules="rules"
            :colon="false"
            :label-col="{ span: 2 }"
            label-width="100"
            hideRequiredMark="true"
          >
            <div class="mail-input-item">
              <div class="input-title-container">
                <div class="input-title">标题</div>
                <div class="mail-btn-group">
                  <el-dropdown trigger="click">
                    <el-button class="standard-button btn-color-blue" style="border-radius: 2rem; padding: 20px 26px;">
                      快捷输入 <el-icon style="margin-left: 5px;"><CaretBottom /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(option, i) in options" :key="i" @click="onItemClick(option)">{{ option }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>

              <div class="input-fill">
                <el-input ref="titleRef" v-model="mailDetailList.title" placeholder="请输入标题" maxlength="255" show-word-limit />
              </div>
            </div>
            <div class="mail-input-item">
              <div class="input-title">内容</div>
              <div class="input-fill">
                <el-input
                  v-model="mailboxState.mailboxList.write.content"
                  placeholder="请输入您的信息内容"
                  type="textarea"
                  :autosize="{ minRows: 4 }"
                  show-word-limit
                  maxlength="500"
                />
              </div>
            </div>

            <div class="mail-btn-group">
              <button class="standard-button btn-color-blue" type="submit" @click="onSubmit">提交</button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane key="quiz" name="quiz" :label="'有奖问答'">
          <div class="quiz-container">
            <div class="quiz-header">有奖问答</div>
            <div class="quiz-content">
              <div class="content-title">让我们聆听您的心声</div>
              <div class="content-desc">雷火有奖问卷调查，您的意见和建议对我们非常重要</div>
              <div class="content-btn">
                <button class="standard-button btn-color-blue">开始答题</button>
              </div>
            </div>
          </div>
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
import { CaretBottom } from '@element-plus/icons-vue'

const options = ["存款问题", "转账问题", "提款问题", "其他"];
const mailDetailList = ref({
  title: "",
  content: ""
});
const onItemClick = (item) => {
  mailDetailList.value.title = item;
};

const loadingBtn = ref(false);
const mailboxData = ref([]);
const mailboxState = reactive({
  active: "quiz",
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
    },
    quiz: {}
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
    if (mailList && mailList.length === 0) {
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
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);s
});
</script>

<style scoped lang="scss">
.quiz-container {
  //   background: salmon;
  margin-top: 40px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;

  .quiz-header {
    display: flex;
    justify-content: center;
    text-shadow: 2px 2px 2px #96def0;
    color: $color-white;
    font-size: 2rem;
    font-weight: 600;
    background: linear-gradient(180deg, #2095ff 20%, rgba(217, 217, 217, 0) 100%);
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    padding: 12px 12px 40px;
    margin-bottom: -24px;
  }

  .quiz-content {
    // border-top-left-radius: 40px;
    // border-top-right-radius: 40px;
    padding: 40px 12px 12px;
    border-radius: 40px;
    border: 3px solid #fff;
    background: radial-gradient(177.6% 177.6% at 50% 50%, #fff 0%, rgba(255, 255, 255, 0) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .content-title {
      color: $font-2;
      font-size: 1.275rem;
      font-weight: 600;
      margin-bottom: 20px;
      //   &:before {
      //     content: "";
      //     background-image: url("../../assets/images/account/icon-quiz-head-img.png");
      //   }
    }
    .content-desc {
      color: $font-2;
      font-size: 1rem;
      margin-bottom: 36px;
    }
    .content-btn {
    }
  }
}

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
}
</style>
