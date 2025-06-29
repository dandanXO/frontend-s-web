<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.sendTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
        />
        <el-select
          v-model="request.type"
          :placeholder="t('fields.type')"
          style="width: 150px; margin-left: 5px;"
          size="small"
          default-first-option
        >
          <el-option
            v-for="item in uiControl.searchType"
            :key="item.key"
            :label="t('messageType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.title"
          size="small"
          style="margin-left: 5px; width: 150px;"
          :placeholder="t('fields.title')"
        />
        <el-input
          v-model="request.sendFrom"
          size="small"
          style="margin-left: 5px; width: 150px;"
          :placeholder="t('fields.sendFrom')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSystemMessageTemplate"
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
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:site:pm:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:site:pm:del']"
          @click="removeSystemMessage()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="t(uiControl.dialogType === 'CREATE' ? 'fields.add' : 'fields.edit')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-select
          v-model="selected.site"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 540px; margin-bottom: 16px"
          @change="handleSiteChange()"
          :disabled="uiControl.dialogType === 'EDIT'"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-form-item :placeholder="t('fields.receiveType')" prop="receiveType">
          <el-radio-group
            v-model="form.receiveType"
            @change="handleRadioChangeLabel"
            class="form-input"
            style="width: 540px"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-radio
              v-for="r in uiControl.receiveType"
              :label="r.value"
              :key="r.value"
            >
              {{ r.typeName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <div
          v-if="form.receiveType === 'MULTIPLE' && uiControl.dialogType === 'CREATE'"
          class="el-input-tag input-tag-wrapper"
          :class="[uiControl.size ? 'el-input-tag--' + uiControl.size : '']"
          @click="foucusTagInput"
        >
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
            v-model="inputValue"
            :fetch-suggestions="debouncedFetchSuggestions"
            :trigger-on-focus="false"
            class="inline-input"
            :placeholder="t('fields.addRecipient')"
            style="outline: none; border: none"
            @select="handleSelect"
          />
        </div>
        <div style="float: right;">
          <el-button
            v-if="form.receiveType === 'MULTIPLE' && uiControl.dialogType === 'CREATE'"
            icon="el-icon-upload"
            size="mini"
            type="success"
            @click="showMassImport"
          >
            {{ t('fields.massImport') }}
          </el-button>
        </div>
        <!-- <el-form-item prop="recipient" v-if="form.receiveType === 'MULTIPLE'" /> -->
        <el-form-item prop="vip" v-if="form.receiveType === 'VIP'">
          <el-select
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            v-model="selected.vips"
            size="small"
            placeholder="VIP"
            class="filter-item"
            style="width: 540px; margin-bottom: 16px"
            @change="handleChangeVips()"
            v-if="uiControl.dialogType === 'CREATE'"
          >
            <el-option
              v-for="item in dropdownList.vip"
              :key="item.id"
              :label="item.name"
              :value="item.level"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="expiryTime">
          <el-radio-group v-model="uiControl.displayExpiryTime" @change="handleChangeExpiry">
            <el-radio :label="true">{{ t('fields.expiryTime') }}</el-radio>
            <el-radio :label="false">{{ t('fields.noExpiryTime') }}</el-radio>
          </el-radio-group>
          <el-date-picker
            v-if="uiControl.displayExpiryTime === true"
            v-model="form.expiryTime"
            size="small"
            type="datetime"
            placeholder="Expiry Time"
            style="width: 540px; margin-bottom: 16px"
          />
        </el-form-item>
        <el-form-item prop="popUp">
          <el-radio-group v-model="form.popUp">
            <el-radio :label="true">{{ t('fields.hasPopUp') }}</el-radio>
            <el-radio :label="false">{{ t('fields.noPopUp') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="type">
          <el-select
            style="width: 540px"
            v-model="form.type"
            :placeholder="t('fields.type')"
          >
            <el-option
              v-for="item in uiControl.type"
              :key="item.key"
              :label="t('messageType.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="title">
          <!-- <editor
            api-key="arlf5h2wcrqydmiiogww80cfx98khxd8o81s2i93qhq0n7wv"
            :init="{
              placeholder: 'Title',
              height: 150,
              width: 540,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar: 'undo redo | styles | bold italic'
            }"
            v-model="form.title"
          /> -->
          <Editor v-model:value="form.title" @input="getTitleInput" />
        </el-form-item>
        <el-form-item prop="content">
          <!-- <editor
            api-key="arlf5h2wcrqydmiiogww80cfx98khxd8o81s2i93qhq0n7wv"
            :init="{
              placeholder: 'Content',
              height: 500,
              width: 540,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar: 'undo redo | styles | bold italic | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'outdent indent | numlist bullist',
            }"
            v-model="form.content"
          /> -->
          <Editor v-model:value="form.content" @input="getContentInput" />
        </el-form-item>
        <el-form-item prop="redirectType">
          <el-select
            style="width: 540px"
            v-model="form.redirectType"
            :placeholder="t('fields.redirectType')"
          >
            <el-option
              v-for="item in uiControl.redirectType"
              :key="item.key"
              :label="t('pmRedirectType.' + item.value)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div v-if="form.redirectType !== 'NONE'">
          <el-form-item prop="redirectType">
            <el-input
              v-model="form.redirectUrl"
              size="small"
              :placeholder="t('fields.redirectUrl')"
              style="width: 540px"
            />
          </el-form-item>
          <el-form-item prop="redirectButton">
            <el-input
              v-model="form.redirectButton"
              size="small"
              :placeholder="t('fields.redirectButton')"
              style="width: 540px"
            />
          </el-form-item>
        </div>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="t('fields.massImport')"
      v-model="uiControl.importDialogVisible"
      append-to-body
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button
        v-if="uiControl.importDataOperatable"
        icon="el-icon-download"
        size="mini"
        type="primary"
        @click="downloadTemplate"
      >
        {{ t('fields.downloadTemplate') }}
      </el-button>
      <el-button
        v-if="uiControl.importDataOperatable"
        icon="el-icon-upload"
        size="mini"
        type="success"
        @click="chooseFile"
      >
        {{ t('fields.import') }}
      </el-button>
      <!-- eslint-disable -->
      <input
        id="importFile"
        type="file"
        accept=".xlsx, .xls"
        @change="importToTable"
        hidden
      />
      <div style="margin-top:5px;">
        <el-input
          v-model="importForm.loginName"
          size="small"
          :placeholder="t('fields.loginName')"
          class="filter-item"
          style="width: 120px;"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="showMembers(importForm.siteId, importForm.receiveRange)"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
      <el-table
        :data="
          importedPage.records.slice(
            importedPage.size * (importedPage.current - 1),
            importedPage.size * importedPage.current
          )
        "
        v-loading="importedPage.loading"
        ref="table"
        row-key="id"
        size="small"
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" width="150">
          <template #default="scope">
            <router-link
              :to="`/member/details/${scope.row.id}?site=${importForm.siteId}`"
              v-if="hasPermission(['sys:member:detail'])"
            >
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
            <span v-else> {{ scope.row.loginName }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="vipName" :label="t('fields.vipLevel')" width="150" />
        <el-table-column prop="financialName" :label="t('fields.financialLevel')" width="150" />
        <el-table-column v-if="uiControl.importDataOperatable" :label="t('fields.operate')"  width="100" >
          <template #default="scope">
            <el-button
              icon="el-icon-remove"
              size="mini"
              type="danger"
              @click="removeRecipient(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeImportedPage"
        layout="prev, pager, next"
        :page-size="importedPage.size"
        :page-count="importedPage.pages"
        :current-page="importedPage.current"
      />
      <div v-if="uiControl.importDataOperatable" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="importedPage.records.length === 0"
          @click="confirmImport"
          :loading="importedPage.buttonLoading"
        >
          {{ t('fields.confirmAndImport') }}
        </el-button>
        <el-button @click="clearImport">{{ t('fields.cancel') }}</el-button>
      </div>
    </el-dialog>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])"/>
      <el-table-column prop="siteName" :label="t('fields.site')" width="100"/>
      <el-table-column prop="type" :label="t('fields.type')" width="100">
        <template #default="scope">
          <span v-if="scope.row.type === null">-</span>
          <span v-else>{{ t('messageType.' + scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="redirectType" :label="t('fields.redirectType')" width="100">
        <template #default="scope">
          {{ t('pmRedirectType.' + scope.row.redirectType) }}
        </template>
      </el-table-column>
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column prop="content" :label="t('fields.content')" />
      <el-table-column prop="recipient" :label="t('fields.recipient')">
        <template #default="scope">
          <span v-if="scope.row.receiveType === 'ALL'"> {{ t('fields.allMembers') }} </span>
          <span v-else-if="scope.row.receiveType === 'VIP'"> {{ t('fields.selectedVIP') }} </span>
          <span v-else><el-link @click="showMembersDialog(scope.row.siteId, scope.row.receiveRange)">{{ t('fields.selectedMembers') + "(" + scope.row.recipient + ")" }}</el-link></span>
        </template>
      </el-table-column>
      <el-table-column prop="sendFrom" :label="t('fields.sendFrom')" />
      <el-table-column prop="sendTime" :label="t('fields.sendTime')">
        <template #default="scope">
          <span v-if="scope.row.sendTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.sendTime !== null"
            v-formatter="{
              data: scope.row.sendTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="150">
        <template #default="scope">
          {{ t('pmStatus.' + scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')"  width="200px;" >
        <template #default="scope">
          <div class="btn-group">
            <el-button
              icon="el-icon-remove"
              size="mini"
              type="danger"
              v-permission="['sys:site:pm:del']"
              @click="removeSystemMessage(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination
    class="pagination"
    @current-change="changePage"
    layout="prev, pager, next"
    :page-size="request.size"
    :page-count="page.pages"
    :current-page="request.current"
  />
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import * as XLSX from 'xlsx';
import { getMemberVipFin, getMemberVipFinById } from '../../../../api/member'
import { getSiteListSimple } from '../../../../api/site'
import {
  createSystemMessageTemplate,
  deleteMessageTemplate,
  getSystemMessageTemplate,
  updateSystemMessageTemplate
} from '../../../../api/site-pm'
import { getVipList } from '../../../../api/vip'
import { required } from '../../../../utils/validate'
import { hasPermission, hasRole } from '../../../../utils/util'
import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../../store/modules/user/action-types';
// import Editor from "@tinymce/tinymce-vue";
import Editor from '../../../../components/editor/index.vue'
import { debounce } from "lodash";
import { getMemberLoginNameList } from "../../../../api/system-message-template";
import moment from 'moment';

const store = useStore();
const { t } = useI18n();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const dialogForm = ref(null)
const siteList = reactive({
  list: []
});

const EXPORT_MESSAGE_LIST_HEADER = [
  '收件人（以逗号来区分）'
]

const IMPORT_MESSAGE_LIST_JSON = [
  'receiveRange'
]

const uiControl = reactive({
  dialogType: 'CREATE',
  dialogVisible: false,
  removeBtn: true,
  receiptInputVisible: false,
  receiveType: [
    { typeName: 'All', value: 'ALL' },
    { typeName: 'Specific Recipient', value: 'MULTIPLE' },
    { typeName: 'Specific VIP', value: 'VIP' },
  ],
  size: null,
  importDialogVisible: false,
  importDataOperatable: true,
  type: [
    { key: 1, displayName: 'NOTIFICATION', value: 'NOTIFICATION' },
    { key: 2, displayName: 'ACTIVITY', value: 'ACTIVITY' },
    { key: 3, displayName: 'ANNOUNCEMENT', value: 'ANNOUNCEMENT' },
    { key: 4, displayName: 'MATCH', value: 'MATCH' }
  ],
  searchType: [
    { key: 1, displayName: 'NOTIFICATION', value: 'NOTIFICATION' },
    { key: 2, displayName: 'ACTIVITY', value: 'ACTIVITY' },
    { key: 3, displayName: 'ANNOUNCEMENT', value: 'ANNOUNCEMENT' },
    { key: 4, displayName: 'MATCH', value: 'MATCH' },
    { key: 5, displayName: 'PAYMENT', value: 'PAYMENT' }
  ],
  redirectType: [
    { key: 1, displayName: 'None', value: 'NONE' },
    { key: 2, displayName: 'Inner', value: 'INNER' },
    { key: 3, displayName: 'Outer', value: 'OUTER' }
  ],
  displayExpiryTime: false
})

const importedPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  size: 10,
  current: 1,
  buttonLoading: false,
})

const importForm = reactive({
  siteId: null,
  loginName: "",
  receiveRange: null,
});

const startDate = new Date()
startDate.setDate(startDate.getDate() - 3)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  sendTime: [defaultStartDate, defaultEndDate],
  type: null,
  title: null,
  sendFrom: null,
})

function resetQuery() {
  request.sendTime = [defaultStartDate, defaultEndDate];
  request.type = null;
  request.siteId = siteList.list[0].id;
}

const form = reactive({
  id: null,
  receiveType: null,
  recipient: [],
  vip: null,
  title: null,
  content: null,
  type: null,
  siteId: null,
  expiryTime: null,
  popUp: false,
  redirectType: "NONE",
  redirectUrl: null,
  redirectButton: null,
})

const selected = reactive({
  receiveTypeRadio: ref(),
  site: ref(),
  vips: [],
})

const list = reactive({
  vips: [],
  members: [],
  sites: [],
})

const selectionList = reactive({
  members: [],
})

const dropdownList = reactive({
  vip: [],
})

let chooseMessage = []

const inputValue = ref('')
const dynamicTags = ref([])

const handleClose = tag => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  const selectionArr = [...selectionList.members]
  selectionArr.forEach(element => {
    if (element.value === tag) {
      list.members.splice(1, 0, element)
      list.members.sort(function (a, b) {
        return a.id - b.id
      })
      selectionList.members.splice(selectionList.members.indexOf(element), 1)
    }
  })
  inputValue.value = ''
}

const querySearch = async (queryString, callback) => {
  if (!queryString) {
    callback();
    return;
  } else if (queryString.length < 3) {
    callback();
    return;
  }

  try {
    const { data: ret } = await getMemberLoginNameList(selected.site, queryString);

    const results = ret.map(item => ({
      value: item.value,
      id: item.id
    }));
    callback(results);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    callback();
  }
}
// const createFilter = queryString => {
//   return item => {
//     return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
//   }
// }

const debouncedFetchSuggestions = debounce((queryString, callback) => {
  if (!selected.site) {
    ElMessage({ message: t('message.validateSiteRequired'), type: 'error' })
    return;
  }
  querySearch(queryString, callback);
}, 1500); // Adjust debounce time as needed

const handleSelect = item => {
  if (item) {
    if (dynamicTags.value.indexOf(item.value) === -1) {
      dynamicTags.value.push(item.value)
      const removed = list.members.splice(list.members.indexOf(item), 1)
      const removedArr = [...removed]
      selectionList.members.push(removedArr[0])
    }
  }
  inputValue.value = ''
}

const formRules = reactive({
  title: [required(t('message.validateSubjectRequired'))],
  content: [required(t('message.validateContentRequired'))],
  type: [required(t('message.validateTypeRequired'))]
})

function showDialog(type) {
  dynamicTags.value = []
  form.id = null
  form.receiveType = null
  form.recipient = []
  form.vip = null
  form.title = null
  form.content = null
  form.type = "NOTIFICATION"
  form.siteId = null
  selected.site = request.siteId
  selected.vips = []
  form.expiryTime = null
  form.popUp = false
  form.redirectType = "NONE"
  form.redirectUrl = null
  form.redirectButton = null
  uiControl.dialogType = type
  if (dialogForm.value) {
    dialogForm.value.resetFields()
  }
  form.receiveType = 'MULTIPLE'
  handleVipFilter()
  loadMemberNameList()
  uiControl.dialogVisible = true
}

// function showEdit(message) {
//   showDialog('EDIT')
//   nextTick(() => {
//     for (const key in message) {
//       if (Object.keys(form).find(k => k === key)) {
//         if (key === 'siteId') {
//           selected.site = message[key]
//         } else {
//           form[key] = message[key]
//         }
//       }
//     }
//   })
// }

async function showMembersDialog(siteId, receiveRange) {
  uiControl.importDialogVisible = true
  uiControl.importDataOperatable = false;
  importForm.loginName = ""
  importedPage.loading = true;
  await showMembers(siteId, receiveRange)
  importedPage.loading = false;
}

async function showMembers(siteId, receiveRange) {
  importForm.siteId = siteId;
  importForm.receiveRange = receiveRange;
  if (!importForm.loginName) {
    const { data: ret } = await getMemberVipFinById(importForm.siteId, importForm.receiveRange, " ");
    importedPage.records = ret;
  } else {
    const { data: ret } = await getMemberVipFinById(importForm.siteId, importForm.receiveRange, importForm.loginName);
    importedPage.records = ret;
  }
  importedPage.pages = Math.ceil(
    importedPage.records.length / importedPage.size
  );
}

async function showMassImport() {
  importForm.loginName = ""
  uiControl.importDialogVisible = true
  uiControl.importDataOperatable = true
  importedPage.records = []
  importedPage.pages = 0
  importedPage.loading = false
}

function handleRadioChangeLabel() {
  dynamicTags.value = []
  selectionList.members = []
  form.recipient = []
  form.title = null
  form.content = null

  if (selected.site !== undefined) {
    // reset the member name list (recipient input)
    loadMemberNameList()
  }
}

function handleSiteChange() {
  loadMemberNameList()
  handleVipFilter()
  selected.vip = null
}

function handleVipFilter() {
  dropdownList.vip = list.vips
  const newRecord = dropdownList.vip.filter(element => {
    return element.siteId === selected.site
  })
  dropdownList.vip = newRecord
}

function getTitleInput(value) {
  form.title = value
}

function getContentInput(value) {
  form.content = value
}

function submit() {
  dialogForm.value.validate(async valid => {
    if (valid) {
      if (uiControl.dialogType === 'CREATE') {
        if (form.receiveType === 'MULTIPLE') {
          form.recipient = dynamicTags.value;
          if (form.recipient.length === 0 && inputValue.value) {
            const members = inputValue.value.split(",");
            form.recipient.push(...members);
            inputValue.value = '';
          }
        } else if (form.receiveType === 'VIP') {
          form.recipient.push(form.vip)
        }
        if (form.receiveType !== 'ALL' && form.recipient.length === 0) {
          if (inputValue.value) {
            form.recipient.push(inputValue.value);
          } else {
            ElMessage({ message: t('message.validateRecipientRequired'), type: 'error' })
            return
          }
        }
        form.siteId = selected.site
        await createSystemMessageTemplate(form)
      } else {
        await updateSystemMessageTemplate(form)
      }
      uiControl.dialogVisible = false
      await loadSystemMessageTemplate()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function handleSelectionChange(val) {
  chooseMessage = val
  if (chooseMessage.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseMessage.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function handleChangeVips() {
  form.vip = selected.vips.join(',')
}

function removeRecipient(row) {
  const index = importedPage.records.indexOf(row)
  importedPage.records.splice(index, 1)
  importedPage.pages = Math.ceil(
    importedPage.records.length / importedPage.size
  );
}

async function removeSystemMessage(systemMessage) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (systemMessage) {
      await deleteMessageTemplate(systemMessage.siteId, [systemMessage.id])
    } else {
      await deleteMessageTemplate(request.siteId, chooseMessage.map(u => u.id))
    }
    await loadSystemMessageTemplate()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

const page = reactive({
  pages: 0,
  records: [],
})

async function loadSystemMessageTemplate() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.sendTime.length === 2) {
    query.sendTime = request.sendTime.join(',')
  }
  const { data: ret } = await getSystemMessageTemplate(query)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
      ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
      : null
  });
  page.records = ret.records
}

async function loadVipNameList() {
  const { data: ret } = await getVipList()
  // ret.forEach(function (entry) {
  //   var singleObj = {};
  //   singleObj.key = entry.id;
  //   singleObj.displayName = entry.name
  //   singleObj.value = entry.name;
  //   list.vips.push(singleObj);
  // });
  list.vips = ret
}

async function loadMemberNameList() {
  list.members = []
  const ret = [];
  ret.forEach(function (entry) {
    var singleObj = {}
    singleObj.id = entry.id
    singleObj.value = entry.value
    list.members.push(singleObj)
  })
}

async function loadSites() {
  list.sites = []
  const { data: ret } = await getSiteListSimple()
  siteList.list = ret;
  ret.forEach(function (entry) {
    var singleObj = {}
    singleObj.key = entry.id
    singleObj.displayName = entry.siteName
    singleObj.value = entry.id
    list.sites.push(singleObj)
  })
}

async function downloadTemplate() {
  const exportMessage = [EXPORT_MESSAGE_LIST_HEADER];
  const maxLengthMessage = [];
  const wsMessage = XLSX.utils.aoa_to_sheet(exportMessage);
  setWidth(exportMessage, maxLengthMessage);
  const wsMessageCols = maxLengthMessage.map(w => {
    return { width: w };
  });
  wsMessage['!cols'] = wsMessageCols;
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Message');
  wb.Sheets.Message = wsMessage;
  XLSX.writeFile(wb, 'message.xlsx');
}

function setWidth(exportData, maxLength) {
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key];

      maxLength[key] =
        typeof value === 'number'
          ? maxLength[key] >= 10
            ? maxLength[key]
            : 10
          : maxLength[key] >= value.length + 2
            ? maxLength[key]
            : value.length + 2
    });
  });
}

function chooseFile() {
  if (!selected.site) {
    ElMessage({ message: t('message.selectSiteFirst'), type: 'error' });
    return;
  }
  document.getElementById('importFile').click();
}

function importToTable(file) {
  importedPage.loading = true;
  importedPage.buttonLoading = false;
  const files = file.target.files[0];
  const allowFileType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  if (allowFileType.find(ftype => ftype.includes(files.type))) {
    const fileReader = new FileReader();

    fileReader.onload = async event => {
      const { result } = event.target;
      const workbook = XLSX.read(result, { type: 'binary' });
      let data = [];
      for (const sheet in workbook.Sheets) {
        data = data.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: IMPORT_MESSAGE_LIST_JSON,
            range: 1,
          })
        );
      }
      const loginNames = data[0].receiveRange;
      const { data: ret } = await getMemberVipFin(selected.site, loginNames);
      console.log(ret.length)
      importedPage.records = ret;
      importedPage.pages = Math.ceil(
        importedPage.records.length / importedPage.size
      );
      importForm.siteId = selected.site;
      console.log(ret.length)
      importForm.receiveRange = ret.map(e => e.id).join(',');
    }
    fileReader.readAsBinaryString(files);
    document.getElementById('importFile').value = '';
  } else {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' });
  }
  importedPage.loading = false;
}

function changeImportedPage(page) {
  importedPage.current = page;
}

function handleChangeExpiry(val) {
  uiControl.displayExpiryTime = val
  console.log(uiControl.displayExpiryTime)
  if (!val) {
    form.expiryTime = null;
  }
}

function clearImport() {
  uiControl.importDialogVisible = false;
  importedPage.buttonLoading = false;
  importedPage.loading = false;
  importedPage.records = [];
  importedPage.pages = 0;
  importedPage.current = 1;
  importForm.siteId = null;
}

async function confirmImport() {
  if (importedPage.records.length === 0) {
    ElMessage({ message: t('message.noDataToImport'), type: 'error' });
    return;
  }
  importedPage.buttonLoading = true;
  dynamicTags.value = importedPage.records.map(e => e.loginName);
  importedPage.buttonLoading = false;
  uiControl.importDialogVisible = false;
}

onMounted(async() => {
  await loadSites();
  await loadVipNameList();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id;
  }
  await loadSystemMessageTemplate()
})

function changePage(page) {
  request.current = page
  loadSystemMessageTemplate()
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.btn-group {
  margin-top: 15px;
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
.input-tag-wrapper {
  position: relative;
  font-size: 14px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  outline: none;
  padding: 0 10px 0 5px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  margin-bottom: 16px;
}

.el-tag {
  margin-right: 4px;
}

.tag-input {
  background: transparent;
  border: none !important;
  font-size: 14px;
  height: 40px;
  outline: none;
  padding-left: 0;
  width: 100px;
}

.el-input-tag--mini .tag-input {
  height: 28px;
  line-height: 28px;
}

.el-input-tag--small .tag-input {
  height: 32px;
  line-height: 32px;
}

.el-input-tag--medium .tag-input {
  height: 36px;
  line-height: 36px;
}

:deep(.el-autocomplete input) {
  /* input { */
  /* background-color: red!important;  调试用的样式 */
  outline: none !important;
  border: none !important;
}

.subCellDiv:not(.table-header),.subCellDiv:not(.table-header) .cell{
  padding: unset!important;
}
.subCell .subCellDiv{
  border-bottom: 1px solid #ebeef5;
  padding: 2px 12px;
}
.subCell .cell .subCellDiv:last-child{
  border-bottom: unset;
}
</style>
