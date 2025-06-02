<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.sportId"
          size="small"
          :placeholder="t('fields.sportType')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.sport"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.liveStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.liveStatus"
            :key="item.name"
            :label="item.display"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.matchTitle')"
        />
        <el-date-picker
          v-model="request.eventStartTime"
          format="YYYY-MM-DD HH:mm:ss"
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

        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadEvent">
          {{ t('fields.search') }}
        </el-button>

        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
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
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.sportType')" prop="sportId">
          <el-select
            v-model="form.sportId"
            size="small"
            :placeholder="t('fields.sportType')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.sport"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.homeTeam')" prop="homeTeam">
          <el-select
            v-model="form.homeId"
            size="small"
            allow-create
            filterable
            :placeholder="t('fields.homeTeam')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="val => {
              if (typeof val === 'string') form.homeName = val;
              else form.homeName = '';
            }"
            @focus="loadEventWithSite(form.sportId)"
          >
            <el-option
              v-for="item in teams.list"
              :key="item.nameZh"
              :label="item.nameZh"
              :value="item.id"
            >
              <div style="display: flex; align-items: center">
                <img :src="(item.icon?.startsWith('http://') || item.icon?.startsWith('https://')) ? item.icon : promoDir + item.icon" style="width: 20px; height: 20px; margin-right: 10px">
                <span>{{ item.nameZh }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.awayTeam')" prop="awayTeam">
          <el-select
            v-model="form.awayId"
            size="small"
            :placeholder="t('fields.awayTeam')"
            allow-create
            filterable
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadEventWithSite(form.sportId)"
            @change="val => {
              if (typeof val === 'string') form.awayName = val;
              else form.awayName = '';
            }"
          >
            <el-option
              v-for="item in teams.list"
              :key="item.nameZh"
              :label="item.nameZh"
              :value="item.id"
            >
              <div style="display: flex; align-items: center">
                <img :src="(item.icon?.startsWith('http://') || item.icon?.startsWith('https://')) ? item.icon : promoDir + item.icon" style="width: 20px; height: 20px; margin-right: 10px">
                <span>{{ item.nameZh }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model.number="form.sort"
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
            v-model="form.eventStartTime"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="liveStatus">
          <el-select
            v-model="form.liveStatus"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 120px;"
          >
            <el-option
              v-for="item in uiControl.liveStatus"
              :key="item.display"
              :label="item.display"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.isTestEvent')" prop="isTest">
          <el-switch
            v-model="form.isTest"
            :active-text="t('fields.yes')"
            :inactive-text="t('fields.no')"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row :empty-text="t('fields.noData')">
      <el-table-column prop="id" :label="t('fields.platformMatchId')" width="140" />
      <el-table-column prop="sportId" :label="t('fields.sportType')" width="140" :formatter="formatSportType" />
      <el-table-column prop="title" :label="t('fields.title')" width="250" />
      <el-table-column prop="homeNameZh" :label="t('fields.homeTeam')" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img
              v-if="scope.row.homeIcon"
              :src="scope.row.homeIcon.startsWith('http:') || scope.row.homeIcon.startsWith('https:')
                ? scope.row.homeIcon
                : promoDir + scope.row.homeIcon"
              style="width: 20px; height: 20px; margin-right: 10px"
            >
            <span>{{ scope.row.homeNameZh || scope.row.homeName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="awayNameZh" :label="t('fields.awayTeam')" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img
              v-if="scope.row.awayIcon"
              :src="scope.row.awayIcon.startsWith('http:') || scope.row.awayIcon.startsWith('https:')
                ? scope.row.awayIcon
                : promoDir + scope.row.awayIcon"
              style="width: 20px; height: 20px; margin-right: 10px"
            >
            <span>{{ scope.row.awayNameZh || scope.row.awayName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="t('fields.sequence')" width="50" />
      <el-table-column prop="liveStatus" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.liveStatus === 2" type="success">{{ t('status.uefaMatch.ENDED') }}</el-tag>
          <el-tag v-else-if="scope.row.liveStatus === 1" type="warning">{{ t('status.uefaMatch.ONGOING') }}</el-tag>
          <el-tag v-else-if="scope.row.liveStatus === 3" type="danger">{{ t('status.uefaMatch.CANCEL') }}</el-tag>
          <el-tag v-else-if="scope.row.liveStatus === 0" type="info">{{ t('status.uefaMatch.PENDING') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eventStartTime" :label="t('fields.matchTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.eventStartTime === null">-</span>
          <span
            v-if="scope.row.eventStartTime !== null"
            v-formatter="{
              data: scope.row.eventStartTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="isTest" :label="t('fields.isTestEvent')" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.isTest ? 'success' : 'info'">
            {{ scope.row.isTest ? t('fields.yes') : t('fields.no') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
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
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="120" />
      <<el-table-column
      fixed="right"
      :label="t('fields.operate')"
      align="center"
      width="300"
    >
      <template #default="scope">
        <el-button
          icon="el-icon-delete"
          size="mini"
          type="danger"
          @click="deleteTeam(scope.row.id)"
        >
          {{ t('fields.delete') }}
        </el-button>
        <router-link :to="{ path: '/live-sport/live-setting', query: { id: scope.row.id } }">
          <el-button icon="el-icon-video-camera" size="mini" type="success">
            {{ t('fields.manageStream') }}
          </el-button>
        </router-link>
      </template>
    </el-table-column>

    </el-table>
    <el-pagination class="pagination"
                   @current-change="changePage"
                   layout="prev, pager, next"
                   :page-size="request.size"
                   :page-count="page.pages"
                   :current-page="request.current"
    />
  </div>
</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { getSiteTimeZoneById } from "@/api/site";
import { getTeamById, getEvents, createSportLiveEvent, deleteSportLiveEvent } from "@/api/sport-live";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { useSessionStorage } from "@vueuse/core";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment/moment";

const { t } = useI18n();
const shortcuts = getShortcuts(t);
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  dialogLoading: false,
  sport: [
    { name: 'FOOTBALL', display: '足球', id: 1 },
    { name: 'BASKETBALL', display: '篮球', id: 2 },
    { name: 'LOL', display: 'LOL', id: 3 },
    { name: 'CSGO', display: 'CSGO', id: 4 },
    { name: 'DOTA2', display: 'DOTA2', id: 5 },
    { name: 'KOG', display: '王者荣耀', id: 6 },
  ],
  liveStatus: [
    { name: '1', display: t('status.uefaMatch.PENDING'), id: 0 },
    { name: '2', display: t('status.uefaMatch.ONGOING'), id: 1 },
    { name: '3', display: t('status.uefaMatch.ENDED'), id: 2 },
    { name: '4', display: t('status.uefaMatch.CANCEL'), id: 3 },
  ],
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

function formatSportType(row) {
  switch (row.sportId) {
    case 1:
      return t('fields.football');
    case 2:
      return t('fields.basketball');
    case 3:
      return 'LOL'
    case 4:
      return 'CSGO'
    case 5:
      return 'DOTA2'
    default:
      return '-';
  }
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

const request = reactive({
  size: 30,
  current: 1,
  sportId: null,
  liveStatus: null,
  title: null,
  eventStartTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const timezone = ref(null);
const teams = reactive({
  list: []
})
const formRef = ref(null);
const store = useStore()
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];

function resetQuery() {
  request.sportId = null;
  request.nameEn = null;
  request.title = null;
}

function isInTeamList(value) {
  return teams.list.some(t => t.id === value);
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

async function loadEventWithSite(sportId) {
  console.log(sportId)
  if (sportId) {
    console.log(sportId)
    const { data: team } = await getTeamById(sportId);
    teams.list = team;
  } else {
    const { data: team } = await getTeamById(request.sportId);
    teams.list = team;
  }
}

async function loadEvent() {
  page.loading = true;
  const { data: ret } = await getEvents(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function deleteTeam(eventId) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: "warning",
  }).then(async () => {
    try {
      console.log(eventId)
      await deleteSportLiveEvent(eventId);
      ElMessage({ message: t("message.deleteSuccess"), type: "success" });
      await loadEvent();
    } catch (error) {
      ElMessage({ message: t("message.deleteFailed"), type: "error" });
    }
  }).catch(() => {
  });
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create();
  }
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (!isInTeamList(form.homeId)) {
        form.homeName = form.homeId;
        form.homeId = null;
      }
      if (!isInTeamList(form.awayId)) {
        form.awayName = form.awayId;
        form.awayId = null;
      }

      form.icon = form.icon?.startsWith("http") ? store.state.user.siteId + "/" + form.icon.split('/').pop() : form.icon;
      await createSportLiveEvent(form);
      uiControl.dialogVisible = false;
      await loadEvent();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function changePage(page) {
  request.current = page;
  loadEvent();
}

function showDialog(type, row) {
  uiControl.dialogVisible = true;
  uiControl.dialogType = type;
  Object.assign(form, {
    id: null,
    sportId: null,
    homeId: null,
    homeNameZh: null,
    awayId: null,
    awayNameZh: null,
    sort: null,
    eventStartTime: null,
    liveStatus: null,
    title: null
  });
}

const form = reactive({
  id: null,
  homeId: null,
  homeNameZh: null,
  awayId: null,
  awayNameZh: null,
  sportId: null,
  liveStatus: null,
  sort: null,
  title: null,
  eventStartTime: null,
  homeName: '',
  awayName: '',
  isTest: false
});

const formRules = reactive({
  title: [required(t('message.validateTeamNameRequired'))],
  nameEn: [required(t('message.validateTeamNameRequired'))],
  icon: [required(t('message.validateTeamIconRequired'))]
});

onMounted(async () => {
  const store = useStore()
  const { data: timeZone } = getSiteTimeZoneById(
    store.state.user.siteId
  )
  timezone.value = timeZone

  await loadEvent();
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
