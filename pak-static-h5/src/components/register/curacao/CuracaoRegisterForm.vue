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
        autocomplete="email"
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
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-date v-model="_birthday" mask="YYYY-MM-DD">
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Close" color="white" flat />
          </div>
        </q-date>
      </q-popup-proxy>
    </template>
  </InputField>

  <InputField>
    <template #input>
      <q-input
        :ref="bindRef"
        hide-bottom-space
        v-model="_telephone"
        :rules="[
          (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
          (_) => selectedCountryCode || $t('form.country_code_rules_01')
        ]"
        color="white"
        class="landing-input"
        outlined
        :placeholder="$t('form.phone_placeholder')"
        label-color="brand"
        type="tel"
        pattern="\d*"
      >
        <template v-slot:prepend>
          <button class="country-code-btn" @click="handleCountryCodeToggleClick">
            <template v-if="selectedCountryCode">
              {{ selectedCountryCode.emoji }} +{{ selectedCountryCode.code }}
            </template>
            <template v-else>
              <q-icon name="public" />
            </template>
          </button>
        </template>
      </q-input>
    </template>
  </InputField>

  <PasswordField :ref="bindRef" v-model="_password" />

  <q-dialog v-model="displayCountryCodeSelector" class="country-code-selector">
    <q-card>
      <q-card-section>
        <InputField>
          <template #input>
            <q-input
              v-model="searchCountryCode"
              hide-bottom-space
              color="white"
              class="landing-input"
              outlined
              :placeholder="$t('form.country_code_placeholder')"
              label-color="brand"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </InputField>
        <q-virtual-scroll class="country-code-list" :items="displayCountryCodeList" v-slot="{ item, index }">
          <q-item :key="index" clickable @click="handleCountryCodeClick(item)">
            <q-item-section avatar="">{{ item.emoji }} +{{ item.code }}</q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                {{ item.name }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="selector" :class="{ selected: item.name === selectedCountryCode?.name }" />
            </q-item-section>
          </q-item>
        </q-virtual-scroll>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { toRefs, computed, ref } from "vue";
import InputField from "../../auth/InputField.vue";
import { useFormField } from "src/hooks/formField";
import PasswordField from "../common/PasswordField.vue";
import { COUNTRY_CODE_LIST } from "src/constant/countryCode";

const props = defineProps(["loginName", "realName", "birthday", "password", "telephone", "countryCode"]);
const { loginName, realName, birthday, password, telephone } = toRefs(props);
const emit = defineEmits([
  "update:loginName",
  "update:realName",
  "update:birthday",
  "update:password",
  "update:telephone",
  "update:countryCode"
]);

const { validate, hasError, bindRef } = useFormField();

const selectedCountryCode = ref(null);
const displayCountryCodeSelector = ref(false);
const searchCountryCode = ref("");

const displayCountryCodeList = computed(() =>
  COUNTRY_CODE_LIST.filter((item) => {
    const isBlockCountry = ["Curaçao", "Netherlands", "United States"].includes(item.name);
    const isMatchedSearchStr =
      item.name.toLowerCase().includes(searchCountryCode.value?.toLowerCase()) ||
      item.code.includes(searchCountryCode.value);
    if (isBlockCountry || !isMatchedSearchStr) return false;
    return true;
  })
);

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

const _telephone = computed({
  get: () => telephone.value,
  set: (val) => {
    emit("update:telephone", val);
  }
});

const handleCountryCodeToggleClick = () => {
  displayCountryCodeSelector.value = !displayCountryCodeSelector.value;
};

const handleCountryCodeClick = (item) => {
  selectedCountryCode.value = item;
  displayCountryCodeSelector.value = false;
  emit("update:countryCode", item.code);
};

defineExpose({
  validate,
  hasError
});
</script>
<style lang="scss" scoped>
.landing-input {
  :deep(.country-code-btn) {
    background: transparent;
    border: none;
    color: #b3bec1;
    padding: 0;
  }
}
</style>
<style lang="scss">
.country-code-selector {
  .q-card {
    max-width: 300px;
    width: 100%;
    padding: 16px 4px 0;
    .country-code-list {
      max-height: 300px;
      margin-top: 16px;
      .q-item {
        border-radius: 8px;
        .selector {
          width: 16px;
          height: 16px;
          border: 1px solid #9f9f9f;
          border-radius: 50%;
          &.selected {
            border-color: #28c933;
            border-width: 4px;
          }
        }
      }
    }
  }
}
</style>
