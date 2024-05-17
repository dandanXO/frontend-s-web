<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">

      <div class="withdrawalmethod">
        <div
          v-for="(method, i) in withdrawalMethods"
          :key="i"
          class="withdraw-type-item"
          @click="selectMethod(method, i)"
          :class="{ active: i === activeItem }"
        >
          <span class="promo" v-if="method.recommended">Recommended</span>
          <div class="withdraw-img">
            <img :src="imgURL + '/withdraw/' + method.icon" />
          </div>
          <div class="type-name">{{ method.name }}</div>

          <div class="promo-label">
            <img class="promo-img" v-if="method.privilegeIcon" :src="`${imgWithdrawURL}${method.privilegeIcon}`" />
          </div>
        </div>
      </div>

      <q-form ref="withdrawFormRef">
        <q-select
          v-show="isLoaded"
          hide-bottom-space
          filled
          ref="cardRef"
          v-model="withdrawInfo.cardId"
          option-value="id"
          emit-value
          :label="'选择' + chooseLabel()"
          class="withdraw-selection q-mt-sm q-mb-sm"
          :options="withdrawState.bankCardList"
          map-options
          :rules="[(val) => !!val || '请选择' + chooseLabel()]"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ "没有可用的" + chooseCard() }}
                <router-link class="text-bright" to="/account/withdraw">
                  {{ isUSDT || isEWALLET ? "加" + chooseCard() : "绑定" + chooseCard() }}
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
              <img
                style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                :src="imgURL + '/payment/' + scope.opt.bankIcon"
              />
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

        <q-input
          hide-bottom-space
          ref="amountRef"
          v-model="withdrawInfo.amount"
          label="출금금액"
          class="withdraw-field"
          :rules="[
              (val) => (val && val.length > 0) || '请输入提款金额',
              (val) => val >= selectedWithdrawalMethod.withdrawMin || '请输入正确的提款金额',
              (val) => val <= selectedWithdrawalMethod.withdrawMax || '请输入正确的提款金额',
              (val) => (val && /^\d+$/.test(val)) || '提款金额不能有小数',
              isValidUSDTAmt
            ]"
          clearable
        >
          <template v-slot:prepend>
              <span style="font-size: 26px" class="text-bright">
                {{ store.currency.value }}
              </span>
          </template>
          <template v-slot:append>
              <span style="font-size: 26px" class="text-bright">
                <q-btn @click="updateWithdrawAmt" label="전액 인출" color="brightbtn" />
              </span>
          </template>
        </q-input>

        <p class="option-btns">
          <q-btn v-for="(item, index) in countOptions" :key="index" size="md" class="" :label="item + '원'"
                 @click="updateWithdrawItem(item)"
          ></q-btn>
        </p>

        <div
          class="q-mt-sm q-mb-sm text-grey text-bold q-pb-sm"
          style="border-bottom: 1px solid #434343"
          v-show="selectedWithdrawalMethod"
        >
          <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
            {{
              "单笔提款: " +
              selectedWithdrawalMethod.withdrawMin +
              "RMB - " +
              selectedWithdrawalMethod.withdrawMax +
              "RMB"
            }}
            <br />
          </template>
          <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
            {{ "今日提款: " + selectedWithdrawalMethod.withdrawMaxAmount + "RMB" }}
          </template>
          <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
            {{ " 剩余: " + selectedWithdrawalMethod.withdrawMaxTimes + " 次" }}
          </template>
        </div>
        <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
          <div class="q-my-sm" style="display: flex; justify-content: center; align-items: center">
            <span style="flex: 1">实时汇率：</span>
            <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>
          </div>
          <div class="q-mt-sm" style="display: flex; justify-content: center; align-items: center">
            <span style="flex: 1">预计到帐：</span>
            <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                {{ (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate).toFixed(2) }}
                USDT
              </span>
          </div>
          <div class="q-mt-sm text-neontb">*特别说明：三方自动收取提币 1.00 USDT 手续费！</div>
        </div>
        <!--          <div v-else-if="!isEWALLET && !isUSDT">-->
        <!--            <div class="q-mt-md text-neontb">*24小时内请勿提交相同提款金额，避免确认到账错误，需个人承担亏损！</div>-->
        <!--          </div>-->
        <div v-else-if="isEWALLET">
          <div class="q-mt-sm text-neontb">*特别说明：提款钱包和游戏账号的姓名务必一致</div>
          <div class="q-mt-sm q-mb-sm text-center" v-if="selectedWithdrawalMethod.code !== 'SZPAY'">
            <q-btn
              style="border: 1px solid #33bcd4; color: #33bcd4"
              @click="openEWalletTutorial(selectedWithdrawalMethod.code)"
              :label="tutorialLabel()"
            />
          </div>
        </div>

        <div class="flex-box flex-justify-center">
          <q-btn
            class="q-mt-md form-button blue quick-withdraw-btn"
            @click="submitWithdraw"
            :loading="withdrawLoading"
            :disable="withdrawLoading"
            label="정정하기"
          />
        </div>
        <div class="q-py-md">
          <div
            v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
            class="selected-tip"
            v-html="selectedWithdrawalMethod.tips"
          ></div>
          <div v-if="isALIPAY" class="selected-tip">
            “支付宝提款” 可用时间：早10点-晚12点，其他时间提交系统会自动取消！
          </div>
        </div>
      </q-form>

<!--      <form class="withdraw-form content-form">-->
<!--        <p>-->
<!--          <label>은행 카드</label>-->
<!--          <q-select-->
<!--            filled-->
<!--            ref="bankCardRef"-->
<!--            v-model="withdrawInfo.cardId"-->
<!--            :options="bankCardList"-->
<!--            option-value="id"-->
<!--            option-label="bankName"-->
<!--            emit-value-->
<!--            map-options-->
<!--          />-->
<!--        </p>-->
<!--      </form>-->
    </q-card-section>
  </div>
</template>

<script setup id="FinanceWithdraw">

import { ref, onMounted, reactive } from "vue";
import { api } from "boot/axios";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store= userStore();
const imgURL = process.env.IMAGE_CDN;
const imgWithdrawURL = process.env.IMAGE_CDN + "/withdraw/";

const isLoaded = ref(false);
const withdrawFormRef = ref(null);
const withdrawState = reactive({
  bankCardList: []
});
const qs = require("qs");

const isUSDT = ref(false);
const isEWALLET = ref(false);
const isALIPAY = ref(false);
const withdrawLoading = ref(false);

const activeItem = ref(0);
const countOptions = ref([1,5,10,50,100]);
const isLoadingBankCard = ref(false);
const bankCardList = ref([]);
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
  withdrawCode: ""
});

const amountRef = ref();
const cardRef = ref();

const withdrawalMethods = ref([]);
const selectedWithdrawalMethod = ref([]);

const loadCards = () => {
  api.get("/session/bankCard").then((resp) => {
    const response= resp.data;
    isLoaded.value = true;
    withdrawState.bankCardList = [];
    if (response.code === 0) {
      // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
      response.data.forEach(element => {
        if (element.bankType === "BANK") {
          if (element.bankCode !== 'alipay' && element.bankType.includes(selectedWithdrawalMethod.value.code)) {
            withdrawState.bankCardList.push(element)
          }
          if (element.bankCode === 'alipay' && selectedWithdrawalMethod.value.code === 'ALIPAY') {
            withdrawState.bankCardList.push(element)
          }
        } else {
          if (element.bankCode && element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
            withdrawState.bankCardList.push(element);
          }
        }
      });


      if (cardRef.value) {
        cardRef.value.resetValidation();
      }
      withdrawInfo.amount = "";
      if (amountRef.value) {
        setTimeout(()=>{
          amountRef.value.resetValidation();
        },0)
      }
    }
  }).catch((error) => {
    console.log("error", error);
  });
};

const updateWithdrawItem = (amt) => {
  withdrawInfo.amount= amt;
}

const selectMethod = (method, index) => {
  withdrawInfo.withdrawCode = null;
  withdrawInfo.cardId = null;
  selectedWithdrawalMethod.value = method;
  withdrawInfo.withdrawCode = method.code;
  isUSDT.value = withdrawInfo.withdrawCode.includes('USDT')
  isEWALLET.value = withdrawInfo.withdrawCode.includes('KDPAY') || withdrawInfo.withdrawCode.includes('EBPAY') || withdrawInfo.withdrawCode.includes('OKPAY') || withdrawInfo.withdrawCode.includes('SZPAY')
  isALIPAY.value = withdrawInfo.withdrawCode.includes('ALIPAY')
  activeItem.value = index;
  loadCards();
};



const submitWithdraw = () => {
  cardRef.value.validate();
  amountRef.value.validate();
  $q.loading.show({
    message: "확인 중。。。"
  });
  withdrawLoading.value = true;
  if (cardRef.value.hasError || amountRef.value.hasError) {
    $q.loading.hide();
    withdrawLoading.value = false;
  } else {
    api.post("/session/withdraw/", qs.stringify(withdrawInfo)).then((resp) => {
      const response= resp.data;
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "제출 성공",
          icon: "check_circle_outline"
        });
        getWithdrawalMethods();

        withdrawInfo.amount = "";
        if (amountRef.value) {
          setTimeout(()=>{
            amountRef.value.resetValidation();
          },0)
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

const updateWithdrawAmt = () => {
  withdrawInfo.amount = JSON.stringify(Math.floor(store.balance));
};

const tutorialLabel = () => {
  if (selectedWithdrawalMethod.value.code === 'KDPAY') {
    return 'K豆教程视频'
  } else if (selectedWithdrawalMethod.value.code === 'EBPAY') {
    return 'EB教程视频'
  } else if (selectedWithdrawalMethod.value.code === 'OKPAY') {
    return 'OK教程视频'
  }
}
const openEWalletTutorial = (code) => {
  const urlMap = {
    'KDPAY': 'https://kdzfxz.kdzf2345.com/home/#/transactionFlow',
    'EBPAY': 'https://www.ebpay.org/',
    'OKPAY': 'https://me-qr.com/l/okpay'
  };

  const url = urlMap[code];
  if (url) {
    window.open(url);
  }
};

const isValidUSDTAmt = (val) => {
  if(!isUSDT.value){
    return true;
  }
  const usdtPattern = /^([1-9][0-9]*)$/;
  return usdtPattern.test(withdrawInfo.amount) || "金额应为正数";
}

const getWithdrawalMethods = () => {
  api.get("/session/withdraw/entrance").then((resp) => {
    const response= resp.data;
    if (response.code === 0) {
      withdrawalMethods.value = response.data;
      //Remove this for real data
      // withdrawalMethods.value = [
      //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
      //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]
      if (withdrawalMethods.value.length > 0) {
        selectMethod(withdrawalMethods.value[0], 0);
      }
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: response.message,
        icon: "report_problem"
      });
    }
  });
};

const chooseLabel = () => {
  if (isUSDT.value) {
    return '가상 화폐'
  } else if (isEWALLET.value) {
    return '전자 지갑'
  } else {
    return '은행 카드'
  }
}

const chooseCard = () => {
  if (isUSDT.value) {
    return '가상 지갑'
  } else if (isEWALLET.value) {
    return '전자 지갑'
  } else {
    return '은행 카드'
  }
}

onMounted(() => {
  loadCards();
  store.getBalance();
  getWithdrawalMethods();
});
</script>

<style lang="scss">
.withdraw-form {
  .q-field--filled.q-field--dark .q-field__control, .q-field--filled.q-field--dark .q-field__control:before {
    width: 100%;
    font-size: 14px;
    border-radius: 3px;
    border: 1px solid #5C5C5C;
    line-height: 40px;
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>

.modal-body-content {
  .form-button {
    height: 70px;
    width: 200px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-bottom: 5px;
    margin: auto 10px;
    &.blue {
      background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
    }
    &.yellow {
      background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
    }
  }
  .content-form {
    p {
      margin-top: 20px;

    }
    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;

    }
    label, input {
      width: 100%;
    }
    input {
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5C5C5C;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }

    .option-btns {
      display: grid;
      grid-template-columns: auto auto auto auto auto auto auto;
      grid-row-gap: 12px;
      grid-column-gap: 12px;
      :deep(.q-btn) {
        height: 40px;
        color: #fff;
        font-size: 14px;
        border-radius: 3px;
        background: #18324A;
        &.active {
          background: #237BFF;
        }
      }
    }
  }
}

.withdraw-section {
  width: 100%;
  margin: 10px auto;
  border-radius: 10px;
  padding: 10px 12px 15px;
  box-shadow: 0px -2px 6px 2px #c3d4e6 inset;
  background:#fff;
}
.withdrawalmethod {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  overflow-x: unset;
  padding: 0px 5px;
  grid-gap: 10px;
  grid-column-gap: 10px;
  grid-row-gap: 5px;

  .withdraw-type-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    position: relative;
    cursor: pointer;

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
      max-width: 4.5rem;
    }

    img {
      width: 100%;
      padding: 5px 10px;
    }

    &.active {
      img {
        border: 3px solid #33bcd4;
        border-radius: 10px;
      }

      .promo-img {
        border: none;
        border-radius: 0px;
      }

      .type-name {
        font-weight: bold;
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



</style>
