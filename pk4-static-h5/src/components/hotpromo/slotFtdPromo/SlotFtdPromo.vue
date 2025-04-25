<template>
  <div class="btn-container">
    <div class="go-deposit-btn" :class="isFtdPromoEnded ? 'is-disabled' : ''" @click="gotoDepositPage(param)">
      <img src="./img/gift-icon.png" />
      <span>JOIN NOW</span>
    </div>

    <div class="text-warning" v-if="isFtdPromoEnded">
      {{ store.ftd === "CLOSE" ? params.desc_closed : params.desc_warning }}
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "src/stores";
import { api } from "boot/axios";

const router = useRouter();

const store = userStore();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

const isFtdPromoEnded = computed(() => {
  if (store.ftd !== "OPEN") {
    return true;
  }
  return false;
});

const gotoDepositPage = () => {
  const redirectPage = params && params.page ? params.page : "/deposit?from=/promo";
  router.push(redirectPage);
};

const loadAppTabs = () => {
  api.get("/opt-session/getPakAppTabs").then((res) => {
    if (res.code === 0) {
      const { data } = res;
      if (data && data.hasOwnProperty("ftd")) {
        store.ftd = data.ftd;
      }
    }
  });
};

onMounted(() => {
  loadAppTabs();
});
</script>
<style lang="scss">
.btn-container {
  width: 100%;
  margin: 8px auto 10px;
  position: relative;
}
.text-warning {
  padding: 8px 0px;
}
.go-deposit-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 5px;
  background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);

  &.is-disabled {
    pointer-events: none;
    filter: brightness(0.4);
  }

  img {
    width: 28px !important;
    margin: 0px;
    display: inline-block;
    height: auto;
  }

  span {
    color: #000;
    font-size: 20px;
    font-weight: 700;
  }

  &:active {
    transform: translate(0px, 1px);
    filter: brightness(0.85);
  }
}
</style>
