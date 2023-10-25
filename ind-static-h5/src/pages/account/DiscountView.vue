<template>
  <ProfileSummary />

  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>

  <ContentView contentTopStatus="solid">
    <div>
      <div class="discount-table">
        <div class="discount-row discount-row--title">
          <div class="discount-col"><span class="txt-gray">2023-10-05 09:11:57</span></div>
        </div>
        <div class="discount-row discount-row--content">
          <div class="discount-col">Bonus Pot</div>
          <div class="discount-col">Amount: <span class="txt-yellow">4</span></div>
        </div>
      </div>
    </div>
  </ContentView>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import SwiperNav from "../../components/SwiperNav.vue";
import { useRouter } from "vue-router";
import ContentView from "../../components/ContentView.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";

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

const orderOptionTab = ref("");

const router = useRouter();

const onSlideClick = (e, i) => {
  if (e === currentSlide.value) return;
  router.push(slideListPath.value[i]);
  currentSlide.value = e;
};

const cardClass = ref("card-show");

const showMoreButton = () => {
  console.log("show more button clicked");
};
let isCardShown = ref(true);
watch(isCardShown, (newValue) => {
  cardClass.value = newValue ? "card-show" : "card-unshow";
});

const handleBankCardClick = () => {
  isCardShown.value = !isCardShown.value;
};

// onMounted(() => {
//   orderOptionTab.value = "withdrawal";
// });
</script>

<style lang="scss" scoped>
.discount-table {
  margin-bottom: 12px;
  .discount-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;

    &--title {
      background-color: rgba(21, 0, 37, 0.5);
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
    }

    &--content {
      background-color: rgba(21, 0, 37, 0.2);
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
