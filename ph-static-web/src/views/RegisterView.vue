<template>
  <div class="login-container">
    <div class="margin-center login-form-wrapper">
      <div class="game-title">
        <span class="menu-title">REGISTER ACCOUNT</span>
      </div>
      <a-tabs
        v-model:activeKey="tabActive"
        class="form-wrapped"
        @change="resetForm"
      >
        <a-tab-pane key="username" tab="Username">
          <a-form ref="formRef" :model="regForm" :rules="rules">
            <a-form-item ref="loginName" name="loginName">
              <a-input v-model:value="regForm.loginName" placeholder="Login name">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="password" name="password">
              <a-input
                :type="togglePwd ? 'password' : 'text'"
                v-model:value="regForm.password"
                placeholder="Password"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
                <template #suffix>
                  <EyeOutlined @click="togglePwd = !togglePwd" v-if="!togglePwd" />
                  <EyeInvisibleOutlined
                    @click="togglePwd = !togglePwd"
                    v-if="togglePwd"
                  />
                </template>
              </a-input>
            </a-form-item>
            <div v-if="regForm.password" class="password-str-div">
              <span
                :class="{
                  'weak-pwd': pwdStrength == 'weak',
                  'normal-pwd': pwdStrength == 'normal',
                  'strong-pwd': pwdStrength == 'strong',
                }"
                >Weak</span
              >
              <span
                :class="{
                  'normal-pwd': pwdStrength == 'normal',
                  'strong-pwd': pwdStrength == 'strong',
                }"
                >Good</span
              >
              <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
            </div>
            <a-form-item ref="confirmPwd" name="confirmPwd">
              <a-input
                :type="togglePwd ? 'password' : 'text'"
                v-model:value="regForm.confirmPwd"
                placeholder="Confirm password"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
                <template #suffix>
                  <EyeOutlined @click="togglePwd = !togglePwd" v-if="!togglePwd" />
                  <EyeInvisibleOutlined
                    @click="togglePwd = !togglePwd"
                    v-if="togglePwd"
                  />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="realName" required name="realName">
              <a-input v-model:value="regForm.realName" placeholder="Real Name">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="telephone" name="telephone" class="inlinerow">
              <a-input
                v-model:value="regForm.telephone"
                placeholder="Mobile Number"
                autocomplete="off"
              >
                <template #prefix>
                  <MobileOutlined />
                  <span style="color: white;">&nbsp;+63</span>
                </template>
              </a-input>
              <button
                :disabled="isOtpSending || regForm.telephone === '' || disable30Sec"
                :style="isOtpSending || regForm.telephone === '' || disable30Sec ? 'opacity: .6; cursor: not-allowed' : ''"
                class="common-btn verification-btn"
                @click="getOtpCode"
              >
                {{ isOtpSending ? "Sending" : "Send OTP" }}
              </button>
            </a-form-item>
            <a-form-item ref="otpCode" required name="otpCode">
              <a-input v-model:value="regForm.otpCode" placeholder="OTP Code">
                <template #prefix>
                  <SafetyCertificateOutlined />
                </template>
              </a-input>
            </a-form-item>
            <!-- <a-form-item ref="birthday" name="birthday">
              <RiCake2Line class="birthday" />
              <a-date-picker
                v-model:value="regForm.birthday"
                value-format="YYYY-MM-DD"
                placeholder="Birthday"
              >
              </a-date-picker>
            </a-form-item> -->
            <a-form-item ref="email" required name="email">
              <a-input v-model:value="regForm.email" placeholder="Email">
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="captchaCode" required name="captchaCode">
              <a-input
                v-model:value="regForm.captchaCode"
                :maxlength="4"
                placeholder="Verification code"
              >
                <template #prefix>
                  <SafetyCertificateOutlined />
                </template>
              </a-input>
              <div class="verification">
                <img :src="verificationImg" />
              </div>
            </a-form-item>
            <a-form-item ref="codeAffiliate" name="codeAffiliate">
              <a-input
                v-if="hasAffiliate"
                v-model:value="regForm.codeAffiliate"
                placeholder="Affiliate Code"
                readonly
                disabled
                ><template #prefix>
                  <QrcodeOutlined />
                </template>
              </a-input>
              <a-input
                v-if="!hasAffiliate"
                v-model:value="regForm.codeAffiliate"
                placeholder="Affiliate Code"
                ><template #prefix>
                  <QrcodeOutlined />
                </template>
              </a-input>
            </a-form-item>
            <div class="txt-center reg-protocol">
              Registration means you have agreed and complied
              <a @click="openUserRegistration" class="pwd-tip" to="#"
                >User Registration Protocol</a
              >
            </div>
            <button
              class="txt-center common-btn login-btn"
              type="submit"
              @click="onSubmit"
            >
              Register Now
            </button>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="mobile" tab="Mobile">
          <a-form ref="formRef" :model="regForm" :rules="rules">
            <a-form-item ref="telephone" name="telephone" class="inlinerow">
              <a-input
                v-model:value="regForm.telephone"
                placeholder="Mobile Number"
                autocomplete="off"
              >
                <template #prefix>
                  <MobileOutlined />
                  <span style="color: white;">&nbsp;+63</span>
                </template>
              </a-input>
              <button
                :disabled="isOtpSending || regForm.telephone === '' || disable30Sec"
                :style="isOtpSending || regForm.telephone === '' || disable30Sec ? 'opacity: .6; cursor: not-allowed' : ''"
                class="common-btn verification-btn"
                @click="getOtpCode"
              >
                {{ isOtpSending ? "Sending" : "Send OTP" }}
              </button>
            </a-form-item>
            <a-form-item ref="otpCode" required name="otpCode">
              <a-input v-model:value="regForm.otpCode" placeholder="OTP Code">
                <template #prefix>
                  <SafetyCertificateOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="password" name="password">
              <a-input
                :type="togglePwd ? 'password' : 'text'"
                v-model:value="regForm.password"
                placeholder="Password"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
                <template #suffix>
                  <EyeOutlined @click="togglePwd = !togglePwd" v-if="!togglePwd" />
                  <EyeInvisibleOutlined
                    @click="togglePwd = !togglePwd"
                    v-if="togglePwd"
                  />
                </template>
              </a-input>
            </a-form-item>
            <div v-if="regForm.password" class="password-str-div">
              <span
                :class="{
                  'weak-pwd': pwdStrength == 'weak',
                  'normal-pwd': pwdStrength == 'normal',
                  'strong-pwd': pwdStrength == 'strong',
                }"
                >Weak</span
              >
              <span
                :class="{
                  'normal-pwd': pwdStrength == 'normal',
                  'strong-pwd': pwdStrength == 'strong',
                }"
                >Good</span
              >
              <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
            </div>
            <a-form-item ref="confirmPwd" name="confirmPwd">
              <a-input
                :type="togglePwd ? 'password' : 'text'"
                v-model:value="regForm.confirmPwd"
                placeholder="Confirm password"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
                <template #suffix>
                  <EyeOutlined @click="togglePwd = !togglePwd" v-if="!togglePwd" />
                  <EyeInvisibleOutlined
                    @click="togglePwd = !togglePwd"
                    v-if="togglePwd"
                  />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="realName" required name="realName">
              <a-input v-model:value="regForm.realName" placeholder="Real Name">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <!-- <a-form-item ref="birthday" name="birthday">
              <RiCake2Line class="birthday" />
              <a-date-picker
                v-model:value="regForm.birthday"
                value-format="YYYY-MM-DD"
                placeholder="Birthday"
              >
              </a-date-picker>
            </a-form-item> -->
            <a-form-item ref="email" required name="email">
              <a-input v-model:value="regForm.email" placeholder="Email">
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="captchaCode" required name="captchaCode">
              <a-input
                v-model:value="regForm.captchaCode"
                :maxlength="4"
                placeholder="Verification code"
              >
                <template #prefix>
                  <SafetyCertificateOutlined />
                </template>
              </a-input>
              <div class="verification">
                <img :src="verificationImg" />
              </div>
            </a-form-item>
            <a-form-item ref="codeAffiliate" name="codeAffiliate">
              <a-input
                v-if="hasAffiliate"
                v-model:value="regForm.codeAffiliate"
                placeholder="Affiliate Code"
                readonly
                disabled
                ><template #prefix>
                  <QrcodeOutlined />
                </template>
              </a-input>
              <a-input
                v-if="!hasAffiliate"
                v-model:value="regForm.codeAffiliate"
                placeholder="Affiliate Code"
                ><template #prefix>
                  <QrcodeOutlined />
                </template>
              </a-input>
            </a-form-item>
            <div class="txt-center reg-protocol">
              Registration means you have agreed and complied
              <a @click="openUserRegistration" class="pwd-tip" to="#"
                >User Registration Protocol</a
              >
            </div>
            <button
              class="txt-center common-btn login-btn"
              type="submit"
              @click="onSubmit"
            >
              Register Now
            </button>
          </a-form>
        </a-tab-pane>
        </a-tabs>
      <div class="txt-center">
        <router-link class="forget-pwd-tip" to="/login">
          Already a member? Login Now
        </router-link>
      </div>
    </div>
    <a-modal width="90%" v-model:visible="isUserRegistrationModalVisible">
      <div class="game-title sub">User Registration Protocol</div>

      <div class="user-protocol">
        <div class="userreg-text title-sub">
          1. Acceptance of the Terms of Service
        </div>
        <p>
          These terms of service are entered into by and between Jolly88
          ("Company", "we" or "us"). The following terms of service,
          (collectively, these "ToS"), govern your access to and use of the
          Website www.Jolly88.com ("Website"), including any content,
          functionality and services offered on or through the Website, whether
          as a guest or a registered user. You acknowledge and agree with our
          terms and conditions with and without reservation.
        </p>
        <p>
          These ToS come into force as soon as You access the Website, by doing
          which You signify to Jolly88.com that You have read these ToS and
          accept them. By using any page of the Websites You signify that You
          agree entirely with these ToS and our Privacy Policy. If you do not
          want to agree to these ToS or the Privacy Policy, you must not access
          or use the Website.
        </p>
        <p>By using this Website, you represent, warrant, and agree that:</p>
        <p>
          You are under no legal disability that would prevent you from forming
          a binding contract with the Company.<br />
          You are at least 18 years of age or such higher minimum legal age of
          majority as stipulated in the laws of jurisdiction applicable to
          You.<br />
          You will provide accurate information to the Company for purposes of
          establishing a user account on this Website.
        </p>

        <p>
          By using this Website, you represent, warrant, and agree that:<br />
          These terms of service are entered into by and between Jolly88
          ("Company", "we" or "us") operating under the license ( ), a limited
          liability company organized under the laws of (insert Jolly88 country
          here), having its registered address at (insert Jolly88 address here).
          The following terms of service, (collectively, these "ToS"), govern
          your access to and use of the Website www.Jolly88.com ("Website"),
          including any content, functionality and services offered on or
          through the Website, whether as a guest or a guest or a registered
          user. You acknowledge and agree with our terms and conditions in with
          and without reservation.
        </p>
        <p>
          You are under no legal disability that would prevent you from forming
          a binding contract with the Company.<br />
          You are at least 18 years of age or such higher minimum legal age of
          majority as stipulated in the laws of jurisdiction applicable to
          You.<br />
          You will provide accurate information to the Company for purposes of
          establishing a user account on this Website.
        </p>
        <div class="userreg-text title-sub">
          2. Your Obligations as a Player
        </div>
        <p>
          By using this Website, you represent, warrant, and agree that:<br />
          In the case of identification of a minor player, the account will be
          closed immediately.<br />
          You will use this Website and your Jolly88.com Account solely and
          exclusively for the purpose of Your genuine participating in the Games
          and not for any financial or other operations, Your participation in
          the Games will be strictly in Your personal non-professional capacity
          for recreational and entertainment reasons only;<br />
          People living or having a permanent or temporary residence in these
          countries are not entitled to register the player's account on
          Jolly88.com, or the use of service Jolly88.com:<br />
          Aruba, Austria, Bonaire, Curacao, French Guiana, French Polynesia,
          Germany, Guernsey, Gibraltar, Hungary, Isle of Man, Jersey,
          Liechtenstein, Luxembourg, Martinique, Reunion, Mayotte, Netherlands,
          Spain, United States, United Kingdom.
        </p>
        <p>
          Residents from the aforementioned territories are prohibited from
          opening an account or in any way use the gaming services offered by
          Jolly88.com.
        </p>

        <p>
          In the jurisprudence of your country or the country where You are
          currently staying gambling and / or games of chance they may be
          prohibited. You are responsible for making sure such restrictions and
          / or bans in their home country or the country in which he resides. It
          is up to You to ensure that You act in accordance with the laws of
          your home country or the country where You currently reside. You have
          no right to use the services with an anonymizing proxy, VPN or the
          like in order to bypass the law resulting from the blockade by
          Jolly88.com countries. In case of violation of these principles
          Jolly88.com reserves the right to block and / or immediately close the
          account and You lose all wins.
        </p>

        <p>
          All information that You provide to Jolly88.com during the term of
          validity of this agreement is true, complete, and correct, and that
          You shall immediately notify Jolly88.com of any change of such
          information;
        </p>

        <p>
          You are solely responsible for reporting and accounting for any taxes
          applicable to You under relevant laws for any winnings that You
          receive from Jolly88.com.
        </p>

        <p>
          Bonus and promotion abuse:<br />
          If Jolly88 notices that any promotional offer is being abused and/or
          our terms are being breached, we may take the following actions
          against such abusers:
        </p>

        <p>
          Revoke and/or cancel any bonuses and confiscate bonus winnings that we
          regard may have been redeemed by misuse of the system or creating
          multiple accounts<br />
          Players found to be abusing bonus offers may be barred from receiving
          further bonuses<br />
          Accounts will have their withdrawals disabled<br />
          Abusing player accounts may be terminated
        </p>

        <p>
          A list of what may be deemed abuse may include but is not limited
          to:<br />
          Using more than one Account or using third-party Account(s)<br />
          Evidence that an offer is being claimed or benefits the same person or
          group of persons, acting in an attempt to defraud us, is considered
          bonus abuse and any potential winnings generated from that offer will
          be canceled/confiscated<br />
          Equal, zero or low margin bets<br />
          Wagering bonuses on excluded games<br />
          Co-operation, collusion or organization of bets from the same
          source<br />
          Manipulation of software, exploitation of loopholes or other technical
          forms of abuse or other behavior which amounts to deliberate
          cheating<br />
          Masking IP address or using a VPN
        </p>

        <div class="userreg-text title-sub">3. Privacy policy</div>
        <p>
          This policy applies to information We collect:<br />
          On this Website.<br />
          In e-mail, text and other electronic messages between you and this
          Website.<br />
          Through mobile and desktop applications you download from this
          Website, which provide dedicated non-browser-based interaction between
          you and this Website.<br />
          When you interact with our advertising and applications on third-party
          Websites and services, if those applications or advertising include
          links to this policy.<br />
          Please read this policy carefully to understand our policies and
          practices regarding your information and how we will treat it. If you
          do not agree with our policies and practices, your choice is not to
          use our Website. By accessing or using this Website, you agree to this
          Privacy Policy. This policy may change from time to time. Your
          continued use of this Website after we make changes is deemed to be
          acceptance of those changes, so please check the policy periodically
          for any updates.
        </p>

        <p>
          From time to time, We may collect several types of information from
          and about users of our Website, including information:<br />
          By which you may be personally identified, such as name, screen name,
          postal address, e-mail address, and telephone number or ANY OTHER
          INFORMATION THE WEBSITE COLLECTS THAT IS DEFINED AS PERSONAL OR
          PERSONALLY IDENTIFIABLE INFORMATION UNDER AN APPLICABLE LAW ("Personal
          Information");<br />
          That is about you individually, but does not identify you; and<br />
          About your internet connection, the equipment you use to access our
          Website and usage details.<br />
          We collect this information:<br />
          Directly from you when you provide it to us;<br />
          Automatically as you navigate through the site. Information collected
          automatically may include usage details, IP addresses and information
          collected through cookies, web beacons and other tracking
          technologies; and<br />
          From third parties, for example, our business partners.<br />
          The information We collect on or through our Website may include:<br />
          Information that you provide by filling in forms on our Website. This
          includes information provided at the time of registering to use our
          Website, subscribing to our service, posting material, or requesting
          further services. We may also ask you for information when you enter a
          contest or promotion sponsored by us, and when you report a problem
          with our Website.<br />
          Records and copies of your correspondence (including e-mail
          addresses), if you contact us.<br />
          Your responses to surveys that we might ask you to complete for
          research purposes.<br />
          Details of transactions you carry out through our Website and of the
          fulfillment of your orders. You may be required to provide financial
          information before placing an order through our Website.<br />
          Your search queries on the Website.<br />
          You also may provide information to be published or displayed
          (hereinafter, "posted") on public areas of the Website, or transmitted
          to other users of the Website or third parties (collectively, "User
          Contributions"). Your User Contributions are posted on and transmitted
          to others at your own risk. Additionally, we cannot control the
          actions of other users of the Website with whom you may choose to
          share your User Contributions. Therefore, we cannot and do not
          guarantee that your User Contributions will not be viewed by
          unauthorized persons.<br />
          In order to make Your visit to the Websites more user-friendly, to
          keep track of visits to the Websites and to improve the service,
          Jolly88.com collects a small piece of information sent from Your
          browser, called a cookie. You can, if You wish, turn off the
          collection of cookies (please refer to Your browser instructions as to
          how to do this). You must note, however, that turning off cookies may
          restrict Your use of the Websites.
        </p>

        <div class="userreg-text title-sub">4. Limitation of liability</div>
        <p>
          You enter the Website and participate in the Games at Your own risk.
          The Website and the Games are provided with a limited warranty.<br />
          Jolly88.com does not guarantee continuous availability and
          functionality of all products. Jolly88.com cannot be held liable for
          any damages, gambling losses or lost winnings, which were caused by
          the unavailability of products offered by Jolly88.com, however we will
          do our due diligence in determining the best outcome for both
          parties.<br />
          Jolly88.com cannot be held liable for damages caused by incorrect,
          delayed, manipulated or improper way of data on the Website.
          Jolly88.com places particular emphasis on the technological and
          financial proper way to store and protect customer data. Despite the
          behavior of such procedures, Jolly88.com is not responsible for
          monitoring the processing of customer information by third parties for
          loss or damage resulting therefrom. In this context, you cannot claim
          any claims with respect to Jolly88.com.<br />
          You are responsible for any damage or loss caused by the breach of the
          ToS or other provisions relating to the Games. You are obliged to
          Jolly88.com to compensation for any third party claims resulting from
          violation of those principles.<br />
          Jolly88.com will not be held liable for your damage or loss, that were
          beyond the normal control and provided by Jolly88.com at the time of
          entry with the exclusion for any liability of damages and losses that
          result from carelessness. Jolly88.com is not responsible for lost
          winnings, however we will do our due diligence in determining the best
          outcome for both parties.<br />
          Without prejudice to the generality of the preceding provision,
          Jolly88.com, its directors, employees, partners, service providers:
        </p>
        <p>
          do not warrant that the software or the Website is/are fit for their
          purpose;<br />
          do not warrant that the software and Website are free from errors;<br />
          do not warrant that the Websites and/or Games will be accessible
          without interruptions;<br />
          shall not be liable for any loss, costs, expenses or damages, whether
          direct, indirect, special, consequential, incidental or otherwise,
          arising in relation to Your use of the Websites or Your participation
          in the Games, however we will do our due diligence in determining the
          best outcome for both parties.
        </p>

        <p>
          You hereby agree to fully indemnify and hold harmless Jolly88.com, its
          directors, employees, partners, and service providers for any cost,
          expense, loss, damages, claims and liabilities to whatever extent
          caused that may arise in relation to Your use of the Website or
          participation in the Games.
        </p>
        <div class="userreg-text title-sub">5. Responsible gaming</div>
        <p>
          On request, we will close any account for a minimum period of 6 months
          during which time it will not be possible for the account to be
          reopened for any reason.<br />
          You can close your account under our responsible gaming self-exclusion
          policy at anytime by contacting our Customer Support team.<br />
          Upon expiry of the self-exclusion period you may request to reopen a
          closed account by contacting our Customer Support team.
        </p>

        <div class="userreg-text title-sub">6. Entire Agreement</div>
        <p>
          The Terms of service and our Privacy Policy constitute the sole and
          entire agreement between you and the Company with respect to the
          Website and supersede all prior and contemporaneous understandings,
          agreements, representations and warranties, both written and oral,
          with respect to the Website.
        </p>

        <div class="userreg-text title-sub">
          7. Changes to the Terms of service
        </div>
        <p>
          We may revise and update these Terms of service from time to time in
          our sole discretion. All changes are effective immediately when we
          post them, and apply to all access to and use of the Website
          thereafter. However, any changes to the dispute resolution provisions
          set forth in Governing Law and Jurisdiction will not apply to any
          disputes for which the parties have actual notice on or prior to the
          date the change is posted on the Website. Your continued use of the
          Website following the posting of revised Terms of service means that
          you accept and agree to the changes. You are expected to check this
          page from time to time so you are aware of any changes, as they are
          binding on you.<br />
          These ToS shall be published in English, and may also be published in
          a number of other languages. All language versions shall reflect the
          same principles. In case of any discrepancy between the English
          language version and the non-English language version of these ToS,
          the English version shall prevail. Your continued use of the Website
          following the posting of revised Terms of service means that you
          accept and agree to the changes. You are expected to check this page
          from time to time so you are aware of any changes, as they are binding
          on you.
        </p>

        <p>Jolly88.com is not affiliated with Valve Corporation or Steam.</p>
      </div>
    </a-modal>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
// import { setMember } from "@/store/index";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  MailOutlined,
  QrcodeOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons-vue";
// import { RiCake2Line } from "vue-remix-icons";
import { register } from "@/api/index/login";
import "@/assets/css/login.scss";
import { getVerificationCode, sendTelephoneOtp } from "@/api/index/login";
import { message } from "ant-design-vue";

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    SafetyCertificateOutlined,
    MobileOutlined,
    MailOutlined,
    // RiCake2Line,
    QrcodeOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
  },
  setup() {
    const router = useRouter();
    const tabActive = ref("username");
    const formRef = ref();
    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      email: "",
      realName: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      otpCodeId: "",
      otpCode: "",
    });
    const verificationImg = ref("");
    onMounted(() => {
      getCode();
      getAffiliateCode();
      getReferralCode();
    });
    const isOtpSending = ref(false)
    const disable30Sec = ref(false)

    const isUserRegistrationModalVisible = ref(false)
    const openUserRegistration = () => {
      isUserRegistrationModalVisible.value = true
    }
    const hasAffiliate = ref(false);
    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true
        regForm.codeAffiliate = affCode;
      }
    }
    const getReferralCode = () => {
      const referralCode = sessionStorage.getItem("REFERRAL_CODE");
      if (referralCode) {
        regForm.referrer = referralCode;
      }
    }
    const getCode = () => {
      regForm.captchaCode = ''
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          regForm.codeId = res.data.id;
        }
      }).catch((e) => {
        console.log(e)
      });
    };
    const getOtpCode = () => {
      isOtpSending.value = true
      regForm.otpCode = ''
      const telephoneDetails =  {
        telephone: regForm.telephone
      }
      sendTelephoneOtp(telephoneDetails).then((res) => {
        if (res.code === 0) {
          regForm.otpCodeId = res.data.codeId;
          disableOtpBtn();
          message.success("OTP Sent")
        }
        isOtpSending.value = false
      }).catch((e) => {
        message.error(e.message);
        isOtpSending.value = false
      });
    };
    let validateName = async (r, v) => {
      if (v === "") {
         return Promise.reject("Login name is required");
      }
      else if (!checkName(v)) {
        return Promise.reject("Only English letters and numbers are allowed.");
      } else {
        return Promise.resolve();
      }
    };
    const checkName = (v) => {
      var alphanumeric = /^[A-Za-z0-9]+$/;
      return v.match(alphanumeric);
    };
    let validatePass = async (r, v) => {
      if (v === "") {
        return Promise.reject('Password is required');
      } else if (v.length < 6 || v.length > 12) {
        return Promise.reject('Password length should be between 6 and 12');
      } else {
        return Promise.resolve();
      }
    };
    let validatePassStrength = (r, v) => {
      var strength = ""
      var pwd = v;
      var result = 0;
      for (var i = 0, len = pwd.length; i < len; ++i) {
        result |= charType(pwd.charCodeAt(i));
      }

      var level = 0;
      for (i = 0; i <= 4; i++) {
        if (result & 1) {
          level++;
        }
        result = result >>> 1;
      }

      // console.log(level);

      if (pwd.length >= 6) {
        switch (level) {
          case 1:
            strength = 'weak';
            break;
          case 2:
            strength = 'normal';
            break;
          case 3:
          case 4:
            strength = 'strong';
            break;
        }
      } else {
        strength = 'weak';
      }
      if (strength === "weak" && pwd.length >= 6) {
        return Promise.reject('The level of password security must be at least good.');
      } else {
        return Promise.resolve();
      }
    }
    let validatePass2 = async (r, v) => {
      if (v === "") {
        return Promise.reject('Confirm password is required');
      } else if (v !== regForm.password) {
        return Promise.reject("Password is not same");
      } else {
        return Promise.resolve();
      }
    };

    let validatePhoneNumber = async (r, v) => {
      var reg = /^\d+$/;
      if (v === '') {
        return Promise.reject('Mobile number is required');
      } else if (!reg.test(v)) {
        return Promise.reject('Only numbers are allowed');
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
      loginName: [
        {
          validator: validateName,
          trigger: "blur",
        },
      ],
      password: [
        // {
        //   required: true,
        //   message: "Password is required",
        //   trigger: "blur",
        // },
        {
          validator: validatePass,
          trigger: "blur",
        },
        {
          validator: validatePassStrength,
          trigger: "blur",
        },
        // {
        //   min: 6,
        //   max: 12,
        //   message: "Length should be 6 to 12",
        //   trigger: "blur",
        // },
      ],
      confirmPwd: [
        // {
        //   required: true,
        //   message: "Confirm password is required",
        //   trigger: "blur",
        // },
        {
          validator: validatePass2,
          trigger: "blur",
        },
      ],
      // telephone: [
      //   {
      //     required: true,
      //     message: "Mobile number is required",
      //     trigger: "blur",
      //   },
      // ],
      telephone: [
        {
          validator: validatePhoneNumber,
          trigger: "blur"
        }
      ],
      // birthday: [
      //   {
      //     required: true,
      //     message: "Birthday is required",
      //     trigger: "change",
      //   },
      // ],
      realName: [
        {
          required: true,
          message: "Real Name is required",
          trigger: "blur"
        }
      ],
      email: [
        {
          required: true,
          message: "Email is required",
          trigger: "blur",
        },
        {
          type: "email",
          message: "Email is not available",
          trigger: "blur",
        },
        {
          max: 50,
          message: "Length should less then 50",
          trigger: "blur",
        },
      ],
      captchaCode: [
        {
          required: true,
          message: "Verification code is required",
          trigger: "blur",
        },
        {
          min: 4,
          max: 4,
          message: "Length should be 4",
          trigger: "change",
        },
      ],
    };
    const loadingRegister = ref(false)
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          const fpPromise = FingerprintJS.load();
          (async () => {
            const fp = await fpPromise;
            const result = await fp.get();
            const excludes = { value: ["timezone", "timeZoneOffset"] };
            const allComponents = { ...result.components };
            excludes.value.forEach((element) => {
              delete allComponents[element];
            });
            const sidParam = FingerprintJS.hashComponents(allComponents);
            regForm.sid = sidParam
            loadingRegister.value = true
            if (tabActive.value === 'mobile') {
              regForm.loginName = regForm.telephone;
            }
              register(regForm)
                .then((response) => {
                  const regResult = response.code;
                  if(regResult === 0) {
                    loadingRegister.value = false
                    message.success("Successfully Registered");
                    //now , reg success return {code: 0} , can not set token ,may be update later
                    // setMember({
                    //   nickName: regForm.loginName,
                    //   token: "123",
                    // });
                    router.push("/login");
                  }
                })
                .catch((error) => {
                console.log("error", error);
                getCode()
                  loadingRegister.value = false
                });
          })();
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
      regForm.loginName = "";
      disable30Sec.value = false;
      isOtpSending.value = false;
    };

    const disableOtpBtn = () => {
      disable30Sec.value = true
      setTimeout(() => disable30Sec.value = false, 30000);
    }

    const pwdStrength = ref()
    const togglePwd = ref(true)
    watch(() => regForm.password, () => {
      pwdStrength.value = '';

      var pwd = regForm.password;
      var result = 0;
      for (var i = 0, len = pwd.length; i < len; ++i) {
        result |= charType(pwd.charCodeAt(i));
      }

      var level = 0;
      for (i = 0; i <= 4; i++) {
        if (result & 1) {
          level++;
        }
        result = result >>> 1;
      }

      // console.log(level);

      if (pwd.length >= 6) {
        switch (level) {
          case 1:
            pwdStrength.value = 'weak';
            break;
          case 2:
            pwdStrength.value = 'normal';
            break;
          case 3:
          case 4:
            pwdStrength.value = 'strong';
            break;
        }
      } else {
        pwdStrength.value = 'weak';
      }

      // console.log(pwdStrength.value);
    });
    return {
      tabActive,
      formRef,
      regForm,
      rules,
      onSubmit,
      resetForm,
      verificationImg,
       hasAffiliate,
      getCode,
      loadingRegister,
      pwdStrength,
      validatePassStrength,
      togglePwd,
      isUserRegistrationModalVisible,
      openUserRegistration,
      validatePhoneNumber,
      isOtpSending,
      getOtpCode,
      disable30Sec,
      disableOtpBtn
    };
  },
});
function charType(num) {
  if (num >= 48 && num <= 57) {
    return 1;
  }
  if (num >= 97 && num <= 122) {
    return 2;
  }
  if (num >= 65 && num <= 90) {
    return 4;
  }
  return 8;
}
</script>

<style lang="scss">
.user-protocol {
  max-height: 70vh;
  overflow: auto;
  .userreg-text {
    margin: 30px auto 40px;
    font-size: 24px;
    font-weight: bold;
    text-align: left;
    &.title-sub {
      font-size: 19px;
      margin: 0 auto 10px;
      text-align: left;
    }
  }
}
.ant-input-group.ant-input-group-compact > *:first-child,
.ant-input-group.ant-input-group-compact
  > .ant-select:first-child
  > .ant-select-selector,
.ant-input-group.ant-input-group-compact
  > .ant-calendar-picker:first-child
  .ant-input,
.ant-input-group.ant-input-group-compact
  > .ant-select-auto-complete:first-child
  .ant-input,
.ant-input-group.ant-input-group-compact
  > .ant-cascader-picker:first-child
  .ant-input,
.ant-input-group.ant-input-group-compact
  > .ant-mention-wrapper:first-child
  .ant-mention-editor,
.ant-input-group.ant-input-group-compact
  > .ant-time-picker:first-child
  .ant-time-picker-input {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.ant-input-group.ant-input-group-compact > *:last-child,
.ant-input-group.ant-input-group-compact
  > .ant-select:last-child
  > .ant-select-selector,
.ant-input-group.ant-input-group-compact
  > .ant-calendar-picker:last-child
  .ant-input,
.ant-input-group.ant-input-group-compact
  > .ant-select-auto-complete:last-child
  .ant-input,
.ant-input-group.ant-input-group-compact
  > .ant-cascader-picker:last-child
  .ant-input,
.ant-input-group.ant-input-group-compact
  > .ant-cascader-picker-focused:last-child
  .ant-input,
.ant-input-group.ant-input-group-compact
  > .ant-mention-wrapper:last-child
  .ant-mention-editor,
.ant-input-group.ant-input-group-compact
  > .ant-time-picker:last-child
  .ant-time-picker-input {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
.ant-cascader-menus {
  background: #22273b;
}
.ant-form-item-control-input-content {
  position: relative;
  .anticon {
    font-size: 14px;
    background: #23263c;
  }
}
.birthday {
  width: 18px;
  fill: #ffffff;
  position: absolute;
  left: 30px;
  top: 12px;
  z-index: 9;
}

.ant-calendar-picker {
  background: #23263c;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  position: relative;
  .ant-input {
    padding-left: 55px;
  }
}

.ant-tabs-bar {
  text-align: center;
}

.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;

  span {
    padding: 8px 3px;
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
  }

  span.weak-pwd {
    background: #ff3131;
  }

  span.normal-pwd {
    background: #f2c037;
    color: #000000;
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: #21ba45;
    font-weight: 600;
  }
}
.ant-steps {
  margin: 10px auto 20px;
}
.ant-steps
  .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-process)
  > .ant-steps-item-container[role="button"]:hover
  .ant-steps-item-icon,
.ant-steps-item-process .ant-steps-item-icon {
  background: #23263c;
  border: #23263c;
}
.ant-steps-item-wait .ant-steps-item-icon {
  background: #42445e;
}
.ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
  color: #888888;
}
.ant-steps
  .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-process)
  > .ant-steps-item-container[role="button"]:hover
  .ant-steps-item-icon
  .ant-steps-icon,
.ant-steps
  .ant-steps-item:not(.ant-steps-item-active)
  > .ant-steps-item-container[role="button"]:hover
  .ant-steps-item-title,
.ant-steps
  .ant-steps-item:not(.ant-steps-item-active)
  > .ant-steps-item-container[role="button"]:hover
  .ant-steps-item-subtitle,
.ant-steps
  .ant-steps-item:not(.ant-steps-item-active)
  > .ant-steps-item-container[role="button"]:hover
  .ant-steps-item-description,
.ant-steps-item-process
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title {
  color: #ffffff;
}
.ant-steps-item-wait
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title {
  color: #888888;
}
.ant-steps-item-finish .ant-steps-item-icon {
  background: #21ba45;
  border: #21ba45;
}
.ant-steps-item-finish
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title::after {
  background: #21ba45;
}
.ant-steps-item-finish
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title {
  color: #21ba45;
}
.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon .anticon {
  font-size: 10px;
}
.reg-protocol {
  margin-bottom: 20px;
}
.pwd-tip {
  color: #db7e42;
  &:hover {
    color: #f59a5d;
  }
}
.inlinerow .ant-form-item-control-input-content {
  display: flex;
  gap: 10px;
  align-items: center; 
}
.verification-btn {
  width: 30%;
}
</style>

<style scoped lang="scss">
.login-btn {
  color: #ffffff;
  background-image: linear-gradient(to right, #de4545, #db7e42);
  border: 0;
  margin: 0 auto;
  display: block;
}
.verification {
  position: absolute;
  right: 20px;
  bottom: 5px;
}
</style>

<style scoped lang="scss">
.verification {
  position: absolute;
  right: 20px;
  bottom: 5px;
}
</style>
