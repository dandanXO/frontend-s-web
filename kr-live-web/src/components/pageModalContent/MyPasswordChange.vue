<template>
    <div class="page-container">
        <div class="form-wrapper">
            <form class="update-pwd-form form-template">
                <div class="form-item">
                    <label>{{ $t('lang.password_existing_password') }}</label>
                    <q-input dense ref="oldPasswordRef" type="password" outlined v-model="updatePwdInfo.oldPassword"
                        :loading="isSubmitting" :disable="isSubmitting" clearable :rules="[
                            (val) =>
                                (val && val.length >= 6) ||
                                $t('lang.password_at_least_6_character')
                        ]" />
                </div>

                <div class="form-item">
                    <label>{{ $t('lang.password_new_password') }}</label>
                    <q-input dense ref="passwordRef" type="password" outlined v-model="updatePwdInfo.password" :rules="[
                        (val) =>
                            (val && val.length >= 6) ||
                            $t('lang.password_at_least_6_character')
                    ]" clearable :loading="isSubmitting" :disable="isSubmitting" />
                </div>

                <div class="form-item">
                    <label>{{ $t('lang.password_confirm_new_password') }}</label>
                    <q-input dense ref="confirmRef" type="password" outlined v-model="updatePwdInfo.confirm_pass"
                        :rules="[
                            (val) =>
                                (val && val.length >= 6) ||
                                $t('lang.password_at_least_6_character'),
                            (val) =>
                                val === updatePwdInfo.password || $t('lang.password_password_mismatch')
                        ]" clearable :loading="isSubmitting" :disable="isSubmitting" />
                </div>
            </form>
        </div>

        <div class="action-buttons">
            <q-btn class="primary-button blue" @click="submitUpdatePwd" :label="$t('lang.password_change_password')"
                :disable="isSubmitting" :loading="isSubmitting" />
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
import { successNotify } from "src/boot/utils";

const qs = require("qs");

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const store = userStore();
const oldPasswordRef = ref();
const passwordRef = ref();
const confirmRef = ref();

const isSubmitting = ref(false);

const updatePwdInfo = reactive({
    oldPassword: "",
    password: "",
    confirm_pass: ""
});

const submitUpdatePwd = () => {
    oldPasswordRef.value.validate();
    passwordRef.value.validate();
    confirmRef.value.validate();

    if (oldPasswordRef.value.hasError || passwordRef.value.hasError || confirmRef.value.hasError) {
    } else {
        isSubmitting.value = true;
        api.post("/session/password", qs.stringify({
            oldPassword: updatePwdInfo.oldPassword,
            password: updatePwdInfo.password
        })).then((res) => {
            const response = res.data
            if (response.code === 0) {
                successNotify(t('lang.password_updated'));

                router.push('/');
                store.memberLogout();
            } else {

            }

            isSubmitting.value = false;
        }).catch((error) => {
            console.log("error", error);
            isSubmitting.value = false;
        });
    }
};
</script>

<style lang="scss" scoped>
.form-wrapper {
    padding: 20px;
}
</style>