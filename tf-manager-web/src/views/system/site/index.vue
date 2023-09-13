<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input v-model="siteRequest.siteName" size="small" style="width: 200px;" :placeholder="t('fields.siteName')" />
        <el-input v-model="siteRequest.siteCode" size="small" style="width: 200px;margin-left: 20px" :placeholder="t('fields.siteCode')" />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadSites">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="siteFormRef" :model="siteForm" :rules="siteFormRules" :inline="true" size="small" label-width="150px" v-if="uiControl.dialogType === 'CREATESITE' || uiControl.dialogType === 'EDITSITE'">
        <el-form-item :label="t('fields.siteName')" prop="siteName">
          <el-input v-model="siteForm.siteName" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.siteCode')" prop="siteCode">
          <el-input v-model="siteForm.siteCode" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.parentSite')" prop="parentId">
          <el-select
            v-model="siteForm.parentId"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            clearable
            @focus="loadSiteNamesNoParenId"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.parentId"
              :label="item.parentName"
              :value="item.parentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.currency')" prop="currency">
          <el-select
            filterable
            clearable
            multiple
            v-model="selected.currencies"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            @focus="loadCurrencyNames"
            @change="handleChangeCurrency()"
          >
            <el-option
              v-for="item in currencies.list"
              :key="item.currencyCode"
              :label="item.currencyCode"
              :value="item.currencyCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input v-model="siteForm.remark" type="textarea" style="width: 350px;" :rows="5" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form ref="domainFormRef" :model="domainForm" :rules="domainFormRules" :inline="true" size="small" label-width="150px" v-if="uiControl.dialogType === 'CREATEDOMAIN'">
        <el-form-item :label="t('fields.siteName')" prop="siteId">
          <el-select
            disabled
            v-model="domainForm.siteId"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadSiteNames"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.domain')" prop="domain">
          <el-input v-model="domainForm.domain" type="textarea" style="width: 350px;" :rows="5" :placeholder="t('message.useCommaToSeparateDomain')" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="18">
        <el-card shadow="never">
          <div class="card-header">
            <span>{{ t('fields.siteList') }}</span>
            <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATESITE')">
              {{ t('fields.add') }}
            </el-button>
          </div>
          <el-divider />
          <div>
            <el-table :data="list" v-loading="sitePage.loading" ref="treeTable" row-key="id" size="small"
                      highlight-current-row lazy @current-change="handleCurrentChange"
                      :key="tableKey" :load="loadSearch"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :empty-text="t('fields.noData')"
            >
              <el-table-column prop="siteName" :label="t('fields.siteName')" width="150" />
              <el-table-column prop="siteCode" :label="t('fields.siteCode')" width="150" />
              <el-table-column prop="domainCount" :label="t('fields.domainCount')" width="150" />
              <el-table-column prop="subsiteCount" :label="t('fields.subSiteCount')" width="150" />
              <el-table-column prop="currency" :label="t('fields.currency')" width="150" />
              <el-table-column prop="createTime" :label="t('fields.createTime')" width="150" />
              <el-table-column :label="t('fields.operate')" align="right" fixed="right">
                <template #default="scope">
                  <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-header">
            <!-- <span>{{ t('fields.domainList') }}</span>
            <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATEDOMAIN')" :disabled="!currentsiteFormRow">
              {{ t('fields.add') }}
            </el-button> -->
            <span>{{ t('fields.menuGame') }}</span>
            <el-button icon="el-icon-check" size="mini" type="success" @click="saveMenu" :disabled="!currentsiteFormRow">
              {{ t('fields.save') }}
            </el-button>
          </div>
          <el-divider />
          <div>
            <!--<el-table :data="domainPage.records" v-loading="domainPage.loading" ref="table" row-key="id" size="small" highlight-current-row>
              <el-table-column :label="t('fields.domain')">
                <template #default="scope">
                  <el-form :ref="'domainForm' + scope.row.id" :model="scope.row">
                    <el-form-item prop="domain" :rules="domainFormRules.domain">
                      <el-input :ref="'domainRef' + scope.row.id" v-model="scope.row.domain" style="width: 150px" v-if="uiControl.editable === scope.row.id" placeholder="e.g:abc.com" />
                    </el-form-item>
                  </el-form>
                  <span v-if="uiControl.editable !== scope.row.id"> {{ scope.row.domain }} </span>
                </template>
              </el-table-column>
              <el-table-column :label="t('fields.operate')" align="right">
                <template #default="scope">
                  <el-button v-if="uiControl.editable === scope.row.id" type="primary" @click="editDomainFunc(scope.row)">{{ t('fields.confirm') }}</el-button>
                  <el-button v-else icon="el-icon-edit" size="mini" type="success" @click="changeEditable(scope.row, $refs)" />
                </template>
              </el-table-column>
            </el-table> -->
            <el-row>
              <el-col :span="10" class="list-col">
                <div>
                  <span>{{ t('fields.gameType') }}</span>
                  <draggable class="list-group" v-model="gameType.list" group="my-group" @change="log">
                    <template #item="{element}">
                      <div class="list-group-item" style="background-color: #e6a23c">{{ element }}</div>
                    </template>
                  </draggable>
                </div>
              </el-col>
              <el-col :span="10" class="list-col">
                <div>
                  <span>{{ t('fields.assigned') }}</span>
                  <draggable class="list-group" v-model="gameType.assigned" group="my-group" @change="log">
                    <template #item="{element}">
                      <div class="list-group-item" style="background-color: #67c23a">{{ element }}</div>
                    </template>
                  </draggable>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import draggable from "vuedraggable";
import { required, size, isAlphaNumericUnderscore, isValidDomainURL } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { createSite, getSites, updateSite, getSiteListSimple, getSiteListSimpleNoParenId, updateSiteMenu } from "../../../api/site";
import {
  createDomain,
  getDomains,
  // updateDomain
} from "../../../api/domain";
import { getCurrencyNames } from "../../../api/currency";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const gameType = reactive({
  default: ["Slots", "Live Casino", "Fishing", "Sports", "E-sports", "Poker", "Lottery", "Casual"],
  list: [],
  assigned: []
})
const siteFormRef = ref(null);
const domainFormRef = ref(null);
const currentsiteFormRow = ref(null);
const treeTable = ref(null);
const tableKey = ref(Math.random());
const selected = reactive({ currencies: [] });
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "",
  editable: ""
});
const list = reactive([]);
const sitePage = reactive({
  loading: false,
  currentRow: []
});
const domainPage = reactive({
  records: [],
  loading: false
});
const siteRequest = reactive({
  size: 30,
  current: 1,
  siteName: null,
  siteCode: null,
  parentId: null
});
const siteForm = reactive({
  id: null,
  siteName: null,
  siteCode: null,
  parentId: null,
  currency: [],
  remark: null
});
const domainForm = reactive({
  id: null,
  siteId: null,
  domain: null
});
const sites = reactive({
  list: [],
})
const currencies = reactive({
  list: [],
})
const validateAlphaNumericUnderscore = (rule, value, callback) => {
  if (!isAlphaNumericUnderscore(value)) {
    callback(new Error(t('message.validateAlphaNumericOnly')));
  } else {
    callback();
  }
};
const siteFormRules = reactive({
  siteName: [required(t('message.validateSiteRequired')), size(6, 50, t('message.validateAtLeastSixChar'))],
  siteCode: [required(t('message.validateSiteCodeRequired')), size(3, 3, t('message.validateOnlyThreeChar')), { validator: validateAlphaNumericUnderscore, trigger: "blur" }],
  currency: [required(t('message.validateCurrencyRequired'))]
});
const validateDomain = (rule, value, callback) => {
  if (!isValidDomainURL(value)) {
    callback(new Error(t('message.validateUrlFormat')));
  } else {
    callback();
  }
};
const domainFormRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  domain: [required(t('message.validateDomainRequired')), { validator: validateDomain, trigger: "blur" }]
});
const handleCurrentChange = (currentRow) => {
  currentsiteFormRow.value = currentRow;
  // loadDomains(currentsiteFormRow.value.id);
  gameType.list = gameType.default;
  gameType.assigned = JSON.parse(list.find(x => x.id === currentsiteFormRow.value.id).param);
  gameType.list = gameType.list.filter(gt => !gameType.assigned.includes(gt));
}

function log(evt) {
  console.log(evt);
}

function resetQuery() {
  siteRequest.siteName = null;
  siteRequest.siteCode = null;
}

async function loadSites() {
  sitePage.loading = true;
  currentsiteFormRow.value = null;
  gameType.list = [];
  gameType.assigned = [];
  siteRequest.parentId = null;
  const requestCopy = { ...siteRequest };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getSites(query);
  list.length = 0;
  list.push(...ret);
  tableKey.value = Math.random();
  sitePage.loading = false;
}

async function loadSearch(tree, treeNode, resolve) {
  siteRequest.parentId = tree.id;
  const { data: children } = await getSites(siteRequest);
  resolve(children);
}

async function loadDomains(id) {
  domainPage.loading = true;
  const { data: ret } = await getDomains(id);
  domainPage.records = ret;
  domainPage.loading = false;
}

async function loadSiteNames() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadSiteNamesNoParenId() {
  const { data: ret } = await getSiteListSimpleNoParenId()
  sites.list = ret
}

async function loadCurrencyNames() {
  const { data: ret } = await getCurrencyNames();
  currencies.list = ret;
}

function handleChangeCurrency() {
  siteForm.currency = selected.currencies.join(",");
}

function showDialog(type) {
  if (type === "CREATESITE") {
    if (siteFormRef.value) {
      siteFormRef.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.addSite');
    siteForm.id = null
    selected.currencies = []
  } else if (type === "EDITSITE") {
    uiControl.dialogTitle = t('fields.editSite');
    selected.currencies = [];
  } else if (type === "CREATEDOMAIN") {
    if (domainFormRef.value) {
      domainFormRef.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.addDomain');
    domainForm.id = null
    domainForm.domain = null
    domainForm.siteId = currentsiteFormRow.value.id
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(site) {
  showDialog("EDITSITE");
  nextTick(() => {
    for (const key in site) {
      if (Object.keys(siteForm).find(k => k === key)) {
        siteForm[key] = site[key];
      }
    }
    if (siteForm.currency !== null) {
      const arr = siteForm.currency.split(",")
      arr.forEach(element => {
        selected.currencies.push(element);
      })
    }
  });
}

// function changeEditable(domainRow, ref) {
//   this.uiControl.editable = domainRow.id;
//   nextTick(() => {
//     for (const key in domainRow) {
//       if (Object.keys(domainForm).find(k => k === key)) {
//         domainForm[key] = domainRow[key];
//       }
//     }
//     ref[`domainRef${domainRow.id}`].focus()
//   });
// }

function createSiteFunc() {
  siteFormRef.value.validate(async (valid) => {
    if (valid) {
      await createSite(siteForm);
      uiControl.dialogVisible = false;
      await loadSites();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function editSiteFunc() {
  siteFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateSite(siteForm);
      uiControl.dialogVisible = false;
      await loadSites();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function createDomainFunc() {
  domainFormRef.value.validate(async (valid) => {
    if (valid) {
      await createDomain(domainForm);
      uiControl.dialogVisible = false;
      await loadDomains(currentsiteFormRow.value.id);
      ElMessage({ message: t('message.addSuccess'), type: "success" });
      await loadSites();
    }
  });
}

// async function editDomainFunc(domainRow) {
//   if (domainRow.domain !== "" && isValidDomainURL(domainRow.domain)) {
//     this.uiControl.editable = "";
//     await updateDomain(domainRow.id, domainRow.domain);
//     await loadDomains(currentsiteFormRow.value.id);
//     ElMessage({ message: t('message.editSuccess'), type: "success" });
//   }
// }

function submit() {
  if (uiControl.dialogType === "CREATESITE") {
    createSiteFunc();
  } else if (uiControl.dialogType === "EDITSITE") {
    editSiteFunc();
  } else if (uiControl.dialogType === "CREATEDOMAIN") {
    createDomainFunc();
  }
}

async function saveMenu() {
  const param = gameType.assigned === null || gameType.assigned === undefined ? [] : JSON.stringify(gameType.assigned);
  await updateSiteMenu(currentsiteFormRow.value.id, param);
  await loadSites();
  ElMessage({ message: t('message.updateSuccess'), type: "success" });
}

onMounted(() => {
  loadSites();
  loadSiteNames();
  loadSiteNamesNoParenId();
  loadCurrencyNames();
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-col {
  text-align: center;
  margin-left: 20px;
}

.list-group {
  padding: 15px;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
  min-height: 20px;
  font-size: 12px;
}

.list-group-item {
  margin-bottom: 5px;
  text-align: center;
  position: relative;
  cursor: move;
  display: block;
  padding: 0.75rem 1.25rem;
  color: #fff;
  border: 1px solid;
  border-radius: 0.25rem;
}
</style>
