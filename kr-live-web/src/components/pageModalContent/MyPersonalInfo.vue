<template>
  <div class="form-wrapper">
    <form class="personal-info-form form-template">
      <div class="form-item">
        <label>아이디(개인정보)</label>
        <q-input dense v-model="formDetail.nickName" :readonly="!!store.token" outlined
          @update:model-value="updateTouch" />
      </div>
      <div class="form-item">
        <label>실제 이름</label>
        <q-input dense ref="realNameRef" outlined v-model="formDetail.realName" lazy-rules
          :rules="[(val) => (val && val.length > 0) || '비워둘 수 없습니다.']" :readonly="!!store.realName"
          @update:model-value="updateTouch" />
      </div>
      <div class="form-item">
        <label>잔액</label>
        <q-input dense outlined v-model="formDetail.mainWallet" :readonly="store.token ? 'readonly' : false"
          @update:model-value="updateTouch" />
      </div>
      <div class="form-item">
        <label>이메일</label>
        <q-input dense outlined v-model="formDetail.email" :readonly="!!store.token" @update:model-value="updateTouch" />
      </div>
      <div class="form-item">
        <label>전화</label>
        <q-input dense outlined v-model="formDetail.telephone" :readonly="!!store.token"
          @update:model-value="updateTouch" />
      </div>
    </form>
    <div class="action-buttons">
      <div @click="closetheModal" class="primary-button blue">
        닫기
      </div>
      <div @click="updateState" class="primary-button yellow" :class="hasTouched ? '' : 'disabled'">
        제출하다
      </div>
    </div>
  </div>
</template>

<script setup id="RegisterComponent">
import { reactive, ref, onMounted, computed, defineEmits } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
const qs = require("qs");
const emits = defineEmits(["closeModal"]);

const $q = useQuasar();

const hasTouched = ref(false);
const formDetail = reactive({});
const realNameRef = ref();
const personalState = reactive({
  memberInfo: {}
});
const store = userStore();
const mainWallet = computed(() => {
  const balanceWithTwoDecimalPlaces = parseFloat(store.balance).toFixed(2);
  return store.currency.value + " " + balanceWithTwoDecimalPlaces;
});

const updateTouch = () => {
  hasTouched.value = true;
}

const loadInfo = () => {
  personalState.memberInfo = userStore();
  formDetail.realName = personalState.memberInfo.realName;
  formDetail.nickName = personalState.memberInfo.nickName;
  formDetail.mainWallet = personalState.memberInfo.token ? mainWallet : ''
  formDetail.email = personalState.memberInfo.email || '';
  formDetail.telephone = personalState.memberInfo.telephone || ''
}

const updateState = () => {
  if (!hasTouched.value) {
    return;
  }

  const updateInfo = {};

  if (personalState.memberInfo.realName !== formDetail.realName) {
    realNameRef.value.validate();
    if (realNameRef.value.hasError) {
      return;
    }

    updateInfo.realName = formDetail.realName;

    api.post("/session/accounta", qs.stringify(updateInfo)).then(({ data }) => {
      const res = data
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "업데이트 완료",
          icon: "check_circle_outline"
        });

        store.getMemberInfo().then(() => {
          loadInfo();
        });
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: r.message,
          icon: "report_problem"
        });
      }
    });
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: '변경 사항 없음',
      icon: "report_problem"
    });
  }
};

onMounted(() => {
  store.getMemberInfo().then(() => {
    loadInfo();
  });
})

const closetheModal = () => {
  emits("closeModal");
}

</script>

<style lang="scss" scoped>
</style>
