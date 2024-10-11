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
    <common-sidebar v-if="!shouldHideHeaderAndFooter" />
  </div>
</template>

<script lang="js">
import { defineComponent, computed, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";

const CommonFooter = defineAsyncComponent(() =>
  import('@/components/layout/CommonFooter.vue')
);
const CommonHeader = defineAsyncComponent(() =>
  import('@/components/layout/CommonHeader.vue')
);
const CommonSidebar = defineAsyncComponent(() =>
  import('@/components/layout/CommonSidebar.vue')
);

export default defineComponent({
  name: "LayoutView",
  components: {
    CommonHeader,
    CommonFooter,
    CommonSidebar
  },
  mounted() {
    //TODO:: Change LH One.
    this.loadTrackingScript();
  },
  methods: {
    loadTrackingScript() {
      const currentDomain = window.location.hostname;

      // Determine the tracking script URL based on the current domain
      let trackingScriptUrl = "";
      switch (currentDomain) {
        case "m.tslotf88.com":
        case "www.tslotf88.com":
        case "tslotf88.com":
          trackingScriptUrl = "https://v1.cnzz.com/z.js?id=1281386211";
          break;
        default:
          trackingScriptUrl = "https://s4.cnzz.com/z.js?id=1281348355";
          break;
      }

      // let trackingScriptUrl = "https://s4.cnzz.com/z.js?id=1281348355";

      const script = document.createElement("script");
      script.src = trackingScriptUrl;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  },
  setup() {
    const route = useRoute();
    return {
      shouldHideHeaderAndFooter: computed(() => {
        return route.path === "/maintenance";
      }),
    };
  },
});
</script>
