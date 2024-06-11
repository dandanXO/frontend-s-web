import { computed, onUnmounted, ref } from "vue";

const DEFAULT_OPTIONS = {
  type: "file",
  style: "display: none;",
  resetAfterChange: true
};

export const useHandleUpload = (onChange, options) => {
  const inputRef = ref();

  const mergedOptions = computed(() => ({
    ...DEFAULT_OPTIONS,
    ...options
  }));

  const handleUpload = () => {
    if (!inputRef.value) createInputElement();
    inputRef.value.click();
  };

  const createInputElement = () => {
    inputRef.value = document.createElement("input");
    const { resetAfterChange, ...restInputOptions } = mergedOptions.value;
    for (const [key, value] of Object.entries(restInputOptions)) {
      inputRef.value.setAttribute(key, value);
    }
    inputRef.value.addEventListener("change", (event) => {
      const files = event.target.files;
      if (!files) return;

      onChange(files);
      if (resetAfterChange) inputRef.value.value = "";
    });
  };

  const manualEmit = (files) => onChange(files);

  onUnmounted(() => {
    if (!inputRef.value) return;
    inputRef.value.remove();
    inputRef.value = null;
  });

  return {
    handleUpload,
    manualEmit
  };
};
