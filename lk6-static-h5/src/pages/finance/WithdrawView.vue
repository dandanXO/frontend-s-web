<template>
  <div class="withdraw-section">
    <div class="title-wrapper q-pa-md" style="padding-bottom: 0px">
      <span>{{ isAutoWithdrawal ? "快速提款" : "提款" }}</span>
      <q-btn v-if="!isAutoWithdrawal" class="upgrade-btn" flat @click="handleUpgradeClick">
        <img src="../../assets/images/finance/withdraw/rocket-icon.png" />
        <span>升级快速提款</span>
      </q-btn>
    </div>
    <!--    <AcctBal :platforms="platforms" />-->
    <div class="q-pa-md">
      <div class="account-content last">
        <!-- <label class="label">选择提款方式</label> -->

        <div class="withdrawalmethod">
          <div
            v-for="(method, i) in withdrawalMethods"
            :key="i"
            class="txt-center withdraw-type-item"
            @click="selectMethod(method, i)"
            :class="{ active: i === activeItem }"
          >
            <span class="promo" v-if="method.recommended">Recommended</span>
            <div class="withdraw-img">
              <img :src="imgURL + '/withdraw/' + method.icon" />
            </div>
            <div class="type-name">{{ method.name }}</div>

            <div class="promo-label">
              <img class="promo-img" v-if="method.privilegeIcon" :src="`${imgWithdrawURL}${method.privilegeIcon}`" />
            </div>
          </div>
        </div>

        <!-- <q-separator style="margin-top: 12px; margin-bottom: 15px" /> -->

        <div class="main-wallet">
          <div class="desc">主钱包</div>
          <div class="amount">
            {{ convertToCommaAmount(store.balance) }}
          </div>
          <q-btn class="refresh-btn" flat @click="store.getBalance">一键刷新</q-btn>
        </div>

        <!-- <label class="label">{{ chooseLabel() }}</label> -->
        <q-form>
          <q-select
            v-show="isLoaded"
            class="withdraw-input"
            hide-bottom-space
            standout
            ref="cardRef"
            v-model="withdrawInfo.cardId"
            option-value="id"
            emit-value
            :label="'选择' + chooseLabel()"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || '请选择' + chooseLabel()]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ "没有可用的" + chooseCard() }}
                  <router-link class="text-bright" to="/account/withdraw">
                    {{ isUSDT || isEWALLET ? "加" + chooseCard() : "绑定" + chooseCard() }}
                  </router-link>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar v-if="scope.opt.bankIcon">
                  <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.bankName }} - ****{{
                      scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
              <q-item-section avatar v-if="scope.opt.bankIcon">
                <img
                  style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                  :src="imgURL + '/payment/' + scope.opt.bankIcon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                  {{ scope.opt.bankName }} - {{ scope.opt.cardNumber }}
                </q-item-label>
              </q-item-section>
            </template>
          </q-select>

          <!-- <q-separator style="margin-top: 14px; margin-bottom: 14px" /> -->

          <!-- <label class="label">提款金额</label> -->
          <q-input
            class="withdraw-input"
            hide-bottom-space
            ref="amountRef"
            v-model="withdrawInfo.amount"
            standout
            placeholder="请输入金额"
            :rules="[
              (val) => (val && val.length > 0) || '请输入提款金额',
              (val) => val >= selectedWithdrawalMethod.withdrawMin || '请输入正确的提款金额',
              (val) => val <= selectedWithdrawalMethod.withdrawMax || '请输入正确的提款金额',
              (val) => (val && /^\d+$/.test(val)) || '提款金额不能有小数',
              !isUSDT ? (val) => (!isUSDT && /^([1-9][0-9]*)$/.test(val)) || '金额应为正数' : true
            ]"
            clearable
          >
            <template v-slot:prepend>
              <span style="font-size: 14px">取款金额</span>
            </template>
            <!-- <template v-slot:append>
              <span style="font-size: 26px" class="text-bright">
                <q-btn class="bigamount-btn" @click="updateWithdrawAmt" label="全额提款" color="dyblue" />
              </span>
            </template> -->
          </q-input>
          <div class="q-mt-md q-mb-md" style="color: #7a80a1" v-show="selectedWithdrawalMethod">
            <!-- <div v-if="!isShowRemainingDialog && isAutoWithdrawal && selectedWithdrawalMethod.currencyId" class="upgraded-helper-text">
              <span>可提余额：{{ selectedWithdrawalMethod.withdrawableBalance }}{{ store.currency.label }}</span>
              <span>剩余流水：{{ selectedWithdrawalMethod.remainWagers }}{{ store.currency.label }}</span>
            </div> -->
            <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
              {{
                "单笔提款: " +
                selectedWithdrawalMethod.withdrawMin +
                "RMB - " +
                selectedWithdrawalMethod.withdrawMax +
                "RMB"
              }}
              <br style="margin-top: 10px" />
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
              {{ "今日提款: " + selectedWithdrawalMethod.withdrawMaxAmount + "RMB" }}
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
              {{ " 剩余: " + selectedWithdrawalMethod.withdrawMaxTimes + " 次" }}
            </template>
          </div>
          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div class="q-my-md" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">实施汇率：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>
            </div>
            <div class="q-mt-md" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">预计到帐：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                {{
                  selectedWithdrawalMethod && withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin
                    ? "0.00"
                    : (
                        withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                        selectedWithdrawalMethod.withdrawFee
                      ).toFixed(2)
                }}
                USDT
              </span>
            </div>
          </div>
          <div v-else-if="isEWALLET && !!selectedWithdrawalMethod.url">
            <span class="tip-text">*特别说明：请在App钱包完成实名验证，确保钱包绑定和游戏注册姓名一致！</span>
            <div class="q-mt-md q-mb-md text-center" v-if="selectedWithdrawalMethod.code !== 'SZPAY'">
              <q-btn class="tutorial-btn" flat @click="openEWalletTutorial" :label="tutorialLabel()" />
            </div>
          </div>

          <div class="q-mt-md text-neontb" v-if="selectedWithdrawalMethod.withdrawFee">
            *提币手续费：{{ selectedWithdrawalMethod.withdrawFee }} USDT
          </div>
          <!-- <a-form-item
            class="select"
            name="cardId"
            label="Select Bank Card"
            :rules="[{ required: true, message: 'Please select a bank card' }]"
          >
            <a-select
              v-model:value="withdrawInfo.cardId"
              placeholder="Please select a bank card"
            >
              <a-select-option
                v-for="b in withdrawState.bankCardList"
                :key="b.id"
                :value="b.id"
              >
                {{ b.bankName }} - {{ b.cardNumber }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
          <div class="flex-box flex-justify-center">
            <q-btn
              style="width: 100%"
              class="q-mt-md submit-btn"
              @click="submitWithdraw"
              :loading="withdrawLoading"
              :disable="withdrawLoading"
              label="立即提款"
            />
          </div>
          <div class="q-py-md text-orange">
            <div
              v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
            <!--            <div v-if="isALIPAY" class="selected-tip">-->
            <!--              “支付宝提款” 可用时间：早10点-晚12点，其他时间提交系统会自动取消！-->
            <!--            </div>-->
          </div>
        </q-form>
      </div>
    </div>

    <CommonModal
      v-model="hasWithdrawCard"
      persistent
      no-backdrop-dismiss
      no-esc-dismiss
      header="请先绑定银行卡"
      :closable="false"
    >
      <template #action>
        <div class="cacnels common-md-white-btn">
          <router-link to="/account">取消</router-link>
        </div>
        <div class="confirmsbtns common-md-btn">
          <router-link to="/account/withdraw">绑定</router-link>
        </div>
      </template>
    </CommonModal>

    <CommonModal
      v-model="isShowWithdrawErrorBlock"
      persistent
      no-backdrop-dismiss
      no-esc-dismiss
      message="您需要在交易记录-提款记录中点击“确认到账”完成上笔提款后, 才能提交新的提款订单。 感谢您的配合!"
      :closable="false"
    >
      <template #action>
        <div class="cacnels common-md-white-btn" @click="isShowWithdrawErrorBlock = false">取消</div>
        <div class="confirmsbtns common-md-btn">
          <router-link to="/account/records/withdraw">前往确认</router-link>
        </div>
      </template>
    </CommonModal>

    <WithdrawRemainingDialog v-if="isShowRemainingDialog" v-model="isShowRemainingDialog" />
  </div>
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, reactive, ref, onMounted, computed, onActivated} from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import AcctBal from "../../components/AcctBal.vue";
import { useLocalStorage } from "@vueuse/core";
import {useRouter} from "vue-router";
import WithdrawRemainingDialog from "src/components/WithdrawRemainingDialog.vue";
import { convertToCommaAmount } from "src/boot/utils";
import CommonModal from "src/components/CommonModal.vue";

export default defineComponent({
  name: "WithdrawView",
  components: {AcctBal, WithdrawRemainingDialog, CommonModal},
  setup() {
    const store = userStore();
    const $q = useQuasar();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;
    const imgWithdrawURL = imgURL + "/withdraw/";
    const router = useRouter();

    const amountRef = ref();
    const cardRef = ref();
    const activeItem = ref(0);
    const withdrawFormRef = ref(null);
    const withdrawState = reactive({
      bankCardList: []
    });
    const qs = require("qs");
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: ""
    });
    const isNewUser = ref(false);
    const isLoaded = ref(false);
    const isShowRemainingDialog = ref(false)

    const hasWithdrawCard = computed(() => {
      return (isLoaded == true) && withdrawState.bankCardList.length === 0;
    });
    const withdrawalMethods = ref([]);
    const selectedWithdrawalMethod = ref([]);
    onMounted(() => {
      isLoaded.value= false;
      checkNewUser();
      getWithdrawalMethods();
      store.getBalance();
      // loadPlatform()
    });
    const platforms = reactive([]);
    const loadPlatform = () => {
      api.get("/platform").then((res) => {
        res.data.forEach(p => {
          if (p.walletType !== "SEAMLESS") {
            platforms.push({
              id: p.id,
              code: p.code,
              amount: 0
            });
          }
        });
        refreshBalance("all");
      });
    };
    const refreshBalance = (plat) => {
      if (plat === "all") {
        platforms.forEach(platform => {
          platform.isLoading = true;
          if (platform.code) {
            api.get("/session/balance", {params: {platform: platform.code}}).then((res) => {
              if (platform) {
                platform.amount = res.data;
                platform.isLoading = false;
              }
            }).catch((e) => {
                  platform.isLoading = false;
                }
            );

          }
        });
      }
    };

    const withdrawLoading = ref(false);
    const isShowWithdrawErrorBlock = ref(false);
    const submitWithdraw = () => {
      if (!checkNewUser()) return

      cardRef.value.validate();
      amountRef.value.validate();
      $q.loading.show({
        message: "确认中。。。"
      });
      withdrawLoading.value = true;
      if (cardRef.value.hasError || amountRef.value.hasError) {
        $q.loading.hide();
        withdrawLoading.value = false;
      } else {
        api.post("/session/withdraw/", qs.stringify(withdrawInfo)).then((response) => {
          if (response.code === 1312) {
            isShowWithdrawErrorBlock.value = true;
            withdrawLoading.value = false;
            return
          }
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "提交成功",
              icon: "check_circle_outline"
            });
            getWithdrawalMethods();
            withdrawLoading.value = false;

          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: response.message,
              icon: "report_problem"
            });
            withdrawLoading.value = false;
          }
        }).catch((error) => {
          console.log("error", error);
          withdrawLoading.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: response.message,
          //   icon: "report_problem"
          // });
        });
        $q.loading.hide();
      }
    };
    const isUSDT = ref(false);
    const isEWALLET = ref(false);
    const isALIPAY = ref(false);
    const selectMethod = (method, index) => {
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      selectedWithdrawalMethod.value = method;
      withdrawInfo.withdrawCode = method.code;
      console.log("WITHDRAW CODE:" + withdrawInfo.withdrawCode)
      isUSDT.value = withdrawInfo.withdrawCode.includes('USDT')
      isEWALLET.value = withdrawInfo.withdrawCode.includes('KDPAY') || withdrawInfo.withdrawCode.includes('EBPAY') || withdrawInfo.withdrawCode.includes('OKPAY') || withdrawInfo.withdrawCode.includes('SZPAY') || withdrawInfo.withdrawCode.includes('JDPAY') || withdrawInfo.withdrawCode.includes('BLBPAY')
      isALIPAY.value = withdrawInfo.withdrawCode.includes('ALIPAY')
      activeItem.value = index;
      loadCards();
    };

    const loadCards = () => {
      withdrawState.bankCardList = [];
      api.get("/session/bankCard").then((response) => {
        isLoaded.value = true;
        if (response.code === 0) {
          // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
          response.data.forEach(element => {
            if (element && element.bankType === "BANK") {
              if (element.bankCode !== 'alipay' && element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                withdrawState.bankCardList.push(element)
              }
              if (element.bankCode === 'alipay' && selectedWithdrawalMethod.value.code === 'ALIPAY') {
                withdrawState.bankCardList.push(element)
              }
            } else {
              if (element.bankCode && element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
                withdrawState.bankCardList.push(element);
              }
            }
          });
          // else {
          //   response.data.forEach(element => {
          //     if (element.bankId !== 39) {
          //       withdrawState.bankCardList.push(element)
          //     }
          //   });
          // }

          if (cardRef.value) {
            cardRef.value.resetValidation();
          }
          if (amountRef.value) {
            withdrawInfo.amount = "";
            amountRef.value.resetValidation();
          }
        }
      }).catch((error) => {
        console.log("error", error);
      });
    };
    const getWithdrawalMethods = () => {
      api.get("/session/withdraw/entrance/status").then((response) => {
        if (response.code === 0) {
          if(isAutoWithdrawal.value){
            isShowRemainingDialog.value = !response.data.withdrawStatus
          }
          const withdrawShowList = []
          response.data.withdrawShowList.forEach(element => {
            if (element.status) {
              withdrawShowList.push(element)
            }
          });
          withdrawalMethods.value = withdrawShowList;
          //Remove this for real data
          // withdrawalMethods.value = [
          //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
          //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]
          if (withdrawalMethods.value.length > 0) {
            selectMethod(withdrawalMethods.value[0], 0);
          }
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      });
    };
    const updateWithdrawAmt = () => {
      withdrawInfo.amount = JSON.stringify(Math.floor(store.balance));
    };

    const chooseLabel = () => {
      if (isUSDT.value) {
        return '钱包地址'
      } else if (isEWALLET.value) {
        return '电子钱包'
      } else if (isALIPAY.value) {
        return '支付宝'
      } else {
        return '银行卡'
      }
    }

    const chooseCard = () => {
      if (isUSDT.value) {
        return '虚拟钱包'
      } else if (isEWALLET.value) {
        return '电子钱包'
      } else if (isALIPAY.value) {
        return '支付宝卡'
      } else {
        return '银行卡片'
      }
    }
    const tutorialLabel = () => {
      if (selectedWithdrawalMethod.value.code === 'KDPAY') {
        return 'K豆教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'EBPAY') {
        return 'EB使用教程'
      } else if (selectedWithdrawalMethod.value.code === 'OKPAY') {
        return 'OK教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'BLBPAY') {
        return '808钱包教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'JDPAY') {
        return 'JDPAY教程视频'
      }
    }
    const openEWalletTutorial = () => {
      if(!selectedWithdrawalMethod.value.url) return
      window.open(selectedWithdrawalMethod.value.url);

    };

    const isAutoWithdrawal = computed(() => store.withdrawType === 'AUTO_WITHDRAW')

    const handleUpgradeClick = () => {
      $q.loading.show({
        message: "升级中。。。"
      });
      api.get("/session/updateAutoWithdraw").then(async (res) => {
        if(res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "成功升级为快速提款!",
            icon: "check_circle_outline"
          });
          await store.getMemberInfo()
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: res.message,
            icon: "report_problem"
          })
        }
      }).finally(() => $q.loading.hide())
    }

    const checkNewUser = () => {
      // if (!store.phone || !store.realName) {
      //   isNewUser.value = true;
      //   return false;
      // }

      return true
    }
    return {
      noDecimalRule: (val) => /^([1-9][0-9]*)$/.test(val) || '金额应为正数',
      amountRef,
      cardRef,
      withdrawInfo,
      submitWithdraw,
      withdrawState,
      withdrawalMethods,
      activeItem,
      selectMethod,
      imgURL,
      imgWithdrawURL,
      step: ref(),
      selectedWithdrawalMethod,
      loadCards,
      isUSDT,
      isEWALLET,
      isALIPAY,
      store,
      updateWithdrawAmt,
      platforms,
      hasWithdrawCard,
      withdrawFormRef,
      isLoaded,
      chooseLabel,
      chooseCard,
      openEWalletTutorial,
      tutorialLabel,
      withdrawLoading,
      isAutoWithdrawal,
      handleUpgradeClick,
      isNewUser,
      router,
      isShowRemainingDialog,
      isShowWithdrawErrorBlock,
      convertToCommaAmount
    };
  }
});
</script>

<style scoped lang="scss">
.withdraw-section {
  .withdrawalmethod {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    text-align: center;
    padding: 5px 16px 10px;
    grid-gap: 20px 10px;
    margin-bottom: 16px;

    .withdraw-type-item {
      // display: flex;
      // justify-content: center;
      box-shadow: 0px 1px 4px 0px #00000033;
      background: #fff;
      padding: 8px 0 6px;
      width: 100%;
      border: 2px solid transparent;
      border-radius: 6px;
      position: relative;
      cursor: pointer;

      .promo-label {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        //width: 50px;
        width: 80%;
        max-width: 4.2rem;

        img {
          width: 100%;
          height: auto;
          padding: 4px 6px;
        }
      }

      .withdraw-img {
        width: 100%;
        padding: 0 4px;
        display: flex;
        align-items: center;

        img {
          width: 100%;
          max-width: 50%;
          margin: 0 auto;
          padding: 0;
        }
      }

      img {
        width: 100%;
        padding: 0px 5px;
      }

      &.active {
        border: 2px solid #4873f1;
        // background: #212534;
        // color: #db7e42;
        // box-shadow: none;
        // filter: drop-shadow(0px 0px 3px #ffffff);

        .promo-img {
          border: none;
          border-radius: 0px;
        }

        // img {
        //   border: 2px solid #33bcd4;
        // }
      }

      .type-name {
        line-height: 1.1em;
        font-size: 0.9em;
        font-weight: 600;
        overflow-wrap: break-word;
      }

      .promo {
        position: absolute;
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: top center;
        top: -8px;
        right: -1px;
        background: linear-gradient(to right, #de4545, #db7e42);
        padding: 5px;
        color: #ffffff;
        font-size: 12px;
        line-height: 10px;
        border-radius: 0 10px;
        font-weight: bold;

        ::after {
          position: relative;
        }
      }
    }

    .withdraw-btn {
      margin: 30px auto;

      &.cancel {
        margin-right: 60px;
      }
    }
  }

  .bigamount-btn {
    background: linear-gradient(180deg, #52acff 0%, #3559da 100%);
    height: 45px;
    width: 100px;
    letter-spacing: 1px;
    border-radius: 12px;
  }

  .label {
    font-weight: 600;
    font-size: 16px;
    padding-bottom: 6px;
    display: block;
  }

  .submit-btn {
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
    border: 1px solid #ffffff;
    border-radius: 30px;
    height: 48px;
    font-size: 16px;
    color: #fff;
  }
}

.tip-text {
  color: #ff7f10;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #333333;
  .upgrade-btn {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 118.52%);
    border-radius: 20px;
    padding: 1px 12px;
    color: #fff;
    img {
      height: 30px;
    }
  }
}

.upgraded-helper-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #00a478;
}

.flex-direction-column {
  flex-direction: column;
}

.main-wallet {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fcfdfe;
  border-radius: 7px;
  padding: 12px;
  margin-bottom: 12px;

  .desc {
    color: #333333;
  }
  .amount {
    color: #00a0ea;
    flex: 1;
  }
  .refresh-btn {
    background-image: url("../../assets/images/index/primary-btn.png");
    background-size: 100% 100%;
    color: #fff;
    width: 87px;
    text-align: center;
    white-space: nowrap;
    font-size: 12px;
    aspect-ratio: 87/32;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    box-shadow: 0px -0.87px 3.47px 0px #ffffff;
    border-radius: 45.9px;
    margin-right: 5px;
  }
}

.withdraw-input {
  width: 100%;
  border-radius: 7px;
  overflow: hidden;
  margin-bottom: 12px;

  &.q-input {
    :deep(.q-field__inner) {
      .q-field__control {
        .q-field__control-container {
          padding-top: 0;
        }

        .q-field__native,
        .q-field__append,
        .q-field__prepend {
          color: #333;
          &::placeholder {
            color: #a4aabb;
            opacity: 1;
          }
        }
      }
    }
  }

  :deep(.q-field__inner) {
    .q-field__control,
    .q-field__marginal {
      height: 44px;
      min-height: 44px;
    }
    .q-field__control {
      background: #fcfdfe;
      box-shadow: none;

      &::before {
        border-bottom: none;
      }

      .q-field__control-container {
        padding-top: 4px;
      }

      .q-field__native,
      .q-field__append,
      .q-field__prepend {
        color: #333;
        &::placeholder {
          color: #333333;
          opacity: 1;
        }
      }

      .q-field__label {
        top: 14px;
        font-size: 14px;
        color: #333333;
      }
    }
  }
}

.tutorial-btn {
  color: #458bff;
}
</style>
