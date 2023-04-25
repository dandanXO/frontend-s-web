<template>
  <div class="wrapper">
    <div class="getapp">
      <div class="image"><img src="../assets/images/affiliate/app.png" /></div>
      <div class="right">
        <div class="game-title">Jolly88 APP</div>
        <div class="text">
          The world's first integrated entertainment native APP, showing smooth
          and perfect operation. Massive sports, top e-sports events, live
          entertainment, lottery betting and electronic games, etc., the latest
          and most complete entertainment items are all in the palm of your hand
          to experience the scan code download, you can have it!
        </div>
        <div class="codes">
          <div class="qrcode">
            <img src="../assets/images/affiliate/h5.png" />
            <router-link to="/">Click here to download</router-link>
          </div>
          <div class="h5access">
            <img src="../assets/images/affiliate/h5.png" />
            <div>Mobile browser direct access</div>
            <a href="https://m.jolly88-ph.com" target="_blank">Jolly88.com</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.wrapper {
  background: url("../assets/images/affiliate/bg1.png");

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
        justify-content: space-between;
        align-items: stretch;
        width: 80%;
        .qrcode {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          img {
            width: 100%;
            max-width: 80px;
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
