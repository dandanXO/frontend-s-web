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
          v-permission="['sys:promp:page:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:promp:page:del']"
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
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column prop="promoCode" :label="t('fields.code')" />
      <el-table-column prop="redirectUrl" :label="t('fields.redirect')" />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="labelType" :label="t('fields.label')">
        <template #default="scope">
          <div v-if="scope.row.labelType === 0">New</div>
          <div v-if="scope.row.labelType === 1">Hot</div>
          <div v-if="scope.row.labelType === 2">Normal</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" v-if="hasPermission(['sys:promp:page:update:state'])">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changePromoPagesState(scope.row.id, scope.row.status)"
          />
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
      <el-table-column type="title" :label="t('fields.action')" v-if="hasPermission(['sys:promp:page:update'])|| hasPermission(['sys:promp:page:del'])">
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
            v-permission="['sys:promp:page:del']"
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
  updatePromoPagesState,
  deletePromoPages,
} from '../../../../api/promoPages'
import { useRoute, useRouter } from 'vue-router'
import { getSiteListSimple } from '../../../../api/site'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store';
import { TENANT } from "../../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
let choosePromo = []
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  removeBtn: true,
  promoState: [
    { key: 1, displayName: 'active', value: true },
    { key: 2, displayName: 'disable', value: false },
  ],
})
const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null,
  siteId: null
})

const page = reactive({
  pages: 0,
  records: [],
})

function resetQuery() {
  request.title = null
  request.status = null
  request.siteId = site.value ? site.value.id : null;
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
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
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
}

const route = useRoute()

onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
  }
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadPromoPages();
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
</style>
