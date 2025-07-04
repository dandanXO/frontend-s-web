<template>
  <el-dialog v-model="showPrizeHistory" class="prize-history-container">
    <table class="prize-history-table">
      <thead>
        <th>号码</th>
        <th>抽奖时间</th>
        <th>中奖内容</th>
      </thead>
      <tbody>
        <tr v-for="(prizeHistoryItem, index) in prizeHistory.records">
          <td>{{ index + (prizeHistory.current - 1) * theSize + 1 }}</td>
          <td>{{ moment(prizeHistoryItem.recordTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
          <td>{{ prizeHistoryItem.bonusName }}</td>
        </tr>
        <tr>
          <td colspan="3">
            <el-pagination
              @current-change="(newPage) => getData(newPage)"
              :total="prizeHistory.total"
              :current-page="prizeHistory.current"
              :page-size="prizeHistory.size"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMidautumSpinWheelRecords } from "@/api/promotion/bonusSpinWheel";
import moment from "moment";

const showPrizeHistory = ref(false);
const prizeHistory = ref([]);
const theSize = ref(10);

const getData = (page = 1) => {
  getMidautumSpinWheelRecords({
    current: page,
    size: theSize.value
  }).then((res) => {
    if (res.code === 0) {
      showPrizeHistory.value = true;
      prizeHistory.value = res.data;
    }
  });
};

const init = () => {
  showPrizeHistory.value = true;
  getData();
};

defineExpose({
  init
});
</script>

<style lang="scss" scoped>
.prize-history-table {
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  border-collapse: collapse;

  th {
    background: linear-gradient(180deg, #c5ceff 0%, #a79eff 100%);
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 36.4px;
    color: #9742f8;
  }

  tr:nth-child(odd) {
    background: #faf2ff;
  }

  tr:nth-child(even) {
    background: #fcf8ff;
  }

  td {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
    color: #000;
  }

  th,
  td {
    min-width: 200px;
    text-align: center;
  }
}
</style>

<style lang="scss">
.prize-history-container {
  width: 700px;
  height: 500px;
  background: transparent;
  box-shadow: none;

  .el-pager li,
  .el-pagination button {
    background: transparent;
  }

  .el-dialog__header {
    .el-dialog__headerbtn {
      top: 50px;
      width: 45px;
      height: 45px;
      right: -8px;
      opacity: 0;
    }
  }
  .el-dialog__body {
    background: none;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 329px;
    gap: 0px;

    .content {
      height: 290px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 30px;
      margin-right: 30px;
    }
  }
}
</style>
