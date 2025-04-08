<template>
  <div class="info-center-wrapper">
    <div class="marquee-wrapper">
      <img src="../../../assets/images/home/v2/infoCenter/speaker.svg" />
      <marquee-text :repeat="5" :duration="announcementList.length * 500">
        <div v-if="announcementList">
          <span v-for="(a, i) in announcementList" :key="i" @click="$emit('openPopup', a)">
            {{ a.content }}
          </span>
        </div>
      </marquee-text>
      <a v-if="downloadHeart && !ui.hideDownload" class="download-app-btn" :href="ui.downloadAppUrl">
        <img src="../../../assets/images/home/v2/infoCenter/download-app.svg" />
      </a>
    </div>
    <div class="info-center-divider" />
    <div class="info-wrapper">
      <div class="info-balance-wrapper">
        <span>{{ store.currency.value }}</span>
        <div class="info-balance-inner-wrapper" @click="refreshBalance">
          <span>{{ $t("home.balance") }}</span>
          <span class="info-balance-inner-amount">
            {{ isLoadingBalance ? `${$t("btn.loading")}...` : convertToCommaAmount(store.balance, false) }}
          </span>
        </div>
      </div>
      <div class="info-link-wrapper">
        <router-link v-for="(link, index) in links" class="info-link-item" :key="index" :to="link.to">
          <img :src="link.icon" />
          <span>{{ link.text }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { convertToCommaAmount } from "src/boot/utils";
import { userStore } from "src/stores";
import { useUI } from "src/stores/ui";
import { computed, ref } from "vue";
import MarqueeText from "vue-marquee-text-component";
import DepositIcon from "../../../assets/images/home/v2/infoCenter/deposit-icon.svg";
import WithdrawIcon from "../../../assets/images/home/v2/infoCenter/withdraw-icon.svg";
import ShareIcon from "../../../assets/images/home/v2/infoCenter/share-icon.svg";
import ProfitIcon from "../../../assets/images/home/v2/infoCenter/profit-icon.svg";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

defineProps({
  announcementList: Array,
  downloadHeart: Boolean
});

defineEmits(["openPopup"]);

const ui = useUI();
const store = userStore();
const { t } = useI18n();
const route = useRoute();

const isLoadingBalance = ref(false);

const links = computed(() => [
  { icon: DepositIcon, text: t("home.link_deposit"), to: `/deposit?from=${route.path}` },
  { icon: WithdrawIcon, text: t("home.link_withdraw"), to: `/withdraw?from=${route.path}` },
  { icon: ShareIcon, text: t("home.link_share"), to: `/earn-money?from=${route.path}` }
  // { icon: ProfitIcon, text: t("home.link_profit"), to: `/interest-profit?from=${route.path}` }
]);

const refreshBalance = () => {
  if (store.token) {
    isLoadingBalance.value = true;
    store.getBalance().then((res) => {
      isLoadingBalance.value = false;
    });
  }
};
</script>
<style lang="scss" scoped>
.info-center-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: #f4f9fe;
  border-radius: 12px;
  box-shadow: 4px 4px 4px 0px #0000000d;
  padding: 7px 10px 3px;

  .marquee-wrapper {
    display: flex;
    align-items: center;
    // gap: 10px;
    font-size: 12px;
    font-weight: 500;
    line-height: 16.8px;
    color: #35648f;
    :not(:last-child) {
      margin-right: 10px;
    }
    .download-app-btn {
      display: flex;
      &:hover {
        filter: brightness(1.2);
      }
    }

    :deep(.marquee-text-content) {
      width: max-content;
    }
  }

  .info-center-divider {
    height: 1px;
    width: 100%;
    background-color: #d8e7fd;
  }

  .info-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;

    .info-balance-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 5px;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      color: #35648f80;

      > span {
        // padding-top: 10px;
        padding-bottom: 6px;
      }

      .info-balance-inner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .info-balance-inner-amount {
          font-size: 23px;
          font-weight: 600;
          line-height: 36px;
          letter-spacing: -1px;
          color: #35648f;
        }
      }
    }
    .info-link-wrapper {
      display: flex;
      // gap: 14px;

      .info-link-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        color: #35648f;
        text-decoration: none;
        margin-left: 14px;

        &:first-child{
          margin-left: 0;
        }

        img {
          height: 100%;
          width: 10vw;
          max-width: 55px;
        }
      }
    }
  }
}

@media (max-width: 400px) {
  .info-center-wrapper {
    .info-wrapper {
      .info-balance-wrapper {
        font-size: 10px;
        line-height: 14px;
        .info-balance-inner-wrapper {
          .info-balance-inner-amount {
            font-size: 17px;
            line-height: 26px;
          }
        }
      }
      .info-link-wrapper {
        .info-link-item {
          font-size: 8px;
          line-height: 12px;
        }
      }
    }
  }
}
</style>
