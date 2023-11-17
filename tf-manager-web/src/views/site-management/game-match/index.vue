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
          v-model="request.matchTitle"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.matchTitle')"
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
            :label="t('status.gameMatch.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadGameMatch">
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
          v-permission="['sys:game-match:add']"
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
      width="680px"
    >
      <el-form
        ref="gameMatchForm"
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
        <el-form-item :label="t('fields.matchTitle')" prop="matchTitle">
          <el-input v-model="form.matchTitle" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.teamOne')" prop="teamOne">
          <el-input v-model="form.teamOne" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.teamOneIcon')" prop="teamOneIcon">
          <el-row :gutter="22">
            <el-col :span="22">
              <el-input :readonly="true" v-model="form.teamOneIcon" />
            </el-col>
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="inputTeamOne"
                style="display: none"
                accept="image/*"
                @change="attachTeamOneIcon"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputTeamOne.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.teamTwo')" prop="teamTwo">
          <el-input v-model="form.teamTwo" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.teamTwoIcon')" prop="teamTwoIcon">
          <el-row :gutter="22">
            <el-col :span="22">
              <el-input :readonly="true" v-model="form.teamTwoIcon" />
            </el-col>
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="inputTeamTwo"
                style="display: none"
                accept="image/*"
                @change="attachTeamTwoIcon"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputTeamTwo.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-input v-model="form.gameType" style="width: 350px;" maxlength="50" />
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
      <el-table-column prop="matchTitle" :label="t('fields.matchTitle')" width="280" />
      <el-table-column prop="teamOne" :label="t('fields.teamOne')" width="180" />
      <el-table-column prop="teamTwo" :label="t('fields.teamTwo')" width="180" />
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'ACTIVE'" size="mini">{{ t('status.gameMatch.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'ENDED'" type="success" size="mini">{{ t('status.gameMatch.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="200" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="150" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
      <el-table-column :label="t('fields.operate')" align="center" v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:game-match:update-status'])">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === 'ACTIVE'"
            size="small"
            type="success"
            v-permission="['sys:game-match:update-status']"
            @click="updateStatus(scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.endMatch') }}
          </el-tag>
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
      @current-change="loadGameMatch"
      @size-change="loadGameMatch"
    />
  </div>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { getGameMatch, createGameMatch, updateGameMatch } from "@/api/game-match";
import { hasRole, hasPermission } from "@/utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment";
import { uploadImage } from "@/api/image";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);

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
  matchTitle: null,
  status: null,
  matchTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const gameMatchForm = ref(null);
const sites = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  status: [
    { key: 1, displayName: 'ACTIVE', value: 'ACTIVE' },
    { key: 2, displayName: 'ENDED', value: 'ENDED' }
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
  matchTitle: null,
  teamOne: null,
  teamOneIcon: null,
  teamTwo: null,
  teamTwoIcon: null,
  gameType: null,
  matchTime: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  matchTitle: [required(t('message.validateMatchTitleRequired'))],
  teamOne: [required(t('message.validateTeamOneRequired'))],
  teamOneIcon: [required(t('message.validateTeamOneIconRequired'))],
  teamTwo: [required(t('message.validateTeamTwoRequired'))],
  teamTwoIcon: [required(t('message.validateTeamTwoIconRequired'))],
  gameType: [required(t('message.validateGameTypeRequired'))],
  matchTime: [required(t('message.validateMatchTimeRequired'))]
});

async function loadGameMatch() {
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
  const { data: ret } = await getGameMatch(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function showDialog(type) {
  if (gameMatchForm.value) {
    gameMatchForm.value.resetFields();
  }
  if (type === "CREATE") {
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.addGameMatch');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function updateStatus(id) {
  ElMessageBox.confirm(
    t('message.confirmEndMatch'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await updateGameMatch(id);
    await loadGameMatch();
    ElMessage({ message: t('message.gameMatchEnded'), type: "success" });
  });
}

function create() {
  gameMatchForm.value.validate(async (valid) => {
    if (valid) {
      await createGameMatch(form);
      uiControl.dialogVisible = false;
      await loadGameMatch();
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
  request.matchTitle = null;
  request.matchTime = [convertStartDate(new Date()), convertDate(new Date())];
}

async function attachTeamOneIcon(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    form.teamOneIcon = data.data
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function attachTeamTwoIcon(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    form.teamTwoIcon = data.data
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']

  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', 'game-match/' + form.siteId);
    formData.append('overwrite', false)
    return await uploadImage(formData)
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
  await loadGameMatch();
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
