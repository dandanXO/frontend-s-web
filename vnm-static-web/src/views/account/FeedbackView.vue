<template>
  <div class="account-box account-contents">
    <div class="account-content mail mail-content">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card">

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

        <el-tab-pane key="sent" name="sent" :label="'我的反馈'">
          <template v-if="mailboxState.mailboxList.sent.list.length > 0">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item v-for="item in mailboxState.mailboxList.sent.list" :key="item.id">
                <template #title><p class="title-p">标题：{{ item.title }}</p></template>
                <div>
                  <div class="content-p">正文：{{ item.content }}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div class="mail-pagination-wrapper">
              <el-pagination
                @current-change="changePage"
                :total="mailboxState.mailboxList.sent.total"
                :current-page="mailboxState.mailboxList.sent.pageNum"
                :page-size="mailboxState.mailboxList.sent.pageSize"
              />
            </div>
          </template>
          <template v-else>
            <p class="empty-text">暂无记录</p>
          </template>
        </el-tab-pane>

        <el-tab-pane key="quiz" name="quiz" :label="'有奖问答'">
          <div v-if="!uiIsShowStatus.showQuestions" class="quiz-disable">活动尚未开启</div>
          <div v-if="!uiIsShowStatus.questionBox && uiIsShowStatus.showQuestions" class="quiz-container">
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
          <div v-if="uiIsShowStatus.questionBox" class="questions-container">
            <!-- <div class="questions-back-btn">
                <img src="../../assets/feedback/back-btn.png"/>
            </div> -->
            <div class="questions-header">
              有奖问答
            </div>
            <div class="questions-gift">
                <img src="../../assets/feedback/gift.png"/>
            </div>
            <div class="questions-content" v-if="!isAnswered">
              <div v-for="(item, i) in quesTitleOptions" :key="i" class="question-title-container">
                  <template v-if="recordsPagination.current === item.sequence">
                    <div class="questions-title">
                      {{ item.question }}
                    </div>
                    <div class="answer-container">
                      <template v-if="item.isMultiple" v-for="(ans, index) in item.choices" :key="index" >
                        <el-checkbox 
                          v-model="optionModal"
                          :label="index"  
                          @change="(newValue) => {
                            toggleSelected(item, ans.needSpecify ? answerInputModal : ans.choice, newValue, ans.needSpecify)
                        }">
                          {{ ans.choice }}
                        </el-checkbox>
                        <div v-if="item.isMultiple && Array.isArray(optionModal) && Array.from(optionModal).includes(index) && ans.needSpecify">
                          <el-input
                            class="answer-input-fill"
                            v-model="answerInputModal"
                            placeholder="请输入获取渠道"
                            type="textarea"
                            :autosize="{ minRows: 4 }"
                            @change="(val) => {
                              toggleSelected(item, val, true, ans.needSpecify)
                            }"
                          />
                        </div>
                      </template>
                      <template v-else>
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
                                @input="getSelected(item, ans.choice)"
                              />
                            </div>
                          </el-radio>
                        </el-radio-group>
                      </template>
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
            
            <div class="questions-content" v-if="isAnswered">
              <div class="thumbs-up-div"><img src="../../assets/feedback/thumbs-up.png" /></div>
              <div class="header-title-div">
                <span class="span1">恭喜您完成本月的调查问卷</span> 
                <span class="span2">下月问卷将于次月1号重新开启</span>
              </div>
              <div class="header-title-div" style="margin-top: 25px">
                <span class="span3">此次问卷提供<span class="span1" style="color: #468CFF">18-188元</span>建议金</span> 
              </div>
              <div class="qr-code-div">
                <VueQRCodeComponent :size="188" :text="referralLink" />
                <!-- <img src="../../assets/feedback/share.png"/> -->
              </div>
              <div class="url-div">
                <el-input 
                  class="url-input-fill" 
                  v-model="referralLink"
                  :readonly="true"
                  type="url"
                  />
                <div>
                  <button class="standard-button btn-color-blue copy-button" @click="copyMessage()">{{copybtntxt}}</button>
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
import { getQuestionnaireList, submitQuestionnaire, getQuestionnaireAns } from "@/api/index/promo";
import { userStore } from "@/store"
import { ElMessage } from "element-plus";
import { CaretBottom } from '@element-plus/icons-vue'
import VueQRCodeComponent from 'vue-qrcode-component'

const store = userStore();
const recordsPagination = reactive({ size: 3, current: 1, total: 3, pages: 3 });
const uiIsShowStatus = reactive({
  startAnswerBox: true,
  questionBox: false,
  showQuestions: true,
});
function onBtnStartAnswerClick() {
  // debugger;
  uiIsShowStatus.startAnswerBox = false;
  uiIsShowStatus.questionBox = true;
  recordsPagination.current = 1;
}
const quesTitleOptions = ref([]);
let optionModal = ref([]);


const referralLink = ref();
const getReferral = () => {
  referralLink.value = 'https://' + location.hostname + `/center/feedback`;
}
const copybtntxt = ref('复制');

const activeNames= ref();
const handleChange = () => {

}
const copyMessage = (position) => {
  let copyText = null;
    copyText = referralLink.value
  // Create a temporary textarea element
  const tempTextarea = document.createElement('textarea');
  tempTextarea.value = copyText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it
  tempTextarea.select();
  document.execCommand('copy');

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);
  copybtntxt.value = '已复制';
  setTimeout(() => {
    copybtntxt.value = '复制';
  }, 2000);
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};
const getQuesTitleOptions = () => {
  getQuestionnaireList().then((res) => {
    // res = {
    //   "code": 0,
    //   "data": [
    //       {
    //           "sequence": 1,
    //           "question": "您是如何知道我们网站的？(单选)",
    //           "choices": [
    //               {
    //                   "choice": "百度等搜索引擎",
    //                   "needSpecify": false
    //               },
    //               {
    //                   "choice": "网络站点广告",
    //                   "needSpecify": false
    //               },
    //               {
    //                   "choice": "其他",
    //                   "needSpecify": true
    //               }
    //           ]
    //       },
    //       {
    //           "sequence": 2,
    //           "question": "您是如何觉得XXXXXXXXXX",
    //           "choices": [
    //               {
    //                   "choice": "XXXXXXXXXXX",
    //                   "needSpecify": false
    //               },
    //               {
    //                   "choice": "XXXXXXXXXXX",
    //                   "needSpecify": false
    //               }
    //           ]
    //       },
    //       {
    //           "sequence": 3,
    //           "question": "您是如何觉得XXXXXXXXXX",
    //           "choices": [
    //               {
    //                   "choice": "生命真重要",
    //                   "needSpecify": false
    //               },
    //               {
    //                   "choice": "生命真的是美丽的",
    //                   "needSpecify": false
    //               }
    //           ]
    //       },
    //   ]
    // }
    if (res.code === 0) {
      quesTitleOptions.value = res.data
      recordsPagination.pages = res.data.length
      uiIsShowStatus.showQuestions = quesTitleOptions.value.length !== 0
    } else {
      ElMessage.error(res.message)
    }

  })
}
const isAnswered = ref(false)
const answerInputModal = ref('');
const choices = reactive([]);
const cacheChoices = reactive([]);
const getSelected = (item, ans) => {
  const input = answerInputModal.value
  var obj = {
    question: item.question,
    choice: input ? input : ans
  }
  choices[item.sequence - 1] = obj
  var cacheObj = {
    sequence: item.sequence,
    question: item.question,
    choice: ans,
    input: input
  }
  cacheChoices[item.sequence - 1] = cacheObj
}
const toggleSelected = (item, ans, isChecked, needSpecify) => {
  const input = answerInputModal.value;
  
  const previousChoicesArr = Array.from(choices[item.sequence - 1]?.choice || []);
  const newChoicesArr = [...previousChoicesArr, ans].filter(item => !isChecked ? item !== ans : item);

  var obj = {
    question: item.question,
    choice: newChoicesArr
  };
  choices[item.sequence - 1] = obj;
  var cacheObj = {
    sequence: item.sequence,
    question: item.question,
    choice:newChoicesArr,
    input: input,
    needSpecify,
    isMultiple: true
  };
  cacheChoices[item.sequence - 1] = cacheObj;
};
const btnClick = (btnType) => {
  if (optionModal.value === null && (btnType === 'next' || btnType === 'final')) {
    return ElMessage.error('请选择一个选项')
  }
  optionModal.value = []
  answerInputModal.value = null
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const finalBtn = document.getElementById("finalBtn");
  if (btnType === 'prev') {
      recordsPagination.current = recordsPagination.current - 1;
  }
  if (btnType === 'next') {
    recordsPagination.current = recordsPagination.current + 1;
  }
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
  cacheChoices.forEach((c) => {
    if (c.sequence === recordsPagination.current) {
      const choicesArray = quesTitleOptions.value[Number(c.sequence) - 1].choices
      const chosenChoice = (() => {
        if(c.isMultiple) {
          const multipleChoices =  c.choice.map((selectedChoice) => choicesArray.findIndex(({choice}) => choice === selectedChoice));
          const needSpecifyChoice = choicesArray.findIndex(choice => choice.needSpecify);

          return c.input ? [needSpecifyChoice, ...multipleChoices] : multipleChoices;
        }

        return choicesArray.findIndex(choice => choice.choice === c.choice);
      })();
      optionModal.value = chosenChoice
      answerInputModal.value = c.input ? c.input : ''
    }
  })
  
  if (btnType === 'final') {
    const choicesLockedIn = Array.from(choices).map((field) => ({
      ...field,
      choice: Array.isArray(field.choice) ? field.choice.join(',') : field.choice
    }));

    // const questionDiv = document.getElementById("questionContainer");
    // const QRDiv = document.getElementById("QRContainer");
    // When Submit API is COMPLETE
    
    submitQuestionnaire(choicesLockedIn).then((res) => {
      if (res.code === 0) {
        // questionDiv.style.display = "none";
        // QRDiv.style.display = "block";
        isAnswered.value = true;
      } else {
        ElMessage.error(res.message)
      }
    })
  }
}

// const urlInput = ref("Http://LHe63851/s?eric123");

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
      pageSize: 5,
      total: 0
    },
    sent: {
      list: [],
      pageNum: 1,
      pageSize: 5,
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
        } else {
          ElMessage.error(res.message)
        }
      })
      .catch((error) => {
        console.log(error);
        // message.error(error.message, 4)
      });
  } else {
    mailboxData.value = {
      type: null,
      current: mailboxState.mailboxList["sent"].pageNum,
      size: mailboxState.mailboxList["sent"].pageSize,
      orderBy: "createTime"
    };
    mailboxState.mailboxList["sent"].list = [];
    mailOutbox(mailboxData.value)
      .then((response) => {
        if (response.code === 0) {
          mailboxState.mailboxList["sent"].list.push(...response.data.records);
          mailboxState.mailboxList["sent"].total = response.data.total;
        } else {
          ElMessage.error(response.message)
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
              message: t('common.submitSuccess'),
              type: "success"
            });
            loadPersonalMailbox();

            mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
          } else {
            ElMessage.error(response.message)
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
const testAns = () => {
  getQuestionnaireAns().then((res) => {
    if (res.code === 0) {
      if (res.data && res.data.length === 0) {
        loadPersonalMailbox();
        getQuesTitleOptions();
      } else {
        uiIsShowStatus.questionBox= true;
        isAnswered.value = true;
      }
    } else {
      ElMessage.error(res.message)
    }
  })
}

onMounted(() => {
  if (store.token) {
    testAns();
    getReferral();
  }
  
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

    // img {
    //   width: 188px;
    //   height: 233px;
    // }
  }

  .url-div {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #3F8CFF;
    margin-top: 30px;
    gap: 5px;
    width: 100%;
    position: relative;
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
    bottom: 5px;
    right: 110px;
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
    // color: $font-1;
    // border-radius: 10px;
    // margin-bottom: 12px;
    // padding: 0 16px;
    // font-weight: 600;
    // color: $font-1;
    // font-size: 1rem; */
    border-radius: 10px;
    margin-bottom: 12px;
    padding: 10px 15px;
    font-weight: 600;
    color: $font-1;
    word-break: break-all;
    width: 100%;
    overflow-wrap: break-word;
    height: unset;
    text-align: left;
    line-height: 1.4rem;
  }
  :deep(.el-collapse-item__content) {
    padding: 0 16px 16px;
    color: $font-1;
    font-size: 0.875rem;
    line-height: 1rem;
    word-wrap: break-word;
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

  .empty-text{
    text-align: center;
    margin-top: 50px;
  }

  .title-p{
    width: 100%;
    word-wrap: break-word; /* 控制文字换行 */
    overflow-wrap: break-word;
    text-align: left;
    line-height: 18px;
    margin-bottom: 5px;
  }

  .content-p{
    width: 100%;
    word-wrap: break-word; /* 控制文字换行 */
    overflow-wrap: break-word;
    text-align: left;
    line-height: 15px;

  }
}

.quiz-disable {
  display: flex;
  justify-content: center;
  font-size: 20px;
  align-items: center;
  margin-top: 40px;
  font-weight: 600;
  color: $font-2;
  font-size: 1.275rem;
}
</style>
