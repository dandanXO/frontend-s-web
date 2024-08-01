<template>
  <div class="loading">
    <img src="../../assets/logo-web.svg" alt="logo" />
    <ul>
      <li v-for="v in 5" :key="v"></li>
    </ul>
    <span class="txt">Loading ...</span>
  </div>
  <!-- <div class="logo">
    <div class="loading-txt">
      <div class="loading__letter">L</div>
      <div class="loading__letter">o</div>
      <div class="loading__letter">a</div>
      <div class="loading__letter">d</div>
      <div class="loading__letter">i</div>
      <div class="loading__letter">n</div>
      <div class="loading__letter">g</div>
      <div class="loading__letter">.</div>
      <div class="loading__letter">.</div>
      <div class="loading__letter">.</div>
    </div>
  </div> -->
</template>

<script setup id="TFLoading"></script>

<style scoped lang="scss">
.logo {
  background-image: url("../../assets/logo-web.svg");
  background-position: center;
  background-repeat: no-repeat;
  width: 389px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .loading-txt {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
  }
  .loading__letter {
    font-size: 24px;
    font-weight: normal;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #ff6d00;
    animation-name: bounce;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }

  .loading__letter:nth-child(2) {
    animation-delay: 0.1s;
  }
  .loading__letter:nth-child(3) {
    animation-delay: 0.2s;
  }
  .loading__letter:nth-child(4) {
    animation-delay: 0.3s;
  }
  .loading__letter:nth-child(5) {
    animation-delay: 0.4s;
  }
  .loading__letter:nth-child(6) {
    animation-delay: 0.5s;
  }
  .loading__letter:nth-child(7) {
    animation-delay: 0.6s;
  }
  .loading__letter:nth-child(8) {
    animation-delay: 0.8s;
  }
  .loading__letter:nth-child(9) {
    animation-delay: 1s;
  }
  .loading__letter:nth-child(10) {
    animation-delay: 1.2s;
  }

  @keyframes bounce {
    0% {
      transform: translateY(0px);
    }
    40% {
      transform: translateY(-40px);
    }
    80%,
    100% {
      transform: translateY(0px);
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
.loading {
  .txt {
    display: block;
    font-size: 30px;
    color: #ffffff;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  ul {
    margin: auto;
    height: 10px;
    width: 300px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  li {
    width: calc(300px/5);
    height: 10px;
    margin-right: 10px;
  }

  li:nth-child(-n + 3) {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: inset 0px 0px 10px 2px rgb(255 75 0),
      0px 0px 20px rgb(255 153 0 / 90%);
  }

  li:nth-child(n + 4) {
    box-shadow: inset 0px 0px 10px 1px rgba(228, 106, 55, 0.4),
      0px 0px 20px rgba(255, 102, 0, 0.1);
  }

  li:nth-child(3) {
    -webkit-animation: pulse 1s alternate infinite;
    -moz-animation: pulse 1s alternate infinite;
  }

  @-webkit-keyframes pulse {
    0% {
      background: rgba(255, 255, 255, 1);
      box-shadow: inset 0px 0px 10px 2px rgb(255 75 0),
        0px 0px 20px rgb(255 153 0 / 90%);
    }
    100% {
      background: rgba(255, 255, 255, 0);
      box-shadow: inset 0px 0px 10px 1px rgba(228, 106, 55, 0.4),
        0px 0px 20px rgba(255, 102, 0, 0.1);
    }
  }

  @-moz-keyframes pulse {
    0% {
      background: rgba(255, 255, 255, 1);
      box-shadow: inset 0px 0px 10px 2px rgb(255 75 0),
        0px 0px 20px rgb(255 153 0 / 90%);
    }
    100% {
      background: rgba(255, 255, 255, 0);
      box-shadow: inset 0px 0px 10px 1px rgba(228, 106, 55, 0.4),
        0px 0px 20px rgba(255, 102, 0, 0.1);
    }
  }
}
</style>
