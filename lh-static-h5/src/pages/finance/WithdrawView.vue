<template>
  <q-page>
    <div class="withdraw-section q-pa-md q-mx-sm q-my-md">
      <div class="account-content last">
        <div class="withdrawalmethod">
          <div
            v-for="(method, i) in withdrawalMethods"
            :key="i"
            class="withdraw-type-item"
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
            class="withdraw-selection q-mt-sm q-mb-sm"
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
                  {{ scope.opt.bankName }} - ****{{
                    scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                  }}
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
            class="withdraw-field"
            :rules="[
              (val) => (val && val.length > 0) || '请输入提款金额',
              (val) => val >= selectedWithdrawalMethod.withdrawMin || '请输入正确的提款金额',
              (val) => val <= selectedWithdrawalMethod.withdrawMax || '请输入正确的提款金额',
              (val) => (val && /^\d+$/.test(val)) || '提款金额不能有小数',
              isValidUSDTAmt
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
                <q-btn @click="updateWithdrawAmt" label="全额提款" color="brightbtn" />
              </span>
            </template>
          </q-input>
          <div
            class="q-mt-sm q-mb-sm text-grey text-bold q-pb-sm"
            style="border-bottom: 1px solid #434343"
            v-show="selectedWithdrawalMethod"
          >
            <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
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
              {{ "今日提款: " + selectedWithdrawalMethod.withdrawMaxAmount + "RMB" }}
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
              {{ " 剩余: " + selectedWithdrawalMethod.withdrawMaxTimes + " 次" }}
            </template>
          </div>
          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div class="q-my-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">实时汇率：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>
            </div>
            <div class="q-mt-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">预计到帐：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                {{ (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate).toFixed(2) }}
                USDT
              </span>
            </div>
            <div class="q-mt-sm text-neontb">*提币手续费：1.00 USDT</div>
          </div>
          <!--          <div v-else-if="!isEWALLET && !isUSDT">-->
          <!--            <div class="q-mt-md text-neontb">*24小时内请勿提交相同提款金额，避免确认到账错误，需个人承担亏损！</div>-->
          <!--          </div>-->
          <div v-else-if="isEWALLET && selectedWithdrawalMethod.url">
            <div class="q-mt-sm text-neontb">*特别说明：提款钱包和游戏账号的姓名务必一致</div>
            <div class="q-mt-sm q-mb-sm text-center" v-if="selectedWithdrawalMethod.code !== 'SZPAY'">
              <q-btn
                style="border: 1px solid #33bcd4; color: #33bcd4"
                @click="openEWalletTutorial"
                :label="tutorialLabel()"
              />
            </div>
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
              class="q-mt-md common-large-btn quick-withdraw-btn"
              @click="submitWithdraw"
              :loading="withdrawLoading"
              :disable="withdrawLoading"
              label="立即提款"
            />
          </div>
          <div class="q-py-md">
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
  </q-page>

  <q-dialog class="modal-common-div" width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 1rem 0.5rem" class="">
      <q-card-section class="contents">
        <strong class="black-titles">温馨提示</strong>
        <br />
        <br />
        为保证资金安全，存款前需先验证手机号
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" label="前往验证" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="js">
/* eslint-disable */
import { defineComponent, reactive, ref, onActivated, computed, onMounted } from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import AcctBal from "../../components/AcctBal.vue";
import{useLocalStorage} from "@vueuse/core"
import { useNotify } from "src/hooks/notify";

export default defineComponent({
  name: "WithdrawView",
  components: {AcctBal},
  setup() {
    const notify = useNotify();
    const store = userStore();
    const isNewUser = ref(false);
    const $q = useQuasar();
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value;
    const imgWithdrawURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/withdraw/";

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

    const checkNewUser = () => {
      if (store.phone == "") {
        isNewUser.value = true;
      } else {
        getWithdrawalMethods()
      }
    };

    onMounted(() => {
      checkNewUser();
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

    const submitWithdraw = () => {
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
          if (response.code === 0) {
            notify({
              type: "success",
              message: "提交成功",
            });
            getWithdrawalMethods();

            withdrawInfo.amount = "";
            if (amountRef.value) {
              setTimeout(()=>{
                amountRef.value.resetValidation();
              },0)
            }

            withdrawLoading.value = false;

          } else {
            notify({
              type: "error",
              message: response.message,
            });

            withdrawLoading.value = false;
          }
        }).catch((error) => {
          console.log("error", error);
          withdrawLoading.value = false;
          // notify({
          //   type: "error",
          //          //   message: response.message,
          //          // });
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
      isEWALLET.value = withdrawInfo.withdrawCode.includes('KDPAY') || withdrawInfo.withdrawCode.includes('EBPAY') || withdrawInfo.withdrawCode.includes('OKPAY') || withdrawInfo.withdrawCode.includes('SZPAY') || withdrawInfo.withdrawCode.includes('JDPAY') || withdrawInfo.withdrawCode.includes('BLBPAY')
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
          withdrawInfo.amount = "";
          if (amountRef.value) {
            setTimeout(()=>{
              amountRef.value.resetValidation();
            },0)
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
          notify({
            type: "error",
            message: response.message,
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
        // return '虚拟币'
      } else if (isEWALLET.value) {
        return '电子钱包'
      } else {
        return '银行卡'
      }
    }

    const isValidUSDTAmt = (val) => {
      if(!isUSDT.value){
        return true;
      }
      const usdtPattern = /^([1-9][0-9]*)$/;
      return usdtPattern.test(withdrawInfo.amount) || "金额应为正数";
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
      isNewUser,
      checkNewUser,
      isValidUSDTAmt,
      withdrawLoading
    };
  }
});
</script>
<style lang="scss">
.withdraw-section {
  .withdraw-field {
    &.q-field {
      border-radius: 10px;
      padding: 0px 8px 10px;
      box-shadow: $shadow-bg;
    }

    .q-field--highlighted .q-field__label {
      color: $dark;
    }
  }

  .withdraw-selection {
    &.q-field {
      border-radius: 10px;
      box-shadow: $shadow-bg;
    }
  }
}
</style>
<style scoped lang="scss">
.withdraw-section {
  width: $box-width;
  margin: 10px auto;
  border-radius: 10px;
  padding: 10px 12px 15px;
  box-shadow: $shadow-bg;
  background: $white;
}
.withdrawalmethod {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  overflow-x: unset;
  padding: 0px 5px;
  grid-gap: 10px;
  grid-column-gap: 10px;
  grid-row-gap: 5px;

  .withdraw-type-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    position: relative;
    cursor: pointer;

    .promo-label {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translate(-50%);
      width: 50px;

      img {
        width: 100%;
        height: auto;
        padding: 4px 6px;
      }
    }

    .withdraw-img {
      border: 2px solid transparent;
      border-radius: 10px;
      max-width: 4.5rem;
    }

    img {
      width: 100%;
      padding: 5px 10px;
    }

    &.active {
      img {
        border: 3px solid #33bcd4;
        border-radius: 10px;
      }

      .promo-img {
        border: none;
        border-radius: 0px;
      }

      .type-name {
        font-weight: bold;
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
.selected-tip {
  color: $warning;
}

.quick-withdraw-btn {
  width: 100%;
}

.body--dark {
  .withdraw-section {
    @include content-block-dark;
    .withdraw-selection.q-field,
    .withdraw-field.q-field {
      box-shadow: none;
    }
  }
}
</style>
