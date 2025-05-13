<template>
  <q-dialog v-model="showCaptchaDialog" persistent>
    <div class="popout-dialog" style="width: 90%; border-radius: 20px;">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("bankCard.otp") }}</div>
        <InputField>
          <template #input>
            <q-input
              ref="innerCaptchaRef"
              standout
              v-model="innerCaptchaCode"
              class="q-pb-xs q-mt-md"
              hide-bottom-space
              maxlength="4"
              :rules="[
                (val) => (val && val.length > 0) || $t('bankCard.pleaseEnterVerificationCode'),
                (val) => (val && val.length === 4) || $t('bankCard.verificationCodeLengthError')
              ]"
              :placeholder="$t('bankCard.insertVerificationCode')"
              clearable
            >
              <template v-slot:append>
                <img
                  :src="phoneVerificationImg"
                  title="Click to Refresh OTP"
                  style="margin-top: 6px; cursor: pointer"
                  @click="getCode"
                />
              </template>
            </q-input>
          </template>
        </InputField>

        <div style="width: 100%" class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn class="btn-primary__full" :label="$t('btn.sendOtp')" no-caps @click="onCaptchaSubmit" />
        </div>
      </div>
    </div>
  </q-dialog>
  <q-dialog v-model="showCaptchaMessageDialog" persistent>
    <div class="popout-dialog" style="width: 90%; border-radius: 20px;">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="flex justify-center">
          <template v-if="showCaptchaSuccessDialog">
            <img src="../../assets/images/cs-verifier/correct-icon.png" alt="" />
          </template>
          <template v-else><img src="../../assets/images/cs-verifier/wrong-icon.png" alt="" /></template>
        </div>
        <div class="text-center q-py-md">
          <span class="txt-green" v-if="showCaptchaSuccessDialog">
            {{ $t("bankCard.captchaSuccess") }}
          </span>
          <span class="txt-red" v-else>
            {{ $t("bankCard.captchaFailedMessage") }}
          </span>
        </div>

        <div class="bottom-btn flex full-width">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" v-close-popup>OK</q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
  <q-page class="bind-container">
    <div class="bind-wrapper">
      <q-form ref="bankFormRef" class="bind-item">
        <q-label>
          {{ $t("form.cryptoType") }}
          <em>*</em>
        </q-label>
        <div class="type-toggle">
          <q-btn
            v-for="(bank, bankIndex) in bankList"
            :key="`${bank}-${bankIndex}`"
            :class="`${selectedTypeToggleIndex === bankIndex ? 'common-sm-btn' : 'common-sm-white-btn'} content`"
            @click="onTypeToggleBtnClick(bankIndex, bank.name)"
          >
            <img :src="imgURL + bank.bankIcon" alt="" />
            <div>{{ bank.name }}</div>
          </q-btn>
        </div>

        <InputRowGrid>
          <template #fields>
            <InputField :label="$t('form.cryptoAccount')">
              <template #input>
                <q-input
                  type="text"
                  outlined
                  clearable
                  ref="cardNumberRef"
                  :placeholder="$t('form.cryptoAccount_placeholder')"
                  v-model="bankCardInfo.cardNumber"
                  hide-bottom-space
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.cryptoAccount_rules_01'),
                    (val) => (val && !val.includes('.')) || $t('form.virtualWallet_rules_04'),
                    validateCryptoNumber,
                    validateCryptoLength
                  ]"
                ></q-input>
              </template>
            </InputField>
          </template>
        </InputRowGrid>

        <q-label style="display: none">
          Protocol
          <em>*</em>
        </q-label>
        <div class="category-toggle" style="display: none">
          <!-- <q-btn
            v-for="(category, categoryIndex) in categoryToggleList"
            :key="`${category}-${categoryIndex}`"
            :class="`${
              selectedCategoryToggleIndex === categoryIndex ? 'common-sm-btn' : 'common-sm-white-btn'
            } content`"
            @click="onCategoryToggleBtnClick(categoryIndex)"
          >
            <div>{{ category }}</div>
          </q-btn> -->
          <q-btn class="common-sm-btn">{{ selectedTypeToggleName }}</q-btn>
        </div>
      </q-form>

      <!--      <div class="note">-->
      <!--        {{ $t("form.virtualWallet_warmReminder") }}-->
      <!--      </div>-->

      <InputRowGrid>
        <template #fields>
          <!-- <InputField :label="$t('form.virtualWallet')"> -->
          <InputField :label="$t('bankCard.telephone')">
            <template #input>
              <q-input
                ref="telephoneNumberRef"
                standout
                :rules="[(val) => !!val || $t('bankCard.pleaseEnterTelephone'),  (val) => /^03\d{9}$/.test(val) || $t('bankCard.pleaseEnterTelephone')]"
                v-model="bankCardInfo.telephone"
                class="q-pb-xs"
                hide-bottom-space
                :placeholder="$t('bankCard.pleaseEnterTelephone')"
                clearable
                :disable="isOtpSent"
              >
                <template v-slot:append>
                  <q-btn
                    @click="openPhoneVeriDialog()"
                    type="submit"
                    size="sm"
                    :label="!isOtpSent ? $t('bankCard.getOtp') : showTimer()"
                    class="btn-primary__full"
                    style="height: unset"
                  />
                </template>
              </q-input>
            </template>
          </InputField>
        </template>
      </InputRowGrid>

      <template v-if="isPhoneVerified">
        <InputRowGrid>
          <template #fields>
            <!-- <InputField :label="$t('form.virtualWallet')"> -->
            <InputField :label="$t('bankCard.otp')">
              <template #input>
                <q-input
                  ref="phoneVerificationRef"
                  standout
                  v-model="bankCardInfo.smsCode"
                  class="q-pb-xs"
                  hide-bottom-space
                  clearable
                  maxlength="6"
                  :placeholder="$t('bankCard.pleaseEnterOtp')"
                  :rules="[(val) => (val && val.length > 5) || $t('bankCard.otpLengthError')]"
                  @keydown.enter.prevent="handleEnterKey"
                  @keydown.enter="submitBankCard()"
                ></q-input>
              </template>
            </InputField>
          </template>
        </InputRowGrid>
      </template>
      <!-- <q-label>
          手机号
          <em>*</em>
        </q-label>
        <q-input
          standout
          v-model="bankCardInfo.telephone"
          class="q-pb-xs"
          hide-bottom-space
          clearable
        >
          <template v-slot:append>
            <q-btn
              @click="openPhoneVeriDialog()"
              type="submit"
              class="common-sm-btn bottom-btn get-otp-btn"
              label="获取验证码"
              color="brightbtn"
              rounded
            />
          </template>
        </q-input>  -->
      <!-- <q-label>
            验证码
            <em>*</em>
          </q-label>
          <q-input
            ref=""phoneVerificationRef
            standout
            v-model="bankCardInfo.smsCode"
            class="q-pb-xs"
            hide-bottom-space
            clearable
            maxlength="6"
            :rules="[(val) => (val && val.length > 3) || '请输入您的注册手机验证']"
            @keydown.enter.prevent="handleEnterKey"
            @keydown.enter="submitBankCard()"
          ></q-input> -->
      <div class="bottom-btn">
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitBankCard()">
          {{ $t("btn.confirm") }}
        </q-btn>
        <!-- <q-btn rounded flat no-caps class="btn-purple-pattern" v-close-popup @click="onCaptchaSubmit">Confirm</q-btn> -->
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, onActivated } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { useLocalStorage } from "@vueuse/core";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import { useI18n } from "vue-i18n";

// NOTE: temp mock
const selectedTypeToggleIndex = ref(0);
const selectedTypeToggleName = ref("USDTERC");
const onTypeToggleBtnClick = (index, name) => {
  // debugger;
  selectedTypeToggleIndex.value = index;
  selectedTypeToggleName.value = name;
  bankCardInfo.bankId = bankList.value[index].id;
  bankCardInfo.currencyId = bankList.value[index].currencyIds;
};

const categoryToggleList = ref(["EBPAY", "ERC20", "EBPAY", "ERC20", "EBPAY", "ERC20", "EBPAY", "ERC20"]);
const selectedCategoryToggleIndex = ref(0);
const onCategoryToggleBtnClick = (index) => {
  selectedCategoryToggleIndex.value = index;
};

const { t } = useI18n();
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/payment/";
const bankFormRef = ref();
const bankCardRef = ref();
const cardNumberRef = ref();
const ifscRef = ref();
const telephoneNumberRef = ref();
const phoneVerificationRef = ref();
const isPhoneVerified = ref(false);

const bankCardInfo = reactive({
  bankId: undefined,
  cardNumber: "",
  cardAccount: store.realName,
  cardAddress: "",
  currencyId: ""
  // smsCode: "",
  // smsCodeId: ""
});

const validateCryptoLength = (val) => {
  if (selectedTypeToggleName.value === "USDTERC") {
    return val.length === 42 || t("form.cryptoAccount_rules_05");
  } else if (selectedTypeToggleName.value === "USDTTRC") {
    return val.length === 34 || t("form.cryptoAccount_rules_03");
  } else {
    return true;
  }
};

const validateCryptoNumber = (val) => {
  if (selectedTypeToggleName.value === "USDTERC") {
    return val.startsWith("0x") || t("form.cryptoAccount_rules_04");
  } else if (selectedTypeToggleName.value === "USDTTRC") {
    return val.startsWith("T") || t("form.cryptoAccount_rules_02");
  } else {
    return true;
  }
};

const validateBankLength = (val) => {
  const bankCode = bankList.value[selectedTypeToggleIndex.value].code;

  switch (bankCode) {
    case "KDPAY":
      return (val.length > 33 && val.length < 35) || "长度应为34个字符";
    case "EBPAY":
      return (val.length > 33 && val.length < 35) || "长度应为34个字符";
    case "OKPAY":
      return (val.length > 15 && val.length < 17) || "长度应为16个字符";
    default:
      break;
  }
};

const validateEWalletNumber = (val) => {
  var regex = /^[a-zA-Z0-9]+$/;

  return regex.test(val) || "请输入有效的电子钱包号码";
};

// NOTE: no chance to validate, e.g. member telephone = 44****77
const isValidPhone = () => {
  const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return phonePattern.test(store.nickName) || "请输入有效的电话号码";
};

const phoneVerificationImg = ref("");
const innerCodeId = ref("");
const innerCaptchaCode = ref("");
const innerCaptchaRef = ref();
const getInnerCode = () => {
  isOtpSent.value = false;
  innerCaptchaCode.value = "";

  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        phoneVerificationImg.value = "data:image/png;base64," + response.data.img;
        innerCodeId.value = response.data.id;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const showCaptchaDialog = ref(false);
const openPhoneVeriDialog = () => {
  telephoneNumberRef.value.validate()
  if (telephoneNumberRef.value && telephoneNumberRef.value.hasError) return;
  getInnerCode();
  showCaptchaDialog.value = true;
};

const isOtpSent = ref(false);
const showCaptchaSuccessDialog = ref(false);
const showCaptchaMessageDialog = ref(false);
const captchaFailedMessage = ref("");
const onCaptchaSubmit = () => {
  innerCaptchaRef.value.validate();
  if (innerCaptchaRef.value.hasError) return;

  api
    .post(
      `/otp/sendSms`,
      qs.stringify({
        telephone: bankCardInfo.telephone,
        captchaCode: innerCaptchaCode.value,
        codeId: innerCodeId.value
      })
    )
    .then((res) => {
      if (res.code === 0) {
        isOtpSent.value = true;
        timer.value = 300;
        startTimer(); // Start the timer

        bankCardInfo.smsCode = "";
        bankCardInfo.smsCodeId = res.data.codeId;

        showCaptchaMessageDialog.value = true;
        showCaptchaSuccessDialog.value = true;
        isPhoneVerified.value = true;
      } else {
        captchaFailedMessage.value = res.message;
        showCaptchaMessageDialog.value = true;
      }

      showCaptchaDialog.value = false;
    })
    .catch(() => {
      getInnerCode();
    });
};
  const timer = ref(300); // Timer starts at 60 seconds
  let intervalId = null;
  // Method to start the countdown timer
  function startTimer() {
    intervalId = setInterval(() => {
      if (timer.value > 0) {
        timer.value--;
      } else {
        clearInterval(intervalId); // Stop the timer when it reaches 0
        // isPhoneVerified.value = false;
        isOtpSent.value = false;
      }
    }, 1000); // Update the timer every second
  }

  // Method to show the timer in the button label
  function showTimer() {
    const minutes = Math.floor(timer.value / 60);
    const seconds = timer.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  // Cleanup the interval when the component is unmounted
  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
const bankList = ref([]);
const loadBankCards = () => {
  bankList.value = [];
  store.getMemberInfo().then(() => {
    if (!store.realName) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Please Complete your KYC.",
        icon: "report_problem"
      });
      router.push("/account/profile");
    } else {
      api
        .get("/session/withdraw/card")
        .then((res) => {
          if (res.code === 0) {
            const items = res.data.sort((a, b) => a.sequence - b.sequence);

            for (let i = 0, l = items.length; i < l; i++) {
              const data = items[i];
              const { bankType } = data;
              if (bankType === "CRYPTO") bankList.value.push(data);
            }

            onTypeToggleBtnClick(0, bankList.value[0].name);

            if (isValidPhone) {
              bankCardInfo.telephone = store.nickName;
            }
          }
        })
        .catch((e) => {
          console.log("error", e);
        });
    }
  });
};
const submitBankCard = () => {
  if (bankCardRef.value) {
    bankCardRef.value.validate();
  }
  if (cardNumberRef.value) {
    cardNumberRef.value.validate();
  }

  if (
    !(
      (bankCardRef.value && bankCardRef.value.hasError) ||
      (cardNumberRef.value && cardNumberRef.value.hasError) ||
      (phoneVerificationRef.value && phoneVerificationRef.value.hasError)
    )
  ) {
    if (!isOtpSent.value || !bankCardInfo.telephone) {
      $q.notify({
        color: "negative",
        position: "top",
        message: t("bankCard.clickAndEnterPhoneCode"),
        icon: "report_problem"
      });
      return;
    } else {
      // API call
      api
            .post("/session/bankCard", qs.stringify(bankCardInfo))
            .then((response) => {
              if (response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("notify.cryptoAccountAddedSuccessfully"),
                  icon: "check_circle_outline"
                });
                bankCardInfo.cardNumber = "";
                bankFormRef.value.reset();
                router.push("/account/bank");
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
    }
  }
};

const handleEnterKey = () => {
  if (!document.activeElement || document.activeElement.tagName.toLowerCase() !== "input") {
    openPhoneVeriDialog();
  }
};

onActivated(() => {
  loadBankCards();
  bankCardInfo.cardNumber = "";
  bankCardInfo.smsCode = "";
  bankFormRef.value.reset();
  // isPhoneVerified.value = false;
  isOtpSent.value = false;
});
</script>

<style lang="scss">
.popout-dialog-container {
  .landing-input {
    margin-bottom: 4px;
    width: 90%;
    margin: 0 auto 4px;
  }
}
.common-sm-btn {
  padding: 6px 12px;
  display: flex;
  border: 1px solid #21ef89;
  box-shadow: unset;
  border-radius: 6px;
  background: #292d2e;
}

.common-sm-white-btn {
  padding: 6px 12px;
  border-radius: 8px;
  background: #292d2e;
  border: 1px solid rgb(98 98 98);
}

.bind-container {
  font-size: 1rem;

  .bind-wrapper {
    width: calc(100% - 2rem);
    margin: 0 auto;
    padding: 1rem 0;

    .bind-item {
      // background: $white;
      // box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
      border-radius: 10px;
      margin: 0 auto 14px;
      // padding: 1.25rem;

      q-label {
        // color: $font-2;
        margin: 8px 0 4px 0;
        display: inline-block;
        font-size: 0.95rem;
        color: #98a6b4;

        em {
          color: $negative;
        }
      }

      q-btm {
        font-size: 1rem;
      }

      .q-field__label {
        font-size: 1rem;
      }

      .form-fields {
        margin-top: 8px;
      }

      .landing-input {
        margin-bottom: 4px;
      }

      .q-field__control {
        // padding-bottom: 12px;
        // border-radius: 0.5rem;
        // background: #f7f8fb;
        // box-shadow: 0px 0px 8px 0px #a9c9ea inset;
      }

      .get-otp-btn {
        position: relative;
        right: -0.75rem;
        width: 100%;
        height: 100%;
        aspect-ratio: unset;
        font-size: 1rem;
      }

      .type-toggle,
      .category-toggle {
        display: flex;
        flex-wrap: wrap;
        box-shadow: unset;
        gap: 20px;

        .content {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex: 1;
          padding: 10px;
          align-items: flex-start;
          font-weight: bold;
          // width: 6.5rem;

          img {
            width: 2.2rem;
            margin: 0 0.25rem;
          }

          .row {
            flex-wrap: nowrap;
          }
        }
      }
    }

    .note {
      color: #ffa031;
      font-size: 0.8rem;
      font-weight: 400;
      margin: 1rem 0;
    }
  }
}

.bottom-btn {
  display: flex;
  width: 100%;
  margin-top: 20px;
}
</style>
