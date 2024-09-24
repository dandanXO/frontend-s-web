<template>
    <div class="profile-container">
        <div class="balance-wrapper">
            <div class="balance-box">
                <div v-if="!isLoadBalance" class="balance">
                    <div class="currency">₱</div><div class="balance-num">{{ store.balance }}</div>
                </div>
                <img v-if="!isLoadBalance" class="refresh-icon" src="../assets/home/header-refresh-balance-icon.svg" @click="loadBalance"/>
                <div v-if="isLoadBalance" style="font-size:12px">Loading...</div>
                <router-link to="/finance/deposit" class="deposit-link">
                    <img class="refresh-icon" src="../assets/home/header-deposit-icon.svg" />
                </router-link>
            </div>
        </div>
        <div class="avatar-wrapper">
            <router-link to="/account">
                <div class="avatar">
                    <img src="../assets/images/account/avatar5.png" />
                </div>
            </router-link>
        </div>
        <!-- <q-btn class="logout-btn" @click="logout">Logout</q-btn> -->
    </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HeaderProfile",
  components: {
  },

  setup() {
    const router = useRouter();
    const store = userStore();
    const isLoadBalance = ref(false);
    const loadBalance = () => {
      isLoadBalance.value = true;
      store.getBalance();
      setTimeout(() => {
        isLoadBalance.value = false;
      }, 150);
    };

    const logout = () => store.memberLogout().then(() => router.push("/"));

    return {
        store,
        loadBalance,
        isLoadBalance,
        logout
    }
  }
});
</script>
<style lang="scss" scoped>
.profile-container {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;
    justify-content: flex-end;

    .balance-wrapper {
        display: flex;
        justify-content: flex-end;

        .balance-box {
            display: flex;
            flex: 1;
            height: 40px;
            color: #000;
            border-radius: 10px;
            display: flex;
            gap: 0.2rem;
            align-items: center;
            padding: 0px 3px;
            justify-content: flex-end;
            background-color: #E2ECFF;
            font-size: 12px;
            font-weight: 700;

            .balance {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 5px;
                padding: 0px 10px;
                .balance-num {
                    width: 100%;
                }
            }

            .refresh-icon-wrapper {
                display: flex;
                align-items: center;
            }

            .deposit-link {
                display: flex;
            }
        }
    }

    .avatar-wrapper {
        .avatar {
            border-radius: 50%;
            width: 40px;
            height: 40px;
            overflow: hidden;

            img {
                width: 100%;
            }
        }
    }

    .logout-btn {
        font-size: 12px;
        border-radius: 5px;
        background: linear-gradient(270deg, #5800E8 0%, #0062E8 100%);
        color: #fff;
        display: flex;
    }
}

.body--dark {
    .profile-container {
        .balance-wrapper {
            .balance-box {
                background-color: #133264;
                color: #fff;
            }
        }
    }
}
</style>