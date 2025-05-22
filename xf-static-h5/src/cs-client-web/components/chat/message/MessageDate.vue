<template>
  <div class="message">
    <div class="message-date-label-wrap">
      <div class="message-date-label rounded-borders">
        {{ message.date }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageDate",
  props: {
    message: { type: Object, required: true },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.message-label {
  font-size: small;
}

.message-date-label-wrap {
  margin-top: 16px;
  text-align: center;

  .message-date-label {
    display: inline-block;
    padding: 8px 8px;
    border-radius: 4px;
    background: #f4f3f3 !important;
    font-size: smaller;
    line-height: 1;
  }
}
</style>
