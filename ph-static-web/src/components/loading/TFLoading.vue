<template>
  <div class="loading">
    <img src="../../assets/logo.png" />
    <div class="pgbar">
      <div class="pg">
        <div class="color"></div>
      </div>
      <div class="load-txt">Loading...</div>
    </div>
  </div>
</template>

<script setup id="TFLoading"></script>

<style scoped lang="scss">
.logo {
  // background-image: url("../../assets/logo-coming.png");
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
  // .loading__letter {
  //   font-size: 24px;
  //   font-weight: normal;
  //   letter-spacing: 4px;
  //   text-transform: uppercase;
  //   font-family: "Audiowide";
  //   color: #ff6d00;
  //   animation-name: bounce;
  //   animation-duration: 2s;
  //   animation-iteration-count: infinite;
  // }

  // .loading__letter:nth-child(2) {
  //   animation-delay: 0.1s;
  // }
  // .loading__letter:nth-child(3) {
  //   animation-delay: 0.2s;
  // }
  // .loading__letter:nth-child(4) {
  //   animation-delay: 0.3s;
  // }
  // .loading__letter:nth-child(5) {
  //   animation-delay: 0.4s;
  // }
  // .loading__letter:nth-child(6) {
  //   animation-delay: 0.5s;
  // }
  // .loading__letter:nth-child(7) {
  //   animation-delay: 0.6s;
  // }
  // .loading__letter:nth-child(8) {
  //   animation-delay: 0.8s;
  // }
  // .loading__letter:nth-child(9) {
  //   animation-delay: 1s;
  // }
  // .loading__letter:nth-child(10) {
  //   animation-delay: 1.2s;
  // }

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
$loadingwidth: 300px;
.loading {
  .txt {
    display: block;
    font-size: 30px;
    color: #ffffff;
  }
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
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
  img {
    opacity: 0.3;
    width: 25%;
  }
}
.pgbar {
  width: 90%;
  border-radius: 15px;
}
.pg {
  position: relative;
  height: 20px;
  width: 100%;
}
.pg .color {
  position: absolute;
  background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);

  width: 90%;
  height: 20px;
  border-radius: 15px;
  animation: pgs 4s linear;
  &:after {
    content: "";
    width: 100px;
    height: 100px;
    background: url(../../assets/images/common/loading.png);
    position: absolute;
    right: -45px;
    top: -40px;
    background-size: cover;
    animation: flicker 10s linear;
  }
}
.load-txt {
  color: #83a3ca99;
  font-size: 18px;
  width: 100%;
  text-align: center;
  font-family: Baloo Bhaina;
  margin-top: 10px;
}
@keyframes pgs {
  0% {
    width: 0%;
  }
  25% {
    width: 50%;
  }
  50% {
    width: 75%;
  }
  75% {
    width: 85%;
  }
  100% {
    width: 90%;
  }
}

@keyframes flicker {
  0% {
    opacity: 100%;
    transform: rotate(360deg) scale(100%);
  }
  50% {
    opacity: 90%;
    transform: rotate(0deg) scale(80%);
  }
  100% {
    opacity: 100%;
    transform: rotate(360deg) scale(100%);
  }
}
</style>
