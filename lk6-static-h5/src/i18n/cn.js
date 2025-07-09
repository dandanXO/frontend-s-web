export default {
  lang: {
    langVal: "zh"
  },
  common: {
    error: "错误",
    loading: "加载中...",
    noMoreData: "暂无更多数据了",
    noData: "暂无数据",
    uploadImg: "上传图片",
    notification: {
      loginRequired: {
        title: "系统提示",
        message: "请登录后操作"
      },
      copySuccess: {
        message: "{str}复制成功"
      },
      copyError: {
        message: "{str}复制失败"
      },
      tokenLogged: {
        message: "您的账户已在其他设备登录。请注意是否由本人登录，如有异常请及时修改密码。"
      },
      claimed: {
        message: "恭喜获得奖金"
      },
      uploadSuccess: {
        message: "{name} 上传成功"
      },
      uploadError: {
        message: "{name} 上传失败。请稍后再试。"
      },
      uploadFileRequired: {
        message: "请上传图片"
      }
    },
    gameType: {
      sport: "体育",
      esports: "电竞",
      slot: "电子",
      live: "真人",
      poker: "棋牌",
      fish: "捕鱼",
      lottery: "彩票",
      casual: "休闲",
      baccarat: "百家乐",
      roulette: "轮盘",
      luckyLace: "幸运蕾丝"
    }
  },
  btn: {
    cancel: "取消",
    goLogin: "去登陆",
    confirm: "确认",
    deposit: "存款",
    copy: "复制",
    reminderRequest: "催单",
    confirmFund: "确认到账",
    submit: "提交",
    clickToClaim: "点击领取"
  },
  deposit: {
    paymentWay: "支付方式",
    depositAmountInput: {
      label: "存款金额",
      placeholder: "请输入存款金额",
      error: {
        outOfRange: "存款应介于  {min} - {max}",
        required: "请输入金额",
        notNumber: "存款金额不能带有小数"
      }
    },
    depositAmountSelect: {
      placeholder: '选择金额"'
    },
    singleDeposit: "单笔存款：{min} - {max}",
    exchangeRate: "实时汇率：",
    expectedAmount: "预计到账：",
    privilege: {
      placeholder: "选择优惠",
      min: "优惠最低存款要求：{min} {currency}，",
      rolloverGameTitle: "流水倍数要求（本金 + 彩金）：",
      rolloverGame: "{game} {rollover}倍",
      rollover: "流水倍数要求（本金 + 彩金）：{rollover}倍"
    },
    notification: {
      popupBlocked: {
        message: '无法打开充值页面。请检查游览器是否拦截弹窗页面，并修改为"允许弹窗"后再进行充值操作。'
      }
    }
  },
  mail: {
    readAll: "全部已读",
    deleteAll: "全部删除",
    delete: "删除",
    read: "已读",
    sentTime: "发送时间： {time}",
    content: "正文：",
    reply: "回复：",
    selectMultiple: "选择多个",
    category: {
      activity: "活动",
      announcement: "公告",
      payment: "充提",
      notification: "通知",
      all: "全部"
    },
    notification: {
      deleteConfirm: {
        title: "温馨提示",
        message: "您确定要删除选中的邮件吗？"
      },
      readSelectedSuccess: {
        message: "读取已选择的消息"
      },
      readSuccess: {
        message: "已读消息"
      },
      readAllSuccess: {
        message: "全部消息已读"
      },
      deleteSelectedSuccess: {
        message: "删除已选择的消息"
      },
      deleteAllSuccess: {
        message: "已删除全部消息"
      }
    }
  },
  record: {
    betId: "注单号",
    serialNumber: {
      deposit: "存款编码"
    },
    notification: {
      reminderRequest: {
        title: "催单",
        content: {
          serialNumber: "存款编码",
          remark: "备注"
        }
      },
      confirmFund: {
        title: "系统提示",
        message: "确认到账"
      },
      cancelWithdraw: {
        title: "系统提示",
        message: "确认取消提款"
      },
      cancelWithdrawSuccess: {
        message: "已经取消提款"
      },
      confirmFundSuccess: {
        message: "已经确认到账"
      },
      reminderRequestLimit: {
        message: "已有3个正在催收催单。"
      },
      reminderRequestSuccess: {
        message: "催单提交成功！"
      }
    }
  },
  error: {
    101: "Platform not found",
    102: "Platform is closed",
    104: "Not a money transfer platform",
    105: "Website not found",
    400: "Request unsuccessful",
    403: "Unauthorized",
    405: "Method not allowed",
    500: "System malfunction",
    501: "Request code has been used",
    502: "Server not found",
    504: "Request too frequent",
    601: "Token validation error",
    603: "Token not found",
    608: "The current user's operations are too frequent. Please try again.",
    609: "Platform in maintenance",
    610: "Forbidden to participate game, please contact the administrator",
    604: "Logged in successfully",
    707: "Insufficient balance",
    710: "Insufficient balance",
    800: "Incorrect confirmation code",
    801: "Password captcha has expired",
    900: "Member not found",
    901: "Record not found",
    902: "Email does not match our member",
    903: "Email does not match the registered account",
    904: "Email has not been verified yet, please contact Customer Service 24/7.",
    905: "Real name not provided",
    906: "User email has not verify yet.",
    909: "Phone number not found",
    910: "Username does not match phone number",
    1000: "Login name or password error",
    1001: "Account is closed",
    1002: "Account is for affiliates",
    1004: "The account is temporarily locked due to entering the wrong password many times",
    1011: "The current account has already bound a phone number",
    1012: "The current account has already bound an email address",
    1013: "The current account has already bound a birthday",
    1014: "The current account has already bound a name",
    1015: "The current account has already bound a nickname",
    1016: "The registration function is being upgraded. Please register after 9:00 a.m. local time. Thank you!",
    1300: "Amount must be a number greater than 0",
    1301: "This card is not supported",
    1302: "This currency is not supported",
    1304: "This number has already been used",
    1305: "Bank not found",
    1306: "Exceeded daily withdrawal time limit",
    1307: "Exceeded daily withdrawal limit",
    1308: "Insufficient balance",
    1309: "Card account does not match member name",
    1318: "This operation is not supported, please contact online customer service for assistance.",
    1319: "The card number has been bound more than twice",
    1401: "OTP sending time exceeded",
    1402: "OTP sending schedule error, please resend OTP",
    1403: "OTP verification error",
    1404: "Failed to send OTP code",
    53000: "Unable to deposit, no eligible plan found",
    53001: "Invalid deposit amount",
    53002: "Invalid deposit days",
    53003: "Betting record does not exist",
    53004: "Not yet matured",
    53005: "Investment has already been settled",
    53006: "Cannot submit, the ongoing interest has reached the maximum limit",
    53007: "Insufficient balance",
    58500: "No Available Spin",
    10000: "Insufficient remaining balance error",
    10001: "Withdrawal error",
    10002: "Deposit error",
    10005: "User has already been used",
    10006: "Name cannot be used",
    10007: "Error entering game room",
    10008: "Error",
    11000: "Deposit submission failed.",
    11003: "Deposit failed",
    11005: "The current user's operations are too frequent. Please try again.",
    12100: "Withdraw password not match",
    12101: "The new withdraw password cannot be the same as the old withdraw password",
    12104: "This feature is disabled, please contact customer service",
    12105:
      "Your withdrawal operation has a network delay, resulting in payment failure. Please wait 30 minutes before withdrawing again, thank you!",
    12106: "Withdraw Amount Must Not Have Decimals",
    13000: "Domain name not found",
    13001: "Cannot query information older than 3 months",
    13002: "Must be within 7 days",
    13003: "End time must be greater than start time",
    14000: "Login name has already been registered",
    14001: "This phone number has already been registered",
    14002: "This email has already been registered",
    14003: "Affiliate code not found",
    15011: "Cannot select date before 2024-07-10",
    15201: "Incorrect old code",
    15202: "The new password cannot be the same as the old password",
    21000: "This game is already in your favorite games list.",
    24001: "The attendance record already exists.",
    24002: "Detected same IP",
    24005: "Does not meet the minimum deposit amount",
    30000: "Member data not found",
    30001: "Member has already received the promotion",
    30002: "Member has sent the number today",
    30003: "Member balance does not meet the requirements",
    30004: "Member deposit does not meet the requirements",
    30005: "Turnover has not reached the requirements",
    30006: "Members listed as account holders are prohibited from receiving this privilege",
    30007: "Member deposit does not meet the requirements",
    30008: "The user’s client does not meet the requirements.",
    30009: "Deposit/Betting requirements not met.",
    30101: "Existing users cannot participate in this promotion.",
    31000: "Promotion not found",
    32000: "VIP level not found",
    32003: "Haven't reached the required VIP level",
    33000: "Must use a 3-digit number",
    33001: "Must be a 3-digit number",
    34000: "Member's birthday is not in this month",
    34001: "Member's birthday not found",
    35000: "Member cannot receive this privilege",
    35001: "Member has already received this privilege",
    35002: "No eligible special privileges can be received",
    35003: "Special privileges and members do not match",
    35004: "Given votes exceeds member's vote limit",
    35006: "Our quota has been reached",
    35007: "This IP has already received privileges",
    35008: "You do not have this privilege",
    35009: "The privilege will take effect soon",
    35010: "35010 Member cannot receive this privilege",
    35011: "35011 Member cannot receive this privilege.",
    35013: "Has already been redeemed by the same IP address",
    35015: "The same device has already claimed this discount.",
    37001: "The redeem time is not within the activity period.",
    45000: "Not reaching the minimum withdrawal amount",
    45001: "Received random bonus today",
    47000: "The discount has not yet been claimed.",
    47001: "No amount available for claim.",
    50000:
      "To keep your funds safe, you need to wait 48 hours after changing your password before adding a new wallet.",
    50001: "The number of available transfers has been reached, please continue betting before transferring again",
    51000: "Today's sign-in reward has already been claimed",
    51001: "Requirements not met",
    51002: "The reward has already been claimed by another account",
    53008: "Unable to submit, the daily deposit limit has been reached today",
    53009: "Unable to submit, the same IP address has already been saved",
    53010: "Unable to submit, the same device has already been stored",
    53011: "Interest withdrawal turnover requirement is not completed, so you cannot deposit again",
    54000: "The collection time has not yet arrived.",
    54001: "The user has not bound a withdrawal account.",
    54002: "The user's bank card is already bound to another account.",
    57000: "Code Fully Redeemed",
    57001: "Cannot Be Redeem",
    57002: "Bet does not met requirement",
    57003: "Deposit does not met requirement",
    57004: "History deposit does not met requirement",
    57005: "Code Redeem Error",
    57006: "Invalid Code",
    58000: "System Stage Error",
    58001: "System Stage Settings Error",
    58002: "Event haven't start",
    58003: "Event have expired",
    58004: "Cannot Participate. Previous Tasks Has Failed to Accomplish.",
    58005: "Congrats, You have Completed All Tasks"
  }
};
