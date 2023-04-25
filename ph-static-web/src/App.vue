<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { memberAccessLog } from "@/api/index/login";

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
          const obj = {
            identifier: sidParam,
            affiliateCode: affiliateItem,
          };
          memberAccessLog(obj).then((res) => {
            if (res.code===0) {}
          });
      })();
    };
    const checkDevice = () => {
      let details = navigator.userAgent;
      let regexp = /android|iphone|kindle|ipad/i;
      let isMobileDevice = regexp.test(details);

      if (isMobileDevice) {
        window.location.href = "https://m.jolly88-ph.com";
      }
    };
    onMounted(() => {
      checkSID();
      checkDevice();
    });
  },
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
