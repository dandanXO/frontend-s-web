<template>
  <div class="page-container">
    <div class="panel-item">
      <div class="panel-header">{{ $t('fields.downlineAffiliate') }}</div>
      <div class="inputs-wrap">
        <el-form @submit.prevent inline="true">
          <el-form-item :label="t('fields.loginName') + ' :'">
            <el-input
              class="input-small"
              v-model="request.loginName"
              maxlength="50"
              :placeholder="t('fields.loginName')"
              size="normal"
            />
          </el-form-item>
          <el-form-item :label="t('fields.registerTime') + ' :'">
            <el-date-picker
              v-model="request.regTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="normal"
              class="input-small"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :shortcuts="shortcuts"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item>
            <div class="grp-btn">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="search()"
                size="normal"
              >
                {{ $t('fields.search') }}
              </el-button>
              <el-button
                size="normal"
                type="primary"
                plain
                @click="resetQuery()"
              >
                {{ $t('fields.reset') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="normal"
          type="primary"
          @click="showDialog('CREATE')"
        >
          {{ $t('fields.registerAffiliate') }}
        </el-button>
      </div>
      <!-- <table cellpadding="0" cellspacing="0" border class="custom-table">
        <thead>
          <tr>
            <th>{{ t('fields.loginName') }}</th>
            <th>{{ t('fields.affiliateCode') }}</th>
            <th>{{ t('fields.affiliateLevel') }}</th>
            <th>{{ t('fields.commission') }}</th>
            <th>{{ t('fields.totalDownlineMember') }}</th>
            <th>{{ t('fields.totalDownlineAffiliate') }}</th>
            <th>{{ t('fields.affiliateStatus') }}</th>
            <th>{{ t('fields.site') }}</th>
            <th>{{ t('fields.balance') }}</th>
            <th>{{ t('fields.registerTime') }}</th>
            <th v-if="store.state.user.siteCode !== 'VNM'">{{ t('fields.operate') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in page.records" :key="record.id">
            <td>
              <el-link type="primary" @click="searchDownline(record.id, record.loginName)">
                {{ record.loginName }}
              </el-link>
            </td>
            <td>
              <span v-if="record.affiliateCode === null">-</span>
              <span v-if="record.affiliateCode !== null">
                {{ record.affiliateCode }}
              </span>
            </td>
            <td>
              <span v-if="record.affiliateLevel === null">-</span>
              <span v-if="record.affiliateLevel !== null">
                {{ t('affiliate.level.' + record.affiliateLevel) }}
              </span>
            </td>
            <td>
              <span v-if="record.commission === null">0 %</span>
              <span v-if="record.commission !== null">
                {{ record.commission * 100 }} %
              </span>
            </td>
            <td>
              <span v-if="record.downlineMember === null">-</span>
              <span v-if="record.downlineMember !== null">
                {{ record.downlineMember }}
              </span>
            </td>
            <td>
              <span v-if="record.downlineAffiliate === null">-</span>
              <span v-if="record.downlineAffiliate !== null">
                {{ record.downlineAffiliate }}
              </span>
            </td>
            <td>
              <el-tag v-if="record.affiliateStatus === 'APPLY'" size="normal">
                {{ t('affiliate.status.' + record.affiliateStatus) }}
              </el-tag>
              <el-tag v-if="record.affiliateStatus === 'NORMAL'" type="success" size="normal">
                {{ t('affiliate.status.' + record.affiliateStatus) }}
              </el-tag>
              <el-tag v-if="record.affiliateStatus === 'DISABLE'" type="danger" size="normal">
                {{ t('affiliate.status.' + record.affiliateStatus) }}
              </el-tag>
              <el-tag v-if="record.affiliateStatus === null" type="info" size="normal">
                -
              </el-tag>
            </td>
            <td>{{ record.site }}</td>
            <td>
              <span v-formatter="{ data: record.balance, type: 'money' }" />
            </td>
            <td>
              <span v-if="record.regTime === null">-</span>
              <span v-if="record.regTime !== null" v-formatter="{
                data: record.regTime,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }" />
            </td>

            <td>
              <el-button icon="el-icon-edit" size="normal" type="success" :disabled="breadcrumbNameList.length > 1"
                v-if="store.state.user.siteCode !== 'VNM'" @click="showEdit(record)" />
            </td>
          </tr>
        </tbody>
      </table> -->
      <el-table
        size="small"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :empty-text="t('fields.noData')"
        highlight-current-row
        border
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="left"
          width="130"
        />
        <el-table-column
          prop="affiliateCode"
          :label="t('fields.affiliateCode')"
          align="left"
          width="130"
        >
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">
              {{ scope.row.affiliateCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="affiliateLevel"
          :label="t('fields.affiliateLevel')"
          align="center"
          width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.affiliateLevel === null">-</span>
            <span v-if="scope.row.affiliateLevel !== null">
              {{ t('affiliate.level.' + scope.row.affiliateLevel) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="commission"
          :label="t('fields.commission')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.commission === null">0 %</span>
            <span v-if="scope.row.commission !== null">
              {{ scope.row.commission * 100 }} %
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="totalDownlineMember"
          :label="t('fields.totalDownlineMember')"
          align="center"
          width="170"
        >
          <template #default="scope">
            <span v-if="scope.row.downlineMember === null">0 %</span>
            <span v-if="scope.row.downlineMember !== null">
              {{ scope.row.downlineMember }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalDownlineAffiliate"
          :label="t('fields.totalDownlineAffiliate')"
          align="center"
          width="170"
        >
          <template #default="scope">
            <span v-if="scope.row.downlineAffiliate === null">0 %</span>
            <span v-if="scope.row.downlineAffiliate !== null">
              {{ scope.row.downlineAffiliate }}
            </span>
          </template>
        </el-table-column> -->
        
        <el-table-column
          prop="affiliateStatus"
          :label="t('fields.affiliateStatus')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.affiliateStatus === 'APPLY'" size="normal">
              {{ t('affiliate.status.' + scope.row.affiliateStatus) }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === 'NORMAL'"
              type="success"
              size="normal"
            >
              {{ t('affiliate.status.' + scope.row.affiliateStatus) }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === 'DISABLE'"
              type="danger"
              size="normal"
            >
              {{ t('affiliate.status.' + scope.row.affiliateStatus) }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === null"
              type="info"
              size="normal"
            >
              -
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="registerTime"
          :label="t('fields.registerTime')"
          align="center"
          width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{
                data: scope.row.regTime,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="operate"
          :label="t('fields.operate')"
          align="center"
        >
          <template #default="scope">
            <el-button
              icon="el-icon-edit"
              size="normal"
              type="success"
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

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE'"
        ref="createForm"
        :model="cForm"
        :rules="cFormRules"
        :inline="true"
        size="normal"
        label-width="150px"
      >
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input
            v-model="cForm.loginName"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item :label="t('fields.password')" prop="password">
          <el-input
            v-model="cForm.password"
            type="password"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.reenterPassword')"
          prop="reEnterPassword"
        >
          <el-input
            v-model="cForm.reEnterPassword"
            type="password"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.commission')"
          prop="commission"
          v-if="store.state.user.siteCode !== 'VNM'"
        >
          <el-input
            v-model="cForm.commission"
            style="width: 350px;"
            :maxlength="uiControl.commissionMax"
            @keypress="restrictCommissionDecimalInput($event)"
          />
        </el-form-item>
        <!-- <el-form-item
          v-if="parseInt(store.state.user.siteId) === 10"
          :label="t('fields.shareRatio')"
          prop="shareRatio"
        >
          <div
            v-for="item in shareRatioList.list"
            :key="item.code"
            style="width: 370px; display: flex; margin-bottom:5px;"
          >
            <span>{{ t('affiliateShareRatio.' + item.code) }}</span>
            <el-input
              v-model="item.value"
              style=" width:80px; margin-left: auto"
            />
            <span style="color:red">
              &emsp; (0% -
              {{ (getAffiliateRatio(item.code) * 100).toFixed(2) }}%)
            </span>
          </div>
        </el-form-item> -->
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="addAffiliate">
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'EDIT'"
        ref="editForm"
        :model="eForm"
        :rules="eFormRules"
        :inline="true"
        size="normal"
        label-width="150px"
      >
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input
            v-model="eForm.loginName"
            style="width: 350px"
            maxlength="50"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
          <el-input
            v-model="eForm.affiliateCode"
            style="width: 350px"
            maxlength="50"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item :label="t('fields.commissionRate')" prop="commission">
          <el-input
            v-model="eForm.commission"
            style="width: 350px"
            :maxlength="uiControl.commissionMax"
            @keypress="restrictCommissionDecimalInput($event)"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="editAffiliate()">
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="t('fields.recycle')"
      v-model="uiControl.recycleDialogVisible"
      append-to-body
      modal-class="dialog400"
    >
      <el-form label-width="100px" @submit.prevent>
        <el-form-item :label="t('fields.loginName')">
          <b>
            {{ recycleForm.memberName }}
          </b>
        </el-form-item>
        <el-form-item :label="t('fields.amount')">
          <el-input v-model="recycleForm.amount" />
        </el-form-item>
      </el-form>

      <div class="dialog-footer" style="margin-top:10px">
        <el-button @click="uiControl.recycleDialogVisible = false">
          {{ $t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRecycle()">
          {{ $t('fields.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store'
import moment from 'moment'
import {
  getAffiliateDownline,
  regsterAffiliate,
  editAffiliateCommission,
  getAffiliateInfo,
  getDownlineShareRatio,
  recycleMemberBalance,
} from '../../../api/affiliate'
import { getSite } from '../../../api/site'
import { required, size } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import emptyComp from '@/components/empty'
import { getConfigListByGroup } from '../../../api/system-config'

const store = useStore()
const { t } = useI18n()
const createForm = ref(null)
const editForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: '',
  commissionMax: 2,
  revenueMax: 2,
  affiliateLevel: [
    { key: 1, displayName: 'CHIEF AFFILIATE', value: 'CHIEF_AFFILIATE' },
    { key: 2, displayName: 'MASTER AFFILIATE', value: 'MASTER_AFFILIATE' },
    { key: 3, displayName: 'SUPER AFFILIATE', value: 'SUPER_AFFILIATE' },
    { key: 4, displayName: 'AFFILIATE', value: 'AFFILIATE' },
    { key: 5, displayName: 'SUB AFFILIATE', value: 'SUB_AFFILIATE' },
    { key: 6, displayName: 'JUNIOR AFFILIATE', value: 'JUNIOR_AFFILIATE' },
  ],
  recycleDialogVisible: false,
})
const affiliateLevel = ref(null)
const affiliateLevelKey = ref(null)

const site = ref(null)
const affInfo = ref(null)
const checkId = ref(null)
const breadcrumbNameList = ref([])
const shareRatioList = reactive({
  list: [],
})
const downlineShareRatioList = reactive({
  list: [],
})
function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD')
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]
const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('day')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .startOf('day')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .endOf('day')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

const request = reactive({
  loginName: null,
  size: 20,
  current: 1,
  regTime: null,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const cForm = reactive({
  id: null,
  loginName: null,
  password: null,
  reEnterPassword: null,
  telephone: null,
  siteId: null,
  affiliateLevel: null,
  affiliateCode: null,
  commission: 0,
  shareRatio: null,
  codePersonalAffiliate: null,
})

const eForm = reactive({
  id: null,
  loginName: null,
  affiliateCode: null,
  commission: null,
  shareRatio: null,
  affiliateLevel: null,
})

const recycleForm = reactive({
  memberId: null,
  memberName: null,
  amount: 0,
})

// function convertDate(date) {
//   return moment(date).format('YYYY-MM-DD')
// }

// function disabledDate(time) {
//   return time.getTime() > new Date().getTime()
// }

const validatePassword = (rule, value, callback) => {
  if (value !== '' && cForm.reEnterPassword !== '') {
    createForm.value.validateField('reEnterPassword')
  }
  callback()
}

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== cForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback()
}

const validateCommission = (rule, value, callback) => {
  if (
    value !== '' &&
    (cForm.commission < 0 ||
      cForm.commission > 1 ||
      eForm.commission < 0 ||
      eForm.commission > 1)
  ) {
    callback(new Error(t('message.validateCommission')))
  }
  callback()
}

const validateShareRatio = (rule, value, callback) => {
  shareRatioList.list.forEach(item => {
    if (item.value === '' || item.value < 0 || item.value > 100) {
      callback(new Error(t('message.validateShareRatioFormat')))
    }
  })
  callback()
}

const cFormRules = reactive({
  loginName: [
    required(t('message.requiredLoginName')),
    size(6, 12, t('message.length6To12')),
    {
      required: true,
      pattern: /^[a-zA-Z0-9_][a-zA-Z0-9_]*$/,
      message: t('common.affiliateaccountcanonlycontainnumchar'),
      trigger: 'blur',
    },
  ],
  password: [
    required(t('message.requiredPassword')),
    size(6, 12, t('message.length6To12')),
    { validator: validatePassword, trigger: 'blur' },
  ],
  reEnterPassword: [
    required(t('message.reenterPassword')),
    { validator: validateReEnterPassword, trigger: 'blur' },
  ],
  commission: [
    required(t('message.requiredCommission')),
    { validator: validateCommission, trigger: 'blur' },
  ],
  // shareRatio: [{ validator: validateShareRatio, trigger: 'blur' }],
})

const eFormRules = reactive({
  commission: [
    required(t('message.requiredCommission')),
    { validator: validateCommission, trigger: 'blur' },
  ],
  shareRatio: [{ validator: validateShareRatio, trigger: 'blur' }],
  affiliateLevel: [required(t('message.requiredAffiliateLevel'))],
})

function restrictCommissionDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    (eForm.commission !== null &&
      eForm.commission.toString().indexOf('.') > -1) ||
    (cForm.commission !== null && cForm.commission.toString().indexOf('.') > -1)
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
    uiControl.commissionMax = 4
  } else if (eForm.commission === '1' || cForm.commission === '1') {
    uiControl.commissionMax = 1
  } else {
    uiControl.commissionMax = 2
  }
}

function resetQuery() {
  request.loginName = null
  request.regTime = null
}

async function loadDownlineAffiliates() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  if (checkId.value === store.state.user.id) {
    Object.entries(requestCopy).forEach(([key, value]) => {
      if (value) {
        query[key] = value
      }
    })
  }
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = request.regTime.join(',')
    }
  }
  // query.recordTime = query.recordTime.join(',')
  query.siteId = site.value.id
  query.memberTypes = 'AFFILIATE'
  const { data: ret } = await getAffiliateDownline(checkId.value, query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadDownlineAffiliates()
  }
}

function showDialog(type) {
  if (createForm.value) {
    createForm.value.resetFields()
  }
  if (editForm.value) {
    editForm.value.resetFields()
  }
  if (type === 'CREATE') {
    cForm.siteId = site.value.id
    cForm.affiliateCode = affInfo.value.affiliateCode
    uiControl.dialogTitle = t('fields.createAffiliate')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAffiliate')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(affiliate) {
  showDialog('EDIT')
  nextTick(async () => {
    for (const key in affiliate) {
      if (Object.keys(eForm).find(k => k === key)) {
        if (key === 'shareRatio') {
          eForm[key] = [...affiliate[key]]
        } else {
          eForm[key] = affiliate[key]
        }
      }
    }
    if (eForm.shareRatio === null || eForm.shareRatio === undefined) {
      eForm.shareRatio = []
    }
    for (var item = 0; item < shareRatioList.list.length; item++) {
      if (
        !eForm.shareRatio.some(
          child => child.code === shareRatioList.list[item].code
        )
      ) {
        eForm.shareRatio.push({
          code: shareRatioList.list[item].code,
          value: 0,
        })
      }
    }
    eForm.shareRatio = JSON.parse(JSON.stringify(eForm.shareRatio))
    for (var index = 0; index < eForm.shareRatio.length; index++) {
      eForm.shareRatio[index].value *= 100.0
      eForm.shareRatio[index].value = parseFloat(
        eForm.shareRatio[index].value
      ).toFixed(2)
    }
    const { data: downlineShareRatio } = await getDownlineShareRatio(eForm.id)
    downlineShareRatioList.list = downlineShareRatio
  })
}

function showRecycle(affiliate) {
  uiControl.recycleDialogVisible = true
  console.log(affiliate)
  recycleForm.memberId = affiliate.id
  recycleForm.memberName = affiliate.loginName
  recycleForm.amount = 0
}

async function addAffiliate() {
  createForm.value.validate(async valid => {
    if (valid) {
      if (parseInt(cForm.siteId) === 10) {
        // join share ratio by comma
        cForm.shareRatio = shareRatioList.list
          .map(item => item.code + ':' + (item.value / 100).toFixed(4))
          .join(',')
      }
      await regsterAffiliate(cForm)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
      await search()
    }
  })
}

const handleInput = event => {
  cForm.codePersonalAffiliate = cForm.codePersonalAffiliate.toUpperCase()
}

async function editAffiliate() {
  editForm.value.validate(async valid => {
    if (valid) {
      const form = {}
      form.commission = eForm.commission
      form.siteId = store.state.user.siteId
      if (parseInt(form.siteId) === 10) {
        // join share ratio by comma
        form.shareRatio = eForm.shareRatio
          .map(item => item.code + ':' + (item.value / 100).toFixed(4))
          .join(',')
      }
      form.affiliateLevel = eForm.affiliateLevel
      await editAffiliateCommission(eForm.id, form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
      await search()
    }
  })
}

async function loadSite() {
  const { data: s } = await getSite(store.state.user.siteId)
  site.value = s
}

async function loadAffiliateInfo() {
  const { data: a } = await getAffiliateInfo(store.state.user.id)
  affInfo.value = a
}

async function search() {
  checkId.value = store.state.user.id
  breadcrumbNameList.value = []
  const item = { id: checkId.value, name: store.state.user.name }
  breadcrumbNameList.value.push(item)
  await loadDownlineAffiliates()
}

async function searchDownline(id, name) {
  checkId.value = id
  const item = { id: id, name: name }
  breadcrumbNameList.value.push(item)
  await loadDownlineAffiliates()
}

function breadcrumbSearch(id, name) {
  const index = breadcrumbNameList.value.findIndex(b => b.id === id)
  breadcrumbNameList.value.splice(index)
  if (id === store.state.user.id) {
    search()
  } else {
    searchDownline(id, name)
  }
}

function getAffiliateRatio(code) {
  const shareRatio = affInfo.value.shareRatio.filter(item => item.code === code)
  return shareRatio === null ||
    shareRatio === undefined ||
    shareRatio.length === 0
    ? 0
    : shareRatio[0].value
}

function getDownlineRatio(code) {
  const shareRatio = downlineShareRatioList.list.filter(
    item => item.code === code
  )
  return shareRatio === null ||
    shareRatio === undefined ||
    shareRatio.length === 0
    ? 0
    : shareRatio[0].value
}

const confirmRecycle = async () => {
  await recycleMemberBalance(recycleForm)
  ElMessage({ message: t('message.recycleSuccess'), type: 'success' })
  uiControl.recycleDialogVisible = false
  loadDownlineAffiliates()
}

onMounted(async () => {
  affiliateLevel.value = store.state.user.affiliateLevel
  checkId.value = store.state.user.id
  const item = { id: checkId.value, name: store.state.user.name }
  breadcrumbNameList.value.push(item)
  await loadSite()
  await loadAffiliateInfo()
  await loadDownlineAffiliates()
  getConfigListByGroup('AGENT_SHARE_RATIO', store.state.user.siteId).then(
    res => {
      for (var item = 0; item < res.data.length; item++) {
        shareRatioList.list.push({ code: res.data[item].code, value: 0 })
      }
    }
  )
  affiliateLevelKey.value = uiControl.affiliateLevel.filter(level => {
    return level.value === affiliateLevel.value
  })[0].key
  uiControl.affiliateLevel = uiControl.affiliateLevel.filter(level => {
    return level.key > affiliateLevelKey.value
  })
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

:deep(.el-breadcrumb__inner) {
  cursor: pointer !important;
  color: var(--el-color-primary) !important;
}
</style>

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
  display: flex;
  align-items: center;
  gap: 10px;

  .input-small {
    width: 100%;
    max-width: 200px;

    &.el-range-editor--small.el-input__inner {
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
