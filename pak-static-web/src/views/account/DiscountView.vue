<template>
  <div class="menu-title-container">
    <span class="menu-title">{{ $t("personalView.discount.title") }}</span>
  </div>
  <div class="discount-record-list">
    <template v-if="discountList.length">
      <div v-for="(record, index) in discountList" :key="index" class="discount-record-item">
        <h3 class="discount-record-item__title">{{ toGMT5(record.recordTime, "MM/DD/YYYY") }}</h3>
        <div class="discount-record-item__inner-wrapper">
          <span class="discount-record-item__amount-prefix">
            {{ $t("personalView.discount.amount") }}
            <span class="discount-record-item__amount">{{ addThousandsComma(record.amount, true) }}</span>
          </span>
        </div>
      </div>
    </template>
    <NoData v-else />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getDiscount } from "@/api/personal/discount";
import moment from "moment";
import { addThousandsComma, toGMT5 } from "@/utils/utils";
import NoData from "@/components/common/NoData.vue";

const discountList = ref([]);

const loadDiscount = () => {
  const endDate = new Date();
  const startDate = new Date().setDate(endDate.getDate() - 7);
  const params = {
    startDate: moment(startDate).format("YYYY-MM-DD"),
    endDate: moment(endDate).format("YYYY-MM-DD")
  };

  getDiscount(params)
    .then((response) => {
      if (response.code === 0) {
        discountList.value = response.data.records;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  loadDiscount();
});
</script>
<style scoped lang="scss">
.discount-record-list {
  display: flex;
  flex-direction: column;
  gap: 25px;

  .discount-record-item {
    padding: 18px 20px;
    border: 1px solid #ffffff0d;
    background: #ffffff0d;
    border-radius: 10px;
    position: relative;
    overflow: hidden;

    .discount-record-item__title {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 700;
      line-height: 19.2px;
      color: #ffffff;
    }

    .discount-record-item__inner-wrapper {
      display: flex;
      align-items: center;
      justify-content: end;
      font-size: 18px;
      font-weight: 700;
      line-height: 30px;
      color: #ffffff80;

      .discount-record-item__amount {
        color: #fae576;
      }
    }
  }
}
</style>
