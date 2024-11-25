<template>
  <el-dialog
    :model-value="modelValue"
    align-center
    width="650"
    class="withdraw-remaining-dialog"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="withdraw-remaining-dialog__header">
      <div class="withdraw-remaining-dialog__header-title">
        <img src="@/assets/images/finance/withdraw/withdraw-remaining-icon.svg" />
        <!-- <span style="width: 40%">{{ $t("withdraw.dialog.title") }}</span> -->
      </div>
    </div>
    <img class="withdraw-remaining-dialog__pic" src="@/assets/images/finance/withdraw/withdraw-remaining-pic.png" />
    <div class="withdraw-remaining-dialog__body">
      <div class="withdraw-remaining-dialog__body-title">
        {{ $t("withdraw.dialog.complete") }}
        <span class="text-yellow">{{ convertToCommaAmount(totalRemaining, true) }}</span>
        {{ $t("withdraw.dialog.enjoy") }}
      </div>
      <span class="withdraw-remaining-dialog__header-help-text">
        {{ $t("withdraw.dialog.helpText") }}
        <br />
        {{ $t("withdraw.dialog.helpText2") }}
      </span>
      <table class="withdraw-remaining-dialog__body-table">
        <thead>
          <tr>
            <th align="center">{{ $t("withdraw.dialog.betRequirement") }}</th>
            <th align="center" style="display: flex; align-items: center; justify-content: center; gap: 4px">
              {{ $t("withdraw.dialog.turnoverProgress") }}
              <!-- <img class="refresh-btn" @click="refreshTurnOverAmt" src="@/assets/images/common/refresh-btn.png" /> -->
            </th>
            <th align="center">{{ $t("withdraw.dialog.status") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in tableData" :key="index">
            <td align="center">{{ getDisplayRemainingTypes(record.type) }}</td>
            <td align="center">
              {{ convertToCommaAmount(record.progress, true) }}/{{ convertToCommaAmount(record.total, true) }}
            </td>
            <td align="center">
              <router-link class="action-button" to="/home">{{ $t("withdraw.dialog.goComplete") }}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="withdraw-remaining-dialog__buttons">
        <button class="withdraw-remaining-dialog__action" @click="handleClose">{{ $t("withdraw.dialog.back") }}</button>
        <button class="withdraw-remaining-dialog__action" @click="refreshTurnOverAmt">
          {{ $t("withdraw.dialog.refresh") }}
        </button>
      </div>
      <!-- <button class="withdraw-remaining-dialog__action" @click="handleClose">{{ $t("withdraw.dialog.back") }}</button> -->
    </div>
  </el-dialog>
</template>
<script setup>
import { withdrawRemainingRollover } from "@/api/personal/personal";
import { convertToCommaAmount } from "@/utils/utils";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n(); // i18n for translations
const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(["update:modelValue"]);

const router = useRouter();

const tableData = ref([]);

const getDisplayRemainingTypes = (items) => {
  const typess = items.split(",");
  let typeStr = [];
  typess.forEach((type) => {
    typeStr.push(getDisplayRemainingType(type));
  });
  return typeStr.join("，");
};
const getDisplayRemainingType = (type) => {
  switch (type) {
    case "slot":
      return t("withdraw.types_slot");
    case "live":
      return t("withdraw.types_live");
    case "fish":
      return t("withdraw.types_fish");
    case "sport":
      return t("withdraw.types_sport");
    case "esport":
      return t("withdraw.types_esport");
    case "vsport":
      return t("withdraw.types_vsport");
    case "poker":
      return t("withdraw.types_poker");
    case "lottery":
      return t("withdraw.types_lottery");
    case "casual":
      return t("withdraw.types_casual");
    case "minigame":
      return t("withdraw.types_minigame");
    case "cockfight":
      return t("withdraw.types_cockfight");
    case "numbergame":
      return t("withdraw.types_numbergame");
    case "all":
      return t("withdraw.types_all");
    default:
      return t("withdraw.types_all");
  }
};

const totalRemaining = computed(() =>
  tableData.value.reduce((result, record) => {
    result = result - record.progress + record.total;
    return result;
  }, 0)
);

const handleClose = () => {
  emit("update:modelValue", false);
  router.go(-1);
};

const isRefreshing = ref(false);
const refreshTurnOverAmt = () => {
  if (isRefreshing.value) {
    return;
  }
  isRefreshing.value = true;
  tableData.value = [];
  getRemainingRolloverData();
};

const getRemainingRolloverData = () => {
  withdrawRemainingRollover()
    .then((res) => {
      if (res.code === 0) {
        tableData.value = res.data;
      }
    })
    .catch((e) => {
      console.log(e);
      isRefreshing.value = false;
    })
    .finally((e) => {
      isRefreshing.value = false;
    });
};

onMounted(() => {
  getRemainingRolloverData();
});
</script>
<style lang="scss">
.withdraw-remaining-dialog {
  background: transparent;
  box-shadow: none;
  .el-dialog__body {
    background: transparent;
    // box-sizing: border-box;
    // padding: 24px 20px;
    padding: 0;
    position: relative;

    .withdraw-remaining-dialog__header {
      background: url(@/assets/images/finance/withdraw/withdraw-remaining-bg.png) no-repeat;
      background-size: 100% 100%;
      aspect-ratio: 530 / 60;
      padding: 24px 20px 0;
      box-sizing: border-box;
      // margin-bottom: 22px;

      .withdraw-remaining-dialog__header-title {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 600;
        line-height: 22.4px;
        color: #424f72;
      }
    }
    .withdraw-remaining-dialog__pic {
      position: absolute;
      right: 58px;
      top: -58px;
      width: 147px;
    }

    .withdraw-remaining-dialog__body {
      background-color: #fff;
      padding: 22px 20px 24px;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;

      .withdraw-remaining-dialog__header-help-text {
        font-size: 14px;
        line-height: 24px;
        color: #7a8eb9;
        margin-bottom: 10px;
        display: block;
      }
      .withdraw-remaining-dialog__body-title {
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        text-align: left;
        color: #424f72;
      }
      .withdraw-remaining-dialog__body-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        color: #424f72;
        margin-bottom: 12px;

        thead {
          background-color: #3981ff3b;
          th {
            padding: 10px 0;
            text-align: center;
            color: #3981ff;
            &:first-child {
              border-top-left-radius: 4px;
            }
            &:last-child {
              border-top-right-radius: 4px;
            }
          }
        }
        tbody {
          tr:nth-child(even) {
            background-color: #f2f8fe;
          }
          tr:last-child {
            td {
              border-bottom: 1px solid #bed9ff80;

              &:first-child {
                border-bottom-left-radius: 4px;
              }
              &:last-child {
                border-bottom-right-radius: 4px;
              }
            }
          }
          td {
            padding: 10px 0;
            border-top: 1px solid #bed9ff80;
            border-left: 1px solid #bed9ff80;

            &:last-child {
              border-right: 1px solid #bed9ff80;
            }

            .action-button {
              background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%, #3981ff 100%);
              border-radius: 30px;
              box-shadow: 0px -2px 4.58px 0px #93c7ff inset, 0px -1px 3.66px 0px #275ec1 inset;
              padding: 4px 13px;
              font-size: 16px;
              font-weight: 400;
              line-height: 24px;
              color: #fff;
              &:hover {
                filter: brightness(1.2);
              }
            }
          }
        }
      }
    }

    .withdraw-remaining-dialog__buttons {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .withdraw-remaining-dialog__action {
      width: 100%;
      box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.66px 0px #5894ff inset;
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      border-radius: 4px;
      padding: 10px 0;
      font-size: 18px;
      font-weight: 600;
      line-height: 25.2px;
      text-align: center;
      background: url(@/assets/images/finance/withdraw/active-btn.png);
      background-size: 100% 100%;
      color: #fff;
      opacity: 0.9;
      &:first-of-type {
        background: url(@/assets/images/finance/withdraw/nonactive-btn.png);
        background-size: 100% 100%;
        color: #7a80a1;
      }

      &:hover {
        opacity: 1;
        // filter: brightness(1.2);
      }
    }
  }

  .text-yellow {
    font-size: 26px;
    color: #599cff;
  }

  .refresh-btn {
    margin-bottom: 0px;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }
  }
}
</style>
