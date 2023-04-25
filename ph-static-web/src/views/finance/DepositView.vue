<template>
  <div>
    <div class="account-title-container">
      <span class="account-title">Payment Method</span>
    </div>
    <div class="account-content">
      <DepositComponent />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DepositComponent from "@/components/depositComponent.vue";
export default defineComponent({
  components: {
    DepositComponent,
  },
  setup() {},
});
</script>
