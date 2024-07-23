<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Quick Transfer</span>
    </div>
    <div class="account-content"></div>
    <div class="account-content quicktransfer">
      <div class="flex-box transfer-top-container">
        <div class="main">บัญชีหลัก</div>
        <div class="balance">
          <div class="balance-wrapper">
            <span class="currency">{{ store.currency }}</span> {{ mainWallet }}
          </div>
          <div class="balance-refresh" @click="refreshBalance(MAIN)">
            <RiRestartLine />
          </div>
        </div>
      </div>
      <div class="account-tip-text">
        <RiSpamLine />
        E-sports do not need to transfer, recharge and play
      </div>
      <div class="quicktransfer-wrapper">
        <div class="transfer-plat-wrapper">
          <div
            class="transfer-plat-item"
            :class="{
              active: index === isCardActive
            }"
            v-for="(p, index) in platforms"
            :key="p.id"
          >
            <div class="flex-box flex-justify-space transfer-balance-box">
              <div class="platform-details">
                <div class="name-wrapper" @click="showCard(p, index)">
                  <div class="grey">Name</div>
                  <div class="plat-name">{{ p.code }}</div>
                </div>
                <div class="balance-wrapper" @click="showCard(p, index)">
                  <div class="grey">Balance</div>
                  {{ p.amount }}<span class="currency">RM</span>
                </div>
                <div class="balance-refresh" @click="refreshBalance(p.code)">
                  <RiRestartLine />
                </div>
              </div>
            </div>

            <div
              v-if="index === isCardActive"
              class="flex-box flex-wrap transfer-action-box"
            >
              <a-form
                ref="formRef"
                :hideRequiredMark="true"
                :model="transferInfo"
                :rules="rules"
                :label-col="{ span: 4 }"
                type="vertical"
              >
                <a-form-item ref="amount" name="amount" style="margin: 0">
                  <a-input
                    v-model:value="transferInfo.amount"
                    placeholder="Amount"
                  />
                </a-form-item>
              </a-form>
              <button class="transfer-btn" @click="submitTransfer(0, p.code)">
                <div class="in"><RiDownload2Line /></div>
              </button>
              <button class="transfer-btn" @click="submitTransfer(1, p.code)">
                <div class="out"><RiUpload2Line /></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { loadBalance } from "@/api/personal/personal";
import { transfer, getPlatforms } from "@/api/personal/transfer";
import { message } from "ant-design-vue";
import { MAIN } from "@/utils/utils";
import { userStore } from "stores/index";
import { RiSpamLine, RiRestartLine, RiDownload2Line, RiUpload2Line} from "vue-remix-icons";


export default defineComponent({
  name: "TransferView",
  components: {
    RiSpamLine, RiRestartLine, RiDownload2Line, RiUpload2Line
  },
  setup() {
    const store = userStore();
    const platforms = reactive([]);
    const isCardActive = ref();
    const mainWallet = computed(() => {
      return store.balance;
    });
    onMounted(() => {
      loadPlatform();
    });
    const transferModalVisible = ref(false);
    const transferTypes = ["Transfer In To ", "Transfer Out From "];
    const transferTypeIndex = ref(0);
    const transferTypeTitle = computed(() => {
      return transferTypes[transferTypeIndex.value] + transferInfo.platform;
    });
    const transferInfo = reactive({
      platform: "",
      amount: ""
    });
    const transferModal = (i, p) => {
      transferTypeIndex.value = i;
      transferInfo.platform = p;
      transferModalVisible.value = true;
    };
    const refreshBalance = (plat) => {
      console.log(plat)
      if(plat === MAIN){
        store.getBalance();
      }else{
        loadBalance(plat).then((response) => {
          const plaform = platforms.find(p => p.code === plat);
          if (plaform) {
            plaform.amount = response.data;
          }
        }).catch((e) => 
          $q.notify({
            color: "negative",
            position: "top",
            message: e.message,
            icon: "report_problem"
          });
        );
      }
    };
    const loadPlatform = () => {
      getPlatforms().then((response) => {
        response.data.filter(p => p.showTransfer).forEach(p => {
          platforms.push({
            id: p.id,
            code: p.code,
            amount: 0
          });
        });
      }).catch((error) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
      });
    };
    const cancelTransfer = () => {
      transferInfo.platform = "";
      transferInfo.amount = "";
      transferModalVisible.value = false;
    };
    const submitTransfer = (i, p) => {
      transferTypeIndex.value = i;
      transferInfo.platform = p;
      formRef.value[0]
        .validate()
        .then(() => {
          transfer(transferTypeIndex.value, transferInfo).then(() => {
            store.getBalance();
            refreshBalance(transferInfo.platform);
             cancelTransfer();
              $q.notify({
                color: "positive",
                position: "top",
                message: "สำเร็จ",
                icon: "check_circle_outline"
              });

          }).catch((error) => {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: error.message,
            //   icon: "report_problem"
            // });
          });
        });
    };
    const showCard = (item, index) => {
      isCardActive.value = index
      transferInfo.amount = ''
    }
    const formRef = ref();
    const rules = {
      amount: [
        {
          required: true,
          message: "amount is required",
          trigger: "blur"
        },
        {
          pattern: "^([1-9][0-9]*)$",
          message: "amount should be a positive number",
          trigger: "change"
        }
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
      showCard,
      isCardActive
    };
  }
});
</script>
<style lang="scss">
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
    width: 90%;
  }
}
</style>
<style scoped lang="scss">
.quicktransfer {
  min-height: 740px;
  .account-tip-text {
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }
  .main {
    display: block;
  }
}
.account-container {
  .account-content-wrapper {
    .balance-wrapper {
      color: #ffffff;
      font-size: 24px;
      line-height: 24px;
    }

    .quicktransfer-wrapper {
      display: flex;
      gap: 20px;
    }

    .transfer-top-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      padding-bottom: 20px;
      color: #bbbbbb;

      .balance {
        display: flex;
        align-items: center;

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
      // display: grid;
      // padding-top: 30px;
      // grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      // grid-gap: 20px 24px;
      display: grid;
      grid-gap: 20px;
      grid-template-columns: 1fr;
      width: 100%;
      cursor: pointer;

      .plat-name {
        font-size: 18px;
        min-width: 60px;
        font-weight: bold;
      }

      .transfer-plat-item {
        overflow: hidden;
        box-shadow: 0px 0px 30px -10px #000000;
        background: linear-gradient(to right, #724fa1, #7e83ff);
        background: linear-gradient(to right, #724fa1, #dd4744);
        background: linear-gradient(to right, #912c2c, #4d488a);
        transition: all 0.3s ease-in;
        &.active {
        }

        width: 100%;
        display: flex;
        border-radius: 20px;
        overflow: hidden;

        .transfer-balance-box {
          justify-content: space-between;
          width: 100%;
          flex: 1;
        }
        .transfer-action-box {
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          align-items: center;
          background: #4f458b;
          flex: 1;
          padding: 5px;
          :deep(.ant-form) {
            flex: 10;
          }
          :deep(.ant-form-item-control) {
            // flex-direction: row-reverse;
            flex-direction: row;
            align-items: center;
            gap: 5px;
          }
          :deep(.ant-form-item-explain.ant-form-item-explain-error) {
            margin-bottom: 0;
            max-width: 150px;
          }
          .transfer-btn {
            background: transparent;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5px;
            flex: 1;
            .in {
              background: #ffffff;
              width: 40px;
              height: 40px;
              line-height: 20px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              svg {
                width: 20px;
                fill: #8400d1;
              }
            }
            .txt-in {
              color: #8400d1;
            }
            .out {
              width: 40px;
              height: 40px;
              line-height: 20px;
              border-radius: 50%;
              background: #ffffff;

              padding: 10px;
              svg {
                width: 20px;
                fill: #d17600;
              }
            }
            .txt-out {
              color: #d17600;
            }
          }
        }
        .platform-details {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          // background: linear-gradient(to right, #de4545, #db7e42);
          // background: linear-gradient(to right, #dd38ff, #7074f5);
          // background: linear-gradient(to right, #724fa1, #7e83ff);
          .grey {
            display: none;
            font-size: 12px;
            min-width: 50px;
          }
          .name-wrapper {
            flex: 1;
            padding: 10px;
          }
          .balance-wrapper {
            flex: 1;
            padding: 15px;

            text-align: right;
            .currency {
              font-size: 16px;
              color: #dddddd;
              padding-left: 10px;
            }
          }
        }
        position: relative;
        .balance-refresh {
          cursor: pointer;
          padding: 10px;
          z-index: 0;
          svg {
            display: block;
            width: 16px;
            fill: #ffffff;
          }
        }
        .transfericon {
          cursor: pointer;
          svg {
            display: block;
            width: 16px;
            fill: #ffffff;
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
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .transfer-top-container {
        .account-tip {
          margin-left: 0;
        }
      }
      .transfer-plat-wrapper {
        grid-template-columns: 1fr;
        .transfer-plat-item {
          flex-direction: column;
        }
      }
    }
  }
}
</style>
