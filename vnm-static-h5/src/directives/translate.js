import i18n from "../i18n/index";
export const translateRecord = (rec, type = "") => {
  if (rec === "WITHDRAW_FAIL") {
    if(type === "moneyChange"){
      return i18n.global.t('lang.transfer_failed');
    }
    return i18n.global.t('lang.str_withdrawfailed'); // Fail Withdrawal
  } else if (rec === "WITHDRAW") {
    if (type === "transfer") {
      return i18n.global.t('lang.str_transfer');
    }else if(type === "moneyChange"){
      return i18n.global.t('lang.str_moneychangewithdraw');
    }
    return i18n.global.t('lang.str_withdraw'); // Withdraw
  } else if (rec === "DEPOSIT") {
    if (type === "transfer") {
      return i18n.global.t('lang.str_transferin');
    }else if(type === "moneyChange"){
      return i18n.global.t('lang.str_moneychangedeposit');
    }
    return i18n.global.t('lang.str_deposit'); // 存款
  } else if (rec === "PROMO") {
    return i18n.global.t('lang.str_promo'); // 优惠
  } else if (rec === "APPLY") {
    return i18n.global.t('lang.str_applying'); ; //Applying
  } else if (rec === "FAIL") {
    return i18n.global.t('lang.str_failed');
  } else if (rec === "SUCCESS") {
    return i18n.global.t('lang.str_success');
  } else if (rec === "SENDING") {
    return i18n.global.t('lang.str_sending');
  } else if (rec === "STEP_1") {
    return i18n.global.t('lang.str_underreview');
  } else if (rec === "STEP_2") {
    return  i18n.global.t('lang.str_tobepaid');
  } else if (rec === "STEP_3") {
    return i18n.global.t('lang.str_paymentongoing');
  } else if (rec === "STEP_4") {
    return i18n.global.t('lang.str_automaticpayment');
  } else if (rec === "STEP_5") {
    return i18n.global.t('lang.str_suspend');
  } else if (rec === "AUTOPAY") {
    return i18n.global.t('lang.str_autopayment');
  } else if (rec === "BANK") {
    return i18n.global.t('lang.str_viptransfer');
  } else if (rec === "USDTERC") {
    return i18n.global.t('lang.str_usdterc'); // USDT ERC
  } else if (rec === "USDTTRC") {
    return i18n.global.t('lang.str_usdttrc'); // USDT TRC
  } else if (rec === "OFFLINE") {
    return i18n.global.t('lang.str_offlinetransfer');
  } else if (rec === "UNION") {
    return i18n.global.t('lang.str_union');
  } else if (rec === "QUICKPAYMENT") {
    return i18n.global.t('lang.str_quickpayment');
  } else if (rec === "SPECIALPAY") {
    return i18n.global.t('lang.str_specialpay');
  } else if (rec === "ALIPAY") {
    return i18n.global.t('lang.str_alipay');
  } else if (rec === "ALIPAYCODE") {
    return i18n.global.t('lang.str_alipaycode');
  } else if (rec === "WECHATCODE") {
    return i18n.global.t('lang.str_wechatpay');
  }  else if (rec === "KDPAY") {
    return i18n.global.t('lang.str_kdpay');
  }  else if (rec === "SZPAY") {
    return i18n.global.t('lang.str_szpay');
  } else if (rec === "CARDPAY") {
    return i18n.global.t('lang.str_cardpay');
  }  else if (rec === "DYPAY") {
    return i18n.global.t('lang.str_dypay');
  } else if (rec === "AUTOPAY") {
    return i18n.global.t('lang.str_autopay');
  } else if (rec === "PENDING") {
    return i18n.global.t('lang.str_pending');
  } else if (rec === "SUCCESS") {
    return i18n.global.t('lang.str_success');
  } else if (rec === "SUPPLEMENT_SUCCESS") {
    return i18n.global.t('lang.str_success'); // Supplement Success
  } else if (rec === "CLOSED") {
    return i18n.global.t('lang.str_close'); // Closed
  } else if (rec === "WAITING_CALLBACK") {
    return i18n.global.t('lang.str_waitingcallback'); // Closed
  } else if (rec === "SETTLED") {
    return i18n.global.t('lang.str_settled'); // Closed
  } else if (rec === 1) {
    if (type == "reminder") {
      return i18n.global.t('lang.str_ongoing'); // Closed
    }
    return i18n.global.t('lang.str_deposit'); // Closed
  } else if (rec === 2) {
    if (type == "reminder") {
      return i18n.global.t('lang.str_finish'); // Closed
    }
    return i18n.global.t('lang.str_withdraw'); // Closed
  } else if (rec === "BET") {
    return i18n.global.t('lang.str_bet');
  } else if (rec === "SETTLE") {
    return i18n.global.t('lang.str_settle'); // Closed
  } else if (rec === "BET_N_SETTLE") {
    return i18n.global.t('lang.str_betandsettle'); // Closed
  } else if (rec === "CANCEL") {
    return i18n.global.t('lang.str_cancel'); // Closed
  } else if (rec === "PATCH") {
    return i18n.global.t('lang.str_patch'); // Closed
  } else if (rec === "SLOT") {
    return i18n.global.t('lang.str_slot'); // Closed
  } else if (rec === "LIVE") {
    return i18n.global.t('lang.str_livecasino'); // Closed
  } else if (rec === "FISH") {
    return i18n.global.t('lang.str_fishing'); // Closed
  } else if (rec === "SPORT") {
    return i18n.global.t('lang.str_sports'); // Closed
  } else if (rec === "ESPORT") {
    return i18n.global.t('lang.str_esports'); // Closed
  } else if (rec === "POKER") {
    return i18n.global.t('lang.str_poker'); // Closed
  } else if (rec === "LOTTERY") {
    return i18n.global.t('lang.str_lottery'); // Closed
  } else if (rec === null) {
    return "-"; // null
  } else if (rec === "TRANSFER") {
    return i18n.global.t('lang.str_transfer'); // Closed
  } else if (rec === "ADJUST") {
    return i18n.global.t('lang.str_adjust'); // Closed
  } if (rec === "AG") {
    return "AG " + t('lang.livecasino') + ", XIN" + t('lang.slot'); // AG
  }else if (rec === "GPI") {
    return "GPI " + t('lang.slot') + ", GPI" + t('lang.lottery'); // AG
  }  else if (rec === "BBINDY") {
    return "BBIN"  + t('lang.livecasino');
  } else if (rec === "KP") {
    return "King Poker" ;
  } else if (rec === "KM") {
    return "King Maker";
  } else if (rec === "V8") {
    return "V8" + t('lang.poker');
  } else if (rec === "TCG") {
    return "TCG " + t('lang.lottery') ;
  }else if (rec === "LOTTO") {
    return "LOTTO " + t('lang.lottery') ;
  }else if (rec === "MGP") {
    return "MGP " + t('lang.slot') ;
  }  else if (rec === "EBET") {
    return "WE " + t('lang.livecasino');
  } else if (rec === "PT") {
    return "PT " + t('lang.slot');
  } else if (rec === "PG") {
    return "PG " + t('lang.slot');
  } else if (rec === "SW") {
    return "SW " + t('lang.slot');
  } else if (rec === "SABA") {
    return "SABA " + t('lang.sport');
  }else if(rec === 'GFSBO'){
    return "SBOBET " + t('lang.sport');
  }else if(rec === 'CMD'){
    return "CMD " + t('lang.sport');
  } else if (rec === "BG") {
    return "BG " + t('lang.livecasino');
  } else if (rec === "Evo") {
    return "Evo " + t('lang.livecasino');
  } else if (rec === "BBINDY") {
    return "BBIN " + t('lang.livecasino');
  } else if (rec === "BBIN") {
    return "BBIN " + t('lang.livecasino');
  } else if (rec === "WE") {
    return "WE " + t('lang.livecasino');
  }else if (rec === "WM") {
    return "WM " + t('lang.livecasino');
  } else if (rec === "AE") {
    return "Sexy " + t('lang.livecasino');
  } else if (rec === "PMLIVE") {
    return "DB " + t('lang.livecasino');
  }else if (rec === "TFGaming") {
    return "TFGaming " + t('lang.esport');
  } else if (rec === "WS") {
    return "WS168 " + t('lang.cockfight');
  }else if (rec === "SP") {
    return "SP " + t('lang.fishing');
  }else if (rec === "JILI") {
    return "JILI  " + t('lang.fishing');
  } else {
    return rec;
  }
};
