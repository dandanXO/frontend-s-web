<template>
  <div>
    <keep-alive>
      <common-header />
    </keep-alive>
    <router-view v-slot="{ Component }" class="router-view">
      <transition name="component-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- <AssistancePopup /> -->
    
    <common-footer v-if="isFooter" />
  </div>
</template>

<script lang="js">
import {computed, defineComponent} from "vue";
import CommonHeader from "@/components/layout/CommonHeader.vue";
import CommonFooter from "@/components/layout/CommonFooter.vue";
import AssistancePopup from "@/components/modal/AssistancePopup.vue";
import {useRoute} from "vue-router";
export default defineComponent({
  name: "LayoutView",
  components: {
    CommonHeader,
    CommonFooter,
    AssistancePopup
  },
  setup() {
    const route= useRoute();

    const isFooter = computed(() => {
      if(route.path === '/e-sport' || route.path === '/sport'){
        return false;
      }
      return true;
    })


    return {
      isFooter
    };
  },
});
</script>

<style scoped></style>
