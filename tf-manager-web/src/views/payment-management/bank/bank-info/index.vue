<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="siteId.value"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="handleSiteChange()"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.bankName')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.bankCode')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadBankInfo"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:bank:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <!--        <el-button-->
        <!--          icon="el-icon-remove"-->
        <!--          size="mini"-->
        <!--          type="danger"-->
        <!--          v-permission="['sys:bank:del']"-->
        <!--          @click="removeBank()"-->
        <!--          :disabled="uiControl.removeBtn"-->
        <!--        >-->
        <!--          Delete-->
        <!--        </el-button>-->
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
      :close-on-press-escape="false"
    >
      <el-form
        ref="bankForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.bankType')" prop="bankType">
          <el-select
            v-model="form.bankType"
            :placeholder="t('fields.bankType')"
            style="width: 350px"
            filterable
            default-first-option
            @change="handleChange()"
          >
            <el-option
              v-for="b in uiControl.bankType"
              :key="b.key"
              :label="b.displayName"
              :value="b.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.bankName')" prop="name">
          <el-input
            :disabled="uiControl.dialogType !== 'CREATE'"
            v-model="form.name"
            style="width: 350px"
            @input="handleChange()"
          />
        </el-form-item>
        <el-form-item v-if="form.bankType === 'BANK'" :label="t('fields.bankCode')" prop="code">
          <el-input
            v-model="form.code"
            style="width: 350px"
            @input="handleChange()"
          />
        </el-form-item>
        <el-form-item v-if="form.bankType !== 'BANK'" :label="t('fields.bankCode')" prop="code">
          <el-select
            filterable
            clearable
            v-model="form.code"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px; margin-bottom: 16px"
            @change="handleChange()"
          >
            <el-option
              v-for="item in list.payTypes"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <!--表里有， 暂时不用 -->
        <!-- <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            clearable
            v-model="form.type"
            size="small"
            placeholder="Select Type"
            class="filter-item"
            style="width: 350px;margin-bottom: 16px"
            @change="handleChange()"
          >
            <el-option
              v-for="item in uiControl.type"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>-->
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-model="form.sequence"
            :min="0"
            controls-position="right"
            @change="handleChange()"
          />
        </el-form-item>

        <el-form-item :label="t('fields.icon')" prop="bankIcon">
          <el-row :gutter="24">
            <el-col v-if="form.bankIcon" :span="18" style="width: 250px">
              <el-image
                v-if="form.bankIcon"
                :src="paymentDir + form.bankIcon"
                fit="contain"
                class="preview"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage()"
              >
                {{ t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
          <!-- <input
            id="uploadFile"
            type="file"
            ref="input"
            style="display: none"
            accept="image/*"
            @change="attachPhoto($event)"
          >
          <el-button
            style="display: block"
            icon="el-icon-upload"
            size="mini"
            type="success"
            @click="$refs.input.click()"
          >
            Upload
          </el-button> -->
        </el-form-item>

        <el-form-item :label="t('fields.currency')" prop="currencyIds">
          <el-select
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            v-model="selected.currency"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px; margin-bottom: 16px"
            @change="handleChangeCurrencies()"
          >
            <el-option
              v-for="item in list.currencies"
              :key="item.id"
              :label="item.currencyCode"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="submit"
            :disabled="uiControl.dialogEditBtn"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="t('fields.icon')"
      v-model="uiControl.imageSelectionVisible"
      append-to-body
      width="50%"
      :close-on-press-escape="false"
    >
      <div class="search">
        <el-input
          v-model="imageRequest.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.imageName')"
        />
        <el-select
          v-model="imageRequest.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          ref="searchImage"
          @click="loadSiteImage"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetImageQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="grid-container">
        <div
          v-for="item in imageList.list"
          :key="item"
          class="grid-item"
          :class="item.id === selectedImage.id ? 'selected' : ''"
        >
          <el-image
            :src="paymentDir + item.path"
            fit="contain"
            style="aspect-ratio: 1/1"
            @click="selectImage(item)"
          />
        </div>
      </div>
      <el-pagination
        class="pagination"
        @current-change="changeImagePage"
        layout="prev, pager, next"
        :page-size="imageRequest.size"
        :page-count="imageList.pages"
        :current-page="imageRequest.current"
      />
      <div class="image-info" v-if="selectedImage.id !== 0">
        <el-row>
          <el-col :span="4">
            <h3>{{ t('fields.selectedImage') }}</h3>
          </el-col>
          <el-col :span="20">
            <el-image
              :src="paymentDir + selectedImage.path"
              fit="contain"
              class="smallPreview"
              :preview-src-list="[paymentDir + selectedImage.path]"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageSite') }} :</el-col>
          <el-col :span="20">{{ selectedImage.siteName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageName') }} :</el-col>
          <el-col :span="20">{{ selectedImage.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageRemark') }} :</el-col>
          <el-col :span="20">{{ selectedImage.remark }}</el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.imageSelectionVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitImage">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="name" :label="t('fields.bankName')" />
      <el-table-column prop="code" :label="t('fields.bankCode')" />
      <!--表里有， 暂时不用 -->
      <!-- <el-table-column prop="type" :label="t('fields.type')" /> -->
      <el-table-column
        prop="status"
        :label="t('fields.status')"
        v-if="hasPermission(['sys:bank:update:state'])"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeBankStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              formatter: 'YYYY/MM/DD HH:mm:ss',
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        type="title"
        :label="t('fields.action')"
        v-if="hasPermission(['sys:bank:update'])"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(scope.row)"
          />
          <!--          <el-button-->
          <!--            icon="el-icon-remove"-->
          <!--            size="mini"-->
          <!--            type="danger"-->
          <!--            v-permission="['sys:bank:del']"-->
          <!--            @click="removeBank(scope.row)"-->
          <!--          />-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  createBank,
  getBankInfoList,
  updateBank,
  updateBankStatus,
} from '../../../../api/bank-info'
import { getCurrencyCodes } from '../../../../api/currency'
import { getSiteListSimple } from '../../../../api/site'
import { getActivePaymentTypes } from '../../../../api/payment-type'
import { required } from '../../../../utils/validate'
import { hasRole, hasPermission } from '../../../../utils/util'
import { getSiteImage } from '../../../../api/site-image'
// import { uploadImage } from '../../../../api/image'
import { useStore } from '../../../../store';
import { TENANT } from "../../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const bankForm = ref(null)
const paymentDir = process.env.VUE_APP_IMAGE + '/payment/'

let bankName = ''
let bankCode = ''
let bankType = ''
let bankOrder = ''
let bankCurrencies = ''
let bankIcon = ''

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  dialogEditBtn: true,
  bankType: [
    { key: 1, displayName: 'Bank', value: 'BANK' },
    { key: 2, displayName: 'Crypto', value: 'CRYPTO' },
    { key: 3, displayName: 'Ewallet', value: 'EWALLET' },
  ],
  imageSelectionVisible: false,
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  code: null,
  currencyIds: null,
})
const siteId = reactive({
  value: null,
})
const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PAYMENT',
})

const sites = reactive({
  list: [],
})

const form = reactive({
  id: null,
  name: null,
  code: null,
  // type: null,
  sequence: 1,
  status: true,
  currencyIds: null,
  bankType: null,
  bankIcon: null,
})

const imageList = reactive({
  dataList: [],
  pages: 0,
})
const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

const page = reactive({
  pages: 0,
  records: [],
})

const list = reactive({
  currencies: [],
  payTypes: [],
  sites: [],
})

const selected = reactive({ currency: [] })

const formRules = reactive({
  name: [required(t('message.validateBankNameRequired'))],
  code: [required(t('message.validateBankCodeRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  currencyIds: [required(t('message.validateCurrencyCodeRequired'))],
  bankType: [required(t('message.validateBankTypeRequired'))],
  bankIcon: [required(t('message.validateIconRequired'))],
})

function resetQuery() {
  request.name = null
  request.code = null
}

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : null
}

function changePage(page) {
  request.current = page
  loadBankInfo()
}

// function handleSelectionChange(val) {
//   chooseBank = val
//   if (chooseBank.length === 0) {
//     uiControl.removeBtn = true
//   } else if (chooseBank.length === 1) {
//     uiControl.removeBtn = false
//   } else {
//     uiControl.removeBtn = false
//   }
// }

function showDialog(type) {
  if (type === 'CREATE') {
    if (bankForm.value) {
      bankForm.value.resetFields()
      form.id = null
    }
    uiControl.dialogTitle = t('fields.addBank')
    uiControl.dialogEditBtn = false
    form.bankType = uiControl.bankType[0].value
    clearEditFormOriginalValues()
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editBank')
    selected.currency = []
    uiControl.dialogEditBtn = true
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}
function handleChange() {
  if (!uiControl.dialogTitle.includes('Add')) {
    traceEditing()
  }
}

function handleChangeCurrencies() {
  form.currencyIds = selected.currency.join(',')
  if (!uiControl.dialogTitle.includes('Add')) {
    traceEditing()
  }
}

function handleSiteChange() {
  getCurrencyIds()
  loadBankInfo()
}

function traceEditing() {
  var countEditChange = 0
  let nameEdited = 0
  let codeEdited = 0
  let bankTypeEdited = 0
  let orderEdited = 0
  let iconEdited = 0
  let currencyEdited = 0
  if (bankName === form.name) {
    nameEdited = 0
  } else {
    nameEdited = 1
  }
  if (bankCode === form.code) {
    codeEdited = 0
  } else {
    codeEdited = 1
  }
  if (bankType === form.bankType) {
    bankTypeEdited = 0
  } else {
    bankTypeEdited = 1
  }
  if (bankOrder === form.sequence) {
    orderEdited = 0
  } else {
    orderEdited = 1
  }
  if (bankIcon === form.bankIcon) {
    iconEdited = 0
  } else {
    iconEdited = 1
  }

  // eslint-disable-next-line
  if (bankCurrencies.valueOf() == selected.currency.valueOf()) {
    currencyEdited = 0
  } else {
    currencyEdited = 1
  }

  countEditChange =
    nameEdited +
    codeEdited +
    orderEdited +
    currencyEdited +
    bankTypeEdited +
    iconEdited
  if (countEditChange > 0) {
    uiControl.dialogEditBtn = false
  } else {
    uiControl.dialogEditBtn = true
  }
}

function clearEditFormOriginalValues() {
  bankName = ''
  bankCode = ''
  bankType = ''
  bankOrder = ''
  bankCurrencies = ''
  bankIcon = ''
  selected.currency = []
}

function showEdit(banner) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in banner) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }

    bankName = form.name
    bankIcon = form.bankIcon
    bankCode = form.code
    bankType = form.bankType
    bankOrder = form.sequence
    bankCurrencies = form.currencyIds

    if (form.currencyIds !== null) {
      const arr = form.currencyIds.split(',')
      arr.forEach(element => {
        selected.currency.push(Number(element))
      })
    }
  })
}

async function loadBankInfo() {
  console.log('request', request)
  const { data: ret } = await getBankInfoList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function loadCurrency() {
  const { data: ret } = await getCurrencyCodes(request)
  list.currencies = ret
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes()
  list.payTypes = payType
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

async function changeBankStatus(id, state) {
  await updateBankStatus(id, state)
}

function create() {
  bankForm.value.validate(async valid => {
    if (valid) {
      await createBank(form)
      uiControl.dialogVisible = false
      await loadBankInfo()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  bankForm.value.validate(async valid => {
    if (valid) {
      await updateBank(form)
      uiControl.dialogVisible = false
      await loadBankInfo()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else {
    edit()
  }
}
function submitImage() {
  form.bankIcon = selectedImage.path
  uiControl.imageSelectionVisible = false
  traceEditing();
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

async function browseImage() {
  loadSiteImage()
  uiControl.imageSelectionVisible = true
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
  list.sites = ret
}

function getCurrencyIds() {
  site.value = list.sites.find(s => s.id === siteId.value)
  const currencyCodeList = site.value.currency.split(',').map(currencyName => currencyName);
  request.currencyIds = currencyCodeList.reduce((acc, currencyName) => {
    const currency = list.currencies.find(c => c.currencyCode.toUpperCase() === currencyName.toUpperCase());
    if (currency) {
      acc.push(currency.id);
    }
    return acc;
  }, []);

  request.currencyIds = request.currencyIds.join(',');
}

// async function attachPhoto(event) {
//   const files = event.target.files[0]
//   const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
//   const dirPayment = 'payment'

//   if (!allowFileType.find(ftype => ftype.includes(files.type))) {
//     ElMessage({ message: t('message.invalidFileType'), type: 'error' })
//   } else {
//     var formData = new FormData()
//     formData.append('files', files)
//     formData.append('dir', dirPayment)
//     formData.append('overwrite', false)
//     const data = await uploadImage(formData)
//     if (data.code === 0) {
//       var icon = data.data
//       form.bankIcon = icon
//       formRules.bankIcon = icon
//       traceEditing()
//     } else {
//       ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//     }
//   }
// }

// async function removeBank(card) {
//   ElMessageBox.confirm(
//     'Confirm that you want to delete these data, the action cannot be undone',
//     {
//       confirmButtonText: t('fields.confirm'),
//       cancelButtonText: t('fields.cancel'),
//       type: 'warning',
//     }
//   ).then(async () => {
//     if (card) {
//       await deleteBank([card.id])
//     } else {
//       await deleteBank(chooseBank.map(u => u.id))
//     }
//     await loadBankInfo()
//     ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
//   })
// }

onMounted(async () => {
  await loadCurrency()
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    sites.list = sites.list.find(s => s.siteName === store.state.user.siteName);
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    siteId.value = site.value.id
  } else {
    site.value = list.sites[0];
    siteId.value = site.value.id
  }

  getCurrencyIds()
  loadBankInfo()
  loadPayTypes()
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

.grid-container {
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transition: transform 0.5s;
}

.grid-item .el-image:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.grid-item.selected {
  box-shadow: 0 4px 8px rgba(12, 20, 242, 0.12), 0 0 6px rgba(12, 20, 242, 0.12);
  border: 1px solid blue;
}

.image-info {
  margin: 10px;
}

.image-info .el-row {
  margin-top: 10px;
}

.preview {
  width: 200px;
  height: 200px;
}

.smallPreview {
  width: 100px;
  height: 100px;
}
</style>
