<template>
  <div class="login-container">
    <div class="logo">
      <img src="../assets/logo.png" />
    </div>

    <div class="landing-img">
      <img src="../assets/images/login/landing-img.png" />
    </div>

    <div class="landing-btns">
      <div class="btn-yellow">Login</div>
      <div class="btn-yellow">Register</div>
      <div class="btn-purple">Play As Guest</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  position: relative;
  background: url(../assets/images/login/landing-bg.png) no-repeat center center;
  background-size: cover;
  height: 100vh;

  .logo {
    margin: 0 auto;
    padding: 25px 0 30px;
    display: flex;
    width: 150px;

    img {
      width: 100%;
    }
  }

  .landing-img {
    img {
      display: block;
      width: 95%;
      margin: auto;
      max-width: 400px;
    }
  }

  .landing-btns {
    display: flex;
    gap: 16px;
    flex-direction: column;
  }

  .btn-yellow {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    line-height: 1;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    font-weight: 700;
    width: 95%;
    height: 48px;
    transition: 0.3s all;
    background-image: url(../assets/images/login/btn-yellow.png);
    color: #ffffff;
    margin: auto;
  }

  .btn-purple {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    line-height: 1;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    font-weight: 700;
    width: 95%;
    height: 48px;
    transition: 0.3s all;
    background-image: url(../assets/images/login/btn-purple.png);
    color: #ffffff;
    margin: auto;
  }
}
</style>
