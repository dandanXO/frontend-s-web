<template>
  <router-view :class="{'roboto': languageVal === 'vi', 'poppins': languageVal === 'en' }" />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { memberAccessLog } from "@/api/index/login";
import axios from "axios";


import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
export default defineComponent({
  setup() {
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    const onlineStatTimeout = ref();
    const onlineStatInterval = ref();

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
          if (res.code === 0) {
            // do nothing
          }
        });
      })();
    };

    const getOnlineStatApi = async () => {
      const fpPromise = FingerprintJS.load();

      const fp = await fpPromise;
      const result = await fp.get();
      const excludes = { value: ["timezone", "timeZoneOffset"] };
      const allComponents = { ...result.components };
      excludes.value.forEach((element) => {
        delete allComponents[element];
      });
      const sidParam = FingerprintJS.hashComponents(allComponents);

      if (sidParam) {
        const res = await axios.get("https://memsta.eatrhaquke.com/memberStatistics/submit", {
          params: {
            way: "web",
            sid: sidParam,
            siteCode: "vnm"
          }
        });
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
    })
    return {
      languageVal
    }
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
