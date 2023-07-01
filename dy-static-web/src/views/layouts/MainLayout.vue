<template>
  <div>
    <keep-alive>
      <common-header />
    </keep-alive>
    <router-view class="router-view" v-slot="{ Component }">
      <!-- <transition name="component-fade" mode="out-in"> -->
      <component :is="Component" />
      <!-- </transition> -->
    </router-view>
    <common-footer />
    <common-sidebar />
  </div>
</template>

<script lang="js">
import { defineComponent } from "vue";
import CommonHeader from "@/components/layout/CommonHeader.vue";
import CommonFooter from "@/components/layout/CommonFooter.vue";
import CommonSidebar from "@/components/layout/CommonSidebar.vue";
export default defineComponent({
  name: "LayoutView",
  components: {
    CommonHeader,
    CommonFooter,
    CommonSidebar
  },
  mounted() {
    this.loadTrackingScript();
  },
  methods: {
    loadTrackingScript() {
      const currentDomain = window.location.hostname;
      const currentPort = window.location.port;
      const currentDomainWithPort = `${currentDomain}:${currentPort}`;
      console.log("Domain:", currentDomainWithPort);

      // Determine the tracking script URL based on the current domain
      let trackingScriptUrl = "";
      switch (currentDomainWithPort) {
        case "www.dy86353.com":
        case "www.dy80252.com":
          trackingScriptUrl =
            "https://s9.cnzz.com/z_stat.php?id=1281279658&web_id=1281279658";
          break;
        case "www.dy93113.com":
        case "www.dy96108.com":
          trackingScriptUrl =
            "https://s9.cnzz.com/z_stat.php?id=1280864521&web_id=1280864521";
          break;
        case "www.dy18178.com:8765":
        case "www.dy50122.com:8765":
        case "www.dy52506.com:8765":
        case "www.dy53976.com:8765":
        case "www.dy70679.com:8765":
        case "www.dy73953.com:8765":
          trackingScriptUrl = "https://s4.cnzz.com/z_stat.php?id=1281277587&web_id=1281277587";
          break;
        case "www.dy52373.com:8765":
        case "www.dy67892.com:8765":
        case "www.dy93828.com:8765":
        case "www.dy37378.com:8765":
        case "www.dy35567.com:8765":
        case "www.dy25952.com:8765":
        case "www.dy87265.com:8765":
        case "www.dy29892.com:8765":
        case "www.dy38885.com:8765":
        case "www.dy78299.com:8765":
          trackingScriptUrl = "https://s4.cnzz.com/z_stat.php?id=1281277587&web_id=1281277587";
          break;
        default:
          return; // Don't load the tracking script for other domains
      }

      const script = document.createElement("script");
      script.src = trackingScriptUrl;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.router-view {
  min-height: calc(100vh - 310px);
}
</style>
