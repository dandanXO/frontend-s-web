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
      <!-- <div class="content-view-middle--img">
        <img src="../assets/images/common/content-frame-middle.png" />
      </div> -->

      <div class="content-view-middle--content">
        <slot></slot>
      </div>

      <!-- Default slot for main content -->
    </div>
    <div class="content-view-bottom"></div>
  </div>
</template>

<script setup>
const props = defineProps(["contentTopStatus"]);
</script>

<style lang="scss">
.content-view {
  height: 600px;
  width: 95%;
  margin: auto;
  .content-view-top {
    background-image: url(../assets/images/common/content-frame-top.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top center;

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
        bottom: 0px;
        left: 0;
        width: 100%;
        //position absolute center center
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
    &--img {
      img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
    position: relative;
    background-image: url(../assets/images/common/content-frame-middle-below.png);
    background-size: contain;
    background-repeat: repeat-y;
    width: 100%;
    height: auto;
    background-position: top center;
    // margin-top: -2px;

    &:before {
      content: "";
      display: block;
      background-image: url(../assets/images/common/content-frame-middle.png);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: top center;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }

  .content-view-bottom {
    background-image: url(../assets/images/common/content-frame-bottom.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top center;
    min-height: 100px;
  }
}
</style>
