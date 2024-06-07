<template>
  <div class="main-wrapper">
  <div class="full-container">
    <div class="top-wrapper">
      <img src="../assets/images/landing/tf88-logo.png" alt="TF880 Logo" title="TF88 Logo" />
    </div>

    <div class="banner-wrapper">

      <q-carousel
        class="banner-landing"
        autoplay
        navigation
        v-model="slide"
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        animated
        infinite
      >

        <q-carousel-slide
          v-for="(banner, i) in banners"
          :key="i"
          :name="i"
          class="column no-wrap flex-center"
          :img-src="banner.img"
          @click="gotoPromo(banner)"
        />
      </q-carousel>


<!--      <img src="../assets/images/landing/banner.png" alt="2024 Eurocup" title="2024 Eurocup" />-->
    </div>

    <div class="action-wrapper">

      <div>
        <a class="action-a" @click="goToPage('/register')">
          <div class="action-btn register">
            <img src="../assets/images/landing/register-icon.png" alt="TF88 Register" title="TF88 Register"/>
            <div class="action-btn__text-wrapper">
              <span class="action-btn__title">Đăng Ký Ngay</span>
              <span class="action-btn__description">TẶNG 12-88K <img src="./../assets/images/landing/hot-pill.png" /></span>
            </div>
          </div>
        </a>
      </div>

      <div>
        <a class="action-a" @click="goToPage('/register')" target="_blank">
          <div class="action-btn download">
            <img src="../assets/images/landing/download-icon.png" alt="TF88 Dpwnload" title="TF88 Download"/>
            <div class="action-btn__text-wrapper">
              <span class="action-btn__title">Tải APP</span>
              <span class="action-btn__description">MƯA LÌ XÌ MỖI TUẦN LÊN ĐẾN 8,888K</span>
            </div>
          </div>
        </a>
      </div>

    </div>

<!--    <a @click="goToPage('/promo')">-->
<!--      <div class="announcement-wrapper">-->
<!--        <div class="announcement-btn">-->
<!--          <img class="announcement-btn__icon" src="../assets/images/landing/speaker-icon.png" alt="Thông báo" title="Thông báo" />-->
<!--          <span class="announcement-btn__title">Thông báo</span>-->
<!--          <span class="announcement-btn__description">Tặng thưởng 100% và nhiều khuyến mãi...</span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </a>-->

    <div class="new-user-wrapper">
      <img class="section-title" src="../assets/images/landing/new-user-title.png" alt="Khuyến Mãi" title="Khuyến Mãi" />
      <div @click="goToPage('/promo')" class="new-user-discount-wrapper">
        <img src="../assets/images/landing/discount-1.png" alt="Nạp Đầu" title="Nạp Đầu" />
        <img src="../assets/images/landing/discount-2.png" alt="Bảo Hiểm" title="Bảo Hiểm" />
        <img src="../assets/images/landing/discount-3.png" alt="Thưởng Mỗi Ngày" title="Thưởng Mỗi Ngày" />
        <img src="../assets/images/landing/discount-4.png" alt="Ngày Hội VIP" title="Ngày Hội VIP" />
        <img src="../assets/images/landing/discount-5.png" alt="Hòan Trả" title="Hòan Trả" />
        <img src="../assets/images/landing/discount-6.png" alt="Check-in Mỗi Ngày" title="Check-in Mỗi Ngày" />
      </div>
    </div>

    <div class="game-wrapper">
      <img class="section-title" src="../assets/images/landing/game-title.png" alt="Trò Chơi Nổi Bật" title="Trò Chơi Nổi Bật" />
      <div class="game-inner-wrapper">
        <img @click="goToPage('/home')" src="../assets/images/landing/game-sport.png" alt="" title="" />
        <img @click="goToPage('/home')" src="../assets/images/landing/game-casino.png" alt="" title="" />
        <img @click="goToPage('/home')" src="../assets/images/landing/game-esport.png" alt="" title="" />
        <img @click="goToPage('/home')" src="../assets/images/landing/game-lottery.png" alt="" title="" />
        <img @click="goToPage('/home')" src="../assets/images/landing/game-slot.png" alt="" title="" />
        <img @click="goToPage('/home')" src="../assets/images/landing/game-fishing.png" alt="" title="" />
      </div>
    </div>
  </div>

  <div class="main-sticky-wrapper" id="scrolldown-tbn">
    <a @click="goToPage('/promo')">
      <div class="main-sticky-btn benefit">
        <img class="main-sticky-btn__icon" src="../assets/images/landing/gift-icon.png" alt="AN TOÀN TUYỆT ĐỐI" title="AN TOÀN TUYỆT ĐỐI" />
        <div class="main-sticky-btn__text-wrapper">
          <span class="main-sticky-btn__title">THAM GIA CƯỢC TẠI TF88</span>
          <span class="main-sticky-btn__description">
                <span class="hight-light">NẠP RÚT NHANH CHÓNG,</span><br/>AN TOÀN TUYỆT ĐỐI
              </span>
        </div>
      </div>
    </a>

    <a href="https://csweb.mh98q4u1yq.com/?partnerId=7&way=WEB&lang=vn" target="_blank">
      <div class="main-sticky-btn customer-service">
        <div class="main-sticky-btn__text-wrapper">
          <span class="main-sticky-btn__title">LIÊN LẠC VỚI CHÚNG TÔI</span>
          <span class="main-sticky-btn__description">CSKH 24/7</span>
        </div>
        <img class="main-sticky-btn__icon" src="../assets/images/landing/customer-service-icon.png" alt="LIÊN LẠC VỚI CHÚNG TÔI" title="LIÊN LẠC VỚI CHÚNG TÔI" />
      </div>
    </a>
  </div>
</div>
</template>

<script setup>

import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { api } from "boot/axios";

const downloadUrl= ref("");
const router = useRouter();

const goToPage = (page) => {
  router.push(page);
}

const gotoPromo = (banner) => {

}

const slide= ref(1);
const banners= ref([
  {
    name: "",
    img: require("../assets/images/landing/11.jpg")
  },
  {
    name: "",
    img:  require("../assets/images/landing/22.jpg"),
  },
  {
    name: "",
    img:  require("../assets/images/landing/33.jpg")
  }
])


const getAppDownloadUrl = () => {
  api
    .get("/app/getAppData?siteCode=vnm&appType=ALL_SITE")
    .then((res) => {
      // console.log(res);
      downloadUrl.value = res.data.downloadPageUrl
    })
    .catch((err) => {
      console.log(err);
    });
};


onMounted(() => {
  getAppDownloadUrl();
})

</script>

<style lang="scss">
.banner-landing{
  width: 100%;
  aspect-ratio: 1000/400;
  height: auto;
  min-height: 120px;
  border-radius: 12px;


  .q-carousel__navigation .q-btn{
    padding: 1px;
    width: 10px;
    height: 10px;
    //opacity: 0;
  }

  .q-carousel__navigation--top, .q-carousel__navigation--bottom{
    bottom: 8px;
  }
}
</style>
<style scoped lang="scss">

img {
  display: block;
  width: 100%;
}

a {
  transition: 0.3s all;
  text-decoration: none;
}

a:hover {
  filter: brightness(1.1);
}

.showMobile {
  display: block;
}
.showDesktop {
  display: none;
}

.full-container {
  /* height: 100vh; */
}

.main-wrapper {
  background-image: url(../assets/images/landing/bg.jpg);
  background-position: 0px 0px;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  max-width: 550px;
  margin: auto;
}

.top-wrapper {
  padding: 16px 0px 14px;
  display: flex;
  position: relative;
  justify-content: center;
}

.top-wrapper img {
  width: 100%;
  max-width: 170px;
}

.banner-wrapper {
  padding: 0px 16px 16px;
}

.action-wrapper {
  padding: 0px 16px 30px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.action-wrapper > div {
  flex: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 15px 0px;
  color: #ffffff;
  border-radius: 10px;
  justify-content: space-evenly;
}

.action-btn.register {
  background: linear-gradient(180deg, #0086fb 0%, #004d95 100%);
}

.action-btn.download {
  background: linear-gradient(180deg, #fb005a 0%, #950009 100%);
}

.action-btn img {
  width: 44px;

  @media(max-width: 400px){
    width: 34px;
  }
}

.action-btn{
  aspect-ratio: 150/75;
}

.action-btn__text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  /* font-family: FZHanZhenGuangBiaoS-GB; */
  text-align: left;
  font-weight: 400;
}

.action-btn__title {
  font-size: 1.5rem;
  line-height: 1.8rem;

  @media(max-width: 400px){
    font-size: 1.15rem;
    line-height: 1.4rem;
  }
}

.action-btn__description {
  font-size: 1rem;
  line-height: 1.3rem;
  color: #FFFFFF99;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.announcement-wrapper {
  padding: 0px 16px 12px;
}

.announcement-btn {
  display: flex;
  border-radius: 34px;
  background: linear-gradient(0deg, #d0f4ff 0%, #ffffff 100%);
  padding: 5px 12px 9px;
  align-items: center;
  gap: 6px;
  /* font-family: PingFang SC; */
  font-size: 1rem;
  font-weight: 600;
  line-height: 23px;
}

.announcement-btn__icon {
  width: 100%;
  max-width: 22px;
}

.announcement-btn__title {
  color: #0081fd;
}

.announcement-btn__description {
  color: #7a80a1;
}

.section-title {
  margin-bottom: 10px;
}

.new-user-wrapper {
  padding: 0px 16px 33.6px;
}

.new-user-discount-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-items: end;
  gap: 2px 9px;
}

.game-wrapper {
  padding: 0px 16px 29.6px;
}

.game-inner-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px 16px;
  align-items: end;
}

.main-sticky-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: sticky;
  bottom: 0;
  left: 0;
}

.main-sticky-wrapper a {
  display: contents;
}

.main-sticky-btn {
  position: relative;
  width: 40%;
  height: 5rem;
  display: flex;
  align-items: center;
}

.main-sticky-btn:before {
  position: absolute;
  display: block;
  content: "";
  top: 0;
  bottom: 0;
  transform: skewX(-30deg);
  width: 100%;
  z-index: -1;
}

.main-sticky-btn__icon {
  position: absolute;
  width: calc(100vw * 0.2);
  max-width: 80px;
}

.main-sticky-btn__text-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  /* font-family: FZHanZhenGuangBiaoS-GB; */
  font-weight: 400;
  white-space: nowrap;
  width: 120px;
  font-size: 0.8rem;
}

.main-sticky-btn__title {
  line-height: 1rem;
  text-align: right;
  color: #ffffffcc;
}

.main-sticky-btn__description {
  font-size: 0.8rem;
  line-height: 1rem;
  color: #ffffff;
}

.main-sticky-btn__description .hight-light {
  color: #faff00;
}

.benefit {
  background: linear-gradient(180deg, #64c5cd 0%, #0085ff 100%);
}

.benefit:before {
  background: linear-gradient(180deg, #64c5cd 0%, #0085ff 100%);
  left: 22%;
}

.benefit .main-sticky-btn__text-wrapper {
  left: 88px;
}

.benefit .main-sticky-btn__icon {
  width: calc(100vw * 0.15);
  top: -20%;
}

.customer-service {
  background: linear-gradient(0deg, #ff9900 0%, #f44900 100%);
}

.customer-service:before {
  background: linear-gradient(0deg, #ff9900 0%, #f44900 100%);
  right: 22%;
}

.customer-service .main-sticky-btn__text-wrapper {
  right: 121px;
}

.customer-service .main-sticky-btn__icon {
  top: -30%;
  right: 3%;
}

@media (max-width: 550px) {
  .benefit .main-sticky-btn__text-wrapper {
    left: calc(100vw * 0.16);
  }

  .customer-service .main-sticky-btn__text-wrapper {
    right: calc(100vw * 0.22);
  }
}

@media (max-width: 500px) {
  html {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .main-sticky-btn__description {
    font-size: 0.8rem;
  }

  .main-sticky-btn__icon {
    max-width: 60px;
  }

  .main-sticky-btn__text-wrapper {
    width: 100px;
  }
}

@media (max-width: 450px) {
  html {
    font-size: 14px;
  }

  .new-user-discount-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 380px) {
  html {
    font-size: 12px;
  }

  .game-inner-wrapper {
    grid-template-columns: 1fr;
  }

  .main-sticky-btn__text-wrapper, .main-sticky-btn__description {
    font-size: 0.7rem;
  }

  .main-sticky-btn__text-wrapper {
    width: 85px;
  }
}

</style>
