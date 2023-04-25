<template>
  <div class="ocean-wrapper">
    <div class="ocean-container">
      <div class="wave"></div>
      <div class="context txt-center">
        <div class="margin-center square"></div>
        <div>Jolly88</div>
        <div>ADVANTAGE</div>
        <slot></slot>
        <div class="stats-num">
          <slot name="number"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeStatsCard",
};
</script>

<style lang="scss" scoped>
.context {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 5px solid #161b23;
  border-radius: 50%;
  z-index: 10;

  .square {
    width: 12px;
    height: 12px;
    margin: 0.75rem auto;
    background-color: #4d97ac;
  }

  .stats-num {
    font-size: 4rem;
    font-weight: bolder;
    color: black;
    margin-top: 1.25rem;
    font-family: Wave;
    font-size: 60px;
  }
}

.ocean-container {
  position: relative;
  width: 240px;
  height: 240px;
  padding: 5px;
  border: 4px solid #116e90;
  background-color: #0b8cbb;
  border-radius: 50%;
  overflow: hidden;
}

.wave {
  position: relative;
  width: 240px;
  height: 240px;
  background-color: #0b8cbb;
  border-radius: 50%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    top: 0;
    left: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 45%;
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 6s linear infinite;
    z-index: 1;
  }

  &::after {
    border-radius: 47%;
    background-color: #162636;
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 10s linear -5s infinite;
    z-index: 2;
  }
}

p {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  color: #000;
  z-index: 10;
}

@keyframes rotate {
  50% {
    transform: translate(-50%, -73%) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -70%) rotate(360deg);
  }
}
</style>
