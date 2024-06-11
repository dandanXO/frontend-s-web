<template>
  <a-form ref="formRef" :model="registerForm" :rules="registerFormRules" hide-required-mark>
    <div>
      <a-form-item
        name="loginName"
        :label="$t('layout.header.accountModal.register.form.loginName.label')"
        label-align="left"
      >
        <a-input
          v-model:value="registerForm.loginName"
          :placeholder="$t('layout.header.accountModal.register.form.loginName.placeholder')"
          autocomplete="new-password"
        >
          <template #prefix>
            <RiSmartphoneFill />
            <span style="color: #ffffff">+92</span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        required
        name="password"
        :label="$t('layout.header.accountModal.register.form.password.label')"
        label-align="left"
      >
        <a-input
          v-model:value="registerForm.password"
          type="password"
          placeholder="Password"
          :placeholder="$t('layout.header.accountModal.register.form.password.placeholder')"
          autocomplete="new-password"
          @keypress.enter="onSubmit"
        >
          <template #prefix>
            <RiLock2Fill />
          </template>
        </a-input>
      </a-form-item>
      <!-- <a-form-item
        name="codeAffiliate"
        :label="$t('layout.header.accountModal.register.form.codeAffiliate.label')"
        label-align="left"
      >
        <a-input
          v-model:value="registerForm.codeAffiliate"
          placeholder="codeAffiliate"
          :placeholder="$t('layout.header.accountModal.register.form.codeAffiliate.placeholder')"
          @keypress.enter="onSubmit"
        >
          <template #prefix>
            <img :src="InvitationIcon" />
          </template>
        </a-input>
      </a-form-item> -->
      <!-- TODO: action? -->
      <div class="privacy-agreement">
        <a-checkbox v-model:checked="agreePrivacy">
          {{ $t("layout.header.accountModal.register.privacyAgreement.label") }}
          <a class="pwd-tip" @click="isUserRegistrationModalVisible = true">
            {{ $t("layout.header.accountModal.register.privacyAgreement.link") }}
          </a>
        </a-checkbox>
      </div>
    </div>
    <div>
      <a-button class="common-btn" :loading="loadingRegister" :disabled="!agreePrivacy" @click="onSubmit">
        {{ $t("layout.header.accountModal.register.submitButton") }}
      </a-button>
    </div>
  </a-form>
  <a-modal closable v-model:visible="isUserRegistrationModalVisible" width="90%">
    <div class="game-title sub">User Registration Protocol</div>

    <div class="user-protocol">
      <div class="userreg-text title-sub">1. Acceptance of the Terms of Service</div>
      <p>
        These terms of service are entered into by and between Play4Win ("Company", "we" or "us"). The following terms
        of service, (collectively, these "ToS"), govern your access to and use of the Website www.play4win.cc
        ("Website"), including any content, functionality and services offered on or through the Website, whether as a
        guest or a registered user. You acknowledge and agree with our terms and conditions with and without
        reservation.
      </p>
      <p>
        These ToS come into force as soon as You access the Website, by doing which You signify to play4win.cc that You
        have read these ToS and accept them. By using any page of the Websites You signify that You agree entirely with
        these ToS and our Privacy Policy. If you do not want to agree to these ToS or the Privacy Policy, you must not
        access or use the Website.
      </p>
      <p>By using this Website, you represent, warrant, and agree that:</p>
      <p>
        You are under no legal disability that would prevent you from forming a binding contract with the Company.
        <br />
        You are at least 18 years of age or such higher minimum legal age of majority as stipulated in the laws of
        jurisdiction applicable to You.
        <br />
        You will provide accurate information to the Company for purposes of establishing a user account on this
        Website.
      </p>

      <p>
        By using this Website, you represent, warrant, and agree that:
        <br />
        These terms of service are entered into by and between Play4Win ("Company", "we" or "us") operating under the
        license ( ), a limited liability company organized under the laws of (insert Play4Win country here), having its
        registered address at (insert Play4Win address here). The following terms of service, (collectively, these
        "ToS"), govern your access to and use of the Website www.play4win.cc ("Website"), including any content,
        functionality and services offered on or through the Website, whether as a guest or a guest or a registered
        user. You acknowledge and agree with our terms and conditions in with and without reservation.
      </p>
      <p>
        You are under no legal disability that would prevent you from forming a binding contract with the Company.
        <br />
        You are at least 18 years of age or such higher minimum legal age of majority as stipulated in the laws of
        jurisdiction applicable to You.
        <br />
        You will provide accurate information to the Company for purposes of establishing a user account on this
        Website.
      </p>
      <div class="userreg-text title-sub">2. Your Obligations as a Player</div>
      <p>
        By using this Website, you represent, warrant, and agree that:
        <br />
        In the case of identification of a minor player, the account will be closed immediately.
        <br />
        You will use this Website and your play4win.cc Account solely and exclusively for the purpose of Your genuine
        participating in the Games and not for any financial or other operations, Your participation in the Games will
        be strictly in Your personal non-professional capacity for recreational and entertainment reasons only;
        <br />
        People living or having a permanent or temporary residence in these countries are not entitled to register the
        player's account on play4win.cc, or the use of service play4win.cc:
        <br />
        Aruba, Austria, Bonaire, Curacao, French Guiana, French Polynesia, Germany, Guernsey, Gibraltar, Hungary, Isle
        of Man, Jersey, Liechtenstein, Luxembourg, Martinique, Reunion, Mayotte, Netherlands, Spain, United States,
        United Kingdom.
      </p>
      <p>
        Residents from the aforementioned territories are prohibited from opening an account or in any way use the
        gaming services offered by play4win.cc.
      </p>

      <p>
        In the jurisprudence of your country or the country where You are currently staying gambling and / or games of
        chance they may be prohibited. You are responsible for making sure such restrictions and / or bans in their home
        country or the country in which he resides. It is up to You to ensure that You act in accordance with the laws
        of your home country or the country where You currently reside. You have no right to use the services with an
        anonymizing proxy, VPN or the like in order to bypass the law resulting from the blockade by play4win.cc
        countries. In case of violation of these principles play4win.cc reserves the right to block and / or immediately
        close the account and You lose all wins.
      </p>

      <p>
        All information that You provide to play4win.cc during the term of validity of this agreement is true, complete,
        and correct, and that You shall immediately notify play4win.cc of any change of such information;
      </p>

      <p>
        You are solely responsible for reporting and accounting for any taxes applicable to You under relevant laws for
        any winnings that You receive from play4win.cc.
      </p>

      <p>
        Bonus and promotion abuse:
        <br />
        If Play4Win notices that any promotional offer is being abused and/or our terms are being breached, we may take
        the following actions against such abusers:
      </p>

      <p>
        Revoke and/or cancel any bonuses and confiscate bonus winnings that we regard may have been redeemed by misuse
        of the system or creating multiple accounts
        <br />
        Players found to be abusing bonus offers may be barred from receiving further bonuses
        <br />
        Accounts will have their withdrawals disabled
        <br />
        Abusing player accounts may be terminated
      </p>

      <p>
        A list of what may be deemed abuse may include but is not limited to:
        <br />
        Using more than one Account or using third-party Account(s)
        <br />
        Evidence that an offer is being claimed or benefits the same person or group of persons, acting in an attempt to
        defraud us, is considered bonus abuse and any potential winnings generated from that offer will be
        canceled/confiscated
        <br />
        Equal, zero or low margin bets
        <br />
        Wagering bonuses on excluded games
        <br />
        Co-operation, collusion or organization of bets from the same source
        <br />
        Manipulation of software, exploitation of loopholes or other technical forms of abuse or other behavior which
        amounts to deliberate cheating
        <br />
        Masking IP address or using a VPN
      </p>

      <div class="userreg-text title-sub">3. Privacy policy</div>
      <p>
        This policy applies to information We collect:
        <br />
        On this Website.
        <br />
        In e-mail, text and other electronic messages between you and this Website.
        <br />
        Through mobile and desktop applications you download from this Website, which provide dedicated
        non-browser-based interaction between you and this Website.
        <br />
        When you interact with our advertising and applications on third-party Websites and services, if those
        applications or advertising include links to this policy.
        <br />
        Please read this policy carefully to understand our policies and practices regarding your information and how we
        will treat it. If you do not agree with our policies and practices, your choice is not to use our Website. By
        accessing or using this Website, you agree to this Privacy Policy. This policy may change from time to time.
        Your continued use of this Website after we make changes is deemed to be acceptance of those changes, so please
        check the policy periodically for any updates.
      </p>

      <p>
        From time to time, We may collect several types of information from and about users of our Website, including
        information:
        <br />
        By which you may be personally identified, such as name, screen name, postal address, e-mail address, and
        telephone number or ANY OTHER INFORMATION THE WEBSITE COLLECTS THAT IS DEFINED AS PERSONAL OR PERSONALLY
        IDENTIFIABLE INFORMATION UNDER AN APPLICABLE LAW ("Personal Information");
        <br />
        That is about you individually, but does not identify you; and
        <br />
        About your internet connection, the equipment you use to access our Website and usage details.
        <br />
        We collect this information:
        <br />
        Directly from you when you provide it to us;
        <br />
        Automatically as you navigate through the site. Information collected automatically may include usage details,
        IP addresses and information collected through cookies, web beacons and other tracking technologies; and
        <br />
        From third parties, for example, our business partners.
        <br />
        The information We collect on or through our Website may include:
        <br />
        Information that you provide by filling in forms on our Website. This includes information provided at the time
        of registering to use our Website, subscribing to our service, posting material, or requesting further services.
        We may also ask you for information when you enter a contest or promotion sponsored by us, and when you report a
        problem with our Website.
        <br />
        Records and copies of your correspondence (including e-mail addresses), if you contact us.
        <br />
        Your responses to surveys that we might ask you to complete for research purposes.
        <br />
        Details of transactions you carry out through our Website and of the fulfillment of your orders. You may be
        required to provide financial information before placing an order through our Website.
        <br />
        Your search queries on the Website.
        <br />
        You also may provide information to be published or displayed (hereinafter, "posted") on public areas of the
        Website, or transmitted to other users of the Website or third parties (collectively, "User Contributions").
        Your User Contributions are posted on and transmitted to others at your own risk. Additionally, we cannot
        control the actions of other users of the Website with whom you may choose to share your User Contributions.
        Therefore, we cannot and do not guarantee that your User Contributions will not be viewed by unauthorized
        persons.
        <br />
        In order to make Your visit to the Websites more user-friendly, to keep track of visits to the Websites and to
        improve the service, play4win.cc collects a small piece of information sent from Your browser, called a cookie.
        You can, if You wish, turn off the collection of cookies (please refer to Your browser instructions as to how to
        do this). You must note, however, that turning off cookies may restrict Your use of the Websites.
      </p>

      <div class="userreg-text title-sub">4. Limitation of liability</div>
      <p>
        You enter the Website and participate in the Games at Your own risk. The Website and the Games are provided with
        a limited warranty.
        <br />
        play4win.cc does not guarantee continuous availability and functionality of all products. play4win.cc cannot be
        held liable for any damages, gambling losses or lost winnings, which were caused by the unavailability of
        products offered by play4win.cc, however we will do our due diligence in determining the best outcome for both
        parties.
        <br />
        play4win.cc cannot be held liable for damages caused by incorrect, delayed, manipulated or improper way of data
        on the Website. play4win.cc places particular emphasis on the technological and financial proper way to store
        and protect customer data. Despite the behavior of such procedures, play4win.cc is not responsible for
        monitoring the processing of customer information by third parties for loss or damage resulting therefrom. In
        this context, you cannot claim any claims with respect to play4win.cc.
        <br />
        You are responsible for any damage or loss caused by the breach of the ToS or other provisions relating to the
        Games. You are obliged to play4win.cc to compensation for any third party claims resulting from violation of
        those principles.
        <br />
        play4win.cc will not be held liable for your damage or loss, that were beyond the normal control and provided by
        play4win.cc at the time of entry with the exclusion for any liability of damages and losses that result from
        carelessness. play4win.cc is not responsible for lost winnings, however we will do our due diligence in
        determining the best outcome for both parties.
        <br />
        Without prejudice to the generality of the preceding provision, play4win.cc, its directors, employees, partners,
        service providers:
      </p>
      <p>
        do not warrant that the software or the Website is/are fit for their purpose;
        <br />
        do not warrant that the software and Website are free from errors;
        <br />
        do not warrant that the Websites and/or Games will be accessible without interruptions;
        <br />
        shall not be liable for any loss, costs, expenses or damages, whether direct, indirect, special, consequential,
        incidental or otherwise, arising in relation to Your use of the Websites or Your participation in the Games,
        however we will do our due diligence in determining the best outcome for both parties.
      </p>

      <p>
        You hereby agree to fully indemnify and hold harmless play4win.cc, its directors, employees, partners, and
        service providers for any cost, expense, loss, damages, claims and liabilities to whatever extent caused that
        may arise in relation to Your use of the Website or participation in the Games.
      </p>
      <div class="userreg-text title-sub">5. Responsible gaming</div>
      <p>
        On request, we will close any account for a minimum period of 6 months during which time it will not be possible
        for the account to be reopened for any reason.
        <br />
        You can close your account under our responsible gaming self-exclusion policy at anytime by contacting our
        Customer Support team.
        <br />
        Upon expiry of the self-exclusion period you may request to reopen a closed account by contacting our Customer
        Support team.
      </p>

      <div class="userreg-text title-sub">6. Entire Agreement</div>
      <p>
        The Terms of service and our Privacy Policy constitute the sole and entire agreement between you and the Company
        with respect to the Website and supersede all prior and contemporaneous understandings, agreements,
        representations and warranties, both written and oral, with respect to the Website.
      </p>

      <div class="userreg-text title-sub">7. Changes to the Terms of service</div>
      <p>
        We may revise and update these Terms of service from time to time in our sole discretion. All changes are
        effective immediately when we post them, and apply to all access to and use of the Website thereafter. However,
        any changes to the dispute resolution provisions set forth in Governing Law and Jurisdiction will not apply to
        any disputes for which the parties have actual notice on or prior to the date the change is posted on the
        Website. Your continued use of the Website following the posting of revised Terms of service means that you
        accept and agree to the changes. You are expected to check this page from time to time so you are aware of any
        changes, as they are binding on you.
        <br />
        These ToS shall be published in English, and may also be published in a number of other languages. All language
        versions shall reflect the same principles. In case of any discrepancy between the English language version and
        the non-English language version of these ToS, the English version shall prevail. Your continued use of the
        Website following the posting of revised Terms of service means that you accept and agree to the changes. You
        are expected to check this page from time to time so you are aware of any changes, as they are binding on you.
      </p>

      <p>play4win.cc is not affiliated with Valve Corporation or Steam.</p>
    </div>
  </a-modal>
</template>
<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { userStore } from "@/store/index";
import { RiSmartphoneFill, RiLock2Fill } from "vue-remix-icons";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useRouter } from "vue-router";
import InvitationIcon from "@/assets/images/layout/header/invitation-icon.svg";
import { register } from "@/api/index/login";
import { ElMessage } from "element-plus";
import { validateLoginName } from "@/utils/validator";

const emit = defineEmits(["close-modal"]);

const { t } = useI18n();
const store = userStore();
const router = useRouter();

const formRef = ref();
const agreePrivacy = ref(true);
const isUserRegistrationModalVisible = ref(false);
const loadingRegister = ref(false);
const registerForm = ref({
  loginName: "",
  password: "",
  codeAffiliate: ""
});
const registerFormRules = ref({
  loginName: [{ validator: validateLoginName, trigger: "blur" }],
  password: [{ required: true, message: t("layout.header.accountModal.register.form.password.error.required") }]
});

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      register(registerForm.value)
        .then((response) => {
          const regResult = response.code;
          if (regResult === 0) {
            loadingRegister.value = false;
            ElMessage.success("Successfully Registered");
            store.autoLogin(response.data);
            emit("close-modal");
          }
        })
        .catch((error) => {
          console.log("error", error);
          // getCode()
          loadingRegister.value = false;
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
  // formRef.value
  //   .validate()
  //   .then(() => {
  //     const fpPromise = FingerprintJS.load();
  //     (async () => {
  //       const fp = await fpPromise;
  //       const result = await fp.get();
  //       const excludes = { value: ["timezone", "timeZoneOffset"] };
  //       const allComponents = { ...result.components };
  //       excludes.value.forEach((element) => {
  //         delete allComponents[element];
  //       });
  //       const sid = FingerprintJS.hashComponents(allComponents);
  //       loadingRegister.value = true;
  //       const params = {
  //         loginName: registerForm.value.loginName,
  //         password: registerForm.value.password,
  //         // codeAffiliate: registerForm.value.codeAffiliate,
  //         sid
  //       };

  //       register(params)
  //         .then((response) => {
  //           const regResult = response.code;
  //           if (regResult === 0) {
  //             loadingRegister.value = false;
  //             message.success("Successfully Registered");

  //             // debugger;
  //             if (store.isAffiliateA) {
  //               fbq("track", "signup-success");
  //               fbq("track", "CompleteRegistration");
  //             } else if (store.isAffiliate2) {
  //               fbq("track", "signup-success");
  //               fbq("track", "CompleteRegistration");
  //             } else if (store.isAffiliate3) {
  //               fbq("track", "signup-success");
  //               fbq("track", "CompleteRegistration");
  //             }

  //             store.autoLogin(response.data);

  //             //now , reg success return {code: 0} , can not set token ,may be update later
  //             // setMember({
  //             //   nickName: regForm.loginName,
  //             //   token: "123",
  //             // });
  //             router.push({ path: "/", query: { isFromRegister: true } });
  //           }
  //         })
  //         .catch((error) => {
  //           console.log("error", error);
  //           // getCode()
  //           loadingRegister.value = false;
  //         });
  //     })();
  //   })
  //   .catch((error) => {
  //     console.log("error", error);
  //   });
};
</script>
<style scoped lang="scss">
@import "./style/accountModalTab.scss";

.privacy-agreement {
  .ant-checkbox-wrapper {
    color: #8c968f;
    :deep(.ant-checkbox) {
      .ant-checkbox-inner {
        border-radius: 50%;
      }
    }
    :deep(.ant-checkbox-checked) {
      .ant-checkbox-inner {
        background-color: $primary;
        border-color: $primary;
      }
    }
  }

  a,
  a:hover {
    color: #61ff00;
  }
}
</style>
