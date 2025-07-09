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
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.adsStatus"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="changeSite"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-select
          v-if="uiControl.showSiteType === true"
          v-model="request.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 120px;margin-left:5px"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAdsPopoutList"
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
          v-permission="['sys:promo:ads-popout:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:promo:ads-popout:del']"
          @click="removeAdsPopout()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="adsPopoutForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input
            v-model="form.title"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            v-model="form.type"
            size="small"
            :placeholder="t('fields.frequency')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.type"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.desktopImage')" prop="desktopImgUrl" v-if="form.type === 'IMG'">
          <el-row :gutter="10">
            <el-col :span="22">
              <el-input :readonly="true" v-model="form.desktopImgUrl" />
            </el-col>
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadDesktopFile"
                type="file"
                ref="inputDesktop"
                style="display: none"
                accept="image/*"
                @change="attachDesktopImg"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputDesktop.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.mobileImage')" prop="mobileImgUrl" v-if="form.type === 'IMG'">
          <el-row :gutter="10">
            <el-col :span="22">
              <el-input :readonly="true" v-model="form.mobileImgUrl" />
            </el-col>
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadMobileFile"
                type="file"
                ref="inputMobile"
                style="display: none"
                accept="image/*"
                @change="attachMobileImg"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputMobile.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.content')" prop="content" v-if="form.type === 'TEXT'">
          <el-input
            v-model="form.content"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.redirect')" prop="v">
          <el-input v-model="form.path" style="width: 350px" />
        </el-form-item>
        <!-- <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-model="form.sequence"
            :min="1"
            controls-position="right"
            @change="handleChange"
          />
        </el-form-item> -->
        <el-form-item :label="t('fields.frequency')" prop="frequency">
          <el-select
            v-model="form.frequency"
            size="small"
            :placeholder="t('fields.frequency')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.frequency"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column prop="frequency" :label="t('fields.frequency')" />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="status" :label="t('fields.status')" min-width="200">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            v-if="hasPermission(['sys:promo:ads-popout:update:state'])"
            @change="changeAdsStatus(scope.row)"
          >
            <el-radio-button label="1">{{ t('common.status.OPEN') }}</el-radio-button>
            <el-radio-button label="0">{{ t('common.status.CLOSE') }}</el-radio-button>
            <el-radio-button label="2">{{ t('common.status.TEST') }}</el-radio-button>
          </el-radio-group>
          <div v-else>
            <div v-if="scope.row.status === 0" style="color:red">{{ t('common.status.CLOSE') }}</div>
            <div v-if="scope.row.status === 1" style="color: green;">{{ t('common.status.OPEN') }}</div>
            <div v-if="scope.row.status === 2">{{ t('common.status.TEST') }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column type="title" :label="t('fields.action')" v-if="hasPermission(['sys:promo:ads-popout:update'])|| hasPermission(['sys:promo:ads-popout:del'])">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:promo:ads-popout:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:promo:ads-popout:del']"
            @click="removeAdsPopout(scope.row)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deleteAdsPopout,
  getAdsPopoutList,
  updateAdsPopoupStatus
} from '../../../../api/site-ads-popout'
import { uploadImage } from '../../../../api/image'
import { getSiteListSimple } from '../../../../api/site'
import { required } from '../../../../utils/validate'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store';
import { TENANT } from "../../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { isVnm } from '@/utils/site'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const inputDesktop = ref(null)
const inputMobile = ref(null)
const adsPopoutForm = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  adsStatus: [
    { key: 1, displayName: t('common.status.OPEN'), value: 1 },
    { key: 2, displayName: t('common.status.CLOSE'), value: 0 },
    { key: 3, displayName: t('common.status.TEST'), value: 2 },
  ],
  // type: [
  //   { key: 1, displayName: '文字', value: 'TEXT' },
  //   { key: 2, displayName: '图片', value: 'IMG' },
  // ],
  frequency: [
    { key: 1, displayName: t('message.frequencyEveryTime'), value: 'EVERYTIME' },
    { key: 2, displayName: t('message.frequencyEveryDay'), value: 'EVERYDAY' },
    { key: 3, displayName: t('message.frequencyEverySession'), value: 'SESSION' },
  ],
  showSiteType: false,
})

const siteType = reactive({
  list: [
    { displayName: t('siteType.main'), value: 'main' },
    { displayName: t('siteType.slot'), value: 'slot' },
  ],
})

let chooseAdsPopout = []

const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null,
  siteId: null,
  siteType: null,
})

const form = reactive({
  id: null,
  title: null,
  desktopImgUrl: null,
  mobileImgUrl: null,
  path: null,
  sequence: null,
  frequency: null,
  siteId: null,
  type: null,
  content: null,
  status: true,
})

const page = reactive({
  pages: 0,
  records: [],
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  // desktopImgUrl: [required(t('message.validateDesktopImageRequired'))],
  // mobileImgUrl: [required(t('message.validateMobileImageRequired'))],
  path: [required(t('message.validateRedirectRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  frequency: [required(t('message.validateFrequencyRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  type: [required(t('message.validateAdsTypeRequired'))],
})

function resetQuery() {
  request.title = null
  request.status = null
  request.siteId = store.state.user.siteId
  if (isVnm(request.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
  request.siteType = "main"
}

function changePage(page) {
  request.current = page
  loadAdsPopoutList()
}

function showDialog(type) {
  if (type === 'CREATE') {
    router.push({
      name: 'Add Ads Popout',
    })
  }
  // if (type === 'CREATE') {
  //   if (adsPopoutForm.value) {
  //     adsPopoutForm.value.resetFields()
  //     form.content = null;
  //     form.path = null;
  //     form.type = uiControl.type[0].value;
  //     console.log(form.type)
  //     form.id = null
  //   }
  //   uiControl.dialogTitle = t('fields.addAds')
  // } else {
  //   uiControl.dialogTitle = t('fields.editAds')
  // }
  // uiControl.dialogType = type
  // uiControl.dialogVisible = true
}

// async function changeSite() {
//   request.siteType = 'main'
//   if (isVnm(request.siteId)) {
//     uiControl.showSiteType = true;
//   } else {
//     uiControl.showSiteType = false;
//   }
// }

// function handleChange() {}

function handleSelectionChange(val) {
  chooseAdsPopout = val
  if (chooseAdsPopout.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseAdsPopout.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

const router = useRouter()

const route = useRoute()
function showEdit(adspopout) {
  if (!adspopout) {
    adspopout = chooseAdsPopout[0]
  }
  router.push({
    name: 'Edit Ads Popout',
    params: { id: adspopout.id },
  })

  // showDialog('EDIT')
  // if (!adspopout) {
  //   adspopout = chooseAdsPopout[0]
  // }
  // nextTick(() => {
  //   for (const key in adspopout) {
  //     if (Object.keys(form).find(k => k === key)) {
  //       form[key] = adspopout[key]
  //     }
  //   }
  //   siteList.list.forEach(element => {
  //     if (element.siteName === adspopout.siteName) {
  //       form.siteId = element.id
  //     }
  //   })
  // })
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dir = 'promo'
  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dir)
    formData.append('overwrite', false)
    return await uploadImage(formData)
  }
}

async function attachDesktopImg(event) {
  const data = await attachPhoto(event);
  if (data.code === 0) {
    form.desktopImgUrl = data.data
    inputDesktop.value.value = ""
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function attachMobileImg(event) {
  const data = await attachPhoto(event);
  if (data.code === 0) {
    form.mobileImgUrl = data.data
    inputMobile.value.value = ""
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function loadAdsPopoutList() {
  const { data: ret } = await getAdsPopoutList(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
      ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
      : null
  });
  console.log(page)
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function removeAdsPopout(adspopout) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (adspopout) {
      await deleteAdsPopout([adspopout.id])
    } else {
      await deleteAdsPopout(chooseAdsPopout.map(u => u.id))
    }
    await loadAdsPopoutList()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changeAdsStatus(row) {
  try{
    
    await updateAdsPopoupStatus(row.id, row.status, row.siteType)
    ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    await loadAdsPopoutList();
    
  }catch(error) {
    await loadAdsPopoutList();
    ElMessage({ message: t('message.updateFailed'), type: 'error' })
    return;
  }
  
}

onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
  }
  await loadSites();
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  if (isVnm(request.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
  request.siteType = "main";
  await loadAdsPopoutList();
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
