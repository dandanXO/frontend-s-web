<template>
  <q-dialog v-model="isFirstQuestionClicked">
    <q-card>
      <q-card-section class="row items-center q-pb-none dialog-header">
        <div class="text-h6">提交答案</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section class="dialog-body">
        <div class="question-select-box">
          <div
            v-for="(e, i) in matchInfo.choiceOne"
            :key="`choice-one-${i}`"
            :class="`question-select-option ${firstChoiceIndex === i ? 'active' : ''}`"
            :data-value="e"
            @click="onFirstChoiceSelectionClick(e, i)"
          >
            {{ e }}
          </div>
        </div>
        <div class="dialog-footer">
          <q-button @click="onChoiceSubmit('first')">提交</q-button>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isSecondQuestionClicked">
    <q-card>
      <q-card-section class="row items-center q-pb-none dialog-header">
        <div class="text-h6">提交答案</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section class="dialog-body">
        <div class="question-select-box">
          <div
            v-for="(e, i) in matchInfo.choiceTwo"
            :key="`choice-two-${i}`"
            :class="`question-select-option ${secondChoiceIndex === i ? 'active' : ''}`"
            :data-value="e"
            @click="onSecondChoiceSelectionClick(e, i)"
          >
            {{ e }}
          </div>
        </div>
        <div class="dialog-footer">
          <q-button type="primary" @click="onChoiceSubmit('second')">提交</q-button>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isThirdQuestionClicked">
    <q-card>
      <q-card-section class="row items-center q-pb-none dialog-header">
        <div class="text-h6">提交答案</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section class="dialog-body">
        <div class="question-select-box">
          <div
            v-for="(e, i) in matchInfo.choiceThree"
            :key="`choice-three-${i}`"
            :class="`question-select-option ${thirdChoiceIndex === i ? 'active' : ''}`"
            :data-value="e"
            @click="onThirdChoiceSelectionClick(e, i)"
          >
            {{ e }}
          </div>
        </div>
        <div class="dialog-footer">
          <q-button type="primary" @click="onChoiceSubmit('third')">提交</q-button>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <div class="prize-quiz-container">
    <div class="prize-quiz-content-container">
      <div class="prize-quiz-jc-container">
        <div class="prize-quiz-jc-txt" id="pool">$ {{ matchInfo.poolAmount }}</div>
      </div>
      <div class="prize-quiz-main">
        <div class="title" id="title">
          {{ matchInfo.quizTitle || "答题区" }}
        </div>
        <div :class="`start-answer-box ${uiIsShowStatus.startAnswerBox ? '' : 'hide'}`">
          <div class="book-img">
            <img
              src="../../../assets/images/promotion/hotpromo/esportquiz/img_book_7.png"
              style="width: 180px; height: 78px"
            />
          </div>
          <div class="btn-start-answer" @click="onBtnStartAnswerClick()"></div>
        </div>
        <div :class="`questions-box ${uiIsShowStatus.questionBox ? 'show' : ''}`">
          <div class="questions-container">
            <div class="questions-item-box">
              <div class="item-question">第一题:{{ matchInfo.questionOne }}</div>
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
              <div class="item-question">第二题:{{ matchInfo.questionTwo }}</div>
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
            </div>
            <div class="questions-item-box">
              <div class="item-question">第三题:{{ matchInfo.questionThree }}</div>
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

            <div class="questions-item-box">
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
          </div>
        </div>
      </div>
      <div class="title-img title-record"></div>
      <div>
        <table v-if="isHasRecord" class="record-table" id="record-table">
          <tr>
            <th style="width: 25%">日期</th>
            <th style="width: 35%">答案</th>
            <th style="width: 20%">中奖记录</th>
            <th style="width: 10%">中奖次数</th>
            <th style="width: 10%">参与次数</th>
          </tr>
          <tr v-for="(e, i) in tableInfo" :key="`table-info-${i}`">
            <td>{{ e.time }}</td>
            <td>{{ e.answer }}</td>
            <td :class="e.className">{{ e.statusText }}</td>
            <template v-if="i === 0">
              <td rowspan="2">{{ quizWonTimesRecord }}</td>
              <td rowspan="2">{{ quizAttendTimesRecord }}</td>
            </template>
          </tr>
        </table>
        <table v-else class="record-table" id="record-table"></table>

        <div v-if="isHasRecord && tableInfo.length > 0" class="page-list">
          <div class="prev page-item" @click="onPrevPageClick()">&lt;</div>
          <div
            v-for="(e, i) in paginationInfo.pageTotal"
            :key="`page-content-${i}`"
            :id="`page-number-${e}`"
            :class="`page-number page-item ${paginationInfo.pageNumber === e ? 'active' : ''}`"
            @click="onPaginationClick(e)"
          >
            {{ e }}
          </div>
          <div class="next page-item" @click="onNextPageClick()">&gt;</div>
        </div>
        <div v-else class="page-list">暂无记录</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { userStore } from "../../../stores/index";
import { useQuasar } from "quasar";
import {
  getSportMatchQuizInfo,
  getMemberSportMatchRecord,
  submitMemberSportMatchQuiz,
  getMemberSportQuizTotal
} from "../../../api/index/promo";
import moment from "moment";

const $q = useQuasar();
const store = userStore();

onMounted(() => {
  if (!store.token) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "请登录后操作",
      icon: "report_problem"
    });
    return;
  }

  getMatchInfo();
  getRecords();
  getRecordsTotal();
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
    if (res.data) {
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
    }
  });
}

const records = ref();
const quizAttendTimesRecord = ref();
const quizWonTimesRecord = ref();
const paginationInfo = reactive({ pageSize: 5, pageNumber: 1, pageTotal: 5 });

const isHasRecord = ref(false);
function getRecords() {
  getMemberSportMatchRecord(paginationInfo.pageNumber, paginationInfo.pageSize).then((res) => {
    const { code, data } = res;
    if (code == 0) {
      records.value = data.records;

      const dataLength = data.total;
      if (dataLength > 0) {
        paginationInfo.pageNumber = data.current;
        paginationInfo.pageTotal = data.pages;
        getRecordList();

        isHasRecord.value = true;
      }
    }
  });
}

const getRecordsTotal = () => {
  getMemberSportQuizTotal().then((res) => {
    const { code, data } = res;
    if (code === 0) {
      console.log(data);
      quizAttendTimesRecord.value = data.quizAttendTimes;
      quizWonTimesRecord.value = data.quizWonTimes;
    }
  });
};

function onPrevPageClick() {
  if (paginationInfo.pageNumber === 1) return;

  paginationInfo.pageNumber--;
  getRecords();
}

function onNextPageClick() {
  if (paginationInfo.pageNumber + 1 > paginationInfo.pageTotal) return;

  paginationInfo.pageNumber++;
  getRecords();
}

function onPaginationClick(pageIndex) {
  if (paginationInfo.pageNumber === pageIndex) return;

  paginationInfo.pageNumber = pageIndex;
  getRecords();
}

const tableInfo = ref([]);
function getRecordList() {
  // const { pageSize } = paginationInfo;
  const start = 0;
  const end = records.value.length;

  tableInfo.value = [];
  for (let i = start, l = end; i < l; i++) {
    const { createTime, answerOne, answerTwo, answerThree, status } = records.value[i];

    const newObj = {};
    // newObj.time = moment(createTime).format("YYYY-MM-DD HH:mm:ss");
    newObj.time = createTime;
    newObj.answer = answerOne + ", " + answerTwo + ", " + answerThree;
    newObj.statusText = status;
    if (status == "WIN") newObj.className = "got-answer";

    tableInfo.value.push(newObj);
  }
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
      $q.notify({
        color: "negative",
        position: "top",
        message: "请选择答案",
        icon: "report_problem"
      });
      return;
    }

    firstChoiceRef.value = firstChoice;
    quizSubmitInfo.answerOne = firstChoice;

    isFirstQuestionClicked.value = false;
  } else if (key === "second") {
    if (!secondChoice) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "请选择答案",
        icon: "report_problem"
      });
      return;
    }

    secondChoiceRef.value = secondChoice;
    quizSubmitInfo.answerTwo = secondChoice;

    isSecondQuestionClicked.value = false;
  } else if (key === "third") {
    if (!thirdChoice) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "请选择答案",
        icon: "report_problem"
      });
      return;
    }

    thirdChoiceRef.value = thirdChoice;
    quizSubmitInfo.answerThree = thirdChoice;

    isThirdQuestionClicked.value = false;
  }
}

function onSubmitClick() {
  const { answerOne, answerTwo, answerThree, quizId, quizTitle } = quizSubmitInfo;
  if (answerOne == "" || answerTwo == -1 || answerThree == -1) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "请完成3个答案再提交！",
      icon: "report_problem"
    });
    return;
  } else if (quizId == -1) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "提交答案失败,请刷新页面重试！",
      icon: "report_problem"
    });
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
      $q.notify({
        type: "positive",
        position: "top",
        message: "您好，您已成功提交本场竞猜答案",
        icon: "check_circle_outline"
      });
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: message,
        icon: "report_problem"
      });
    }
  });
}
</script>

<style scoped lang="scss">
.prize-quiz-container {
  background-color: #fcfcfc;
  font-size: 14px;
  color: #87898a;
  padding: 0 0 20px 0;
  position: relative;

  .prize-quiz-content-container {
    margin: 0 auto;

    .prize-quiz-jc-container {
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/bg_jc_7.png") center no-repeat;
      background-size: contain;
      padding-top: 30px;
      margin: 50px auto;
      display: flex;
      align-items: center;
      justify-content: center;

      .prize-quiz-jc-txt {
        font-size: 32px;
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
        margin: 0 auto;

        &.hide {
          display: none;
        }

        .book-img {
          text-align: center;
          margin-bottom: 5px;
          margin-top: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-start-answer {
          height: 90px;
          background: url("../../../assets/images/promotion/hotpromo/esportquiz/btn_start.png") center no-repeat;
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
          flex-wrap: wrap;
          padding: 16px;

          &::before,
          &::after {
            content: " ";
            display: block;
          }

          .questions-item-box {
            width: 100%;
            letter-spacing: 0;

            .item-question {
              margin-bottom: 10px;
              // height: 42px;
            }

            .question-options-box {
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
              font-size: 16px;
              color: #fff;
              line-height: 40px;
              text-align: center;
              cursor: pointer;
              margin: 0 auto 40px;
              border: none;
              background-image: linear-gradient(255deg, #0094ff 0%, #18c5ff 100%), linear-gradient(#0084a4, #0084a4);
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
        background: -webkit-linear-gradient(to bottom, #0297ff 25%, #15bdff 60%);
        background: -moz-linear-gradient(to bottom, #0297ff 25%, #15bdff 60%);
        background: linear-gradient(to bottom, #0297ff 25%, #15bdff 60%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
      }
    }

    .title-img {
      height: 34px;
    }

    .title-record {
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/title_record.png") center no-repeat;
      background-size: contain;
      margin: 69px auto 22px auto;
    }

    .record-table {
      // width: 100px !important;
      border-collapse: collapse;
      margin: 20px auto;
      // overflow-x: scroll;

      th {
        text-align: center;
        color: #fff;
        height: 48px;
        border: solid 1px #dcdce8;
        background-image: linear-gradient(0deg, #0094ff 0%, #19c6ff 100%), linear-gradient(#1d212e, #1d212e);
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

      &.active {
        color: #fff;
        background-color: #0094ff;
      }
    }
  }
}

.question-select-box {
  max-width: 360px;
  margin: 40px auto;
  font-size: 14px;
  color: #bacef1;
  display: flex;
  gap: 20px;
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

.dialog-header {
  background: #0eb0ff;
  color: white;
  padding: 0.5rem;
}

.dialog-body {
  padding: 30px 20px;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;

  q-button {
    background: #409eff;
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    width: 50%;
    text-align: center;
  }
}

#record-table {
  white-space: wrap;
}
</style>
