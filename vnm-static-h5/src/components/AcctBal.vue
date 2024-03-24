<template>
  <div class="acct-balances q-ma-sm q-pa-sm">
    <div class="top-balance">
      <div class="mainbal">
        <div class="icon">
          <img src="../assets/images/account/account-wallet-icon.png" />
          <div class="label">{{ $t("lang.acct_mainaccount") }}</div>
        </div>
        <div class="wallet">
          <div class="balamt text-black" @click="loadBalance">
            <span v-if="!isLoadingBalance">{{ store.currency.value }}{{ store.balance.toFixed(2) }}</span>
            <span v-if="isLoadingBalance">{{ $t("lang.acct_loading") }}...</span>
          </div>
        </div>
      </div>
      <div class="refreshItems">
        <div v-if="!isRefreshingBalance" class="refreshAll common-sm-btn" @click="refreshBalance('all')">
          <div class="label">{{ $t("lang.acct_refresh") }}</div>
        </div>
        <div v-else class="show-sec">
          {{ $t("lang.acct_please_wait_in") }} {{ seconds }}{{ $t("lang.acct_seconds") }}
        </div>
        <div v-if="isTransfer && !isTransferring" class="transferAll common-sm-white-btn" @click="transferOutAll">
          <div class="label">{{ $t("lang.acct_transferallout") }}</div>
        </div>
        <div v-else>{{ $t("lang.acct_transferingout") }}...</div>
      </div>
    </div>
    <!--    <div v-if="isTransfer" class="text-brand q-pa-sm">除了以下平台需要转账，其它游戏平台都无需转账即可游戏</div>-->
    <div class="balance-transfer-button">
      <q-toggle
        v-model="isTransferRef"
        :label="`${$t('lang.acct_autoplatformtransfer')}: ${
          isTransfer ? $t('lang.acct_turnon') : $t('lang.acct_turnoff')
        }`"
        left-label
        @update:model-value="updateAutoTransfer($event)"
        color="positive"
      ></q-toggle>
    </div>
    <q-separator style="margin-bottom: 10px" />
    <div class="transfer-plat-wrapper" :style="isExpanded ? `height: ${transferBox}px` : 'height: 80px;'">
      <div class="transfer-plat-inner">
        <div class="transfer-plat-item" v-for="p in props.platforms" :key="p.id" @click="refreshBalance(p.code)">
          <div class="flex-box flex-justify-space transfer-balance-box">
            <div class="platform-details">
              <div class="name-wrapper">
                <div class="plat-name">{{ p.name }}</div>
              </div>
              <div class="balance-wrapper">
                <span class="text-bold" v-if="p.isLoading">{{ $t("lang.acct_loading") }}...</span>
                <span class="text-bold" v-else-if="p.isTransferring">{{ $t("lang.acct_transferingout") }}...</span>
                <span v-else>
                  {{ store.currency.value }} {{ p.amount ? Number(p.amount).toFixed(2) : (0.0).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- <div
            class="flex-box flex-wrap transfer-action-box"
          >
            <q-form
              ref="formRef"
              :hideRequiredMark="true"
              :model="transferInfo"
              :rules="rules"
              :label-col="{ span: 4 }"
              type="vertical"
            >
               <q-input
                  v-model:value="transferInfo.amount"
                  placeholder="Amount"
                />
            </q-form>
          </div> -->
        </div>
      </div>
    </div>
    <div @click="showPlatform" v-if="!isExpanded" class="showall text-center q-pt-md">
      {{ $t("lang.acct_showallvenues") }}
      <q-icon name="expand_more" />
    </div>
    <div @click="showPlatform" v-if="isExpanded" class="showall text-center q-pt-md">
      {{ $t("lang.acct_hideallvenues") }}
      <q-icon name="expand_less" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isTransfer: Boolean,
  platforms: Array,
  updateAutoTransfer: Function,
  getAutoTransferValue: Function
});
import { ref, reactive, onMounted, watch } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const isLoadingBalance = ref(false);
const isRefreshingBalance = ref(true);
const isTransferring = ref(false);
const seconds = ref(10);
const store = userStore();
const isExpanded = ref(false);
const transferRef = ref();
const transferBox = ref();
const $q = useQuasar();
const qs = require("qs");
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
const showPlatform = () => {
  isExpanded.value = !isExpanded.value;
  transferBox.value = Math.floor(props.platforms.length / 4) * 80;
  if (props.platforms.length % 4 > 0) {
    transferBox.value += 80;
  }
  console.log(transferBox.value);
};

// const loadPlatform = () => {
//     api.get("/platform").then((response) => {
//         const res = response.data
//         res.data.forEach(p => {
//             platforms.push({
//             id: p.id,
//             code: p.code,
//             amount: 0
//             });
//         });
//         refreshBalance('all')
//     })
// };
const loadBalance = () => {
  isLoadingBalance.value = true;
  store.getBalance().then((res) => {
    isLoadingBalance.value = false;
  });
};
const transferOutAll = () => {
  isTransferring.value = true;
  var gotTransfer = false;
  props.platforms.forEach((platform) => {
    platform.isTransferring = true;
    if (platform.code && platform.amount > 0) {
      gotTransfer = true;
      const transferInfo = {
        platform: platform.code,
        amount: platform.amount
      };
      api.post("/session/balance/transfer/withdrawAll", qs.stringify(transferInfo)).then((response) => {
        if (response.code === 0) {
          setTimeout(() => {
            loadBalance();
            refreshBalance(platform.code);
            platform.isTransferring = false;
            isTransferring.value = false;
          }, 1000);
        }
      });
    } else {
      setTimeout(() => {
        platform.isTransferring = false;
        isTransferring.value = false;
      }, 1000);
    }
  });
  if (gotTransfer === true) {
    setTimeout(() => {
      loadBalance();
    }, 3000);
    setTimeout(() => {
      loadBalance();
    }, 5000);
  }
};
const refreshBalance = (plat) => {
  if (plat === "all") {
    isRefreshingBalance.value = true;
    seconds.value = 10;
    setTimer();
    loadBalance();
    props.platforms.forEach((platform) => {
      platform.isLoading = true;
      if (platform.code) {
        api
          .get("/session/balance", { params: { platform: platform.code } })
          .then((res) => {
            if (platform) {
              platform.amount = res.data;
              platform.isLoading = false;
            }
          })
          .catch((e) => {
            // $q.notify({
            // color: "negative",
            // position: "top",
            // message: e.message,
            // icon: "report_problem"
            // })
            platform.isLoading = false;
          });
      }
    });
  } else {
    const platform = props.platforms.find((p) => p.code === plat);
    platform.amount = 0;
    platform.isLoading = true;
    api
      .get("/session/balance", { params: { platform: plat } })
      .then((res) => {
        if (platform) {
          platform.amount = res.data;
          platform.isLoading = false;
        }
      })
      .catch((e) => {
        $q.notify({
          color: "negative",
          position: "top",
          message: e.message,
          icon: "report_problem"
        });
        platform.isLoading = false;
      });
  }
};

const isTransferRef = ref(props.isTransfer);
watch(
  () => props.isTransfer,
  (value) => {
    isTransferRef.value = value;
  }
);

onMounted(() => {
  if (isRefreshingBalance.value) {
    setTimer();
  }

  isExpanded.value = true;
  transferBox.value = 160;
});
</script>
<style scoped lang="scss">
.acct-balances {
  width: $box-width;
  margin: auto;
  background: $white;
  box-shadow: $shadow-bg;
  border-radius: 10px;
  padding: 15px 12px 20px;

  .top-balance {
    padding: 0 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: $font-1;

    .mainbal {
      border-right: 1px solid #c8c7cc;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      flex: 1;
      gap: 4px;

      .icon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        font-size: 1rem;

        img {
          width: 20px;
        }
      }

      .wallet {
        .balamt {
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
    }

    .refreshItems {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;

      .show-sec {
        white-space: nowrap;
      }

      .refreshAll {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;

        .icon {
          width: 23px;

          img {
            width: 100%;
          }
        }
      }

      .transferAll {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;

        .icon {
          width: 23px;

          img {
            width: 100%;
          }
        }
      }
    }
  }

  .transfer-plat-wrapper {
    transition: height 1s;
    height: 80px;
    overflow: hidden;
    text-align: center;

    .transfer-plat-inner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      width: 100%;

      .transfer-plat-item {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border-bottom: 1px solid #606e7b;

        .platform-details {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          .name-wrapper {
            word-break: break-all;
            color: $dark;

            .plat-name {
              overflow: hidden;
              height: 25px;
              font-size: 1rem;
            }
          }

          .balance-wrapper {
            color: $primary;
            font-size: 1rem;
          }
        }
      }
    }
  }

  .showall {
    border-top: 1px solid #c8c7cc;
    cursor: pointer;
    color: $font-1;
    font-size: 1rem;
  }
}

.balance-transfer-button {
  display: flex;
  justify-content: flex-end;

  .q-toggle__inner--truthy {
    color: #13ce66;
  }
  .q-toggle__inner {
    color: #ff4949;
  }
}
</style>
