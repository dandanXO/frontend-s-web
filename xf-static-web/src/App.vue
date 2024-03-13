<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { memberAccessLog } from "@/api/index/login";
import { userStore } from "@/store";
import { getVisitorId } from "@/utils/utils";

export default defineComponent({
  setup() {
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
    onMounted(() => {
      checkSID();
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
