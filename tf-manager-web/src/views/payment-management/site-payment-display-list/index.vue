<template>
  <div class="roles-main">
    <div class="header-container">
      <el-select
        v-model="request.siteId"
        size="small"
        :placeholder="t('fields.site')"
        class="filter-item"
        style="width: 120px; margin-left: 5px"
        @change="loadPaymentRecord()"
      >
        <el-option
          v-for="item in siteList.list"
          :key="item.id"
          :label="item.siteName"
          :value="item.id"
        />
      </el-select>
    </div>

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
      style="margin-top:20px;overflow-x:scroll;width:100%"
      :row-style="{height: '80px'}"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        v-for="column in page.columns"
        :key="column.label"
        :prop="column.prop"
        :label="column.label"
      />
    </el-table>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getPaymentDisplayList } from '../../../api/payment-display'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const siteList = reactive({
  list: [],
})

const page = reactive({
  records: [],
  columns: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
})

async function loadPaymentRecord() {
  page.loading = true
  const { data: ret } = await getPaymentDisplayList(request.siteId)
  console.log(ret)
  page.records = ret.paymentDisplayListVOList
  page.columns = ret.paymentDisplayListColumnVOS
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function tableRowClassName({ row, rowIndex }) {
  console.log(row.data.d0)
  console.log(row.data.d0.includes('MOBILE'))
  if (row.data.d0.includes('MOBILE')) {
    return 'warning-row'
  }
  return ''
}

onMounted(async () => {
  await loadSites()

  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = 1
  }
  await loadPaymentRecord()
})
</script>

<style>
.el-table .cell {
  word-break: break-word;
  text-overflow: none;
}
.warning-row {
  color:#ff0000
}
</style>
