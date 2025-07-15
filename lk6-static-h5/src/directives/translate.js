import i18n from "src/i18n";

export const translateRecord = (rec, type = "") => {
  const { t } = i18n.global;

  if (rec === "VIP_REBATE" || type === "VIP_REBATE") {
    return t("record.field.vipRebate");
  } else if (rec === "WITHDRAW_FAIL") {
    return t("record.field.withdrawFail"); // Fail Withdrawal
  } else if (rec === "WITHDRAW") {
    if (type === "transfer" || type === "moneyChange") {
      return t("record.field.withdrawTransfer"); // Withdraw Transfer
    }
    return t("record.field.withdraw"); // Withdraw
  } else if (rec === "DEPOSIT") {
    if (type === "transfer") {
      return t("record.field.depositTransfer"); // Deposit Transfer
    } else if (type === "moneyChange") {
      return t("record.field.depositMoneyChange"); // Deposit Money Change
    }
    return t("record.field.deposit"); // 存款
  } else if (rec === "PROMO") {
    return t("record.field.promo"); // 优惠
  } else if (rec === "APPLY") {
    return t("record.field.apply"); //Applying
  } else if (rec === "FAIL") {
    return t("record.field.fail"); // Failed
  } else if (rec === "SUCCESS") {
    return t("record.field.success"); // Success
  } else if (rec === "STEP_1") {
    return t("record.field.step1"); //Under review
  } else if (rec === "STEP_2") {
    return t("record.field.step2"); // To be paid
  } else if (rec === "STEP_3") {
    return t("record.field.step3"); // Payment on going
  } else if (rec === "STEP_4") {
    return t("record.field.step4"); // Automatic Payment
  } else if (rec === "STEP_5") {
    return t("record.field.step5"); // Suspend
  } else if (rec === "AUTOPAY") {
    return t("record.field.autoPay"); // Automatic Payment
  } else if (rec === "BANK") {
    return t("record.field.bank"); // VIP 转卡
  } else if (rec === "USDTERC") {
    return t("record.field.usdtErc"); // USDT ERC
  } else if (rec === "USDTTRC") {
    return t("record.field.usdtTrc"); // USDT TRC
  } else if (rec === "OFFLINE") {
    return t("record.field.offline"); // 线下转卡
  } else if (rec === "UNION") {
    return t("record.field.union"); // 银联快捷
  } else if (rec === "QUICKPAYMENT") {
    return t("record.field.quickPayment"); // 小额转卡
  } else if (rec === "SPECIALPAY") {
    return t("record.field.specialPayment"); // 网银转账
  } else if (rec === "ALIPAY") {
    return t("record.field.alipay"); // 支付宝转卡
  } else if (rec === "ALIPAYCODE") {
    return t("record.field.alipayCode"); // 支付宝
  } else if (rec === "WECHATCODE") {
    return t("record.field.wechatCode"); // 微信支付
  } else if (rec === "QQCODE") {
    return t("record.field.qqCode"); // QQ 支付
  } else if (rec === "KDPAY") {
    return t("record.field.kdPay"); // K 豆
  } else if (rec === "BLBPAY") {
    return t("record.field.blbPay"); // 808 钱包
  } else if (rec === "DDPAY") {
    return t("record.field.ddPay"); // 钉钉
  } else if (rec === "HBPAY") {
    return t("record.field.hbPay"); // 和包
  } else if (rec === "SZPAY") {
    return t("record.field.szPay"); // 数字人民币
  } else if (rec === "CARDPAY") {
    return t("record.field.cardPay"); // 点卡支付
  } else if (rec === "ONLINECODE") {
    return t("record.field.onlineCode"); // 云闪付
  } else if (rec === "DYPAY") {
    return t("record.field.dyPay"); // 抖音
  } else if (rec === "AUTOPAY") {
    return t("record.field.autoPay"); // 自动支付
  } else if (rec === "PENDING") {
    return t("record.field.pending"); // Pending
  } else if (rec === "SUCCESS") {
    return t("record.field.success"); // Success
  } else if (rec === "SUPPLEMENT_SUCCESS") {
    return t("record.field.supplementSuccess"); // Supplement Success
  } else if (rec === "CLOSED") {
    return t("record.field.closed"); // Closed
  } else if (rec === "WAITING_CALLBACK") {
    return t("record.field.waitingCallback"); // Waiting Callback
  } else if (rec === "SETTLED") {
    return t("record.field.settled"); // Settled
  } else if (rec === 1) {
    if (type == "reminder") {
      return t("record.field.rec1Reminder");
    }
    return t("record.field.rec1"); // 存款
  } else if (rec === 2) {
    if (type == "reminder") {
      return t("record.field.rec2Reminder");
    }
    return t("record.field.rec2"); // 提款
  } else if (rec === "BET") {
    return t("record.field.bet"); // BET
  } else if (rec === "SETTLE") {
    return t("record.field.settle"); // SETTLE
  } else if (rec === "BET_N_SETTLE") {
    return t("record.field.betNSettle"); // BET_N_SETTLE
  } else if (rec === "CANCEL") {
    return t("record.field.cancel"); // CANCEL
  } else if (rec === "PATCH") {
    return t("record.field.patch"); // PATCH
  } else if (rec === "SLOT") {
    return t("common.gameType.slot"); // Slot
  } else if (rec === "LIVE") {
    return t("common.gameType.live"); // Live
  } else if (rec === "FISH") {
    return t("common.gameType.fish"); // Fish
  } else if (rec === "SPORT") {
    return t("common.gameType.sport"); // Sport
  } else if (rec === "ESPORT") {
    return t("common.gameType.esport"); // E-Sport
  } else if (rec === "POKER") {
    return t("common.gameType.poker"); // Poker
  } else if (rec === "LOTTERY") {
    return t("common.gameType.lottery"); // Lottery
  } else if (rec === null) {
    return "-"; // null
  } else if (rec === "TRANSFER") {
    return t("record.field.transfer"); // TRANSFER
  } else if (rec === "ADJUST") {
    return t("record.field.adjust"); // ADJUST
  } else if (rec === "MGP") {
    return "MG"; // AG
  } else if (rec === "PMLIVE") {
    return "PM 真人"; // BET
  } else if (rec === "AG") {
    if (type == "SLOT") {
      return "PA 电子";
    }
    return "PA 真人"; // AG
  } else if (rec === "AGF") {
    return "PA 捕鱼"; // AG
  } else if (rec === "PMFISH") {
    return "DB 捕鱼"; // PM
  } else if (rec === "BBINDY") {
    return "BBIN 真人"; // BBINDY
  } else if (rec === "KY") {
    return "开元棋牌"; // KY
  } else if (rec === "KYDY") {
    return "开元棋牌"; // KY
  } else if (rec === "LEG") {
    return "乐游棋牌"; // DT
  } else if (rec === "DT") {
    return "大唐棋牌"; // DT
  } else if (rec === "TCG") {
    return "TCG 彩票"; // TCG
  } else if (rec === "SGWin") {
    return "双赢彩票"; // SGWin
  } else if (rec === "PT") {
    return "PT 电子"; // PTDY
  } else if (rec === "PG") {
    return "PG 电子"; // PGDY
  } else {
    return rec;
  }
};
