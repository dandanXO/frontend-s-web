<template>
    <el-form ref="loginRef" :rules="loginRules" :model="loginForm" label-width="70" size="large">
        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
            <el-form-item label="用户名" prop="loginName">
                <el-input v-model="loginForm.loginName" placeholder="输入用户名" />
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" placeholder="输入密码" type="password" show-password />
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
            <el-form-item label="验证码" prop="captchaCode">
                <div style="display:flex;width:100%;">
                    <el-input v-model="loginForm.captchaCode" label="验证码" placeholder="验证码" @keyup.enter="submitLogin">
                    </el-input>
                    <img style="width:90px;" :src="verificationImg" @click="getCode" />
                </div>
            </el-form-item>
        </div>

        <div class="agreement-and-forget-pass">
            <div>登录即代表同意并遵守《用户协议》</div><div><router-link to="/forgotPwd">忘记密码？</router-link></div>
        </div>


        <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="submitLogin">
            登录
        </el-button>
    </el-form>

    <div style="text-align: center;margin-top: 20px;">没有账号？<router-link to="/register">去注册</router-link></div>
</template>
  
<script setup>
import { ref, onMounted, reactive } from "vue";
import { getVerificationCode } from "@/api/index/login";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";

const loginRules = {
    loginName: [
        {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
        },
        {
            min: 6,
            max: 12,
            message: "长度要在 6-12 之间",
            trigger: "blur"
        }
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
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

const loginForm = reactive({
    loginName: '',
    password: '',
    captchaCode: ''
})

const loginRef = ref([]);
const store = userStore();
const loadingBtn = ref(false);
const router = useRouter();
const route = useRoute();

const submitLogin = () => {
    loadingBtn.value = true
    const fpPromise = FingerprintJS.load();
    (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = { value: ["timezone", "timeZoneOffset"] };
        const allComponents = { ...result.components };
        excludes.value.forEach((element) => {
            delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);

        loginRef.value.validate().then(() => {
            store
                .memberLogin({
                    loginName: loginForm.loginName,
                    password: loginForm.password,
                    sid: sidParam,
                    captchaCode: loginForm.captchaCode,
                    codeId: loginForm.codeId,
                })
                .then(() => {
                    const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
                    if (store.token) {
                        router.push(jumpUrl);

                        sessionStorage.removeItem("REFERRAL_CODE");
                        loginForm.loginName = null
                        loginForm.password = null
                        loginForm.captchaCode = null
                    } else {
                        getCode();
                    }
                }).catch((error) => {
                    console.log(error.message);
                    getCode();
                });
        }).catch(() => {
            
        });
        loadingBtn.value = false
    })();
};

const getCode = () => {
    loginForm.captchaCode = '';

    getVerificationCode().then((res) => {
        if (res.code === 0) {
            verificationImg.value = "data:image/png;base64," + res.data.img;
            loginForm.codeId = res.data.id;
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

.agreement-and-forget-pass {
    display: flex;
    justify-content: space-between;

    .highlight {
        color: #5E8AEE;
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
  