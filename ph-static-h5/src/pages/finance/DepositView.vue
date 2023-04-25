<template>
  <div>
    <div class="page-header">
      <!-- <div class="page">วิธีชำระเงิน</div> -->
    </div>
    <DepositComponent />
  </div>
</template>
<script>
import { defineComponent } from "vue";
import DepositComponent from "components/depositComponent.vue";
export default defineComponent({
  components: {
    DepositComponent
  },
  setup() {}
});
</script>
