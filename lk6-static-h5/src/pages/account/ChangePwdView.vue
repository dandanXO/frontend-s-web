<template>
  <div class="change-pwd">
    <q-form @submit="submitUpdatePwd">
      <q-input
        ref="oldPasswordRef"
        standout
        v-model="updatePwdInfo.oldPassword"
        class="q-pb-xs"
        hide-bottom-space
        :type="isPwd ? 'password' : 'text'"
        placeholder="请输入旧密码"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入旧密码']"
      >
        <template v-slot:append>
          <!--          <q-icon-->
          <!--              -->
          <!--              :name="isPwd ? 'visibility_off' : 'visibility'"-->
          <!--              class="cursor-pointer"-->
          <!--              @click="isPwd = !isPwd"-->
          <!--          />-->
          <img
            v-if="!isPwd"
            @click="isPwd = !isPwd"
            src="../../assets/login/eye-line.png"
            style="margin-right: 3px"
            width="20"
          />
          <img
            v-if="isPwd"
            @click="isPwd = !isPwd"
            src="../../assets/login/eye-close-line.png"
            style="margin-right: 3px"
            width="20"
          />
        </template>
      </q-input>
      <q-input
        ref="passwordRef"
        standout
        v-model="updatePwdInfo.password"
        class="q-pb-xs"
        hide-bottom-space
        :type="isPwd2 ? 'password' : 'text'"
        placeholder="请输入新密码"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入新密码']"
        label-
      >
        <template v-slot:append>
          <img
            v-if="!isPwd2"
            @click="isPwd2 = !isPwd2"
            src="../../assets/login/eye-line.png"
            style="margin-right: 3px"
            width="20"
          />
          <img
            v-if="isPwd2"
            @click="isPwd2 = !isPwd2"
            src="../../assets/login/eye-close-line.png"
            style="margin-right: 3px"
            width="20"
          />

          <!--          <q-icon-->
          <!--              -->
          <!--              :name="isPwd ? 'visibility_off' : 'visibility'"-->
          <!--              class="cursor-pointer"-->
          <!--              @click="isPwd = !isPwd"-->
          <!--          />-->
        </template>
      </q-input>
      <q-input
        ref="confirmPasswordRef"
        standout
        v-model="updatePwdInfo.confirmNewPwd"
        class="q-pb-xs"
        hide-bottom-space
        :type="isPwd3 ? 'password' : 'text'"
        placeholder="请再次输入新密码"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || '请再次输入新密码',
          (val) => val === updatePwdInfo.password || '确认密码与新密码不符合'
        ]"
        label-
      >
        <template v-slot:append>
          <img
            v-if="!isPwd3"
            @click="isPwd3 = !isPwd3"
            src="../../assets/login/eye-line.png"
            style="margin-right: 3px"
            width="20"
          />
          <img
            v-if="isPwd3"
            @click="isPwd3 = !isPwd3"
            src="../../assets/login/eye-close-line.png"
            style="margin-right: 3px"
            width="20"
          />
        </template>
      </q-input>
      <q-btn type="submit" class="submit-btn" label="修改密码" width="100%" />
    </q-form>
  </div>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted} from "vue";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar"
import {userStore} from "src/stores"
import {useRouter} from "vue-router";


export default defineComponent({
  name: "PersonalView",
  setup() {
    // const isCardActive = ref();
    const isPwd = ref(true);
    const isPwd2= ref(true);
    const isPwd3= ref(true);
    const $q = useQuasar();
    const router = useRouter();
    const qs = require("qs");
    const personalState = reactive({
      memberInfo: {}
    });
    const verificationDetails = reactive({
      memberInfo: {}
    });

    onMounted(() => {
    });

    //update pwd
    const updatePwdModalVisible = ref(false);
    const oldPasswordRef = ref();
    const passwordRef = ref();
    const confirmPasswordRef = ref();
    const updatePwdInfo = reactive({
      oldPassword: "",
      password: "",
      confirmNewPwd: ""
    });
    const updatePwdModal = () => {
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password = "";
      updatePwdInfo.confirmNewPwd = "";
      updatePwdModalVisible.value = true;
    };
    const submitUpdatePwd = () => {
      oldPasswordRef.value.validate()
      passwordRef.value.validate()
      confirmPasswordRef.value.validate();

      if (oldPasswordRef.value.hasError || passwordRef.value.hasError) {
      } else {
        api.post("/session/password", qs.stringify({
          oldPassword:
          updatePwdInfo.oldPassword,
          password: updatePwdInfo.password
        })).then((response) => {
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "密码修改成功",
              icon: "check_circle_outline"
            });
            router.go(-1);
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
        });
      }
    };

    return {
      personalState,
      updatePwdInfo,
      submitUpdatePwd,
      oldPasswordRef,
      passwordRef,
      confirmPasswordRef,
      isPwd,
      isPwd2,
      isPwd3
    };
  }
});
</script>
<style lang="scss" scoped>
.change-pwd {
  :deep(.q-input) {
    margin-bottom: 12px;
    .q-field__control {
      border-radius: 7px;
      box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;
      background-color: #f7f8fb;
    }
    .q-placeholder {
      color: #424f72;
      &::placeholder {
        color: #a4aabb;
        opacity: 1;
      }
    }
  }
}
</style>
<style lang="scss">
.change-pwd {
  padding: 10px;

  input.q-placeholder {
    color: #333333 !important;
  }

  .submit-btn {
    width: 100%;
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
    border: 1px solid #ffffff;
    box-shadow: 0px 2px 0px 0px #9ab0ff70;
    border-radius: 30px;
    padding: 12px 0;
    font-size: 16px;
    white-space: nowrap;
    color: #fff;
  }
}
</style>
