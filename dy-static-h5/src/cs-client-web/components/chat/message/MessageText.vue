<template>
  <div v-html="content" v-if="renderAsHtml"></div>
  <div v-else>{{ content }}</div>
</template>

<script>
/* eslint-disable */
import { computed, defineComponent, ref } from "vue";
import { replaceLinkToHtml } from "src/cs-client-web/helpers/string";
import { storeToRefs } from "pinia";
import { useUserStore } from "src/cs-client-web/stores/user";

const GraphemeSplitter = require("grapheme-splitter");

const splitter = new GraphemeSplitter();

function hasScript(str) {
  const re = /(<|%3C)script[\s\S]*?(>|%3E)[\s\S]*?(<|%3C)(\/|%2F)script[\s\S]*?(>|%3E)/g;
  const results = str.match(re);

  return results && results.length > 0;
}
/*
function replaceEmoji(str) {
  let emojiSize;

  const onlyEmojis = splitter.splitGraphemes(str).length === 1;

  emojiSize = onlyEmojis ? 28 : 16;

  return str.replaceAll(
    /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu,
    (v) => {
      return `<span style="font-size: ${emojiSize}px">${v}</span>`;
    }
  );
}
 */

export default defineComponent({
  name: "MessageText",
  props: {
    message: { type: Object, required: true }
  },
  setup(props) {
    const userStore = useUserStore();
    const { userId } = storeToRefs(userStore);
    const dialogText = ref(false);

    let content = props.message.content;

    const isSender = computed(() => {
      return userId.value === props.message.senderId;
    });

    const renderAsHtml = computed(() => {
      return !isSender.value || !hasScript(props.message.content);
    });

    // 艾特
    function formatTags(str) {
      const firstTag = "<usertag>";
      const secondTag = "</usertag>";

      const userTags = [...str.matchAll(new RegExp(firstTag, "gi"))].map((a) => a.index);

      const initialContent = content;

      userTags.forEach((index) => {
        const userId = initialContent.substring(index + firstTag.length, initialContent.indexOf(secondTag, index));

        const user = {};

        content = content.replaceAll(userId, `@${user?.username || "unknown"}`);
      });

      return content;
    }

    content = replaceLinkToHtml(content);
    content = formatTags(content);
    //content = replaceEmoji(content);

    return {
      renderAsHtml,
      content,
      dialogText,
      isSender
    };
  }
});
</script>

<style lang="scss" scoped>
.dialog-text-wrap {
  display: flex;
  background: #f5f5f5 !important;
}

.dialog-text-container {
  align-self: center;
  word-break: break-word;
  font-size: large;
}
</style>
