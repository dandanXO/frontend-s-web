<template>
  <router-view />
  <!-- <PromoAdd v-if="name === 'PromoAdd' || name === 'PromoEdit'" /> -->
  <PromoList v-if="name === 'Promotion pages'" />
</template>

<script>
import { computed, defineComponent } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
// import PromoAdd from './promo-add'
import PromoList from './promo-list'

export default defineComponent({
  components: {
    // PromoAdd,
    PromoList,
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
