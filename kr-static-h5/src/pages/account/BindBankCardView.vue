<template>
  <q-dialog class="modal-common-div" v-model="showCaptchaDialog">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">{{ $t("lang.captcha_code") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <q-input
          ref="innerCaptchaRef"
          v-model="innerCaptchaCode"
          :placeholder="$t('lang.captcha_code')"
          maxlength="4"
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.enter_captcha_code'),
            (val) => (val && val.length === 4) || $t('lang.captcha_code_must_4')
          ]"
          @keydown.enter="onCaptchaSubmit()"
        >
          <template v-slot:append>
            <img
              :src="phoneVerificationImg"
              :title="$t('lang.captcha_refresh')"
              style="margin-top: 6px; cursor: pointer"
              @click="getInnerCode()"
            />
          </template>
        </q-input>
      </div>

      <q-card-actions style="margin: 0 auto" align="center" class="bg-white text-teal">
        <q-btn
          style="width: 100%"
          class="common-md-btn"
          flat
          :label="$t('lang.verification_code_send')"
          @click="onCaptchaSubmit()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" v-model="showCaptchaSuccessDialog">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">{{ $t("lang.system_hint") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <img style="width: 2.5rem" src="../../assets/images/common/success-tick-icon.svg" />
        <p>{{ $t("lang.system_operation_success") }}</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
        <q-btn class="common-md-btn" flat :label="$t('lang.system_confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" v-model="showCaptchaFailedDialog">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">{{ $t("lang.system_hint") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <img style="width: 2.5rem" src="../../assets/images/common/failed-icon.svg" />
        <p>{{ captchaFailedMessage || $t("lang.system_verify_failed") }}</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
        <q-btn class="common-md-btn" flat :label="$t('lang.system_confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" v-model="showBindBankNoteDialog">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">{{ $t("lang.bd_note") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <!-- <div class="contents"> -->
      <ol>
        <li class="q-mb-md">{{ $t("lang.bd_note_para_01") }}</li>
        <li>{{ $t("lang.bd_note_para_02") }}</li>
      </ol>
      <!-- </div> -->

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
        <q-btn class="common-md-btn" flat :label="$t('lang.system_confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-page class="bind-container">
    <div class="bind-wrapper">
      <q-form class="bind-item q-my-xs">
        <q-label>
          {{ $t("lang.bd_account_bank") }}
          <em>*</em>
        </q-label>
        <q-select
          ref="bankCardRef"
          standout
          v-model="bankCardInfo.bankId"
          class="q-pb-xs"
          hide-bottom-space
          :label="$t('lang.bd_please_select')"
          lazy-rules
          clearable
          :options="bankList"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          dense
          :rules="[(val) => val || $t('lang.bd_please_select')]"
        >
          <template v-slot:selected-item="scope">
            <q-item-section avatar>
              <img
                v-if="scope.opt.bankIcon"
                style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                :src="imgURL + '/payment/' + scope.opt.bankIcon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                {{ scope.opt.name }}
              </q-item-label>
            </q-item-section>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <img
                  v-if="scope.opt.bankIcon"
                  style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                  :src="imgURL + '/payment/' + scope.opt.bankIcon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-label>
          {{ $t("lang.bd_bank_acc_number") }}
          <em>*</em>
        </q-label>
        <q-input
          ref="cardNumberRef"
          type="number"
          standout
          v-model="bankCardInfo.cardNumber"
          class="q-pb-xs"
          hide-bottom-space
          :placeholder="$t('lang.bd_please_enter_bank_card')"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.bd_please_enter_bank_card'), validateBankLength]"
        ></q-input>

        <q-label>
          {{ $t("lang.bd_real_name") }}
          <em>*</em>
        </q-label>
        <q-input
          standout
          v-model="bankCardInfo.cardAccount"
          class="q-pb-xs"
          hide-bottom-space
          :placeholder="$t('lang.bd_please_enter_real_name')"
          lazy-rules
          clearable
          readonly
        ></q-input>

        <q-label>
          {{ $t("lang.bd_acc_bank_address") }}
          <em>*</em>
        </q-label>
        <q-input
          ref="cardAddressRef"
          standout
          v-model="bankCardInfo.cardAddress"
          class="q-pb-xs"
          hide-bottom-space
          :placeholder="$t('lang.bd_please_enter_acc_bank_address')"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.bd_please_enter_acc_bank_address')]"
        ></q-input>

        <!-- since onMount API forced update name & phone, hence no validation needed. -->
        <q-label>
          {{ $t("lang.bd_phone_number") }}
          <em>*</em>
        </q-label>
        <q-input
          standout
          v-model="bankCardInfo.telephone"
          class="q-pb-xs"
          hide-bottom-space
          :placeholder="$t('lang.bd_please_enter_phone_number')"
          lazy-rules
          clearable
          readonly
        >
          <template v-slot:append>
            <q-btn
              @click="openPhoneVeriDialog()"
              type="submit"
              class="common-sm-btn bottom-btn get-otp-btn"
              :label="$t('lang.bd_get_otp')"
              color="brightbtn"
              rounded
            />
          </template>
        </q-input>

        <template v-if="isOtpSent">
          <q-label>
            {{ $t("lang.bd_otp_code") }}
            <em>*</em>
          </q-label>
          <q-input
            ref="phoneVerificationRef"
            standout
            v-model="bankCardInfo.smsCode"
            class="q-pb-xs"
            hide-bottom-space
            :placeholder="$t('lang.bd_please_enter_otp')"
            lazy-rules
            clearable
            maxlength="6"
            :rules="[(val) => (val && val.length > 3) || $t('lang.bd_please_enter_otp')]"
            @keydown.enter.prevent="handleEnterKey"
            @keydown.enter="submitBankCard()"
          ></q-input>
        </template>
      </q-form>

      <div class="note">{{ $t("lang.bd_reminder_name_issue") }}</div>

      <q-btn
        class="common-large-btn"
        :label="$t('lang.bd_submit')"
        width="100%"
        style="width: 100%"
        @click="submitBankCard()"
      />
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onActivated } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { t } from "src/boot/lang";
import {useLocalStorage} from "@vueuse/core";

const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value;
const bankCardRef = ref();
const cardNumberRef = ref();
const cardAddressRef = ref();
const phoneVerificationRef = ref();

const bankCardInfo = reactive({
  bankId: undefined,
  cardNumber: "",
  cardAccount: store.realName,
  cardAddress: "",
  telephone: store.phone,
  smsCode: "",
  smsCodeId: ""
});

const validateBankLength = (val) => {
  if (!/^\d+$/.test(val)) return t("lang.bd_please_enter_digit_only");
  return (val.length > 5 && val.length < 21) || t("lang.bd_length_between_8_20");
};

// NOTE: no chance to validate, e.g. member telephone = 44****77
// const isValidCnPhone = () => {
//   const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
//   return phonePattern.test(bankCardInfo.telephone) || "请输入有效的电话号码";
// };

const phoneVerificationImg = ref("");
const innerCodeId = ref("");
const innerCaptchaCode = ref("");
const innerCaptchaRef = ref();
const getInnerCode = () => {
  isOtpSent.value = false;
  innerCaptchaCode.value = "";

  api
    .get("/member/verificationEasyCode")
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
  getInnerCode();
  showCaptchaDialog.value = true;
};

const isOtpSent = ref(false);
const showCaptchaSuccessDialog = ref(false);
const showCaptchaFailedDialog = ref(false);
const captchaFailedMessage = ref("");
const onCaptchaSubmit = () => {
  innerCaptchaRef.value.validate();
  if (innerCaptchaRef.value.hasError) return;

  api
    .post(
      `/session/sendSms`,
      qs.stringify({
        captchaCode: innerCaptchaCode.value,
        codeId: innerCodeId.value
      })
    )
    .then((res) => {
      if (res.code === 0) {
        isOtpSent.value = true;

        bankCardInfo.smsCode = "";
        bankCardInfo.smsCodeId = res.data.codeId;

        showCaptchaSuccessDialog.value = true;
      } else {
        captchaFailedMessage.value = res.message;
        showCaptchaFailedDialog.value = true;
      }

      showCaptchaDialog.value = false;
    })
    .catch(() => {
      getInnerCode();
    });
};

const bankList = ref([]);
const loadBankCards = () => {
  bankCardInfo.bankId = null;
  bankCardInfo.cardNumber = "";
  bankCardInfo.cardAddress = "";
  bankCardInfo.smsCode = "";

  store.getMemberInfo().then(() => {
    if (!store.realName) {
      $q.notify({
        color: "negative",
        position: "top",
        message: t("lang.bd_please_enter_real_name"),
        icon: "report_problem"
      });
      router.push("/account/personal");
    } else if (!store.phone) {
      $q.notify({
        color: "negative",
        position: "top",
        message: t("lang.bd_please_enter_phone_number"),
        icon: "report_problem"
      });
      router.push("/account/verifyTelephone");
    } else {
      api
        .get("/session/withdraw/card")
        .then((res) => {
          if (res.code === 0) {
            for (let i = 0, l = res.data.length; i < l; i++) {
              const data = res.data[i];
              const { bankType, bankCode } = data;
              // is bank & not alipay (78)
              if (bankType === "BANK" && bankCode !== 78) bankList.value.push(data);
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
  bankCardRef.value.validate();
  cardNumberRef.value.validate();
  cardAddressRef.value.validate();

  if (!phoneVerificationRef.value) {
    $q.notify({
      color: "negative",
      position: "top",
      message: t("lang.bd_click_verification"),
      icon: "report_problem"
    });
  } else {
    phoneVerificationRef.value.validate();
  }

  if (
    !(
      bankCardRef.value.hasError ||
      cardNumberRef.value.hasError ||
      cardAddressRef.value.hasError ||
      phoneVerificationRef.value.hasError
    )
  ) {
    api
      .post("/session/bankCard", qs.stringify(bankCardInfo))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("lang.bd_added_bank_card"),
            icon: "check_circle_outline"
          });
          router.push("/account/withdraw");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const handleEnterKey = () => {
  if (!document.activeElement || document.activeElement.tagName.toLowerCase() !== "input") {
    openPhoneVeriDialog();
  }
};

const showBindBankNoteDialog = ref(true);

onActivated(() => {
  loadBankCards();
});
</script>

<style lang="scss">
.bind-container {
  font-size: 1rem;

  .bind-wrapper {
    width: calc(100% - 2rem);
    margin: 0 auto;
    padding: 1rem 0;

    .bind-item {
      background: $white;
      box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
      border-radius: 10px;
      margin: 0 auto 14px;
      padding: 0 1.25rem 10px;

      q-label {
        color: $font-2;
        margin: 8px 0 4px 0;
        display: inline-block;

        em {
          color: $negative;
        }
      }

      .q-field__control {
        border-radius: 0.5rem;
        height: 40px;
        background: #f7f8fb;
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
      }

      .get-otp-btn {
        position: relative;
        right: -0.75rem;
        width: 100%;
        font-size: 1rem;
      }
      .q-field__marginal {
        height: 38px;
      }
      // .q-field--auto-height .q-field__control, .q-field--auto-height .q-field__native {
      //   min-height: unset;
      // }
      // .q-field__label.absolute {
      //   top: 10px;
      // }
    }

    .note {
      color: #ffa031;
      font-size: 0.8rem;
      font-weight: 400;
      margin: 1rem 0;
    }
  }
}

.q-dialog__inner {
  .q-field__control {
    // background: $primary;
    color: #ffffff;
  }
}
</style>
