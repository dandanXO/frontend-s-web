<template>
    <div class="loading">
        <div class="orbit">
            <img src="@/assets/clover.png" class="shuriken">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.loading {
    width: 100%;
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom,
            rgba(240, 248, 255, 0.8196078431) 0%,
            rgb(240 248 255 / 50%) 80%,
            rgb(240 248 255 / 0%) 100%);
}

.orbit {
  position: relative;
  width: 200px;
  height: 200px;
  animation: orbit 4s linear infinite;
}

.shuriken {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes orbit {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>