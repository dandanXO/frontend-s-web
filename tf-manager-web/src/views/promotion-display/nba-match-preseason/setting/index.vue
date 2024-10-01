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
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
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
          @focus="loadSites"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.gameMatch.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadNbaMatchPreseason">
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
          v-permission="['sys:nba-match-preseason:add']"
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
        ref="nbaMatchPreseasonForm"
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
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.homeTeam')" prop="homeTeam">
          <el-input v-model="form.homeTeam" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.homeTeamIcon')" prop="homeTeamIcon">
          <el-row :gutter="5">
            <el-col v-if="form.homeTeamIcon" :span="18" style="width: 250px">
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
        <el-form-item :label="t('fields.awayTeam')" prop="awayTeam">
          <el-input v-model="form.awayTeam" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.awayTeamIcon')" prop="awayTeamIcon">
          <el-row :gutter="5">
            <el-col v-if="form.awayTeamIcon" :span="18" style="width: 250px">
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
        v-else-if="uiControl.dialogType === 'END'"
        ref="endNbaMatchPreseasonForm"
        :model="endForm"
        :inline="true"
        size="small"
        label-width="300px"
      >
        <el-form-item :label="t('fields.title')" prop="title">
          <span>{{ selectedMatchTitle }}</span>
        </el-form-item>
        <el-row>
          <el-form-item :label="t('fields.threePointShots')" prop="threePointShots">
            <el-checkbox v-model="endForm.threePointShots" size="large" />
          </el-form-item>
          <el-form-item :label="t('fields.shotPoints')" prop="shotPoints">
            <el-checkbox v-model="endForm.shotPoints" size="large" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.scoringShots')" prop="scoringShots">
            <el-checkbox v-model="endForm.scoringShots" size="large" />
          </el-form-item>
          <el-form-item :label="t('fields.foulOut')" prop="foulOut">
            <el-checkbox v-model="endForm.foulOut" size="large" />
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
      <el-table-column prop="title" :label="t('fields.title')" width="200" />
      <el-table-column prop="homeTeam" :label="t('fields.homeTeam')" width="150" />
      <el-table-column prop="awayTeam" :label="t('fields.awayTeam')" width="150" />
      <el-table-column prop="threePointShots" :label="t('fields.threePointShots')" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.threePointShots" type="success" size="mini">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else type="danger" size="mini">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="shotPoints" :label="t('fields.shotPoints')" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.shotPoints" type="success" size="mini">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else type="danger" size="mini">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="scoringShots" :label="t('fields.scoringShots')" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.scoringShots" type="success" size="mini">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else type="danger" size="mini">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="foulOut" :label="t('fields.foulOut')" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.foulOut" type="success" size="mini">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else type="danger" size="mini">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'ACTIVE'" size="mini">{{ t('status.gameMatch.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'ENDED'" type="warning" size="mini">{{ t('status.gameMatch.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="toShow"
        :label="t('fields.show')"
        width="150"
        v-if="hasPermission(['sys:nba-match-preseason:update'])"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.toShow"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeToShow(scope.row.id, scope.row.toShow)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="200">
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
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="150" />
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
      <el-table-column :label="t('fields.operate')" align="center" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:nba-match-preseason:update']) || hasPermission(['sys:nba-match-preseason:del']))" fixed="right" width="280">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'ACTIVE'"
            size="small"
            type="success"
            v-permission="['sys:nba-match-preseason:update']"
            @click="showEnd(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.endMatch') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'ACTIVE'"
            icon="el-icon-edit"
            size="small"
            type="warning"
            v-permission="['sys:nba-match-preseason:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            v-if="scope.row.status === 'ACTIVE'"
            icon="el-icon-remove"
            size="small"
            type="danger"
            v-permission="['sys:nba-match-preseason:del']"
            @click="removeMatch(scope.row.id)"
          />
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
      @current-change="loadNbaMatchPreseason"
      @size-change="loadNbaMatchPreseason"
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
import { getNbaMatchPreseason, createNbaMatchPreseason, updateNbaMatchPreseason, updateToShow, endNbaMatchPreseason, deleteNbaMatchPreseason } from "@/api/nba-match-preseason";
import { hasRole, hasPermission } from "@/utils/util";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getShortcuts } from "@/utils/datetime";
import { getSiteImage } from "@/api/site-image";
import { useSessionStorage } from "@vueuse/core";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const shortcuts = getShortcuts(t);
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'
const selectedId = ref(null);
const result = ref([])
const selectedMatchTitle = ref(null);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  title: null,
  status: null,
  matchTime: [convertDate(new Date()), convertDate(new Date())],
});

const nbaMatchPreseasonForm = ref(null);
const endNbaMatchPreseasonForm = ref(null);
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
    { key: 1, displayName: 'ACTIVE', value: 'ACTIVE' },
    { key: 2, displayName: 'ENDED', value: 'ENDED' }
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false
});

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
  promoType: 'TEAM_ICON',
})

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  siteId: null,
  title: null,
  homeTeam: null,
  homeTeamIcon: null,
  awayTeam: null,
  awayTeamIcon: null,
  matchTime: null
});

const endForm = reactive({
  id: null,
  threePointShots: false,
  shotPoints: false,
  scoringShots: false,
  foulOut: false
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  title: [required(t('message.validateTitleRequired'))],
  homeTeam: [required(t('message.validateHomeTeamRequired'))],
  homeTeamIcon: [required(t('message.validateHomeTeamIconRequired'))],
  awayTeam: [required(t('message.validateAwayTeamRequired'))],
  awayTeamIcon: [required(t('message.validateAwayTeamIconRequired'))],
  matchTime: [required(t('message.validateMatchTimeRequired'))]
});

async function loadNbaMatchPreseason() {
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
  const { data: ret } = await getNbaMatchPreseason(query);
  page.pages = ret.pages;
  page.records = ret.records;
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  page.total = ret.total;
  page.loading = false;
}

function showDialog(type) {
  if (nbaMatchPreseasonForm.value) {
    nbaMatchPreseasonForm.value.resetFields();
  }
  if (type === "CREATE") {
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.addGameMatch');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editGameMatch');
  } else if (type === 'END') {
    if (endNbaMatchPreseasonForm.value) {
      endNbaMatchPreseasonForm.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.endMatch')
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
    selectedId.value = match.id;
  });
}

function showEnd(match) {
  showDialog('END');
  endForm.id = match.id;
  selectedMatchTitle.value = match.title;
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

async function changeToShow(id, toShow) {
  await updateToShow(id, toShow)
}

function endMatch() {
  endNbaMatchPreseasonForm.value.validate(async (valid) => {
    if (valid) {
      await endNbaMatchPreseason(endForm);
      uiControl.dialogVisible = false;
      await loadNbaMatchPreseason();
      ElMessage({ message: t('message.gameMatchEnded'), type: "success" });
    }
  });
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function create() {
  nbaMatchPreseasonForm.value.validate(async (valid) => {
    if (valid) {
      await createNbaMatchPreseason(form);
      uiControl.dialogVisible = false;
      await loadNbaMatchPreseason();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  nbaMatchPreseasonForm.value.validate(async valid => {
    if (valid) {
      if (result.value.length > 0) {
        Object.entries(result.value).forEach(([key, value]) => {
          if (value) {
            form[key] = value
          }
        })
      }
      await updateNbaMatchPreseason(selectedId.value, form)
      uiControl.dialogVisible = false
      await loadNbaMatchPreseason()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
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

function resetQuery() {
  request.siteId = site.value.id;
  request.status = null;
  request.title = null;
  request.matchTime = [convertDate(new Date()), convertDate(new Date())];
  request.gameType = null;
}

async function removeMatch(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteNbaMatchPreseason(id)
    await loadNbaMatchPreseason()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  imageRequest.siteId = site.value.id;
  await loadNbaMatchPreseason();
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

.el-form-item--level-color:deep(.el-form-item__content) {
  display: flex !important;
}
.el-overlay-dialog .el-image {
  width: 100px;
  height: 100px;
  background-color: #c1c1c1;
}
</style>
