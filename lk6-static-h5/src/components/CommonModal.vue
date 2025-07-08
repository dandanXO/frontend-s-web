<template>
  <q-dialog v-model="model" v-bind="$attrs" v-on="$attrs" class="modal-common-div">
    <q-card
      style="width: 100%"
      class="modalcontent"
      :class="{
        'with-decorator': withDecorator,
        ...$attrs.class
      }"
    >
      <div class="headers">
        <slot name="header">
          <div class="titles">{{ header }}</div>
        </slot>
        <q-btn v-if="closable" class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <div class="contents">
        <slot name="content">
          {{ message }}
        </slot>
      </div>
      <div class="btnsreas">
        <slot name="action">
          <div v-if="actions.length === 1" />
          <div v-if="actions.includes('cancel')" class="cacnels common-md-white-btn" @click="$emit('cancel')">
            {{ _cancelBtnText }}
          </div>
          <div v-if="actions.includes('confirm')" class="confirmsbtns common-md-btn" @click="$emit('confirm')">
            {{ _confirmBtnText }}
          </div>
          <div v-if="actions.length === 1" />
        </slot>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed } from "vue";

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  withDecorator: {
    type: Boolean,
    default: false
  },
  header: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    default: ""
  },
  actions: {
    type: Array,
    default: () => ["confirm"]
  },
  confirmBtnText: {
    type: String,
    default: ""
  },
  cancelBtnText: {
    type: String,
    default: ""
  },
  closable: {
    type: Boolean,
    default: true
  }
});

defineEmits(["cancel", "confirm"]);
const model = defineModel();

const _confirmBtnText = computed(() => {
  // TODO: use i18n
  return props.confirmBtnText || "确定";
});

const _cancelBtnText = computed(() => {
  // TODO: use i18n
  return props.confirmBtnText || "取消";
});
</script>
<style lang="scss">
.modal-common-div {
  .modalcontent {
    background: url(../assets/images/index/common-modal-bg.png) no-repeat center top;
    background-size: 100%;
    background-color: #fff;
    height: auto;
    border-radius: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 6px 16px;
    overflow: visible;
    min-width: 300px;

    &.with-decorator {
      &::before {
        content: "";
        position: absolute;
        top: -40px;
        left: 0;
        background: url(../assets/images/index/common-modal-decorator.png) no-repeat center center;
        background-size: 100% 100%;
        aspect-ratio: 1;
        width: 95px;
      }
    }
  }

  .headers {
    width: calc(100% - 16px);
    margin: auto;
    border-radius: 10px 10px 0px 0px;
    box-sizing: border-box;
    height: 55px;
    line-height: 55px;
    color: #424f72;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    > .q-btn {
      margin-left: auto;
    }

    .titles {
      left: 50%;
      position: absolute;
      transform: translate(-50%, 0);
    }
  }

  .contents {
    width: 100%;
    box-sizing: border-box;
    padding: 20px 12px 15px;
    text-align: center;
    color: #424f72;
    font-size: 1.2rem;

    .inputs {
      width: 292px;
      height: 36px;
      border-radius: 4px 4px;
      border: 1px solid #666;
      box-sizing: border-box;
      margin: 0 auto;
      padding-left: 20px;

      .van-field__control {
        height: 100%;
        width: 100%;
      }
    }
  }

  .btnsreas {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    margin-top: 20px;
    gap: 15px;

    .cacnels {
      flex: 1;
      box-sizing: border-box;
      text-align: center;
      letter-spacing: 1px;
      max-width: 170px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }

    .confirmsbtns {
      flex: 1;
      box-sizing: border-box;
      text-align: center;
      max-width: 170px;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 1px;
    }
    .submit-btn {
      min-width: 112px;
      background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
      border: 1px solid #ffffff;
      border-radius: 30px;
      color: #fff;
    }

    a {
      color: inherit;
      &:hover {
        filter: none;
      }
    }
  }
}
</style>
