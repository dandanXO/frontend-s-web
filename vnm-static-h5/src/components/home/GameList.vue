<template>
  <div class="platform-block" :class="{ maintenance: game.underMaintenance }" @click="$emit('click')">
    <MaintenanceBox :item="game" />
    <div
      class="platform-img-frame"
      :style="{
        'background-image': getImgPlatformBg(game.icon, game.name, game.alias)
      }"
    >
      <div class="platform-content">
        <div v-if="text" class="platform-title">
          {{ text }}
        </div>
        <div v-else class="platform-title">
          {{ $t("lang.langVal") === "en" ? game.title_en : game.title_vn }}
        </div>
      </div>
      <!--      <img-->
      <!--        v-if="game.gameType === 'LIVE' && game.code.toLowerCase() === 'won' || game.gameType === 'LIVE' && game.code.toLowerCase() === 'pmlive'"-->
      <!--        src="@/assets/images/home/new-ribbon.svg"-->
      <!--        class="new-ribbon"-->
      <!--      />-->
    </div>
  </div>
</template>
<script setup>
import MaintenanceBox from "../MaintenanceBox.vue";

const props = defineProps({
  game: Object,
  text: String
});

defineEmits(["click"]);

const getImgPlatformBg = (platform, code, alias) => {
  try {
    return `url(${require(`../../assets/images/home/${platform}/platform-item-${code.toLowerCase()}.png`)})`;
  } catch (e) {
    return `url(${require(`../../assets/images/home/${platform}/platform-item-empty.png`)})`;
  }
};
</script>
<style lang="scss" scoped>
.game-lists {
  gap: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
  img {
    width: 100%;
  }
}

.platform-block {
  cursor: pointer;
  width: 100%;
  position: relative;

  &.maintenance {
    pointer-events: none;

    .platform-img-frame {
      filter: blur(2px);
    }
  }

  &.maintenance:after {
    content: "";
    position: absolute;
    background: #012c6a50;
    top: 0%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }

  .platform-img {
    width: 100%;
    max-width: 100%;
    height: auto;
    background-size: contain;
    background-repeat: no-repeat;
    aspect-ratio: 819/295;
  }

  .platform-img-frame {
    border-radius: 12px;
    height: auto;
    width: 100%;
    background-color: #f4f9fe;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    aspect-ratio: 819/295;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 50% 50%;
    box-shadow: -1px 5px 11px rgb(0 0 0 / 10%);

    .platform-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      // align-items: center;
      justify-content: center;
      margin-left: 18px;
    }

    // .platform-item-bg {
    // width: 80%;
    // height: 100%;
    // background-repeat: no-repeat;
    // background-size: contain;
    // background-position: bottom center;
    // margin: auto;
    // }

    .platform-logo {
      height: 1.6rem;

      img {
        display: block;
        height: 100%;
        width: auto;
      }
    }

    .platform-title {
      font-weight: 800;
      font-size: 1.175rem;
      line-height: 1.3;
      margin-top: 10%;
      text-align: left;
      color: $font-4;
    }

    .platform-subtitle {
      margin-top: 5%;
      font-size: 0.875rem;
      line-height: 1;
      color: $font-1;
    }

    .platform-rebate {
      margin-bottom: 5%;
      margin-top: auto;
      font-size: 0.875rem;
      line-height: 1;
      color: $font-1;
      padding: 0.35rem 0.75rem;
      border-radius: 1rem;
      border: 1px solid #fff;
      background: linear-gradient(180deg, #fafbff 0%, #e6edfe 100%);
      box-shadow: 0px 4px 4px 0px rgba(154, 176, 255, 0.1);
      display: none;
      align-items: center;

      span {
        font-weight: 800;
        font-size: 120%;
        display: inline-block;
        margin-left: 0.25rem;
      }
    }

    .platform-label {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      width: 40%;
      height: 40%;
      background-image: url(../../assets/images/home/label-certified.png);
      background-size: contain;
      background-repeat: no-repeat;
    }

    .new-ribbon {
      position: absolute;
      right: 0;
      top: 0;
      width: 15vw;
      max-width: 54px;
    }
  }
}

.fade-in-image {
  animation: fadeIn 1.5s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
