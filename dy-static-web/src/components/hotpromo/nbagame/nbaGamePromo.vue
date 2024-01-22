<template>
  <div>
    <swiper
      :slides-per-view="1"
      :spaceBetween="20"
      :loop="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      class="swiper-wrapper"
    >
      <template v-for="(item, index) in nbaDetails" :key="item.id">
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
    <!-- <div class="swiper-button-prev" @click="prevSlide"></div> -->
    <!-- <div class="swiper-button-next" @click="nextSlide"></div> -->
    <button
      class="common-btn apply-btn"
      @click="applyNBAInsurance()"
      :disabled="isNaN(nbaInsuranceFormData.gameMatchId)"
      style="display: none"
    >
      点击申请
    </button>

    <el-dialog
      v-model="isNBAInsuranceModalVisible"
      title="美国职业篮球"
      width="100%"
      align-center
      style="max-width: 500px"
      @close="toggleNBAInsuranceModal(false)"
    >
      <div class="nba-insurance-modal-container">
        <el-form
          style="text-align: center"
          label-width="100px"
          id="nba-insurance-form"
          :rules="nbaInsuranceFormValidationRules"
          ref="nbaInsuranceFormRef"
          :model="nbaInsuranceFormData"
        >
          <!-- <el-form-item prop="platform" name="platform" label="投注平台: ">
            <el-select
              v-model="nbaInsuranceFormData.platform"
              placeholder="投注平台"
              @focus="loadNBAPlatformOptions()"
              clearable
            >
              <el-option
                v-for="platform in nbaPlatformOptions"
                :key="platform.value"
                :value="platform.value"
                :label="platform.alias"
              >
                {{ platform.alias }}
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item prop="gameMatchId" name="gameMatchId" label="游戏比赛: ">
            <el-select v-model="nbaInsuranceFormData.gameMatchId" placeholder="游戏比赛" clearable>
              <el-option v-for="item in nbaDetails" :key="item.value" :value="item.id" :label="item.matchTitle">
                {{ item.matchTitle }}
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item prop="gameMatchId" name="gameMatchId" label="" style="display: none">
            <el-input v-model="nbaInsuranceFormData.gameMatchId" readonly />
          </el-form-item> -->

          <el-form-item prop="nickName" name="nickName" label="账号: ">
            <el-input v-model="nickName" readonly />
          </el-form-item>

          <el-form-item prop="transactionId" name="transactionId" label="注单号: ">
            <el-input v-model="nbaInsuranceFormData.transactionId" minlength="9" maxlength="25" />
          </el-form-item>

          <el-button :loading="loadingBtn" size="large" @click="submitForm(nbaInsuranceFormRef)" class="common-btn">
            确定
          </el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, onMounted, reactive } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";

import { loadNbaDetails, submitNBAInsuranceForm } from "@/api/promotion/nbaGame";
import { userStore } from "@/store";
const store = userStore();

const nbaDetails = ref([]);
const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";
const iconImageBasePath = `${process.env.VUE_APP_IMAGE_CDN}/promo`;

const formatDate = (dateTimeString) => {
  if (dateTimeString === undefined) {
    return { date: null, time: null };
  }

  const [date, time] = dateTimeString.split(" ");
  return { date, time };
};

const isNBAInsuranceModalVisible = ref(false);
const nbaInsuranceFormData = reactive({
  gameMatchId: null,
  // platform: "",
  transactionId: ""
});
const nickName = store.nickName;
const nbaPlatformOptions = ref([]);
const nbaInsuranceFormRef = ref();
const isSubmitting = ref(false);

const nbaInsuranceFormValidationRules = {
  gameMatchId: [
    {
      required: true,
      message: "游戏比赛不能为空",
      trigger: "blur"
    }
  ],
  transactionId: [
    {
      required: true,
      message: "注单号不能为空",
      trigger: "blur"
    },
    {
      pattern: "^.{9,25}$",
      message: "注单号必须为9-25位",
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

const getNbaDetails = () => {
  loadNbaDetails()
    .then((res) => {
      if (res.code === 0 && res.data) {
        nbaDetails.value = Array.isArray(res.data) ? res.data : [res.data];
      }
    })
    .catch((err) => {
      ElMessage.error(err.message);
      console.log(err.message);
    });
};

const $swiper = ref(null);

const onSwiper = (swiper) => {
  $swiper.value = swiper;
  console.log(swiper);
};

// const prevSlide = () => {
//   $swiper.value.slidePrev();
// };

// const nextSlide = () => {
//   $swiper.value.slideNext();
// };

const applyNBAInsurance = () => {
  toggleNBAInsuranceModal(true);
};

const toggleNBAInsuranceModal = (status) => {
  if (status === true) {
    if (!store.token) {
      ElMessage.error("请登录后操作");
      return;
    }
  }

  if (status === false) {
    nbaInsuranceFormRef.value.resetFields();
  }

  isNBAInsuranceModalVisible.value = status;
};

const submitForm = async (elForm) => {
  if (!elForm) return;

  await elForm.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      const params = {
        gameMatchId: nbaInsuranceFormData.gameMatchId,
        transactionId: nbaInsuranceFormData.transactionId,
        platform: nbaInsuranceFormData.platform
      };
      const res = await submitNBAInsuranceForm(params);

      if (res.code === 0) {
        ElMessage.success({
          type: "success",
          message: "提交成功"
        });
        nbaInsuranceFormRef.value.resetFields();
        isNBAInsuranceModalVisible.value = false;
      }

      isSubmitting.value = false;
    }
  });
};

onMounted(() => {
  getNbaDetails();
});
</script>

<style scoped lang="scss">
.swiper-wrapper {
  max-width: 900px;
  margin-top: 20px;
}

:deep(.swiper-button-prev) {
  left: 100px;
  margin-top: -30px;
}
:deep(.swiper-button-next) {
  right: 100px;
  margin-top: -30px;
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

.apply-btn {
  width: fit-content;
  display: flex;
  margin: 0 auto;
  padding: 10px 20px;
  margin-top: 20px;
}
</style>
