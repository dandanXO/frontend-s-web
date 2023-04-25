<template>
  <router-view />
  <PaymentList v-if="name === 'Payment'" />
</template>

<script>
import { computed, defineComponent } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
// import PaymentAdd from './system-payment-action'
import PaymentList from './system-payment-list'

export default defineComponent({
  components: {
    // PaymentAdd,
    PaymentList,
  },
  setup() {
    const router = useRouter()
    const name = computed(() => {
      return router.currentRoute.value.name
    })
    const {
      params: { id },
    } = router.currentRoute.value

    return {
      id,
      name,
    }
  },
})
</script>
