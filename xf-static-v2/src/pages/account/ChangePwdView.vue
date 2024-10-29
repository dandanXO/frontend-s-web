<template>
  <div class="change-pwd">
    <q-form @submit="submitUpdatePwd">
      <div class="bg-darkbox">
        <div class="q-gutter-y-md">
          <div>
            <div class="input-label q-mb-sm">
              旧密码
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              ref="oldPasswordRef"
              v-model="updatePwdInfo.oldPassword"
              class="q-pb-xs"
              hide-bottom-space
              :type="isPwd ? 'password' : 'text'"
              placeholder="请输入旧密码"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || '请输入旧密码']"
              outlined
              color="white"
              bg-color="recinputstyle"
            >
              <template v-slot:append>
                <q-icon
                  color="brand"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <div>
            <div class="input-label q-mb-sm">
              新密码
              <span style="color: #f53434">*</span>
            </div>

            <q-input
              ref="passwordRef"
              v-model="updatePwdInfo.password"
              class="q-pb-xs"
              hide-bottom-space
              :type="isPwd ? 'password' : 'text'"
              placeholder="请输入新密码"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || '请输入新密码']"
              outlined
              color="white"
              bg-color="recinputstyle"
            >
              <template v-slot:append>
                <q-icon
                  color="brand"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <div>
            <div class="input-label q-mb-sm">
              确认新密码
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              ref="confirmPasswordRef"
              v-model="updatePwdInfo.confirmNewPwd"
              hide-bottom-space
              :type="isPwd ? 'password' : 'text'"
              placeholder="请输入确认新密码"
              lazy-rules
              clearable
              :rules="[
                (val) => (val && val.length > 0) || '请再次输入新密码',
                (val) => val === updatePwdInfo.password || '确认密码与新密码不符合'
              ]"
              outlined
              color="white"
              bg-color="recinputstyle"
            >
              <template v-slot:append>
                <q-icon
                  color="brand"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <q-btn type="submit" class="q-mt-md" label="修改密码" width="100%" color="brightbtn" style="width: 100%" />
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
      isPwd
    };
  }
});
</script>
<style lang="scss">
.change-pwd {
  padding: 10px;
}
</style>
