<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="clearfix">
        <span class="role-span">{{ $t('menu.Bank Withdrawal') }}</span>
      </div>
    </template>
    <el-card style="width: fit-content; padding-right: 200px; margin-bottom: 20px;">
      <div class="card-panel-description">
        <div class="card-panel-text">{{ $t('fields.commissionBalance') }}<el-icon class="pointer" @click="loadAffiliateBalance"><Refresh /></el-icon></div>
        <span v-if="showBalance" class="card-panel-num">
          $ <span v-formatter="{data: balance,type: 'money'}" />
        </span>
        <span v-else>****</span>
        <el-icon v-if="!showBalance" class="pointer" @click="showBalance = true"><View /></el-icon>
        <el-icon v-else class="pointer" @click="showBalance = false"><Hide /></el-icon>
      </div>
    </el-card>
    <el-row>
      <el-form ref="formRef" :model="withdrawInfo" label-position="left" :rules="withdrawRules" label-width="200px">
        <el-form-item :label="t('fields.selectACard')">
          <el-row>
            <div class="cards" v-for="(method, i) in withdrawalMethods"
                 :key="i" :class="{active: i === activeItem}" @click="selectMethod(method, i)"
            >
              <el-card>
                {{ method.name }}
              </el-card>
            </div>
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.withdrawalAmount')" prop="amount">
          <el-input-number
            style="width: 100%;"
            controls-position="right"
            v-model="withdrawInfo.amount"
            :placeholder="t('fields.enterTheWithdrawalAmount')"
            :min="selectedWithdrawalMethod.withdrawMin"
            :max="selectedWithdrawalMethod.withdrawMax"
          />
        </el-form-item>
        <!-- <el-form-item label>
        </el-form-item> -->
        <div class="account-tip remain-box">
          <div
            v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin"
          >
            {{ $t('message.singleLimit') }} : {{
              selectedWithdrawalMethod.withdrawMin +
                " - " +
                selectedWithdrawalMethod.withdrawMax }}
          </div>
          <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
            {{ $t('message.withdrawalToday') }} : {{ selectedWithdrawalMethod.withdrawMaxAmount }}
          </template>
          <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
            {{ $t('message.remaining') }} : {{ selectedWithdrawalMethod.withdrawMaxTimes }} {{ $t('message.times') }}
          </template>
        </div>
        <el-form-item :label="isUSDT === true ? t('fields.usdtWallet') : t('fields.bankCard')" prop="cardId">
          <el-select @click="withdrawState.bankCardList.length === 0 ? checkBankCards() : ''" value-key="id" v-model="withdrawInfo.cardId" :placeholder="t('fields.select')" size="large">
            <el-option
              v-for="item in withdrawState.bankCardList"
              :key="item.id"
              :label="item.bankName + ` - ` + item.cardNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-button @click="showDialog('SEC_QN')">{{ $t('fields.confirmWithdraw') }}</el-button>
      </el-form>
    </el-row>
  </el-card>
  <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
    <el-form v-if="uiControl.dialogType === 'SEC_QN'" ref="secRef" :model="securityForm" :rules="securityFormRules" :inline="true" size="small" label-width="150px">
      <el-form-item :label="t('fields.questionOne')" prop="questionOne">
        <span>{{ securityForm.questionOne }}</span>
      </el-form-item>
      <el-form-item :label="t('fields.answerOne')" prop="answerOne">
        <el-input v-model="securityForm.answerOne" style="width: 200px;" :placeholder="t('fields.answerOne')" />
      </el-form-item>
      <el-form-item :label="t('fields.questionTwo')" prop="questionTwo">
        <span>{{ securityForm.questionTwo }}</span>
      </el-form-item>
      <el-form-item :label="t('fields.answerTwo')" prop="answerTwo">
        <el-input v-model="securityForm.answerTwo" style="width: 200px;" :placeholder="t('fields.answerTwo')" />
      </el-form-item>
      <el-form-item :label="t('fields.questionThree')" prop="questionThree">
        <span>{{ securityForm.questionThree }}</span>
      </el-form-item>
      <el-form-item :label="t('fields.answerThree')" prop="answerThree">
        <el-input v-model="securityForm.answerThree" style="width: 200px;" :placeholder="t('fields.answerThree')" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ $t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submitAnswer">{{ $t('fields.confirm') }}</el-button>
      </div>
    </el-form>
    <el-form v-if="uiControl.dialogType === 'WITHDRAW_PASS'" ref="withdrawPwRef" :model="withdrawPwForm" :rules="withdrawPwFormRules" :inline="true" size="small" label-width="150px" @submit.prevent>
      <el-form-item :label="t('fields.withdrawPassword')" prop="withdrawPassword">
        <el-input
          type="password"
          v-model="withdrawPwForm.withdrawPassword"
          autocomplete="off"
          style="width: 200px;"
          :placeholder="t('fields.withdrawPassword')"
        />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ $t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submitWithdraw">{{ $t('fields.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { View, Hide, Refresh } from "@element-plus/icons-vue";
import { reactive, ref, onMounted } from "vue";
import { ElMessageBox, ElNotification } from 'element-plus';
import {
  loadBankCards, confirmWithdraw, withdrawEntrance,
  getAffiliateCommissionBalance, getSecurityQuestions, checkHasWithdrawPw,
  checkAnswer, checkWithdrawPassword
} from "@/api/affiliate";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { required } from "../../../utils/validate";

const withdrawalMethods = ref([])
const store = useStore();
const router = useRouter();
const formRef = ref();
const activeItem = ref(0);
const secRef = ref();
const withdrawPwRef = ref();
const { t } = useI18n();
const isUSDT = ref(false);
const balance = ref(0);
const showBalance = ref(false);
const hasSecurityQn = ref(false);
const hasWithdrawPw = ref(false);
const uiControl = reactive({
  dialogTitle: null,
  dialogType: null,
  dialogVisible: false
});
const withdrawState = reactive({
  bankCardList: [],
});
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
});

const securityForm = reactive({
  questionOne: null,
  answerOne: null,
  questionTwo: null,
  answerTwo: null,
  questionThree: null,
  answerThree: null
});

const securityFormRules = reactive({
  answerOne: [required(t('message.requiredAnswer'))],
  answerTwo: [required(t('message.requiredAnswer'))],
  answerThree: [required(t('message.requiredAnswer'))]
});

const withdrawPwForm = reactive({
  withdrawPassword: null,
});

const withdrawPwFormRules = reactive({
  withdrawPassword: [required(t('message.requiredWithdrawPassword'))]
});

const checkAmt = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(t('message.requiredAmount')));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error(t('message.inputDigits')));
    } else {
      if (value < selectedWithdrawalMethod.value.withdrawMin - 1 || value > selectedWithdrawalMethod.value.withdrawMax + 1) {
        callback(new Error(`Amount should be between ${selectedWithdrawalMethod.value.withdrawMin} & ${selectedWithdrawalMethod.value.withdrawMax}`));
      } else {
        callback();
      }
    }
  }, 1000);
};

function showDialog(type) {
  if (type === 'SEC_QN') {
    uiControl.dialogTitle = t('fields.answerSecurityQuestion');
    formRef.value.validate(async (valid) => {
      if (valid) {
        securityForm.answerOne = null;
        securityForm.answerTwo = null;
        securityForm.answerThree = null;
        uiControl.dialogVisible = true;
        uiControl.dialogType = type;
      }
    })
  } else if (type === 'WITHDRAW_PASS') {
    withdrawPwForm.withdrawPassword = null;
    uiControl.dialogTitle = t('fields.withdrawPassword');
    uiControl.dialogVisible = true;
    uiControl.dialogType = type;
  }
}

function submitAnswer() {
  secRef.value.validate(async (valid) => {
    if (valid) {
      await checkAnswer(store.state.user.id, securityForm);
      showDialog('WITHDRAW_PASS');
    }
  });
}

async function submitWithdraw() {
  withdrawPwRef.value.validate(async (valid) => {
    if (valid) {
      await checkWithdrawPassword(store.state.user.id, store.state.user.siteId, withdrawPwForm.withdrawPassword);
      await confirmWithdraw(withdrawInfo).then((response) => {
        if (response.code === 0) {
          ElMessageBox.confirm(
            t('message.success'),
            '',
            {
              confirmButtonText: t('fields.confirm'),
              cancelButtonText: t('fields.cancel'),
              type: 'info'
            })
        } else {
          ElNotification({
            title: 'Error',
            message: response.message,
            showClose: false,
            type: 'error'
          })
        }
      }).catch((error) => {
        console.log("error", error);
      });
      loadAffiliateBalance();
      uiControl.dialogVisible = false;
      formRef.value.resetFields();
      withdrawInfo.cardId = null;
    }
  });
};

async function retrieveSecurityQuestion() {
  const { data: qn } = await getSecurityQuestions(store.state.user.id);
  if (qn) {
    hasSecurityQn.value = true;
    securityForm.questionOne = qn.questionOne;
    securityForm.questionTwo = qn.questionTwo;
    securityForm.questionThree = qn.questionThree;
  } else {
    hasSecurityQn.value = false;
  }
}

const validateSelection = async (r, v) => {
  if (!isUSDT.value) {
    if (v === null) {
      return Promise.reject(new Error(t('message.selectBankCard')));
    } else {
      return Promise.resolve();
    }
  } else if (isUSDT.value) {
    if (v === null) {
      return Promise.reject(new Error(t('message.selectUsdtWallet')));
    } else {
      return Promise.resolve();
    }
  }
  return Promise.resolve();
};

const withdrawRules = {
  amount: [
    {
      required: true,
      message: t('message.requiredAmount'),
      trigger: "blur",
    },
    { validator: checkAmt, trigger: 'blur' }
  ],
  cardId: [
    {
      required: true,
      validator: validateSelection,
      trigger: "blur"
    }
  ]
};

const selectedCard = ref([])
const selectedWithdrawalMethod = ref([])

const selectMethod = (method, index) => {
  selectedCard.value = []
  withdrawInfo.withdrawCode = null;
  withdrawInfo.cardId = null;
  selectedWithdrawalMethod.value = method
  withdrawInfo.withdrawCode = method.code;
  activeItem.value = index;
  if (withdrawInfo.withdrawCode.includes('USDT')) {
    isUSDT.value = true
  } else {
    isUSDT.value = false
  }
  loadCards()
}

function checkBankCards() {
  if (isUSDT.value === true) {
    ElMessageBox.alert(
      t('message.bindUsdtWallet'), t('fields.systemAlert'),
      {
        showClose: false,
        showCancelButton: false,
        confirmButtonText: t('fields.confirm'),
        draggable: false,
        buttonSize: 'small',
        closeOnClickModal: false,
        center: true,
      }
    )
      .then(() => {
        router.push('/affiliate/bankCard')
      })
      .catch(() => {
      })
  } else {
    ElMessageBox.alert(
      t('message.bindBankCard'), t('fields.systemAlert'),
      {
        showClose: false,
        showCancelButton: false,
        confirmButtonText: t('fields.confirm'),
        draggable: false,
        buttonSize: 'small',
        closeOnClickModal: false,
        center: true,
      }
    )
      .then(() => {
        router.push('/affiliate/bankCard')
      })
      .catch(() => {
      })
  }
}

function loadCards() {
  withdrawState.bankCardList = []
  loadBankCards().then((response) => {
    if (response.code === 0) {
      response.data.forEach(element => {
        if (element.bankType === 'BANK') {
          if (element.bankType.includes(selectedWithdrawalMethod.value.code)) {
            withdrawState.bankCardList.push(element)
          }
        } else {
          if (element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
            withdrawState.bankCardList.push(element)
          }
        }
      });
    }
  }).catch((error) => {
    console.log("error", error);
  });
}

function getWithdrawalMethods() {
  withdrawEntrance().then((response) => {
    if (response.code === 0) {
      withdrawalMethods.value = response.data
      selectMethod(withdrawalMethods.value[0], 0)
    } else {
      ElNotification({
        title: 'Error',
        showClose: false,
        type: 'response.message'
      })
    }
  })
}

async function loadAffiliateBalance() {
  const { data: bal } = await getAffiliateCommissionBalance(store.state.user.id);
  balance.value = bal;
}

async function checkWithdrawPw() {
  const { data: exists } = await checkHasWithdrawPw(store.state.user.id, store.state.user.siteId);
  if (!exists) {
    hasWithdrawPw.value = false;
  } else {
    hasWithdrawPw.value = true;
  }
}

onMounted(async() => {
  await retrieveSecurityQuestion();
  await checkWithdrawPw();
  if (!hasSecurityQn.value && !hasWithdrawPw.value) {
    router.push("/personal?name=secAndPw");
  } else if (!hasWithdrawPw.value) {
    router.push("/personal?name=withdrawpw");
  } else if (!hasSecurityQn.value) {
    router.push("/personal?name=securityQn");
  }
  await loadAffiliateBalance();
  getWithdrawalMethods()
});
</script>
<style scoped>
.el-select {
  width: 100%;
}
.el-row {
  display: flex;
  gap: 10px;
  line-height: 14px;
}
.el-row.flex-column {
  flex-direction: column;
}
.el-row .cards.active .el-card {
 background: #304156;
 color: #ffffff;
}
.account-tip {
  display: flex;
  flex-direction: column;
    line-height: 20px;
    padding: 10px 0;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
  .account-tip.remain-box {
    margin-left: 200px;
  }
@media (max-width: 768px) {
  .el-form-item {
    flex-direction: column;
  }
  .account-tip.remain-box {
    margin-left: 0;
  }
}

</style>
