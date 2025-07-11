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
      },
      success: {
        message: "操作成功"
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
      casual: "小游戏",
      baccarat: "百家乐",
      roulette: "轮盘",
      luckyLace: "幸运蕾丝",
      any: "任意类型",
      vsport: "虚拟运动",
      miniGame: "小游戏",
      cockfight: "斗鸡",
      numberGame: "数字游戏"
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
    clickToClaim: "点击领取",
    complete: "去完成",
    back: "返回",
    refresh: "刷新",
    betNow: "立即投注",
    close: "关闭",
    search: "搜寻",
    withdraw: "提款",
    transfer: "转账",
    save: "保存",
    login: "登录",
    register: "注册",
    registernow: "立即注册",
    toConfirm: "前往确认",
    bind: "绑定",
    unbind: "解绑",
    withdrawNow: "立即提款",
    now: "此刻",
    verify: "验证",
    download: "下载",
    downloadNow: "立即下载",
    all: "全部"
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
  withdraw: {
    withdraw: "提款",
    autoWithdraw: "快速提款",
    upgradeToAutoWithdraw: "升级快速提款",
    wallet: "主钱包",
    refresh: "一键刷新",
    upgrading: "升级中...",
    confirming: "确认中...",
    withdrawFee: "*提币手续费： {fee} {currency}",
    expectedAmount: "预计到账：",
    exchangeRate: "实时汇率：",
    limit: {
      amount: "今日提款额度: {amount} {currency}",
      times: "剩余： {times} 次",
      oneTime: "单笔提款额度: {min} {currency} - {max} {currency}"
    },
    remaining: {
      title: "请完成以下条件",
      desc: "若有疑问，请联系在线客服核查~\n*若平台结算流水有延迟，请您10分钟后重试！",
      rolloverRequired: "再完成 {0} 流水，立即享受快速提款",
      table: {
        header: {
          bet: "投注要求",
          transaction: "流水进度",
          status: "完成状态"
        }
      }
    },
    label: {
      crypto: "钱包地址",
      ewallet: "电子钱包",
      alipay: "支付宝",
      bankCard: "银行卡"
    },
    card: {
      crypto: "虚拟钱包",
      ewallet: "电子钱包",
      alipay: "支付宝卡",
      bankCard: "银行卡片"
    },
    form: {
      card: {
        label: "选择{card}",
        error: {
          required: "请选择{card}"
        },
        option: {
          empty: "没有可用的{card}{link}",
          add: "加{card}",
          bind: "绑定{card}"
        }
      },
      amount: {
        placeholder: "请输入提款金额",
        label: "取款金额",
        error: {
          required: "请输入提款金额",
          positive: "金额应为正数",
          decimal: "金额不能带有小数",
          outOfRange: "请输入正确的提款金额"
        }
      }
    },
    notification: {
      withdrawable: {
        message: "恭喜您完成流水，可以提款了!"
      },
      upgradeToAutoWithdraw: {
        message: "成功升级为快速提款!"
      },
      submitWithdraw: {
        message: "提交成功"
      },
      withdrawBlocked: {
        message: "您需要在交易记录-提款记录中点击“确认到账”完成上笔提款后, 才能提交新的提款订单。 感谢您的配合!"
      },
      bindBankCard: {
        title: "请先绑定银行卡"
      }
    }
  },
  bank: {
    addCrypto: "+添加虚拟币账户",
    bankType: {
      bankCard: "银行卡号",
      crypto: "虚拟币账户",
      ewallet: "电子钱包",
      alipay: "支付宝号"
    },
    form: {
      bankCard: {
        error: {
          required: "请输入{label}"
        }
      }
    },
    notification: {
      unbindBankCard: {
        title: "请输入解绑{label}"
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
    serialNumber: "编码",
    table: {
      withdraw: {
        header: {
          serialNumber: "提款编码",
          amount: "提款数额",
          status: "状态",
          withdrawDate: "提款日期"
        }
      },
      transfer: {
        header: {
          serialNumber: "编码",
          type: "账变类型",
          platform: "平台",
          amount: "金额",
          subType: "账变子类型",
          status: "状态",
          recordTime: "时间"
        }
      },
      promo: {
        header: {
          serialNumber: "编码",
          privilegeName: "优惠名",
          amount: "金额",
          recordTime: "记录时间"
        }
      },
      deposit: {
        header: {
          serialNumber: "存款编码",
          depositAmount: "金额",
          status: "存款状态",
          depositDate: "到帐时间",
          paymentType: "存款类型"
        }
      },
      bet: {
        header: {
          transactionId: "注单号",
          betTime: "游戏时间",
          platform: "游戏平台",
          bet: "投注",
          payout: "派彩",
          gameType: "游戏类型",
          status: "投注状态"
        }
      },
      reminderRequired: {
        header: {
          orderNo: "订单号",
          status: "状态",
          financeRemark: "财务反馈",
          feedbackTime: "反馈时间",
          type: "类型"
        }
      }
    },
    filter: {
      range: "区间",
      platform: "平台",
      totalBet: "总投注：{amount}",
      totalPayout: "总派彩：{amount}",
      allPlatform: "全部平台"
    },
    list: {
      deposit: "存款记录",
      withdraw: "提款记录",
      moneyChange: "帐变记录",
      promo: "优惠记录",
      bet: "投注记录",
      reminderRequest: "催单记录"
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
    },
    field: {
      vipRebate: "VIP 返水",
      withdrawFail: "提款失败",
      withdrawTransfer: "转出",
      withdraw: "提款",
      depositTransfer: "转进",
      depositMoneyChange: "转账",
      deposit: "存款",
      promo: "优惠",
      apply: "处理中",
      fail: "失败",
      success: "成功",
      step1: "处理中",
      step2: "待支付",
      step3: "支付中",
      step4: "自动支付",
      step5: "请联系客服查询原因",
      autoPay: "自动支付",
      bank: "VIP 转卡",
      usdtErc: "USDT ERC",
      usdtTrc: "USDT TRC",
      offline: "线下转卡",
      union: "银联快捷",
      quickPayment: "小额转卡",
      specialPayment: "网银转账",
      alipay: "支付宝转卡",
      alipayCode: "支付宝",
      wechatCode: "微信支付",
      qqCode: "QQ 支付",
      kdPay: "K 豆",
      blbPay: "808 钱包",
      ddPay: "钉钉",
      hbPay: "和包",
      szPay: "数字人民币",
      cardPay: "点卡支付",
      onlineCode: "云闪付",
      dyPay: "抖音",
      autoPay: "自动支付",
      pending: "支付中",
      success: "成功",
      supplementSuccess: "成功",
      closed: "关闭",
      waitingCallback: "自动支付中",
      settled: "已结算",
      rec1Reminder: "进行中",
      rec1: "存款",
      rec2Reminder: "完成",
      rec2: "提款",
      bet: "投注",
      settle: "结算",
      betNSettle: "投注并结算",
      cancel: "取消",
      patch: "修补",
      transfer: "转账",
      adjust: "金额调整"
    }
  },
  announcement: {
    title: {
      announcement: "重要公告",
      inbox: "站内消息"
    },
    dontRemindToday: "今天不再提醒",
    btn: {
      cs: "联系客服",
      detail: "查看详情"
    }
  },
  layout: {
    header: {
      lobby: "{name}游戏大厅",
      baccarat: "百家乐",
      forgotPassword: "忘记密码",
      live: "真人娱乐",
      esport: "电子竞技",
      sport: "体育",
      poker: "棋牌",
      fish: "捕鱼达人",
      deposit: "存款",
      promo: "优惠",
      withdraw: "提款",
      transfer: "转账",
      records: "交易记录",
      transit: "转账记录",
      personal: "帐户信息",
      verifyTelephone: "手机号码绑定",
      verifyEmail: "邮箱绑定",
      changePwd: "修改密码",
      download: "下载",
      invite: "呼朋唤友",
      invite2: "邀请好友",
      hongbaoyu: "红包雨",
      announcement: "系统公告",
      mail: "会员建议",
      inbox: "消息提醒",
      outbox: "我的反馈",
      mailWrite: "意见反馈",
      withdrawBank: "银行信息",
      promotion: "优惠领取区",
      affiliate: "加盟",
      bankInfo: "银行信息",
      depositRecord: "存款记录",
      withdrawRecord: "提款记录",
      transferRecord: "账变记录",
      promoRecord: "优惠记录",
      betRecord: "投注记录",
      remindRecord: "催单记录",
      help: "救援金记录",
      inviteRecord: "推荐好友记录",
      vip: "VIP 优惠",
      bindCrypto: "绑定虚拟币账户",
      changePassword: "修改密码"
    },
    footer: {
      home: "首页",
      promo: "优惠",
      liveChat: "客服",
      me: "我的"
    }
  },
  account: {
    wallet: "中心钱包",
    feature: {
      title: "功能区",
      personal: "帐户信息",
      bank: "银行信息",
      record: "交易信息",
      betRecord: "投注记录",
      inbox: "消息提醒",
      changePassword: "修改密码"
    },
    hot: {
      title: "热门推荐",
      promo: "优惠活动"
    },
    logout: "退出登录",
    notification: {
      logoutConfirm: {
        title: "系统提示",
        message: "您确定要退出登录吗？"
      },
      changProfile: {
        title: "修改头像",
        upload: {
          title: "上传头像",
          desc: "上传头像支持jpg,jpeg,png,bmp格式的图片，文件小于1MB"
        },
        preview: "头像预览"
      },
      copyCustomUrlSuccess: {
        message: "已复制专属网址"
      },
      imgFormatError: {
        message: "照片格式错误"
      },
      imgSizeLimit: {
        message: "上传的图片已大于{size}，请刷新页面重新上传"
      },
      noImg: {
        message: "请选择图片"
      },
      changeProfileSuccess: {
        message: "修改成功"
      }
    }
  },
  forgotPassword: {
    tab: {
      changePasswordByPhone: "短信修改密码",
      changePasswordByEmail: "邮箱修改密码"
    },
    form: {
      preparePhoneOtp: "请提供您的用户名以及手机号码，我们会立即将新的密码发送到您的邮箱。",
      otpSentPhone: "OTP短信已发送到您的注册手机, 请输入OTP和新密码。",
      prepareEmailOtp: "请输入您需找回登陆密码的用户名和验证邮箱",
      otpSentEmail: "验证码已发送到您的注册邮箱，请输入验证码和新密码完成密码修改。",
      otp: {
        label: "OTP码",
        placeholder: "请输入OTP码",
        error: {
          required: "请输入OTP码",
          length: "OTP长度不符"
        }
      },
      password: {
        label: "请输入新密码",
        placeholder: "请输入新密码",
        error: {
          required: "请输入密码",
          length: "密码长度为 {min} 到 {max}"
        }
      },
      passwordConfirm: {
        label: "请再次输入新密码",
        placeholder: "请再次输入新密码",
        error: {
          required: "请输入确认密码",
          length: "密码长度为 {min} 到 {max}",
          match: "密码不同"
        }
      },
      userName: {
        label: "请输入用户名",
        placeholder: "请输入用户名",
        error: {
          required: "请输入用户名",
          length: "用户名长度为 {min} 到 {max}"
        }
      },
      phone: {
        label: "请输入手机号码",
        placeholder: "请输入手机号码",
        error: {
          required: "请输入手机号码",
          format: "请输入有效的电话号码"
        }
      },
      verificationCode: {
        label: "请输入验证码",
        placeholder: "请输入验证码",
        error: {
          format: "验证码应为四个字符串"
        }
      },
      email: {
        label: "请输入注册邮箱",
        placeholder: "请输入验证邮箱",
        error: {
          required: "请输入验证邮箱",
          format: "请输入有效电子邮件"
        }
      }
    },
    notification: {
      sendingOtp: {
        message: "发送验证码中..."
      },
      otpVerified: {
        message: "请输入新密码"
      },
      submitting: {
        message: "提交中..."
      },
      passwordChanged: {
        message: "密码修改成功"
      }
    }
  },
  promo: {
    label: {
      new: "最新",
      hot: "热门",
      normal: "正常",
      recommend: "推荐",
      daily: "日常",
      newUser: "新人",
      timeLimited: "限时",
      selected: "精选"
    }
  },
  bindCrypto: {
    form: {
      cardNumber: {
        label: "虚拟币帐户",
        placeholder: "请输入虚拟币帐户",
        error: {
          required: "请输入虚拟币帐户",
          format: "请输入有效的虚拟币帐户",
          length: "长度应为 {min} 到 {max} 个字符"
        }
      },
      type: {
        label: "虚拟币种类"
      },
      category: {
        label: "协议"
      }
    }
  },
  login: {
    alreadyGotAcc: "我已有账号，",
    loginnow: "立即登录",
    userNameLogin: "用户名登录",
    phoneLogin: "手机号码登录",
    forgotPassword: "忘记密码？",
    rememberPassword: "记住密码",
    cs: "联系客服",
    loggingIn: "登录中...",
    form: {
      userName: {
        label: "用户名",
        placeholder: "请输入用户名",
        error: {
          required: "请输入用户名",
          length: "长度要在 {min} 到 {max}"
        }
      },
      password: {
        label: "密码",
        placeholder: "请输入密码",
        error: {
          required: "请输入密码"
        }
      },
      phone: {
        label: "请输入手机号码",
        placeholder: "请输入手机号码",
        error: {
          required: "请输入手机号码",
          format: "请输入有效的电话号码",
          error: "手机号码错误"
        }
      },
      otp: {
        label: "请输入验证码",
        placeholder: "请输入短信验证码",
        error: {
          required: "请输入短信验证码",
          error: "验证码错误"
        },
        append: {
          sendable: "发送验证码",
          sent: "已发送 ({second}秒)"
        }
      },
      verificationCode: {
        label: "请输入验证码",
        placeholder: "请输入验证码",
        imgTitle: "点击刷新验证码",
        error: {
          format: "请输入验证码"
        }
      }
      // TODO: captcha i18n
    },
    notification: {
      verification: {
        title: "验证码"
      },
      sentOtp: {
        message: "发送手机验证码成功"
      }
    }
  },
  register: {
    registering: "注册中...",
    form: {
      userName: {
        label: "请输入账号",
        placeholder: "{min} ~ {max}位包含字母和数字",
        error: {
          required: "请输入用户名",
          length: "用户名个数必须在 {min} 和 {max} 之间",
          format: "须以字母开头，并包含至少2个字母和1个数字"
        }
      },
      password: {
        label: "请输入密码",
        placeholder: "请输入密码",
        error: {
          required: "请输入密码",
          length: "密码长度为 {min} 到 {max}"
        }
      },
      passwordConfirm: {
        label: "请再次输入密码",
        placeholder: "请再次输入密码",
        error: {
          required: "请输入确认密码",
          length: "密码长度为 {min} 到 {max}",
          match: "密码不同"
        }
      },
      realName: {
        label: "请输入真实姓名",
        placeholder: "姓名必须与提款银行卡账号一致",
        error: {
          required: "请输入真实姓名",
          length: "用户名个数必须在 {min} 和 {max} 之间"
        }
      },
      verificationCode: {
        label: "验证码",
        placeholder: "请输入验证码",
        imgTitle: "点击刷新验证码",
        error: {
          format: "验证码应为四个字符串"
        }
      },
      affiliateCode: {
        label: "请输入推荐码",
        placeholder: "若不是合营下会员无需填写"
      }
    },
    notification: {
      registerSuccess: {
        message: "注册成功"
      }
    }
  },
  changePassword: {
    btn: "修改密码",
    form: {
      oldPassword: {
        placeholder: "请输入旧密码",
        error: {
          required: "请输入旧密码",
          length: "密码长度为 {min} 到 {max}"
        }
      },
      newPassword: {
        placeholder: "请输入新密码",
        error: {
          required: "请输入新密码",
          length: "密码长度为 {min} 到 {max}"
        }
      },
      newPasswordConfirm: {
        placeholder: "请再次输入新密码",
        error: {
          required: "请再次输入新密码",
          length: "密码长度为 {min} 到 {max}",
          match: "确认密码与新密码不符合"
        }
      }
    },
    notification: {
      changePasswordSuccess: {
        message: "密码修改成功"
      }
    }
  },
  verifyEmail: {
    form: {
      email: {
        label: "邮箱地址",
        placeholder: "请输入邮箱",
        error: {
          required: "请输入邮箱",
          format: "请输入正确的邮箱"
        },
        append: {
          sendable: "发送验证码",
          sent: "已发送 ({second}秒)"
        }
      },
      otp: {
        label: "验证码",
        placeholder: "请输入邮箱验证码",
        imgTitle: "点击刷新验证码",
        error: {
          required: "请输入邮箱验证码"
        }
      }
    },
    notification: {
      captcha: {
        title: "验证码",
        message: "提交成功"
      },
      otpSent: {
        message: "验证码已发送至您的邮箱。"
      }
    }
  },
  personal: {
    alert: "信息更新后将无法更改，如需帮助请{0}",
    cs: "联系客服",
    form: {
      userName: {
        label: "账号",
        placeholder: "账号",
        error: {
          required: "请输入账号"
        }
      },
      realName: {
        label: "姓名",
        placeholder: "姓名",
        error: {
          required: "请输入姓名",
          length: "用户名个数必须在 {min} 和 {max} 之间"
        }
      },
      birth: {
        label: "生日",
        placeholder: "DD/MM/YYYY",
        error: {
          required: "请选择生日",
          format: "请选择正确的日期"
        }
      },
      email: {
        label: "邮箱",
        placeholder: "邮箱",
        error: {
          required: "请输入邮箱",
          format: "请输入正确的邮箱"
        }
      },
      phone: {
        label: "手机号码",
        placeholder: "手机号码",
        error: {
          required: "请输入手机号码",
          format: "请输入有效的手机号码"
        }
      }
    }
  },
  home: {
    downloadApp: {
      appName: "幸运6 APP",
      desc: "覆盖全部游戏，体验更流畅，更安全，更快捷"
    },
    authSection: {
      notLogin1: "您还未登录",
      notLogin2: "登录/注册后查看"
    },
    game: {
      maintenance: "维护中",
      maintenanceTime: "维护时间：{start} - {end}"
    },
    notification: {
      announcement: {
        title: "公告"
      },
      newVersion: {
        title: "更新公告",
        message: "检测到新版本，你是否要更新？"
      }
    }
  },
  tianaiCaptcha: {
    tipsError: "验证失败，请重新尝试!",
    tipsSuccess: "验证成功,耗时{s}秒",
    sliderTitle: "拖动滑块完成拼图",
    concatTitle: "拖动滑块完成拼图",
    imageClickTitle: "请依次点击下列图片",
    rotate_title: "拖动滑块完成拼图"
  },
  error: {
    101: "未找到平台",
    102: "平台已关闭",
    104: "不是转账平台",
    105: "未找到网站",
    400: "请求失败",
    403: "未授权",
    405: "方法不被允许",
    500: "系统故障",
    501: "请求码已被使用",
    502: "未找到服务器",
    504: "请求过于频繁",
    601: "Token 验证错误",
    603: "未找到 Token",
    608: "当前用户操作过于频繁，请稍后再试。",
    609: "平台维护中",
    610: "禁止参与游戏，请联系管理员",
    604: "登录成功",
    707: "余额不足",
    710: "余额不足",
    800: "验证码错误",
    801: "密码验证码已过期",
    900: "未找到会员",
    901: "未找到记录",
    902: "邮箱与会员信息不符",
    903: "邮箱与注册账户不符",
    904: "邮箱尚未验证，请联系24小时客服。",
    905: "未提供真实姓名",
    906: "用户邮箱尚未验证。",
    909: "未找到手机号",
    910: "用户名与手机号不符",
    1000: "登录名或密码错误",
    1001: "账户已关闭",
    1002: "账户为代理账户",
    1004: "密码错误次数过多，账户已暂时锁定",
    1011: "当前账户已绑定手机号",
    1012: "当前账户已绑定邮箱",
    1013: "当前账户已绑定生日",
    1014: "当前账户已绑定姓名",
    1015: "当前账户已绑定昵称",
    1016: "注册功能升级中，请于本地时间上午9点后再注册，谢谢！",
    1300: "金额必须为大于0的数字",
    1301: "不支持此卡",
    1302: "不支持此币种",
    1304: "该号码已被使用",
    1305: "未找到银行",
    1306: "超过每日提款时间限制",
    1307: "超过每日提款额度限制",
    1308: "余额不足",
    1309: "持卡人姓名与会员姓名不符",
    1318: "不支持该操作，请联系客服协助。",
    1319: "该卡号已绑定超过两次",
    1401: "OTP发送时间已过",
    1402: "OTP发送时间异常，请重新发送",
    1403: "OTP验证失败",
    1404: "OTP验证码发送失败",
    53000: "无法充值，未找到符合条件的方案",
    53001: "充值金额无效",
    53002: "充值天数无效",
    53003: "投注记录不存在",
    53004: "尚未到期",
    53005: "投资已结算",
    53006: "无法提交，当前利息已达上限",
    53007: "余额不足",
    58500: "暂无可用转盘机会",
    10000: "剩余余额不足",
    10001: "提款错误",
    10002: "充值错误",
    10005: "用户已被使用",
    10006: "该姓名不可用",
    10007: "进入游戏房间错误",
    10008: "错误",
    11000: "充值提交失败",
    11003: "充值失败",
    11005: "当前用户操作过于频繁，请稍后再试。",
    12100: "提款密码不正确",
    12101: "新提款密码不能与旧密码相同",
    12104: "该功能已关闭，请联系客服",
    12105: "提款操作网络延迟，付款失败，请30分钟后重试，谢谢！",
    12106: "提款金额不能包含小数",
    13000: "未找到域名",
    13001: "无法查询三个月前的数据",
    13002: "必须在7天内",
    13003: "结束时间必须大于开始时间",
    14000: "登录名已被注册",
    14001: "手机号已被注册",
    14002: "邮箱已被注册",
    14003: "未找到代理码",
    15011: "无法选择 2024-07-10 之前的日期",
    15201: "旧验证码不正确",
    15202: "新密码不能与旧密码相同",
    21000: "该游戏已在收藏列表中",
    24001: "签到记录已存在",
    24002: "检测到相同 IP",
    24005: "未达最低充值金额",
    30000: "未找到会员数据",
    30001: "会员已领取该优惠",
    30002: "会员今日已发送次数",
    30003: "会员余额不符合条件",
    30004: "会员充值金额不符合条件",
    30005: "流水未达条件",
    30006: "列为户主的会员禁止领取该优惠",
    30007: "会员充值金额不符合条件",
    30008: "客户端不符合要求",
    30009: "未满足充值/投注要求",
    30101: "现有用户不可参加该优惠",
    31000: "未找到活动",
    32000: "未找到VIP等级",
    32003: "未达到所需VIP等级",
    33000: "必须是3位数",
    33001: "必须是3位数",
    34000: "会员生日不在本月",
    34001: "未找到会员生日",
    35000: "会员不可领取该优惠",
    35001: "会员已领取该优惠",
    35002: "暂无符合条件的专属优惠",
    35003: "专属优惠与会员不匹配",
    35004: "已超出会员投票上限",
    35006: "名额已满",
    35007: "该IP已领取优惠",
    35008: "您无权领取此优惠",
    35009: "优惠即将生效",
    35010: "35010 会员不可领取该优惠",
    35011: "35011 会员不可领取该优惠",
    35013: "同一IP已兑换",
    35015: "该设备已领取该优惠",
    37001: "兑换时间不在活动期间内",
    45000: "未达最低提款金额",
    45001: "今日已领取随机奖金",
    47000: "尚未领取该优惠",
    47001: "暂无可领取金额",
    50000: "为保障资金安全，修改密码后需等待48小时才能添加新钱包。",
    50001: "转账次数已达上限，请继续投注后再尝试转账",
    51000: "今日签到奖励已领取",
    51001: "不符合条件",
    51002: "该奖励已被其他账户领取",
    53008: "无法提交，今日已达充值上限",
    53009: "无法提交，相同IP已充值",
    53010: "无法提交，相同设备已充值",
    53011: "利息提款未完成流水，无法再次充值",
    54000: "尚未到领取时间",
    54001: "用户尚未绑定提款账户",
    54002: "该银行卡已绑定至其他账户",
    57000: "兑换码已兑换完毕",
    57001: "无法兑换",
    57002: "投注未达要求",
    57003: "充值未达要求",
    57004: "历史充值未达要求",
    57005: "兑换码错误",
    57006: "兑换码无效",
    58000: "系统阶段错误",
    58001: "系统阶段设置错误",
    58002: "活动尚未开始",
    58003: "活动已结束",
    58004: "无法参与，前置任务未完成。",
    58005: "恭喜您，已完成全部任务"
  }
};
