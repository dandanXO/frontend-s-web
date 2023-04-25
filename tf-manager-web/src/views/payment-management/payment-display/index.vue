<template>
  <div>
    <el-drawer
      title="Switch Payment"
      v-model="uiControl.searchDialogVisible"
      direction="rtl"
      size="40%"
    >
      <el-card class="search-card">
        <div class="clearfix">
          <span>{{ t('fields.way') }}</span>
        </div>
        <el-switch
          v-model="searchCondition.way"
          active-text="WEB"
          active-value="WEB"
          active-color="#13ce66"
          inactive-text="MOBILE"
          inactive-color="rgb(13 79 229)"
          inactive-value="MOBILE"
        />
      </el-card>
      <el-card class="search-card">
        <div class="clearfix">
          <span>{{ t('fields.site') }}</span>
        </div>
        <el-radio-group
          v-model="searchCondition.siteId"
          @change="handleSiteNameCheckedChange"
        >
          <el-radio v-for="c in page.sites" :label="c.id" :key="c.id">
            {{ c.siteName }}
          </el-radio>
        </el-radio-group>
      </el-card>
      <el-card class="search-card">
        <div class="clearfix">
          <span>{{ t('fields.financialLevel') }}</span>
        </div>
        <el-radio-group v-model="searchCondition.financialLevel">
          <el-radio v-for="c in page.financials" :label="c.level" :key="c.id">
            {{ c.name }}
          </el-radio>
        </el-radio-group>
      </el-card>
      <el-card class="search-card">
        <el-button
          type="primary"
          @click="loadPayments"
          :disabled="uiControl.dialogEditBtn"
        >
          {{ t('fields.switch') }}
        </el-button>
      </el-card>
    </el-drawer>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="1000px"
    >
      <div class="tag-group minusmargin">
        <span class="tag-group__title">{{ t('fields.selected') }}</span>
        <el-tag
          closable
          @close="handleRemoveNode(p)"
          :key="pindex"
          v-for="(p, pindex) in form.selectedPaymentNodes"
        >
          {{ p.name }}
        </el-tag>
      </div>
      <el-form :model="form" :inline="false" size="small" label-width="200px">
        <!-- <el-form-item :label="`${addNodeData.addNode.name} append to`" class="select-node-name">
          <el-select
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            v-model="addNodeData.selectValue"
            size="small"
            placeholder="Select Payment Append to"
            class="filter-item"
            style="width: 200px;margin-bottom: 16px"
          >
            <el-option
              v-for="item in addNodeData.parentNodes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <!-- <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="addNewNode" :disabled="uiControl.dialogEditBtn">{{ t('fields.add') }}</el-button>
        </div> -->
      </el-form>
      <el-input
        v-model="paymentNameFilter"
        size="small"
        style="width: 100%"
        :placeholder="t('message.multipleQuerySeparatedBySpace')"
        @input="paymentSearch()"
      />
      <el-table
        max-height="700px"
        style="margin-bottom: 20px;"
        :data="page.paymentRecords"
        v-loading="page.loading"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="paymentName"
          :label="t('fields.paymentName')"
          width="200"
        />
        <el-table-column
          prop="payType"
          :label="t('fields.payType')"
          width="200"
        />
        <el-table-column
          prop="currencyName"
          :label="t('fields.currencyName')"
          width="200"
        />
        <el-table-column :label="t('fields.operate')" align="right">
          <template #default="scope">
            <el-button
              size="mini"
              type="success"
              @click="selectNode(scope.row)"
            >
              {{ t('fields.select') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="addNewNode"
          :disabled="uiControl.dialogEditBtn"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </el-dialog>
    <div class="body-container">
      <el-card class="display-area" shadow="never">
        <template #header>
          <div class="card-header">
            <el-row type="flex" class="row-bg" align="center">
              <el-col :span="16">
                <span>{{ t('fields.paymentArea') }}</span>
              </el-col>
              <el-col :span="8" align="right">
                <el-button
                  type="success"
                  v-permission="['sys:payment:show:update']"
                  @click="updatePaymentShowBtn"
                >
                  {{ t('fields.update') }}
                </el-button>
                <el-button
                  type="primary"
                  @click="uiControl.searchDialogVisible = true"
                >
                  {{ t('fields.switch') }}
                </el-button>
              </el-col>
            </el-row>
            <el-tag-group>
              <span style="font-size: 12px; margin-right: 10px;">
                {{ t('fields.searchCondition') }}:
              </span>
              <el-tag>
                {{ t('fields.way') + ': ' + selectedCondition.way }}
              </el-tag>
              <el-tag>
                {{ t('fields.site') + ': ' + selectedCondition.siteName }}
              </el-tag>
              <el-tag>
                {{
                  t('fields.financialLevel') +
                    ': ' +
                    selectedCondition.financialLevel
                }}
              </el-tag>
            </el-tag-group>
          </div>
        </template>
        <div class="container">
          <Node
            :level="1"
            :list="page.paymentShowNodes"
            ref="paymentArea"
            @add-nodes-to-selected-group="addNodesToSelectedGroup"
          />
          <el-button
            v-show="page.paymentShowNodes.length === 0"
            class="add"
            icon="el-icon-plus"
            size="mini"
            type="primary"
            @click="addNewNodesToSelectedGroup()"
          />
        </div>
      </el-card>
    </div>

    <el-dialog
      v-model="uiControl.updateDialogVisible"
      :title="t('message.paymentUpdate')"
    >
      <div class="body-container">
        <span style="font-size: 12px; margin-right: 10px; margin-top:15px">
          {{ t('fields.copyToOtherLevel') }}:
        </span>
        <el-select
          multiple
          v-model="copy.selectedLevel"
          :placeholder="t('fields.financialLevel')"
          class="filter-item"
          style="width: 600px; margin-bottom: 16px"
          @change="isAllLocations"
        >
          <el-option
            v-for="item in copy.financials"
            :key="item.level"
            :label="item.name"
            :value="item.level"
          />
        </el-select>
      </div>

      <span style="font-size: 12px; margin-right: 10px;">
        {{ span.copyWay }}:
      </span>

      <el-checkbox v-model="copy.checked" />
      <div class="body-container">
        <el-button type="primary" @click="confirmUpdate">
          {{ t('fields.startUpdate') }}
        </el-button>

        <el-button type="info" @click="uiControl.updateDialogVisible = false">
          {{ t('fields.cancelUpdate') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { toRaw } from '@vue/reactivity'
import { notEmpty } from '../../../utils/common'
import Node from '@/components/paymentSelect/node'
import {
  getAllPayments,
  getPaymentShow,
  updatePaymentShow,
} from '../../../api/payment-display'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSiteListSimple } from '../../../api/site'
import { getFinancialLevels } from '../../../api/financial-level'
import bus from '../../../utils/bus'
import { useStore } from '../../../store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
  searchDialogVisible: false,
  updateDialogVisible: false,
})
const addNodeData = reactive({
  selectValue: '',
  addNode: {},
  parentNodes: [],
  root: { name: 'root', id: -1 },
})
const page = reactive({
  paymentRecords: [],
  originPaymentRecords: [],
  paymentShowNodes: [],
  loading: false,
  sites: [],
  financials: [],
})
const searchCondition = reactive({
  way: 'WEB',
  siteId: 1,
  financialLevel: 1,
})

const form = reactive({
  selectedGroup: '',
  selectedLevel: '',
  selectedPaymentNodes: [],
})

const copy = reactive({
  selectedLevel: [],
  financials: [],
  checked: false,
})

const span = reactive({
  copyWay: '',
})

const paymentArea = ref()
const paymentNameFilter = ref(null)
let newNodeId = 0

// function addNewNode() {
//   console.log(addNodeData)
//   if (addNodeData.selectValue === addNodeData.root.id) {
//     page.paymentShowNodes.push(addNodeData.addNode);
//   } else {
//     addNewNodes(page.paymentShowNodes);
//   }
//   uiControl.dialogVisible = false;
// }
function addNewNode() {
  if (!form.selectedGroup || form.selectedGroup === addNodeData.root.name) {
    page.paymentShowNodes = []
    Object.assign(page.paymentShowNodes, form.selectedPaymentNodes)
    uiControl.dialogVisible = false
  } else {
    runCode(page.paymentShowNodes)
  }
}
function runCode(arr) {
  for (let i = 0; i < form.selectedLevel + 1; i++) {
    if (form.selectedLevel === i) {
      arr.forEach(element => {
        if (form.selectedGroup === element.name) {
          Object.assign(element.children, form.selectedPaymentNodes)
          uiControl.dialogVisible = false
        } else {
          runCode(element.children)
        }
      })
    }
  }
  // arr.forEach(element => {
  //   if (form.selectedLevel === level && form.selectedGroup === element.name) {
  //     Object.assign(element.children, form.selectedPaymentNodes)
  //     uiControl.dialogVisible = false
  //   } else {
  //     level++
  //     runCode(element.children)
  //   }
  // });
}

const selectedCondition = reactive({
  way: 'WEB',
  site: page.sites,
  financialLevel: 1,
})

function getSelectedSearchCondition() {
  selectedCondition.way = searchCondition.way
  page.sites.forEach(element => {
    if (searchCondition.siteId === element.id) {
      selectedCondition.siteName = element.siteName
    }
  })
  page.financials.forEach(element => {
    if (searchCondition.financialLevel === element.level) {
      selectedCondition.financialLevel = element.name
    }
  })
}

// function addNewNodes(list) {
//   list.forEach(function (item, index) {
//     if (item.id === addNodeData.selectValue) {
//       item.children.push(addNodeData.addNode);
//       return true;
//     }
//     if (item.children) {
//       addNewNodes(item.children);
//     }
//   });
// }

// function showSelectAddNodePanel(value) {
//   addNodeData.addNode = { childId: value.id, id: --newNodeId, name: value.paymentName, icon: "", children: [] };
//   addNodeData.parentNodes.length = 0;
//   addNodeData.parentNodes.push(addNodeData.root);
//   addNodeData.selectValue = addNodeData.root.id;
//   addSelectOption(paymentArea.value.list);
//   uiControl.dialogVisible = true;
// }
function selectNode(value) {
  value.name = value.paymentName
  form.selectedPaymentNodes.forEach(element => {
    if (element.name === value.name) {
      if (/\([\d]+\)/.test(value.name)) {
        var str = value.name
        var res = str.split(/[()]/)[1]
        // Replace the old number value in the brackets
        value.name = str.replace(
          '(' + res + ')',
          '(' + (parseInt(res) + 1) + ')'
        )
      } else {
        value.name += '(1)'
      }
    }
  })
  addNodeData.addNode = {
    childId: value.id,
    id: --newNodeId,
    name: value.name,
    paymentName: value.paymentName,
    icon: value.payType,
    children: [],
    siteId: searchCondition.siteId,
    level: searchCondition.financialLevel,
    way: searchCondition.way,
  }
  form.selectedPaymentNodes.push(addNodeData.addNode)
}

function addNodesToSelectedGroup({ list, level, name }) {
  form.selectedPaymentNodes = []
  form.selectedLevel = level
  Object.assign(form.selectedPaymentNodes, list)
  if (level < 2) {
    form.selectedGroup = addNodeData.root.name
    uiControl.dialogTitle = t('fields.addNodes')
  } else {
    form.selectedGroup = name
    uiControl.dialogTitle = t('fields.selectNodeAddTo') + form.selectedGroup
  }
  uiControl.dialogVisible = true
  // addNodeData.addNode = { childId: value.id, id: --newNodeId, name: value.paymentName, icon: "", children: [] };
  // addNodeData.parentNodes.length = 0;
  // addNodeData.parentNodes.push(addNodeData.root);
  // addNodeData.selectValue = addNodeData.root.id;
  // addSelectOption(paymentArea.value.list);
}

// function addSelectedNodesToGroup(value) {
// }
// function addSelectOption(list) {
//   list.forEach(function (item, index) {
//     console.log(item.children)
//     if (item.children.length > 0) {
//       addNodeData.parentNodes.push({ name: item.name, childId: item.id, id: item.id, icon: item.icon });
//       addSelectOption(item.children)
//     }
//   });
// }
function addNewNodesToSelectedGroup() {
  if (!form.selectedGroup || form.selectedGroup === addNodeData.root.name) {
    form.selectedPaymentNodes = []
    Object.assign(form.selectedPaymentNodes, page.paymentShowNodes)
    uiControl.dialogTitle = t('fields.addNodes')
    uiControl.dialogVisible = true
  }
}
function handleRemoveNode(tag) {
  form.selectedPaymentNodes.splice(form.selectedPaymentNodes.indexOf(tag), 1)
}
async function paymentSearch() {
  if (notEmpty(paymentNameFilter.value)) {
    page.paymentRecords = page.originPaymentRecords.filter(x => {
      const words = paymentNameFilter.value
        .toLowerCase()
        .trim()
        .split(/\s+/)
      for (let i = 0; i < words.length; i++) {
        const w = words[i]
        if (
          (x.paymentName && x.paymentName.toLowerCase().indexOf(w) >= 0) ||
          (x.payType && x.payType.toLowerCase().indexOf(w) >= 0) ||
          (x.currencyName && x.currencyName.toLowerCase().indexOf(w) >= 0)
        ) {
          return true
        }
      }
      return false
    })
  } else {
    const selectedSite = page.sites.find(k => k.id === searchCondition.siteId)
    page.paymentRecords = page.originPaymentRecords.filter(p =>
      selectedSite.currency.includes(p.currencyCode)
    )
  }
}

async function loadPayments() {
  page.loading = true
  const { data: records } = await getAllPayments({
    way: searchCondition.way,
    status: 'OPEN',
    siteId: searchCondition.siteId,
  })
  page.originPaymentRecords = records
  page.loading = false
  const { data: nodes } = await getPaymentShow({
    financialLevel: searchCondition.financialLevel,
    siteId: searchCondition.siteId,
    way: searchCondition.way,
  })
  page.paymentShowNodes = nodes
  await paymentSearch()
  uiControl.searchDialogVisible = false
  getSelectedSearchCondition()
  updateFinancialToCopy()
}

function updateFinancialToCopy() {
  copy.financials = []
  copy.selectedLevel = []
  var selected = searchCondition.financialLevel
  var totallevel = page.financials
  var all = { name: 'All', level: '-1' }
  copy.financials.push(all)
  for (let i = 0; i < totallevel.length; i++) {
    if (totallevel[i].level !== selected) {
      copy.financials.push(totallevel[i])
    }
  }
}

// async function copyLevel() {
//   if (copy.selectedLevel.length !== 0) {
//     var selectedString = ''
//     for (let i = 0; i < copy.selectedLevel.length; i++) {
//       if (i > 0) selectedString += ', '
//       selectedString += getFinancialLevelNameByLevel(copy.selectedLevel[i])
//     }

//     ElMessageBox.confirm(
//       t('message.confirmCopy') +
//         getFinancialLevelNameByLevel(searchCondition.financialLevel) +
//         t('message.confirmCopyTo') +
//         selectedString +
//         ' ?',
//       t('fields.notice'),
//       {
//         confirmButtonText: t('fields.copy'),
//         cancelButtonText: t('fields.cancel'),
//         type: 'info',
//       }
//     ).then(async () => {
//       const obj = {
//         nodes: toRaw(paymentArea.value.list),
//         financialLevel: searchCondition.financialLevel,
//         siteId: searchCondition.siteId,
//         way: searchCondition.way,
//         selected: copy.selectedLevel.toString(),
//       }
//       await copyPaymentShow(obj)
//       ElMessage({ message: t('message.updateSuccess'), type: 'success' })
//     })
//   } else {
//     ElMessage({
//       message: t('message.validateCopyFinancialLevel'),
//       type: 'error',
//     })
//   }
// }

async function updatePaymentShowBtn() {
  uiControl.updateDialogVisible = true
  if (searchCondition.way === 'WEB') {
    span.copyWay = t('fields.copyTo') + ' Mobile'
  } else {
    span.copyWay = t('fields.copyTo') + ' WEB'
  }
}

async function confirmUpdate() {
  ElMessageBox.confirm(t('message.confirmUpdatePayment'), t('fields.notice'), {
    confirmButtonText: t('fields.update'),
    cancelButtonText: t('fields.cancel'),
    type: 'info',
  }).then(async () => {
    const obj = {
      nodes: toRaw(paymentArea.value.list),
      financialLevel: searchCondition.financialLevel,
      siteId: searchCondition.siteId,
      way: searchCondition.way,
      selected: copy.selectedLevel.toString(),
      copyWay: copy.checked,
    }
    await updatePaymentShow(obj)
    uiControl.updateDialogVisible = false;
    ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  })
}

async function loadSearchCondition() {
  const { data: ret } = await getSiteListSimple()
  page.sites = ret
  await loadFinancialLevels()
  getSelectedSearchCondition()
}

// function getFinancialLevelNameByLevel(selected) {
//   var totallevel = page.financials
//   for (let i = 0; i < totallevel.length; i++) {
//     console.log(totallevel[i].level + '/' + selected)
//     if (totallevel[i].level === selected) {
//       return totallevel[i].name
//     }
//   }
// }

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({
    siteId: searchCondition.siteId,
  })
  page.financials = financial
}

function handleSiteNameCheckedChange() {
  loadSearchCondition()
}

function isAllLocations(a) {
  if (a[a.length - 1] === '-1') {
    copy.selectedLevel = []
    copy.financials.forEach(loc => {
      if (loc.level !== '-1') {
        copy.selectedLevel.push(loc.level)
      }
    })
  }
}

onMounted(async () => {
  await loadSearchCondition()
  if (LOGIN_USER_SITEID.value != null) {
    searchCondition.siteId = LOGIN_USER_SITEID.value
  }
  await loadFinancialLevels()
  await loadPayments()
  bus.on('addNodesToSelectedGroup', addNodesToSelectedGroup)
})

onUnmounted(() => {
  bus.off('addNodesToSelectedGroup')
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

.body-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .display-area {
    width: 100%;
  }

  .payment-select {
    width: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.clearfix {
  margin-bottom: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.search-card {
  margin-bottom: 10px;
}

.select-node-name {
  color: green;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.tag-group {
  margin: 20px 0;
  &__title {
    margin: 0 10px 0 0;
  }
}
.tag-group.minusmargin {
  margin-top: -30px;
}
</style>
