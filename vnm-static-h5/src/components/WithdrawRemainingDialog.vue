<template>
  <q-dialog v-model="isShow" class="withdraw-remaining-dialog" persistent>
    <div class="withdraw-remaining-dialog-inner">
      <div class="withdraw-remaining-dialog__header">
        <div class="withdraw-remaining-dialog__header-title">
          <img src="../assets/images/finance/withdraw/withdraw-remaining-icon.svg" />
          <!-- <span style="width: 40%">{{ $t("lang.dialog_title") }}</span> -->
        </div>
      </div>
      <img class="withdraw-remaining-dialog__pic" src="../assets/images/finance/withdraw/withdraw-remaining-pic.png" />

      <div class="withdraw-remaining-dialog__body">
        <div class="withdraw-remaining-dialog__body-title">
          {{ $t("lang.dialog_complete") }}
          <span class="text-blue">{{ convertToCommaAmount(totalRemaining, true) }}</span>
          {{ $t("lang.dialog_enjoy") }}
        </div>
        <span class="withdraw-remaining-dialog__header-help-text">
          {{ $t("lang.dialog_help_text") }}
          <br />
          {{ $t("lang.dialog_help_text2") }}
        </span>
        <table class="withdraw-remaining-dialog__body-table">
          <thead>
            <tr>
              <th align="center">{{ $t("lang.dialog_bet_requirement") }}</th>
              <th align="center" style="display: flex; align-items: center; justify-content: center; gap: 4px">
                {{ $t("lang.dialog_turnover_progress") }}
                <!-- <img class="refresh-btn" @click="refreshTurnOverAmt" src="../assets/images/common/refresh-btn.png" /> -->
              </th>
              <th align="center">{{ $t("lang.dialog_status") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in tableData" :key="index">
              <td align="center">{{ getDisplayRemainingTypes(record.type) }}</td>
              <td align="center">
                {{ convertToCommaAmount(record.progress, true) }}/{{ convertToCommaAmount(record.total, true) }}
              </td>
              <td align="center">
                <router-link class="action-button" to="/home">{{ $t("lang.dialog_go_complete") }}</router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="withdraw-remaining-dialog__buttons">
          <button class="withdraw-remaining-dialog__action" @click="handleClose">{{ $t("lang.dialog_back") }}</button>
          <button class="withdraw-remaining-dialog__action" @click="refreshTurnOverAmt">
            {{ $t("lang.dialog_refresh") }}
          </button>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { api } from "src/boot/axios";
import { convertToCommaAmount } from "src/boot/utils";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const { t } = useI18n(); // i18n for translations

const isShow = defineModel();

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
      return t("lang.types_slot");
    case "live":
      return t("lang.types_live");
    case "fish":
      return t("lang.types_fish");
    case "sport":
      return t("lang.types_sport");
    case "esport":
      return t("lang.types_esport");
    case "vsport":
      return t("lang.types_vsport");
    case "poker":
      return t("lang.types_poker");
    case "lottery":
      return t("lang.types_lottery");
    case "casual":
      return t("lang.types_casual");
    case "minigame":
      return t("lang.types_minigame");
    case "cockfight":
      return t("lang.types_cockfight");
    case "numbergame":
      return t("lang.types_numbergame");
    case "all":
      return t("lang.types_all");
    default:
      return t("lang.types_all");
  }
};

const totalRemaining = computed(() =>
  tableData.value.reduce((result, record) => {
    result = result - record.progress + record.total;
    return result;
  }, 0)
);

const handleClose = () => {
  isShow.value = false;
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
  api
    .get("/session/member/remainingRolloverByType")
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

  .withdraw-remaining-dialog-inner {
    --font-size-small: 14px;
    --font-size: 16px;
    --font-size-large: 18px;
    --line-height: 22px;
    width: 90%;
    max-width: 450px;
    background: transparent;
    padding: 0;
    position: relative;
    overflow: inherit;

    .withdraw-remaining-dialog__header {
      background: url(../assets/images/finance/withdraw/withdraw-remaining-bg.png) no-repeat;
      background-size: 100%;
      aspect-ratio: 530 / 92;
      padding: 24px 12px 0;
      box-sizing: border-box;

      .withdraw-remaining-dialog__header-title {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 4px;
        font-size: var(--font-size);
        font-weight: 600;
        line-height: var(--line-height);
        color: #424f72;
        img {
          width: 24px;
          overflow: auto;
        }
      }
    }
    .withdraw-remaining-dialog__pic {
      position: absolute;
      right: 20px;
      top: -20px;
      width: 100px;
    }

    .withdraw-remaining-dialog__body {
      background-color: #fff;
      padding: 16px 12px 18px;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;

      .withdraw-remaining-dialog__header-help-text {
        font-size: var(--font-size-small);
        line-height: var(--line-height);
        color: #7a8eb9;
      }
      .withdraw-remaining-dialog__body-title {
        margin-bottom: 12px;
        font-size: var(--font-size-large);
        font-weight: 600;
        line-height: var(--line-height);
        color: #424f72;
        gap: 5px;
        text-align: left;
        display: inline-block;
        gap: 5px;
      }
      .withdraw-remaining-dialog__body-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: var(--font-size-large);
        font-weight: 600;
        line-height: var(--line-height);
        color: #424f72;
        margin-bottom: 12px;

        thead {
          background-color: #3981ff3b;
          th {
            padding: 10px 0;
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
              font-size: var(--font-size);
              font-weight: 400;
              line-height: var(--line-height);
              text-decoration: none;
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
      border: none;
      box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.66px 0px #5894ff inset;
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      border-radius: 4px;
      padding: 10px 0;
      font-size: var(--font-size-large);
      font-weight: 600;
      line-height: var(--line-height);
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

  .text-blue {
    font-size: 22px;
    color: #599cff;
  }

  .refresh-btn {
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

@media (max-width: 450px) {
  .withdraw-remaining-dialog {
    .withdraw-remaining-dialog-inner {
      --font-size-small: 12px;
      --font-size: 14px;
      --font-size-large: 16px;
      --line-height: 18px;
    }
  }
}

@media (max-width: 380px) {
  .withdraw-remaining-dialog {
    .withdraw-remaining-dialog-inner {
      --font-size-small: 10px;
      --font-size: 13px;
      --font-size-large: 14px;
      --line-height: 16px;
      .withdraw-remaining-dialog__pic {
        width: 90px;
        right: 16px;
      }
    }
  }
}
</style>
