<template>
  <div>
    <img v-if="$q.dark.isActive" src="../../../assets/images/promo/hotpromo/feedbackaward/step-feedback-steps-dark.png" />
    <img v-else src="../../../assets/images/promo/hotpromo/feedbackaward/step-feedback-steps.png" />
  </div>
</template>
<script setup>
import { useQuasar } from "quasar";

const $q = useQuasar();
</script>

