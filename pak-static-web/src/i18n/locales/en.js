export default {
  layout: {
    header: {
      deposit: "Deposit",
      switch: {
        casino: "casino",
        promotion: "promotions"
      },
      downloadApp: {
        content: "DOWNLOAD",
        highlight: "APP"
      },
      inviteToEarn: {
        content: "INVITE TO",
        highlight: "EARN"
      },
      navigation: {
        slot: "Slots",
        live: "Live Casino",
        fish: "Fishing",
        poker: "Poker",
        sport: "Sports"
      },
      menu: {
        liveSupport: "Live SUpport",
        feedback: "Feedback",
        telegram: "Telegram",
        tikTok: "Tik Tok",
        whatsapp: "Whatsapp",
        language: "Language"
      },
      betRanking: {
        title: "Biggest bet today"
      },
      notLogin: {
        loginButton: "Login",
        registerButton: "Register"
      },
      logoutModal: {
        title: "Logout",
        description: "Confirm to log out?"
      },
      feedbackModal: {
        title: "Post Comments",
        form: {
          type: {
            label: "Type of opinion",
            placeholder: "Please select the opinion type",
            error: {
              required: "Opinion type is required"
            }
          },
          title: {
            label: "Title",
            placeholder: "pleases enter Title",
            error: {
              required: "Title is required",
              max: "Title should be less than 255 characters"
            }
          },
          photo: {
            label: "Upload image"
          },
          content: {
            label: "Content",
            placeholder: "Please enter your feedback",
            error: {
              required: "Content is required",
              max: "Content should be less than 500 characters"
            }
          }
        },
        submitSuccess: "Submit success",
        submitFail: "Submit fail",
        uploadSuccess: "Upload Success",
        uploadFail: "Upload fail",
        confirmButton: "CONFIRM"
      },
      accountModal: {
        login: {
          tab: "Log in",
          forgetPassword: "Forget password",
          submitButton: "SUBMIT"
        },
        register: {
          tab: "Register",
          form: {
            codeAffiliate: {
              label: "Invitation Code (Optional)",
              placeholder: "Enter Invitation Code (Optional)"
            }
          },
          privacyAgreement: {
            label: "I have Agree to the ",
            link: "Use Privacy Agreement"
          },
          submitButton: "SUBMIT"
        },
        verify: {
          title: "Input your verification code",
          description: "Your will receive a verification code with your registered phone number",
          resent: {
            label: "Haven’t receive?",
            button: "Resent"
          },
          submitButton: "SUBMIT"
        },
        forgetPwd: {
          title: "Recover your password",
          infoForm: {
            email: {
              label: "Email",
              placeholder: "Email",
              error: {
                required: "Email is required"
              }
            },
            captcha: {
              label: "Captcha",
              placeholder: "Verification Code",
              error: {
                required: "Verification code is required",
                len: "Length should be 4"
              }
            }
          },
          verifyForm: {
            title: "Input your verification code",
            description: "Your will receive a verification code at your Email",
            code: {
              error: {
                required: "Otp code is required",
                len: "Length should be 6"
              }
            },
            newPassword: {
              label: "New password",
              placeholder: "Password",
              error: {
                required: "Password is required",
                min: "The characters of password must be above 6"
              }
            },
            confirmPwd: {
              label: "Confirm new password",
              placeholder: "Confirm password",
              error: {
                required: "Password confirm is required",
                min: "The characters of password confirm must be above 6",
                validator: "Password not match"
              }
            }
          },
          submitButton: "SUBMIT"
        }
      },
      downloadAppModal: {
        title: "Download APP",
        description: "Open your phone and scan"
      },
      languageModal: {
        title: "Language",
        confirmButton: "CONFIRM"
      },
      common: {
        downloadApp: "Download app"
      }
    },
    footer: {
      logo: "LOGO",
      link: {
        about: "About B9.Game",
        dataCollection: "Collect Information",
        legalGround: "Legal Basis",
        bettingRule: "Betting Rules",
        compensation: "Compensation",
        responsibleGambling: "Gambling Responsibly",
        affiliates: "Affiliates"
      }
    }
  },
  homeView: {
    game: {
      hot: "🔥HOT",
      live: "Live Casino",
      slot: "SLOT",
      fish: "Fish",
      sport: "Sport"
    },
    sectionWrapper: {
      viewAll: "View All"
    },
    announcementModal: {
      title: "Announcements"
    }
  },
  platformView: {
    breadcrumb: "Home"
  },
  hotGameView: {
    breadcrumb: {
      home: "Home",
      title: "🔥Hot"
    }
  },
  personalView: {
    layout: {
      accountMenu: {
        info: "ID: ",
        totalScore: "Total Score",
        action: {
          withdraw: "Withdraw",
          deposit: "Deposit",
          promo: "Promo"
        },
        link: {
          personalCenter: "Personal center",
          record: "Record",
          discount: "Discount",
          bank: "Bank",
          order: "Order",
          message: "Message",
          vip: "VIP"
        }
      }
    },
    personal: {
      title: "Personal center",
      form: {
        email: {
          label: "Email",
          verifyButton: "Verify"
        },
        fullName: {
          label: "Full Name",
          placeholder: "Please enter your full name",
          error: {
            required: "Real name is required",
            pattern: "Only alphabets and numbers are allowed"
          }
        },
        submitButton: "SUBMIT"
      },
      securityModal: {
        title: "Security Verification",
        form: {
          email: {
            placeholder: "Please input email address"
          },
          verificationCode: {
            placeholder: "Verification code",
            verifyButton: "Verify"
          }
        },
        submitButton: "Submit"
      },
      verifyModal: {
        title: "Captcha",
        form: {
          captcha: {
            placeholder: "Captcha",
            error: {
              required: "Please insert captcha"
            }
          }
        },
        verifyButton: "Verify"
      }
    },
    record: {
      title: "Record",
      recordEndTitle: "You have reached the end of the page.",
      betTitle: "Bet",
      platformTitle: "Game Platform"
    },
    order: {
      title: "Transaction Record",
      tab: {
        deposit: {
          title: "Deposit",
          status: {
            pending: "Pending",
            success: "Success",
            supplementSuccess: "Supplement Success",
            closed: "Closed"
          }
        },
        withdraw: {
          title: "Withdraw",
          status: {
            applying: "Applying",
            failed: "Failed",
            success: "Success",
            underReview: "Under review",
            toBePaid: "To be paid",
            paying: "Paying",
            automaticPayment: "Automatic Payment",
            suspend: "Suspend"
          }
        }
      },
      option: {
        "1days": "1 Days",
        "3days": "3 Days",
        "7days": "7 Days"
      }
    },
    discount: {
      title: "Discount",
      amount: "Amount: "
    },
    message: {
      title: "Message",
      list: {
        moreButton: "More",
        unread: "NEW"
      },
      detail: {
        backButton: "Back"
      }
    },
    vip: {
      title: "VIP",
      badge: {
        title: "VIP",
        accumulateDeposit: "Accumulate Deposit: ",
        info: "vip"
      },
      privilege: {
        oneOff: {
          title: "Level Upgrade",
          type: "Reward"
        },
        monthly: {
          title: "Monthly",
          type: "Reward"
        },
        withdrawal: {
          title: "Daily withdrawal",
          type: "Limit"
        }
      },
      rule1: "VIP status can be upgraded by accumulating monthly deposits",
      rule2:
        "After the recharge on the day reaches the standard, the next day will increase the VIP level and issue corresponding upgrade rewards.",
      table: {
        header: {
          experience: "Upgrade Experience",
          oneOffReward: "Upgrade Rewards",
          monthlyReward: "Monthly Rewards"
        }
      }
    },
    bank: {
      title: "Bank",
      addButton: "Add card",
      addModal: {
        title: "Add Bank Card",
        form: {
          bankType: {
            placeholder: {
              crypto: "Crypto",
              bank: "Bank type",
              eWallet: "E-wallet type"
            }
          },
          bankId: {
            placeholder: {
              crypto: "Please select a Crypto",
              bank: "Please select a bank",
              eWallet: "Please select an E-wallet"
            },
            error: {
              required: {
                crypto: "Please select a Crypto card",
                bank: "Please select a bank",
                eWallet: "Please select an E-wallet"
              }
            }
          },
          cardAccount: {
            label: "Holder Name",
            placeholder: "Enter Holder Name",
            error: {
              required: "Card account is required"
            }
          },
          cardNumber: {
            label: {
              wallet: "Wallet",
              cardNumber: "Card Number"
            },
            placeholder: {
              wallet: "Wallet",
              cardNumber: "Card Number"
            },
            error: {
              required: "Please enter card number"
            }
          },
          cardAddress: {
            label: "IFSC Code",
            placeholder: "Enter Bank IFSC Code",
            error: {
              required: "Please enter IFSC Code"
            }
          }
        },
        remind:
          "Warm reminder: If the cardholder’s name does not match, you can contact online customer service to correct the information. Thank you for your support and understanding!",
        confirmButton: "CONFIRM"
      },
      removeModal: {
        title: "Remove {bankName} ?",
        description: "Are you sure you want to remove {bankName} ?"
      }
    },
    finance: {
      deposit: {
        title: "Deposit",
        recharge: "Recharge amount",
        form: {
          label: {
            title: "Amount"
          },
          amount: {
            placeholder: "Enter an amount",
            error: {
              required: "Deposit amount is required",
              pattern: "Amount should be a positive number",
              range: "Deposit should be between {min} - {max}"
            }
          }
        },
        modal: {
          description:
            "You have been redirected to your specific bank to proceed with the deposit.\n\nOnce the deposit is successful, it will be reflected here.",
          confirmButton: "I understand"
        },
        confirmButton: "Confirm Deposit"
      },
      withdraw: {
        title: "Withdraw",
        balance: "Cash balance",
        withdrawable: "Withdrawable",
        method: "Withdrawal Method",
        recommended: "Recommended",
        form: {
          cardId: {
            placeholder: {
              bank: "Select bank card",
              eWallet: "Select E-wallet"
            },
            error: {
              required: {
                bank: "Bank card is required",
                eWallet: "E-wallet is required"
              }
            },
            option: {
              prefix: {
                cardNumber: "Acc No. **** ",
                cardAddress: "IFSC"
              }
            }
          },
          amount: {
            placeholder: "Enter the withdrawal amount",
            error: {
              required: "Amount is required",
              pattern: "Amount should be a positive number"
            }
          },
          label: {
            title: {
              bank: "Bank card",
              eWallet: "E-wallet"
            },
            amount: "Withdraw Amount",
            dailyLimit: "Daily Limit",
            remain: "Remain Wagers",
            amountLimit: "Amount ({min} - {max})"
          }
        },
        confirmButton: "Confirm Withdrawal"
      },
      newUserError: "Please fill in your personal details"
    }
  },
  rewardView: {
    title: "Reward amount",
    tabs: {
      reward: "Reward",
      teamManagement: "Team management",
      teamBetting: "Team betting",
      profitAndLoss: "User profit and loss"
    },
    reward: {
      summary: {
        income: "My Total Income",
        invitees: "My Total Number Of Invitees"
      },
      inviteLink: {
        title: "Invite friends via link",
        description: "How to get invitation bonus",
        step1: "Invite friends via invitation link",
        step2: "Register via link",
        step3: "Complete deposit after registration",
        copyButton: "Copy link",
        copySuccess: "Link copied to clipboard",
        copyFail: "Failed to copy link",
        shareText:
          "B9GAME Share and Earn:\n\tEarn up to 500 Rs per friend.\n\tGet a 5% rebate on your first deposit.\n\tEnjoy a long-term 0.6% rebate on all bets.\nDownload the app now and receive a mystery cash reward!\n{url}",
        shareTitle: "B9GAME Share and Earn"
      },
      earnYesterday: {
        title: "Total amount sent as of yesterday",
        table: {
          header: {
            player: "player",
            money: "money"
          }
        }
      },
      info: {
        bet: "Bet",
        eligibleRefer: "Eligible Refer",
        invite: "Invite",
        topUp: "Top Up"
      },
      bonus: {
        table: {
          header: {
            friendCount: "Friend Count",
            inviteBonus: "Invite Bonus"
          }
        }
      },
      shareModal: {
        title: "Share and Earn"
      }
    },
    teamManagement: {
      searchField: {
        downLine: {
          all: "All Down Lines",
          direct: "Direct Down Lines"
        },
        username: {
          placeholder: "User name"
        },
        searchButton: "Search"
      },
      table: {
        type: "Types",
        username: "Username",
        emark: "Emarks",
        upLine: "Upline Agent",
        registrationDate: "Registration Date",
        balance: "Balance",
        lastLogin: "Last Login Time",
        lastDeposit: "Last Deposit Time"
      }
    },
    teamBetting: {
      searchField: {
        date: {
          today: "Today",
          yesterday: "Yesterday"
        },
        gameType: {
          label: "Game Type",
          options: {
            slot: "Slot",
            live: "Live Casino",
            sport: "Sports",
            fish: "Fish",
            poker: "Poker"
          }
        },
        searchButton: "Search"
      },
      table: {
        vendor: "Vendor",
        gameType: "Game Type",
        betAmount: "Bet Amount",
        winning: "Winning",
        validBet: "Valid Bet",
        balance: "Win/Loss",
        rounds: "Rounds",
        player: "Player"
      }
    },
    profitAndLoss: {
      searchField: {
        date: {
          today: "Today",
          yesterday: "Yesterday",
          "7day": "7-Days"
        },
        username: {
          placeholder: "User name"
        },
        searchButton: "Search"
      },
      table: {
        username: "Username",
        deposit: "Deposit",
        withdraw: "Withdraw",
        bonus: "Bonus",
        validBet: "Valid Bet",
        balance: "Win/Loss",
        rebate: "Player Rebate",
        referral: "Referral",
        profitAndLoss: "Profit And Loss",
        depositFee: "Deposit Fee"
      }
    }
  },
  loginView: {
    forgetPasswordLink: "Forgot password ?",
    loginButton: "Login Now",
    register: {
      description: "Not on B9.GAME yet?",
      link: "Register Now"
    }
  },
  registerView: {
    title: "Register Account",
    privacy: {
      description: "I have Agree to the",
      link: "Use Privacy Agreement"
    },
    registerButton: "Register Now",
    haveAccount: {
      description: "Already a member?",
      link: "Login Now"
    }
  },
  forgotPwdView: {
    title: "FORGOT ACCOUNT & PASSWORD",
    login: {
      description: "Back to",
      link: "Login"
    },
    submitButton: "SUBMIT",
    infoForm: {
      email: {
        label: "Email",
        placeholder: "Email",
        error: {
          required: "Email is required"
        }
      },
      captcha: {
        label: "Captcha",
        placeholder: "Verification Code",
        error: {
          required: "Verification code is required",
          len: "Length should be 4"
        }
      }
    },
    verifyForm: {
      title: "Input your verification code",
      description: "Your will receive a verification code at your Email",
      code: {
        error: {
          required: "Otp code is required",
          len: "Length should be 6"
        }
      },
      newPassword: {
        label: "New password",
        placeholder: "Password",
        error: {
          required: "Password is required",
          min: "The characters of password must be above 6"
        }
      },
      confirmPwd: {
        label: "Confirm new password",
        placeholder: "Confirm password",
        error: {
          required: "Password confirm is required",
          min: "The characters of password confirm must be above 6",
          validator: "Password not match"
        }
      }
    }
  },
  about: {
    about: {
      title: "About us",
      content: ""
    },
    dataCollection: {
      title: "Data Collection",
      content: ""
    },
    legalGround: {
      title: "Legal Grounds",
      content: ""
    },
    bettingRule: {
      title: "Betting Rules",
      content: ""
    },
    compensation: {
      title: "Compensation",
      content: ""
    },
    responsibleGambling: {
      title: "Responsible Gambling",
      content: ""
    }
  },
  common: {
    confirmModal: {
      confirmButton: "CONFIRM",
      cancelButton: "CANCEL"
    },
    noData: {
      title: "No Records",
      description: "Haven’t found any record"
    },
    loading: {
      text: "Loading..."
    },
    form: {
      loginName: {
        label: "Phone",
        placeholder: "Please enter your mobile number",
        error: {
          len: "The phone number must have 11 digits",
          required: "Phone number is required",
          pattern: "The phone number must start with '03'"
        }
      },
      password: {
        label: "password",
        placeholder: "Please enter password",
        error: {
          required: "Please insert password",
          min: "The characters of password must be above 6"
        }
      }
    },
    status: {
      bet: {
        settle: "Settle",
        settled: "Settled",
        betAndSettle: "Bet and Settle",
        cancel: "Cancel",
        rollback: "Rollback",
        patch: "Patch",
        bet: "Bet",
        unsettled: "Unsettled",
        jackpot: "Jackpot",
        bonus: "Bonus"
      }
    }
  },
  promo: {
    all: 'ALL',
    earn: 'EARN',
    hot: 'HOT',
    new_user: 'NEW USER',
    sports: 'SPORTS',
    live: 'LIVE',
    slot: 'SLOT',
    vip: 'VIP'
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
    604: "Logged in successfully",
    707: "Insufficient balance",
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
    1300: "Amount must be a number greater than 0",
    1301: "This card is not supported",
    1302: "This currency is not supported",
    1304: "This number has already been used",
    1305: "Bank not found",
    1306: "Exceeded daily withdrawal time limit",
    1307: "Exceeded daily withdrawal limit",
    1308: "Insufficient balance",
    1309: "Card account does not match member name",
    1401: "OTP sending time exceeded",
    1402: "OTP sending schedule error, please resend OTP",
    1403: "OTP verification error",
    1404: "Failed to send OTP code",
    10000: "Insufficient remaining balance error",
    10001: "Withdrawal error",
    10002: "Deposit error",
    10005: "User has already been used",
    10006: "Name cannot be used",
    10007: "Error entering game room",
    10008: "Error",
    11003: "Deposit failed",
    12100: "Withdraw password not match",
    12101: "The new withdraw password cannot be the same as the old withdraw password",
    13000: "Domain name not found",
    13001: "Cannot query information older than 3 months",
    13002: "Must be within 7 days",
    13003: "End time must be greater than start time",
    14000: "Login name has already been registered",
    14001: "This phone number has already been registered",
    14002: "This email has already been registered",
    14003: "Affiliate code not found",
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
    45000: "Not reaching the minimum withdrawal amount",
    45001: "Received random bonus today"
  }
};
