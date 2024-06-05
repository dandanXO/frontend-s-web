<template>
  <div class="wrapper">
    <div class="getapp">
      <div class="image">
        <img src="../assets/images/affiliate/app.png" />
      </div>
      <div class="right">
        <div class="main-title">Play4Win APP</div>
        <div class="text">
          The world's first integrated entertainment native APP, showing smooth and perfect operation. Massive sports,
          top e-sports events, live entertainment, lottery betting and electronic games, etc., the latest and most
          complete entertainment items are all in the palm of your hand to experience the scan code download, you can
          have it!
        </div>
        <div class="og-qr-grid">
          <div class="og-qr-phone ios">
            <img class="is-light" :src="require('@/assets/images/index/appiconiosblue.svg')" />
            <img class="is-dark" :src="require('@/assets/images/index/appiconios.svg')" />
            <a-button target="_blank" :href="appDownloadUrl" class="common-btn">App Download</a-button>
            <!-- <a-button class="common-btn outline">Installation Instructions</a-button> -->
          </div>
          <div class="og-qr-phone android">
            <img class="is-light" :src="require('@/assets/images/index/appiconandroidblue.svg')" />
            <img class="is-dark" :src="require('@/assets/images/index/appiconandroid.svg')" />
            <a-button target="_blank" :href="appDownloadUrl" class="common-btn">App Download</a-button>
            <!-- <a-button class="common-btn outline">Installation Instructions</a-button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getAppDownload } from "@/api/personal/common";

const appDownloadUrl = ref();

onMounted(() => {
  getAppDownload().then((res) => {
    if (res.code === 0 && res.data) {
      appDownloadUrl.value = res.data;
    }
  });
});
</script>
<style scoped lang="scss">
.dark-theme {
  .wrapper .getapp .right {
    .og-qr-grid {
      .og-qr-phone {
        margin-top: 30px;
        .is-dark {
          display: block;
        }
        .is-light {
          display: none;
        }
      }
    }
  }
}
.wrapper {
  background: url("../assets/images/index/centerbg.png");
  color: #fff;

  .getapp {
    max-width: $container-width;
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
      max-width: 440px;
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
      padding: 30px 20px;
      border-radius: 10px;

      .main-title {
        margin-bottom: 20px;
        font-size: 60px;
        line-height: 70px;
        background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        background-size: 100%;
        background-repeat: repeat;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .text {
        color: #83a3ca;
        font-size: 18px;
      }
      // .codes {
      //   display: flex;
      //   gap: 20px;
      //   margin: 50px auto;
      //   justify-content: space-between;
      //   align-items: stretch;
      //   width: 80%;
      //   .qrcode {
      //     display: flex;
      //     flex-direction: column;
      //     justify-content: space-between;
      //     align-items: center;
      //     img {
      //       width: 100%;
      //       max-width: 80px;
      //     }
      //   }
      //   .h5access {
      //     display: flex;
      //     flex-direction: column;
      //     align-items: center;
      //     justify-content: center;
      //     text-align: center;
      //     img {
      //       width: 100%;
      //       max-width: 80px;
      //     }
      //     gap: 20px;
      //   }
      //   a {
      //     color: #db7e42;
      //   }
      // }
      .og-qr-grid {
        display: grid;
        gap: 1.3rem 1rem;
        grid-template-columns: repeat(3, 1fr);

        .og-qr-phone {
          display: flex;
          gap: 10px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            height: 80px;
          }
          .is-dark {
            display: none;
          }
          .is-light {
            display: block;
          }
        }
      }
    }
  }
}
@media (max-width: 767px) {
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
