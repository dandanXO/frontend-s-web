import { computed, isRef } from "vue";

export const useCommaInput = (source) => {
  const sourceWithComma = computed({
    get: () => {
      if (isRef(source)) {
        if (typeof source.value === "undefined" || source.value === null) return source.value;
        return source.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        if (typeof source === "undefined" || source === null) return source;
        return source.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
    set: (val) => {
      if (isRef(source)) {
        source.value = val.replaceAll(",", "");
      } else {
        source = val.replaceAll(",", "");
      }
    }
  });

  return sourceWithComma;
};
