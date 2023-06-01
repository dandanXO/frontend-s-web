<template>
  <el-card class="box-card" shadow="never" style="margin-top: 20px">
    <template #header>
      <div class="clearfix">
        <span class="role-span">{{ $t('menu.Bank Withdrawal') }}</span>
      </div>
    </template>
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
        <el-form-item :label="t('fields.selectBankCard')" prop="cardId">
          <el-select value-key="id" v-model="withdrawInfo.cardId" :placeholder="t('fields.select')" size="large">
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

<script>
import { defineComponent, reactive, ref, onMounted } from "vue";
// import { loadBankCards, confirmWithdraw, withdrawEntrance } from "@/api/affiliate";
import { ElMessageBox, ElNotification } from 'element-plus';
import { loadBankCards, confirmWithdraw, withdrawEntrance } from "@/api/affiliate";
import { useI18n } from "vue-i18n";
// import { useStore } from "@/store"

export default defineComponent({
  setup() {
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/'
    const formRef = ref();
    const activeItem = ref(0);
    const { t } = useI18n();
    const withdrawState = reactive({
      bankCardList: [],
    });
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: "",
    });
    // const store = useStore();
    const withdrawalMethods = ref([])
    onMounted(() => {
      getWithdrawalMethods()
    });
    const submitWithdraw = () => {
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
    var checkAmt = (rule, value, callback) => {
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
    const withdrawRules = {
      amount: [
        {
          required: true,
          message: t('message.requiredAmount'),
          trigger: "blur",
        },
        { validator: checkAmt, trigger: 'blur' }
        // {
        //   pattern: '^([1-9][0-9]*)$',
        //   message: "amount should be a positive number",
        //   trigger: "change",
        // },
      ],
      cardId: [
        {
          required: true,
          message: t('message.selectBankCard'),
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
      loadCards()
    }
    const loadCards = () => {
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
    const getWithdrawalMethods = () => {
      // withdrawalMethods.value = [
      //   { currencyId: 6, name: "withdraw_bank", code: "BANK", icon: "71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png", withdrawMin: 1000.00, withdrawMax: 10000.00, withdrawMaxAmount: 30000.00, withdrawMaxTimes: 3 },
      //   { currencyId: 6, name: "withdraw_gcash", code: "GCASH", icon: "c9d92237-4e44-4ee7-92c7-ceb5214f225f.png", withdrawMin: 1000.00, withdrawMax: 10000.00, withdrawMaxAmount: 30000.00, withdrawMaxTimes: 3 }
      // ]
      // selectMethod(withdrawalMethods.value[0], 0)
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
    return {
      formRef,
      withdrawInfo,
      submitWithdraw,
      withdrawRules,
      withdrawState,
      withdrawalMethods,
      activeItem,
      selectMethod,
      imgURL,
      selectedWithdrawalMethod,
      loadCards,
      selectedCard,
      t
    };
  }
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
