<template>
  <q-item-section class="profile-card">
    <div class="profile-info">
      <div class="profile-wrapper">
        <div class="profile-pic">
          <img src="../../assets/images/account/avatar5.png" />
        </div>
        <div class="vip-wrapper">
          <div class="vip">
            <div class="vip-level">{{ vip }}</div>
            <div class="vip-badge">
              <img v-if="vip === 'VIP0'" src="../../assets/vip/badge/crown-badge-0.png" />
              <img v-if="vip === 'VIP1'" src="../../assets/vip/badge/crown-badge-1.png" />
              <img v-if="vip === 'VIP2'" src="../../assets/vip/badge/crown-badge-2.png" />
              <img v-if="vip === 'VIP3'" src="../../assets/vip/badge/crown-badge-3.png" />
              <img v-if="vip === 'VIP4'" src="../../assets/vip/badge/crown-badge-4.png" />
              <img v-if="vip === 'VIP5'" src="../../assets/vip/badge/crown-badge-5.png" />
              <img v-if="vip === 'VIP6'" src="../../assets/vip/badge/crown-badge-6.png" />
              <img v-if="vip === 'VIP7'" src="../../assets/vip/badge/crown-badge-7.png" />
              <img v-if="vip === 'VIP8'" src="../../assets/vip/badge/crown-badge-8.png" />
            </div>
          </div>
          <div style="display:flex;gap:2px;align-items:center;">
            <div class="name">{{ store.displayName ? store.displayName : store.nickName }}</div>
            <img src="../../assets/images/account/copy-icon.svg"/>
          </div>
        </div>
      </div>

      <div class="amt">{{ mainWallet }}</div>
    </div>
    <div class="quick-btn">
      <router-link to="finance/withdraw" class="withdraw">
        <div class="acct-nav-label">Withdraw</div>
      </router-link>

      <a class="deposit" @click="openDeposit">
        <div class="acct-nav-label">Deposit</div>
      </a>
    </div>
  </q-item-section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

const router = useRouter();
const store = userStore();

const vip = computed(() => {
  return store.vip;
});

const mainWallet = computed(() => {
  return store.currency.value + " " + store.balance.toFixed(2);
});

onMounted(() => {
  getBalance();
  store.getBalance();
});

const openDeposit = () => {
  localStorage.setItem("isOpenFromAccount", JSON.stringify(true));
  router.push("finance/deposit");
};

const getBalance = () => {
  setInterval(function () {
    if (store.hasToken()) {
      store.getBalance();
    }
  }, 20000);
};
</script>

<style scoped lang="scss">
.profile-card {
  background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
  margin: 10px 10px 20px;
  padding: 16px;
  border-radius: 20px;

  .profile-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 45px 0;

    .profile-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;

      .profile-pic {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: black;

        img {
            width: 100%;
        }
      }

      .vip-wrapper {
        .vip {
          display: flex;
          align-items: center;
          gap: 5px;

          .vip-level {
            color: #83a3ca;
            font-weight: 500;
          }

          .vip-badge {
            display: flex;
            align-items: center;
            img {
              width: 30px;
            }
          }
        }

        .name {
          color: white;
        }
      }
    }

    .amt {
      color: white;
      font-size: 20px;
      font-weight: 700;
    }
  }

  .quick-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;

    .withdraw,
    .deposit {
      min-width: 100px;
      border-radius: 2.125rem;
      border: 1px solid #eaeaea;
      background: #fff;
      color: #222;
      text-align: center;
      font-family: Poppins Bold;
      padding: 10px 20px;
      font-size: 14px;
    }
    .withdraw {
      background: unset;
      color: #ffffff;
      font-family: Poppins Regular;
    }
  }
}
</style>

<!-- dark theme -->
<style scoped lang="scss">
body.body--dark {
  .profile-card {
    background: linear-gradient(168deg, rgba(42, 72, 179, 0.37) 0%, rgba(5, 12, 24, 0.77) 100%);
    box-shadow: 0px -10px 40px 0px rgba(11, 16, 35, 0.8);
    // backdrop-filter: blur(2px);

    .quick-btn {
      .withdraw,
      .deposit {
        color: white;
        // border-image-source: linear-gradient(237.56deg, #5cffeb -21.06%, #9a5ca9 55.65%, #2cffd9 137.61%);
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        // box-shadow: 0px 4px 5px 0px rgba(11, 8, 29, 0.2) inset, 0px -4px 5px 0px rgba(11, 8, 29, 0.2) inset;
        border: none;
      }
      .withdraw {
        background: #ffffff05;
        border: 1px solid #ffe60029;
      }
    }
  }
}
</style>
