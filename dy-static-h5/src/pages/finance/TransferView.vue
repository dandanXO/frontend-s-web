<template>
  <div>
    <AcctBal :isTransfer="autoTransfer" :platforms="platforms" :updateAutoTransfer="updateAutoTransferState" />
    <div v-if="!autoTransfer" class="q-pa-md transfer-section q-mx-sm q-my-md">
      <q-form ref="transferFormRef">
        <div class="transferfromto q-mb-md">
          <q-select
            hide-bottom-space
            outlined
            dense
            v-model="transferFrom"
            option-value="id"
            emit-value
            color="blue"
            bg-color="white"
            :options="transferFromOpt"
            map-options
            @update:model-value="updateTransferDropdown"
          />
          <div class="icon">
            <img src="../../assets/account/finance/rewind-icon.png" />
          </div>
          <q-select
            hide-bottom-space
            outlined
            dense
            v-model="transferTo"
            option-value="id"
            emit-value
            color="blue"
            bg-color="white"
            :options="transferToOpt"
            map-options
            @update:model-value="updateTransferDropdown"
          />
        </div>
        <div class="transferamounts q-my-md">
          <div class="val" v-for="(amt, i) in amounts" :key="i" @click="transferInfo.amount = amt">
            {{ amt }}
          </div>
        </div>

        <label class="">金额</label>
        <q-input
          hide-bottom-space
          ref="amountRef"
          v-model="transferInfo.amount"
          placeholder="0.00"
          clearable
          color="white"
          :rules="[(val) => !!val || '请输入转账金额']"
        >
          <template v-slot:prepend>
            <span style="font-size: 26px" class="text-bright">{{ store.currency.value }}</span>
          </template>
          <template v-slot:append>
            <q-btn label="最大金额" @click="updateTransferAmt" color="dyblue" />
          </template>
        </q-input>

        <q-btn color="dygreen" class="q-mt-md fit" @click="submitTransfer" label="立即转账" :loading="isTransferring" />
      </q-form>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { userStore } from "../../stores/index";
import AcctBal from "../../components/AcctBal.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

components: {
  AcctBal;
}
const store = userStore();
const $q = useQuasar();
const transferFrom = ref("main");
const transferTo = ref("");
const amountRef = ref();
const transferFormRef = ref();
const platforms = reactive([]);
const transferInfo = ref({
  amount: ""
});
const qs = require("qs");
const transferFromOpt = ref([]);
const transferToOpt = ref([]);
const platformNames = {
  AG: "AG",
  BBINDY: "BBIN",
  KY: "开元棋牌",
  DT: "大唐棋牌",
  LEG: "乐游棋牌",
  TCG: "TCG彩票",
  SGWin: "双赢彩票",
  PT: "PT电子",
  PG: "PG电子",
  AGF: "PA捕鱼"
};

const updateTransferDropdown = () => {
  if (transferFrom.value !== "main") {
    transferToOpt.value = [
      {
        id: "main",
        value: "中心钱包",
        label: "中心钱包"
      }
    ];
    transferTo.value = "main";
  } else {
    transferFromOpt.value = [
      {
        id: "main",
        value: "中心钱包",
        label: "中心钱包"
      }
    ];
    transferToOpt.value = [];
    platforms.forEach((plat) => {
      var obj = {
        id: plat.id,
        label: platformNames[plat.code]
      };
      transferToOpt.value.push(obj);
      transferFromOpt.value.push(obj);
    });
    if (!transferTo.value || transferTo.value === "main") {
      transferTo.value = platforms[0].id;
    }
  }
};
const isTransferring = ref(false);
const submitTransfer = () => {
  amountRef.value.validate();
  if (amountRef.value.hasError) {
    return;
  }
  isTransferring.value = true;
  if (transferInfo.value.amount > 0) {
    if (transferFrom.value === "main") {
      platforms.forEach((platform) => {
        if (platform.id === transferTo.value) {
          if (platform.code) {
            const obj = {
              platform: platform.code,
              amount: transferInfo.value.amount
            };
            api
              .post("/session/balance/transfer/deposit", qs.stringify(obj))
              .then((response) => {
                if (response.code === 0) {
                  setTimeout(() => {
                    $q.notify({
                      color: "positive",
                      position: "top",
                      message: "成功",
                      icon: "check_circle_outline"
                    });
                    getPlatBalances(platform.code);
                    store.getBalance();
                    transferInfo.value.amount = null;
                    transferFormRef.value.reset();
                    isTransferring.value = false;
                  }, 1000);
                }
              })
              .catch((error) => {
                isTransferring.value = false;
              });
          }
        }
      });
    } else {
      platforms.forEach((platform) => {
        if (platform.id === transferFrom.value) {
          if (platform.code) {
            const obj = {
              platform: platform.code,
              amount: transferInfo.value.amount
            };
            api
              .post("/session/balance/transfer/withdraw", qs.stringify(obj))
              .then((response) => {
                if (response.code === 0) {
                  setTimeout(() => {
                    $q.notify({
                      color: "positive",
                      position: "top",
                      message: "成功",
                      icon: "check_circle_outline"
                    });
                    getPlatBalances(platform.code);
                    store.getBalance();
                    transferInfo.value.amount = 0;
                    isTransferring.value = false;
                  }, 1000);
                }
              })
              .catch((error) => {
                isTransferring.value = false;
              });
          }
        }
      });
    }
  } else {
    isTransferring.value = false;
  }
};
const updateTransferAmt = () => {
  transferInfo.value.amount = JSON.stringify(Math.floor(store.balance));
  platforms.forEach((plat) => {
    if (transferFrom.value === plat.id) {
      transferInfo.value.amount = plat.amount;
    }
  });
};
const getPlatList = () => {
  api.get("/platform").then((res) => {
    res.data.forEach((p) => {
      if (p.walletType !== "SEAMLESS") {
        platforms.push({
          id: p.id,
          code: p.code,
          amount: 0
        });
        getPlatBalances(p.code);
      }
    });
    updateTransferDropdown();
  });
};
const getPlatBalances = (plat) => {
  const platform = platforms.find((p) => p.code === plat);
  api
    .get("/session/balance", {
      params: {
        platform: plat
      }
    })
    .then((res) => {
      if (platform) {
        platform.amount = res.data.toFixed(2);
      }
    })
    .catch((e) => {
      platform.isLoading = false;
    });
};
const amounts = [50, 100, 500, 1000, 2000, 5000];

const autoTransfer = ref(false);
const getAutoTransferState = () => {
  api.get("/session/getAutoTransferState", {}).then((res) => {
    autoTransfer.value = res.data;
  });
};

const updateAutoTransferState = (value) => {
  api.put(`/session/updateAutoTransferState/${value}`, {}).then((res) => {
    autoTransfer.value = res.data;
  });
};

onMounted(() => {
  store.getBalance();
  getPlatList();
  getAutoTransferState();
});
</script>
<style lang="scss">
.transfer-section {
  //background: #edeef4;

  .bigamount-btn {
    background: linear-gradient(180deg, #52acff 0%, #3559da 100%);
    height: 45px;
    width: 100px;
  }

  .transferfromto {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    .q-select {
      flex: 4;
    }

    .icon {
      flex: 1;

      img {
        width: 50%;
        margin: 0 auto;
        display: block;
      }
    }

    .q-field--auto-height .q-field__native,
    .q-field--auto-height .q-field__prefix,
    .q-field--auto-height .q-field__suffix {
      justify-content: center;
    }

    .q-field--dark .q-field__control:before {
      background: #505771;
      border: 0px solid;
    }

    .q-field__after,
    .q-field__append {
      padding: 0;
    }
  }

  .transferamounts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 15px;
    column-gap: 20px;
    font-size: 20px;
    line-height: 20px;
    color: #bacef1;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;

    .val {
      cursor: pointer;
      background: #d7d7d7;
      color: #000;
      font-size: 16px;
      padding: 5px 10px;
      height: 35px;
      line-height: 25px;
      font-weight: 600;
      border-radius: 15px;
      text-align: center;

      &:active {
        filter: brightness(0.85);
      }
    }
  }

  .transfer-btn {
    height: 48px;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    letter-spacing: 1px;
    background: linear-gradient(180deg, #58db8c, #0d932b);
  }
}
</style>
