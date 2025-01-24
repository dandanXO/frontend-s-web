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
        <el-form-item :label="t('fields.platformName')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.platformCode')" prop="code">
          <el-input v-model="form.code" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-select
            v-model="form.gameType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            multiple
            @focus="loadGameTypes"
          >
            <el-option
              v-for="item in gameTypes.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
import { getTeams, getSportTypes } from "../../../api/sport";
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
  id: null,
  name: null,
  code: null,
  gameType: []
});

const formRules = reactive({
  name: [required(t('message.validatePlatformNameRequired'))],
  code: [required(t('message.validatePlatformCodeRequired'))],
  gameType: [required(t('message.validateGameTypeRequired'))]
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
    uiControl.dialogTitle = t('fields.addPlatform');
    form.id = null;
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editPlatform');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(platform) {
  showDialog("EDIT");
  nextTick(() => {
    for (const key in platform) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'gameType') { // game type 需要进行转换
          form[key] = platform[key].split(","); // string 转 array
        } else {
          form[key] = platform[key];
        }
      }
    }
  });
}

async function loadGameTypes() {
  const { data: ret } = await getSportTypes()
  gameTypes.list = ret
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
