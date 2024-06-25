<template>
  <div class="page-container">
    <q-form class="register-form page-content" @keypress.enter="onSubmit">
      <div class="form-item">
        <label>{{ $t('lang.reg_referrer') }}</label>
        <q-input dense :placeholder="$t('lang.reg_referrer_placeholder')" ref="codeAffiliate" outlined
          v-model="regForm.codeAffiliate" :disable="hasAffiliate" clearable></q-input>
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_nickname') }}</label>
        <q-input dense ref="nicknameRef" outlined v-model="regForm.name2" clearable />
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_userid') }}</label>
        <q-input dense ref="loginNameRef" outlined v-model="regForm.loginName" lazy-rules :rules="[
          (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
          (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
          (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
        ]" clearable />
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_pass') }}</label>
        <div>
          <q-input dense :placeholder="$t('lang.reg_pass_placeholder')" ref="pwdRef" outlined v-model="regForm.password"
            :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
              (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
            ]" clearable>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_confirm_pass') }}</label>
        <q-input dense :placeholder="$t('lang.reg_confirm_pass_placeholder')" ref="confirmPwdRef" outlined
          :type="isCfmPwd ? 'password' : 'text'" v-model="regForm.confirmPwd" lazy-rules :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_confirm_pass'),
            (val) => val === regForm.password || $t('lang.password_do_not_match'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
          ]" clearable>
          <template v-slot:append>
            <q-icon :name="isCfmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="isCfmPwd = !isCfmPwd" />
          </template>
        </q-input>
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_phone_num') }}</label>
        <q-input dense :placeholder="$t('lang.reg_phone_placeholder')" ref="telRef" outlined v-model="regForm.telephone"
          lazy-rules :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_confirm_phone_number'),
            (val) => (val && val.length > 7) || $t('lang.please_enter_valid_phone')
          ]" clearable>
        </q-input>
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_bank') }}</label>
        <q-select dense outlined :placeholder="$t('lang.reg_bank_placeholder')" ref="bankCardRef"
          v-model="regForm.bankId" :options="banksList" option-value="id" option-label="name" emit-value map-options
          lazy-rules :rules="[(val) => !!val || $t('lang.please_select_a_bank_account')]" transition-show="jump-up"
          transition-hide="jump-up" clearable>
          <template v-slot:no-option></template>
          <template v-slot:option="scope">
            <div v-bind="scope.itemProps" dense class="bank-list-item" style="padding:0 5px;">
              <div avatar v-if="scope.opt.bankIcon">
                <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
              </div>
              <div>
                {{ scope.opt.name }}
              </div>
            </div>
          </template>
          <template v-slot:selected-item="scope">
            <div v-bind="scope.itemProps" dense class="bank-list-item">
              <div avatar v-if="scope.opt.bankIcon">
                <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
              </div>
              <div>
                {{ scope.opt.name }}
              </div>
            </div>
          </template>
        </q-select>
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_bank_acc_num') }}</label>
        <q-input dense type="number" :placeholder="$t('lang.reg_bank_acc_num_placeholder')" ref="cardNumRef" outlined
          v-model="regForm.cardNumber" lazy-rules clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_card_num')]"></q-input>
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_bank_acc_holder') }}</label>
        <q-input dense :placeholder="$t('lang.reg_bank_acc_holder_placeholder')" ref="cardAccRef" outlined
          v-model="regForm.cardAccount" lazy-rules clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.card_account_cannot_empty')]"></q-input>
      </div>

      <div class="form-item">
        <label>{{ $t('lang.reg_withdraw_password') }}</label>
        <q-input dense :placeholder="$t('lang.reg_withdraw_password_placeholder')" ref="withdrawPasswordRef" outlined
          v-model="regForm.withdrawPassword" clearable lazy-rules :rules="[
            (val) => (val.length === 4) || $t('lang.reg_withdraw_password_4_digits')
          ]" mask="#  #  #  #" fill-mask unmasked-value />
      </div>
    </q-form>

    <div class="action-buttons">
      <div @click="onSubmit" class="primary-button blue register-submit-btn">
        {{ $t('lang.reg_submit') }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform, SessionStorage } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "RegisterPage",
  emits: ["closeModal"],
  setup(_props, { emit }) {
    const { t } = useI18n();
    const store = userStore();
    const siteId = process.env.SITEID;
    const captchaLoading = ref(false);

    onMounted(() => {
      getAffiliateCode();
      getReferralCode();
      api
        .get(`/member/withdraw/banks?siteId=${siteId}`)
        .then((ret) => {
          const res = ret.data;
          if (res.code === 0) {
            bankCardModalState.banks.push(...res.data);
            selectBankType();
          }
        })
        .catch((e) => {
          console.log("error", e);
        });
    });
    const imgURL = process.env.IMAGE_CDN;

    const $q = useQuasar();
    const regForm = reactive({
      name2: "",
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      realName: "",
      cardNumber: "",
      cardAccount: "",
      codeAffiliate: "",
      withdrawPassword: "",
      regHost: location.hostname
    });

    const nicknameRef = ref();
    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    const telRef = ref();
    const cardNumRef = ref();
    const cardAccRef = ref();
    const cardAccountNameRef = ref();
    const cardAccountSurnameRef = ref();
    const cardNumberRef = ref();
    const bankCardRef = ref();
    const withdrawPasswordRef = ref("");

    const router = useRouter();
    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      telRef.value.validate();
      cardNumRef.value.validate();
      cardAccRef.value.validate();
      bankCardRef.value.validate();
      withdrawPasswordRef.value.validate();
      $q.loading.show({
        message: t("lang.loading")
      });
      var qs = require("qs");
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        telRef.value.hasError ||
        cardNumRef.value.hasError ||
        cardAccRef.value.hasError ||
        bankCardRef.value.hasError ||
        withdrawPasswordRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        const sidParam = store.visitorId;
        (async () => {
          regForm.sid = sidParam;
          regForm.regDevice = $q.platform.is.mobile ? "H5" : "WEB";

          if ("standalone" in window.navigator && window.navigator.standalone) {
            regForm.regDevice = "IOS";
          } else {
            regForm.regDevice = Platform.is.mobile ? "H5" : "WEB";
            if (Platform.is.capacitor) {
              if (Platform.is.android) {
                regForm.regDevice = "ANDROID";
              }
            }
          }

          if (regForm.regHost.indexOf("http://localhost") > -1) {
            regForm.regHost = "app://";
          }
          api
            .post("/member/register-with-bank-card", qs.stringify(regForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                SessionStorage.set("TOKEN", res.data);

                emit("closeModal");

                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("lang.register_successful"),
                  icon: "check_circle_outline"
                });

                setTimeout(() => {
                  router.push("/");
                  location.reload();
                }, 1000);
              } else {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: res.message,
                  icon: "report_problem"
                });
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
            });
        })();
      }
    };

    const bankCardModalState = reactive({
      visible: false,
      banks: []
    });

    const banksList = ref([]);
    const selectedBankType = ref("Bank");
    const selectBankType = () => {
      regForm.bankId = "";
      banksList.value = [];
      bankCardModalState.banks.forEach((element) => {
        banksList.value.push(element);
      });
    };

    let validateBankLength = (val) => {
      if (selectedBankType.value === "Bank") {
        return (val.length > 5 && val.length < 13) || t("lang.length_between_6_12");
      } else if (selectedBankType.value === "Crypto") {
        return (val.length > 33 && val.length < 38) || t("lang.length_between_34_37");
      }
    };
    const hasAffiliate = ref(false);
    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        regForm.referrer = refCode;
      }
    };

    return {
      regForm,
      nicknameRef,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      telRef,
      cardNumRef,
      cardAccRef,
      cardNumberRef,
      cardAccountNameRef,
      cardAccountSurnameRef,
      bankCardRef,
      withdrawPasswordRef,
      onSubmit,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      selectBankType,
      selectedBankType,
      validateBankLength,
      banksList,
      imgURL,
      hasAffiliate,
      getAffiliateCode,
      getReferralCode,
      captchaLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.form-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 20px;

  label {
    text-align: right;
  }

  @media (max-width: 600px) {
    grid-template-columns: 80px 1fr;
    gap: 10px;

    label {
      font-size: small;
    }
  }

  @media (max-width: 400px) {
    grid-template-columns: 60px 1fr;
    gap: 5px;

    label {
      font-size: x-small;
    }
  }
}

.bank-list-item {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}
</style>
