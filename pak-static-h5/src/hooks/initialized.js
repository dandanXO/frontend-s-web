import { useUI } from "src/stores/ui";
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";

export const onInitialized = (callback) => {
  const ui = useUI();

  onMounted(async () => {
    if (ui.firstScreenLoading) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          ui.firstScreenLoading = false;
          resolve();
        }, 500);
      });
    }
    if (callback) callback();
    ui.isPageInitialized = true;
  });
};

export const afterInitialized = (callback) => {
  const ui = useUI();
  const route = useRoute();

  watch(
    () => ui.isPageInitialized,
    () => {
      if (ui.isPageInitialized) callback();
    }
  );

  watch(
    () => route.path,
    () => {
      ui.isPageInitialized = false;
    }
  );
};
