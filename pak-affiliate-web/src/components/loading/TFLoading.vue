<template>
  <div class="loading">
    <img src="../../assets/logo.png">
    <ul>
      <li v-for="v in 5" :key="v" />
    </ul>
    <span class="txt">正在加载...</span>
  </div>
</template>

<script setup id="TFLoading"></script>

<style scoped lang="scss">
$loadingwidth: 300px;
.loading {
  img {
    width: 100%;
    max-width: 150px;
  }
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
    width: $loadingwidth;
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
    width: calc($loadingwidth/5);
    height: 10px;
    margin-right: 10px;
  }

  li:nth-child(-n + 3) {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: inset 0px 0px 10px 2px rgb(34 42 52),
      0px 0px 20px rgb(46 208 236 / 90%);
  }

  li:nth-child(n + 4) {
    box-shadow: inset 0px 0px 10px 1px rgba(55, 72, 228, 0.4),
      0px 0px 20px rgba(0, 119, 255, 0.1);
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
