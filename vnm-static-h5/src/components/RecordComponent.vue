<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brightbtn" />
      <div class="label" style="color: #fff">{{ t("lang.loading") }}</div>
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
                <div v-else-if="obj === 'status'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'betStatus'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'paymentType'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'gameType' || obj === 'platform'">
                  {{ checkRecord(det[obj]) }}
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
          <div class="buttons">
            <template
              v-if="
                (recordType === 'deposit' && det.status === 'PENDING') ||
                (recordType === 'withdraw' && det.status === 'STEP_1')
              "
            >
              <q-btn
                outline
                :label="$t('lang.str_reminder')"
                @click="feedbackTrans(det)"
                size="sm"
                color="bright"
                class="q-mr-sm"
              />
            </template>

            <template v-if="recordType === 'deposit'">
              <q-btn
                outline
                :label="$t('lang.str_copy')"
                @click="copyText(det.serialNumber, $t('lang.str_deposit_serialnumber'))"
                size="sm"
                color="bright"
              />
            </template>
          </div>

          <div v-if="recordType === 'withdraw'" class="buttons">
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
                :label="$t('lang.str_confirmwithdraw')"
                size="sm"
                color="bright"
              />
            </template>

            <template v-if="det.status === 'APPLY' || det.status === 'STEP_2'">
              <q-btn
                @click="openWithdrawCancelDialog(det)"
                outline
                :label="$t('lang.msg_cancel')"
                size="sm"
                color="bright"
                class="q-mr-sm"
              />
            </template>

            <q-btn
              outline
              :label="$t('lang.str_copy')"
              @click="copyText(det.serialNumber, $t('lang.str_serial_number'))"
              size="sm"
              color="bright"
            />
          </div>
        </q-card>
        <template v-slot:loading>
          <div v-if="comList.length > 0">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="white" size="40px" />
            </div>
          </div>
          <div v-else class="q-pa-md" style="text-align: center">
            <div class="row justify-center q-my-md" v-if="!isEnded">
              <q-spinner-dots color="white" size="40px" />
            </div>
            <span style="padding: 4px 0px; line-height: 36px" v-if="isEnded">{{ t("lang.no_more_data_le") }}</span>
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>

  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />

  <q-dialog v-model="reminderDialog" width="100%" no-backdrop-dismiss no-esc-dismis>
    <q-card class="reminder-dialog-card bg-white" style="width: 100%; padding: 0px 0px 20px">
      <q-card-section class="text-white">
        <q-toolbar>
          <q-toolbar-title>{{ $t("lang.str_reminder") }}</q-toolbar-title>
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
            :label="$t('lang.str_deposit_serialnumber')"
            filled
            v-model="reminderForm.orderNo"
            padding="none"
            readonly
            disable
          />
          <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
          <q-input
            type="textarea"
            v-model="reminderForm.memberRemark"
            :label="$t('lang.str_remark')"
            filled
            autogrow
            color="white"
            class="q-mt-md"
            :rows="2"
            :max-rows="5"
          />
          <q-btn
            class="common-btn q-mt-md"
            color="brightbtn"
            :label="$t('lang.personal_submit')"
            @click="submitReminder"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isConfirmWithdraw">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black">
      <q-card-section class="q-mb-md">
        {{ $t("lang.strsystem_message") }}
        <br />
        <br />
        {{ $t("lang.str_confirmwithdraw") }}
      </q-card-section>
      <q-btn
        @click="openWithdrawConfirm()"
        :label="$t('lang.str_confirm')"
        color="brightbtn"
        style="margin-right: 8px"
      />
      <q-btn @click="isConfirmWithdraw = false" :label="$t('lang.str_cancel')" color="warning" />
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isCancelWithdraw">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black">
      <q-card-section class="q-mb-md">
        {{ $t("lang.strsystem_message") }}
        <br />
        <br />
        {{ $t("lang.str_cancelwithdraw") }}
      </q-card-section>
      <q-btn
        @click="openWithdrawCancel()"
        :label="$t('lang.str_confirm')"
        color="brightbtn"
        style="margin-right: 8px"
      />
      <q-btn @click="isCancelWithdraw = false" :label="$t('lang.str_cancel')" color="warning" />
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import moment from "moment";
import FileUpload from "components/FileUpload.vue";
import { api } from "boot/axios";
import { SessionStorage, useQuasar } from "quasar";
import { translateRecord } from "../directives/translate.js";
import * as _ from "lodash";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";

export default defineComponent({
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
  components: {
    FileUpload
  },
  emits: ["loadnewdata"],
  setup(props, context) {
    const truncatedList = ref([]);
    const comList = ref({});
    const $q = useQuasar();
    const qs = require("qs");
    const isConfirmWithdraw = ref(false);
    const isCancelWithdraw = ref(false);
    const passDet = ref(null);
    const { t } = useI18n();

    const clearTable = () => {
      truncatedList.value = [];
    };

    context.expose({ clearTable });

    const onLoad = (index, done) => {
      comList.value = props.list;
      // console.log("onLoad");
      // console.log(comList.value);
      setTimeout(() => {
        if (!props.isEnded) {
          if (comList.value.length) {
            var slicedArray = comList.value.splice(0, 3);
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
              message: t("lang.confirm_withdrawal_sucess"),
              icon: "check_circle_outline"
            });
            removeSessionKeys("/session/member/withdraw");
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
            isCancelWithdraw.value = false;
            $q.notify({
              type: "success",
              message: t("lang.withdraw_cancelled")
            });
            removeSessionKeys("/session/member/withdraw");

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }

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
      console.log(text_copied.value);

      setTimeout(() => {
        const copyText = copyinput.value;
        console.log(copyText);

        copyText.select();
        document.execCommand("copy");
        console.log("Copied");

        $q.notify({
          color: "positive",
          position: "top",
          message: `${msgTitle}` + t("lang.success_copied"),
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
            // console.log("Ok here");
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
              message: t("lang.already_have_3_reminder"),
              icon: "report_problem"
            });
          }
        }
      });
    };

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;
    const getImageLink = (linkId) => {
      // reminderForm.photos = linkId;
      reminderForm.photos = `${imgURL}/${linkId}`;
    };

    const submitReminder = () => {
      // Check if image upload is empty
      if (!reminderForm.photos) {
        // Display an error message here
        $q.notify({
          color: "negative",
          position: "bottom",
          message: t("lang.please_upload_image"),
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
            message: t("lang.require_success_submit"),
            icon: "check_circle_outline"
          });
          reminderDialog.value = false;
          reminderForm.value = {};
          uploadFileRef.value = {};
          removeSessionKeys("/session/member/deposit");
        }
      });
    };

    const removeSessionKeys = (prefix) => {
      var keys = SessionStorage.getAllKeys();
      _.each(keys, function (key, item) {
        // console.log(key);
        if (key.indexOf(prefix) > -1) {
          SessionStorage.remove(key);
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
      isCancelWithdraw,
      openWithdrawCancelDialog,
      openWithdrawCancel,
      isConfirmWithdraw,
      passDet,
      copyText,
      text_copied,
      copyinput,
      feedbackTrans,
      submitReminder,
      reminderDialog,
      reminderForm,
      getImageLink,
      t
    };
  }
});
</script>
<style scoped lang="scss">
.table-data {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin: 0 0 10px;

  .label {
    flex: 1;
  }

  .desc {
    flex: 3;
    word-break: break-all;
  }
}

.buttons {
  text-align: right;
}

:deep(.q-card__section) {
  background: none;
}

.reminder-dialog-form {
  padding: 16px;
}
</style>
