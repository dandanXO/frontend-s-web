import { api } from "boot/axios";

export const findAccount = requestBody => {

    const encodedData = new URLSearchParams(requestBody);

    return api.post("/otp/findAccount", encodedData)
}