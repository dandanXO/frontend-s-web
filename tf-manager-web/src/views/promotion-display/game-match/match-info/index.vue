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
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
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
        <el-select
          v-model="request.gameType"
          size="small"
          :placeholder="t('fields.gameType')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.gameType"
            :key="item.key"
            :label="item.displayName === 'NBA' ? 'NBA' : t('gameType.' + item.displayName)"
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
          <el-row :gutter="5">
            <el-col v-if="form.teamOneIcon" :span="18" style="width: 250px">
              <el-image
                v-if="form.teamOneIcon"
                :src="promoDir + form.teamOneIcon"
                fit="contain"
                class="preview"
                :preview-src-list="[promoDir + form.teamOneIcon]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('TEAM_ONE_ICON')"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.teamTwo')" prop="teamTwo">
          <el-input v-model="form.teamTwo" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.teamTwoIcon')" prop="teamTwoIcon">
          <el-row :gutter="5">
            <el-col v-if="form.teamTwoIcon" :span="18" style="width: 250px">
              <el-image
                v-if="form.teamTwoIcon"
                :src="promoDir + form.teamTwoIcon"
                fit="contain"
                class="preview"
                :preview-src-list="[promoDir + form.teamTwoIcon]"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('TEAM_TWO_ICON')"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-select
            v-model="form.gameType"
            size="small"
            :placeholder="t('fields.gameType')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in uiControl.gameType"
              :key="item.key"
              :label="item.displayName === 'NBA' ? 'NBA' : t('gameType.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
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
      <el-table-column prop="matchTitle" :label="t('fields.matchTitle')" width="280" />
      <el-table-column prop="teamOne" :label="t('fields.teamOne')" width="180" />
      <el-table-column prop="teamTwo" :label="t('fields.teamTwo')" width="180" />
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'ACTIVE'" size="mini">{{ t('status.gameMatch.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'ENDED'" type="success" size="mini">{{ t('status.gameMatch.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gameType" :label="t('fields.gameType')" width="140">
        <template #default="scope">
          <span v-if="scope.row.gameType === 'NBA'" size="mini">{{ scope.row.gameType }}</span>
          <span v-else>{{ t('gameType.' + scope.row.gameType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="matchTime" :label="t('fields.matchTime')" width="200" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="150" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
      <el-table-column :label="t('fields.operate')" align="center" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:game-match:update-status']) || hasPermission(['sys:game-match:update']) || hasPermission(['sys:game-match:delete']))" fixed="right" width="280">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'ACTIVE'"
            size="small"
            type="success"
            v-permission="['sys:game-match:update-status']"
            @click="updateStatus(scope.row.id)"
            style="cursor: pointer"
          >
            {{ t('fields.endMatch') }}
          </el-button>
          <el-button
            icon="el-icon-edit"
            size="small"
            type="warning"
            v-permission="['sys:game-match:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="small"
            type="danger"
            v-permission="['sys:game-match:delete']"
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
      @current-change="loadGameMatch"
      @size-change="loadGameMatch"
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
import { getGameMatch, createGameMatch, updateGameMatch, updateGameMatchStatus, deleteGameMatch } from "@/api/game-match";
import { hasRole, hasPermission } from "@/utils/util";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { getShortcuts } from "@/utils/datetime";
import { getSiteImage } from "@/api/site-image";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const shortcuts = getShortcuts(t);
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'
const selectedId = ref(null);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

function disabledStartDate(time) {
  return time.getTime() <= moment(new Date()).subtract(1, 'days').endOf('day').format('x');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  matchTitle: null,
  status: null,
  createTime: [convertDate(new Date()), convertDate(new Date())],
  gameType: null
});

const gameMatchForm = ref(null);
const sites = reactive({
  list: []
});
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
  gameType: [
    { key: 1, displayName: 'NBA', value: 'NBA' },
    { key: 2, displayName: 'SPORT', value: 'SPORT' },
    { key: 3, displayName: 'ESPORT', value: 'ESPORT' },
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
})

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
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = request.createTime.join(",");
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
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editGameMatch');
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
    case 'TEAM_ONE_ICON':
      uiControl.imageSelectionTitle = t('fields.teamOneIcon')
      break
    case 'TEAM_TWO_ICON':
      uiControl.imageSelectionTitle = t('fields.teamTwoIcon')
      break
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
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
    await updateGameMatchStatus(id);
    await loadGameMatch();
    ElMessage({ message: t('message.gameMatchEnded'), type: "success" });
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
  gameMatchForm.value.validate(async (valid) => {
    if (valid) {
      await createGameMatch(form);
      uiControl.dialogVisible = false;
      await loadGameMatch();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  gameMatchForm.value.validate(async valid => {
    if (valid) {
      await updateGameMatch(selectedId.value, form)
      uiControl.dialogVisible = false
      await loadGameMatch()
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
    case 'TEAM_ONE_ICON':
      form.teamOneIcon = selectedImage.path
      break
    case 'TEAM_TWO_ICON':
      form.teamTwoIcon = selectedImage.path
      break
  }
  uiControl.imageSelectionVisible = false
}

function resetQuery() {
  request.siteId = site.value.id;
  request.status = null;
  request.matchTitle = null;
  request.createTime = [convertDate(new Date()), convertDate(new Date())];
  request.gameType = null;
}

async function removeMatch(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteGameMatch(id)
    await loadGameMatch()
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
