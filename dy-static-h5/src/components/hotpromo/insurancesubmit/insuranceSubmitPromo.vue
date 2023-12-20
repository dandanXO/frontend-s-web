<template>
  <div>
    <div class="row justify-center q-mt-md">
      <q-btn color="primary" @click="handleOpenDialog" label="点击申请" />
    </div>

    <q-dialog v-model="insuranceFormModal" persistent>
      <q-card class="insurance-card">
        <q-card-section class="q-mb-md row justify-center">
          <div class="text-h6">保险</div>
        </q-card-section>

        <q-card-section class="row items-center">
          <q-form>
            <q-input
              filled
              v-model="insuranceInfo.accountId"
              disable
              label="账号"
              ref="insuranceAccountId"
              color="dyblue"
            />

            <q-select
              filled
              v-model="insuranceInfo.platform"
              :options="platformOptions"
              ref="insurancePlatform"
              label="投注平台"
              color="dyblue"
              :rules="[(v) => !!v || '请选择投注平台']"
            />

            <q-input
              filled
              v-model="insuranceInfo.transactionId"
              label="注单号"
              ref="insuranceTransactionId"
              color="dyblue"
              :rules="[(v) => !!v || '请输入注单号']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="center">
          <div class="flex flex-center">
            <q-btn class="q-mr-md" label="取消" color="warning" @click="insuranceFormModal = false" />
            <q-btn color="dyblue" label="提交" @click="handleSubmit" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineProps } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";

var qs = require("qs");
const $q = useQuasar();
const store = userStore();
const insuranceFormModal = ref(false);

const props = defineProps({
  platformType: String
});

const insuranceInfo = reactive({
  accountId: "",
  platform: "",
  transactionId: "",
  gameMatchId: ""
});
const platformListDetails = ref([]);
const insuranceAccountId = ref();
const insurancePlatform = ref();
const insuranceTransactionId = ref();

const platformDetails = ref([]);
const platformOptions = ref([]);

const getPlatformList = () => {
  eventapi
    .get(`/game-match/platform/${props.platformType}`)
    .then((res) => {
      if (res.code === 0) {
        platformOptions.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getPlatformDetails = () => {
  eventapi
    .get(`/game-match/upcoming/${props.platformType}`)
    .then((res) => {
      if (res.code === 0) {
        platformDetails.value = res.data;
        insuranceInfo.gameMatchId = res.data.id;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const autoPreFillForm = () => {
  insuranceInfo.accountId = store.nickName;
};

const handleSubmit = () => {
  insurancePlatform.value.validate();
  insuranceTransactionId.value.validate();

  if (insurancePlatform.value.hasError || insuranceTransactionId.value.hasError) {
  } else {
    eventapi
      .post("/game-match/submit", qs.stringify(insuranceInfo))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "已添加保险投注",
            icon: "check_circle_outline"
          });
          insuranceFormModal.value = false;
          insuranceInfo.accountId = "";
          insuranceInfo.platform = "";
          insuranceInfo.transactionId = "";
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
      });
  }
};

const handleOpenDialog = () => {
  autoPreFillForm();
  getPlatformList();
  getPlatformDetails();
  insuranceFormModal.value = true;
};

onMounted(() => {
  // getPlatformList();
});
</script>

<style lang="scss" scoped>
.insurance-card {
  padding: 20px;
  width: 100%;
  max-width: 400px;

  :deep(.q-form) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
}
</style>
