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
          v-model="request.startTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.quizTitle"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.title')"
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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadBbDacha">
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
          v-permission="['sys:bb-dacha:add']"
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
        v-if="uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'"
        ref="bbDachaForm"
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
        <el-form-item :label="t('fields.title')" prop="quizTitle">
          <el-input v-model="form.quizTitle" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE'" :label="t('fields.homeTeam')" prop="homeTeam">
          <el-input v-model="form.homeTeam" style="width: 350px;" maxlength="50" @change="populateChoiceOne" />
        </el-form-item>
        <el-form-item :label="t('fields.homeTeamIcon')" prop="homeTeamIcon">
          <el-row :gutter="5" style="width: 350px">
            <el-col v-if="form.homeTeamIcon" :span="18">
              <el-image
                v-if="form.homeTeamIcon"
                :src="promoDir + form.homeTeamIcon"
                fit="contain"
                class="preview"
                :preview-src-list="[promoDir + form.homeTeamIcon]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('HOME_TEAM_ICON')"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE'" :label="t('fields.awayTeam')" prop="awayTeam">
          <el-input v-model="form.awayTeam" style="width: 350px;" maxlength="50" @change="populateChoiceOne" />
        </el-form-item>
        <el-form-item :label="t('fields.awayTeamIcon')" prop="awayTeamIcon">
          <el-row :gutter="5" style="width: 350px">
            <el-col v-if="form.awayTeamIcon" :span="18">
              <el-image
                v-if="form.awayTeamIcon"
                :src="promoDir + form.awayTeamIcon"
                fit="contain"
                class="preview"
                :preview-src-list="[promoDir + form.awayTeamIcon]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('AWAY_TEAM_ICON')"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE'" :label="t('fields.question')" prop="questionOne">
          <el-input v-model="form.questionOne" style="width: 350px;" maxlength="50" disabled />
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE'" :label="t('fields.choice')" prop="choiceOne">
          <div v-for="(item, index) in choiceOne" :key="index">
            <el-input style="width: 350px; margin-top: 5px;" v-model="item.value" disabled />
          </div>
        </el-form-item>
        <el-form-item :label="t('fields.matchTime')" prop="matchTime">
          <el-date-picker
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.matchTime"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.startTime')" prop="startTime">
          <el-date-picker
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.startTime"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.endTime')" prop="endTime">
          <el-date-picker
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.endTime"
            style="width: 350px;"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit" :disabled="uiControl.submitBtn">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'END'"
        ref="endBbDachaForm"
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
          <el-form-item :label="t('fields.title')" prop="quizTitle">
            <span>{{ endForm.quizTitle }}</span>
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
          <el-form-item :label="t('fields.question')" prop="questionOne">
            <span>{{ endForm.questionOne }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.choice')" prop="answerOne">
            <el-radio-group v-model="endForm.answerOne" size="mini" style="width: 300px">
              <el-radio-button
                v-for="(item, index) in JSON.parse(endForm.choiceOne)"
                :key="index"
                :label="item"
                size="small"
              >
                <span v-if="item === 'DRAW'">{{ t('fields.draw') }}</span>
                <span v-else>{{ item }}</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.matchTime')" prop="matchTime">
            <span>{{ endForm.matchTime }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.startTime')" prop="startTime">
            <span>{{ endForm.startTime }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.endTime')" prop="endTime">
            <span>{{ endForm.endTime }}</span>
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="end">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'VIEW'"
        ref="viewBbDachaForm"
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
          <el-form-item :label="t('fields.title')" prop="quizTitle">
            <span>{{ viewForm.quizTitle }}</span>
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
          <el-form-item :label="t('fields.question')" prop="questionOne">
            <span>{{ viewForm.questionOne }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="viewForm.status !== 'ENDED'">
          <el-form-item :label="t('fields.choice')" prop="choiceOne">
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
          <el-form-item :label="t('fields.answer')" prop="answerOne">
            <span v-if="viewForm.answerOne === 'DRAW'">{{ t('fields.draw') }}</span>
            <span v-else>{{ viewForm.answerOne }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.matchTime')" prop="matchTime">
            <span
              v-formatter="{
                data: viewForm.matchTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.startTime')" prop="startTime">
            <span
              v-formatter="{
                data: viewForm.startTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.endTime')" prop="endTime">
            <span
              v-formatter="{
                data: viewForm.endTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
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
      <el-table-column prop="quizTitle" :label="t('fields.title')" width="250" />
      <el-table-column prop="homeTeam" :label="t('fields.homeTeam')" width="120" />
      <el-table-column prop="awayTeam" :label="t('fields.awayTeam')" width="120" />
      <el-table-column prop="status" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'ONGOING'" size="mini">{{ t('status.gameQuiz.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'ENDED'" type="success" size="mini">{{ t('status.gameQuiz.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="danger" size="mini">{{ t('status.gameQuiz.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="toShow"
        :label="t('fields.show')"
        width="150"
        v-if="hasPermission(['sys:bb-dacha:update'])"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.toShow"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeToShow(scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.matchTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.matchTime !== null"
            v-formatter="{
              data: scope.row.matchTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="t('fields.startTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.startTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.startTime !== null"
            v-formatter="{
              data: scope.row.startTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="t('fields.endTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.endTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.endTime !== null"
            v-formatter="{
              data: scope.row.endTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="450"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:bb-dacha:update']) || hasPermission(['sys:bb-dacha:list']))"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            v-permission="['sys:bb-dacha:update']"
            @click="showEdit(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            size="small"
            type="warning"
            v-permission="['sys:bb-dacha:list']"
            @click="showDetails(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.view') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ONGOING'"
            size="small"
            type="success"
            v-permission="['sys:bb-dacha:update']"
            @click="showEnd(scope.row)"
            style="cursor: pointer; margin-left: 5px;"
          >
            {{ t('fields.endBbDacha') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ONGOING'"
            size="small"
            type="danger"
            v-permission="['sys:bb-dacha:update']"
            @click="cancel(scope.row.id)"
            style="cursor: pointer; margin-left: 5px"
          >
            {{ t('fields.cancelBbDacha') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'CANCEL' || scope.row.status === 'ENDED'"
            size="small"
            type="success"
            v-permission="['sys:bb-dacha:update']"
            @click="showEnd(scope.row)"
            style="cursor: pointer; margin-left: 5px;"
          >
            {{ t('fields.resettleBbDacha') }}
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
      @current-change="loadBbDacha"
      @size-change="loadBbDacha"
    />
  </div>

  <el-dialog
    :title="uiControl.imageSelectionTitle"
    v-model="uiControl.imageSelectionVisible"
    append-to-body
    width="50%"
    :close-on-press-escape="false"
  >
    <div class="search">
      <el-input
        v-model="imageRequest.name"
        size="small"
        style="width: 200px"
        :placeholder="t('fields.imageName')"
      />
      <el-select
        v-model="imageRequest.siteId"
        size="small"
        :placeholder="t('fields.site')"
        class="filter-item"
        style="width: 120px; margin-left: 5px"
      >
        <el-option
          v-for="item in sites.list"
          :key="item.id"
          :label="item.siteName"
          :value="item.id"
        />
      </el-select>
      <el-button
        style="margin-left: 20px"
        icon="el-icon-search"
        size="mini"
        type="success"
        ref="searchImage"
        @click="loadSiteImage"
      >
        {{ t('fields.search') }}
      </el-button>
      <el-button
        icon="el-icon-refresh"
        size="mini"
        type="warning"
        @click="resetImageQuery()"
      >
        {{ t('fields.reset') }}
      </el-button>
    </div>
    <div class="grid-container">
      <div
        v-for="item in imageList.list"
        :key="item"
        class="grid-item"
        :class="item.id === selectedImage.id ? 'selected' : ''"
      >
        <el-image
          :src="promoDir + item.path"
          fit="contain"
          style="aspect-ratio: 1/1"
          @click="selectImage(item)"
        />
      </div>
    </div>
    <el-pagination
      class="pagination"
      @current-change="changeImagePage"
      layout="prev, pager, next"
      :page-size="imageRequest.size"
      :page-count="imageList.pages"
      :current-page="imageRequest.current"
    />
    <div class="image-info" v-if="selectedImage.id !== 0">
      <el-row>
        <el-col :span="4">
          <h3>{{ t('fields.selectedImage') }}</h3>
        </el-col>
        <el-col :span="20">
          <el-image
            :src="promoDir + selectedImage.path"
            fit="contain"
            class="smallPreview"
            :preview-src-list="[promoDir + selectedImage.path]"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">{{ t('fields.imageSite') }} :</el-col>
        <el-col :span="20">{{ selectedImage.siteName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">{{ t('fields.imageName') }} :</el-col>
        <el-col :span="20">{{ selectedImage.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">{{ t('fields.imageRemark') }} :</el-col>
        <el-col :span="20">{{ selectedImage.remark }}</el-col>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="uiControl.imageSelectionVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitImage">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { getBbDacha, createBbDacha, updateBbDacha, updateToShow, endBbDacha, cancelBbDacha } from "@/api/bb-dacha";
import { hasRole, hasPermission } from "@/utils/util";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment";
import { getSiteImage } from "@/api/site-image";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'
const site = ref(null);
const choiceOne = ref([]);

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

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  quizTitle: null,
  status: null,
  startTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
  promoType: 'TEAM_ICON',
})

const bbDachaForm = ref(null);
const endBbDachaForm = ref(null);
const viewBbDachaForm = ref(null);
const sites = reactive({
  list: []
});
let timeZone = null
const imageList = reactive({
  dataList: [],
  pages: 0,
})

const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

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
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false,
  submitBtn: false
});
const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  id: null,
  siteId: null,
  quizTitle: null,
  homeTeam: null,
  homeTeamIcon: null,
  awayTeam: null,
  awayTeamIcon: null,
  questionOne: null,
  choiceOne: null,
  matchTime: null,
  startTime: null,
  endTime: null
});

const endForm = reactive({
  id: null,
  siteId: null,
  siteName: null,
  quizTitle: null,
  homeTeam: null,
  awayTeam: null,
  questionOne: null,
  choiceOne: null,
  answerOne: null,
  matchTime: null,
  startTime: null,
  endTime: null
})

const viewForm = reactive({
  siteId: null,
  siteName: null,
  quizTitle: null,
  homeTeam: null,
  awayTeam: null,
  status: null,
  questionOne: null,
  choiceOne: null,
  answerOne: null,
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

const validateStartTime = (rule, value, callback) => {
  if (form.endTime && form.endTime < form.startTime) {
    callback(new Error(t('message.startMustBeforeEnd')));
  } else {
    callback();
  }
};

const validateEndTime = (rule, value, callback) => {
  if (form.startTime && form.startTime > form.endTime) {
    callback(new Error(t('message.endMustAfterStart')));
  } else {
    callback();
  }
};

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  quizTitle: [required(t('message.validateQuizTitleRequired'))],
  homeTeam: [required(t('message.validateHomeTeamRequired'))],
  homeTeamIcon: [required(t('message.validateHomeTeamIconRequired'))],
  awayTeam: [required(t('message.validateAwayTeamRequired'))],
  awayTeamIcon: [required(t('message.validateAwayTeamIconRequired'))],
  questionOne: [required(t('message.validateQuestionOneRequired'))],
  choiceOne: [required(t('message.validateChoiceOneRequired')), { validator: validateChoiceOne, trigger: "blur" }],
  matchTime: [required(t('message.validateMatchTimeRequired'))],
  startTime: [required(t('message.validateStartTimeRequired')), { validator: validateStartTime, trigger: "blur" }],
  endTime: [required(t('message.validateEndTimeRequired')), { validator: validateEndTime, trigger: "blur" }]
});

const validateAnswerOne = (rule, value, callback) => {
  if (endForm.answerOne === null) {
    callback(new Error(t('message.validateAnswerOneRequired')));
  } else {
    callback();
  }
};

const endFormRules = reactive({
  answerOne: [{ validator: validateAnswerOne, trigger: "blur" }]
})

async function loadBbDacha() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.startTime !== null) {
    if (request.startTime.length === 2) {
      query.startTime = request.startTime.join(",");
    }
  }
  const { data: ret } = await getBbDacha(query);
  page.pages = ret.pages;
  page.records = ret.records;
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  page.total = ret.total;
  page.loading = false;
}

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : null
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

async function browseImage(type) {
  await loadSiteImage()
  switch (type) {
    case 'HOME_TEAM_ICON':
      uiControl.imageSelectionTitle = t('fields.homeTeamIcon')
      break
    case 'AWAY_TEAM_ICON':
      uiControl.imageSelectionTitle = t('fields.awayTeamIcon')
      break
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function submitImage() {
  switch (uiControl.imageSelectionType) {
    case 'HOME_TEAM_ICON':
      form.homeTeamIcon = selectedImage.path
      break
    case 'AWAY_TEAM_ICON':
      form.awayTeamIcon = selectedImage.path
      break
  }
  uiControl.imageSelectionVisible = false
}

function showDialog(type) {
  if (bbDachaForm.value) {
    bbDachaForm.value.resetFields();
  }
  if (type === 'CREATE') {
    form.id = null;
    form.siteId = request.siteId;
    choiceOne.value = [];
    addChoice();
    form.questionOne = t('gameQuiz.questions.1');
    uiControl.dialogTitle = t('fields.addBbDacha');
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit');
  } else if (type === 'END') {
    uiControl.dialogTitle = t('fields.endBbDacha');
  } else if (type === 'VIEW') {
    uiControl.dialogTitle = t('fields.bbDachaDetails');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(bbDacha) {
  showDialog('EDIT');
  nextTick(() => {
    for (const key in bbDacha) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = bbDacha[key];
      }
    }
  });
}

function showEnd(bbDacha) {
  showDialog('END');
  nextTick(() => {
    for (const key in bbDacha) {
      if (Object.keys(endForm).find(k => k === key)) {
        endForm[key] = bbDacha[key];
        if (key === 'siteId') {
          endForm.siteName = sites.list.find(s => s.id === bbDacha[key]).siteName;
        }
      }
    }
  });
}

function showDetails(bbDacha) {
  showDialog('VIEW');
  nextTick(() => {
    for (const key in bbDacha) {
      if (Object.keys(viewForm).find(k => k === key)) {
        viewForm[key] = bbDacha[key];
        if (key === 'siteId') {
          viewForm.siteName = sites.list.find(s => s.id === bbDacha[key]).siteName;
        }
      }
    }
  });
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create();
  } else if (uiControl.dialogType === 'EDIT') {
    edit();
  }
}

function create() {
  form.choiceOne = constructChoice()
  uiControl.submitBtn = true;
  bbDachaForm.value.validate(async (valid) => {
    console.log(valid)
    if (valid) {
      await createBbDacha(form);
      uiControl.dialogVisible = false;
      await loadBbDacha();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
  uiControl.submitBtn = false;
}

function edit() {
  form.choiceOne = constructChoice()
  uiControl.submitBtn = true;
  bbDachaForm.value.validate(async (valid) => {
    if (valid) {
      await updateBbDacha(form.id, form);
      uiControl.dialogVisible = false;
      await loadBbDacha();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
  uiControl.submitBtn = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.status = null;
  request.quizTitle = null;
  request.startTime = [convertStartDate(new Date()), convertDate(new Date())];
}

function addChoice() {
  choiceOne.value.push({ value: '' })
  choiceOne.value.push({ value: '' })
  choiceOne.value.push({ value: 'DRAW' })
}

function constructChoice() {
  const json = [];
  const choice = choiceOne.value;
  Object.values(choice).forEach((item) => {
    if (item.value) {
      json.push(item.value)
    }
  });
  return JSON.stringify(json);
}

async function end() {
  const answers = {};
  answers.answerOne = endForm.answerOne
  endBbDachaForm.value.validate(async (valid) => {
    if (valid) {
      await endBbDacha(endForm.id, answers);
      uiControl.dialogVisible = false;
      await loadBbDacha();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

async function cancel(id) {
  ElMessageBox.confirm(
    t('message.confirmCancelBbDacha'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await cancelBbDacha(id);
    await loadBbDacha();
    ElMessage({ message: t('message.cancelBbDachaSuccess'), type: "success" });
  });
}

function populateChoiceOne() {
  choiceOne.value[0].value = form.homeTeam
  choiceOne.value[1].value = form.awayTeam
}

async function changeToShow(id) {
  await updateToShow(id)
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadBbDacha();
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
