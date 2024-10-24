<template>
  <q-page>
    <div class="transit-buttons">
      <router-link class="btn btn-pointer" v-for="(trans, i) in transitList" :key="i" :to="`records/${trans.code}`">
        <!--        <img :src="require(`../../assets/images/account/${trans.icon}_record.png`)">-->
        {{ trans.name }}
        <div class="right">
        </div>
      </router-link>
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";
const { t } = useI18n();
const transitList = ref([]);

const getLists = () => {
  transitList.value = [
    {
      code: "deposit",
      icon: "deposit",
      name: t('lang.menu_deposit')
    },
    {
      code: "moneyChange",
      icon: "transfer",
      name: t('lang.menu_moneychange')
    },
    {
      code: "withdraw",
      icon: "withdraw",
      name: t('lang.menu_withdraw')
    },
    {
      code: "promo",
      icon: "deposit",
      name: t('lang.menu_promo')
    },
    // {
    //   code: "rebate",
    //   icon: "deposit",
    //   name: t('lang.menu_rebate')
    // },
    {
      code: "bet",
      icon: "change",
      name: t('lang.menu_transaction')
    },
    {
      code: "financeFeedback",
      icon: "help",
      name: t('lang.menu_reminder')
    }
  ]
}

onMounted(() => {
  getLists();
})

// const { languageVal } = storeToRefs(i18nStore());
// watch(languageVal, (newVal) => {
//   console.log("HEER")
//   window.location.reload();
// });
</script>
<style scoped lang="scss">
.transit-buttons {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;

  .btn {
    color: $font-1;
    text-decoration: none;
    position: relative;
    background: $white;
    box-shadow: $shadow-bg;
    padding: 15px 16px 20px;
    display: flex;
    border-radius: 10px;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
    font-size: 1rem;

    img {
      width: 25px;
    }

    .right {
      position: absolute;
      right: 20px;

      width: 10px;
      height: 18px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAXBAMAAAAiiNiyAAAAIVBMVEUAAACjqbqlq7ykrLyjqryjqbuiqbqkq7uiqLujq7ukqrseWcveAAAACnRSTlMAgH9f75Cgj3BAfe3x3AAAAD9JREFUCNdjqFJgAAOvRRC6axVEgHEVVECKfAG2VQvA9JRVASCKedVSMNdqlQCEuxAPlwnK1YJwGaBchhAIFwAXshknQDlDagAAAABJRU5ErkJggg==');
      background-size: 100% 100%;
    }
  }
}
</style>
