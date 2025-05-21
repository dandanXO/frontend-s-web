<template>
  <div @click="onClick">
    <q-icon name="wifi" :class="[!sent ? 'rotate-90' : 'rotate-270', isPlaying ? 'audio-playing' : '']" />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import emitter from "src/cs-client-web/helpers/event-bus";
import { useChatStore } from "src/cs-client-web/stores/chat";
import { storeToRefs } from "pinia";
import { sleep } from "src/cs-client-web/helpers/utils";

export default defineComponent({
  name: "MessageAudio",
  props: {
    message: { type: Object, required: true },
    sent: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const chatStore = useChatStore();
    const { messageClickable } = storeToRefs(chatStore);
    const isPlaying = ref(false);

    let action = "";
    let count = 0;

    const onClick = async () => {
      await sleep(0);

      if (!messageClickable.value) {
        return;
      }

      action = count % 2 === 0 ? "play" : "stop";

      emitter.emit("AudioPlayer", {
        id: props.message.id,
        file: props.message.files[0],
        action: action
      });

      count++;
    };

    emitter.on("AudioPlayerOnPlay", (e) => {
      if (props.message.id === e.id) {
        isPlaying.value = true;
      }
    });

    emitter.on("AudioPlayerOnStop", (e) => {
      if (props.message.id === e.id) {
        count = 0;
        isPlaying.value = false;
      }
    });

    return { isPlaying, onClick };
  }
});
</script>

<style scoped>
@keyframes AudioFadeIn {
  from {
    opacity: 0.6;
  }
}

.audio-playing {
  animation: AudioFadeIn 1s infinite alternate;
}
</style>
