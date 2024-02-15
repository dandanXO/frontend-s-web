<template>
    <el-form ref="forgotPwdFormRef" :rules="loginRules" :model="forgotPwdForm" label-width="90" size="large">
        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/phone-username-icon.png" />
            <el-form-item label="手机号" prop="phoneNumber">
                <el-input v-model="forgotPwdForm.phoneNumber" placeholder="输入手机号" />
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
            <el-form-item label="验证码" prop="captchaCode">
                <div style="display:flex;width:100%;">
                    <el-input v-model="forgotPwdForm.captchaCode" label="验证码" placeholder="验证码" @keyup.enter="submitForm">
                    </el-input>
                    <img style="width:90px;" :src="verificationImg" @click="getCode" />
                </div>
            </el-form-item>
        </div>

        <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="submitForm">
            提交
        </el-button>
    </el-form>

    <div style="text-align: center;margin-top: 20px;"><router-link to="/login">返回登入页面</router-link></div>
</template>
  
<script setup>
import { ref, onMounted, reactive } from "vue";
import { getVerificationCode } from "@/api/index/login";

const loginRules = {
    phoneNumber: [
        {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
        }
    ],
    captchaCode: [
        {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
        },
        {
            min: 4,
            max: 4,
            message: "长度为 4",
            trigger: "blur"
        }
    ]
};

const forgotPwdForm = reactive({
    phoneNumber: '',
    captchaCode: ''
})

const forgotPwdFormRef = ref([]);
const loadingBtn = ref(false);

const submitForm = () => {
    loadingBtn.value = true
    
    forgotPwdFormRef.value.validate().then(() => {
        // call api
    }).catch((err) => {
        console.log(err);
        getCode();
    }).finally(() => {
        loadingBtn.value = false
    });
        

};

const getCode = () => {
    forgotPwdForm.captchaCode = '';

    getVerificationCode().then((res) => {
        if (res.code === 0) {
            verificationImg.value = "data:image/png;base64," + res.data.img;
            forgotPwdForm.codeId = res.data.id;
        }
    })
};
const verificationImg = ref("");

onMounted(() => {
    getCode();
});
</script>

<style scoped lang="scss">
.light-bg {
    font-size: 14px;
    border-radius: 30px;
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

    .form-field-icon {
        margin: auto;
    }
}

.blue-bg {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
    color: #fff;
    font-size: 14px;
    border-radius: 30px;
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
  