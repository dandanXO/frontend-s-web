<template>
  <div>
    <!--    <AcctBal :platforms="platforms" />-->
    <div class="q-pa-md bg-dark q-mx-sm q-my-md">
      <div class="account-content last">
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
          </div>
        </div>
        <q-form ref="withdrawFormRef">
          <q-select
            v-show="isLoaded"
            hide-bottom-space
            filled
            ref="cardRef"
            v-model="withdrawInfo.cardId"
            option-value="id"
            emit-value
            :label="'选择' + chooseLabel()"
            color="white"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || '请选择' + chooseLabel()]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ "没有可用的" + chooseCard() }}
                  <router-link class="text-bright" to="/account/withdraw">
                    {{
                      isUSDT || isEWALLET
                        ? "加" + chooseCard()
                        : "绑定" + chooseCard()
                    }}
                  </router-link>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar v-if="scope.opt.bankIcon">
                  <img
                    style="width: 30px"
                    :src="imgURL + '/payment/' + scope.opt.bankIcon"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.bankName }} - ****{{
                      scope.opt.cardNumber.slice(
                        scope.opt.cardNumber.length - 4,
                        scope.opt.cardNumber.length
                      )
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
                <q-item-label
                  style="
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                >
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
            color="white"
            :rules="[
              (val) => (val && val.length > 0) || '请输入提款金额',
              (val) =>
                val >= selectedWithdrawalMethod.withdrawMin ||
                '请输入正确的提款金额',
              (val) =>
                val <= selectedWithdrawalMethod.withdrawMax ||
                '请输入正确的提款金额',
              !isUSDT
                ? (val) =>
                    (!isUSDT && /^([1-9][0-9]*)$/.test(val)) || '金额应为正数'
                : true
            ]"
            clearable
          >
            <template v-slot:prepend>
              <span style="font-size: 26px" class="text-bright">
                {{ store.currency.value }}
              </span>
            </template>
            <template v-slot:append>
              <span style="font-size: 26px" class="text-bright">
                <q-btn
                  @click="updateWithdrawAmt"
                  label="全额提款"
                  color="brightbtn"
                />
              </span>
            </template>
          </q-input>
          <div
            class="q-mt-md q-mb-md text-grey text-bold q-pb-md"
            style="border-bottom: 1px solid #434343"
            v-show="selectedWithdrawalMethod"
          >
            <template
              v-if="
                selectedWithdrawalMethod.withdrawMin &&
                selectedWithdrawalMethod.withdrawMin
              "
            >
              {{
                "单笔提款: " +
                selectedWithdrawalMethod.withdrawMin +
                "RMB - " +
                selectedWithdrawalMethod.withdrawMax +
                "RMB"
              }}
              <br />
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
              {{
                "今日提款: " +
                selectedWithdrawalMethod.withdrawMaxAmount +
                "RMB"
              }}
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
              {{
                " 剩余: " + selectedWithdrawalMethod.withdrawMaxTimes + " 次"
              }}
            </template>
          </div>
          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div
              class="q-my-md"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <span style="flex: 1">实施汇率：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>
            </div>
            <div
              class="q-mt-md"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <span style="flex: 1">预计到帐：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                {{
                  (
                    withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate
                  ).toFixed(2)
                }}
                USDT
              </span>
            </div>
          </div>
          <div v-else-if="isEWALLET">
            <div class="q-mt-md q-mb-md text-center">
              <q-btn
                style="border: 1px solid #33bcd4; color: #33bcd4"
                @click="openEWalletTutorial(selectedWithdrawalMethod.code)"
                :label="tutorialLabel()"
              />
            </div>
          </div>

          <div class="q-mt-sm text-neontb" v-if="selectedWithdrawalMethod.withdrawFee">{{ $t("form.usdtSpecialNote", {fee:selectedWithdrawalMethod.withdrawFee}) }}</div>
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
              label="立即提款"
            />
          </div>
          <div class="q-py-md text-orange">
            <div
              v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
            <div v-if="isALIPAY" class="selected-tip">
              “支付宝提款” 可用时间：早10点-晚12点，其他时间提交系统会自动取消！
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
  </div>
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import AcctBal from "../../components/AcctBal.vue";

export default defineComponent({
  name: "WithdrawView",
  components: {AcctBal},
  setup() {
    const store = userStore();
    const $q = useQuasar();
    const imgURL = process.env.IMAGE_CDN;
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
    const isLoaded = ref(false);
    const hasWithdrawCard = computed(() => {
      return (isLoaded == true) && withdrawState.bankCardList.length === 0;
    });
    const withdrawalMethods = ref([]);
    const selectedWithdrawalMethod = ref([]);
    onMounted(() => {
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
    const submitWithdraw = () => {
      cardRef.value.validate();
      amountRef.value.validate();
      $q.loading.show({
        message: "确认中。。。"
      });
      if (cardRef.value.hasError || amountRef.value.hasError) {
        $q.loading.hide();
      } else {
        api.post("/session/withdraw/", qs.stringify(withdrawInfo)).then((response) => {
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "提交成功",
              icon: "check_circle_outline"
            });
            getWithdrawalMethods();

          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: response.message,
              icon: "report_problem"
            });
          }
        }).catch((error) => {
          console.log("error", error);
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
      isEWALLET.value = withdrawInfo.withdrawCode.includes('KDPAY') || withdrawInfo.withdrawCode.includes('EBPAY') || withdrawInfo.withdrawCode.includes('OKPAY')
      isALIPAY.value = withdrawInfo.withdrawCode.includes('ALIPAY')
      activeItem.value = index;
      loadCards();
    };

    const loadCards = () => {
      api.get("/session/bankCard").then((response) => {
        isLoaded.value = true;
        withdrawState.bankCardList = [];
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
      api.get("/session/withdraw/entrance").then((response) => {
        if (response.code === 0) {
          withdrawalMethods.value = response.data;
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
        return '虚拟币'
      } else if (isEWALLET.value) {
        return '电子钱包'
      } else {
        return '银行卡'
      }
    }

    const chooseCard = () => {
      if (isUSDT.value) {
        return '虚拟钱包'
      } else if (isEWALLET.value) {
        return '电子钱包'
      } else {
        return '银行卡片'
      }
    }
    const tutorialLabel = () => {
      if (selectedWithdrawalMethod.value.code === 'KDPAY') {
        return 'K豆教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'EBPAY') {
        return 'EB教程视频'
      } else if (selectedWithdrawalMethod.value.code === 'OKPAY') {
        return 'OK教程视频'
      }
    }
    const openEWalletTutorial = (code) => {
      const urlMap = {
        'KDPAY': 'http://jiaocheng.kdpay123.com',
        'EBPAY': 'https://www.ebpay009.com/xszn',
        'OKPAY': 'https://me-qr.com/l/okpay'
      };

      const url = urlMap[code];
      if (url) {
        window.open(url);
      }
    };
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
      tutorialLabel
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
  padding: 15px 5px;
  grid-gap: 10px;

  .withdraw-type-item {
    // display: flex;
    // justify-content: center;
    width: 100%;
    max-width: 4.5rem;

    position: relative;
    cursor: pointer;

    .withdraw-img {
      border: 2px solid transparent;
      border-radius: 6px;
      margin-bottom: 5px;
    }

    img {
      width: 100%;
      padding: 5px 10px;
    }

    &.active {
      // background: #212534;
      // color: #db7e42;
      // box-shadow: none;
      // filter: drop-shadow(0px 0px 3px #ffffff);
      img {
        border: 1px solid #33bcd4;
      }

      // img {
      //   border: 2px solid #33bcd4;
      // }
    }

    .type-name {
      line-height: 15px;
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
</style>
