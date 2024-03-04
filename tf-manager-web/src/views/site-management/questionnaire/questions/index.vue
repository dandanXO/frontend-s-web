<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="mini"
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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadQuestionnaire">
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')"
                   v-permission="['sys:questionnaire:create']"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeQuestionnaire()"
                   :disabled="uiControl.removeBtn"
                   v-permission="['sys:questionnaire:del']"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      v-loading="page.loading"
      @selection-change="handleSelectionChange"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" min-width="180" />
      <el-table-column prop="siteName" :label="t('fields.site')" min-width="250" />
      <el-table-column prop="question" :label="t('fields.question')" min-width="250" />
      <el-table-column prop="isMultiple" :label="t('fields.isMultiple')" min-width="180">
        <template #default="scope">
          <el-tag v-if="scope.row.isMultiple" type="success">{{ t('fields.yes') }}</el-tag>
          <el-tag v-else type="danger">{{ t('fields.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="t('fields.status')"
        width="150"
        v-if="hasPermission(['sys:questionnaire:update'])"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeQuestionnaireStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        width="350"
      >
        <template #default="scope">
          <el-button size="mini" type="primary" @click="viewChoices(scope.row.id)">{{ t('fields.viewChoice') }}</el-button>
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:questionnaire:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:questionnaire:del']" @click="removeQuestionnaire(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadQuestionnaire"
      @size-change="loadQuestionnaire"
    />
  </div>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="1000px"
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
      <el-form-item :label="t('fields.sequence')" prop="sequence">
        <el-input-number
          type="number"
          v-model.number="form.sequence"
          :min="1"
          style="width: 350px"
          @keypress="restrictInput($event)"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="t('fields.question')" prop="question">
        <el-input v-model="form.question" style="width: 350px;" maxlength="50" />
      </el-form-item>
      <el-form-item :label="t('fields.isMultiple')" prop="isMultiple">
        <el-checkbox v-model="form.isMultiple" :true-label="true" :false-label="false" />
      </el-form-item>
      <el-form-item :label="t('fields.choice')" prop="choice">
        <div v-for="(item, index) in choiceParam" :key="index">
          <span class="param-label">{{ t('fields.choice') }}:</span>
          <el-input class="param-input" v-model="item.choice" />

          <span class="param-label">{{ t('fields.needSpecify') }}:</span>
          <el-checkbox style="margin-left: 5px; margin-right: 15px;" v-model="item.needSpecify" :true-label="true" :false-label="false" />

          <el-button v-if="hasPermission(['sys:questionnaire:update'])" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addParam(index)" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="choiceParam.length > 1 && hasPermission(['sys:questionnaire:update'])" icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delParam(index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-form>

    <div v-else-if="uiControl.dialogType === 'CHOICE'">
      <div v-for="(item, index) in selectedChoice" :key="index" style="margin-top: 15px; margin-left: 100px">
        <span class="param-label">{{ t('fields.choice') }}:</span><span class="param-label">{{ item.choice }}</span>
        <span class="param-label">{{ t('fields.needSpecify') }}:</span>
        <el-tag style="margin-left: 5px;" v-if="item.needSpecify" type="success">{{ t('fields.yes') }}</el-tag>
        <el-tag style="margin-left: 5px;" v-else type="danger">{{ t('fields.no') }}</el-tag>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { hasRole, hasPermission } from "@/utils/util";
import { getSiteListSimple } from "@/api/site";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import {
  getQuestionnaire, getQuestionnaireChoice, createQuestionnaire,
  updateQuestionnaire, updateQuestionnaireStatus, deleteQuestionnaire
} from "@/api/questionnaire";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const formRef = ref(null);
const choiceParam = ref([]);
const selectedId = ref(null);
const selectedChoice = ref([])
let chooseQuestionnaire = []

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
});

const request = reactive({
  size: 20,
  current: 1,
  siteId: null
});

const sites = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const form = reactive({
  siteId: null,
  sequence: null,
  question: null,
  isMultiple: false,
  choice: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  question: [required(t('message.validateQuestionRequired'))],
  choice: [required(t('message.validateChoiceRequired'))]
});

function addParam(index) {
  if (index === -1) {
    choiceParam.value.push({
      choice: null,
      needSpecify: false
    })
  } else {
    choiceParam.value.splice(index + 1, 0, {
      choice: null,
      needSpecify: false
    })
  }
}

function delParam(index) {
  choiceParam.value.splice(index, 1);
}

function constructParam() {
  const json = [];
  Object.values(choiceParam.value).forEach((item) => {
    if (item) {
      json.push(item);
    }
  });
  return JSON.stringify(json);
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

function handleSelectionChange(val) {
  chooseQuestionnaire = val
  if (chooseQuestionnaire.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseQuestionnaire.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadQuestionnaire() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getQuestionnaire(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function showDialog(type) {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  choiceParam.value = [];
  if (type === "CREATE") {
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.addQuestionnaire');
    addParam(-1)
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editQuestionnaire');
  } else if (type === "CHOICE") {
    uiControl.dialogTitle = t('fields.viewChoice');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(questionnaire) {
  debugger;
  showDialog('EDIT');
  nextTick(() => {
    for (const key in questionnaire) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = questionnaire[key];
      }

      if (key === 'choice') {
        const value = JSON.parse(questionnaire.choice)
        console.log(value)
        for (let i = 0; i < value.length; i++) {
          const json = {}
          Object.entries(value[i]).forEach(([k, v]) => {
            console.log(k)
            console.log(v)
            json[k] = v
          })
          choiceParam.value.push(json)
        }
      }
    }
    selectedId.value = questionnaire.id;
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
  const params = constructParam();
  form.choice = params;
  console.log(params)
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createQuestionnaire(form);
      uiControl.dialogVisible = false;
      await loadQuestionnaire();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  const params = constructParam();
  form.choice = params;
  formRef.value.validate(async valid => {
    if (valid) {
      await updateQuestionnaire(selectedId.value, form)
      uiControl.dialogVisible = false
      await loadQuestionnaire()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function viewChoices(id) {
  showDialog('CHOICE')
  const { data: ret } = await getQuestionnaireChoice(id);
  selectedChoice.value = ret
}

async function removeQuestionnaire(questionnaire) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (questionnaire) {
      await deleteQuestionnaire([questionnaire.id])
    } else {
      await deleteQuestionnaire(chooseQuestionnaire.map(q => q.id))
    }
    await loadQuestionnaire()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changeQuestionnaireStatus(id, status) {
  await updateQuestionnaireStatus(id, status)
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
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

.param-label {
  display: inline-block;
  width: 100px;
  margin-top: 5px;
  margin-left: 5px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}

.param-input {
  width: 170px;
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
