<template>
  <div class="form-wrapper">
    <form class="personal-info-form form-template">
      <div class="form-item">
        <label>{{ $t('lang.personal_nickname') }}</label>
        <q-input dense v-model="formDetail.name2" :readonly="!!store.name2" outlined @update:model-value="updateTouch"
          ref="name2Ref" lazy-rules :rules="[(val) => (val && val.length > 0) || '비워둘 수 없습니다.']" />
      </div>
      <div class="form-item">
        <label>{{ $t('lang.personal_real_name') }}</label>
        <q-input dense ref="realNameRef" outlined v-model="formDetail.realName" lazy-rules
          :rules="[(val) => (val && val.length > 0) || '비워둘 수 없습니다.']" :readonly="!!store.realName"
          @update:model-value="updateTouch" />
      </div>
      <div class="form-item">
        <label>{{ $t('lang.personal_id') }}</label>
        <q-input dense outlined v-model="formDetail.loginName" :readonly="store.token ? 'readonly' : false"
          @update:model-value="updateTouch" />
      </div>
      <div class="form-item">
        <label>{{ $t('lang.personal_phone') }}</label>
        <q-input dense outlined v-model="formDetail.telephone" :readonly="!!store.telephone"
          @update:model-value="updateTouch" />
      </div>
    </form>
    <div class="action-buttons">
      <div @click="closetheModal" class="primary-button blue">
        {{ $t('lang.personal_close_btn') }}
      </div>
      <div @click="updateState" class="primary-button yellow" :class="hasTouched ? '' : 'disabled'">
        {{ $t('lang.personal_update_btn') }}
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
const name2Ref = ref();
const personalState = reactive({
  memberInfo: {}
});
const store = userStore();

const updateTouch = () => {
  hasTouched.value = true;
}

const loadInfo = () => {
  personalState.memberInfo = userStore();
  formDetail.realName = personalState.memberInfo.realName;
  formDetail.name2 = personalState.memberInfo.name2;
  formDetail.loginName = personalState.memberInfo.nickName;
  formDetail.telephone = personalState.memberInfo.telephone || ''
}

const updateState = () => {
  if (!hasTouched.value) {
    return;
  }

  const updateInfo = {};

  if (personalState.memberInfo.name2 !== formDetail.name2) {
    name2Ref.value.validate();
    if (name2Ref.value.hasError) {
      return;
    }

    updateInfo.name2 = formDetail.name2;

    api.post("/session/account", qs.stringify(updateInfo)).then(({ data }) => {
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

<style lang="scss" scoped></style>
