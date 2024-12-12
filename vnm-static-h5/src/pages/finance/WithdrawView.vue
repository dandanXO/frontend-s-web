<template>
  <q-page>
    <div class="account-tabs-div">
      <router-link to="/finance/deposit?redirect=/finance/withdraw">
        <div class="account-item">
          <span>{{ $t("lang.transfer_deposit") }}</span>
        </div>
      </router-link>
      <div>
        <div class="account-item is-active">
          <span>{{ isAutoWithdrawal ? $t("lang.transfer_quickWithdraw") : $t("lang.transfer_withdraw") }}</span>
        </div>
      </div>
    </div>
    <q-btn v-if="!isAutoWithdrawal" class="upgrade-btn" color="brightbtn" @click="handleUpgradeClick">
        <img src="../../assets/images/finance/withdraw/rocket-icon.png" />
        <span>{{ $t("lang.transfer_upgradeWithdraw") }}</span>
    </q-btn>
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
            :label="$t('lang.withdraw_choose') + ' ' + chooseLabel()"
            class="withdraw-selection q-mt-sm q-mb-sm"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || $t('lang.withdraw_pleasechoose') + ' ' + chooseLabel()]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("lang.withdraw_nonavailable") + " " + chooseCard() }}
                  <router-link class="text-bright" to="/account/withdraw">
                    {{
                      isUSDT || isEWALLET
                        ? $t("lang.withdraw_add") + " " + chooseCard()
                        : $t("lang.withdraw_bind") + " " + chooseCard()
                    }}
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
            type="number"
            v-model="withdrawInfo.amount"
            :label="$t('lang.withdraw_amount')"
            class="withdraw-field q-mt-sm q-mb-sm"
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.withdraw_please_enter_withdraw_amount'),
              (val) =>
                val >= selectedWithdrawalMethod.withdrawMin || $t('lang.withdraw_please_enter_correct_withdraw_amount'),
              (val) =>
                val <= selectedWithdrawalMethod.withdrawMax || $t('lang.withdraw_please_enter_correct_withdraw_amount'),
              (val) => (val && /^([1-9][0-9]*)$/.test(val)) || $t('lang.withdraw_amt_no_decimal_allow'),
              isValidUSDTAmt
            ]"
            clearable
          >
            <template v-slot:prepend>
              <span style="font-size: 18px" class="text-bright">
                {{ store.currency.value }}
              </span>
            </template>
            <template v-slot:append>
              <span style="font-size: 18px" class="text-bright">
                <q-btn
                  @click="updateWithdrawAmt"
                  no-caps
                  :label="$t('lang.withdraw_withdrawallamount')"
                  color="brightbtn"
                />
              </span>
            </template>
          </q-input>

          <q-input
            hide-bottom-space
            ref="withdrawPwdRef"
            v-model="withdrawInfo.withdrawPassword"
            :label="$t('lang.withdraw_password')"
            class="withdraw-field"
            :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => (val && val.length > 0) || $t('lang.withdraw_please_enter_withdraw_password')]"
            clearable
          >
            <template v-slot:prepend>
              <div style="width: 28px; display: flex; align-items: center">
                <div class="password-icon" />
              </div>
            </template>
            <template v-slot:append>
              <q-icon
                color="dark"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div
            class="q-mt-sm q-mb-sm text-grey text-bold q-pb-sm"
            style="border-bottom: 1px solid #434343"
            v-show="selectedWithdrawalMethod"
          >
            <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
              {{
                $t("lang.withdraw_singlewithdrawal") +
                ": " +
                selectedWithdrawalMethod.withdrawMin.toLocaleString() +
                "VNDP - " +
                selectedWithdrawalMethod.withdrawMax.toLocaleString() +
                "VNDP"
              }}
              <br />
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
              {{
                $t("lang.withdraw_withdrawtoday") +
                ": " +
                selectedWithdrawalMethod.withdrawMaxAmount.toLocaleString() +
                "VNDP"
              }}
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
              <br />
              {{
                " " +
                $t("lang.withdraw_remaining") +
                ": " +
                selectedWithdrawalMethod.withdrawMaxTimes +
                " " +
                $t("lang.withdraw_times")
              }}
            </template>
          </div>
          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div class="q-my-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 2">{{ $t("lang.withdraw_realtimeexchangerates") }}:</span>
              <span style="flex: 3" class="bg-neontb text-neontb">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>
            </div>
            <div class="q-mt-sm" style="display: flex; justify-content: center; align-items: center; color: #17cd27">
              <span style="flex: 2; white-space: nowrap">{{ $t("lang.withdraw_estimatedarrival") }}：</span>
              <span style="flex: 3" class="bg-neontb text-neontb">
                {{
                  selectedWithdrawalMethod &&
                  (withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin ||
                    (
                      withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                      selectedWithdrawalMethod.withdrawFee
                    ).toFixed(2) < 0)
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
          <!--          <div v-else-if="!isEWALLET && !isUSDT">-->
          <!--            <div class="q-mt-md text-neontb">*24小时内请勿提交相同提款金额，避免确认到账错误，需个人承担亏损！</div>-->
          <!--          </div>-->
          <div v-else-if="isEWALLET">
            <div class="q-mt-sm text-neontb">{{ $t("lang.withdraw_ewalletspecialnote") }}</div>
            <div class="q-mt-sm q-mb-sm text-center">
              <q-btn
                style="border: 1px solid #33bcd4; color: #33bcd4"
                @click="openEWalletTutorial(selectedWithdrawalMethod.code)"
                :label="tutorialLabel()"
              />
            </div>
          </div>

          <div class="q-mt-sm text-neontb" v-if="selectedWithdrawalMethod.withdrawFee">
            {{ $t("lang.withdraw_usdtspecialnote", { fee: selectedWithdrawalMethod.withdrawFee }) }}
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
              no-caps
              :label="$t('lang.withdraw_confirm')"
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
          <div class="text-h6 text-center">{{ $t("lang.msg_bind_card_first") }}</div>
        </q-card-section>

        <div class="flex flex-center">
          <router-link to="/account">
            <q-btn class="q-mr-md" :label="$t('lang.msg_cancel')" />
          </router-link>
          <router-link to="/account/withdraw">
            <q-btn color="brightbtn" :label="$t('lang.msg_bind')" />
          </router-link>
        </div>
      </q-card>
    </q-dialog>
  </q-page>

  <q-dialog class="modal-common-div" width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 1rem 0.5rem" class="">
      <q-card-section class="contents">
        <strong class="black-titles">{{ $t("lang.withdraw_tipstitle") }}</strong>
        <br />
        <br />
        {{ $t("lang.withdraw_tipdesc") }}
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" no-caps :label="$t('lang.withdraw_proceedverify')" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <WithdrawRemainingDialog v-if="isShowRemainingDialog" v-model="isShowRemainingDialog" />
</template>

<script lang="js">
/* eslint-disable */
import { defineComponent, reactive, ref, onActivated, computed, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import AcctBal from "../../components/AcctBal.vue";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";
import WithdrawRemainingDialog from "src/components/WithdrawRemainingDialog.vue";

export default defineComponent({
  name: "WithdrawView",
  components: { AcctBal, WithdrawRemainingDialog },
  setup() {
    const store = userStore();
    const isNewUser = ref(false);
    const { t } = useI18n();
    const $q = useQuasar();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;
    const amountRef = ref();
    const withdrawPwdRef = ref();
    const cardRef = ref();
    const activeItem = ref(0);
    const withdrawFormRef = ref(null);
    const withdrawState = reactive({
      bankCardList: []
    });
    const qs = require("qs");
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: "",
      withdrawPassword: ""
    });
    const isLoaded = ref(false);
    const isShowRemainingDialog = ref(false)
    const hasWithdrawCard = computed(() => {
      return isLoaded == true && withdrawState.bankCardList.length === 0;
    });
    const withdrawalMethods = ref([]);
    const selectedWithdrawalMethod = ref([]);

    const checkNewUser = () => {
      if (store.phone == "") {
        isNewUser.value = true;
      } else {
        getWithdrawalMethods();
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
        res.data.forEach((p) => {
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
        platforms.forEach((platform) => {
          platform.isLoading = true;
          if (platform.code) {
            api
              .get("/session/balance", { params: { platform: platform.code } })
              .then((res) => {
                if (platform) {
                  platform.amount = res.data;
                  platform.isLoading = false;
                }
              })
              .catch((e) => {
                platform.isLoading = false;
              });
          }
        });
      }
    };
    const submitWithdraw = () => {
      cardRef.value.validate();
      amountRef.value.validate();
      withdrawPwdRef.value.validate();
      $q.loading.show({
        message: t("lang.msg_confirming")
      });
      if (cardRef.value.hasError || amountRef.value.hasError || withdrawPwdRef.value.hasError) {
        $q.loading.hide();
      } else {
        api
          .post("/session/withdraw/", qs.stringify(withdrawInfo))
          .then((response) => {
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: t("lang.msg_submit_successful"),
                icon: "check_circle_outline"
              });
              getWithdrawalMethods();

              // FB tracking :: apply-withdrawal
              if (store.isAffiliateA) {
                fbq("track", "apply-withdrawal");
              }

              withdrawInfo.amount = "";
              withdrawInfo.withdrawPassword = "";
              if (amountRef.value) {
                setTimeout(() => {
                  amountRef.value.resetValidation();
                }, 0);
              }
            } else {
              $q.notify({
                color: "negative",
                position: "top",
                message: response.message,
                icon: "report_problem"
              });
            }
          })
          .catch((error) => {
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
      isUSDT.value = withdrawInfo.withdrawCode.includes("USDT");
      isEWALLET.value =
        withdrawInfo.withdrawCode.includes("KDPAY") ||
        withdrawInfo.withdrawCode.includes("EBPAY") ||
        withdrawInfo.withdrawCode.includes("OKPAY");
      isALIPAY.value = withdrawInfo.withdrawCode.includes("ALIPAY");
      activeItem.value = index;
      loadCards();
    };

    const loadCards = () => {
      api
        .get("/session/bankCard")
        .then((response) => {
          isLoaded.value = true;
          withdrawState.bankCardList = [];
          if (response.code === 0) {
            // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
            response.data.forEach((element) => {
              if (element.bankType === "BANK") {
                if (element.bankCode !== "alipay" && element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                  withdrawState.bankCardList.push(element);
                }
                if (element.bankCode === "alipay" && selectedWithdrawalMethod.value.code === "ALIPAY") {
                  withdrawState.bankCardList.push(element);
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
              setTimeout(() => {
                amountRef.value.resetValidation();
              }, 0);
            }
          }
        })
        .catch((error) => {
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
        return t("lang.withdraw_crypto");
      } else if (isEWALLET.value) {
        return t("lang.withdraw_ewallet");
      } else {
        return t("lang.withdraw_bankcard");
      }
    };

    const isValidUSDTAmt = (val) => {
      if (!isUSDT.value) {
        return true;
      }
      const usdtPattern = /^([1-9][0-9]*)$/;
      return usdtPattern.test(withdrawInfo.amount) || t("lang.withdraw_amt_positive");
    };

    const chooseCard = () => {
      if (isUSDT.value) {
        return t("lang.withdraw_virtualwallet");
      } else if (isEWALLET.value) {
        return t("lang.withdraw_ewallet");
      } else {
        return t("lang.withdraw_bankcard");
      }
    };
    const tutorialLabel = () => {
      if (selectedWithdrawalMethod.value.code === "KDPAY") {
        return "K豆教程视频";
      } else if (selectedWithdrawalMethod.value.code === "EBPAY") {
        return "EB教程视频";
      } else if (selectedWithdrawalMethod.value.code === "OKPAY") {
        return "OK教程视频";
      }
    };
    const openEWalletTutorial = (code) => {
      const urlMap = {
        KDPAY: "http://jiaocheng.kdpay123.com/",
        EBPAY: "https://www.ebpay24.com/",
        OKPAY: "https://me-qr.com/l/okpay"
      };

      const url = urlMap[code];
      if (url) {
        window.open(url);
      }
    };
    const isAutoWithdrawal = computed(() => store.withdrawType === "AUTO_WITHDRAW");

    const handleUpgradeClick = () => {
      $q.loading.show({
        message: t("lang.withdraw_upgrade")
      });
      api
        .get("/session/updateAutoWithdraw")
        .then(async (res) => {
          if (res.code === 0) {
            $q.notify({
                color: "positive",
                position: "top",
                message: t("lang.successUpgradeQuick"),
                icon: "check_circle_outline"
              });

            await store.getMemberInfo();
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: res.message,
              icon: "report_problem"
            });
          }
        })
        .finally(() => $q.loading.hide());
    };

    return {
      noDecimalRule: (val) => /^([1-9][0-9]*)$/.test(val) || "金额应为正数",
      amountRef,
      withdrawPwdRef,
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
      tutorialLabel,
      isNewUser,
      checkNewUser,
      isValidUSDTAmt,
      isPwd: ref(true),
      isAutoWithdrawal,
      handleUpgradeClick,
      isShowRemainingDialog
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
  grid-template-columns: repeat(2, 1fr);
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

    .withdraw-img {
      border: 2px solid transparent;
      border-radius: 10px;
      max-width: 4.5rem;
    }

    img {
      width: 100%;
      padding: 5px;
    }

    &.active {
      // background: #212534;
      // color: #db7e42;
      // box-shadow: none;
      // filter: drop-shadow(0px 0px 3px #ffffff);
      img {
        border: 3px solid #33bcd4;
        border-radius: 10px;
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
      // overflow-wrap: break-word;
      white-space: nowrap;
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

.upgrade-btn {
  padding: 1px 12px;
  margin: 0 auto;
  width: 90%;
  display: flex;
  text-transform: none;
  img {
    height: 30px;
  }
}
.quick-withdraw-btn {
  width: 100%;
}
</style>

<style lang="scss" scoped>
.account-tabs-div {
  cursor: pointer;
  gap: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: $box-width;
  padding: 0.6rem 0.9rem 0.6rem;
  margin: 6px auto;
  background: $white;
  box-shadow: $shadow-bg;
  border-radius: 10px;

  .account-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/images/download/inactive-tab-bg.png");
    background-size: 100% 100%;
    background-color: $secondary;
    padding: 8px;
    text-align: center;
    border-radius: 10px;

    span {
      color: $font-1;
      font-size: 1rem;
    }

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }

    &.is-active {
      background-image: url("../../assets/images/download/active-tab-bg.png");
      background-size: 100% 100%;
      background-color: $primary;

      span {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}
</style>
