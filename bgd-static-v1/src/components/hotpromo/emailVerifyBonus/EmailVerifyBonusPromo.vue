<template>
  <div>
    <div class="link-box">
      <div class="inner-box">
        <div class="icon-img">
          <img src="../../../assets/images/promotion/hotpromo/email-verify-bonus/link-email-img.png" alt="" />
        </div>
        <div class="title-txt">Link with Email</div>
        <div class="tick-img">
          <img
            :src="
              require(`../../../assets/images/promotion/hotpromo/email-verify-bonus/tick-${
                hadBindEmail ? 'on' : 'off'
              }.png`)
            "
            alt="Tick"
          />
        </div>

        <q-btn no-caps class="primary-bg link-btn center" @click="openBindEmailDialog" :disable="hadBindEmail">
          Link
        </q-btn>
      </div>
    </div>

    <div>
      <img src="../../../assets/images/promotion/hotpromo/email-verify-bonus/header-event-details.png" alt="" />
    </div>

    <div class="app-login-content">
      <p>
        <span style="color: #fff96f">win7.game</span>
        Special Offer for New Members: First Deposit Bonus Up to
        <span style="color: #ff0000">119%</span>
        !
      </p>
      <p>
        Simply create a new member account at
        <span style="color: #fff96f">win7.game</span>
        , complete your first deposit, and you can claim your bonus. In addition, with a minimum deposit of
        <span style="color: #ff0000">100TK</span>
        , you can enjoy the first deposit bonus and an additional bonus of up to
        <span style="color: #ff0000">119%</span>
        , providing more fun.
      </p>
      <p>
        In addition, there are additional offers for users with higher top-ups. Top up more, enjoy more rewards, and
        participate in
        <span style="color: #fff96f">win7.game</span>
        activities with your friends to experience higher benefits and services.
      </p>
    </div>

    <table border="0" width="100%" cellpadding="0" cellspacing="0">
      <tbody>
        <tr style="font-size: 90%">
          <th>
            <b>Deposit Amount</b>
          </th>
          <th>
            <b>Giveaway Bonus</b>
          </th>
          <th>
            <b>Turnover requirements</b>
          </th>
          <th>
            <b>Applicable games</b>
          </th>
          <th>
            <b>Conditions for receiving</b>
          </th>
        </tr>
        <tr>
          <td>
            <b>100</b>
          </td>
          <td>
            <b>119</b>
          </td>
          <td>
            <b>10X</b>
          </td>
          <td rowspan="6">
            <b>Slot Machines</b>
            <div>
              <img
                src="../../../assets/images/promotion/hotpromo/email-verify-bonus/slot-machine-img.png"
                alt=""
                style="width: 40px !important; margin: 10px auto"
              />
            </div>
          </td>
          <td rowspan="6">
            <div class="table-flow-deposit">
              <b>Deposit payment</b>
              <div>
                <img src="../../../assets/images/promotion/hotpromo/email-verify-bonus/arrow-down.png" alt="" />
              </div>
              <b>Select a deposit channel</b>
              <div>
                <img src="../../../assets/images/promotion/hotpromo/email-verify-bonus/arrow-down.png" alt="" />
              </div>
              <b>Check the first deposit offer</b>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <b>200</b>
          </td>
          <td>
            <b>219</b>
          </td>
          <td>
            <b>10X</b>
          </td>
        </tr>
        <tr>
          <td>
            <b>500</b>
          </td>
          <td>
            <b>519</b>
          </td>
          <td>
            <b>10X</b>
          </td>
        </tr>
        <tr>
          <td>
            <b>5000</b>
          </td>
          <td>
            <b>1499</b>
          </td>
          <td>
            <b>10X</b>
          </td>
        </tr>
        <tr>
          <td>
            <b>20000</b>
          </td>
          <td>
            <b>2399</b>
          </td>
          <td>
            <b>10X</b>
          </td>
        </tr>
        <tr>
          <td>
            <b>50000</b>
          </td>
          <td>
            <b>1099</b>
          </td>
          <td>
            <b>10X</b>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="content-title-header">
      <img src="../../../assets/images/promotion/hotpromo/email-verify-bonus/header-example.png" alt="" />
    </div>
    <p>
      For example, member A tops up
      <span style="color: #ff0000">100 TK</span>
      for the first time and gets
      <span style="color: #ff0000">119 TK</span>
      as a reward. Before withdrawing, he needs to complete at least 10 times the turnover requirement, that is:
    </p>
    <p style="color: #ccff00">100 principal x 10 + 119 reward x 10 = 2190 turnover</p>

    <div class="content-title-header">
      <img src="../../../assets/images/promotion/hotpromo/email-verify-bonus/header-examhow.png" alt="" />
    </div>
    <p>
      Before making your first deposit, members need to verify their email address and bind a valid withdrawal account
      (supports Nagad, Rocket, Bkash, Upay).
    </p>
    <p style="color: #ccff00">
      Go to the deposit page > Select a deposit channel > Select a promotion > Click to receive the 119% first deposit
      bonus
    </p>

    <div class="q-pt-md">
      <img src="../../../assets/images/promotion/hotpromo/email-verify-bonus/header-tnc.png" alt="" />
    </div>

    <div class="q-pt-sm">
      <ul>
        <li>This bonus is only available for new member accounts and only for their first deposit.</li>
        <li>
          Withdrawal requirements: You need to complete the wagering requirement of at least 10 times the turnover. The
          calculation formula is: (Deposit amount + Bonus amount) × 10 times the turnover requirement.
        </li>
        <li>This bonus is only applicable to the slot game category.</li>
        <li>
          If a member mistakenly participates in a non-specified game category, the bonus will be deemed invalid and
          win7.gam reserves the right to deduct the relevant bonus and the profits generated.
        </li>
        <li>
          Each member is limited to one account (including deposit account, withdrawal account, IP address). Multiple
          account behavior will result in the bonus being invalid. If violations are found, win7.gam reserves the right
          to cancel the bonus and freeze the account.
        </li>
        <li>
          Before the first withdrawal application, the bound bank account information and phone number cannot be
          changed. If the information is changed, the bonus will be cancelled and the bonus and the resulting profits
          will be deducted.
        </li>
        <li>
          This bonus is only applicable to players in the specified game category. The bonus cannot be used to
          accumulate betting turnover, calculate arbitrage behavior or be used in combination with other technical
          means. If violations are found, the bonus will be deemed invalid, all bonuses and profits will be cancelled,
          and win7.gam reserves the right to close the account.
        </li>
        <li>
          win7.gam reserves the right to change, suspend or terminate this activity at any time without prior notice.
        </li>
        <li>
          The final right of interpretation of all terms belongs to win7.gam. win7.gam reserves the right to refuse to
          deal with any disputes involving terms.
        </li>
      </ul>
    </div>
  </div>

  <q-dialog width="100%" v-model="bindEmailDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.bindEmail") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.email')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.email_placeholder')"
                    v-model="updateEmailInfo.email"
                    ref="updateEmailRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => /.+@.+\..+/.test(val) || $t('form.email_rules_02')]"
                  >
                    <template v-slot:append>
                      <div class="pc-form-side-btn">
                        <q-btn
                          no-caps
                          dense
                          class="text-green"
                          :label="!startCountdownResendOTP && $t('form.send')"
                          :disable="startCountdownResendOTP"
                          @click="openVerificationCodeDialog"
                        />
                      </div>
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.code')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.code_placeholder')"
                    v-model="updateEmailInfo.code"
                    ref="updateEmailCodeRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => val.length !== 0 || $t('form.code_rules_01')]"
                  >
                    <template v-slot:append v-if="startCountdownResendOTP">{{ countdownOTP }}s</template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitUpdateEmail">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="verificationCodeDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.captchaCodeCheck") }}</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">{{ $t("form.captchaCode") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                hide-bottom-space
                dense
                clearable
                :placeholder="$t('form.captchaCode_placeholder')"
                v-model="captchaRef"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.captchaCode_rules_01'),
                  (val) => (val && val.length > 3 && val.length < 5) || $t('form.captchaCode_rules_02')
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onCaptchaSubmit">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { userStore } from "src/stores";
import { eventapi } from "src/boot/axios";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { t } from "src/boot/lang";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";

const store = userStore();
const qs = require("qs");
const $q = useQuasar();

const bindEmailDialog = ref(false);
const formDetail = reactive([]);
const updateEmailRef = ref();
const updateEmailCodeRef = ref();
const captchaRef = ref();
const showCaptchaDialog = ref(false);

const showVerificationTokenInput = ref(false);
const updateSecurityVerified = reactive({
  mobileNumber: "",
  verificationCode: ""
});
const verificationModalVisible = ref(false);

let verificationCodeID = "";
const startCountdownResendOTP = ref(false);
const countdownOTP = ref();

const openBindEmailDialog = () => {
  bindEmailDialog.value = true;
};

const updateEmailInfo = reactive({
  email: "",
  code: "",
  codeId: ""
});

const submitUpdateEmail = () => {
  updateEmailRef.value.validate();
  updateEmailCodeRef.value.validate();

  if (updateEmailRef.value.hasError || updateEmailCodeRef.value.hasError) {
  } else {
    api
      .post(
        "/session/verifyAndUpdateEmail",
        qs.stringify({
          email: updateEmailInfo.email,
          code: updateEmailInfo.code,
          codeId: updateEmailInfo.codeId
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Email binded successfully",
            icon: "check_circle_outline"
          });
          bindEmailDialog.value = false;
          formDetail.email = updateEmailInfo.email;
          formDetail.emailVerified = true;

          getEmailVerifyBonus();
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const verificationCodeDialog = ref(false);
const openVerificationCodeDialog = () => {
  api
    .get(`/member/checkEmailRegisterStatus?email=${updateEmailInfo.email}`)
    .then((response) => {
      if (response.code === 0) {
        if (response.data) {
          $q.notify({
            color: "negative",
            position: "top",
            message: "Email already used. Please try another email.",
            icon: "report_problem"
          });
        } else {
          verificationCodeDialog.value = !verificationCodeDialog.value;
        }
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });

  captchaRef.value = "";
  getCode();
};

const onCaptchaSubmit = () => {
  api
    .post(
      `/otp/sendNewEmail`,
      qs.stringify({
        email: updateEmailInfo.email,
        captchaCode: captchaRef.value,
        codeId: updateSecurityVerified.codeId
      })
    )
    .then((res) => {
      let message = res.message,
        color = "positive";

      if (res.code === 0) {
        verificationCodeDialog.value = false;

        updateEmailInfo.codeId = res.data.codeId;

        showVerificationTokenInput.value = true;
        verificationCodeID = res.data.codeId;
        startCountdownResendOTP.value = true;

        countdownOTP.value = 59;
        let timer = setInterval(() => {
          countdownOTP.value -= 1;
          if (countdownOTP.value === 0) {
            clearInterval(timer);
            startCountdownResendOTP.value = false;
          }
        }, 1000);

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.emailVerificationSent"),
          icon: "check_circle_outline"
        });
      } else {
        color = "negative";
        getCode();
      }

      if (message) $q.notify({ message, color });

      console.log("onCaptchaSubmit", res);
    });
};

const verificationImg = ref("");
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
        updateSecurityVerified.codeId = response.data.id;
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });
};

const props = defineProps(["promocode"]);
const hadBindEmail = ref(false);

const getEmailVerifyBonus = () => {
  eventapi.get(`/session/app-login-bonus/init?promoCode=${props.promocode}`).then((res) => {
    hadBindEmail.value = res.data.hadBindEmail;
  });
};

onMounted(() => {
  getCode();
  getEmailVerifyBonus();
});
</script>

<style scoped lang="scss">
.table-flow-deposit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #00ff80;

  img {
    display: block;
    width: 7px !important;
  }
}

.app-login-content {
  margin-top: 16px;
}

.content-title-header {
  padding-top: 16px;
  margin-bottom: 16px;
  img {
    width: 80% !important;
    margin: auto;
  }
}

.link-box {
  border: 1px solid #337e3a;
  border-radius: 10px;
  background-color: #1e371f;
  padding: 10px;
  margin-bottom: 16px;

  .inner-box {
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    padding: 4px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon-img {
    img {
      width: 45px !important;
    }
  }

  .tick-img {
    img {
      width: 20px !important;
    }
  }
}

.primary-bg {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  color: #000a01;
}
.link-btn {
  height: 35px;
  font-weight: 700;
  padding: 6px;
  min-width: 70px;
  border-radius: 4px;
  margin-left: auto;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pc-form {
  margin-top: 20px;
  margin-bottom: 20px;
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
        height: calc(100% - 36px);
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

  .pc-form-side-btn {
    position: relative;
    right: -12px;

    :deep(.q-btn-item) {
      height: 38px;
    }

    &.copy-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
