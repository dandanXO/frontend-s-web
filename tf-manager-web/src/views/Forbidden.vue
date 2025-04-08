<template>
  <div class="forbidden-page">
    <div class="container bg">
      <div class="decs1">
        <div>
          <span class="title1">ACCESS RESTRICTED</span>
          <br>
          <span class="title2">{{ ipAddress ? '访问' : '账号' }}受到限制</span>
        </div>
        <br>
        <div v-if="ipAddress">
          <span class="ip">
            您的IP地址为:
            <span id="data">{{ ipAddress }}</span>
            <span class="ipLock">
              <img src="../assets/403-images/lock_icon.png">
            </span>
          </span>
        </div>
        <div v-if="loginName">
          <span class="ip">
            您的账号为:
            <span id="data">{{ loginName }}</span>
            <span class="ipLock">
              <img src="../assets/403-images/lock_icon.png">
            </span>
          </span>
        </div>
        <br>
        <div>
          <span class="ip">
            您的URL域名为:
            <span id="data1">{{ hostName }}</span>
            <span class="ipLock">
              <img src="../assets/403-images/lock_icon.png">
            </span>
          </span>
        </div>

        <div>
          <br>
          <span class="highlight">
            Date:
            <span id="date">{{ formattedDate }}</span>
          </span>
          <br>
          <span class="highlight">
            Time:
            <span id="time">{{ formattedTime }}</span>
          </span>
        </div>

        <div class="back-text" @click="backtoMain">
          Back to Main Page.
          <br>
          返回主页面。
        </div>

        <div
          class="super-highlight"
          style="margin-top: 12px;margin-bottom: 8px"
          v-if="isCNWeb"
        >
          下载
          <a href="https://am35.cc" target="_blank">am35.cc</a>
          加
          <span>{{ vipAccId }}</span>
          客服号协助处理
        </div>

        <div class="decs cn">
          <p>
            <b>
              由于地区限制，您所尝试的网页无法打开。如果您有任何疑问，请联系我们的客服团队。
            </b>
          </p>
        </div>
        <b>
          <hr>
          <div class="decs en">
            <p>
              The location you are trying to access the website from is
              currently restricted. If you have any concerns, please contact our
              Customer Services.
            </p>
          </div>
          <hr>
          <div class="decs en">
            <p>
              Vị trí hiện tại của bạn đăng nhập vào trang web bị hạn chế. Nếu có
              bất kỳ thắc mắc gì, xin vui lòng liên hệ Đội ngũ Chăm Sóc Khách
              Hàng của chúng tôi.
            </p>
          </div>
          <hr>
          <div class="decs en">
            <p>
              Pelanggan terhormat.Sesuai dengan peraturan perundangan, situs
              tujuan anda tidak dapat diakses. Jika Anda mengalami kendala,
              Silahkan hubungi layanan pelanggan kami.
            </p>
          </div>
          <hr>
          <div class="decs en">
            <p>
              สถานที่ที่คุณพยายามเข้าถึงไซต์ถูก จำกัด ไว้ในขณะนี้ ถ้าคุณมี
              หากคุณมีข้อสงสัยใดๆ กรุณาติดต่อฝ่ายบริการลูกค้าของเรา
            </p>
          </div>
          <hr>
          <div class="decs en">
            <p>
              La página que está intentando ver no está disponible en esta
              localización. Disculpe las molestias causadas. Si lo desea puede
              contactar con nuestro servicio de atención al cliente
            </p>
          </div>
        </b>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const ipAddress = sessionStorage.getItem('myIPAddress') || ''
const loginName = sessionStorage.getItem('myloginName') || ''

const backtoMain = () => {
  router.push('/')
}
const hostName = window.location.hostname
// Get the current date
const currentDateTime = new Date()

const month = currentDateTime.getMonth() + 1 // Months are zero-indexed
const day = currentDateTime.getDate()
const year = currentDateTime.getFullYear()

const hours = currentDateTime.getHours()
const minutes = currentDateTime
  .getMinutes()
  .toString()
  .padStart(2, '0')
const seconds = currentDateTime
  .getSeconds()
  .toString()
  .padStart(2, '0')

const formattedDate = `${month}/${day}/${year}`
const formattedTime = `${hours}:${minutes}:${seconds}`

const vipAccId = computed(() => {
  if(window.location.host.includes("dy2-")){
    return "DY8888"
  }else if(window.location.host.includes("xf1-")){
    return "XF8888"
  }else{
    return "LH6888";
  }
});

const isCNWeb = computed(() => {
  if (window.location.host.includes("localhost") || window.location.host.includes("127.0.0.1") || window.location.host.includes("lh1-") || window.location.host.includes("dy2-") || window.location.host.includes("xf1-")) {
    return true;
  }
  return false;
})

</script>

<style scoped>
.forbidden-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  color: #fff;
  text-align: center;
  overflow: hidden;
  background: url(../assets/403-images/bg.png) no-repeat center center;
}
.back-text {
  background: #ff0000;
  display: inline-block;
  padding: 10px;
  margin-top: 10px;
  border-radius: 20px;
}

p {
  margin-bottom: 0;
  width: 60%;
}

.icon {
  /* background: url(../assets/403-images/stop_icon.png) no-repeat center center; */
  background-size: contain;
  width: 100%;
  height: 400px;
  position: relative;
}

.bg {
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 95%;
  text-align: center;
}

.decs {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.decs1 {
  text-align: center;
  display: block;
  justify-content: center;
  align-items: center;
  margin-bottom: 3em;
}

.title1 {
  font-size: 24px;
  font-family: 'MontSerrat';
  color: #464545;
}

.title2 {
  font-size: 46px;
  font-family: 'Microsoft Yahei';
  font-weight: bold;
  color: #464545;
}

.ip {
  background-color: #333333;
  color: #fff;
  margin: auto;
  position: relative;
  border-radius: 6px 0 0 6px;
  padding: 10px 55px 10px 15px;
}

.ipLock {
  background-color: #ff0000;
  color: #fff;
  margin: auto;
  position: relative;
  padding: 10px 20px;
  border-radius: 0 6px 6px 0;
  margin-right: -65px;
  margin-left: 20px;
  img {
    width: 14px;
  }
}

.en {
  font-size: 14px;
  font-family: 'MontSerrat';
  font-weight: lighter;
  color: #5e5f5f;
}

.cn {
  font-size: 14px;
  font-family: 'Microsoft Yahei';
  font-weight: bold;
  color: #5e5f5f;
}

.highlight {
  color: #3a3a3a;
  font-weight: bold;
}

.super-highlight {
  color: #3a3a3a;
  font-weight: bold;
  font-size: 18px;

  a {
    color: darkblue;
  }

  span{
    color: #ff0015;
  }
}

@media (max-width: 1440px) {
  body {
    height: 768px;
  }
}

@media (max-width: 1039px) {
  .bg {
    top: 65%;
  }
}

@media (max-width: 1024px) {
  body {
    height: 768px;
  }

  .bg {
    top: 53%;
  }

  .en {
    font-size: 14px;
    font-family: 'MontSerrat';
    font-weight: lighter;
    color: #5e5f5f;
  }

  .cn {
    font-size: 14px;
    font-family: 'Microsoft Yahei';
    font-weight: lighter;
    color: #5e5f5f;
  }
}

/* Medium devices (tablets, 768px) */
@media (max-width: 770px) {
  .bg {
    top: 50%;
  }
}

@media (max-width: 812px) {
  .bg {
    top: 120%;
  }

  .en {
    font-size: 16px;
  }

  .cn {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .bg {
    top: 115%;
  }

  p {
    width: 100%;
  }
}

@media (max-width: 667px) {
  .bg {
    top: 120%;
  }

  .en {
    font-size: 14px;
  }

  .cn {
    font-size: 14px;
  }
}

@media (max-width: 568px) {
  .bg {
    top: 130%;
  }
}

@media (max-width: 540px) {
  .bg {
    top: 55%;
  }
}

/* Medium devices (tablets, 768px) */
@media (max-width: 480px) {
  body {
    height: 750px;
  }

  .bg {
    top: 60%;
  }

  p {
    width: 100%;
  }

  .title1 {
    font-size: 20px;
  }

  .title2 {
    font-size: 38px;
  }

  .decs1 {
    margin-bottom: 2em;
  }

  .ipLock img {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 375px) {
  body {
    height: 670px;
  }

  .bg {
    top: 70%;
  }

  .ip {
    padding: 10px 18px;
    margin-left: -45px;
  }
}

@media (max-width: 320px) {
  .bg {
    top: 85%;
  }

  .title1 {
    font-size: 18px;
  }

  .title2 {
    font-size: 34px;
  }

  .ip {
    font-size: 11px;
  }

  .ipLock {
    padding: 7px 15px;
    top: 2px;
  }
}
</style>
