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
            <div class="questions-content" id="questionContainer">
              <div v-for="(item, i) in quesTitleOptions" :key="i" class="question-title-container">
                  <template v-if="recordsPagination.current === item.sequence">
                    <div class="questions-title">
                      {{ item.question }}
                    </div>
                    <div class="answer-container">
                      <el-radio-group v-model="optionModal" >
                        <el-radio v-for="(ans, index) in item.choices" :key="index" :label="index" @click="getSelected(item, ans.choice)">
                          {{ ans.choice }}
                          <div v-if="optionModal === index && ans.needSpecify">
                            <el-input 
                              class="answer-input-fill"
                              v-model="answerInputModal"
                              placeholder="请输入获取渠道"
                              type="textarea"
                              :autosize="{ minRows: 4 }"
                            />
                          </div>
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </template>
              </div>

              <div :class="`content-btn ${recordsPagination.current === 1 ? 'active' : ''}` " style="display: flex; justify-content: space-between; gap: 10px;">
                <div>
                  <button id="prevBtn" class="standard-button btn-color-blue" @click="btnClick('prev')" style="display: none;">上一题</button>
                </div>
                <div>
                  <button id="nextBtn" class="standard-button btn-color-blue" @click="btnClick('next')">下一题</button>
                </div>
                <div>
                  <button id="finalBtn" class="standard-button btn-color-blue" @click="btnClick('final')" style="display: none;">完成</button>
                </div>
              </div>
            </div> 
            
            <div class="questions-content" id="QRContainer" style="display: none">
              <div class="thumbs-up-div"><img src="../../assets/feedback/thumbs-up.png" /></div>
              <div class="header-title-div">
                <span class="span1">恭喜您完成本月的调查问卷</span> 
                <span class="span2">下月问卷将于次月1号重新开启</span>
              </div>
              <div class="header-title-div" style="margin-top: 25px">
                <span class="span3">此次问卷提供<span class="span1" style="color: #468CFF">18-188元</span>建议金</span> 
              </div>
              <div class="qr-code-div">
                <img src="../../assets/feedback/QR-code.png"/>
              </div>
              <div class="url-div">
                <el-input 
                  class="url-input-fill" 
                  v-model="urlInput"
                  :readonly="true"
                  type="url"
                  />
                <div>
                  <button class="standard-button btn-color-blue copy-button">复制</button>
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
import { getQuestionnaireList, submitQuestionnaire } from "@/api/index/promo";
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
let optionModal = ref('1');

const getQuesTitleOptions = () => {
  // quesTitleOptions.value = [{
  //   page: 1,
  //   title: "1/30 您是如何知道我们网站的？(单选)",
  //   questions: [
  //     {
  //       id: 1,
  //       content: "百度等搜索引擎"
  //     },
  //     {
  //       id: 2,
  //       content: "网络站点广告"
  //     },
  //     {
  //       id: 3,
  //       content: "社交媒体"
  //     },
  //     {
  //       id: 4,
  //       content: "朋友推荐"
  //     },
  //     {
  //       id: 5,
  //       content: "电话致电"
  //     },
  //     {
  //       id: 6,
  //       content: "短袖邀请"
  //     },
  //     {
  //       id: 7,
  //       content: "其他渠道"
  //     },
  //   ]
  // },
  // {
  //   page: 2,
  //   title: "2/30 您是如何觉得XXXXXXXXXX",
  //   questions: [
  //   {
  //       id: 1,
  //       content: "百度等搜索引擎"
  //     },
  //     {
  //       id: 2,
  //       content: "网络站点广告"
  //     },
  //     {
  //       id: 3,
  //       content: "社交媒体"
  //     }
  //   ]
  // },
  // {
  //   page: 3,
  //   title: "30/30 您是如何XXXXXXXXX",
  //   questions: [
  //     {
  //       id: 1,
  //       content: "百度等搜索引擎"
  //     },
  //     {
  //       id: 2,
  //       content: "网络站点广告"
  //     },
  //     {
  //       id: 3,
  //       content: "社交媒体"
  //     },
  //   ]
  // }]
  getQuestionnaireList().then((res) => {
    res = {
      "code": 0,
      "data": [
          {
              "sequence": 1,
              "question": "您是如何知道我们网站的？(单选)",
              "choices": [
                  {
                      "choice": "百度等搜索引擎",
                      "needSpecify": false
                  },
                  {
                      "choice": "网络站点广告",
                      "needSpecify": false
                  },
                  {
                      "choice": "其他",
                      "needSpecify": true
                  }
              ]
          },
          {
              "sequence": 2,
              "question": "您是如何觉得XXXXXXXXXX",
              "choices": [
                  {
                      "choice": "XXXXXXXXXXX",
                      "needSpecify": false
                  },
                  {
                      "choice": "XXXXXXXXXXX",
                      "needSpecify": false
                  }
              ]
          },
          {
              "sequence": 3,
              "question": "您是如何觉得XXXXXXXXXX",
              "choices": [
                  {
                      "choice": "生命真重要",
                      "needSpecify": false
                  },
                  {
                      "choice": "生命真的是美丽的",
                      "needSpecify": false
                  }
              ]
          },
      ]
    }
    if (res.code === 0) {
      quesTitleOptions.value = res.data
      recordsPagination.pages = res.data.length
    }

  })
}

// const removeArray = () => {
//   ansOptions.splice(0);
// }

const answerInputModal = ref('');
const choices = reactive([]);
const getSelected = (item, ans) => {
  const input = answerInputModal.value
  var obj = {
    question: item.question,
    choice: ans
  }
  choices[item.sequence - 1] = obj
  console.log(choices)
  // value = optionModal;
  // const inputDiv = document.getElementById("answer-input-div")
  
  // if(value === 6) {
  //   inputDiv.style.display = "block";
  // } else {
  //   inputDiv.style.display = "hide"
  // }
}

const btnClick = (btnType) => {
  optionModal.value = null
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const finalBtn = document.getElementById("finalBtn");
  if (btnType === 'prev') {
      recordsPagination.current = recordsPagination.current - 1;
  } else if (btnType === 'next') {
    recordsPagination.current = recordsPagination.current + 1;
  } else if (btnType === 'final') {
    const questionDiv = document.getElementById("questionContainer");
    const QRDiv = document.getElementById("QRContainer");
    // When Submit API is COMPLETE
    // submitQuestionnaire(choices).then((res) => {
    //   if (res.code === 0) {
    //     questionDiv.style.display = "none";
    //     QRDiv.style.display = "block";
    //   }
    // })
    
    questionDiv.style.display = "none";
    QRDiv.style.display = "block";
    
  }
  console.log('current: ' + recordsPagination.current)
  console.log('length: ' + recordsPagination.pages)
  if (recordsPagination.current < recordsPagination.pages) {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
    finalBtn.style.display = "none";
    if (recordsPagination.current === 1) {
      prevBtn.style.display = "none";
      finalBtn.style.display = "none";
      nextBtn.style.display = "block";
    }
  }
  if (recordsPagination.current > recordsPagination.pages) {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
    finalBtn.style.display = "none";
  }
  if (recordsPagination.current === recordsPagination.pages) {
    prevBtn.style.display = "block";
    nextBtn.style.display = "none";
    finalBtn.style.display = "block";
  }
  // if (recordsPagination.current < recordsPagination.pages) {
  //   prevBtn.style.display = "block";
  // }
  // if (recordsPagination.current === recordsPagination.pages) {
  //   prevBtn.style.display = "block";
  //   nextBtn.style.display = "none";
  //   finalBtn.style.display = "block";
  // } 
}

// const onNextBtnClick = () => {
//   const btn = document.getElementById("nextBtn");
//   const prevBtn = document.getElementById("prevBtn");
//   const finalBtn = document.getElementById("finalBtn");

//   recordsPagination.current = recordsPagination.current + 1;
//   updatePage();
//   if (recordsPagination.pages > recordsPagination.current) {
//     prevBtn.style.display = "block";
//     btn.style.display = "block";
//     finalBtn.style.display = "none";
//   } else if ((recordsPagination.pages === recordsPagination.current)) {
//     btn.style.display = "none";
//     prevBtn.style.display = "block";
//     finalBtn.style.display = "block";
//   }
// }

// const onFinalBtnClick = () => {
//   const questionDiv = document.getElementById("questionContainer");
//   const QRDiv = document.getElementById("QRContainer");
//   questionDiv.style.display = "none";
//   QRDiv.style.display = "block";
// }

const urlInput = ref("Http://LHe63851/s?eric123");

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
      flex-direction: column;
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

    .answer-container {
      display: flex; 
      width: 100%;
      flex-direction: column;
      padding: 10px 25px;
      :deep(.el-radio-group) {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }
      :deep(.el-radio) {
        height: unset;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
      }      
      :deep(.el-radio__label) {
        width: 100%;
      }
      :deep(.el-radio__input) {
        margin-top: 4px;
      }
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      width: 100%;
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
  
  .thumbs-up-div {
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
      width: 121px;
      height: 121px;
    }
  }

  .header-title-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #424F72;
    margin-top: 10px;
    gap: 5px;
  }
  .span1 {
    font-family: PingFang SC;
    font-size: 30px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: center;
  }
  .span2 {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 400;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: center;
  }
  .span3 {
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: center;
  }

  .qr-code-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #424F72;
    margin-top: 30px;
    gap: 5px;

    img {
      width: 188px;
      height: 233px;
    }
  }

  .url-div {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #3F8CFF;
    margin-top: 30px;
    gap: 5px;
    width: 100%;
  }

  .url-input-fill {
    width: 389px;
      :deep(.el-form-item__label) {
        width: 80px;
      }

      :deep(.el-input__inner) {
        color: #3F8CFF;
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

  .copy-button {
    position: absolute;
    bottom: 60px;
    margin: -15px 0 0 -100px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;

    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: center;

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
