<template>
  <InputField>
    <template #input>
      <q-input
        :ref="bindRef"
        hide-bottom-space
        v-model="_loginName"
        :rules="[
          (val) => (val && val.length > 0) || $t('form.email_rules_01'),
          (val) => /.+@.+\..+/.test(val) || $t('form.email_rules_02')
        ]"
        color="white"
        class="landing-input"
        outlined
        :placeholder="$t('form.email_placeholder')"
        label-color="brand"
      >
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
      </q-input>
    </template>
  </InputField>

  <InputField>
    <template #input>
      <q-input
        :ref="bindRef"
        hide-bottom-space
        v-model="_realName"
        :rules="[(val) => (val && val.length > 0) || $t('form.real_name_rules_01')]"
        color="white"
        class="landing-input"
        outlined
        :placeholder="$t('form.real_name_placeholder')"
        label-color="brand"
      >
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-input>
    </template>
  </InputField>

  <InputField>
    <template #input>
      <q-input
        :ref="bindRef"
        hide-bottom-space
        v-model="_birthday"
        :rules="[(val) => (val && val.length > 0) || $t('form.birthday_rules_01')]"
        readonly
        color="white"
        class="landing-input"
        outlined
        :placeholder="$t('form.birthday_placeholder')"
        label-color="brand"
      >
        <template v-slot:prepend>
          <img src="../../../assets/images/earn-money/calendar-icon.svg" width="16" />
        </template>
      </q-input>
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-date v-model="_birthday" mask="YYYY-MM-DD">
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Close" color="white" flat />
          </div>
        </q-date>
      </q-popup-proxy>
    </template>
  </InputField>

  <PasswordField :ref="bindRef" v-model="_password" />
</template>
<script setup>
import { toRefs, computed, ref } from "vue";
import InputField from "../../auth/InputField.vue";
import { useFormField } from "src/hooks/formField";
import PasswordField from "../common/PasswordField.vue";

const props = defineProps(["loginName", "realName", "birthday", "password"]);
const { loginName, realName, birthday, password } = toRefs(props);
const emit = defineEmits(["update:loginName", "update:realName", "update:birthday", "update:password"]);

const { validate, hasError, bindRef } = useFormField();

const _loginName = computed({
  get: () => loginName.value,
  set: (val) => emit("update:loginName", val)
});

const _realName = computed({
  get: () => realName.value,
  set: (val) => emit("update:realName", val)
});

const _birthday = computed({
  get: () => birthday.value,
  set: (val) => emit("update:birthday", val)
});

const _password = computed({
  get: () => password.value,
  set: (val) => emit("update:password", val)
});

defineExpose({
  validate,
  hasError
});
</script>
