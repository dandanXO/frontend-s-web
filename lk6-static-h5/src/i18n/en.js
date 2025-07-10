export default {
  lang: {
    langVal: "en"
  },
  common: {
    error: "Error",
    loading: "Loading...",
    noMoreData: "No more data",
    noData: "No data available",
    uploadImg: "Upload Image",
    notification: {
      loginRequired: {
        title: "System Alert",
        message: "Please log in to proceed"
      },
      copySuccess: {
        message: "{str} copied successfully"
      },
      copyError: {
        message: "Failed to copy {str}"
      },
      tokenLogged: {
        message:
          "Your account has been logged in on another device. If this wasn't you, please change your password immediately."
      },
      claimed: {
        message: "Congratulations on winning a bonus"
      },
      uploadSuccess: {
        message: "{name} uploaded successfully"
      },
      uploadError: {
        message: "{name} upload failed. Please try again later."
      },
      uploadFileRequired: {
        message: "Please upload an image"
      },
      success: {
        message: "Operation successful"
      }
    },
    gameType: {
      sport: "Sport",
      esports: "Esports",
      slot: "Slots",
      live: "Live Casino",
      poker: "Poker",
      fish: "Fishing",
      lottery: "Lottery",
      casual: "Casual",
      baccarat: "Baccarat",
      roulette: "Roulette",
      luckyLace: "Lucky Lace",
      any: "Any Type",
      vsport: "Virtual Sports",
      miniGame: "Mini Game",
      cockfight: "Cockfight",
      numberGame: "Number Game"
    }
  },
  btn: {
    cancel: "Cancel",
    goLogin: "Go to Login",
    confirm: "Confirm",
    deposit: "Deposit",
    copy: "Copy",
    reminderRequest: "Request Reminder",
    confirmFund: "Confirm Receipt",
    submit: "Submit",
    clickToClaim: "Click to Claim",
    complete: "Complete",
    back: "Back",
    refresh: "Refresh",
    betNow: "Bet Now",
    close: "Close",
    search: "Search",
    withdraw: "Withdraw",
    transfer: "Transfer",
    save: "Save",
    login: "Login",
    register: "Register",
    toConfirm: "To Confirm",
    bind: "Bind",
    unbind: "Unbind",
    withdrawNow: "Withdraw Now",
    now: "Now",
    verify: "Verify",
    download: "Download",
    downloadNow: "Download Now",
    all: "All"
  },
  deposit: {
    paymentWay: "Payment Method",
    depositAmountInput: {
      label: "Deposit Amount",
      placeholder: "Enter amount",
      error: {
        outOfRange: "Amount must be between {min} - {max}",
        required: "Please enter amount",
        notNumber: "Amount must be an integer"
      }
    },
    depositAmountSelect: {
      placeholder: "Select amount"
    },
    singleDeposit: "Single deposit: {min} - {max}",
    exchangeRate: "Current Exchange Rate:",
    expectedAmount: "Expected Credit:",
    privilege: {
      placeholder: "Choose Promo",
      min: "Minimum deposit for bonus: {min} {currency},",
      rolloverGameTitle: "Rollover Requirement (deposit + bonus):",
      rolloverGame: "{game} {rollover}×",
      rollover: "Rollover Requirement (deposit + bonus): {rollover}×"
    },
    notification: {
      popupBlocked: {
        message: "Unable to open payment page. Please allow pop-ups in your browser settings and try again."
      }
    }
  },
  withdraw: {
    withdraw: "Withdraw",
    autoWithdraw: "Fast Withdraw",
    upgradeToAutoWithdraw: "Upgrade to Fast Withdraw",
    wallet: "Main Wallet",
    refresh: "Refresh",
    upgrading: "Upgrading...",
    confirming: "Confirming...",
    withdrawFee: "*Withdrawal fee: {fee} {currency}",
    expectedAmount: "Expected Amount:",
    exchangeRate: "Current Exchange Rate:",
    limit: {
      amount: "Today's withdrawal limit: {amount} {currency}",
      times: "Remaining: {times} times",
      oneTime: "Single withdrawal: {min} {currency} - {max} {currency}"
    },
    remaining: {
      title: "Conditions to complete",
      desc: "If you have questions, please contact customer service.\n*If the system is delayed, please try again in 10 minutes!",
      rolloverRequired: "Complete {0} more turnover to unlock fast withdraw",
      table: {
        header: {
          bet: "Betting Required",
          transaction: "Turnover Progress",
          status: "Status"
        }
      }
    },
    label: {
      crypto: "Wallet Address",
      ewallet: "E‑Wallet",
      alipay: "Alipay",
      bankCard: "Bank Card"
    },
    card: {
      crypto: "Crypto Wallet",
      ewallet: "E‑Wallet",
      alipay: "Alipay Account",
      bankCard: "Bank Card"
    },
    form: {
      card: {
        label: "Select {card}",
        error: {
          required: "Please select {card}"
        },
        option: {
          empty: "No {card} available{link}",
          add: "Add {card}",
          bind: "Bind {card}"
        }
      },
      amount: {
        placeholder: "Enter withdrawal amount",
        label: "Withdrawal Amount",
        error: {
          required: "Please enter amount",
          positive: "Amount must be positive",
          decimal: "Amount must be a whole number",
          outOfRange: "Enter a valid amount"
        }
      }
    },
    notification: {
      withdrawable: {
        message: "Congratulations, you have met turnover requirements and can withdraw!"
      },
      upgradeToAutoWithdraw: {
        message: "Successfully upgraded to Fast Withdraw!"
      },
      submitWithdraw: {
        message: "Submission successful"
      },
      withdrawBlocked: {
        message:
          "Please confirm your last withdrawal in Transaction → Withdrawal Records before submitting a new one. Thank you!"
      },
      bindBankCard: {
        title: "Please bind a bank card first"
      }
    }
  },
  bank: {
    addCrypto: "+ Add Crypto Account",
    bankType: {
      bankCard: "Bank Card Number",
      crypto: "Crypto Account",
      ewallet: "E‑Wallet",
      alipay: "Alipay ID"
    },
    form: {
      bankCard: {
        error: {
          required: "Please enter {label}"
        }
      }
    },
    notification: {
      unbindBankCard: {
        title: "Please enter the password to unbind {label}"
      }
    }
  },
  mail: {
    readAll: "Read ALL",
    deleteAll: "Delete All",
    delete: "Delete",
    read: "Read",
    sentTime: "Sent: {time}",
    content: "Content:",
    reply: "Reply:",
    selectMultiple: "Select Multiple",
    category: {
      activity: "Activity",
      announcement: "Announcement",
      payment: "Payment",
      notification: "Notification",
      all: "All"
    },
    notification: {
      deleteConfirm: {
        title: "Are you sure?",
        message: "Delete selected messages?"
      },
      readSelectedSuccess: {
        message: "Selected marked as read"
      },
      readSuccess: {
        message: "Message marked as read"
      },
      readAllSuccess: {
        message: "All messages marked as read"
      },
      deleteSelectedSuccess: {
        message: "Selected messages deleted"
      },
      deleteAllSuccess: {
        message: "All messages deleted"
      }
    }
  },
  record: {
    betId: "Bet ID",
    serialNumber: {
      deposit: "Deposit Code"
    },
    table: {
      withdraw: {
        header: {
          serialNumber: "Withdrawal Code",
          amount: "Amount",
          status: "Status",
          withdrawDate: "Date"
        }
      },
      transfer: {
        header: {
          serialNumber: "Transaction Code",
          type: "Change Type",
          platform: "Platform",
          amount: "Amount",
          status: "Status",
          transferDate: "Date"
        }
      },
      promo: {
        header: {
          serialNumber: "Code",
          privilegeName: "Promo Name",
          amount: "Amount",
          recordTime: "Time"
        }
      },
      deposit: {
        header: {
          serialNumber: "Deposit Code",
          depositAmount: "Amount",
          status: "Status",
          depositDate: "Date",
          paymentType: "Payment Type"
        }
      },
      bet: {
        header: {
          transactionId: "Bet ID",
          betTime: "Time",
          platform: "Platform",
          bet: "Bet",
          payout: "Payout",
          gameType: "Game Type",
          status: "Status"
        }
      },
      reminderRequired: {
        header: {
          orderNo: "Order No.",
          status: "Status",
          financeRemark: "Finance Note",
          feedbackTime: "Feedback Time",
          type: "Type"
        }
      }
    },
    filter: {
      range: "Date Range",
      platform: "Platform",
      totalBet: "Total Bet: {amount}",
      totalPayout: "Total Payout: {amount}",
      allPlatform: "All Platforms"
    },
    list: {
      deposit: "Deposit Records",
      withdraw: "Withdrawal Records",
      moneyChange: "Account Changes",
      promo: "Promo Records",
      bet: "Betting Records",
      reminderRequest: "Reminder Requests"
    },
    notification: {
      reminderRequest: {
        title: "Reminder Request",
        content: {
          serialNumber: "Deposit Code",
          remark: "Remark"
        }
      },
      confirmFund: {
        title: "System Alert",
        message: "Confirm receipt"
      },
      cancelWithdraw: {
        title: "System Alert",
        message: "Confirm cancellation"
      },
      cancelWithdrawSuccess: {
        message: "Withdrawal canceled"
      },
      confirmFundSuccess: {
        message: "Receipt confirmed"
      },
      reminderRequestLimit: {
        message: "You already have 3 pending reminders."
      },
      reminderRequestSuccess: {
        message: "Reminder submitted successfully!"
      }
    },
    field: {
      vipRebate: "VIP Rebate",
      withdrawFail: "Withdrawal Failed",
      withdrawTransfer: "Transfer Out",
      withdraw: "Withdraw",
      depositTransfer: "Transfer In",
      depositMoneyChange: "Transfer",
      deposit: "Deposit",
      promo: "Promotion",
      apply: "Processing",
      fail: "Failed",
      success: "Successful",
      step1: "Processing",
      step2: "Pending Payment",
      step3: "Paying",
      step4: "Auto Payment",
      step5: "Please contact customer service for the reason",
      autoPay: "Auto Payment",
      bank: "VIP Card Transfer",
      usdtErc: "USDT ERC",
      usdtTrc: "USDT TRC",
      offline: "Offline Card Transfer",
      union: "UnionPay Express",
      quickPayment: "Small Amount Transfer",
      specialPayment: "Online Banking Transfer",
      alipay: "Alipay Card Transfer",
      alipayCode: "Alipay",
      wechatCode: "WeChat Pay",
      qqCode: "QQ Pay",
      kdPay: "K Beans",
      blbPay: "808 Wallet",
      ddPay: "DingTalk",
      hbPay: "He Bao",
      szPay: "Digital RMB",
      cardPay: "Prepaid Card Payment",
      onlineCode: "Cloud QuickPass",
      dyPay: "Douyin",
      autoPay: "Auto Payment",
      pending: "Paying",
      success: "Successful",
      supplementSuccess: "Successful",
      closed: "Closed",
      waitingCallback: "Auto Paying",
      settled: "Settled",
      rec1Reminder: "In Progress",
      rec1: "Deposit",
      rec2Reminder: "Completed",
      rec2: "Withdrawal",
      bet: "Bet",
      settle: "Settle",
      betNSettle: "Bet and Settle",
      cancel: "Cancel",
      patch: "Patch",
      transfer: "Transfer",
      adjust: "Amount Adjustment"
    }
  },
  announcement: {
    title: {
      announcement: "Important Announcement",
      inbox: "In‑App Messages"
    },
    dontRemindToday: "Don't remind again today",
    btn: {
      cs: "Contact Support",
      detail: "View Details"
    }
  },
  layout: {
    header: {
      lobby: "{name} Game Lobby",
      baccarat: "Baccarat",
      forgotPassword: "Forgot Password",
      live: "Live Casino",
      esport: "Esports",
      sport: "Sports",
      poker: "Poker",
      fish: "Fishing",
      deposit: "Deposit",
      promo: "Promotions",
      withdraw: "Withdraw",
      transfer: "Transfer",
      records: "Records",
      transit: "Transfer Records",
      personal: "Account Info",
      verifyTelephone: "Bind Phone Number",
      verifyEmail: "Bind Email",
      changePwd: "Change Password",
      download: "Download",
      invite: "Invite Friends",
      invite2: "Invite Friends",
      hongbaoyu: "Red Packet Rain",
      announcement: "Announcements",
      mail: "Feedback",
      inbox: "Notifications",
      outbox: "My Feedback",
      mailWrite: "Submit Feedback",
      withdrawBank: "Bank Details",
      promotion: "Claim Promo",
      affiliate: "Affiliate",
      bankInfo: "Bank Details",
      depositRecord: "Deposit History",
      withdrawRecord: "Withdrawal History",
      transferRecord: "Account Changes",
      promoRecord: "Promo History",
      betRecord: "Betting History",
      remindRecord: "Reminder History",
      help: "Rescue Fund History",
      inviteRecord: "Referral History",
      vip: "VIP Benefits",
      bindCrypto: "Bind Crypto Account",
      changePassword: "Change Password"
    },
    footer: {
      home: "Home",
      promo: "Promotions",
      liveChat: "Support",
      me: "Me"
    }
  },
  account: {
    wallet: "Main Wallet",
    feature: {
      title: "Features",
      personal: "Account Info",
      bank: "Bank Details",
      record: "Transaction Info",
      betRecord: "Betting History",
      inbox: "Notifications",
      changePassword: "Change Password"
    },
    hot: {
      title: "Hot Picks",
      promo: "Promos"
    },
    logout: "Log Out",
    notification: {
      logoutConfirm: {
        title: "Are you sure?",
        message: "Do you really want to log out?"
      },
      changProfile: {
        title: "Change Avatar",
        upload: {
          title: "Upload Avatar",
          desc: "Supports jpg, jpeg, png, bmp under 1 MB"
        },
        preview: "Avatar Preview"
      },
      copyCustomUrlSuccess: {
        message: "Custom URL copied"
      },
      imgFormatError: {
        message: "Invalid image format"
      },
      imgSizeLimit: {
        message: "Image exceeds {size}, please refresh and try again"
      },
      noImg: {
        message: "Please select an image"
      },
      changeProfileSuccess: {
        message: "Profile updated successfully"
      }
    }
  },
  forgotPassword: {
    tab: {
      changePasswordByPhone: "Reset via SMS",
      changePasswordByEmail: "Reset via Email"
    },
    form: {
      preparePhoneOtp: "Enter your username and phone number; we will send a new password via email.",
      otpSentPhone: "OTP sent to your registered phone. Please enter OTP and new password.",
      prepareEmailOtp: "Please enter username and registered email to reset password.",
      otpSentEmail: "OTP sent to your email. Enter OTP and new password to complete.",
      otp: {
        label: "OTP Code",
        placeholder: "Enter OTP",
        error: {
          required: "Enter OTP",
          length: "Invalid OTP length"
        }
      },
      password: {
        label: "New Password",
        placeholder: "Enter new password",
        error: {
          required: "Enter password",
          length: "Password must be {min} to {max} characters"
        }
      },
      passwordConfirm: {
        label: "Confirm Password",
        placeholder: "Re‑enter new password",
        error: {
          required: "Confirm password",
          length: "Password must be {min} to {max} characters",
          match: "Passwords do not match"
        }
      },
      userName: {
        label: "Username",
        placeholder: "Enter username",
        error: {
          required: "Enter username",
          length: "Username must be {min} to {max} characters"
        }
      },
      phone: {
        label: "Phone Number",
        placeholder: "Enter phone number",
        error: {
          required: "Enter phone number",
          format: "Invalid phone number",
          error: "Phone number error"
        }
      },
      verificationCode: {
        label: "Enter Code",
        placeholder: "Enter code",
        error: {
          format: "Code must be 4 characters"
        }
      },
      email: {
        label: "Email",
        placeholder: "Enter registered email",
        error: {
          required: "Enter email",
          format: "Invalid email address"
        }
      }
    },
    notification: {
      sendingOtp: {
        message: "Sending OTP..."
      },
      otpVerified: {
        message: "OTP verified, please enter new password"
      },
      submitting: {
        message: "Submitting..."
      },
      passwordChanged: {
        message: "Password changed successfully"
      }
    }
  },
  promo: {
    label: {
      new: "New",
      hot: "Hot",
      normal: "Standard",
      recommend: "Recommended",
      daily: "Daily",
      newUser: "New User",
      timeLimited: "Limited Time",
      selected: "Selected"
    }
  },
  bindCrypto: {
    form: {
      cardNumber: {
        label: "Crypto Account",
        placeholder: "Enter crypto account",
        error: {
          required: "Enter crypto account",
          format: "Invalid crypto account format",
          length: "Length must be {min} to {max} characters"
        }
      },
      type: {
        label: "Crypto Type"
      },
      category: {
        label: "Protocol"
      }
    }
  },
  login: {
    userNameLogin: "Username Login",
    phoneLogin: "Phone Login",
    forgotPassword: "Forgot password?",
    rememberPassword: "Remember me",
    cs: "Contact Support",
    loggingIn: "Logging in...",
    form: {
      userName: {
        label: "Username",
        placeholder: "Enter username",
        error: {
          required: "Enter username",
          length: "Length must be {min} to {max}"
        }
      },
      password: {
        label: "Password",
        placeholder: "Enter password",
        error: {
          required: "Enter password"
        }
      },
      phone: {
        label: "Phone Number",
        placeholder: "Enter phone number",
        error: {
          required: "Enter phone number",
          format: "Invalid phone number",
          error: "Phone number error"
        }
      },
      otp: {
        label: "SMS Code",
        placeholder: "Enter SMS code",
        error: {
          required: "Enter SMS code",
          error: "Code error"
        },
        append: {
          sendable: "Send Code",
          sent: "Sent ({second}s)"
        }
      },
      verificationCode: {
        label: "Captcha",
        placeholder: "Enter captcha",
        imgTitle: "Click to refresh",
        error: {
          format: "Invalid captcha"
        }
      }
    },
    notification: {
      verification: {
        title: "Captcha Verification"
      },
      sentOtp: {
        message: "SMS code sent successfully"
      }
    }
  },
  register: {
    registering: "Registering...",
    form: {
      userName: {
        label: "Username",
        placeholder: "{min}–{max} chars, letters & numbers",
        error: {
          required: "Enter username",
          length: "Username must be {min} to {max} chars",
          format: "Start with letter, include ≥2 letters & ≥1 number"
        }
      },
      password: {
        label: "Password",
        placeholder: "Enter password",
        error: {
          required: "Enter password",
          length: "Password must be {min} to {max} chars"
        }
      },
      passwordConfirm: {
        label: "Confirm Password",
        placeholder: "Re‑enter password",
        error: {
          required: "Confirm password",
          length: "Password must be {min} to {max} chars",
          match: "Passwords must match"
        }
      },
      realName: {
        label: "Full Name",
        placeholder: "Must match bank card name",
        error: {
          required: "Enter full name",
          length: "Name must be {min} to {max} chars"
        }
      },
      verificationCode: {
        label: "Captcha Code",
        placeholder: "Enter code",
        imgTitle: "Click to refresh",
        error: {
          format: "Code must be 4 characters"
        }
      },
      affiliateCode: {
        label: "Referral Code",
        placeholder: "Optional"
      }
    },
    notification: {
      registerSuccess: {
        message: "Registration successful"
      }
    }
  },
  changePassword: {
    btn: "Change Password",
    form: {
      oldPassword: {
        placeholder: "Enter old password",
        error: {
          required: "Enter old password",
          length: "Password must be {min} to {max} chars"
        }
      },
      newPassword: {
        placeholder: "Enter new password",
        error: {
          required: "Enter new password",
          length: "Password must be {min} to {max} chars"
        }
      },
      newPasswordConfirm: {
        placeholder: "Confirm new password",
        error: {
          required: "Confirm new password",
          length: "Password must be {min} to {max} chars",
          match: "Confirmation does not match"
        }
      }
    },
    notification: {
      changePasswordSuccess: {
        message: "Password changed successfully"
      }
    }
  },
  verifyEmail: {
    form: {
      email: {
        label: "Email Address",
        placeholder: "Enter email",
        error: {
          required: "Enter email",
          format: "Invalid email address"
        },
        append: {
          sendable: "Send Code",
          sent: "Sent ({second}s)"
        }
      },
      otp: {
        label: "Verification Code",
        placeholder: "Enter email code",
        imgTitle: "Click to refresh",
        error: {
          required: "Enter code"
        }
      }
    },
    notification: {
      captcha: {
        title: "Captcha",
        message: "Submitted"
      },
      otpSent: {
        message: "Verification code sent to your email."
      }
    }
  },
  personal: {
    alert: "Once updated, info cannot be changed. For help, {0}",
    cs: "contact support",
    form: {
      userName: {
        label: "Username",
        placeholder: "Username",
        error: {
          required: "Enter username"
        }
      },
      realName: {
        label: "Full Name",
        placeholder: "Enter full name",
        error: {
          required: "Enter full name",
          length: "Name must be {min} to {max} chars"
        }
      },
      birth: {
        label: "Birthdate",
        placeholder: "DD/MM/YYYY",
        error: {
          required: "Select birthdate",
          format: "Enter a valid date"
        }
      },
      email: {
        label: "Email",
        placeholder: "Email",
        error: {
          required: "Enter email",
          format: "Invalid email"
        }
      },
      phone: {
        label: "Phone Number",
        placeholder: "Phone number",
        error: {
          required: "Enter phone number",
          format: "Invalid phone number"
        }
      }
    }
  },
  home: {
    downloadApp: {
      appName: "Lucky6 APP",
      desc: "All games covered. Smoother, safer, faster experience."
    },
    authSection: {
      notLogin1: "You are not logged in",
      notLogin2: "Login/Register to view"
    },
    game: {
      maintenance: "Under maintenance",
      maintenanceTime: "Maintenance: {start} - {end}"
    },
    notification: {
      announcement: {
        title: "Announcement"
      },
      newVersion: {
        title: "Update Available",
        message: "New version detected. Do you want to update?"
      }
    }
  },
  tianaiCaptcha: {
    tipsError: "Verification failed, please try again!",
    tipsSuccess: "Verification succeeded, took {s} seconds",
    sliderTitle: "Drag the slider to complete the puzzle",
    concatTitle: "Drag the slider to complete the puzzle",
    imageClickTitle: "Please click the images in the correct order",
    rotate_title: "Drag the slider to complete the puzzle"
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
