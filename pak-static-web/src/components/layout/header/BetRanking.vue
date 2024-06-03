<template>
  <div class="bet-ranking-wrapper">
    <span class="bet-ranking-title">Biggest bet today</span>
    <div class="bet-ranking-record-list">
      <div v-for="(record, index) in records" :key="index" class="bet-ranking-record-wrapper">
        <img v-if="index < 3" :src="require(`@/assets/images/layout/header/bet-ranking-${index + 1}.png`)" />
        <span v-else class="bet-ranking-record__rank">{{ index + 1 }}</span>
        <span class="bet-ranking-record__name">{{ record.name }}</span>
        <span class="bet-ranking-record__amount">${{ record.amount.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const records = ref([
  { name: "John", amount: 567 },
  { name: "Alice", amount: 234 },
  { name: "Bob", amount: 876 },
  { name: "Emma", amount: 431 },
  { name: "David", amount: 652 },
  { name: "Olivia", amount: 198 },
  { name: "James", amount: 753 },
  { name: "Sophia", amount: 319 },
  { name: "Michael", amount: 981 },
  { name: "Emily", amount: 572 }
]);
</script>
<style scoped lang="scss">
.bet-ranking-wrapper {
  .bet-ranking-title {
    font-family: Baloo Bhai 2;
    font-size: 16px;
    font-weight: 400;
    line-height: 18px;
    color: #ffffff;
  }

  .bet-ranking-record-list {
    display: flex;
    flex-direction: column;
    justify-content: center;

    > :nth-child(even) {
      background-color: #ffffff0d;
    }

    .bet-ranking-record-wrapper {
      display: flex;
      gap: 13px;
      align-items: center;
      padding: 7px 12px;
      font-family: Baloo 2;
      font-size: 12px;
      font-weight: 500;
      line-height: 12px;
      color: #8c968f;

      .bet-ranking-record__rank {
        width: 18px;
        text-align: center;
        line-height: 18px;
      }

      .bet-ranking-record__name {
        flex: 1;
      }

      .bet-ranking-record__amount {
        color: #ffc700;
      }
    }
  }
}
</style>
