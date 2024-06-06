export default {
  layout: {
    header: {
      deposit: "Deposit",
      switch: {
        casino: "casino",
        promotion: "promotions"
      },
      downloadApp: "DOWNLOAD APP",
      inviteToEarn: {
        title: "Invite to Earn",
        description: "Simply share your exclusive QR code"
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
        whatsapp: "Whatsapp"
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
          form: {
            loginName: {
              label: "Phone",
              error: {
                len: "Invalid phone number",
                required: "Phone number is required"
              },
              placeholder: "Please enter your account or mobile number"
            },
            password: {
              label: "password",
              placeholder: "Please enter password",
              error: {
                required: "Password is required"
              }
            }
          },
          forgetPassword: "Forget password",
          submitButton: "SUBMIT"
        },
        register: {
          tab: "Register",
          form: {
            loginName: {
              label: "Phone",
              error: {
                len: "Invalid phone number",
                required: "Phone number is required"
              },
              placeholder: "Please enter your account or mobile number"
            },
            password: {
              label: "password",
              placeholder: "Please enter password",
              error: {
                required: "Password is required"
              }
            },
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
            loginName: {
              label: "Phone",
              error: {
                len: "Invalid phone number",
                required: "Phone number is required"
              },
              placeholder: "Please enter your account or mobile number"
            },
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
          message: "Message",
          vip: "VIP"
        }
      }
    },
    personal: {
      title: "Personal center",
      form: {
        loginName: {
          label: "Phone number",
          placeholder: "Please enter your nick name"
        },
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
        placeholder: "Login name",
        error: {
          required: "Phone number is required",
          len: "Invalid phone number"
        }
      },
      password: {
        placeholder: "Password",
        error: {
          required: "Password is required"
        }
      }
    },
    forgetPasswordLink: "Forgot password ?",
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
        placeholder: "Login name",
        error: {
          required: "Phone number is required",
          len: "Invalid phone number"
        }
      },
      password: {
        placeholder: "",
        error: {
          required: "Please enter your password"
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
      link: "Login"
    },
    submitButton: "SUBMIT",
    infoForm: {
      loginName: {
        label: "Phone",
        error: {
          len: "Invalid phone number",
          required: "Phone number is required"
        },
        placeholder: "Please enter your account or mobile number"
      },
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
    }
  }
};
