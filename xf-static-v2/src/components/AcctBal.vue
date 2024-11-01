<template>
  <div class="acct-balances bg-dark q-ma-sm q-pa-sm">
    <div class="top-balance">
      <div class="top-mainbal">
        <div class="mainbal">
          <div class="icon">
            <img src="../assets/images/finance/icon-wallet.png" />
          </div>
          <div class="label">中心钱包</div>
        </div>
        <div class="wallet">
          <div class="balamt text-white" @click="loadBalance">
            <span v-if="!isLoadingBalance">{{ store.currency.value }}{{ store.balance.toFixed(2) }}</span>
            <span v-if="isLoadingBalance">加载中...</span>
          </div>
        </div>
      </div>

      <div class="refreshItems row q-gutter-x-md">
        <q-btn color="brightbtn" @click="refreshBalance('all')" :disable="isRefreshingBalance">
          <template v-if="!isRefreshingBalance">刷新余额</template>
          <template v-else>请稍等{{ seconds }}秒</template>
        </q-btn>
        <q-btn @click="transferOutAll" color="orangebtn" :disable="isTransferring">
          <template v-if="!isTransferring">一键转出</template>
          <template v-else>转出中...</template>
        </q-btn>
      </div>
    </div>

    <div class="toggle-container q-mt-md">
      <div class="balance-transfer-button">
        自动平台转账:
        <q-toggle
          v-model="isTransferRef"
          class="wtf"
          :label="` ${isTransfer ? '已开启' : '已关闭'}`"
          left-label
          @update:model-value="updateAutoTransfer($event)"
          color="blue"
        ></q-toggle>
      </div>
      <q-separator />
      <div class="balance-transfer-note q-pt-sm">除了以下平台需要转账，其它游戏平台都无需转账即可游戏</div>
      <div class="transfer-plat-wrapper" :style="isExpanded ? `height: ${transferBox}px` : 'height: 80px;'">
        <div class="transfer-plat-inner">
          <div class="transfer-plat-item" v-for="p in props.platforms" :key="p.id" @click="refreshBalance(p.code)">
            <div class="flex-box flex-justify-space transfer-balance-box">
              <div class="platform-details">
                <div class="name-wrapper">
                  <div class="plat-name">{{ p.name }}</div>
                </div>
                <div class="balance-wrapper">
                  <span class="text-bold" v-if="p.isLoading">加载中...</span>
                  <span class="text-bold" v-else-if="p.isTransferring">转出中...</span>
                  <span v-else>
                    {{ store.currency.value }}
                    {{ p.amount ? Number(p.amount).toFixed(2) : (0.0).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @click="showPlatform" v-if="!isExpanded" class="showall text-center text-brand q-pt-md">
        显示所有场馆
        <q-icon name="expand_more" />
      </div>
      <div @click="showPlatform" v-if="isExpanded" class="showall text-center text-brand q-pt-md">
        收起所有场馆
        <q-icon name="expand_less" />
      </div>
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
});
</script>

<style scoped lang="scss">
.acct-balances {
  .top-balance {
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
    border-radius: 6px;

    .wallet {
      padding-top: 6px;
      font-size: 16px;
    }

    .mainbal {
      display: flex;
      align-items: center;
      gap: 6px;

      .icon {
        width: 16px;

        img {
          width: 100%;
          display: block;
        }
      }

      .label {
        color: rgba(255, 255, 255, 0.6);
        padding: 0;
        margin: 0;
        line-height: 1;
      }
    }

    .refreshItems {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      // align-items: center;
      // flex-direction: column;

      .refreshAll {
        // display: flex;
        // justify-content: center;
        // align-items: center;
        // gap: 15px;
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

  .toggle-container {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
    border-radius: 6px;

    .balance-transfer-note {
      width: 100%;
      color: rgba(255, 255, 255, 0.6);
    }

    .balance-transfer-button {
      margin: -12px 0 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .q-toggle__inner--truthy {
        color: #00bfd7;
      }
      .q-toggle__inner {
        color: #ff4949;
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
            // color: #bacef1;

            .plat-name {
              overflow: hidden;
              height: 25px;
            }
          }

          .balance-wrapper {
            color: #33bcd4;
          }
        }
      }
    }
  }

  .showall {
    border-top: 1px solid #c8c7cc;
    cursor: pointer;
  }
}
</style>
