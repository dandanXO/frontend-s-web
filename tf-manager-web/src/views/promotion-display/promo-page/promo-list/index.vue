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
            v-for="item in uiControl.promoState"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
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
        <el-select
          v-model="request.language"
          size="small"
          :placeholder="t('fields.language')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @focus="getLanguage"
        >
          <el-option
            v-for="item in languageList.list"
            :key="item"
            :label="t('language.' + item)"
            :value="item"
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
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadPromoPages"
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
          v-permission="['sys:promo:page:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:promo:page:del']"
          @click="removePromo()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="60" />
      <el-table-column prop="title" :label="t('fields.title')" min-width="200" />
      <el-table-column prop="promoCode" :label="t('fields.code')" min-width="150" />
      <el-table-column prop="redirectUrl" :label="t('fields.redirect')" min-width="150" />
      <el-table-column prop="siteName" :label="t('fields.site')" min-width="120" />
      <el-table-column prop="language" :label="t('fields.language')" align="center" min-width="120">
        <template #default="scope">
          <span v-if="scope.row.language">{{ t('language.' + scope.row.language) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="labelType" :label="t('fields.label')" min-width="80">
        <template #default="scope">
          <div v-if="scope.row.labelType === 0">{{ t('promoLabel.new') }}</div>
          <div v-if="scope.row.labelType === 1">{{ t('promoLabel.hot') }}</div>
          <div v-if="scope.row.labelType === 2">{{ t('promoLabel.normal') }}</div>
          <div v-if="scope.row.labelType === 3">{{ t('promoLabel.recomend') }}</div>
          <div v-if="scope.row.labelType === 4">{{ t('promoLabel.daily') }}</div>
          <div v-if="scope.row.labelType === 5">{{ t('promoLabel.newbie') }}</div>
          <div v-if="scope.row.labelType === 6">{{ t('promoLabel.limit') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" min-width="200">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            v-if="hasPermission(['sys:promo:page:update:state'])"
            @change="changePromoPagesState(scope.row.id, scope.row.status)"
          >
            <el-radio-button label="0">{{ t('common.status.OPEN') }}</el-radio-button>
            <el-radio-button label="1">{{ t('common.status.CLOSE') }}</el-radio-button>
            <el-radio-button label="2">{{ t('common.status.TEST') }}</el-radio-button>
          </el-radio-group>
          <div v-else>
            <div v-if="scope.row.status === 0" style="color: green;">{{ t('common.status.OPEN') }}</div>
            <div v-if="scope.row.status === 1" style="color:red">{{ t('common.status.CLOSE') }}</div>
            <div v-if="scope.row.status === 2">{{ t('common.status.TEST') }}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="showFastAccess" :label="t('fields.showFastAccess')" min-width="200">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.showFastAccess"
            size="mini"
            v-if="hasPermission(['sys:promp:page:update:state'])"
            @change="changeFastAccessState(scope.row.id, scope.row.showFastAccess)"
          >
            <el-radio-button label="1">OPEN</el-radio-button>
            <el-radio-button label="0">CLOSE</el-radio-button>
          </el-radio-group>
          <div v-else>
            <div v-if="scope.row.showFastAccess === 1" style="color: green;">OPEN</div>
            <div v-if="scope.row.showFastAccess === 0" style="color:red">CLOSED</div>
          </div>
        </template>
      </el-table-column> -->
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
              @change="changeFastAccessState(scope.row.id, scope.row.showFastAccess)"
            />
          </div>
          <div v-else>
            <div v-if="scope.row.showFastAccess === 1" style="color: green;">OPEN</div>
            <div v-if="scope.row.showFastAccess === 0" style="color:red">CLOSED</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fastAccessSeq" :label="t('fields.fastAccessSeq')" width="60" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" min-width="80" />
      <el-table-column
        type="title"
        :label="t('fields.action')"
        v-if="
          hasPermission(['sys:promp:page:update']) ||
            hasPermission(['sys:promo:page:del'])
        "
        min-width="200"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:promp:page:update']"
            @click="editPromo(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:promo:page:del']"
            @click="removePromo(scope.row)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getPromoPagesList,
  deletePromoPages,
  updatePromoPagesState,
  updateFastAccessState
} from '../../../../api/promoPages'
import { useRoute, useRouter } from 'vue-router'
import { getSiteListSimple } from '../../../../api/site'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { isVnm } from '@/utils/site'
import { getConfigList } from '@/api/config'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
let choosePromo = []
const siteList = reactive({
  list: [],
})
const languageList = reactive({
  list: []
})

const uiControl = reactive({
  removeBtn: true,
  promoState: [
    { key: 1, displayName: 'active', value: false },
    { key: 2, displayName: 'disable', value: true },
  ],
  showSiteType: false,
})

const siteType = reactive({
  list: [
    { displayName: t('siteType.main'), value: 'main' },
    { displayName: t('siteType.slot'), value: 'slot' },
  ],
})

const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null,
  siteId: null,
  siteType: null,
  language: null
})

const page = reactive({
  pages: 0,
  records: [],
})

function resetQuery() {
  request.title = null
  request.status = null
  request.siteType = "main"
  request.siteId = store.state.user.siteId
  request.language = null
  uiControl.showSiteType = false;
}

function changePage(page) {
  request.current = page
  loadPromoPages()
}

const router = useRouter()
function showDialog(type) {
  if (type === 'CREATE') {
    router.push({
      name: 'Add Promo',
    })
  }
}

function handleSelectionChange(val) {
  choosePromo = val
  if (choosePromo.length === 0) {
    uiControl.removeBtn = true
  } else if (choosePromo.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function editPromo(promoPages) {
  if (!promoPages) {
    promoPages = choosePromo[0]
  }
  router.push({
    name: 'Edit Promo',
    params: { id: promoPages.id },
  })
}

async function loadPromoPages() {
  const { data: ret } = await getPromoPagesList(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function removePromo(promoPages) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (promoPages) {
      await deletePromoPages([promoPages.id])
    } else {
      await deletePromoPages(choosePromo.map(u => u.id))
    }
    await loadPromoPages()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changePromoPagesState(id, status) {
  await updatePromoPagesState(id, status)
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  await loadPromoPages()
}

async function changeFastAccessState(id, status) {
  await updateFastAccessState(id, status)
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  await loadPromoPages()
}

async function getLanguage() {
  languageList.list = []
  const { data: lang } = await getConfigList("language_list", request.siteId)
  if (lang[0].value) {
    const arr = lang[0].value.split(',')
    for (const a of arr) {
      languageList.list.push(a)
    }
  }
}

// async function changeSite() {
//   request.siteType = 'main'
//   if (isVnm(request.siteId)) {
//     uiControl.showSiteType = true;
//   } else {
//     uiControl.showSiteType = false;
//   }
// }

const route = useRoute()

onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
  }
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  if (isVnm(request.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
  request.siteType = "main";
  await getLanguage()
  await loadPromoPages()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-radio-button--mini .el-radio-button__inner{
  padding: 7px 10px !important;
}
</style>
