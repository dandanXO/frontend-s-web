<template>
  <div class="form-wrapper">
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
          <div class="form-item">
            <label>{{ chooseLabel() }}</label>
            <q-select
              dense
              v-show="isLoaded"
              hide-bottom-space
              outlined
              ref="cardRef"
              v-model="withdrawInfo.cardId"
              option-value="id"
              emit-value
              class="withdraw-selection q-mt-sm q-mb-sm"
              :options="withdrawState.bankCardList"
              map-options
              :rules="[(val) => !!val || '선택해주세요' + chooseLabel()]"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ "사용할 수 있는 것이 없습니다" + chooseCard() }}
                    <router-link class="text-bright" to="/?page=withdrawcard">
                      {{ isUSDT || isEWALLET ? "추가하다" + chooseCard() : "연동" + chooseCard() }}
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
          </div>

          <div class="form-item">
            <label>출금금액</label>
            <q-input
              dense
              outlined
              ref="amountRef"
              v-model="withdrawInfo.amount"
              class="withdraw-field"
              :rules="[
                  (val) => !!val || '출금 금액을 입력해주세요',
                  (val) => val >= selectedWithdrawalMethod.withdrawMin || '올바른 출금 금액을 입력해주세요',
                  (val) => val <= selectedWithdrawalMethod.withdrawMax || '올바른 출금 금액을 입력해주세요',
                  (val) => (val && /^\d+$/.test(val)) || '출금 금액에는 소수점을 사용할 수 없습니다',
                  isValidUSDTAmt
                ]"
              clearable
            >
              <template v-slot:prepend>
                  <span style="z-index:1;font-size:16px;">
                    <template v-if="isUSDT">USDT</template>
                    <template v-else>{{ store.currency.value }}</template>
                  </span>
              </template>
              <!-- <template v-slot:append>
                  <span style="z-index:1;">
                    <div @click="updateWithdrawAmt" class="update-withdraw-btn">삭제</div>
                  </span>
              </template> -->
            </q-input>

            <div class="select-amt-btn-wrapper">
              <q-btn class="select-amt-btn" v-for="(item, index) in countOptions" :key="index" size="md"  :label="isUSDT ? `${item} USDT` : item + '만원'"
                    @click="updateWithdrawItem(item)"
              />
            </div>
          </div>

          <div
            class="q-mt-sm q-mb-sm text-grey text-bold q-pb-sm"
            style="border-bottom: 1px solid #434343"
            v-show="selectedWithdrawalMethod"
          >
            <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
              {{
                "출금금액/건: " +
                selectedWithdrawalMethod.withdrawMin +
                "만 - " +
                selectedWithdrawalMethod.withdrawMax +
                "만"
              }}
              <br />
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxAmount || selectedWithdrawalMethod.withdrawMaxTimes">
              {{ `출금금액/일:${selectedWithdrawalMethod.withdrawMaxTimes}회 총 ${selectedWithdrawalMethod.withdrawMaxAmount}억` }}
            </template>
          </div>
          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div class="q-my-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">실시간 환율：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                  1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                  {{ store.currency.value }}
                </span>
            </div>
            <div class="q-mt-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">예상 입금：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                  {{ (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate).toFixed(2) }}
                  USDT
                </span>
            </div>
            <div class="q-mt-sm text-neontb">*특별 설명: 제3자가 자동으로 1.00 USDT의 인출 수수료를 받습니다！</div>
          </div>
          <!--          <div v-else-if="!isEWALLET && !isUSDT">-->
          <!--            <div class="q-mt-md text-neontb">*24小时内请勿提交相同提款金额，避免确认到账错误，需个人承担亏损！</div>-->
          <!--          </div>-->
          <div v-else-if="isEWALLET">
            <div class="q-mt-sm text-neontb">*특별히 언급합니다: 출금 지갑과 게임 계정의 이름은 반드시 일치해야 합니다</div>
            <div class="q-mt-sm q-mb-sm text-center" v-if="selectedWithdrawalMethod.code !== 'SZPAY'">
              <q-btn
                style="border: 1px solid #33bcd4; color: #33bcd4"
                @click="openEWalletTutorial(selectedWithdrawalMethod.code)"
                :label="tutorialLabel()"
              />
            </div>
          </div>

          <div class="q-py-md">
            <div
              v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
            <div v-if="isALIPAY" class="selected-tip">
              "알리페이 인출" 사용 가능 시간: 오전 10시 ~ 오후 12시, 다른 시간에 제출하면 시스템이 자동으로 취소됩니다！
            </div>
          </div>
        </q-form>

      </q-card-section>
    </div>
    <div class="action-buttons">
      <div
        @click="submitWithdraw" 
        class="primary-button blue"
        :class="withdrawLoading ? 'disabled' : ''"
      >
      {{ btnLoading ? $t('lang.loading') : '환전신청' }}
      </div>
    </div>
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
const countOptions = ref([1, 5, 10, 50, 100, 500, 1000]);
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
  return new Promise((resolve) => {
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

        resolve(response.data);
      }
    }).catch((error) => {
      console.log("error", error);
    });
  })
};

const updateWithdrawItem = (amt) => {
  // debugger;
  const multiple = isUSDT.value ? 1 : 10000;
  // 1원 = 10000;

  withdrawInfo.amount = Number(withdrawInfo.amount) + (amt * multiple);
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
  if(withdrawLoading.value) {
    return;
  }

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
    return 'KDPAY 튜토리얼 비디오'
  } else if (selectedWithdrawalMethod.value.code === 'EBPAY') {
    return 'EBPAY 튜토리얼 비디오'
  } else if (selectedWithdrawalMethod.value.code === 'OKPAY') {
    return 'OKPAY 튜토리얼 비디오'
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
  return usdtPattern.test(withdrawInfo.amount) || "금액은 양수 여야합니다";
}

const getWithdrawalMethods = () => {
  return new Promise((resolve) => {
    api.get("/session/withdraw/entrance").then((resp) => {
      const response= resp.data;
      if (response.code === 0) {
        withdrawalMethods.value = response.data;
        //Remove this for real data
        // withdrawalMethods.value = [
        //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
        //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]

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

const chooseLabel = () => {
  if (isUSDT.value) {
    return '선택 가상 화폐'
  } else if (isEWALLET.value) {
    return '선택 전자 지갑'
  } else {
    return '환전 은행카드 선택'
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
  Promise.all([loadCards(), getWithdrawalMethods()]).then(([cards,withdrawMethods]) => {
    const availableBankType = cards?.[0]?.bankType;
    
    if (availableBankType) {
      const methodIndex = withdrawMethods.findIndex(({ code }) => {
      
        if(availableBankType === 'CRYPTO' && code.includes('USDT')) {
          return true;
        }

        return code === availableBankType;
      });
    
      selectMethod(withdrawMethods[methodIndex], methodIndex);
    }
  })
  
  store.getBalance();
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
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-bottom: 5px;
    margin: auto 10px;

    &.blue {
      background: url("../../assets/home/btn-blue.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    &.yellow {
      background: url("../../assets/home/btn-orange.svg") no-repeat center center;
      background-size: 100% 100%;
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
  }

  // .option-btns {
  //   display: flex;
  //   flex-wrap: wrap;
  //   gap: 8px;

  //   :deep(.q-btn) {
  //     height: 40px;
  //     color: #fff;
  //     font-size: 14px;
  //     border-radius: 3px;
  //     background: #18324A;
  //   }
  // }

  .select-amt-btn-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .select-amt-btn {
    background: #18324A;
    color: #fff;
    white-space: nowrap;
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
  display: flex;
  grid-gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
  padding-bottom: 10px;

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
    border: 2px solid #4b4b4b;
    color: #ffffff;

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
    }

    img {
      width: 100%;
      padding: 5px 10px;
    }

    &.active {
      background: $linear-bg-2;
      border: 3px solid $primary;
      border-radius: 6px;

      // img {
      //   border: 3px solid #33bcd4;
      //   border-radius: 10px;
      // }

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

  @media (max-width: 500px) {
    flex-direction: column;

    .withdraw-type-item {
      width: 100%;
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

.withdraw-field{
  :deep(.q-field__control){
    background:#252E43;
  }
  :deep(.q-field__prepend){
    padding-left: 10px;
  }
}
.withdraw-selection{
  :deep(.q-field__control){
    background:#252E43;
  }
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

.bg-brightbtn{
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

.flex-box-c-c{
  display:flex;
  align-items: center;
  justify-content: center;
}

</style>
