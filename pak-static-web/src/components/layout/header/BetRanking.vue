<template>
  <div class="bet-ranking-wrapper">
    <span class="bet-ranking-title">{{ $t("layout.header.betRanking.title") }}</span>
    <div class="bet-ranking-record-list">
      <div v-if="loading" class="bet-ranking-loading-wrapper">
        <a-spin />
      </div>
      <template v-else>
        <div v-for="(record, index) in records" :key="index" class="bet-ranking-record-wrapper">
          <img v-if="index < 3" :src="require(`@/assets/images/layout/header/bet-ranking-${index + 1}.png`)" />
          <span v-else class="bet-ranking-record__rank">{{ index + 1 }}</span>
          <span class="bet-ranking-record__name">{{ record.loginName }}</span>
          <span class="bet-ranking-record__amount">₨ {{ record.bet.toFixed(2) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { getBetRanking } from "@/api/index/common";
import { onMounted, onUnmounted, ref } from "vue";

const INTERVAL = 1000 * 60;

const records = ref();
const timer = ref();
const loading = ref(false);

const loadBetRankingData = () => {
  loading.value = true;
  getBetRanking().then((res) => {
    if (res.code !== 0) return;
    records.value = res.data;
    loading.value = false;
  });
};

onMounted(() => {
  loadBetRankingData();
  if (timer.value) clearInterval(timer.value);
  timer.value = setInterval(loadBetRankingData, INTERVAL);
});

onUnmounted(() => timer.value && clearInterval(timer.value));
</script>
<style scoped lang="scss">
.bet-ranking-wrapper {
  .bet-ranking-title {
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

    .bet-ranking-loading-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }

    .bet-ranking-record-wrapper {
      display: flex;
      gap: 13px;
      align-items: center;
      padding: 7px 12px;
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
