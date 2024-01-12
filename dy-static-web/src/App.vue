<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { memberAccessLog } from "@/api/index/login";
import axios from "axios";

export default defineComponent({
  setup() {
    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = { value: ["timezone", "timeZoneOffset"] };
        const allComponents = { ...result.components };
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);
        console.log(sidParam);

        const obj = {
          identifier: sidParam,
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
      const fpPromise = FingerprintJS.load();

      const fp = await fpPromise;
      const result = await fp.get();
      const excludes = { value: ["timezone", "timeZoneOffset"] };
      const allComponents = { ...result.components };
      excludes.value.forEach((element) => {
        delete allComponents[element];
      });
      const sidParam = FingerprintJS.hashComponents(allComponents);
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
