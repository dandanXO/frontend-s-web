<template>
  <div class="rules-container">
    <div class="rule-title">
      {{ $t("hotPromo.depositSpinWheel.activityRules") }}
    </div>
    <ul>
      <li>{{ $t("hotPromo.depositSpinWheel.rule_01") }}</li>
      <li>{{ $t("hotPromo.depositSpinWheel.rule_02") }}</li>
      <li>{{ $t("hotPromo.depositSpinWheel.rule_03") }}</li>
      <li>{{ $t("hotPromo.depositSpinWheel.rule_04") }}</li>
      <li>{{ $t("hotPromo.depositSpinWheel.rule_05") }}</li>
    </ul>
    <div class="badges">
      <div class="badge" :key="index" v-for="(badge, index) in badgesList">
        <img :src="require(`./img/spin-${index + 1}.png`)" />
        <span class="badgetitle">{{ badge.title }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const badgesList = ref([
  {
    title: t("hotPromo.depositSpinWheel.silver")
  },
  {
    title: t("hotPromo.depositSpinWheel.gold")
  },
  {
    title: t("hotPromo.depositSpinWheel.diamond")
  },
  {
    title: t("hotPromo.depositSpinWheel.supreme")
  }
]);

onMounted(() => {
  document.body.style.overflowY = "hidden";
});
onUnmounted(() => {
  document.body.style.overflowY = "auto";
});
</script>
<style lang="scss" scoped>
.rules-container {
  width: 100%;
  padding: 0 10px;
  margin: 0 auto;
  // background: url(./img/rules-bg-img.png)no-repeat center top;
  background-size: cover;
  color: #3a3a3a;
  background-color: #eae6de;
  position: fixed;
  top: 110px;
  left: 0;
  height: calc(100vh - 180px);
  overflow-y: scroll;
  .rule-title {
    display: flex;
    justify-content: center;
    font-family: Roboto;
    font-size: 22px;
    font-weight: 700;
    line-height: 24px;
    flex: 2;
    justify-content: center;
    align-items: center;
    width: 70%;
    margin: 30px auto;
    &:before,
    &:after {
      content: "";
      background: url(./img/decal.png) no-repeat center center;
      height: 15px;
      width: 80%;
      background-size: contain;
      flex: 1;
    }
    &:before {
      transform: rotateZ(180deg);
    }
  }
  ul {
    margin: 25px auto;
    line-height: 32px;
    font-family: Poppins;
    li {
      color: #3a3a3a !important;
    }
  }
  .badges {
    display: flex;
    gap: 5px;
    width: 90%;
    margin: 10px auto;
    .badge {
      background: url(./img/greensquare.png) no-repeat center center;
      background-size: contain;
      padding: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;

      img {
        width: 70%;
        margin: 0 auto;
      }
    }
  }
}
</style>
