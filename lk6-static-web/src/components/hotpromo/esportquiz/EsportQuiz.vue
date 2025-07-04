<template>
  <el-dialog width="500px" v-model="isFirstQuestionClicked" :close-on-click-modal="false" title="">
    <div class="header">
      <div class="title">提交答案</div>
      <div class="close-btn" @click="isFirstQuestionClicked = false">
        <el-icon size="24" color="#e1e1e1"><CircleCloseFilled /></el-icon>
      </div>
    </div>
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
      <el-button type="primary standard-button btn-color-blue submit-btn" @click="onChoiceSubmit('first')">
        提交
      </el-button>
    </div>
  </el-dialog>

  <el-dialog width="500px" v-model="isSecondQuestionClicked" :close-on-click-modal="false" title="">
    <div class="header">
      <div class="title">提交答案</div>
      <div class="close-btn" @click="isSecondQuestionClicked = false">
        <el-icon size="24" color="#e1e1e1"><CircleCloseFilled /></el-icon>
      </div>
    </div>
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
      <el-button type="primary standard-button btn-color-blue submit-btn" @click="onChoiceSubmit('second')">
        提交
      </el-button>
    </div>
  </el-dialog>

  <el-dialog width="500px" v-model="isThirdQuestionClicked" :close-on-click-modal="false" title="">
    <div class="header">
      <div class="title">提交答案</div>
      <div class="close-btn" @click="isThirdQuestionClicked = false">
        <el-icon size="24" color="#e1e1e1"><CircleCloseFilled /></el-icon>
      </div>
    </div>
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
      <el-button
        type="primary standard-button btn-color-blue submit-btn"
        class="common-btn"
        @click="onChoiceSubmit('third')"
      >
        提交
      </el-button>
    </div>
  </el-dialog>

  <div class="prize-quiz-container">
    <div class="prize-quiz-content-container">
      <div class="prize-quiz-jc-container">
        <div class="prize-quiz-jc-pool">
          <img src="../../../assets/images/promotion/hotpromo/esportquiz/pool.png" style="width: 100%" />
        </div>
        <div class="prize-quiz-jc-txt" id="pool">$ {{ matchInfo.poolAmount }}</div>
      </div>
      <img
        v-if="uiIsShowStatus.questionBox"
        src="../../../assets/images/promotion/hotpromo/esportquiz/separator-start-ans.png"
        style="display: flex; align-self: center; width: 60%; margin: 0 auto"
      />
      <img
        v-else
        src="../../../assets/images/promotion/hotpromo/esportquiz/union.png"
        style="display: flex; align-self: center; width: 60%; margin: 0 auto 30px"
      />
      <div v-if="uiIsShowStatus.questionBox" :class="`questions-box `">
        <div class="title" id="title">
          {{ matchInfo.quizTitle }}
        </div>
        <div class="questions-container">
          <div class="questions-item-box">
            <div class="item-question">第一题</div>
            <div class="question-options-box">
              <div class="question-row">{{ matchInfo.questionOne }}</div>
              <button
                class="btn-answer standard-button btn-color-blue"
                data-question-id="2"
                data-question-type="select"
                id="firstQuestion"
                @click="onFirstQuestionClick(true)"
              >
                {{ firstChoiceRef ? "重新选择" : "选择" }}
              </button>
              <div class="ans-row">
                <div>我的答案：</div>
                <div class="ans">{{ firstChoiceRef }}</div>
              </div>
            </div>
          </div>
          <div class="questions-item-box">
            <div class="item-question">第二题</div>
            <div class="question-options-box">
              <div class="question-row">{{ matchInfo.questionTwo }}</div>
              <button
                class="btn-answer standard-button btn-color-blue"
                data-question-id="2"
                data-question-type="select"
                id="secondQuestion"
                @click="onSecondQuestionClick(true)"
              >
                {{ secondChoiceRef ? "重新选择" : "选择" }}
              </button>
              <div class="ans-row">
                <div>我的答案：</div>
                <div class="ans">{{ secondChoiceRef }}</div>
              </div>
            </div>
          </div>
          <div class="questions-item-box">
            <div class="item-question">第三题</div>
            <div class="question-options-box">
              <div class="question-row">{{ matchInfo.questionThree }}</div>
              <button
                class="btn-answer standard-button btn-color-blue"
                data-question-id="2"
                data-question-type="select"
                id="thirdQuestion"
                @click="onThirdQuestionClick(true)"
              >
                {{ thirdChoiceRef ? "重新选择" : "选择" }}
              </button>
              <div class="ans-row">
                <div>我的答案：</div>
                <div class="ans">{{ thirdChoiceRef }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="btn-answer standard-button btn-color-blue submit-btn"
          style="margin-top: 50px"
          :class="submittedFormStatus && 'submitted-ans'"
          data-question-id="1"
          data-question-type="select"
          id="submitBtn"
          @click="onSubmitClick()"
        >
          提交答案
        </div>
      </div>
      <div v-else class="prize-quiz-main prize-quiz-record-container section-bg" style="margin-top: 80px">
        <!-- <div class="title" id="title">
          {{ matchInfo.quizTitle || "答题区" }}
        </div> -->
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: -24px;
            left: 50%;
            transform: translateX(-50%);
          "
        >
          <div class="quiz-flag">
            <p>{{ matchInfo.quizTitle || "答题区" }}</p>
          </div>
        </div>
        <div :class="`start-answer-box`">
          <div class="flex-div">
            <div class="team-div">
              <div class="team-logo" v-if="matchInfo?.homeTeamIcon">
                <img :src="imgURL + `promo/` + matchInfo.homeTeamIcon" />
              </div>
              <div>{{ matchInfo.homeTeam }}</div>
            </div>
            <div class="book-img">
              <img src="../../../assets/images/promotion/hotpromo/esportquiz/vs.png" alt="" />
              <div class="match-time">
                {{ matchInfo.matchTime }}
              </div>
              <!--              <img-->
              <!--                src="../../../assets/images/promotion/hotpromo/esportquiz/img_book_7.png"-->
              <!--                style="width: 180px; height: 78px"-->
              <!--              />-->

              <div class="btn-start-answer" @click="onBtnStartAnswerClick()">开始答题</div>
            </div>
            <div class="team-div">
              <div class="team-logo" v-if="matchInfo?.awayTeamIcon">
                <img :src="imgURL + `promo/` + matchInfo.awayTeamIcon" />
              </div>
              <div>{{ matchInfo.awayTeam }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="prize-quiz-record-container section-bg">
        <div class="title-img">答题记录</div>
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
              <!--              <td :rowspan="recordsLength">{{ quizWonTimesRecord }}</td>-->
              <!--              <td :rowspan="recordsLength">{{ quizAttendTimesRecord }}</td>-->
              <!--            </template>-->
            </tr>
          </table>
          <table v-else class="record-table" id="record-table"></table>

          <!-- <pre>isHasRecord: {{ isHasRecord }}</pre> -->
          <!-- <pre>paginationInfo.pageTotal: {{ paginationInfo.pageTotal }}</pre> -->
          <!-- <pre>tableInfo: {{ tableInfo }}</pre> -->
          <!-- <pre>records: {{ records }}</pre> -->
          <div v-if="isHasRecord" class="page-list">
            <div class="prev page-item" @click="onPrevPageClick()">&lt;</div>
            <div
              v-for="(e, i) in recordsPagination.pages"
              :key="`page-content-${i}`"
              :id="`page-number-${e}`"
              :class="`page-number page-item ${recordsPagination.current === e ? 'active' : ''}`"
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
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { userStore } from "@/store";
import {
  getSportMatchQuizInfo,
  getMemberSportMatchRecord,
  getRecordsCount,
  submitMemberSportMatchQuiz
} from "@/api/index/promo";
import moment from "moment";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "@/hooks/notify";
import { ElMessageBox } from "element-plus";

const store = userStore();
const notify = useNotify();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/";

onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
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
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
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
  matchTime: "",
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
        matchTime,
        questionOne,
        questionTwo,
        questionThree,
        choiceOne,
        choiceTwo,
        choiceThree,
        homeTeamIcon,
        awayTeamIcon
      } = res.data;

      // matchInfo
      if (poolAmount) matchInfo.poolAmount = poolAmount;
      if (quizTitle) matchInfo.quizTitle = quizTitle;

      matchInfo.homeTeam = homeTeam;
      matchInfo.awayTeam = awayTeam;

      matchInfo.matchTime = matchTime;
      matchInfo.homeTeamIcon = homeTeamIcon;
      matchInfo.awayTeamIcon = awayTeamIcon;

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
const recordsPagination = reactive({ size: 5, current: 1, total: 0, pages: 0 });
const paginationInfo = reactive({ pageSize: 5, pageNumber: 1, pageTotal: 0 });

const isHasRecord = ref(false);

function getRecords() {
  getMemberSportMatchRecord(recordsPagination).then((res) => {
    // console.log("data", res.data);
    const { code, data } = res;
    if (code == 0) {
      records.value = data.records;
      recordsPagination.total = data.total;
      if(data.pages === 0){
        recordsPagination.pages = data.pages + 1;
      }else{
        recordsPagination.pages = data.pages;
      }
      
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
  if (recordsPagination.current > 1) {
    recordsPagination.current = recordsPagination.current - 1;
    getRecords();
  }
}

function onNextPageClick() {
  if (recordsPagination.pages > recordsPagination.current) {
    recordsPagination.current = recordsPagination.current + 1;
    getRecords();
  }
}

function onPaginationClick(pageIndex) {
  recordsPagination.current = pageIndex;
  getRecords();
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
      notify.error("请选择答案");
      return;
    }

    firstChoiceRef.value = firstChoice;
    quizSubmitInfo.answerOne = firstChoice;

    isFirstQuestionClicked.value = false;
  } else if (key === "second") {
    if (!secondChoice) {
      notify.error("请选择答案");
      return;
    }

    secondChoiceRef.value = secondChoice;
    quizSubmitInfo.answerTwo = secondChoice;

    isSecondQuestionClicked.value = false;
  } else if (key === "third") {
    if (!thirdChoice) {
      notify.error("请选择答案");
      return;
    }

    thirdChoiceRef.value = thirdChoice;
    quizSubmitInfo.answerThree = thirdChoice;

    isThirdQuestionClicked.value = false;
  }
}

function onSubmitClick() {
  if (submittedFormStatus.value) {
    return;
  }

  const { answerOne, answerTwo, answerThree, quizId, quizTitle } = quizSubmitInfo;
  if (answerOne == "" || answerTwo == -1 || answerThree == -1) {
    notify.error("请完成3个答案再提交！");
    return;
  } else if (quizId == -1) {
    notify.error("提交答案失败,请刷新页面重试！");
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
      //   ElMessage.success("您好，您已成功提交一次本场竞猜答案，可进行再次单笔存款 1000 进行提交第二次；");
      // } else {
      //   ElMessage.success("您好，本场竞猜您已成功提交两次，请次日 0 点参与新一场的竞猜，感谢您的支持!");
      // }

      notify.success("您好，您已成功提交本场竞猜答案");
      submittedFormStatus.value = true;
    } else {
      notify.error(message);
    }
  });
}

const submittedFormStatus = ref(false);
</script>

<style scoped lang="scss">
.dark {
  .prize-quiz-container {
  font-size: 14px;
  color: #87898a;
  padding: 0 0 0 0;

  .prize-quiz-content-container {
    width: 1154px;
    margin: 0 auto;

    .prize-quiz-jc-container {
      gap: 10px;
      width: 780px;
      height: 200px;
      // background: url("../../../assets/images/promotion/hotpromo/esportquiz/bg_jc_8.png") center no-repeat;
      background: linear-gradient(
        90.02deg,
        rgba(5, 210, 255, 0) 0.02%,
        rgba(0, 117, 255, 0.14) 49.86%,
        rgba(5, 210, 255, 0) 99.97%
      );

      padding-top: 10px;
      margin: 30px auto 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .prize-quiz-jc-pool {
        img {
          width: 100%;
        }
      }

      .prize-quiz-jc-txt {
        font-size: 64px;
        letter-spacing: 3px;
        background: linear-gradient(180deg, #05d2ff 0%, #0009d9 100%);

        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        height: 90px;
        line-height: 90px;
        font-family: fantasy;
        filter: drop-shadow(2px 4px 6px white);
      }
    }

    .prize-quiz-main {
      // background-color: #e4f6ff;
      box-shadow: 0px 5px 10px 0px rgba(12, 3, 7, 0.2);
      border-radius: 40px;
      // min-height: 315px;
      position: relative;

      display: flex;
      justify-content: center;
      flex-direction: column;

      .flex-div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        div {
          font-size: 20px;
          color: white;
        }

        .team-div {
          text-align: center;

          .team-logo {
            width: 80px;
            height: auto;
            max-height: 80px;

            img {
              width: 100%;
              height: auto;
            }
          }
        }
      }

      .start-answer-box {
        width: calc(100% - 200px);
        margin: 20px auto;

        &.hide {
          display: none;
        }

        .book-img {
          text-align: center;
          margin-bottom: 0px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .match-time {
          color: white;
          font-size: 26px;
        }

        .btn-start-answer {
          display: flex;
          text-align: center;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          border-radius: 20px;
          padding: 8px 15px;
          cursor: pointer;
          background-size: 214px;
          width: 400px;

          &:hover {
            opacity: 0.9;
          }

          &:active {
            filter: brightness(0.9);
            transform: translate(0px, 1px);
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
              color: #000000;
              font-weight: bold;
              text-align: center;
              margin-top: 10px;
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
              // margin: 38px auto 40px;
              border: none;
              background-image: linear-gradient(255deg, #0094ff 0%, #18c5ff 100%), linear-gradient(#0084a4, #0084a4);
              background-blend-mode: normal, normal;
              border-radius: 4px;
              margin: auto;

              &.submitted-ans {
                filter: brightness(0.8);
                cursor: not-allowed;
                pointer-events: all !important;
              }

              &:hover {
                opacity: 0.9;
              }

              &:active {
                filter: brightness(0.9);
                transform: translate(0px, 1px);
              }
            }
          }
        }
      }

      .title {
        font-size: 30px;
        padding: 10px;
        color: #ffffff;
        // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
    }

    .title-img {
      width: 850px;
      height: 34px;
    }

    .title-record {
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/title_record.png") center no-repeat;
      margin: 0 auto;
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

.questions-box {
  display: block;

  .title {
    color: #4c4c6c;
    font-size: 40px;
    text-align: center;
    padding: 30px 0px;
  }

  .questions-container {
    display: flex;
    justify-content: space-between;

    .questions-item-box {
      width: 270px;
      letter-spacing: 0;
      position: relative;

      .item-question {
        height: 42px;
        font-weight: bold;

        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url("../../../assets/images/promotion/hotpromo/esportquiz/quiz-flag.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        position: absolute;
        top: -24px;
        width: fit-content;
        padding: 12px 32px;
        left: 50%;
        transform: translateX(-50%);
      }

      .question-options-box {
        color: #87898a;
        background: linear-gradient(0deg, #ffffff 0%, #eaf3fced 100%);
        border-radius: 20px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: 50px 20px 20px;
        font-weight: 700;
        border: 1px solid #4da9f7;

        .question-row {
          color: #4c4c6c;
          font-weight: 700;
        }

        .ans-row {
          color: #7a8eb9;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 10px;
          background: #0000000d;

          .ans {
            color: #3981ff;
          }
        }

        .question-fill-input {
          border: 1px solid #0094ff;
          border-radius: 6px;
          background-color: transparent;
          color: #87898a;
          padding: 5px;
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
        border: none;
        margin: auto;

        &.submitted-ans {
          filter: brightness(0.8);
          cursor: not-allowed;
          pointer-events: all !important;
        }

        &:hover {
          opacity: 0.9;
        }

        &:active {
          filter: brightness(0.9);
          transform: translate(0px, 1px);
        }
      }
    }
  }
}

.question-select-box {
  width: 360px;
  margin: 30px auto 10px;
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
    background-color: #e7f3ff;
    border-radius: 15px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    cursor: pointer;
    width: 170px;
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

.submit-btn {
  display: flex;
  width: 300px;
  height: 45px;
  margin: 20px auto;
  font-size: 16px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 100px;

  &.submitted-ans {
    background: #cbdefe;
    box-shadow: none;
    cursor: not-allowed;
    pointer-events: all !important;
  }
}

.header {
  color: #424f72;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  position: relative;

  .close-btn {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
}

.prize-quiz-record-container {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 20px;
  margin-top: 60px;
}

.quiz-flag {
  position: relative;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../../assets/images/promotion/hotpromo/esportquiz/quiz-flag.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 12px 32px;

  p {
    margin: 0;
    color: white;
    font-size: 20px;
    font-weight: 600;
  }
}
}
.prize-quiz-container {
  font-size: 14px;
  color: #87898a;
  padding: 0 0 0 0;

  .prize-quiz-content-container {
    width: 1154px;
    margin: 0 auto;

    .prize-quiz-jc-container {
      gap: 10px;
      width: 780px;
      height: 200px;
      // background: url("../../../assets/images/promotion/hotpromo/esportquiz/bg_jc_8.png") center no-repeat;
      background: linear-gradient(
        90.02deg,
        rgba(5, 210, 255, 0) 0.02%,
        rgba(0, 117, 255, 0.14) 49.86%,
        rgba(5, 210, 255, 0) 99.97%
      );

      padding-top: 10px;
      margin: 30px auto 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .prize-quiz-jc-pool {
        img {
          width: 100%;
        }
      }

      .prize-quiz-jc-txt {
        font-size: 64px;
        letter-spacing: 3px;
        background: linear-gradient(180deg, #05d2ff 0%, #0009d9 100%);

        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        height: 90px;
        line-height: 90px;
        font-family: fantasy;
        filter: drop-shadow(2px 4px 6px white);
      }
    }

    .prize-quiz-main {
      // background-color: #e4f6ff;
      box-shadow: 0px 5px 10px 0px rgba(12, 3, 7, 0.2);
      border-radius: 40px;
      // min-height: 315px;
      position: relative;

      display: flex;
      justify-content: center;
      flex-direction: column;

      .flex-div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        div {
          font-size: 20px;
          color: #424f72;
        }

        .team-div {
          text-align: center;

          .team-logo {
            width: 80px;
            height: auto;
            max-height: 80px;

            img {
              width: 100%;
              height: auto;
            }
          }
        }
      }

      .start-answer-box {
        width: calc(100% - 200px);
        margin: 20px auto;

        &.hide {
          display: none;
        }

        .book-img {
          text-align: center;
          margin-bottom: 0px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .match-time {
          color: #424f72;
          font-size: 26px;
        }

        .btn-start-answer {
          display: flex;
          text-align: center;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          border-radius: 20px;
          padding: 8px 15px;
          cursor: pointer;
          background-size: 214px;
          width: 400px;

          &:hover {
            opacity: 0.9;
          }

          &:active {
            filter: brightness(0.9);
            transform: translate(0px, 1px);
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
              color: #000000;
              font-weight: bold;
              text-align: center;
              margin-top: 10px;
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
              // margin: 38px auto 40px;
              border: none;
              background-image: linear-gradient(255deg, #0094ff 0%, #18c5ff 100%), linear-gradient(#0084a4, #0084a4);
              background-blend-mode: normal, normal;
              border-radius: 4px;
              margin: auto;

              &.submitted-ans {
                filter: brightness(0.8);
                cursor: not-allowed;
                pointer-events: all !important;
              }

              &:hover {
                opacity: 0.9;
              }

              &:active {
                filter: brightness(0.9);
                transform: translate(0px, 1px);
              }
            }
          }
        }
      }

      .title {
        font-size: 30px;
        padding: 10px;
        color: #ffffff;
        // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
    }

    .title-img {
      width: 850px;
      height: 34px;
    }

    .title-record {
      background: url("../../../assets/images/promotion/hotpromo/esportquiz/title_record.png") center no-repeat;
      margin: 0 auto;
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

.questions-box {
  display: block;

  .title {
    color: #4c4c6c;
    font-size: 40px;
    text-align: center;
    padding: 30px 0px;
  }

  .questions-container {
    display: flex;
    justify-content: space-between;

    .questions-item-box {
      width: 270px;
      letter-spacing: 0;
      position: relative;

      .item-question {
        height: 42px;
        font-weight: bold;

        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url("../../../assets/images/promotion/hotpromo/esportquiz/quiz-flag.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        position: absolute;
        top: -24px;
        width: fit-content;
        padding: 12px 32px;
        left: 50%;
        transform: translateX(-50%);
      }

      .question-options-box {
        color: #87898a;
        background: linear-gradient(0deg, #ffffff 0%, #eaf3fced 100%);
        border-radius: 20px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: 50px 20px 20px;
        font-weight: 700;
        border: 1px solid #4da9f7;

        .question-row {
          color: #4c4c6c;
          font-weight: 700;
        }

        .ans-row {
          color: #7a8eb9;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 10px;
          background: #0000000d;

          .ans {
            color: #3981ff;
          }
        }

        .question-fill-input {
          border: 1px solid #0094ff;
          border-radius: 6px;
          background-color: transparent;
          color: #87898a;
          padding: 5px;
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
        border: none;
        margin: auto;

        &.submitted-ans {
          filter: brightness(0.8);
          cursor: not-allowed;
          pointer-events: all !important;
        }

        &:hover {
          opacity: 0.9;
        }

        &:active {
          filter: brightness(0.9);
          transform: translate(0px, 1px);
        }
      }
    }
  }
}

.question-select-box {
  width: 360px;
  margin: 30px auto 10px;
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
    background-color: #e7f3ff;
    border-radius: 15px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    cursor: pointer;
    width: 170px;
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

.submit-btn {
  display: flex;
  width: 300px;
  height: 45px;
  margin: 20px auto;
  font-size: 16px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 100px;

  &.submitted-ans {
    background: #cbdefe;
    box-shadow: none;
    cursor: not-allowed;
    pointer-events: all !important;
  }
}

.header {
  color: #424f72;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  position: relative;

  .close-btn {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
}

.prize-quiz-record-container {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 20px;
  margin-top: 60px;
}

.quiz-flag {
  position: relative;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../../assets/images/promotion/hotpromo/esportquiz/quiz-flag.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 12px 32px;

  p {
    margin: 0;
    color: white;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
