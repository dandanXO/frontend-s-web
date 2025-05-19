<template>
  <NewMemberGuide :openAppMenu="() => (selectedMenu = 'App')" :closeAppMenu="() => (selectedMenu = '')" />
  <header class="header-container" :class="scroll > 40 ? 'on-scrolled' : ''">
    <!-- <div class="top-bar-wrapper">
      <div class="top-bar-inner">
        <div class="timebox">{{ headTimeTxt }}</div>
        <div class="station-notice-container">
          <div class="station-notice-box">
            <!- Since svg icons do not carry any attributes by default ->
            <!- You need to provide attributes directly ->
            <div>
              <RiVolumeUpFill style="fill: #2db9e2; width: 20px !important" @click="openPopup(announcementList)" />
            </div>

            <div class="station-notice">
              <Vue3Marquee :clone="false" :duration="90" :style="store.token ? `width: 550px` : `width:780px`">
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
              <div class="mailbox-notify">
                <router-link to="/center/message">
                  <RiMailFill style="fill: #2db9e2; width: 20px" />
                  <div v-if="store.unreadTotal" class="notify-red"></div>
                </router-link>
              </div>
            </template>
          </div>
        </div>
        <div class="details" v-if="store.token">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <el-tag size="small" type="warning" effect="dark" style="margin-right: 10px; font-weight: bold">
                {{ store.vip }}
              </el-tag>
              {{ store.nickName }}
              <el-icon class="el-icon--right">
                <arrow-down style="height: 0.8em" />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">
                  <RiAccountCircleLine style="width: 20px; fill: #a8b5c3" />
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <RiMoneyCnyCircleLine style="width: 20px; fill: #a8b5c3" />
                  充值中心
                </el-dropdown-item>
                <el-dropdown-item command="c">
                  <RiBankCardLine style="width: 20px; fill: #a8b5c3" />
                  快速转账
                </el-dropdown-item>
                <el-dropdown-item command="d">
                  <RiCouponLine style="width: 20px; fill: #a8b5c3" />
                  优惠领取
                </el-dropdown-item>
                <el-dropdown-item divided command="e">
                  <RiLogoutBoxLine style="width: 20px; fill: #a8b5c3" />
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <a @click="refreshBalance" class="balance-amt">
            <span>余额：</span>
            <span class="amount">
              <span v-if="isLoadingBalance">Loading...</span>
              <span v-if="!isLoadingBalance">￥{{ store.balance }}</span>
            </span>
            <el-icon>
              <Refresh />
            </el-icon>
          </a>
          <div class="top-deposit">
            <router-link to="/center/deposit" class="common-btn">充值</router-link>
          </div>
        </div>
      </div>
    </div> -->
    <div class="top-nav-wrapper" @mouseleave="selectedMenu = ''">
      <div class="top-nav-inner">
        <router-link to="/home">
          <img src="../../assets/logo.png" />
        </router-link>
        <div class="navigations">
          <div class="header-menu-item" v-for="nav in navigations" :key="nav.name">
            <!-- <a
              v-if="nav.enName === 'Esports' || nav.enName === 'Sports'"
              @click="checkMaintenance"
              to="/"
            >
              <span>{{ nav.name }}</span>
              <span>{{ nav.enName }}</span>
            </a> -->

            <router-link :class="nav.icon" @mouseover="showSubMenu(nav)" @mouseup="selectedMenu = ''" :to="nav.path">
              <span v-if="nav.icon"><img :src="require(`@/assets/images/index/menu/menuicon_${nav.icon}.png`)" /></span>
              <span>{{ nav.name }}</span>
              <span v-if="!nav.icon" class="nav-enName">{{ nav.enName }}</span>
            </router-link>
          </div>
          <div @mouseleave="selectedMenu = ''" class="sub-menu" :style="'height:' + height + 'px;'">
            <GameMenu :list="slotPlatform" ref="el" v-if="selectedMenu === 'Game'" />
            <SportsMenu ref="el" v-if="selectedMenu === 'Sports'" @load-modal="openGame" />
            <EsportsMenu ref="el" v-if="selectedMenu === 'Esports'" @load-modal="openGame" />
            <EsportsCasualMenu ref="el" v-if="selectedMenu === 'Casual'" @load-modal="openGame" />
            <LiveCasinoMenu ref="el" v-if="selectedMenu === 'Live Casino'" @load-modal="openGame" />
            <LotteryMenu ref="el" v-if="selectedMenu === 'Lottery'" @load-modal="openGame" />
            <PokerMenu ref="el" v-if="selectedMenu === 'Poker'" @load-modal="openGame" />
            <FishingMenu ref="el" v-if="selectedMenu === 'Fishing'" @load-modal="openGame" />
            <PromotionMenu ref="el" v-if="selectedMenu === 'Promotion'" />
            <AppMenu ref="el" v-if="selectedMenu === 'App'" />
          </div>
        </div>
        <div v-if="!store.token" class="right-contents">
          <a class="common-btn" @click="openUsernameLogin()">登录</a>
          <a class="common-btn grey" @click="registerDialogVisible = true">开设账户</a>
          <a class="common-link" @click="openForgotDialog">忘记账号/密码？</a>
        </div>
        <div class="details" v-if="store.token">
          <el-dropdown class="header-menu-acc-dropdown" @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <el-tag size="medium" type="warning" effect="dark" style="margin-right: 10px; font-weight: bold">
                {{ store.vip }}
              </el-tag>
              {{ store.nickName }}
              <el-icon class="el-icon--right">
                <arrow-down style="height: 0.8em" />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">
                  <RiAccountCircleLine style="width: 20px; fill: #a8b5c3" />
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <RiMoneyCnyCircleLine style="width: 20px; fill: #a8b5c3" />
                  充值中心
                </el-dropdown-item>
                <el-dropdown-item command="c">
                  <RiBankCardLine style="width: 20px; fill: #a8b5c3" />
                  快速转账
                </el-dropdown-item>
                <el-dropdown-item command="d">
                  <RiCouponLine style="width: 20px; fill: #a8b5c3" />
                  优惠领取
                </el-dropdown-item>
                <el-dropdown-item divided command="e">
                  <RiLogoutBoxLine style="width: 20px; fill: #a8b5c3" />
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <a @click="refreshBalance" class="balance-amt">
            <span>余额</span>
            <span class="amount">
              <span v-if="isLoadingBalance">Loading...</span>
              <span v-if="!isLoadingBalance">￥{{ Math.trunc(store.balance * 100) / 100 }}</span>
            </span>
            <el-icon>
              <Refresh />
            </el-icon>
          </a>
          <div class="top-deposit">
            <router-link to="/center/deposit" class="common-btn">充值</router-link>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="loginDialogVisible"
      title="会员登录"
      width="50%"
      align-center
      style="max-width: 800px"
      @close="store.loginPageVisible = false"
    >
      <span>
        <el-tabs type="card" v-model="loginTabs">
          <el-tab-pane label="账户登录" name="usernameLogin">
            <el-form
              ref="loginRef"
              :rules="loginRules"
              :model="loginForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 50px auto"
            >
              <el-form-item tabindex="1" label="用户名" prop="loginName">
                <el-input v-model="loginForm.loginName" placeholder="输入用户名" />
              </el-form-item>
              <el-form-item tabindex="2" label="密码" prop="password">
                <el-input v-model="loginForm.password" placeholder="输入密码" type="password" show-password />
              </el-form-item>
              <el-form-item tabindex="3" label="验证码" prop="captchaCode">
                <el-row style="justify-content: start; align-items: center">
                  <el-col :span="24">
                    <!-- <el-input
                      v-model="loginForm.captchaCode"
                      label="验证码"
                      placeholder="验证码"
                      @keyup.enter="submitLogin"
                    /> -->
                    <div id="captchaContainer"></div>
                  </el-col>
                  <!-- <el-col :span="12">
                    <img style="width: 70%" :src="verificationImg" @click="getCode" />
                  </el-col> -->
                </el-row>
              </el-form-item>
              <el-button
                size="large"
                color="#3bafda"
                class="common-btn"
                style="margin-left: 100px"
                @click="submitLogin"
                :loading="loadingBtn"
              >
                登录
              </el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机登录" name="mobileLogin">
            <el-form
              ref="mobileLoginRef"
              :rules="mobileLoginRules"
              :model="loginForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 50px auto"
            >
              <el-form-item tabindex="1" label="手机号" prop="phoneNumber">
                <el-input v-model="loginForm.phoneNumber" placeholder="输入手机号" />
              </el-form-item>
              <el-form-item tabindex="2" label="手机验证码" prop="smsCode">
                <el-row :gutter="10" style="justify-content: center; align-items: center">
                  <el-col :span="12">
                    <el-input
                      v-model="loginForm.smsCode"
                      label="手机验证码"
                      placeholder="输入手机验证码"
                      @keyup.enter="submitLogin"
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
                    <div v-else disabled>已发送（倒数{{ loginCountdown }}秒）</div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button size="large" color="#3bafda" class="common-btn" style="margin-left: 100px" @click="phoneLogin">
                登录
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </span>
    </el-dialog>

    <el-dialog class="noPadding" v-model="registerDialogVisible" width="1280px" align-center style="max-width: 1200px">
      <div class="register-container">
        <div class="registered-left">
          <div class="title"></div>
          <ul class="tips">
            <li>标记有 * 者为必填项目。</li>
            <li>手机号码为找回密码的重要凭证，请务必填写真实信息。</li>
            <li>若公司有其他活动会邮件通知您，请您务必在个人中心完善信息，填写真实有效的邮箱。</li>
          </ul>
        </div>
        <div class="registered-right">
          <el-form
            class="inline-error"
            ref="registerRef"
            :rules="regRules"
            inline-message
            :model="regForm"
            label-width="100"
            label-suffix=":"
            style="margin: 50px 0"
          >
            <el-row>
              <el-col>
                <span class="title account">注册账号</span>
              </el-col>
            </el-row>

            <!-- <el-form-item label="姓名" prop="realName">
              <el-space>
                <el-input
                  class="wTip"
                  v-model="regForm.realName"
                  placeholder="输入姓名"
                  :rules="[
                    { required: true, message: '请输入姓名' },
                    {
                      pattern: '^([\u4e00-\u9fa5]*)$',
                      message: '请输入中文字符',
                      trigger: 'change'
                    }
                  ]"
                >
                  <template #append>范围在 2-12 位之间，由中文字符组成</template>
                </el-input>
              </el-space>
            </el-form-item> -->

            <el-form-item label="姓名" prop="realName">
              <el-space>
                <el-input v-model="regForm.realName" placeholder="输入姓名" />
                <el-tooltip content="范围在 2-12 位之间，由中文字符组成" placement="right">
                  <el-icon :size="10">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </el-space>
            </el-form-item>

            <el-form-item label="用户名" prop="loginName">
              <el-space>
                <el-input v-model="regForm.loginName" placeholder="输入用户名" />
                <el-tooltip content="范围在4-11位之间, 由字母和数字组成" placement="right">
                  <el-icon :size="10">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </el-space>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-row style="display: flex; align-items: center" :gutter="10">
                <el-col :span="20">
                  <el-input
                    class="half"
                    v-model="regForm.password"
                    placeholder="输入密码"
                    type="password"
                    show-password
                  />

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
                    <span
                      :class="{
                        'strong-pwd': pwdStrength == 'strong'
                      }"
                    >
                      强
                    </span>
                  </div> -->
                </el-col>
                <el-col :span="4">
                  <el-tooltip content="范围在6-12位之间, 由字母和数字组成" placement="right">
                    <el-icon :size="10">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-space>
                <el-input
                  class="half"
                  v-model="regForm.confirmPwd"
                  placeholder="输入确认密码"
                  type="password"
                  show-password
                />
                <el-tooltip content="范围在6-12位之间, 由字母和数字组成" placement="right">
                  <el-icon :size="10">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </el-space>
            </el-form-item>
            <!-- <el-row>
              <el-col>
                <span class="title account">会员资料</span>
              </el-col>
            </el-row> -->
            <!-- <el-form-item label="电话号码" prop="telephone">
              <el-input
                class="half"
                v-model="regForm.telephone"
                placeholder="输入电话号码"
                maxlength="11"
                :readonly="isSendOtp"
                :rules="[
                  {
                    required: true,
                    message: '请输入电话号码',
                    trigger: 'blur'
                  },
                  {
                    required: true,
                    message: '请输入有效的电话号码',
                    trigger: 'blur',
                    pattern:
                      '/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$/'
                  }
                ]"
              />
              <el-button
                class="common-btn"
                style="margin-left: 10px"
                type="button"
                v-if="!isSendOtp"
                @click="openCaptchaForm('REGISTER')"
              >
                获取验证码
              </el-button>
              <div style="margin-left: 10px" v-if="isSendOtp">
                获取已发送（倒数 {{ countdown }}秒)
              </div>
            </el-form-item> -->
            <el-form-item label="电话验证码" prop="smsCode" v-if="isSendOtp">
              <el-input class="half" v-model="regForm.smsCode" placeholder="输入电话验证码" />
            </el-form-item>
            <el-form-item label="验证码" prop="captchaCode">
              <el-row :gutter="10">
                <el-col :span="17">
                  <el-input
                    v-model="regForm.captchaCode"
                    label="验证码"
                    placeholder="验证码"
                    @keyup.enter="submitRegisterForm(registerRef)"
                  />
                </el-col>
                <el-col :span="7">
                  <img :src="verificationImg" @click="getCode" />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="推荐码" prop="codeAffiliate" v-if="!hasReferrer">
              <el-space>
                <el-input
                  :disabled="hasAffiliate"
                  class="half"
                  v-model="regForm.codeAffiliate"
                  placeholder="输入推荐码"
                />
                <!-- <el-input
                  v-else
                  class="half"
                  v-model="regForm.codeAffiliate"
                  readonly
                  disabled
                /> -->
                <el-icon>
                  <InfoFilled style="font-size: 10px; line-height: 20px" />
                </el-icon>
                <div class="link">若不是合营下会员无需填写输入推荐码</div>
                <!-- <el-tooltip
                  content="若不是合营下会员无需填写输入推荐码"
                  placement="right"
                >
                  <el-icon :size="10">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip> -->
              </el-space>
            </el-form-item>
            <el-form-item label="推荐码" prop="codeAffiliate" v-else>
              <el-space>
                <el-input class="half" v-model="regForm.codeAffiliate" placeholder="输入推荐码" disabled />
                <el-icon>
                  <InfoFilled style="font-size: 10px; line-height: 20px" />
                </el-icon>
                <div class="link">若不是合营下会员无需填写</div>
              </el-space>
            </el-form-item>
          </el-form>
          <el-button color="#3bafda" @click="resetRegForm(registerRef)">重新填写</el-button>
          <el-button @click="submitRegisterForm(registerRef)" color="#3bafda">确认注册</el-button>
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

    <el-dialog
      v-model="forgetPassDialogVisible"
      title="忘记账号/密码"
      width="50%"
      align-center
      style="max-width: 800px"
    >
      <span>
        <el-tabs type="card" v-model="activeTab" @tabChange="changeTab">
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

    <el-dialog class="noPadding" v-model="noticeDialogVisible" width="1280px" align-center style="max-width: 600px">
      <div class="noticedialog">
        <div class="title">系统提示</div>
        <div class="contents">
          尊敬的兴發会员：
          为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！兴發娱乐
          2022/10/13
          尊敬的兴發会员：为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！兴發娱乐
          2022/10/13
        </div>
        <el-button class="common-btn" @click="noticeDialogVisible = false">确认</el-button>
      </div>
    </el-dialog>

    <GameModal ref="modalGame"></GameModal>
  </header>
</template>

<script lang="js">

import "vue3-carousel/dist/carousel.css";
import {defineComponent, onMounted, onBeforeUnmount, ref, reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {userStore} from "@/store/index";
import { mailUnreadTotal } from "@/api/personal/mailbox";
import {getVerificationCode, register, findAccount} from "@/api/index/login";
import {sendSms, getAnnouncement} from "@/api/personal/personal";
import {ElMessage} from "element-plus";
import {Vue3Marquee} from 'vue3-marquee';
import moment from 'moment';
import { lsGet, lsStore, lsRemove, getTimeout } from '@/utils/utils'
import {
  RiVolumeUpFill,
  RiAccountCircleLine,
  RiMoneyCnyCircleLine,
  RiBankCardLine,
  RiCouponLine,
  RiLogoutBoxLine,
  RiMailFill
} from 'vue-remix-icons';
import GameMenu from '@/components/menu/GameMenu.vue'
import SportsMenu from '@/components/menu/SportsMenu.vue'
import EsportsMenu from '@/components/menu/EsportsMenu.vue'
import EsportsCasualMenu from '@/components/menu/EsportsCasualMenu.vue'
import LiveCasinoMenu from '@/components/menu/LiveCasinoMenu.vue'
import LotteryMenu from '@/components/menu/LotteryMenu.vue'
import PokerMenu from '@/components/menu/PokerMenu.vue'
import FishingMenu from '@/components/menu/FishingMenu.vue'
import PromotionMenu from '@/components/menu/PromotionMenu.vue'
import AppMenu from '@/components/menu/AppMenu.vue'
import 'vue3-marquee/dist/style.css'
import {useElementSize} from '@vueuse/core'
import {InfoFilled, ArrowDown, Refresh} from '@element-plus/icons-vue'
import {storeToRefs} from "pinia";
import { getPlatformList } from "@/api/platform/platform";
import GameModal from "@/components/modal/GameModal";
import {getSiteParamFromServer} from "@/api/index/site";
import { ElMessageBox } from "element-plus";
import NewMemberGuide from "../home/NewMemberGuide.vue";

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
    SportsMenu,
    EsportsMenu,
    EsportsCasualMenu,
    LiveCasinoMenu,
    LotteryMenu,
    PokerMenu,
    FishingMenu,
    PromotionMenu,
    AppMenu,
    InfoFilled,
    RiVolumeUpFill,
    RiMailFill,
    ArrowDown,
    Refresh,
    RiAccountCircleLine,
    RiMoneyCnyCircleLine, RiBankCardLine, RiCouponLine, RiLogoutBoxLine,
    GameModal,
    NewMemberGuide
  },
  data: () => ({
    // carousel settings
    navigations: [

    ],
  }),
  beforeMount() {
    const getSiteParam = () => {
		getSiteParamFromServer().then((res) => {
			this.navigations.splice(0);
			this.navigations.push({code: "Home", name: "首页", enName: "Home", path: "/home"})
			var data = JSON.parse(res.data);
			for ( var i = 0; i < data.length; i++ ) {
				// console.log(data[i]);
				if(data[i] === "E-sports") {
          this.navigations.push({code: "Esports", name: "电竞", enName: "Esports", path: "/esports", submenu: true});
        } else if(data[i] === "Casual"){
            this.navigations.push({code: "Casual", name: "小游戏", enName: "Casual", path: "/esportsCasual", submenu: true});
				} else if (data[i] === "Fishing"){
					this.navigations.push({code: "Fishing", name: "捕鱼", enName: "Fishing", path: "/fishing", submenu: true});
				} else if (data[i] === "Live Casino"){
					this.navigations.push({code: "Live Casino", name: "真人", enName: "Live", path: "/live-casino", submenu: true});
        } else if (data[i] === "Lottery"){
					this.navigations.push({code: "Lottery", name: "彩票", enName: "Lottery", path: "/lottery", submenu: true});
				} else if (data[i] === "Sports"){
					this.navigations.push({code: "Sports", name: "体育", enName: "Sports", path: "/sports", submenu: true});
				} else if (data[i] === "Slots"){
					this.navigations.push({code: "Game", name: "电子", enName: "Game", path: "/game", submenu: true});
				} else if (data[i] === "Poker"){
					this.navigations.push({code: "Poker", name: "棋牌", enName: "Poker", path: "/poker", submenu: true});
				}
			}
			this.navigations.push({code: "Agent", name: "代理加盟", enName: "Agent", path: "/agent", icon: "agent"});
			this.navigations.push({code: "Promotion", name: "优惠活动", enName: "Promotion", path: "/promotion", icon: "promo", submenu: true});
			this.navigations.push({code: "VIP", name: "VIP中心", enName: "VIP", path: "/vip", icon: "vip"});
			this.navigations.push({code: "App", name: "手机APP", enName: "App", path: "/app", icon: "app", submenu: true});
	  }).catch((err) => {
		console.log(err)
		this.navigations.splice(0);
		this.navigations.push({code: "Home", name: "首页", enName: "Home", path: "/home"})
		this.navigations.push({code: "Agent", name: "代理加盟", enName: "Agent", path: "/agent"});
		this.navigations.push({code: "Promotion", name: "优惠活动", enName: "Promotion", path: "/promotion", submenu: true});
		this.navigations.push({code: "VIP", name: "VIP", enName: "VIP", path: "/vip"});
		this.navigations.push({code: "App", name: "APP", enName: "App", path: "/app", submenu: true});
        });
	}
	getSiteParam();
  },
  setup() {
    // Register
    const registerTelephoneKey = `registerTelephoneKey`
    const registerSendOtpDisabledKey = `registeredSendOtpDisabled`

    const registerSendOtpDisabledTimeout = 60
    const registerSendOtpDisabledTimeoutLeft = getTimeout(registerSendOtpDisabledKey)

    let cachedTelephone = lsGet(registerTelephoneKey);
    let initialRegisterSendOtpDisabledTimeout = false

    if (registerSendOtpDisabledTimeoutLeft) {
      initialRegisterSendOtpDisabledTimeout = true
    } else {
      lsRemove(registerSendOtpDisabledKey)
      lsRemove(registerTelephoneKey)

      cachedTelephone = '';
    }

    const disableSendVerificationButton = ref(initialRegisterSendOtpDisabledTimeout);

    const updatePhoneVerifiedRules = {
      phone: [
        {
          required: true,
          message: "请输入电话地址",
          trigger: "blur",
        },
      ],
      verificationCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur",
        },
        {
          min: 4,
          message: "长度应为 4",
          trigger: "blur",
        },
      ],
    };

    const checkMaintenance = () => {
      ElMessageBox.alert("系统维护中", {
        center: true,
        confirmButtonText: "确认",
        showClose: false,
        buttonSize: "large"
      }).then(() => {
        router.push("/");
      });
      return;
    };

    const loginTabs = ref('usernameLogin');

    const openUsernameLogin = () => {
      loginDialogVisible.value = true;
      loginTabs.value = 'usernameLogin';
    }

    const openMobileLogin = () => {
      loginDialogVisible.value = true;
      loginTabs.value = 'mobileLogin';
    }

    const loadingBtn = ref(false);
    const store = userStore();
    const {token} = storeToRefs(store);
    const router = useRouter();
    const route = useRoute();
    const loginDialogVisible = ref(false)
    const registerDialogVisible = ref(false)
    const forgetPassDialogVisible = ref(false)
    const noticeDialogVisible = ref(false)
    const captchaDialogVisible = ref(false)
    const el = ref(null);
    const scroll = ref(0);
    const selectedMenu = ref(false);
    const {height} = useElementSize(el);
    const isSendOtp = ref(false);
    const headTimeTxt = ref("");
    const todayDate = () => {
      // const date = moment().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (中国标准时间)');
      // return date.replace('GMT', 'GMT').replace(/(\d{2})(\d{2})$/, '$1:$2');
      headTimeTxt.value = 'GTM+8 ' + moment().utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss ') + moment(new Date()).locale('zh-cn').format('dddd');
    }
    const showSubMenu = (nav) => {
      if (nav.submenu === true) {
        selectedMenu.value = nav.code
      } else {
        selectedMenu.value = ''
      }
    }
    let validatePass = async (r, v) => {
      if (v === "") {
        return Promise.reject('请输入密码');
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
      //   switch (level) {
      //     case 1:
      //       strength = "weak";
      //       break;
      //     case 2:
      //       strength = "normal";
      //       break;
      //     case 3:
      //     case 4:
      //       strength = "strong";
      //       break;
      //   }
      // } else {
      //   strength = "weak";
      // }
      // if (strength === "weak") {
      //   return Promise.reject("密码至少应该是好的");
      } else {
        return Promise.resolve();
      }
    };

    let validateName = async (r, v) => {
      if (!v) {
        return Promise.reject("请输入用户名");
      }

      const namePattern = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/; // Starts with a letter, length 4-11
      const letterCount = (v.match(/[a-zA-Z]/g) || []).length >= 2; // At least 2 letters
      const hasNumber = /\d/.test(v); // At least 1 number

      if (!(namePattern.test(v) && letterCount && hasNumber)) {
        return Promise.reject("用户名需符合格式：4-11位，首字母为字母，至少2个字母+数字组合");
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
      const chineseCharOnly = /^([\u4e00-\u9fa5]*)$/u;
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
      if (v === '') {
        return Promise.reject('请验证您的电话号码');
      } else if (!reg.test(v)) {
        return Promise.reject('电话号码只允许使用数字');
      } else {
        return Promise.resolve();
      }
    };
    const loginForm = reactive({
      name: '',
    })
    const loginRef = ref([])
    const mobileLoginRef = ref([])
    const captchaRef = ref([])
    const hasAffiliate = ref(false);
    const hasReferrer= ref(false);
    const regCountdown = ref(registerSendOtpDisabledTimeoutLeft)
    const loginCountdown = ref(0)

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
      phoneNumber: [
        {
          required: true,
          message: "请输入电话号码",
          trigger: "blur"
        },
        {
          pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          message: "请输入有效的中国手机号码",
          trigger: "blur",
        },
      ],
      smsCode: [
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
      telephone: cachedTelephone ?? '',
      // email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      smsCode: "",
      smsCodeId: ""
      // realName: "",
      // loginName: "",
      // password: "",
      // confirmPwd: "",
      // telephone: "",
      // email: "",
      // captchaCode: "",
      // regHost: location.hostname,
      // codeId: "",
      // codeAffiliate: "",
    });

    const regRules = {
      realName: [
        {
          required: true,
          min: 2,
          max: 12,
          message: "长度应为 2 至 12",
          trigger: "blur",
        },
        {
          validator: validateRealName,
          trigger: "change",
        },
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
          message: "请输入密码",
        },
        {
          validator: validatePass,
          trigger: "change",
        },
      ],
      confirmPwd: [
        {
          required: true,
          message: "请输入确认密码",
          trigger: "blur",
        },
        {
          validator: validatePass2,
          trigger: "change",
        },
      ],
      telephone: [
        {
          required: false,
          message: "请输入电话号码",
          trigger: "blur"
        },
        {
          pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          message: "请输入有效的中国手机号码",
          trigger: "blur",
        },
      ],
      // birthday: [
      //   {
      //     required: true,
      //     message: "Birthday is required",
      //     trigger: "blur",
      //   },
      // ],
      email: [
        {
          required: true,
          message: "请输入您的邮箱",
          trigger: "blur",
        },
        {
          type: "email",
          message: "电子邮件地址无效",
          trigger: "blur",
        },
        {
          max: 50,
          message: "长度应小于 50",
          trigger: "blur",
        },
      ],
      smsCode: [
        {
          required: true,
          message: "需要验证码",
          trigger: "blur",
        },
        {
          min: 6,
          max: 6,
          message: "长度应为 6",
          trigger: "change",
        },
      ],
      captchaCode: [
        {
          required: true,
          message: "需要验证码",
          trigger: "blur",
        },
        {
          min: 4,
          max: 4,
          message: "长度应为 4",
          trigger: "change",
        },
      ],
    };
    const passForm = reactive({
      name: '',
    })


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

    const passRef = ref([])
    const forgetPassRules = {
      email: [
        {
          required: true,
          message: "请输入您的邮箱",
          trigger: "blur",
        },
        {
          type: "email",
          message: "电子邮件地址无效",
          trigger: "blur",
        },
        {
          max: 50,
          message: "长度应小于 50",
          trigger: "blur",
        },
      ],
    }

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

    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true
        regForm.codeAffiliate = affCode;
      }
    }

    const onLogout = () => {
      store.memberLogout().then(() => {
        location.reload();
      });
    };
    const registerRef = ref([])
    const resetRegForm = (formEl) => {
      if (!formEl) return
      formEl.resetFields()
    }

    const countdown = ref(60)
    const startCountdown = () => {
      countdown.value = 60;
      const countdownInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          triggerFunction();
          clearInterval(countdownInterval);
        }
      }, 1000);
    };

    const triggerFunction = () => {
      isSendOtp.value = false;
    };

    const sendOtp = async() => {
      if (captchaForm.type === 'REGISTER') {
        const smsDetail = {
          telephone: regForm.telephone,
          captchaCode: captchaForm.captchaCode,
          codeId: captchaForm.codeId
        }
        sendSms(smsDetail)
          .then((response) => {
            if (response.code == 0) {
              disableSendVerificationButton.value = true
              isSendOtp.value = true;
              startCountdown();
              regForm.smsCodeId = response.data.codeId;
              getCode();

              ElMessage({
                type: 'success',
                message: `发送 ${smsDetail.telephone} 手机验证码成功`
              });

              captchaDialogVisible.value = false;

              regCountdown.value = registerSendOtpDisabledTimeout;

              const now = new Date();

              now.setSeconds(now.getSeconds() + registerSendOtpDisabledTimeout);

              lsStore(registerSendOtpDisabledKey, now.getTime());
              lsStore(registerTelephoneKey, regForm.telephone);

              countdownTimer('REGISTER')
            } else {
              getCode();
            }
          })
      } else if (captchaForm.type === 'LOGIN') {
        const smsDetail = {
          telephone: loginForm.phoneNumber,
          captchaCode: captchaForm.captchaCode,
          codeId: captchaForm.codeId
        }
        sendSms(smsDetail)
          .then((response) => {
            if (response.code == 0) {
              loginForm.smsCodeId = response.data.codeId;
              ElMessage({
                type: 'success',
                message: '发送手机验证码成功'
              });
              captchaDialogVisible.value = false;
              getCode();
              loginCountdown.value = 30;
              countdownTimer('LOGIN')
            } else {
              getCode();
            }
          })
      }
    };

    const countdownTimer = (type) => {
      if (type === 'REGISTER') {
        if (regCountdown.value > 0) {
          setTimeout(() => {
            regCountdown.value -= 1
            countdownTimer('REGISTER')
          }, 1000)
        } else {
          lsRemove(registerSendOtpDisabledKey);
          lsRemove(registerTelephoneKey);

          disableSendVerificationButton.value = false
        }
      } else if (type === 'LOGIN') {
        if (loginCountdown.value > 0) {
          setTimeout(() => {
            loginCountdown.value -= 1
            countdownTimer('LOGIN')
          }, 1000)
        }
      }
    }

    const openCaptchaForm = (type) => {
      if (type === 'REGISTER') {
        registerRef.value.validateField('telephone').then((resp) => {
          // captchaForm.captchaCode = "";
          captchaForm.type = type;
          captchaDialogVisible.value = true;
          getCode();
        }).catch((err) => {
            ElMessage({
              message: '请输入有效的中国手机号码',
              type: 'error',
            })
        })
      } else if (type === 'LOGIN') {
        mobileLoginRef.value.validateField('phoneNumber').then((resp) => {
          // captchaForm.captchaCode = "";
          captchaForm.type = type;
          captchaDialogVisible.value = true;
          getCode();
        }).catch((err) => {
            ElMessage({
              message: '请输入有效的中国手机号码',
              type: 'error',
            })
        })
      } else {
        captchaForm.type = type;
        captchaDialogVisible.value = true;
        getCode();
      }
    };

    const submitRegisterForm = async (elForm) => {
      if (!elForm) return
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
                      type: 'success',
                      message: '注册成功'
                    });
                    store.autoLogin(response.data);
                    registerDialogVisible.value = false;
                    // loginDialogVisible.value = false;

                    sessionStorage.removeItem("REFERRAL_CODE");
                    getCode();
                    store.regSuccessGuideVisible = true;
                  } else {
                    getCode();
                    // message.error(response.message);
                  }
                }).catch(() => {
                  getCode();
                })
          })();
        } else {
          getCode();
        }
      })
    }
    const modalGame = ref(null)
    const openGame = (gameName, code, gameCode) => {
      modalGame.value.open(gameName, code, gameCode);
    }

    const announcementActive = ref('1')
    const announcementList = ref([])
    const announcementTypes = ref([])
    const loadAnnouncement = () => {
      getAnnouncement().then((res) => {
        // console.log(res)
        if (res.code === 0) {
          const d = res.data.announcements
          announcementTypes.value = res.data.type
          if (res.data.length > 0) {
            announcementActive.value = res.data.type[0].id
          }
          announcementList.value = d
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      })
    }
    const announcementTabChange = () => {
      // homeState.tabMatchs.forEach(element => {
      //   if (nk === element.gameId) {
      //     getMatchData(element);
      //   }
      // });
    };
    const isStationNotice = ref(false)
    const noticeTitle = ref('')
    const openPopup = (noticeType) => {
      if (noticeType) {
        announcementActive.value = '0'
        noticeTitle.value = noticeType.title
        isStationNotice.value = true
      }
    }

    let headTimer = null;
    const slotPlatform = ref(null)
    const sortMenu = () => {
      getPlatformList().then((data) => {
				slotPlatform.value = data.filter(element => element.gameType.includes("SLOT"));
      })
    }
    const getSummonCode = () => {
        const summonCode = sessionStorage.getItem("SUMMON_CODE");
        // && route.query && route.query.refer
        if (summonCode) {
            loginForm.summoner = summonCode;
        }
    };
    onMounted(async () => {
      sortMenu();
      if (regCountdown.value > 0)
        countdownTimer('REGISTER')

        loadUnreadMailbox();

      getAffiliateCode();
      loadAnnouncement();

      getCode();
      getReferalCode();

      if (token) {
        store.getBalance();
        store.getMemberInfo();
      }

      if (store.loginPageVisible) {
        loginDialogVisible.value = true
      } else {
        loginDialogVisible.value = false
      }
      if (headTimer) {
        clearInterval(headTimer);
      } else {
        headTimer = setInterval(todayDate, 1000);
      }
      try {
          // Step 1: Load Geetest script
          await loadScript("https://static.geetest.com/v4/gt4.js");

          // Step 2: Call your backend to get Geetest configuration (fake config for demo)
          const geetestConfig = {
              config: {
                  captchaId: "49cbcb1424a170f03f8c38648a1b2b31",
                  language: "zh",
                  nativeButton: {
                      width: '100%',
                      height: '48px',
                  },
                  nextWidth: '200px',
                  product: 'float',
              },
              handler: captchaHandler
          };

          // Step 3: Initialize Geetest with the config
          await initGeetest(geetestConfig);
      } catch (error) {
          message.value = "Error loading Geetest!";
          console.error("Geetest loading error:", error);
      }

      getSummonCode();
    });

    onBeforeUnmount(() => {
      clearInterval(headTimer);
      headTimer = null;
    });

    const stopWatchLoginDialogVisible = watch(loginDialogVisible, () => {
      initGeetest()
      stopWatchLoginDialogVisible();
    });

    watch(loginTabs, () => {
      window.captchaObj.reset();
    })

    watch(() => registerDialogVisible.value, () => {
      if (registerDialogVisible.value) {
        getAffiliateCode();
      }
    });

    watch(() => store.loginPageVisible, () => {
      if (store.loginPageVisible) {
        loginDialogVisible.value = true
      } else {
        loginDialogVisible.value = false
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });

    watch(() => store.regPageVisible, () => {
      if (store.regPageVisible) {
        registerDialogVisible.value = true
      } else {
        registerDialogVisible.value = false
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });

    const getReferalCode = () => {
      const referCode = sessionStorage.getItem("REFERRAL_CODE");
      if (referCode && route.query && route.query.refer) {
        registerDialogVisible.value = true;
        hasReferrer.value = true
        regForm.referrer = referCode;
      }
    }


    const isLoadingBalance = ref(false)
    const refreshBalance = () => {
      isLoadingBalance.value = true;
      store.getBalance().then(() => {
        isLoadingBalance.value = false;
      })
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
          loginForm.captchaCode = "";
          regForm.captchaCode = "";
          forgotPwdForm.captchaCode = "";
        }
      })
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
      passRef.value.validate().then(() => {
        loadingBtn.value = true;
        findAccount(passForm).then((res) => {
          loadingBtn.value = false;
          if (res.code === 0) {
            ElMessage.success("您的帐号已经发送到注册邮箱");
          }
        }).catch((e) => {
          loadingBtn.value = false;
        });
      });
    }

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
                summoner: loginForm.summoner,
                // captchaCode: loginForm.captchaCode,
                // codeId: loginForm.codeId,
                lotNumber: loginForm.lot_number,
                captchaOutput: loginForm.captcha_output,
                passToken: loginForm.pass_token,
                genTime: loginForm.gen_time
              })
              .then(() => {
                const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
                if (store.token) {
                  router.push(jumpUrl);
                  window.scroll({ behavior: "smooth", left: 0, top: 0 });
                  loginDialogVisible.value = false;

                  sessionStorage.removeItem("REFERRAL_CODE");
                  sessionStorage.removeItem("SUMMON_CODE");
                  loginForm.loginName = null;
                  loginForm.password = null;
                } else {
                  loginForm.captchaCode = null
                  getCode();
                }
                loadingBtn.value = false;
              }).catch((error) => {
            // message.error(error.message);
            console.log(error.message);
            getCode();
            loadingBtn.value = false;
          }).finally(() => {
            loadingBtn.value = false;
          });
        })
        .catch(() => {})
        .finally(() => {
          loadingBtn.value = false;
        });
      })();
    };

    const openForgotDialog = () => {
      getCode();
      forgetPassDialogVisible.value = true;
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
                code: loginForm.smsCode,
                smsCodeId: loginForm.smsCodeId,
              })
              .then(() => {
                const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
                if (store.token) {
                  router.push(jumpUrl);
                  loginDialogVisible.value = false;
                  store.loginPageVisible = false;

                  sessionStorage.removeItem("REFERRAL_CODE");
                } else {
                  loginForm.phoneNumber = null
                  loginForm.code = null
                }
              }).catch((error) => {
            // message.error(error.message);
            console.log(error.message);
          });
        });
      })();
      loadingBtn.value = false
    };

    const handleCommand = (command) => {
      if (command === 'a') {
        router.push('/center/personal');
      }
      if (command === 'b') {
        router.push('/center/deposit');
      }
      if (command === 'c') {
        router.push('/center/transfer');
      }
      if (command === 'd') {
        router.push('/promotion');
      }
      if (command === 'e') {
        onLogout()
      }
    }
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

    const mailboxUnreadData = ref([]);

    const isMailboxUnread = ref(false);

    const loadUnreadMailbox = () => {
      if (store.token !== null) {
        mailUnreadTotal().then((res) => {
          if (res.code === 0) {
            const response = res.data;
            if(response > 0) {
              isMailboxUnread.value = true
            }
          }
        }).catch((error) => {
          console.log(error);
        });
      }

    };

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
            captchaId: "c0e407fcee1b1c3a51d269495cf9524c",
            language: "zh",
            nativeButton: {
              width: '300px',
              height: "40px"
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


    watch(
        () => regForm.password,
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
    );


    return {
      token,
      el,
      height,
      showSubMenu,
      scroll,
      selectedMenu,
      noticesList: [
        "尊敬的兴發会员：为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！兴發娱乐 2022/10/13",
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
      registerDialogVisible,
      submitRegisterForm,
      registerRef,
      loginRules,
      mobileLoginRules,
      captchaRules,
      regRules,
      activeTab,
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
      submitForgetPwdCode,
      submitForgetPass,
      pwdStrength,
      resetRegForm,
      openGame,
      modalGame,
      headTimeTxt,
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
      typeActive: '1',
      getAffiliateCode,
      hasAffiliate,
      hasReferrer,
      countdownTimer,
      regCountdown,
      loginCountdown,
      isSendOtp,
      updatePhoneVerifiedRules,
      loadUnreadMailbox,
      mailboxUnreadData,
      isMailboxUnread,
      validatePhoneNumber,
      loginTabs,
      openUsernameLogin,
      openForgotDialog,
      openMobileLogin,
      checkMaintenance,
      countdown,
      startCountdown,
      slotPlatform,
      sortMenu
    }
  }
});
</script>
<style lang="scss">
body {
  .el-button.is-disabled,
  .el-button.is-disabled:hover {
    background-color: #5e5e5e;
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

  header {
    .top-nav-wrapper {
      .el-input__wrapper {
        width: 100px;
        height: 28px;
        gap: 0px;
        border-radius: 93px 0px 0px 0px;
        background: #ffffff33;
        border: 0;
      }
    }
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
  gap: 30px;

  .balance-amt {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #b8b8b8;
    font-size: 14px;

    span {
      min-width: 40px;
      text-align: right;
    }

    .amount {
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
    }

    .el-icon {
      // height: 2em;
      // width: 2em;
      // line-height: 2em;

      svg {
        width: 1.3em;
        height: 1.3em;
        color: #32ceed;
      }
    }
  }

  .top-deposit {
    a {
      text-decoration: none;
      background: linear-gradient(180deg, #32ceed 0%, #1c7587 100%);
      border-radius: 100px;
    }
  }
}

.el-dropdown-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.hamburger {
  display: none;
}

.header-container {
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
        max-width: $maxwidth;
        width: 100%;
        margin: 0 auto;
        display: flex;
        font-size: 0.75em;
        line-height: 1.2em;
        justify-content: flex-start;
        align-items: center;
        gap: 5px;

        .timebox {
          min-width: 225px;
        }

        .station-notice-container {
          flex: 3;

          .station-notice-box {
            display: flex;
            gap: 10px;
            width: 100%;
          }
        }

        .station-notice {
          padding-top: 4px;
          width: 100%;

          .station-notice-item {
            margin-right: 50px;
          }
        }

        .right-contents {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
  }

  .top-nav {
    &-wrapper {
      padding: 13px;
      position: relative;
      width: calc(100% - 26px);
      backdrop-filter: blur(60px);
      background: #ffffff1a;
      .common-link {
        cursor: pointer;
        font-size: 12px;
        color: #ffffff;
      }
      .common-btn {
        border-radius: 100px; 
      }
      .top-nav-inner {
        max-width: $maxwidth;
        margin: 0 auto;
        width: 100%;
        display: flex;
        // justify-content: center;
        justify-content: space-between;
        align-items: center;
        gap: 20px;

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
          align-items: center;
          // width: 100%;
          gap: 20px;
          text-align: center;

          a {
            display: flex;
            flex-direction: column;
            text-decoration: none;
            gap: 5px;
            font-family: PingFang SC;
            font-size: 18px;
            font-weight: 400;
            line-height: 24px;
            white-space: nowrap;

            span:first-child {
              color: #b8b8b8;
              // font-size: 1rem;
            }
            &.agent,
            &.promo,
            &.app,
            &.vip {
              margin-top: -5px;
              align-items: center;
              font-size: 12.6px;
              &:after {
                content: unset;
              }
            }
            &.agent {
              margin-left: 50px;
            }

            img {
              height: 25px;
              filter: grayscale(1);
              display: block;
            }

            span:last-child {
              color: #b8b8b8;
              text-transform: uppercase;
              // font-size: 0.75rem;
            }

            &:after {
              content: "";
              width: 80%;
              height: 2px;
              margin: 0 auto;
            }

            &:hover,
            &.router-link-active {
              img {
                filter: unset;
              }
              font-weight: 600;
              span:first-child {
                color: $link-active;
              }

              span:last-child {
                color: $link-active;
              }

              &:after {
                background: $link-active;
              }
            }

            .nav-enName {
              font-size: 70%;
            }
          }

          .sub-menu {
            transition: $page-trans;
            background: rgba(14, 18, 27, 0.96);
            overflow: hidden;
            height: 0px;
            position: absolute;
            left: 0;
            top: 100%;
            width: 100%;
          }
        }
      }
    }
  }
}

.register-container {
  display: flex;
  min-height: 90vh;

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
    padding: 80px 50px;

    form .title {
      height: 18px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #5075ad;
      margin: 30px 0;
      width: 100%;
      text-align: left;
      display: block;
    }
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

  span {
    padding: 8px 3px;
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
    // font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
    //   sans-serif;
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
</style>

<!-- Menu Styles -->
<style lang="scss">
.platform-menu {
  display: flex;
  margin: 0 auto;
  max-width: 1280px;
  justify-content: center;
  align-items: center;

  a {
    text-decoration: none;
  }

  .platform-title {
    color: #ffffff;
  }

  .platform-box {
    flex: 1;
    cursor: pointer;
    padding: 25px 10px;

    &:hover {
      background: $primary;

      .platform-img {
        transform: scale(1.05);
      }
    }
  }

  .platform-img {
    transition: $page-trans;
    width: 145px;
    height: 150px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;

    &.slot-pt {
      background-image: url("../../assets/game/header_slot_pt.png");
    }

    &.slot-sw {
      background-image: url("../../assets/game/header_slot_sw.png");
    }

    &.slot-pp {
      background-image: url("../../assets/game/header_slot_pp.png");
    }

    &.slot-pg {
      background-image: url("../../assets/game/header_slot_pg.png");
    }

    &.slot-mg {
      background-image: url("../../assets/game/header_slot_mg.png");
    }

    &.slot-sg {
      background-image: url("../../assets/game/header_slot_sg.png");
    }

    &.fish-ag {
      background-image: url("../../assets/fishing/ag_fish_king.png");
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
  }

  &.fish {
    max-width: 800px;
  }

  &.games {
    .platform-box {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;
    }
  }

  .header-fs-box {
    text-align: left;
    margin-left: 10px;
    cursor: pointer;

    .fs-title {
      font-size: 1.6rem;
      color: #2ebfe5;
      margin: 0;
    }

    .fs-name {
      font-size: 1.6rem;
      line-height: 1.6rem;
      color: #fff;
      margin: 0;
    }

    .fs-desc {
      font-size: 1.3rem;
      color: #5a758e;
      margin: 3px 0 0 0;
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
        background-position-x: -842px;
      }
    }
  }

  &.live,
  &.sports,
  &.esports,
  &.poker,
  &.lottery,
  &.promo {
    .platform-title {
      font-size: 2.5em;
      line-height: 1em;
      color: #2ebfe5;
      margin: 0;
    }

    .platform-slogan {
      font-size: 1em;
      color: $menu-bg;
      margin: 15px 0 12px;
    }
  }

  &.live {
    .platform-title {
      font-size: 2em;
    }
  }

  &.sports,
  &.esports,
  &.poker {
    .platform-box {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &.rearranged-box {
        flex-direction: column;
        padding: 15px 25px;
        text-align: center;

        .platform {
          display: none;
        }

        img {
          width: 220px;
        }

        .contents {
          text-align: center;
          padding-right: 0px;
        }
      }

      .contents {
        padding-right: 30px;
        text-align: left;

        .platform {
          color: #ffffff;
          font-size: 1.5em;
        }
      }
    }
  }

  &.app {
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
          color: #ffffff;
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
    .platform-box {
      padding: 25px 80px;
      display: flex;
      align-items: center;
      flex-direction: column;
    }
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

.mailbox-notify {
  position: relative;
  margin-right: 20px;
}

#captchaContainer {
  width: 100%;

  .geetest_captcha {
    color: #fff;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content,
  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content {
    background-image: linear-gradient(180deg, #fff, #f4f4f4) !important;
    border-color: #333c4b;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
    color: #fff;
    font-family: "PingFang SC" !important;
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
    background: #2a313e;
  }
  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title {
    color: #b8b8b8;
  }

  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box {
    background: #2a313e;
  }

  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar,
  .geetest_popup_wrap.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar {
    background-color: #b8b8b8;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
    color: #409eff;
  }
  .geetest_captcha.geetest_dark .geetest_holder .geetest_mask,
  .geetest_popup_wrap.geetest_dark .geetest_holder .geetest_mask {
    background-color: #2a313e;
  }

  .geetest_captcha .geetest_holder .geetest_content .geetest_space_center {
    background-color: #2a313e;
  }
}
</style>
