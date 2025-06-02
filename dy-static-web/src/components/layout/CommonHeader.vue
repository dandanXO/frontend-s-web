<template>
  <header class="header-container" :class="scroll > 40 ? 'on-scrolled' : ''">
    <div class="top-bar-wrapper">
      <div class="top-bar-inner" :class="store.token ? 'login-bar-inner' : ''">
        <div class="timebox">{{ todayDate() }}</div>
        <div class="station-notice-container">
          <div class="station-notice-box">
            <!-- Since svg icons do not carry any attributes by default -->
            <!-- You need to provide attributes directly -->
            <div>
              <div class="announcment-icon" @click="openPopup(announcementList)" />
            </div>
            <div class="station-notice" v-if="announcementList.length > 0">
              <Vue3Marquee
                :clone="false"
                :duration="calculateMaxContentLength() < 30 ? calculateMaxContentLength() * 1 : 70"
                style="width: 720px"
              >
                <div
                  v-for="(word, index) in announcementList"
                  :key="index"
                  v-html="word.content"
                  @click="openPopup(word)"
                  class="station-notice-item"
                ></div>
              </Vue3Marquee>
            </div>

            <template v-if="store.token">
              <div class="mailbox-notify" @click="checkMailboxUnread">
                <router-link to="/center/mailbox">
                  <div class="mail-icon" />
                  <div v-if="store.unreadTotal > 0" class="notify-red"></div>
                </router-link>
              </div>
            </template>
          </div>
        </div>
        <div v-if="!store.token" class="right-contents">
          <a class="common-btn grey" @click="openLoginDialog">登录</a>
          <a class="common-btn" @click="openRegisterDialog">开设账户</a>
          <a class="common-link" @click="openForgotDialog">忘记账号？</a>
        </div>
        <div class="details" v-if="store.token">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <el-tag size="small" type="warning" effect="dark" style="margin-right: 10px; font-weight: bold">
                {{ store.vip ? store.vip : store.vip }}
              </el-tag>
              {{ store.nickName }}
              <el-icon class="el-icon--right">
                <arrow-down style="height: 0.8em" />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">
                  <div class="personal-info-icon" />
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <div class="deposit-icon" />
                  充值中心
                </el-dropdown-item>
                <el-dropdown-item command="c">
                  <div class="transfer-icon" />
                  快速转账
                </el-dropdown-item>
                <el-dropdown-item command="d">
                  <div class="promotion-icon" />
                  优惠领取
                </el-dropdown-item>
                <el-dropdown-item divided command="e">
                  <div class="logout-icon" />
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <a @click="refreshBalance" class="balance-amt">
            <span>余额：</span>
            <span class="amount">
              <span v-if="isLoadingBalance">Loading...</span>
              <span v-if="!isLoadingBalance">{{ store.currency.value }} {{ store.balance.toFixed(2) }}</span>
            </span>
            <el-icon>
              <Refresh />
            </el-icon>
          </a>
          <div class="top-deposit">
            <router-link to="/center/deposit" class="common-btn">充值</router-link>
          </div>
          <div class="top-deposit">
            <router-link to="/center/withdraw" class="common-btn">提款</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="top-nav-wrapper" @mouseleave="selectedMenu = ''">
      <div class="top-nav-inner">
        <router-link class="logospon" to="/home">
          <img src="../../assets/logo.png" />
          <div class="seperator"></div>
          <img src="../../assets/images/lions_sponsor.png" />
        </router-link>
        <div class="navigations">
          <div class="header-menu-item" v-for="nav in navigations" :key="nav.name">
            <!--            <a v-if="nav.code === 'Agent'" :class="{ icon: nav.hasicon }" :href="nav.path" target="_blank">-->
            <!--              <div class="nav-affiliate-icon" />-->
            <!--              <span>{{ nav.name }}</span>-->
            <!--            </a>-->
            <router-link
              @mouseover="showSubMenu(nav)"
              @mouseup="selectedMenu = ''"
              :to="nav.path"
              :class="{ icon: nav.hasicon }"
            >
              <template v-if="nav.hasicon">
                <span>
                  <div class="nav-affiliate-icon" v-if="nav.code === 'Agent'" />
                  <div class="nav-promotion-icon" v-if="nav.code === 'Promotion'" />
                  <div class="nav-sponsor-icon" v-if="nav.code === 'Sponsor'" />
                  <div class="nav-app-icon" v-if="nav.code === 'App'" />
                  <div class="nav-vip-icon" v-if="nav.code === 'VIP'" />
                </span>
                <span>{{ nav.name }}</span>
              </template>
              <template v-else>
                <span>{{ nav.name }}</span>
                <span>{{ nav.enName }}</span>
              </template>
            </router-link>
          </div>

          <div @mousetouch="selectedMenu = ''" class="sub-menu" :style="'height:' + height + 'px;'">
            <GameMenu ref="el" v-if="selectedMenu === 'Slots'" />
            <EsportsMenu ref="el" v-if="selectedMenu === 'Esports'" @load-modal="openGame" />
            <SportsMenu ref="el" v-if="selectedMenu === 'Sports'" @load-modal="openGame" />
            <LiveCasinoMenu ref="el" v-if="selectedMenu === 'Live Casino'" @load-modal="openGame" />
            <LotteryMenu ref="el" v-if="selectedMenu === 'Lottery'" @load-modal="openGame" />
            <PokerMenu ref="el" v-if="selectedMenu === 'Poker'" @load-modal="openGame" />
            <FishingMenu ref="el" v-if="selectedMenu === 'Fishing'" @load-modal="openGame" />
            <PromotionMenu ref="el" v-if="selectedMenu === 'Promotion'" />
            <AppMenu ref="el" v-if="selectedMenu === 'App'" />
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="noPadding login-dialog"
      v-model="loginDialogVisible"
      align-center
      width="1280px"
      style="max-width: 1200px"
      @close="store.loginPageVisible = false"
    >
      <div class="login-container">
        <div class="content-form">
          <div class="dialog-title">登录</div>
          <span>
            <el-tabs v-model="activeLoginTab">
              <el-tab-pane label="账户登录" name="accLogin">
                <el-form
                  ref="loginRef"
                  :rules="loginRules"
                  :model="loginForm"
                  label-width="100"
                  label-suffix=":"
                  class="form-content"
                >
                  <!-- <el-row>
                    <el-col>
                      <span class="title">会员登录</span>
                    </el-col>
                  </el-row> -->
                  <el-form-item tabindex="1" label="用户名" prop="loginName">
                    <el-input v-model="loginForm.loginName" placeholder="输入用户名" />
                  </el-form-item>
                  <el-form-item tabindex="2" label="密码" prop="password">
                    <el-input v-model="loginForm.password" placeholder="输入密码" type="password" show-password />
                  </el-form-item>
                  <el-form-item tabindex="3" label="验证码" prop="captchaCode">
                    <el-row style="justify-content: start; align-items: center">
                      <!-- <el-col :span="12">
                        <el-input
                          v-model="loginForm.captchaCode"
                          label="验证码"
                          placeholder="验证码"
                          @keyup.enter="submitLogin"
                        />
                      </el-col> -->
                      <el-col :span="24">
                        <div id="captchaContainer"></div>
                        <!-- <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" /> -->
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-button
                    :loading="loadingBtn"
                    size="large"
                    color="#3bafda"
                    class="common-btn"
                    style="margin-left: 100px"
                    @click="submitLogin"
                  >
                    登录
                  </el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="手机登录" name="phoneLogin">
                <el-form
                  ref="mobileLoginRef"
                  :rules="mobileLoginRules"
                  :model="loginForm"
                  label-width="100"
                  label-suffix=":"
                  class="form-content"
                >
                  <el-form-item tabindex="1" label="手机号" prop="phoneNumber">
                    <el-input v-model="loginForm.phoneNumber" placeholder="输入手机号" />
                  </el-form-item>
                  <el-form-item tabindex="2" label="验证码" prop="code">
                    <el-row :gutter="10" style="justify-content: center; align-items: center">
                      <el-col :span="12">
                        <el-input
                          v-model="loginForm.code"
                          label="验证码"
                          placeholder="验证码"
                          @keyup.enter="phoneLogin"
                        />
                      </el-col>
                      <el-col :span="12">
                        <el-button
                          v-if="loginCountdown === 0"
                          @click="openCaptchaForm('LOGIN')"
                          size="small"
                          color="#3bafda"
                        >
                          发送验证码
                        </el-button>
                        <el-button v-else disabled size="small" class="common-btn">
                          已发送（倒数{{ loginCountdown }}秒）
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-button
                    :loading="loadingBtn"
                    size="large"
                    color="#3bafda"
                    class="common-btn"
                    style="margin-left: 100px"
                    @click="phoneLogin"
                  >
                    登录
                  </el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </span>
        </div>
        <div class="details-form">
          <div class="title"></div>
          <ul class="tips">
            <li>注册立即畅游，精彩赛事尽在东赢电竞！</li>
          </ul>

          <div
            class="toggle-side toggle-side--reg"
            @click="
              registerDialogVisible = true;
              loginDialogVisible = false;
            "
          >
            开设账户
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      class="noPadding register-dialog"
      v-model="registerDialogVisible"
      width="1280px"
      align-center
      style="max-width: 1200px"
      @close="store.regPageVisible = false"
    >
      <div class="login-container">
        <div class="details-form">
          <div class="title-reg"></div>
          <ul class="tips">
            <li>标记有 * 者为必填项目。</li>
            <li>手机号码为找回密码的重要凭证，请务必填写真实信息。</li>
            <li>若公司有其他活动会邮件通知您，请您务必填写真实有效的邮箱。"</li>
          </ul>

          <div
            class="toggle-side toggle-side--login"
            @click="
              loginDialogVisible = true;
              registerDialogVisible = false;
            "
          >
            登录
          </div>
        </div>
        <div class="content-form">
          <el-form ref="registerRef" :rules="regRules" :model="regForm" label-width="100" class="form-content-reg">
            <div class="dialog-title">注册账号</div>

            <el-form-item label="姓名" prop="realName">
              <el-space>
                <el-input
                  class="wTip"
                  v-model="regForm.realName"
                  placeholder="输入姓名"
                  :rules="[
                    { required: true, message: '请输入姓名' },
                    {
                      pattern: '^([\u4e00-\u9fa5·]*)$',
                      message: '请输入中文字符',
                      trigger: 'change'
                    }
                  ]"
                >
                  <template #append>范围在 2-12 位之间，由中文字符组成</template>
                </el-input>
              </el-space>
            </el-form-item>

            <el-form-item label="用户名" prop="loginName">
              <el-space>
                <el-input class="wTip" v-model="regForm.loginName" placeholder="输入用户名">
                  <template #append>范围在 4-11 位之间，由字母和数字组成</template>
                </el-input>
              </el-space>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-space>
                <el-input class="wTip" v-model="regForm.password" placeholder="输入密码" type="password" show-password>
                  <template #append>密码范围在 6-12 位之间，由字母和数字组成</template>
                </el-input>
              </el-space>
              <el-row>
                <!-- <div v-if="regForm.password" class="password-str-div">
                  <span
                    :class="{
                      'weak-pwd': pwdStrength == 'weak',
                      'normal-pwd': pwdStrength == 'normal',
                      'strong-pwd': pwdStrength == 'strong'
                    }"
                  >
                    弱
                  </span>
                  <span
                    :class="{
                      'normal-pwd': pwdStrength == 'normal',
                      'strong-pwd': pwdStrength == 'strong'
                    }"
                  >
                    好
                  </span>
                  <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">
                    强
                  </span>
                </div> -->
              </el-row>
            </el-form-item>
            <!-- <el-form-item label="密码" prop="password">
              <el-space>
                  <el-input class="half" v-model="regForm.password" placeholder="输入密码" type="password"
                            show-password/>
                  <el-tooltip content="范围在 6-12 位之间，由字母和数字组成" placement="right">
                    <el-icon :size="10">
                      <InfoFilled/>
                    </el-icon>
                  </el-tooltip>
                  </el-space>
            </el-form-item> -->
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-space>
                <el-input
                  class="half wTip"
                  v-model="regForm.confirmPwd"
                  placeholder="输入确认密码"
                  type="password"
                  show-password
                >
                  <template #append>密码范围在 6-12 位之间，由字母和数字组成</template>
                </el-input>
              </el-space>
            </el-form-item>
            <!-- <el-row>
              <el-col>
                <span class="title account">会员资料</span>
              </el-col>
            </el-row> -->
            <!-- <el-form-item label="电话号码" prop="telephone">
              <el-space>

              <el-input :disabled="disableSendVerificationButton" class="half" v-model="regForm.telephone" placeholder="输入电话号码"/>
              <el-button :disabled="disableSendVerificationButton" @click="openCaptchaForm('REGISTER')" size="small" class="common-btn">
                <span v-if="disableSendVerificationButton">已发送（倒数{{ regCountdown }}秒)</span>
                <span v-else >发送验证码</span>
              </el-button>


            </el-space>
            </el-form-item>
            <el-form-item label="手机验证码" prop="smsCode">
              <el-space>
                <el-input
                  class="half"
                  v-model="regForm.smsCode"
                  placeholder="输入手机验证码"
                />
              </el-space>
            </el-form-item>
            <el-form-item label="邮件" prop="email">
              <el-space>
                <el-input
                  class="half"
                  v-model="regForm.email"
                  placeholder="输入邮件"
                />
              </el-space>
            </el-form-item> -->
            <el-form-item label="推荐码" prop="codeAffiliate">
              <el-space>
                <el-input
                  v-if="!hasAffiliate"
                  class="half"
                  v-model="regForm.codeAffiliate"
                  placeholder="若不是合营下会员无需填写输入推荐码"
                />
                <el-input
                  v-else
                  class="half"
                  v-model="regForm.codeAffiliate"
                  placeholder="若不是合营下会员无需填写"
                  readonly
                  disabled
                />
              </el-space>
            </el-form-item>
            <el-form-item label="验证码" prop="captchaCode">
              <el-space>
                <el-input v-model="regForm.captchaCode" label="验证码" placeholder="验证码" />

                <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
              </el-space>
            </el-form-item>
          </el-form>

          <div style="margin-top: 40px">
            <el-button
              :loading="loadingBtn"
              size="large"
              color="#3bafda"
              class="common-btn"
              style="margin-left: 100px"
              @click="resetRegForm(registerRef)"
            >
              重新填写
            </el-button>

            <el-button
              :loading="loadingBtn"
              size="large"
              color="#3bafda"
              class="common-btn"
              style="margin-left: 30px"
              @click="submitRegisterForm(registerRef)"
            >
              确认注册
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="captchaDialogVisible"
      title="验证码"
      width="50%"
      align-center
      style="max-width: 500px"
      :close-on-click-modal="false"
      @keydown.enter.prevent
    >
      <el-form ref="captchaRef" :rules="captchaRules" :model="captchaForm" label-width="100" label-suffix=":">
        <el-form-item tabindex="3" label="验证码" prop="captchaCode">
          <el-row :gutter="10" style="justify-content: center; align-items: center">
            <el-col :span="12">
              <el-input v-model="captchaForm.captchaCode" label="验证码" placeholder="验证码" @keyup.enter="sendOtp" />
            </el-col>
            <el-col :span="12">
              <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-button size="large" color="#3bafda" class="common-btn" style="margin-left: 100px" @click="sendOtp">
          发送
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog v-model="forgetPassDialogVisible" title="忘记账号" width="50%" align-center style="max-width: 800px">
      <span>
        <el-tabs v-model="activeTab" @tabChange="changeTab">
          <el-tab-pane label="手机找回密码" name="phone">
            <p>方式：请输入您需找回登陆密码的用户名和验证手机号码</p>
            <el-form
              ref="forgotPwdFormPhoneRef"
              :rules="forgotPwdFormRulesPhone"
              :model="forgotPwdForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 50px auto 20px; text-align: center"
            >
              <el-form-item tabindex="1" label="用户名" prop="loginName">
                <el-input v-model="forgotPwdForm.loginName" placeholder="输入用户名" />
              </el-form-item>
              <el-form-item tabindex="2" label="手机号码" prop="phone">
                <el-input v-model="forgotPwdForm.phone" placeholder="手机号码" />
              </el-form-item>
              <el-form-item tabindex="3" label="验证码" prop="captchaCode" v-if="!forgotPwdPostVerifyForm.codeId">
                <el-row :gutter="10" style="justify-content: center; align-items: center">
                  <el-col :span="12">
                    <el-input
                      v-model="forgotPwdForm.captchaCode"
                      label="验证码"
                      placeholder="验证码"
                      @keyup.enter="submitOTPForm"
                    />
                  </el-col>
                  <el-col :span="12">
                    <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button
                v-if="!forgotPwdPostVerifyForm.codeId"
                :loading="loadingBtn"
                size="large"
                color="#3bafda"
                class="common-btn"
                style="margin-left: 100px"
                @click="submitOTPForm"
              >
                提交
              </el-button>
            </el-form>

            <el-form
              ref="forgotPwdPostVerifyFormPhoneRef"
              :rules="forgotPwdPostVerifyFormRules"
              :model="forgotPwdPostVerifyForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 10px auto; text-align: center"
              size="large"
              v-if="forgotPwdPostVerifyForm.codeId"
            >
              <el-form-item tabindex="1" label="OTP验证码" prop="code">
                <el-input v-model="forgotPwdPostVerifyForm.code" placeholder="OTP验证码" />
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="forgotPwdPostVerifyForm.password"
                  placeholder="请输入6-11位字母/数字组合"
                  type="password"
                  show-password
                  clearable
                >
                  <template #append></template>
                </el-input>
              </el-form-item>

              <el-form-item label="确认密码" prop="confirmPwd">
                <el-input
                  v-model="forgotPwdPostVerifyForm.confirmPwd"
                  placeholder="请确认密码"
                  type="password"
                  show-password
                  clearable
                >
                  <template #append></template>
                </el-input>
              </el-form-item>

              <el-button
                :loading="loadingBtn"
                size="large"
                color="#3bafda"
                class="common-btn"
                @click="submitForgetPwdCode"
              >
                提交
              </el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="邮箱找回密码" name="email">
            <p>方式：请输入您需找回登陆密码的用户名和预留邮箱地址</p>
            <el-form
              ref="forgotPwdFormEmailRef"
              :rules="forgotPwdFormRulesEmail"
              :model="forgotPwdForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 50px auto 20px; text-align: center"
            >
              <el-form-item tabindex="1" label="用户名" prop="loginName">
                <el-input v-model="forgotPwdForm.loginName" placeholder="输入用户名" />
              </el-form-item>
              <el-form-item tabindex="2" label="预留邮箱" prop="email">
                <el-input v-model="forgotPwdForm.email" placeholder="预留邮箱" />
              </el-form-item>
              <el-form-item tabindex="3" label="验证码" prop="captchaCode" v-if="!forgotPwdPostVerifyForm.codeId">
                <el-row :gutter="10" style="justify-content: center; align-items: center">
                  <el-col :span="12">
                    <el-input
                      v-model="forgotPwdForm.captchaCode"
                      label="验证码"
                      placeholder="验证码"
                      @keyup.enter="submitOTPForm"
                    />
                  </el-col>
                  <el-col :span="12">
                    <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button
                v-if="!forgotPwdPostVerifyForm.codeId"
                :loading="loadingBtn"
                size="large"
                color="#3bafda"
                class="common-btn"
                style="margin-left: 100px"
                @click="submitOTPForm"
              >
                提交
              </el-button>
            </el-form>

            <el-form
              ref="forgotPwdPostVerifyFormEmailRef"
              :rules="forgotPwdPostVerifyFormRules"
              :model="forgotPwdPostVerifyForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 10px auto; text-align: center"
              size="large"
              v-if="forgotPwdPostVerifyForm.codeId"
            >
              <el-form-item tabindex="1" label="OTP验证码" prop="code">
                <el-input v-model="forgotPwdPostVerifyForm.code" placeholder="OTP验证码" />
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="forgotPwdPostVerifyForm.password"
                  placeholder="请输入6-11位字母/数字组合"
                  type="password"
                  show-password
                  clearable
                >
                  <template #append></template>
                </el-input>
              </el-form-item>

              <el-form-item label="确认密码" prop="confirmPwd">
                <el-input
                  v-model="forgotPwdPostVerifyForm.confirmPwd"
                  placeholder="请确认密码"
                  type="password"
                  show-password
                  clearable
                >
                  <template #append></template>
                </el-input>
              </el-form-item>

              <el-button
                :loading="loadingBtn"
                size="large"
                color="#3bafda"
                class="common-btn"
                @click="submitForgetPwdCode"
              >
                提交
              </el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="邮箱找回账号" name="account">
            <p>方式：请输入您的注册邮箱，我们将发送您的账户名到您的注册邮箱。</p>
            <el-form
              ref="passRef"
              :rules="forgetPassRules"
              :model="passForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 50px auto"
            >
              <el-form-item tabindex="1" label="注册邮箱" prop="email">
                <el-input v-model="passForm.email" placeholder="输入注册邮箱" />
              </el-form-item>
              <el-form-item tabindex="2" label="验证码" prop="captchaCode">
                <el-row :gutter="10" style="justify-content: center; align-items: center">
                  <el-col :span="12">
                    <el-input
                      v-model="passForm.captchaCode"
                      label="验证码"
                      placeholder="验证码"
                      @keyup.enter="submitForgetPass"
                    />
                  </el-col>
                  <el-col :span="12">
                    <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button
                :loading="loadingBtn"
                size="large"
                color="#3bafda"
                class="common-btn"
                style="margin-left: 100px"
                @click="submitForgetPass"
              >
                提交
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </span>
    </el-dialog>

    <el-dialog class="noPadding" v-model="noticeDialogVisible" width="1280px" align-center style="max-width: 600px">
      <div class="noticedialog">
        <div class="title">系统提示</div>
        <div class="contents">
          尊敬的东赢会员：
          为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！东赢娱乐
          2022/10/13
          尊敬的东赢会员：为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！东赢娱乐
          2022/10/13
        </div>
        <el-button class="common-btn" @click="noticeDialogVisible = false">确认</el-button>
      </div>
    </el-dialog>

    <GameModal ref="modalGame"></GameModal>

    <el-dialog
      class="notice-modal"
      width="100%"
      style="max-width: 800px"
      v-model="isStationNotice"
      :maskClosable="false"
      :footer="null"
      title="公告"
    >
      <el-tabs type="card" class="announcementTabs" v-model="announcementActive" @tab-click="announcementTabChange">
        <el-tab-pane v-for="(tab, ind) in announcementTypes" :key="tab.id" :tab="ind" :label="tab.name">
          <el-collapse accordion v-model="typeActive">
            <template v-for="(ann, idx) in announcementList" :key="idx">
              <template v-if="ann.typeId === tab.id">
                <el-collapse-item :name="idx" :title="ann.title">
                  {{ ann.content }}
                </el-collapse-item>
              </template>
            </template>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </header>
</template>

<script lang="js">

import "vue3-carousel/dist/carousel.css";
import { defineComponent, onMounted, onActivated, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/store/index";
import { getVerificationCode, register, findAccount } from "@/api/index/login";
import { sendSms, getAnnouncement } from "@/api/personal/personal";
import { ElMessage } from "element-plus";
import { Vue3Marquee } from "vue3-marquee";
import GameMenu from "@/components/menu/GameMenu.vue";
import EsportsMenu from "@/components/menu/EsportsMenu.vue";
import SportsMenu from "@/components/menu/SportsMenu.vue";
import LiveCasinoMenu from "@/components/menu/LiveCasinoMenu.vue";
import LotteryMenu from "@/components/menu/LotteryMenu.vue";
import PokerMenu from "@/components/menu/PokerMenu.vue";
import FishingMenu from "@/components/menu/FishingMenu.vue";
import PromotionMenu from "@/components/menu/PromotionMenu.vue";
import AppMenu from "@/components/menu/AppMenu.vue";
import "vue3-marquee/dist/style.css";
import { useElementSize } from "@vueuse/core";
import { ArrowDown, Refresh, ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import GameModal from "@/components/modal/GameModal";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import moment from "moment";
import { lsGet, lsStore, lsRemove, getTimeout } from "@/utils/utils";
import { getUnreadMailTotal } from "@/api/personal/mailbox";

import {
  sendForgetPasswordPhone,
  verifyForgetPasswordPhone,
  sendForgetPasswordEmail,
  verifyForgetPasswordEmail
} from "@/api/index/forgotPwd";

export default defineComponent({
  name: "CommonHeader",
  components: {
    Vue3Marquee,
    GameMenu,
    EsportsMenu,
    SportsMenu,
    LiveCasinoMenu,
    LotteryMenu,
    PokerMenu,
    FishingMenu,
    PromotionMenu,
    AppMenu,
    ArrowDown,
    ArrowRight,
    ArrowLeft,
    Refresh,
    GameModal
  },
  data: () => ({
    // carousel settings
    navigations: [
      { code: "Home", name: "首页", enName: "Home", path: "/home" },
      { code: "Esports", name: "电子竞技", enName: "Esports", path: "/esports", submenu: true },
      { code: "Sports", name: "体育", enName: "Sports", path: "/sports", submenu: true },
      { code: "Live Casino", name: "真人", enName: "Live", path: "/live-casino", submenu: true },
      { code: "Poker", name: "棋牌", enName: "Poker", path: "/poker", submenu: true },
      { code: "Slots", name: "老虎机", enName: "Slots", path: "/game", submenu: true },
      { code: "Lottery", name: "彩票", enName: "Lottery", path: "/lottery", submenu: true },
      { code: "Fishing", name: "捕鱼", enName: "Fishing", path: "/fishing", submenu: true },
      { code: "Promotion", name: "优惠", enName: "Promotion", path: "/promotion", submenu: true, hasicon: true },
      {
        code: "Agent",
        name: "加盟",
        enName: "Affiliate",
        path: "/affiliate",
        hasicon: true
      },
      { code: "Sponsor", name: "赞助", enName: "Sponsor", path: "/sponsor", hasicon: true },
      { code: "App", name: "APP", enName: "App", path: "/app", submenu: true, hasicon: true },
      { code: "VIP", name: "VIP", enName: "VIP", path: "/vip", hasicon: true }
    ]
  }),
  setup() {

    // Register
    const registerTelephoneKey = `registerTelephoneKey`;
    const registerSendOtpDisabledKey = `registeredSendOtpDisabled`;

    const registerSendOtpDisabledTimeout = 60;
    const registerSendOtpDisabledTimeoutLeft = getTimeout(registerSendOtpDisabledKey);

    let cachedTelephone = lsGet(registerTelephoneKey);
    let initialRegisterSendOtpDisabledTimeout = false;

    if (registerSendOtpDisabledTimeoutLeft) {
      initialRegisterSendOtpDisabledTimeout = true;
    } else {
      lsRemove(registerSendOtpDisabledKey);
      lsRemove(registerTelephoneKey);

      cachedTelephone = "";
    }

    const disableSendVerificationButton = ref(initialRegisterSendOtpDisabledTimeout);

    const loadingBtn = ref(false);
    const store = userStore();
    const { token } = storeToRefs(store);
    const router = useRouter();
    const route = useRoute();
    const loginDialogVisible = ref(false);
    const registerDialogVisible = ref(false);
    const forgetPassDialogVisible = ref(false);
    const noticeDialogVisible = ref(false);
    const captchaDialogVisible = ref(false);
    const el = ref(null);
    const scroll = ref(0);
    const selectedMenu = ref(false);
    const { height } = useElementSize(el);
    const showSubMenu = (nav) => {
      if (nav.submenu === true) {
        selectedMenu.value = nav.code;
      } else {
        selectedMenu.value = "";
      }
    };
    let validatePass = async (r, v) => {
      if (v === "") {
        return Promise.reject("请输入密码");
      } else {
        return validatePassStrength(r, v);
      }
    };

    let validatePassStrength = (r, v) => {
      var strength = "";
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
        // switch (level) {
        //   case 1:
        //     strength = "weak";
        //     break;
        //   case 2:
        //     strength = "normal";
        //     break;
        //   case 3:
        //   case 4:
        //     strength = "strong";
        //     break;
        // }
        // } else {
        // strength = "weak";
        // }
        // if (strength === "weak") {
        // return Promise.reject("密码至少应该是好的");
      } else {
        return Promise.resolve();
      }
    };

    let validateName = async (r, v) => {
      const namePattern = /^[a-zA-Z][a-zA-Z0-9]*$/; // Starts with a letter, allows letters & numbers
      const letterCount = (v.match(/[a-zA-Z]/g) || []).length >= 2; // At least 2 letters
      const hasNumber = /\d/.test(v); // At least 1 number

      if (!(namePattern.test(v) && letterCount && hasNumber)) {
        return Promise.reject("须以字母开头，并包含至少2个字母和1个数字");
      }

      return Promise.resolve();
    };

    let validateRealName = async (r, v) => {
      if (v === "") {
        return Promise.reject("请输入登姓名");
      } else if (!checkRealName(v)) {
        return Promise.reject("请输入中文字符");
      } else {
        return Promise.resolve();
      }
    };
    const checkName = (v) => {
      const alphanumeric = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
      return v.match(alphanumeric);
    };
    const checkRealName = (v) => {
      // const alphanumeric = /^[\p{L}\p{N}]*$/u;
      const chineseCharOnly = /^([\u4e00-\u9fa5·]*)$/u;
      return v.match(chineseCharOnly);
    };
    let validatePass2 = async (r, v) => {
      if (v === "") {
        return Promise.reject("请重新输入密码");
      } else if (v !== regForm.password) {
        return Promise.reject("密码不同");
      } else {
        return Promise.resolve();
      }
    };
    const validatePassNew = async (r, v) => {
      if (v === "") {
        return Promise.reject("请重新输入密码");
      } else if (v !== forgotPwdPostVerifyForm.password) {
        return Promise.reject("密码不同");
      } else {
        return Promise.resolve();
      }
    };

    let validatePhoneNumber = async (r, v) => {
      var reg = /^\d+$/;
      if (v === "") {
        return Promise.reject("请验证您的电话号码");
      } else if (!reg.test(v)) {
        return Promise.reject("电话号码只允许使用数字");
      } else {
        return Promise.resolve();
      }
    };
    const loginForm = reactive({
      name: ""
    });
    const loginRef = ref([]);
    const mobileLoginRef = ref([]);
    const captchaRef = ref([]);
    const hasAffiliate = ref(false);
    const regCountdown = ref(registerSendOtpDisabledTimeoutLeft);
    const loginCountdown = ref(0);

    const loginRules = {
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        {
          min: 4,
          max: 12,
          message: "长度要在 4-12 之间",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }
      ],
      // captchaCode: [
      //   {
      //     required: true,
      //     message: "请输入验证码",
      //     trigger: "blur"
      //   },
      //   {
      //     min: 4,
      //     max: 4,
      //     message: "长度为 4",
      //     trigger: "blur"
      //   }
      // ]
    };
    const mobileLoginRules = {
      telephone: [
        {
          required: true,
          message: "请输入手机号码",
          trigger: "blur"
        }
      ],
      code: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 6,
          max: 6,
          message: "长度为 6",
          trigger: "blur"
        }
      ]
    };

    const captchaForm = reactive({
      type: "",
      captchaCode: "",
      codeId: ""
    });
    const captchaRules = {
      captchaCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "长度为 4",
          trigger: "blur"
        }
      ]
    };

    const regForm = reactive({
      realName: "",
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: cachedTelephone ?? "",
      email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      smsCode: "",
      smsCodeId: ""
    });

    const regRules = {

      realName: [
        {
          required: true,
          min: 2,
          max: 12,
          message: "长度应为 2 至 12",
          trigger: "blur"
        },
        {
          validator: validateRealName,
          trigger: "change"
        }
      ],
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        {
          min: 4,
          max: 11,
          message: "长度要在 4-11 之间",
          trigger: "blur"
        },
        {
          validator: validateName,
          trigger: "change"
        }
      ],
      password: [
        {
          required: true,
          validator: validatePass,
          trigger: "change"
        }
        // {
        //   required: true,
        //   message: "Password is required",
        //   trigger: "blur",
        // },
        // {
        //   validator: validatePass,
        //   trigger: "change",
        // },
        // {
        //   validator: validatePassStrength,
        //   trigger: "change",
        // },
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
          required: true,
          validator: validatePass2,
          trigger: "change"
        }
      ],
      telephone: [
        {
          validator: validatePhoneNumber,
          trigger: "change"
        }
      ],
      // birthday: [
      //   {
      //     required: true,
      //     message: "Birthday is required",
      //     trigger: "blur",
      //   },
      // ],
      smsCode: [
        {
          required: true,
          message: "请输入手机验证码",
          trigger: "blur"
        },
        {
          min: 6,
          max: 6,
          message: "长度应为 6",
          trigger: "blur"
        }
      ],
      email: [
        {
          required: true,
          message: "请输入您的邮箱",
          trigger: "blur"
        },
        {
          type: "email",
          message: "电子邮件地址无效",
          trigger: "blur"
        },
        {
          max: 50,
          message: "长度应小于 50",
          trigger: "blur"
        }
      ],
      captchaCode: [
        {
          required: true,
          message: "需要验证码",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "长度应为 4",
          trigger: "change"
        }
      ]
    };
    const passForm = reactive({
      email: ""
    });

    const forgotPwdForm = reactive({
      loginName: "",
      phone: "",
      email: "",
      captchaCode: ""
    });

    const forgotPwdPostVerifyForm = reactive({
      codeId: "",
      code: "",
      password: "",
      confirmPwd: ""
    });

    const passRef = ref([]);
    const forgetPassRules = {

      email: [
        {
          required: true,
          message: "请输入您的邮箱",
          trigger: "blur"
        },
        {
          type: "email",
          message: "电子邮件地址无效",
          trigger: "blur"
        },
        {
          max: 50,
          message: "长度应小于 50",
          trigger: "blur"
        }
      ]

    };
    const passRules = {
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        {
          min: 4,
          max: 12,
          message: "长度要在 4-12 之间",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }
      ],
      captchaCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "长度为 4",
          trigger: "blur"
        }
      ]
    };

    // Dynamically load the Geetest script
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initGeetest = async () => {
      try {
        // Step 1: Load Geetest script
        await loadScript("https://static.geetest.com/v4/gt4.js");

        // Step 2: Call your backend to get Geetest configuration (fake config for demo)
        const geetestConfig = {
          config: {
            captchaId: "dd6e127216b2108a70fbed280fbc4180",
            language: "zh",
            nativeButton: {
              width: "100%",
              height: "32px"
            },
            nextWidth: "220px",
            product: "float"
          },
          handler: captchaHandler
        };

        // Step 3: Initialize Geetest with the config
        await window.initGeetest4(geetestConfig.config, geetestConfig.handler);
      } catch (error) {
        // message.value = "Error loading Geetest!";
        console.error("Geetest loading error:", error);
      }
    }

    const captchaHandler = (captchaObj) => {
      window.captchaObj = captchaObj;
      captchaObj
        .appendTo("#captchaContainer")
        .onReady(function () {
          console.log("ready");
        })
        .onNextReady(function () {
          console.log("nextReady");
        })
        .onBoxShow(function () {
          console.log("boxShow");
          loadingBtn.value = true;
        })
        .onError(function (e) {
          console.log(e);
        })
        .onSuccess(function () {
          let result = window.captchaObj.getValidate();
          console.log("success", result);

          for (let key in result) {
            loginForm[key] = result[key];
          }
          loadingBtn.value = false;
        }).onClose(function () {
          console.log("close")
          loadingBtn.value = false;
        });
    }

    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };

    const onLogout = () => {
      store.memberLogout().then(() => {
        location.reload();
      });
    };
    const registerRef = ref([]);
    const resetRegForm = (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const sendOtp = async () => {

      if (captchaForm.type === "REGISTER") {
        const smsDetail = {
          telephone: regForm.telephone,
          captchaCode: captchaForm.captchaCode,
          codeId: captchaForm.codeId
        };
        sendSms(smsDetail)
          .then((response) => {
            if (response.code == 0) {
              disableSendVerificationButton.value = true;

              regForm.smsCodeId = response.data.codeId;

              ElMessage({
                type: "success",
                message: "发送手机验证码成功"
              });

              captchaDialogVisible.value = false;

              regCountdown.value = registerSendOtpDisabledTimeout;

              const now = new Date();

              now.setSeconds(now.getSeconds() + registerSendOtpDisabledTimeout);

              lsStore(registerSendOtpDisabledKey, now.getTime());
              lsStore(registerTelephoneKey, regForm.telephone);

              countdownTimer("REGISTER");
            } else {
              getCode();
            }
          });
      } else if (captchaForm.type === "LOGIN") {
        const smsDetail = {
          telephone: loginForm.phoneNumber,
          captchaCode: captchaForm.captchaCode,
          codeId: captchaForm.codeId
        };
        sendSms(smsDetail)
          .then((response) => {
            if (response.code == 0) {
              loginForm.smsCodeId = response.data.codeId;
              ElMessage({
                type: "success",
                message: "发送手机验证码成功"
              });
              captchaDialogVisible.value = false;
              getCode();
              loginCountdown.value = 30;
              countdownTimer("LOGIN");
            } else {
              getCode();
            }
          });
      }
    };

    const countdownTimer = (type) => {
      if (type === "REGISTER") {
        if (regCountdown.value > 0) {
          setTimeout(() => {
            regCountdown.value -= 1;
            countdownTimer("REGISTER");
          }, 1000);
        } else {
          lsRemove(registerSendOtpDisabledKey);
          lsRemove(registerTelephoneKey);

          disableSendVerificationButton.value = false;
        }
      } else if (type === "LOGIN") {
        if (loginCountdown.value > 0) {
          setTimeout(() => {
            loginCountdown.value -= 1;
            countdownTimer("LOGIN");
          }, 1000);
        }
      }
    };

    const openCaptchaForm = (type) => {
      captchaForm.captchaCode = "";
      captchaForm.type = type;
      captchaDialogVisible.value = true;
      getCode();
    };

    const submitRegisterForm = async (elForm) => {
      if (!elForm) return;
      await elForm.validate((valid) => {
        if (valid) {
          (async () => {
            const sidParam = store.visitorId;
            regForm.sid = sidParam;
            register(regForm)
              .then((response) => {
                const regResult = response.code;
                if (regResult === 0) {
                  ElMessage({
                    type: "success",
                    message: "注册成功"
                  });
                  store.autoLogin(response.data);
                  registerDialogVisible.value = false;
                  store.regPageVisible = false;
                  // loginDialogVisible.value = true;

                  sessionStorage.removeItem("REFERRAL_CODE");
                  // getCode();
                } else {
                  getCode();
                  // message.error(response.message);
                }
              }).catch((err) => {
              getCode();
            });
          })();
        } else {
          getCode();
        }
      });
    };

    const modalGame = ref(null);
    const openGame = (gameName, code, gameCode) => {
      modalGame.value.open(gameName, code, gameCode);
    };

    const announcementActive = ref("1");
    const announcementList = ref([]);
    const announcementTypes = ref([]);
    const loadAnnouncement = () => {
      getAnnouncement().then((res) => {
        if (res.code === 0) {
          const d = res.data.announcements;
          announcementTypes.value = res.data.type;
          if (res.data.type && res.data.type.length > 0) {
            announcementActive.value = res.data.type[0].id;
          }
          announcementList.value = d;
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      });
    };
    const calculateMaxContentLength = () => {
      let maxLength = 0;
      for (const announcement of announcementList.value) {
        if (announcement.content.length > maxLength) {
          maxLength = announcement.content.length;
        }
      }
      return maxLength;
    };
    const announcementTabChange = () => {
      // homeState.tabMatchs.forEach(element => {
      //   if (nk === element.gameId) {
      //     getMatchData(element);
      //   }
      // });
    };
    const isStationNotice = ref(false);
    const noticeTitle = ref("");
    const openPopup = (noticeType) => {
      if (noticeType) {
        announcementActive.value = "3";
        noticeTitle.value = noticeType.title;
        isStationNotice.value = true;
      }
    };

    onActivated(() => {
      store.token && checkMailboxUnread();
    });

    const stopWatchLoginDialogVisible = watch(loginDialogVisible, () => {
      initGeetest()
      stopWatchLoginDialogVisible();
    });

    onMounted(() => {
      if (regCountdown.value > 0)
        countdownTimer("REGISTER");


      getAffiliateCode();
      loadAnnouncement();
      getCode();
      getReferalCode();

      if (token) {
        store.getBalance();
        store.getMemberInfo();
      }

      if (store.loginPageVisible) {
        loginDialogVisible.value = true;
      } else {
        loginDialogVisible.value = false;
      }
    });

    const activeLoginTab = ref("accLogin")
    watch(activeLoginTab, () => {
      window.captchaObj.reset();
    })

    watch(() => store.loginPageVisible, () => {
      if (store.loginPageVisible) {
        loginDialogVisible.value = true;
      } else {
        loginDialogVisible.value = false;
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });
    watch(() => store.regPageVisible, () => {
      if (store.regPageVisible) {
        registerDialogVisible.value = true;
      } else {
        registerDialogVisible.value = false;
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });

    watch(() => registerDialogVisible.value, () => {
      if (registerDialogVisible.value) {
        getAffiliateCode();
      }
    });

    const getReferalCode = () => {
      const referCode = sessionStorage.getItem("REFERRAL_CODE");
      // console.log("got Code");
      // console.log(referCode);
      if (referCode && route.query && route.query.refer) {
        registerDialogVisible.value = true;
        regForm.referrer = referCode;
      }
    };


    const isLoadingBalance = ref(false);
    const refreshBalance = () => {
      isLoadingBalance.value = true;
      store.getBalance().then(() => {
        isLoadingBalance.value = false;
      });
    };
    const getCode = () => {
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          loginForm.codeId = res.data.id;
          regForm.codeId = res.data.id;
          captchaForm.codeId = res.data.id;
          passForm.codeId = res.data.id;

          forgotPwdForm.codeId = res.data.id;

          // reset captcha input when captcha changes
          // loginForm.captchaCode = "";
          regForm.captchaCode = "";
          forgotPwdForm.captchaCode = "";
        }
      });
    };
    const activeTab = ref("phone");
    const isSubmitForget = ref(false);

    const changeTab = () => {
      // console.log("Change tab");

      forgotPwdForm.loginName = "";
      forgotPwdForm.phone = "";
      forgotPwdForm.email = "";
      forgotPwdForm.captchaCode = "";

      forgotPwdPostVerifyForm.codeId = "";
      forgotPwdPostVerifyForm.code = "";
      forgotPwdPostVerifyForm.password = "";
      forgotPwdPostVerifyForm.confirmPwd = "";
    };

    const verificationImg = ref("");
    const submitForgetPass = () => {
      loadingBtn.value = true;
      passRef.value.validate().then(() => {
        findAccount(passForm).then((res) => {
          loadingBtn.value = false;
          if (res.code === 0) {
            ElMessage.success("您的帐号已经发送到注册邮箱");
          }
        }).catch((e) => {
          loadingBtn.value = false;
        });
      }).catch((e) => {
        loadingBtn.value = false;
      });
    };

    const forgotPwdFormRulesEmail = {
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        {
          min: 4,
          max: 12,
          message: "长度要在 4-12 之间",
          trigger: "blur"
        }
      ],
      email: [
        {
          required: true,
          message: "请输入您的邮箱",
          trigger: "blur"
        },
        {
          type: "email",
          message: "电子邮件地址无效",
          trigger: "blur"
        },
        {
          max: 50,
          message: "长度应小于 50",
          trigger: "blur"
        }
      ],
      captchaCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "长度为 4",
          trigger: "blur"
        }
      ]
    };
    const forgotPwdFormRulesPhone = {
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        {
          min: 4,
          max: 12,
          message: "长度要在 4-12 之间",
          trigger: "blur"
        }
      ],
      phone: [
        {
          required: true,
          message: "请输入手机号码",
          trigger: "blur"
        },
        {
          validator: validatePhoneNumber,
          trigger: "blur"
        }
      ],
      captchaCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "长度为 4",
          trigger: "blur"
        }
      ]
    };

    const forgotPwdPostVerifyFormRules = {
      code: [
        {
          min: 4,
          max: 6,
          message: "长度为 6",
          trigger: "blur"
        }
      ],
      password: [
        {
          validator: validatePass,
          trigger: "change"
        }
      ],
      confirmPwd: [
        {
          validator: validatePassNew,
          trigger: "change"
        }
      ]
    };


    const captchaVerifyRef = ref();
    const forgotPwdFormPhoneRef = ref();
    const forgotPwdFormEmailRef = ref();
    const forgotPwdPostVerifyFormPhoneRef = ref();
    const forgotPwdPostVerifyFormEmailRef = ref();

    const submitOTPForm = () => {
      if (activeTab.value === "phone") {

        forgotPwdFormPhoneRef.value.validate().then(() => {
          const params = {
            phone: forgotPwdForm.phone,
            loginName: forgotPwdForm.loginName,
            captchaCode: forgotPwdForm.captchaCode,
            codeId: forgotPwdForm.codeId
          };

          loadingBtn.value = true;
          sendForgetPasswordPhone(params).then((res) => {
            loadingBtn.value = false;
            if (res.code === 0) {
              ElMessage.success("验证码已经发送到手机");
              forgotPwdPostVerifyForm.codeId = res.data.codeId;
              // captchaVerifyRef.value.closeDialog();
              // captchaVerifyRef.value.initCountdownTimer();
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          }).catch((error) => {
            loadingBtn.value = false;
            console.log(error);
            getCode();
          });
        }).catch((err) => {
          console.log(err);
          getCode();
        }).finally(() => {
        });

      } else if (activeTab.value === "email") {

        forgotPwdFormEmailRef.value.validate().then(() => {
          const params = {
            email: forgotPwdForm.email,
            loginName: forgotPwdForm.loginName,
            captchaCode: forgotPwdForm.captchaCode,
            codeId: forgotPwdForm.codeId
          };

          loadingBtn.value = true;
          sendForgetPasswordEmail(params).then((res) => {
            loadingBtn.value = false;
            if (res.code === 0) {
              ElMessage.success("验证码已经发送到手机");
              forgotPwdPostVerifyForm.codeId = res.data.codeId;
              // captchaVerifyRef.value.closeDialog();
              // captchaVerifyRef.value.initCountdownTimer();
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          }).catch((error) => {
            loadingBtn.value = false;
            console.log(error);
            getCode();
          });
        }).catch((err) => {
          console.log(err);
          getCode();
        }).finally(() => {
        });

      }
    };

    const submitForgetPwdCode = () => {
      if (activeTab.value === "phone") {


        forgotPwdPostVerifyFormPhoneRef.value.validate().then(() => {
          const params = {
            phone: forgotPwdForm.phone,
            code: forgotPwdPostVerifyForm.code,
            codeId: forgotPwdPostVerifyForm.codeId,
            newPassword: forgotPwdPostVerifyForm.confirmPwd
          };

          loadingBtn.value = true;
          verifyForgetPasswordPhone(params).then((res) => {
            loadingBtn.value = false;
            if (res.code === 0) {
              ElMessage.success("密码更换成功！");
              forgetPassDialogVisible.value = false;
              changeTab();
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          }).catch((error) => {
            loadingBtn.value = false;
            console.log(error);
          });
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
        });

      } else if (activeTab.value === "email") {

        loadingBtn.value = true;

        forgotPwdPostVerifyFormEmailRef.value.validate().then(() => {

          const params = {
            email: forgotPwdForm.email,
            code: forgotPwdPostVerifyForm.code,
            codeId: forgotPwdPostVerifyForm.codeId,
            newPassword: forgotPwdPostVerifyForm.confirmPwd
          };

          loadingBtn.value = true;
          verifyForgetPasswordEmail(params).then((res) => {
            loadingBtn.value = false;
            if (res.code === 0) {
              ElMessage.success("密码更换成功！");
              forgetPassDialogVisible.value = false;
              changeTab();
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          }).catch((error) => {
            loadingBtn.value = false;
            console.log(error);
          });
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
        });

      }

    };
    const submitLogin = () => {
      loadingBtn.value = true;

      (async () => {
        const sidParam = store.visitorId;
        loginRef.value.validate().then(() => {
          const validate = window?.captchaObj.getValidate();
          if (!validate) {
            ElMessage.error('请完成验证码');
            return;
          }
          store
            .memberLogin({
              loginName: loginForm.loginName,
              password: loginForm.password,
              sid: sidParam,
              // captchaCode: loginForm.captchaCode,
              // codeId: loginForm.codeId,
              lotNumber: loginForm.lot_number,
              captchaOutput: loginForm.captcha_output,
              passToken: loginForm.pass_token,
              genTime: loginForm.gen_time
            })
            .then(() => {
              // const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
              if (store.token) {
                // router.push(jumpUrl);
                loginDialogVisible.value = false;
                store.loginPageVisible = false;

                sessionStorage.removeItem("REFERRAL_CODE");
                loginForm.loginName = null;
                loginForm.password = null;
                // loginForm.captchaCode = null;

                checkMailboxUnread();
              } else {
                // loginForm.loginName = null
                // loginForm.password = null
                // loginForm.captchaCode = null
                getCode();
              }
            }).catch((error) => {
            // message.error(error.message);
            console.log(error.message);
            getCode();
          });
        });
        loadingBtn.value = false;
      })();
    };

    const phoneLogin = () => {
      loadingBtn.value = true;

      (async () => {
        const sidParam = store.visitorId;

        mobileLoginRef.value.validate().then(() => {
          store
            .telephoneLogin({
              phoneNumber: loginForm.phoneNumber,
              sid: sidParam,
              code: loginForm.code,
              smsCodeId: loginForm.smsCodeId
            })
            .then(() => {
              // const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
              if (store.token) {
                // router.push(jumpUrl);
                loginDialogVisible.value = false;
                store.loginPageVisible = false;

                sessionStorage.removeItem("REFERRAL_CODE");
              } else {
                loginForm.phoneNumber = null;
                loginForm.code = null;
              }
            }).catch((error) => {
            // message.error(error.message);
            console.log(error.message);
          });
        });
      })();
      loadingBtn.value = false;
    };

    const handleCommand = (command) => {
      if (command === "a") {
        router.push("/center/personal");
      }
      if (command === "b") {
        router.push("/center/deposit");
      }
      if (command === "c") {
        router.push("/center/transfer");
      }
      if (command === "d") {
        router.push("/promotion");
      }
      if (command === "e") {
        onLogout();
      }
    };
    // const submitRegisterForm = () => {
    //   registerRef.value
    //     .validate()
    //     .then(() => {
    //     alert('!')
    //     // if (!valid) {
    //     //   ElMessage({
    //     //     message: h('p', null, [
    //     //       h('span', null, 'Message can be ',
    //     //       h('i', { style: 'color: teal' }, 'VNode',
    //     //     ]),
    //     //   })
    //     // }
    //   })
    // }
    const pwdStrength = ref();

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

    // watch(
    //     () => regForm.password,
    // () => {
    //   pwdStrength.value = "";

    //   var pwd = regForm.password;
    //   var result = 0;
    //   for (var i = 0, len = pwd.length; i < len; ++i) {
    //     result |= charType(pwd.charCodeAt(i));
    //   }

    //   var level = 0;
    //   for (i = 0; i <= 4; i++) {
    //     if (result & 1) {
    //       level++;
    //     }
    //     result = result >>> 1;
    //   }

    //   // console.log(level);

    //   if (pwd.length >= 6) {
    //     switch (level) {
    //       case 1:
    //         pwdStrength.value = "weak";
    //         break;
    //       case 2:
    //         pwdStrength.value = "normal";
    //         break;
    //       case 3:
    //       case 4:
    //         pwdStrength.value = "strong";
    //         break;
    //     }
    //   } else {
    //     pwdStrength.value = "weak";
    //   }

    //   // console.log(pwdStrength.value);
    // },
    // );
    const todayDate = () => {
      return "GTM+8 " + moment().utcOffset("+08:00").format("M/D/YYYY, h:mm:ss A ") + moment(new Date()).locale("zh-cn").format("dddd");
    };
    const jumpOut = (path) => {
      window.location.href = path;
    };

    const isMailboxUnread = ref(false);

    const openForgotDialog = () => {
      getCode();
      forgetPassDialogVisible.value = true;
    };
    const openRegisterDialog = () => {
      getCode();
      registerDialogVisible.value = true;
    };
    const openLoginDialog = () => {
      getCode();
      loginDialogVisible.value = true;
    };

    const checkMailboxUnread = () => {
      getUnreadMailTotal().then((res) => {
        const { code, data } = res;
        if (code === 0) {
          store.unreadTotal = data;
        }
      })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      token,
      el,
      height,
      showSubMenu,
      scroll,
      selectedMenu,
      noticesList: [
        "尊敬的东赢会员：为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！东赢娱乐 2022/10/13",
        "こんにちは",
        "bonjour",
        "안녕하세요"
      ],
      loginForm,
      loginDialogVisible,
      forgetPassDialogVisible,
      noticeDialogVisible,
      captchaDialogVisible,
      loginRef,
      mobileLoginRef,
      captchaRef,
      submitLogin,
      regForm,
      openLoginDialog,
      openRegisterDialog,
      openForgotDialog,
      registerDialogVisible,
      submitRegisterForm,
      registerRef,
      loginRules,
      mobileLoginRules,
      captchaRules,
      regRules,
      activeTab,
      activeLoginTab,
      changeTab,
      isSubmitForget,
      forgotPwdFormPhoneRef,
      forgotPwdFormEmailRef,
      forgotPwdFormRulesEmail,
      forgotPwdFormRulesPhone,
      forgotPwdForm,
      forgotPwdPostVerifyFormEmailRef,
      forgotPwdPostVerifyFormPhoneRef,
      forgotPwdPostVerifyForm,
      forgotPwdPostVerifyFormRules,
      captchaVerifyRef,
      submitOTPForm,
      getCode,
      verificationImg,
      disableSendVerificationButton,
      onLogout,
      store,
      isLoadingBalance,
      refreshBalance,
      handleCommand,
      passForm,
      captchaForm,
      passRef,
      passRules,
      forgetPassRules,
      submitForgetPass,
      submitForgetPwdCode,
      pwdStrength,
      resetRegForm,
      openGame,
      modalGame,
      todayDate,
      sendOtp,
      phoneLogin,
      openCaptchaForm,
      loadingBtn,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementActive,
      announcementTabChange,
      announcementTypes,
      typeActive: "1",
      getAffiliateCode,
      hasAffiliate,
      countdownTimer,
      regCountdown,
      loginCountdown,
      jumpOut,
      isMailboxUnread,
      checkMailboxUnread,
      calculateMaxContentLength
    };
  }
});
</script>
<style lang="scss">
body {
  .el-button.is-disabled,
  .el-button.is-disabled:hover {
    background-color: #a8b5c3;
  }

  .el-input.wTip .el-input-group__append {
    background: none;
    border: 0;
    padding: 0 8px;
    font-size: 12px;
    box-shadow: none;
  }

  .el-dropdown {
    cursor: pointer;
  }

  .el-popper__arrow::before {
    display: none;
  }

  .el-dropdown-menu {
    background: #3d4145;
    border: 0;
  }

  .el-dropdown-menu__item {
    min-width: 130px;
    color: #a8b5c3;
    gap: 8px;
  }

  .el-dropdown-menu__item:not(.is-disabled):focus {
    background: #3a4550;
    color: #e1e9ee;
  }
}
</style>
<style scoped lang="scss">
.el-icon {
  height: 1.5em;
  width: 1.5em;

  svg {
    height: 1.5em;
    width: 1.5em;
  }
}

.details {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  .balance-amt {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      min-width: 40px;
      text-align: right;
      white-space: nowrap;
    }

    .amount {
      color: #faea81;
      font-weight: bold;
    }

    .el-icon {
      height: 2em;
      width: 2em;
      line-height: 2em;
      cursor: pointer;

      svg {
        width: 1.3em;
        height: 1.3em;
      }

      &:hover {
        opacity: 0.9;
      }

      &:active {
        filter: brightness(0.9);
      }
    }
  }

  .top-deposit {
    a {
      text-decoration: none;
    }
  }
}

.el-dropdown-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: silver;
}

.hamburger {
  display: none;
}

.header-container {
  &.on-scrolled {
    // background: rgb(43 43 75 / 80%);
  }

  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999;
  transition: all 0.3s ease;

  .top-bar {
    &-wrapper {
      padding: 5px;
      background: $dark-black;
      color: $light-grey;

      .top-bar-inner {
        font-family: "PingFang SC";
        max-width: $maxwidth;
        width: 100%;
        margin: 0 auto;
        display: flex;
        font-size: 0.75em;
        line-height: 1.2em;
        justify-content: flex-start;
        align-items: center;
        gap: 5px;

        &.login-bar-inner {
          max-width: 1420px;
        }

        .timebox {
          // flex: 1;
          min-width: 225px;
        }

        .station-notice-container {
          line-height: 1rem;
          flex: 3;

          .station-notice-box {
            display: flex;
            gap: 10px;
            max-height: 20px;
            overflow: hidden;

            .station-notice {
              display: flex;
              justify-content: center;
              align-items: center;

              .station-notice-item {
                margin-right: 50px;
              }
            }
          }
        }

        .right-contents {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .common-link {
            cursor: pointer;
            color: #78919d;
          }
        }
      }
    }
  }

  .top-nav {
    &-wrapper {
      padding: 5px;
      background: $primary;
      position: relative;
      box-shadow: 0 0 10px 0 rgba(168, 168, 168, 1);

      .top-nav-inner {
        max-width: $maxwidth;
        margin: 0 auto;
        width: 100%;
        display: flex;
        // justify-content: center;
        justify-content: space-between;
        align-items: center;
        gap: 30px;

        .logospon {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;

          .seperator {
            background: #8f99a3;
            width: 1px;
            height: 60px;
          }
        }

        .logo {
          width: 107px;

          img {
            width: 100%;
            display: block;
          }
        }

        .navigations {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 998px;
          text-align: center;

          .header-menu-item {
            font-family: "PingFang SC";
          }

          a {
            padding-top: 5px;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            gap: 2px;

            &.icon {
              gap: 0;
            }

            svg {
              width: 20px;
              fill: #5c78f0;
              cursor: pointer;
              display: block;
              margin: 0 auto;
            }

            span:first-child {
              color: #575757;
              font-size: 1rem;
              font-weight: 700;
              line-height: 1.2rem;
            }

            span:last-child {
              color: $link-hover;
              text-transform: uppercase;
              font-size: 0.75rem;
              display: flex;
              flex-direction: column;
              gap: 2px;

              &:after {
                content: "";
                width: 26px;
                height: 2px;
                margin: 0 auto;
                -webkit-transition: all 0.3s ease;
                transition: all 0.3s ease;
                background-color: #4080ff;
                -webkit-transform: scaleX(0);
                transform: scaleX(0);
              }
            }

            &:hover,
            &.router-link-active {
              span:first-child {
                color: $link-active;
              }

              span:last-child {
                color: $link-active;

                &:after {
                  background: $link-active;
                  -webkit-transform: scaleX(1);
                  transform: scaleX(1);
                }
              }
            }
          }

          .sub-menu {
            transition: $page-trans;
            background: rgba(239, 242, 245, 0.95);
            box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.15);
            overflow: hidden;
            height: 0px;
            position: absolute;
            left: 0;
            top: 100%;
            width: 100%;

            > div {
              max-width: $maxwidth;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
}

.register-container {
  display: flex;
  min-height: 70vh;

  .registered-left {
    background-image: url(../../assets/home/zc.jpg);
    background-size: cover;
    background-position: 100% 100%;
    background-repeat: no-repeat;
    flex: 1;
    padding: 80px 30px;

    ul {
      text-align: left;
      padding-left: 15px;
      font-size: 14px;
      line-height: 30px;
      color: #ffffff;

      li {
        list-style-type: decimal;
      }
    }

    .title {
      background-image: url(../../assets/home/download.png);
      background-position: 100% 100%;
      width: 143px;
      height: 35px;
    }
  }

  .registered-right {
    flex: 2;
    padding: 73px 44px;
    background: url(../../assets/images/index/reg-bg.jpg) no-repeat center center;
    background-size: cover;

    .el-row {
      width: 100%;
    }

    form .title {
      height: 18px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #5075ad;
      margin: 0 auto 30px;
      width: 100%;
      text-align: left;
      display: block;

      &.account {
        margin-top: 52px;
      }
    }
  }
}

.login-container {
  display: flex;
  min-height: 70vh;

  .dialog-title {
    color: #5075ad;
    font-weight: bold;
    font-size: 20px;
    padding: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #cecece;
  }

  .form-content {
    max-width: 400px;
    margin: 50px auto;
  }

  .form-content-reg {
    max-width: 600px;
    margin: 50px auto;
  }

  .details-form {
    background-image: url(../../assets/home/zc.jpg);
    background-size: cover;
    background-position: 100% 100%;
    background-repeat: no-repeat;
    flex: 1;
    padding: 80px 30px;

    ul {
      text-align: left;
      padding-left: 15px;
      font-size: 16px;
      line-height: 30px;
      color: #ffffff;

      li {
        // list-style-type: decimal;
      }
    }

    .title {
      background-image: url(../../assets/home/right-title.png);
      background-position: 100% 100%;
      width: 107px;
      height: 35px;
    }

    .title-reg {
      background-image: url(../../assets/home/download.png);
      background-position: 100% 100%;
      width: 143px;
      height: 35px;
    }
  }

  .content-form {
    flex: 2;
    // padding: 73px 44px;
    padding: 16px;
    width: 100%;
    max-width: 700px;
    background: url(../../assets/images/index/reg-bg.jpg) no-repeat center center;
    background-size: cover;

    .el-tabs {
      // max-width: 500px;
    }

    .el-row {
      width: 100%;
    }

    form .title {
      height: 18px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #5075ad;
      margin: 0 auto 30px;
      width: 100%;
      text-align: left;
      display: block;

      &.account {
        margin-top: 52px;
      }
    }
  }
}

.toggle-side {
  position: absolute;
  bottom: 220px;
  color: #ffffff;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  line-height: 1;

  min-width: 185px;
  overflow: hidden;
  z-index: 100;
  font-weight: 500;
  letter-spacing: 2px;
  padding-top: 12px;
  padding-bottom: 12px;
  border: 2px solid #45fdfb;
  border-radius: 24px;
  transition: 0.3s;

  &--reg {
    right: 120px;
  }

  &--login {
    left: 120px;
  }
}

.noticedialog {
  padding: 0 0 5px;

  .title {
    font-size: 20px;
    font-weight: bold;
    padding: 10px 0;
    text-align: center;
  }

  .contents {
    padding: 20px;
  }

  .el-button {
    display: block;
    margin: 15px auto;
  }
}

.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;
  width: 215px;
  color: #ffffff;

  span {
    padding: 8px 3px;
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
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

.announcment-icon {
  background: url("../../assets/home/home-icons.png") no-repeat center center;
  background-size: auto 100%;
  background-position: 91% 0%;
  width: 20px;
  height: 20px;
}

.mail-icon {
  background: url("../../assets/home/home-icons.png") no-repeat center center;
  background-size: auto 100%;
  background-position: 100% 0%;
  width: 20px;
  height: 20px;
}

.personal-info-icon,
.deposit-icon,
.transfer-icon,
.promotion-icon,
.logout-icon {
  background: url("../../assets/home/home-icons.png") no-repeat center center;
  background-size: auto 100%;
  width: 20px;
  height: 20px;
}

.personal-info-icon {
  background-position: 0% 0%;
}

.deposit-icon {
  background-position: 9% 0%;
}

.transfer-icon {
  background-position: 18.5% 0%;
}

.promotion-icon {
  background-position: 27.5% 0%;
}

.logout-icon {
  background-position: 37% 0%;
}

.nav-promotion-icon,
.nav-sponsor-icon,
.nav-app-icon,
.nav-vip-icon,
.nav-affiliate-icon {
  background: url("../../assets/home/home-icons.png") no-repeat center center;
  background-size: auto 100%;
  width: 25px;
  height: 20px;
}

.nav-promotion-icon {
  background-position: 44.5% 0%;
}
.nav-sponsor-icon {
  background-position: 63.5% 0%;
}
.nav-app-icon {
  background-position: 73% 0%;
}
.nav-vip-icon {
  background-position: 82.5% 0%;
}
.nav-affiliate-icon {
  background-position: 54% 0%;
}
</style>

<!-- Menu Styles -->
<style lang="scss">
.platform-menu {
  a {
    text-decoration: none;
  }

  display: flex;
  margin: 0 auto;
  // max-width: 1280px;
  justify-content: space-evenly;
  align-items: center;

  .platform-title {
    font-size: 40px;
    color: #343434;
    font-weight: 500;
    margin: 0;
  }

  .platform-box {
    flex: 1;
    cursor: pointer;
    padding: 25px 10px;
    position: relative;

    &:hover {
      background: $primary;

      .platform-img {
        transform: scale(1.05);
      }
    }

    .maintenance-box {
      position: absolute;
      top: 20%;
      bottom: 20%;
      padding-top: 15px;
      padding-bottom: 15px;
      color: #ffffff;
      font-size: 22px;
      font-weight: bold;
      width: 70%;
      z-index: 33;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 15px;

      p {
        margin-top: 3px;
        margin-bottom: 3px;
      }

      .small-size {
        font-size: 16px;

        span {
          display: block;
          line-height: 1;
        }
      }
    }

    // maintenance state
    &.maintenance:after {
      content: "";
      position: absolute;
      background: rgba(2, 9, 73, 0.4);
      top: 15%;
      width: 15%;
      width: 70%;
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 30px;
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
    }
  }

  .platform-img {
    transition: $page-trans;
    width: 145px;
    height: 162px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;

    &.slot-ag {
      background-image: url("../../assets/game/header_slot_ag.png");
    }

    &.slot-pt {
      background-image: url("../../assets/game/header_slot_pt.png");
    }

    &.slot-sw {
      background-image: url("../../assets/game/header_slot_sw.png");
    }

    &.slot-bbin {
      background-image: url("../../assets/game/header_slot_bbin.png");
    }

    &.slot-pg {
      background-image: url("../../assets/game/header_slot_pg.png");
    }

    &.slot-mg {
      background-image: url("../../assets/game/header_slot_mg.png");
    }

    &.slot-cq {
      background-image: url("../../assets/game/header_slot_cq.png");
    }

    &.fish-ag {
      background-image: url("../../assets/fishing/ag_fish_king.png");
    }

    &.fish-agf {
      background-image: url("../../assets/fishing/agf_fish_king.png");
    }

    &.fish-sg {
      background-image: url("../../assets/fishing/sg_fish_king.png");
    }

    &.fish-at {
      background-image: url("../../assets/fishing/at_fish_king.png");
    }

    &.fish-gps {
      background-image: url("../../assets/fishing/gps_fish_king.png");
    }

    &.fish-db {
      background-image: url("../../assets/fishing/pmfish_fish_king.png");
    }

    &.live-ag {
      background-image: url("../../assets/live/live_ag.png");
    }

    &.live-allbet {
      background-image: url("../../assets/live/live_allbet.png");
    }

    &.live-bbin {
      background-image: url("../../assets/live/live_bbin.png");
    }

    &.live-pm {
      background-image: url("../../assets/live/live_pm.png");
    }

    &.live-bg {
      background-image: url("../../assets/live/live_bg.png");
    }

    &.live-sexy {
      background-image: url("../../assets/live/live_sexy.png");
    }

    &.lottery-tcg {
      background-image: url("../../assets/lottery/lottery_tcg.webp");
    }

    &.lottery-bbin {
      background-image: url("../../assets/lottery/lottery_bbin.webp");
    }

    &.lottery-sgwin {
      background-image: url("../../assets/lottery/lottery_sgwin.webp");
    }
  }

  &.games,
  &.live {
    justify-content: center;

    .platform-box {
      max-width: 160px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;

      .plat-icon {
        height: 40px;
        width: unset;
      }
    }
  }

  &.games,
  &.live,
  &.lottery {
    justify-content: center;

    .platform-box {
      max-width: 160px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;

      .plat-icon {
        height: 40px;
        width: unset;
        margin-bottom: 5px;
      }
    }
  }

  &.slots {
    .plat-icon {
      min-height: 56px;
      object-fit: contain;
      object-position: center;
    }
  }

  &.games {
    .platform-box {
      .plat-icon {
        width: 75px;
        height: unset;
      }
    }
  }

  .header-fs-box {
    text-align: left;
    margin-left: 10px;
    cursor: pointer;

    .fs-title {
      margin: 0;
      font-size: 30px;
      color: #3370d0;
    }

    .fs-name {
      font-size: 20px;
      color: #343434;
      margin: 0;
    }

    .fs-desc {
      font-size: 18px;
      color: #666;
      margin-top: 3px;
    }

    .fs-percentage {
      background-image: url("../../assets/game/percentage.png");
      background-size: 1008px 71px;
      background-repeat: no-repeat;
      width: 168px;
      height: 71px;
      margin-top: 12px;

      &.p128 {
        background-position-x: -672px;
      }

      &.p120 {
        background-position-x: -840px;
      }

      &.p200 {
        background-position-x: -504px;
      }
    }
  }

  &.live,
  &.games,
  &.fish,
  &.lottery {
    .platform-title {
      font-size: 16px;
      color: #000;
      margin: 9px 0 15px;
    }
  }

  &.sports,
  &.poker,
  &.promo {
    .platform-slogan {
      // font-size: 1em;
      // color: $menu-bg;
      // margin: 15px 0 12px;
      height: 21px;
      font-size: 16px;
      color: #999;
      margin: 15px 0 12px;
    }
  }

  &.esports {
    .platform-box {
      display: flex;
      flex-direction: column-reverse;
      max-width: 340px;
      padding: 30px 40px 0;
      gap: 29px;
      // .imgbox {
      //   max-width: 320px;
      //   overflow: hidden;
      //   margin: 0 auto;
      // img {
      //   width: 465%;
      //   display: block;
      //   &:hover {
      //   -webkit-transition: all .5s ease;
      //   transition: all .5s ease;
      //   -webkit-transform: scale(1.03);
      //   transform: scale(1.03);
      //   }
      // }
      .imgbox {
        width: 260px;
        height: 160px;
        background-image: url(../../assets/home/header_esport_new_01.png);
        background-size: cover;
        overflow: hidden;
        -webkit-transition: all 0.5s ease-out;
        transition: all 0.5s ease-out;
      }

      &:hover {
        .imgbox {
          -webkit-transform: scale(1.03);
          transform: scale(1.03);
        }
      }

      .platform-slogan {
        height: 21px;
        margin: 0 auto;
        font-size: 16px;
        color: #999;
      }
    }
  }

  &.sports,
  &.poker {
    .platform-box {
      padding: 25px 0;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      gap: 15px;

      .imgbox {
        width: 340px;
        height: 300px;
        background-size: cover;
        overflow: hidden;
        -webkit-transition: all 0.5s ease-out;
        transition: all 0.5s ease-out;
      }

      &:hover {
        .imgbox {
          -webkit-transform: scale(1.03);
          transform: scale(1.03);
        }
      }

      .contents {
        padding-right: 0px;
        text-align: left;

        .platform {
          font-size: 24px;
          color: #4080ff;
        }
      }
    }
  }

  &.sports {
    .platform-box {
      padding: 0;
      gap: 10px;
      max-width: 410px;

      .imgbox {
        background-image: url(../../assets/home/header_sport_new_3.png);

        background-size: 410%;
        overflow: hidden;
        transition: all 0.5s ease-out;
        background-repeat: no-repeat;
        background-position: center center;

        flex: 6;
        width: 306px;
        height: 270px;
      }

      .contents {
        flex: 4;
      }
    }
  }

  &.poker {
    .platform-title {
      font-size: 32px;
    }

    .platform-box .contents .platform {
      font-size: 20px;
    }

    .platform-box {
      max-width: 500px;

      .imgbox {
        width: 225px;
        height: 250px;
        background-image: url(../../assets/home/header_live.png);
      }
    }
  }

  &.app {
    gap: 30px;

    .platform-box {
      flex: unset;
    }
  }

  &.promo {
    .platform-box {
      flex: unset;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .contents {
        text-align: left;

        .platform {
          color: #333;
          font-size: 2em;
        }

        .platform-slogan {
          width: 150px;
        }
      }
    }

    img {
      width: 300px;
    }
  }

  &.fish {
    justify-content: center;

    .platform-box {
      padding: 25px 10px;
      max-width: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

.register-dialog {
  .el-dialog__header .el-dialog__headerbtn {
    .el-dialog {
      &__close {
        color: #000000;
        opacity: 0.5;

        &:hover {
          opacity: 1;
          color: #000000;
        }
      }
    }
  }
}

.mailbox-notify {
  position: relative;
  margin-right: 20px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    filter: brightness(0.9);
  }
}

.notify-red {
  height: 10px;
  width: 10px;
  background: #db0011;
  position: absolute;
  border-radius: 50%;
  bottom: 0;
  right: -4px;
}

#captchaContainer {
  width: 100%;

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content,
  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content {
    background-image: linear-gradient(180deg, #fff, #f4f4f4) !important;
    border-color: #dcdfe6;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
    color: #424f72;
    font-family: "PingFang SC" !important;
  }

  .geetest_captcha.geetest_dark.geetest_lock_success .geetest_holder .geetest_content {
    // background-image: linear-gradient(180deg, #4e4e4e, 0%, #4e4e4e 100%) !important;
  }

  .geetest_captcha.geetest_dark.geetest_lock_success
    .geetest_content
    .geetest_tip_container
    .geetest_tips_wrap
    .geetest_tip {
    color: #39c522 !important;
  }

  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box_layer .geetest_box_btn,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box_layer .geetest_box_btn {
    border: 1px solid #dfdfdf;
    background: #fff;
  }
  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title {
    color: #424f72;
  }

  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box {
    background: #fff;
  }

  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar,
  .geetest_popup_wrap.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar {
    background-color: #ccc;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_mask,
  .geetest_popup_wrap.geetest_dark .geetest_holder .geetest_mask {
    background-color: #fff;
  }
}
</style>
