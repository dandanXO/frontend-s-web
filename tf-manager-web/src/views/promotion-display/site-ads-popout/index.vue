<template>
  <SiteAdsPopoutAddEdit v-if="name === 'Add Ads Popout' || name === 'Edit Ads Popout'" />
  <SiteAdsPopoutList v-if="name === 'Ads Popout'" />
</template>

<script>
import { computed, defineComponent } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import SiteAdsPopoutAddEdit from './site-ads-popout-add-edit'
import SiteAdsPopoutList from './site-ads-popout-list'

export default defineComponent({
  components: {
    SiteAdsPopoutAddEdit,
    SiteAdsPopoutList,
  },
  setup() {
    const router = useRouter()
    const name = computed(() => {
      return router.currentRoute.value.name;
    })
    const {
      params: { id },
    } = router.currentRoute.value

    return {
      id,
      name
    }
  },
})
</script>
