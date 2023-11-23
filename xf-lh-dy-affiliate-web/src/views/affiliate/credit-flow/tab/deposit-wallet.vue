<template>
  <el-form @submit.prevent>
    <div class="inputs-wrap">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="t('fields.creditFlowType') + ' :'">
            <el-select
              v-model="type.selectedType"
              :placeholder="t('fields.all')"
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in type.getType"
                :key="item"
                :value="item"
                :label="t(`creditFlowType.${item}`)"
              >
                {{ $t(`creditFlowType.${item}`) }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="t('fields.creditFlowDate') + ' :'">
            <el-date-picker
              v-model="request.date"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="normal"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="btn-grp">
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="loadCreditFlow()"
              size="normal"
            >
              {{ $t('fields.search') }}
            </el-button>
            <el-button size="normal" type="warning" @click="resetQuery()">
              {{ $t('fields.reset') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-form>

  <el-table
    :data="page.records"
    ref="table"
    row-key="id"
    size="small"
    highlight-current-row
    v-loading="page.loading"
    style="margin-top: 15px; margin-left: 15px;"
    :empty-text="t('fields.noData')"
  >
    <el-table-column
      prop="id"
      :label="t('fields.creditFlowId')"
      align="center"
      width="75"
    />

    <el-table-column
      prop="date"
      :label="t('fields.creditFlowDate')"
      align="center"
    >
      <template #default="scope">
        <span v-if="scope.row.date === null">-</span>
        <span
          v-if="scope.row.date !== null"
          v-formatter="{
            data: scope.row.date,
            formatter: 'YYYY/MM/DD HH:mm:ss',
            type: 'date',
          }"
        />
      </template>
    </el-table-column>

    <el-table-column
      prop="serialNumber"
      :label="t('fields.serialNumber')"
      align="center"
    />

    <el-table-column
      :prop="type"
      :label="t('fields.creditFlowType')"
      align="center"
    >
      <template #default="scope">
        <span>{{ $t(`creditFlowType.${scope.row.type}`) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      :label="t('fields.creditFlowAmount')"
      align="center"
    />

    <el-table-column
      prop="balance"
      :label="t('fields.creditFlowBalance')"
      align="center"
    />
  </el-table>
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
import { reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'

import { getCreditFlow } from '../../../../api/affiliate-credit-flow'

const store = useStore()
const { t } = useI18n()

const type = reactive({
  selectedType: null,
  getType: [
    'DEPOSIT_WALLET_DEPOSIT',
    'DEPOSIT_WALLET_AFFILIATE_DEPOSIT',
    'DEPOSIT_WALLET_AMOUNT_ADJUST',
  ],
})

const request = reactive({
  siteId: null,
  affiliateId: null,
  category: null,
  type: null,
  date: null,
  size: 20,
  current: 1,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

async function loadCreditFlow() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.date != null) {
    if (request.date.length === 2) {
      query.date = request.date.join(',')
    }
  } else {
    query.date = null
  }

  query.affiliateId = store.state.user.id
  query.siteId = store.state.user.siteId
  query.category = 'DEPOSIT'
  query.size = 20

  const { data: ret } = await getCreditFlow(query)

  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function handleSelectChange() {
  request.type = type.selectedType
}

function resetQuery() {
  request.type = null
  request.date = null
  type.selectedType = null
  loadCreditFlow()
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadCreditFlow()
  }
}

onMounted(() => {
  loadCreditFlow()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-item {
  height: 110px;
  position: relative;
  border: 1px solid #f2f2f6;
  border-radius: 8px;
  padding: 20px;
}

.grid-item-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;

  span {
    font-size: 16px;
    font-weight: 600;
    color: #afb3c8;
  }
}

.grid-item-value {
  font-size: 16px;
  font-weight: 700;
}
</style>
