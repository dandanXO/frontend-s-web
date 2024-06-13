import { userStore } from "@/store";
import { storeToRefs } from "pinia";
import { getVisitorId } from "@/utils/utils";
import axios from "axios";
import { onMounted } from "vue";

export const useMemberStatistics = async (domain, siteCode) => {
  const apiUrl = domain + "/memberStatistics/submit";
  const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());

  const store = userStore();
  const { visitorId } = storeToRefs(store);

  const getOnlineStatApi = async () => {
    visitorId.value = sidParam;

    if (!sidParam) return;
    await axios.get(apiUrl, {
      params: {
        way: "web",
        sd: visitorId.value,
        siteCode: siteCode
      }
    });
  };

  onMounted(() => {
    setTimeout(getOnlineStatApi, 2000);
    setInterval(getOnlineStatApi, 60000);
  });
};
