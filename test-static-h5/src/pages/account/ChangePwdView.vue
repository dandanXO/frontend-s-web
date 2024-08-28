<template>
  <q-page>
    <q-form @submit="submitUpdatePwd">
      <div class="change-pwd">
        <q-label>
          旧密码
          <em>*</em>
        </q-label>
        <q-input
          ref="oldPasswordRef"
          standout
          v-model="updatePwdInfo.oldPassword"
          class="q-pb-xs"
          hide-bottom-space
          :type="isPwd ? 'password' : 'text'"
          label="请输入旧密码"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || '请输入旧密码']"
        >
          <template v-slot:append>
            <q-icon
              color="dark"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-label>
          新密码
          <em>*</em>
        </q-label>
        <q-input
          ref="passwordRef"
          standout
          v-model="updatePwdInfo.password"
          class="q-pb-xs"
          hide-bottom-space
          :type="isPwd ? 'password' : 'text'"
          label="请输入新密码"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || '请输入新密码']"
        >
          <template v-slot:append>
            <q-icon
              color="dark"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-label>
          确认密码
          <em>*</em>
        </q-label>
        <q-input
          ref="confirmPasswordRef"
          standout
          v-model="updatePwdInfo.confirmNewPwd"
          class="q-pb-xs"
          hide-bottom-space
          :type="isPwd ? 'password' : 'text'"
          label="请再次输入密码"
          lazy-rules
          clearable
          :rules="[
            (val) => (val && val.length > 0) || '请再次输入新密码',
            (val) => val === updatePwdInfo.password || '确认密码与新密码不符合'
          ]"
        >
          <template v-slot:append>
            <q-icon
              color="dark"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <div class="box-width">
        <q-btn type="submit" class="common-large-btn" label="提交" width="100%" style="width: 100%" />
      </div>
    </q-form>
  </q-page>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted} from "vue";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar"
import {userStore} from "src/stores"
import {useRouter} from "vue-router";
import { useNotify } from "src/hooks/notify";


export default defineComponent({
  name: "ChangePwdView",
  setup() {
    // const isCardActive = ref();
    const notify = useNotify();
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
            notify({
              type: "success",
              message: "密码修改成功",
            });
            router.go(-1);
          } else {
            notify({
              type: "error",
              message: response.message,
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
  padding: 20px 15px 24px;
  background: $white;
  width: $box-width;
  margin: 15px auto 20px;
  border-radius: 10px;
  box-shadow: $shadow-bg;

  q-label {
    margin-top: 8px;
    display: inline-block;
    margin-bottom: 4px;

    em {
      color: $negative;
    }
  }
}

.body--dark {
  .change-pwd {
    @include content-block-dark-with-border;
  }
}
</style>
