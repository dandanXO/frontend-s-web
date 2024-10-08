<template>
  <el-dialog
    :model-value="modelValue"
    align-center
    width="530"
    class="withdraw-remaining-dialog"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="withdraw-remaining-dialog__header">
      <div class="withdraw-remaining-dialog__header-title">
        <img src="@/assets/images/finance/withdraw/withdraw-remaining-icon.svg" />
        <span>继续提款需完成以下条件</span>
      </div>
      <span class="withdraw-remaining-dialog__header-help-text">若有疑问，请联系在线客服核查~</span>
    </div>
    <img class="withdraw-remaining-dialog__pic" src="@/assets/images/finance/withdraw/withdraw-remaining-pic.png" />
    <div class="withdraw-remaining-dialog__body">
      <div class="withdraw-remaining-dialog__body-title">
        完成
        <span class="text-yellow">{{ convertToCommaAmount(totalRemaining) }}</span>
        流水，立即享受快速提款
      </div>
      <table class="withdraw-remaining-dialog__body-table">
        <thead>
          <tr>
            <th align="center">投注要求</th>
            <th align="center">流水进度</th>
            <th align="center">完成状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in tableData" :key="index">
            <td align="center">{{ getDisplayRemainingType(record.type) }}</td>
            <td align="center">{{ convertToCommaAmount(record.progress) }}/{{ convertToCommaAmount(record.total) }}</td>
            <td align="center">
              <router-link class="action-button" to="/home">去完成</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="withdraw-remaining-dialog__action" @click="handleClose">返回</button>
    </div>
  </el-dialog>
</template>
<script setup>
import { withdrawRemainingRollover } from "@/api/personal/personal";
import { convertToCommaAmount } from "@/utils/utils";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(["update:modelValue"]);

const router = useRouter();

const tableData = ref([]);

const getDisplayRemainingType = (type) => {
  switch (type) {
    case "esport":
      return "电竞";
    case "sport":
      return "体育";
    case "live":
      return "真人";
    case "fish":
      return "捕鱼";
    case "casual":
      return "小游戏";
    case "lottery":
      return "彩票";
    case "poker":
      return "棋牌";
    case "slot":
      return "电子";
    case "all":
      return "任意类型";
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

const getRemainingRolloverData = () => {
  withdrawRemainingRollover()
    .then((res) => {
      if (res.code === 0) {
        tableData.value = res.data;
      }
    })
    .catch((e) => console.log(e));
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
    color: #fff;

    .withdraw-remaining-dialog__header {
      background: url(@/assets/images/finance/withdraw/withdraw-remaining-bg.png) no-repeat;
      background-size: 100% 100%;
      aspect-ratio: 530 / 92;
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
      }
      .withdraw-remaining-dialog__header-help-text {
        font-size: 14px;
        line-height: 24px;
      }
    }
    .withdraw-remaining-dialog__pic {
      position: absolute;
      right: 58px;
      top: -58px;
      width: 147px;
    }

    .withdraw-remaining-dialog__body {
      background-color: #213057;
      padding: 22px 20px 24px;

      .withdraw-remaining-dialog__body-title {
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        text-align: center;
      }
      .withdraw-remaining-dialog__body-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin-bottom: 12px;

        thead {
          background-color: #00bfd71a;
          th {
            padding: 10px 0;
            color: #00bfd7;
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
            background-color: #2b3d6a;
          }
          tr:last-child {
            td {
              border-bottom: 1px solid #446ca680;

              &:first-child {
                border-bottom-left-radius: 4px;
              }
              &:last-child {
                border-bottom-right-radius: 4px;
              }
            }
          }
          tr:first-child {
            td {
              border-top: none;
            }
          }
          td {
            padding: 10px 0;
            border-top: 1px solid #446ca680;
            border-left: 1px solid #446ca680;

            &:last-child {
              border-right: 1px solid #446ca680;
            }

            .action-button {
              background: linear-gradient(180deg, #00bfd7 0%, #0184ba 100%);
              border-radius: 30px;
              padding: 4px 13px;
              font-size: 16px;
              font-weight: 400;
              line-height: 24px;
              text-decoration: none;
              color: inherit;
              &:hover {
                filter: brightness(1.2);
              }
            }
          }
        }
      }
    }

    .withdraw-remaining-dialog__action {
      width: 100%;
      border: none;
      background: linear-gradient(180deg, #00bfd7 0%, #0184ba 100%);
      border-radius: 4px;
      padding: 10px 0;
      font-size: 18px;
      font-weight: 600;
      line-height: 25.2px;
      text-align: center;

      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  .text-yellow {
    font-size: 26px;
    color: #00bfd7;
  }
}
</style>
