<template>
  <q-page>
    <div class="top-details">
      <div class="wallet-balance">
        主钱包:
        <span v-if="isLoadingBalance">加载中...</span>
        <span v-else>
          {{ store.balance }}
        </span>
      </div>

      <div class="wallet-btn">
        <q-btn label="一键刷新" dense color="brightbtn" class="wallet-refresh-btn" icon="refresh" @click="loadBalance"
          :loading="isLoadingBalance" />
      </div>
    </div>

    <div class="box-wrapper">
      <div class="asset-game-list">
        <div class="asset-game">
          <div class="game-detail">
            <div class="game-detail-logo">
              <div class="tf-logo" />
            </div>
            <div>雷火体育</div>
          </div>
          <div class="game-refresh">
            <q-icon name="refresh" size="1.3rem" color="brand" />
          </div>
          <div class="game-balance">121.65</div>
        </div>

        <div class="asset-game">
          <div class="game-detail">
            <div class="game-detail-logo">
              <div class="tf-logo" />
            </div>
            <div>雷火体育</div>
          </div>
          <div class="game-refresh">
            <q-icon name="refresh" size="1.3rem" color="brand" />
          </div>
          <div class="game-balance">121.65</div>
        </div>
      </div>
    </div>

    <div class="box-wrapper q-mt-md">
      <div class="asset-option-list">
        <template v-for="(item, index) in assetOptions" :key="index">
          <div class="asset-option-item" @click="router.push(item.link)">
            <div class="option-item-icon">
              <div :class="item.icon"></div>
            </div>
            <div class="option-item-txt">{{ item.title }}</div>
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";

const router = useRouter();
const store = userStore();
const isRefreshingBalance = ref(true);
const seconds = ref(10);
const setTimer = () => {
  setTimeout(() => {
    if (seconds.value !== 0) {
      seconds.value--;
    } else {
      isRefreshingBalance.value = false;
    }
    setTimer();
  }, 1000);
};

const isLoadingBalance = ref(false);

const loadBalance = () => {
  isLoadingBalance.value = true;
  store.getBalance().then((res) => {
    setTimeout(() => {
      isLoadingBalance.value = false;
    }, 1000);
  });
};

const assetOptions = [
  {
    title: "存款",
    icon: "icon-deposit",
    link: "/finance/deposit"
  },
  {
    title: "提款",
    icon: "icon-withdrawal",
    link: "/finance/withdraw"
  },
  {
    title: "转账",
    icon: "icon-transfer",
    link: "/account/transfer"
  }
];

onMounted(() => {
  loadBalance();
});
</script>

<style scoped lang="scss">
.box-wrapper {
  width: calc(100% - 2rem);
  margin-left: auto;
  margin-right: auto;
  background: #ffffff;
  box-shadow: 0px -4px 6px 2px #c3d4e6 inset;
  border-radius: 10px;
  // padding: 15px 12px 20px;
}

.top-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  .wallet-balance {
    color: $font-1;

    span {
      color: $primary;
      font-weight: 800;
    }
  }

  .wallet-btn {
    .wallet-refresh-btn {
      border-radius: 6px;
      font-size: 0.875rem;
    }
  }
}

.asset-game-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0.5rem 0.5rem;

  .asset-game {
    display: grid;
    align-items: center;
    border: 1px solid #f1f1f1;
    grid-template:
      "detail refresh"
      "detail balance";
    padding: 0.5rem;

    &:nth-child(odd) {
      border-left-width: 0;
      border-top-width: 0;
    }

    &:nth-child(even) {
      border-right-width: 0;
      border-top-width: 0;
      border-left-width: 0;
    }

    &:last-child {
      border-bottom-width: 0;
    }

    &:nth-last-child(2) {
      border-bottom-width: 0;
    }

    .game-detail {
      grid-area: detail;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-right: 1rem;
      color: $accent;

      .game-detail-logo {
        width: 1.5rem;

        img {
          display: block;
          width: 100%;
        }
      }
    }

    .game-refresh {
      grid-area: refresh;
      margin-left: auto;
    }

    .game-balance {
      grid-area: balance;
      margin-left: auto;
      font-weight: 800;
      color: $primary;
    }
  }
}

.asset-option-list {
  padding-top: 1rem;
  padding-bottom: 1rem;

  .asset-option-item {
    padding: 0.5rem 1rem;
    margin: 0.25rem 0;
    color: $font-1;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;

    &:after {
      content: "";
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAcBAMAAACaHyIpAAAAG1BMVEUAAABBT3JAUHBCT3JCUHJAUHBBT3FCT3NCT3KpEvsSAAAACHRSTlMA3yCffxDPv4ZQ4twAAAA8SURBVAjXY/AwZYCAjnYoo6LDAMII62iGMFgzaCEU2NEEYXh0CIBplo5GBaiAENUEGGACDBZQAQYmKA0Amy0dVmFsd2oAAAAASUVORK5CYII=');
      width: 6px;
      height: 11px;
      background-size: 100% 100%;
      margin-left: auto;
    }

    &:hover {
      filter: brightness(0.7);
    }

    .option-item-icon {
      width: 1.5rem;

      img {
        display: block;
        width: 100%;
      }
    }

    .option-item-txt {}
  }
}
</style>
