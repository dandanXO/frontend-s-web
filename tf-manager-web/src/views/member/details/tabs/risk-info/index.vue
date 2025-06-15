<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          clearable
          v-model="request.queryValue"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 240px; margin-right: 10px"
          @change="clearRecords"
        >
          <el-option
            v-for="item in queryValueList.list"
            :key="item.key"
            :label="t('fields.' + item.name)"
            :value="item.value"
          />
        </el-select>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="loadRiskInfo"
          size="small"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
    </div>
    <div class="header-container" v-if="request.queryValue !== 'riskInfoBankCard'">
      <span v-if="request.queryValue !== null && request.queryValue !== 'riskInfoPassword'">{{ t('fields.queryOption') }}: </span>
      <span v-if="request.queryValue === 'riskInfoIpLogin'">
        <span style="padding-right: 10px"
              :style="[selectedIpColor.loginIpColor !== null ? {color: selectedIpColor.loginIpColor}: {}]"
        > {{ memberDetail.lastLoginIp }}
        </span>
        <span v-if="memberDetail.lastLoginAddress !== '-,-,-' && memberDetail.lastLoginAddress !== 'null,null,null' && memberDetail.lastLoginAddress !== null">
          {{ memberDetail.lastLoginAddress }}
        </span>
      </span>
      <span v-if="request.queryValue === 'riskInfoIpRegistration'">
        <span style="padding-right: 10px"
              :style="[selectedIpColor.registerIpColor !== null ? {color: selectedIpColor.registerIpColor}: {}]"
        >{{ memberDetail.lastLoginIp }}</span>
        <span v-if="memberDetail.regAddress !== '-,-,-' && memberDetail.regAddress !== 'null,null,null' && memberDetail.regAddress !== null">
          {{ memberDetail.regAddress }}
        </span>
      </span>
      <span v-if="request.queryValue === 'riskInfoRealName'">{{ memberDetail.realName }}</span>
      <span v-if="request.queryValue === 'riskInfoEmail'">{{ memberDetail.email }}</span>
      <span v-if="request.queryValue === 'riskInfoTelephone'">{{ memberDetail.telephone }}</span>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        @sort-change="sort"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          :label="t('fields.cardNumber')"
          prop="cardNumber"
          align="center"
          min-width="180"
          v-if="request.queryValue === 'riskInfoBankCard'"
        />
        <el-table-column
          :label="t('fields.loginName')"
          prop="loginName"
          align="center"
          min-width="90"
        >
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.id}?tab=member-info&site=${site.id}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.realName')"
          align="center"
          min-width="90"
          prop="realName"
        />
        <el-table-column
          :label="t('fields.registrationDate')"
          align="center"
          min-width="90"
          prop="registrationDate"
          sortable
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.registrationDate,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.vipLevel')"
          align="center"
          min-width="90"
          prop="vipLevel"
        />
        <el-table-column
          :label="t('fields.riskLevel')"
          align="center"
          min-width="90"
          prop="riskLevel"
        />
        <el-table-column
          :label="t('fields.financialLevel')"
          prop="financialLevel"
          align="center"
          min-width="90"
        />
        <el-table-column
          :label="t('fields.totalDeposit')"
          prop="totalDeposit"
          align="center"
          min-width="90"
        />
        <el-table-column
          :label="t('fields.totalWithdraw')"
          prop="totalWithdraw"
          align="center"
          min-width="90"
        />
        <el-table-column
          :label="t('fields.totalBonus')"
          prop="totalBonus"
          align="center"
          min-width="90"
        />
        <el-table-column
          :label="t('fields.affiliateCode')"
          prop="affiliateCode"
          align="center"
          min-width="90"
        />
        <el-table-column
          :label="t('fields.accountStatus')"
          prop="accountStatus"
          align="center"
          min-width="90"
        />
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadRiskInfo"
        @size-change="loadRiskInfo"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive, computed } from 'vue';
import { getMemberDetails } from "../../../../../api/member";
import { getMemberRiskInfo } from '../../../../../api/member-risk';
import { useStore } from "../../../../../store";
import { useI18n } from "vue-i18n";
import { hasPermission } from '../../../../../utils/util'
import { useRoute } from 'vue-router'
import { isKorea } from '@/utils/site'

// eslint-disable-next-line
const { t } = useI18n();
const store = useStore()

const route = useRoute()
const site = reactive({
  id: route.query.site
});
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)

const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  }
})

const queryValueList = reactive({
  list: [
    { key: 1, name: 'lastLoginIp', value: 'riskInfoIpLogin' },
    { key: 2, name: 'registerIp', value: 'riskInfoIpRegistration' },
    { key: 3, name: 'realName', value: 'riskInfoRealName' },
    { key: 4, name: 'email', value: 'riskInfoEmail' },
    { key: 5, name: 'telephone', value: 'riskInfoTelephone' },
    { key: 6, name: 'password', value: 'riskInfoPassword' },
    { key: 7, name: 'bankCard', value: 'riskInfoBankCard' },
    { key: 8, name: 'sid', value: 'riskInfoSid' }
  ],
  sublist: [
    { key: 1, name: 'realName', value: 'riskInfoRealName' },
    { key: 2, name: 'email', value: 'riskInfoEmail' },
    { key: 3, name: 'telephone', value: 'riskInfoTelephone' },
    { key: 4, name: 'password', value: 'riskInfoPassword' },
    { key: 5, name: 'bankCard', value: 'riskInfoBankCard' },
    { key: 6, name: 'sid', value: 'riskInfoSid' }
  ]
})

const memberDetail = reactive({
  lastLoginIp: null,
  lastLoginAddress: null,
  loginName: null,
  regIp: null,
  regAddress: null,
  realName: null,
  email: null,
  telephone: null,
  sid: null
})

const selectedIpColor = reactive({
  registerIpColor: null,
  loginIpColor: null,
});

const populateIpColor = () => {
  const regIpLabel = store.state.app.ipLabels.find(r => r.ip === memberDetail.regIp);
  const lastLoginIpLabel = store.state.app.ipLabels.find(r => r.ip === memberDetail.lastLoginIp);
  if (regIpLabel) {
    selectedIpColor.registerIpColor = regIpLabel.color;
  }
  if (lastLoginIpLabel) {
    selectedIpColor.loginIpColor = lastLoginIpLabel.color;
  }
};

const request = reactive({
  queryValue: isKorea(LOGIN_USER_SITEID.value) ? 'riskInfoRealName' : 'riskInfoIpLogin',
  current: 1,
  size: 20
})
const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})
async function loadMemberDetail() {
  const data = await getMemberDetails(props.mbrId, site.id);
  Object.keys({ ...data.data }).forEach(detailField => {
    memberDetail[detailField] = data.data[detailField];
  });
  populateIpColor()
}

async function loadRiskInfo() {
  page.loading = true;
  const pageable = { current: request.current, size: request.size };
  const { data: ret } = await getMemberRiskInfo(props.mbrId, site.id, request.queryValue, pageable);
  page.records = ret.records;
  page.pages = ret.pages;
  page.total = ret.total;
  page.loading = false;
}

async function clearRecords() {
  page.pages = 0;
  page.records = [];
  page.total = 0;
  page.loading = false;
}

const sort = column => {
  request.orderBy = column.prop
  loadRiskInfo()
}

onMounted(() => {
  loadMemberDetail()
})
</script>

<style scoped>
.header-container {
  margin: 20px 0;
  display: flex;
}

.search {
  display: flex;
  justify-content: flex-start;
}

</style>
