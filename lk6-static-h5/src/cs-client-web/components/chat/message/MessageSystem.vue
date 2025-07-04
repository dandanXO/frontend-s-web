<template>
  <div class="message-system">
    <div class="message-system-container q-pa-sm">
      {{ message.time }} / {{ message.content }}
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "MessageSystem",
  props: {
    message: {type: Object, required: true},
  },
  setup() {
    return {}
  },
});
</script>

<style scoped>
.message-system{
  text-align: center;
}

.message-system-container{
  display: inline-block;
  background: #f6f6f6 !important;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  color:#8d8d8d;
}
</style>
