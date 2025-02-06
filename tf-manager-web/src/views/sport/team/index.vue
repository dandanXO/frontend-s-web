<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.sportType"
          size="small"
          :placeholder="t('fields.sportType')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in gameTypes.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-input v-model="request.name" size="small" style="width: 200px; margin-left:10px" :placeholder="t('fields.name')" />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadPlatform">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group" :hidden="true">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="platformForm" v-loading="uiControl.dialogLoading" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.id')" prop="_id">
          <el-input v-model="form._id" style="width: 350px;" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('fields.sportType')" prop="tfSportName">
          <el-input v-model="form.tfSportName" style="width: 350px;" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('fields.teamName')" prop="tfTeamName">
          <el-input v-model="form.tfTeamName" style="width: 350px;" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameEn')" prop="tfTeamNameEn">
          <el-input v-model="form.tfTeamNameEn" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameZh')" prop="tfTeamNameZh">
          <el-input v-model="form.tfTeamNameZh" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameVn')" prop="tfTeamNameVn">
          <el-input v-model="form.tfTeamNameVn" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameKr')" prop="tfTeamNameKr">
          <el-input v-model="form.tfTeamNameKr" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameTh')" prop="tfTeamNameTh">
          <el-input v-model="form.tfTeamNameTh" style="width: 350px;" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row>
      <el-table-column prop="_id" :label="t('fields.id')" width="200" />
      <el-table-column prop="tfSportName" :label="t('fields.sportType')" width="200" />
      <el-table-column prop="tfTeamName" :label="t('fields.teamName')" width="200" />
      <!-- <el-table-column prop="startTime" :label="t('fields.startTime')" width="200" /> -->
      <!-- <el-table-column prop="endTime" :label="t('fields.endTime')" width="200" /> -->
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="200" />
      <el-table-column :label="t('fields.operate')" align="right" fixed="right">
        <template #default="scope" :hidden="true">
          <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)" />
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

import { nextTick, onMounted, reactive, ref } from "vue";
import { required } from "../../../utils/validate";
import { getTeams, getSportTypes, updateTeamLanguageName } from "../../../api/sport";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { getSiteTimeZoneById } from "@/api/site";

const { t } = useI18n();
const platformForm = ref(null);
const timezone = ref(null);

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  dialogLoading: false
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});
const request = reactive({
  size: 30,
  current: 1,
  orderBy: "_id",
  sportType: null,
  name: null
});

const gameTypes = reactive({
  list: [],
})

const form = reactive({
  _id: null,
  tfSportName: null,
  tfTeamName: null,
  tfTeamNameEn: null,
  tfTeamNameZh: null,
  tfTeamNameVn: null,
  tfTeamNameKr: null,
  tfTeamNameTh: null,
});

const formRules = reactive({
  name: [required(t('message.validatePlatformNameRequired'))],
});

function resetQuery() {
  request.sportType = null;
  request.name = null;
}

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return null;
  }
  const date = new Date(timestamp);
  const full = date.toLocaleString('en-US', { timeZone: timezone.value });
  return full;
}

async function loadPlatform() {
  page.loading = true;
  const { data: ret } = await getTeams(request);
  ret.records.forEach(record => {
    record.updateTime = formatTimestamp(record.updateTime);
  });
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadPlatform();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (platformForm.value) {
      platformForm.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.teamName');
    form.id = null;
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.teamName');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(item) {
  showDialog("EDIT");
  console.log(item);
  nextTick(() => {
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        form[key] = item[key];
      }
    }
  });
}

async function loadGameTypes() {
  const { data: ret } = await getSportTypes()
  gameTypes.list = ret
}

async function submit() {
  const request = {
    tfSportName: form.tfSportName,
    tfTeamNameEn: form.tfTeamNameEn,
    tfTeamNameZh: form.tfTeamNameZh,
    tfTeamNameVn: form.tfTeamNameVn,
    tfTeamNameKr: form.tfTeamNameKr,
    tfTeamNameTh: form.tfTeamNameTh,
  }
  await updateTeamLanguageName(form._id, request);
  uiControl.dialogVisible = false
  loadPlatform()
}

onMounted(() => {
  const store = useStore()
  const { data: timeZone } = getSiteTimeZoneById(
    store.state.user.siteId
  )
  timezone.value = timeZone
  loadGameTypes();
  loadPlatform();
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
