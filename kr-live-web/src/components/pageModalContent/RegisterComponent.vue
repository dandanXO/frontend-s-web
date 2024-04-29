<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
      <form class="register-form">
        <div>
          <label>{{ t("lang.reg_phone_num") }}</label>
          <input v-model="regForm.telephone" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_login_name") }}</label>
          <input v-model="regForm.loginName" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_pass") }}</label>
          <input v-model="regForm.password" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_confirm_pass") }}</label>
          <input v-model="regForm.confirmPwd" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_email") }}</label>
          <input v-model="regForm.email" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_code_affiliate") }}</label>
          <input v-model="regForm.codeAffiliate" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_bank_id") }}</label>
          <input v-model="regForm.bankId" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_card_acc") }}</label>
          <input v-model="regForm.cardNumber" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_card_acc_name") }}</label>
          <input v-model="regForm.cardAccountName" placeholder="" />
        </div>
        <div>
          <label>{{ t("lang.reg_card_acc_surname") }}</label>
          <input v-model="regForm.cardAccountSurname" placeholder="" />
        </div>
      </form>
      <div class="action-buttons">
        <q-btn class="form-button blue" label="등록" @click="handleRegister"></q-btn>
        <q-btn class="form-button yellow" label="로그인"></q-btn>
      </div>
    </q-card-section>
  </div>
</template>

<script setup id="RegisterComponent">
import { reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { Platform, useQuasar } from "quasar";

const qs = require("qs");

const { t } = useI18n();
const $q = useQuasar();

const regDevice = Platform.is.mobile && Platform.is.capacitor ? "ANDROID" : Platform.is.mobile ? "H5" : "WEB";

const siteId = process.env.SITEID;
const regForm = reactive({
  loginName: "",
  password: "",
  confirmPwd: "",
  telephone: "",
  email: "",
  codeAffiliate: "",
  bankId: null,
  cardNumber: null,
  cardAccountName: "",
  cardAccountSurname: "",
  regHost: location.hostname,
  regDevice: regDevice
})

const handleRegister = () => {
  api.post("/member/register-with-bank-card", qs.stringify(regForm)).then((ret) => {
    const res = ret.data;
    if (res.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: t("lang.register_successful"),
        icon: "check_circle_outline"
      });
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  })
  .catch((error) => {
  });
}

onMounted(() => {
});

</script>

<style lang="scss" scoped>
.modal-body-content {
  .register-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;

    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;

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

    label, input {
      width: 100%;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 20px 10px 10px;

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

      &.blue {
        background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
      }

      &.yellow {
        background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
      }
    }
  }
}
</style>