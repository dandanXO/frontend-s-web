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
      <!-- <el-table-column :key="a" :prop="paymentId" :label="null"></el-table-column> -->
    </el-table>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getAllPayments,
  getPaymentShow,
  getPaymentShowDetails,
} from '../../../api/payment-display'
import { getSiteListSimple } from '../../../api/site'
import { getFinancialLevels } from '../../../api/financial-level'
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
const financialLevels = ref([])
const paymentList = ref([])
const payment = ref([])
const paymentDetails = ref([])
async function loadPaymentRecord() {
  page.loading = true
  const { data: records } = await getAllPayments({
    status: 'OPEN',
    siteId: request.siteId,
  })
  const { data: nodes } = await getPaymentShow({
    siteId: request.siteId
  })
  const { data: nodeDetails } = await getPaymentShowDetails({
    siteId: request.siteId
  })
  paymentList.value = records
  payment.value = nodes
  paymentDetails.value = nodeDetails
  await loadFinancialLevels()
  loadTable()
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function tableRowClassName({ row, rowIndex }) {
  if (row.financial.includes('MOBILE')) {
    return 'warning-row'
  }
}
async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({
    siteId: request.siteId,
  })
  financialLevels.value = financial
}

function loadTable() {
  var paymentTypes = []
  var paymentNames = []
  page.columns = [{
    label: 'Level',
    prop: 'financial'
  }];
  page.records = []
  paymentList.value.forEach(element => {
    if (!paymentTypes.includes(element.payType)) {
      paymentTypes.push(element.payType);
      const obj = {
        label: element.payType,
        prop: element.payType
      };
      page.columns.push(obj);
    }
    if (!paymentNames.includes(element.paymentName)) {
      paymentNames.push(element.paymentName);
    }
  });
  var webTableFormatted = []
  var mobileTableFormatted = []
  paymentDetails.value.forEach((element, pidx) => {
    const payments = paymentList.value.find(el => el.id === element.web.paymentId);
    if (payments) {
      var obj = {
        type: element.web.type,
        paymentId: element.web.paymentId,
        financialLevels: element.web.financialLevels.replace(/\s/g, '').split(','),
        paymentName: payments.paymentName,
      };
      webTableFormatted.push(obj)

      // Get the index of obj.type from paymentTypes
      paymentTypes.forEach((pType, idx, obj) => {
        if (pType === element.web.type) {
          obj.splice(idx, 1)
        }
      });
      paymentTypes.forEach(payType => {
        obj = {
          type: payType,
          paymentId: element.web.paymentId,
          financialLevels: element.web.financialLevels.replace(/\s/g, '').split(','),
          paymentName: null,
        }
        webTableFormatted.push(obj)
      });
    }
  });
  paymentDetails.value.forEach((element, pidx) => {
    const payments = paymentList.value.find(el => el.id === (element.mobile.paymentId));
    if (payments) {
      var obj = {
        type: element.mobile.type,
        paymentId: element.mobile.paymentId,
        financialLevels: element.mobile.financialLevels.replace(/\s/g, '').split(','),
        paymentName: payments.paymentName,
      };
      mobileTableFormatted.push(obj)
      // Get the index of obj.type from paymentTypes
      paymentTypes.forEach((pType, idx, obj) => {
        if (pType === element.mobile.type) {
          obj.splice(idx, 1)
        }
      });
      paymentTypes.forEach(payType => {
        obj = {
          type: payType,
          paymentId: element.mobile.paymentId,
          financialLevels: element.mobile.financialLevels.replace(/\s/g, '').split(','),
          paymentName: null,
        }
        mobileTableFormatted.push(obj)
      });
    }
  });

  financialLevels.value.forEach((fLevel, findex) => {
    const webObj = { financial: fLevel.name + ' (WEB)' };
    const mobileObj = { financial: fLevel.name + ' (MOBILE)' };
    webTableFormatted.forEach(element => {
      if (element.financialLevels[findex] === '1' && webObj.financial.includes('WEB')) {
        webObj[element.type] = element.paymentName
      } else {
        console.log(webObj[element.type])
        webObj[element.type] = '未分配'
      }
      if (!webObj[element.type]) {
        webObj[element.type] = '未分配'
      }
    });
    mobileTableFormatted.forEach(element => {
      if (element.financialLevels[findex] === '1' && mobileObj.financial.includes('MOBILE')) {
        mobileObj[element.type] = element.paymentName
      } else {
        mobileObj[element.type] = '未分配'
      }
      if (!mobileObj[element.type]) {
        mobileObj[element.type] = '未分配'
      }
    });

    page.records.push(webObj);
    page.records.push(mobileObj);
  });
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
