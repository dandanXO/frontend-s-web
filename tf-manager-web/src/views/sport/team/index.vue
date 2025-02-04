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
          <el-input v-model="form._id" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.sportType')" prop="tfSportName">
          <el-input v-model="form.tfSportName" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameEn')" prop="teamNameEn">
          <el-input v-model="form.teamNameEn" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameZh')" prop="teamNameZh">
          <el-input v-model="form.teamNameZh" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameVn')" prop="teamNameVn">
          <el-input v-model="form.teamNameVn" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameKr')" prop="teamNameKr">
          <el-input v-model="form.teamNameKr" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameTh')" prop="teamNameTh">
          <el-input v-model="form.teamNameTh" style="width: 350px;" />
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
      <el-table-column prop="startTime" :label="t('fields.startTime')" width="200" />
      <el-table-column prop="endTime" :label="t('fields.endTime')" width="200" />
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

const { t } = useI18n();
const platformForm = ref(null);
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
  teamNameEn: null,
  teamNameZh: null,
  teamNameVn: null,
  teamNameKr: null,
  teamNameTh: null,
});

const formRules = reactive({
  teamNameEn: [required(t('message.validateTeamNameEnRequired'))],
  teamNameZh: [required(t('message.validateTeamNameZhRequired'))],
  teamNameVn: [required(t('message.validateTeamNameVnRequired'))],
  teamNameKr: [required(t('message.validateTeamNameKrRequired'))],
  teamNameTh: [required(t('message.validateTeamNameThRequired'))]
});

function resetQuery() {
  request.sportType = null;
  request.name = null;
}

async function loadPlatform() {
  page.loading = true;
  const { data: ret } = await getTeams(request);
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

function showEdit(platform) {
  showDialog("EDIT");
  nextTick(() => {
    for (const key in platform) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        form[key] = platform[key];
      }
    }
  });
}

async function loadGameTypes() {
  const { data: ret } = await getSportTypes()
  gameTypes.list = ret
}

async function submit() {
  console.log(form);
  const request = {
    tfTeamNameEn: form.teamNameEn,
    tfTeamNameZh: form.teamNameZh,
    tfTeamNameVn: form.teamNameVn,
    tfTeamNameKr: form.teamNameKr,
    tfTeamNameTh: form.teamNameTh,
  }
  await updateTeamLanguageName(form._id, request);
}

onMounted(() => {
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
