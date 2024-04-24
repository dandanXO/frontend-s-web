<template>
  <div class="not-loggedin-container">
    <div class="account">
      <input type="text" class="account-input" placeholder="계정" />
    </div>
    <div class="password">
      <input type="password" class="password-input" placeholder="암호" />
    </div>
    <div class="register">
      <div class="register-text">등록</div>
    </div>
    <div class="login">
      <div class="login-text">로그인</div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.not-loggedin-container {
  width: 528px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.account,
.password {
  width: 140px;
  height: 40px;
  background: #080a0e;
  display: flex;
  align-items: center;
}
.account-input,
.password-input {
  border: none;
  padding-left: 12px;
  color: #fff;

  &:focus {
    outline: none;
  }

  background: transparent;
}

.register {
  width: 100px;
  height: 36px;
  background-image: url("../../assets/images/login/register-btn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .register-text {
    font-size: 16px;
    line-height: 22.4px;
    color: #fff;
  }
}

.login {
  width: 100px;
  height: 36px;
  background-image: url("../../assets/images/login/login-btn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .login-text {
    font-size: 16px;
    line-height: 22.4px;
    color: #fff;
  }
}
</style>
