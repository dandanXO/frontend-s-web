<template>
  <el-card class="box-card" shadow="never" style="margin-top: 0px;">
    <template #header>
      <div class="clearfix">
        <span class="role-span">{{ $t('menu.Bind Bank Cards') }}</span>
      </div>
    </template>
    <el-row style="margin-bottom: 30px;">
      <el-col>
        <!-- <el-card shadow="always" @click="openDialog('bank')"><svg-icon icon-class="bankcard" style="margin-bottom: 5px; width: 100%; height: 100%;" />{{ $t('fields.addBankCard') }}</el-card> -->
        <el-button class="addcardbtn" :icon="add" size="normal" @click="openDialog('bank')" type="primary"><svg-icon icon-class="add" style="display:inline-block; font-size: 20px;" /><span>{{ $t('fields.addBankCard') }}</span></el-button>
      </el-col>
    </el-row>
    <div class="subtitle">{{ t('fields.bindAccountList') }}</div>
    <el-row class="cards">
      <div class="minititle">{{ t('fields.bindBankCardList') }}</div>
      <table cellpadding="0" cellspacing="0" border="0" class="custom-table">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.bank') }}</th>
            <th scope="col">{{ t('fields.cardNumber') }}</th>
            <th scope="col">{{ t('fields.cardAccount') }}</th>
            <th scope="col">{{ t('fields.cardAddress') }}</th>
            <!-- <th scope="col">{{ t('fields.actions') }}</th> -->
          </tr>
        </thead>
        <tbody v-if="personalState.bankList.length > 0">
          <tr v-for="item in personalState.bankList" :key="item.id">
            <td :data-label="t('fields.bank')">{{ item.bankName }}</td>
            <td :data-label="t('fields.cardNumber') ">{{ item.cardNumber }}</td>
            <td :data-label="t('fields.cardAccount')">{{ item.cardAccount }}</td>
            <td :data-label="t('fields.cardAddress')">{{ item.cardAddress }}</td>
            <!-- <td> -->
              <!-- <el-link type="primary" :underline="false" @click="confirmUnbind(item)">{{ t('fields.unbind') }}</el-link> -->
              <!-- <svg-icon icon-class="unlink" @click="confirmUnbind(item)" /> -->
            <!-- </td> -->
          </tr>
        </tbody>
      </table>
      <div v-if="personalState.bankList.length === 0" style="margin: 0 auto; text-align: center; width: 100%;">
        <emptyComp />
      </div>
      <!-- <el-col class="card" v-for="(card, o) in personalState.bankCardList" :key="o">
        <el-card :body-style="{padding: '0px'}" :style="`background-image: url(${cardBG(card)})`">
          <div style="padding: 14px;">
            <el-row :gutter="20">
              <el-col :span="4"><el-icon><img :src="cardLOGO(card)"></el-icon></el-col>
              <el-col style="min-height: 50px; " :span="15">{{ card.bankName }}</el-col>
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
      </el-col> -->
    </el-row>
    <el-row class="cards">
      <div class="minititle">{{ t('fields.bindCryptoList') }}</div>
      <table cellpadding="0" cellspacing="0" border="0" class="custom-table">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.bankName') }}</th>
            <th scope="col">{{ t('fields.bankCode') }}</th>
            <th scope="col">{{ t('fields.cardNumber') }}</th>
            <th scope="col">{{ t('fields.cardAccount') }}</th>
            <th scope="col">{{ t('fields.cardAddress') }}</th>
            <th scope="col">{{ t('fields.actions') }}</th>
          </tr>
        </thead>
        <tbody v-if="personalState.cryptoList.length > 0">
          <tr v-for="item in personalState.cryptoList" :key="item.id">
            <td :data-label="t('fields.bankName')">{{ item.bankName }}</td>
            <td :data-label="t('fields.bankCode')">{{ item.bankCode }}</td>
            <td :data-label="t('fields.cardNumber') ">{{ item.cardNumber }}</td>
            <td :data-label="t('fields.cardAccount')">{{ item.cardAccount }}</td>
            <td :data-label="t('fields.cardAddress')">{{ item.cardAddress }}</td>
            <td>
              <el-link type="primary" :underline="false" @click="confirmUnbind(item)">{{ t('fields.unbind') }}</el-link>
              <!-- <svg-icon icon-class="unlink" @click="confirmUnbind(item)" /> -->
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="personalState.cryptoList.length === 0" style="margin: 0 auto; text-align: center; width: 100%;">
        <emptyComp />
      </div>
    </el-row>
    <el-row class="cards">
      <div class="minititle">{{ t('fields.bindEWalletList') }}</div>
      <table cellpadding="0" cellspacing="0" border="0" class="custom-table">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.bankName') }}</th>
            <th scope="col">{{ t('fields.bankCode') }}</th>
            <th scope="col">{{ t('fields.cardNumber') }}</th>
            <th scope="col">{{ t('fields.cardAccount') }}</th>
            <th scope="col">{{ t('fields.cardAddress') }}</th>
            <th scope="col">{{ t('fields.actions') }}</th>
          </tr>
        </thead>
        <tbody v-if="personalState.eWalletList.length === 1">
          <tr v-for="item in personalState.eWalletList" :key="item.id">
            <td :data-label="t('fields.bankName')">{{ item.bankName }}</td>
            <td :data-label="t('fields.bankCode')">{{ item.bankCode }}</td>
            <td :data-label="t('fields.cardNumber') ">{{ item.cardNumber }}</td>
            <td :data-label="t('fields.cardAccount')">{{ item.cardAccount }}</td>
            <td :data-label="t('fields.cardAddress')">{{ item.cardAddress }}</td>
            <td>
              <el-link type="primary" :underline="false" @click="confirmUnbind(item)">{{ t('fields.unbind') }}</el-link>
              <!-- <svg-icon icon-class="unlink" @click="confirmUnbind(item)" /> -->
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="personalState.eWalletList.length === 0" style="margin: 0 auto; text-align: center; width: 100%;">
        <emptyComp />
      </div>
    </el-row>
    <el-dialog
      width="90%"
      modal-class="dialog700"
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
import emptyComp from "@/components/empty"

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
  bankCardList: [],
  bankList: [],
  cryptoList: [],
  eWalletList: [],
});
const loadCards = () => {
  personalState.bankCardList = [];
  personalState.bankList = [];
  personalState.cryptoList = [];
  personalState.eWalletList = [];
  loadBankCards().then((response) => {
    if (response.code === 0) {
      personalState.bankCardList.push(...response.data);
      personalState.bankCardList.forEach(element => {
        element.cardNumber = '****' + element.cardNumber.slice(-4);
        if (element.bankType === 'BANK') {
          personalState.bankList.push(element)
        } else if (element.bankType === 'CRYPTO') {
          personalState.cryptoList.push(element)
        } else if (element.bankType === 'EWALLET') {
          personalState.eWalletList.push(element)
        }
      });
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

// const validateBankLength = async (r, v) => {
//   var min = 6;
//   var max = 12;
//   if (selectedBankType.value === 'Bank') {
//     if (store.state.user.siteId === 3) {
//       min = 10;
//       max = 15;
//     } else {
//       min = 16;
//       max = 19;
//     }
//   } else if (selectedBankType.value === 'Crypto') {
//     min = 34;
//     max = 36;
//   } else if (selectedBankType.value === 'e-Wallet') {
//     min = 34;
//     max = 34;
//     var selectedCode = null
//     banksList.value.forEach(bank => {
//       if (bank.id === bankCardInfo.bankId) {
//         selectedCode = bank.code
//       }
//     });
//     if (selectedCode === 'KDPAY') {
//       min = 34;
//       max = 34;
//     } else if (selectedCode === 'EBPAY') {
//       min = 34;
//       max = 34;
//     } else if (selectedCode === 'OKPAY') {
//       min = 16;
//       max = 16;
//     }
//   }
//   if (v === '') {
//     return Promise.reject(new Error(t('message.requiredCardNumber')));
//   } else if (v.length < min || v.length > max) {
//     if (min === max) {
//       return Promise.reject(new Error(t('message.lengthShouldBe') + min));
//     } else {
//       return Promise.reject(new Error(t('message.lengthShouldBe') + min + '-' + max));
//     }
//   } else {
//     return Promise.resolve();
//   }
// };

const bankCardRules = {
  cardNumber: [
    {
      required: true,
      validator: validateEmptyCardNo,
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
// const cardBG = (card) => {
//   return require(`../../../assets/images/bank/${card.bankType.toLowerCase()}.png`)
// }
// const cardLOGO = (card) => {
//   return require(`../../../assets/images/banklogo/${card.bankType.toLowerCase()}.png`)
// }
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
          loadCards();
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
    router.push("/personal/info?name=realname");
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
  :deep(.dialog700 .el-dialog) {
    max-width: 700px;
  }
  :deep(.el-table th.el-table__cell) {
    background: #F4F9FD;
    color: #333333;
  }
  .el-select {
    width: 100%;
  }
  .addcardbtn {
    background: #46794f;
    border:1px solid #305637;
    box-shadow: 0px 6px 12px 0px #46794f6B;
    border-radius: 10px;
    line-height: 20px;
    :deep(span) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .subtitle {
    font-size: 20px;
    font-family: PFBold;
    display: block;
  }
  .cards {
    gap: 10px;
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    .minititle {
      font-size: 16px;
      font-family: PFMed;
      display: block;
      color: #999999;
    }
    .card {
      max-width: 250px;
    }
    .addcard {
      max-width: 250px;
      cursor: pointer;
      .el-card {
        color: #3F8CFF;
        background: #ecf3ff;
        min-height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
    .el-card {
      color: #ffffff;
      background-repeat: no-repeat;
      background-size: cover;
      min-height: 160px;
      background-position: 50%;
    }
  }
</style>
