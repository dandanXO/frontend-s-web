export default {
  layout: {
    header: {
      deposit: "Deposit",
      switch: {
        casino: "casino",
        promotion: "promotions"
      },
      accountModal: {
        login: {
          tab: "Log in",
          form: {
            loginName: {
              label: "Phone",
              error: {
                len: "Invalid phone number",
                required: "Phone is required"
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
                required: "Phone is required"
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
          description: "Your will receive a verification code with your registered phone number 9099909009",
          resent: {
            label: "Haven’t receive?",
            button: "Resent"
          },
          submitButton: "SUBMIT"
        }
      }
    }
  }
};
