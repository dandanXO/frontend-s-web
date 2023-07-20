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
      // const currentPort = window.location.port;
      // const currentDomainWithPort = `${currentDomain}:${currentPort}`;

      // Determine the tracking script URL based on the current domain
      let trackingScriptUrl = "";
      switch (currentDomain) {
        case "m.dy86353.com":
        case "m.dy80252.com":
        case "www.dy86353.com":
        case "www.dy80252.com":
        case "dy86353.com":
        case "dy80252.com":
          trackingScriptUrl =
              "https://s9.cnzz.com/z_stat.php?id=1281279658&web_id=1281279658";
          break;
        case "m.dy93113.com":
        case "m.dy96108.com":
        case "www.dy93113.com":
        case "www.dy96108.com":
        case "dy93113.com":
        case "dy96108.com":
          trackingScriptUrl =
            "https://s9.cnzz.com/z_stat.php?id=1280864521&web_id=1280864521";
          break;
        case "m.dy18178.com":
        case "m.dy50122.com":
        case "m.dy52506.com":
        case "m.dy53976.com":
        case "m.dy70679.com":
        case "m.dy73953.com":
        case "www.dy18178.com":
        case "www.dy50122.com":
        case "www.dy52506.com":
        case "www.dy53976.com":
        case "www.dy70679.com":
        case "www.dy73953.com":
        case "dy18178.com":
        case "dy50122.com":
        case "dy52506.com":
        case "dy53976.com":
        case "dy70679.com":
        case "dy73953.com":
          trackingScriptUrl = "https://s4.cnzz.com/z_stat.php?id=1281277587&web_id=1281277587";
          break;
        case "m.dy52373.com":
        case "m.dy67892.com":
        case "m.dy93828.com":
        case "m.dy37378.com":
        case "m.dy35567.com":
        case "m.dy25952.com":
        case "m.dy87265.com":
        case "m.dy29892.com":
        case "m.dy38885.com":
        case "m.dy78299.com":
        case "www.dy52373.com":
        case "www.dy67892.com":
        case "www.dy93828.com":
        case "www.dy37378.com":
        case "www.dy35567.com":
        case "www.dy25952.com":
        case "www.dy87265.com":
        case "www.dy29892.com":
        case "www.dy38885.com":
        case "www.dy78299.com":
        case "dy52373.com":
        case "dy67892.com":
        case "dy93828.com":
        case "dy37378.com":
        case "dy35567.com":
        case "dy25952.com":
        case "dy87265.com":
        case "dy29892.com":
        case "dy38885.com":
        case "dy78299.com":
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
