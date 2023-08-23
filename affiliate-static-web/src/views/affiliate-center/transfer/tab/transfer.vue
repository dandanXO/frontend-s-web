<template>
  <el-card class="box-card" shadow="never" style="margin-top: 20px">
    <el-card style="width: fit-content; padding-right: 200px; margin-bottom: 20px;">
      <div class="card-panel-description">
        <div class="card-panel-text">{{ $t('fields.balance') }}<el-icon class="pointer" @click="loadAffiliateBalance"><Refresh /></el-icon></div>
        <span v-if="showBalance" class="card-panel-num">
          $ <span v-formatter="{data: balance,type: 'money'}" />
        </span>
        <span v-else>****</span>
        <el-icon v-if="!showBalance" class="pointer" @click="showBalance = true"><View /></el-icon>
        <el-icon v-else class="pointer" @click="showBalance = false"><Hide /></el-icon>
      </div>
    </el-card>
    <el-row>
      <el-form ref="formRef" :model="form" label-position="right" :rules="formRules">
        <el-form-item :label="t('fields.downlineMember')" prop="loginName">
          <el-input
            v-model="form.loginName"
            :placeholder="t('fields.downlineMember')"
          />
        </el-form-item>
        <el-form-item :label="t('fields.transferAmount')" prop="transferAmount">
          <el-input
            v-model="form.transferAmount"
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
          <el-button @click="submitTransfer">{{ $t('fields.confirm') }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </el-card>
</template>

<script setup>
import { View, Hide, Refresh } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from 'vue';
import { useStore } from "@/store";
import { useI18n } from "vue-i18n";
import { isNumeric, required } from '../../../../utils/validate';
import { transferToMember } from '../../../../api/affiliate-member-transfer';
import { ElMessage } from 'element-plus';
import { checkHasWithdrawPw, getAffiliateBalance } from '../../../../api/affiliate';
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const { t } = useI18n();
const balance = ref(0);
const showBalance = ref(false);
const formRef = ref();
const form = reactive({
  loginName: null,
  transferAmount: null,
  rollover: null,
  siteId: null,
  withdrawPassword: null
});

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
      form.type = 'DEPOSIT';
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
  const { data: bal } = await getAffiliateBalance(store.state.user.id);
  balance.value = bal;
}

async function checkWithdrawPw() {
  const { data: exists } = await checkHasWithdrawPw(store.state.user.id, store.state.user.siteId);
  if (!exists) {
    router.push("/personal?name=withdrawpw");
  }
}

onMounted(async () => {
  await checkWithdrawPw();
  await loadAffiliateBalance();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
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

.pointer {
    cursor: pointer;
    padding: 10px;
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
