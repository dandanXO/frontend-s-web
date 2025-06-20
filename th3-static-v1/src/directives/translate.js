export const translateRecord = (rec, type = "") => {
  if (rec === "WITHDRAW_FAIL") {
    return "提款失败"; // Fail Withdrawal
  } else if (rec === "WITHDRAW") {
    if (type === "transfer" || type === "moneyChange") {
      return "转出";
    }
    return "提款"; // Withdraw
  } else if (rec === "DEPOSIT") {
    if (type === "transfer" || type === "moneyChange") {
      return "转账";
    }
    return "存款"; // 存款
  } else if (rec === "PROMO") {
    return "优惠"; // 优惠
  } else if (rec === "APPLY") {
    return "申请中"; //Applying
  } else if (rec === "FAIL") {
    return "失败"; // Failed
  } else if (rec === "SUCCESS") {
    return "成功"; // Success
  } else if (rec === "STEP_1") {
    return "审核中"; //Under review
  } else if (rec === "STEP_2") {
    return "待支付"; // To be paid
  } else if (rec === "STEP_3") {
    return "支付中"; // Payment on going
  } else if (rec === "STEP_4") {
    return "自动支付"; // Automatic Payment
  } else if (rec === "STEP_5") {
    return "暂不处理"; // Suspend
  } else if (rec === "AUTOPAY") {
    return "自动支付"; // Automatic Payment
  } else if (rec === "BANK") {
    return "VIP转卡"; // VIP转卡
  } else if (rec === "USDTERC") {
    return "USDT ERC"; // USDT ERC
  } else if (rec === "USDTTRC") {
    return "USDT TRC"; // USDT TRC
  } else if (rec === "OFFLINE") {
    return "线下转卡"; // 线下转卡
  } else if (rec === "UNION") {
    return "银联快捷"; // 银联快捷
  } else if (rec === "QUICKPAYMENT") {
    return "小额转卡"; // 小额转卡
  } else if (rec === "SPECIALPAY") {
    return "网银转账"; // 网银转账
  } else if (rec === "ALIPAY") {
    return "支付宝转卡"; // 支付宝转卡
  } else if (rec === "ALIPAYCODE") {
    return "支付宝"; // 支付宝
  } else if (rec === "WECHATCODE") {
    return "微信支付"; // 微信支付
  } else if (rec === "QQCODE") {
    return "QQ支付"; // QQ支付
  } else if (rec === "KDPAY") {
    return "K豆"; // K豆
  } else if (rec === "DDPAY") {
    return "钉钉"; // 钉钉
  } else if (rec === "HBPAY") {
    return "和包"; // 和包
  } else if (rec === "SZPAY") {
    return "数字人民币"; // 数字人民币
  } else if (rec === "CARDPAY") {
    return "点卡支付"; // 点卡支付
  } else if (rec === "ONLINECODE") {
    return "云闪付"; // 云闪付
  } else if (rec === "DYPAY") {
    return "抖音"; // 抖音
  } else if (rec === "AUTOPAY") {
    return "自动支付"; // 自动支付
  } else if (rec === "PENDING") {
    return "支付中"; // Pending
  } else if (rec === "SUCCESS") {
    return "成功"; // Success
  } else if (rec === "SUPPLEMENT_SUCCESS") {
    return "成功"; // Supplement Success
  } else if (rec === "CLOSED") {
    return "关闭"; // Closed
  } else if (rec === "WAITING_CALLBACK") {
    return "自动支付中"; // Waiting Callback
  } else if (rec === 1) {
    if (type == "reminder") {
      return "进行中";
    }
    return "存款"; // 存款
  } else if (rec === 2) {
    if (type == "reminder") {
      return "完成";
    }
    return "提款"; // 提款
  } else if (rec === "BET") {
    return "投注"; // BET
  } else if (rec === "SETTLE") {
    return "结算"; // SETTLE
  } else if (rec === "BET_N_SETTLE") {
    return "投注并结算"; // BET_N_SETTLE
  } else if (rec === "CANCEL") {
    return "取消"; // CANCEL
  } else if (rec === "PATCH") {
    return "修补"; // PATCH
  } else if (rec === "SLOT") {
    return "老虎机"; // Slot
  } else if (rec === "LIVE") {
    return "真人"; // Live
  } else if (rec === "FISH") {
    return "捕鱼"; // Fish
  } else if (rec === "SPORT") {
    return "体育"; // Sport
  } else if (rec === "ESPORT") {
    return "电竞"; // E-Sport
  } else if (rec === "POKER") {
    return "棋牌"; // Poker
  } else if (rec === "LOTTERY") {
    return "彩票"; // Lottery
  } else if (rec === null) {
    return "-"; // null
  } else if (rec === "TRANSFER") {
    return "转账"; // TRANSFER
  } else if (rec === "ADJUST") {
    return "金额调整"; // ADJUST
  } else if (rec === "MGP") {
    return "MG"; // AG
  } else if (rec === "AG") {
    return "AG真人"; // AG
  } else if (rec === "BBINDY") {
    return "BBIN真人"; // BBINDY
  } else if (rec === "EBET") {
    return "WE真人"; // EBET
  } else if (rec === "KY") {
    return "开元棋牌"; // KY
  } else if (rec === "DT") {
    return "大唐棋牌"; // DT
  } else if (rec === "TCG") {
    return "TCG彩票"; // TCG
  } else if (rec === "SGWin") {
    return "双赢彩票"; // SGWin
  } else if (rec === "PTDY") {
    return "PT电子"; // PTDY
  } else if (rec === "PGDY") {
    return "PG电子"; // PGDY
  } else {
    return rec;
  }
};
