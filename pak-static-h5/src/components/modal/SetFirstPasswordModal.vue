<template>
  <div class="popout-dialog">
    <q-btn dense rounded icon="close" class="text-white popout-close" @click="closeDialog" v-close-popup />
    <div class="popout-dialog-container">
      <div class="txt-title">{{ $t("form.setPassword") }}</div>
      <div class="pc-form">
        <InputRowGrid>
          <template #fields>
            <InputField :label="$t('form.password')">
              <template #input>
                <q-input
                  outlined
                  clearable
                  :placeholder="$t('form.password_placeholder')"
                  v-model="pwdInfo.password"
                  ref="passwordRef"
                  hide-bottom-space
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.newPassword_rules_01'),
                    (val) => val.length > 5 || $t('form.newPassword_rules_02'),
                    (val) => val.length < 13 || $t('form.newPassword_rules_03')
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField :label="$t('form.confirmPassword')">
              <template #input>
                <q-input
                  outlined
                  clearable
                  :placeholder="$t('form.confirmPassword_placeholder')"
                  v-model="pwdInfo.confirmPwd"
                  ref="confirmPasswordRef"
                  hide-bottom-space
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.confirmNewPassword_rules_01'),
                    (val) => val === pwdInfo.password || $t('form.confirmNewPassword_rules_02')
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </template>
            </InputField>
          </template>
        </InputRowGrid>
      </div>

      <div class="bottom-btn">
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submit">
          {{ $t("btn.confirm") }}
        </q-btn>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, defineEmits } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const qs = require("qs");
const $q = useQuasar();
const emit = defineEmits(["closeDialog"]);

const isPwd = ref(true);
const passwordRef = ref();
const confirmPasswordRef = ref();

const pwdInfo = reactive({
  password: "",
  confirmPwd: ""
});

const closeDialog = () => {
  emit("closeDialog");
};

const submit = () => {
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  if (!passwordRef.value.hasError && !confirmPasswordRef.value.hasError) {
    api
      .post(
        "/session/first-password",
        qs.stringify({
          password: pwdInfo.password
        })
      )
      .then((res) => {
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t('notify.newpasswordupdated'),
            icon: "check_circle_outline"
          });
          // store.getMemberInfo();
          closeDialog();
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: res.message,
            icon: "report_problem"
          });
        }
      })
      .catch((e) => {});
  }
};
</script>
<style scoped lang="scss">
.popout-dialog {
  padding: 20px 10px !important;
}

.bottom-btn {
  display: flex;
  width: 100%;
  margin-top: 40px;
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
