<template>
  <div class="btn-container">
    <div class="go-deposit-btn" @click="gotoDepositPage(param)">
      <img src="./img/gift-icon.png" />
      <span>DEPOSIT</span>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

onMounted(() => {});

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
.go-deposit-btn {
  width: 100%;
  height: 48px;
  background-color: #5c46e7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 5px;

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
