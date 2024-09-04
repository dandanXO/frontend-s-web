<template>
  <q-dialog v-model="isFirstQuestionClicked">
    <q-card class="dialog-content">
      <div class="row items-center q-pb-none dialog-header">
        <div class="text-h6 text-bold q-mt-sm">提交答案</div>
        <q-btn class="close-btn" icon="close" flat round dense v-close-popup></q-btn>
      </div>
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
          <q-btn color="brightbtn" @click="onChoiceSubmit('first')">提交</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isSecondQuestionClicked">
    <q-card class="dialog-content">
      <div class="row items-center q-pb-none dialog-header">
        <div class="text-h6 text-bold q-mt-sm">提交答案</div>
        <q-btn class="close-btn" icon="close" flat round dense v-close-popup></q-btn>
      </div>
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
          <q-btn color="brightbtn" type="primary" @click="onChoiceSubmit('second')">提交</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isThirdQuestionClicked">
    <q-card class="dialog-content">
      <div class="row items-center q-pb-none dialog-header">
        <div class="text-h6 text-bold q-mt-sm">提交答案</div>
        <q-btn class="close-btn" icon="close" flat round dense v-close-popup></q-btn>
      </div>
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
          <q-btn color="brightbtn" type="primary" @click="onChoiceSubmit('third')" style="width: 120px;">提交</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <div class="prize-quiz-container">
    <div><img src="../../../assets/images/promo/hotpromo/esportquiz2/pattern-top.png" /></div>
    <div class="prize-quiz-content-container" v-if="(matchInfo.homeTeam && matchInfo.awayTeam) || !store.token">
      <div :class="`questions-main-title ${uiIsShowStatus.questionBox ? '' : 'hide'}`">{{ matchInfo.quizTitle }}</div>

      <div class="prize-quiz-jc-container" :class="`${uiIsShowStatus.startAnswerBox ? '' : 'hide'}`">
        <div class="prize-quiz-jc-txt" id="pool">$ {{ matchInfo.poolAmount }}</div>
      </div>

      <div class="prize-quiz-main" :class="`${uiIsShowStatus.startAnswerBox ? '' : 'hide'}`">
        <div class="title" id="title">
          {{ matchInfo.quizTitle || "答题区" }}
          <!-- {{ getMatchDateOnly(matchInfo.matchTime) }} -->
        </div>
        <div class="start-answer-box">
          <div v-if="store.token" class="team-content">
            <div class="team-logo">
              <img :src="imgURL + `promo/` + matchInfo.homeTeamIcon" />
            </div>
            <div>{{ matchInfo.homeTeam }}</div>
          </div>

          <div class="team-action">
            <!-- <div>{{ matchInfo.quizTitle }}</div> -->
            <div class="team-match-time">{{ matchInfo.matchTime }}</div>

            <div class="btn-start-ans">
              <q-btn color="brightbtn" label="开始答题" @click="onBtnStartAnswerClick()" />
            </div>
          </div>

          <div v-if="store.token" class="team-content">
            <div class="team-logo">
              <img :src="imgURL + `promo/` + matchInfo.awayTeamIcon" />
            </div>
            <div>{{ matchInfo.awayTeam }}</div>
          </div>
        </div>
      </div>

      <div>
        <div :class="`questions-box ${uiIsShowStatus.questionBox ? 'show' : ''}`">
          <div class="questions-container">
            <div class="questions-item-box">
              <div class="item-title">第一题</div>
              <div class="question-options-box">
                <div class="item-question">{{ matchInfo.questionOne }}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                  <div class="question-ans">
                    我的答案：
                    <span>{{ firstChoiceRef ? firstChoiceRef : "" }}</span>
                  </div>
                  <div class="question-btn-box" @click="onFirstQuestionClick(true)">
                    <img :src="firstChoiceRef ? reSelectBtn : selectBtn" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div class="questions-item-box">
              <div class="item-title">第二题</div>
              <div class="question-options-box">
                <div class="item-question">{{ matchInfo.questionTwo }}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                  <div class="question-ans">
                    我的答案：
                    <span>{{ secondChoiceRef ? secondChoiceRef : "" }}</span>
                  </div>
                  <div class="question-btn-box" @click="onSecondQuestionClick(true)">
                    <img :src="secondChoiceRef ? reSelectBtn : selectBtn" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div class="questions-item-box">
              <div class="item-title">第三题</div>
              <div class="question-options-box">
                <div class="item-question">{{ matchInfo.questionThree }}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                  <div class="question-ans">
                    我的答案：
                    <span>{{ thirdChoiceRef ? thirdChoiceRef : "" }}</span>
                  </div>
                  <div class="question-btn-box" @click="onThirdQuestionClick(true)">
                    <img :src="thirdChoiceRef ? reSelectBtn : selectBtn" alt="">
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="questions-item-box"> -->
            <q-btn
              class="btn-long-answer"
              data-question-id="1"
              data-question-type="select"
              id="submitBtn"
              @click="onSubmitClick()"
            >
              提交答案
            </q-btn>
            <!-- </div> -->
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
            <!--            <th style="width: 10%">中奖次数</th>-->
            <!--            <th style="width: 10%">参与次数</th>-->
          </tr>
          <tr v-for="(e, i) in tableInfo" :key="`table-info-${i}`">
            <td>{{ e.time }}</td>
            <td>{{ e.answer }}</td>
            <td :class="e.className">{{ e.statusText }}</td>
            <!--            <template v-if="i === 0">-->
            <!--              <td rowspan="2">{{ quizWonTimesRecord }}</td>-->
            <!--              <td rowspan="2">{{ quizAttendTimesRecord }}</td>-->
            <!--            </template>-->
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
import { useLocalStorage } from "@vueuse/core";

const $q = useQuasar();
const store = userStore();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/";

const selectBtn = require("../../../assets/images/promo/hotpromo/esportquiz2/select-btn.png");
const reSelectBtn = require("../../../assets/images/promo/hotpromo/esportquiz2/re-select-btn.png");

onMounted(() => {
  if (!store.token) {
    // notify({
    //   type: "error",
    //   message: "请登录后操作",
    // });
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
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
  uiIsShowStatus.startAnswerBox = false;
  uiIsShowStatus.questionBox = true;
}

const matchInfo = reactive({
  poolAmount: "",
  quizTitle: "",
  homeTeam: "",
  awayTeam: "",
  homeTeamIcon: "",
  awayTeamIcon: "",
  questionOne: "",
  questionTwo: "",
  questionThree: "",
  choiceOne: [],
  choiceTwo: [],
  choiceThree: [],
  matchTime: "",
  startTime: "",
  endTime: ""
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
        choiceThree,
        homeTeamIcon,
        awayTeamIcon,
        matchTime,
        startTime,
        endTime
      } = res.data;

      // matchInfo
      if (poolAmount) matchInfo.poolAmount = poolAmount;
      if (quizTitle) matchInfo.quizTitle = quizTitle;

      matchInfo.homeTeam = homeTeam;
      matchInfo.awayTeam = awayTeam;

      matchInfo.homeTeamIcon = homeTeamIcon;
      matchInfo.awayTeamIcon = awayTeamIcon;
      matchInfo.matchTime = matchTime;

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
        color: "positive",
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

const getMatchDateOnly = (matchTime) => {
  if (!matchTime) {
    return "";
  }
  const dateTimeString = matchTime;
  const dateString = dateTimeString.split(" ")[0];
  return dateString || "";
};

const getMatchTimeOnly = (matchTime) => {
  if (!matchTime) {
    return "";
  }
  const dateTimeString = matchTime;
  const timeString = dateTimeString.split(" ")[1];
  return timeString || "";
};
</script>

<style scoped lang="scss">
.prize-quiz-container {
  font-size: 14px;
  color: #87898a;
  padding: 0 0 0px 0;
  position: relative;

  .prize-quiz-content-container {
    margin: 0 auto;

    .questions-main-title {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      font-size: 18px;
      font-weight: 700;
      color: #4c4c6c;
      text-align: center;
    }

    .prize-quiz-jc-container {
      background: url("../../../assets/images/promo/hotpromo/esportquiz2/prize-pool-bg.png") center no-repeat;
      background-size: contain;
      padding-top: 30px;
      margin: 16px auto 28px;
      display: flex;
      align-items: center;
      justify-content: center;

      .prize-quiz-jc-txt {
        font-size: 32px;
        letter-spacing: 3px;
        background: linear-gradient(180deg, #05d2ff 0%, #0009d9 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        height: 128px;
        line-height: 128px;
        font-weight: 700;
      }
    }

    .prize-quiz-main {
      background-color: #fcfdfe;
      box-shadow: 0px 5px 10px 0px rgba(12, 3, 7, 0.2);
      border-radius: 20px;
      overflow: hidden;
      // padding: 16px;
      // min-height: 315px;

      .start-answer-box {
        margin: 0 auto;
        display: flex;
        width: 100%;
        justify-content: center;
        box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;

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
          background: url("../../../assets/images/promo/hotpromo/esportquiz2/btn_start.png") center no-repeat;
          cursor: pointer;
          background-size: 214px;
        }

        .btn-start-ans {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          white-space: nowrap;
        }

        .team-action {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
          margin-bottom: 16px;
          text-align: center;
          color: #4c4c6c;
        }

        .team-match-time {
          color: #424f72;
          font-weight: 700;
          font-size: 14px;
          line-height: 1;
          margin-bottom: 12px;
        }

        .team-content {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: #424f72;
          font-weight: 600;
          margin-top: 16px;
          margin-bottom: 16px;
          .team-logo {
            height: 50px;
            width: 50px;
            background: #cccccc;
            border-radius: 50%;
            margin-bottom: 8px;
          }
        }
      }
      .title {
        font-size: 16px;
        padding: 4px 16px 6px;
        text-align: center;
        font-weight: 600;

        display: flex;
        justify-content: center;
        align-items: center;
        background: #e7f3ff;
        color: #4c4c6c;
        line-height: 1;

        height: 40px;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #ffffff;
        border-bottom: 2px solid #fff;
      }
    }

    .title-img {
      height: 34px;
    }

    .title-record {
      background: url("../../../assets/images/promo/hotpromo/esportquiz2/title_record.png") center no-repeat;
      background-size: contain;
      margin: 45px auto 22px auto;
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
    // padding: 16px;

    &::before,
    &::after {
      content: " ";
      display: block;
    }

    .questions-item-box {
      width: 100%;
      letter-spacing: 0;
      // padding: 16px;
      margin-bottom: 16px;
      border-radius: 20px;
      // border: 3px solid #fff;
      overflow: hidden;

      .item-title {
        font-size: 12px;
        color: #ffffff;
        background: linear-gradient(180deg, #2095ff 0%, #7ebdf7 100%);
        border-bottom: 3px solid #fff;
        // background: #2095ff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        height: 42px;
      }

      .item-question {
        margin-bottom: 10px;
        margin-top: 10px;
        text-align: center;
        color: #4c4c6c;
        font-size: 16px;
        font-weight: 600;
        // height: 42px;
      }

      .question-options-box {
        padding: 0 16px 16px;
        color: #87898a;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background: linear-gradient(0deg, #ffffff 0%, #eaf3fced 100%);

        .question-ans {
          display: flex;
          justify-content: flex-start;
          width: 100%;
          padding: 10px;
          flex: 1;
          color: #7A8EB9;

          span {
            font-weight: 700;
            color: #3981FF;
          }
        }

        .question-btn-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 25%;
          max-width: 286px;

          img {
            margin: 0;
          }
        }

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
        font-size: 12px;
        color: #fff;
        line-height: 1;
        text-align: center;
        cursor: pointer;
        // margin: 0 auto 40px;
        border-radius: 4px;
        white-space: nowrap;
      }
    }
  }
}

.question-select-box {
  max-width: 360px;
  margin: 20px auto;
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
    background-color: #e7f3ff;
    border-radius: 10px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    cursor: pointer;
    width: 120px;
    color: #424f72;
    font-size: 12px;

    &.active {
      color: #fff;
      background-color: #3981ff;
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
  // background: #0eb0ff;
  color: white;
  padding: 0.5rem;
  color: #4c4c6c;
  display: flex;
  justify-content: center;
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
    text-align: center;
  }
}

#record-table {
  white-space: wrap;
}

.hide {
  display: none !important;
}

.btn-long-answer {
  font-size: 16px;
  background-image: url("../../../assets/images/promo/hotpromo/esportquiz2/long-btn-bg.png");
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  color: #ffffff;
  width: 100%;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e1e1e1;
  color: #ffffff;
}

.dialog-content {
  border-radius: 20px;
  background-image: url(../../../assets/images/promo/hotpromo/esportquiz2/dialog-bg.png);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
