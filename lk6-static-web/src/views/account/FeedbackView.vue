<template>
  <div class="account-box account-contents">
    <div class="account-content mail mail-content">
      <el-tabs v-model="mailboxState.active" @tab-click="mailTabChange" type="card" class="feedback-tabs">
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
              <div class="input-title">意见类型</div>
              <div class="input-fill">
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
              </div>
            </div>

            <div class="mail-input-item">
              <div class="input-title-container">
                <div class="input-title">标题</div>
                <div class="mail-btn-group">
                  <el-dropdown trigger="click">
                    <el-button class="standard-button btn-color-blue" style="border-radius: 2rem; padding: 20px 26px">
                      快捷输入
                      <el-icon style="margin-left: 5px"><CaretBottom /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(option, i) in options" :key="i" @click="onItemClick(option)">
                          {{ option }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>

              <div class="input-fill">
                <el-input
                  ref="titleRef"
                  v-model="mailboxState.mailboxList.write.title"
                  placeholder="请输入标题"
                  maxlength="255"
                  show-word-limit
                />
              </div>
            </div>

            <div class="mail-input-item">
              <div class="input-title">上传图片</div>
              <div class="input-fill">
                <FileUpload class="upload-photo-board" @photo-response="getImageLink" ref="uploadFileRef" />
              </div>
            </div>

            <div class="mail-input-item">
              <div class="input-title">内容<span class="red-note">注:若您的建议和反馈被本平台使用采纳，我们将奉送38~888元奖金</span></div>
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
          <template v-if="mailboxState.mailboxList.sent.list.length > 0 && !isLoading">
            <el-collapse v-model="activeNames" @change="handleChange">
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
            <div class="mail-pagination-wrapper">
              <el-pagination
                @current-change="changePage"
                :total="mailboxState.mailboxList.sent.total"
                :current-page="mailboxState.mailboxList.sent.pageNum"
                :page-size="mailboxState.mailboxList.sent.pageSize"
              />
            </div>
          </template>
          <template v-else-if="!isLoading">
            <p class="empty-text">暂无记录</p>
          </template>
          <template v-else>
            <p class="empty-text">加载中...</p>
          </template>
        </el-tab-pane>

        <el-tab-pane key="quiz" name="quiz" :label="'有奖问答'">
          <div class="quiz-wrapper">
            <div class="quiz-announcement-wrapper" v-if="uiIsShowStatus.showQuestions">
              <img src="@/assets/feedback/quiz-announcement-icon.png" />
              <div
                class="quiz-announcement-inner"
                :class="{ animated: announcementAnimated }"
                @transitionend="handleAnnouncementAnimationEnd"
              >
                <div v-for="(announcement, index) in announcements" :key="index">
                  恭喜用户 {{ announcement.account }}xxxxxxxxx 获得反馈彩金
                  <span class="amount">{{ announcement.bonus }}元</span>
                </div>
              </div>
            </div>

            <div v-if="!uiIsShowStatus.showQuestions" class="quiz-disable">活动尚未开启</div>
            <div v-if="!uiIsShowStatus.questionBox && uiIsShowStatus.showQuestions" class="quiz-container">
              <div class="quiz-header">有奖问答</div>
              <div class="quiz-gift">
                <img v-if="isDark" src="../../assets/feedback/gift-dark.png" />
                <img v-else src="../../assets/feedback/gift.png" />
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
              <div class="questions-header">有奖问答</div>
              <div class="questions-gift">
                <img v-if="isDark" src="../../assets/feedback/gift-dark.png" />
                <img v-else src="../../assets/feedback/gift.png" />
              </div>
              <div class="questions-content" v-if="!isAnswered">
                <div v-for="(item, i) in quesTitleOptions" :key="i" class="question-title-container">
                  <template v-if="recordsPagination.current === item.sequence">
                    <div class="questions-title">
                      {{ item.question }}<span class="singlemultiple">({{ item.isMultiple ? '多选项' : '单选' }})</span>
                    </div>
                    <div class="answer-container">
                      <template v-if="item.isMultiple" v-for="(ans, index) in item.choices" :key="index">
                        <el-checkbox
                          v-model="optionModal"
                          :label="index"
                          @change="
                            (newValue) => {
                              toggleSelected(
                                item,
                                ans.needSpecify ? answerInputModal : ans.choice,
                                newValue,
                                ans.needSpecify
                              );
                            }
                          "
                        >
                          {{ ans.choice }}
                        </el-checkbox>
                        <div
                          v-if="
                            item.isMultiple &&
                            Array.isArray(optionModal) &&
                            Array.from(optionModal).includes(index) &&
                            ans.needSpecify
                          "
                        >
                          <el-input
                            class="answer-input-fill"
                            v-model="answerInputModal"
                            placeholder="请输入获取渠道"
                            type="textarea"
                            :autosize="{ minRows: 4 }"
                            @change="
                              (val) => {
                                toggleSelected(item, val, true, ans.needSpecify);
                              }
                            "
                          />
                        </div>
                      </template>
                      <template v-else>
                        <el-radio-group v-model="optionModal">
                          <el-radio
                            v-for="(ans, index) in item.choices"
                            :key="index"
                            :label="index"
                            @click="getSelected(item, ans.choice)"
                          >
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

                <div
                  :class="`content-btn ${recordsPagination.current === 1 ? 'active' : ''}`"
                  style="display: flex; justify-content: space-between; gap: 10px"
                >
                  <div>
                    <button
                      id="prevBtn"
                      class="standard-button btn-color-blue"
                      @click="btnClick('prev')"
                      style="display: none"
                    >
                      上一题
                    </button>
                  </div>
                  <div>
                    <button :disabled="!input && optionModal.length === 0" :class="!input && optionModal.length === 0 ? 'next-disabled': ''" id="nextBtn" class="standard-button btn-color-blue" @click="btnClick('next')">
                      下一题
                    </button>
                  </div>
                  <div>
                    <button
                      id="finalBtn"
                      class="standard-button btn-color-blue"
                      @click="btnClick('final')"
                      style="display: none"
                      :disabled="!input && optionModal.length === 0"
                      :class="!input || optionModal.length === 0 ? '' : ''"
                    >
                      完成
                    </button>
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
                  <span class="span3">
                    根据您填写的内容随机为您派发
                    <span class="span1">0-188元</span>
                  </span>
                </div>
                <div class="qr-code-div">
                  <VueQRCodeComponent :size="188" :text="referralLink" />
                  <!-- <img src="../../assets/feedback/share.png"/> -->
                </div>
                <div class="url-div">
                  <el-input class="url-input-fill" v-model="referralLink" :readonly="true" type="url" />
                  <div>
                    <button class="standard-button btn-color-blue copy-button" @click="copyMessage()">
                      {{ copybtntxt }}
                    </button>
                  </div>
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
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { mailInbox, mailOutbox, submitFeedback, getFeedbackType, readFeedback } from "@/api/personal/mailbox";
// import { message } from "ant-design-vue";
import { getQuestionnaireList, submitQuestionnaire, getQuestionnaireAns } from "@/api/index/promo";
import { userStore } from "@/store";
import { useNotify } from "@/hooks/notify";
import { CaretBottom } from "@element-plus/icons-vue";
import VueQRCodeComponent from "vue-qrcode-component";
import FileUpload from "@/components/feedback/FileUpload.vue";
import { useDark } from "@vueuse/core";

const notify = useNotify();
const store = userStore();
const recordsPagination = reactive({ size: 3, current: 1, total: 3, pages: 3 });
const uiIsShowStatus = reactive({
  startAnswerBox: true,
  questionBox: false,
  showQuestions: true
});
const isDark = useDark();

const feedbackTypes = ref("");
const announcementBonusList = ref([8, 12, 16, 36, 38, 68]);
const announcementTimer = ref(null);
const announcementAnimated = ref(false);
const announcements = ref([]);

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

  notify.success({
    type: "success",
    message: "上传成功"
  });
};

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
  referralLink.value = "https://" + location.hostname + `/center/feedback`;
};
const copybtntxt = ref("复制");

const activeNames = ref();
const handleChange = () => {};
const copyMessage = (position) => {
  let copyText = null;
  copyText = referralLink.value;
  // Create a temporary textarea element
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = copyText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it
  tempTextarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);
  copybtntxt.value = "已复制";
  setTimeout(() => {
    copybtntxt.value = "复制";
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
      quesTitleOptions.value = res.data;
      recordsPagination.pages = res.data.length;
      uiIsShowStatus.showQuestions = quesTitleOptions.value.length !== 0;
    } else {
      notify.error(res.message);
    }
  });
};
const isAnswered = ref(false);
const answerInputModal = ref(null);
const choices = reactive([]);
const cacheChoices = reactive([]);
const getSelected = (item, ans) => {
  const input = answerInputModal.value;
  var obj = {
    question: item.question,
    choice: input ? input : ans
  };
  choices[item.sequence - 1] = obj;
  var cacheObj = {
    sequence: item.sequence,
    question: item.question,
    choice: ans,
    input: input
  };
  cacheChoices[item.sequence - 1] = cacheObj;
};

function removeEmojis(str) {
  return str.replace(/[\u{1F600}-\u{1F64F}]/gu, '')  // 表情符号块
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')  // 杂项符号和象形文字
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')  // 交通和地图符号
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '')  // 阿尔化学符号
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')  // 地球和天气符号
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')  // 装饰符号
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')  // 衣物和配件符号
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')  // 动物、自然和家居符号
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')  // 手势和姿势
    .replace(/[\u{2600}-\u{26FF}]/gu, '')    // 杂项符号
    .replace(/[\u{2700}-\u{27BF}]/gu, '')    // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')    // 变化选择器
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')  // 衣物和配件符号
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, ''); // 国旗符号
}

const toggleSelected = (item, ans, isChecked, needSpecify) => {
  const input = answerInputModal.value;

  const previousChoicesArr = Array.from(choices[item.sequence - 1]?.choice || []);
  const newChoicesArr = [...previousChoicesArr, ans].filter((item) => (!isChecked ? item !== ans : item));

  var obj = {
    question: item.question,
    choice: newChoicesArr
  };
  choices[item.sequence - 1] = obj;
  var cacheObj = {
    sequence: item.sequence,
    question: item.question,
    choice: newChoicesArr,
    input: input,
    needSpecify,
    isMultiple: true
  };
  cacheChoices[item.sequence - 1] = cacheObj;
};
const btnClick = (btnType) => {
  if (optionModal.value === null && (btnType === "next" || btnType === "final")) {
    return notify.error("请选择一个选项");
  }
  optionModal.value = [];
  answerInputModal.value = null;
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const finalBtn = document.getElementById("finalBtn");
  if (btnType === "prev") {
    recordsPagination.current = recordsPagination.current - 1;
  }
  if (btnType === "next") {
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
      const choicesArray = quesTitleOptions.value[Number(c.sequence) - 1].choices;
      const chosenChoice = (() => {
        if (c.isMultiple) {
          const multipleChoices = c.choice.map((selectedChoice) =>
            choicesArray.findIndex(({ choice }) => choice === selectedChoice)
          );
          const needSpecifyChoice = choicesArray.findIndex((choice) => choice.needSpecify);

          return c.input ? [needSpecifyChoice, ...multipleChoices] : multipleChoices;
        }

        return choicesArray.findIndex((choice) => choice.choice === c.choice);
      })();
      optionModal.value = chosenChoice;
      answerInputModal.value = c.input ? c.input : "";
    }
  });

  if (btnType === "final") {
    const choicesLockedIn = Array.from(choices).map((field) => ({
      ...field,
      choice: Array.isArray(field.choice) ? field.choice.join(",") : field.choice
    }));

    choicesLockedIn.forEach((item) => {
      item.choice = removeEmojis(item.choice);
    })

    // const questionDiv = document.getElementById("questionContainer");
    // const QRDiv = document.getElementById("QRContainer");
    // When Submit API is COMPLETE

    submitQuestionnaire(choicesLockedIn).then((res) => {
      if (res.code === 0) {
        // questionDiv.style.display = "none";
        // QRDiv.style.display = "block";
        isAnswered.value = true;
      } else {
        notify.error(res.message);
      }
    });
  }
};

// const urlInput = ref("Http://LHe63851/s?eric123");

const options = ["存款问题", "转账问题", "提款问题", "其他"];

const onItemClick = (item) => {
  mailboxState.mailboxList.write.title = item;
};
const isLoading = ref(true);
const loadingBtn = ref(false);
const mailboxData = ref([]);
const mailboxState = reactive({
  active: "write",
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
      content: "",
      photo: ""
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
          // mailboxState.mailboxList[mailboxState.active].list.push(...response.records);
          mailboxState.mailboxList[mailboxState.active].list = response.records;
          mailboxState.mailboxList[mailboxState.active].total = response.total;
        } else {
          notify.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
        // message.error(error.message, 4)
      });
  } else {
    isLoading.value = true
    mailboxData.value = {
      type: null,
      current: mailboxState.mailboxList["sent"].pageNum,
      size: mailboxState.mailboxList["sent"].pageSize,
      orderBy: "createTime"
    };
    mailboxState.mailboxList["sent"].list = [];
    mailOutbox(mailboxData.value)
      .then((response) => {
        isLoading.value = false
        if (response.code === 0) {
          // mailboxState.mailboxList["sent"].list.push(...response.data.records);
          mailboxState.mailboxList["sent"].list = response.data.records;
          mailboxState.mailboxList["sent"].total = response.data.total;
        } else {
          notify.error(response.message);
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
  mailboxState.mailboxList["sent"].pageNum = 1
  mailboxState.active = nk.props.name;
  if (nk.props.name !== "write") {
    const mailList = mailboxState.mailboxList[nk.props.name].list;
    // if (mailList && mailList.length === 0) {
    //   loadPersonalMailbox();
    // }
    loadPersonalMailbox();
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
const onSubmit = (e) => {
  e.preventDefault();
  loadingBtn.value = true;
  formRef.value
    .validate()
    .then(() => {
      submitFeedback(mailboxState.mailboxList.write)
        .then((response) => {
          if (response.code === 0) {
            // notify({
            //   message: "提交成功",
            //   type: "success"
            // });
            loadPersonalMailbox();

            mailboxState.mailboxList.write.feedbackType = "";
            mailboxState.mailboxList.write.title = "";
            mailboxState.mailboxList.write.content = "";
            uploadFileRef.value.clear();
          } else {
            notify.error(response.message);
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
        uiIsShowStatus.questionBox = true;
        isAnswered.value = true;
      }
    } else {
      notify.error(res.message);
    }
  });
};

const getRandomAccount = () => {
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
  const randomIndex1 = Math.floor(Math.random() * 26);
  const randomIndex2 = Math.floor(Math.random() * 26);

  return letters[randomIndex1] + letters[randomIndex2];
};

const getRandomBonus = () => {
  return announcementBonusList.value[Math.floor(Math.random() * announcementBonusList.value.length)];
};

const initAnnouncement = () => {
  if (announcementTimer.value) clearInterval(announcementTimer.value);
  announcementTimer.value = setInterval(() => {
    announcementAnimated.value = true;
  }, 5000);
};

const handleAnnouncementAnimationEnd = () => {
  const newAnnouncement = { account: getRandomAccount(), bonus: getRandomBonus() };
  announcements.value = [announcements.value[1], newAnnouncement];
  announcementAnimated.value = false;
};

onMounted(() => {
  if (store.token) {
    testAns();
    getReferral();
    loadFeedbackType();
  }

  if (uiIsShowStatus.showQuestions) {
    announcements.value = [
      { account: getRandomAccount(), bonus: getRandomBonus() },
      { account: getRandomAccount(), bonus: getRandomBonus() }
    ];
    initAnnouncement();
  }

  // mailboxState.mailboxList[mailboxState.active].list.push(...mailboxData);
});

onUnmounted(() => {
  if (announcementTimer.value) clearInterval(announcementTimer.value);
});
</script>
<style lang="scss">

.standard-button.btn-color-blue {
  &.next-disabled {
    cursor: disabled;
    background: #AAAAAA;
    border-color: #AAAAAA;
  }
}

.upload-photo-board .el-input__wrapper{
  width: 875px;
}
</style>
<style scoped lang="scss">

.dark .mail-content .empty-text {
   color: #a98f7c;
}

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
    top: 40px;
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
    top: 40px;
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
      color: #4288ff;
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-start;
      width: 100%;
      margin-left: 20px;
      .singlemultiple {
        color: #ff0000;
        font-size: 14px;
      }
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
    color: #424f72;
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
    color: #468cff;
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
    color: #424f72;
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
    color: #3f8cff;
    margin-top: 30px;
    gap: 5px;
    width: 100%;
    position: relative;
  }

  .url-input-fill {
    --el-input-text-color: #3f8cff;
    width: 389px;
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
  overflow-wrap: break-word;
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
      .red-note {
        color: #ff0000;
        margin-left: 10px;
      }
    }
    .input-fill {
      :deep(.el-form-item__label) {
        width: 80px;
      }

      :deep(.el-input__wrapper),
      :deep(.el-select__wrapper) {
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

  .empty-text {
    text-align: center;
    margin-top: 50px;
    color: #000000;
  }

  .title-p {
    width: 100%;
    word-wrap: break-word; /* 控制文字换行 */
    overflow-wrap: break-word;
    text-align: left;
    line-height: 18px;
    margin-bottom: 5px;
  }

  .content-p {
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

.feedback-tabs {
  padding-top: 0;
}

.quiz-announcement-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: #5ea1ff1a;
  padding: 0 15px;
  border-radius: 35px;
  height: 44px;
  overflow: hidden;

  img {
    width: 36px;
  }

  .quiz-announcement-inner {
    position: relative;
    align-self: start;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
    line-height: 44px;
    letter-spacing: 0.05em;
    color: $font-1;

    &.animated {
      transition: transform 1s;
      transform: translateY(-44px);
    }

    > div {
      height: 44px;

      .amount {
        color: $primary;
      }
    }
  }
}

.dark {
  .mail-content {
    .mail-input-item {
      .input-title {
        color: #a4aabb;
      }

      .input-fill {
        &:deep(.el-select__wrapper),
        &:deep(.el-input__wrapper),
        &:deep(.el-textarea__inner) {
          box-shadow: none;
          background-color: $background-content-block-lighter-dark;
        }
      }
    }

    &:deep(.el-collapse) {
      .el-collapse-item__header {
        background: $background-content-block-lighter-dark;
        color: $font-3-dark;
      }
    }
  }

  .quiz-container {
    .quiz-header {
      padding-bottom: 60px;
      margin-bottom: -44px;
      background: linear-gradient(180deg, #A88D7C 0%, #a88d7c14 100%);
    }

    .quiz-content {
      @include content-block-dark;
      border-color: #E9CC94;

      .content-title,
      .content-desc {
        color: $font-3-dark;
      }
    }
  }

  .questions-container {
    .questions-header {
      padding-bottom: 60px;
      margin-bottom: -44px;
      background: linear-gradient(180deg, #A88D7C 0%, #a88d7c14 100%);
    }

    .questions-content {
      @include content-block-dark;
      border-color: #E9CC94;

      .questions-title {
        color: $active-color-dark;
      }

      .answer-input-fill {
        :deep(.el-textarea__inner) {
          box-shadow: none;
          background-color: $background-content-block-lighter-dark;
        }
      }

      .url-input-fill {
        --el-input-text-color: #{$active-color-dark};

        :deep(.el-input__wrapper) {
          box-shadow: none;
          background-color: $background-content-block-lighter-dark;
        }
      }

      .span1 {
        color: $active-color-dark;
      }

      .url-div {
        color: $active-color-dark;
      }
    }

    .header-title-div {
      color: $color-white;
    }
  }

  .quiz-announcement-wrapper {
    .quiz-announcement-inner {
      color: $font-3-dark;

      > div {
        .amount {
          color: $active-color-dark;
        }
      }
    }
  }
}
</style>
