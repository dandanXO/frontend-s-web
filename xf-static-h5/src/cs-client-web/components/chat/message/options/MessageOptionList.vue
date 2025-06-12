<template>
  <div
    v-if="message.type === 'options'"
    class="q-my-md"
    style="display: flex; gap: 10px; flex-wrap: wrap; max-width: 650px"
  >
    <span style="width: 100%" v-for="(item, index) in message.meta.items" :key="`options-${message.id}-${index}`">
      <q-btn :disable="isChatEnded" @click.prevent="onClick(item)" class="select-btn text-bold cursor-pointer">
        <div v-html="item?.name ?? ''"></div>
      </q-btn>
    </span>
  </div>
  <div v-else>
    {{ message.meta.items[0].name }}
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from "src/cs-client-web/stores/chat";

export default defineComponent({
  name: "MessageOptionList",
  props: {
    message: { type: Object, required: true }
  },
  emits: ["select"],
  setup(props, { emit }) {
    const chatStore = useChatStore();
    const { isChatEnded } = storeToRefs(chatStore);

    const onClick = (item) => {
      emit("select", item);
    };

    return {
      onClick,
      isChatEnded
    };
  }
});
</script>

<style lang="scss" scoped>
.select-btn {
  width: 100%;
  background: #fff;
  border-radius: 20px;
}

.q-btn:before {
  box-shadow: none;
  border: 1px solid #000;
}
</style>
