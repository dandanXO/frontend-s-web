<template>
  <div class="content-view">
    <div class="content-view-top">
      <div class="content-view-top--img">
        <img class="top-bg" src="../assets/images/common/content-frame-top.png" />
        <div class="content-view-top--content">
          <div class="top-content-status">
            <template v-if="contentTopStatus === 'faded'">
              <img src="../assets/images/common/content-frame-top-img-faded.png" />
            </template>
            <template v-if="contentTopStatus === 'solid'">
              <img src="../assets/images/common/content-frame-top-img.png" />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="content-view-middle">
      <slot></slot>
    </div>
    <div class="content-view-bottom"></div>
  </div>
</template>

<script setup>
const props = defineProps(["contentTopStatus"]);
</script>

<style lang="scss">
.content-view {
  width: 95%;
  margin: auto;

  .content-view-top {
    background: url(../assets/images/common/content-frame-top.png) no-repeat center/contain;
    position: relative;
    margin-top: 40px;

    &:before {
      content: "";
      position: absolute;
      top: -40px;
      background: url(../assets/images/common/content-frame-up-icon.png) no-repeat center/contain;
      display: block;
      width: 100%;
      height: 30px;
    }

    &--img {
      position: relative;

      img.top-bg {
        display: block;
        width: 100%;
        visibility: hidden;
      }
    }

    &--content {
      .top-content-status {
        position: absolute;
        bottom: -16px;
        left: 0;
        width: 100%;
        z-index: 2;

        img {
          display: block;
          width: 80%;
          max-width: 360px;
          margin: auto;
        }
      }
    }
  }

  .content-view-middle {
    position: relative;
    background: url(../assets/images/common/content-frame-middle.png) round top/100% auto;
    min-height: 435px;
    padding: 16px;
    margin-top: -1px;

    &--img {
      img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
  }

  .content-view-bottom {
    background: url(../assets/images/common/content-frame-bottom.png) round top/100% auto;
    min-height: 50px;
    position: relative;
    margin-bottom: 60px;

    &:before {
      content: "";
      position: absolute;
      bottom: -40px;
      background: url(../assets/images/common/content-frame-down-icon.png) no-repeat center/contain;
      display: block;
      width: 100%;
      height: 30px;
    }
  }
}
</style>
