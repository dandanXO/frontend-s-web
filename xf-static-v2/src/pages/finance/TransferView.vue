<template>
  <div>
    <AcctBal :isTransfer="autoTransfer" :platforms="platforms" :updateAutoTransfer="updateAutoTransferState" />
    <div class="q-px-md" v-if="!autoTransfer">
      <div class="transfer-wrapper">
        <q-form ref="transferFormRef">
          <div class="transferfromto q-mb-md">
            <q-select
              hide-bottom-space
              dense
              v-model="transferFrom"
              option-value="id"
              emit-value
              :options="transferFromOpt"
              map-options
              @update:model-value="updateTransferDropdown"
              outlined
              color="white"
              bg-color="recinputstyle"
            />
            <div class="icon">
              <img src="../../assets/images/finance/withdraw/arrow_right.png" />
            </div>
            <q-select
              hide-bottom-space
              dense
              v-model="transferTo"
              option-value="id"
              emit-value
              :options="transferToOpt"
              map-options
              @update:model-value="updateTransferDropdown"
              outlined
              color="white"
              bg-color="recinputstyle"
            />
          </div>
          <div class="transferamounts q-my-md">
            <div class="val" v-for="(amt, i) in amounts" :key="i" @click="transferInfo.amount = amt">
              {{ amt }}
            </div>
          </div>

          <q-input
            hide-bottom-space
            ref="amountRef"
            v-model="transferInfo.amount"
            label="金额"
            clearable
            :rules="[(val) => !!val || '请输入转账金额']"
            @click="clearInput"
            outlined
            color="white"
            bg-color="recinputstyle"
          >
            <template v-slot:prepend>
              <span style="font-size: 26px" class="text-bright">
                {{ store.currency.value }}
              </span>
            </template>
            <template v-slot:append>
              <span style="font-size: 26px" class="text-bright">
                <q-btn label="最大金额" @click="updateTransferAmt" color="brightbtn" />
              </span>
            </template>
          </q-input>

          <q-btn
            style="width: 100%"
            class="q-mt-md fit"
            color="brightbtn"
            @click="submitTransfer"
            label="立即转账"
            :loading="isTransferring"
          />
        </q-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { userStore } from "../../stores/index";
import AcctBal from "../../components/AcctBal.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { translateRecord } from "src/directives/translate";

components: {
  AcctBal;
}
const store = userStore();
const $q = useQuasar();
const transferFrom = ref("main");
const transferTo = ref("");
const platforms = reactive([]);
const amountRef = ref();
const transferFormRef = ref();
const transferInfo = ref({
  amount: 0
});
const clearInput = () => {
  if (transferInfo.value.amount === 0) {
    transferInfo.value.amount = "";
  }
};
const qs = require("qs");
const transferFromOpt = ref([]);
const transferToOpt = ref([]);
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
        label: plat.name
      };
      transferToOpt.value.push(obj);
      transferFromOpt.value.push(obj);
    });
    if (!transferTo.value || transferTo.value === "main") {
      transferTo.value = platforms[0].id;
    }
  }
  // if (transferFrom.value === 'main') {
  //   transferToOpt.value = []
  // } else {
  //   platforms.forEach(plat => {
  //     var obj = {
  //       id: plat.id,
  //       label: plat.code
  //     }
  //     transferFromOpt.value.push(obj)
  //     transferToOpt.value.push(obj)
  //   });
  // }
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
              name: platform.name,
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
                      message: "转账成功",
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
  if (store.memberType === "TEST") {
    api.get("/session/loggedInPlatform").then((res) => {
      res.data.forEach((p) => {
        if (p.walletType !== "SEAMLESS") {
          platforms.push({
            id: p.id,
            code: p.code,
            name: translateRecord(p.name),
            amount: 0
          });
          getPlatBalances(p.code);
        }
      });
      updateTransferDropdown();
    });
  } else {
    api.get("/platform").then((res) => {
      res.data.forEach((p) => {
        if (p.walletType !== "SEAMLESS") {
          platforms.push({
            id: p.id,
            code: p.code,
            name: translateRecord(p.name),
            amount: 0
          });
          getPlatBalances(p.code);
        }
      });
      updateTransferDropdown();
    });
  }
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
      // $q.notify({
      // color: "negative",
      // position: "top",
      // message: e.message,
      // icon: "report_problem"
      // })
      platform.isLoading = false;
    });
};
const amounts = [100, 500, 1000, 2000, 5000];

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
.transferfromto {
  // .q-field--auto-height .q-field__native,
  // .q-field--auto-height .q-field__prefix,
  // .q-field--auto-height .q-field__suffix {
  //   justify-content: center;
  // }

  // .q-field--dark .q-field__control:before {
  //   background: #505771;
  //   border: 0px solid;
  // }

  // .q-field__after,
  // .q-field__append {
  //   padding: 0;
  // }
}
</style>
<style lang="scss" scoped>
.transfer-wrapper {
  padding: 16px;
  background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
  border-radius: 6px;
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
      width: 100%;
      margin: 0 auto;
      display: block;
      max-width: 24px;
    }
  }
}

.transferamounts {
  display: flex;
  font-size: 20px;
  line-height: 20px;
  font-size: 10px;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  gap: 12px;

  .val {
    cursor: pointer;
    border: 1px solid transparent;
    padding: 5px 8px;
    border-radius: 5px;
    text-align: center;
    background: #273354;
    width: 100%;
  }
}
</style>
