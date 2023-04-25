<template>
<div class="change-pwd">
        <q-form @submit="onSubmit">
            <q-input v-model="oldPassword" 
        class="q-pb-xs"
        hide-bottom-space
        filled :type="isPwd ? 'password' : 'text'" label="旧密码"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入旧密码']"
        label-color="brand"
        color="brand">
                <template v-slot:append>
                <q-icon
                    color="brand"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            <q-input v-model="newPassword" 
        class="q-pb-xs"
        hide-bottom-space
        filled :type="isPwd ? 'password' : 'text'" label="新密码"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入新密码']"
        label-color="brand"
        color="brand">
                <template v-slot:append>
                <q-icon
                    color="brand"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            <q-input v-model="confirmNewPwd" 
        class="q-pb-xs"
        hide-bottom-space
        filled :type="isPwd ? 'password' : 'text'" label="确认新密码"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入确认新密码']"
        label-color="brand"
        color="brand">
                <template v-slot:append>
                <q-icon
                    color="brand"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
             <q-btn type="submit" class="q-mt-md" label="登录" width="100%" color="brightbtn" style="width: 100%;" />

    
        </q-form>
</div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
import moment from "moment";
import { api } from "boot/axios"
import { useQuasar } from "quasar"
import { userStore } from "src/stores"


export default defineComponent({
  name: "PersonalView",
  setup() {
    // const isCardActive = ref();
    const isPwd = ref(true);
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
    const updatePwdInfo = reactive({
      oldPassword: "",
      password: ""
    });
    const updatePwdModal = () => {
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password = "";
      updatePwdModalVisible.value = true;
    };
    const submitUpdatePwd = () => {
      oldPasswordRef.value.validate()
      passwordRef.value.validate()

      if (oldPasswordRef.value.hasError || passwordRef.value.hasError) {
      } else {
        api.post("/session/password", qs.stringify({ oldPassword: updatePwdInfo.oldPassword, password: updatePwdInfo.password  })).then((response) => {
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Password updated successfully",
                icon: "check_circle_outline"
              });
              updatePwdModalVisible.value = false;
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: response.message,
              //   icon: "report_problem"
              // });
            }
          }).catch((error) => {
            console.log("error", error);
          });
      }
    };
    const isEditRealName = ref(false)
    const isEditEmail = ref(false)
    const isEditPhone = ref(false)
    const isEditBirthday = ref(false)
    const isEdit = ref(false)
    const emailRef = ref()
    const realNameRef = ref()
    const birthdayRef = ref()
    const phoneRef = ref()
    const formDetail = ref([{ }])
    const updateState = () => {
      const updateInfo = formDetail.value
      if (!personalState.memberInfo.email) {
        emailRef.value.validate()
        if (emailRef.value.hasError) {
          return
        }
      }
      if (!personalState.memberInfo.realName) {
        realNameRef.value.validate()
        if (realNameRef.value.hasError) {
          return
        }
      } 
      if (!personalState.memberInfo.birthday) {
        birthdayRef.value.validate()
        if (birthdayRef.value.hasError) {
          return
        }
      } 
      if (!personalState.memberInfo.telephone) {
        phoneRef.value.validate()
        if (phoneRef.value.hasError) {
          return
        }
      } 
      api.post("/session/account", qs.stringify(updateInfo)).then((r) => {
        if (r.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "อัพเดทเรียบร้อยแล้ว",
            icon: "check_circle_outline"
          });
          loadInfo()
        }
      })
      // if (field === 'email') {
      //   isEditEmail.value = false
      // }
      // if (field === 'name') {
      //   isEditRealName.value = false
      // }
      // if (field === 'phone') {
      //   isEditPhone.value = false
      // }
      // if (field === 'birthday') {
      //   isEditBirthday.value = false
      // }
    }
    return {
      personalState,
      updatePwdInfo,
      submitUpdatePwd,
      oldPasswordRef,
      passwordRef,
      isPwd,
      oldPwdRules: [
        val => (val && val.length > 0) || 'Old password is required',
        val => (val.length > 5 && val.length < 12) || 'Length should be 6 to 12'
      ],
      pwdRules: [
        val => (val && val.length > 0) || 'Password is required',
        val => (val.length > 5 && val.length < 12) || 'Length should be 6 to 12'
      ],
    };
  }
});
</script>
<style lang="scss" scoped>
 .change-pwd {
    padding: 10px;
 }
</style>
