<template>
  <div>
    <swiper :slides-per-view="1" :loop="true" @swiper="onSwiper" @slideChange="onSlideChange" class="swiper-wrapper">
      <template v-for="(item, index) in matchDetails" :key="item.id">
        <swiper-slide>
          <div class="bet-info-box">
            <div class="bet-info-date">{{ formatDate(item.matchTime).date }}</div>
            <div class="bet-info-details">
              <div class="info-team info-team-one">
                <div class="info-team-logo">
                  <img :src="`${iconImageBasePath}/${item.teamOneIcon}`" />
                </div>
                <div class="info-team-name" v-html="item.teamOne" />
              </div>

              <div class="bet-info-vs">
                VS
                <br />
                {{ formatDate(item.matchTime).time }}
              </div>

              <div class="info-team info-team-two">
                <div class="info-team-logo">
                  <img :src="`${iconImageBasePath}/${item.teamTwoIcon}`" />
                </div>
                <div class="info-team-name" v-html="item.teamTwo" />
              </div>
            </div>
          </div>
        </swiper-slide>
      </template>
    </swiper>
    <div class="swiper-button-prev" @click="prevSlide"></div>
    <div class="swiper-button-next" @click="nextSlide"></div>
    <button
      class="common-btn apply-btn"
      @click="applySportInsurance()"
      :disabled="isNaN(sportInsuranceFormData.gameMatchId)"
    >
      点击申请
    </button>

    <el-dialog
      v-model="isSportInsuranceModalVisible"
      title="电竞保险"
      width="100%"
      align-center
      style="max-width: 500px"
      @close="toggleSportInsuranceModal(false)"
    >
      <div class="sport-insurance-modal-container">
        <el-form
          style="text-align: center"
          label-width="100px"
          id="sport-insurance-form"
          :rules="sportInsuranceFormValidationRules"
          ref="sportInsuranceFormRef"
          :model="sportInsuranceFormData"
        >
          <el-form-item prop="platform" name="platform" label="投注平台: ">
            <el-select
              v-model="sportInsuranceFormData.platform"
              placeholder="投注平台"
              @focus="loadSportPlatformOptions()"
              clearable
            >
              <el-option
                v-for="platform in sportPlatformOptions"
                :key="platform.value"
                :value="platform.value"
                :label="platform.alias"
              >
                {{ platform.alias }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="gameMatchId" name="gameMatchId" label="" style="display: none">
            <el-input v-model="sportInsuranceFormData.gameMatchId" readonly />
          </el-form-item>

          <el-form-item prop="nickName" name="nickName" label="账号: ">
            <el-input v-model="nickName" readonly />
          </el-form-item>

          <el-form-item prop="transactionId" name="transactionId" label="注单号: ">
            <el-input v-model="sportInsuranceFormData.transactionId" minlength="14" maxlength="16" />
          </el-form-item>

          <el-button :loading="loadingBtn" size="large" @click="submitForm(sportInsuranceFormRef)" class="common-btn">
            确定
          </el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, reactive } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";

import { userStore } from "@/store";
import {
  getUpcomingSportMatches,
  getSportInsurancePlatformOptions,
  submitSportInsuranceForm
} from "@/api/promotion/sportSafety";
import { getLoggedInPlatformList } from "@/api/platform/platform";

const store = userStore();
const matchDetails = ref([]);
const isSportInsuranceModalVisible = ref(false);
const sportInsuranceFormData = reactive({
  gameMatchId: null,
  platform: "",
  transactionId: ""
});
const nickName = store.nickName;
const sportPlatformOptions = ref([]);
const sportInsuranceFormRef = ref();
const isSubmitting = ref(false);

const sportInsuranceFormValidationRules = {
  transactionId: [
    {
      required: true,
      message: "注单号不能为空",
      trigger: "blur"
    },
    {
      pattern: "^.{14,16}$",
      message: "注单号必须为14-16位",
      trigger: "blur"
    }
  ],
  platform: [
    {
      required: true,
      message: "投注平台不能为空",
      trigger: "change"
    }
  ]
};

const formatDate = (dateTimeString) => {
  const [date, time] = dateTimeString.split(" ");
  return { date, time };
};

const loadSportPlatformOptions = () => {
  sportPlatformOptions.value = [];

  getSportInsurancePlatformOptions().then((res) => {
    for (let i = 0, l = res.data.length; i < l; i++) {
      const currResData = res.data[i];
      platformsListDisplay.value.forEach((e) => {
        if (currResData === e.code) {
          const obj = {
            value: currResData,
            alias: e.alias
          };
          sportPlatformOptions.value.push(obj);
        }
      });
    }
  });
};

const applySportInsurance = () => {
  toggleSportInsuranceModal(true);
};

const toggleSportInsuranceModal = (status) => {
  if (status === true) {
    if (!store.token) {
      ElMessage.error("请登录后操作");
      return;
    }
  }

  if (status === false) {
    sportInsuranceFormRef.value.resetFields();
  }

  isSportInsuranceModalVisible.value = status;
};

const onSlideChange = (slide) => {
  sportInsuranceFormData.gameMatchId = matchDetails.value[slide.realIndex]?.id;
};

const init = () => {
  getUpcomingSportMatches()
    .then((res) => {
      if (res.code === 0 && res.data) {
        matchDetails.value = Array.isArray(res.data) ? res.data : [res.data];
      }
    })
    .catch((err) => {
      ElMessage.error(err.message);
      console.log(err.message);
    });
};

const submitForm = async (elForm) => {
  if (!elForm) return;

  await elForm.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      const params = {
        gameMatchId: sportInsuranceFormData.gameMatchId,
        transactionId: sportInsuranceFormData.transactionId,
        platform: sportInsuranceFormData.platform
      };
      const res = await submitSportInsuranceForm(params);

      if (res.code === 0) {
        ElMessage.success({
          type: "success",
          message: "提交成功"
        });
        sportInsuranceFormRef.value.resetFields();
        isSportInsuranceModalVisible.value = false;
      }

      isSubmitting.value = false;
    }
  });
};

const $swiper = ref(null);

const onSwiper = (swiper) => {
  $swiper.value = swiper;
};

const prevSlide = () => {
  $swiper.value.slidePrev();
};

const nextSlide = () => {
  $swiper.value.slideNext();
};

const iconImageBasePath = `${process.env.VUE_APP_IMAGE_CDN}/promo`;

const platformsList = ref([]);
const platformsListDisplay = ref([]);
const getPlatList = () => {
  getLoggedInPlatformList().then((res) => {
    platformsList.value = res;
    platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("SPORT"));
  });
};

onMounted(() => {
  init();
  getPlatList();
});
</script>

<style scoped lang="scss">
.swiper-wrapper {
  max-width: 900px;
}

:deep(.swiper-button-prev) {
  left: 100px;
  margin-top: -30px;
}

:deep(.swiper-button-next) {
  right: 100px;
  margin-top: -30px;
}

.apply-btn {
  width: fit-content;
  display: flex;
  margin: 0 auto;
  padding: 10px 20px;
  margin-top: 20px;
}

.bet-info-box {
  border-radius: 12px;
  border: 1px solid #0c9bff;
  max-width: 800px;
  margin: auto;
  overflow: hidden;

  .bet-info-date {
    background: #0c9bff;
    padding: 12px 24px;
    display: flex;
    justify-content: center;
    font-size: 24px;
    line-height: 1;
    color: #ffffff;
  }

  .bet-info-vs {
    font-weight: bolder;
    font-size: 28px;
    line-height: 1.3;
    text-align: center;
  }

  .bet-info-details {
    padding: 12px 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #d1d1d1;

    .info-team {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      width: 280px;
      padding-bottom: 20px;

      .info-team-logo {
        background: #c1c1c1;
        padding: 6px;
        border-radius: 6px;

        img {
          display: block;
          width: 45px;
        }
      }

      .info-team-name {
        color: #414655;
        font-size: 18px;
        line-height: 1;
        font-weight: bolder;
      }
    }
  }
}
</style>
