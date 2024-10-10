<template>
  <div class="card">
    <div class="menu-title-container">
      <span class="menu-title">{{ $t('transfer.transfer') }}</span>
      <!-- <span class="additional-title">支持虚拟币USDT小额存提，24小时安全，便捷，秒存秒提!</span> -->
    </div>
    <!-- <div class="deposit-ad">
      体育用户首存68%红利
      <br />
      新用户首存即送！最高可得680元！
      <router-link to="/center/deposit">
        <el-button size="small" class="blue-btn join-btn outline">立即参与</el-button>
      </router-link>
    </div> -->
    <div class="balance-plat-item">
      <div class="left-box">
        <div class="balance-wrapper">
          <span class="currency">{{$t('transfer.mainBalance')}}:</span>
          <span v-if="balanceLoading">{{$t('common.loading')}}...</span>
          <span v-else>{{ mainWallet }} {{store.currency.value}}</span>
          <div class="balance-refresh" @click="refreshBalance(MAIN)">
            <el-icon>
              <img width="15" height="15" src="../../assets/images/account/transfer-refresh-icon.svg" />
            </el-icon>
          </div>
        </div>
        <div class="desc-wrapper">
          <span>{{$t('transfer.noNeedTransfer')}}</span>
        </div>
      </div>
      <div class="right-box">
        <div class="action-wrapper">
          <el-button type="success" size="small" class="blue-btn transfer-btn" @click="transferOutAllModal">
            {{ $t('transfer.transferOutAll') }}
          </el-button>
          <!-- <el-button type="success" size="small" class="blue-btn transfer-btn" @click="refreshAllModal">
            一键刷新
          </el-button> -->
          <!-- <div class="balance-transfer-button">
            <span>自动平台转账:</span>
            <el-switch
              v-model="autoTransfer"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="已开启"
              inactive-text="已关闭"
              @change="updateAutoTransfer($event)"
            />
          </div> -->
        </div>
      </div>
    </div>
    <div class="transfer-plat-wrapper">
      <div class="transfer-plat-item card" v-for="p in platforms" :key="p.id">
        <div class="transfer-balance-box">
          <div class="platform-details">
            <div class="plat-name">
              <img width="15" height="15" src="../../assets/images/account/transfer-charge-icon.svg" />
              Sport
            </div>
            <div class="plat-name">
              <img :src="require(`../../assets/${type(p)}/${type(p)}-logo-${p.code.toLowerCase()}.png`)">
              {{ platNames[p.code] || p.name }}
              <div class="balance-refresh" @click="refreshBalance(p.code)">
                <el-icon>
                  <img width="15" height="15" src="../../assets/images/account/transfer-refresh-icon.svg" />
                </el-icon>
              </div>
            </div>
            <div class="balance-wrapper">
              <span class="currency">{{ $t('transfer.balance') }}:</span>
              {{ p.amount }}
            </div>
          </div>
        </div>
        <div class="transfer-action-box">
          <el-button v-if="!autoTransfer" size="small" class="blue-btn transfer-btn" @click="transferModal(0, p)">
            {{ $t('transfer.transferIn') }}
          </el-button>
          <el-button v-if="!autoTransfer" size="small" class="blue-btn transfer-btn" @click="transferModal(1, p)">
            {{ $t('transfer.transferOut') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="transferModalVisible"
    @cancel="cancelTransfer"
    :maskClosable="false"
    :footer="null"
    class="transferinout"
    width="300px"
    align-center
    @keydown.enter.prevent
  >
    <template #header>
      <div
        :style="
          transferTypeIndex === 0 ? 'flex-direction: row' : 'flex-direction: row-reverse; justify-content: flex-end;'
        "
        class="el-dialog__title"
      >
        <el-tag type="danger" effect="dark">主账户</el-tag>
        <el-icon>
          <img width="15" height="15" src="../../assets/images/account/transfer-right-icon.svg" />
        </el-icon>
        <el-tag type="success" effect="dark">
          {{ transferInfo.platform }}
        </el-tag>
      </div>
    </template>
    <el-form
      class="transfer-info-form"
      ref="formRef"
      :hideRequiredMark="true"
      :model="transferInfo"
      :rules="rules"
      :label-col="{ span: 4 }"
    >
      <el-form-item ref="amount" prop="amount">
        <el-input
          class="transfer-info-amount"
          v-model="transferInfo.amount"
          placeholder="金额"
          @keyup.enter="submitTransfer"
        />
      </el-form-item>
      <el-form-item class="txt-center">
        <el-button class="submit-btn blue-btn" :loading="loadingTransfer" @click="submitTransfer">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="transferAllModalVisible" title="转账金额" :maskClosable="false" :footer="null" width="500px">
    <div class="transfer-all-list">
      <div class="transfer-item" v-for="(p, indx) in platforms" :key="indx">
        <div>
          {{ p.code }}
        </div>
        <div>
          {{ p.status }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="js">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { loadBalance } from "@/api/personal/personal";
import { transfer, withdrawAll, getPlatforms, getLoggedInPlatformList, updateAutoTransferState, getAutoTransferState } from "@/api/personal/transfer";
import { ElMessage } from "element-plus";
import { MAIN } from "@/utils/utils";
import { userStore } from "@/store";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "TransferView",
  components: {
},
  setup() {
    const store = userStore();
    const platforms = reactive([]);
    const autoTransfer = ref(false);
    const mainWallet = computed(() => {
      return store.balance;
    });
    onMounted(() => {
      loadPlatform();
      // getAutoTransfer();
    });
    const type = (p) => {
      if ((p.type.split(',')[0].toLowerCase()) === 'esport') {
        return 'esports'
      }
      return p.type.split(',')[0].toLowerCase()
    }
    const { t } = useI18n();
    const transferModalVisible = ref(false);
    const transferAllModalVisible = ref(false);
    const transferTypes = ["Transfer In To", "Transfer Out From"];
    const transferTypeIndex = ref(0);
    const transferTypeTitle = computed(() => {
      return transferTypes[transferTypeIndex.value] + " " + transferInfo.platform;
    });
    const transferInfo = reactive({
      platform: "",
      amount: ""
    });

    const platNames = {"KYDY": "开元棋牌", "DT": "大唐棋牌", "SGWin": "双赢彩票",
    "LEG": "乐游棋牌",
    "PT": "PT电子",
    "BBINDY": "BBIN真人",
    "RG": "RG电竞"
  };

    const transferOutAllModal = () => {
      transferAllModalVisible.value = true
      platforms.forEach(p => {
        if (p.amount > 0) {
          transferInfo.platform = p.code
          transferInfo.amount = p.amount
          p.status = '平台余额转出中';
          withdrawAll(transferInfo).then((res) => {
            if (res.code === 0) {
              p.status = '已转出'
              cancelTransfer();
              store.getBalance();
              refreshBalance(p.code);
            } else {
              p.status = '转出失败'
              store.getBalance();
              refreshBalance(p.code);
            }
          })
        } else {
          p.status = '0.00'
        }

      });
    }

    const refreshAllModal = () => {
      store.getBalance();
      platforms.forEach(p => {
        p.amount = '加载中'
        refreshBalance(p.code);
      });
    }
    const transferModal = (i, p) => {
      if (formRef.value) {
        formRef.value.resetFields();
      }
      transferTypeIndex.value = i;
      transferInfo.platform = p.code;
      transferInfo.currentAmt = p.amount;
      transferModalVisible.value = true;
      transferInfo.amount = "";
    };
    const balanceLoading = ref(false);
    const refreshBalance = async(plat) => {
      if (plat === MAIN) {
        balanceLoading.value = true;
      }
      const plaform = platforms.find(p => p.code === plat);
      const delay = ms => new Promise(res => setTimeout(res, ms));
      if (plaform) {
        plaform.amount = `${t('common.loading')}...`
        await delay(10);
      }
      setTimeout(()=> {
        if (plat === MAIN){
          store.getBalance();
          balanceLoading.value = false;
        } else {
            loadBalance(plat).then((response) => {
              // console.log(plat, response.data)
              if (plaform) {
                plaform.amount = response.data;
              }
            }).catch(e => {
              if (plaform) {
                plaform.amount = 0;
              }
              console.log(e)
            });
        }
      }, 1000);
    };

    const updateAutoTransfer = async(state) => {
      updateAutoTransferState(state).then(res => {
        autoTransfer.value = res.data;
      }).catch(e => {
        console.log(e)
      });
    };

    const getAutoTransfer = () => {
      getAutoTransferState().then(res => {
        autoTransfer.value = res.data;
      }).catch(e => {
          console.log(e)
      });
    };

    const loadPlatform = () => {
      if(store.token) {
          refreshBalance('MAIN')
        getLoggedInPlatformList().then((response) => {
          response.data.filter(p => p.walletType === 'TRANSFER').forEach(p => {
            platforms.push({
              id: p.id,
              code: p.code,
              name: p.name,
              type: p.gameType,
              amount: 0,
              status: 'Waiting for transfer'
            });
          });
          platforms.forEach(element => {
            refreshBalance(element.code)
          });
        }).catch((error) => {
            console.log(error.message);
          // message.error(error.message, 4);
        });
      } else {
        getPlatforms().then((response) => {
          response.data.filter(p => p.walletType === 'TRANSFER').forEach(p => {
            platforms.push({
              id: p.id,
              code: p.code,
              name: p.name,
              type: p.gameType,
              amount: 0,
              status: 'Waiting for transfer'
            });
          });
          platforms.forEach(element => {
            refreshBalance(element.code)
          });
        }).catch((error) => {
            console.log(error.message);
          // message.error(error.message, 4);
        });
      }
    };
    const cancelTransfer = () => {
      transferInfo.platform = "";
      transferInfo.amount = "";
      transferInfo.currentAmt = "";
      transferModalVisible.value = false;
      loadingTransfer.value = false;
    };
    const loadingTransfer = ref(false)
    const submitTransfer = () => {
      loadingTransfer.value = true
      if (transferTypeIndex.value === 1) {
        if (transferInfo.amount > transferInfo.currentAmt) {
          ElMessage.error(transferInfo.platform + ' 平台余额不足');
          loadingTransfer.value = false
          return
        }
      }
      formRef.value
        .validate()
        .then(() => {
          transfer(transferTypeIndex.value, transferInfo).then(async(res) => {
            if (res.code === 0) {
              ElMessage({
                message: t('common.success'),
                type: 'success',
              })
              store.getBalance();
              refreshBalance(transferInfo.platform);
              cancelTransfer();
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
              loadingTransfer.value = false
            }
          })
        }).catch((err) => {
            console.log(err);
            loadingTransfer.value = false;
        });
    };
    const formRef = ref();
    const rules = {
      amount: [
        {
          required: true,
          message: t('placeholder.amount'),
          trigger: "blur"
        },
        {
          pattern: "^([1-9][0-9]*)$",
          message: t('placeholder.wholeNumber'),
          trigger: "change"
        },
      ]
    };
    return {
      platforms,
      transferModal,
      transferModalVisible,
      transferInfo,
      transferTypeIndex,
      transferTypeTitle,
      cancelTransfer,
      submitTransfer,
      mainWallet,
      refreshBalance,
      formRef,
      MAIN,
      rules,
      transferOutAllModal,
      transferAllModalVisible,
      loadingTransfer,
      refreshAllModal,
      platNames,
      autoTransfer,
      updateAutoTransfer,
      balanceLoading,
      store,
      type
    };
  }
});
</script>
<style lang="scss">
body .transferinout .el-dialog__header .el-dialog__title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 10px;
  gap: 5px;
}
.transfer-all-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 80px;
  row-gap: 10px;
  padding: 20px;
  .transfer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.md .ant-modal {
  width: 100%;
  max-width: 800px;
  padding: 10px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 100%;
  }
}
.sm .ant-modal {
  width: 100%;
  max-width: 500px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 100%;
  }
}
.el-button.outline.blue-btn > span {
  color: #468cff;
}

.el-dialog {
  border-radius: 12px;
}

.el-dialog__header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 5px 0px #b1d7ff inset;
  box-shadow: 0px -1px 4px 0px #5894ff inset;
  border: 0;
  color: #fff;
  padding: 10px;
}

.transfer-info-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .transfer-info-amount .el-input__wrapper {
    width: 402px;
    height: 52px;
    border-radius: 12px;
    box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  }

  .el-form-item {
    margin: 0;
  }

  .submit-btn {
    box-shadow: 0px -2px 5px 0px #93c7ff inset;
    box-shadow: 0px -1px 4px 0px #275ec1 inset;
    width: 100%;
    border-radius: 12px;
  }
}
</style>
<style scoped lang="scss">
.card {
  background-color: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 40px;
  color: #424f72;
  height: 100%;
  box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
}
.deposit-ad {
  background: url(../../assets/images/account/depositad.png) no-repeat center center;
  background-size: cover;
  display: flex;
  padding: 12px 30px;
  border-radius: 12px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  font-family: "Microsoft Yahei";
  .deposit-btn, .join-btn {
    color: #548cf9;
    padding: 10px;
    border-radius: 20px;
    font-size: 20px;
    font-weight: bold;
    height: unset;
    padding: 15px 30px;
  }
  .join-btn {
    padding: 10px 20px;
  }
}

.blue-btn {
  gap: 10px;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 5px 0px #b1d7ff inset;
  box-shadow: 0px -1px 4px 0px #5894ff inset;
  color: #fff;
  padding: 8px 30px;
  cursor: pointer;
  border: 0;
  height: unset;
  width: 70%;

  &.outline {
    background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
    box-shadow: 0px 2px 4px 0px #bbdcff inset;
    box-shadow: 0px -1px 4px 0px #a2bff4 inset;
    color: #468cff;
  }
}

.balance-plat-item {
  display: grid;
  grid-template-columns: 1fr auto;
  background-color: #e7f3ff;
  padding: 20px;
  border-radius: 12px;
  align-items: center;

  .left-box {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .balance-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Roboto';

      .balance-refresh {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-bottom: 2px;
        margin-left: 5px;
      }
    }
  }

  .right-box {
    .action-wrapper {
      display: flex;
      gap: 10px;
      align-items: center;
      .transfer-btn {
        border-radius: 30px;
      }
    }
  }
}

.transfer-plat-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 15px;

  .transfer-plat-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid #ecedf0;
    // width: 238px;
    // height: 128px;

    .transfer-balance-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    .transfer-action-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      gap: 5px;

      .transfer-btn {
        border-radius: 30px;
      }
    }

    .platform-details {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      flex-direction: column;

      .plat-name {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        img {
          width:15px;
        }

        .remixicon {
          fill: #000;
          width: 15px;
        }
      }

      .balance-wrapper {
        .currency {
          margin-right: 10px;
        }
      }
    }

    .balance-refresh {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
      cursor: pointer;

      .el-icon {
        display: block;
        color: #000;

        svg {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}

.confirm-btn {
  width: 100%;
  cursor: pointer;
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .transfer-plat-wrapper {
    .transfer-plat-item {
      padding: 10px;
      flex-direction: column;
      justify-content: stretch;

      .transfer-balance-box {
        width: 100%;
      }

      .transfer-action-box {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 768px) {
  .transfer-plat-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .transfer-plat-wrapper {
    .transfer-plat-item {
      flex-direction: column;
    }
  }
}
</style>
