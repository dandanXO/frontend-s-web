<template>
  <div>
    <keep-alive>
      <common-header v-if="!shouldHideHeaderAndFooter" />
    </keep-alive>
    <router-view v-slot="{ Component }">
      <!-- <transition name="component-fade" mode="out-in"> -->
      <component :is="Component" />
      <!-- </transition> -->
    </router-view>
    <keep-alive>
      <common-footer v-if="!shouldHideHeaderAndFooter" />
    </keep-alive>
    <common-sidebar v-if="!shouldHideHeaderAndFooter" :hasToken="hasToken" />
  </div>
</template>

<script lang="js">
import { defineComponent, computed } from "vue";
import CommonHeader from "@/components/layout/header/index.vue";
import CommonFooter from "@/components/layout/CommonFooter.vue";
import CommonSidebar from "@/components/layout/CommonSidebar.vue";
import { useRoute } from "vue-router";
import { userStore } from "@/store";

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
      // const currentDomain = window.location.hostname;
      // const currentPort = window.location.port;
      // const currentDomainWithPort = `${currentDomain}:${currentPort}`;
      // Determine the tracking script URL based on the current domain
      // let trackingScriptUrl = "";
      // switch (currentDomain) {
      //   case "m.dy86353.com":
      //   case "m.dy80252.com":
      //   case "www.dy86353.com":
      //   case "www.dy80252.com":
      //   case "dy86353.com":
      //   case "dy80252.com":
      //     trackingScriptUrl =
      //         "https://s9.cnzz.com/z_stat.php?id=1281279658&web_id=1281279658";
      //     break;
      //   case "dy73953.com":
      //     trackingScriptUrl = "https://s4.cnzz.com/z_stat.php?id=1281277587&web_id=1281277587";
      //     break;
      //   default:
      //     return; // Don't load the tracking script for other domains
      // }
      // const script = document.createElement("script");
      // script.src = trackingScriptUrl;
      // script.type = "text/javascript";
      // document.body.appendChild(script);
    }
  },
  setup() {
    const route = useRoute();
    const store = userStore();
    return {
      shouldHideHeaderAndFooter: computed(() => {
        return route.path === "/maintenance";
      }),
      hasToken: store.hasToken()
    };
  }
});
</script>
