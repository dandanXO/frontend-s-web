<template>
  <SiteAdsPopoutAddEdit v-show="!listOnly" :is-edit="isEditPage" />
  <SiteAdsPopoutList v-show="listOnly" />
</template>

<script>
import { defineComponent, ref, watch } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import SiteAdsPopoutAddEdit from './site-ads-popout-add-edit'
import { onMounted } from 'vue'
import SiteAdsPopoutList from './site-ads-popout-list'

export default defineComponent({
  components: {
    SiteAdsPopoutAddEdit,
    SiteAdsPopoutList,
  },
  setup() {
    const route = useRoute()
    const isEditPage = ref(false);
    const listOnly = ref(true);
    onMounted(() => {
      if (route.name === 'Add Ads Popout') {
        isEditPage.value = false
        listOnly.value = false
      }
      if (route.name === 'Edit Ads Popout') {
        isEditPage.value = true
        listOnly.value = false
      }
      if (route.name === 'Ads Popout') {
        isEditPage.value = false
        listOnly.value = true
      }
    });
    watch(() => route.name, () => {
      if (route.name === 'Add Ads Popout') {
        isEditPage.value = false
        listOnly.value = false
      }
      if (route.name === 'Edit Ads Popout') {
        isEditPage.value = true
        listOnly.value = false
      }
      if (route.name === 'Ads Popout') {
        isEditPage.value = false
        listOnly.value = true
      }
    });
    // const {
    //   params: { id },
    // } = route

    return {
      // id,
      isEditPage,
      listOnly
    }
  },
})
</script>
