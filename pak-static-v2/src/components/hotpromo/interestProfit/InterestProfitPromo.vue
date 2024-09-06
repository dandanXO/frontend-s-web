<template>
  <div>
    <q-btn
      rounded
      flat
      no-caps
      class="btn-primary btn-primary__full"
      color="white"
      @click="router.push('/interest-profit')"
    >
      {{ $t("btn.getInterestProfit") }}
    </q-btn>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
