<template>
    <div class="modal-body-wrap">
        <q-card-section class="modal-body-content">
            <q-form class="update-pwd-form">
                <div>
                    <label>기존 비밀번호</label>
                    <q-input
                        ref="oldPasswordRef"
                        type="password"
                        filled
                        v-model="updatePwdInfo.oldPassword"
                        stack-label
                        :rules="oldPwdRules"
                        clearable
                    />
                </div>

                <div>
                    <label>변경할 비밀번호</label>
                    <q-input
                        ref="passwordRef"
                        type="password"
                        filled
                        v-model="updatePwdInfo.password"
                        :rules="pwdRules"
                        clearable
                        stack-label
                    />
                </div>

                <div>
                    <label>비밀번호 확인</label>
                    <q-input
                        ref="confirmRef"
                        type="password"
                        filled
                        v-model="updatePwdInfo.confirm_pass"
                        :rules="pwdRules"
                        clearable
                        stack-label
                    />
                </div>
            </q-form>
            <div class="action-buttons">
                <q-btn class="form-button blue" label="확인하다"  @click="submitUpdatePwd"></q-btn>
            </div>
        </q-card-section>
    </div>
</template>

<script setup id="RegisterComponent">
import { reactive, ref, onMounted } from "vue";
import { api } from "boot/axios"
import { userStore } from "src/stores"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const qs = require("qs");

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const store = userStore();
const oldPasswordRef = ref();
const passwordRef = ref();
const confirmRef = ref();

const updatePwdInfo = reactive({
    oldPassword: "",
    password: "",
    confirm_pass: ""
});

const submitUpdatePwd = () => {
    oldPasswordRef.value.validate()
    passwordRef.value.validate()

    if (oldPasswordRef.value.hasError || passwordRef.value.hasError) {
    } else {
    api.post("/session/password", qs.stringify({
        oldPassword: updatePwdInfo.oldPassword,
        password: updatePwdInfo.password
    })).then((res) => {
        const response = res.data
        if (response.code === 0) {
            $q.notify({
                color: "positive",
                position: "top",
                message: t('lang.password_updated'),
                icon: "check_circle_outline"
            });
            
            // router.push('/');
            // store.memberLogout();
        } else {

        }
    }).catch((error) => {
        console.log("error", error);
    });
    }
};
</script>

<style lang="scss">
.update-pwd-form {
    .q-field--filled.q-field--dark .q-field__control, .q-field--filled.q-field--dark .q-field__control:before {
        width: 100%;
        font-size: 14px;
        border-radius: 3px;
        border: 1px solid #5C5C5C;
        line-height: 40px;
        color: #fff;
  }
}
</style>
<style lang="scss" scoped>
.modal-body-content {
    .update-pwd-form {
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

        .form-button {
            height: 70px;
            width: 200px;
            background-size: contain;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 18px;
            padding-bottom: 5px;

            &.blue {
                background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
            }

            &.yellow {
                background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
            }
        }
    }
}
</style>