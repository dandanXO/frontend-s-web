<template>
  <q-card
    class="my-card cursor-pointer q-mb-md shadow-1"
    no-border
    @click.prevent="onClick(item)"
  >
    <q-card-section class="q-gutter-y-xs">
      <div
        class="text-subtitle2 text-blue-grey text-bold q-mb-md"
        v-html="item.name"
      ></div>

      <div
        class="row q-gutter-x-xs"
        v-for="(attribute, attrIndex) in item.items.slice(0, 3)"
        :key="`options-btn-attr-${attrIndex}`"
      >
        <div class="col col-md-4 text-blue-grey">{{ attribute.k }}</div>
        <div class="col text-grey text-right">{{ attribute.v }}</div>
      </div>
      <div class="text-center text-grey" v-if="showNum">
        <span class="card-num">{{ index }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "OptionButton",
  props: {
    index: {
      type: Number,
      default: () => 0,
    },
    item: { type: Object, required: true },
    showNum: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ["on-click"],
  setup(props, { emit }) {
    const onClick = (item) => {
      emit("on-click", item);
    };

    return {
      onClick,
    };
  },
});
</script>

<style>
.text-subtitle2 p {
  margin-bottom: 0;
}
</style>
<style lang="scss" scoped>
.my-card {
  width: 100%;
  word-break: normal;
  flex: 1 1 0%;
  align-self: stretch;

  .card-num {
    border-radius: 25px;
    background: papayawhip;
    width: 25px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
    font-weight: bold;
  }
}
</style>
