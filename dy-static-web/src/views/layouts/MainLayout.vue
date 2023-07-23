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
        case "www.dy9639.com":
        case "www.dy8930.com":
        case "www.dy7698.com":
        case "www.dy7835.com":
        case "www.dy8365.com":
        case "www.dy9286.com":
        case "www.dy8539.com":
        case "www.dy8286.com":
        case "www.dy7197.com":
        case "www.dy7586.com":
        case "dy9639.com":
        case "dy8930.com":
        case "dy7698.com":
        case "dy7835.com":
        case "dy8365.com":
        case "dy9286.com":
        case "dy8539.com":
        case "dy8286.com":
        case "dy7197.com":
        case "dy7586.com":
        case "m.dy9639.com":
        case "m.dy8930.com":
        case "m.dy7698.com":
        case "m.dy7835.com":
        case "m.dy8365.com":
        case "m.dy9286.com":
        case "m.dy8539.com":
        case "m.dy8286.com":
        case "m.dy7197.com":
        case "m.dy7586.com":
        case "dy53718.cc":
        case "dy31877.cc":
        case "dy35798.cc":
        case "dy13578.cc":
        case "dy75281.cc":
        case "dy18652.cc":
        case "dy65982.cc":
        case "dy12579.cc":
        case "dy67982.cc":
        case "dy89256.cc":
        case "dy25912.cc":
        case "dy72851.cc":
        case "dy37215.cc":
        case "dy29571.cc":
        case "dy79851.cc":
        case "dy12358.cc":
        case "dy91658.cc":
        case "dy25681.cc":
        case "dy68151.cc":
        case "dy32568.cc":
        case "dy12769.cc":
        case "dy27698.cc":
        case "dy63897.cc":
        case "dy96573.cc":
        case "dy57831.cc":
        case "dy73881.cc":
        case "dy83699.cc":
        case "dy15789.cc":
        case "dy87951.cc":
        case "dy59267.cc":
        case "m.dy53718.cc":
        case "m.dy31877.cc":
        case "m.dy35798.cc":
        case "m.dy13578.cc":
        case "m.dy75281.cc":
        case "m.dy18652.cc":
        case "m.dy65982.cc":
        case "m.dy12579.cc":
        case "m.dy67982.cc":
        case "m.dy89256.cc":
        case "m.dy25912.cc":
        case "m.dy72851.cc":
        case "m.dy37215.cc":
        case "m.dy29571.cc":
        case "m.dy79851.cc":
        case "m.dy12358.cc":
        case "m.dy91658.cc":
        case "m.dy25681.cc":
        case "m.dy68151.cc":
        case "m.dy32568.cc":
        case "m.dy12769.cc":
        case "m.dy27698.cc":
        case "m.dy63897.cc":
        case "m.dy96573.cc":
        case "m.dy57831.cc":
        case "m.dy73881.cc":
        case "m.dy83699.cc":
        case "m.dy15789.cc":
        case "m.dy87951.cc":
        case "m.dy59267.cc":
        case "www.dy53718.cc":
        case "www.dy31877.cc":
        case "www.dy35798.cc":
        case "www.dy13578.cc":
        case "www.dy75281.cc":
        case "www.dy18652.cc":
        case "www.dy65982.cc":
        case "www.dy12579.cc":
        case "www.dy67982.cc":
        case "www.dy89256.cc":
        case "www.dy25912.cc":
        case "www.dy72851.cc":
        case "www.dy37215.cc":
        case "www.dy29571.cc":
        case "www.dy79851.cc":
        case "www.dy12358.cc":
        case "www.dy91658.cc":
        case "www.dy25681.cc":
        case "www.dy68151.cc":
        case "www.dy32568.cc":
        case "www.dy12769.cc":
        case "www.dy27698.cc":
        case "www.dy63897.cc":
        case "www.dy96573.cc":
        case "www.dy57831.cc":
        case "www.dy73881.cc":
        case "www.dy83699.cc":
        case "www.dy15789.cc":
        case "www.dy87951.cc":
        case "www.dy59267.cc":
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
