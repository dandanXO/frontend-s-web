<template>
  <div class="acct-balances bg-dark q-ma-sm q-pa-sm">
    <div class="top-balance">
      <div class="mainbal">
        <div class="icon">
          <img src="../assets/images/finance/withdraw/wallet.png">
        </div>
        <div class="wallet">
          <div class="label">中心钱包</div>
          <div class="balamt text-bright" @click="loadBalance"><span v-if="!isLoadingBalance"> {{
              store.currency.value
            }}{{ store.balance.toFixed(2) }}</span><span v-if="isLoadingBalance">加载中...</span></div>

        </div>
      </div>
      <div class="refreshItems">
        <div v-if="!isRefreshingBalance" class="refreshAll" @click="refreshBalance('all')">
          <div class="icon">
            <img src="../assets/images/finance/withdraw/refresh.png">
          </div>
          <div class="label">
            一键刷新
          </div>
        </div>
        <div v-else>请稍等{{ seconds }}秒</div>
        <div v-if="isTransfer && !isTransferring" class="transferAll" @click="transferOutAll">
          <div class="icon">
            <img src="../assets/images/finance/withdraw/transfer_icon.png">
          </div>
          <div class="label">
            一键转出
          </div>
        </div>
        <div v-else>转出中...</div>
      </div>
    </div>
    <div v-if="isTransfer" class="text-brand q-pa-sm">
      除了以下平台需要转账，其它游戏平台都无需转账即可游戏
    </div>
    <q-separator/>
    <div class="transfer-plat-wrapper" :style="isExpanded ? `height: ${transferBox}px` : 'height: 80px;'">
      <div class="transfer-plat-inner">
        <div
            class="transfer-plat-item"
            v-for="(p) in props.platforms"
            :key="p.id"
            @click="refreshBalance(p.code)"
        >
          <div class="flex-box flex-justify-space transfer-balance-box">
            <div class="platform-details">
              <div class="name-wrapper">
                <div class="plat-name">{{ p.name }}</div>
              </div>
              <div class="balance-wrapper">
                    <span class="text-bold" v-if="p.isLoading">
                        加载中...
                    </span>
                <span class="text-bold" v-else-if="p.isTransferring">
                        转出中...
                    </span>
                <span v-else>
                      {{ store.currency.value }} {{ p.amount ? Number(p.amount).toFixed(2) : 0.00.toFixed(2) }}
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
    <div @click="showPlatform" v-if="!isExpanded" class="showall text-center text-brand q-pt-md">
      显示所有场馆
      <q-icon name="expand_more"/>
    </div>
    <div @click="showPlatform" v-if="isExpanded" class="showall text-center text-brand q-pt-md">
      收起所有场馆
      <q-icon name="expand_less"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isTransfer: Boolean,
  platforms: Array
})
import {ref, reactive, onMounted} from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {useQuasar} from "quasar";

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
      seconds.value--
    } else {
      isRefreshingBalance.value = false
    }
    setTimer()
  }, 1000);
}
const showPlatform = () => {
  isExpanded.value = !isExpanded.value
  transferBox.value = (Math.floor(props.platforms.length / 4)) * 80
  if ((props.platforms.length % 4) > 0) {
    transferBox.value += 80
  }
  console.log(transferBox.value)
}

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
  isLoadingBalance.value = true
  store.getBalance().then((res) => {
    isLoadingBalance.value = false
  })
}
const transferOutAll = () => {
  isTransferring.value = true;
  var gotTransfer = false;
  props.platforms.forEach(platform => {
    platform.isTransferring = true;
    if (platform.code && platform.amount > 0) {
      gotTransfer = true;
      const transferInfo = {
        platform: platform.code,
        amount: platform.amount
      }
      api.post("/session/balance/transfer/withdrawAll", qs.stringify(transferInfo)).then((response) => {
        if (response.code === 0) {
          setTimeout(() => {
            loadBalance();
            refreshBalance(platform.code)
            platform.isTransferring = false;
            isTransferring.value = false;
          }, 1000);
        }
      })
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

}
const refreshBalance = (plat) => {
  if (plat === 'all') {
    isRefreshingBalance.value = true
    seconds.value = 10
    setTimer();
    loadBalance()
    props.platforms.forEach(platform => {
      platform.isLoading = true;
      if (platform.code) {
        api.get('/session/balance', {params: {platform: platform.code}}).then((res) => {
          if (platform) {
            platform.amount = res.data;
            platform.isLoading = false;
          }
        }).catch((e) => {
              // $q.notify({
              // color: "negative",
              // position: "top",
              // message: e.message,
              // icon: "report_problem"
              // })
              platform.isLoading = false;
            }
        );

      }
    });
  } else {
    const platform = props.platforms.find(p => p.code === plat);
    platform.amount = 0;
    platform.isLoading = true;
    api.get('/session/balance', {params: {platform: plat}}).then((res) => {
      if (platform) {
        platform.amount = res.data;
        platform.isLoading = false;
      }
    }).catch((e) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: e.message,
            icon: "report_problem"
          })
          platform.isLoading = false;

        }
    );
  }
};
onMounted(() => {
  if (isRefreshingBalance.value) {
    setTimer()
  }
})
</script>
<style scoped lang="scss">

.acct-balances {
  .top-balance {
    padding: 0 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #bacef1;

    .mainbal {
      border-right: 1px solid #c8c7cc;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      gap: 15px;

      .icon {
        width: 25px;

        img {
          width: 100%;
        }
      }

      .wallet {
        .balamt {
          font-size: 16px;
          font-weight: bold;
        }
      }

    }

    .refreshItems {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

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
            color: #bacef1;

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
  ;
  }

  .showall {
    border-top: 1px solid #c8c7cc;
    cursor: pointer;
  }
}
</style>
