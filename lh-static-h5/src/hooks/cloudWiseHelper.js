import { customCloudWiseRecord } from "src/boot/utils";
import { userStore } from "src/stores";
import { onActivated } from "vue";
import { useRoute } from "vue-router";

export const useCloudWiseHelper = (options) => {
  const { recordPageView = true, pageName } = options;

  const store = userStore();
  const route = useRoute();

  onActivated(() => {
    if (!recordPageView) return;
    customCloudWiseRecord(store.nickName, {
      pageName,
      path: route.path
    });
  });
};
