<template>
  <div>
    <div class="menu-title-container">
      <!-- <span class="menu-title">ถอน</span> -->
    </div>
    <div class="q-pa-md">
      <PanelWrapper>
        <template #title>
          <div class="text-white text-left flex column gap-0.35">
            {{ $t("lang.withdraw_process") }}:
            <br />
            <div class="flex justify-between">
              <div class="hue-purple">1.{{ $t("lang.withdraw_method") }}</div>
              <div>2.{{ $t("lang.verification_account") }}</div>
              <div>3.{{ $t("lang.withdraw_money") }}</div>
            </div>
          </div>
        </template>
        <div class="flex column gap-1.2 overflow-hidden">
          <div class="full-width">
            <div class="q-mb-xs">{{ $t("lang.withdraw_method") }}</div>
            <q-select filled :options="withdrawalMethods" dense>
              <template v-slot:selected>
                <PlatformItem directory="/withdraw/" dense :scope="selectedPlatform" class="q-pl-xs" />
              </template>
              <template v-slot:option="scope">
                <PlatformItem directory="/withdraw/" :scope="scope" @click="selectMethod(scope.opt, scope.index)" />
              </template>
            </q-select>
          </div>

          <div class="full-width">
            <div class="q-mb-xs">{{ $t("lang.select_bank_account") }}</div>
            <q-select
              filled
              ref="cardRef"
              v-model="withdrawInfo.cardId"
              option-value="id"
              color="white"
              emit-value
              map-options
              behavior="menu"
              dense
              :options="withdrawState.bankCardList"
              class="q-py-none"
            >
              <template v-slot:no-option>
                <q-item dense>
                  <q-item-section class="text-grey">
                    {{ $t("lang.no_usable_cards") }}
                    <router-link to="/account/withdraw">{{ $t("lang.add_card") }}</router-link>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" dense>
                  <q-item-section avatar>
                    <img v-if="scope.opt.bankIcon" style="width: 30px" :src="imgURL + scope.opt.bankIcon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.bankName }} - {{ scope.opt.cardNumber }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <PlatformItem directory="/payment/" dense :scope="scope" class="q-pl-xs" />
              </template>
            </q-select>
          </div>

          <div class="full-width">
            <div class="q-mb-xs">{{ $t("lang.please_enter_the_amount") }}</div>
            <q-input
              filled
              dense
              ref="amountRef"
              v-model="withdrawInfo.amount"
              :placeholder="$t('lang.minimum_withdraw_money')"
              mask="######"
              color="white"
              :rules="[
                (val) => (val && val.length > 0) || $t('lang.enter_amount_money'),
                (val) => val >= selectedWithdrawalMethod.withdrawMin || $t('lang.amount_should_more_than_min'),
                (val) => val <= selectedWithdrawalMethod.withdrawMax || $t('lang.amount_should_less_than_max')
              ]"
              @keydown="restrictDecimalInput"
              clearable
            >
              <template v-slot:append>
                <span class="text-caption">THB</span>
              </template>
            </q-input>
          </div>

          <div class="account-content last">
            <q-form class="flex column items-center gap-8">
              <div class="text-left full-width" v-show="selectedWithdrawalMethod">
                <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
                  {{
                    $t("lang.min_max_amount") +
                    ": " +
                    selectedWithdrawalMethod.withdrawMin +
                    " - " +
                    selectedWithdrawalMethod.withdrawMax
                  }}
                  <br />
                </template>
                <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
                  {{ $t("lang.withdrawal_today") + selectedWithdrawalMethod.withdrawMaxAmount }}
                </template>
                <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
                  {{
                    " " +
                    $t("lang.remaining") +
                    " " +
                    selectedWithdrawalMethod.withdrawMaxTimes +
                    " " +
                    $t("lang.attempt_time")
                  }}
                </template>
              </div>
              <div class="text-left full-width" v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
                <span style="color: #9bffd1">1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }} THB</span>
              </div>

              <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="text-left full-width">
                <span style="color: #9bffd1">
                  {{ $t("lang.estimate_arrival") }}
                  {{
                    selectedWithdrawalMethod &&
                    (withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin ||
                      withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate - 1 < 0)
                      ? "0.00"
                      : (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate - 1).toFixed(2)
                  }}
                  USDT
                </span>
              </div>

              <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="text-left full-width">
                <span style="color: #9bffd1">({{ $t("lang.usdt_will_be_charged") }})</span>
              </div>

              <!-- <a-form-item
            class="select"
            name="cardId"
            label="Select Bank Card"
            :rules="[{ required: true, message: 'Please select a bank card' }]"
          >
            <a-select
              v-model:value="withdrawInfo.cardId"
              placeholder="Please select a bank card"
            >
              <a-select-option
                v-for="b in withdrawState.bankCardList"
                :key="b.id"
                :value="b.id"
              >
                {{ b.bankName }} - {{ b.cardNumber }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
              <div class="flex-box flex-justify-center">
                <q-btn
                  class="btn btn-lg btn-brand q-mx-auto"
                  @click="submitWithdraw"
                  color="brand"
                  :label="$t('lang.confirm_withdrawal')"
                />
              </div>
            </q-form>
          </div>
        </div>
      </PanelWrapper>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted, onUpdated} from "vue";
// import { loadBankCards, confirmWithdraw, withdrawEntrance
// //  } from "@/api/personal/personal";
// import { message } from "ant-design-vue";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {userStore} from "stores/index";

import PanelWrapper from "src/components/PanelWrapper.vue";
import PlatformItem from "src/components/PlatformItem.vue";
import {useUI} from "stores/ui";
import {isH5} from "boot/utils"

export default defineComponent({
  name: "WithdrawView",
  components: {
    PanelWrapper, PlatformItem
  },
  setup() {
    const $q = useQuasar();
    const imgURL = process.env.IMAGE_CDN + '/payment/';

    const amountRef = ref();
    const cardRef = ref();
    const store = userStore();
    const ui = useUI()
    const activeItem = ref(0);
    const withdrawState = reactive({
      bankCardList: [],
    });
    const qs = require("qs")
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: "",
    });
    const withdrawalMethods = ref([]);
    const selectedWithdrawalMethod = ref([])
    onMounted(() => {
      getWithdrawalMethods()
    });
    onUpdated(() => {
      if (ui.isCardUpdate === true) {
        ui.isCardUpdate = false;
        getWithdrawalMethods()
      }
    })
    const submitWithdraw = () => {
      cardRef.value.validate();
      amountRef.value.validate();
      $q.loading.show({
        message: "Confirming Withdrawal"
      });
      if (cardRef.value.hasError || amountRef.value.hasError) {
        $q.loading.hide();
      } else {
        api.post("/session/withdraw/", qs.stringify(withdrawInfo)).then((res) => {
          const response = res.data
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "สำเร็จ",
              icon: "check_circle_outline"
            });
            getWithdrawalMethods();
            withdrawInfo.amount = "";
            store.getBalance();
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: response.message,
            //   icon: "report_problem"
            // });
          }
        }).catch((error) => {
          console.log("error", error);
        });
        $q.loading.hide();
      }
    }
    const isUSDT = ref(false);
    const selectMethod = (method, index) => {
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      selectedWithdrawalMethod.value = method
      withdrawInfo.withdrawCode = method.code;
      if (withdrawInfo.withdrawCode.includes('USDT')) {
        isUSDT.value = true
      } else {
        isUSDT.value = false;
      }
      activeItem.value = index;
      loadCards()
    }

    const loadCards = () => {
      api.get("/session/bankCard").then((res) => {
        const response = res.data
        withdrawState.bankCardList = []
        if (response.code === 0) {
          // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
          response.data.forEach(element => {
            if (element && element.bankType === 'BANK') {
              if (element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                withdrawState.bankCardList.push({
                  ...element,
                  name: `${element.bankName} - ${element.cardNumber}`,
                  icon: element.bankIcon
                })
              }
            } else if (element.bankType === 'CRYPTO') {
              if (element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
                withdrawState.bankCardList.push({
                  ...element,
                  name: `${element.bankName} - ${element.cardNumber}`,
                  icon: element.bankIcon
                })
              }
            }
          });

          cardRef.value.resetValidation();
          // if (withdrawState.bankCardList.length)
          // withdrawInfo.cardId = withdrawState.bankCardList[0].id
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }
    const getWithdrawalMethods = () => {
      api.get("/session/withdraw/entrance").then((res) => {
        const response = res.data
        if (response.code === 0) {
          withdrawalMethods.value = response.data
          //Remove this for real data
          if (withdrawalMethods.value.length > 0) {
            selectMethod(withdrawalMethods.value[0], 0)
          }
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
    }

    const restrictDecimalInput = (e) => {
      const num = +e.key;
      if (num !== 0 && !num && !['Backspace', 'Delete'].includes(e.key)) e.preventDefault();
    };

    return {
      amountRef,
      cardRef,
      withdrawInfo,
      submitWithdraw,
      withdrawState,
      withdrawalMethods,
      activeItem,
      selectMethod,
      imgURL,
      step: ref(),
      selectedWithdrawalMethod,
      loadCards,
      isUSDT,
      store,
      restrictDecimalInput,
      isH5
    };
  },
  computed: {
    selectedPlatform(props) {
      const selectedIndex = props.activeItem ?? 0;

      return {
        ...props.withdrawalMethods[selectedIndex],
        opt: {...props.withdrawalMethods[selectedIndex]},
        itemProps: {}
      }
    }
  },
});
</script>

<style scoped lang="scss">
:deep(.ant-form-item) {
  align-items: center;

  &.tip {
    margin-top: -20px;
    color: #ffffff;
  }
}

.helptxt {
  display: flex;
  align-items: flex-start;

  .ant-input {
    background: #23263c;
    width: 50%;
    max-width: 280px;
    padding: 10px;
    border: #23263c;
  }

  :deep(.ant-form-item-control-input-content) {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    align-items: flex-start;
  }
}

:deep(.ant-form-horizontal .ant-form-item-label) {
  width: 160px;
}

:deep(.ant-form-horizontal .ant-form-item-control) {
  width: unset;
}

:deep(.ant-form-item .ant-select) {
  width: 280px;
}

:deep(.ant-form-item.select .ant-form-item-control-input) {
  max-width: 280px;
}

:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  height: 40px;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  height: 40px;
  padding: 5px 20px;
  background: #23263c;
  color: #ffffff;
  border: 0;
}

.withdrawalmethod {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow-x: auto;
  padding: 15px 5px;
}

.withdrawal {
  ul {
    padding: 0 0 0 20px;

    li {
      list-style-type: disc;
      margin-bottom: 10px;
    }
  }

  :deep(.ant-steps-item) {
    flex: unset;
  }

  :deep(.ant-steps-item-process .ant-steps-item-icon) {
    background: #2b2b4b;
    border: 1px solid #db7e42;
  }

  :deep(.ant-steps-item-finish .ant-steps-item-icon) {
    background-image: $linear-bg-red;

    border: 1px solid #2b2b4b;

    svg {
      color: #ffffff;
      stroke-width: 5px;
    }
  }

  :deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
    color: #db7e42;
  }

  :deep(.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
    color: #ffffff;
  }

  :deep(.ant-steps-item-title::after) {
    display: none;
  }
}

.step-item {
  color: #ffffff;
  width: 130px;
  // height: 50px;
  line-height: 45px;
  background-color: #2b2b4b;
  text-align: center;
  position: relative;
  border: 2px solid #2b2b4b;
  border-left: 0;
  padding-left: 20px;
  font-weight: bold;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-top: 23px solid transparent;
    border-bottom: 23px solid transparent;
    top: 0px;
  }

  &::before {
    left: 0;
    top: -2px;
    border-left: 25px solid #24222e;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
  }

  &::after {
    border-left: 23px solid #2b2b4b;
    right: -23px;
    z-index: 1;
  }

  &.active {
    color: #24222e;
    background: #ffffff;
    border: 0;
    padding-left: 0px;

    &::after {
      border-left: 25px solid #ffffff;
      top: 0;
      right: -25px;
      border-top: 25px solid transparent;
      border-bottom: 25px solid transparent;
    }
  }

  &:first-child::before,
  &:last-child::after {
    display: none;
  }
}

.withdraw-type-item {
  width: 120px;
  margin-right: 10px;
  padding: 20px 20px;
  border-radius: 6px;
  border: solid 1px #484460;
  background: #2b2b4b;
  border-radius: 20px;

  position: relative;
  cursor: pointer;

  img {
    width: 100%;
  }

  &.active {
    background: #23263c;
    color: #db7e42;
    box-shadow: none;
    filter: drop-shadow(0px 0px 3px #ffffff);
  }

  .type-name {
    line-height: 15px;
    margin: 10px 0 0;
    overflow-wrap: break-word;
  }

  .promo {
    position: absolute;
    right: 0;
    top: 0;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: top center;
    top: -8px;
    right: -1px;
    background: $linear-bg-red;
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

.withdraw-btn {
  margin: 30px auto;

  &.cancel {
    margin-right: 60px;
  }
}
</style>

<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .withdraw-btn {
        min-width: unset;
        margin: 20px auto;
      }

      .step-item {
        font-size: 10px;
        line-height: 25px;
        font-weight: bold;

        &::before,
        &::after {
          content: "";
          position: absolute;
          top: 0px;
        }

        &::before {
          left: 0;
          top: -2px;
          border-left: 15px solid #24222e;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
        }

        &::after {
          border-left: 13px solid #2b2b4b;
          right: -13px;
          border-top: 13px solid transparent;
          border-bottom: 13px solid transparent;
          z-index: 1;
        }

        &.active {
          color: #24222e;
          background: #ffffff;
          border: 0;
          padding-left: 0px;

          &::after {
            border-left: 15px solid #ffffff;
            top: 0;
            right: -15px;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
          }
        }

        &:first-child::before,
        &:last-child::after {
          display: none;
        }
      }
    }
  }

  :deep(.ant-form-horizontal .ant-form-item-label) {
    text-align: left;
    width: 120px;
    flex: none;
    max-width: unset;
  }

  :deep(.ant-form-horizontal .ant-form-item-control) {
    width: auto;
    flex: none;
    max-width: unset;
  }
  .helptxt {
    :deep(.ant-form-item-control-input-content) {
      display: flex;
      flex-direction: column;
    }

    .ant-input {
      width: 100%;
    }
  }
}
</style>
