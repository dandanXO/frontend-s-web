<template>
  <q-page class="transfer-container">
    <div class="account-tabs-div">
      <div class="account-item is-active">
        <span>{{ $t("lang.transfer_transfer") }}</span>
      </div>
      <router-link to="/finance/deposit?redirect=account/transfer">
        <div class="account-item">
          <span>{{ $t("lang.transfer_deposit") }}</span>
        </div>
      </router-link>
      <router-link to="/finance/withdraw?redirect=account/transfer">
        <div class="account-item">
          <span>{{ $t("lang.transfer_withdraw") }}</span>
        </div>
      </router-link>
    </div>

    <div class="transfer-mid-div">
      <div class="station-notice-wrapper" @click="showAnnouncementDialog">
        <div class="volume">
          <img src="../../assets/images/home/announce-icon.png" />
        </div>
        <marquee-text :repeat="5" :duration="announcementList.length * 10">
          <div v-if="announcementList">
            <span v-for="(announcement, i) in announcementList" :key="i">
              {{ announcement }}
            </span>
          </div>
        </marquee-text>
      </div>
    </div>

    <AcctBal :isTransfer="autoTransfer" :platforms="platforms" :updateAutoTransfer="updateAutoTransferState" />

    <div class="transfer-tab-section q-pa-md q-mx-sm q-my-md" v-if="!autoTransfer">
      <q-form ref="transferFormRef">
        <div class="transferfromto q-mb-md">
          <!-- <q-select
            hide-bottom-space
            rounded
            outlined
            dense
            v-model="transferFrom"
            option-value="id"
            emit-value
            :options="transferFromOpt"
            map-options
            @update:model-value="updateTransferDropdown"
          /> -->
          <q-select
            ref="transferFormRef"
            class="q-mb-md"
            filled
            label-color="grey"
            v-model="transferFrom"
            :options="transferFromOpt"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            @update:model-value="updateTransferDropdown"
          >
            <template v-slot:selected-item="scope">
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                  {{ scope.opt.label }}
                </q-item-label>
              </q-item-section>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    :src="
                      require(`../../assets/images/home/${scope.opt.type.toLowerCase()}/logo-${scope.opt.code.toLowerCase()}.png`)
                    "
                    :style="
                      scope.opt.type === 'main'
                        ? 'width: 15px; margin: 10px 10px 10px 5px;'
                        : 'width: 30px; margin-top: 10px; margin-bottom: 10px;'
                    "
                  />
                  <!-- <img v-if="scope.opt.bankIcon" style="width: 30px; margin-top: 10px; margin-bottom: 10px;" :src="imgURL + scope.opt.bankIcon"> -->
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <div class="icon">
            <img src="../../assets/images/account/transfer-arrow.png" />
          </div>
          <!-- <q-select
            hide-bottom-space
            rounded
            outlined
            dense
            v-model="transferTo"
            option-value="id"
            emit-value
            :options="transferToOpt"
            map-options
            @update:model-value="updateTransferDropdown"
          /> -->

          <q-select
            class="q-mb-md"
            filled
            label-color="grey"
            v-model="transferTo"
            :options="transferToOpt"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            @update:model-value="updateTransferDropdown"
          >
            <template v-slot:selected-item="scope">
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                  {{ scope.opt.label }}
                </q-item-label>
              </q-item-section>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    :src="
                      require(`../../assets/images/home/${scope.opt.type.toLowerCase()}/logo-${scope.opt.code.toLowerCase()}.png`)
                    "
                    :style="
                      scope.opt.type === 'main'
                        ? 'width: 15px; margin: 10px 10px 10px 5px;'
                        : 'width: 30px; margin-top: 10px; margin-bottom: 10px;'
                    "
                  />
                  <!-- <img v-if="scope.opt.bankIcon" style="width: 30px; margin-top: 10px; margin-bottom: 10px;" :src="imgURL + scope.opt.bankIcon"> -->
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="transferamounts q-my-md">
          <template v-for="(amt, i) in amounts" :key="i">
            <div
              class="val common-sm-white-btn"
              :class="transferInfo.amount == amt ? 'common-sm-btn' : ''"
              @click="transferInfo.amount = amt"
            >
              {{ amt }}
            </div>
          </template>
        </div>

        <div class="transfer-amt-div">
          <q-input
            hide-bottom-space
            ref="amountRef"
            v-model="transferInfo.amount"
            :placeholder="$t('lang.enter_transfer_amount')"
            clearable
            class="transfer-amt-input"
            color="white"
            :rules="[(val) => !!val || $t('lang.enter_transfer_amount')]"
            @click="clearInput"
          >
            <template v-slot:prepend>
              <span style="font-size: 1.5rem; color: #000">
                {{ store.currency.value }}
              </span>
            </template>
          </q-input>

          <q-btn
            class="common-md-white-btn"
            style="white-space: nowrap"
            :label="$t('lang.acct_maxamount')"
            no-caps
            @click="updateTransferAmt"
          />
        </div>

        <q-btn
          style="width: 100%"
          class="transfer-btn common-large-btn"
          color="brightbtn"
          @click="submitTransfer"
          no-caps
          :label="$t('lang.acct_transfernow')"
          :loading="isTransferring"
        />
      </q-form>
    </div>
  </q-page>
  <q-dialog width="100%" class="modal-common-div" v-model="isShowAnnouncementDialog" full-width>
    <q-card class="q-pa-md modal-content">
      <div class="headers">
        <div class="titles">{{ $t("lang.transfer_announcementhead") }}</div>
        <!-- <q-btn class="color-font-1" flat v-close-popup round dense icon="close" /> -->
      </div>
      <div class="contents" v-for="(announcement, i) in announcementList" :key="i">
        {{ announcement }}
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { userStore } from "../../stores/index";
import AcctBal from "../../components/AcctBal.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { translateRecord } from "src/directives/translate";
import MarqueeText from "vue-marquee-text-component";
import { useI18n } from "vue-i18n";

components: {
  AcctBal;
}
const store = userStore();
const $q = useQuasar();
const { t } = useI18n();
const transferFrom = ref("main");
const transferTo = ref("");
const platforms = reactive([]);
const amountRef = ref();
const transferFormRef = ref();
const announcementList = ref([t("lang.transfer_announcement")]);
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
        label: t("lang.acct_mainaccount"),
        code: "main",
        type: "main"
      }
    ];
    transferTo.value = "main";
  } else {
    transferFromOpt.value = [
      {
        id: "main",
        value: "中心钱包",
        label: t("lang.acct_mainaccount"),
        code: "main",
        type: "main"
      }
    ];
    transferToOpt.value = [];
    platforms.forEach((plat) => {
      // console.log(plat);

      var obj = {
        id: plat.id,
        label: plat.name,
        code: plat.code,
        type: plat.type
      };
      transferToOpt.value.push(obj);
      transferFromOpt.value.push(obj);
    });

    console.log(transferFromOpt.value);

    if (!transferTo.value || transferTo.value === "main") {
      transferTo.value = platforms[0].id;
    }
  }
};
const isTransferring = ref(false);
const isShowAnnouncementDialog = ref(false);
const showAnnouncementDialog = () => {
  isShowAnnouncementDialog.value = true;
};
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
  api.get("/session/loggedInPlatform").then((res) => {
    res.data.forEach((p) => {
      if (p.walletType !== "SEAMLESS") {
        platforms.push({
          id: p.id,
          code: p.code,
          name: translateRecord(p.name),
          type: p.gameType,
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
<style scoped lang="scss">
.transferfromto {
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

.transferfromto {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  .q-select {
    flex: 4;
    background-image: url("../../assets/images/common/common-md-btn.png");
    background-size: 100% 100%;
    //aspect-ratio: 286/96;
    max-height: 56px;
  }

  .icon {
    flex: 1;

    img {
      width: 100%;
      margin: 0 auto;
      display: block;
    }
  }
}

.transferamounts {
  display: flex;
  font-size: 20px;
  line-height: 20px;
  color: #bacef1;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  gap: 5px;

  .val {
    cursor: pointer;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.transfer-amt-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.transfer-amt-input {
  background: $bg-blue;
  border-radius: 10px;
  padding-left: 8px;
  padding-right: 8px;
  flex: 2;
}

.account-tabs-div {
  cursor: pointer;
  gap: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: $box-width;
  padding: 1rem 0.9rem 1rem;
  margin: 10px auto;
  background: $white;
  box-shadow: $shadow-bg;
  border-radius: 10px;

  .account-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/images/download/inactive-tab-bg.png");
    background-size: 100% 100%;
    background-color: $secondary;
    padding: 10px;
    text-align: center;
    border-radius: 10px;

    span {
      color: $font-1;
      font-size: 1rem;
    }

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }

    &.is-active {
      background-image: url("../../assets/images/download/active-tab-bg.png");
      background-size: 100% 100%;
      background-color: $primary;

      span {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}

.transfer-mid-div {
  width: $box-width;
  padding: 0.2rem 0.9rem 0.2rem;
  margin: 12px auto 12px;
  background: $white;
  box-shadow: $shadow-bg;
  border-radius: 10px;
}

.transfer-tab-section {
  width: $box-width;
  background: white;
  padding: 15px 12px 20px;
  box-shadow: $shadow-bg;
  border-radius: 10px;
}
</style>
<style lang="scss">
.transferfromto {
  .q-field--outlined.q-field--rounded .q-field__control {
    border-radius: 0px;
    border: 0px;
  }

  .q-field--outlined .q-field__control:before {
    border: 0px;
  }

  .q-field--auto-height .q-field__native {
    justify-content: center;
  }

  .q-field--auto-height.q-field--dense .q-field__control,
  .q-field--auto-height.q-field--dense .q-field__native {
    min-height: 0px;
  }

  .q-field__native,
  .q-field__prefix,
  .q-field__suffix,
  .q-field__input {
    color: $white;
    font-size: 1.2rem;
  }

  .q-field__marginal {
    color: $white;
    top: 50%;
    font-size: 1.5rem;
    margin-top: 0px;
    height: 50px;
    //margin-top: 0.5rem;
  }
}
</style>
