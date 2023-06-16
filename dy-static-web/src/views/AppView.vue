<template>
    <div class="app-container">
        <div class="app-container-inner">
            <template v-for="(det, idx) in platforms" :key="idx">
                <template :class="active" v-if="selectedPlat === det.code">
                    <div class="app-right" :class="det.code">
                        <!-- <img class="bgimg" :class="det.image" :src="require('../assets/app/left_person_' + det.image + '.webp')"> -->
                        <div class="app-item-box">
                            <img
                                v-if="det.code === 'QZ'"
                                src="../assets/app/all_left.png"
                            />
                            <img
                                v-if="det.code === 'DJ'"
                                src="../assets/app/esport_left.png"
                            />
                            <img
                                v-if="det.code === 'TY'"
                                src="../assets/app/sport_left.png"
                            />
                        </div>
                        <div class="app-item-box">
                            <img
                                v-if="det.code === 'QZ'"
                                src="../assets/app/all_right.png"
                            />
                            <img
                                v-if="det.code === 'DJ'"
                                src="../assets/app/esport_right.png"
                            />
                            <img
                                v-if="det.code === 'TY'"
                                src="../assets/app/sport_right.png"
                            />
                        </div>
                    </div>
                    <div class="app-left">
                        <div class="platform-list-box">
                            <span
                                class="platform-list-item platform"
                                v-for="(plat, i) in platforms"
                                :key="i"
                                @click="clickPlat(plat)"
                                :class="{ active: selectedPlat === plat.code }"
                            >
                                {{ plat.name }}APP
                            </span>
                        </div>
                        <div class="fade-left">
                            <template v-if="det.code === 'QZ'">
                                <img src="../assets/app/txt_all_client.png" />
                            </template>
                            <template v-if="det.code === 'DJ'">
                                <img src="../assets/app/txt_sport_client.png" />
                            </template>
                            <template v-if="det.code === 'TY'">
                                <img
                                    src="../assets/app/txt_esports_client.png"
                                />
                            </template>
                            <div class="app-desc" v-html="det.message"></div>
                            <div class="app-items">
                                <div class="box">
                                    <div class="qrcode-bg">
                                        <vue-qrious :value="det.link + '?1'" />
                                    </div>
                                    <div class="img-desc">
                                        扫描二维码下载IOS<br />
                                        安卓纯原生手机客户端
                                    </div>
                                    <a class="app-url" :href="det.link">{{
                                        det.link
                                    }}</a>
                                </div>
                                <div class="box">
                                    <div class="h5">
                                        <img
                                            src="../assets/app/download_icon_h5.png"
                                        />
                                    </div>
                                    <div class="img-desc">
                                        使用浏览器输入以下网址<br />免下载访问
                                    </div>
                                    <a class="app-url" :href="det.mobile">{{
                                        det.mobile
                                    }}</a>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="fade-left">
                    <img :src="require('../assets/app/txt_desc_' + det.image + '.webp')">
                    <div class="platform-txt-box">
                        <div>
                          <img :src="require('../assets/app/app_' + det.image + '_icons.webp')">
                        </div>
                    </div>
                    <div class="play-btn" @click="openGame(det.name, det.code)">立即投注</div> 
                </div>-->
                    </div>
                </template>
            </template>
        </div>
    </div>
    <GameModal ref="appGame"></GameModal>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import GameModal from "@/components/modal/GameModal";
import aos from "aos";
import VueQrious from "vue-qrious";

export default defineComponent({
    components: {
        GameModal,
        VueQrious,
    },
    setup() {
        const appGame = ref(null);
        const platforms = ref([
            {
                code: "QZ",
                name: "全站",
                image: "qz",
                message:
                    "全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！",
                link: "https://dy232.app",
                mobile: "https://dybet1.com",
            },
            {
                code: "DJ",
                name: "电竞",
                image: "dj",
                message:
                    "独立电竞APP，原生态开发，提供业界最多的赛事玩法和最佳水位，竞技视频同步直播，盘口信息准确无误，界面投注一目了然，极速尽享！",
                link: "https://xwesport.app",
                mobile: "https://dybet1.com",
            },
            {
                code: "TY",
                name: "体育",
                image: "ty",
                message:
                    "独立体育APP，原生态开发，高赔率 玩法多 提供业界最多的赛事玩法和最佳水位，竞技视频同步直播，盘口信息准确无误，界面投注一目了然，极速尽享！",
                link: "https://dygames.app",
                mobile: "https://dygames.app",
            },
        ]);
        const selectedPlat = ref(platforms.value[0].code);
        const clickPlat = (plat) => {
            selectedPlat.value = plat.code;
        };

        const openGame = (gameName, gameCode) => {
            appGame.value.open(gameName, "onlyPlatform", gameCode);
        };
        onMounted(() => {
            aos.refresh();
        });
        return {
            platforms,
            selectedPlat,
            clickPlat,
            openGame,
            appGame,
        };
    },
});
</script>

<style scoped lang="scss">
@-webkit-keyframes sport-left-fadeout-ani {
    0% {
        opacity: 1;
    }

    to {
        opacity: 0;
        -webkit-transform: translate3d(-30px, 0, 0);
        transform: translate3d(-30px, 0, 0);
    }
}

@keyframes sport-left-fadeout-ani {
    0% {
        opacity: 1;
    }

    to {
        opacity: 0;
        -webkit-transform: translate3d(-30px, 0, 0);
        transform: translate3d(-30px, 0, 0);
    }
}

@-webkit-keyframes sport-left-fadein-ani {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(-30px, 0, 0);
        transform: translate3d(-30px, 0, 0);
    }

    to {
        opacity: 1;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
}

@keyframes sport-left-fadein-ani {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(-30px, 0, 0);
        transform: translate3d(-30px, 0, 0);
    }

    to {
        opacity: 1;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
}

@-webkit-keyframes sport-right-fadeout-ani {
    0% {
        opacity: 1;
    }

    to {
        -webkit-transform: translate3d(30px, 0, 0);
        transform: translate3d(30px, 0, 0);
        opacity: 0;
    }
}

@keyframes sport-right-fadeout-ani {
    0% {
        opacity: 1;
    }

    to {
        -webkit-transform: translate3d(30px, 0, 0);
        transform: translate3d(30px, 0, 0);
        opacity: 0;
    }
}

@-webkit-keyframes sport-right-fadein-ani {
    0% {
        -webkit-transform: translate3d(30px, 0, 0);
        transform: translate3d(30px, 0, 0);
        opacity: 0;
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

@keyframes sport-right-fadein-ani {
    0% {
        -webkit-transform: translate3d(30px, 0, 0);
        transform: translate3d(30px, 0, 0);
        opacity: 0;
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

.fade-left {
    -webkit-animation: sport-right-fadein-ani 0.8s forwards;
    animation: sport-right-fadein-ani 0.8s forwards;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}
.fade-right {
    -webkit-animation: sport-left-fadein-ani 0.8s forwards;
    animation: sport-left-fadein-ani 0.8s forwards;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}
.app-container {
    min-height: 720px;
    background-image: url(../assets/app/download_bg.jpg);
    background-repeat: no-repeat;
    background-position: top center;
    background-size: cover;
    width: 100%;
    position: relative;
    overflow: hidden;
    letter-spacing: 0;
    font-size: 14px;
    z-index: 0;
    .app-container-inner {
        z-index: 1;
        position: relative;
        max-width: $maxwidth;
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        // gap: 100px;
        gap: 50px;
        .app-left {
            text-align: left;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 5;
            position: relative;
            padding-top: 70px;
            padding-bottom: 100px;
            .app-desc {
                line-height: 25px;
                letter-spacing: 2px;
                color: #242424;
                width: 450px;
                margin: 23px 0 39px;
            }
            .app-items {
                display: flex;
                justify-content: space-between;
                width: 80%;
                margin: 0 auto;
                .box {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    .app-url {
                        letter-spacing: 1px;
                        color: #5b91ff;
                    }
                    .qrcode-bg {
                        background: url(../assets/app/down_qrcode_bg.png) center
                            no-repeat;
                        width: 112px;
                        height: 112px;
                        padding: 7px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .h5 {
                        width: 112px;
                        height: 112px;
                        padding: 7px;
                    }
                    .img-desc {
                        margin: 30px 0 15px;
                        font-weight: 700;
                        color: #454545;
                        text-align: center;
                    }
                }
            }
            .platform-txt-list-content {
                line-height: 26px;
                letter-spacing: 1px;
                color: #959dab;
            }
            .play-btn {
                cursor: pointer;
                display: block;
                width: 198px;
                height: 52px;
                background-image: linear-gradient(
                        90deg,
                        #2d74f6 0,
                        #7abdfc 100%
                    ),
                    linear-gradient(#000, #000);
                background-blend-mode: normal, normal;
                border-radius: 26px;
                color: #fff;
                font-size: 16px;
                margin: 0 auto;
                text-align: center;
                line-height: 52px;
                border: none;
            }
        }
        .app-right {
            position: relative;
            width: 100%;
            height: 724px;
            //   margin-right: -40px;

            background: url(../assets/app/sport_phone.png) no-repeat;
            background-position: 350px 54px;
            &.QZ {
                // background: url(../assets/app/sport_phone.png)no-repeat;
                // background-position: 350px 54px;
                // .app-item-box {
                //     &:first-child {
                //         transform: translate(160px, 0);
                //         bottom: 0;
                //     }
                //     &:last-child {
                //         transform: translate(280px, -130px);
                //     }
                // }
            }
            .app-item-box {
                position: absolute;

                &:first-child {
                    animation: slide-in 1s forwards
                        cubic-bezier(0.83, 0.97, 0.05, 1.44);
                    bottom: 0;
                }
                &:last-child {
                    left: 350px;
                    top: 250px;
                    animation: kick-in 1s forwards
                        cubic-bezier(0.83, 0.97, 0.05, 1.44);
                    animation-delay: 0.5s;
                }
            }
            .absolute {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: unset;
            }
            .bgimg {
                height: 100%;
                display: block;
                position: relative;
                z-index: 1;
                &.allbet,
                &.bbin {
                    margin-top: 50px;
                }
                &.allbet {
                    margin-right: 40px;
                }
                &.bbin {
                    margin-right: 100px;
                }
            }
            .imgabs {
                z-index: -1;
                position: absolute;
            }
            .ag1 {
                bottom: 16%;
                left: 26%;
            }
            .ag2 {
                bottom: 4%;
                right: -5%;
            }
            .fag1 {
                left: 28%;
                top: 38%;
            }
            .fag2 {
                right: 6%;
                top: 22%;
            }

            .allbet1 {
                bottom: 15%;
                left: 35%;
            }
            .allbet2 {
                bottom: 10%;
                right: -18%;
            }
            .allbet3 {
                bottom: 8%;
                left: 38%;
            }
            .fallbet1 {
                left: 30%;
                top: 35%;
            }
            .fallbet2 {
                right: 2%;
                top: 18%;
            }

            .bbin1 {
                bottom: 5%;
                left: 20%;
            }
            .bbin2 {
                bottom: 16%;
                right: -20%;
            }
            .fbbin1 {
                left: 17%;
                bottom: 67%;
            }
            .fbbin2 {
                left: 10%;
                bottom: 56%;
            }
            .fbbin3 {
                left: 13%;
                bottom: 47%;
            }
            .fbbin4 {
                left: 11%;
                bottom: 38%;
            }
            .fbbin5 {
                left: 24%;
                bottom: 28%;
            }
            .fbbin6 {
                left: 15%;
                bottom: 20%;
            }
            .fbbin7 {
                right: -3%;
                top: 18%;
            }
            .img-down-up {
                -webkit-animation: img-down-up-ani 5s infinite;
                animation: img-down-up-ani 5s infinite;
            }
            .img-right-left {
                -webkit-animation: img-right-left-ani 5s infinite;
                animation: img-right-left-ani 5s infinite;
            }
            .img-left-right {
                -webkit-animation: img-left-right-ani 5s infinite;
                animation: img-left-right-ani 5s infinite;
            }
            flex: 2;

            @keyframes img-down-up-ani {
                0% {
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                }
                50% {
                    -webkit-transform: translateY(20px);
                    transform: translateY(20px);
                }
                100% {
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                }
            }

            @keyframes img-right-left-ani {
                0% {
                    -webkit-transform: translateX(0);
                    transform: translateX(0);
                }
                50% {
                    -webkit-transform: translateX(-10px);
                    transform: translateX(-10px);
                }
                100% {
                    -webkit-transform: translateX(0);
                    transform: translateX(0);
                }
            }
            @keyframes img-left-right-ani {
                0% {
                    -webkit-transform: translateX(0);
                    transform: translateX(0);
                }
                50% {
                    -webkit-transform: translateX(10px);
                    transform: translateX(10px);
                }
                100% {
                    -webkit-transform: translateX(0);
                    transform: translateX(0);
                }
            }
            @keyframes slide-in {
                0% {
                    transform: translateZ(0);
                }
                100% {
                    transform: translate(120px, 0);
                }
            }
            @keyframes kick-in {
                0% {
                    transform: translateZ(0);
                    opacity: 0;
                }
                100% {
                    transform: translate(240px, -130px);
                    opacity: 1;
                }
            }
        }
    }
    .platform-list-box {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 25px;
        margin: 35px auto 90px;
        .platform-list-item {
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: linear-gradient(0deg, #f2f2f2 0, #fefefe 100%),
                linear-gradient(#000, #000);
            border: none;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 1px;
            color: #222;
            padding: 15px 0px;
            min-width: 165px;
            background-blend-mode: normal, normal;
            box-shadow: 0 6px 20px 2px rgba(203, 203, 203, 0.75);
            border-radius: 26px;
            &.active,
            &:hover {
                background-image: linear-gradient(
                        90deg,
                        #2d74f6 0,
                        #7abdfc 100%
                    ),
                    linear-gradient(#000, #000);
                box-shadow: 0 6px 20px 2px rgba(103, 204, 255, 0.75);
                border: none;
                color: #fff;
            }
        }
    }
    .platform-txt-box {
        margin: 15px 0 55px;
        text-align: center;
    }
}
</style>
