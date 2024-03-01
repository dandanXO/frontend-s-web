<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { memberAccessLog } from "@/api/index/login";
import axios from "axios";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

export default defineComponent({
  setup() {
    const store = userStore();

    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");

      const fpPromise = FingerprintJS.load({
        apiKey: "b1A4V9htZ4ySmb8ycMQb",
        region: "ap"
      });

      fpPromise
        .then((fp) => fp.get())
        .then((result) => {
          console.log("Ssads");
          console.log(result?.visitorId);
        });

      (async () => {
        const visitorId = "";
        // const visitorId = sessionStorage.getItem("VISITOR_ID") ?? (await getVisitorId());
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
        const res = await axios.get("https://memsta.eatrhaquke.com/memberStatistics/submit", {
          params: {
            way: way,
            sid: sidParam,
            siteCode: "dy2"
          }
        });
      }
    };

    onMounted(() => {
      checkSID();

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
