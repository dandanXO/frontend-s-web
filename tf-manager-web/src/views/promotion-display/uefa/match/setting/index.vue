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
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.title"
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
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.uefaMatch.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadUefaMatch">
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
          v-permission="['sys:uefa-match:add']"
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
        ref="formRef"
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
            @change="siteChanged"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.platformMatchId')" prop="platformMatchId">
          <el-input v-model="form.platformMatchId" style="width: 350px;" maxlength="20" />
        </el-form-item>
        <el-form-item :label="t('fields.teamGroup')" prop="teamGroup">
          <el-select
            v-model="form.teamGroup"
            size="small"
            :placeholder="t('fields.teamGroup')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.teamGroup"
              :key="item.key"
              :label="t('fields.team' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.teamOne')" prop="teamOneId">
          <el-select
            v-model="form.teamOneId"
            size="small"
            :placeholder="t('fields.teamOne')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadTeamWithSite(form.siteId)"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in teams.list"
              :key="item.id"
              :label="item.teamName"
              :value="item.id"
            >
              <div style="display: flex; align-items: center">
                <img :src="promoDir + item.teamIcon" style="width: 20px; height: 20px; margin-right: 10px">
                <span>{{ item.teamName }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.teamTwo')" prop="teamTwoId">
          <el-select
            v-model="form.teamTwoId"
            size="small"
            :placeholder="t('fields.teamTwo')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadTeamWithSite(form.siteId)"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in teams.list"
              :key="item.id"
              :label="item.teamName"
              :value="item.id"
            >
              <div style="display: flex; align-items: center">
                <img :src="promoDir + item.teamIcon" style="width: 20px; height: 20px; margin-right: 10px">
                <span>{{ item.teamName }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model.number="form.sequence"
            :min="0"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
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
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'END' || uiControl.dialogType === 'RESETTLE'"
        ref="endMatchForm"
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
          <el-form-item :label="t('fields.title')" prop="title">
            <span>{{ endForm.title }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.platformMatchId')" prop="platformMatchId">
            <span>{{ endForm.platformMatchId }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.teamGroup')" prop="teamGroup">
            <span>{{ endForm.teamGroup }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.sequence')" prop="sequence">
            <span>{{ endForm.sequence }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.winner')" prop="winner">
            <el-radio-group v-model="endForm.winner" size="mini" style="width: 300px">
              <el-radio-button
                :label="endForm.teamOneId"
                size="small"
              >{{ endForm.teamOneName }}
              </el-radio-button>
              <el-radio-button
                :label="endForm.teamTwoId"
                size="small"
              >{{ endForm.teamTwoName }}
              </el-radio-button>
              <el-radio-button
                label="0"
                size="small"
              >{{ t('fields.draw') }}
              </el-radio-button>
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
          <el-button type="primary" @click="endMatch">{{ t('fields.confirm') }}</el-button>
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
      <el-table-column prop="title" :label="t('fields.title')" width="250" />
      <el-table-column prop="platformMatchId" :label="t('fields.platformMatchId')" width="140" />
      <el-table-column prop="teamGroup" :label="t('fields.teamGroup')" width="120" />
      <el-table-column prop="teamOneName" :label="t('fields.teamOne')" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.teamOneIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.teamOneName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="teamTwoName" :label="t('fields.teamTwo')" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.teamTwoIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.teamTwoName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="120" />
      <el-table-column prop="winnerTeam" :label="t('fields.winnerTeam')" width="120">
        <template #default="scope">
          <div v-if="scope.row.winnerTeam" style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.winnerTeamIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.winnerTeam }}</span>
          </div>
          <div v-else-if="scope.row.status === 'ENDED' && !scope.row.winnerTeam" style="display: flex; align-items: center">
            <el-tag size="mini" type="warning">{{ t('fields.draw') }}</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'ENDED'" type="success">{{ t('status.uefaMatch.' + scope.row.status) }}</el-tag>
          <el-tag v-else-if="scope.row.status === 'ONGOING'" type="warning">{{ t('status.uefaMatch.' + scope.row.status) }}</el-tag>
          <el-tag v-else type="danger">{{ t('status.uefaMatch.' + scope.row.status) }}</el-tag>
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
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="120" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="120" />
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="300"
        v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:uefa-match:update'])"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'PENDING' || scope.row.status === 'ONGOING'"
            size="small"
            type="primary"
            v-permission="['sys:uefa-match:update']"
            @click="showEdit(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'PENDING'"
            size="small"
            type="success"
            v-permission="['sys:uefa-match:update']"
            @click="setOngoing(scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.startMatch') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ONGOING'"
            size="small"
            type="success"
            v-permission="['sys:uefa-match:update']"
            @click="showEnd(scope.row, false)"
            style="cursor: pointer; margin-left: 5px;"
          >
            {{ t('fields.endMatch') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ONGOING'"
            size="small"
            type="danger"
            v-permission="['sys:uefa-match:update']"
            @click="cancelMatch(scope.row.id)"
            style="cursor: pointer; margin-left: 5px"
          >
            {{ t('fields.cancelMatch') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ENDED'"
            size="small"
            type="success"
            v-permission="['sys:uefa-match:update']"
            @click="showEnd(scope.row, true)"
            style="cursor: pointer; margin-left: 5px;"
          >
            {{ t('fields.resettleMatch') }}
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
      @current-change="loadUefaMatch"
      @size-change="loadUefaMatch"
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
import { getUefaMatch, getTeamBySite, createUefaMatch, updateUefaMatch, uefaMatchOngoing, endUefaMatch, endUefaMatchResettle, cancelUefaMatch } from "@/api/uefa";
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
  status: null,
  title: null,
  matchTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
  promoType: 'TEAM_ICON',
})

const formRef = ref(null);
const endMatchForm = ref(null);
const isResettle = ref(false);
const sites = reactive({
  list: []
});
const teams = reactive({
  list: []
})
let timeZone = null

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  status: [
    { key: 1, displayName: 'PENDING', value: 'PENDING' },
    { key: 2, displayName: 'ONGOING', value: 'ONGOING' },
    { key: 3, displayName: 'CANCEL', value: 'CANCEL' },
    { key: 4, displayName: 'ENDED', value: 'ENDED' }
  ],
  teamGroup: [
    { key: 1, displayName: 'A', value: 'A' },
    { key: 2, displayName: 'B', value: 'B' },
    { key: 3, displayName: 'C', value: 'C' },
    { key: 4, displayName: 'D', value: 'D' },
    { key: 5, displayName: 'E', value: 'E' },
    { key: 6, displayName: 'F', value: 'F' },
    { key: 7, displayName: '16', value: '16' },
    { key: 8, displayName: '8', value: '8' },
    { key: 9, displayName: '4', value: '4' },
    { key: 10, displayName: '2', value: '2' }
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false
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
  title: null,
  platformMatchId: null,
  teamGroup: null,
  teamOneId: null,
  teamTwoId: null,
  sequence: null,
  matchTime: null
});

const endForm = reactive({
  id: null,
  siteId: null,
  title: null,
  platformMatchId: null,
  teamGroup: null,
  teamOneId: null,
  teamOneName: null,
  teamTwoId: null,
  teamTwoName: null,
  sequence: null,
  winner: null,
  matchTime: null
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  title: [required(t('message.validateTitleRequired'))],
  teamGroup: [required(t('message.validateTeamGroupRequired'))],
  teamOneId: [required(t('message.validateTeamOneRequired'))],
  teamTwoId: [required(t('message.validateTeamTwoRequired'))],
  matchTime: [required(t('message.validateMatchTimeRequired'))]
});

const endFormRules = reactive({
  winner: [required(t('message.validateWinnerRequired'))]
})

async function loadTeamWithSite(siteId) {
  if (siteId) {
    const { data: team } = await getTeamBySite(siteId);
    teams.list = team;
  } else {
    const { data: team } = await getTeamBySite(request.siteId);
    teams.list = team;
  }
}

async function loadUefaMatch() {
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
  const { data: ret } = await getUefaMatch(query);
  page.pages = ret.pages;
  page.records = ret.records;
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  page.total = ret.total;
  page.loading = false;
}

function showDialog(type) {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  if (type === 'CREATE') {
    form.id = null;
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.add');
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit');
  } else if (type === 'END') {
    uiControl.dialogTitle = t('fields.endMatch');
    isResettle.value = false;
  } else if (type === 'RESETTLE') {
    uiControl.dialogTitle = t('fields.endMatch');
    isResettle.value = true;
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(match) {
  showDialog('EDIT');
  nextTick(() => {
    for (const key in match) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = match[key];
      }
    }
  });
}

function showEnd(match, resettle) {
  if (resettle) {
    showDialog('RESETTLE');
  } else {
    showDialog('END');
  }
  nextTick(() => {
    for (const key in match) {
      if (Object.keys(endForm).find(k => k === key)) {
        endForm[key] = match[key];
        if (key === 'siteId') {
          endForm.siteName = sites.list.find(s => s.id === match[key]).siteName;
        } else if (key === 'winner') {
          if (match[key] === null) {
            endForm.winner = 0
          } else {
            endForm.winner = match[key]
          }
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
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createUefaMatch(form);
      uiControl.dialogVisible = false;
      await loadUefaMatch();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateUefaMatch(form.id, form);
      uiControl.dialogVisible = false;
      await loadUefaMatch();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
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
  request.title = null;
  request.matchTime = [convertStartDate(new Date()), convertDate(new Date())];
}

async function endMatch() {
  endMatchForm.value.validate(async (valid) => {
    if (valid) {
      if (isResettle.value) {
        await endUefaMatchResettle(endForm.id, endForm.winner);
      } else {
        await endUefaMatch(endForm.id, endForm.winner);
      }
      uiControl.dialogVisible = false;
      await loadUefaMatch();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

async function cancelMatch(id) {
  ElMessageBox.confirm(
    t('message.confirmCancelMatch'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await cancelUefaMatch(id);
    await loadUefaMatch();
    ElMessage({ message: t('message.cancelSuccess'), type: "success" });
  });
}

async function setOngoing(id) {
  ElMessageBox.confirm(
    t('message.confirmStartMatch'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await uefaMatchOngoing(id);
    await loadUefaMatch();
    ElMessage({ message: t('message.success'), type: "success" });
  });
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

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

async function siteChanged() {
  await loadTeamWithSite(form.siteId);
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadTeamWithSite();
  await loadUefaMatch();
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
