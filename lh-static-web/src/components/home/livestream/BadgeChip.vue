<template>
  <div class="badge-chip-wrapper" :class="`level-${level}`">
    <img
      class="badge-chip__badge"
      :src="require(`@/assets/home/livestream/badge/vip-badge-${level}.png`)"
      loading="lazy"
    />
    <span class="badge-chip__text">
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        {{ text }}
      </template>
    </span>
  </div>
</template>
<script setup>
defineProps({
  text: String,
  level: {
    type: Number,
    default: 0
  }
});
</script>
<style lang="scss" scoped>
$badge-theme-light: (
  (
    backgroundColor: #d7ddeb,
    textColor: #666666
  ),
  (
    backgroundColor: #d7ddeb,
    textColor: #7480a4
  ),
  (
    backgroundColor: #f0d6c2,
    textColor: #844c20
  ),
  (
    backgroundColor: #d7d3fc,
    textColor: #8658fb
  ),
  (
    backgroundColor: #a3e1fd,
    textColor: #00779f
  ),
  (
    backgroundColor: #f8c9e7,
    textColor: #f34b99
  ),
  (
    backgroundColor: #ebc6fd,
    textColor: #821ec1
  ),
  (
    backgroundColor: #f9e2cb,
    textColor: #b26900
  ),
  (
    backgroundColor: #f7e3b9,
    textColor: #c84e16
  ),
  (
    backgroundColor: #f8c9e7,
    textColor: #f34b99
  ),
  (
    backgroundColor: #ebc6fd,
    textColor: #821ec1
  ),
  (
    backgroundColor: #f9e2cb,
    textColor: #b26900
  ),
  (
    backgroundColor: #f7e3b9,
    textColor: #c84e16
  )
);

$badge-theme-dark: (
  (
    backgroundColor: #bbc1d6,
    textColor: #666666
  ),
  (
    backgroundColor: #bbc1d6,
    textColor: #7480a4
  ),
  (
    backgroundColor: #edb385,
    textColor: #844c20
  ),
  (
    backgroundColor: #bbaef9,
    textColor: #8658fb
  ),
  (
    backgroundColor: #53c8fb,
    textColor: #00779f
  ),
  (
    backgroundColor: #fd99cf,
    textColor: #b70055
  ),
  (
    backgroundColor: #e393fa,
    textColor: #821ec1
  ),
  (
    backgroundColor: #ffcb97,
    textColor: #b26900
  ),
  (
    backgroundColor: #fbcd74,
    textColor: #c84e16
  ),
  (
    backgroundColor: #fd99cf,
    textColor: #b70055
  ),
  (
    backgroundColor: #e393fa,
    textColor: #821ec1
  ),
  (
    backgroundColor: #ffcb97,
    textColor: #b26900
  ),
  (
    backgroundColor: #fbcd74,
    textColor: #c84e16
  )
);

.badge-chip-wrapper {
  display: inline-flex;
  align-items: center;
  border-radius: 4px;

  &.level-#{length($badge-theme-light) - 1} {
    background-image: url(../../../assets/home/livestream/badge/vip12-bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center right;
    color: #703906;
    line-height: 1;
    position: relative;
    width: 60px;
    height: 24px;
    padding-left: 24px;
    top: -6px;

    img.badge-chip__badge {
      max-width: 40px;
      position: absolute;
      top: -2px;
      left: -14px;
    }
  }

  @each $theme in $badge-theme-light {
    $bg: map-get($theme, backgroundColor);
    $text: map-get($theme, textColor);
    $i: index($badge-theme-light, $theme) - 1;
    $count: length($badge-theme-light) - 1;

    @for $i from 1 through $count {
      $theme: nth($badge-theme-light, $i);
      $bg: map-get($theme, backgroundColor);
      $text: map-get($theme, textColor);

      &.level-#{$i - 1} {
        background-color: $bg;
        color: $text;
      }
    }
  }

  .badge-chip__badge {
    max-width: 24px;
  }

  .badge-chip__text {
    margin-right: 7px;
    font-size: 10px;
    font-weight: 800;
    line-height: 18px;
  }
}

.dark {
  .badge-chip-wrapper {
    &.level-#{length($badge-theme-light) - 1} {
      background-image: url(../../../assets/home/livestream/badge/vip12-bg.png);
      // background-size: 50px 28px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center right;
      color: #703906;
      line-height: 1;
      position: relative;
      width: 60px;
      height: 24px;
      padding-left: 24px;
      top: -6px;

      img.badge-chip__badge {
        max-width: 40px;
        position: absolute;
        top: -2px;
        left: -14px;
      }
    }

    @each $theme in $badge-theme-dark {
      $bg: map-get($theme, backgroundColor);
      $text: map-get($theme, textColor);
      $i: index($badge-theme-dark, $theme) - 1;
      $count: length($badge-theme-dark) - 1;

      @for $i from 1 through $count {
        $theme: nth($badge-theme-dark, $i);
        $bg: map-get($theme, backgroundColor);
        $text: map-get($theme, textColor);

        &.level-#{$i - 1} {
          background-color: $bg;
          color: $text;
        }
      }
    }
  }
}
</style>
