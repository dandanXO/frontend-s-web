<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand" />
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="250">
        <q-card v-for="(det, n) in truncatedList" :key="n" class="q-pa-sm">
          <div class="table-data" v-for="(head, e) in headers" :key="e">
            <div class="label">
              {{ head.label }}
            </div>
            <template v-for="obj in Object.keys(det)" :key="obj">
              <div v-if="obj === head.key" class="desc">
                <div v-if="obj === 'type'">
                  {{ translateRecord(det[obj], recordType) }}
                </div>
                <div v-else-if="obj === 'depositAmount'">
                  <div class="items-center justify-between row">
                    <div>{{ det[obj] }}</div>
                  </div>
                </div>
                <div v-else-if="obj === 'withdrawAmount'">
                  <div class="items-center justify-between row">
                    <div>{{ det[obj] }}</div>

                    <div v-if="recordType === 'withdraw' && det.status === 'STEP_1'" class="buttons">
                      <q-btn round size="xs" color="bright" class="btn-deposit" @click="feedbackTrans(det)">
                        <img src="../assets/records/quote-request-icon.png" />
                      </q-btn>
                    </div>
                  </div>
                </div>
                <div v-else-if="obj === 'betId'">
                  <q-link @click="copyText(det[obj], '注单号')">
                    <span style="color: #468cff">复制</span>
                    {{ det[obj].slice(0, 1) }}...
                    <q-tooltip anchor="center start" self="center middle" :offset="[-180, 10]">
                      {{ det[obj] }}
                    </q-tooltip>
                  </q-link>
                </div>
                <div v-else-if="obj === 'status'">
                  <div class="items-center justify-between row">
                    <div
                      v-if="det[obj] == 'PENDING' || det[obj] == 'STEP_1'"
                      class="items-center justify-start gap-3 row"
                    >
                      <!--                    <img src="../assets/records/info-icon.png"/>-->
                      <span class="text-black text-bold">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div
                      v-else-if="det[obj] == 'SUCCESS' || det[obj] === 2 || det[obj] == 'SUPPLEMENT_SUCCESS'"
                      class="items-center justify-start gap-3 row"
                    >
                      <img src="../assets/records/success-icon.png" />
                      <span class="text-positive">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div v-else-if="det[obj] == 'FAIL'" class="items-center justify-start gap-3 row">
                      <img src="../assets/records/error-icon.png" />
                      <span class="text-negative">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div v-else-if="det[obj] == 'CANCEL'" class="items-center justify-start gap-3 row">
                      <img src="../assets/records/warning-icon.png" />
                      <span class="text-warning">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div v-else class="items-center justify-start gap-3 row">
                      <!--                    <img src="../assets/records/info-icon.png"/>-->
                      <span class="text-black text-bold">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else-if="obj === 'betStatus'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'paymentType'">
                  <div class="items-center justify-between row">
                    <div>{{ checkRecord(det[obj]) }}</div>
                    <div v-if="recordType === 'deposit' && det.status === 'PENDING'" class="buttons">
                      <q-btn round size="xs" color="bright" class="btn-deposit" @click="feedbackTrans(det)">
                        <img src="../assets/records/quote-request-icon.png" />
                      </q-btn>
                    </div>
                  </div>
                </div>
                <div v-else-if="obj === 'gameType'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'platform'">
                  {{ det['alias'] ?? det['obj'] }}
                </div>
                <div
                  v-else-if="
                    obj === 'commitDate' ||
                    obj === 'feedbackTime' ||
                    obj === 'recordTime' ||
                    obj === 'transferDate' ||
                    (obj === 'betTime' && recordType === 'bethistory')
                  "
                >
                  {{ humanDatetime(det[obj]) }}
                </div>
                <div v-else-if="obj === 'platformCode' || obj === 'financeRemark' || obj === 'subType'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else>
                  {{ det[obj] }}
                </div>
              </div>
            </template>
          </div>
                  <div v-if="recordType === 'withdraw' || recordType === 'deposit'" class="buttons"> 
                       <q-btn
                          @click="copyText(det.serialNumber, '存款编码')"
                           outline
                           size="md"
                           class="items-center justify-between btn-cfm-deposit bg-greyblue row"
                           icon="content_copy"
                           label="复制"
                         />
                       <template
                         v-if="
                           det.status === 'SUCCESS' &&
                           (det.currencyName === 'CNY' || det.currencyName === 'AliCNY') &&
                           det.confirmStatus === 0
                         "
                       >
                         <q-btn
                           @click="openWithdrawConfirmDialog(det)"
                           outline
                           size="md"
                           class="items-center justify-between btn-cfm-deposit bg-greyblue row"
                           icon="check_circle"
                           label="确认到账"
                         />
                       </template>
 
                       <template v-if="det.status === 'APPLY' || det.status === 'STEP_2'">
                         <q-btn
                           @click="openWithdrawCancelDialog(det)"
                           outline
                           label="取消"
                           size="sm"
                           color="bright"
                           class="q-mr-sm"
                         />
                       </template>
 
                       <template
                         v-if="det.status === 'SUCCESS' && det.currencyName === 'CNY' && det.confirmStatus === 1"
                       >
                         <q-btn
                           disable
                           outline
                           round
                           size="md"
                           class="btn-deposit"
                           color="positive"
                           icon="check_circle"
                         />
                       </template>
                     </div> 
        </q-card>

        <template v-slot:loading>
          <div v-if="comList.length > 0">
            <div class="justify-center row q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </div>
          <div v-else class="q-pa-md" style="text-align: center">
            <div class="justify-center row q-my-md" v-if="!isEnded">
              <q-spinner-dots color="primary" size="40px" />
            </div>
            <span style="padding: 4px 0px; line-height: 36px" >没有更多数据了</span>
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>

  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />

  <q-dialog v-model="reminderDialog" width="100%" no-backdrop-dismiss no-esc-dismis>
    <q-card class="text-black bg-white reminder-dialog-card" style="width: 100%; padding: 0px 0px 20px">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>催单</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-form
          ref="formRef"
          v-model="reminderForm"
          hide-required-mark
          name="basic"
          colon
          autocomplete="off"
          label-align="left"
          label-cols="5"
          class="reminder-dialog-form"
        >
          <q-input
            label="存款编码"
            filled
            v-model="reminderForm.orderNo"
            color="primary"
            padding="none"
            readonly
            disable
          />
          <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
          <q-input
            type="textarea"
            v-model="reminderForm.memberRemark"
            label="备注"
            filled
            autogrow
            color="primary"
            class="q-mt-md"
            :rows="2"
            :max-rows="5"
          />
          <q-btn class="common-btn q-mt-md" color="dyblue" label="提交" @click="submitReminder" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isConfirmWithdraw">
    <q-card style="width: 100%; padding: 20px; text-align: center" class="text-black bg-white">
      <q-card-section class="q-mb-md">
        系统提示
        <br />
        <br />
        确认到账
      </q-card-section>
      <q-btn @click="openWithdrawConfirm()" label="确认" color="dyblue" style="margin-right: 8px" />
      <q-btn @click="isConfirmWithdraw = false" label="取消" color="warning" />
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isCancelWithdraw">
    <q-card style="width: 100%; padding: 20px" class="text-black bg-white">
      <q-card-section class="q-mb-md">
        系统提示
        <br />
        <br />
        确认取消提款
      </q-card-section>
      <q-btn @click="openWithdrawCancel()" label="确认" color="brightbtn" style="margin-right: 8px" />
      <q-btn @click="isCancelWithdraw = false" label="取消" color="warning" />
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import moment from "moment";
import FileUpload from "components/FileUpload.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { translateRecord } from "../directives/translate.js";
import { useUI } from "stores/ui";

export default defineComponent({
  components: {
    FileUpload
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: function () {
        return true;
      }
    },
    recordType: {
      type: String,
      default: function () {
        return "";
      }
    },
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    isEnded: {
      type: Boolean,
      default: function () {
        return false;
      }
    }
  },
  emits: ["loadnewdata"],
  setup(props, context) {
    const truncatedList = ref([]);
    const comList = ref({});
    const $q = useQuasar();
    const qs = require("qs");
    const ui = useUI();
    const isConfirmWithdraw = ref(false);
    const isCancelWithdraw = ref(false);
    const passDet = ref(null);

    const onLoad = (index, done) => {
      
      comList.value = props.list;
      // console.log("onLoad");
      // console.log(comList.value);
      setTimeout(() => {
        console.log('inin',comList.value.length,props.isEnded)
        truncatedList.value = []
        if (!props.isEnded) {
          if (comList.value.length) {
            var slicedArray = comList.value
            slicedArray.forEach((element) => {
              truncatedList.value.push(element);
            });
            done();
          } else if (comList.value.length === 0 ) {
            // context.emit("loadnewdata");
            // done();
          }
        }
      }, 30);
    };

    const openWithdrawConfirmDialog = (det) => {
      isConfirmWithdraw.value = true;
      passDet.value = det;
    };

    const openWithdrawCancelDialog = (det) => {
      isCancelWithdraw.value = true;
      passDet.value = det;
    };

    const openWithdrawCancel = () => {
      const obj = {
        id: passDet.value.id,
        withdrawDate: passDet.value.withdrawDate
      };

      api
        .post("/session/withdraw/cancel", qs.stringify(obj))
        .then((response) => {
          // Handle the response
          if (response.code === 0) {
            isConfirmWithdraw.value = false;
            $q.notify({
              color: "positive",
              position: "top",
              message: "已经取消提款",
              icon: "check_circle_outline"
            });
          }

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          // console.log(response);
        })

        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    };

    const clearTable = () => {
      truncatedList.value = [];
    };

    context.expose({ clearTable });

    const openWithdrawConfirm = () => {
      const obj = {
        id: passDet.value.id,
        withdrawDate: passDet.value.withdrawDate
      };

      api
        .post("/session/withdraw/confirm", qs.stringify(obj))
        .then((response) => {
          // Handle the response
          if (response.code === 0) {
            isConfirmWithdraw.value = false;
            $q.notify({
              color: "positive",
              position: "top",
              message: "已经确认到账",
              icon: "check_circle_outline"
            });
          }

          setTimeout(() => {
            window.location.reload();
          }, 2000);

          // console.log(response);
        })

        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    };

    const copyinput = ref(null);
    const text_copied = ref("");
    const copyText = (text, msgTitle) => {
      text_copied.value = text;
      setTimeout(() => {
        const copyText = copyinput.value;
        copyText.select();
        document.execCommand("copy");
        console.log("Copied");

        $q.notify({
          color: "positive",
          position: "top",
          message: `${msgTitle}复制成功！`,
          icon: "check_circle_outline"
        });
      }, 100);
    };

    const reminderDialog = ref(false);
    const reminderForm = reactive({});
    const uploadFileRef = ref();
    const feedbackTrans = (trans) => {
      console.log(trans);
      console.log(trans.serialNumber);

      api.get("/session/getVerifyingFeedbackCount").then((res) => {
        // console.log(res);
        if (res.code === 0) {
          if (res.data < 3) {
            console.log("Ok here");
            reminderDialog.value = true;
            reminderForm.orderNo = trans.serialNumber;
            reminderForm.memberRemark = null;
            reminderForm.photos = null;
            if (props.recordType === "deposit") {
              reminderForm.type = 1;
              reminderForm.recordTime = trans.depositDate;
            } else if (props.recordType === "withdraw") {
              reminderForm.type = 2;
              reminderForm.recordTime = trans.withdrawDate;
            }
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "已有3个正在催收催单。",
              icon: "report_problem"
            });
          }
        }
      });
    };

    const getImageLink = (linkId) => {
      reminderForm.photos = `/${linkId}`;
    };

    const submitReminder = () => {
      // Check if image upload is empty
      if (!reminderForm.photos) {
        // Display an error message here
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "请上传图片",
          icon: "report_problem"
        });
        return;
      }

      api.post("/session/saveFinanceFeedback", qs.stringify(reminderForm)).then((res) => {
        // console.log(reminderForm)
        const ret = res.data;
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "催单提交成功！",
            icon: "check_circle_outline"
          });
          reminderDialog.value = false;
          reminderForm.value = {};
          uploadFileRef.value = {};
        }
      });
    };

    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
      },
      checkRecord(status) {
        return translateRecord(status, props.recordType);
      },
      translateRecord,
      onLoad,
      truncatedList,
      comList,
      openWithdrawConfirmDialog,
      openWithdrawConfirm,
      isConfirmWithdraw,
      openWithdrawCancelDialog,
      openWithdrawCancel,
      isCancelWithdraw,
      passDet,
      copyText,
      text_copied,
      copyinput,
      feedbackTrans,
      submitReminder,
      reminderDialog,
      reminderForm,
      getImageLink
    };
  }
});
</script>
<style scoped lang="scss">
.table-data {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin: 0 0 10px;

  .label {
    color: #0089ed;
    flex: 1;
    align-items: center;
    display: flex;
    justify-content: flex-start;
  }

  .desc {
    flex: 4;
    word-break: break-all;
    letter-spacing: 1px;
  }
}

.reminder-dialog-form {
  padding: 10px;
}

.buttons {
  text-align: right;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-deposit {
  background: #0089ed10 !important;
  width: 24px;
}
</style>
