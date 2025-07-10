<template>
  <CommonModal
    v-model="isUnbindModalOpen"
    class="unbind-modal"
    :header="getTitleText()"
    :actions="['confirm', 'cancel']"
    @confirm="unbindBankCard"
    @cancel="isUnbindModalOpen = false"
  >
    <template #content>
      <q-form class="unbind-form">
        <q-input
          class="unbind-input"
          standout
          clearable
          ref="unbindBankCardNoRef"
          v-model="unbindBankCardNo"
          :label="unbindCardLabel()"
          :rules="[
            (val) => (val && val.length > 0) || $t('bank.form.bankCard.error.required', { label: unbindCardLabel() })
          ]"
        />
      </q-form>
    </template>
  </CommonModal>

  <q-page class="bank-detail-container">
    <div class="bank-detail-wrapper">
      <div class="bank-bind-item q-my-sm">
        <div class="bank-bind-btn" @click="onBindCardClick('/account/withdraw/crypto')">{{ $t("bank.addCrypto") }}</div>
      </div>

      <!-- <div v-if="bankCardList[CRYPTO].length" class="bank-detail-item q-my-sm" @click="onShowCardClick(CRYPTO)">
        <div class="bank-detail-type">虚拟账户</div>
        <div :class="`bank-detail-arrow ${isCardVisible[CRYPTO] ? 'rotate' : ''}`">></div>
      </div> -->
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
              <!-- <div>卡号：</div> -->
              <div class="bank-number">{{ formatCardNumber(bankCard.cardNumber) }}</div>
              <!-- <img
                class="copy-btn"
                src="../../assets/images/account/account-copy-icon.png"
                @click="copy(bankCard.cardNumber)"
              /> -->
            </div>
            <!-- <div v-if="$q.dark.isActive" class="bank-type">虚拟账户</div> -->
          </div>
          <q-btn class="unbind-btn" flat @click="onUnbindClick(bankCard)">{{ $t("btn.unbind") }}</q-btn>
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
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "src/hooks/notify";
import CommonModal from "src/components/CommonModal.vue";
import { useI18n } from "vue-i18n";

// constants (the string synced w/ BE API bankType)
const BANK_CARD = "BANK";
const CRYPTO = "CRYPTO";
const EWALLET = "EWALLET";
const ALIPAY = "ALIPAY";

const { t } = useI18n();
const notify = useNotify();
const $q = useQuasar();
const router = useRouter();

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/payment/";

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
        message: `${val} 已复制`
      });
    })
    .catch(() => {
      notify({
        type: "error",
        message: "复制失败"
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
  const label = unbindCardLabel();
  return t("bank.notification.unbindBankCard.title", { label });
};

const unbindBankCard = () => {
  unbindBankCardNoRef.value.validate();
  if (unbindBankCardNoRef.value.hasError) return;

  api.post(`/session/bankCardByCardNo/${unbindBankCardNo.value}?_method=delete`).then((response) => {
    if (response.code === 0) {
      notify({
        type: "success",
        message: t("common.notification.success.message")
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
  if (isAlipay(bankCode)) return t("bank.bankType.alipay");
  else if (bankType === BANK_CARD) return t("bank.bankType.bankCard");
  else if (bankType === CRYPTO) return t("bank.bankType.crypto");
  else if (bankType === EWALLET) return t("bank.bankType.eWallet");
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
        alipayAvailable.value = res.data.some((item) => item.code.toLowerCase().includes("alipay"));
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
      background: #fcfdfe;
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
        background: linear-gradient(90deg, #61a4ff 6.43%, #57b2f3 46.96%, #61a4ff 94.86%);
        box-shadow: 0px 4px 4px 0px #58b0f433;
        border: 1px solid #ffffff;
        border-radius: 48px;
        width: 100%;
        padding: 10px 0;
        margin: auto;
        font-size: 1.2rem;
        font-weight: 600;
        color: #fff;

        .bank-bind-img {
          margin-left: auto;
          display: block;
          width: 100%;
        }
      }
    }

    .bank-detail-item {
      background: #fcfdfe;
      box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 auto 14px;
      padding: 1.25rem;
      gap: 15px;
      color: #424f72;
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
      background: #fcfdfe;
      border-radius: 7px;
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
          color: #424f72;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .bank-number-wrapper {
          display: flex;
          align-items: center;
          color: #424f72;
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
      .unbind-btn {
        background: url(../../assets/images/index/primary-btn.png) no-repeat center center;
        background-size: 100% 100%;
        padding: 3px 20px;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
}
</style>
<style lang="scss">
.unbind-modal {
  .unbind-form {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 1rem 0;

    .unbind-input {
      width: 100%;
      border-radius: 7px;
      .q-field__control {
        box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;
        background-color: #f7f8fb;
      }
      .q-placeholder,
      .q-field__append {
        color: #424f72;
        &::placeholder {
          color: #a4aabb;
          opacity: 1;
        }
      }
    }
  }
}
</style>
