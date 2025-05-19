<template>
  <div></div>
</template>

<script>
import { defineComponent, onBeforeUnmount } from "vue";
import { Howl } from "howler";
import emitter from "src/cs-client-web/helpers/event-bus";

export default defineComponent({
  name: "AudioPlayer",
  props: {
    audioId: {
      type: [String, Number]
    },
    file: { type: Object, required: true }
  },
  emits: ["close"],
  setup(props, { emit }) {
    let sound = null;

    // 停止语音
    if (sound) {
      sound.stop();
      sound = null;
    }
    // console.log(props.file.localUrl || props.file.url);
    sound = new Howl({
      src: [props.file.localUrl || props.file.url],
      format: ["m4a", "webm", "mp3"]
    });

    sound.on("play", () => {
      emitter.emit("AudioPlayerOnPlay", {
        id: props.audioId
      });
    });

    sound.on("stop", () => {
      emitter.emit("AudioPlayerOnStop", {
        id: props.audioId
      });

      emit("close");
    });

    sound.on("end", () => {
      emitter.emit("AudioPlayerOnStop", {
        id: props.audioId
      });
      emit("close");
    });

    sound.play();

    onBeforeUnmount(() => {
      // 停止
      if (sound) {
        sound.stop();
        sound = null;
      }
    });
  }
});
</script>

<style scoped></style>
