<template>
  <div>
    <div class="menu-title-container">
      <!-- <span class="menu-title">ถอน</span> -->
    </div>
    <div class="account-content withdrawal q-gutter-md q-pa-md">
      <div class="text-h6">Withdrawal Process</div>
      <q-stepper
        v-model="step"
        vertical
        active-color="white"
        inactive-color="white"
      >
        <q-step
          :done="true"
          prefix="1"
          :name="1"
          status="process"
          title="Applying"
          icon=""
        >
        </q-step>
        <q-step
          :done="true"
          prefix="2"
          :name="2"
          status="process"
          title="Pending"
        >
        </q-step>
        <q-step
          :done="true"
          prefix="3"
          :name="3"
          status="process"
          title="Paying"
        >
        </q-step>
        <q-step
          :done="true"
          prefix="4"
          :name="4"
          status="process"
          title="Successful"
        >
        </q-step>
      </q-stepper>
      <ul>
        <li>
          After the game is over. the system will check the score and
          synchronize the payout. please be patient and wait for a minute. Thank
          you for your understanding and support!
        </li>
        <li>
          If the withdrawal fails, please check the reason for the failure
          indicated in the letter on the site!
        </li>
      </ul>
    </div>
    <div class="q-pa-md q-mb-xl">
      <div class="text-h6">Withdrawal Method</div>
      <div class="account-content last">
        <div class="withdrawalmethod">
          <div
            v-for="(method, i) in withdrawalMethods"
            :key="i"
            class="txt-center withdraw-type-item"
            @click="selectMethod(method, i)"
            :class="{ active: i === activeItem }"
          >
            <span class="promo" v-if="method.recommended">Recommended</span>
            <img :src="imgURL + method.icon" />
            <div class="type-name">{{ method.name }}</div>
          </div>
        </div>
        <q-form>
          <q-input
            filled
            ref="amountRef"
            v-model="withdrawInfo.amount"
            label="Amount"
            color="white"
            mask="######"
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter an amount',
              (val) => (val >= selectedWithdrawalMethod.withdrawMin) || ('The amount should be as specified.'),
              (val) => (val <= selectedWithdrawalMethod.withdrawMax) || 'The amount should be as specified.'
            ]"
          >
            <template v-slot:append>
             <span style="font-size:15px">₱</span>
            </template>
          </q-input>
          <div class="q-mt-md q-mb-md" v-show="selectedWithdrawalMethod">
            <template
              v-if="
                selectedWithdrawalMethod.withdrawMin &&
                selectedWithdrawalMethod.withdrawMin
              "
            >
              {{
                "Single Limit: " +
                selectedWithdrawalMethod.withdrawMin +
                " - " +
                selectedWithdrawalMethod.withdrawMax
              }}
              <br />
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
              {{
                "Withdrawal today: " +
                selectedWithdrawalMethod.withdrawMaxAmount
              }}
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
              {{
                " Remaining: " +
                selectedWithdrawalMethod.withdrawMaxTimes +
                " times"
              }}
            </template>
          </div>
          <div class="q-my-md" v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" label="Exchange Rate">
          <span style="color: #9bffd1"
            >1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }} {{ store.currency.value }}</span
          >
          </div>
          <q-select
            filled
            ref="cardRef"
            v-model="withdrawInfo.cardId"
            option-value="id"
            emit-value
            label="Select Bank Card"
            color="white"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || 'Please select a bank card.']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >No cards available.
                  <router-link to="/account/withdraw"
                    >Add a card</router-link
                  ></q-item-section
                >
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img v-if="scope.opt.bankIcon" style="width: 30px;" :src="imgURL + scope.opt.bankIcon">
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    >{{ scope.opt.bankName }} - {{ scope.opt.cardNumber }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
                <q-item-section avatar>
                  <img v-if="scope.opt.bankIcon" style="width: 30px; margin-top: 10px; margin-bottom: 10px;" :src="imgURL + scope.opt.bankIcon">
                </q-item-section>
                <q-item-section>
                  <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
                    >{{ scope.opt.bankName }} - {{ scope.opt.cardNumber }}
                  </q-item-label>
                </q-item-section>
            </template>
          </q-select>
          
        <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="q-my-md" label="จํานวนเงินโดยประมาณ">
          <span style="color: #9bffd1"
            >{{
              (
                withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate
              ).toFixed(2)
            }}
            USDT</span>
        </div>

        <q-input
          filled
          ref="withdrawPasswordRef"
          v-model="withdrawInfo.withdrawPassword"
          label="Withdraw Password"
          color="white"
          type="password"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter withdraw password',
            (val) => (val.length > 5 && val.length < 12) || 'Length should be 6 to 12'
          ]"
        >
          <template v-slot:append>
           <span style="font-size:15px"></span>
          </template>
        </q-input>
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
              class="q-mt-md"
              @click="submitWithdraw"
              color="brand"
              label="Confirm Withdrawal"
            />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
// import { loadBankCards, confirmWithdraw, withdrawEntrance
// //  } from "@/api/personal/personal";
// import { message } from "ant-design-vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "WithdrawView",
  setup() {
    const $q = useQuasar();
    const imgURL = process.env.IMAGE_CDN + '/'
    const amountRef = ref();
    const cardRef = ref();
    const withdrawPasswordRef = ref();
    const activeItem = ref(0);
    const withdrawState = reactive({
      bankCardList: [],
    });
    const qs = require("qs")
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: "",
      withdrawPassword: ""
    });
    const withdrawalMethods = ref([]);
    const selectedWithdrawalMethod = ref([])
    onMounted(() => {
      getWithdrawalMethods()
    });
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
            if(response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Redirecting",
                icon: "check_circle_outline"
              });
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
      withdrawInfo.withdrawPassword = null;
      selectedWithdrawalMethod.value = method
      withdrawInfo.withdrawCode = method.code;
      if (withdrawInfo.withdrawCode.includes('USDT')) {
        isUSDT.value = true
      } else {
        isUSDT.value = false
      }
      activeItem.value = index;
      loadCards()
    }

    const loadCards = () => {
      api.get("/session/bankCard").then((res) => {
        const response = res.data
        withdrawState.bankCardList = []
        if(response.code === 0) {
          // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
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
            // else {
            //   response.data.forEach(element => {
            //     if (element.bankId !== 39) {
            //       withdrawState.bankCardList.push(element)
            //     }
            //   });
            // }
            cardRef.value.resetValidation();

        }
      }).catch((error) => {
        console.log("error", error);
      });}
    const getWithdrawalMethods = () => {
      api.get("/session/withdraw/entrance").then((res) => {
        const response = res.data
        if (response.code === 0) {
          withdrawalMethods.value = response.data
          //Remove this for real data
          // withdrawalMethods.value = [
          //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
          //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]
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

    return {
      amountRef,
      cardRef,
      withdrawPasswordRef,
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
      store: userStore()
    };
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
:deep(.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-search-input) {
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
    background-image: linear-gradient(to right, #de4545, #db7e42);

    border: 1px solid #2b2b4b;
    svg {
      color: #ffffff;
      stroke-width: 5px;
    }
  }
  :deep(.ant-steps-item-finish
      > .ant-steps-item-container
      > .ant-steps-item-content
      > .ant-steps-item-title) {
    color: #db7e42;
  }
  :deep(.ant-steps-item-process
      > .ant-steps-item-container
      > .ant-steps-item-content
      > .ant-steps-item-title) {
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
  img { width: 100%; }
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
