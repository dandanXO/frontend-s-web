<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <div class="account-profile-wrapper">
        <div class="account-profile-photo">
          <img v-if="profilePhoto" :src="profilePhoto" />
        </div>
        <div class="account-profile-info">
          <!-- TODO: check name -->
          <span class="account-profile-info__name">{{ nickName }}</span>
          <span class="account-profile-info__id">ID:{{ nickName }}</span>
        </div>
      </div>
      <div class="account-info-balance">
        <span>Total Score</span>
        <span class="account-info-balance-amount">₹{{ balance.toFixed(2) }}</span>
      </div>
      <div class="account-info-action-wrapper">
        <router-link
          v-for="(action, index) in actions"
          :key="`action-${index}`"
          :to="action.path"
          :class="{ active: route.path === action.path }"
          class="account-info-action-link"
        >
          <img :src="require(`@/assets/images/account/${action.name.toLocaleLowerCase()}-icon.svg`)" />
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
import { ref } from "vue";
import { useRoute } from "vue-router";
import { userStore } from "@/store";
import { storeToRefs } from "pinia";
import PersonalSvg from "@/assets/images/account/personal-center-icon.svg";
import RecordSvg from "@/assets/images/account/record-icon.svg";
import DiscountSvg from "@/assets/images/account/discount-icon.svg";
import BankSvg from "@/assets/images/account/bank-icon.svg";
import MessageSvg from "@/assets/images/account/message-icon.svg";
import VIPSvg from "@/assets/images/account/vip-icon.svg";

const store = userStore();
const { profilePhoto, nickName, balance } = storeToRefs(store);
const route = useRoute();

const actions = ref([
  { name: "Withdraw", path: "/center/withdraw" },
  { name: "Deposit", path: "/center/top-up" },
  { name: "Promo", path: "/center/personal" }
]);

const links = ref([
  { name: "Personal center", img: PersonalSvg, path: "/center/personal" },
  { name: "Record", img: RecordSvg, path: "/center/transit-record" },
  { name: "Discount", img: DiscountSvg, path: "/center/withdraw" },
  { name: "Bank", img: BankSvg, path: "/center/withdrawbank" },
  { name: "Message", img: MessageSvg, path: "/center/mailbox" },
  { name: "VIP", img: VIPSvg, path: "/center/withdraw" }
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
      }

      .account-profile-info {
        display: flex;
        flex-direction: column;
        gap: 7;
        justify-content: center;

        .account-profile-info__name {
          font-family: Poppins;
          font-size: 20px;
          font-weight: 700;
          line-height: 20px;
          color: #ffffff;
        }

        .account-profile-info__id {
          font-family: Poppins;
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
      font-family: Poppins;
      font-size: 12px;
      font-weight: 500;
      line-height: 12px;
      letter-spacing: -0.0008em;
      color: #ffffff;
      margin: 0 30px;

      .account-info-balance-amount {
        font-family: Poppins;
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
        font-family: Poppins;
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
      font-family: Poppins;
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
