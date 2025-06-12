<template>
  <p @click="onClick(message.meta.items)">
    <q-btn color="primary">点击</q-btn>
  </p>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import collect from "collect.js";

export default defineComponent({
  name: "MessageOptionSelect",
  props: {
    message: { type: Object, required: true },
  },
  emits: ["select"],
  setup(props, { emit }) {
    const $q = useQuasar();

    const onClick = (items) => {
      let itemList = collect(items)
        .map((item) => {
          item.label = item.name;

          return item;
        })
        .all();

      $q.dialog({
        options: {
          type: "radio",
          model: "opt1",
          items: itemList,
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          let item = collect(items).where("value", data).first();

          emit("select", item);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    };

    return { onClick };
  },
});
</script>

<style scoped></style>
