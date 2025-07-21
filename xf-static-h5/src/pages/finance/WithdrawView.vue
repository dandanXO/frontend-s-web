<template>
  <div class="q-pa-md">
    <!--    <AcctBal :platforms="platforms" />-->
    <div class="">
      <div class="account-content last">
        <div class="withdrawalmethod">
          <div class="title-wrapper" style="padding-bottom: 0px">
            <span>{{ isAutoWithdrawal ? "快速提款" : "提款" }}</span>
            <q-btn v-if="!isAutoWithdrawal" class="upgrade-btn" color="brightbtn" @click="handleUpgradeClick" rounded>
              <img src="../../assets/images/finance/withdraw/rocket-icon.png" />
              <span>升级快速提款</span>
            </q-btn>
          </div>

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
        <q-form ref="withdrawFormRef" class="q-gutter-y-md q-mt-md">
          <q-select
            v-show="isLoaded"
            hide-bottom-space
            ref="cardRef"
            v-model="withdrawInfo.cardId"
            option-value="id"
            emit-value
            :label="'选择' + chooseLabel()"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || '请选择' + chooseLabel()]"
            padding="none"
            style="width: 100%"
            rounded
            outlined
            color="white"
            bg-color="recinputstyle"
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

          <!-- {
          pattern: '^([1-9][0-9]*)$',
          message: "金额应为正数",
          trigger: "change",
        }, -->

          <q-input
            hide-bottom-space
            ref="amountRef"
            v-model="withdrawInfo.amount"
            label="金额"
            :rules="[
              (val) => (val && val.length > 0) || '请输入提款金额',
              (val) => val >= selectedWithdrawalMethod.withdrawMin || '请输入正确的提款金额',
              (val) => val <= selectedWithdrawalMethod.withdrawMax || '请输入正确的提款金额',
              (val) => (val && /^\d+$/.test(val)) || '提款金额不能有小数',
              !isUSDT ? (val) => (!isUSDT && /^([1-9][0-9]*)$/.test(val)) || '金额应为正数' : true
            ]"
            clearable
            label-color="brand"
            rounded
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
                <q-btn @click="updateWithdrawAmt" label="全额提款" color="brightbtn" rounded />
              </span>
            </template>
          </q-input>
          <div
            class="q-mt-md q-mb-md text-grey q-pb-md"
            style="border-bottom: 1px solid #434343"
            v-show="selectedWithdrawalMethod"
          >
            <div v-if="isAutoWithdrawal && selectedWithdrawalMethod.currencyId" class="upgraded-helper-text">
              <span>可提余额：{{ selectedWithdrawalMethod.withdrawableBalance }}{{ store.currency.label }}</span>
              <span>剩余流水：{{ selectedWithdrawalMethod.remainWagers }}{{ store.currency.label }}</span>
            </div>
            <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
              {{
                "单笔提款：" +
                selectedWithdrawalMethod.withdrawMin +
                "RMB - " +
                selectedWithdrawalMethod.withdrawMax +
                "RMB"
              }}
              <br />
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
              {{ "今日提款: " + selectedWithdrawalMethod.withdrawMaxAmount + "RMB" }}
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
              {{ " 剩余: " + selectedWithdrawalMethod.withdrawMaxTimes + " 次" }}
            </template>
          </div>
          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div class="" style="display: flex; justify-content: center; align-items: center">
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
            <div class="q-mt-md q-mb-md text-center" v-if="selectedWithdrawalMethod.code !== 'SZPAY'">
              <q-btn
                style="border: 1px solid #33bcd4; color: #33bcd4"
                rounded
                @click="openEWalletTutorial"
                :label="tutorialLabel()"
              />
            </div>
            <div
              class="q-mt-md text-orange"
              v-if="['KDPAY', 'EBPAY', 'OKPAY', 'JDPAY', 'BLBPAY', 'SZPAY', 'NINEPAY'].includes(selectedWithdrawalMethod.code)"
            >
              <span>*特别说明：请在App钱包完成实名验证，确保钱包绑定和游戏注册姓名一致！</span>
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
              class="q-mt-md fit"
              color="brightbtn"
              @click="submitWithdraw"
              :loading="withdrawLoading"
              :disable="withdrawLoading"
              label="立即提款"
              size="md"
              rounded
            />
          </div>
          <div class="q-py-md text-orange">
            <div
              v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
            <div v-if="isALIPAY" class="selected-tip">
              “支付宝提款”可用时间：早 10 点 - 晚 12 点，其他时间提交系统会自动取消！
            </div>
          </div>
        </q-form>
      </div>
    </div>

    <q-dialog v-model="hasWithdrawCard" persistent>
      <q-card style="width: 100%; padding: 10px">
        <q-card-section class="q-mb-md">
          <div class="text-h6 text-center">请先绑定银行卡</div>
        </q-card-section>

        <div class="flex flex-center">
          <router-link to="/account">
            <q-btn class="q-mr-md" label="取消" />
          </router-link>
          <router-link to="/account/withdraw">
            <q-btn color="brightbtn" label="绑定" />
          </router-link>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isShowWithdrawErrorBlock" persistent no-backdrop-dismiss no-esc-dismiss>
      <q-card style="width: 100%; max-width: 290px; padding: 15px; flex-direction: column">
        <q-card-section class="q-mb-md">
          <!-- <div class="text-h6 text-center">请先完成上比提款</div> -->
          您需要在交易记录-提款记录中点击 "确认到账" 完成上笔提款后, 才能提交新的提款订单。 感谢您的配合!
        </q-card-section>

        <div class="flex flex-center">
          <div>
            <q-btn style="width: 100px" @click="isShowWithdrawErrorBlock = false" class="q-mr-md" label="取消" />
          </div>
          <router-link to="/account/records/withdraw">
            <q-btn style="width: 100px" color="brightbtn" label="前往确认" />
          </router-link>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
      <q-card style="width: 100%; padding: 20px" class="text-white">
        <q-card-section class="q-mb-md">
          <strong style="display: inline-block; padding-bottom: 16px; font-size: 20px">完成以下认证才可以提款</strong>
          <div v-if="!store.realName" style="margin: 16px 0">
            <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between">
              <div class="">
                <p style="margin: 0; color: #fff; font-size: 16px">提款需要绑定真实姓名</p>
                <div style="font-size: 12px; color: #d1d1d1">为了您的资金安全，银行卡姓名需一致</div>
              </div>

              <q-btn @click="router.push('/account/personal')" color="brightbtn" label="去绑定" />
            </div>
          </div>

          <div v-if="!store.phone">
            <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between">
              <div class="">
                <p style="margin: 0; color: #fff; font-size: 16px">提款需要绑定手机号</p>
                <div style="font-size: 12px; color: #d1d1d1">为了您的资金安全，请绑定手机号</div>
              </div>
              <q-btn @click="router.push('/account/personal')" color="brightbtn" label="去绑定" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn style="width: 100%" label="暂不认证" color="brightbtn" @click="isNewUser = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <WithdrawRemainingDialog v-if="isShowRemainingDialog" v-model="isShowRemainingDialog" />
  </div>
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import AcctBal from "../../components/AcctBal.vue";
import {useLocalStorage} from "@vueuse/core";
import {useRouter} from "vue-router";
import WithdrawRemainingDialog from "src/components/WithdrawRemainingDialog.vue";

export default defineComponent({
  name: "WithdrawView",
  components: {AcctBal, WithdrawRemainingDialog},
  setup() {
    const store = userStore();
    const $q = useQuasar();
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value;
    const imgWithdrawURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/withdraw/";
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
      isUSDT.value = withdrawInfo.withdrawCode.includes('USDT')
      isEWALLET.value = withdrawInfo.withdrawCode.includes('KDPAY') || withdrawInfo.withdrawCode.includes('EBPAY') || withdrawInfo.withdrawCode.includes('OKPAY')|| withdrawInfo.withdrawCode.includes('SZPAY') || withdrawInfo.withdrawCode.includes('JDPAY') || withdrawInfo.withdrawCode.includes('BLBPAY') || withdrawInfo.withdrawCode.includes('NINEPAY')
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
            if (element.bankType === "BANK") {
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
        return 'K 豆教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'EBPAY') {
        return 'EB 使用教程'
      } else if (selectedWithdrawalMethod.value.code === 'OKPAY') {
        return 'OK 教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'BLBPAY') {
        return '808 钱包教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'JDPAY') {
        return 'JDPAY 教程视频'
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
      if (!store.phone || !store.realName) {
        isNewUser.value = true;
        return false;
      }

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
      isShowWithdrawErrorBlock
    };
  }
});
</script>

<style scoped lang="scss">
.withdrawalmethod {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  overflow-x: auto;
  padding: 16px;
  grid-gap: 16px;
  background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
  border-radius: 6px;

  .withdraw-type-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-width: 2px;
    border-style: solid;
    border-radius: 6px;
    border-color: rgba(217, 217, 217, 0.3019607843);
    background-color: #273354;
    position: relative;
    cursor: pointer;

    img {
      display: block;
      width: 100%;
      background-color: transparent;
      margin-bottom: 0;
      padding: 12px 12px 8px;
      max-width: 60px;
    }

    .promo-label {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translate(-50%);
      width: 40px;

      img {
        width: 100%;
        display: block;
        padding: 0;
        max-width: 40px;
      }
    }

    .withdraw-img {
      // border: 2px solid transparent;
      // border-radius: 6px;
      // margin-bottom: 5px;
    }

    &.active {
      // background: #212534;
      // color: #db7e42;
      // box-shadow: none;
      // filter: drop-shadow(0px 0px 3px #ffffff);
      border-color: #00bfd7;
      position: relative;

      &:before {
        display: block;
        content: "";
        position: absolute;
        bottom: -2px;
        right: -2px;
        height: 20px;
        width: 20px;
        z-index: 3;
        background-image: url("../../assets/images/finance/node-tick.png");
        background-size: 100%;
        background-position: center center;
      }
    }

    .type-name {
      // line-height: 15px;
      font-size: 10px;
      margin-bottom: 6px;
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

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  grid-column: span 4;

  .upgrade-btn {
    padding: 1px 12px;
    margin-left: auto;
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
</style>
