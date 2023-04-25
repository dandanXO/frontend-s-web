<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Quick withdraw</span>
    </div>
    <div class="account-title-container">
      <span class="account-title">Withdrawal Process</span>
    </div>
    <div class="account-content withdrawal">
      <!-- รายการที่รอดำเนินการ -->
      <a-steps>
        <a-step status="process" title="Applying"> </a-step>
        <a-step status="process" title="Pending"> </a-step>
        <a-step status="process" title="Paying"> </a-step>
        <a-step status="process" title="Successful"> </a-step>
      </a-steps>

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

    <div class="account-title-container">
      <span class="account-title">Withdrawal Method</span>
    </div>
    <div class="account-content last">
      <div class="flex-box account-content withdrawalmethod">
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
      <a-form
        ref="formRef"
        :hideRequiredMark="true"
        :model="withdrawInfo"
        :rules="withdrawRules"
        :colon="false"
      >
        <a-form-item class="helptxt" ref="amount" label="Amount" name="amount">
          <a-input
            class="form-input"
            v-model:value="withdrawInfo.amount"
            placeholder="Enter the withdrawal amount"
            :suffix="store.currency.value"
          />
          <div class="account-tip remain-box">
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
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes > -1">
              {{
                " Remaining: " +
                selectedWithdrawalMethod.withdrawMaxTimes +
                " times"
              }}
            </template>
          </div>
        </a-form-item>
        <a-form-item
          v-if="isUSDT && selectedWithdrawalMethod.exchangeRate"
          class="helptxt"
          label="Exchange Rate"
        >
          <span style="color: #9bffd1"
            >1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
            {{ store.currency.value }}</span
          >
        </a-form-item>
        <a-form-item
          class="select"
          name="cardId"
          label="Bank card"
          :rules="[{ required: true, message: 'Bank card is required' }]"
        >
          <a-select
            v-model:value="withdrawInfo.cardId"
            placeholder="Select bank card"
          >
            <a-select-option
              v-for="b in withdrawState.bankCardList"
              :key="b.id"
              :value="b.id"
            >
              {{ b.bankName }} - {{ b.cardNumber }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="isUSDT && selectedWithdrawalMethod.exchangeRate"
          class="helptxt"
          label="Estimated amount"
        >
          <span style="color: #9bffd1"
            >{{
              (
                withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate
              ).toFixed(2)
            }}
            USDT</span
          >
        </a-form-item>
        <a-form-item class="helptxt" ref="withdrawPassword" label="Withdraw Password" name="withdrawPassword">
          <a-input
            class="form-input"
            type="password"
            v-model:value="withdrawInfo.withdrawPassword"
            placeholder="Enter the withdrawal password"
          />
        </a-form-item>
        <div class="flex-box flex-justify-center">
          <button class="common-btn withdraw-btn" @click="submitWithraw">
            Confirm Withdrawal
          </button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { loadBankCards, confirmWithdraw, withdrawEntrance
 } from "@/api/personal/personal";
import { message } from "ant-design-vue";
import { userStore } from "@/store";

export default defineComponent({
  name: "WithdrawView",
  setup() {

    const store = userStore();
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/'
    const formRef = ref();
    const activeItem = ref(0);
    const isUSDT = ref(false);
    const withdrawState = reactive({
      bankCardList: [],
    });
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: "",
      withdrawPassword: ""
    });
    const withdrawalMethods = ref([])
    onMounted(() => {
      getWithdrawalMethods()
    });
    const submitWithraw = () => {
      formRef.value
        .validate()
        .then(() => {
          confirmWithdraw(withdrawInfo).then((response) => {
            if(response.code === 0) {
              store.getBalance();
              message.success("Success");
              getWithdrawalMethods();
            } else {
              // message.error(response.message);
            }
          }).catch((error) => {
            console.log("error", error);
            // message.error(error.message, 4);
          });
        }).catch((error) => {
          console.log("error", error);
        });
    };
    const withdrawRules = {
      amount: [
        {
          required: true,
          message: "Amount is required",
          trigger: "blur",
        },
        {
          pattern: '^([1-9][0-9]*)$',
          message: "Amount should be a positive number",
          trigger: "change",
        },
      ],
      withdrawPassword: [
        {
          required: true,
          message: "Withdraw Password is required",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "Length should be between 6 to 12",
          trigger: "blur"
        }
      ]
    };
    const selectedWithdrawalMethod = ref([])
    const selectMethod = (method, index) => {
      withdrawInfo.amount = null;
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      withdrawInfo.withdrawPassword = null;
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
                  if (element.bankCode && element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
                    withdrawState.bankCardList.push(element)
                  }
                }
            });
          }
        }).catch((error) => {
          console.log("error", error);
        })
    }
    const getWithdrawalMethods = () => {
      withdrawEntrance().then((response) => {
        if (response.code === 0) {
          withdrawalMethods.value = response.data
          if (withdrawalMethods.value.length > 0) {
            selectMethod(withdrawalMethods.value[0], 0)
          }
        } else {
          message.error(response.message);
        }
      })
    }
    return {
      formRef,
      withdrawInfo,
      submitWithraw,
      withdrawRules,
      withdrawState,
      withdrawalMethods,
      activeItem,
      selectMethod,
      imgURL,
      selectedWithdrawalMethod,
      loadCards,
      isUSDT,
      store
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
.account-container {
  .account-content-wrapper {
    .withdrawalmethod {
      overflow-x: auto;
      padding: 15px 5px;
    }
    .withdrawal {
      ul {
        margin: 20px auto;
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
      width: 85px;
      margin-right: 10px;
      padding: 15px;
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
  }
  .withdraw-btn {
    margin: 30px auto;
    &.cancel {
      margin-right: 60px;
    }
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
:deep(.ant-input-affix-wrapper) {
  background: #23263c;
  border: 0;
  padding: 8px 16px;
  max-width: 250px;
  .ant-input {
    border: 0;
  }
  .ant-input-suffix {
    color: #ffffff;
  }
}
:deep(.ant-form-item-has-error
    .ant-input-affix-wrapper:hover, .ant-form-item-has-error
    .ant-input-affix-wrapper:focus) {
  background: #23263c;
}
:deep(.ant-form-item-has-error .ant-input, .ant-form-item-has-error
    .ant-input-affix-wrapper, .ant-form-item-has-error
    .ant-input:hover, .ant-form-item-has-error .ant-input-affix-wrapper:hover) {
  background: #23263c;
}
</style>
