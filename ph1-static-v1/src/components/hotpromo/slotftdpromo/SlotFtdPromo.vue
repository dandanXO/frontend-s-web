<template>
  <div class="btn-container">
    <div class="go-deposit-btn" :class="isFtdPromoEnded ? 'is-disabled' : ''" @click="gotoDepositPage(param)">
      <img src="./img/gift-icon.png" />
      <span>JOIN NOW</span>
    </div>

    <div class="text-warning" v-if="isFtdPromoEnded">
      Sorry, account have already get bouns. Please join to our other activity .
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "src/stores";

const router = useRouter();

const store = userStore();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

onMounted(() => {});

const isFtdPromoEnded = computed(() => {
  if (store.ftd === true) {
    return true;
  }

  return false;
});
const gotoDepositPage = () => {
  const redirectPage = params && params.page ? params.page : "/deposit?from=/promo";
  router.push(redirectPage);
};
</script>
<style lang="scss">
.btn-container {
  width: 100%;
  margin: 8px auto 10px;
}
.text-warning {
  padding: 8px 0px;
}
.go-deposit-btn {
  width: 100%;
  height: 48px;
  background-color: #5c46e7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 5px;
  background: linear-gradient(180deg, #8575e9 0%, #5c46e7 100%);
  border: 1px solid #8d83cd;

  &.is-disabled {
    pointer-events: none;
    filter: brightness(0.4);
  }

  img {
    width: 28px;
    margin: 0px;
    display: inline-block;
    height: auto;
  }

  span {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }

  &:active {
    transform: translate(0px, 1px);
    filter: brightness(0.85);
  }
}
</style>
