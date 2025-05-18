<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">快速转账</span>
    </div>
    <div class="account-content quicktransfer">
      <div class="flex-box transfer-top-container">
        <div class="balance">
          <div class="balance-wrapper">
            <span class="currency">主账户:</span>
            <span>
              ￥{{ mainWallet }}
              <el-icon @click="refreshAllModal"><Refresh style="color: #32ceed" /></el-icon>
            </span>
          </div>

          <!-- <div class="balance-refresh" @click="refreshBalance(MAIN)">
            <el-icon><Refresh style="color: #ffffff" /></el-icon>
          </div> -->

          <el-button type="success" class="common-btn transfer-btn" @click="transferOutAllModal">
            <img src="@/assets/images/account/transfer.png" />
            一键转出
          </el-button>
        </div>
      </div>
      <div class="account-content">
        <div class="common-title menulike">场馆明细</div>
        <div class="account-tip-text" style="color: #fd574c; padding-bottom: 20px">
          除了以下平台需要转账，其它游戏平台都无需转账即可游戏
        </div>
      </div>
      <div class="balance-transfer-button">
        <span>自动平台转账:</span>
        <el-switch
          v-model="autoTransfer"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #32ceed; --el-switch-off-color: #ff4949"
          active-text="已开启"
          inactive-text="已关闭"
          @change="updateAutoTransfer($event)"
        />
        <!--<div class="account-tip">
        E-Sports do not need to transfer, recharge and play
        </div>-->
      </div>
      <div class="transfer-plat-wrapper">
        <div class="transfer-plat-item" v-for="p in platforms" :key="p.id">
          <div class="flex-box flex-justify-space transfer-balance-box">
            <div class="platform-details">
              <div class="plat-name">{{ platNames[p.code] || p.name }}</div>
              <div class="balance-wrapper">
                {{ p.amount }}
                <div class="balance-refresh" @click="refreshBalance(p.code)">
                  <el-icon><Refresh /></el-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-box flex-justify-space flex-wrap transfer-action-box">
            <button v-if="!autoTransfer" class="outline transfer-btn" @click="transferModal(0, p)">转进</button>
            <button v-if="!autoTransfer" class="transfer-btn" @click="transferModal(1, p)">转出</button>
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
          <el-icon><Right /></el-icon>
          <el-tag type="success" effect="dark">
            {{ transferInfo.name }}
          </el-tag>
        </div>
      </template>
      <el-form ref="formRef" :hideRequiredMark="true" :model="transferInfo" :rules="rules" :label-col="{ span: 4 }">
        <el-form-item ref="amount" name="amount">
          <el-input v-model="transferInfo.amount" placeholder="金额" @keyup.enter="submitTransfer" />
        </el-form-item>
        <el-form-item class="txt-center">
          <!-- <button
            class="common-btn confirm-btn"
            type="submit"
            @click="submitTransfer"
          >
            {{ "common.confirm" }}
          </button> -->
          <el-button class="common-btn" :loading="loadingTransfer" @click="submitTransfer">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="transferAllModalVisible" title="转账金额" :maskClosable="false" :footer="null" width="500px">
      <div class="transfer-all-list">
        <div class="transfer-item" v-for="(p, indx) in platforms" :key="indx">
          <div>
            {{ p.name }}
          </div>
          <div>
            {{ p.status }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="js">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { loadBalance } from "@/api/personal/personal";
import {
  transfer,
  withdrawAll,
  getPlatforms,
  getLoggedInPlatformList,
  updateAutoTransferState,
  getAutoTransferState
} from "@/api/personal/transfer";
// import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import { MAIN } from "@/utils/utils";
import { userStore } from "@/store";
// import { RiSpamLine, RiRestartLine } from "vue-remix-icons";
import { InfoFilled, Refresh, Right } from "@element-plus/icons-vue"
// import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "TransferView",
  components: {
    // RiSpamLine, RiRestartLine
    InfoFilled, Refresh, Right
  },
  setup() {
    const store = userStore();
    const platforms = reactive([]);
    const autoTransfer = ref(false);
    const mainWallet = computed(() => {
      return store.balance.toFixed(2);
    });
    onMounted(() => {
      loadPlatform();
      getAutoTransfer();
    });
    // const { t } = useI18n();
    const transferModalVisible = ref(false);
    const transferAllModalVisible = ref(false);
    const transferTypes = ["Transfer In To", "Transfer Out From"];
    const transferTypeIndex = ref(0);
    const transferTypeTitle = computed(() => {
      return transferTypes[transferTypeIndex.value] + " " + transferInfo.platform;
    });
    const transferInfo = reactive({
      name: "",
      platform: "",
      amount: ""
    });

    const platNames = {"KY": "开元棋牌", "DT": "大唐棋牌", "BBINDY": "BBIN", "EBET": "WE" ,"AGF" : "PA捕鱼"};

    const transferOutAllModal = () => {
      transferAllModalVisible.value = true
      platforms.forEach(p => {
        if (p.amount > 0) {
          transferInfo.platform = p.code
          transferInfo.name = p.name
          transferInfo.amount = p.amount
          p.status = '平台余额转出中';
          withdrawAll(transferInfo).then((res) => {
            if (res.code === 0) {
              p.status = '已转出'
              cancelTransfer();
            } else {
              p.status = '转出失败'
            }
          })
        } else {
          p.status = '0.00'
        }
        store.getBalance();
        refreshBalance(p.code);
      });
    }

    const refreshAllModal = () => {
      store.getBalance();
      platforms.forEach(p => {
        p.amount = 'Loading'
        refreshBalance(p.code);
      });
    }
    const transferModal = (i, p) => {
      transferTypeIndex.value = i;
      transferInfo.platform = p.code;
      transferInfo.name = p.name
      transferInfo.currentAmt = p.amount;
      transferModalVisible.value = true;
      transferInfo.amount = "";
    };
    const refreshBalance = async(plat) => {
      const plaform = platforms.find(p => p.code === plat);
      const delay = ms => new Promise(res => setTimeout(res, ms));
      if (plaform) {
        plaform.amount = '加载中...'
        await delay(10);
      }
      setTimeout(()=> {
        if (plat === MAIN){
          store.getBalance();
        } else {
            loadBalance(plat).then((response) => {
              // console.log(plat)
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
      }
      , 1000);
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
      if(store.memberType === 'TEST') {
        getLoggedInPlatformList().then((response) => {
          response.data.filter(p => p.walletType === 'TRANSFER').forEach(p => {
            platforms.push({
              id: p.id,
              code: p.code,
              name: p.name,
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
      transferInfo.name = "";
      transferInfo.amount = "";
      transferInfo.currentAmt = "";
      transferModalVisible.value = false;
      loadingTransfer.value = false;
    };
    const loadingTransfer = ref(false)
    const submitTransfer = () => {
      loadingTransfer.value = true
      console.log(transferTypeIndex)
      if (transferInfo.amount > 0) {
        if (transferTypeIndex.value === 1) {
          if (transferInfo.amount > transferInfo.currentAmt) {
            ElMessage.error(transferInfo.name + ' 平台余额不足');
            loadingTransfer.value = false
            return
          }
      }
      formRef.value
        .validate()
        .then(() => {
          transfer(transferTypeIndex.value, transferInfo).then((res) => {
            if (res.code === 0) {
              ElMessage({
                message: '成功',
                type: 'success',
              })
              store.getBalance();
              refreshBalance(transferInfo.platform);
              cancelTransfer();
            }
          }).catch((error) => {
            console.log(error.message);
            // message.error(error.message, 4);
            loadingTransfer.value = false;
          });
        }).catch((err) => {
            console.log(err.message);
            loadingTransfer.value = false;
        });
      } else {
        ElMessage.error('金额无效');
          loadingTransfer.value = false
          return
      }
    };
    const formRef = ref();
    const rules = {
      amount: [
        {
          required: true,
          message: "请输入金额",
          trigger: "blur"
        },
        {
          pattern: "^([1-9][0-9]*)$",
          message: "金额应为正数",
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
      autoTransfer,
      updateAutoTransfer,
      refreshBalance,
      formRef,
      MAIN,
      rules,
      transferOutAllModal,
      transferAllModalVisible,
      loadingTransfer,
      refreshAllModal,
      platNames
    };
  }
});
</script>
<style lang="scss">
body .transferinout .el-dialog__header .el-dialog__title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0;
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
</style>
<style scoped lang="scss">
.account-container {
  .account-content-wrapper {
    .transfer-top-container {
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #ffffff1a;

      .balance {
        display: flex;
        align-items: center;
        margin: 10px 0;
        background: #242425;
        padding: 10px;
        border-radius: 8px;
        width: 280px;
        position: relative;
        .el-button {
          position: absolute;
          right: 10px;
          top: 10px;
          background: linear-gradient(180deg, #32ceed 0%, #1c7587 100%);
          border-radius: 50px;
          padding: 5px;

          img {
            width: 16px;
            margin-right: 10px;
          }
        }
        .transfer-btn {
          padding: 5px;
        }
        .balance-wrapper {
          display: flex;
          width: 18%;
          flex-direction: column;
          justify-content: flex-start;
          gap: 20px;
          align-items: flex-start;
          font-size: 24px;
          color: #ffffff;
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
          }
          .currency {
            color: #b8b8b8;
            font-size: 14px;
            white-space: normal;
          }
        }
        .balance-refresh {
          cursor: pointer;
          margin-left: 10px;
          svg {
            display: block;
            width: 16px;
            fill: #ffffff;
          }
        }
      }

      .account-tip {
        padding-top: 4px;
        margin-left: 120px;
      }
    }

    .balance-transfer-button {
      display: flex;
      width: 80%;
      justify-content: flex-end;
      gap: 10px;
      align-items: center;
      font-size: 14px;
      position: absolute;
      top: 15px;
      right: 20px;
    }
    .transfer-plat-wrapper {
      // display: grid;
      // padding-top: 30px;
      // grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      // grid-gap: 20px 24px;
      // display: grid;
      // grid-gap: 20px;
      // grid-template-columns: 1fr 1fr;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      .transfer-plat-item {
        display: flex;
        background: #242425;
        // box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);
        border-radius: 8px;
        // margin: 0 0 23px 14px;
        padding: 10px 20px;
        flex-direction: column;
        position: relative;
        width: 250px;
        .transfer-balance-box {
          align-items: center;
        }
        .transfer-action-box {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 15px;

          .transfer-btn {
            background-color: #164a5f;
            box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);
            border-radius: 2px;
            border: 1px solid #22737f;
            color: #b8b8b8;
            padding: 2px 20px;
            font-size: 12px;
            line-height: 14px;

            &.outline {
            }
          }
        }

        .platform-details {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 5px;
          flex-direction: column;

          .plat-name {
            // font-size: 18px;
            // color: #ffd800;
            // min-width: 60px;
            position: relative;
            clear: both;
            font-size: 14px;
            color: #b8b8b8;
            // -webkit-box-shadow: 2px 5px 10px rgb(138 146 154 / 15%);
            // box-shadow: 2px 5px 10px rgb(138 146 154 / 15%);
            // color: #fff;
            // margin-left: -27px;
            // margin-top: -3px;
            // border-radius: 0 3px 3px 0;
            // background: #323d50;
            // &::before {
            //   content: " ";
            //   border-style: solid;
            //   border-width: 10px;
            //   display: block;
            //   position: absolute;
            //   bottom: -10px;
            //   left: 0;
            //   margin-bottom: -10px;
            //   z-index: 0;
            //   border-color: #2494be transparent transparent;
            // }
            // &::after {
            //   content: " ";
            //   background: #232833;
            //   display: block;
            //   position: absolute;
            //   width: 100%;
            //   height: 20px;
            //   bottom: -20px;
            //   left: 7px;
            //   margin-bottom: 0px;
            //   z-index: 0;
            //   border-color: #2494be transparent transparent;
            // }
          }
          .balance-wrapper {
            display: flex;
            // justify-content: flex-end;
            width: 100%;
            align-items: center;
            color: #b8b8b8;
            font-family: PingFang SC;
            font-size: 24px;
            font-weight: 600;
            margin: 10px 0;
            gap: 10px;
            .currency {
              color: #b8b8b8;
              font-size: 14px;
              line-height: 16px;
              margin-right: 10px;
            }
          }
        }
        .balance-refresh {
          // position: absolute;
          // right: 10px;
          // top: 10px;
          // cursor: pointer;
          // margin-left: 10px;
          .el-icon {
            display: block;
            width: 16px;
            color: #2494be;
          }
        }
      }
    }
  }
}

.confirm-btn {
  width: 100%;
  cursor: pointer;
}

.transfer-btn {
  font-size: 14px;
  padding: 8px 16px !important;
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
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
  }
}
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .transfer-plat-wrapper {
        grid-template-columns: 1fr;
      }
    }
  }
}
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .transfer-top-container {
        .account-tip {
          margin-left: 0;
        }
      }
      .transfer-plat-wrapper {
        .transfer-plat-item {
          flex-direction: column;
        }
      }

      // .transfer-plat-wrapper {
      //   grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));

      //   .transfer-plat-item {
      //     width: 170px;
      //     height: 136px;
      //     margin-right: 0px;

      //     .transfer-balance-box {
      //       border-left: 5px solid #ffffff;
      //       margin-left: -1px;
      //       padding: 4px 10px 2px;
      //     }

      //     .transfer-action-box {
      //       justify-content: center;

      //       .transfer-btn {
      //         margin-bottom: 12px;
      //       }
      //     }
      //   }
      // }
    }
  }
}
</style>
