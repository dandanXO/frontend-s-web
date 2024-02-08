<template>
  <div class="account-box account-contents">
    <div class="account-content mail mail-content">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">
<!--        <el-tab-pane key="inbox" name="inbox" :label="'消息中心'">-->
<!--          <template v-if="mailboxState.mailboxList.inbox.list.length > 0">-->
<!--            <el-collapse v-model="activeNames" @change="handleChange">-->
<!--              <el-collapse-item v-for="item in mailboxState.mailboxList.inbox.list" :key="item.id">-->
<!--                <template #title>标题：{{ item.title }}</template>-->
<!--                <div>-->
<!--                  <div>正文：{{ item.content }}</div>-->
<!--                </div>-->
<!--              </el-collapse-item>-->
<!--            </el-collapse>-->
<!--            <div class="mail-pagination-wrapper">-->
<!--              <el-pagination-->
<!--                @current-change="changePage"-->
<!--                :total="mailboxState.mailboxList.inbox.total"-->
<!--                :current-page="mailboxState.mailboxList.inbox.pageNum"-->
<!--                :page-size="mailboxState.mailboxList.inbox.pageSize"-->
<!--              />-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-tab-pane>-->
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
                <el-input ref="titleRef" v-model="mailboxState.mailboxList.write.title" placeholder="请输入标题" maxlength="255" show-word-limit />
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
          <div :class="`quiz-container ${uiIsShowStatus.startAnswerBox ? '' : 'hide'}`">
            <div class="quiz-header">
              有奖问答
            </div>
            <div class="quiz-gift">
                <img src="../../assets/feedback/gift.png"/>
            </div>
            <div class="quiz-content">
              <div class="content-title">让我们聆听您的心声</div>
              <div class="content-desc">雷火有奖问卷调查，您的意见和建议对我们非常重要</div>
              <div class="content-btn">
                <button class="standard-button btn-color-blue" @click="onBtnStartAnswerClick()">开始答题</button>
              </div>
            </div>
          </div>
          <div :class="`questions-container ${uiIsShowStatus.questionBox ? 'show' : ''}`">
            <!-- <div class="questions-back-btn">
                <img src="../../assets/feedback/back-btn.png"/>
            </div> -->
            <div class="questions-header">
              有奖问答
            </div>
            <div class="questions-gift">
                <img src="../../assets/feedback/gift.png"/>
            </div>
            <div class="questions-content">
              <div v-for="(item, i) in quesTitleOptions" :key="i" class="question-title-container">
                  <template v-if="recordsPagination.current === item.page">
                    <div class="questions-title" >
                    {{ item.title }}
                  </div>
                  </template>
              </div>
              <div class="answer-container">
                  <div v-for="(ans, index) in ansOptions" :key="index" class="list-item">
                    <span>{{ ans.id }}. {{ ans.content }}</span>
                    <el-radio v-model="optionModal" :label="index" id="check-option" @click="getSelected(index)"></el-radio>
                  </div>
                  <div style="display: none" id="answer-input-div">
                    <el-input 
                      class="answer-input-fill"
                      v-model="answerInputModal"
                      placeholder="请输入获取渠道"
                      type="textarea"
                      :autosize="{ minRows: 4 }"
                    />
                  </div>
              </div>

              <div :class="`content-btn ${recordsPagination.current === 1 ? 'active' : ''}` " style="display: flex; justify-content: space-between; gap: 10px;">
                <div>
                  <button id="prevBtn" class="standard-button btn-color-blue" @click="onPrevBtnClick()" style="display: none;">上一题</button>
                </div>
                <div>
                  <button id="nextBtn" class="standard-button btn-color-blue" @click="onNextBtnClick()">下一题</button>
                </div>
                <div>
                  <button id="finalBtn" class="standard-button btn-color-blue" @click="onFinalBtnClick()" style="display: none;">完成</button>
                </div>
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

const recordsPagination = reactive({ size: 3, current: 1, total: 3, pages: 3 });
const uiIsShowStatus = reactive({
  startAnswerBox: true,
  questionBox: false
});
function onBtnStartAnswerClick() {
  uiIsShowStatus.startAnswerBox = false;
  uiIsShowStatus.questionBox = true;
  recordsPagination.current = 1;
}

const quesTitleOptions = ref([]);
let quesTitlePage = 1;
let ansOptions = [];
let optionModal = ref(null);
// console.log("SHOW PAGE:: ", recordsPagination.current);
console.log("SHOW PAGE P:: ", recordsPagination.pages);

const getQuesTitleOptions = () => {
  quesTitleOptions.value = [{
    page: 1,
    title: "1/30 您是如何知道我们网站的？(单选)",
    questions: [
      {
        id: 1,
        content: "百度等搜索引擎"
      },
      {
        id: 2,
        content: "网络站点广告"
      },
      {
        id: 3,
        content: "社交媒体"
      },
      {
        id: 4,
        content: "朋友推荐"
      },
      {
        id: 5,
        content: "电话致电"
      },
      {
        id: 6,
        content: "短袖邀请"
      },
      {
        id: 7,
        content: "其他渠道"
      },
    ]
  },
  {
    page: 2,
    title: "2/30 您是如何觉得XXXXXXXXXX",
    questions: [
    {
        id: 1,
        content: "百度等搜索引擎"
      },
      {
        id: 2,
        content: "网络站点广告"
      },
      {
        id: 3,
        content: "社交媒体"
      }
    ]
  },
  {
    page: 3,
    title: "30/30 您是如何XXXXXXXXX",
    questions: [
      {
        id: 1,
        content: "百度等搜索引擎"
      },
      {
        id: 2,
        content: "网络站点广告"
      },
      {
        id: 3,
        content: "社交媒体"
      },
    ]
  }]

  if(recordsPagination.current === 1) {
    removeArray();
    ansOptions = quesTitleOptions.value[0].questions;
  } else {
    removeArray();
    ansOptions = quesTitleOptions.value[1].questions;
  }
  quesTitlePage = recordsPagination.current;
  console.log("ANS OP::: ", ansOptions);
  console.log("PAGE:: ", recordsPagination.current);
 
}
console.log("PAGE OUSI:: ", recordsPagination.current);

const removeArray = () => {
  ansOptions.splice(0);
}


const getSelected = (value) => {
  // value = optionModal;
  const inputDiv = document.getElementById("answer-input-div")
  
  if(value === 6) {
    inputDiv.style.display = "block";
  } else {
    inputDiv.style.display = "hide"
  }   
}

const onPrevBtnClick = () => {
  const btn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const finalBtn = document.getElementById("finalBtn");
  getQuesTitleOptions();

  if (recordsPagination.current > 1) {
    getQuesTitleOptions();
    recordsPagination.current = recordsPagination.current - 1;
    btn.style.display = "block";
  } else if (recordsPagination.current === 1) {
    btn.style.display = "none";
    nextBtn.style.display = "block";
    finalBtn.style.display = "none";
  }
  console.log("PAGE PP:: ", recordsPagination.current);
}

const onNextBtnClick = () => {
  const btn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const finalBtn = document.getElementById("finalBtn");

  if (recordsPagination.pages > recordsPagination.current) {
    recordsPagination.current = recordsPagination.current + 1;
    getQuesTitleOptions();
    prevBtn.style.display = "block";
    btn.style.display = "block";
    finalBtn.style.display = "none";
  } else if ((recordsPagination.pages === recordsPagination.current)) {
    btn.style.display = "none";
    prevBtn.style.display = "block";
    finalBtn.style.display = "block";
  }
  console.log("PAGE NN:: ", recordsPagination.current);
}

const onFinalBtnClick = () => {
  
}

const options = ["存款问题", "转账问题", "提款问题", "其他"];

const onItemClick = (item) => {
  mailboxState.mailboxList.write.title = item;
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
  getQuesTitleOptions();
  getSelected(optionModal);
  
  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
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

  &.hide {
    display: none;
  }

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

  .quiz-gift {
    display: flex;
    justify-content: flex-end;
    width: 129px;
    height: 110px;
    position: absolute;
    top: 10px;
    right: 200px;
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

.questions-container {
  //   background: salmon;
  margin-top: 40px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  display: none;
  &.show {
    display: block;
  }

  .questions-header {
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

  .questions-back-btn {
    display: flex;
    justify-content: flex-start;
    width: 35px;
    height: 35px;
    position: absolute;
    top: 65px;
    left: 200px;
  }

  .questions-gift {
    display: flex;
    justify-content: flex-end;
    width: 129px;
    height: 110px;
    position: absolute;
    top: 10px;
    right: 200px;
  }

  .questions-content {
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

    .question-title-container {
      display: flex;
      justify-content: flex-start;
      width: 100%;
    }

    .questions-title {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;
      color: #4288FF;
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-start;
      width: 100%;
      margin-left: 20px;
    }
    .questions-desc {
      color: $font-2;
      font-size: 1rem;
      margin-bottom: 36px;
    }
    .questions-btn {
    }

    .answer-container {
      display: flex; 
      width: 100%;
      flex-direction: column;
      padding: 10px 25px;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      width: 100%;
    }

    :deep(.el-radio__label) {
      color: #fff
    }

    .answer-input-fill {
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
