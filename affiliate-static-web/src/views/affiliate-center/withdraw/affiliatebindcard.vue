<template>
  <el-card class="box-card" shadow="never" style="margin-top: 20px">
    <template #header>
      <div class="clearfix">
        <span class="role-span">{{ $t('menu.Bind Bank Cards') }}</span>
      </div>
    </template>
    <el-row>
      <el-col :span="24" style="text-align: right">
        <el-button size="small" @click="openDialog('bank')"><svg-icon icon-class="bankcard" style="margin-bottom: 5px;" />{{ $t('fields.addBankCard') }}</el-button>
        <!-- <el-button size="small" @click="openDialog('virtual')" type="primary"><svg-icon icon-class="linkcard" style="margin-bottom: 5px;" />{{ $t('fields.addVirtualCard') }}</el-button> -->
      </el-col>
    </el-row>
    <el-row class="cards">
      <el-col class="card" v-for="(card, o) in personalState.bankCardList" :key="o">
        <el-card :body-style="{padding: '0px'}">
          <div style="padding: 14px;">
            <el-row>
              <el-col style="min-height: 50px; " :span="21">{{ card.bankName }}</el-col>
              <el-col :span="3" style="text-align: right">
                <svg-icon icon-class="unlink" @click="confirmUnbind(card)" />
              </el-col>
            </el-row>
            <el-row style="height: 50px;" />
            <el-row :gutter="20" style="text-align:center;" type="flex" align="middle" justify="space-between">
              <el-col :span="6"
                      v-for="b in card.cardNumber.split()"
                      :key="b"
                      class="card-num-box"
              >
                {{ b.slice(0, 4) }}
              </el-col>
              <el-col :span="6"
                      v-for="b in card.cardNumber.split()"
                      :key="b"
                      class="card-num-box"
              >
                ****
              </el-col>
              <el-col :span="6"
                      v-for="b in card.cardNumber.split()"
                      :key="b"
                      class="card-num-box"
              >
                ****
              </el-col>
              <el-col :span="6"
                      v-for="b in card.cardNumber.split()"
                      :key="b"
                      class="card-num-box"
              >
                {{ b.slice(b.length - 4, b.length) }}
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      width="700px"
      :title="t('fields.addBankCard')"
      v-model="centerDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="bankCardFormRef" :model="bankCardInfo" :rules="bankCardRules">
        <el-form-item>
          <el-row gutter="10">
            <el-col :span="8">
              <el-select value-key="bankType" v-model="selectedBankType" :placeholder="t('fields.select')" size="large" @change="selectBankType">
                <el-option
                  v-for="item in bankTypes"
                  :key="item.key"
                  :label="item.displayName"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="16">
              <el-select value-key="bankId" v-model="bankCardInfo.bankId" :placeholder="t('fields.select')" size="large">
                <el-option
                  v-for="item in banksList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item v-else :label="t('fields.bankId')">
          GCASH
        </el-form-item> -->
        <el-form-item ref="cardAccount" prop="cardAccount">
          <el-input readonly
                    v-model="bankCardInfo.cardAccount"
                    :placeholder="t('fields.cardAccount')"
          />
        </el-form-item>
        <el-form-item ref="cardNumber" prop="cardNumber">
          <el-input
            v-model="bankCardInfo.cardNumber"
            :placeholder="selectedBankType === 'Bank' ? t('fields.cardNumber') : (selectedBankType === 'Crypto' ? t('fields.usdtWalletAddress') : t('fields.ewallet'))"
          />
        </el-form-item>
        <el-form-item ref="cardNumber" prop="cardAddress" v-if="selectedBankType === 'Bank'">
          <el-input
            v-model="bankCardInfo.cardAddress"
            :placeholder="t('fields.cardAddress')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">{{ $t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submitBankCard">{{ $t('fields.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElNotification } from 'element-plus';
import { loadBanks, loadBankCards, addBankCard, deleteBankCard } from "@/api/affiliate";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import router from "@/router";

onMounted(() => {
  loadCards();
});
const store = useStore();
const { t } = useI18n();
const selectedBankType = ref("Bank")

const bankTypes = [
  { key: 1, displayName: t('fields.bank'), value: 'Bank' },
  { key: 2, displayName: t('fields.crypto'), value: 'Crypto' },
  { key: 3, displayName: t('fields.ewallet'), value: 'e-Wallet' }
]
const personalState = reactive({
  bankCardList: []
});
const loadCards = () => {
  personalState.bankCardList = [];
  loadBankCards().then((response) => {
    if (response.code === 0) {
      personalState.bankCardList.push(...response.data);
    }
  }).catch((error) => {
    console.log("error", error);
  });
}

const bankCardInfo = reactive({
  bankId: undefined,
  cardNumber: "",
  cardAccount: "",
  cardAddress: ""
});
const centerDialogVisible = ref(false)

const validateEmptyCardNo = async (r, v) => {
  if (selectedBankType.value === 'Bank') {
    if (v === '') {
      return Promise.reject(new Error(t('message.requiredCardNumber')));
    } else if (/^\d+$/.test(v) === false) {
      return Promise.reject(new Error(t('message.validateBankCardNumber')));
    } else {
      return Promise.resolve();
    }
  } else if (selectedBankType.value === 'Crypto') {
    if (v === '') {
      return Promise.reject(new Error(t('message.requiredUsdtWallet')));
    } else if (/^[A-Za-z0-9]*$/.test(v) === false) {
      return Promise.reject(new Error(t('message.validateUsdtWallet')));
    } else {
      return Promise.resolve();
    }
  }
  return Promise.resolve();
};

const validateBankLength = async (r, v) => {
  var min = 6;
  var max = 12;
  if (selectedBankType.value === 'Bank') {
    min = 16;
    max = 19;
  } else if (selectedBankType.value === 'Crypto') {
    min = 34;
    max = 36;
  } else if (selectedBankType.value === 'e-Wallet') {
    min = 34;
    max = 34;
    var selectedCode = null
    banksList.value.forEach(bank => {
      if (bank.id === bankCardInfo.bankId) {
        selectedCode = bank.code
      }
    });
    if (selectedCode === 'KDPAY') {
      min = 34;
      max = 34;
    } else if (selectedCode === 'EBPAY') {
      min = 34;
      max = 34;
    } else if (selectedCode === 'OKPAY') {
      min = 16;
      max = 16;
    }
  }
  if (v === '') {
    return Promise.reject(new Error(t('message.requiredCardNumber')));
  } else if (v.length < min || v.length > max) {
    if (min === max) {
      return Promise.reject(new Error(t('message.lengthShouldBe') + min));
    } else {
      return Promise.reject(new Error(t('message.lengthShouldBe') + min + '-' + max));
    }
  } else {
    return Promise.resolve();
  }
};

const bankCardRules = {
  cardNumber: [
    {
      required: true,
      validator: validateEmptyCardNo,
      trigger: "blur",
    },
    {
      required: true,
      validator: validateBankLength,
      trigger: "blur",
    }
  ],
  cardAccount: [
    {
      required: true,
      message: t('message.requiredCardAccount'),
      trigger: "blur"
    }
  ],
  cardAddress: [
    {
      required: true,
      message: t('message.requiredCardAddress'),
      trigger: "blur"
    }
  ]
};
const confirmUnbind = (card) => {
  ElMessageBox.confirm(
    t('message.unbindConfirm') + card.bankName,
    '',
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning'
    })
    .then(() => {
      // Remove card API
      deleteBankCard(card.id).then((res) => {
        if (res.code === 0) {
          for (let i = 0; i < personalState.bankCardList.length; i++) {
            if (personalState.bankCardList[i].id === card.id) {
              personalState.bankCardList.splice(i, 1);
            }
          }
        }
      }).catch((e) => {
        console.log("error", e);
      });
    })
    .catch(() => {
      // catch error
    })
}
// const bankName = ref()
const banksList = ref([])
// const isBankCard = ref(false)
const openDialog = (type) => {
  if (!store.state.user.realName || store.state.user.realName === "" || store.state.user.realName === "undefined" || store.state.user.realName === "null") {
    router.push("/personal?name=realname");
  } else {
    bankCardInfo.bankId = undefined;
    bankCardInfo.cardNumber = "";
    bankCardInfo.cardAccount = store.state.user.realName;
    bankCardInfo.cardAddress = "";
    bankCardModalState.visible = true;
    if (bankCardModalState.banks.length === 0) {
      loadBanks().then((res) => {
        if (res.code === 0) {
          bankCardModalState.banks.push(...res.data)
          selectBankType();
        }
      }).catch((e) => {
        console.log("error", e);
      });
    }
  }
  // store.getMemberInfo().then(() => {
  //       if (!store.realName || store.realName == "") {
  //         message.error('กรุณาใส่ข้อมูลให้ถูกต้อง');
  //         router.push("/center/personal");
  //       } else {
  //         bankCardInfo.bankId = undefined;
  //         bankCardInfo.cardNumber = "";
  //         bankCardInfo.cardAccount = store.realName;
  //         bankCardInfo.cardAddress = "";
  //         bankCardModalState.visible = true;
  //         if (bankCardModalState.banks.length === 0) {
  //           loadBanks().then((res) => {
  //             if (res.code === 0) {
  //               bankCardModalState.banks.push(...res.data)
  //               selectBankType();
  //             }
  //           }).catch((e) => {
  //             console.log("error", e);
  //           });
  //         }
  //       }
  //     })

  // if (type === 'virtual') {
  //   isBankCard.value = false
  //   bankCardInfo.bankId = 39
  //   bankName.value = 'GCASH'
  //   bankCardInfo.currencyId = 6
  // } else {
  //   isBankCard.value = true
  //   bankCardInfo.currencyId = 6
  //   if (bankCardModalState.banks.length === 0) {
  //     loadBanks(6).then((res) => {
  //       if (res.code === 0) {
  //         bankCardModalState.banks.push(...res.data);
  //       }
  //     }).catch((e) => {
  //       console.log("error", e);
  //     });
  //     bankCardModalState.banks = []
  //   }
  // }
  centerDialogVisible.value = true
}
const selectBankType = () => {
  banksList.value = []
  bankCardInfo.bankId = null
  bankCardModalState.banks.forEach(element => {
    if (selectedBankType.value === "Bank" && element.bankType === 'BANK') {
      banksList.value.push(element);
    }
    if (selectedBankType.value === "Crypto" && element.bankType === 'CRYPTO') {
      banksList.value.push(element);
    }
    if (selectedBankType.value === "e-Wallet" && element.bankType === 'EWALLET') {
      banksList.value.push(element);
    }
  })
}
const bankCardModalState = reactive({
  visible: false,
  banks: []
});
const bankCardFormRef = ref([])
const submitBankCard = () => {
  bankCardFormRef.value
    .validate()
    .then(() => {
      addBankCard(bankCardInfo).then((response) => {
        if (response.code === 0) {
          // message.success("success");
          centerDialogVisible.value = false;
          ElNotification({
            title: t('message.success'),
            showClose: false,
            type: 'success'
          })
          loadCards();
        } else {
          // message.error(response.message);
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }).catch((error) => {
      console.log("error", error);
    });
};
</script>
<style lang="scss" scoped>

  .el-select {
    width: 100%;
  }
  .cards {
    gap: 10px;
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    .card {
      max-width: 250px;
    }
  }

</style>
