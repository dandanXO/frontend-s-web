<template>
  <el-card class="box-card" shadow="never" style="margin-top: 20px">
    <template #header>
      <div class="clearfix">
        <span class="role-span">{{ $t('menu.Bank Withdrawal') }}</span>
      </div>
    </template>
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
      <el-form ref="formRef" :model="withdrawInfo" label-position="left" :rules="withdrawRules">
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
        <el-form-item label>
          <el-button @click="submitWithdraw">{{ $t('fields.confirmWithdraw') }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </el-card>
</template>

<script setup>
import { View, Hide, Refresh } from "@element-plus/icons-vue";
import { reactive, ref, onMounted } from "vue";
import { ElMessageBox, ElNotification } from 'element-plus';
import { loadBankCards, confirmWithdraw, withdrawEntrance, getAffiliateBalance } from "@/api/affiliate";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

const withdrawalMethods = ref([])
const store = useStore();
const router = useRouter();
const formRef = ref();
const activeItem = ref(0);
const { t } = useI18n();
const isUSDT = ref(false);
const balance = ref(0);
const showBalance = ref(false);
const withdrawState = reactive({
  bankCardList: [],
});
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
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

function submitWithdraw() {
  formRef.value
    .validate((valid) => {
      if (valid) {
        confirmWithdraw(withdrawInfo).then((response) => {
          if (response.code === 0) {
            ElMessageBox.confirm(
              t('message.redirectBankDeposit'),
              '',
              {
                confirmButtonText: t('fields.confirm'),
                cancelButtonText: t('fields.cancel'),
                type: 'info'
              })
            loadAffiliateBalance();
            formRef.value.resetFields();
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
      }
    })
};

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
  const { data: bal } = await getAffiliateBalance(store.state.user.id);
  balance.value = bal;
}

onMounted(() => {
  getWithdrawalMethods()
  loadAffiliateBalance();
});
</script>
<style>
.el-form-item__label {
  min-width: 200px;
}
</style>
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
