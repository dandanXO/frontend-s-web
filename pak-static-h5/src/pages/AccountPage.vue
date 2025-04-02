<template>
  <q-page>
    <!-- <ProfileSummary /> -->

    <div class="personal-center-container">
      <ProfileProgressBanner />

      <q-form ref="profileFormRef" class="pc-form">
        <InputRowGrid>
          <template #fields>
            <div
              :class="{ 'item-click': formDetail.realName === null }"
              @click="openPersonalCenterDialog()"
              class="pc-form-item"
            >
              <InputField :label="$t('form.fullName')">
                <template #input>
                  <q-input v-model="formDetail.realName" outlined clearable hide-bottom-space readonly>
                    <template v-slot:append v-if="formDetail.realName === null">
                      <q-icon name="chevron_right" />
                    </template>
                  </q-input>
                </template>
              </InputField>
            </div>

            <div class="pc-form-item" :class="{ 'item-click': !formDetail.emailVerified }" @click="openBindEmailDialog">
              <InputField :label="$t('form.email')">
                <template #input>
                  <q-input v-model="formDetail.email" outlined clearable hide-bottom-space readonly>
                    <template v-slot:append v-if="!formDetail.emailVerified">
                      <q-icon name="chevron_right" />
                    </template>
                  </q-input>
                </template>
              </InputField>
            </div>

            <div class="pc-form-item item-click" @click="openChangePasswordDialog">
              <InputField :label="$t('form.password')">
                <template #input>
                  <q-input v-model="formDetail.phone" outlined clearable hide-bottom-space readonly type="password">
                    <template v-slot:append>
                      <q-icon name="chevron_right" />
                    </template>
                  </q-input>
                </template>
              </InputField>
            </div>

            <div
              class="pc-form-item"
              :class="{ 'item-click': !formDetail.phoneVerified }"
              @click="openVerifyPhoneDialog"
            >
              <InputField :label="$t('form.phone')">
                <template #input>
                  <q-input v-model="formDetail.phone" outlined clearable hide-bottom-space readonly>
                    <template v-if="!formDetail.phoneVerified" v-slot:append>
                      <q-icon name="chevron_right" />
                    </template>
                  </q-input>
                </template>
              </InputField>
            </div>
          </template>
        </InputRowGrid>

        <!--
          <div class="pc-form-label">Full Name</div>
          <div class="pc-form-input">
            <q-input
              v-model="formDetail.realName"
              filled
              dense
              clearable
              borderless
              standout
              hide-bottom-space
              readonly
            ></q-input>
          </div>
        </div>

        <div class="pc-form-item" @click="openPersonalCenterDialog">
          <div class="pc-form-label">Phone</div>
          <div class="pc-form-input">
            <q-input
              v-model="formDetail.phone"
              filled
              dense
              clearable
              borderless
              standout
              hide-bottom-space
              readonly
            ></q-input>
          </div>
        </div>
        -->

        <!-- <div class="pc-form-item" @click="openPersonalCenterDialog">
          <div class="pc-form-label">Email</div>
          <div class="pc-form-input">
            <q-input
              v-model="formDetail.email"
              filled
              dense
              clearable
              borderless
              standout
              hide-bottom-space
              readonly
            ></q-input>
          </div>
        </div> -->

        <div class="pc-tip">
          <div>
            <a class="pc-tip-chg-pwd" @click="openChangePasswordDialog">{{ $t("form.changePassword") }}</a>

            <div class="pc-ver" v-if="appVersionNo">
              Version:
              <span>{{ appVersionNo }}</span>
            </div>
          </div>

          <div>
            <q-btn
              class="btn-refresh"
              no-caps
              icon="refresh"
              :label="$t('btn.updated')"
              :loading="loadingUpdated"
              @click="startRefresh"
            >
              <template v-slot:loading>
                <q-spinner class="on-left" style="color: #00ae00" />
                {{ $t("btn.updating") }}
              </template>
            </q-btn>
          </div>
        </div>

        <!-- <div class="q-mt-md"> -->
        <!-- <PrimaryButton :label="'Sign Out'" :onClick="openConfirmSignOutDialog" /> -->
        <!-- <q-btn rounded flat no-caps class="btn-purple-pattern" @click="openConfirmSignOutDialog">Sign Out</q-btn> -->
        <!-- </div> -->

        <!-- <div class="text-center q-mt-md" v-if="canEdit">
          <q-btn size="md" color="brightbtn" @click="updateState" label="保存信息" />
        </div> -->
      </q-form>

      <!-- <MediaSettingsComponent /> -->
    </div>
  </q-page>
  <!-- <q-dialog width="100%" v-model="showCaptchaDialog">
    <q-card style="width: 100%; padding: 20px" class="bg-dark text-white text-center">
      <q-card-section class="q-mb-md">
        <strong>Tips</strong>
        <br />
        <br />
        Please login to proceed
      </q-card-section>
      <router-link to="/login?redirect=/account"><q-btn label="Confirm" color="brightbtn" /></router-link>
    </q-card>
  </q-dialog> -->

  <q-dialog  v-model="showCaptchaDialog" width="100%">
    <q-card width="100%">
      <q-card-section style="padding: 10px 20px" class="q-pa-md bg-dark text-white">OTP</q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="captchaRef" label="OTP">
            <template v-slot:append>
              <img
                :src="verificationImg"
                title="Click to Refresh OTP"
                style="margin-top: 6px; cursor: pointer"
                @click="getCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="onCaptchaSubmit" label="Send OTP" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog  width="100%" v-model="personalCenterDialog" persistent>
    <div class="popout-dialog">
      <q-btn
        dense
        rounded
        icon="close"
        class="bg-yellow text-black popout-close"
        @click="closePersonalCenterDialog()"
      />
      <div class="popout-dialog-container">
        <div class="txt-title">KYC Info</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">Full Name</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Your Full Name"
                v-model="formDetail.realName"
                :rules="[(_) => isValidName()]"
              />
            </div>
          </div>

          <div class="pc-form-item">
            <div class="pc-form-label">Phone</div>
            <div class="pc-form-input">
              <q-input
                type="number"
                filled
                dense
                clearable
                placeholder="Enter Your Phone"
                v-model="formDetail.phone"
                :rules="[(_) => isValidPhone()]"
                :disable="startCountdownResendOTP"
              >
                <template v-slot:append>
                  <div class="pc-form-side-btn">
                    <q-btn
                      no-caps
                      dense
                      class="bg-yellow text-black"
                      :label="!startCountdownResendOTP && 'Get Code'"
                      :disable="!formDetail.phone || startCountdownResendOTP"
                      @click="openVerificationCodeDialog"
                    />
                  </div>
                </template>
              </q-input>
            </div>
          </div>

          <div v-if="showVerificationTokenInput" class="pc-form-item">
            <div class="pc-form-label">Verification Code</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Verification Code"
                v-model="formDetail.phoneOtpRef"
                :rules="[(_) => isValidOTP()]"
              >
                <template v-slot:append v-if="startCountdownResendOTP">{{ countdownOTP }}s</template>
              </q-input>
            </div>
          </div>

          <div class="pc-form-item">
            <div class="pc-form-label">Email</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Your Email"
                v-model="formDetail.email"
                :rules="[(_) => isValidEmail()]"
              ></q-input>
            </div>
          </div>
        </div>

        <div class="q-mt-md q-pl-lg q-pr-lg">
          <q-btn
            :loading="btnLoading"
            rounded
            flat
            no-caps
            class="btn-purple-pattern"
            :disable="
              !(isValidName() === true && isValidPhone() === true && isValidOTP() === true && isValidEmail() === true)
            "
            @click="submitKYC"
          >
            Submit
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog  width="100%" v-model="bindEmailDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" @click="openBindEmailDialog()" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.bindEmail") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.email')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.email_placeholder')"
                    v-model="updateEmailInfo.email"
                    ref="updateEmailRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => /.+@.+\..+/.test(val) || $t('form.email_rules_02')]"
                  >
                    <template v-slot:append>
                      <div class="pc-form-side-btn">
                        <q-btn
                          no-caps
                          dense
                          flat
                          class="text-green q-pr-md"
                          :label="!startCountdownResendOTP && $t('form.send')"
                          :disable="!formDetail.phone || startCountdownResendOTP"
                          @click="openVerificationCodeDialog"
                        />
                      </div>
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.code')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.code_placeholder')"
                    v-model="updateEmailInfo.code"
                    ref="updateEmailCodeRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => val.length !== 0 || $t('form.code_rules_01')]"
                  >
                    <template v-slot:append v-if="startCountdownResendOTP">{{ countdownOTP }}s</template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitUpdateEmail">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>

        <!-- <div class="q-mt-md q-pl-lg q-pr-lg"> -->
        <!-- <PrimaryButton :label="'Confirm'" :isSmall="true" :onClick="submitUpdatePwd" /> -->
        <!-- <q-btn rounded flat no-caps class="btn-purple-pattern" @click="submitUpdatePwd">Confirm</q-btn> -->
        <!-- </div> -->
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="verifyPhoneDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.verifyPhone") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.phone')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.phone_placeholder')"
                    v-model="updatePhoneInfo.telephone"
                    :readonly="!!formDetail.phone"
                    ref="phoneRef"
                    hide-bottom-space
                    type="text"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                      (val) => (val && val.length === 11) || $t('form.phone_rules_01'),
                      (val) => val.startsWith('03') || $t('form.phone_rules_03')
                    ]"
                  >
                    <template v-slot:append>
                      <div class="pc-form-side-btn">
                        <q-btn
                          no-caps
                          dense
                          class="text-green"
                          :label="!startCountdownResendOTP && $t('form.send')"
                          :disable="startCountdownResendOTP"
                          @click="openPhoneVerificationCodeDialog"
                        />
                      </div>
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.code')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.code_placeholder')"
                    v-model="updatePhoneInfo.code"
                    ref="verifyPhoneCodeRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => val.length !== 0 || $t('form.code_rules_01')]"
                  >
                    <template v-slot:append v-if="startCountdownResendOTP">{{ countdownOTP }}s</template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="sendPhoneDetails">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>

        <!-- <div class="q-mt-md q-pl-lg q-pr-lg"> -->
        <!-- <PrimaryButton :label="'Confirm'" :isSmall="true" :onClick="submitUpdatePwd" /> -->
        <!-- <q-btn rounded flat no-caps class="btn-purple-pattern" @click="submitUpdatePwd">Confirm</q-btn> -->
        <!-- </div> -->
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="changePasswordDialog" presistent>
    <div class="popout-dialog">
      <q-btn
        dense
        rounded
        icon="close"
        class="text-white popout-close"
        @click="openChangePasswordDialog()"
        v-close-popup
      />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.changePassword") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.currentPassword')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.currentPassword_placeholder')"
                    v-model="updatePwdInfo.oldPassword"
                    ref="oldPasswordRef"
                    hide-bottom-space
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[(val) => (val && val.length > 0) || $t('form.currentPassword_rules_01')]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.newPassword')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.newPassword_placeholder')"
                    v-model="updatePwdInfo.password"
                    ref="passwordRef"
                    hide-bottom-space
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('form.newPassword_rules_01'),
                      (val) => val.length > 5 || $t('form.newPassword_rules_02'),
                      (val) => val.length < 13 || $t('form.newPassword_rules_03')
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.confirmNewPassword')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.confirmNewPassword_placeholder')"
                    v-model="updatePwdInfo.confirmNewPwd"
                    ref="confirmPasswordRef"
                    hide-bottom-space
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('form.confirmNewPassword_rules_01'),
                      (val) => val === updatePwdInfo.password || $t('form.confirmNewPassword_rules_02')
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitUpdatePwd">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>

        <!-- <div class="q-mt-md q-pl-lg q-pr-lg"> -->
        <!-- <PrimaryButton :label="'Confirm'" :isSmall="true" :onClick="submitUpdatePwd" /> -->
        <!-- <q-btn rounded flat no-caps class="btn-purple-pattern" @click="submitUpdatePwd">Confirm</q-btn> -->
        <!-- </div> -->
      </div>
    </div>
  </q-dialog>

  <q-dialog  width="100%" v-model="changeNewPasswordDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Change New Password</div>
        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">Login Name</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                v-model="newLoginName"
                disable
                hint="Please remember the login name"
              ></q-input>
              <div class="pc-form-side-btn copy-btn">
                <q-btn
                  no-caps
                  dense
                  class="bg-yellow text-black"
                  @click="copyLoginName"
                  :label="copyActive ? 'Copied' : 'Copy'"
                />
              </div>
            </div>
          </div>

          <div class="pc-form-item">
            <div class="pc-form-label">New Password</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter New Password"
                v-model="updatePwdInfo.password"
                ref="passwordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please insert new password',
                  (val) =>
                    (val.length >= 6 && val.length <= 11) || 'The characters of new password must be between 6 and 11',
                  () => isAlphanumeric(updatePwdInfo.password, 'New password')
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    color="yellow-7"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="pc-form-item">
            <div class="pc-form-label">Confirm New Password</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Confirm New Password"
                v-model="updatePwdInfo.confirmNewPwd"
                ref="confirmPasswordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please insert confirm new password',
                  (val) => val === updatePwdInfo.password || 'Confirm password does not match with new password'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    color="yellow-7"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="q-mt-md q-pl-lg q-pr-lg">
          <q-btn rounded flat no-caps class="btn-purple-pattern" @click="submitUpdateNewPwd">Confirm</q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog  width="100%" v-model="guestKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="closeGuestKYCDialog" />
      <KYCGuestForm @closeGuestKYCDialog="closeGuestKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog  width="100%" v-model="userKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="closeUserKYCDialog" />
      <KYCUserForm ref="kycUserFormRef" @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog  width="100%" v-model="verificationCodeDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.captchaCodeCheck") }}</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">{{ $t("form.captchaCode") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                hide-bottom-space
                dense
                clearable
                :placeholder="$t('form.captchaCode_placeholder')"
                v-model="captchaRef"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.captchaCode_rules_01'),
                  (val) => (val && val.length > 3 && val.length < 5) || $t('form.captchaCode_rules_02')
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onCaptchaSubmit">
            {{ $t("btn.confirm") }}
          </q-btn>
          <!-- <q-btn rounded flat no-caps class="btn-purple-pattern" v-close-popup @click="onCaptchaSubmit">Confirm</q-btn> -->
        </div>
      </div>
    </div>
  </q-dialog>
  <q-dialog width="100%" v-model="verificationPhoneCodeDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.captchaCodeCheck") }}</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">{{ $t("form.captchaCode") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                hide-bottom-space
                dense
                clearable
                :placeholder="$t('form.captchaCode_placeholder')"
                v-model="captchaPhoneRef"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.captchaCode_rules_01'),
                  (val) => (val && val.length > 3 && val.length < 5) || $t('form.captchaCode_rules_02')
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onPhoneCaptchaSubmit">
            {{ $t("btn.confirm") }}
          </q-btn>
          <!-- <q-btn rounded flat no-caps class="btn-purple-pattern" v-close-popup @click="onCaptchaSubmit">Confirm</q-btn> -->
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog  width="100%" v-model="confirmSignOutDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Sign Out</div>

        <div class="txt-content q-mt-md text-center">Are you sure you want to sign out?</div>

        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn label="Cancel" no-caps class="btn-cancel" v-close-popup />
          <q-btn label="Confirm" no-caps class="btn-confirm" @click="logout" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import SwiperNav from "../components/SwiperNav.vue";
import ProfileSummary from "../components/ProfileSummary.vue";
import ProfileProgressBanner from "../components/ProfileProgressBanner.vue";
import { defineComponent, reactive, ref, onMounted, computed, onActivated } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar, copyToClipboard } from "quasar";
import { userStore } from "src/stores";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";
import KYCGuestForm from "../components/KYCGuestForm.vue";
import KYCUserForm from "../components/KYCUserForm.vue";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import PrimaryButton from "src/components/auth/PrimaryButton.vue";
import { t } from "src/boot/lang";
import { useCheckKYC } from "src/hooks/checkKYC";
// import MediaSettingsComponent from "../components/MediaSettingsComponent.vue";

let slideList = ref(["Personal Center", "Discount", "Record", "Order", "Bank", "Message"]);
let slideListPath = ref([
  "/account",
  "/account/discount",
  "/account/record",
  "/account/order",
  "/account/bank",
  "/account/message"
]);
let currentSlide = ref(slideList.value[0]);
const kycUserFormRef = ref(null);

const { userKYCDialog, guestKYCDialog, loadInfo: loadKYCInfo } = useCheckKYC([], kycUserFormRef);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

const logout = () => {
  loadingLogout.value = true;

  $q.loading.show({
    message: t('notify.loggingOut')
  });

  store.memberLogout().then(() => {
    loadingLogout.value = false;
    router.push("/home");
  });
};

const btnLoading = ref(false);

const loadingUpdated = ref(false);

const intervals = ref(null);

const startRefresh = async () => {
  loadingUpdated.value = true;
  loadInfo();

  store.getMemberInfo().then(() => {
    setTimeout(() => {
      loadingUpdated.value = false;
    }, 2000);
  });
};

const personalCenterDialog = ref(false);
const openPersonalCenterDialog = () => {
  loadKYCInfo();
  // if (store.guest && !personalState.memberInfo.realName) {
  //   // openNewChangePasswordDialog();
  //   openGuestKYCDialog();
  // } else if (!store.guest && !personalState.memberInfo.realName) {
  //   openUserKYCDialog();
  // } else {
  //   return false;
  // }
  // } else if (!personalState.memberInfo.realName || !personalState.memberInfo.phone || !personalState.memberInfo.email) {
  //   personalCenterDialog.value = true;
  // }
};

const closePersonalCenterDialog = () => {
  // loadInfo();
  personalCenterDialog.value = false;
};

const changePasswordDialog = ref(false);
const openChangePasswordDialog = () => {
  resetChangePasswordInfo();
  changePasswordDialog.value = !changePasswordDialog.value;
};

const bindEmailDialog = ref(false);
const openBindEmailDialog = () => {
  if (!formDetail.emailVerified) {
    bindEmailDialog.value = !bindEmailDialog.value;
  }
};
const verifyPhoneDialog = ref(false);
const openVerifyPhoneDialog = () => {
  if (formDetail.phoneVerified) {
    return;
  }
  updatePhoneInfo.telephone = formDetail.phone;
  verifyPhoneDialog.value = !verifyPhoneDialog.value;
};

const closeUserKYCDialog = (updateInfo) => {
  store.getMemberInfo().then(() => {
    loadInfo();
    userKYCDialog.value = false;
    if (updateInfo.realName) {
      formDetail.realName = updateInfo.realName;
    }
  });
};

const closeGuestKYCDialog = () => {
  store.getMemberInfo().then(() => {
    loadInfo();
    guestKYCDialog.value = false;
  });

  // formDetail.realName = "";
  // formDetail.phone = "";
  // formDetail.password = "";
};

const changeNewPasswordDialog = ref(false);
const openNewChangePasswordDialog = () => {
  changeNewPasswordDialog.value = true;
  newLoginName.value = store.nickName;
};

const copyActive = ref(false);
const copyLoginName = () => {
  const el = document.createElement("textarea");
  el.value = newLoginName.value;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  copyActive.value = true;
  setTimeout(() => {
    copyActive.value = false;
  }, 2000);
};

const verificationCodeDialog = ref(false);
const openVerificationCodeDialog = () => {
  api
    .get(`/member/checkEmailRegisterStatus?email=${updateEmailInfo.email}`)
    .then((response) => {
      if (response.code === 0) {
        if (response.data) {
          $q.notify({
            color: "negative",
            position: "top",
            message: t('notify.emailAlreadyUsed'),
            icon: "report_problem"
          });
        } else {
          verificationCodeDialog.value = !verificationCodeDialog.value;
        }
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });

  captchaRef.value = "";
  // getCode();

  getCode();
};
const openPhoneVerificationCodeDialog = () => {
  phoneRef.value.validate();
  if (!phoneRef.value.hasError) {
    verificationPhoneCodeDialog.value = !verificationPhoneCodeDialog.value;
    captchaPhoneRef.value = "";
    getCode();
  }
};

const myMemberList = ref([]);
let isNoInfoRef = ref(true);
if (myMemberList.value.length) isNoInfoRef.value = true;

// const isCardActive = ref();
const qs = require("qs");
const $q = useQuasar();
const searchForm = reactive({
  start: "",
  end: ""
});

const profileFormRef = ref();

const store = userStore();
const router = useRouter();

const isEditEmail = ref(false);
const isEditPhone = ref(false);
const isEditBirthday = ref(false);
const loadInfo = () => {
  personalState.memberInfo = userStore();

  loadKYCInfo();
  // if (store.guest && personalState.memberInfo.realName === null) {
  //   // openNewChangePasswordDialog();
  //   openGuestKYCDialog();
  // }

  // if (!store.guest && personalState.memberInfo.realName === null) {
  //   // openPersonalCenterDialog();
  //   openUserKYCDialog();
  // }

  // console.log(personalState.memberInfo);
  if (personalState.memberInfo.birthday > 0) {
    personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("YYYY-MM-DD");
  }
  formDetail.nickName = personalState.memberInfo.nickName;
  formDetail.realName = personalState.memberInfo.realName;
  formDetail.birthday = personalState.memberInfo.birthday;
  formDetail.email = personalState.memberInfo.email;
  formDetail.phone = personalState.memberInfo.phone;
  formDetail.phoneVerified = personalState.memberInfo.phoneVerified;
  formDetail.emailVerified = personalState.memberInfo.emailVerified;

  isEditEmail.value = formDetail.emailVerified === false ? true : false;
  isEditBirthday.value = formDetail.birthday == "" ? true : false;
  isEditPhone.value = formDetail.phoneVerified === false ? true : false;
};

const canEdit = computed(() => {
  if (personalState.memberInfo && (!personalState.memberInfo.realName || !personalState.memberInfo.birthday)) {
    return true;
  }
  return false;
});

const personalState = reactive({
  memberInfo: {}
});
const verificationDetails = reactive({
  memberInfo: {}
});

const appVersionNo = ref(null);
const getVersionNo = async () => {
  if (store.getDeviceType() == "ANDROID") {
    const info = await App.getInfo();
    var current_version = info.version;
    appVersionNo.value = current_version;
  } else if (store.getDeviceType() == "IOS") {
    appVersionNo.value = "iOS v0.3";
  } else {
  }
};

const loadingLogout = ref(false);

onActivated(() => {
  loadInfo();
});

onMounted(() => {
  loadInfo();
  getCode();
  getVersionNo();

  window.location.search.includes("personal") && openPersonalCenterDialog();
});

const verificationImg = ref("");
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
        updateSecurityVerified.codeId = response.data.id;
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });
};
//update security

const isEmailSending = ref(false);
const updateSecurityModalVisible = ref(false);
const updateSecurityFormRef = ref();
const updateSecurityVerified = reactive({
  mobileNumber: "",
  verificationCode: ""
});
const verificationModalVisible = ref(false);
const updateSecurityModal = () => {
  updateSecurityVerified.emailAddress = "";
  updateSecurityVerified.verificationCode = "";
  updateSecurityModalVisible.value = true;
};
const openVerificationModal = () => {
  getCode();
  verificationModalVisible.value = true;
};
const verifyVerificationCode = () => {
  isEmailSending.value = true;
  verificationDetails.memberInfo.email = updateSecurityVerified.emailAddress;
  const emailDetails = {
    email: updateSecurityVerified.emailAddress,
    captchaCode: updateSecurityVerified.captchaCode,
    codeId: updateSecurityVerified.codeId
  };
  api
    .post("/otp/sendEmail", qs.stringify(emailDetails))
    .then((ret) => {
      if (ret.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "OTP验证码已发送至您的邮箱",
          icon: "check_circle_outline"
        });
        verificationDetails.memberInfo.codeId = ret.data.codeId;
        verificationModalVisible.value = false;
        isEmailSending.value = false;
      } else {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: ret.message,
        //   icon: "report_problem"
        // });
        isEmailSending.value = false;
        getCode();
      }
    })
    .catch((e) => {
      getCode();
      isEmailSending.value = false;
    });
};
const emailAddressRef = ref();
const verificationCodeRef = ref();
const submitUpdateSecurity = () => {
  emailAddressRef.value.validate();
  verificationCodeRef.value.validate();
  if (emailAddressRef.value.hasError || verificationCodeRef.value.hasError) {
  } else {
    verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode;
    api
      .post("/otp/verifyEmail", qs.stringify(verificationDetails.memberInfo))
      .then((res) => {
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "验证成功",
            icon: "check_circle_outline"
          });
          updateSecurityModalVisible.value = false;
          loadInfo();
        }
      })
      .catch((e) => {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: e.message,
        //   icon: "report_problem"
        // });
      });
  }
};

const isEditRealName = ref(false);

const isEdit = ref(false);

const formDetail = reactive([]);
const realNameRef = ref();
const birthdayRef = ref();
const emailRef = ref();
const phoneOtpRef = ref();

const captchaRef = ref();
const captchaPhoneRef = ref();
const showCaptchaDialog = ref(false);
const showVerificationTokenInput = ref(false);

const updateState = () => {
  const updateInfo = {};
  updateInfo.realName = formDetail.realName;
  updateInfo.email = formDetail.email;
  updateInfo.phone = formDetail.phone;
  updateInfo.otpCode = formDetail.phoneOtpRef;
  updateInfo.otpCodeId = verificationCodeID;

  api
    .post("/session/verifyAndUpdateAccount", qs.stringify(updateInfo))
    .then((r) => {
      if (r.code === 0) {
        profileFormRef.value.reset();

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.updatedSuccessfully"),
          icon: "check_circle_outline"
        });

        store.getMemberInfo().then(() => {
          loadInfo();
          personalCenterDialog.value = false;
        });
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: r.message,
          icon: "report_problem"
        });
      }
    })
    .catch(() => {})
    .then(() => {
      btnLoading.value = false;
    });
};

const updateNewUserState = () => {
  const updateInfo = {};
  updateInfo.realName = formDetail.realName;

  api
    .post("/session/account", qs.stringify(updateInfo))
    .then((r) => {
      if (r.code === 0) {
        profileFormRef.value.reset();

        $q.notify({
          color: "positive",
          position: "top",
          message: "Updated successfully",
          icon: "check_circle_outline"
        });

        store.getMemberInfo().then(() => {
          loadInfo();
          userKYCDialog.value = false;
        });
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: r.message,
          icon: "report_problem"
        });
      }
    })
    .catch(() => {})
    .then(() => {
      btnLoading.value = false;
    });
};

// const updateNewGuestState = () => {
//   const updateInfo = {};
//   updateInfo.realName = formDetail.realName;
//   updateInfo.phone = formDetail.phone;
//   updateInfo.password = formDetail.password;

//   api
//     .post("/session/guest-password", qs.stringify(updateInfo))
//     .then((r) => {
//       if (r.code === 0) {
//         profileFormRef.value.reset();

//         $q.notify({
//           color: "positive",
//           position: "top",
//           message: "Updated successfully",
//           icon: "check_circle_outline"
//         });

//         store.getMemberInfo().then(() => {
//           loadInfo();
//           guestKYCDialog.value = false;
//         });
//       } else {
//         $q.notify({
//           color: "negative",
//           position: "top",
//           message: r.message,
//           icon: "report_problem"
//         });
//       }
//     })
//     .catch(() => {})
//     .then(() => {
//       btnLoading.value = false;
//     });
// };

const submitKYC = () => {
  btnLoading.value = true;
  updateState();
};

const submitKYCNewUser = () => {
  btnLoading.value = true;
  updateNewUserState();
};

// const submitKYCNewGuest = () => {
//   btnLoading.value = true;
//   updateNewGuestState();
// };

const isValidName = () => {
  const { realName } = formDetail;
  const namePattern = /^[A-Za-z]+[A-Za-z\s]*[A-Za-z]$/;

  const result = !realName
    ? "Please Enter Your Full Name"
    : !namePattern.test(realName)
    ? "Please Enter A Valid Full Name"
    : true;
  return result;
};

const isValidPhone = () => {
  const { phone } = formDetail;

  if (!phone) {
    return "Please Enter Phone Number";
  }

  const phoneRegex = /^\d{11,20}$/;
  const isValid = phoneRegex.test(phone);

  return isValid ? true : "Phone Number must be 11 digits or more";
};

const isValidOTP = () => {
  const { phoneOtpRef } = formDetail;

  const result = !phoneOtpRef ? "Please Enter Verification Code" : true;
  return result;
};

const isValidEmail = () => {
  const { email } = formDetail;
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

  const result = !email
    ? "Please Enter Your Email Address"
    : !emailPattern.test(email)
    ? "Please Enter A Valid Email Address"
    : true;
  return result;
};

const openVerificationDialog = () => {
  getCode();

  showCaptchaDialog.value = true;
};

const goToPage = (page) => {
  router.push(page);
};

let verificationCodeID = "";
const startCountdownResendOTP = ref(false);
const countdownOTP = ref();

const onCaptchaSubmit = () => {
  api
    .post(
      `/otp/sendNewEmail`,
      qs.stringify({
        email: updateEmailInfo.email,
        captchaCode: captchaRef.value,
        codeId: updateSecurityVerified.codeId
      })
    )
    .then((res) => {
      let message = res.message,
        color = "positive";

      if (res.code === 0) {
        verificationCodeDialog.value = false;

        updateEmailInfo.codeId = res.data.codeId;

        showVerificationTokenInput.value = true;
        verificationCodeID = res.data.codeId;
        startCountdownResendOTP.value = true;

        countdownOTP.value = 59;
        let timer = setInterval(() => {
          countdownOTP.value -= 1;
          if (countdownOTP.value === 0) {
            clearInterval(timer);
            startCountdownResendOTP.value = false;
          }
        }, 1000);

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.emailVerificationSent"),
          icon: "check_circle_outline"
        });
      } else {
        if (message) {
          $q.notify({
            color: "negative",
            position: "top",
            message: message,
            icon: "report_problem"
          });
        }
      }
      console.log("onCaptchaSubmit", res);
    });
};
const verificationPhoneCodeDialog = ref(false);
const onPhoneCaptchaSubmit = () => {
  api
    .post(
      `/session/sendRegisteredPhoneOtp`,
      qs.stringify({
        ...(formDetail.phone ? {} : { telephone: updatePhoneInfo.telephone }),
        captchaCode: captchaPhoneRef.value,
        codeId: updateSecurityVerified.codeId
      })
    )
    .then((res) => {
      let message = res.message,
        color = "positive";
      if (res.code === 0) {
        verificationPhoneCodeDialog.value = false;
        startCountdownResendOTP.value = true;

        countdownOTP.value = 59;
        let timer = setInterval(() => {
          countdownOTP.value -= 1;
          if (countdownOTP.value === 0) {
            clearInterval(timer);
            startCountdownResendOTP.value = false;
          }
        }, 1000);

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.smsSent"),
          icon: "check_circle_outline"
        });

        updatePhoneInfo.codeId = res.data.codeId;
      } else color = "negative";

      if (message) $q.notify({ message, color });

      console.log("onCaptchaSubmit", res);
    });
};
const isPwd = ref(true);
const oldPasswordRef = ref();
const passwordRef = ref();
const confirmPasswordRef = ref();
const newLoginName = ref();
const updatePwdInfo = reactive({
  oldPassword: "",
  password: "",
  confirmNewPwd: ""
});

const updateEmailInfo = reactive({
  email: "",
  code: "",
  codeId: ""
});

const updatePhoneInfo = reactive({
  telephone: "",
  code: "",
  codeId: ""
});
const updateEmailRef = ref();
const updateEmailCodeRef = ref();

const isAlphanumeric = (value, translation) => {
  const passwordPattern = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i;
  return passwordPattern.test(value) || `${translation} must be alphanumeric`;
};

const submitUpdatePwd = () => {
  oldPasswordRef.value.validate();
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  if (oldPasswordRef.value.hasError || passwordRef.value.hasError || confirmPasswordRef.value.hasError) {
  } else {
    api
      .post(
        "/session/password",
        qs.stringify({
          oldPassword: updatePwdInfo.oldPassword,
          password: updatePwdInfo.password
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t('notify.newpasswordupdated'),
            icon: "check_circle_outline"
          });
          // router.go("/account");
          resetChangePasswordInfo();
          changePasswordDialog.value = false;
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const submitUpdateEmail = () => {
  updateEmailRef.value.validate();
  updateEmailCodeRef.value.validate();

  if (updateEmailRef.value.hasError || updateEmailCodeRef.value.hasError) {
  } else {
    api
      .post(
        "/session/verifyAndUpdateEmail",
        qs.stringify({
          email: updateEmailInfo.email,
          code: updateEmailInfo.code,
          codeId: updateEmailInfo.codeId
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Email binded successfully",
            icon: "check_circle_outline"
          });
          bindEmailDialog.value = false;
          formDetail.email = updateEmailInfo.email;
          formDetail.emailVerified = true;

          // setTimeout(() => {
          //   startRefresh();
          // }, 2000);
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const phoneRef = ref();
const verifyPhoneCodeRef = ref();
const sendPhoneDetails = () => {
  phoneRef.value.validate();
  verifyPhoneCodeRef.value.validate();

  if (phoneRef.value.hasError || verifyPhoneCodeRef.value.hasError) {
  } else {
    api
      .post(
        "/session/verifyRegisteredPhoneOtp",
        qs.stringify({
          ...(formDetail.phone ? {} : { telephone: updatePhoneInfo.telephone }),
          code: updatePhoneInfo.code,
          codeId: updatePhoneInfo.codeId
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t('notify.phoneVerifySuccessful'),
            icon: "check_circle_outline"
          });
          verifyPhoneDialog.value = false;
          formDetail.phoneVerified = true;
          store.phoneVerified = true;
          // setTimeout(() => {
          //   startRefresh();
          // }, 2000);
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const submitUpdateNewPwd = () => {
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  if (passwordRef.value.hasError || confirmPasswordRef.value.hasError) {
  } else {
    api
      .post(
        "/session/guest-password",
        qs.stringify({
          password: updatePwdInfo.password
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t('notify.newpasswordupdated'),
            icon: "check_circle_outline"
          });
          // router.go("/account");
          changeNewPasswordDialog.value = false;
          store.getMemberInfo();
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const resetChangePasswordInfo = () => {
  updatePwdInfo.confirmNewPwd = "";
  updatePwdInfo.oldPassword = "";
  updatePwdInfo.password = "";
};

const confirmSignOutDialog = ref(false);
const openConfirmSignOutDialog = () => {
  confirmSignOutDialog.value = !confirmSignOutDialog.value;
};
</script>

<style lang="scss" scoped>
.personal-center-container {
  padding: 0 20px 20px;
}

.progress-container {
  // background: linear-gradient(180deg, #d29e3a 0%, #d65033 100%);
}

.infoboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .infoboard-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    width: 22rem;
    margin: 0;

    .left-container {
      width: 100%;

      .infoboard {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        margin: 1rem 0;

        font-family: Helvetica;
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        text-transform: capitalize;
      }
    }

    .right-container {
      img {
        width: 1.75rem;
      }
    }
  }

  img {
    width: 30rem;
  }
}

.bank-card-add {
  position: absolute;
  padding: 0 2rem;
  height: 37rem;
  overflow: auto;
  top: 15rem;
}

.pc-form {
  margin-top: 20px;
  width: 100%;
  .pc-form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;

    &.item-click {
      &:after {
        content: "";
        // background: rgba(255, 255, 255, 0.05);
        background: unset;
        height: calc(100% - 36px);
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 8px;
      }
    }
  }
  .pc-form-label {
    color: rgba(255, 255, 255, 1);
  }
  .pc-form-input {
    border-radius: 5px;
    position: relative;

    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.15) !important;
      border-radius: 4px;
    }

    :deep(.q-field__native) {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .pc-form-side-btn {
    position: relative;
    right: -12px;

    :deep(.q-btn-item) {
      height: 38px;
    }

    &.copy-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

.btn-purple-pattern {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  font-weight: 400;
  width: 100%;
  height: 55px;
  text-transform: uppercase;
  transition: 0.3s all;
  color: #ffffff;
  margin: auto;
  border-radius: 6px;
  border: 1px solid #5e388b;
  background: rgba(88, 23, 170, 0.6);

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.pc-tip-chg-pwd {
  color: #1CCA6A;
}

.pc-tip {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  // flex-direction: column;
  // align-items: flex-end;
}
.pc-ver {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;

  span {
    color: #fae576;
  }
}

.btn-refresh {
  background: #00ae001a;
  border-radius: 8px;
  font-weight: 400;
  margin-top: auto;
  // color: #00ae00;
  padding: 10px 20px;
    background: linear-gradient(90deg, #2CED88 0%, #9EE871 100%);
    color: #333333;
    font-weight: 700;
    box-shadow: 0px 2px 0px 0px #1CCA6A;


  :deep(.q-icon) {
    color: #333333;
  }
}

.btn-cancel {
  // background: radial-gradient(68.92% 68.92% at 50% 50%, #1d341d 0%, #466a45 100%);
  // border: 1px solid #5d8956;
  // font-weight: 700;
  // color: #fff;
  // border: 1px solid #ffffff80;
  // border-radius: 12px;
  // width: 140px;
  // height: 42px;
  font-weight: 700;
  width: 100%;
  padding: 10px 40px;
  font-size: 16px;
  background: #455152;
  color: #ffffff;

  box-shadow: 0px 2px 0px 0px #2A3637;
}
.btn-confirm {
  // background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
  // border: 1px solid #5d8956;
  // font-weight: 700;
  // width: 140px;
  // height: 42px;
  // color: #fff;
  // border-radius: 12px;

  font-weight: 700;
  width: 100%;
  padding: 10px 40px;
  font-size: 16px;
  background: linear-gradient(90deg, #2CED88 0%, #9EE871 100%);
  color: #000000;
  box-shadow: 0px 2px 0px 0px #1CCA6A;
  border-radius: 4px;
  height: unset;
}

.bottom-btn {
  display: flex;
  width: 100%;
  margin-top: 20px;
}
</style>
