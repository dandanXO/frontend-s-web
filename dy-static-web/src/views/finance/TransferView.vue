<template>
  <div>
    <div class="balance">
      <div class="menu-title-container">
        <el-row style="width: 100%">
          <!-- <el-col :span="20"> -->
          <!-- <div class="balance-wrapper">
            <span class="currency">主账户:</span> ￥{{ mainWallet }}
          </div> -->
          <!-- <span class="menu-title">快速转账</span>
            </el-col> -->
          <el-col :span="4">
            <el-button type="success" size="small" class="common-btn" @click="transferOutAllModal">一键转出</el-button>
            <el-button type="success" size="small" class="common-btn" @click="refreshAllModal">一键刷新</el-button>
          </el-col>

          <el-col :span="20">
            <div class="balance-transfer-button">
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
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- <div class="balance-refresh" @click="refreshBalance(MAIN)">
            <el-icon><Refresh style="color: #ffffff" /></el-icon>
          </div> -->
    </div>
    <div class="account-content quicktransfer">
      <div class="flex-box transfer-top-container">
        <div class="account-content">
          <div class="account-tip-text green">
            <el-icon>
              <img src="../../assets/images/account/transfer_tip.png" />
            </el-icon>
            除了以下平台需要转账，其它游戏平台都无需转账即可游戏
          </div>
        </div>
        <!--<div class="account-tip">
        E-Sports do not need to transfer, recharge and play
        </div>-->
      </div>
      <div class="transfer-plat-wrapper">
        <div class="transfer-plat-item" v-for="p in platforms" :key="p.id">
          <div class="flex-box flex-justify-space transfer-balance-box">
            <div class="platform-details">
              <div class="plat-name" v-if="p.code === 'FlashTech'">
                <div class="charge-icon" />
                Sport
              </div>
              <div class="plat-name" v-else>
                <div class="charge-icon" />
                {{ platNames[p.code] || p.name }}
              </div>
              <div class="balance-wrapper">
                <span class="currency">余额:</span>
                {{ p.amount }}
              </div>
            </div>
            <div class="balance-refresh" @click="refreshBalance(p.code)">
              <!-- <el-icon><Refresh /></el-icon> -->
              <div class="refresh-icon" />
            </div>
          </div>
          <div class="flex-box flex-justify-space flex-wrap transfer-action-box">
            <el-button v-if="!autoTransfer" size="small" class="outline transfer-btn in" @click="transferModal(0, p)">
              转进
            </el-button>
            <el-button v-if="!autoTransfer" size="small" class="transfer-btn out" @click="transferModal(1, p)">
              转出
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
          <div class="right-icon" />
          <el-tag type="success" effect="dark">
            {{ transferInfo.platform }}
          </el-tag>
        </div>
      </template>
      <el-form ref="formRef" :hideRequiredMark="true" :model="transferInfo" :rules="rules" :label-col="{ span: 4 }">
        <el-form-item ref="amount" prop="amount">
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
          <el-button class="common-btn" :loading="loadingTransfer" @click="submitTransfer">确定</el-button>
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
  </div>
</template>

<script lang="js">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { loadBalance } from "@/api/personal/personal";
import { transfer, withdrawAll, getPlatforms, getLoggedInPlatformList, updateAutoTransferState, getAutoTransferState } from "@/api/personal/transfer";
import { ElMessage } from "element-plus";
import { MAIN } from "@/utils/utils";
import { userStore } from "@/store";
// import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "TransferView",
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
      platform: "",
      amount: ""
    });

    const platNames = {"KY": "开元棋牌", "DT": "大唐棋牌", "BBINDY": "BBIN", "SGWin": "双赢彩票", "AGF": "PA捕鱼" };

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
              console.log(plat, response.data)
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
            console.log(err);
            loadingTransfer.value = false;
        });
      loadingTransfer.value = false
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
      getAutoTransfer,
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
      padding-bottom: 20px;
      .balance {
        display: flex;
        align-items: center;
        margin: 10px 0;
        .transfer-btn {
          padding: 5px;
        }
        .balance-wrapper {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          align-items: center;
          font-size: 14px;
          margin-right: 50px;
          color: #30a73b;
          .currency {
            color: #000000;
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

    .transfer-plat-wrapper {
      display: grid;
      padding-top: 30px;
      margin: 0 auto;
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      // grid-gap: 20px 24px;
      // display: grid;
      // grid-gap: 20px;
      // grid-template-columns: 1fr 1fr;
      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
      // flex-wrap: wrap;
      // gap: 10px;
      .transfer-plat-item {
        // display: flex;
        background: url(../../assets/images/account/transfer_box_bg.png) no-repeat top left;
        background-size: cover;
        // width: 238px;
        // height: auto;
        // height: 128px;
        // border-radius: 2px;
        // margin: 0 0 23px 14px;
        // padding: 10px 20px 30px;
        // flex-direction: column;
        border-radius: 8px;
        position: relative;
        // background-color: #e6ffff;
        box-shadow: 0 2px 5px 2px rgba(167, 167, 167, 0.2);
        // width: 28%;
        .transfer-balance-box {
          align-items: center;
        }
        .transfer-action-box {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 15px;
          width: 78%;

          .transfer-btn {
            background-color: #3bafda;
            box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);
            border-radius: 2px;
            border: 0;
            // border: 1px solid #22737f;
            color: #fff;
            padding: 2px 20px;
            font-size: 12px;
            line-height: 14px;
            cursor: pointer;
            margin-bottom: 20px;

            &.outline {
              background-image: linear-gradient(267deg, #78abfa 0, #4877ec 100%), linear-gradient(#5b80e7, #5b80e7);
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
            margin-bottom: 5px;
            -webkit-box-shadow: 2px 5px 10px rgb(138 146 154 / 15%);
            box-shadow: 2px 5px 10px rgb(138 146 154 / 15%);
            color: #fff;
            border-radius: 0 3px 3px 0;
            background: #1abc9c;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            margin-left: -7px;
            margin-top: 15px;
            gap: 5px;
            padding: 2px 10px;
            &:before {
              content: " ";
              border-style: solid;
              border-width: 10px;
              display: block;
              position: absolute;
              bottom: -10px;
              left: 0;
              margin-bottom: -10px;
              z-index: -1;
              border-color: #148f77 transparent transparent;
            }

            &::after {
              content: " ";
              background: url(../../assets/images/account/transfer_item_bg.png) no-repeat center center;
              background-position: -2px -33px;
              background-size: 1400%;
              display: block;
              position: absolute;
              width: 15px;
              height: 15px;
              bottom: -15px;
              left: 10px;
              margin-bottom: 0px;
              z-index: -1;
              border-color: #2494be transparent transparent;
            }
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
            .remixicon {
              fill: #ffffff;
              width: 15px;
            }
          }
          .balance-wrapper {
            display: flex;
            justify-content: flex-start;
            width: 65%;
            align-items: center;
            color: #a56322;
            margin: 0px auto 15px;
            .currency {
              color: #1f356b;
              font-size: 14px;
              line-height: 16px;
              margin-right: 10px;
            }
          }
        }
        .balance-refresh {
          position: absolute;
          right: 35px;
          top: 10px;
          cursor: pointer;
          margin-left: 10px;
          .el-icon {
            display: block;
            color: #3865e8;
            svg {
              width: 25px;
              height: 25px;
            }
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

.balance-transfer-button {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
  font-size: 14px;
}

.charge-icon,
.refresh-icon,
.right-icon {
  background: url("../../assets/images/account/charge-icons.png") no-repeat center center;
  background-size: auto 100%;
  width: 28px;
  height: 28px;
}

.charge-icon {
  background-position: 0% 0%;
}

.refresh-icon {
  background-position: 28% 0%;
}

.right-icon {
  background-position: 54% 0%;
}
</style>
