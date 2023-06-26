<template>
  <div>
    <!-- <el-drawer
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
    </el-drawer> -->
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
          {{ p }}
        </el-tag>
      </div>
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
            <el-row type="flex" class="row-bg" justify="center">
              <el-col :span="24">
                <h3 style="margin: 0;">{{ t('fields.paymentArea') }}</h3>
              </el-col>
            </el-row>
            <!-- <el-tag-group>
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
            </el-tag-group> -->
          </div>
        </template>
        <el-row>
          <el-col :span="2" style="margin: 10px 0 30px; display: block;">
            <span>{{ t('fields.site') }}</span>
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="searchCondition.siteId"
              @change="handleSiteNameCheckedChange"
              value-key="id"
            >
              <el-option v-for="c in page.sites" :label="c.siteName" :key="c.id" :value="c.id">
                {{ c.siteName }}
              </el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="6">
            <h3>{{ t('fields.site') }}</h3>
            <el-select
              v-model="searchCondition.siteId"
              @change="handleSiteNameCheckedChange"
              value-key="id"
            >
              <el-option v-for="c in page.sites" :label="c.siteName" :key="c.id" :value="c.id">
                {{ c.siteName }}
              </el-option>
            </el-select>
          </el-col> -->
          <!-- <el-col :span="6">
            <h3>{{ t('fields.site') }}</h3>
            <el-switch
              v-model="searchCondition.way"
              active-text="WEB"
              active-value="WEB"
              active-color="#13ce66"
              inactive-text="MOBILE"
              inactive-color="rgb(13 79 229)"
              inactive-value="MOBILE"
            />
          </el-col> -->
        </el-row>
        <el-card v-loading="page.loading">
          <el-row>
            <el-col :span="4">
              <el-button
                v-show="page.webPaymentShowNodes.length === 0"
                class="add"
                icon="el-icon-plus"
                size="mini"
                type="primary"
                @click="addNewNodesToSelectedGroup()"
              />
            </el-col>
            <el-col :span="20" align="right">
              <el-button
                v-if="page.webPaymentShowNodes.length > 0 && !isNodesUpdated"
                type="success"
                v-permission="['sys:payment:show:update']"
                @click="confirmUpdate"
              >
                {{ t('fields.update') }}
              </el-button>
            </el-col>
          </el-row>
          <div class="container">
            <Node
              :level="1"
              :list="page.webPaymentShowNodes"
              :type-list="page.originPaymentRecords"
              ref="paymentArea"
              :pageList="searchCondition"
              @add-nodes-to-selected-group="addNodesToSelectedGroup()"
              @export-child-item="getSelectedChild()"
              @export-nodes="showNodesUpdated()"
            />
          </div>
        </el-card>
        <el-row v-if="isCodeSelected && isNodesUpdated">
          <el-col :span="24">
            <!-- <el-button
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
            </el-button> -->
            <el-row style="margin: 50px 0;">
              <el-col :span="2" style="margin: 10px 0 30px; display: block;">
                <span>Payment Type</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="selectedPaymentType"
                  class="filter-item"
                  style="width: 100%"
                  placeholder="Select Payment Type"
                  @change="checkPayTypeSelected"
                >
                  <el-option
                    v-for="item in page.payTypeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                    <span>{{ item }}</span>
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="17" align="right">
                <el-button type="success" @click="savePaymentValues">{{ t('fields.updatePayment') }}</el-button>
              </el-col>
            </el-row>
            <el-row style="margin: 50px 0;">
              <el-col :span="24">
                <el-row v-if="selectedPaymentType" :gutter="20">
                  <el-col :span="6">
                    <div style="margin-bottom: 10px; font-weight: bold;">WEB</div>
                    <el-card>
                      <template #header>
                        <div class="header" style="background: #cbe5ff; font-size:14px; padding: 12px 10px; margin: -20px -20px;">
                          Payment
                        </div>
                      </template>
                      <el-radio-group v-model="nodeValues.web.paymentId" @change="changeWebPaymentId">
                        <el-radio v-for="c in page.paymentRecords" :label="c.paymentName" v-model="c.id" :key="c" style="display: block;" />
                      </el-radio-group>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <div style="margin-bottom: 10px; font-weight: bold;">MOBILE</div>
                    <el-card>
                      <template #header>
                        <div class="header" style="background: #cbe5ff; font-size:14px; padding: 12px 10px; margin: -20px -20px;">
                          Payment
                        </div>
                      </template>
                      <el-radio-group v-model="nodeValues.mobile.paymentId" @change="changeMobilePaymentId">
                        <el-radio v-for="c in page.paymentRecords" :label="c.paymentName" :key="c" style="display: block;">
                          {{ c.paymentName }}
                        </el-radio>
                      </el-radio-group>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <div style="margin-bottom: 10px; font-weight: bold;">WEB</div>
                    <el-card>
                      <template #header>
                        <div class="header" style="background: #cbe5ff; color: #ffffff; padding: 10px; margin: -20px;">
                          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Financial</el-checkbox>
                        </div>
                      </template>
                      <el-checkbox-group v-model="nodeValues.web.financialLevels" @change="handleCheckedFinancialChange">
                        <el-checkbox :value-key="c.id" v-for="c in page.financials" :label="c" :key="c.id" style="display: block; margin: 5px 0;">
                          {{ c.name }} <span :class="{'red': !c.selectedWebPaymentName}">{{ c.selectedWebPaymentName ? c.selectedWebPaymentName : '未分配' }}</span>
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <div style="margin-bottom: 10px; font-weight: bold;">MOBILE</div>
                    <el-card>
                      <template #header>
                        <div class="header" style="background: #cbe5ff; color: #ffffff; padding: 10px; margin: -20px;">
                          <el-checkbox :indeterminate="mobileIsIndeterminate" v-model="checkAllMobile" @change="handleMobileCheckAllChange">Financial</el-checkbox>
                        </div>
                      </template>
                      <el-checkbox-group v-model="nodeValues.mobile.financialLevels" @change="handleMobileCheckedFinancialChange">
                        <el-checkbox v-for="c in page.financials" :label="c" :key="c.id" style="display: block; margin: 5px 0;">
                          {{ c.name }} <span :class="{'red': !c.selectedMobilePaymentName}">{{ c.selectedMobilePaymentName ? c.selectedMobilePaymentName : '未分配' }}</span>
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
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
import Node from '@/components/paymentSelect/node'
import {
  getAllPayments,
  getPaymentShow,
  getPaymentShowDetails,
  updatePaymentShow,
  updatePaymentShowDetails
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
const nodeValues = ref({
  code: null,
  web: {
    paymentId: null,
    financialLevels: [],
  },
  mobile: {
    paymentId: null,
    financialLevels: [],
  }
})
const selectedPaymentType = ref(null);
const checkAll = ref(false)
const isIndeterminate = ref(true)

const handleCheckAllChange = (val) => {
  console.log(page.financials)
  if (val) {
    nodeValues.value.web.financialLevels = page.financials;
  } else {
    nodeValues.value.web.financialLevels = [];
  }

  isIndeterminate.value = false;
}
const handleCheckedFinancialChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === page.financials.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < page.financials.length
}
const checkAllMobile = ref(false)
const mobileIsIndeterminate = ref(true)

const handleMobileCheckAllChange = (val) => {
  if (val) {
    nodeValues.value.mobile.financialLevels = page.financials;
  } else {
    nodeValues.value.mobile.financialLevels = [];
  }

  mobileIsIndeterminate.value = false;
}
const handleMobileCheckedFinancialChange = (value) => {
  const checkedCount = value.length
  checkAllMobile.value = checkedCount === page.financials.map(element => element.name).length
  mobileIsIndeterminate.value = checkedCount > 0 && checkedCount < page.financials.length
}
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
  mobileOriginPaymentRecords: [],
  payTypeList: [],
  webPaymentShowNodes: [],
  mobilePaymentShowNodes: [],
  loading: false,
  sites: [],
  financials: [],
})
const searchCondition = reactive({
  siteId: 1,
})
const arr = reactive({
  item: [],
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
const isCodeSelected = ref(false);
const selectedChild = ref(null);
const isNodesUpdated = ref(true)

const paymentArea = ref()
let newNodeId = 0

function showNodesUpdated() {
  isNodesUpdated.value = false
}
const originType = ref(null)
const originWebPaymentName = ref(null)
const originMobilePaymentName = ref(null)
const originWebLevels = ref(null)
const originMobileLevels = ref(null)

const selectedWebPaymentName = ref(null)
const selectedMobilePaymentName = ref(null)
const selectedWebLevels = ref(null)
const selectedMobileLevels = ref(null)

function addNewNode() {
  if (!form.selectedGroup || form.selectedGroup === addNodeData.root.name) {
    page.paymentShowNodes = []
    Object.assign(page.paymentShowNodes, form.selectedPaymentNodes)
    uiControl.dialogVisible = false
  } else {
    runCode(page.paymentShowNodes)
  }
  addNodeData.addNode = {
    // childId: value.id,
    id: --newNodeId,
    // name: value.name,
    // paymentName: value.paymentName,
    // icon: value.payType,
    children: [],
    siteId: searchCondition.siteId,
    level: searchCondition.financialLevel,
    way: searchCondition.way,
  }
  form.selectedPaymentNodes.push(addNodeData.addNode)
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
}
function getSelectedChild(item) {
  if (isNodesUpdated.value === false) {
    ElMessage.error(t('message.updateProceed'))
    return
  }
  if (item === 'groupSelected') {
    isCodeSelected.value = false
    selectedChild.value = null
    return
  }
  if (item.code) {
    nodeValues.value.code = item.code
    isCodeSelected.value = true
    selectedChild.value = item
  }
  let selectedNode = null
  page.webPaymentShowNodeDetails.forEach((el) => {
    if (el.code === item.code) {
      selectedNode = el
    }
  })
  if (selectedNode) {
    nodeValues.value.web.financialLevels = []
    nodeValues.value.mobile.financialLevels = []
    selectedPaymentType.value = selectedNode.web.type
    originType.value = selectedNode.web.type
    checkPayTypeSelected(selectedPaymentType.value)
    nodeValues.value.code = selectedNode.code
    selectedWebPaymentName.value = null
    selectedMobilePaymentName.value = null
    page.originPaymentRecords.forEach((payRec) => {
      if (payRec.id === selectedNode.web.paymentId) {
        originWebPaymentName.value = payRec.paymentName
        selectedWebPaymentName.value = payRec.paymentName
        nodeValues.value.web.paymentId = payRec.paymentName
      }
      if (payRec.id === selectedNode.mobile.paymentId) {
        originMobilePaymentName.value = payRec.paymentName
        selectedMobilePaymentName.value = payRec.paymentName
        nodeValues.value.mobile.paymentId = payRec.paymentName
      }
    })
    page.financials.forEach((element, index) => {
      var webArray = JSON.parse("[" + selectedNode.web.financialLevels + "]");
      var mobileArray = JSON.parse("[" + selectedNode.mobile.financialLevels + "]");
      if (webArray[index] === 1) {
        nodeValues.value.web.financialLevels.push(element)
      } else {
        element.selectedWebPaymentName = null
      }
      if (mobileArray[index] === 1) {
        nodeValues.value.mobile.financialLevels.push(element)
      } else {
        element.selectedMobilePaymentName = null
      }
    });
    nodeValues.value.web.financialLevels.forEach(level => {
      level.selectedWebPaymentName = selectedWebPaymentName.value
    });
    nodeValues.value.mobile.financialLevels.forEach(level => {
      level.selectedMobilePaymentName = selectedMobilePaymentName.value
    });
    selectedWebLevels.value = nodeValues.value.web.financialLevels
    selectedMobileLevels.value = nodeValues.value.mobile.financialLevels
    originWebLevels.value = Object.assign(nodeValues.value.web.financialLevels, originWebLevels.value)
    originMobileLevels.value = Object.assign(nodeValues.value.mobile.financialLevels, originMobileLevels.value)
    // originMobileLevels.value = nodeValues.value.mobile.financialLevels
  } else {
    selectedPaymentType.value = ""
    nodeValues.value.mobile.paymentId = null
    nodeValues.value.mobile.financialLevels = []
    nodeValues.value.web.paymentId = null
    nodeValues.value.web.financialLevels = []
  }
}
function savePaymentValues() {
  arr.item = []
  const paymentValues = nodeValues.value
  const obj = {
    code: paymentValues.code,
    mobile: {
      paymentId: null,
      financialLevels: []
    },
    web: {
      paymentId: null,
      financialLevels: []
    }
  }
  page.originPaymentRecords.forEach(element => {
    if (element.paymentName === paymentValues.mobile.paymentId) {
      obj.mobile.paymentId = element.id
    }
    if (element.paymentName === paymentValues.web.paymentId) {
      obj.web.paymentId = element.id
    }
  });
  page.financials.forEach(element => {
    if (paymentValues.mobile.financialLevels.some(e => e.name === element.name)) {
      obj.mobile.financialLevels.push(1);
    } else {
      obj.mobile.financialLevels.push(0);
    }
    if (paymentValues.web.financialLevels.some(e => e.name === element.name)) {
      obj.web.financialLevels.push(1);
    } else {
      obj.web.financialLevels.push(0);
    }
  });
  if (!selectedPaymentType.value) {
    ElMessage.error(t('message.selectPaymentType'));
    return
  }
  if (!obj.web.paymentId) {
    ElMessage.error(t('message.selectWebPayment'));
    return
  }
  if (!obj.mobile.paymentId) {
    ElMessage.error(t('message.selectMobilePayment'));
    return
  }
  ElMessageBox.confirm(t('message.confirmUpdatePayment'), t('fields.notice'), {
    confirmButtonText: t('fields.update'),
    cancelButtonText: t('fields.cancel'),
    type: 'info',
  }).then(async () => {
    arr.item.push(obj);
    updatePaymentShowDetails(arr).then((res) => {
      if (res.code === 0) {
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
        getPaymentShowDetails({
          siteId: searchCondition.siteId
        }).then((res) => {
          if (res.code === 0) {
            page.webPaymentShowNodeDetails = res.data
            getSelectedChild(selectedChild.value)
          }
        })
      }
    })
  });
}
function addNodesToSelectedGroup({ list, level, name }) {
  console.log(list, level, name)
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
}
function addNewNodesToSelectedGroup() {
  paymentArea.value.addHandle()
}
function handleRemoveNode(tag) {
  form.selectedPaymentNodes.splice(form.selectedPaymentNodes.indexOf(tag), 1)
}
function checkPayTypeSelected(value) {
  // page.payTypeList = [];
  // page.originPaymentRecords.forEach((el) => {
  //   if (el.payType === value) {
  //     page.payTypeList.push(el)
  //   }
  // })
  page.paymentRecords = page.originPaymentRecords.filter((el) => el.payType === value);
  if (originType.value === value) {
    nodeValues.value.web.paymentId = originWebPaymentName.value;
    nodeValues.value.mobile.paymentId = originMobilePaymentName.value;
    nodeValues.value.web.financialLevels = Object.assign(nodeValues.value.web.financialLevels, originWebLevels.value);
    nodeValues.value.mobile.financialLevels = Object.assign(nodeValues.value.mobile.financialLevels, originMobileLevels.value);
    nodeValues.value.web.financialLevels.forEach(level => {
      level.selectedWebPaymentName = originWebPaymentName.value
    });
    nodeValues.value.mobile.financialLevels.forEach(level => {
      level.selectedMobilePaymentName = originMobilePaymentName.value
    });
  } else {
    nodeValues.value.web.paymentId = null;
    nodeValues.value.mobile.paymentId = null;
    nodeValues.value.web.financialLevels = [];
    nodeValues.value.mobile.financialLevels = [];
    page.financials.forEach(element => {
      element.selectedWebPaymentName = null
      element.selectedMobilePaymentName = null
    });
  }
  console.log(originType.value)
  console.log(originWebPaymentName.value)
  console.log(originMobilePaymentName.value)
  console.log(originWebLevels.value)
  console.log(originMobileLevels.value)
  // nodeValues.value.web.paymentId = null;
  // nodeValues.value.mobile.paymentId = null;
  // nodeValues.value.web.financialLevels = [];
  // nodeValues.value.mobile.financialLevels = [];
}
function changeWebPaymentId(value) {
  var previouslySelectedWebPaymentName = {}
  previouslySelectedWebPaymentName = Object.assign(selectedWebPaymentName.value, previouslySelectedWebPaymentName);
  var previouslySelectedLevels = {}
  previouslySelectedLevels = Object.assign(selectedWebLevels.value, previouslySelectedLevels);
  if (value === (previouslySelectedWebPaymentName.toString())) {
    console.log(previouslySelectedLevels)
    nodeValues.value.web.financialLevels = previouslySelectedLevels
    previouslySelectedLevels.forEach(level => {
      level.selectedWebPaymentName = selectedWebPaymentName.value
    });
  } else {
    nodeValues.value.web.financialLevels = []
    page.financials.forEach(level => {
      level.selectedWebPaymentName = null
    });
  }
}
function changeMobilePaymentId(value) {
  var previouslySelectedMobilePaymentName = {}
  previouslySelectedMobilePaymentName = Object.assign(selectedMobilePaymentName.value, previouslySelectedMobilePaymentName);
  var previouslySelectedLevels = {}
  previouslySelectedLevels = Object.assign(selectedMobileLevels.value, previouslySelectedLevels);
  if (value === (previouslySelectedMobilePaymentName.toString())) {
    console.log(previouslySelectedLevels)
    nodeValues.value.mobile.financialLevels = previouslySelectedLevels
    previouslySelectedLevels.forEach(level => {
      level.selectedMobilePaymentName = selectedMobilePaymentName.value
    });
  } else {
    nodeValues.value.mobile.financialLevels = []
    page.financials.forEach(level => {
      level.selectedMobilePaymentName = null
    });
  }
}
async function loadPayments() {
  // searchCondition.way = 'WEB'
  const { data: records } = await getAllPayments({
    // way: searchCondition.way,
    status: 'OPEN',
    siteId: searchCondition.siteId,
  })
  const { data: nodes } = await getPaymentShow({
    siteId: searchCondition.siteId,
    // way: searchCondition.way,
  })
  const { data: nodeDetails } = await getPaymentShowDetails({
    siteId: searchCondition.siteId,
    // way: searchCondition.way,
  })
  page.webPaymentShowNodeDetails = nodeDetails
  page.webPaymentShowNodes = nodes
  page.originPaymentRecords = records
  page.paymentRecords = records
  const payTypes = new Set();
  records.forEach((el) => {
    payTypes.add(el.payType);
  })
  page.payTypeList = Array.from(payTypes);
  uiControl.searchDialogVisible = false
}

async function confirmUpdate() {
  ElMessageBox.confirm(t('message.confirmUpdate'), t('fields.notice'), {
    confirmButtonText: t('fields.update'),
    cancelButtonText: t('fields.cancel'),
    type: 'info',
  }).then(async () => {
    page.loading = true
    const obj = {
      nodes: toRaw(paymentArea.value.list),
      siteId: searchCondition.siteId
    }
    await updatePaymentShow(obj)
    uiControl.updateDialogVisible = false;
    ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    isNodesUpdated.value = true
    page.loading = false
  })
}

async function loadSearchCondition() {
  page.loading = true
  const { data: ret } = await getSiteListSimple()
  page.sites = ret
  await loadFinancialLevels()
  await loadPayments()
  page.loading = false
}
async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({
    siteId: searchCondition.siteId,
  })
  page.financials = financial
}

function handleSiteNameCheckedChange() {
  isCodeSelected.value = false
  isNodesUpdated.value = true
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
  bus.on('exportChildItem', getSelectedChild)
  bus.on('exportNodes', showNodesUpdated)
})

onUnmounted(() => {
  bus.off('addNodesToSelectedGroup')
  bus.off('exportChildItem')
  bus.off('exportNodes')
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.red {
   color: #ff0000;
}
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
