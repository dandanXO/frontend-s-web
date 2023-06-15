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
