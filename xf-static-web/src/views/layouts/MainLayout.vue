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
  </div>
</template>

<script lang="js">
import { defineComponent } from "vue";
import CommonHeader from "@/components/layout/CommonHeader.vue";
import CommonFooter from "@/components/layout/CommonFooter.vue";
export default defineComponent({
  name: "LayoutView",
  components: {
    CommonHeader,
    CommonFooter,
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
