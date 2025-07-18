<template>
  <div>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`records/${trans.code}`">
        <!-- <img :src="require(`../../assets/records/${trans.icon}-icon.png`)" /> -->
        {{ trans.name }}
        <div class="right">
          <img src="~assets/records/arrow-right-s-line.svg" />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const transitList = computed(() => [
  {
    code: "deposit",
    icon: "deposit",
    name: t("record.list.deposit")
  },
  {
    code: "withdraw",
    icon: "withdraw",
    name: t("record.list.withdraw")
  },

  {
    code: "moneyChange",
    icon: "moneychange",
    name: t("record.list.moneyChange")
  },
  {
    code: "promo",
    icon: "recommend",
    name: t("record.list.promo")
  },
  {
    code: "bet",
    icon: "cashhelp",
    name: t("record.list.bet")
  },
  {
    code: "financeFeedback",
    icon: "feedback",
    name: t("record.list.reminderRequest")
  }
]);
</script>
<style scoped lang="scss">
.transit-buttons {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;

  .btn {
    color: #7a80a1;
    height: 46px;
    text-decoration: none;
    position: relative;
    background: #fcfdfe;
    padding: 10px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;
    border-radius: 7px;

    img {
      width: 8px;
    }

    .right {
      position: absolute;
      right: 18px;
    }
  }
}
</style>
