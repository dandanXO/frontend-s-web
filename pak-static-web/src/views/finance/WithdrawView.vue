<template>
  <div>
    <div class="balance-withdrawal-container">
      <div class="balance">
        <div class="amt">{{ store.balance }}</div>
        <div class="words">Cash balance</div>
      </div>
      <div class="withdrawable">
        <div class="amt">{{ selectedWithdrawalMethod.withdrawableBalance }}</div>
        <div class="words">Cash balance</div>
      </div>
    </div>

    <div class="account-content last">
      <span class="account-title">Withdrawal Method</span>
      <div class="flex-box account-content withdrawalmethod">
        <div
          v-for="(method, i) in withdrawalMethods"
          :key="i"
          class="txt-center withdraw-type-item"
          :class="{ active: i === activeItem }"
          @click="selectMethod(method, i)"
        >
          <span v-if="method.recommended" class="promo">Recommended</span>
          <img :src="imgURL + method.icon" />
          <div class="type-name">
            {{ method.name }}
          </div>
        </div>
      </div>
      <a-form ref="formRef" :hide-required-mark="true" :model="withdrawInfo" :rules="withdrawRules" :colon="false">
        <span class="account-title">{{!isVirtual ? 'Bank card' : 'E-wallet'}}</span>
      
        <a-form-item
          class="select"
          name="cardId"
          :rules="[
            {
              required: true,
              message: !isVirtual ? 'Bank card is required' : 'E-wallet is required'
            }
          ]"
        >
          <a-select
            v-model:value="withdrawInfo.cardId"
            :placeholder="!isVirtual ? 'Select bank card' : 'Select E-wallet'"
          >
            <a-select-option v-for="b in withdrawState.bankCardList" :key="b.id" :value="b.id">
              Acc No. **** {{ b.cardNumber.slice(b.cardNumber.length - 4, b.cardNumber.length) }}<br>
              IFSC {{ b.cardAddress }}
            </a-select-option>
          </a-select>
        </a-form-item>

      
        <div class="bot-wrapper">
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">Withdraw Amount</div>
              </div>
              <div class="desc">RS:{{ convertToCommaAmount(selectedWithdrawalMethod.withdrawAmount) }}</div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">{{ store.vip }} Daily Limit</div>
              </div>
              <div class="desc">RS:{{ convertToCommaAmount(selectedWithdrawalMethod.withdrawMaxAmount) }}</div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">Remain Wagers</div>
              </div>
              <div class="desc">RS:{{ convertToCommaAmount(selectedWithdrawalMethod.remainWagers) }}</div>
            </div>
        </div>

        <span class="account-title">{{'Amount (' + convertToCommaAmount(selectedWithdrawalMethod.withdrawMin) + ' - ' + convertToCommaAmount(selectedWithdrawalMethod.withdrawMax) + ')'}}</span>
      
        <a-form-item ref="amount" class="helptxt" name="amount">
          <a-input
            v-model:value="withdrawInfo.amount"
            class="form-input"
            placeholder="Enter the withdrawal amount"
            :prefix="store.currency.value"
          />
          <!-- <div class="account-tip remain-box" style="flex-direction: column; align-items: flex-start">
            <div class="account-tip-text">
              <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
                {{
                  "Single Limit: " + selectedWithdrawalMethod.withdrawMin + " - " + selectedWithdrawalMethod.withdrawMax
                }}
                <br />
              </template>
            </div>
            <div class="account-tip-text">
              <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
                {{ "Withdrawal today: " + selectedWithdrawalMethod.withdrawMaxAmount }}
              </template>
              <template v-if="selectedWithdrawalMethod.withdrawMaxTimes > -1">
                {{ " Remaining: " + selectedWithdrawalMethod.withdrawMaxTimes + " times" }}
              </template>
            </div>
          </div> -->
        </a-form-item>
        
        <!-- <a-form-item v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="helptxt" label="Exchange Rate">
          <span style="color: #0b8f1a">
            1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
            {{ store.currency.value }}
          </span>
        </a-form-item>
        <a-form-item
          class="select"
          name="cardId"
          :label="!isVirtual ? 'Bank card' : 'E-wallet'"
          :rules="[
            {
              required: true,
              message: !isVirtual ? 'Bank card is required' : 'E-wallet is required'
            }
          ]"
        >
          <a-select
            v-model:value="withdrawInfo.cardId"
            :placeholder="!isVirtual ? 'Select bank card' : 'Select E-wallet'"
          >
            <a-select-option v-for="b in withdrawState.bankCardList" :key="b.id" :value="b.id">
              {{ b.bankName }} - {{ b.cardNumber }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="helptxt" label="Estimated amount">
          <span style="color: #0b8f1a">
            {{
              selectedWithdrawalMethod && withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin
                ? "0.00"
                : (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate - 1).toFixed(2) > 0
                ? (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate - 1).toFixed(2)
                : "0.00"
            }}
            USDT
          </span>
        </a-form-item>

        <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="text-left full-width">
          <span style="color: #0b8f1a">1.00 USDT will be charged for each transaction</span>
        </div> -->
        <div class="flex-box flex-justify-start">
          <button class="common-btn confirm-btn" @click="submitWithraw">Confirm Withdrawal</button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="js">
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import { loadBankCards, confirmWithdraw, withdrawEntrance
 } from "@/api/personal/personal";
import { message } from "ant-design-vue";
import { userStore } from "@/store";
import { convertToCommaAmount } from "@/utils/utils";


    const store = userStore();
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/withdraw/'
    const formRef = ref();
    const activeItem = ref(0);
    const isUSDT = ref(false);
    const withdrawState = reactive({
      bankCardList: [],
    });
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: "",
    });
    const withdrawalMethods = ref([])
    const withdrawMethod= ref("EASYPAISA");
    const isVirtual= computed(() => {
      return (withdrawMethod.value === 'EASYPAISA') ? false : true;
    })
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
    };
    // withdrawPassword: [
    //   {
    //     required: true,
    //     message: "Withdraw Password is required",
    //     trigger: "blur"
    //   },
    //   {
    //     min: 6,
    //     max: 12,
    //     message: "Length should be between 6 to 12",
    //     trigger: "blur"
    //   }
    // ]
    const selectedWithdrawalMethod = ref([])
    const selectMethod = (method, index) => {
      console.log(method)
      withdrawMethod.value= method.code;

      withdrawInfo.amount = null;
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = method.id;
      // withdrawInfo.withdrawPassword = null;
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
              if (element && element.bankType === 'BANK') {
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
</script>

<style scoped lang="scss">
.dark-theme {
  .account-container .account-content-wrapper .withdraw-type-item {
    &.active {
      background: #ffffff0d;
      border: 1px solid #48a7ff;
      filter: none;
      color: #ffffff;
      .type-name {
        color: #ffffff;
      }
    }
  }
}
.balance-withdrawal-container {
  background: #FFFFFF0D;
  display: flex;
    padding: 10px;
    width: 340px;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  .balance, .withdrawable {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 15px;
    .amt {
      font-family: 'Poppins Bold';
      font-size: 24px;
      line-height: 24px;  
    }
    .words {
      font-family: 'Poppins Medium';
      font-size: 12px;
      color: #9F9F9F;
    }
  }
  .balance {
    border-right: 1px solid #FFFFFF0D;
  }
}
.bot-wrapper {
  gap: 10px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .info {
    background: linear-gradient(90deg, #70BC62 -1.25%, #131313 104.06%);
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    width: 360px;
    border-radius: 50px;
    .desc {
      &:first-child {
        
        color: #ffffff;
      }
      color: #8C968F;

    }
  }
}
.account-container {
  .confirm-btn {
    width: 360px;
    margin-top: 10px;
  }
  .account-content-wrapper {
    .withdrawalmethod {
      overflow-x: auto;
      // padding: 15px 5px;
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
      :deep(.ant-steps-item-process .ant-steps-item-icon) {
        border: 1px solid;
        border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      }
      :deep(.ant-steps-item-finish .ant-steps-item-icon) {
        background-image: linear-gradient(to right, #de4545, #db7e42);

        border: 1px solid #2b2b4b;
        svg {
          stroke-width: 5px;
        }
      }
      :deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
        color: #db7e42;
      }
      :deep(.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
      }
      :deep(.ant-steps-item-title::after) {
        display: none;
      }
    }
    .step-item {
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
      width: 100px;
      margin-right: 10px;
      padding: 15px;
      border-radius: 12px;

      position: relative;
      cursor: pointer;
      img {
        width: 100%;
        border-radius: 12px;
      }
      &.active {
        background: rgba(7, 91, 232, 0.1019607843);
        box-shadow: none;
        filter: drop-shadow(0px 0px 3px #ffffff);
        pointer-events: none;
        .type-name {
          color: #075be8;
          font-family: Inter Bold;
        }
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
@media (max-width: 767px) {
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
  padding: 8px 16px;
  max-width: 360px;
  .ant-input {
    border: 0;
  }
  .ant-input-suffix, 
  .ant-input-prefix {
    color: #8C968F;
;
  }
}

:deep(
    .ant-form-item-has-error .ant-input-affix-wrapper:hover,
    .ant-form-item-has-error .ant-input-affix-wrapper:focus
  ) {
  background: unset;
}
:deep(
    .ant-form-item-has-error .ant-input,
    .ant-form-item-has-error .ant-input-affix-wrapper,
    .ant-form-item-has-error .ant-input:hover,
    .ant-form-item-has-error .ant-input-affix-wrapper:hover
  ) {
  background: unset;
}
</style>
