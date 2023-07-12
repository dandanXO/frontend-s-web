<template>
  <div class="roles-main">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.accountInfo') }}</span>
        </div>
      </template>
      <el-button
        icon="el-icon-user"
        size="mini"
        type="primary"
        @click="showDialog('ACCOUNT')"
      >
        {{ $t('fields.myAccount') }}
      </el-button>
      <el-button
        icon="el-icon-s-promotion"
        size="mini"
        type="success"
        @click="showDialog('LINK')"
      >
        {{ $t('fields.referralLink') }}
      </el-button>
    </el-card>
    <el-card style="margin-top: 20px;" v-loading="uiControl.loading">
      <el-row>
        <el-select
          v-model="request.time"
          size="small"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @change="loadSummary"
        >
          <el-option
            v-for="time in uiControl.selectTime"
            :key="time.key"
            :label="time.displayName"
            :value="time.value"
          />
        </el-select>
      </el-row>
      <el-table :data="summary" ref="table"
                row-key="id"
                size="small"
                style="margin-top: 20px;"
      >
        <el-table-column prop="bet" :label="t('fields.bet')" align="center" min-width="130">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.bet,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="win" :label="t('fields.winLoss')" align="center" min-width="130">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.win,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="profit" :label="t('fields.profit')" align="center" min-width="130">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.profit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="registerMemberCount" :label="t('fields.newUsers')" align="center" min-width="100" />
        <el-table-column prop="activeMemberCount" :label="t('fields.activeUsers')" align="center" min-width="100" />
        <el-table-column prop="depositAmount" :label="t('fields.deposit')" align="center" min-width="130">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.depositAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="withdrawAmount" :label="t('fields.withdraw')" align="center" min-width="130">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.withdrawAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="ftdMemberCount" :label="t('fields.firstDepositUsers')" align="center" min-width="150" />
        <el-table-column prop="ftdAmount" :label="t('fields.amountOfFirstDeposit')" align="center" min-width="150">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.ftdAmount,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="visitsNo" :label="t('fields.visitsNo')" align="center" min-width="150" />
      </el-table>
    </el-card>
    <el-dialog :title="uiControl.editDialogTitle" v-model="uiControl.editDialogVisible" append-to-body width="580px">
      <el-form ref="editForm" :model="eForm" :rules="eFormRules" :inline="true" size="small" label-width="200px">
        <el-form-item :label="t('fields.realName')" prop="realName">
          <el-input v-model="eForm.realName" style="width: 250px" maxlength="50" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.editDialogVisible=false">{{ $t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="editRealName()">{{ $t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="80%">
      <el-row v-if="uiControl.dialogType === 'ACCOUNT'" class="affiliate-info">
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="person20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.account') }}</div>
            <span class="card-panel-num">
              {{ store.state.user.name }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="personInfo20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.realName') }}</div>
            <span v-if="store.state.user.realName !== 'null' && store.state.user.realName !== 'undefined' && store.state.user.realName" class="card-panel-num">
              {{ store.state.user.realName }}
            </span>
            <span v-if="store.state.user.realName === 'null' || store.state.user.realName === 'undefined' || !store.state.user.realName" class="card-panel-num">
              <!-- <el-form style="display: flex; gap: 10px;">
                <el-input v-model="updateInfo.realName" />
                <el-button type="primary" @click="editRealName()">Update</el-button>
              </el-form> -->
              <el-form ref="editForm" :model="eForm" :rules="eFormRules" :inline="true" size="small">
                <el-form-item style="margin-right: 0; text-align: right;" prop="realName">
                  <el-input v-model="eForm.realName" maxlength="50" />
                  <el-button type="primary" @click="editRealName()">{{ $t('fields.confirm') }}</el-button>
                </el-form-item>
              </el-form>
            </span>
          </div>
        </el-card>
        <!-- <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fa8db">
            <Icon :icon="personBoard20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.realName') }}</div>
            <span v-if="realName" class="card-panel-num">
              {{ realName }}
            </span>
            <el-button v-else icon="el-icon-edit" size="mini" type="success" @click="showDialog('EDIT')" />
          </div>
        </el-card> -->
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fdbb0">
            <Icon :icon="bookCoins24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.balance') }}</div>
            <span class="card-panel-num">
              {{ balance }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#6639b5">
            <Icon :icon="documentPercent20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.commission') }}</div>
            <span class="card-panel-num">
              {{ affInfo.commission * 100 }} %
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="peopleTeam20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.downlineAffiliate') }}</div>
            <span class="card-panel-num">
              {{ affInfo.downlineAffiliate }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fa8db">
            <Icon :icon="peopleList20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.downlineMember') }}</div>
            <span class="card-panel-num">
              {{ affInfo.downlineMember }}
            </span>
          </div>
        </el-card>
      </el-row>
      <el-row :gutter="22" v-if="uiControl.dialogType === 'LINK'" class="referral-link">
        <el-col
          :xs="24"
          :sm="24"
          :lg="4"
        >
          <div class="card-panel-description">
            <div class="card-panel-link-text">{{ $t('fields.referralCode') }}</div>
            <span style="font-size: 20px">
              {{ affInfo.affiliateCode }}
            </span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="10"
          class="column"
        >
          <div class="card-panel-description">
            <div class="card-panel-link-text">{{ $t('fields.link') }}</div>
            <a :href="link" target="_blank" style="color: #1fa8db">{{ link }}</a>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="3"
          class="column"
        >
          <qrcode-vue id="qrcode" :value="link" margin="2" />
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="5"
          class="column"
        >
          <div class="btn-group">
            <el-button
              icon="el-icon-copy-document"
              size="large"
              type="primary"
              @click="copy(link)"
            >
              {{ $t('fields.copy') }}
            </el-button>
            <el-button
              icon="el-icon-download"
              size="large"
              type="success"
              @click="download()"
            >
              {{ $t('fields.download') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import QrcodeVue from 'qrcode.vue'
import { Icon } from '@iconify/vue'
import person20Filled from '@iconify-icons/fluent/person-20-filled'
import personInfo20Filled from '@iconify-icons/fluent/person-info-20-filled'
import bookCoins24Filled from '@iconify-icons/fluent/book-coins-24-filled'
import documentPercent20Filled from '@iconify-icons/fluent/document-percent-20-filled'
import peopleTeam20Filled from '@iconify-icons/fluent/people-team-20-filled'
import peopleList20Filled from '@iconify-icons/fluent/people-list-20-filled'
import { nextTick, onMounted, reactive, ref } from '@vue/runtime-core'
import moment from 'moment'
import { dashboardSummary } from '../../api/affiliate-summary'
import { getAffiliateBalance, getAffiliateInfo } from "../../api/affiliate";
import { required } from "../../utils/validate";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router"
import { UserActionTypes } from "@/store/modules/user/action-types";
// import { UserMutationTypes } from "@/store/modules/user/mutation-types";
// import { UserMutationTypes } from "../../store/modules/user/mutation-types";
// import { UserMutationTypes } from "../../store/modules/user/mutation-types";
const store = useStore();
// eslint-disable-next-line
const { t } = useI18n();
const editForm = ref(null);
const route = useRoute();
const uiControl = reactive({
  dialogTitle: 'My Account',
  dialogType: 'ACCOUNT',
  dialogVisible: false,
  editDialogTitle: 'Update Real Name',
  editDialogVisible: false,
  loading: false,
  selectTime: [
    { key: 0, displayName: 'Today', value: 'Today' },
    { key: 1, displayName: 'Yesterday', value: 'Yesterday' },
    { key: 2, displayName: 'This Week', value: 'This Week' },
    { key: 3, displayName: 'Last Week', value: 'Last Week' },
    { key: 4, displayName: 'This Month', value: 'This Month' },
    { key: 5, displayName: 'Last Month', value: 'Last Month' }
  ]
});
const request = reactive({
  start: new Date(),
  end: new Date(),
  time: "Today",
  recordTime: []
});
const link = ref("");
const balance = ref(0);
const affInfo = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineAffiliate: 0,
  downlineMember: 0,
  commission: 0,
  revenueShare: 0
});
const summary = reactive([{
  id: 0,
  affiliateId: 0,
  loginName: null,
  depositAmount: 0,
  withdrawAmount: 0,
  bet: 0,
  win: 0,
  payout: 0,
  ftdMemberCount: 0,
  activeMemberCount: 0,
  registerMemberCount: 0,
  ftdAmount: 0,
  profit: 0,
  visitsNo: 0
}]);

const eForm = reactive({
  realName: null
});

const eFormRules = reactive({
  realName: [required(t('message.requiredRealName')), { pattern: '^([\u4e00-\u9fa5]*)$', message: '请输入中文字符', trigger: 'change' }]
});

async function resetSummary() {
  summary[0].depositAmount = 0;
  summary[0].withdrawAmount = 0;
  summary[0].bet = 0;
  summary[0].win = 0;
  summary[0].payout = 0;
  summary[0].ftdMemberCount = 0;
  summary[0].activeMemberCount = 0;
  summary[0].registerMemberCount = 0;
  summary[0].ftdAmount = 0;
  summary[0].profit = 0;
  summary[0].visitsNo = 0;
}

async function loadSummary() {
  uiControl.loading = true;
  await populateRequestDate();
  request.recordTime = [request.start, request.end];
  const query = {};
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  const { data: ret } = await dashboardSummary(store.state.user.id, query);
  await resetSummary();
  Object.keys({ ...ret }).forEach(field => {
    summary[0][field] = ret[field];
  });
  uiControl.loading = false;
}

async function populateRequestDate() {
  const start = new Date();
  const end = new Date();
  if (request.time === 'Today') {
    request.start = moment(start).format('YYYY-MM-DD');
    request.end = moment(end).format('YYYY-MM-DD');
  } else if (request.time === 'Yesterday') {
    request.start = moment(start).subtract(1, 'days').format('YYYY-MM-DD');
    request.end = moment(end).subtract(1, 'days').format('YYYY-MM-DD');
  } else if (request.time === 'This Week') {
    request.start = moment(start).startOf('week').format('YYYY-MM-DD');
    request.end = moment(end).format('YYYY-MM-DD');
  } else if (request.time === 'Last Week') {
    request.start = moment(start).subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
    request.end = moment(end).subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
  } else if (request.time === 'This Month') {
    request.start = moment(start).startOf('month').format('YYYY-MM-DD');
    request.end = moment(end).format('YYYY-MM-DD');
  } else if (request.time === 'Last Month') {
    request.start = moment(start).subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
    request.end = moment(end).subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
  }
}

async function loadAffiliateInfo() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id);
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field];
  });
  await loadAffiliateBalance();
  await loadReferralLink();
}

async function loadAffiliateBalance() {
  const { data: bal } = await getAffiliateBalance(store.state.user.id);
  balance.value = bal;
}

// async function loadAffiliateRealName() {
//   const { data: name } = await getAffiliateRealName(store.state.user.id);
//   realName.value = name;
// }

async function loadReferralLink() {
  // if (store.state.user.siteId === 5 || store.state.user.siteId === "5") {
  //   link.value = "https://www.funbet8.com/agent/" + affInfo.affiliateCode;
  // } else if (store.state.user.siteId === 8 || store.state.user.siteId === "8") {
  //   link.value = "https://ph.jolly88.com/agent/" + affInfo.affiliateCode;
  // } else if (store.state.user.siteId === 9 || store.state.user.siteId === "9") {
  //   link.value = "https://www.jolly8858.com/agent/" + affInfo.affiliateCode;
  if (store.state.user.siteId === 1 || store.state.user.siteId === "1") {
    link.value = "https://xf-web.psnaback.com/agent/" + affInfo.affiliateCode;
  } else {
    link.value = "";
  }
  await nextTick();
}

function copy(text) {
  navigator.clipboard.writeText(text);
  ElMessage({ message: t('message.referralLinkCopied'), type: "success" });
};

function download() {
  const canvas = document.getElementById("qrcode").toDataURL("image/png");
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = 'Referral Link.png';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  xhr.open('GET', canvas);
  xhr.send();
}
function showDialog(type) {
  if (type === 'ACCOUNT') {
    uiControl.dialogTitle = t('fields.myAccount');
    uiControl.dialogType = type;
    uiControl.dialogVisible = true;
  } else if (type === 'LINK') {
    uiControl.dialogTitle = t('fields.referralLink');
    uiControl.dialogType = type;
    uiControl.dialogVisible = true;
  }
}

async function editRealName() {
  editForm.value.validate(async valid => {
    if (valid) {
      // await updateRealName(eForm.realName);
      // uiControl.editDialogVisible = false;
      // ElMessage({ message: t('message.editSuccess'), type: 'success' });
      // commit(UserMutationTypes.SET_REAL_NAME, eForm.realName);
      // loadAffiliateInfo();
      try {
        await store.dispatch(UserActionTypes.ACTION_UPDATE_REAL_NAME, eForm);
      } catch (e) {
        // console.error(e);
        // return;
      }
    }
  });
}

onMounted(async() => {
  if (route.query && route.query.name === 'realname') {
    ElMessage({ message: t('message.inputRealName'), type: "error", customClass: "toTop" });
    showDialog('ACCOUNT');
  }
  await loadAffiliateInfo();
  await loadSummary();
})
</script>

<style scoped>
.affiliate-info {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.affiliate-info .box-card {
  flex: 1;
  flex-wrap: wrap;
}

.referral-link {
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: right;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
  float: right;
}

.btn-group {
  margin-top: 15px;
  display: flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .affiliate-info {
    grid-template-columns: repeat(1, 1fr);
  }

  .column {
    margin-top: 20px;
  }
}
</style>
