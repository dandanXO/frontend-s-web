<template>
  <el-config-provider :locale="languageVal === 'en' ? en : vi">
    <router-view :class="{ sfpro: languageVal === 'vi', poppins: languageVal === 'en' }" />
  </el-config-provider>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { memberAccessLog, getFbPixelCode } from "@/api/index/login";
import axios from "axios";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";
import { submitMemberStats } from "@/api/index/site";
import { ElConfigProvider } from "element-plus";

import vi from "element-plus/dist/locale/vi.mjs";
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
        const params = {
          way: "web",
          sid: sidParam,
          siteCode: process.env.VUE_APP_SITE
        };

        submitMemberStats(params);
      }
    };

    const checkFBPixelInit = () => {
      var windowLocation = window.location.hostname;
      console.log(windowLocation);
      const pixelCode = sessionStorage.getItem("FB_PIXEL_CODE");
      const isNoPixel = sessionStorage.getItem("NO_FB_PIXEL_CODE");
      if (isNoPixel) {
        return;
      } else if (pixelCode) {
        console.log("Got Fb Id:" + pixelCode);
        fbq("init", pixelCode);
        fbq("track", "PageView");
      } else {
        // windowLocation = "kakavn.shop";
        getFbPixelCode(windowLocation).then((res) => {
          // console.log(res);
          if (res.code === 0) {
            const fbId = res.data.fbId;
            sessionStorage.setItem("FB_PIXEL_CODE", fbId);
            fbq("init", fbId);
            fbq("track", "PageView");
          } else {
            sessionStorage.setItem("NO_FB_PIXEL_CODE", "1");
          }
        });
      }
    };

    onMounted(() => {
      console.log("KAKA Web 22");
      checkSID();
      checkFBPixelInit();

      setTimeout(getOnlineStatApi, 2000);
      setInterval(getOnlineStatApi, 60000);
    });

    onUnmounted(() => {
      // clearTimeout(onlineStatTimeout);
      // clearInterval(onlineStatInterval);
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
