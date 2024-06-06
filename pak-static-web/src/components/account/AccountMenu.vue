<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <div class="account-profile-wrapper">
        <div class="account-profile-photo">
          <img v-if="profilePhoto" :src="profilePhoto" />
          <img v-else src="@/assets/images/account/default-profile.png" />
        </div>
        <div class="account-profile-info">
          <!-- TODO: check name -->
          <span class="account-profile-info__name">{{ nickName }}</span>
          <span class="account-profile-info__id">{{ $t("personalView.layout.accountMenu.info") }} {{ nickName }}</span>
        </div>
      </div>
      <div class="account-info-balance">
        <span>{{ $t("personalView.layout.accountMenu.totalScore") }}</span>
        <span class="account-info-balance-amount">₨{{ balance.toFixed(2) }}</span>
      </div>
      <div class="account-info-action-wrapper">
        <router-link
          v-for="(action, index) in actions"
          :key="`action-${index}`"
          :to="action.path"
          :class="{ active: route.fullPath === action.path }"
          class="account-info-action-link"
        >
          <img :src="action.img" />
          <span>{{ action.name }}</span>
        </router-link>
      </div>
    </div>
    <div class="account-link-wrapper">
      <router-link
        v-for="(link, index) in links"
        :key="`link-${index}`"
        :to="link.path"
        :class="{ active: route.path === link.path }"
        class="account-link-item"
      >
        <img :src="link.img" />
        {{ link.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { userStore } from "@/store";
import { storeToRefs } from "pinia";
import PersonalSvg from "@/assets/images/account/personal-center-icon.svg";
import RecordSvg from "@/assets/images/account/record-icon.svg";
import DiscountSvg from "@/assets/images/account/discount-icon.svg";
import BankSvg from "@/assets/images/account/bank-icon.svg";
import MessageSvg from "@/assets/images/account/message-icon.svg";
import VIPSvg from "@/assets/images/account/vip-icon.svg";
import DepositSvg from "@/assets/images/account/deposit-icon.svg";
import WithdrawSvg from "@/assets/images/account/withdraw-icon.svg";
import PromoSvg from "@/assets/images/account/promo-icon.svg";
import { useI18n } from "vue-i18n";

const store = userStore();
const { profilePhoto, nickName, balance } = storeToRefs(store);
const route = useRoute();
const { t } = useI18n();

const actions = computed(() => [
  { name: t("personalView.layout.accountMenu.action.withdraw"), img: WithdrawSvg, path: "/center/top-up?tab=withdraw" },
  { name: t("personalView.layout.accountMenu.action.deposit"), img: DepositSvg, path: "/center/top-up" },
  { name: t("personalView.layout.accountMenu.action.promo"), img: PromoSvg, path: "/promotion" }
]);

const links = ref([
  { name: t("personalView.layout.accountMenu.link.personalCenter"), img: PersonalSvg, path: "/center/personal" },
  { name: t("personalView.layout.accountMenu.link.record"), img: RecordSvg, path: "/center/transit-record" },
  { name: t("personalView.layout.accountMenu.link.discount"), img: DiscountSvg, path: "/center/discount" },
  { name: t("personalView.layout.accountMenu.link.bank"), img: BankSvg, path: "/center/withdrawbank" },
  { name: t("personalView.layout.accountMenu.link.message"), img: MessageSvg, path: "/center/mailbox" },
  { name: t("personalView.layout.accountMenu.link.vip"), img: VIPSvg, path: "/center/vip" }
]);
</script>

<style scoped lang="scss">
.account-menu-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;

  .account-info-wrapper {
    display: flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    padding: 24px 8px;
    background-color: #ffffff05;
    border-radius: 5px;

    .account-profile-wrapper {
      display: flex;
      gap: 10px;
      align-items: center;
      margin: 0 20px 24px;

      .account-profile-photo {
        border-radius: 50%;
        border: 2px solid #13e25c;
        width: 60px;
        height: 60px;
        background-color: #ffffff0d;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .account-profile-info {
        display: flex;
        flex-direction: column;
        gap: 7px;
        align-items: start;
        justify-content: center;

        .account-profile-info__name {
          font-size: 20px;
          font-weight: 700;
          line-height: 20px;
          color: #ffffff;
        }

        .account-profile-info__id {
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          color: #9f9f9f;
        }
      }
    }

    .account-info-balance {
      background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      line-height: 12px;
      letter-spacing: -0.0008em;
      color: #ffffff;
      margin: 0 30px;

      .account-info-balance-amount {
        font-size: 20px;
        font-weight: 700;
        line-height: 20px;
      }
    }

    .account-info-action-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      margin-top: -6px;
      background-color: #2e303466;
      border-radius: 4px;
      backdrop-filter: blur(5px);

      .account-info-action-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 12px;
        font-weight: 500;
        line-height: 12px;
        letter-spacing: -0.0008em;
        color: #ffffff;

        &.active {
          color: #70bc62;
        }
      }
    }
  }

  .account-link-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;
    padding: 30px 0;

    .account-link-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: 400;
      line-height: 20px;
      color: #8c968f;

      &.active {
        background-color: #70bc621a;
        color: #70bc62;
        svg {
          fill: #70bc62;
        }
      }
    }
  }
}
</style>
