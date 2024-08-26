<script setup>
import { ref } from "vue";
import { userStore } from "@/store";
import { Carousel, Slide, Navigation } from "vue3-carousel";

import { getImageUrl } from "@/utils/utils.js";

import VipCard from "@/components/vip/Card/main.vue";
import VipButton from "@/components/vip/Button/main.vue";

import vipLevel from ".shared/constant/vip-level.js";

import { claimBonusItem } from "@/api/index/promo";
import { openCommonError, openLoginAlert } from ".shared/helper/utils";

const { labels, levels } = vipLevel;

const store = userStore();

const selectedVIP = ref({
  index: 0,
  level: 1
});

const onVIPButtonClick = (type) => {
  if (!store.token) openLoginAlert(store);
  else {
    const bonusItem = `dy1-vip-${type}`;

    claimBonusItem(bonusItem)
      .then((res) => {
        if (res.code === 0) {
          // Success
          location.href = `/center/deposit`;
        } else openCommonError();
      })
      .catch(openCommonError);
  }
};

const getVipLevelBtnClass = ({ level }) => {
  const isActiveClass = selectedVIP.value.level === level ? "active" : "";

  return `btn_vip_vip${level} ${isActiveClass}`;
};

const handleLevelBtnClick = ({ level }) =>
  (selectedVIP.value = {
    index: +level - 1,
    level
  });

const handleSlideStart = (slide) => {
  const index = +slide.currentSlideIndex;

  selectedVIP.value = {
    index,
    level: index + 1
  };
};
</script>

<template>
  <div class="vip_level">
    <div class="level_img">
      <template v-for="(vip, _) in levels" :key="vip.level">
        <img
          v-if="selectedVIP.level === vip.level"
          :src="getImageUrl('vip/vip_current_bg.png')"
          :class="getVipLevelBtnClass(vip)"
        />

        <div
          :class="getVipLevelBtnClass(vip) + ` btn_vip`"
          @click="handleLevelBtnClick(vip)"
        ></div>
      </template>
    </div>
  </div>

  <div class="vip-list-container mx-auto">
    <Carousel
      :itemsToShow="1"
      :wrapAround="true"
      v-model="selectedVIP.index"
      @slide-end="handleSlideStart"
    >
      <Slide
        v-for="(
          {
            level,
            description,
            birthdayBonus,
            monthlyRedEnvelop,
            monthlyDeposit,
            requirements
          },
          vipIndex
        ) in levels"
        :key="vipIndex"
      >
        <div class="carousel__item vip-slide-container">
          <VipCard :level="level" :description="description" />

          <div class="vip-right-box">
            <div class="vip-right-block">
              <div class="vip-label-column">{{ labels.redEnvelop }}</div>
              <div class="vip-value-column">
                {{ monthlyRedEnvelop ? monthlyRedEnvelop : "无" }}
              </div>
              <div v-if="monthlyRedEnvelop">
                <VipButton @click.native="onVIPButtonClick('monthly')">
                  领取
                </VipButton>
              </div>
            </div>
            <div class="vip-right-block">
              <div class="vip-label-column">{{ labels.birthday }}</div>
              <div class="vip-value-column">
                {{ birthdayBonus ? `${birthdayBonus}元` : "无" }}
              </div>
              <div v-if="birthdayBonus">
                <VipButton @click.native="onVIPButtonClick('birthday')">
                  领取
                </VipButton>
              </div>
            </div>
            <div class="vip-right-block">
              <div class="vip-label-column">{{ labels.requirements }}</div>
              <div class="vip-value-column">
                {{ requirements ? requirements : "无" }}
              </div>
            </div>
          </div>
        </div>
      </Slide>

      <template #addons>
        <Navigation>
          <template #prev>
            <img :src="getImageUrl(`vip/left_arrow.png`)" />
          </template>
          <template #next>
            <img :src="getImageUrl(`vip/right_arrow.png`)" />
          </template>
        </Navigation>
      </template>
    </Carousel>
  </div>
</template>

<style lang="scss" src="./style.carousel.nav.scss"></style>
<style lang="scss" scoped src="./style.scss"></style>
