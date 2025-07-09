<template>
  <div>
    <message-text :message="message" />
    <!--    <br/>-->
    <div v-if="message.meta.type === 'button'" @on-select="onSelect">
      <message-option-button :message="message" @select="onSelect" />
    </div>

    <div v-if="message.meta.type === 'list'" @on-select="onSelect">
      <message-option-list :message="message" @select="onSelect" />
    </div>

    <div v-if="message.meta.type === 'SELECT'" @on-select="onSelect">
      <message-option-select :message="message" @select="onSelect" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { computed, defineComponent } from "vue";
import MessageOptionSelect from "src/cs-client-web/components/chat/message/options/MessageOptionSelect";
import MessageOptionList from "src/cs-client-web/components/chat/message/options/MessageOptionList";
import MessageOptionButton from "src/cs-client-web/components/chat/message/options/MessageOptionButton";
import emitter from "src/cs-client-web/helpers/event-bus";
import clone from "lodash/clone";
import normalizeUrl from "normalize-url";
import MessageText from "src/cs-client-web/components/chat/message/MessageText";
import sleep from "src/cs-client-web/utils/sleep";

export default defineComponent({
  name: "MessageOptions",
  components: {
    MessageText,
    MessageOptionButton,
    MessageOptionList,
    MessageOptionSelect
  },
  props: {
    message: { type: Object, required: true },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const clickable = computed(() => {
      return props.clickable || props.message.type === "options";
    });

    const onSelect = async (item) => {
      if (!clickable.value) {
        return;
      }

      if (item.url) {
        window.open(normalizeUrl(item.url), "_blank");
        return;
      }

      let meta = clone(props.message.meta);

      meta.items = [item];

      emitter.emit("SendMessage", {
        type: "option_reply",
        content: item.name,
        meta: meta
      });

      // await sleep(550);

      emitter.emit("SendMessage", {
        type: "option_selected",
        content: props.message.content,
        meta: meta
      });
    };

    return { onSelect };
  }
});
</script>

<style scoped></style>
