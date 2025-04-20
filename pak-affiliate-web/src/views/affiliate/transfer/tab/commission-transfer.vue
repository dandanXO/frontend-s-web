<template>
  <el-card class="balance-panel">
    <div class="balance-inner">
      <div class="money-icon"><img src="../../../../assets/images/home/moneybal.svg"></div>
      <div class="card-panel-description">
        <div class="card-panel-text">{{ $t('fields.commissionBalance') }}<el-icon class="pointer" @click="loadAffiliateBalance"><Refresh /></el-icon></div>
        <span v-if="isLoading" class="loading">
          Loadinggg...
        </span>
        <span v-else>
          <span v-if="showBalance" class="card-panel-num">
            <span v-formatter="{data: balance,type: 'money'}" />
          </span>
          <span v-else>****</span>
          <el-icon v-if="!showBalance" class="pointer" @click="showBalance = true"><View /></el-icon>
          <el-icon v-else class="pointer" @click="showBalance = false"><Hide /></el-icon>
        </span>
      </div>
    </div>
  </el-card>
  <el-row>
    <el-form ref="formRef" :model="form" label-position="right" :rules="formRules" label-width="200px" label-suffix=":">
      <el-form-item :label="t('fields.downlineMember')" prop="loginName">
        <el-input
          v-model="form.loginName"
          :placeholder="t('fields.downlineMember')"
        />
      </el-form-item>
      <el-form-item :label="t('fields.transferAmount')" prop="transferAmount">
        <el-input
          v-model="formattedNumber"
          @input="formatMoney"
          :placeholder="t('fields.transferAmount')"
        />
      </el-form-item>
      <el-form-item :label="t('fields.rollover')" prop="rollover">
        <el-input
          v-model="form.rollover"
          :placeholder="t('fields.rollover')"
        />
      </el-form-item>
      <el-form-item :label="t('fields.withdrawPassword')" prop="withdrawPassword">
        <el-input
          type="password"
          v-model="form.withdrawPassword"
          autocomplete="off"
          :placeholder="t('fields.withdrawPassword')"
        />
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="submitTransfer">{{ $t('fields.confirm') }}</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script setup>
import { View, Hide, Refresh } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, computed } from 'vue';
import { useStore } from "@/store";
import { useI18n } from "vue-i18n";
import { isNumeric, required } from '../../../../utils/validate';
import { transferToMember } from '../../../../api/affiliate-member-transfer';
import { ElMessage } from 'element-plus';
import { checkHasWithdrawPw, getAffiliateCommissionBalance } from '../../../../api/affiliate';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store = useStore();
const { t } = useI18n();
const balance = ref(0);
const showBalance = ref(false);
const formRef = ref();
const isLoading = ref(false);
const form = reactive({
  loginName: null,
  transferAmount: '',
  rollover: null,
  siteId: null,
  withdrawPassword: null
});

const formattedNumber = computed({
  get() {
    return formatWithCommas(form.transferAmount);
  },
  set(newValue) {
    form.transferAmount = newValue.replace(/,/g, '');
  }
});
const formatMoney = () => {
  rawNumber.value = rawNumber.value.replace(/,/g, '');
}
const formatWithCommas = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formRules = reactive({
  loginName: [required(t('message.requiredLoginName'))],
  transferAmount: [required(t('message.requiredTransferAmount')), isNumeric(t('message.validateNumberOnly'))],
  rollover: [required(t('message.requiredRollover')), {
    required: true,
    pattern: /^[1-9]*$/,
    message: t('message.validateNumberMoreThanOne'),
    trigger: 'blur'
  }],
  withdrawPassword: [required(t('message.requiredWithdrawPassword'))]
});

async function submitTransfer() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.siteId = store.state.user.siteId;
      form.type = 'COMMISSION';
      await transferToMember(store.state.user.id, form);
      clearForm();
      loadAffiliateBalance();
      ElMessage({ message: t('message.success'), type: 'success' })
    }
  })
}

function clearForm() {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  form.loginName = null;
  form.transferAmount = null;
  form.rollover = null;
  form.siteId = null;
}

async function loadAffiliateBalance() {
  isLoading.value = true
  const { data: bal } = await getAffiliateCommissionBalance(store.state.user.id);
  balance.value = bal;
  isLoading.value = false
}

async function checkWithdrawPw() {
  const { data: exists } = await checkHasWithdrawPw(store.state.user.id, store.state.user.siteId);
  if (!exists) {
    router.push("/personal/info?name=withdrawpw");
  }
}

onMounted(async () => {
  if (route.query.user) {
    form.loginName = route.query.user
  }
  await checkWithdrawPw();
  await loadAffiliateBalance();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item {
  align-items: center;
}
.header-container {
  margin: 40px 0 20px;
  display: flex;
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

.balance-panel {
  display: flex;
  min-width: 300px;
  max-width: 500px; margin-bottom: 10px; background: #F4F9FD;
  .balance-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}

.card-panel-description{
  font-weight: 700;
  margin-left: 0;
  display: flex;
  gap: 5px;
  flex-direction: column;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
}

.card-panel-description .loading {
  font-size: 15px;
  line-height: 18px;
  margin-top: 5px;
}
.pointer {
  cursor: pointer;
  padding: 0 5px;
}

@media (max-width: 768px) {
  // .inputs-wrap {
  //   flex-direction: column;
  //   gap: 10px;
  //   .el-input--small {
  //     width: 100% !important;
  //     max-width: unset !important;
  //     margin: 0 !important;
  //     .el-button {
  //       margin: 0 !important;
  //     }
  //   }
  //   .input-small {
  //     max-width: unset;
  //     width: 100%;
  //   &.el-range-editor--small.el-input__inner {
  //     max-width: unset;
  //   }
  //   }
  // }
}
</style>
