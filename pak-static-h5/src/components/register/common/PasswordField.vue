<template>
  <InputField>
    <template #input>
      <q-input
        :ref="bindRef"
        hide-bottom-space
        v-model="_modelValue"
        :type="isPwd ? 'password' : 'text'"
        :rules="[
          (val) => (val && val.length > 0) || $t('form.password_rules_01'),
          (val) => val.length > 6 || $t('form.password_rules_02')
        ]"
        color="green"
        outlined
        clearable
        label-color="brand"
        :placeholder="$t('form.password_placeholder')"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:append>
          <!-- <q-icon
                        color="gray-3"
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      /> -->
          <img
            style="width: 20px"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
            :src="require(`../../../assets/images/common/visibility${isPwd ? '_off' : ''}.png`)"
          />
        </template>
      </q-input>
      <!-- <div v-if="regForm.password" class="password-str-div">
                    <span
                      :class="{
                        'weak-pwd': pwdStrength == 'weak',
                        'normal-pwd': pwdStrength == 'normal',
                        'strong-pwd': pwdStrength == 'strong'
                      }"
                    >
                      Weak
                    </span>
                    <span
                      :class="{
                        'normal-pwd': pwdStrength == 'normal',
                        'strong-pwd': pwdStrength == 'strong'
                      }"
                    >
                      Good
                    </span>
                    <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
                  </div> -->
    </template>
  </InputField>
</template>
<script setup>
import InputField from "src/components/auth/InputField.vue";
import { useFormField } from "src/hooks/formField";
import { computed, toRefs, ref } from "vue";

const props = defineProps(["modelValue"]);
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);

const isPwd = ref(true);

const { validate, hasError, bindRef } = useFormField();

const _modelValue = computed({
  get: () => modelValue.value,
  set: (value) => emit("update:modelValue", value)
});

defineExpose({
  validate,
  hasError
});
</script>
<style scoped lang="scss"></style>
