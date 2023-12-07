<template>
  <div>
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
        </el-row>
        <el-card v-loading="page.loading">
          <el-row>
            <el-col :span="4">
              <el-button
                v-show="page.paymentShowNodes.length === 0"
                class="add"
                icon="el-icon-plus"
                size="mini"
                type="primary"
                @click="addNewNodesToSelectedGroup()"
              />
            </el-col>
            <el-col :span="20" align="right">
              <el-button
                v-if="!isNodesUpdated"
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
              :list="page.paymentShowNodes"
              :type-list="page.originPaymentRecords"
              ref="paymentArea"
              :pageList="searchCondition"
              @add-nodes-to-selected-group="addNodesToSelectedGroup()"
              @export-child-item="getSelectedChild()"
              @export-nodes="showNodesUpdated()"
              @delete-child-item="deleteChild()"
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
            <el-row style="margin: 50px 0; align-items: center;">
              <el-col :span="5" style="display: block;">
                <span>Payment Type</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-if="!isSavedPaymentType || isSavedPaymentType === 'null'"
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
                <div v-else>
                  {{ isSavedPaymentType }}
                </div>
              </el-col>
              <el-col :span="14" align="right">
                <el-button type="success" @click="savePaymentValues">{{ t('message.updatePayment') }}</el-button>
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
                      <el-radio-group v-model="nodeValues.web.payment" @change="changeWebPaymentId">
                        <el-radio :value-key="c.id" v-for="c in page.paymentRecords" :label="c.id" :key="c" style="display: block;">{{ c.paymentName }}</el-radio>
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
                      <el-radio-group v-model="nodeValues.mobile.payment" @change="changeMobilePaymentId">
                        <el-radio v-for="c in page.paymentRecords" :label="c.id" :key="c" style="display: block;">
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
                        <el-checkbox :value-key="c.id" v-for="c in page.financials" :label="c.name" :key="c.id" style="display: block; margin: 5px 0;">
                          {{ c.name }}  <span :class="{'red': !c.selectedWebPayment || c.selectedWebPayment === '未分配'}">{{ c.selectedWebPayment }}</span>
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
                        <el-checkbox v-for="c in page.financials" :label="c.name" :key="c.id" style="display: block; margin: 5px 0;">
                          {{ c.name }} <span :class="{'red': !c.selectedMobilePayment || c.selectedMobilePayment === '未分配'}">{{ c.selectedMobilePayment }}</span>
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
  updatePaymentShowDetails,
  deletePaymentShowDetails,
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
const searchCondition = reactive({
  siteId: 1,
})
const form = reactive({
  selectedGroup: '',
  selectedLevel: '',
  selectedPaymentNodes: [],
})
const page = reactive({
  paymentRecords: [],
  originPaymentRecords: [],
  payTypeList: [],
  paymentShowNodes: [],
  initialPaymentShowNodeDetails: [],
  loading: false,
  sites: [],
  financials: [],
})
const addNodeData = reactive({
  selectValue: '',
  addNode: {},
  parentNodes: [],
  root: { name: 'root', id: -1 },
})
const arr = reactive({
  item: [],
})
const selectedPaymentType = ref(null);
const isSavedPaymentType = ref(null);
const checkAll = ref(false)
const isIndeterminate = ref(true);
const isCodeSelected = ref(false);
const selectedChild = ref(null);
const isNodesUpdated = ref(true)
const paymentArea = ref();
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

var selectedNode = reactive()
const selectedWebPayment = ref({})
const selectedMobilePayment = ref({})
const selectedWebLevels = ref(null)
const selectedMobileLevels = ref(null)

var objChild = reactive(null)
const deleteChildArray = reactive([])
let newNodeId = 0

function getSelectedChild(item, onUpd) {
  selectedNode = {
    code: null,
    web: {
      paymentId: 0,
      financialLevels: []
    },
    mobile: {
      paymentId: 0,
      financialLevels: []
    }
  }
  page.financials.forEach((e) => {
    selectedNode.web.financialLevels.push(0)
    selectedNode.mobile.financialLevels.push(0)
  })
  if (isNodesUpdated.value === false) {
    ElMessage.error(t('message.updateProceed'))
    return
  }
  if (item === 'groupSelected') {
    isCodeSelected.value = false
    selectedChild.value = null
    return
  }
  isSavedPaymentType.value = ""
  selectedPaymentType.value = ""
  nodeValues.value.mobile.payment = null
  nodeValues.value.mobile.financialLevels = []
  nodeValues.value.web.payment = null
  nodeValues.value.web.financialLevels = []

  page.financials.forEach((e) => {
    e.selectedWebPayment = null
    e.selectedMobilePayment = null
  })
  if (item.code) {
    selectedNode.code = item.code
    nodeValues.value.code = item.code
    isCodeSelected.value = true
    selectedChild.value = item
  }
  // checkAll.value = false
  // checkAllMobile.value = false
  isIndeterminate.value = false
  mobileIsIndeterminate.value = false
  page.initialPaymentShowNodeDetails.forEach((el) => {
    if (el.code === item.code) {
      selectedNode = el
    }
  })
  if (selectedNode) {
    console.log(selectedNode.mobile.type)
    if (selectedNode.web.type === 'null') {
      isSavedPaymentType.value = selectedNode.mobile.type
      selectedPaymentType.value = selectedNode.mobile.type
    } else {
      isSavedPaymentType.value = selectedNode.web.type
      selectedPaymentType.value = selectedNode.web.type
    }
    console.log(isSavedPaymentType.value)
    checkPayTypeSelected(selectedPaymentType.value)
    nodeValues.value.code = selectedNode.code

    // Payment
    page.paymentRecords.forEach((payRec) => {
      if (payRec.id === selectedNode.web.paymentId) {
        nodeValues.value.web.payment = payRec.id
        selectedWebPayment.value = payRec
      }
      if (payRec.id === selectedNode.mobile.paymentId) {
        console.log(payRec.id)
        nodeValues.value.mobile.payment = payRec.id
        selectedMobilePayment.value = payRec
      }
    })
    page.financials.forEach((element, index) => {
      var webArray = JSON.parse("[" + selectedNode.web.financialLevels + "]");
      var mobileArray = JSON.parse("[" + selectedNode.mobile.financialLevels + "]");
      // webArray.forEach((web) => {
      //   page.paymentRecords.forEach((payRecord) => {
      //     console.log(payRecord.id)
      //     console.log(web)
      //     if (payRecord.id === web) {
      //       element.selectedWebPayment = payRecord.paymentName
      //       changeWebPaymentId(selectedNode.web.paymentId)
      //     }
      //   })
      // })
      // mobileArray.forEach((mob) => {
      //   page.paymentRecords.forEach((payRecord) => {
      //     if (payRecord.id === mob) {
      //       element.selectedMobilePayment = payRecord.paymentName
      //       changeMobilePaymentId(selectedNode.mobile.paymentId)
      //     }
      //   })
      // })
      // console.log(mobileArray[index])
      page.paymentRecords.forEach(payRecord => {
        if (payRecord.id === webArray[index]) {
          element.selectedWebPayment = payRecord.paymentName
          // nodeValues.value.web.financialLevels[index] = element.name
          changeWebPaymentId(selectedNode.web.paymentId)
        }
        if (payRecord.id === mobileArray[index]) {
          element.selectedMobilePayment = payRecord.paymentName
          // nodeValues.value.mobile.financialLevels[index] = element.name
          changeMobilePaymentId(selectedNode.mobile.paymentId)
        }
      });
      // if (webArray[index] !== 0 || mobileArray[index] !== 0) {
      //   // if (element.id === webArray[index]) {
      //   // nodeValues.value.web.financialLevels[index] =
      //   //   console.log(element.name)
      //   // }
      //   // console.log(page.initialPaymentShowNodeDetails)
      // }
      //  else {
      //   element.selectedWebPayment = null
      //   element.selectedMobilePayment = null
      // }
      // if (mobileArray[index] !== 0) {
      //   element.selectedMobilePayment = selectedMobilePayment.value.paymentName
      //   nodeValues.value.mobile.financialLevels[index] = element.name
      // } else {
      //   element.selectedMobilePayment = null
      // }
    });
    selectedWebLevels.value = page.financials
    selectedMobileLevels.value = nodeValues.value.mobile.financialLevels
  }
  console.log(selectedNode)
}
function deleteChild(item, onDel) {
  if (onDel === 'isGroup') {
    return
  }
  if (item.children.length) {
    item.children.forEach((child) => {
      deleteChildArray.push(child.code)
    })
  } else {
    deleteChildArray.push(item.code)
  }
  objChild = {
    siteId: searchCondition.siteId,
    item: deleteChildArray
  }
}

function changeMobilePaymentId(value) {
  selectedMobilePayment.value = value
  nodeValues.value.mobile.financialLevels = []
  page.paymentRecords.forEach(element => {
    if (element.id === value) {
      page.financials.forEach((e) => {
        if (e.selectedMobilePayment === element.paymentName) {
          nodeValues.value.mobile.financialLevels.push(e.name);
          mobileIsIndeterminate.value = true
        }
      })
    }
  });
}

function changeWebPaymentId(value) {
  selectedWebPayment.value = value
  nodeValues.value.web.financialLevels = []
  page.paymentRecords.forEach(element => {
    if (element.id === value) {
      page.financials.forEach((e) => {
        if (e.selectedWebPayment === element.paymentName) {
          nodeValues.value.web.financialLevels.push(e.name);
          isIndeterminate.value = true
        }
      })
    }
  });
}

const getDuplicateCode = (paymentAreaList) => {
  const codeSet = new Set()
  const duplicates = []
  const processNode = (node) => {
    const code = node.code
    if (codeSet.has(code)) {
      duplicates.push(code)
    } else {
      codeSet.add(code)
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(processNode)
    }
  }
  paymentAreaList.forEach(processNode)
  return duplicates
}

async function confirmUpdate() {
  const missingCodePayments = page.paymentShowNodes.filter(payment => !payment.code);
  if (missingCodePayments.length > 0) {
    ElMessage({ message: t('message.validateCodeRequired') + ' - ' + missingCodePayments[0].name, type: 'error' });
    return false
  }
  const duplicateCode = getDuplicateCode(page.paymentShowNodes)
  console.log('page.paymentShowNodes', page.paymentShowNodes)
  console.log('duplicateCode', duplicateCode)
  if (duplicateCode.length > 0) {
    ElMessage({ message: t('message.validateCodeExist') + duplicateCode, type: 'error' })
    return false
  }
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
    if (objChild) {
      deletePaymentShowDetails(objChild).then((res) => {
        if (res.code === 0) {
          objChild = null
        }
      })
    }
    uiControl.updateDialogVisible = false;
    ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    isNodesUpdated.value = true
    page.loading = false
    handleSiteNameCheckedChange()
  })
}
function savePaymentValues() {
  arr.item = []
  const paymentValues = {}
  Object.assign(paymentValues, nodeValues.value)
  // page.financials.forEach((fin) => {
  //   if (paymentValues.web.financialLevels.findIndex(e => e === fin.name)) {
  //     console.log(fin.id)
  //   }
  // })
  var selectedWebArray = JSON.parse("[" + selectedNode.web.financialLevels + "]");
  var selectedMobileArray = JSON.parse("[" + selectedNode.mobile.financialLevels + "]");
  const financials = page.financials;
  const financialWebLevels = paymentValues.web.financialLevels;
  const financialMobileLevels = paymentValues.mobile.financialLevels;
  const webIndexes = financials
    .map((financial) => financial.name)
    .filter((name) => financialWebLevels.includes(name))
    .map((name) => financials.findIndex((financial) => financial.name === name));
  const mobileIndexes = financials
    .map((financial) => financial.name)
    .filter((name) => financialMobileLevels.includes(name))
    .map((name) => financials.findIndex((financial) => financial.name === name));

  financials.forEach((f, findex) => {
    if (webIndexes.includes(findex)) {
      selectedWebArray[findex] = paymentValues.web.payment
    } else {
      if (selectedWebArray[findex] === null) {
        selectedWebArray[findex] = 0
      }
    }
    if (mobileIndexes.includes(findex)) {
      selectedMobileArray[findex] = paymentValues.mobile.payment
    } else {
      if (selectedMobileArray[findex] === null) {
        selectedMobileArray[findex] = 0
      }
    }
    // paymentValues.web.financialLevels
  });
  const obj = {
    code: paymentValues.code,
    web: {
      paymentId: paymentValues.web.payment,
      financialLevels: selectedWebArray
    },
    mobile: {
      paymentId: paymentValues.mobile.payment,
      financialLevels: selectedMobileArray
    },
  }
  if (obj.web.paymentId === 0) {
    obj.web.financialLevels.forEach(element => {
      if (element !== 0) {
        obj.web.paymentId = element
      }
    });
  }
  if (obj.mobile.paymentId === 0) {
    obj.mobile.financialLevels.forEach(element => {
      if (element !== 0) {
        obj.mobile.paymentId = element
      }
    });
  }
  // const obj = {
  //   code: paymentValues.code,
  //   mobile: {
  //     financialLevels: []
  //   },
  //   web: {
  //     financialLevels: []
  //   }
  // }
  // page.originPaymentRecords.forEach(element => {
  //   if (element.paymentName === paymentValues.mobile.paymentId) {
  //     obj.mobile.paymentId = element.id
  //   }
  //   if (element.paymentName === paymentValues.web.paymentId) {
  //     obj.web.paymentId = element.id
  //   }
  // });
  // obj.web.financialLevels = paymentValues.web.financialLevels
  // const levels = page.initialPaymentShowNodeDetails[0].mobile.financialLevels.split(',');
  // const nonZeroIndexes = [];

  // for (let i = 0; i < levels.length; i++) {
  //   const element = levels[i].trim();
  //   if (parseInt(element) !== 0) {
  //     nonZeroIndexes.push(i);
  //   }
  // }
  // Full List
  // page.financials.forEach((element, index) => {
  //   // If current selected values, place selected mobile Payment
  //   if (paymentValues.web.financialLevels.some(e => e.id === element.id)) {
  //     obj.mobile.financialLevels[index] = selectedMobilePayment.value.id;
  //   } else {
  //   }
  // });
  if (!selectedPaymentType.value) {
    ElMessage.error(t('message.selectPaymentType'));
    return
  }
  // if (!obj.web.paymentId) {
  //   obj.web.paymentId = 0
  // }
  // if (!obj.mobile.paymentId) {
  //   obj.mobile.paymentId = 0
  // }
  ElMessageBox.confirm(t('message.confirmUpdatePayment'), t('fields.notice'), {
    confirmButtonText: t('fields.update'),
    cancelButtonText: t('fields.cancel'),
    type: 'info',
  }).then(async () => {
    arr.item.push(obj);
    arr.siteId = searchCondition.siteId
    updatePaymentShowDetails(arr).then((res) => {
      if (res.code === 0) {
        ElMessage({ message: t('message.updateSuccess'), type: 'success' })
        getPaymentShowDetails({
          siteId: searchCondition.siteId
        }).then((res) => {
          if (res.code === 0) {
            page.initialPaymentShowNodeDetails = res.data
            let selectedElement = null;
            res.data.forEach(element => {
              if (element.code === selectedChild.value.code) {
                selectedElement = element
              }
            });
            if (selectedElement !== null) {
              // Perform operations with the selectedElement
              getSelectedChild(selectedElement, 'onupdate');
            } else {
              console.log("No matching element found.");
            }
          }
        })
      }
    })
  });
}
function addNewNodesToSelectedGroup() {
  paymentArea.value.addHandle()
}
function handleRemoveNode(tag) {
  form.selectedPaymentNodes.splice(form.selectedPaymentNodes.indexOf(tag), 1)
}
function checkPayTypeSelected(value) {
  // page.originPaymentRecords.forEach((el) => {
  // })
  page.paymentRecords = page.originPaymentRecords.filter((el) => el.payType === value);
  page.paymentRecords.push({ id: 0, paymentName: "未分配" })
  if (value === 'null') {
    selectedPaymentType.value = null
  }
  // if (selectedPaymentType.value === value) {
  //   nodeValues.value.web.paymentId = selectedWebPayment.value.name;
  //   nodeValues.value.mobile.paymentId = selectedMobilePayment.value.name;
  // }
  // nodeValues.value.web.financialLevels = Object.assign(nodeValues.value.web.financialLevels, selectedWebLevels.value);
  // nodeValues.value.mobile.financialLevels = Object.assign(nodeValues.value.mobile.financialLevels, selectedMobileLevels.value);
  // nodeValues.value.web.financialLevels.forEach(level => {
  //   level.selectedWebPaymentName = originWebPaymentName.value
  // });
  // nodeValues.value.mobile.financialLevels.forEach(level => {
  //   level.selectedMobilePaymentName = originMobilePaymentName.value
  // });
  // } else {
  //   nodeValues.value.web.paymentId = null;
  //   nodeValues.value.mobile.paymentId = null;
  //   nodeValues.value.web.financialLevels = [];
  //   nodeValues.value.mobile.financialLevels = [];
  //   page.financials.forEach(element => {
  //     element.selectedWebPaymentName = null
  //     element.selectedMobilePaymentName = null
  //   });
  // }
  // nodeValues.value.web.paymentId = null;
  // nodeValues.value.mobile.paymentId = null;
  // nodeValues.value.web.financialLevels = [];
  // nodeValues.value.mobile.financialLevels = [];
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
function addNewNode() {
  if (!form.selectedGroup || form.selectedGroup === addNodeData.root.name) {
    page.paymentShowNodes = []
    Object.assign(page.paymentShowNodes, form.selectedPaymentNodes)
    uiControl.dialogVisible = false
  } else {
    runCode(page.paymentShowNodes)
  }
  addNodeData.addNode = {
    id: --newNodeId,
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
function showNodesUpdated() {
  isNodesUpdated.value = false
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
  bus.on('deleteChildItem', deleteChild)
})

onUnmounted(() => {
  bus.off('addNodesToSelectedGroup')
  bus.off('exportChildItem')
  bus.off('deleteChildItem')
  bus.off('exportNodes')
})

function handleSiteNameCheckedChange() {
  isCodeSelected.value = false
  isNodesUpdated.value = true
  loadSearchCondition()
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
async function loadPayments() {
  const { data: records } = await getAllPayments({
    status: 'OPEN',
    siteId: searchCondition.siteId,
  })
  const { data: nodes } = await getPaymentShow({
    siteId: searchCondition.siteId,
  })
  const { data: nodeDetails } = await getPaymentShowDetails({
    siteId: searchCondition.siteId,
  })
  page.initialPaymentShowNodeDetails = nodeDetails
  page.paymentShowNodes = nodes
  page.originPaymentRecords = records
  page.paymentRecords = records
  const payTypes = new Set();
  records.forEach((el) => {
    payTypes.add(el.payType);
  })
  page.payTypeList = Array.from(payTypes);
}

const handleCheckAllChange = (val) => {
  if (val) {
    nodeValues.value.web.financialLevels = page.financials.map((financial) => financial.name);
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
    nodeValues.value.mobile.financialLevels = page.financials.map((financial) => financial.name);
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
