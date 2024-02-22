<template>
  <q-page>
    <DepositComponent />
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import DepositComponent from "components/depositComponent.vue";
export default defineComponent({
  name: "DepositView",
  components: {
    DepositComponent
  },
  setup() {}
});
</script>
