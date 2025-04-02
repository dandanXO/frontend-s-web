<template>
  <q-dialog  width="100%" v-model="isUnbindModalOpen" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ getTitleText() }}</div>
        <div class="pc-form">
          <InputField :label="unbindCardLabel()">
            <template #input>
              <q-input
                outlined
                clearable
                ref="unbindBankCardNoRef"
                v-model="unbindBankCardNo"
                type="text"
                :rules="[
                  (val) => (val && val == selectedUnbindBankCard.cardNumber) || unbindCardLabel() + $t('form.notMatch')
                ]"
              ></q-input>
            </template>
          </InputField>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="unbindBankCard()">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <!-- <q-dialog width="100%" v-model="isUnbindModalOpen" :showCancelButton="false" :showConfirmButton="false">
    <div class="popout-dialog">
      <q-card style="width: 100%">
        <div class="headers">
          <div class="titles">{{ getTitleText() }}</div>
          <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
        </div>
        <q-form class="unbind-form">
          <q-input
            class="unbind-input"
            filled
            clearable
            ref="unbindBankCardNoRef"
            v-model="unbindBankCardNo"
            :label="unbindCardLabel()"
            :rules="[
              (val) =>
                (val && val.length > 10 && val == selectedUnbindBankCard.cardNumber) || unbindCardLabel() + '不正确'
            ]"
          />
        </q-form>
        <div class="btnsreas">
          <div class="confirmsbtns common-md-btn" @click="unbindBankCard()">确定</div>
          <q-btn class="cacnels common-md-white-btn" v-close-popup>取消</q-btn>
        </div>
      </q-card>
    </div>
  </q-dialog> -->

  <q-page class="bank-detail-container">
    <div class="bank-detail-wrapper">
      <div class="bank-bind-cards">
        <div
        v-for="(bankCard, bankCardIndex) in Object.values(bankCardList).flat()"
        :key="`${bankCard}-${bankCardIndex}`"
        class="bank-card"
        :class="[bankCard.bankType.toLowerCase(), 
                { 'active': selectedCard === bankCardIndex }]"  
        @click="selectCard(bankCardIndex)"
      >
        <div class="left-container">
          <div class="bank-name">
            <img style="width: 30px" :src="imgURL + bankCard.bankIcon" />
            <div>{{ bankCard.bankName }}</div>
          </div>
          <div class="bank-icon">
            <img src="../../assets/images/account/bank-icon.png">   
          </div>
          <div class="bank-number-wrapper">
            <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
            <!-- <img
              class="copy-btn"
              src="../../assets/images/account/account-copy-icon.png"
              @click="copy(bankCard.cardNumber)"
            /> -->
          </div>
        </div>
        <div class="right-container" @click="onUnbindClick(bankCard)">{{ $t("btn.untie") }}</div>
      </div>
      </div>
      <div class="bank-bind-item q-my-sm">
        <!-- <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/crypto')">
          <span>+添加虚拟币账户</span>
        </div> -->

        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/ewallet')">
          <!-- <img class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" /> -->
          <span>+ {{ $t("btn.addVirtualWallet") }}</span>
        </div>
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/bank-card')">
          <span>+ {{ $t("btn.addBankCard") }}</span>
        </div>
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/crypto')">
          <!-- <img class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" /> -->
          <span>+ {{ $t("btn.addCrypto") }}</span>
        </div>

        <!-- <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/alipay')">
          <img class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" />
          <span>+添加支付宝</span>
        </div> -->
      </div>

      <!-- <pre>bankCardList[BANK_CARD]--{{ bankCardList[BANK_CARD] }}</pre> -->
      <!-- <pre>bankCardList[EWALLET]--{{ bankCardList[EWALLET] }}</pre> -->

      
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onActivated } from "vue";
import { api } from "boot/axios";
import { useQuasar, copyToClipboard } from "quasar";
import { useRouter } from "vue-router";
import * as _ from "lodash";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import { t } from "src/boot/lang";
const selectedCard = ref(null);  // To keep track of the selected card

// Function to select the card and toggle the active class
const selectCard = (bankCardIndex) => {
  selectedCard.value = bankCardIndex;
};
// constants (the string synced w/ BE API bankType)
const BANK_CARD = "BANK";
const CRYPTO = "CRYPTO";
const EWALLET = "EWALLET";
const ALIPAY = "ALIPAY";

const $q = useQuasar();
const router = useRouter();

const imgURL = process.env.IMAGE_CDN + "/payment/";

const onBindCardClick = (path) => {
  router.push(path);
};

const isCardVisible = reactive({ BANK: true, CRYPTO: true, EWALLET: true, ALIPAY: true });
const onShowCardClick = (key) => {
  isCardVisible[key] = !isCardVisible[key];
};

const copy = (val) => {
  copyToClipboard(val)
    .then(() => {
      $q.notify({
        color: "position",
        position: "top",
        message: `${val} 已复制`,
        icon: "check_circle_outline"
      });
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "复制失败",
        icon: "report_problem"
      });
    });
};

const unbindBankCardNoRef = ref();
const unbindBankCardNo = ref();

const isUnbindModalOpen = ref(false);
const selectedUnbindBankCard = ref();
const onUnbindClick = (card) => {
  unbindBankCardNo.value = "";
  isUnbindModalOpen.value = true;

  selectedUnbindBankCard.value = card;
};

const getTitleText = () => {
  const { bankType, bankCode } = selectedUnbindBankCard.value;

  if (isAlipay(bankCode)) return "请输入解绑支付宝号";
  else if (bankType === BANK_CARD) return t("form.bankCard_untie");
  else if (bankType === CRYPTO) return "请输入解绑虚拟币账户";
  else if (bankType === EWALLET) return t("form.virtualWallet_untie");
};

const unbindBankCard = () => {
  unbindBankCardNoRef.value.validate();
  if (unbindBankCardNoRef.value.hasError) return;

  api.post(`/session/bankCard/${selectedUnbindBankCard.value.id}?_method=delete`).then((response) => {
    if (response.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Untie successfully",
        icon: "check_circle_outline"
      });

      isUnbindModalOpen.value = false;
      loadCards();
    }
  });
};

const isAlipay = (bankID) => {
  return bankID === 78 ? true : false;
};

const unbindCardLabel = () => {
  const { bankType, bankCode } = selectedUnbindBankCard.value;
  if (isAlipay(bankCode)) return "支付宝号";
  else if (bankType === BANK_CARD) return t("form.bankCard");
  else if (bankType === CRYPTO) return "钱包地址";
  else if (bankType === EWALLET) return t("form.virtualWallet");
};

let bankCardList = reactive({ BANK: [], CRYPTO: [], EWALLET: [], ALIPAY: [] });
const loadCards = () => {
  api
    .get("/session/allBankCard")
    .then((res) => {
      if (res.code === 0) {
        // Empty each array in bankCardList
        Object.keys(bankCardList).forEach((key) => {
          bankCardList[key] = [];
        });

        for (let i = 0, l = res.data.length; i < l; i++) {
          const data = res.data[i];
          const { bankType, bankCode } = data;

          if (isAlipay(bankCode)) {
            const alipayBankType = "ALIPAY";
            bankCardList[alipayBankType].push(data);
          } else {
            bankCardList[bankType].push(data);
          }
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const formatCardNumber = (cardNumber) => {
  const firstFourDigits = cardNumber.slice(0, 4);
  const lastFourDigits = cardNumber.slice(-4);
  const middleDigits = cardNumber.slice(4, -4);
  const maskedPortion = " **** **** "; // Mask all digits in the middle

  return firstFourDigits + maskedPortion + lastFourDigits;
};

onActivated(() => {
  loadCards();
});
</script>

<style scoped lang="scss">
.bank-detail-container {
  .bank-detail-wrapper {
    // width: calc(100% - 2rem);
    // margin: 0 auto;
    // padding: 0rem 0 1rem;
    padding: 10px;

    .bank-bind-item {

      // background: $white;
      // box-shadow: 0px -1px 3px 0px rgba(195, 212, 230, 0.5) inset;
      // border-radius: 10px;
      // display: flex;
      // align-items: center;
      // justify-content: space-around;
      // flex-wrap: wrap;
      // margin: 0 auto 14px;
      // padding: 1rem;
      // gap: 8px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 15px;

      .bank-bind-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        // background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        
      background: #394142;
      box-shadow: 0px 2px 0px 0px #2A3637;

        padding: 12px 5px;
        border-radius: 8px;
        color: #ffffff;
        font-size: 1.15rem;
        white-space: nowrap;
        font-weight: 500;
        // flex: 1;
        //   font-weight: 500;

        .bank-bind-img {
          margin-left: auto;
          display: block;
          width: 100%;
        }

        // span {
        //   position: absolute;
        //   font-size: 1.2rem;
        //   font-weight: 500;
        //   color: #000a01;
        // }
      }
    }

    .bank-detail-item {
      // background: $white;
      box-shadow: 0px -4px 6px 0px rgba(195, 212, 230, 0.2) inset;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 auto 14px;
      padding: 1.25rem;
      gap: 15px;
      // color: $font-1;
      font-size: 1rem;
      font-weight: 400;

      .bank-detail-arrow {
        transition: 0.3s;
        &.rotate {
          transform: rotate(90deg);
        }
      }
    }

    .bank-card {
      // background: url(../../assets/images/account/bank-card-bg.png);
      box-shadow: inset 0px 0px 9px rgb(255, 255, 255, 0.3);
      // background-size: 100% 100%;
      border-radius: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 auto 20px;
      padding: 1rem;
      gap: 15px;
      margin-top: -150px;
      min-height: 172px;
      overflow: hidden;
      position: relative;
      transition: all .3s ease-in-out;
      &.bank {
        background: url(../../assets/images/account/bank-card-blue.png)no-repeat center center;
        background-size: cover;
      }
      &.crypto {
        background: url(../../assets/images/account/bank-card-red.png)no-repeat center center;
        background-size: cover;
      }
      &.ewallet {
        background: url(../../assets/images/account/bank-card-green.png)no-repeat center center;
        background-size: cover;
      }
      &:nth-of-type(1) {
        margin-top: 20px;
      }
      &.active { 
        margin-bottom: 160px;
        &:nth-child(1) {      
          margin-top: 20px;
        }
        &:last-child {
          margin-bottom: 20px;
        }
      }
      .left-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        .bank-name {
          display: flex;
          align-items: center;
          gap: 10px;
          // color: $font-2;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .bank-icon {
          max-width: 60px;
          img{ 
            width: 100%;
          }
        }

        .bank-number-wrapper {
          display: flex;
          align-items: center;
          // color: $font-1;
          font-size: 1rem;
          font-weight: 400;
          font-family: "Courier Prime";
          font-weight: 700;
          font-size: 16.64px;
          line-height: 100%;
          letter-spacing: 0%;

          .bank-number {
            // max-width: 15rem;
            word-break: break-all;
          }

          .copy-btn {
            width: 1.5rem;
            margin: 0 0 0 1rem;
          }
        }
      }

      .right-container {
        color: #3dff47;
        font-size: 1rem;
        font-weight: 400;
        display: none;
      }
    }
  }
}

.unbind-form {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;

  .unbind-input {
    width: calc(100% - 16px);
    margin: auto;
  }
}

.body--dark {
  .bank-detail-container {
    .bank-detail-wrapper {
      .bank-bind-item {
        // @include content-block-dark;
      }
    }
  }
}

.pc-form {
  margin-top: 20px;
  width: 100%;
  .pc-form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;

    &.item-click {
      &:after {
        content: "";
        background: rgba(255, 255, 255, 0.05);
        height: calc(100% - 45px);
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 8px;
      }
    }
  }
  .pc-form-label {
    color: rgba(255, 255, 255, 1);
  }
  .pc-form-input {
    border-radius: 5px;
    position: relative;

    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.15) !important;
      border-radius: 4px;
    }

    :deep(.q-field__native) {
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.bottom-btn {
  display: flex;
  width: 100%;
  margin-top: 20px;
}
</style>
