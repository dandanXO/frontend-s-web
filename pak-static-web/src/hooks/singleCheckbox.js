import { ref } from "vue";

export const useSingleCheckbox = (initialValue, callback) => {
  const selectedValue = ref([initialValue]);

  const handleCheckedChange = (value) => {
    if (value.length <= 1) return;
    selectedValue.value = value.slice(-1);
    callback(selectedValue.value[0]);
  };

  return {
    selectedValue,
    handleCheckedChange
  };
};
