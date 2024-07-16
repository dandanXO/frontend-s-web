<template>
    <div class="light-bg form-field" v-if="props.type === 'phone'">
        <img class="form-field-icon" src="@/assets/home/auth/phone-icon.png" />
        <el-form-item tabindex="2" :label="$t('personal.mobileNo')" prop="phone">
            <el-row :gutter="10" style="justify-content: center; align-items: center">
                <el-col :span="14">
                    <el-input v-model="props.form.phone":label="$t('personal.mobileNo')" :placeholder="$t('personal.mobileNo')" />
                </el-col>
                <el-col :span="10">
                    <el-button :disabled="!props.form.phone || loginCountdown !== 0" @click="openCaptchaForm"
                        size="small" color="#3bafda" style="width:100%;min-height:30px; font-size:12px;" :class="`blue-bg ${!props.form.phone || loginCountdown !== 0 ? 'disabled' : ''}`">
                        {{ loginCountdown === 0 ? `${$t('personal.getVerificationCode')}` : `${loginCountdown + $t('personal.countDown')}` }}
                    </el-button>
                </el-col>
            </el-row>
        </el-form-item>
    </div>
    <div class="light-bg form-field" v-else>
        <img class="form-field-icon" src="@/assets/home/auth/email-icon.png" />
        <el-form-item tabindex="2" :label="$t('personal.email')" prop="email">
            <el-row :gutter="10" style="justify-content: center; align-items: center">
                <el-col :span="14">
                    <el-input v-model="props.form.email" :label="$t('personal.email')" :placeholder="$t('personal.email')" />
                </el-col>
                <el-col :span="10">
                    <el-button :disabled="!props.form.email || loginCountdown !== 0" @click="openCaptchaForm"
                        size="small" color="#3bafda" style="width:100%;min-height:30px; font-size:12px;" :class="`blue-bg ${!props.form.email || loginCountdown !== 0 ? 'disabled' : ''}`">
                        {{ loginCountdown === 0 ? `${$t('personal.getVerificationCode')}` : `${loginCountdown + $t('personal.countDown')}` }}
                    </el-button>
                </el-col>
            </el-row>
        </el-form-item>
    </div>

    <el-dialog v-model="captchaDialogVisible" :title="$t('personal.captcha')" width="50%" align-center style="max-width: 500px"
        :close-on-click-modal="false" @keydown.enter.prevent>
        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
            <el-form-item tabindex="3" :label="$t('personal.captcha')" prop="captchaCode">
                <div style="display:flex;width:100%;">
                    <el-input v-model="props.form.captchaCode" :label="$t('personal.captcha')" :placeholder="$t('personal.captcha')"
                        @keyup.enter="props.onClickConfirm" />
                    <img style="width:150px;" :src="verificationImg" @click="getCode" />
                </div>
            </el-form-item>
        </div>

        <el-button size="large" class="blue-bg primary-btn" @click="props.onClickConfirm">
            {{ $t(('common.send'))}}
        </el-button>
    </el-dialog>
</template>
  
<script setup>
import { ref, defineExpose } from 'vue';
import { getVerificationCode } from "@/api/index/login";
import { ElMessage } from "element-plus";

const props = defineProps(['type', 'form', 'onClickConfirm']);

const loginCountdown = ref(0);
const captchaDialogVisible = ref(false);
const verificationImg = ref("");

const closeDialog = () => {
    captchaDialogVisible.value = false;
}

const getCode = () => {
    props.form.captchaCode = '';

    getVerificationCode().then((res) => {
        if (res.code === 0) {
            verificationImg.value = "data:image/png;base64," + res.data.img;
            props.form.codeId = res.data.id;
        } else {
            ElMessage.error({
            type: "error",
            message: res.message
          });
        }
    })
};

const initCountdownTimer = () => {
    loginCountdown.value = 60;
    countdownTimer();
}

const countdownTimer = () => {
    if (loginCountdown.value > 0) {
        setTimeout(() => {
            loginCountdown.value -= 1
            countdownTimer()
        }, 1000)
    }
}

const openCaptchaForm = () => {
    props.form.captchaCode = "";
    captchaDialogVisible.value = true;
    getCode();
};

defineExpose({
    closeDialog,
    initCountdownTimer,
    getCode
});
</script>

<style scoped lang="scss">
.light-bg {
    font-size: 14px;
  background-color: #f7f8fb;
  border-radius: 15px;
    box-shadow: 0px -1.7px 6.09px 0px #a2bff4 inset;
}

.form-field {
    display: grid;
    grid-template-columns: 40px 1fr;
    padding: 8px 15px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    width: 100%;

    margin-top: 40px;
    .form-field-icon {
        margin: auto;
    height: 30px;
    }
}

.blue-bg {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
    color: #fff;
    font-size: 14px;
    border-radius: 30px;

    &.disabled {
        filter: grayscale(1);
    }
}

.primary-btn {
    margin-top: 20px;
    width: 100%;
}
</style>

<style lang="scss">
.form-field {
    margin: 15px 0px;

    .el-form-item {
        margin-bottom: 0px;
    }

    .el-form-item__label {
        justify-content: flex-start;
    }

    .el-input__wrapper {
        box-shadow: none;
        background: none;
    }

    .el-form-item.is-error {
        margin-bottom: 15px;
    }
}
</style>
  