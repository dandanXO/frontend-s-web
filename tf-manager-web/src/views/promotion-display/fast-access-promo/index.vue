<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.title')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
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
          @click="loadFastAccessPromo"
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
          v-permission="['sys:fast-access-promo:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="750px"
    >
      <el-form
        ref="bannerForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <el-form-item :label="t('fields.promo')" prop="promoPageId">
          <el-select
            v-model="form.promoPageId"
            size="small"
            :placeholder="t('message.selectPromo')"
            style="width: 350px;"
            @focus="loadsimplePromoPages"
          >
            <el-option
              v-for="item in promoPage.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px"
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
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.countDown')" prop="countDown">
              <el-switch
                v-model="form.countDown"
                active-color="#409EFF"
                inactive-color="#F56C6C"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="t('fields.buttonMode')" prop="buttonMode">
              <el-radio-group v-model="form.buttonMode" @change="showAndResetButtonMode">
                <el-radio
                  v-for="b in uiControl.buttonMode"
                  :key="b.key"
                  :label="b.value"
                >
                  {{ b.displayName }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="uiControl.initApiUrlVisible" :label="t('fields.initApiUrl')" prop="initApiUrl">
              <el-input
                v-model="form.initApiUrl"
                style="width: 350px"
                :controls="false"
              />
            </el-form-item>
            <el-form-item v-if="uiControl.claimApiUrlvisible" :label="t('fields.claimApiUrl')" prop="claimApiUrl">
              <el-input
                v-model="form.claimApiUrl"
                style="width: 350px"
                :controls="false"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
    >
      <el-table-column type="selection" />
      <el-table-column prop="title" :label="t('fields.name')" />
      <!-- <el-table-column prop="status" :label="t('fields.status')" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'OPEN'" type="success">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'CLOSE'" type="danger">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'TEST'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="status" :label="t('fields.status')" min-width="150">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            :readony="true"
          >
            <el-radio-button label="0">{{ t('common.status.OPEN') }}</el-radio-button>
            <el-radio-button label="1">{{ t('common.status.CLOSE') }}</el-radio-button>
            <el-radio-button label="2">{{ t('common.status.TEST') }}</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="showFastAccess"
        :label="t('fields.showFastAccess')"
        min-width="100"
      >
        <template #default="scope">
          <div v-if="hasPermission(['sys:promp:page:update:state'])">
            <el-switch
              v-model="scope.row.showFastAccess"
              :active-value="1"
              :inactive-value="0"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeFastAccessState(scope.row.promoPageId, scope.row.showFastAccess)"
            />
          </div>
          <div v-else>
            <div v-if="scope.row.showFastAccess === 1" style="color: green;">OPEN</div>
            <div v-if="scope.row.showFastAccess === 0" style="color:red">CLOSED</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="title" :label="t('fields.action')"
                       width="150"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:fast-access-promo:update']"
            @click="showEdit(scope.row)"
          />
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
/* eslint-disable */
import {ElMessage, ElMessageBox} from 'element-plus'
import {computed, nextTick, onMounted, reactive, ref} from 'vue'
import {getSiteListSimple} from '../../../api/site'
import {required} from '../../../utils/validate'
import {useStore} from '../../../store';
import {TENANT} from "../../../store/modules/user/action-types";
import {useI18n} from "vue-i18n";
import { getFastAccessPromo, createFastAccessPromo, updateFastAccessPromo } from '../../../api/fast-access-promo'
import { getSimplePromoPageList, updateFastAccessState } from '../../../api/promoPages'
import { hasPermission } from "@/utils/util";

const {t} = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const bannerForm = ref(null)
const siteList = reactive({
  list: [],
})
const promoPage = reactive({
  list: [],
})
let timeZone = null;

const uiControl = reactive({
  dialogVisible: false,
  initApiUrlVisible:false, 
  claimApiUrlvisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  dateRangeType: "1",
  status: [
    { key: 1, displayName: t('common.status.OPEN'), value: 0 },
    { key: 2, displayName: t('common.status.CLOSE'), value: 1 },
    { key: 3, displayName: t('common.status.TEST'), value: 2 },
  ],
  buttonMode: [
    { key: 1, displayName: t('fastAccessButtonMode.DETAILS'), value: 'DETAILS' },
    { key: 2, displayName: t('fastAccessButtonMode.API_REDIRECT'), value: 'API_REDIRECT' },
    { key: 3, displayName: t('fastAccessButtonMode.API_CLAIM'), value: 'API_CLAIM' }
  ],
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  status: null,
  siteId: null,
})

const form = reactive({
  id: null,
  promoPageId: null,
  siteId: null,
  buttonMode: 'DETAILS',
  countDown: false,
  initApiUrl: null,
  claimApiUrl: null
})


const page = reactive({
  pages: 0,
  records: [],
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  buttonMode: [required(t('message.validateNameRequired'))],
  promoPageId: [required(t('message.validateCodeRequired'))]
})

function resetQuery() {
  request.name = null
  request.status = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

function changePage(page) {
  request.current = page
  loadFastAccessPromo()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bannerForm.value) {
      bannerForm.value.resetFields()
      resetAllButtonModeAmount()
      showButtonModeField()
    }
    bannerForm.gameTypes = null
    uiControl.dialogTitle = t('fields.addFastAccessPromo')
  } else {
    uiControl.dialogTitle = t('fields.editFastAcesssPromo')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(banner) {
  showDialog('EDIT')
  if (!banner) {
    banner = chooseBanner[0]
  }
  nextTick(() => {
    for (const key in banner) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteName === banner.siteName) {
        form.siteId = element.id
      }
    })

    timeZone = siteList.list.find(e => e.id === form.siteId).timeZone;
    showButtonModeField()
  })
}

async function loadFastAccessPromo() {
  const {data: ret} = await getFastAccessPromo(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.id === data.siteId) !==
      undefined
        ? store.state.user.sites.find(e => e.id === data.siteId)
          .timeZone
        : null
  })
  page.records = ret.records
}

async function loadSites() {
  const {data: site} = await getSiteListSimple()
  siteList.list = site
}

async function loadsimplePromoPages() {
  const {data: resp} = await getSimplePromoPageList(request.siteId)
  console.log(resp)
  promoPage.list = resp
}


async function removeBanner(banner) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (banner) {
      // await deleteHomeBanner([banner.id])
    } else {
      // await deleteHomeBanner(chooseBanner.map(u => u.id))
    }
    await loadFastAccessPromo()
    ElMessage({message: t('message.deleteSuccess'), type: 'success'})
  })
}

function create() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      await createFastAccessPromo(form)
      uiControl.dialogVisible = false
      await loadFastAccessPromo()
      ElMessage({message: t('message.addSuccess'), type: 'success'})
    }
  })
}

function showAndResetButtonMode() {
  showButtonModeField()
  resetAllButtonModeAmount()
}

function showButtonModeField() {
  switch(form.buttonMode){
    case 'DETAILS': uiControl.initApiUrlVisible = false;
                uiControl.claimApiUrlvisible = false;
                  break;
    case 'API_REDIRECT': uiControl.initApiUrlVisible = true
                  uiControl.claimApiUrlvisible = false;
                  break;
    case 'API_CLAIM': uiControl.initApiUrlVisible = true;
                uiControl.claimApiUrlvisible = true;
                  break;
  }
}

function resetAllButtonModeAmount(){
  form.initApiUrl = null;
  form.claimApiUrl = null;
  form.buttonMode = 'DETAILS'
  form.id = null;
  form.promoPageId = null;
}

function edit() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      await updateFastAccessPromo(form)
      uiControl.dialogVisible = false
      await loadFastAccessPromo()
      ElMessage({message: t('message.editSuccess'), type: 'success'})
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

async function changeFastAccessState(id, status) {
  await updateFastAccessState(id, status)
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  await loadPromoPages()
}


// async function changePromoCodeRedeemConfigStatus(id, status) {
//   await updateFastAccessPromoStatus(id, status)
//   ElMessage({ message: t('message.updateSuccess'), type: 'success' })
//   await loadFastAccessPromo()
// }

onMounted(async () => {
  await loadSites();
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadsimplePromoPages()
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

.grid-table {
  margin: 10px 0px 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  .el-button {
    width: 120px;
  }

  .el-input {
    width: 100%;
  }

  .multi-lists {
    border-radius: 4px;
    border: 1px solid #acacac;
    padding: 8px 4px;
    min-height: 40px;

    &.red-box {
      border: 1px solid #ff0000;
    }

    .multi-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .btn-pointer {
    cursor: pointer;
  }

}

.dialog-label {
  color: #EE9230;
  font-size: 13px;
  padding-bottom: 5px;
  display: block;
}
</style>
