<template>
  <div class="acct-balances q-ma-sm q-pa-sm">
    <div class="top-balance">
      <div class="mainbal">
        <!--        <div class="icon">-->
        <!--          <img src="../assets/images/finance/withdraw/wallet.png"/>-->
        <!--        </div>-->
        <div class="wallet">
          <div class="label">我的钱包</div>
          <div class="wallet-amt-div row justify-between items-center">
            <div class="balamt text-dark" @click="loadBalance">
              <span v-if="!isLoadingBalance">{{ store.currency.value }}{{ store.balance.toFixed(2) }}</span>
              <span v-if="isLoadingBalance">加载中...</span>
            </div>
            <div @click="loadBalance" class="icon">
              <!--              <q-icon name="refresh" ></q-icon>-->
              <img src="../assets/account/finance/refresh-icon.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="refreshItems">
        <div v-if="!isRefreshingBalance" class="refreshAll" @click="refreshBalance('all')">
          <div class="icon">
            <img src="../assets/account/finance/refresh-btn-blue.png" />
          </div>
          <div class="label">一键刷新</div>
        </div>
        <div class="refreshAll" v-else>请稍等{{ seconds }}秒</div>
        <div v-if="!isTransferring" class="transferAll" @click="transferOutAll">
          <div class="icon">
            <img src="../assets/images/finance/withdraw/transfer_icon.png" />
          </div>
          <div class="label">一键转出</div>
        </div>
        <div class="transferAll" v-else>转出中...</div>
      </div>
    </div>

    <div class="text-grey-8 q-pa-sm text-center">除了以下平台需要转账，其它游戏平台都无需转账即可游戏</div>
    <div class="balance-transfer-button">
      <q-toggle
        v-model="isTransferRef"
        class="wtf"
        :label="`自动平台转账: ${isTransfer ? '已开启' : '已关闭'}`"
        left-label
        @update:model-value="updateAutoTransfer($event)"
        color="positive"
      ></q-toggle>
    </div>
    <q-separator style="margin-bottom: 10px" />
    <div class="transfer-plat-wrapper" :style="isExpanded ? `height: auto;` : 'height: 80px;'">
      <div class="transfer-plat-inner">
        <div class="transfer-plat-item" v-for="p in props.platforms" :key="p.id" @click="refreshBalance(p.code)">
          <div class="flex-box flex-justify-space transfer-balance-box">
            <div class="platform-details">
              <div class="name-wrapper">
                <div class="plat-name">{{ platformNames[p.code] }}</div>
              </div>
              <div class="balance-wrapper">
                <span class="text-bold row justify-center items-center gap-5 no-wrap" v-if="p.isLoading">
                  <img style="margin-bottom: 5px; width: 14px" src="../assets/account/finance/refresh-btn-blue.png" />
                  加载中...
                </span>
                <span class="text-bold" v-else-if="p.isTransferring">转出中...</span>
                <span class="text-bold" v-else>
                  {{ store.currency.value }}
                  {{ p.amount ? Number(p.amount).toFixed(2) : (0.0).toFixed(2) }}
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
    <div @click="showPlatform" v-if="!isExpanded" class="showall text-center text-blue-6 q-pt-md">
      显示所有场馆
      <q-icon name="expand_more" />
    </div>
    <div @click="showPlatform" v-if="isExpanded" class="showall text-center text-blue-6 q-pt-md">
      收起所有场馆
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
const seconds = ref(5);
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
const platformNames = {
  AG: "PA",
  BBINDY: "BBIN",
  KY: "开元棋牌",
  LEG: "乐游棋牌",
  DT: "大唐棋牌",
  TCG: "TCG彩票",
  SGWin: "双赢彩票",
  PT: "PT电子",
  PG: "PG电子",
  AGF: "PA捕鱼",
  PMFISH: "DB捕鱼"
};
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
    seconds.value = 5;
    // setTimer();
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
  //background: ;

  .top-balance {
    padding: 0 0 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #000000;

    .mainbal {
      //border-right: 1px solid #c8c7cc;
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      flex: 1;
      gap: 15px;

      .icon {
        width: 20px;
        margin-right: 16px;

        &:active {
          filter: brightness(0.85);
        }

        img {
          width: 100%;
        }
      }

      .wallet {
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid #c2c2c2;
        border-radius: 12px;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 6px;
        padding: 10px 20px 12px;

        .wallet-amt-div {
          width: 100%;
          background: #d9d9d950;
          padding: 8px 6px;
          border-radius: 50px;
          height: 40px;
          align-items: center;
        }

        .balamt {
          margin-left: 6px;
          font-size: 19px;
          font-weight: bold;

          span {
            color: #000;
          }
        }

        .label {
          font-weight: 600;
          font-size: 16px;
        }
      }
    }

    .refreshItems {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      margin: 8px auto 8px;
      width: 100%;
      font-weight: 600;
      font-size: 16px;

      .refreshAll {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        width: 50%;

        .label {
          font-weight: 600;
          font-size: 16px;
        }

        .icon {
          width: 25px;
          height: 25px;

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
        width: 50%;

        .label {
          font-weight: 600;
          font-size: 16px;
        }

        .icon {
          width: 25px;
          height: 25px;

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
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      .transfer-balance-box {
        flex: 1;
        padding: 5px;
      }
      .transfer-plat-item {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        .platform-details {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border: 1px solid #c2c2c2;
          padding: 10px 20px;
          border-radius: 12px;

          .name-wrapper {
            word-break: break-all;

            .plat-name {
              color: #000;
              overflow: hidden;
              height: 25px;
              font-weight: 700;
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
    border-bottom: 1px solid #c8c7cc;
    cursor: pointer;
    font-size: 16px;
    padding-bottom: 12px;
  }
}

@media (max-width: 440px) {
  .acct-balances .transfer-plat-wrapper .transfer-plat-inner {
    grid-template-columns: repeat(3, 1fr);

    .transfer-plat-item {
      .platform-details {
        padding: 10px 10px;
      }
    }
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
