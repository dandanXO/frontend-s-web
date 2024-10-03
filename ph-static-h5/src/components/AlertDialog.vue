<template>
  <q-dialog v-model="modal" persistent>
    <q-card class="alert-dialog">
      <q-card-section class="row items-center">
        <div class="q-ml-sm" v-html="message" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="btnText" class="common-btn text-white" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["open", "message", "btnText"]);

const emits = defineEmits(["update:open"]);

const modal = computed({
  get: () => props.open,
  set: (newValue) => emits("update:open", newValue),
});
</script>

<style scoped lang="scss">
.alert-dialog {
  font-size: 1rem;
  padding: 1em;
}
</style>
