<template>
  <div class="wrapper">
    <div class="getapp">
      <div class="image"><img src="../assets/images/affiliate/app.png" /></div>
      <div class="right">
        <div class="game-title">{{ $t('lang.jolly88_app') }}</div>
        <div class="text">
          {{ $t('lang.getapp_para') }}
          <br />{{ $t('lang.lets_download_it') }}
        </div>
        <div class="codes">
          <div class="qrcode">
            <img src="../assets/images/affiliate/qrcode.png" />
            <a href="https://jo3.app/" target="_blank">{{ $t('lang.download') }}</a>
          </div>
          <div class="h5access">
            <img src="../assets/images/affiliate/h5.png" />
            <div>{{ $t('lang.direct_browser_access') }}</div>
            <a href="https://jolly88.com" target="_blank">Jolly88.com</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.wrapper {
  // background: url("../assets/images/affiliate/bg1.png") no-repeat center center;
  background: url("../assets/images/common/bg-img.png") no-repeat top center;
  background-size: cover;
  .getapp {
    max-width: 1400px;
    width: 95%;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 100px;
    padding: 20px 0;
    .image {
      flex: 7;
      max-width: 800px;
      img {
        width: 100%;
      }
    }
    .right {
      flex: 5;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      background: #2b2b4b;
      padding: 30px 20px;
      border-radius: 10px;
      color: #ffffff;
      .game-title {
        margin-bottom: 50px;
      }
      .codes {
        display: flex;
        gap: 20px;
        margin: 50px auto;
        justify-content: space-evenly;
        align-items: stretch;
        width: 80%;
        .qrcode {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          img {
            background: #ffffff;
            padding: 5px;
            border-radius: 10px;
            width: 100%;
            max-width: 100px;
          }
        }
        .h5access {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          img {
            width: 100%;
            max-width: 80px;
          }
          gap: 20px;
        }
        a {
          color: #db7e42;
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .wrapper {
    .getapp {
      flex-direction: column;
      gap: 0;
      .image {
        flex: unset;
      }
      .right {
        flex: unset;
        .codes {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}
</style>
