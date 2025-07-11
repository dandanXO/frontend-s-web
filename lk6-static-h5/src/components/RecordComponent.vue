<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand" />
      <div class="label">{{ $t("common.loading") }}</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="250">
        <q-card v-for="(det, n) in truncatedList" :key="n" class="q-pa-md">
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
                  <q-link @click="copyText(det[obj], $t('record.betId'))">
                    <span style="color: #468cff">{{ $t("btn.copy") }}</span>
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
                      <span>
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div
                      v-else-if="det[obj] == 'SUCCESS' || det[obj] === 2 || det[obj] == 'SUPPLEMENT_SUCCESS'"
                      class="items-center justify-start gap-3 row"
                    >
                      <span class="success">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div v-else-if="det[obj] == 'FAIL'" class="items-center justify-start gap-3 row">
                      <span class="failed">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div v-else-if="det[obj] == 'CANCEL'" class="items-center justify-start gap-3 row">
                      <img src="../assets/records/warning-icon.png" />
                      <span class="warning">
                        {{ checkRecord(det[obj], recordType) }}
                      </span>
                    </div>
                    <div v-else class="items-center justify-start gap-3 row">
                      <!--                    <img src="../assets/records/info-icon.png"/>-->
                      <span>
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
                  </div>
                </div>
                <div v-else-if="obj === 'gameType'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'platform'">
                  {{ det["alias"] ?? det["obj"] }}
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
                <div v-else-if="obj === 'serialNumber'" class="deposit-serial-number">
                  <div class="ellipsis">{{ det[obj] }}</div>
                  <q-btn @click="copyText(det.serialNumber, $t('record.serialNumber'))" flat round>
                    <img src="../assets/records/copy-icon.png" />
                  </q-btn>
                </div>
                <div v-else>
                  {{ det[obj] }}
                </div>
              </div>
            </template>
          </div>
          <div v-if="recordType === 'withdraw' || recordType === 'deposit'" class="buttons">
            <q-btn
              v-if="recordType === 'deposit' && det.status === 'PENDING'"
              class="action-btn"
              @click="feedbackTrans(det)"
            >
              {{ $t("btn.reminderRequest") }}
            </q-btn>
            <template
              v-if="
                det.status === 'SUCCESS' &&
                (det.currencyName === 'CNY' || det.currencyName === 'AliCNY') &&
                det.confirmStatus === 0
              "
            >
              <q-btn @click="openWithdrawConfirmDialog(det)" class="action-btn" :label="$t('btn.confirmFund')" />
            </template>

            <template v-if="det.status === 'APPLY' || det.status === 'STEP_2'">
              <q-btn @click="openWithdrawCancelDialog(det)" class="action-btn" :label="$t('btn.cancel')" />
            </template>

            <!-- <template v-if="det.status === 'SUCCESS' && det.currencyName === 'CNY' && det.confirmStatus === 1">
              <q-btn disable outline round size="md" class="btn-deposit" color="positive" icon="check_circle" />
            </template> -->
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
            <span v-else style="padding: 4px 0px; line-height: 36px; color: #7a80a1">
              {{ $t("common.noMoreData") }}
            </span>
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>

  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />

  <CommonModal
    v-model="reminderDialog"
    no-backdrop-dismiss
    no-esc-dismiss
    :header="$t('record.notification.reminderRequest.title')"
    :confirm-btn-text="$t('btn.reminderRequest')"
    @confirm="submitReminder"
  >
    <template #content>
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
          :label="$t('record.notification.reminderRequest.content.serialNumber')"
          standout
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
          :label="$t('record.notification.reminderRequest.content.remark')"
          standout
          autogrow
          color="primary"
          class="q-mt-md"
          :rows="2"
          :max-rows="5"
        />
      </q-form>
    </template>
  </CommonModal>

  <CommonModal
    v-model="isConfirmWithdraw"
    :header="$t('record.notification.confirmFund.title')"
    :message="$t('record.notification.confirmFund.message')"
    with-decorator
    :actions="['confirm', 'cancel']"
    @confirm="openWithdrawConfirm"
    @cancel="isConfirmWithdraw = false"
  />

  <CommonModal
    v-model="isCancelWithdraw"
    :header="$t('record.notification.cancelWithdraw.title')"
    :message="$t('record.notification.cancelWithdraw.message')"
    :actions="['confirm', 'cancel']"
    @confirm="openWithdrawCancel"
    @cancel="isCancelWithdraw = false"
  />
</template>
<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import moment from "moment";
import FileUpload from "components/FileUpload.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { translateRecord } from "../directives/translate.js";
import { useUI } from "stores/ui";
import CommonModal from "./CommonModal.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    FileUpload,
    CommonModal
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
    const { t } = useI18n();

    const onLoad = (index, done) => {
      comList.value = props.list;
      // console.log("onLoad");
      // console.log(comList.value);
      setTimeout(() => {
        truncatedList.value = [];
        if (!props.isEnded || comList.value.length > 0) {
          if (comList.value.length) {
            var slicedArray = comList.value;
            slicedArray.forEach((element) => {
              truncatedList.value.push(element);
            });
            done();
          } else if (comList.value.length === 0) {
            context.emit("loadnewdata");
            done();
          }
        }
      }, 100);
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
              message: t("record.notification.cancelWithdrawSuccess.message"),
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
              message: t("record.notification.confirmFundSuccess.message"),
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
          message: t("common.notification.copySuccess.message", { str: msgTitle }),
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
              message: t("record.notification.reminderRequestLimit.message"),
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
          message: t("common.uploadFileRequired.message"),
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
            message: t("record.notification.reminderRequestSuccess.message"),
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
    color: #7a80a1;
    flex: 3;
    align-items: center;
    display: flex;
    justify-content: flex-start;
    // min-width: max-content;
  }

  .desc {
    flex: 8;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 1px;
    color: #7a80a1;

    > div {
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .success {
      color: #00ffc2;
    }

    .failed {
      color: #f53434;
    }

    .deposit-serial-number {
      display: flex;
      align-items: center;
      gap: 4px;
      .q-btn {
        padding: 0;
      }
      img {
        max-width: 20px;
      }
    }
  }
}

.reminder-dialog-form {
  padding: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;

  .action-btn {
    background-image: url("../assets/images/index/primary-btn.png");
    background-size: 100% 100%;
    color: #fff;
    // width: 87px;
    padding: 5px 11px;
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    // aspect-ratio: 87/32;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    box-shadow: 0px -0.87px 3.47px 0px #ffffff;
    border-radius: 45.9px;
    margin-right: 5px;
  }
}

.btn-deposit {
  background: #0089ed10 !important;
  width: 24px;
}
</style>
