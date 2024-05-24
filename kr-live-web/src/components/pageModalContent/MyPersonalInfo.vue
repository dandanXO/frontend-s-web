<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
      <form class="personal-info-form">
        <div>
          <label>아이디(개인정보)</label>
          <q-input
            v-model="formDetail.nickName"
            :readonly="store.token ? 'readonly' : false"
            placeholder=""
            filled
          />
        </div>
        <div>
          <label>실제 이름</label>
          <q-input
            ref="realNameRef"
            filled
            v-model="formDetail.realName"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '비워둘 수 없습니다.']"
            :readonly="store.realName ? true : false"
          />
        </div>
        <div>
          <label>잔액</label>
          <q-input
            filled
            v-model="formDetail.mainWallet"
            :readonly="store.token ?  'readonly' : false"
            placeholder=""
          />
        </div>
        <div>
          <label>이메일</label>
          <q-input
          filled
            v-model="formDetail.email"
            :readonly="store.token ? 'readonly' : false"
            placeholder=""
          />
        </div>
        <div>
          <label>전화</label>
          <q-input
          filled
            v-model="formDetail.telephone"
            :readonly="store.token ? 'readonly' : false"
            placeholder=""
          />
        </div>
      </form>
      <div class="action-buttons">
        <q-btn rounded flat style="width:200px;height:70px;" @click="closetheModal" :label="'닫기'" class="primary-button blue" />
        <q-btn rounded flat style="width:200px;height:70px;" @click="updateState" :label="'제출하다'" class="primary-button yellow" />
      </div>
    </q-card-section>
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

const loadInfo = () => {
  personalState.memberInfo = userStore();
  formDetail.realName = personalState.memberInfo.realName;
  formDetail.nickName = personalState.memberInfo.nickName;
  formDetail.mainWallet = personalState.memberInfo.token ? mainWallet : ''
  formDetail.email = personalState.memberInfo.email || '';
  formDetail.telephone = personalState.memberInfo.telephone || ''
}

const updateState = () => {
  const updateInfo = {};

  if (personalState.memberInfo.realName !== formDetail.realName) {
    realNameRef.value.validate();
    if (realNameRef.value.hasError) {
      return;
    }

    updateInfo.realName = formDetail.realName;

    api.post("/session/account", qs.stringify(updateInfo)).then(({data}) => {
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

<style lang="scss">
.personal-info-form {
  .q-field--filled.q-field--dark .q-field__control,
  .q-field--filled.q-field--dark .q-field__control:before {
    width: 100%;
    font-size: 14px;
    border: 1px solid #48b5b5;
    line-height: 40px;
    color: #fff;
    background: #252e43;
    border-radius: 8px;
  }
}
</style>

<style lang="scss" scoped>
.modal-body-content {
  .personal-info-form {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 30px;

    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;

    }

    input,
    select {
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5C5C5C;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }

    select {
      height: 52px;
    }

    label,
    input,
    select {
      width: 100%;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 20px 10px 10px;
  }
}
</style>
