<template>
  <el-dialog width="500px" v-model="isFirstQuestionClicked" :close-on-click-modal="false" title="提交答案">
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
      <el-button type="primary" @click="onChoiceSubmit('first')">提交</el-button>
    </div>
  </el-dialog>

  <el-dialog width="500px" v-model="isSecondQuestionClicked" :close-on-click-modal="false" title="提交答案">
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
      <el-button type="primary" @click="onChoiceSubmit('second')">提交</el-button>
    </div>
  </el-dialog>

  <el-dialog width="500px" v-model="isThirdQuestionClicked" :close-on-click-modal="false" title="提交答案">
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
      <el-button type="primary" class="common-btn" @click="onChoiceSubmit('third')">提交</el-button>
    </div>
  </el-dialog>

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
              <div
                class="btn-answer"
                :class="submittedFormStatus && 'submitted-ans'"
                data-question-id="1"
                data-question-type="select"
                id="submitBtn"
                @click="onSubmitClick()"
              >
                提交答案
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
              <td :rowspan="recordsLength">{{ quizWonTimesRecord }}</td>
              <td :rowspan="recordsLength">{{ quizAttendTimesRecord }}</td>
            </template>
          </tr>
        </table>
        <table v-else class="record-table" id="record-table"></table>

        <!-- <pre>isHasRecord: {{ isHasRecord }}</pre> -->
        <!-- <pre>paginationInfo.pageTotal: {{ paginationInfo.pageTotal }}</pre> -->
        <!-- <pre>tableInfo: {{ tableInfo }}</pre> -->
        <!-- <pre>records: {{ records }}</pre> -->
        <div v-if="isHasRecord" class="page-list">
          <div class="prev page-item" @click="onPrevPageClick()">&lt;</div>
          <!-- <div
            v-for="(e, i) in paginationInfo.pageTotal"
            :key="`page-content-${i}`"
            :id="`page-number-${e}`"
            :class="`page-number page-item ${paginationInfo.pageNumber === e ? 'active' : ''}`"
            @click="onPaginationClick(e)"
          >
            {{ e }}
          </div> -->
          <div class="next page-item" @click="onNextPageClick()">&gt;</div>
        </div>
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
  getRecordsCount,
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
    // sometimes no upcoming match
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

const records = ref([]);
const quizAttendTimesRecord = ref();
const quizWonTimesRecord = ref();
const recordsLength = ref();
const recordsPagination = reactive({ size: 5, current: 1, total: 5 });
const paginationInfo = reactive({ pageSize: 5, pageNumber: 1, pageTotal: 0 });

const isHasRecord = ref(false);
function getRecords() {
  getMemberSportMatchRecord(recordsPagination).then((res) => {
    // console.log("data", res.data)
    const { code, data } = res;
    if (code == 0) {
      records.value = data.records;
      // quizAttendTimesRecord.value = data.quizAttendTimes;
      // quizWonTimesRecord.value = data.quizWonTimes;

      recordsLength.value = data.records.length;
      const dataLength = data.records.length;
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

  getRecordsCount().then((res) => {
    const { code, data } = res;
    if (code == 0) {
      quizAttendTimesRecord.value = data.quizAttendTimes;
      quizWonTimesRecord.value = data.quizWonTimes;
    }
  });
}

function onPrevPageClick() {
  // if (paginationInfo.pageNumber === 1) return;

  // paginationInfo.pageNumber--;
  // getRecordList();

  if (recordsPagination.current > 1) {
    recordsPagination.current = recordsPagination.current - 1;
    getRecords();
  }
}

function onNextPageClick() {
  // if (paginationInfo.pageNumber + 1 > paginationInfo.pageTotal) return;

  // paginationInfo.pageNumber++;
  // getRecordList();

  if (recordsPagination.total / recordsPagination.current > recordsPagination.current) {
    recordsPagination.current = recordsPagination.current + 1;
    getRecords();
  }
}

function onPaginationClick(pageIndex) {
  if (paginationInfo.pageNumber === pageIndex) return;

  paginationInfo.pageNumber = pageIndex;
  getRecordList();
}

const tableInfo = ref([]);
function getRecordList() {
  tableInfo.value = [];
  const { pageSize, pageNumber } = paginationInfo;
  const start = (pageNumber - 1) * pageSize;
  const end = Math.min(start + pageSize, records.value.length); // Ensure end does not exceed array length

  for (let i = start; i < end; i++) {
    const record = records.value[i];

    // Check if the record exists before destructuring
    if (record) {
      const { createTime, answerOne, answerTwo, answerThree, status } = record;

      const newObj = {};
      // newObj.time = moment(createTime).format("YYYY-MM-DD HH:mm:ss");
      newObj.time = createTime;
      newObj.answer = answerOne + ", " + answerTwo + ", " + answerThree;
      newObj.statusText = status;
      if (status == "WIN") newObj.className = "got-answer";

      tableInfo.value.push(newObj);
    }
  }
}

// function getRecordList() {
//   const { pageSize, pageNumber } = paginationInfo;
//   const start = (pageNumber - 1) * pageSize;
//   const end = start + pageSize;

//   for (let i = start, l = end; i < l; i++) {
//     const { createTime, answerOne, answerTwo, answerThree, status } = records.value[i];

//     const newObj = {};
//     newObj.time = moment(createTime).format("YYYY-MM-DD HH:mm:ss");
//     newObj.answer = answerOne + ", " + answerTwo + ", " + answerThree;
//     newObj.statusText = status;
//     if (status == "WIN") newObj.className = "got-answer";

//     tableInfo.value.push(newObj);
//   }
// }

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
  const { answerOne, answerTwo, answerThree, quizId, quizTitle } = quizSubmitInfo;
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
      // submittedFormStatus
      // if (res.count == 0) {
      //   ElMessage.success("您好，您已成功提交一次本场竞猜答案，可进行再次单笔存款1000 进行提交第二次；");
      // } else {
      //   ElMessage.success("您好，本场竞猜您已成功提交两次，请次日0点参与新一场的竞猜，感谢您的支持!");
      // }

      ElMessage.success("您好，您已成功提交本场竞猜答案");
      submittedFormStatus.value = true;
    } else {
      ElMessage.error(message);
    }
  });
}

const submittedFormStatus = ref(false);
</script>

<style scoped lang="scss">
.prize-quiz-container {
  background-color: #fcfcfc;
  font-size: 14px;
  color: #87898a;
  padding: 0 0 20px 0;

  .prize-quiz-content-container {
    width: 1154px;
    margin: 0 auto;

    .prize-quiz-jc-container {
      width: 780px;
      height: 250px;
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/bg_jc_7.png") center no-repeat;
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
              background-image: linear-gradient(255deg, #0094ff 0%, #18c5ff 100%), linear-gradient(#0084a4, #0084a4);
              background-blend-mode: normal, normal;
              border-radius: 4px;
              &.submitted-ans {
                filter: brightness(0.8);
                cursor: not-allowed;
                pointer-events: all !important;
              }
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
      width: 850px;
      height: 34px;
    }

    .title-record {
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/title_record.png") center no-repeat;
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
  width: 360px;
  margin: 40px auto;
  font-size: 14px;
  color: #bacef1;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .question-select-type {
    border-radius: 6px;
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
