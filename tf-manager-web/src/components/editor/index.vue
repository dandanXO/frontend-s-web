<template>
  <div ref="editor" />
  <!-- <div :innerHTML="content.html" /> -->
  <!-- {{ value }} -->
</template>

<script>
/* eslint-disable */
import { onMounted, onBeforeUnmount, ref, reactive, defineComponent, watchEffect } from 'vue';
import E from 'wangeditor'
import WangEditor from 'wangeditor';
import i18next from 'i18next';
import { useI18n } from "vue-i18n";
import beautify from 'js-beautify';

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
    const { t } = useI18n();
    const editor = ref();
    const content = reactive({
      html: '',
      text: '',
      json: '',
    });
    const { BtnMenu } = WangEditor;

    let instance;
    const languageLocale = localStorage.getItem("languageLocale") !== 'zh' ? "en" : "zh-CN";

    class HtmlMenu extends BtnMenu {
      constructor(editor) {
        // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
        const $elem = E.$(
          `<div class="w-e-menu" id="my-html-custom-button" data-title="Show Html" style="padding:7px;">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12L15.9289 19.0711L14.5147 17.6569L20.1716 12L14.5147 6.34317L15.9289 4.92896L23 12ZM3.82843 12L9.48528 17.6569L8.07107 19.0711L1 12L8.07107 4.92896L9.48528 6.34317L3.82843 12Z"></path></svg>
            </div>`
        )
        super($elem, editor)
      }

      // 菜单点击事件
      clickHandler(e) {

        // var isHtmlView = false;
        // debugger;
        const container = instance.$textElem.elems[0];
        const isHtmlView = container.getAttribute('data-html-view') === 'true';
        if (!isHtmlView) {
          // 切换到 HTML View
          const htmlContent = instance.txt.html();

          const formattedHtml = beautify.html(htmlContent, {
            indent_size: 2, // 缩进宽度
            wrap_line_length: 80, // 每行的最大字符数
          });

          const textarea = document.createElement('textarea');
          textarea.style.width = '100%';
          textarea.style.height = `${container.offsetHeight}px`;
          textarea.value = formattedHtml;
          textarea.setAttribute('data-html-textarea', 'true');

          container.setAttribute('data-html-view', 'true');
          container.innerHTML = ''; // 清空内容
          container.appendChild(textarea);
        } else {
          // 切换回编辑器视图
          const textarea = container.querySelector('[data-html-textarea="true"]');
          if (textarea) {
            const newHtml = textarea.value;
            container.setAttribute('data-html-view', 'false');
            instance.txt.html(newHtml); // 设置编辑器内容
          }
        }
      }
      tryChangeActive() {
        // 激活菜单
        // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
        // 2. this.this.isActive === true
        this.active()

        // // 取消激活菜单
        // // 1. 菜单 DOM 节点会删掉 .w-e-active
        // // 2. this.this.isActive === false
        // this.unActive()
      }
    };


    onMounted(() => {
      WangEditor.registerMenu('view-html', HtmlMenu)
      instance = new WangEditor(editor.value);

      instance.config.lang = languageLocale;
      instance.config.placeholder = t('fields.pleaseInput');

      instance.i18next = i18next;
      instance.txt.eventHooks.changeEvents.push(() => {
        content.html = instance.txt.html();
        emit('input', content.html)
      })
      // console.log(instance);

      instance.create();

      const handleClick = (event) => {
        event.preventDefault(); // 阻止默认刷新行为
        console.log('Custom button clicked');
      };
      document.querySelector('#my-html-custom-button').addEventListener('click', handleClick);


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
