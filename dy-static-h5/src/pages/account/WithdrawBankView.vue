<template>
  <div class="withdrawBankView">
    <div class="q-pa-md text-bold text-center" style="color: #33bcd4">
      专属网址：{{ store.evip }}
    </div>
    <div class="widthdrawBankView--content">
      <div class="account-content text-center">
        <div class="flex-box flex-wrap bank-card-list">
          <template
            v-for="(bc, index) in personalState.bankCardList"
            :key="bc.id"
          >
            <q-card
              v-if="bc.bankName"
              @click="showCard(bc, index)"
              class="q-pa-sm text-left"
              style="color: #000; border-radius: 0"
            >
              <div class="cardname q-pa-xs">
                <div class="txt-center">
                  {{ bc.bankName }}
                  <!-- <div>Bank Account Number</div> -->
                </div>
              </div>
              <q-separator class="q-my-xs" style="background: #666" />
              <div class="bottom q-pa-xs">
                <div class="flex-box cards">
                  <div
                    v-for="b in bc.cardNumber.split()"
                    :key="b"
                    class="card-num-box"
                  >
                    ****{{ b.slice(b.length - 4, b.length) }}
                  </div>
                </div>
                <q-btn
                  @click="unbindBankCard(bc)"
                  color="dyblue"
                  label="解绑"
                  style="background-color: rgb(46, 66, 148)"
                />
              </div>
            </q-card>
          </template>
          <div class="q-pa-sm widthdrawBankView--content-cta">
            <q-btn
              color="dyblue"
              style="width: 100%"
              label="绑定银行卡"
              @click="bankCardModal('bank')"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="bankCardModalState.visible" persistent>
      <q-card style="width: 100%; padding: 10px">
        <q-card-section v-if="!isVirtual" class="q-mb-md">
          <div class="text-h6">绑定银行卡</div>
        </q-card-section>
        <q-card-section v-if="isVirtual" class="q-mb-md">
          <div class="text-h6">Add a virtual currency</div>
        </q-card-section>
        <q-form>
          <div v-if="!isVirtual">
            <div class="row q-col-gutter-xs">
              <div class="col-12">
                <q-select
                  v-model="selectedBankType"
                  filled
                  :options="[{ name: '银行卡' }, { name: '数字货币' }]"
                  label="银行 / 数字货币"
                  color="blue"
                  label-color="black"
                  option-label="name"
                  option-value="name"
                  @update:model-value="selectBankType(opt)"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12">
                <q-select
                  ref="bankCardRef"
                  class="q-mb-md"
                  color="blue"
                  filled
                  label-color="grey"
                  v-model="bankCardInfo.bankId"
                  :options="banksList"
                  option-value="id"
                  option-label="name"
                  :label="isCrypto ? '选择数字货币' : '选择银行卡'"
                  :rules="[(val) => !!val || '请选择']"
                  lazy-rules
                  emit-value
                  map-options
                >
                  <template v-slot:selected-item="scope">
                    <q-item-section avatar>
                      <img
                        v-if="scope.opt.bankIcon"
                        style="
                          width: 30px;
                          margin-top: 10px;
                          margin-bottom: 10px;
                        "
                        :src="imgURL + scope.opt.bankIcon"
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
                        {{ scope.opt.name }}
                      </q-item-label>
                    </q-item-section>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <img
                          v-if="scope.opt.bankIcon"
                          style="
                            width: 30px;
                            margin-top: 10px;
                            margin-bottom: 10px;
                          "
                          :src="imgURL + scope.opt.bankIcon"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <div v-if="isVirtual">
            <q-input
              filled
              ref="bankCardRef"
              class="q-mb-md"
              v-model="bankName"
              disable
              readonly
              label="银行名城"
              color="blue"
            />
          </div>
          <q-input
            class="q-mb-md"
            filled
            v-model="bankCardInfo.cardAccount"
            label="特卡人姓名"
            :rules="cardAccountRules"
            lazy-rules
            :readonly="true"
            ref="cardAccountRef"
            color="blue"
          />
          <q-input
            filled
            class="q-mb-md"
            v-model="bankCardInfo.cardNumber"
            :label="isCrypto ? '钱包地址' : '银行卡号'"
            :rules="isCrypto ? cardCryptoRules : cardNumberRules"
            ref="cardNumberRef"
            color="blue"
          />
          <q-input
            class="q-mb-md"
            filled
            v-model="bankCardInfo.cardAddress"
            label="开户行地址"
            :rules="cardAddressRules"
            ref="cardAddressRef"
            color="blue"
          />
          <div class="flex flex-center">
            <q-btn
              class="q-mr-md"
              label="取消"
              @click="bankCardModalState.visible = false"
            />
            <q-btn color="dyblue" label="提交" @click="submitBankCard" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- <q-dialog
      wrap-class-name="bankModal"
      width="100%"
      v-model:visible="virtualCurrencyModalState.visible"
      :footer="null"
    >
      <div class="modal-head-title">Add a virtual currency</div>
      <q-form
        ref="virtualCurrencyFormRef"
        :hideRequiredMark="true"
        :model="bankCardInfo"
        :colon="false"
        :label-col="{ span: 8 }"
      >
        <q-input
          v-model:value="virtualCurrencyInfo.wallet"
          label="Card Account"
          placeholder="Enter card account"
        />
        <q-input
          v-model:value="virtualCurrencyInfo.digitalCurrency"
          label="Digital Currency"
          placeholder="Enter digital currency"
        />
        <q-input
          v-model="virtualCurrencyInfo.digitalCurrency"
          label="Digital Currency"
          placeholder="Enter digital currency"
          disable
        />

        <q-input
          v-model="virtualCurrencyInfo.protocol"
          label="Protocol"
          placeholder="Enter protocol"
          disable
        />
        <q-btn color="brand" type="submit" @click="submitVirtualCurrency">
          Confirm
        </q-btn>
      </q-form>
    </q-dialog> -->
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, createVNode } from "vue";
// import { Modal, message } from "ant-design-vue";
// import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { RiSpamLine, RiLink } from "vue-remix-icons";
// import { loadMemberInfo, loadBanks, loadBankCards, addBankCard, deleteBankCard } from "@/api/personal/personal";
import moment from "moment";
import { api } from "boot/axios"
import { useQuasar } from "quasar";
import { userStore } from "stores/index";

import { useRouter } from "vue-router";
var qs = require("qs");
export default defineComponent({
  name: "WithdrawBankView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    RiSpamLine, RiLink
  },
  setup() {
    const store = userStore();
    const $q = useQuasar();
    const isCrypto = ref(false);
    const isCardActive = ref();
    const searchForm = reactive({
      start: "",
      end: ""
    });
    const imgURL = process.env.IMAGE_CDN + '/payment/'
    const columns = [
      {
        title: "Bank Name",
        dataIndex: "name",
        key: "name",
        slots: { title: "customTitle", customRender: "name" }
      },
      {
        title: "Account Number",
        dataIndex: "age",
        key: "age"
      },
      {
        title: "Branch",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Bind Time",
        key: "tags",
        dataIndex: "tags",
        slots: { customRender: "tags" }
      },
      {
        title: "Unbind Time",
        key: "action",
        slots: { customRender: "action" }
      }
    ];

    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });
    onMounted(() => {
      api.get("session/member").then((response) => {
        if (response.code === 0) {
          personalState.memberInfo = response.data;

          if (personalState.memberInfo.birthday > 0) {
            personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
          }
        }
      }).catch((error) => {
        console.log("error", error);
      });
      loadCards();
    });
    const showCard = (item, index) => {
      // if (index === isCardActive.value) {
      //   isCardActive.value = null;
      //   console.log(isCardActive.value)
      // } else {
      //   isCardActive.value = index
      // }
      isCardActive.value = index
    }
    const loadCards = () => {
      personalState.bankCardList = [];
      api.get("/session/bankCard").then((res) => {
        if (res.code === 0) {
          personalState.bankCardList.push(...res.data);
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }

    //add bank card
    const bankCardModalState = reactive({
      visible: false,
      banks: []
    });
    const bankCardRef = ref();
    const cardNumberRef = ref();
    const cardAccountRef = ref();
    const cardAddressRef = ref();

    const bankCardInfo = reactive({
      bankId: undefined,
      cardNumber: "",
      cardAccount: "",
      cardAddress: ""
    });
    const router = useRouter();
    const bankName = ref();
    const banksList = ref([]);
    const isVirtual = ref(false)
    const bankCardModal = (type) => {
      store.getMemberInfo().then(() => {
        if (!store.realName || store.realName == "" || store.realName == null) {
          $q.notify({
            color: "negative",
            position: "top",
            message: "请输入您的真实姓名",
            icon: "report_problem"
          });
          router.push("/account/personal");
        } else {
          bankCardInfo.bankId = undefined;
          bankCardInfo.cardNumber = "";
          bankCardInfo.cardAccount = store.realName;
          bankCardInfo.cardAddress = "";
          bankCardModalState.visible = true;
        if (bankCardModalState.banks.length === 0) {
          api.get("/session/withdraw/card").then((res) => {
            if (res.code === 0) {
              bankCardModalState.banks.push(...res.data);
              selectBankType()
            }
          }).catch((e) => {
            console.log("error", e);
          });
        }
      }
      })
    };

    const selectedBankType = ref('银行卡')
    const selectBankType = () => {
      bankCardInfo.bankId = "";
      banksList.value = []
      bankCardModalState.banks.forEach(element => {
        if (selectedBankType.value === "银行卡" && element.bankType === 'BANK') {
          banksList.value.push(element);
          isCrypto.value = false
        }
        if (selectedBankType.value === "数字货币" && element.bankType === 'CRYPTO') {
          isCrypto.value = true
          banksList.value.push(element);
        }
      })
    }
    const submitBankCard = () => {
      bankCardRef.value.validate();
      cardAccountRef.value.validate();
      cardAddressRef.value.validate();
      cardNumberRef.value.validate();
      if (bankCardRef.value.hasError || cardAccountRef.value.hasError  || cardAddressRef.value.hasError || cardNumberRef.value.hasError) {
      }
      else {
          api.post("/session/bankCard", qs.stringify(bankCardInfo)).then((response) => {
            if (response.code === 0) {
              bankCardModalState.visible = false;
              $q.notify({
                color: "positive",
                position: "top",
                message: "已添加银行卡",
                icon: "check_circle_outline"
              });
              loadCards();
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: response.message,
              //   icon: "report_problem"
              // });
            }
          }).catch((error) => {
            console.log("error", error);
          });


      }
    };
    const unbindBankCard = (card) => {
      console.log(card)
      const dialog = $q.dialog({
        class: "q-px-md q-pt-md",
        title: "解绑 " + card.bankName + "?",
        message: "你确定要解绑： " + card.bankName + "?",
        ok: {
          push: true,
          color: 'brightbtn',
          label: "确认",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: 'warning',
          label: "取消",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
          api.post(`/session/bankCard/${card.id}?_method=delete`).then((response) => {
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "操作成功",
                icon: "check_circle_outline"
              });
              loadCards();
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: response.message,
              //   icon: "report_problem"
              // });
            }

          })
        })
    };

    //add virtual card
    // const virtualCurrencyModalState = reactive({
    //   visible: false,
    //   banks: []
    // });
    // const virtualCurrencyFormRef = ref();
    // const virtualCurrencyInfo = reactive({
    //   wallet: undefined,
    //   digitalCurrency: 'SGD',
    //   protocol: 'protocol_01'
    // });
    // const virtualCurrencyModal = () => {
    //   virtualCurrencyInfo.bankId = undefined;
    //   virtualCurrencyInfo.cardNumber = "";
    //   virtualCurrencyInfo.cardAccount = "";
    //   virtualCurrencyInfo.cardAddress = "";
    //   virtualCurrencyModalState.visible = true;
    //   if (virtualCurrencyModalState.banks.length === 0) {
    //     loadBanks(3).then((res) => {
    //       if (res.code === 0) {
    //         virtualCurrencyModalState.banks.push(...res.data);
    //       }
    //     }).catch((e) => {
    //       console.log("error", e);
    //     });
    //   }
    // };
    // const submitvirtualCurrency = () => {

    // };
    // const virtualCurrencyRules = {
    //   cardNumber: [
    //     {
    //       required: true,
    //       message: "card number is required",
    //       trigger: "blur",
    //     },
    //     {
    //       min: 6,
    //       max: 12,
    //       message: "Length should be 6 to 12",
    //       trigger: "blur",
    //     }
    //   ],
    //   cardAccount: [
    //     {
    //       required: true,
    //       message: "card account is required",
    //       trigger: "blur"
    //     }
    //   ],
    //   cardAddress: [
    //     {
    //       required: true,
    //       message: "card address is required",
    //       trigger: "blur"
    //     }
    //   ]
    // };
    let validateBankLength = (val) => {
        if (isCrypto.value == true) {
         return (val.length > 33 && val.length < 37) || '长度应为34到36个字符'
        } else if (isCrypto.value == false) {
          return (val.length > 15 && val.length < 20) || '长度应为16到19个字符'
        }
    }
    return {
      searchForm,
      columns,
      personalState,
      bankCardModalState,
      bankCardInfo,
      submitBankCard,
      bankCardModal,
      unbindBankCard,
      // virtualCurrencyModalState,
      // virtualCurrencyFormRef,
      // virtualCurrencyInfo,
      // virtualCurrencyRules,
      // submitvirtualCurrency,
      // virtualCurrencyModal,
      showCard,
      isCardActive,
      isCrypto,
      bankName,
      isVirtual,
      bankCardRef,
      cardNumberRef,
      cardAccountRef,
      cardAddressRef,
      cardCryptoRules: [
        val => validateBankLength(val)
      ],
      cardNumberRules: [
        val => (val && val.length > 0) || '请输入卡号',
        val => (/^\d+$/.test(val)) || '只允许数字',
        val => validateBankLength(val)
      ],
      cardAccountRules: [
         val => (val && val.length > 0) || '情书入银行卡号',
      ],
      cardAddressRules: [
      ],
      selectedBankType,
      selectBankType,
      banksList,
      imgURL,
      store
    };
  }
});
</script>
<style scoped lang="scss">
.account-content {
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.withdrawBankView {
  height: calc(100vh - 109px);
  display: flex;
  flex-direction: column;
}

.widthdrawBankView--content > div > div,
.widthdrawBankView--content > div,
.widthdrawBankView--content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.widthdrawBankView--content-cta {
  margin-bottom: auto;
  padding-block: 1.2em;
}
</style>
