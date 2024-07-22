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
        <el-select
          v-model="request.teamGroup"
          size="small"
          :placeholder="t('fields.teamGroup')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.teamGroup"
            :key="item.key"
            :label="t('fields.team' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadUefaTeam">
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
          v-permission="['sys:uefa-team:add']"
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
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
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
        <el-form-item :label="t('fields.teamName')" prop="teamName">
          <el-input v-model="form.teamName" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.teamIcon')" prop="teamIcon">
          <el-row :gutter="5" style="width: 350px">
            <el-col v-if="form.teamIcon" :span="18">
              <el-image
                v-if="form.teamIcon"
                :src="promoDir + form.teamIcon"
                fit="contain"
                class="preview"
                :preview-src-list="[promoDir + form.teamIcon]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage()"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'SCORE'"
        ref="scoreFormRef"
        :model="scoreForm"
        :rules="scoreFormRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
          <el-select
            v-model="scoreForm.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            disabled
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.total')" prop="total">
          <el-input v-model="scoreForm.total" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.win')" prop="win">
          <el-input v-model="scoreForm.win" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.draw')" prop="draw">
          <el-input v-model="scoreForm.draw" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.loss')" prop="loss">
          <el-input v-model="scoreForm.loss" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.goalScored')" prop="goalScored">
          <el-input v-model="scoreForm.goalScored" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.goalAgainst')" prop="goalAgainst">
          <el-input v-model="scoreForm.goalAgainst" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.goalDifference')" prop="goalDifference">
          <el-input v-model="scoreForm.goalDifference" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.score')" prop="score">
          <el-input v-model="scoreForm.score" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
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
      <el-table-column prop="teamGroup" :label="t('fields.teamGroup')" width="180">
        <template #default="scope">
          <span>{{ t('fields.team' + scope.row.teamGroup) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teamName" :label="t('fields.teamName')" width="230">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img :src="promoDir + scope.row.teamIcon" style="width: 20px; height: 20px; margin-right: 10px">
            <span>{{ scope.row.teamName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total" :label="t('fields.total')" width="110" />
      <el-table-column prop="win" :label="t('fields.win')" width="110" />
      <el-table-column prop="loss" :label="t('fields.loss')" width="110" />
      <el-table-column prop="draw" :label="t('fields.draw')" width="110" />
      <el-table-column prop="goalScored" :label="t('fields.goalScored')" width="110" />
      <el-table-column prop="goalAgainst" :label="t('fields.goalAgainst')" width="110" />
      <el-table-column prop="goalDifference" :label="t('fields.goalDifference')" width="110" />
      <el-table-column prop="score" :label="t('fields.score')" width="110" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200">
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
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="200">
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
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="250"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:uefa-team:update']) || hasPermission(['sys:uefa-team:list']))"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            v-permission="['sys:uefa-team:update']"
            @click="showEdit(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            size="small"
            type="success"
            v-permission="['sys:uefa-team:update']"
            @click="showEditScore(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.editScore') }}
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
      @current-change="loadUefaTeam"
      @size-change="loadUefaTeam"
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
import { ElMessage } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { getUefaTeam, createUefaTeam, updateUefaTeam, updateUefaTeamScore } from "@/api/uefa";
import { hasRole, hasPermission } from "@/utils/util";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
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

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  teamGroup: null
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
const scoreFormRef = ref(null);
const sites = reactive({
  list: []
});
let timeZone = null

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
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
  teamGroup: null,
  teamName: null,
  teamIcon: null
});

const scoreForm = reactive({
  id: null,
  siteId: null,
  total: null,
  win: null,
  loss: null,
  draw: null,
  goalScored: null,
  goalAgainst: null,
  goalDifference: null,
  score: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  teamGroup: [required(t('message.validateTeamGroupRequired'))],
  teamName: [required(t('message.validateTeamNameRequired'))],
  teamIcon: [required(t('message.validateTeamIconRequired'))]
});

const scoreFormRules = reactive({
  total: [required(t('message.validateTotalRequired'))],
  win: [required(t('message.validateWinRequired'))],
  loss: [required(t('message.validateLossRequired'))],
  draw: [required(t('message.validateDrawRequired'))],
  goalScored: [required(t('message.validateGoalScoredRequired'))],
  goalAgainst: [required(t('message.validateGoalAgainstRequired'))],
  goalDifference: [required(t('message.validateGoalDifferenceRequired'))],
  score: [required(t('message.validateScoreRequired'))]
});

async function loadUefaTeam() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getUefaTeam(query);
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
  } else if (type === 'EDIT' || type === 'SCORE') {
    uiControl.dialogTitle = t('fields.edit');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(team) {
  showDialog('EDIT');
  nextTick(() => {
    for (const key in team) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = team[key];
      }
    }
  });
}

function showEditScore(team) {
  showDialog('SCORE');
  nextTick(() => {
    for (const key in team) {
      if (Object.keys(scoreForm).find(k => k === key)) {
        scoreForm[key] = team[key];
      }
    }
  });
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create();
  } else if (uiControl.dialogType === 'EDIT') {
    edit();
  } else if (uiControl.dialogType === 'SCORE') {
    editScore();
  }
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createUefaTeam(form);
      uiControl.dialogVisible = false;
      await loadUefaTeam();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateUefaTeam(form.id, form);
      uiControl.dialogVisible = false;
      await loadUefaTeam();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

function editScore() {
  scoreFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateUefaTeamScore(scoreForm.id, scoreForm);
      uiControl.dialogVisible = false;
      await loadUefaTeam();
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
  request.teamGroup = null;
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

async function browseImage() {
  await loadSiteImage()
  uiControl.imageSelectionTitle = t('fields.teamIcon')
  uiControl.imageSelectionVisible = true
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function submitImage() {
  form.teamIcon = selectedImage.path
  uiControl.imageSelectionVisible = false
}

function restrictInput(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
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
  await loadUefaTeam();
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
