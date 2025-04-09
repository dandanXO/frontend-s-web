<template>
  <q-dialog width="100%" v-model="isUnbindModalOpen" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
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
      <div class="bank-bind-item q-my-sm">
        <!-- <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/crypto')">
          <span>+添加虚拟币账户</span>
        </div> -->

        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/bank-card')">
          <span>+ {{ $t("btn.addBankCard") }}</span>
        </div>
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/ewallet')">
          <!-- <img class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" /> -->
          <span>+ {{ $t("btn.addVirtualWallet") }}</span>
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

      <div v-if="bankCardList[BANK_CARD].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(BANK_CARD)">
        <div class="bank-detail-type">{{ t("form.bankCard") }}</div>
        <div :class="`bank-detail-arrow ${isCardVisible[BANK_CARD] ? 'rotate' : ''}`">></div>
      </div>
      <template v-if="isCardVisible[BANK_CARD]">
        <div
          v-for="(bankCard, bankCardIndex) in bankCardList[BANK_CARD]"
          :key="`${bankCard}-${bankCardIndex}`"
          class="bank-card"
        >
          <div class="left-container">
            <div class="bank-name">
              <img style="width: 30px; max-height: 30px;" :src="imgURL + bankCard.bankIcon" />
              <div>{{ bankCard.bankName }}</div>
            </div>
            <div class="bank-number-wrapper">
              <div>Bank Account:&nbsp;</div>
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
      </template>

      <div v-if="bankCardList[CRYPTO].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(CRYPTO)">
        <div class="bank-detail-type">{{ t("form.cryptoAccount") }}</div>
        <div :class="`bank-detail-arrow ${isCardVisible[CRYPTO] ? 'rotate' : ''}`">></div>
      </div>
      <template v-if="isCardVisible[CRYPTO]">
        <div
          v-for="(bankCard, bankCardIndex) in bankCardList[CRYPTO]"
          :key="`${bankCard}-${bankCardIndex}`"
          class="bank-card"
        >
          <div class="left-container">
            <div class="bank-name">
              <img style="width: 30px; max-height: 30px;" :src="imgURL + bankCard.bankIcon" />
              <div>{{ bankCard.bankName }}</div>
            </div>
            <div class="bank-number-wrapper">
              <div>{{ t("form.cryptoAccount") }}:&nbsp;</div>
              <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
              <!-- <img
                class="copy-btn"
                src="../../assets/images/account/account-copy-icon.png"
                @click="copy(bankCard.cardNumber)"
              /> -->
            </div>
          </div>
          <div class="right-container" @click="onUnbindClick(bankCard)">解绑</div>
        </div>
      </template>

      <div v-if="bankCardList[EWALLET].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(EWALLET)">
        <div class="bank-detail-type">{{ $t("bank.virtualWallet") }}</div>
        <div :class="`bank-detail-arrow ${isCardVisible[EWALLET] ? 'rotate' : ''}`">></div>
      </div>
      <template v-if="isCardVisible[EWALLET]">
        <div
          v-for="(bankCard, bankCardIndex) in bankCardList[EWALLET]"
          :key="`${bankCard}-${bankCardIndex}`"
          class="bank-card"
        >
          <div class="left-container">
            <div class="bank-name">
              <img style="width: 30px;max-height: 30px;" :src="imgURL + bankCard.bankIcon" />
              <div>{{ bankCard.bankName }}</div>
            </div>
            <div class="bank-number-wrapper">
              <div>{{ $t("bank.virtualAccount") }}: &nbsp;</div>
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
      </template>

      <div v-if="bankCardList[ALIPAY].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(ALIPAY)">
        <div class="bank-detail-type">支付宝</div>
        <div :class="`bank-detail-arrow ${isCardVisible[ALIPAY] ? 'rotate' : ''}`">></div>
      </div>
      <template v-if="isCardVisible[ALIPAY]">
        <div
          v-for="(bankCard, bankCardIndex) in bankCardList[ALIPAY]"
          :key="`${bankCard}-${bankCardIndex}`"
          class="bank-card"
        >
          <div class="left-container">
            <div class="bank-name">
              <img style="width: 30px" :src="imgURL + bankCard.bankIcon" />
              <div>{{ bankCard.bankName }}</div>
            </div>
            <div class="bank-number-wrapper">
              <div>gg 卡号：</div>
              <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
              <!-- <img
                class="copy-btn"
                src="../../assets/images/account/account-copy-icon.png"
                @click="copy(bankCard.cardNumber)"
              /> -->
            </div>
          </div>
          <div class="right-container" @click="onUnbindClick(bankCard)">解绑</div>
        </div>
      </template>
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
    width: calc(100% - 2rem);
    margin: 0 auto;
    padding: 0rem 0 1rem;

    .bank-bind-item {
      background: #fcfdfe;
      box-shadow: 0px -2.76px 2.76px 0px #c3d4e6 inset, 0px 1.38px 0px 0px #a7c2dd;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      margin: 0 auto 14px;
      padding: 1rem;
      // gap: 8px;

      .bank-bind-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 47.5%;
        background: url(../../assets/images/index/btn-bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 12px 5px;
        border-radius: 8px;
        color: #fff;
        font-size: 1.15rem;
        white-space: nowrap;
        font-weight: 500;
        margin-right: 8px;
        margin-bottom: 8px;
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
      background: #fcfdfe;
      box-shadow: 0px -2.76px 2.76px 0px #c3d4e6 inset, 0px 1.38px 0px 0px #a7c2dd;
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
      background: #e0f0ff;
      box-shadow: inset 0px 0px 9px rgb(255, 255, 255, 0.3);
      // background-size: 100% 100%;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 auto 14px;
      padding: 1.25rem;
      gap: 15px;

      .left-container {
        .bank-name {
          display: flex;
          // gap: 10px;
          :not(:last-child) {
            margin-right: 10px;
          }
          color: #424f72;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .bank-number-wrapper {
          display: flex;
          align-items: center;
          color: #7a80a1;
          font-size: 1rem;
          font-weight: 400;

          .bank-number {
            max-width: 15rem;
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
