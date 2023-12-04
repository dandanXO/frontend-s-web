<template>
  <div class="wrapper">
    <div class="getapp">
      <div class="image" data-aos-duration="2000" data-aos="fade-right">
        <img src="../assets/images/affiliate/app.png" />
      </div>
      <div class="right" data-aos="fade-left" data-aos-duration="2000">
        <div class="game-title">{{ $t("lang.jolly88_app") }}</div>
        <div class="text">
          {{ $t("lang.getapp_para") }}
          <br />
          {{ $t("lang.lets_download_it") }}
        </div>
        <div class="codes">
          <div class="qrcode">
            <img src="../assets/images/affiliate/qrcode.png" />
            <a href="https://jo3.app/" target="_blank">{{ $t("lang.download") }}</a>
          </div>
          <div class="h5access">
            <img src="../assets/images/affiliate/h5.png" />
            <div>{{ $t("lang.direct_browser_access") }}</div>
            <a href="https://jolly88.com" target="_blank">Jolly88.com</a>
          </div>
        </div>
      </div>
    </div>

    <div class="download-step-section" data-aos="fade-up">
      <q-tabs
        class="download-tabs bg-primary text-white shadow-2"
        v-model="download_type"
        dense
        align="center"
        :breakpoint="0"
      >
        <q-tab name="android" label="Android" />
        <q-tab name="ios" label="iOS" />
      </q-tabs>

      <h2>How to download apps</h2>
      <h4>{{ download_type == "android" ? $t("lang.step_to_download_android") : $t("lang.step_to_download_ios") }}</h4>

      <div v-if="download_type === 'android'">
        <div class="steps-section" data-aos="fade-up">
          <div class="step-board">
            <div class="desc-board">
              <div class="title-div">
                <h3>1</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item">
                  {{ $t("lang.goto_webpage") }}&nbsp;
                  <em>jolly88</em>
                  &nbsp;&nbsp;
                  <em>www.jolly8858.com</em>
                </div>

                <div class="list-item" v-html="$t('lang.goto_apppage_then_press_download_or_scan_qr')"></div>
              </div>
            </div>
            <div class="img-board">
              <img src="../assets/images/download/and1.png" />
            </div>
          </div>
          <div class="step-board">
            <div class="img-board">
              <img src="../assets/images/download/and2.png" />
            </div>
            <div class="desc-board">
              <div class="title-div">
                <h3>2</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.click_download')"></div>
              </div>
            </div>
          </div>
          <div class="step-board">
            <div class="desc-board">
              <div class="title-div">
                <h3>3</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.click_download_anyway')"></div>
              </div>
            </div>
            <div class="img-board">
              <img src="../assets/images/download/and3.png" />
            </div>
          </div>
          <div class="step-board">
            <div class="img-board">
              <img src="../assets/images/download/and4.png" />
            </div>
            <div class="desc-board">
              <div class="title-div">
                <h3>4</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.after_download_goto_file_manager')"></div>
              </div>
            </div>
          </div>
          <div class="step-board">
            <div class="desc-board">
              <div class="title-div">
                <h3>5</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.after_click_into_file_select_proceed')"></div>
              </div>
            </div>
            <div class="img-board">
              <img src="../assets/images/download/and5.png" />
            </div>
          </div>
          <div class="step-board">
            <div class="img-board">
              <img src="../assets/images/download/and6.png" />
            </div>
            <div class="desc-board">
              <div class="title-div">
                <h3>6</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.please_install_to_proceed')"></div>
              </div>
            </div>
          </div>
          <div class="step-board">
            <div class="desc-board">
              <div class="title-div">
                <h3>7</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.after_install_success_on_member_wallpaper_page')"></div>
              </div>
            </div>
            <div class="img-board">
              <img src="../assets/images/download/and7.png" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="download_type === 'ios'" data-aos="fade-up">
        <div class="steps-section">
          <div class="step-board">
            <div class="desc-board">
              <div class="title-div">
                <h3>1</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item">
                  {{ $t("lang.goto_webpage") }}&nbsp;
                  <em>jolly88</em>
                  &nbsp;&nbsp;
                  <em>www.jolly8858.com</em>
                </div>
              </div>
            </div>
            <div class="img-board">
              <img src="../assets/images/download/ios1.png" />
            </div>
          </div>

          <div class="step-board">
            <div class="img-board">
              <img src="../assets/images/download/ios2.png" />
            </div>
            <div class="desc-board">
              <div class="title-div">
                <h3>2</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.goto_apppage_then_press_download_or_scan_qr')"></div>
              </div>
            </div>
          </div>

          <div class="step-board">
            <div class="desc-board">
              <div class="title-div">
                <h3>3</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.click_continue_and_allow')"></div>
              </div>
            </div>
            <div class="img-board">
              <img src="../assets/images/download/ios3.png" />
            </div>
          </div>

          <div class="step-board">
            <div class="img-board">
              <img src="../assets/images/download/ios4.png" />
            </div>
            <div class="desc-board">
              <div class="title-div">
                <h3>4</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.after_success_go_to_setting')"></div>
              </div>
            </div>
          </div>

          <div class="step-board">
            <div class="desc-board">
              <div class="title-div">
                <h3>5</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.press_install')"></div>
              </div>
            </div>
            <div class="img-board">
              <img src="../assets/images/download/ios5.png" />
            </div>
          </div>

          <div class="step-board">
            <div class="img-board">
              <img src="../assets/images/download/ios6.png" />
            </div>
            <div class="desc-board">
              <div class="title-div">
                <h3>6</h3>
                <span>Step</span>
              </div>
              <div class="desc-div">
                <div class="list-item" v-html="$t('lang.after_success_you_click_join_and_have_fun')"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const download_type = ref("android");
</script>
<style scoped lang="scss">
.wrapper {
  max-width: 1400px;
  width: 95%;
  margin: 0 auto;
  min-height: 100vh;
  background: url("../assets/images/common/bg-img.png") no-repeat top center;
  background-size: cover;

  .getapp {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 100px;
    padding: 0px 0 15px;

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
<style lang="scss">
.download-step-section {
  h2 {
    font-size: 44px;
    font-weight: bold;
    text-align: center;
    margin: 20px auto 10px;
    background: linear-gradient(360deg, #8002ec -20.83%, #cd43fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  h4 {
    margin: 10px auto 20px;
    text-align: center;
  }

  .steps-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(100% - 24px);
    max-width: 1000px;
    margin: 0 auto 20px;
    gap: 15px;
    padding-bottom: 30px;
  }

  .title-div {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    height: 100px;
    margin-bottom: -8px;
    padding-left: 15px;

    h3 {
      line-height: 100px;
      margin: 0px;
      font-size: 100px;
      background: linear-gradient(180deg, #cf027d 0%, #9110f0 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      font-weight: bold;
    }

    span {
      font-size: 50px;
      color: #cf027d;
      font-weight: bold;
    }
  }

  .step-board {
    gap: 30px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .desc-board {
      width: 70%;

      .desc-div {
        width: 100%;
        padding: 30px 20px 35px;
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(0, 0, 40, 0.71) 0%, #303072 100%);
        color: #fff;
        font-size: 1.4rem;

        .list-item {
          width: 100%;
          padding-left: 35px;
          position: relative;
          line-height: 30px;
          margin-bottom: 10px;

          em {
            font-weight: bold;
            font-style: normal;
          }

          &::before {
            background-image: url("../assets/images/download/list-li.png");
            background-repeat: no-repeat;
            padding-top: 10px;
            width: 15px;
            height: 15px;
            margin-top: 7px;
            top: 0px;
            padding-right: 50px;
            position: absolute;
            left: 0px;
            content: "";
          }
        }
      }
    }
    .img-board {
      width: 30%;

      img {
        width: 100%;
      }
    }
  }
}
.download-tabs {
  max-width: 400px;
  margin: 10px auto 10px;
  border-radius: 20px;

  .q-tab {
    width: 50%;
    background: #2e2e6e;
    color: #fff;

    &.q-tab--active {
      background: linear-gradient(90deg, #8002ec 0%, #cd43fe 100%);
      color: #ffffff;
    }
  }

  .q-tab__label {
    font-size: 1.6rem;
    color: #ffffff;
  }
}
</style>
