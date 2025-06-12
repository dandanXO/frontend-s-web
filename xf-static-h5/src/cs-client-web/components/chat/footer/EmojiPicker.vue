<template>
  <q-btn round flat icon="sentiment_satisfied_alt"  color="primary" class="">
    <q-menu
      ref="menuRef"
      v-model="menu"
      fit
      anchor="top left"
      self="bottom left"
      :offset="[0, 10]"
      @show="onShow"
      @hide="onHide"
    >
      <div id="emojiPicker"></div>
    </q-menu>
  </q-btn>
</template>

<script>
import {defineComponent, ref} from "vue";
import {Picker as EmojiPicker} from "emoji-picker-element";

export default defineComponent({
  name: "EmojiPicker",
  emits: ["onPick"],
  setup(props, {emit}) {
    const menuRef = ref(null);
    const menu = ref(false);
    const emojiPicker = new EmojiPicker({
      dataSource: "emojibase/data.json",
    });

    // 表情包设置
    emojiPicker.classList.add("light");

    const style = document.createElement("style");

    style.textContent = `
      :host {
        --border-color: none;
        width: 100%;
        height: 250px;
      }

      .search-row {
        display: none;
      }

      .nav {
        border-bottom: #e0e0e0 1px solid;
      }

      .favorites {
      }

      .picker{
        border: none;
      }
      `;

    emojiPicker.shadowRoot.appendChild(style);

    const emojiClick = function (event) {
      emit("onPick", event);
    };

    const onShow = () => {
      const emojiPickerDom = document.querySelector("#emojiPicker");
      emojiPickerDom.append(emojiPicker);
      document
        .querySelector("emoji-picker")
        .addEventListener("emoji-click", emojiClick);

      menuRef.value.updatePosition();
    };

    const onHide = () => {
      //
    };

    return {
      menuRef,
      menu,
      onShow,
      onHide,
    };
  },
});
</script>

<style scoped></style>
