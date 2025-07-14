import { computed, ref } from "vue";

export const useFormField = () => {
  const refs = ref([]);

  const bindRef = (el) => {
    if (el && !refs.value.includes(el)) {
      refs.value.push(el);
    }
  };

  const hasError = computed(() => refs.value.some((_ref) => _ref.hasError));

  const validate = () => refs.value.forEach((_ref) => _ref.validate());

  return {
    validate,
    hasError,
    bindRef
  };
};
