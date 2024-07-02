<template>
    <div class="form-wrapper">
        <form class="update-pwd-form form-template">
            <div class="form-item">
                <label>기존 비밀번호</label>
                <q-input dense ref="oldPasswordRef" type="password" outlined v-model="updatePwdInfo.oldPassword"
                    clearable :rules="[
                        (val) =>
                            (val && val.length >= 6) ||
                            '는 6자 이상이어야 합니다.'
                    ]" />
            </div>

            <div class="form-item">
                <label>변경할 비밀번호</label>
                <q-input dense ref="passwordRef" type="password" outlined v-model="updatePwdInfo.password" :rules="[
                    (val) =>
                        (val && val.length >= 6) ||
                        '는 6자 이상이어야 합니다.'
                ]" clearable />
            </div>

            <div class="form-item">
                <label>비밀번호 확인</label>
                <q-input dense ref="confirmRef" type="password" outlined v-model="updatePwdInfo.confirm_pass" :rules="[
                    (val) =>
                        (val && val.length >= 6) ||
                        '는 6자 이상이어야 합니다.',
                    (val) =>
                        val === updatePwdInfo.password || '비밀번호 확인 는 변경할 비밀번호 와 동일해야 합니다.'
                ]" clearable />
            </div>
        </form>
        <div class="action-buttons">
            <div class="primary-button blue" @click="submitUpdatePwd">변경완료</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
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

                router.push('/');
                store.memberLogout();
            } else {

            }
        }).catch((error) => {
            console.log("error", error);
        });
    }
};
</script>

<style lang="scss" scoped>
</style>