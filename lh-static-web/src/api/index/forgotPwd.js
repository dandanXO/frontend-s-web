import { server } from "@/utils/request";

// 邮箱找回账户
export function sendForgetPasswordEmail(params) {
    return server.REST.post("/otp/sendForgetPasswordEmail", params);
}

export function verifyForgetPasswordEmail(results) {
    return server.REST.post("/otp/verifyForgetPasswordEmail", results);
}

// 手机找回密码
export function sendForgetPasswordPhone(params) {
    return server.REST.post("/otp/sendForgetPasswordPhone", params);
}

export function verifyForgetPasswordPhone(results) {
    return server.REST.post("/otp/verifyForgetPasswordPhone", results);
}


// 邮箱找回密码
export function findAccount(results) {
    return server.REST.post("/otp/findAccount", results);
}