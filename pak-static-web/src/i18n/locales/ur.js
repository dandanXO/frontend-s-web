export default {
  layout: {
    header: {
      deposit: "ڈیپازت ",
      switch: {
        casino: "کسینو",
        promotion: "پرومو"
      },
      downloadApp: "App ڈاؤن لوڈ کریں",
      inviteToEarn: {
        title: "پیسے کمانے کیلئےدعوت دیں",
        description: "بس اپنا خاص QR کوڈ شیئر کریں"
      },
      navigation: {
        live: "لائیو کیسینو",
        slot: "سلاٹ گیمز",
        fish: "فشنگ/مچھلی پکڑنا",
        sport: "کھیل",
        poker: "پوکر"
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
                len: "لمبائی 4 ہونی چاہیے"
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
          oneOffReward: "اپ گریڈ انعامات",
          monthlyReward: "ماہانہ انعامات"
        }
      }
    },
    bank: {
      title: "بنک",
      addButton: "کارڈ شامل کریں",
      addModal: {
        title: "بینک کارڈ شامل کریں",
        form: {
          bankType: {
            placeholder: {
              crypto: "کرپٹو",
              bank: "بینک کی قسم",
              eWallet: "الیکٹرانک والٹ کی قسم"
            }
          },
          bankId: {
            placeholder: {
              crypto: "براہ کرم ایک کرپٹو کو منتخب کریں",
              bank: "براہ کرم ایک بینک کو منتخب کریں",
              eWallet: "براہ کرم ایک الیکٹرانک والٹ کو منتخب کریں"
            },
            error: {
              required: {
                crypto: "براہ کرم ایک کرپٹو کو منتخب کریں",
                bank: "براہ کرم ایک بینک کو منتخب کریں",
                eWallet: "براہ کرم ایک الیکٹرانک والٹ کو منتخب کریں"
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
              wallet: "والٹ",
              cardNumber: "کارڈ نمبر"
            },
            placeholder: {
              wallet: "والٹ",
              cardNumber: "کارڈ نمبر"
            },
            error: {
              required: "براہ کرم کارڈ نمبر درج کریں"
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
        title: "ہٹائیں {bankName}؟",
        description: "کیا آپ واقعی {bankName} کو ہٹانا چاہتے ہیں؟"
      }
    },
    finance: {
      deposit: {
        title: "ڈیپازت ",
        recharge: "ریچارج رقم",
        form: {
          label: {
            title: "رقم"
          },
          amount: {
            placeholder: "رقم درج کریں",
            error: {
              required: "ودیعت کی رقم درکار ہے",
              pattern: "رقم مثبت ہونی چاہیے",
              range: "وداعت {min} سے {max} کے درمیان ہونی چاہئے"
            }
          }
        },
        modal: {
          description:
            "آپ کو اپنے خاص بینک پر ریڈائریکٹ کر دیا گیا ہے تاکہ وداعت جاری کی جا سکے۔ \n\nوداعت کامیاب ہونے کے بعد، یہاں دکھایا جائے گا۔",
          confirmButton: "میں سمجھتا ہوں"
        },
        confirmButton: "تصدیق کریں وداعت"
      },
      withdraw: {
        title: "نکلوانا",
        balance: "کیش بیلنس",
        withdrawable: "وڈروا کرنے کے قابل",
        method: "وڈروال طریقہ",
        recommended: "تجویز شدہ",
        form: {
          cardId: {
            placeholder: {
              bank: "بینک کارڈ منتخب کریں",
              eWallet: "E-والیٹ منتخب کریں"
            },
            error: {
              required: {
                bank: "بینک کارڈ درکار ہے",
                eWallet: "E-والیٹ درکار ہے"
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
            placeholder: "واپسی کی رقم درج کریں",
            error: {
              required: "واپسی کی رقم درج کریں",
              pattern: "رقم مثبت ہونی چاہیے"
            }
          },
          label: {
            title: {
              bank: "بینک کارڈ",
              eWallet: "E-والیٹ"
            },
            amount: "واپسی کی رقم",
            dailyLimit: "روزانہ حد",
            remain: "باقی ویجرز",
            amountLimit: "رقم ({min} - {max})"
          }
        },
        confirmButton: "تصدیق واپسی"
      },
      newUserError: "براہ کرم اپنی ذاتی تفصیلات بھریں"
    }
  },
  shareView: {
    title: "اِنعام کی رقم",
    summary: {
      income: "میری کل آمدنی",
      invitees: "میرے کل دعوتیوں کی تعداد"
    },
    inviteLink: {
      title: "دوستوں کو لنک کے ذریعے دعوت دیں",
      description: "دعوتی بونس کیسے حاصل کریں۔",
      step1: "دوستوں کو دعوتی لنک کے ذریعے مدعو کریں۔",
      step2: "رجسٹریشن کے لئے لنک استعمال کریں۔",
      step3: "رجسٹریشن کے بعد جمع کروائیں۔",
      copyButton: "لنک کاپی کریں",
      copySuccess: "لنک کلپ بورڈ میں کاپی کر لیا گیا ہے",
      copyFail: "لنک کاپی کرنے میں ناکامی"
    },
    earnYesterday: {
      title: "کل کی موجودہ میزان",
      table: {
        header: {
          player: "کھلاڑی",
          money: "پیسے "
        }
      }
    },
    info: {
      bet: "شرط لگانا",
      eligibleRefer: "اہل ریفر",
      invite: "دعوت دینا",
      topUp: "تاپ اپ"
    },
    bonus: {
      table: {
        header: {
          friendCount: "دوستوں کی تعداد",
          inviteBonus: "دعوتی بونس"
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
    loginButton: "اب لاگ ان کریں",
    register: {
      description: "بھی نویں ہیں؟",
      link: "اب رجسٹر کریں"
    }
  },
  registerView: {
    title: "اکاؤنٹ رجسٹر کریں",
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
      description: "میں راضی ہوں",
      link: "پرائیویسی ایگریمنٹ استعمال کریں"
    },
    registerButton: "اب رجسٹر کریں",
    haveAccount: {
      description: "پہلے سے رکن ہیں؟",
      link: ""
    }
  },
  forgotPwdView: {
    title: "حساب اور پاسورڈ بھول گئے؟",
    login: {
      description: "واپس جائیں",
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
          len: "لمبائی 4 ہونی چاہیے"
        }
      }
    },
    verifyForm: {
      title: "براہ کرم تصدیقی کوڈ کا اندراج کریں",
      description: "آپ کو ایمیل پر تصدیقی کوڈ موصول ہوگا۔",
      code: {
        error: {
          required: "OTP کوڈ درکار ہے",
          len: "لمبائی 6 ہونی چاہیے"
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
          min: "پاسورڈ کی تصدیق کے حروف 6 سے زیادہ ہونے ضروری ہیں۔",
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
      title: "ڈیٹا اکٹھا کرنا",
      content: ""
    },
    legalGround: {
      title: "قانونی بنیاد",
      content: ""
    },
    bettingRule: {
      title: "شرط بازی کے قواعد",
      content: ""
    },
    compensation: {
      title: "تلافی",
      content: ""
    },
    responsibleGambling: {
      title: "بے جواب جواب بازی",
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
