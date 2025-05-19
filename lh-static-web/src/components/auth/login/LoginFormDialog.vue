<template>
    <el-form class="login-form-dialog-form" ref="loginRef" :rules="loginRules" :model="loginForm" label-width="70"
        size="large">
        <div class="login-form-field">
            <img class="login-form-field-icon"
                :src="isDark ? require('@/assets/home/auth/username-icon-dark.png') : require('@/assets/home/auth/username-icon.png')" />

            <el-form-item label="用户名" prop="loginName">
                <el-input v-model="loginForm.loginName" placeholder="请输入6-12位非汉字字符" clearable :disabled="isLoading" />
            </el-form-item>
        </div>

        <div class="login-form-field">
            <img class="login-form-field-icon"
                :src="isDark ? require('@/assets/home/auth/password-icon-dark.png') : require('@/assets/home/auth/password-icon.png')" />

            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" placeholder="请输入6-12位字母/数字组合" type="password" show-password
                    clearable :disabled="isLoading" />
            </el-form-item>
        </div>

        <div class="login-form-field geetest-captcha-form-field">
            <img class="login-form-field-icon"
                :src="isDark ? require('@/assets/home/auth/verification-icon-dark.png') : require('@/assets/home/auth/verification-icon.png')" />

            <div class="geetest-captcha-wrapper">
                <div class="geetest-captcha-label">
                    <span class="asterisk">*</span>
                    <span class="label-text">验证码</span>
                </div>
                <div id="captchaContainer"></div>
            </div>
        </div>

        <div class="agreement-and-forget-pwd">
            <div class="agreement-text">登录即代表同意并遵守<span class="underline">《用户协议》</span></div>
            <div><a class="forget-pwd-text" @click="openForgotpwdDialog">忘记密码</a></div>
        </div>

        <el-button :loading="isLoading" size="large" class="login-form-submit-btn" @click="submitLogin">登录</el-button>

        <div class="register-hint">
            <span class="no-acc">没有账号？</span>
            <a class="go-reg" @click="openRegDialog">去注册</a>
        </div>
    </el-form>
</template>

<script setup>
import { reactive, ref, onMounted, defineEmits } from "vue";
import { useDark } from "@vueuse/core";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";

const props = defineProps(["pageType"]);

const isDark = useDark();
const loginRef = ref();
const store = userStore();
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const notify = useNotify();
const loginForm = reactive({
    loginName: "",
    password: "",
    captchaCode: ""
});

const message = ref("Loading Geetest...");

// Dynamically load the Geetest script
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// Initialize Geetest with configuration
const initGeetest = (config) => {
    console.log(config)
    window.initGeetest4(config.config, config.handler);
};

function captchaHandler(captchaObj) {
    window.captchaObj = captchaObj;
    captchaObj
        .appendTo("#captchaContainer")
        .onReady(function () {
            console.log("ready");
        })
        .onNextReady(function () {
            console.log("nextReady");
        })
        .onBoxShow(function () {
            isLoading.value = true;
        })
        .onError(function (e) {
            console.log(e);
        })
        .onSuccess(function () {
            let result = window.captchaObj.getValidate()
            for (let key in result) {
                loginForm[key] = result[key];
            }
            console.log(loginForm)
            isLoading.value = false;
        })
        .onClose(() => {
            isLoading.value = false;
        });
}

const emits = defineEmits(["close-dialog, open-reg-dialog, open-forgotpwd-dialog"]);

const closeLoginDialog = () => {
    emits("close-dialog");
};

const openForgotpwdDialog = () => {
    emits("open-forgotpwd-dialog");
};

const openRegDialog = () => {
  // console.log(route.path)
  if (route.path === "/login") {
    router.push("/register");
  } else {
    emits("open-reg-dialog");
  }
};

const submitLogin = () => {
    isLoading.value = true;
    (async () => {
        const sidParam = store.visitorId;
        loginRef.value
            .validate()
            .then(() => {
                if (window.captchaObj) {
                    const validate = window.captchaObj.getValidate();
                    if (!validate) {
                        notify({
                            type: "error",
                            message: "请完成验证码"
                        });
                        return;
                    }

                    store
                        .memberLogin({
                            loginName: loginForm.loginName,
                            password: loginForm.password,
                            sid: sidParam,
                            summoner: loginForm.summoner,
                            lotNumber: loginForm.lot_number,
                            captchaOutput: loginForm.captcha_output,
                            passToken: loginForm.pass_token,
                            genTime: loginForm.gen_time,
                        })
                        .then(() => {
                            const jumpUrl = route.query.redirect
                                ? route.query.redirect.toString()
                                : props.pageType === "view"
                                    ? "/"
                                    : route.path;

                            if (store.token) {
                                router.push(jumpUrl);
                                console.log('here');
                                sessionStorage.removeItem("REFERRAL_CODE");
                                sessionStorage.removeItem("SUMMON_CODE");
                                sessionStorage.setItem("POPUP", "true");
                                loginForm.loginName = null;
                                loginForm.password = null;
                                loginForm.captchaCode = null;
                                console.log('here');
                                closeLoginDialog();
                            }
                            console.log('here');
                        })
                        .catch((error) => {
                            console.log(error.message);
                        });
                }
            })
            .catch(() => { });
        isLoading.value = false;
    })();
};

const getSummonCode = () => {
    const summonCode = sessionStorage.getItem("SUMMON_CODE");
    // && route.query && route.query.refer
    if (summonCode) {
        loginForm.summoner = summonCode;
    }
};

onMounted(async () => {
    try {
        // Step 1: Load Geetest script
        await loadScript("https://static.geetest.com/v4/gt4.js");

        // Step 2: Call your backend to get Geetest configuration (fake config for demo)
        const geetestConfig = {
            config: {
                captchaId: "49cbcb1424a170f03f8c38648a1b2b31",
                language: "zh",
                nativeButton: {
                    width: '100%',
                    height: '48px',
                },
                nextWidth: '200px',
                product: 'float',
            },
            handler: captchaHandler
        };

        // Step 3: Initialize Geetest with the config
        await initGeetest(geetestConfig);
    } catch (error) {
        message.value = "Error loading Geetest!";
        console.error("Geetest loading error:", error);
    }

    getSummonCode();
});

const loginRules = {
    loginName: [
        {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
        },
        {
            min: 4,
            max: 12,
            message: "长度要在 4-12 之间",
            trigger: "blur"
        }
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur"
        },
        {
            min: 6,
            max: 12,
            message: "长度要在 6-12 之间",
            trigger: "blur"
        }
    ]
};
</script>

<style lang="scss" scoped>
.login-form-dialog-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-family: "PingFang SC";

    .login-form-field {
        display: grid;
        grid-template-columns: 40px 1fr;
        padding: 8px 15px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        position: relative;
        width: 100%;
        border: 1px solid rgba(217, 217, 217, 0.3);
        border-radius: 15px;
        font-size: 14px;
        background-color: #f7f8fb;
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;

        .login-form-field-icon {
            margin: auto;
            width: 35px;
        }

        :deep(.el-form-item) {
            margin-bottom: 0px;
        }

        :deep(.el-form-item__label) {
            justify-content: flex-start;
            color: #000;
        }

        :deep(.el-input__wrapper) {
            box-shadow: none;
            background: none;
        }

        :deep(.el-form-item.is-error) {
            margin-bottom: 15px;
        }

        &.geetest-captcha-form-field {
            padding: 0 !important;

            #captchaContainer {
                width: 100%;

                .geetest_captcha.geetest_dark .geetest_holder .geetest_content,
                .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content {
                    background-image: linear-gradient(180deg, #ecf3fd, 0%, #ecf3fd 100%) !important;
                    border-color: #424f72;
                }

                .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
                    color: #424f72;
                    font-family: 'PingFang SC' !important;
                }

                .geetest_captcha.geetest_dark.geetest_lock_success .geetest_content .geetest_tip_container .geetest_tips_wrap .geetest_tip {
                    color: #39c522 !important;
                }
            }

            .login-form-field-icon {
                padding: 0;
                margin-left: 17px;
            }

            .geetest-captcha-wrapper {
                display: flex;
                width: 100%;
                align-items: center;

                .geetest-captcha-label {
                    width: 130px;

                    .asterisk {
                        color: #e2676a;
                        margin-right: 4px;
                    }

                    .label-text {
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .login-form-submit-btn {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
        color: #fff;
        font-size: 14px;
        border-radius: 8px;

        &:hover {
            filter: brightness(1.1);
        }
    }

    .agreement-and-forget-pwd {
        display: flex;
        justify-content: space-between;

        .agreement-text {
            color: #555;
        }

        .forget-pwd-text {
            color: #1890ff;

            &:hover {
                filter: brightness(1.1);
            }
        }

        .underline {
            text-decoration: underline;
        }
    }

    .register-hint {
        display: flex;
        justify-content: flex-end;
    }
}

.dark {
    .login-form-dialog-form {
        .login-form-field {
            background-color: #273354;
            box-shadow: none;

            .login-form-field-icon {
                width: 25px;
            }

            :deep(.el-form-item__label) {
                color: #fff;
            }

            &.geetest-captcha-form-field {
                .geetest-captcha-wrapper {
                    .geetest-captcha-label {
                        width: 130px;

                        .asterisk {
                            color: #e2676a;
                            margin-right: 4px;
                        }

                        .label-text {
                            font-size: 14px;
                            color: #fff;
                        }
                    }
                }
            }
        }

        .agreement-and-forget-pwd {
            .agreement-text {
                color: #a98f7c;
            }

            .forget-pwd-text {
                color: #a98f7c;
            }
        }
    }

    .login-form-submit-btn {
        background: url("../../../assets/home/auth/login-btn-bg.svg") no-repeat center center;
        background-size: cover;
        box-shadow: none;
        border-radius: 6px;
        border: 1px solid #3A93CE;
        margin-top: 20px;
    }

    .register-hint {
        justify-content: center;

        .no-acc {
            color: #a98f7c;
        }

        .go-reg {
            color: #3A93CE;
        }
    }
}
</style>