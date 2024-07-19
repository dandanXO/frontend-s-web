<template>
  <el-config-provider :locale="languageVal === 'en' ? en : kr">
    <router-view :class="{ sfpro: languageVal === 'kr', poppins: languageVal === 'en' }" />
  </el-config-provider>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { memberAccessLog } from "@/api/index/login";
import axios from "axios";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";
import { ElConfigProvider } from "element-plus";

import kr from "element-plus/dist/locale/ko.mjs";
import en from "element-plus/dist/locale/en.mjs";

import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";
export default defineComponent({
  components: {
    ElConfigProvider
  },
  setup() {
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const onlineStatTimeout = ref();
    const store = userStore();
    const onlineStatInterval = ref();

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
        const res = await axios.get("https://memsta.thilhe946li.com/memberStatistics/submit", {
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
    });
    return {
      languageVal,
      kr,
      en
    };
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
