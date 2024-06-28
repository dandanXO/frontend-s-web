<template>
  <div class="page-container personal-info-page">
    <div class="form-wrapper">
      <form class="personal-info-form form-template">
        <div class="form-item">
          <label>{{ $t('lang.personal_nickname') }}</label>
          <q-skeleton v-if="isFetchingPersonalInfo" type="QInput" />
          <q-input v-else dense v-model="formDetail.name2" :readonly="!!store.name2" outlined
            @update:model-value="updateTouch" ref="name2Ref" lazy-rules
            :rules="[(val) => (val && val.length > 0) || '비워둘 수 없습니다.']" :loading="isSubmitting"
            :disable="isSubmitting" />
        </div>
        <div class="form-item">
          <label>{{ $t('lang.personal_real_name') }}</label>
          <q-skeleton v-if="isFetchingPersonalInfo" type="QInput" />
          <q-input v-else dense ref="realNameRef" outlined v-model="formDetail.realName" lazy-rules
            :rules="[(val) => (val && val.length > 0) || '비워둘 수 없습니다.']" :readonly="!!store.realName"
            @update:model-value="updateTouch" :loading="isSubmitting" :disable="isSubmitting" />
        </div>
        <div class="form-item">
          <label>{{ $t('lang.personal_id') }}</label>
          <q-skeleton v-if="isFetchingPersonalInfo" type="QInput" />
          <q-input v-else dense outlined v-model="formDetail.loginName" :readonly="store.token ? 'readonly' : false"
            @update:model-value="updateTouch" :loading="isSubmitting" :disable="isSubmitting" />
        </div>
        <div class="form-item">
          <label>{{ $t('lang.personal_phone') }}</label>
          <q-skeleton v-if="isFetchingPersonalInfo" type="QInput" />
          <q-input v-else dense outlined v-model="formDetail.telephone" :readonly="!!store.telephone"
            @update:model-value="updateTouch" :loading="isSubmitting" :disable="isSubmitting" />
        </div>
      </form>
    </div>

    <div class="action-buttons">
      <q-btn @click="closetheModal" class="primary-button blue" :label="$t('lang.personal_close_btn')"
        :loading="isSubmitting" :disable="isSubmitting" />
      <q-btn @click="updateState" class="primary-button yellow" :disable="!hasTouched || isSubmitting"
        :loading="isSubmitting" :label="$t('lang.personal_update_btn')" />
    </div>
  </div>
</template>

<script setup id="RegisterComponent">
import { reactive, ref, onMounted, defineEmits } from "vue";
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
const isFetchingPersonalInfo = ref(false);
const isSubmitting = ref(false);

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

  name2Ref.value.validate();
  realNameRef.value.validate();

  if (name2Ref.value.hasError || realNameRef.value.hasError) {
    // validation error, do nothing
  } else {
    updateInfo.name2 = personalState.memberInfo.name2 !== formDetail.name2 ? formDetail.name2 : undefined;
    updateInfo.realName = personalState.memberInfo.realName !== formDetail.realName ? formDetail.realName : undefined;

    isSubmitting.value = true;
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
      isSubmitting.value = false;
    }).catch(() => {
      isSubmitting.value = false;
    });
  }
};

onMounted(() => {
  isFetchingPersonalInfo.value = true;
  store.getMemberInfo().then(() => {
    loadInfo();
    isFetchingPersonalInfo.value = false;
  }).catch(() => {
    isFetchingPersonalInfo.value = false;
  });
})

const closetheModal = () => {
  emits("closeModal");
}

</script>

<style lang="scss" scoped>
.form-wrapper {
  padding: 20px;
}
</style>
