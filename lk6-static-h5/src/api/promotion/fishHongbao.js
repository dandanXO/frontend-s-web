import { api, eventapi } from "boot/axios";
export function getHongbaoInfo() {
  return eventapi.get("/fish-red-packet/todayStatus");
}

export function getHongbaoMoney() {
    return eventapi.post("/fish-red-packet/draw")
}



