<template>
  <q-page>
    <ProfileSummary></ProfileSummary>

    <q-item-section class="center-func-container">
      <router-link to="promo">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <img src="../assets/images/account/account-page-promo-icon.svg" />
            <div class="acct-nav-label">Promo</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <router-link to="/account/records">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <img src="../assets/images/account/account-page-transaction-record-icon.svg" />
            <div class="acct-nav-label">Transaction Record</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <router-link to="/account/personal">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <img src="../assets/images/account/account-page-personal-info-icon.svg" />
            <div class="acct-nav-label">Personal Information</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <router-link to="/account/withdraw">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <img src="../assets/images/account/account-page-withdraw-bank-card-icon.svg" />
            <div class="acct-nav-label">Withdrawal Bank Card</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <router-link to="/account/mail">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <img src="../assets/images/account/account-page-mailbox-icon.svg" />
            <div class="acct-nav-label">Mailbox</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <router-link to="/affiliate">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <!-- <RiTeamLine /> -->
            <img src="../assets/images/account/account-page-affiliate-icon.svg" />
            <div class="acct-nav-label">Affiliate</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <router-link to="/vip">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <!-- <RiVipCrown2Line /> -->
            <img src="../assets/images/account/account-page-vip-icon.svg" />
            <div class="acct-nav-label">VIP</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <router-link to="/share">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <img src="../assets/images/account/account-page-share-icon.svg" />
            <div class="acct-nav-label">Share</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </router-link>
      <div class="acct-nav-item">
        <div class="acct-nav-wrapper">
          <img v-if="$q.dark.isActive" src="../assets/images/account/account-page-moon-icon.svg" />
          <img v-else src="../assets/images/account/account-page-sun-icon.svg" />
          <div class="acct-nav-label">{{ $q.dark.isActive ? 'Dark' : 'Light' }}</div>
        </div>
        <ThemeToggle />
      </div>
      <a @click.prevent="logout">
        <div class="acct-nav-item">
          <div class="acct-nav-wrapper">
            <img src="../assets/images/account/account-page-logout-icon.svg" />
            <div class="acct-nav-label">Logout</div>
          </div>
          <q-icon name="keyboard_arrow_right" size="sm"/>
        </div>
      </a>
    </q-item-section>
  </q-page>
</template>

<script setup>
import { userStore } from "stores/index";
import { RiVipCrown2Line, RiTeamLine } from "vue-remix-icons";
import { useRouter } from "vue-router";
import ProfileSummary from "src/components/account/ProfileSummary.vue";
import { useQuasar } from "quasar";
import ThemeToggle from "src/components/themeToggle.vue";

const router = useRouter();
const store = userStore();
const $q = useQuasar();
const logout = () => {
  store.memberLogout().then((res) => {
    if (res.code === 0) router.push("/");
  });
};

const toggleTheme = () => {
  $q.dark.toggle()
  sessionStorage.setItem('ISDARK', $q.dark.isActive)
}
</script>

<style scoped lang="scss">
.center-func-container {
  margin: 10px 10px 20px;
  gap: 8px;
  box-shadow: 0px 9px 25px rgba(20, 17, 50, 0.1);
  border-radius: 20px;

  .acct-nav-item {
    cursor: pointer;
    display: flex;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    gap: 10px;
    border-radius: 10px;
    margin: 0 0px;
    height: 100%;
    border: 1px solid #fff;
    background: #ecf5ff;
    box-shadow: 0px 2px 10px 0px #fff inset, 0px 0px 17.6px 0px #fff inset;

    color: #222;

    .acct-nav-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .arrow {
      color: #83a3ca;
    }

    svg {
      width: 30px;
      padding: 0;
      fill: #0062e8;
    }

    &:active {
      background: #1e88e5;
      color: #fff;

      svg {
        fill: #fff;
      }
    }
  }
}
</style>

<!-- dark theme -->
<style scoped lang="scss">
body.body--dark {
  .acct-nav-item {
    background: #ffffff02;
    box-shadow: unset;
    color: white;
    border: 1px solid #2C4354;

    .acct-nav-wrapper img {
      filter: brightness(0) invert(1);
    }
    
    svg {
      fill: white;
    }

    .arrow {
      color: white;
    }
  }
}
</style>
