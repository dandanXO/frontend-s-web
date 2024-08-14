<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input v-model="request.name" size="small" style="width: 200px;margin-left:20px" :placeholder="t('fields.name')" />
        <el-input v-model="request.type" size="small" style="width: 200px;margin-left:20px" :placeholder="t('fields.type')" />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadSystemValueRules">
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
          v-permission="['sys:value-rules:add']"
          @click="showDialog('CREATE')"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          @click="showEdit()"
          v-permission="['sys:value-rules:update']"
          :disabled="uiControl.editBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:value-rules:del']"
          @click="removeValueRules()"
          :disabled="uiControl.removeBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="700px"
    >
      <el-form
        ref="rulesForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <!-- <el-form-item :label="t('fields.site')" prop="siteId">
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
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            v-model="form.type"
            size="small"
            :placeholder="t('fields.type')"
            class="filter-item"
            style="margin-left: 5px; width: 120px;"
            @change="handleValueTypeChange"
          >
            <el-option
              v-for="item in uiControl.valueType"
              :key="item.key"
              :label="t('valueRulesType.'+item.label)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        {{ uiControl.showParamFormat }}
        <el-form-item :label="t('fields.param')" prop="value">
          <el-switch
            v-if="form.type !== null && form.type !== 'INPUT' && form.type !== 'SWITCH'"
            v-model="switchType"
            class="mb-2"
            inactive-text="Key Value"
            active-text="Json"
            @change="handleValueTypeChange"
          />
          <div v-if="uiControl.showParamFormat === 'key-value'">
            <div v-for="(item, index) in param" :key="index">
              <el-input
                style="width: 170px; margin-top: 5px;"
                v-model="item.key"
                placeholder="标签文本"
              />
              :
              <el-input style="width: 170px " v-model="item.value" placeholder="系统值" />

              <el-button
                v-if="index === param.length - 1"
                icon="el-icon-plus"
                size="mini"
                type="primary"
                style="margin-left: 20px"
                @click="addParam()"
                plain
              >
                {{ t('fields.add') }}
              </el-button>
              <el-button
                v-else
                icon="el-icon-remove"
                size="mini"
                type="danger"
                style="margin-left: 20px"
                @click="delParam(index)"
                plain
              >
                {{ t('fields.delete') }}
              </el-button>
            </div>
          </div>
          <div v-else-if="uiControl.showParamFormat === 'json'">
            <el-input
              v-model="form.value"
              style="width: 350px"
              type="textarea"
            />
          </div>
          <div v-else>
            <el-input v-if="form.type === 'INPUT'" v-model="form.value" style="width: 350px" />
            <div v-else-if="form.type === 'SWITCH'">
              <el-input
                style="width: 170px; margin-top: 5px;"
                v-model="switchInactiveText"
                placeholder="关闭标签文本"
              />
              :
              <el-input style="width: 170px " v-model="switchActiveText" placeholder="开启标签文本" />
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="describes">
          <el-input
            v-model="form.describes"
            style="width: 350px"
            type="textarea"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submit">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="type" :label="t('fields.type')" width="200">
        <template #default="scope">
          <span>{{ t('valueRulesType.'+scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" :label="t('fields.value')" width="250">
        <template #default="scope">
          <div v-if="scope.row.type === 'RADIO'">
            <el-radio-group size="small" style="width: 300px">
              <el-radio-button :value-key="rule.value" v-for="rule in JSON.parse(scope.row.value)" :label="rule.value" :key="rule.key">{{ rule.label }}</el-radio-button>
            </el-radio-group>
          </div>
          <div v-else-if="scope.row.type === 'SWITCH'">
            <el-switch
              v-model="empty"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              size="small"
              :active-text="switchText(scope.row.value, 'ACTIVE')"
              :inactive-text="switchText(scope.row.value, 'INACTIVE')"
            />
          </div>
          <div v-else-if="scope.row.type === 'SELECT'">
            <el-select
              v-model="empty1"
              size="small"
              :placeholder="t('fields.status')"
              class="filter-item"
              style="width: 200px;margin-left: 5px"
            >
              <el-option
                v-for="rule in JSON.parse(scope.row.value)"
                :key="rule.key"
                :label="rule.label"
                :value="rule.value"
              />
            </el-select>
          </div>
          <div v-else-if="scope.row.type === 'CHECKBOX'">
            <el-checkbox-group v-model="empty1" size="small">
              <el-checkbox v-for="rule in JSON.parse(scope.row.value)" :label="rule.label" :key="rule.key" />
            </el-checkbox-group>
          </div>
          <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="describes" :label="t('fields.remark')" width="200" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" align="center" min-width="120">
        <template #default="scope">
          <span v-if="scope.row.updateBy === null">-</span>
          <span v-else>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" align="center" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="
          !hasRole(['SUB_TENANT']) &&
            (hasPermission(['sys:value-rules:update']) ||
              hasPermission(['sys:value-rules:del']))
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:value-rules:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:value-rules:del']"
            @click="removeValueRules(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" @current-change="changePage" layout="prev, pager, next" :page-size="request.size" :page-count="page.pages" :current-page="request.current" />
  </div>
</template>
<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { getValueRulesRecords, deleteValueRules, createValueRules, updateValueRules } from "../../../api/value-rules";
import { required } from '../../../utils/validate'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { hasRole, hasPermission } from '../../../utils/util'
const { t } = useI18n()
const rulesForm = ref(null)
const param = ref([])
const switchType = ref(false)
const switchActiveText = ref(null)
const switchInactiveText = ref(null)

const empty = ref(null)
const empty1 = reactive({})
const request = reactive({
  size: 30,
  current: 1,
  name: null,
  type: null,
})

const form = reactive({
  id: null,
  name: null,
  type: null,
  value: null,
  describes: null,
})

const formRules = reactive({
  name: [required(t('message.validateJobNameRequired'))],
  type: [required(t('message.validateStateRequired'))],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
  editBtn: true,
  removeBtn: true,
  showParamFormat: 'input',
  valueType: [
    { key: 1, label: "INPUT", value: "INPUT" },
    { key: 2, label: "RADIO", value: "RADIO" },
    { key: 3, label: "SELECT", value: "SELECT" },
    { key: 4, label: "SWITCH", value: "SWITCH" },
    { key: 5, label: "CHECKBOX", value: "CHECKBOX" }
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

function resetQuery() {
  request.name = null
  request.type = null
}

let chooseRules = []

async function loadSystemValueRules() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getValueRulesRecords(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  request.current = page
  loadSystemValueRules()
}

function handleSelectionChange(val) {
  chooseRules = val
  if (chooseRules.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseRules.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function removeValueRules(rule) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (rule) {
      await deleteValueRules([rule.id])
    } else {
      await deleteValueRules(chooseRules.map(a => a.id))
    }
    await loadSystemValueRules()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (rulesForm.value) {
      rulesForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addSystemValueRules')
    form.type = "INPUT"
    form.value = ""
    uiControl.showParamFormat = 'input'
    param.value = []
    addParam()
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editSystemValueRules')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(rule) {
  showDialog('EDIT')
  if (!rule) {
    rule = chooseRules[0]
  }
  nextTick(() => {
    for (const key in rule) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = rule[key]
      }
    }

    param.value = []
    if (form.value) {
      if (form.type === "SWITCH") {
        const valueArr = form.value.split(",");
        switchInactiveText.value = valueArr[0]
        switchActiveText.value = valueArr[1]
      } else if (form.type === "SELECT" || form.type === "RADIO" || form.type === "CHECKBOX") {
        const jsonArray = JSON.parse(form.value);
        jsonArray.forEach((item) => {
          const json = {};
          json.key = item.label;
          json.value = item.value;
          param.value.push(json);
        }
        )
        addParam()
        form.value = JSON.stringify(
          JSON.parse(form.value),
          undefined,
          2
        )
      }
    }
    handleValueTypeChange()
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function create() {
  rulesForm.value.validate(async valid => {
    if (valid) {
      if (uiControl.showParamFormat === 'key-value') {
        form.value = constructParam()
      } else if (uiControl.showParamFormat === 'json') {
        form.value = JSON.stringify(
          JSON.parse(form.value)
        )
      }
      const rulesFormCopy = { ...form }
      // delete rulesFormCopy.
      await createValueRules(rulesFormCopy)
      uiControl.dialogVisible = false
      await loadSystemValueRules()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  rulesForm.value.validate(async valid => {
    if (valid) {
      if (uiControl.showParamFormat === 'key-value') {
        form.value = constructParam()
      } else if (uiControl.showParamFormat === 'json') {
        form.value = JSON.stringify(
          JSON.parse(form.value)
        )
      }
      if (form.type === 'SWITCH') {
        form.value = switchInactiveText.value + "," + switchActiveText.value + ","
      }
      const rulesFormCopy = { ...form }
      delete rulesFormCopy.jsonParams
      await updateValueRules(rulesFormCopy)
      uiControl.dialogVisible = false
      await loadSystemValueRules()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function addParam() {
  param.value.push({
    key: '',
    value: '',
  })
}

function delParam(index) {
  param.value.splice(index, 1)
}

function constructParam() {
  const json = []
  let count = 1
  Object.values(param.value).forEach(item => {
    if (item.key) {
      const jsonObj = {}
      jsonObj.key = count
      jsonObj.label = item.key.trim()
      jsonObj.value = item.value.trim()

      json.push(jsonObj)
      count++
    }
  })
  return JSON.stringify(json)
}

function handleValueTypeChange() {
  if (form.type !== "INPUT" && form.type !== "SWITCH" && !switchType.value) {
    uiControl.showParamFormat = 'key-value'
    param.value = []
    addParam()
  } else if (form.type !== "INPUT" && form.type !== "SWITCH" && switchType.value) {
    uiControl.showParamFormat = 'json'
  } else {
    uiControl.showParamFormat = 'input'
  }
}

function switchText(val, type) {
  const valueArr = val.split(",");
  if (type === "INACTIVE") {
    return valueArr[0];
  } else {
    return valueArr[1];
  }
}

onMounted(() => {
  loadSystemValueRules()
})

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
