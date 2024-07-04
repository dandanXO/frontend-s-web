<template>
  <div class="page-container">
    <div class="form-wrapper">
      <div class="modal-body-wrap">
        <q-card-section class="modal-body-content">

          <ReminderText :reminderText="$t('lang.withdraw_reminder_text')" />

          <div class="withdrawalmethod">
            <template v-if="isLoading">
              <q-skeleton v-for="rectSkeleton in 3" type="rect" class="withdraw-type-item"
                style="width:250px; height:45px;" :key="rectSkeleton" />
            </template>
            <div v-else v-for="(method, i) in withdrawalMethods" :key="i" class="withdraw-type-item"
              :class="{ active: method.id === selectedWithdrawalMethod.id }">
              <div class="withdraw-img">
                <q-img class="node-icon-img" :src="imgURL + '/withdraw/' + method.icon" :fit="'scale-down'">
                  <template v-slot:loading>
                    <q-spinner-orbit size="0.5em" />
                  </template>
                </q-img>
              </div>
              <div class="type-name">{{ method.name }}</div>
            </div>
          </div>

          <q-form ref="withdrawFormRef" class="form-template">
            <div class="form-item">
              <label>{{ isUSDT ? $t('lang.withdraw_virtual_currency') : $t('lang.withdraw_bank_card')
                }}</label>
              <q-skeleton v-if="isLoading" type="QInput" />
              <q-select v-else dense hide-bottom-space outlined ref="cardRef" v-model="withdrawInfo.cardId"
                option-value="id" emit-value :options="withdrawState.bankCardList" map-options
                :rules="[(val) => !!val || (isUSDT ? $t('lang.withdraw_please_select_wallet') : $t('lang.withdraw_please_select_bank_card'))]"
                lazy-rules>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey text-bold text-caption">
                      {{ $t('lang.withdraw_no_card_available') }}
                      <router-link class="text-bright" to="/?page=bankcardlist">
                        {{ isUSDT ? $t('lang.withdraw_link_virtual_wallet') : $t('lang.withdraw_link_bank_card') }}
                      </router-link>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar v-if="scope.opt.bankIcon">
                      <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ scope.opt.bankName }} - ****{{
                          scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                        }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <q-item-section avatar v-if="scope.opt.bankIcon">
                    <img style="width: 30px;" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                      {{ scope.opt.bankName }} - ****{{
                        scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                      }}
                    </q-item-label>
                  </q-item-section>
                </template>
              </q-select>
            </div>

            <div class="form-item">
              <label>{{ $t('lang.withdraw_withdraw_amount') }}</label>
              <q-skeleton v-if="isLoading" type="QInput" />
              <q-input v-else dense outlined ref="amountRef" v-model="withdrawAmountFormatted" class="withdraw-field"
                :rules="[
                  (val) => !!parseDigitsWithComma(val) || '출금 금액을 입력해주세요',
                  (val) => parseDigitsWithComma(val) >= selectedWithdrawalMethod.withdrawMin || '올바른 출금 금액을 입력해주세요',
                  (val) => parseDigitsWithComma(val) <= selectedWithdrawalMethod.withdrawMax || '올바른 출금 금액을 입력해주세요',
                  (val) => (parseDigitsWithComma(val) && /^\d+$/.test(parseDigitsWithComma(val))) || '출금 금액에는 소수점을 사용할 수 없습니다'
                ]" clearable>
                <template v-slot:prepend>
                  <span style="z-index:1;font-size:16px;">
                    {{ store.currency.value }}
                  </span>
                </template>
              </q-input>

              <div class="select-amt-btn-wrapper">
                <template v-for="(item, index) in countOptions" :key="index">
                  <q-skeleton v-if="isLoading" type="QBtn" />
                  <q-btn dense v-else class="select-amt-btn" size="md" :label="item + '만원'"
                    @click="updateWithdrawItem(item)" />
                </template>
              </div>
            </div>

            <div class="form-item q-pt-xs">
              <label>{{ $t('lang.withdraw_withdraw_password') }}</label>
              <q-skeleton v-if="isLoading" type="QInput" />
              <q-input v-else :type="isPwd ? 'password' : 'text'" dense outlined ref="withdrawPassRef"
                v-model="withdrawInfo.withdrawPassword" class="withdraw-field" :rules="[
                  (val) => !!val || '출금 비밀번호를 입력하세요',
                  (val) => val && val.length === 4 || $t('lang.withdraw_withdraw_code_4_digits'),
                ]" clearable maxlength="4">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
            </div>

            <q-skeleton v-if="isLoading" type="text" />
            <div v-else-if="selectedWithdrawalMethod" class="text-caption withdraw-range-hint">
              <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
                <span>{{
                  $t('lang.withdraw_withdraw_amount_per_item') }}</span>
                <span>：</span>
                <span class="q-pa-xs">{{ `${selectedWithdrawalMethod.withdrawMin} 만 -
                  ${selectedWithdrawalMethod.withdrawMax} 만` }}</span>
              </template>
              <template v-if="selectedWithdrawalMethod.withdrawMaxAmount || selectedWithdrawalMethod.withdrawMaxTimes">
                <span>{{
                  $t('lang.withdraw_withdraw_amount_per_day') }}</span>
                <span>：</span>
                <span class="q-pa-xs">{{ `${selectedWithdrawalMethod.withdrawMaxTimes}회 총
                  ${selectedWithdrawalMethod.withdrawMaxAmount}억`
                  }}
                </span>
              </template>
            </div>

            <q-skeleton v-if="isLoading" type="text" />
            <div v-else-if="isUSDT && selectedWithdrawalMethod.exchangeRate"
              class="withdraw-exchange-rate-hint text-caption">
              <span>실시간 환율</span>
              <span>：</span>
              <span class="q-pa-sm" style="color:aqua">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>

              <span>예상 입금</span>
              <span>：</span>
              <span class="q-pa-sm" style="color:aqua">
                {{ (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate).toFixed(2) }}
                USDT
              </span>

              <span><span style="color:red;padding:0 2px;">*</span>특별 설명</span>
              <span>：</span>
              <span class="q-pa-sm">
                출금시 1테더 수수료를 받습니다
              </span>
            </div>

            <div class="q-py-md">
              <div v-if="!isUSDT && selectedWithdrawalMethod.tips" class="selected-tip"
                v-html="selectedWithdrawalMethod.tips">
              </div>
            </div>
          </q-form>

        </q-card-section>
      </div>
    </div>

    <div class="action-buttons">
      <q-btn @click="submitWithdraw" class="primary-button blue" :loading="withdrawLoading" :disable="withdrawLoading"
        :label="$t('lang.withdraw_confirm_withdraw')" />
    </div>
  </div>
</template>

<script setup id="FinanceWithdraw">

import { ref, onMounted, reactive, watch } from "vue";
import { api } from "boot/axios";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import ReminderText from 'components/finance/ReminderText';

const $q = useQuasar();
const { t } = useI18n();
const store = userStore();
const imgURL = process.env.IMAGE_CDN;

const isLoading = ref(false);
const withdrawFormRef = ref(null);
const withdrawState = reactive({
  bankCardList: []
});
const qs = require("qs");

const isPwd = ref(true)
const withdrawPassRef = ref()

const isUSDT = ref(false);
const withdrawLoading = ref(false);

const countOptions = ref([1, 5, 10, 50, 100, 500, 1000]);
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
  withdrawCode: "",
  withdrawPassword: ""
});

const amountRef = ref();
const cardRef = ref();

const withdrawalMethods = ref([]);
const selectedWithdrawalMethod = ref([]);

const withdrawAmountFormatted = ref('');

const parseDigitsWithComma = (value) => {
  const withdrawAmount = value?.replace(/\$\s?|(,*)/g, '');
  return withdrawAmount;
}

watch(() => withdrawAmountFormatted.value, () => {
  const withdrawAmount = withdrawAmountFormatted.value?.replace(/\$\s?|(,*)/g, '');
  if (isNaN(withdrawAmount)) {
    withdrawInfo.amount = '';
  } else {
    withdrawAmountFormatted.value = `${withdrawAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    withdrawInfo.amount = Number(withdrawAmount);
  }
})

watch(() => withdrawInfo.amount, () => {
  withdrawAmountFormatted.value = `${withdrawInfo.amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
})

const loadCards = () => {
  return new Promise((resolve) => {
    api.get("/session/bankCard").then((resp) => {
      resolve(resp.data);
    }).catch((error) => {
      console.log("error", error);
    });
  })
};

const updateWithdrawItem = (amt) => {
  const multiple = 10000;
  // 1원 = 10000;

  withdrawAmountFormatted.value = `${Number(withdrawInfo.amount) + (amt * multiple)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}



const submitWithdraw = () => {
  if (withdrawLoading.value) {
    return;
  }

  withdrawPassRef.value.validate();
  cardRef.value.validate();
  amountRef.value.validate();

  $q.loading.show({
    message: "확인 중。。。"
  });
  withdrawLoading.value = true;
  if (cardRef.value.hasError || amountRef.value.hasError || withdrawPassRef.value.hasError) {
    $q.loading.hide();
    withdrawLoading.value = false;
  } else {
    api.post("/session/withdraw/", qs.stringify(withdrawInfo)).then((resp) => {
      const response = resp.data;
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "제출 성공",
          icon: "check_circle_outline"
        });

        initWithdraw();

        withdrawInfo.amount = "";
        if (amountRef.value) {
          setTimeout(() => {
            amountRef.value.resetValidation();
          }, 0)
        }

        withdrawLoading.value = false;

      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: response.message,
          icon: "report_problem"
        });

        withdrawLoading.value = false;
      }
    }).catch((error) => {
      console.log("error", error);
      withdrawLoading.value = false;
    });
    $q.loading.hide();
  }
};


const getWithdrawalMethods = () => {
  return new Promise((resolve) => {
    api.get("/session/withdraw/entrance").then((resp) => {
      const response = resp.data;
      if (response.code === 0) {
        withdrawalMethods.value = response.data;

        resolve(response.data);
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: response.message,
          icon: "report_problem"
        });
      }
    });
  })
};

const initWithdraw = () => {
  isLoading.value = true;
  Promise.all([loadCards(), getWithdrawalMethods()]).then(([cardsRes, withdrawMethods]) => {
    const availableBankType = cardsRes.data?.[0]?.bankType;

    if (availableBankType) {
      const methodIndex = withdrawMethods.findIndex(({ code }) => availableBankType === 'CRYPTO' && code.includes('USDT') || code === availableBankType);

      if (methodIndex !== -1) {
        withdrawState.bankCardList = [];
        cardsRes.data.forEach(element => {
          withdrawState.bankCardList.push(element)
        });

        if (cardRef.value) {
          cardRef.value.resetValidation();
        }
        withdrawInfo.amount = "";
        if (amountRef.value) {
          setTimeout(() => {
            amountRef.value.resetValidation();
          }, 0)
        }

        const selectedMethod = withdrawMethods[methodIndex];
        withdrawalMethods.value = [selectedMethod];
        selectedWithdrawalMethod.value = selectedMethod;
        withdrawInfo.withdrawCode = selectedMethod.code;
        isUSDT.value = withdrawInfo.withdrawCode.includes('USDT')

        if (withdrawState.bankCardList?.[0]) {
          withdrawInfo.cardId = withdrawState.bankCardList[0].id;
        }
      }
    }

    store.getBalance();

    isLoading.value = false;
  }).catch(() => {
    isLoading.value = false;
  }).finally(() => {
    isLoading.value = false;
  })
}

onMounted(() => {
  initWithdraw();
});
</script>

<style lang="scss" scoped>
.form-wrapper {
  padding: 20px;
}

.select-amt-btn-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  align-items: center;
  gap: 8px;
}

.select-amt-btn {
  background: linear-gradient(to right, #18324A 0%, #11293d 100%);
  color: #e7e7e7;
  white-space: nowrap;
  font-family: 'Nanum';
}

.withdraw-section {
  width: 100%;
  margin: 10px auto;
  border-radius: 10px;
  padding: 10px 12px 15px;
  box-shadow: 0px -2px 6px 2px #c3d4e6 inset;
  background: #fff;
}

.withdrawalmethod {
  display: flex;
  grid-gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 12px;

  .withdraw-type-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-width: 150px;
    width: 200px;
    text-align: center;
    position: relative;
    cursor: pointer;

    background: #252e43;
    border-radius: 6px;
    color: #ffffff;

    width: calc(33% - 20px);
    padding: 0.2rem 0.35rem !important;
    justify-content: flex-start !important;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px !important;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    justify-content: flex-start;

    .promo-label {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translate(-50%);
      width: 50px;

      img {
        width: 100%;
        height: auto;
        padding: 4px 6px;
      }
    }

    .withdraw-img {
      border: 2px solid transparent;
      border-radius: 10px;
      // max-width: 4.5rem;
      max-width: 50px;

      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      border-radius: 4px;

      .node-icon-img {
        width: 26px;
        height: 26px;
      }
    }

    &.active {
      background: $linear-bg-2;
      border-radius: 6px;

      .promo-img {
        border: none;
        border-radius: 0px;
      }
    }

    .type-name {
      line-height: 15px;
      overflow-wrap: break-word;
    }

    .promo {
      position: absolute;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      top: -8px;
      right: -1px;
      background: linear-gradient(to right, #de4545, #db7e42);
      padding: 5px;
      color: #ffffff;
      font-size: 12px;
      line-height: 10px;
      border-radius: 0 10px;
      font-weight: bold;

      ::after {
        position: relative;
      }
    }
  }

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;

    .withdraw-type-item {
      width: 100%;

      .withdraw-img {
        .node-icon-img {
          width: 20px;
          height: 20px;
        }
      }

      .type-name {
        font-size: 12px;
      }
    }
  }

  .withdraw-btn {
    margin: 30px auto;

    &.cancel {
      margin-right: 60px;
    }
  }
}

.selected-tip {
  color: #ffa031;
}

.update-withdraw-btn {
  background: #38F3FF;
  color: #131313;
  padding: 0 10px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }
}

.bg-brightbtn {
  background: #38F3FF;
  color: #131313;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .modal-body-content {
    .content-form {
      p {
        margin-top: 10px;
      }

      label {
        margin-bottom: 8px;
        font-size: 13px;
      }

      input {
        font-size: 13px;
        line-height: 30px;
        color: #fff;
        padding: 3px 12px;
      }

      .option-btns {
        display: grid;
        grid-template-columns: auto auto auto auto;

        :deep(.q-btn) {
          max-width: unset;
        }
      }
    }
  }
}

.withdraw-range-hint {
  display: grid;
  grid-template-columns: auto 10px 1fr;
  align-items: center;
  color: #c4c4c4;
}

.withdraw-exchange-rate-hint {
  display: grid;
  grid-template-columns: auto 10px 1fr;
  align-items: center;
}
</style>
