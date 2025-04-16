<template>
  <div @click="openDialog">
    <slot />
  </div>
  <el-dialog
    :title="t('common.changePassword')"
    v-model="dialogVisible"
    width="580px"
    custom-class="forget-pw-modal"
    append-to-body
  >
    <el-form
      :model="pwForgetModel"
      :rules="pwForgetRules"
      ref="pwForgetRef"
      size="normal"
      label-width="162px"
    >
      <el-form-item
        v-if="requireOld"
        :label="t('fields.currentPassword')"
        prop="oldPW"
      >
        <el-input
          type="password"
          v-model="pwForgetModel.oldPassword"
          autocomplete="off"
          style="width: 350px;"
        />
      </el-form-item>
      <el-form-item
        :label="t('fields.newPassword')"
        prop="password"
      >
        <el-input
          type="password"
          v-model="pwForgetModel.password"
          autocomplete="off"
          style="width: 350px;"
        />
      </el-form-item>
      <el-form-item
        :label="t('fields.confirmNewPassword')"
        prop="cfmPW"
      >
        <el-input
          type="password"
          v-model="pwForgetModel.cfmPW"
          autocomplete="off"
          style="width: 350px;"
        />
      </el-form-item>
      <div class="forget-pw-btns">
        <el-button
          size="normal"
          @click="dialogVisible = false"
        >
          {{ $t('fields.cancel') }}
        </el-button>
        <el-button size="normal" type="primary" @click="submitForm">{{ $t('fields.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  emits: [
    "submit"
  ],
  props: {
    requireOld: {
      type: Boolean
    }
  },
  setup(_, { emit }) {
    // TODO: when api ready hook up for buttons

    const pwForgetModel = reactive({
      oldPassword: "",
      password: "",
      cfmPW: ""
    });

    const { t } = useI18n();

    const pwForgetRef = ref();

    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(t('message.inputPassword')));
      } else {
        if (pwForgetModel.cfmPW !== "") {
          // double check if it works
          pwForgetRef.value.validateField("cfmPW");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      // what is this rule param
      if (value === "") {
        callback(new Error(t('message.inputPasswordAgain')));
      } else if (value !== pwForgetModel.password) {
        callback(new Error(t('message.twoPasswordNotMatch')));
      } else {
        callback();
      }
    };

    const validatePasswordLength = (rule, value, callback) => {
      if (value.length < 6 || value.length > 12) {
        callback(new Error(t('message.passwordLength')));
      } else {
        callback();
      }
    };

    const pwForgetRules = reactive({
      oldPassword: [], // do i wn async validator here?
      password: [{ validator: validatePass, trigger: "blur" }, { validator: validatePasswordLength, trigger: "blur" }],
      cfmPW: [{ validator: validatePass2, trigger: "blur" }, { validator: validatePasswordLength, trigger: "blur" }]
    });

    const dialogVisible = ref(false);

    const submitForm = () => {
      pwForgetRef.value.validate(async (valid) => {
        if (valid) {
          emit("submit", { ...pwForgetModel });
          dialogVisible.value = false;
        }
      });
    };

    const openDialog = () => {
      dialogVisible.value = true;
      pwForgetModel.oldPassword = null;
      if (pwForgetRef.value) {
        pwForgetRef.value.resetFields();
      }
    };

    return {
      dialogVisible,
      pwForgetModel,
      pwForgetRules,
      submitForm,
      pwForgetRef,
      t,
      openDialog
    };
  }
});
</script>

<style lang="scss" scoped>
.forget-pw-modal[aria-modal] {
  max-width: 90%;
}

.forget-pw-btns {
  display: flex;
  justify-content: flex-end;
}
</style>
<style lang="scss" scoped></style>
