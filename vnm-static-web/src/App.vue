<template>
  <el-config-provider :locale="languageVal === 'en' ? en : vi">
    <router-view :class="{ sfpro: languageVal === 'vi', poppins: languageVal === 'en' }" />
  </el-config-provider>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { memberAccessLog } from "@/api/index/login";
import axios from "axios";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";
import { ElConfigProvider } from "element-plus";
import { submitMemberStats } from "@/api/index/site";

import vi from "element-plus/dist/locale/vi.mjs";
import en from "element-plus/dist/locale/en.mjs";

import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";
import { uiStore } from "@/store/ui";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    ElConfigProvider
  },
  setup() {
    const router = useRouter();
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const onlineStatTimeout = ref();
    const store = userStore();
    const ui = uiStore();
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
        const params = {
          way: "web",
          sid: sidParam,
          siteCode: process.env.VUE_APP_SITE
        };

        submitMemberStats(params);
      }
    };

    const checkEdition = () => {
      // TODO: check edition here
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
      console.log("VNM0106");
      checkSID();

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
      checkEdition();
      checkServerStatus();
    });

    onUnmounted(() => {
      clearTimeout(onlineStatTimeout);
      clearInterval(onlineStatInterval);
    });
    return {
      languageVal,
      vi,
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
