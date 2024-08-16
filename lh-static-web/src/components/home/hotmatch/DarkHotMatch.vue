<template>
    <div class="hot-match-container" v-if="hotMatchesByChunk.length > 0">
        <img src="@/assets/home/hotmatch/hot-match-title.png" style="display:flex;
    margin:auto;width: 55%;"  />
            <el-carousel arrow="always">
                <el-carousel-item v-for="hotMatchesByChunkItem, index in hotMatchesByChunk" :key="index">
                    <div class="hot-match-items">
                    <div class="hot-match-item" v-for="hotMatch in hotMatchesByChunkItem" :key="hotMatch.id">
                        <div class="hot-match-info">
                            <div class="hot-match-name">
                                {{ hotMatch.competitionName }}
                            </div>
                            <div class="hot-match-scores">
                                <div class="hot-match-team">
                                    <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamOneLogo}`" />
                                    <span>{{ hotMatch.teamOneName }}</span>
                                </div>
                                <div class="hot-match-time">{{ hotMatch.competitionTime }}</div>
                                <div class="hot-match-team">
                                    <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamTwoLogo}`" />
                                    <span>{{ hotMatch.teamTwoName }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </el-carousel-item>
            </el-carousel>

            <div class="competition-items">
                <div class="competition-item" v-for="competitionType in competitionTypes" :class="{ active: competitionType === selectedCompetitionType }" @click="selectedCompetitionType = competitionType">
                    <div class="competition-item-img-wrapper">
                        <img class="competition-item-img" :src="require(`@/assets/home/hotmatch/${competitionType.toLowerCase()}.png`)"/>
                    </div>
                    <div class=competition-item-name>{{ getCompetitionTypeCnLabel(competitionType) }}</div>
                </div>
            </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { getHotMatches } from '@/api/index/hotmatch.js'
import { useLocalStorage } from "@vueuse/core";

const hotMatches = ref([]);
const competitionTypes = ref([]);
const selectedCompetitionType = ref();
const imgUrl = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value;

const getCompetitionTypeCnLabel = (enLabel) => {
    switch(enLabel) {
        case 'Basketball':
            return '篮球';
        case 'Football':
            return '足球';
        case 'ESport':
            return '电竞';
        default:
            return '';
    }
}

const getChunk = (list, size) => [...Array(Math.ceil(list.length / size))].map((_, i) => list.slice(i * size, i * size + size));

const hotMatchesByChunk = computed(() => {
    if(hotMatches.value.length > 0 && selectedCompetitionType.value) {
        return getChunk(hotMatches.value.filter(({competitionType}) => competitionType === selectedCompetitionType.value), 4);
    }

    return [];
})

onMounted(() => {
    getHotMatches().then((res) => {
        if(res.code === 0) {
            const uniqueCompetitionTypes = Array.from(new Set(res.data.map(({ competitionType }) => competitionType)));
            competitionTypes.value = uniqueCompetitionTypes;

            if(uniqueCompetitionTypes.length > 0) {
                selectedCompetitionType.value = uniqueCompetitionTypes[0];
                hotMatches.value = res.data;
            }           
        }
    })
})
</script>

<style lang="scss" scoped>
.hot-match-container {
    background: url("@/assets/home/hotmatch/hot-match-bg.png") no-repeat center center;
    background-size: 100% auto;
    aspect-ratio: 2255 / 1227;

    :deep(.el-carousel__arrow--left) {
        background: url("@/assets/home/hotmatch/arrow-left.png") no-repeat center center;
    }

    :deep(.el-carousel__arrow--right) {
        background: url("@/assets/home/hotmatch/arrow-right.png") no-repeat center center;
    }

    :deep(.el-carousel) {
        width: 75%;
        margin: auto;
    }

    :deep(.el-carousel__container) {
        height: 250px;
        width: 100%;
    }

    .hot-match-items {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 100%;

        .hot-match-item {
            background: url("@/assets/home/hotmatch/hot-match-item-bg.png") no-repeat center center;
            background-size: 100% auto;
            aspect-ratio: 436 / 217;

            .hot-match-info {
                height: 100%;
                padding: 20px 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                gap: 5px;
                width: 300px;
                height: 149px;

                .hot-match-name, .hot-match-time {
                    font-family: 'PingFang SC';
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 15px;
                    color: #fff;
                    text-align: center;
                }

                .hot-match-scores {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .hot-match-time {
                        width: 85px;
                    }

                    .hot-match-team {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        font-family: 'PingFang SC';
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 15px;
                        color: #fff;
                        text-align: center;
                        gap: 5px;
                        width: 80px;
                    }

                    .hot-match-img {
                        width: 50px;
                    }
                }
            }
        }
    }
}

.competition-items {
    display: flex;
    margin-left: 50%;

    .competition-item {
        display: flex;
        flex-direction: column;
        text-align: center;
        cursor: pointer;

        .competition-item-name {
            font-family: 'PingFang SC';
            font-size: 18px;
            font-weight: 500;
            line-height: 25.2px;
            text-align: left;
            color: #b7c1ff;
            margin-top: -30px;
            text-align: center;
        }

        .competition-item-img-wrapper {
            background: url("@/assets/home/hotmatch/competition-type-bg.png") no-repeat center center;
            background-size: 100% 100%;
            aspect-ratio: 381 / 366;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 230px;

            .competition-item-img {
                width: 60%;
                filter: grayscale(1);
            }
        }

        &.active, &:hover {
            .competition-item-img-wrapper {
                background: url("@/assets/home/hotmatch/competition-type-bg-active.png") no-repeat center center;
                background-size: 100% auto;
            }

            .competition-item-img {
                filter: grayscale(0);
            }

            .competition-item-name {
                color: #fff;
                font-weight: bold;
            }
        }
    }
}
</style>