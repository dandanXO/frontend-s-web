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
import {defineComponent,computed} from "vue";
import CommonHeader from "@/components/layout/CommonHeader.vue";
import CommonFooter from "@/components/layout/CommonFooter.vue";
import CommonSidebar from "@/components/layout/CommonSidebar.vue";
import { useRoute } from "vue-router";

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
      let trackingScriptUrl = "https://s4.cnzz.com/z.js?id=1281348355";

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
