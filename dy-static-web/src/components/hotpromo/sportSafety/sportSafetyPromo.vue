<template>
  <div>
    <swiper
      :slides-per-view="matchDetails.length > 1 ? 2 : 1"
      :spaceBetween="20"
      :loop="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      class="swiper-wrapper"
    >
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
                <span>{{ item.matchTitle }}</span>
                <br />
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
          <!-- <el-form-item prop="platform" name="platform" label="投注平台: ">
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
          </el-form-item> -->

          <el-form-item prop="gameMatchId" name="gameMatchId" label="游戏比赛: ">
            <el-select v-model="sportInsuranceFormData.gameMatchId" placeholder="游戏比赛" clearable>
              <el-option v-for="item in matchDetails" :key="item.value" :value="item.id" :label="`${item.matchTitle} -${item.teamOne} vs ${item.teamTwo}`">
                {{ `${item.matchTitle} - (${item.teamOne} vs ${item.teamTwo})` }}
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item prop="gameMatchId" name="gameMatchId" label="" style="display: none">
            <el-input v-model="sportInsuranceFormData.gameMatchId" readonly />
          </el-form-item> -->

          <el-form-item prop="nickName" name="nickName" label="账号: ">
            <el-input v-model="nickName" readonly />
          </el-form-item>

          <el-form-item prop="transactionId" name="transactionId" label="注单号: ">
            <el-input v-model="sportInsuranceFormData.transactionId" minlength="9" maxlength="25" />
          </el-form-item>

          <el-button
            :loading="loadingBtn"
            size="large"
            @click="loadSportInsuranceRecords(insuranceRecordsParam)"
            class="common-btn second"
          >
            申请记录
          </el-button>

          <el-button :loading="loadingBtn" size="large" @click="submitForm(sportInsuranceFormRef)" class="common-btn">
            确定
          </el-button>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog v-model="insuranceRecordsModalVisible" title="体育场馆申请记录" width="80%" center align-center>
      <el-table :data="insuranceRecords" stripe style="width: 100%">
        <el-table-column prop="loginName" label="账号" />
        <el-table-column prop="transactionId" label="注单号" />
        <el-table-column prop="createTime" label="申请时间" width="200px" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="remark" label="备注" />
      </el-table>

      <template v-if="insuranceRecordsParam.total > insuranceRecordsParam.size">
        <div class="record-pagination">
          <el-icon @click="recordPageControl('left')">
            <ArrowLeft />
          </el-icon>

          <span>{{ insuranceRecordsParam.current }} / {{ insuranceRecordsParam.maxPage }}</span>

          <el-icon @click="recordPageControl('right')">
            <ArrowRight />
          </el-icon>
        </div>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="insuranceRecordsModalVisible = false">确认</el-button>
        </span>
      </template>
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
  submitSportInsuranceForm,
  getSportInsuranceRecords
} from "@/api/promotion/sportSafety";
import { getLoggedInPlatformList } from "@/api/platform/platform";

import { ArrowRight, ArrowLeft } from "@element-plus/icons-vue";

const store = userStore();
const matchDetails = ref([]);
const isSportInsuranceModalVisible = ref(false);
const sportInsuranceFormData = reactive({
  gameMatchId: null,
  // platform: "",
  transactionId: ""
});
const nickName = store.nickName;
const sportPlatformOptions = ref([]);
const sportInsuranceFormRef = ref();
const isSubmitting = ref(false);

const sportInsuranceFormValidationRules = {
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
        insuranceRecordsParam.gameType = matchDetails.value[0].gameType;
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

// get Insurance Records
const insuranceRecordsParam = reactive({
  gameType: "",
  size: 5,
  current: 1,
  total: 0,
  maxPage: 0
});

const insuranceRecords = ref([]);
const insuranceRecordsModalVisible = ref(false);
const loadSportInsuranceRecords = (param) => {
  getSportInsuranceRecords(param).then((res) => {
    isSportInsuranceModalVisible.value = false;
    insuranceRecordsModalVisible.value = true;
    insuranceRecords.value = res.data.records;

    insuranceRecordsParam.gameType = res.data.records[0].gameType;
    insuranceRecordsParam.records = res.data.records;
    insuranceRecordsParam.current = res.data.current;
    insuranceRecordsParam.total = res.data.total;
    insuranceRecordsParam.maxPage = Math.ceil(insuranceRecordsParam.total / insuranceRecordsParam.size);
  });
};

const recordPageControl = (direction) => {
  if (direction === "left") {
    if (insuranceRecordsParam.current > 1) {
      insuranceRecordsParam.current--;
      loadSportInsuranceRecords(insuranceRecordsParam);
    } else {
      ElMessage.error("已经是第一页了");
    }
  } else {
    let maxPage = insuranceRecordsParam.maxPage;
    if (maxPage === insuranceRecordsParam.current) {
      ElMessage.error("这是最后一页了");
    } else {
      insuranceRecordsParam.current++;
      loadSportInsuranceRecords(insuranceRecordsParam);
    }
  }
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
    font-size: 21px;
    line-height: 1.2;
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
      width: 110px;
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
