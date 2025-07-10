<template>
  <q-dialog v-model="model" position="bottom" class="bottom-sheet-picker-dialog" @show="handleDialogShow">
    <q-card class="bottom-sheet-picker-card">
      <q-card-actions>
        <q-btn flat dense class="bottom-sheet-picker-action__cancel" @click="handleCancelClick">
          {{ _cancelBtnText }}
        </q-btn>
        <q-space />
        <q-btn flat dense class="bottom-sheet-picker-action__confirm" @click="handleConfirmClick">
          {{ _confirmBtnText }}
        </q-btn>
      </q-card-actions>
      <q-separator />
      <q-card-section>
        <q-list separator>
          <q-item
            v-for="(item, index) in list"
            :key="index"
            :class="{
              selected: selectedItem && selectedItem[valueKey] === item[valueKey]
            }"
            clickable
            @click="selectedItem = item"
          >
            <q-item-section>
              <q-item-label>{{ item[labelKey] }}</q-item-label>
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
  },
  current: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["cancel", "confirm"]);
const model = defineModel();

const { t } = useI18n();

const _cancelBtnText = computed(() => props.cancelBtnText || t("btn.cancel"));
const _confirmBtnText = computed(() => props.confirmBtnText || t("btn.confirm"));

const selectedItem = ref(null);

const handleDialogShow = () => {
  if (props.current) {
    selectedItem.value = props.current;
  } else {
    selectedItem.value = props.list[0] || null;
  }
};

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
  selectedItem.value = null;
};
</script>
<style lang="scss" scoped>
.bottom-sheet-picker-dialog {
  .bottom-sheet-picker-card {
    position: relative;
    margin: 0;
    max-height: 30dvh;
    min-height: 175px;
    width: 100%;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;

    .q-card__actions {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #fcfdfe;
      font-weight: 600;
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
      padding: 0 16px;
      .q-list {
        &.q-list--separator {
          .q-item-type {
            border-color: #ecedf0;
          }
        }
        .q-item {
          color: #424f7280;
          text-align: center;

          &.selected {
            color: #424f72;
          }
        }
      }
    }
  }
}
</style>
