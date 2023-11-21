<template>
  <div class="roles-main">
    <div class="inputs-wrap">
      <span>{{ $t('fields.creditFlowType') }} :</span>
      <el-select
        v-model="type.selectedType"
        :placeholder="t('fields.all')"
        @change="handleSelectChange"
      >
        <el-option
          v-for="item in type.getType"
          :key="item.id"
          :value="item.id"
          :label="item.title"
        >
          {{ item.title }}
        </el-option>
      </el-select>
      <span>{{ $t('fields.creditFlowDate') }} :</span>
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
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      style="margin-top: 15px; margin-left: 15px;"
    >
      <el-table-column
        prop="id"
        :label="t('fields.creditFlowId')"
        align="center"
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
        prop="typeName"
        :label="t('fields.creditFlowType')"
        align="center"
        width="200"
      />

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
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { getCreditFlowType } from '../../../../api/affiliate-credit-flow-type'
import { getCreditFlow } from '../../../../api/affiliate-credit-flow'

const { t } = useI18n()

const type = reactive({
  selectedType: null,
  getType: [],
})

const request = reactive({
  category: null,
  type: null,
  date: null,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

async function loadCreditFlowType() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  query.category = 'DEPOSIT'
  query.size = 50
  const { data: ret } = await getCreditFlowType(query)
  type.getType = ret.records

  loadCreditFlow()
}

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

onMounted(() => {
  loadCreditFlowType()
  loadCreditFlow()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.inputs-wrap {
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      height: 40px;
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
      &.el-range-editor--small.el-input__inner {
        max-width: unset;
      }
    }
  }
}
</style>
