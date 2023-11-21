<template>
  <el-dialog
    width="500px"
    v-model="isFirstQuestionClicked"
    :close-on-click-modal="false"
    title="提交答案"
  >
    <div class="question-select-box">
      <div
        v-for="(e, i) in matchInfo.choiceOne"
        :key="`choice-one-${i}`"
        :class="`question-select-option ${
          firstChoiceIndex === i ? 'active' : ''
        }`"
        :data-value="e"
        @click="onFirstChoiceSelectionClick(e, i)"
      >
        {{ e }}
      </div>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" @click="onChoiceSubmit('first')">
        提交
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    width="500px"
    v-model="isSecondQuestionClicked"
    :close-on-click-modal="false"
    title="提交答案"
  >
    <div class="question-select-box">
      <div
        v-for="(e, i) in matchInfo.choiceTwo"
        :key="`choice-two-${i}`"
        :class="`question-select-option ${
          secondChoiceIndex === i ? 'active' : ''
        }`"
        :data-value="e"
        @click="onSecondChoiceSelectionClick(e, i)"
      >
        {{ e }}
      </div>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" @click="onChoiceSubmit('second')">
        提交
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    width="500px"
    v-model="isThirdQuestionClicked"
    :close-on-click-modal="false"
    title="提交答案"
  >
    <div class="question-select-box">
      <div
        v-for="(e, i) in matchInfo.choiceThree"
        :key="`choice-three-${i}`"
        :class="`question-select-option ${
          thirdChoiceIndex === i ? 'active' : ''
        }`"
        :data-value="e"
        @click="onThirdChoiceSelectionClick(e, i)"
      >
        {{ e }}
      </div>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" @click="onChoiceSubmit('third')">
        提交
      </el-button>
    </div>
  </el-dialog>

  <div class="prize-quiz-container">
    <div class="prize-quiz-top-div"></div>
    <div class="prize-quiz-content-container">
      <div class="prize-quiz-jc-container">
        <div class="prize-quiz-jc-txt" id="pool">
          $ {{ matchInfo.poolAmount }}
        </div>
      </div>
      <div class="prize-quiz-main">
        <div class="title" id="title">
          {{ matchInfo.quizTitle || "答题区" }}
        </div>
        <div
          :class="`start-answer-box ${
            uiIsShowStatus.startAnswerBox ? '' : 'hide'
          }`"
        >
          <div class="book-img">
            <img
              src="../../../assets/images/promotion/hotpromo/esportquiz/img_book_7.png"
              style="width: 180px; height: 78px"
            />
          </div>
          <div class="btn-start-answer" @click="onBtnStartAnswerClick()"></div>
        </div>
        <div
          :class="`questions-box ${uiIsShowStatus.questionBox ? 'show' : ''}`"
        >
          <div class="questions-container">
            <div class="questions-item-box">
              <div class="item-question">
                第一题:{{ matchInfo.questionOne }}
              </div>
              <div class="question-options-box">
                答案：
                <button
                  class="btn-answer"
                  data-question-id="2"
                  data-question-type="select"
                  id="firstQuestion"
                  @click="onFirstQuestionClick(true)"
                >
                  {{ firstChoiceRef || "选择答案" }}
                </button>
              </div>
            </div>
            <div class="questions-item-box">
              <div class="item-question">
                第二题:{{ matchInfo.questionTwo }}
              </div>
              <div class="question-options-box">
                答案：
                <button
                  class="btn-answer"
                  data-question-id="2"
                  data-question-type="select"
                  id="secondQuestion"
                  @click="onSecondQuestionClick(true)"
                >
                  {{ secondChoiceRef || "选择答案" }}
                </button>
              </div>
              <div
                class="btn-answer"
                data-question-id="1"
                data-question-type="select"
                id="submitBtn"
                @click="onSubmitClick()"
              >
                提交答案
              </div>
            </div>
            <div class="questions-item-box">
              <div class="item-question">
                第三题:{{ matchInfo.questionThree }}
              </div>
              <div class="question-options-box">
                答案：
                <button
                  class="btn-answer"
                  data-question-id="2"
                  data-question-type="select"
                  id="thirdQuestion"
                  @click="onThirdQuestionClick(true)"
                >
                  {{ thirdChoiceRef || "选择答案" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="title-img title-record"></div>
      <div>
        <table v-if="isHasRecord" class="record-table" id="record-table">
          <tr>
            <th style="width: 50%">日期</th>
            <th style="width: 25%">答案</th>
            <th style="width: 25%">中奖记录</th>
          </tr>
          <tr>
            <td>{{ tableInfo.time }}</td>
            <td>{{ tableInfo.answer }}</td>
            <td :class="tableInfo.className">{{ tableInfo.statusText }}</td>
          </tr>
        </table>
        <table v-else class="record-table" id="record-table"></table>

        <template v-if="isHasRecord">
          <div class="prev page-item" @click="onPrevPageClick()">&lt;</div>
          <div
            v-for="(e, i) in paginationInfo.pageTotal"
            :key="`page-content-${i}`"
            :id="`page-number-${e + 1}`"
            :class="`page-number page-item ${
              paginationInfo.pageNumber === e ? 'active' : ''
            }`"
            @click="onPaginationClick()"
          >
            {{ e + 1 }}
          </div>
          <div class="next page-item" @click="onNextPageClick()">&gt;</div>
        </template>
        <div v-else class="page-list">暂无记录</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { userStore } from "@/store";
import { ElMessage } from "element-plus";
import {
  getSportMatchQuizInfo,
  getMemberSportMatchRecord,
  submitMemberSportMatchQuiz
} from "@/api/index/promo";
import moment from "moment";

const store = userStore();

onMounted(() => {
  if (!store.token) {
    ElMessage.error("请登录后操作");
    return;
  }

  getMatchInfo();
  getRecords();
});

const uiIsShowStatus = reactive({
  startAnswerBox: true,
  questionBox: false
});
function onBtnStartAnswerClick() {
  uiIsShowStatus.startAnswerBox = false;
  uiIsShowStatus.questionBox = true;
}

const matchInfo = reactive({
  poolAmount: "",
  quizTitle: "",
  homeTeam: "",
  awayTeam: "",
  questionOne: "",
  questionTwo: "",
  questionThree: "",
  choiceOne: [],
  choiceTwo: [],
  choiceThree: []
});
const quizSubmitInfo = reactive({
  answerOne: "",
  answerTwo: -1,
  answerThree: -1,
  quizId: -1,
  quizTitle: ""
});
function getMatchInfo() {
  getSportMatchQuizInfo().then((res) => {
    const {
      poolAmount,
      quizTitle,
      id,
      homeTeam,
      awayTeam,
      questionOne,
      questionTwo,
      questionThree,
      choiceOne,
      choiceTwo,
      choiceThree
    } = res.data;

    // matchInfo
    if (poolAmount) matchInfo.poolAmount = poolAmount;
    if (quizTitle) matchInfo.quizTitle = quizTitle;

    matchInfo.homeTeam = homeTeam;
    matchInfo.awayTeam = awayTeam;

    matchInfo.questionOne = questionOne;
    matchInfo.questionTwo = questionTwo;
    matchInfo.questionThree = questionThree;

    matchInfo.choiceOne = JSON.parse(choiceOne);
    matchInfo.choiceTwo = JSON.parse(choiceTwo);
    matchInfo.choiceThree = JSON.parse(choiceThree);

    // quizSubmitInfo
    if (id >= 0) quizSubmitInfo.quizId = id;
    quizSubmitInfo.quizTitle = quizTitle;
  });
}

const records = ref();
const paginationInfo = reactive({ pageSize: 5, pageNumber: 1, pageTotal: 0 });

const isHasRecord = ref(false);
function getRecords() {
  getMemberSportMatchRecord().then((res) => {
    const { code, data } = res;
    if (code == 0) {
      records.value = data.answers;

      const dataLength = data.answers.length;
      if (dataLength) {
        let pageTotal;
        pageTotal = dataLength % paginationInfo.pageSize == 0 ? 0 : 1;
        pageTotal = pageTotal + parseInt(dataLength / paginationInfo.pageSize);
        paginationInfo.pageTotal = pageTotal;

        getRecordList();

        isHasRecord.value = true;
      }
    }
  });
}

function onPrevPageClick() {
  if (paginationInfo.pageNumber === 1) return;

  paginationInfo.pageNumber = paginationInfo.pageNumber--;
  getRecordList();
}

function onNextPageClick() {
  if (paginationInfo.pageNumber + 1 > paginationInfo.pageTotal) return;

  paginationInfo.pageNumber++;
  getRecordList();
}

function onPaginationClick(pageIndex) {
  if (paginationInfo.pageNumber === pageIndex) return;

  paginationInfo.pageNumber = pageIndex;
  getRecordList();
}

const tableInfo = reactive({
  time: "",
  answer: "",
  className: "not-got",
  statusText: ""
});
function getRecordList() {
  const { pageSize, pageNumber } = paginationInfo;
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  records.value.forEach((e, i) => {
    if (i >= start && i < end) {
      const { createTime, answerOne, answerTwo, answerThree, status } = e;

      tableInfo.time = moment(createTime).format("YYYY-MM-DD HH:mm:ss");
      tableInfo.answer = answerOne + ", " + answerTwo + ", " + answerThree;
      tableInfo.statusText = status;
      if (status == "WIN") tableInfo.className = "got-answer";
    }
  });
}

const isFirstQuestionClicked = ref(false);
function onFirstQuestionClick(flag) {
  isFirstQuestionClicked.value = flag;
}

const isSecondQuestionClicked = ref(false);
function onSecondQuestionClick(flag) {
  isSecondQuestionClicked.value = flag;
}

const isThirdQuestionClicked = ref(false);
function onThirdQuestionClick(flag) {
  isThirdQuestionClicked.value = flag;
}

let firstChoice = "";
const firstChoiceIndex = ref();
function onFirstChoiceSelectionClick(choice, selectionIndex) {
  firstChoice = choice;
  firstChoiceIndex.value = selectionIndex;
}

let secondChoice = "";
const secondChoiceIndex = ref();
function onSecondChoiceSelectionClick(choice, selectionIndex) {
  secondChoice = choice;
  secondChoiceIndex.value = selectionIndex;
}

let thirdChoice = "";
const thirdChoiceIndex = ref();
function onThirdChoiceSelectionClick(choice, selectionIndex) {
  thirdChoice = choice;
  thirdChoiceIndex.value = selectionIndex;
}

const firstChoiceRef = ref("");
const secondChoiceRef = ref("");
const thirdChoiceRef = ref("");
function onChoiceSubmit(key) {
  if (key === "first") {
    if (!firstChoice) {
      ElMessage.error("请选择答案");
      return;
    }

    firstChoiceRef.value = firstChoice;
    quizSubmitInfo.answerOne = firstChoice;

    isFirstQuestionClicked.value = false;
  } else if (key === "second") {
    if (!secondChoice) {
      ElMessage.error("请选择答案");
      return;
    }

    secondChoiceRef.value = secondChoice;
    quizSubmitInfo.answerTwo = secondChoice;

    isSecondQuestionClicked.value = false;
  } else if (key === "third") {
    if (!thirdChoice) {
      ElMessage.error("请选择答案");
      return;
    }

    thirdChoiceRef.value = thirdChoice;
    quizSubmitInfo.answerThree = thirdChoice;

    isThirdQuestionClicked.value = false;
  }
}

function onSubmitClick() {
  const { answerOne, answerTwo, answerThree, quizId, quizTitle } =
    quizSubmitInfo;
  if (answerOne == "" || answerTwo == -1 || answerThree == -1) {
    ElMessage.error("请完成3个答案再提交！");
    return;
  } else if (quizId == -1) {
    ElMessage.error("提交答案失败,请刷新页面重试！");
    return;
  }

  submitMemberSportMatchQuiz({
    quizId,
    quizTitle,
    answerOne,
    answerTwo,
    answerThree
  }).then((res) => {
    const { code, data, message } = res;
    if (code == 0) {
      if (data.count == 0) {
        ElMessage.success(
          "您好，您已成功提交一次本场竞猜答案，可进行再次单笔存款1000 进行提交第二次；"
        );
      } else {
        ElMessage.success(
          "您好，本场竞猜您已成功提交两次，请次日0点参与新一场的竞猜，感谢您的支持!"
        );
      }
    } else {
      ElMessage.error(message);
    }
  });
}
</script>

<style scoped lang="scss">
.prize-quiz-container {
  background-color: #fcfcfc;
  font-size: 14px;
  color: #87898a;
  padding: 86px 0 20px;

  .prize-quiz-top-div {
    height: 500px;
    background: url("../../../assets/images/promotion/hotpromo/esportquiz/banner_7.png")
      center no-repeat;
  }

  .prize-quiz-content-container {
    width: 1154px;
    margin: 0 auto;

    .prize-quiz-jc-container {
      width: 780px;
      height: 250px;
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/bg_jc_7.png")
        center no-repeat;
      padding-top: 50px;
      margin: 50px auto;
      display: flex;
      align-items: center;
      justify-content: center;

      .prize-quiz-jc-txt {
        font-size: 64px;
        letter-spacing: 3px;
        background: #fff;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        height: 128px;
        line-height: 128px;
      }
    }

    .prize-quiz-main {
      background-color: #e4f6ff;
      box-shadow: 0px 5px 10px 0px rgba(12, 3, 7, 0.2);
      border-radius: 8px;
      min-height: 315px;

      .start-answer-box {
        width: 264px;
        margin: 0 auto;

        &.hide {
          display: none;
        }

        .book-img {
          text-align: center;
          margin-bottom: 5px;
          margin-top: 13px;
        }

        .btn-start-answer {
          width: 264px;
          height: 90px;
          background: url("../../../assets/images/promotion/hotpromo/esportquiz/btn_start.png")
            center no-repeat;
          cursor: pointer;
          background-size: 214px;
        }
      }

      .questions-box {
        padding-top: 17px;
        display: none;

        &.show {
          display: block;
        }

        .questions-container {
          display: flex;
          justify-content: space-between;

          &::before,
          &::after {
            content: " ";
            display: block;
          }

          .questions-item-box {
            width: 270px;
            letter-spacing: 0;

            .item-question {
              margin-bottom: 10px;
              height: 42px;
              margin-left: 50px;
            }

            .question-options-box {
              height: 84px;
              color: #87898a;
              overflow: hidden;

              .question-fill-input {
                border: 1px solid #0094ff;
                border-radius: 6px;
                background-color: transparent;
                color: #87898a;
                padding: 5px;
                margin: 38px auto 40px;
              }

              .item-option > label {
                font-weight: 400;
              }
            }

            .btn-answer {
              width: 180px;
              height: 40px;
              font-size: 16px;
              color: #fff;
              line-height: 40px;
              text-align: center;
              cursor: pointer;
              margin: 38px auto 40px;
              border: none;
              background-image: linear-gradient(
                  255deg,
                  #0094ff 0%,
                  #18c5ff 100%
                ),
                linear-gradient(#0084a4, #0084a4);
              background-blend-mode: normal, normal;
              border-radius: 4px;
            }
          }
        }
      }

      .title {
        font-size: 30px;
        padding: 20px 0 0 0px;
        text-align: center;
        background: #0297ff;
        background: -webkit-linear-gradient(
          to bottom,
          #0297ff 25%,
          #15bdff 60%
        );
        background: -moz-linear-gradient(to bottom, #0297ff 25%, #15bdff 60%);
        background: linear-gradient(to bottom, #0297ff 25%, #15bdff 60%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
      }
    }

    .title-img {
      width: 850px;
      height: 34px;
    }

    .title-record {
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/title_record.png")
        center no-repeat;
      margin: 69px auto 22px auto;
    }

    .record-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px auto;

      th {
        text-align: center;
        color: #fff;
        height: 48px;
        border: solid 1px #dcdce8;
        background-image: linear-gradient(0deg, #0094ff 0%, #19c6ff 100%),
          linear-gradient(#1d212e, #1d212e);
        background-blend-mode: normal, normal;
      }

      tr td {
        height: 50px;
        text-align: center;
        border: solid 1px #dcdce8;

        .got-answer {
          color: #00ff00;
        }

        .not-got {
          color: #ff0000;
        }
      }
    }

    .page-list {
      display: flex;
      margin-top: 24px;
      justify-content: center;
    }

    .page-item {
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background-color: #fff;
      margin: 0 4px;
      cursor: pointer;
      border: 1px solid #dcdce8;

      .active {
        color: #fff;
        background-color: #0094ff;
      }
    }
  }
}

.question-select-box {
  width: 360px;
  margin: 40px auto;
  font-size: 14px;
  color: #bacef1;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .question-select-type {
    border-radius: 6px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    width: 100px;
    color: red;
  }

  .question-select-option {
    background-color: #e4f6ff;
    border-radius: 6px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    cursor: pointer;
    width: 120px;
    color: #87898a;

    &.active {
      color: #fff;
      background-color: #0094ff;
    }
  }
}

.question-fill-box {
  width: 264px;
  margin: 80px auto;
  font-size: 18px;
  color: #bacef1;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
