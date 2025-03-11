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
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body :width="uiControl.dialogType === 'CREATESITE' ? '880px' : '580px'">
      <div v-if="uiControl.dialogType === 'CREATESITE' || uiControl.dialogType === 'EDITSITE'">
        <el-steps
          class="steps"
          :space="200"
          :active="active"
          finish-status="success"
          align-center
        >
          <el-step :title="t('fields.siteInfo')" />
          <el-step :title="t('fields.siteDetail')" />
          <el-step v-if="uiControl.dialogType === 'CREATESITE'" :title="t('fields.menuGame')" />
          <el-step v-if="uiControl.dialogType === 'CREATESITE'" :title="t('fields.permissionAssignment')" />
        </el-steps>
        <div v-if="active === 0">
          <el-form ref="siteFormRef" :model="siteForm" :rules="siteFormRules" :inline="true" size="small" :label-width="uiControl.dialogType === 'CREATESITE' ? '250px' : '150px'">
            <el-form-item :label="t('fields.siteName')" prop="siteName">
              <el-input v-model="siteForm.siteName" style="width: 350px;" />
            </el-form-item>
            <el-form-item :label="t('fields.siteCode')" prop="siteCode">
              <el-input v-model="siteForm.siteCode" style="width: 350px;" />
            </el-form-item>
            <div class="dialog-footer">
              <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
              <el-button type="primary" @click="next">
                {{ t('fields.nextStep') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <div v-else-if="active === 1">
          <el-form ref="siteFormRef" :model="siteForm" :rules="siteFormRules" :inline="true" size="small" :label-width="uiControl.dialogType === 'CREATESITE' ? '250px' : '150px'">
            <!-- <el-form-item :label="t('fields.parentSite')" prop="parentId">
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
            </el-form-item> -->
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
            <el-form-item :label="t('fields.timeZone')" prop="timeZone">
              <el-select
                filterable
                clearable
                v-model="siteForm.timeZone"
                :placeholder="t('fields.pleaseChoose')"
                style="width: 350px"
              >
                <el-option
                  v-for="item in timeZone.list"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <div class="dialog-footer">
              <el-button @click="active = 0">{{ t('fields.back') }}</el-button>
              <el-button v-if="uiControl.dialogType === 'CREATESITE'" type="primary" @click="next">
                {{ t('fields.nextStep') }}
              </el-button>
              <el-button v-else-if="uiControl.dialogType === 'EDITSITE'" type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
            </div>
          </el-form>
        </div>
        <div v-else-if="uiControl.dialogType === 'CREATESITE' && active === 2">
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
          <div class="dialog-footer">
            <el-button @click="active = 1">{{ t('fields.back') }}</el-button>
            <el-button type="primary" @click="next">
              {{ t('fields.nextStep') }}
            </el-button>
          </div>
        </div>
        <div v-else-if="uiControl.dialogType === 'CREATESITE' && active === 3">
          <el-card style="margin-top: 20px; margin-bottom: 20px">
            <el-tree
              ref="tree"
              show-checkbox
              accordion
              node-key="id"
              :data="menus.list"
              highlight-current
            >
              <!-- eslint-disable -->
              <template #default="{node, data}">
                <div>
                  <span>{{ data.name }}</span>
                  <span v-if="data.remark" class="tree-node">{{ data.remark }}</span>
                </div>
              </template>
            </el-tree>
          </el-card>
          <div class="dialog-footer">
            <el-button @click="active = 2">{{ t('fields.back') }}</el-button>
            <el-button type="primary" @click="submit" :loading="uiControl.createLoading">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </div>
      </div>
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
      <el-card v-if="uiControl.dialogType === 'ASSIGN_GAME_TYPE'">
        <div>
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
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
            <el-button icon="el-icon-check" type="primary" @click="saveMenu" :loading="uiControl.gameTypeLoading">
              {{ t('fields.save') }}
            </el-button>
          </div>
        </div>
      </el-card>
    </el-dialog>
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
                  highlight-current-row lazy
                  :key="tableKey" :load="loadSearch"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  :empty-text="t('fields.noData')"
        >
          <el-table-column prop="siteName" :label="t('fields.siteName')" width="150" />
          <el-table-column prop="siteCode" :label="t('fields.siteCode')" width="150" />
          <!-- <el-table-column prop="domainCount" :label="t('fields.domainCount')" width="150" /> -->
          <!-- <el-table-column prop="subsiteCount" :label="t('fields.subSiteCount')" width="150" /> -->
          <el-table-column prop="currency" :label="t('fields.currency')" min-width="280" />
          <el-table-column prop="createTime" :label="t('fields.createTime')" width="180">
            <template #default="scope">
              <span v-formatter="{data: scope.row.createTime, type: 'date', timeZone: scope.row.timeZone}" />
            </template>
          </el-table-column>
          <el-table-column prop="timeZone" :label="t('fields.timeZone')" width="150" />
          <el-table-column prop="status" :label="t('fields.state')" width="80">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changestatus(scope.row.id, scope.row.status)"
              />
            </template>
          </el-table-column>
          <el-table-column :label="t('fields.operate')" align="right" fixed="right" min-width="200">
            <template #default="scope">
              <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)" />
              <el-button size="mini" type="warning" @click="showMenuGame(scope.row)">{{ t('fields.menuGame') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref, watch } from "vue";
import draggable from "vuedraggable";
import { required, size, isAlphaNumericUnderscore, isValidDomainURL } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { createSiteSteps, getSites, updateSite, getSiteListSimple, getSiteListSimpleNoParenId, updateSiteMenu, updateSiteState } from "../../../api/site";
import {
  createDomain,
  getDomains,
  // updateDomain
} from "../../../api/domain";
import { getCurrencyNames } from "../../../api/currency";
import { useI18n } from "vue-i18n";
import { getTimeZoneList } from "../../../utils/datetime";
import { fetchSimpleMenu, fetchAllSitesMenu } from "../../../api/menus";
import { UserActionTypes } from "../../../store/modules/user/action-types";
import { useStore } from "../../../store";

const { t } = useI18n();
const store = useStore()
const gameType = reactive({
  default: ["Slots", "Live Casino", "Fishing", "Sports", "E-sports", "Poker", "Lottery", "Casual"],
  list: [],
  assigned: []
})
const siteFormRef = ref(null);
const domainFormRef = ref(null);
const currentsiteFormRow = ref(null);
const treeTable = ref(null);
const active = ref(0)
const tree = ref(null)
const tableKey = ref(Math.random());
const selected = reactive({ currencies: [] });
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "",
  editable: "",
  gameTypeLoading: false,
  createLoading: false
});
const list = reactive([]);
const menus = reactive({
  list: [],
  allSiteList: []
})
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
  remark: null,
  timeZone: '+08:00'
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
const timeZone = reactive({
  list: []
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
  currency: [required(t('message.validateCurrencyRequired'))],
  timeZone: [required(t('message.validateTimeZoneRequired'))]
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
// const handleCurrentChange = (currentRow) => {
//   currentsiteFormRow.value = currentRow;
//   // loadDomains(currentsiteFormRow.value.id);
//   gameType.list = gameType.default;
//   gameType.assigned = JSON.parse(list.find(x => x.id === currentsiteFormRow.value.id).param);
//   if (gameType.assigned !== null) {
//     gameType.list = gameType.list.filter(gt => !gameType.assigned.includes(gt));
//   } else {
//     gameType.assigned = []
//   }
// }

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
    active.value = 0;
    if (siteFormRef.value) {
      siteFormRef.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.addSite');
    uiControl.createLoading = false;
    siteForm.id = null
    siteForm.siteName = null
    siteForm.siteCode = null
    siteForm.currency = []
    siteForm.remark = null
    selected.currencies = []
    gameType.list = gameType.default
  } else if (type === "EDITSITE") {
    active.value = 0;
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
  } else if (type === "ASSIGN_GAME_TYPE") {
    uiControl.dialogTitle = t('fields.menuGame')
    uiControl.gameTypeLoading = false;
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
    if (siteForm.timeZone !== null) {

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

async function createSiteFunc() {
  uiControl.createLoading = true;
  const param = gameType.assigned === null || gameType.assigned === undefined ? [] : JSON.stringify(gameType.assigned);
  const selectedMenus = tree.value.getCheckedNodes(false, true).map(c => c.id).join(",")
  const form = { ...siteForm };
  form.param = param
  form.menuIds = selectedMenus
  await createSiteSteps(form);
  uiControl.dialogVisible = false;
  uiControl.createLoading = false;
  await store.dispatch(UserActionTypes.ACTION_GET_USER_INFO, undefined);
  await loadSites();
  ElMessage({ message: t('message.addSuccess'), type: "success" });
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
  uiControl.gameTypeLoading = true;
  const param = gameType.assigned === null || gameType.assigned === undefined ? [] : JSON.stringify(gameType.assigned);
  await updateSiteMenu(currentsiteFormRow.value.id, param);
  uiControl.dialogVisible = false;
  uiControl.gameTypeLoading = false;
  await loadSites();
  ElMessage({ message: t('message.updateSuccess'), type: "success" });
}

function showMenuGame(row) {
  currentsiteFormRow.value = row;
  gameType.list = gameType.default;
  gameType.assigned = JSON.parse(list.find(x => x.id === currentsiteFormRow.value.id).param);
  if (gameType.assigned !== null) {
    gameType.list = gameType.list.filter(gt => !gameType.assigned.includes(gt));
  } else {
    gameType.assigned = []
  }
  showDialog("ASSIGN_GAME_TYPE")
}

function getTimeZone() {
  timeZone.list = getTimeZoneList()
}

function next() {
  if (active.value < 2) {
    siteFormRef.value.validate(async valid => {
      if (valid) {
        active.value = active.value + 1;
      }
    })
  } else {
    active.value = active.value + 1;
  }
}

async function loadSiteMenu() {
  const { data: children } = await fetchSimpleMenu(0)
  menus.list = children
  const { data: allSitesMenu } = await fetchAllSitesMenu()
  menus.allSiteList = allSitesMenu
}

async function changestatus(id, state) {
  await updateSiteState(id, state);

  // 更新 store 中的 sites 數據
  const updatedSites = store.state.user.sites.map(site => {
    if (site.id === id) {
      return { ...site, status: state };
    }
    return site;
  });

  // 更新 store
  store.commit('SET_LOGIN_USER', {
    ...store.state.user,
    sites: updatedSites
  });

  ElMessage({ message: t('message.editSuccess'), type: "success" });
}

watch(
  () => tree.value,
  async () => {
    tree.value.setCheckedKeys([], false)
    menus.allSiteList.forEach(e => {
      const node = tree.value.getNode(e)
      if (node) {
        tree.value.setChecked(e, true)
      }
    })
  }
)

onMounted(() => {
  getTimeZone();
  loadSites();
  loadSiteNames();
  loadSiteNamesNoParenId();
  loadCurrencyNames();
  loadSiteMenu();
  gameType.list = gameType.default;
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

.steps {
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: center;
}

.tree-node {
  position: absolute;
  right: 50px
}
</style>
