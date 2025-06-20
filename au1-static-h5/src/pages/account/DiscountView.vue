<template>
  <q-page class="account-table-page">
    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" noInfoTitle="No Record"></NoInfoComponent>
    <div v-else v-for="(e, i) in discountData" :key="`${e}-${i}`" class="discount-table">
      <div class="discount-row discount-row--title">
        <div class="discount-col">
          <span class="txt-gray">{{ e.recordTime }}</span>
        </div>
      </div>
      <div class="discount-row discount-row--content">
        <div class="discount-col">{{ e.privilegeName }}</div>
        <div class="discount-col">
          Amount:
          <span class="txt-yellow">{{ convertToCommaAmount(e.amount, true) }}</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onActivated, onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { updateDate, convertToGMT10, convertToGMT55, convertToGMT7, convertToGMT8 } from "src/boot/utils";
import SwiperNav from "../../components/SwiperNav.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";
import LoadingComponent from "../../components/LoadingComponent.vue";
import NoInfoComponent from "../../components/NoInfoComponent.vue";
import { convertToCommaAmount } from "src/boot/utils";

const router = useRouter();

let slideList = ref(["Discount", "Record", "Order", "Bank", "Message", "Personal Center"]);
let slideListPath = ref([
  "/account/discount",
  "/account/record",
  "/account/order",
  "/account/bank",
  "/account/message",
  "/account"
]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

const isLoading = ref(true);
const isNoInfo = ref(true);

const searchForm = reactive({ startDate: "", endDate: "" });
const setTime = () => {
  searchForm.startDate = updateDate(7);
  searchForm.endDate = updateDate(0);
};

const discountData = ref([]);
const searchDiscountRecord = () => {
  isLoading.value = true;
  discountData.value = [];

  const { startDate, endDate } = searchForm;

  const gmtStartDate = convertToGMT10(startDate);
  const gmtEndDate = convertToGMT10(endDate);
  api
    .get("/session/member/privilege", {
      params: { startDate: gmtStartDate, endDate: gmtEndDate, current: 1, size: 10 }
    })
    .then((response) => {
      if (response.code === 0) {
        const data = response.data.records;
        discountData.value.push(...data);

        if (data.length === 0) isNoInfo.value = true;
        else isNoInfo.value = false;
      }
    })
    .catch((error) => {})
    .then(() => {
      isLoading.value = false;
    });
};

onActivated(() => {
  setTime();
  searchDiscountRecord();
});
</script>

<style lang="scss" scoped>
.discount-table {
  background: #171e2b80;
  border-radius: 10px;
  padding: 6px 4px;
  margin-bottom: 10px;

  .discount-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    flex-wrap: wrap;

    &--title {
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
    }

    &--content {
      flex-wrap: wrap;
    }
  }

  .discount-col {
    width: 50%;

    &:nth-child(even) {
      text-align: right;
    }

    span.txt-gray {
      color: #888888;
    }

    span.txt-green {
      color: #5bf25c;
    }

    span.txt-red {
      color: #f24c5a;
    }

    span.txt-yellow {
      color: #fae576;
    }
  }
}
</style>
