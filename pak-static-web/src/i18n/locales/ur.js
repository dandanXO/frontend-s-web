export default {
  layout: {
    header: {
      deposit: "ڈیپازت ",
      switch: {
        casino: "casino",
        promotion: "پرومو"
      },
      downloadApp: "App ڈاؤن لوڈ کریں",
      inviteToEarn: {
        title: "پیسے کمانے کیلئےدعوت دیں",
        description: "بس اپنا خاص QR کوڈ شیئر کریں"
      },
      menu: {
        liveSupport: "زندہ حمایت",
        feedback: "تاثرات",
        telegram: "Telegram",
        whatsapp: "Whatsapp"
      },
      betRanking: {
        title: "ج کا سب سے بڑا شرط"
      },
      notLogin: {
        loginButton: "لاگ ان",
        registerButton: "رجسٹر"
      },
      logoutModal: {
        title: "رجسٹر",
        description: "تصدیق کریں کہ آپ لاگ آؤٹ کرنا چاہتے ہیں؟"
      },
      feedbackModal: {
        title: "پوسٹ کے تبادلہ",
        form: {
          type: {
            label: "رائے کی قسم",
            placeholder: "براہ کرم رائے کی قسم منتخب کریں",
            error: {
              required: "رائے کی قسم درکار ہے۔"
            }
          },
          title: {
            label: "عنوان",
            placeholder: "براہ کرم عنوان درج کریں۔",
            error: {
              required: "عنوان ضروری ہے۔",
              max: "عنوان 255 حروف سے کم ہونا چاہئے۔"
            }
          },
          photo: {
            label: "تصویر اپلوڈ کریں"
          },
          content: {
            label: "مواد",
            placeholder: "براہ کرم اپنی رائے درج کریں۔",
            error: {
              required: "مواد درکار ہے۔",
              max: "مواد 500 حروف سے کم ہونا چاہئے۔"
            }
          }
        },
        submitSuccess: "جمع کرائی کامیابی",
        submitFail: "جمع کرائی ناکام ہوگئی",
        uploadSuccess: "اپلوڈ کامیاب",
        uploadFail: "اپلوڈ ناکام ہوگیا",
        confirmButton: "تصدیق کریں"
      },
      accountModal: {
        login: {
          tab: "لاگ ان",
          form: {
            loginName: {
              label: "فون نمبر",
              error: {
                len: "فون نمبر 10 ہند سوں پر         مشتمل ہونا چاہیے",
                required: "براہ کرم فون نمبر داخل کریں"
              },
              placeholder: "براہ کرم فون نمبر داخل کریں"
            },
            password: {
              label: "پاس ورڈ",
              placeholder: "براہ کرم فون نمبر پاس ورڈ داخل کریں",
              error: {
                required: "براہ کرم فون نمبر پاس ورڈ داخل کریں"
              }
            }
          },
          forgetPassword: "پاس ورڈ بھول گئے",
          submitButton: "جمع کرایں"
        },
        register: {
          tab: "رجسٹر",
          form: {
            loginName: {
              label: "فون نمبر",
              error: {
                len: "فون نمبر 10 ہند سوں پر         مشتمل ہونا چاہیے",
                required: "براہ کرم فون نمبر داخل کریں"
              },
              placeholder: "براہ کرم فون نمبر داخل کریں"
            },
            password: {
              label: "پاس ورڈ",
              placeholder: "براہ کرم فون نمبر پاس ورڈ داخل کریں",
              error: {
                required: "براہ کرم فون نمبر پاس ورڈ داخل کریں"
              }
            },
            codeAffiliate: {
              label: "دعوتی کوڈ (اختیاری)",
              placeholder: "دعوتی کوڈ درج کریں (اختیاری)"
            }
          },
          privacyAgreement: {
            label: "میں متفق ہوں ",
            link: "پرائیویسی ایگریمنٹ استعمال کریں"
          },
          submitButton: "جمع کرایں"
        },
        verify: {
          title: "براہ کرم تصدیقی کوڈ کا اندراج کریں",
          description: "آپ کو ایک تصدیقی کوڈ آپ کے رجسٹرڈ فون نمبر کے ساتھ موصول ہوگا۔",
          resent: {
            label: "کوئی کوڈ موصول نہیں ہوا؟",
            button: "دوبارہ بھیجیں"
          },
          submitButton: "جمع کرایں"
        },
        forgetPwd: {
          title: "اپنا پاس ورڈ بازیابی کریں",
          infoForm: {
            loginName: {
              label: "فون نمبر",
              error: {
                len: "فون نمبر 10 ہند سوں پر         مشتمل ہونا چاہیے",
                required: "براہ کرم فون نمبر داخل کریں"
              },
              placeholder: "براہ کرم فون نمبر داخل کریں"
            },
            email: {
              label: "ای میل",
              placeholder: "ای میل",
              error: {
                required: "ای میل ضروری ہے"
              }
            },
            captcha: {
              label: "کیپچا",
              placeholder: "تصدیقی کوڈ",
              error: {
                required: "براہ کرم تصدیقی کوڈ کا اندراج کریں",
                len: "Length should be 4"
              }
            }
          },
          verifyForm: {
            title: "براہ کرم تصدیقی کوڈ کا اندراج کریں",
            description: "آپ کو ایک تصدیقی کوڈ آپ کی ای میل پر موصول ہوگا۔",
            code: {
              error: {
                required: "OTP کوڈ ضروری ہے",
                len: "لمبائی 6 ہونی چاہئے"
              }
            },
            newPassword: {
              label: "نیا پاسورڈ",
              placeholder: "پاس ورڈ",
              error: {
                required: "براہ کرم فون نمبر پاس ورڈ داخل کریں",
                min: "پاس ورڈ 6سے …12احروف پر مشتمل ہونا چاہئے"
              }
            },
            confirmPwd: {
              label: "پاسورڈ کی تصدیق کریں",
              placeholder: "پاسورڈ کی تصدیق کریں",
              error: {
                required: "براہ مہربانی تصدیق شدہ پاس ورڈ کا اندراج کریں",
                min: "پاس ورڈ 6سے …12احروف پر مشتمل ہونا چاہئے",
                validator: "پاس ورڈ مطابقت نہین رکھتا"
              }
            }
          },
          submitButton: "جمع کرایں"
        }
      },
      downloadAppModal: {
        title: "App ڈاؤن لوڈ کریں",
        description: "اپنے فون کو کھولیں اور اسکین کریں"
      },
      common: {
        downloadApp: "App ڈاؤن لوڈ کریں"
      }
    },
    footer: {
      logo: "لوگو",
      link: {
        about: "بارے میں B9.Game",
        dataCollection: "معلومات جمع کریں",
        legalGround: "قانونی بنیاد",
        bettingRule: "شرط بازی کے قواعد",
        compensation: "تلافی",
        responsibleGambling: "بے جواب جواب بازی",
        affiliates: "شراکت دار"
      }
    }
  },
  homeView: {
    game: {
      hot: "ہاٹ/اہم",
      live: "لائیو کیسینو",
      slot: "سلاٹ گیمز",
      fish: "فشنگ/مچھلی پکڑنا",
      sport: "کھیل"
    },
    sectionWrapper: {
      viewAll: "تمام دیکھیں"
    },
    announcementModal: {
      title: "اطلاعات"
    }
  },
  platformView: {
    breadcrumb: "گھر/ہوم"
  },
  hotGameView: {
    breadcrumb: {
      home: "گھر/ہوم",
      title: "ہاٹ/اہم"
    }
  },
  personalView: {
    layout: {
      accountMenu: {
        info: "آئی ڈی: ",
        totalScore: "کل اسکور",
        action: {
          withdraw: "نکلوانا",
          deposit: "ڈیپازت ",
          promo: "پرومو"
        },
        link: {
          personalCenter: "شخصی مرکز",
          record: "ریکارڈ",
          discount: "رعایت",
          bank: "بنک",
          message: "پیغام",
          vip: "VIP"
        }
      }
    },
    personal: {
      title: "شخصی مرکز",
      form: {
        loginName: {
          label: "فون نمبر",
          placeholder: "براہ کرم فون نمبر داخل کریں"
        },
        email: {
          label: "ای میل",
          verifyButton: "تصدیق"
        },
        fullName: {
          label: "مکمل نام",
          placeholder: "براہ کرم اپنا مکمل نام کا اندراج کریں",
          error: {
            required: "حقیقی نام ضروری ہے",
            pattern: "صرف حروف اور نمبرز کی اجازت ہے"
          }
        },
        submitButton: "جمع کرایں"
      },
      securityModal: {
        title: "سیکیورٹی تصدیق",
        form: {
          email: {
            placeholder: "براہ کرم ای میل پتا درج کریں۔"
          },
          verificationCode: {
            placeholder: "تصدیقی کوڈ",
            verifyButton: "تصدیق"
          }
        },
        submitButton: "جمع کرایں"
      },
      verifyModal: {
        title: "کیپچا",
        form: {
          captcha: {
            placeholder: "کیپچا",
            error: {
              required: "براہ کرم کیپچا درج کریں"
            }
          }
        },
        verifyButton: "تصدیق"
      }
    },
    record: {
      title: "لین دین کا ریکارڈ",
      tab: {
        deposit: {
          title: "ڈیپازت ",
          status: {
            pending: "زیر التواء",
            success: "کامیاب",
            supplementSuccess: "تکمیل کامیاب",
            closed: "بند"
          }
        },
        withdraw: {
          title: "نکلوانا",
          status: {
            applying: "درخواست دی گئی",
            failed: "ناکام",
            success: "کامیاب",
            underReview: "جائزہ لینے پر ہے",
            toBePaid: "ادائیگی کے لیے",
            paying: "ادائیگی جاری",
            automaticPayment: "خود بخود ادائیگی",
            suspend: "تعطیل"
          }
        }
      }
    },
    discount: {
      title: "رعایت",
      amount: "رقم:"
    },
    message: {
      title: "پیغام",
      list: {
        moreButton: "مزید",
        unread: "نیا"
      },
      detail: {
        backButton: "پیچھے"
      }
    },
    vip: {
      title: "VIP",
      badge: {
        title: "VIP",
        accumulateDeposit: "مجموعی ڈیپازٹ",
        info: "vip"
      },
      privilege: {
        oneOff: {
          title: "لیول اپ گریڈ",
          type: "انعام"
        },
        monthly: {
          title: "ماہانہ",
          type: "انعام"
        },
        withdrawal: {
          title: "روز کے نکالنے کی",
          type: "مقدار"
        }
      },
      rule1: "وی آئی پی کی حیثیت ماہانہ جمع کردہ جمع کرانے سے اپ گریڈ کی جا سکتی ہے",
      rule2: "ایک دن کا ریچارج ستینڈرڈ پہنچنے پر اگلے دن وی ؤی پی لیول بڑھ جائے گا ور انعام بھی اپ گریڈ ہو جائے گا",
      table: {
        header: {
          experience: "تجربہ اپ گریڈ",
          oneOffReward: "Upgrade Rewards",
          monthlyReward: "Monthly Rewards"
        }
      }
    },
    bank: {
      title: "بنک",
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
            label: "ہولڈر کا نام",
            placeholder: "ہولڈر کے نام کا اندراج کریں",
            error: {
              required: "ہولڈر کے نام کا اندراج کریں"
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
            label: "IFSC کوڈ",
            placeholder: "بینک کا IFSC کوڈ درج کریں",
            error: {
              required: "بینک کا IFSC کوڈ درج کریں"
            }
          }
        },
        confirmButton: "تصدیق کریں"
      },
      removeModal: {
        title: "Remove {bankName} ?",
        description: "Are you sure you want to remove {bankName} ?"
      }
    },
    finance: {
      deposit: {
        title: "ڈیپازت ",
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
        title: "نکلوانا",
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
            remain: "باقی ویجرز",
            amountLimit: "Amount ({min} - {max})"
          }
        },
        confirmButton: "Confirm Withdrawal"
      },
      newUserError: "Please fill in your personal details"
    }
  },
  shareView: {
    title: "Reward amount",
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
      copyFail: "Failed to copy link"
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
    }
  },
  loginView: {
    form: {
      loginName: {
        placeholder: "فون نمبر",
        error: {
          required: "براہ کرم فون نمبر داخل کریں",
          len: "فون نمبر 10 ہند سوں پر         مشتمل ہونا چاہیے"
        }
      },
      password: {
        placeholder: "پاس ورڈ",
        error: {
          required: "براہ کرم فون نمبر پاس ورڈ داخل کریں"
        }
      }
    },
    forgetPasswordLink: "پاس ورڈ بھول گئے؟",
    loginButton: "Login Now",
    register: {
      description: "Not on B9.GAME yet?",
      link: "Register Now"
    }
  },
  registerView: {
    title: "Register Account",
    form: {
      loginName: {
        placeholder: "فون نمبر",
        error: {
          required: "براہ کرم فون نمبر داخل کریں",
          len: "فون نمبر 10 ہند سوں پر         مشتمل ہونا چاہیے"
        }
      },
      password: {
        placeholder: "",
        error: {
          required: "براہ کرم فون نمبر پاس ورڈ داخل کریں"
        }
      }
    },
    privacy: {
      description: "I have Agree to the",
      link: "Use Privacy Agreement"
    },
    registerButton: "Register Now",
    haveAccount: {
      description: "Already a member?",
      link: ""
    }
  },
  forgotPwdView: {
    title: "FORGOT ACCOUNT & PASSWORD",
    login: {
      description: "Back to",
      link: "لاگ ان"
    },
    submitButton: "جمع کرایں",
    infoForm: {
      loginName: {
        label: "فون نمبر",
        error: {
          len: "فون نمبر 10 ہند سوں پر         مشتمل ہونا چاہیے",
          required: "براہ کرم فون نمبر داخل کریں"
        },
        placeholder: "براہ کرم فون نمبر داخل کریں"
      },
      email: {
        label: "ای میل",
        placeholder: "ای میل",
        error: {
          required: "ای میل ضروری ہے"
        }
      },
      captcha: {
        label: "کیپچا",
        placeholder: "تصدیقی کوڈ",
        error: {
          required: "براہ کرم تصدیقی کوڈ کا اندراج کریں",
          len: "Length should be 4"
        }
      }
    },
    verifyForm: {
      title: "براہ کرم تصدیقی کوڈ کا اندراج کریں",
      description: "Your will receive a verification code at your Email",
      code: {
        error: {
          required: "Otp code is required",
          len: "Length should be 6"
        }
      },
      newPassword: {
        label: "نیا پاسورڈ",
        placeholder: "پاس ورڈ",
        error: {
          required: "براہ کرم نئے پاس ورڈ کا اندراج کریں",
          min: "پاس ورڈ 6سے …12احروف پر مشتمل ہونا چاہئے"
        }
      },
      confirmPwd: {
        label: "پاسورڈ کی تصدیق کریں",
        placeholder: "پاسورڈ کی تصدیق کریں",
        error: {
          required: "براہ مہربانی تصدیق شدہ پاس ورڈ کا اندراج کریں",
          min: "The characters of password confirm must be above 6",
          validator: "پاس ورڈ مطابقت نہین رکھتا"
        }
      }
    }
  },
  about: {
    about: {
      title: "متعلق",
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
      confirmButton: "تصدیق کریں",
      cancelButton: "کینسل کریں"
    },
    noData: {
      title: "کوئی ریکارڈ موجود نہیں",
      description: "کوئی ریکارڈ  نہیں مل سکا"
    },
    loading: {
      text: "لوڈنگ..."
    }
  }
};
