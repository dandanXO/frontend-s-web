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
                                    <img :src="`${iconImageBasePath}/${item.siteId}/${item.teamOneIcon}`" />
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
                                    <img :src="`${iconImageBasePath}/${item.siteId}/${item.teamTwoIcon}`" />
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
        <button class="common-btn apply-btn" @click="applyESportInsurance()"
            :disabled="isNaN(eSportInsuranceFormData.gameMatchId)">
            点击申请</button>

        <el-dialog v-model="isESportInsuranceModalVisible" title="电竞保险" width="100%" align-center style="max-width: 500px"
            @close="toggleESportInsuranceModal(false)">
            <div class="esport-insurance-modal-container">
                <el-form label-width="100px" id="esport-insurance-form" :rules="eSportInsuranceFormValidationRules"
                    ref="eSportInsuranceFormRef" :model="eSportInsuranceFormData">
                    <el-form-item prop="platform" name="platform" label="投注平台: ">
                        <el-select v-model="eSportInsuranceFormData.platform" placeholder="投注平台"
                            @focus="loadESportPlatformOptions()" clearable>
                            <el-option v-for="platform in eSportPlatformOptions" :key="platform" :value="platform"
                                :label="platform">
                                {{ platform }}
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="gameMatchId" name="gameMatchId" label="" style="display:none">
                        <el-input v-model="eSportInsuranceFormData.gameMatchId" readonly />
                    </el-form-item>

                    <el-form-item prop="nickName" name="nickName" label="账号: ">
                        <el-input v-model="nickName" readonly />
                    </el-form-item>

                    <el-form-item prop="transactionId" name="transactionId" label="注单号: ">
                        <el-input v-model="eSportInsuranceFormData.transactionId" minlength="14" maxlength="16" />
                    </el-form-item>

                    <el-button :loading="loadingBtn" size="large" @click="submitForm(eSportInsuranceFormRef)"
                        class="common-btn">
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
import { getUpcomingESportMatches, getESportInsurancePlatformOptions, submitESportInsuranceForm } from "@/api/promotion/eSportSafety";

const store = userStore();
const matchDetails = ref([]);
const isESportInsuranceModalVisible = ref(false);
const eSportInsuranceFormData = reactive({
    gameMatchId: null,
    platform: '',
    transactionId: ''
})
const nickName = store.nickName;
const eSportPlatformOptions = ref([]);
const eSportInsuranceFormRef = ref();
const isSubmitting = ref(false);

const eSportInsuranceFormValidationRules = {
    transactionId: [
        {
            required: true,
            message: "注单号不能为空",
            trigger: "blur",
        },
        {
            pattern: "^.{14,16}$",
            message: "注单号必须为14-16位",
            trigger: "blur",
        },
    ],
    platform: [
        {
            required: true,
            message: "投注平台不能为空",
            trigger: "change",
        },
    ],
}

const formatDate = (dateTimeString) => {
    const [date, time] = dateTimeString.split(" ");
    return { date, time };
};

const loadESportPlatformOptions = () => {
    getESportInsurancePlatformOptions().then((res) => {
        eSportPlatformOptions.value = res.data
    })
}

const applyESportInsurance = () => {
    toggleESportInsuranceModal(true);
}

const toggleESportInsuranceModal = (status) => {
    if (status === true) {
        if (!store.token) {
            ElMessage.error("请登录后操作");
            return;
        }
    }

    if (status === false) {
        eSportInsuranceFormRef.value.resetFields();
    }

    isESportInsuranceModalVisible.value = status
}

const onSlideChange = (slide) => {
    eSportInsuranceFormData.gameMatchId = matchDetails.value[slide.realIndex]?.id
}

const init = () => {
    getUpcomingESportMatches()
        .then((res) => {
            if (res.code === 0 && res.data) {
                matchDetails.value = Array.isArray(res.data) ? res.data : [res.data];
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
};

const submitForm = async (elForm) => {
    if (!elForm) return

    await elForm.validate(async (valid) => {
        if (valid) {
            isSubmitting.value = true;
            const params = {
                gameMatchId: eSportInsuranceFormData.gameMatchId,
                transactionId: eSportInsuranceFormData.transactionId,
                platform: eSportInsuranceFormData.platform
            }
            const res = await submitESportInsuranceForm(params);

            if (res.code === 0) {
                ElMessage.success({
                    type: "success",
                    message: "成功"
                })
            }

            isSubmitting.value = false;
        }
    })

}

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

const iconImageBasePath = `${process.env.VUE_APP_IMAGE_CDN}/game-match`

onMounted(() => {
    init();
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

        .info-team {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
            width: 280px;
            padding-bottom: 20px;

            .info-team-logo {
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
  