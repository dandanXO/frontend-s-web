<template>
  <q-dialog v-model="model" position="bottom" class="bottom-sheet-picker-dialog">
    <q-card class="bottom-sheet-picker-card">
      <q-card-section class="bottom-sheet-picker-header">
        <div />
        {{ $t("lang.language") }}
        <q-btn class="close-btn" flat @click="closeDialog">
          <img src="../../assets/images/index/close-btn-white.png" width="8" />
        </q-btn>
      </q-card-section>
      <!-- <q-card-actions>
        <q-btn flat dense class="bottom-sheet-picker-action__cancel" @click="handleCancelClick">
          {{ _cancelBtnText }}
        </q-btn>
        <q-space />
        <q-btn flat dense class="bottom-sheet-picker-action__confirm" @click="handleConfirmClick">
          {{ _confirmBtnText }}
        </q-btn>
      </q-card-actions> -->
      <!-- <q-separator /> -->
      <q-card-section>
        <q-list>
          <q-item v-for="(item, index) in list" :key="index">
            <q-item-section avatar>
              <img :src="item.icon" width="24" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item[labelKey] }}</q-item-label>
            </q-item-section>
            <q-item-section side class="bottom-sheet-picker-content__side">
              <q-radio v-model="current" size="40px" :val="item[valueKey]" />
              <div v-if="current === item[valueKey]" class="bottom-sheet-picker-content__side-selected"></div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  cancelBtnText: {
    type: String,
    default: ""
  },
  confirmBtnText: {
    type: String,
    default: ""
  },
  list: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: "label"
  },
  valueKey: {
    type: String,
    default: "value"
  }
});

const emit = defineEmits(["cancel", "confirm"]);
const model = defineModel("show");
const current = defineModel("current");

const { t } = useI18n();

const _cancelBtnText = computed(() => props.cancelBtnText || t("btn.cancel"));
const _confirmBtnText = computed(() => props.confirmBtnText || t("btn.confirm"));

const handleCancelClick = () => {
  emit("cancel");
  closeDialog();
};

const handleConfirmClick = () => {
  if (selectedItem.value) {
    emit("confirm", selectedItem.value);
  }
  closeDialog();
};

const closeDialog = () => {
  model.value = false;
};
</script>
<style lang="scss" scoped>
.bottom-sheet-picker-dialog {
  .bottom-sheet-picker-card {
    position: relative;
    margin: 0;
    padding: 24px 16px;
    max-height: 40dvh;
    min-height: 175px;
    width: 100%;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background: #232626;
    box-shadow: none;

    .bottom-sheet-picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      font-size: 16px;

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #907c5f;
        border-radius: 6px;
        min-height: unset;
        margin-right: 5px;
        padding: 11px;
      }
    }

    .q-card__actions {
      position: sticky;
      top: 0;
      z-index: 1;
      // background: #fcfdfe;
      font-weight: 700;
      .bottom-sheet-picker-action__cancel {
        color: #7a80a1;
      }
      .bottom-sheet-picker-action__confirm {
        color: #468cff;
      }
    }

    .q-separator {
      background: #ecedf0;
    }

    .q-card__section {
      .q-list {
        &.q-list--separator {
          .q-item-type {
            border-color: #ecedf0;
          }
        }
        .q-item {
          color: #fff;
          padding: 8px 0;

          .bottom-sheet-picker-content__side {
            position: relative;
            .q-radio {
              :deep(.q-radio__inner) {
                color: #707070;

                &.q-radio__inner--truthy {
                  // background: linear-gradient(270deg, #cec6ae 0%, #76674c 99.76%);
                  .q-radio__check {
                    display: none;
                  }
                }
              }
            }

            .bottom-sheet-picker-content__side-selected {
              position: absolute;
              top: 50%;
              left: 64%;
              width: 20px;
              height: 20px;
              background: linear-gradient(270deg, #cec6ae 0%, #76674c 99.76%);
              border-radius: 50%;
              transform: translate(-50%, -50%);
              pointer-events: none;
              &::before {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                width: 12px;
                height: 12px;
                background: #232626;
                border-radius: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
    }
  }
}
</style>
