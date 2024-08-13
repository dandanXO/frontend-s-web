<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { memberAccessLog } from "@/api/index/login";
import axios from "axios";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";
import { submitMemberStats } from "@/api/index/site";
import { useRouter } from "vue-router";
import { uiStore } from "./store/ui";

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = userStore();
    const ui = uiStore()

    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");

      (async () => {
        const visitorId = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
        store.visitorId = visitorId;

        console.log("SID");
        console.log(visitorId);

        const obj = {
          identifier: store.visitorId,
          affiliateCode: affiliateItem
        };
        memberAccessLog(obj).then((res) => {
          if (res.code === 0) {
            // do nothing
          }
        });
      })();
    };

    const getOnlineStatApi = async () => {
      // console.log("Ok Online.");
      const sidParam = store.visitorId;
      const way = "web";

      if (sidParam) {
        const params = {
          way: way,
          sid: sidParam,
          siteCode: process.env.VUE_APP_SITE
        };

        submitMemberStats(params);
      }
    };

    const checkServerStatus = () => {
      axios.get(`https://sumbtf.tebarncale.com/server/status/${process.env.VUE_APP_SITEID}`).then((response) => {
        if (response.data.code === 0) {
          console.log("responseStatus:", response.data.data.status);
          if (response.data.data.status === "CLOSED") {
            router.replace(`/maintenance`);
            ui.maintenanceStartTime = response.data.data.maintenanceStartTime;
            ui.maintenanceEndTime = response.data.data.maintenanceEndTime;
          }
        }
      });
    };

    onMounted(() => {
      checkSID();
      checkServerStatus()

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });
  }
});
</script>
<style lang="scss">
#app {
  font-family: Jura, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
/*test*/
</style>
