<template>
  <router-view />
  <notification-wrapper />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { memberAccessLog } from "@/api/index/login";
import axios from "axios";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";
import { uiStore } from "@/store/ui";
import { loadAffiliateByDomain } from "@/api/index/promo";
import { submitMemberStats } from "@/api/index/site";

import NotificationWrapper from "@/components/notification/NotificationWrapper.vue";

export default defineComponent({
  components: {
    NotificationWrapper
  },
  setup() {
    const onlineStatTimeout = ref();
    const onlineStatInterval = ref();
    const store = userStore();
    const UI = uiStore();

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
      const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = sidParam;

      if (sidParam) {
        const params = {
          way: "web",
          sid: sidParam,
          siteCode: process.env.VUE_APP_SITE
        };

        submitMemberStats(params);
      }
    };

    const getAffiliateByDomain = async () => {
      var host = window.location.host;
      // host = "";
      loadAffiliateByDomain(host).then((res) => {
        console.log(res);
        if (res.code === 0 && res.data !== "") {
          // alert(res.data)
          var agentCode = res.data;
          sessionStorage.setItem("AFFILIATE_CODE", agentCode);
        }
      });
    };

    onMounted(() => {
      console.log("TEStigger");
      checkSID();

      getAffiliateByDomain();

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);

      window.addEventListener("resize", function handleResize(e) {
        // console.log("RESIZE");
        UI.innerWidth = window.innerWidth;
      });
    });

    onUnmounted(() => {
      clearTimeout(onlineStatTimeout);
      clearInterval(onlineStatInterval);
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
</style>
