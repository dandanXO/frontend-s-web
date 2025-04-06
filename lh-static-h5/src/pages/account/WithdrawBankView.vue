<template>
  <q-dialog
    width="100%"
    class="modal-common-div"
    v-model="isUnbindModalOpen"
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="titles">{{ getTitleText() }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <q-form class="unbind-form">
        <!-- <q-input
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
        /> -->
        <q-input
          class="unbind-input"
          filled
          clearable
          ref="unbindBankCardNoRef"
          v-model="unbindBankCardNo"
          :label="unbindCardLabel()"
          :rules="[(val) => (val && val.length > 0) || '请输入' + unbindCardLabel() ]"
        />
      </q-form>
      <div class="btnsreas">
        <div class="confirmsbtns common-md-btn" @click="unbindBankCard()">确定</div>
        <q-btn class="cacnels common-md-white-btn" v-close-popup>取消</q-btn>
      </div>
    </q-card>
  </q-dialog>

  <q-page class="bank-detail-container">
    <div class="bank-detail-wrapper">
      <div class="bank-bind-item q-my-sm">
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/bank-card')">
          <img v-if="$q.dark.isActive" class="bank-bind-img" src="../../assets/images/download/active-tab-bg-dark.png" />
          <img v-else class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" />
          <span>+添加银行卡</span>
        </div>
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/crypto')">
          <img v-if="$q.dark.isActive" class="bank-bind-img" src="../../assets/images/download/active-tab-bg-dark.png" />
          <img v-else class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" />
          <span>+添加虚拟币账户</span>
        </div>
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/ewallet')">
          <img v-if="$q.dark.isActive" class="bank-bind-img" src="../../assets/images/download/active-tab-bg-dark.png" />
          <img v-else class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" />
          <span>+添加电子钱包</span>
        </div>
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/alipay')" v-if="alipayAvailable">
          <img v-if="$q.dark.isActive" class="bank-bind-img" src="../../assets/images/download/active-tab-bg-dark.png" />
          <img v-else class="bank-bind-img" src="../../assets/images/download/active-tab-bg.png" />
          <span>+添加支付宝</span>
        </div>
      </div>

      <div v-if="bankCardList[BANK_CARD].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(BANK_CARD)">
        <div class="bank-detail-type">银行卡</div>
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
              <img style="width: 30px" :src="imgURL + bankCard.bankIcon" />
              <div>{{ bankCard.bankName }}</div>
            </div>
            <div class="bank-number-wrapper">
              <div>卡号：</div>
              <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
              <!-- <img
                class="copy-btn"
                src="../../assets/images/account/account-copy-icon.png"
                @click="copy(bankCard.cardNumber)"
              /> -->
            </div>
            <div v-if="$q.dark.isActive" class="bank-type">银行卡</div>
          </div>
          <div class="right-container" @click="onUnbindClick(bankCard)">
            <img v-if="$q.dark.isActive" src="../../assets/images/account/unlink-icon.svg"/>
            <span v-else>解绑</span>
          </div>
        </div>
      </template>

      <div v-if="bankCardList[CRYPTO].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(CRYPTO)">
        <div class="bank-detail-type">虚拟账户</div>
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
              <img style="width: 30px" :src="imgURL + bankCard.bankIcon" />
              <div>{{ bankCard.bankName }}</div>
            </div>
            <div class="bank-number-wrapper">
              <div>卡号：</div>
              <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
              <!-- <img
                class="copy-btn"
                src="../../assets/images/account/account-copy-icon.png"
                @click="copy(bankCard.cardNumber)"
              /> -->
            </div>
            <div v-if="$q.dark.isActive" class="bank-type">虚拟账户</div>
          </div>
          <div class="right-container" @click="onUnbindClick(bankCard)">
            <img v-if="$q.dark.isActive" src="../../assets/images/account/unlink-icon.svg"/>
            <span v-else>解绑</span>
          </div>
        </div>
      </template>

      <div v-if="bankCardList[EWALLET].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(EWALLET)">
        <div class="bank-detail-type">电子钱包</div>
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
              <img style="width: 30px" :src="imgURL + bankCard.bankIcon" />
              <div>{{ bankCard.bankName }}</div>
            </div>
            <div class="bank-number-wrapper">
              <div>卡号：</div>
              <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
              <!-- <img
                class="copy-btn"
                src="../../assets/images/account/account-copy-icon.png"
                @click="copy(bankCard.cardNumber)"
              /> -->
            </div>
            <div v-if="$q.dark.isActive" class="bank-type">电子钱包</div>
          </div>
          <div class="right-container" @click="onUnbindClick(bankCard)">
            <img v-if="$q.dark.isActive" src="../../assets/images/account/unlink-icon.svg"/>
            <span v-else>解绑</span>
          </div>
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
              <div>卡号：</div>
              <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
              <!-- <img
                class="copy-btn"
                src="../../assets/images/account/account-copy-icon.png"
                @click="copy(bankCard.cardNumber)"
              /> -->
            </div>
            <div v-if="$q.dark.isActive" class="bank-type">支付宝</div>
          </div>
          <div class="right-container" @click="onUnbindClick(bankCard)">
            <img v-if="$q.dark.isActive" src="../../assets/images/account/unlink-icon.svg"/>
            <span v-else>解绑</span>
          </div>
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
import {useLocalStorage} from "@vueuse/core"
import { useNotify } from "src/hooks/notify";

// constants (the string synced w/ BE API bankType)
const BANK_CARD = "BANK";
const CRYPTO = "CRYPTO";
const EWALLET = "EWALLET";
const ALIPAY = "ALIPAY";

const notify = useNotify();
const $q = useQuasar();
const router = useRouter();

const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/payment/";

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
      notify({
        color: "position",
        message: `${val} 已复制`,
      });
    })
    .catch(() => {
      notify({
        type: "error",
        message: "复制失败",
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
  const { bankType, bankCode } = selectedUnbindBankCard.value || {};

  if (isAlipay(bankCode)) return "请输入解绑支付宝号";
  else if (bankType === BANK_CARD) return "请输入解绑银行卡号";
  else if (bankType === CRYPTO) return "请输入解绑虚拟币账户";
  else if (bankType === EWALLET) return "请输入解绑电子钱包";
};

const unbindBankCard = () => {
  unbindBankCardNoRef.value.validate();
  if (unbindBankCardNoRef.value.hasError) return;

  api.post(`/session/bankCardByCardNo/${unbindBankCardNo.value}?_method=delete`).then((response) => {
    if (response.code === 0) {
      notify({
        type: "success",
        message: "操作成功",
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
  const { bankType, bankCode } = selectedUnbindBankCard.value || {};
  if (isAlipay(bankCode)) return "支付宝号";
  else if (bankType === BANK_CARD) return "银行卡号";
  else if (bankType === CRYPTO) return "钱包地址";
  else if (bankType === EWALLET) return "电子钱包";
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

const alipayAvailable = ref(false);
const setNewBankTypes = () => {
  api
    .get("/session/withdraw/card")
    .then((res) => {
      if (res.code === 0) {
        alipayAvailable.value = res.data.some(item =>
          item.code.toLowerCase().includes("alipay")
        );
      }
    })
    .catch((error) => {
      console.error("Error loading banks:", error);
    });
};

onActivated(() => {
  loadCards();
  setNewBankTypes();
});
</script>

<style scoped lang="scss">
.bank-detail-container {
  .bank-detail-wrapper {
    width: calc(100% - 2rem);
    margin: 0 auto;
    padding: 1rem 0;

    .bank-bind-item {
      background: $white;
      box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 auto 14px;
      padding: 1.25rem;
      gap: 15px;

      .bank-bind-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 47.5%;
        margin: auto;

        .bank-bind-img {
          margin-left: auto;
          display: block;
          width: 100%;
        }

        span {
          position: absolute;
          font-size: 1.2rem;
          font-weight: 500;
          color: white;
        }
      }
    }

    .bank-detail-item {
      background: $white;
      box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 auto 14px;
      padding: 1.25rem;
      gap: 15px;
      color: $font-1;
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
      background: url(../../assets/images/account/bank-card-bg.png);
      background-size: 100% 100%;
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
          gap: 10px;
          color: $font-2;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .bank-number-wrapper {
          display: flex;
          align-items: center;
          color: $font-1;
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
        color: #3d89ff;
        font-size: 1rem;
        font-weight: 400;
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
      .bank-detail-item {
        background: #273354;
        border-radius: 6px;
        color: #fff;
        margin: 0 auto 14px;
        padding: 0.5rem 1rem;
        box-shadow: none;
      }
      .bank-card {
        background: url(../../assets/images/account/bank-card-bg-dark.png);
        background-size: 100% 100%;
        border-radius: 0;
        aspect-ratio: 328/100;
        align-items: flex-start;

        .bank-type {
          font-size: 10px;
          color: #FFFFFFCC;
        }

        .left-container {
          .bank-name, .bank-number-wrapper {
            color: #fff;
          }
        }
      }
      .bank-bind-item {
        @include content-block-dark;

        .bank-bind-btn {
          .bank-bind-img {
            border-radius: 6px;
          }
        }
      }
    }
  }
}
</style>
