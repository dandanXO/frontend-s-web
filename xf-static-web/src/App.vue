<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { memberAccessLog } from "@/api/index/login";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";
import { submitMemberStats } from "@/api/index/site";

export default defineComponent({
  setup() {
    const onlineStatTimeout = ref();
    const onlineStatInterval = ref();
    const store = userStore();

    const checkSID = () => {
      const store = userStore();
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
          }
        });
      })();
    };

    const getOnlineStatApi = async () => {
      const sidParam = localStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
      store.visitorId = sidParam;
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

    onMounted(() => {
      checkSID();

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
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
