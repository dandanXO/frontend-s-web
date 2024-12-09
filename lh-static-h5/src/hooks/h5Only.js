import { storeToRefs } from "pinia";
import { useUI } from "src/stores/ui";
import { ref, watch } from "vue";

export const useH5Only = () => {
  const ui = useUI();
  const { currentRuntime } = storeToRefs(ui);

  const pendingQueue = ref([]);

  const h5Only = (callback) => {
    switch (currentRuntime.value) {
      case "UNCHECKED":
        pendingQueue.value.push(callback);
        break;
      case "H5":
        callback();
        break;
      case "IN_APP_BROWSER":
        break;
    }
  };

  watch(currentRuntime, (val) => {
    switch (currentRuntime.value) {
      case "IN_APP_BROWSER":
        pendingQueue.value = [];
        break;
      case "H5":
        while (pendingQueue.value.length) {
          const callback = pendingQueue.value.shift();
          callback();
        }
        break;
      case "UNCHECKED":
        break;
    }
  });

  return {
    h5Only
  };
};
