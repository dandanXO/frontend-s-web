<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.matchTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.quizTitle"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.quizTitle')"
        />
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.gameQuiz.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadGameQuiz">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:game-quiz:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="780px"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE'"
        ref="gameQuizForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadSites"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.quizTitle')" prop="quizTitle">
          <el-input v-model="form.quizTitle" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-select
            v-model="form.gameType"
            size="small"
            :placeholder="t('fields.gameType')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="populateChoice"
          >
            <el-option
              v-for="item in uiControl.gameType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.homeTeam')" prop="homeTeam">
          <el-input v-model="form.homeTeam" style="width: 350px;" maxlength="50" @change="populateChoiceOne" />
        </el-form-item>
        <el-form-item :label="t('fields.awayTeam')" prop="awayTeam">
          <el-input v-model="form.awayTeam" style="width: 350px;" maxlength="50" @change="populateChoiceOne" />
        </el-form-item>
        <el-form-item
          :label="t('fields.poolAmount')"
          prop="poolAmount"
          @keypress="restrictDecimalInput($event)"
        >
          <el-input v-model="form.poolAmount" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.questionOne')" prop="questionOne">
          <el-input v-model="form.questionOne" style="width: 350px;" maxlength="50" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.choiceOne')" prop="choiceOne">
          <div v-for="(item, index) in choiceOne" :key="index">
            <el-input style="width: 350px; margin-top: 5px;" v-model="item.value" disabled />
          </div>
        </el-form-item>
        <el-form-item :label="t('fields.questionTwo')" prop="questionTwo">
          <el-select
            v-model="form.questionTwo"
            size="small"
            :placeholder="t('fields.questionTwo')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="populateChoice"
          >
            <el-option
              v-for="item in uiControl.questions"
              :key="item.key"
              :label="t(item.displayName)"
              :value="t(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.choiceTwo')" prop="choiceTwo">
          <div v-for="(item, index) in choiceTwo" :key="index">
            <el-input style="width: 350px; margin-top: 5px;" v-model="item.value" disabled />
          </div>
        </el-form-item>
        <el-form-item :label="t('fields.questionThree')" prop="questionThree">
          <el-select
            v-model="form.questionThree"
            size="small"
            :placeholder="t('fields.questionThree')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="populateChoice"
          >
            <el-option
              v-for="item in uiControl.questions"
              :key="item.key"
              :label="t(item.displayName)"
              :value="t(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.choiceThree')" prop="choiceThree">
          <div v-for="(item, index) in choiceThree" :key="index">
            <el-input style="width: 350px; margin-top: 5px;" v-model="item.value" disabled />
          </div>
        </el-form-item>
        <el-form-item :label="t('fields.matchTime')" prop="matchTime">
          <el-date-picker
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.matchTime"
            :disabled-date="disabledStartDate"
            style="width: 350px;"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="create">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'EDIT'"
        ref="endQuizForm"
        :model="endForm"
        :rules="endFormRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-row>
          <el-form-item :label="t('fields.site')" prop="siteName">
            <span>{{ endForm.siteName }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.quizTitle')" prop="quizTitle">
            <span>{{ endForm.quizTitle }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.gameType')" prop="gameType">
            <span>{{ endForm.gameType }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.homeTeam')" prop="homeTeam">
            <span>{{ endForm.homeTeam }}</span>
          </el-form-item>
          <el-form-item :label="t('fields.awayTeam')" prop="awayTeam">
            <span>{{ endForm.awayTeam }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.poolAmount')" prop="poolAmount">
            $ <span v-formatter="{data: endForm.poolAmount, type: 'money'}" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.questionOne')" prop="questionOne">
            <span>{{ endForm.questionOne }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.choiceOne')" prop="answerOne">
            <el-radio-group v-model="endForm.answerOne" size="mini" style="width: 300px">
              <el-radio-button
                v-for="(item, index) in JSON.parse(endForm.choiceOne)"
                :key="index"
                :label="item"
                size="small"
              >{{ item }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="endForm.questionTwo">
          <el-form-item :label="t('fields.questionTwo')" prop="questionTwo">
            <span>{{ endForm.questionTwo }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="endForm.questionTwo">
          <el-form-item :label="t('fields.choiceTwo')" prop="answerTwo">
            <el-radio-group v-model="endForm.answerTwo" size="mini" style="width: 300px">
              <el-radio-button
                v-for="(item, index) in JSON.parse(endForm.choiceTwo)"
                :key="index"
                :label="item"
                size="small"
              >{{ item }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="endForm.questionThree">
          <el-form-item :label="t('fields.questionThree')" prop="questionThree">
            <span>{{ endForm.questionThree }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="endForm.questionThree">
          <el-form-item :label="t('fields.choiceThree')" prop="answerThree">
            <el-radio-group v-model="endForm.answerThree" size="mini" style="width: 300px">
              <el-radio-button
                v-for="(item, index) in JSON.parse(endForm.choiceThree)"
                :key="index"
                :label="item"
                size="small"
              >{{ item }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.matchTime')" prop="matchTime">
            <span>{{ endForm.matchTime }}</span>
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="endQuiz">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'VIEW'"
        ref="viewQuizForm"
        :model="viewForm"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-row>
          <el-form-item :label="t('fields.site')" prop="siteName">
            <span>{{ viewForm.siteName }}</span>
          </el-form-item>
          <el-form-item :label="t('fields.status')" prop="status">
            <el-tag v-if="viewForm.status === 'ONGOING'" size="mini">{{ t('status.gameQuiz.' + viewForm.status) }}</el-tag>
            <el-tag v-if="viewForm.status === 'ENDED'" type="success" size="mini">{{ t('status.gameQuiz.' + viewForm.status) }}</el-tag>
            <el-tag v-if="viewForm.status === 'CANCEL'" type="danger" size="mini">{{ t('status.gameQuiz.' + viewForm.status) }}</el-tag>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.quizTitle')" prop="quizTitle">
            <span>{{ viewForm.quizTitle }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.gameType')" prop="gameType">
            <span>{{ viewForm.gameType }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.homeTeam')" prop="homeTeam">
            <span>{{ viewForm.homeTeam }}</span>
          </el-form-item>
          <el-form-item :label="t('fields.awayTeam')" prop="awayTeam">
            <span>{{ viewForm.awayTeam }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.poolAmount')" prop="poolAmount">
            $ <span v-formatter="{data: viewForm.poolAmount, type: 'money'}" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.questionOne')" prop="questionOne">
            <span>{{ viewForm.questionOne }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="viewForm.status !== 'ENDED'">
          <el-form-item :label="t('fields.choiceOne')" prop="choiceOne">
            <el-radio-group v-model="viewForm.choiceOne" size="mini" style="width: 300px" disabled>
              <el-radio-button
                v-for="(item, index) in JSON.parse(viewForm.choiceOne)"
                :key="index"
                :label="item"
                size="small"
              >{{ item }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-else>
          <el-form-item :label="t('fields.answerOne')" prop="answerOne">
            <span>{{ viewForm.answerOne }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="viewForm.questionTwo">
          <el-form-item :label="t('fields.questionTwo')" prop="questionTwo">
            <span>{{ viewForm.questionTwo }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="viewForm.questionTwo && viewForm.status !== 'ENDED'">
          <el-form-item :label="t('fields.choiceTwo')" prop="choiceTwo">
            <el-radio-group v-model="viewForm.choiceTwo" size="mini" style="width: 300px" disabled>
              <el-radio-button
                v-for="(item, index) in JSON.parse(viewForm.choiceTwo)"
                :key="index"
                :label="item"
                size="small"
              >{{ item }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-else-if="viewForm.questionTwo && viewForm.status === 'ENDED'">
          <el-form-item :label="t('fields.answerTwo')" prop="answerTwo">
            <span>{{ viewForm.answerTwo }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="viewForm.questionThree">
          <el-form-item :label="t('fields.questionThree')" prop="questionThree">
            <span>{{ viewForm.questionThree }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="viewForm.questionThree && viewForm.status !== 'ENDED'">
          <el-form-item :label="t('fields.choiceThree')" prop="answerThree">
            <el-radio-group v-model="viewForm.answerThree" size="mini" style="width: 300px" disabled>
              <el-radio-button
                v-for="(item, index) in JSON.parse(viewForm.choiceThree)"
                :key="index"
                :label="item"
                size="small"
              >{{ item }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-else-if="viewForm.questionThree && viewForm.status === 'ENDED'">
          <el-form-item :label="t('fields.answerThree')" prop="answerThree">
            <span>{{ viewForm.answerThree }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.matchTime')" prop="matchTime">
            <span>{{ viewForm.matchTime }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.startTime')" prop="startTime">
            <span>{{ viewForm.startTime }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.endTime')" prop="endTime">
            <span>{{ viewForm.endTime }}</span>
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.back') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      v-loading="page.loading"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="quizTitle" :label="t('fields.quizTitle')" width="250" />
      <el-table-column prop="gameType" :label="t('fields.gameType')" width="120" />
      <el-table-column prop="homeTeam" :label="t('fields.homeTeam')" width="120" />
      <el-table-column prop="awayTeam" :label="t('fields.awayTeam')" width="120" />
      <el-table-column prop="status" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'ONGOING'" size="mini">{{ t('status.gameQuiz.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'ENDED'" type="success" size="mini">{{ t('status.gameQuiz.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="danger" size="mini">{{ t('status.gameQuiz.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="180" />
      <el-table-column prop="startTime" :label="t('fields.startTime')" width="180" />
      <el-table-column prop="endTime" :label="t('fields.endTime')" width="180" />
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="300"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:game-quiz:update']) || hasPermission(['sys:game-quiz:list']))"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="warning"
            v-permission="['sys:game-quiz:list']"
            @click="showDetails(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.view') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ONGOING'"
            size="small"
            type="success"
            v-permission="['sys:game-quiz:update']"
            @click="showEdit(scope.row)"
            style="cursor: pointer; margin-left: 5px;"
          >
            {{ t('fields.endQuiz') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ONGOING'"
            size="small"
            type="danger"
            v-permission="['sys:game-quiz:update']"
            @click="cancelQuiz(scope.row.id)"
            style="cursor: pointer; margin-left: 5px"
          >
            {{ t('fields.cancelQuiz') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadGameQuiz"
      @size-change="loadGameQuiz"
    />
  </div>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { getGameQuiz, createGameQuiz, updateGameQuiz, cancelGameQuiz } from "@/api/game-quiz";
import { hasRole, hasPermission } from "@/utils/util";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const choiceOne = ref([]);
const choiceTwo = ref([]);
const choiceThree = ref([]);

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

function disabledStartDate(time) {
  return time.getTime() <= moment(new Date()).subtract(1, 'days').endOf('day').format('x');
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  quizTitle: null,
  status: null,
  matchTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const gameQuizForm = ref(null);
const endQuizForm = ref(null);
const viewQuizForm = ref(null);
const sites = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  status: [
    { key: 1, displayName: 'ONGOING', value: 'ONGOING' },
    { key: 2, displayName: 'CANCEL', value: 'CANCEL' },
    { key: 3, displayName: 'ENDED', value: 'ENDED' }
  ],
  gameType: [
    { key: 1, displayName: 'CS:GO', value: 'CSGO' },
    { key: 2, displayName: 'League Of Legends', value: 'LOL' },
    { key: 1, displayName: 'DOTA 2', value: 'DOTA2' }
  ],
  questions: [
    { key: 1, displayName: 'gameQuiz.questions.2', value: 'gameQuiz.questions.2' },
    { key: 2, displayName: 'gameQuiz.questions.3', value: 'gameQuiz.questions.3' }
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  siteId: null,
  quizTitle: null,
  gameType: null,
  homeTeam: null,
  awayTeam: null,
  poolAmount: 0,
  questionOne: null,
  choiceOne: null,
  questionTwo: null,
  choiceTwo: null,
  questionThree: null,
  choiceThree: null,
  matchTime: null
});

const endForm = reactive({
  id: null,
  siteId: null,
  siteName: null,
  quizTitle: null,
  gameType: null,
  homeTeam: null,
  awayTeam: null,
  poolAmount: 0,
  questionOne: null,
  choiceOne: null,
  answerOne: null,
  questionTwo: null,
  choiceTwo: null,
  answerTwo: null,
  questionThree: null,
  choiceThree: null,
  answerThree: null,
  matchTime: null
})

const viewForm = reactive({
  siteId: null,
  siteName: null,
  quizTitle: null,
  gameType: null,
  homeTeam: null,
  awayTeam: null,
  poolAmount: 0,
  status: null,
  questionOne: null,
  choiceOne: null,
  answerOne: null,
  questionTwo: null,
  choiceTwo: null,
  answerTwo: null,
  questionThree: null,
  choiceThree: null,
  answerThree: null,
  matchTime: null,
  startTime: null,
  endTime: null
})

const validateChoiceOne = (rule, value, callback) => {
  if (JSON.parse(form.choiceOne).length < 2) {
    callback(new Error(t('message.validateChoiceOneRequired')));
  } else {
    callback();
  }
};

const validateChoiceTwo = (rule, value, callback) => {
  if (form.questionTwo && !form.gameType) {
    callback(new Error(t('message.validateChoiceTwoRequired')));
  } else {
    callback();
  }
};

const validateChoiceThree = (rule, value, callback) => {
  if (form.questionThree && !form.gameType) {
    callback(new Error(t('message.validateChoiceThreeRequired')));
  } else {
    callback();
  }
};

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  quizTitle: [required(t('message.validateQuizTitleRequired'))],
  gameType: [required(t('message.validateGameTypeRequired'))],
  homeTeam: [required(t('message.validateHomeTeamRequired'))],
  awayTeam: [required(t('message.validateAwayTeamRequired'))],
  poolAmount: [required(t('message.validatePoolAmountRequired'))],
  questionOne: [required(t('message.validateQuestionOneRequired'))],
  choiceOne: [required(t('message.validateChoiceOneRequired')), { validator: validateChoiceOne, trigger: "blur" }],
  choiceTwo: [{ validator: validateChoiceTwo, trigger: "blur" }],
  choiceThree: [{ validator: validateChoiceThree, trigger: "blur" }],
  matchTime: [required(t('message.validateMatchTimeRequired'))]
});

const validateAnswerOne = (rule, value, callback) => {
  if (endForm.answerOne === null) {
    callback(new Error(t('message.validateAnswerOneRequired')));
  } else {
    callback();
  }
};

const validateAnswerTwo = (rule, value, callback) => {
  if (endForm.questionTwo && endForm.answerTwo === null) {
    callback(new Error(t('message.validateAnswerTwoRequired')));
  } else {
    callback();
  }
};

const validateAnswerThree = (rule, value, callback) => {
  if (endForm.questionThree && endForm.answerThree === null) {
    callback(new Error(t('message.validateAnswerThreeRequired')));
  } else {
    callback();
  }
};

const endFormRules = reactive({
  answerOne: [{ validator: validateAnswerOne, trigger: "blur" }],
  answerTwo: [{ validator: validateAnswerTwo, trigger: "blur" }],
  answerThree: [{ validator: validateAnswerThree, trigger: "blur" }]
})

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    form.poolAmount !== null &&
    form.poolAmount.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
  }
}

async function loadGameQuiz() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.matchTime !== null) {
    if (request.matchTime.length === 2) {
      query.matchTime = request.matchTime.join(",");
    }
  }
  const { data: ret } = await getGameQuiz(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function showDialog(type) {
  if (gameQuizForm.value) {
    gameQuizForm.value.resetFields();
  }
  if (type === 'CREATE') {
    form.siteId = request.siteId;
    choiceOne.value = [];
    choiceTwo.value = [];
    choiceThree.value = [];
    addChoice();
    form.questionOne = t('gameQuiz.questions.1');
    uiControl.dialogTitle = t('fields.addGameQuiz');
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.endQuiz');
  } else if (type === 'VIEW') {
    uiControl.dialogTitle = t('fields.quizDetails');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(quiz) {
  showDialog('EDIT');
  nextTick(() => {
    for (const key in quiz) {
      if (Object.keys(endForm).find(k => k === key)) {
        endForm[key] = quiz[key];
        if (key === 'siteId') {
          endForm.siteName = sites.list.find(s => s.id === quiz[key]).siteName;
        }
      }
    }
  });
}

function showDetails(quiz) {
  showDialog('VIEW');
  nextTick(() => {
    for (const key in quiz) {
      if (Object.keys(viewForm).find(k => k === key)) {
        viewForm[key] = quiz[key];
        if (key === 'siteId') {
          viewForm.siteName = sites.list.find(s => s.id === quiz[key]).siteName;
        }
      }
    }
  });
}

function create() {
  form.choiceOne = constructChoice(1)
  form.choiceTwo = constructChoice(2)
  form.choiceThree = constructChoice(3)
  gameQuizForm.value.validate(async (valid) => {
    if (valid) {
      await createGameQuiz(form);
      uiControl.dialogVisible = false;
      await loadGameQuiz();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.status = null;
  request.quizTitle = null;
  request.matchTime = [convertStartDate(new Date()), convertDate(new Date())];
}

function addChoice() {
  choiceOne.value.push({ value: '' })
  choiceOne.value.push({ value: '' })
  choiceTwo.value.push({ value: '' })
  choiceTwo.value.push({ value: '' })
  choiceThree.value.push({ value: '' })
  choiceThree.value.push({ value: '' })
}

function constructChoice(item) {
  const json = [];
  let choice = {};
  if (item === 1) {
    choice = choiceOne.value;
  } else if (item === 2) {
    choice = choiceTwo.value;
  } else if (item === 3) {
    choice = choiceThree.value;
  }
  Object.values(choice).forEach((item) => {
    if (item.value) {
      json.push(item.value)
    }
  });
  return JSON.stringify(json);
}

async function endQuiz() {
  const answers = {};
  answers.answerOne = endForm.answerOne
  answers.answerTwo = endForm.answerTwo
  answers.answerThree = endForm.answerThree
  endQuizForm.value.validate(async (valid) => {
    if (valid) {
      await updateGameQuiz(endForm.id, answers);
      uiControl.dialogVisible = false;
      await loadGameQuiz();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

async function cancelQuiz(id) {
  ElMessageBox.confirm(
    t('message.confirmCancelQuiz'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await cancelGameQuiz(id);
    await loadGameQuiz();
    ElMessage({ message: t('message.cancelQuizSuccess'), type: "success" });
  });
}

function populateChoiceOne() {
  choiceOne.value[0].value = form.homeTeam
  choiceOne.value[1].value = form.awayTeam
}

function populateChoice() {
  if (form.gameType && form.questionTwo) {
    const question = uiControl.questions.find(q => t(q.value) === form.questionTwo);
    if (question.key === 1) {
      choiceTwo.value[0].value = t('gameQuiz.answers.' + form.gameType + '.handicapAbove')
      choiceTwo.value[1].value = t('gameQuiz.answers.' + form.gameType + '.handicapBelow')
    } else if (question.key === 2) {
      choiceTwo.value[0].value = t('gameQuiz.answers.' + form.gameType + '.killBig')
      choiceTwo.value[1].value = t('gameQuiz.answers.' + form.gameType + '.killSmall')
    }
  }

  if (form.gameType && form.questionThree) {
    const question = uiControl.questions.find(q => t(q.value) === form.questionThree);
    if (question.key === 1) {
      choiceThree.value[0].value = t('gameQuiz.answers.' + form.gameType + '.handicapAbove')
      choiceThree.value[1].value = t('gameQuiz.answers.' + form.gameType + '.handicapBelow')
    } else if (question.key === 2) {
      choiceThree.value[0].value = t('gameQuiz.answers.' + form.gameType + '.killBig')
      choiceThree.value[1].value = t('gameQuiz.answers.' + form.gameType + '.killSmall')
    }
  }
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadGameQuiz();
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}
</style>
