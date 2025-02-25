import { customCloudWiseRecord } from "src/boot/utils";
import { onActivated } from "vue";
import { useRoute } from "vue-router";

export const useCloudWiseHelper = (options) => {
  const { recordPageView = true, pageName } = options;

  const route = useRoute();

  onActivated(() => {
    if (!recordPageView) return;
    customCloudWiseRecord(pageName, route.path);
  });
};
