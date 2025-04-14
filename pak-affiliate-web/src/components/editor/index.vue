<template>
  <div ref="editor" />
  <!-- <div :innerHTML="content.html" /> -->
  <!-- {{ value }} -->
</template>

<script>
import { onMounted, onBeforeUnmount, ref, reactive, defineComponent, watchEffect } from 'vue';
import WangEditor from 'wangeditor';
import i18next from 'i18next';

export default defineComponent({
  name: 'Editor',
  emits: ['input'],
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit }) {
    const editor = ref();
    const content = reactive({
      html: '',
      text: '',
      json: '',
    });

    let instance;

    onMounted(() => {
      instance = new WangEditor(editor.value);
      instance.config.lang = "en";
      instance.i18next = i18next;
      instance.txt.eventHooks.changeEvents.push(() => {
        content.html = instance.txt.html();
        emit('input', content.html)
      })
      instance.create();

      watchEffect(() => {
        if (props.value == null) {
          instance.txt.clear();
        }
        if (props.value !== null && instance.txt.html() === "") {
          instance.txt.html(props.value);
        } else if (props.value !== instance.txt.html()) {
          instance.txt.html(props.value);
        }
      });
    });

    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });

    return {
      editor,
      content,
    };
  },
})
</script>
