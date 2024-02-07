<template>
    <el-form ref="registerRef" :rules="regRules" :model="regForm" label-width="70" size="large">
        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/name-icon.png" />
            <el-form-item label="姓名" prop="realName">
                <el-input class="wTip" v-model="regForm.realName" placeholder="输入姓名" :rules="[
                    { required: true, message: '姓名必须与提款银行卡账号姓名一致' },
                    {
                        pattern: '^([\u4e00-\u9fa5]*)$',
                        message: '请输入中文字符',
                        trigger: 'change'
                    }
                ]" clearable>
                    <template #append></template>
                </el-input>
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
            <el-form-item label="用户名" prop="loginName">
                <el-input class="wTip" v-model="regForm.loginName" placeholder="请输入6-11位非汉字字符" clearable>
                    <template #append></template>
                </el-input>
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
            <el-form-item label="密码" prop="password">
                <el-input class="wTip" v-model="regForm.password" placeholder="请输入6-11位字母/数字组合" type="password" show-password clearable>
                    <template #append></template>
                </el-input>
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
            <el-form-item label="确认密码" prop="confirmPwd">
                <el-input class="half wTip" v-model="regForm.confirmPwd" placeholder="请确认密码" type="password" show-password clearable>
                    <template #append></template>
                </el-input>
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/referral-icon.png" />
            <el-form-item label="推荐码" prop="codeAffiliate">
                <el-input v-if="!hasAffiliate" class="half" v-model="regForm.codeAffiliate"
                    placeholder="如果没有 无需填写" clearable />
                <el-input v-else class="half" v-model="regForm.codeAffiliate" placeholder="如果没有 无需填写" readonly
                    disabled clearable />
            </el-form-item>
        </div>

        <div class="light-bg form-field">
            <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
            <el-form-item label="验证码" prop="captchaCode">
                <div style="display:flex;width:100%;">
                    <el-input v-model="regForm.captchaCode" label="验证码" placeholder="请输入验证码" clearable />
                    <img style="width:90px;" :src="verificationImg" @click="getCode" />
                </div>
            </el-form-item>
        </div>

    </el-form>
    <!-- <div>
        <el-button class="blue-bg primary-btn" size="large" @click="resetRegForm(registerRef)">重新填写</el-button>
    </div> -->
    <div>
        <el-button class="blue-bg primary-btn" size="large" @click="submitRegisterForm(registerRef)">注册</el-button>
    </div>

    <div style="text-align: center;margin-top: 20px;">已有账号？<router-link to="/login">去登录</router-link></div>
</template>
  
<script setup>
import { ref, onMounted, reactive } from "vue";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { lsGet } from '@/utils/utils'
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { ElMessage } from "element-plus";
import { getVerificationCode, register } from "@/api/index/login";

const store = userStore();
const registerTelephoneKey = `registerTelephoneKey`
let cachedTelephone = lsGet(registerTelephoneKey);
const router = useRouter();
const route = useRoute();

const resetRegForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

function charType(num) {
    if (num >= 48 && num <= 57) {
        return 1;
    }
    if (num >= 97 && num <= 122) {
        return 2;
    }
    if (num >= 65 && num <= 90) {
        return 4;
    }
    return 8;
}

const checkName = (v) => {
    const alphanumeric = /^[\p{L}\p{N}]*$/u;
    return v.match(alphanumeric);
};

const checkRealName = (v) => {
    // const alphanumeric = /^[\p{L}\p{N}]*$/u;
    const chineseCharOnly = /^([\u4e00-\u9fa5]*)$/u;
    return v.match(chineseCharOnly);
};

let validateName = async (r, v) => {
    if (v === "") {
        return Promise.reject("请输入登录名");
    } else if (!checkName(v)) {
        return Promise.reject("不允许使用特殊字符");
    } else {
        return Promise.resolve();
    }
};

let validatePhoneNumber = async (r, v) => {
    var reg = /^\d+$/;
    if (v === '') {
        return Promise.reject('请验证您的电话号码');
    } else if (!reg.test(v)) {
        return Promise.reject('电话号码只允许使用数字');
    } else {
        return Promise.resolve();
    }
};

let validateRealName = async (r, v) => {
    if (v === "") {
        return Promise.reject("请输入登姓名");
    } else if (!checkRealName(v)) {
        return Promise.reject("请输入中文字符");
    } else {
        return Promise.resolve();
    }
};

let validatePassStrength = (r, v) => {
    var strength = "";
    var pwd = v;
    var result = 0;
    for (var i = 0, len = pwd.length; i < len; ++i) {
        result |= charType(pwd.charCodeAt(i));
    }

    var level = 0;
    for (i = 0; i <= 4; i++) {
        if (result & 1) {
            level++;
        }
        result = result >>> 1;
    }

    if (pwd.length >= 6) {
    } else {
        return Promise.resolve();
    }
};

let validatePass2 = async (r, v) => {
    if (v === "") {
        return Promise.reject("请重新输入密码");
    } else if (v !== regForm.password) {
        return Promise.reject("密码不同");
    } else {
        return Promise.resolve();
    }
};

let validatePass = async (r, v) => {
    if (v === "") {
        return Promise.reject('请输入密码');
    } else {
        return validatePassStrength(r, v);
    }
};

const regRules = {

    realName: [
        {
            required: false,
            min: 2,
            max: 12,
            message: "长度应为 2 至 12",
            trigger: "blur",
        },
        {
            validator: validateRealName,
            trigger: "change",
        },
    ],
    loginName: [
        {
            min: 6,
            max: 12,
            message: "长度应为 6 至 12",
            trigger: "blur",
        },
        {
            validator: validateName,
            trigger: "change",
        },
    ],
    password: [
        {
            validator: validatePass,
            trigger: "change",
        },
    ],
    confirmPwd: [
        {
            validator: validatePass2,
            trigger: "change",
        },
    ],
    telephone: [
        {
            validator: validatePhoneNumber,
            trigger: "change",
        },
    ],
    smsCode: [
        {
            required: true,
            message: "请输入手机验证码",
            trigger: "blur"
        },
        {
            min: 6,
            max: 6,
            message: "长度应为 6",
            trigger: "blur",
        },
    ],
    email: [
        {
            required: true,
            message: "请输入您的邮箱",
            trigger: "blur",
        },
        {
            type: "email",
            message: "电子邮件地址无效",
            trigger: "blur",
        },
        {
            max: 50,
            message: "长度应小于 50",
            trigger: "blur",
        },
    ],
    captchaCode: [
        {
            required: true,
            message: "需要验证码",
            trigger: "blur",
        },
        {
            min: 4,
            max: 4,
            message: "长度应为 4",
            trigger: "change",
        },
    ],
};

const getCode = () => {
    regForm.captchaCode = '';
    getVerificationCode().then((res) => {
        if (res.code === 0) {
            verificationImg.value = "data:image/png;base64," + res.data.img;
            regForm.codeId = res.data.id;
        }
    })
};
const verificationImg = ref("");

const submitRegisterForm = async (elForm) => {
    if (!elForm) return
    await elForm.validate((valid) => {
        if (valid) {
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
                regForm.sid = sidParam;
                register(regForm)
                    .then((response) => {
                        const regResult = response.code;
                        if (regResult === 0) {
                            ElMessage({
                                type: 'success',
                                message: '注册成功'
                            });
                            store.autoLogin(response.data);

                            sessionStorage.removeItem("REFERRAL_CODE");

                            if (store.token) {
                                router.push("/home");
                            }
                        } else {
                            getCode();
                        }
                    }).catch((err) => {
                        console.log(err.message);
                        getCode();
                    })
            })();
        } else {
            getCode();
        }
    })
}

const regForm = reactive({
    realName: "",
    loginName: "",
    password: "",
    confirmPwd: "",
    telephone: cachedTelephone ?? '',
    email: "",
    captchaCode: "",
    regHost: location.hostname,
    codeId: "",
    codeAffiliate: "",
    smsCode: "",
    smsCodeId: ""
});

const registerRef = ref([])


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
  