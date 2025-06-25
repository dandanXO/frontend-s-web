<template>
  <div class="message-notice" v-if="isIntro">
    <div class="message-notice-container rounded-borders q-pa-sm">
      <div v-html="message.content"></div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "MessageNotice",
  props: {
    message: { type: Object, required: true }
  },
  setup(props) {
    const isIntro = computed(() => {
      if (props.message && props.message.content) {
        return true;
      }
      return false;
    });

    return {
      isIntro
    };
  }
});
</script>

<style lang="scss" scoped>
.message {
  &-notice {
    font-size: small;

    &-header {
      border-bottom: grey solid 1px;
    }

    &-container {
      min-width: 4em;

      img {
        object-fit: contain;
        max-height: 100%;
        max-width: 100%;
        display: block;
      }
    }
  }
}
</style>
