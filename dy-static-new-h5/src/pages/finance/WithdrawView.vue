<template>
  <div class="withdraw-section">
    <!--    <AcctBal :platforms="platforms" />-->
    <div class="q-pa-md bg-white q-mx-sm q-my-md">
      <div class="account-content last">

        <label class="label">选择提款方式</label>

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
              <img :src="imgURL + '/withdraw/' + method.icon"/>
            </div>
            <div class="type-name">{{ method.name }}</div>
          </div>
        </div>

        <q-separator style="margin-top:12px;margin-bottom: 15px;" />

        <label class="label">{{ (isUSDT ) ? '钱包地址' : '银行卡' }}</label>
        <q-form>
          <q-select
              hide-bottom-space
              outlined
              ref="cardRef"
              v-model="withdrawInfo.cardId"
              option-value="id"
              emit-value
              :label="isUSDT ? '钱包地址' : '提款银行'"
              color="black"
              :options="withdrawState.bankCardList"
              map-options
              :rules="[(val) => !!val || '请选择银行/钱包地址']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ isUSDT ? "没有可用的钱包地址" : "没有可用的卡片" }}
                  <router-link class="text-bright" to="/account/withdraw">
                    {{ isUSDT ? "加钱包地址" : "加卡" }}
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

          <q-separator style="margin-top: 14px;margin-bottom:14px;"/>

          <label class="label">提款金额</label>
          <q-input
              hide-bottom-space
              ref="amountRef"
              v-model="withdrawInfo.amount"
              placeholder="输入金额"
              clearable
              color="white"
              :rules="[
              (val) => (val && val.length > 0) || '请输入提款金额',
              (val) =>
                val >= selectedWithdrawalMethod.withdrawMin ||
                '请输入正确的提款金额',
              (val) =>
                val <= selectedWithdrawalMethod.withdrawMax ||
                '请输入正确的提款金额'
            ]"
          >
            <template v-slot:prepend>
              <span style="font-size: 26px" class="text-bright">
                {{ store.currency.value }}
              </span>
            </template>
            <template v-slot:append>
              <span style="font-size: 26px" class="text-bright">
                <q-btn
                    class="bigamount-btn"
                    @click="updateWithdrawAmt"
                    label="全额提款"
                    color="dyblue"
                />
              </span>
            </template>
          </q-input>
          <div
              class="q-mt-md q-mb-md text-center text-grey text-bold q-pb-md"
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
              <br style="margin-top:10px;"/>
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
              <span style="flex: 1;font-size:16px">实施汇率：</span>
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
              <span style="flex: 1;font-size:16px">预计到帐：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                {{
                  (
                      withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate
                  ).toFixed(2)
                }}
                USDT
              </span>
            </div>
            <div class="q-mt-md text-neontb">
              *特别说明：三方自动收取提币 1.00 USDT 手续费！
            </div>
          </div>

          <div class="flex-box flex-justify-center">
            <q-btn
                style="width: 100%"
                class="q-mt-md submit-btn"
                @click="submitWithdraw"
                label="立即提款"
            />
          </div>
          <div class="q-py-md text-orange">
            <div
                v-if="!isUSDT && selectedWithdrawalMethod.tips"
                class="selected-tip"
                v-html="selectedWithdrawalMethod.tips"
            ></div>
          </div>
        </q-form>
      </div>
    </div>

    <q-dialog width="100%" v-model="hasWithdrawCard" no-backdrop-dismiss no-esc-dismiss>
      <q-card style="width: 100%; padding: 20px; flex-direction:column;" class="text-black">
        <q-card-section class="q-mb-md text-center" style="flex-direction:column;">
          <strong>温馨提示</strong>
          <br/>     <br/>
          为保证资金安全，存款前先绑定银行卡
        </q-card-section>
        <q-card-actions align="right">
          <router-link to="/account/withdraw">
            <q-btn label="前往绑定" color="dyblue"/>
          </router-link>
        </q-card-actions>
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
    const withdrawState = reactive({
      bankCardList: []
    });
    const qs = require("qs");
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: ""
    });
    const isLoaded = ref(false);
    const hasWithdrawCard = ref(false);
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
    const selectMethod = (method, index) => {
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      selectedWithdrawalMethod.value = method;
      withdrawInfo.withdrawCode = method.code;
      if (withdrawInfo.withdrawCode.includes("USDT")) {
        isUSDT.value = true;
      } else {
        isUSDT.value = false;
      }
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
              if (element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                withdrawState.bankCardList.push(element);
              }
            } else {
              if (element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
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
          if(withdrawState.bankCardList.length===0){
            hasWithdrawCard.value= true;
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

    return {
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
      store,
      updateWithdrawAmt,
      platforms,
      hasWithdrawCard
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
    overflow-x: auto;
    padding: 5px 5px 10px;
    grid-gap: 10px;

    .withdraw-type-item {
      // display: flex;
      // justify-content: center;
      width: 100%;
      max-width: 5rem;

      position: relative;
      cursor: pointer;

      .withdraw-img {
        border: 2px solid #d7d7d7;
        border-radius: 6px;
        margin-bottom: 5px;
        padding: 8px;
        display:flex;
        align-items: center;
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
        .withdraw-img {
          border: 2px solid #4873f1;
        }

        // img {
        //   border: 2px solid #33bcd4;
        // }
      }

      .type-name {
        line-height: 18px;
        font-size: 16px;
        font-weight:600;
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
    background: linear-gradient(180deg, #52ACFF 0%, #3559DA 100%);
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
    background: linear-gradient(180deg, #52ACFF 0%, #3559DA 100%);
    height: 45px;
    letter-spacing: 1px;
    color: #fff;
    border-radius: 12px;
  }
}
</style>
