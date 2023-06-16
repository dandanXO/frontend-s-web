<template>
    <div class="game-container">
        <div class="game-tab-content">
            <div class="pane-bg"></div>

            <template v-if="selectedPlat === 'TCG'">
                <div
                    class="lottery-pane-bg lottery-pane-tcg-bg"
                    data-aos="zoom-in"
                    data-aos-duration="700"
                >
                    <div class="tcg-effect-left"></div>
                    <div class="tcg-effect-right"></div>
                </div>

                <div
                    id="tcgText"
                    class="lottery-pane-right"
                    data-aos="fade-down"
                    data-aos-duration="700"
                >
                    <img class="title" src="../assets/lottery/tcg-title.webp" />
                    <p class="context">
                        TCG，业界首创区块链彩票，汲取区块链的核心技术算法，只为公平、公正的开奖结果。多地域的官方时时彩、11选5、PK10、PC蛋蛋和官方六合彩，足不出户却能无时无刻的尽情游玩！
                    </p>
                    <div class="type-icon">
                        <img src="../assets/lottery/img_1.5.webp" />
                        <img src="../assets/lottery/img_five.webp" />
                        <img src="../assets/lottery/img_eleven.webp" />
                        <img src="../assets/lottery/img_bjpk.webp" />
                        <img src="../assets/lottery/img_time.webp" />
                    </div>
                    <button class="btn linear-blue" @click="openGame(TCG, TCG)">
                        进入游戏
                    </button>
                </div>
            </template>

            <template v-if="selectedPlat === 'BBIN'">
                <div
                    class="lottery-pane-bg lottery-pane-bbin-bg"
                    data-aos="zoom-in"
                    data-aos-duration="700"
                >
                    <div class="bbin-effect-left"></div>
                    <div class="bbin-effect-right"></div>
                </div>

                <div
                    id="bbinText"
                    class="lottery-pane-right"
                    data-aos="fade-down"
                    data-aos-duration="700"
                >
                    <img
                        class="title"
                        src="../assets/lottery/bbin-title.webp"
                    />
                    <p class="context">
                        BBIN彩票打造着高品质游戏体验、不断地求新求变，寻找最新的创意，秉持最好的服务……，种种这些都注定BBIN彩票的不俗传说，超百种彩票玩法任您赢！
                    </p>
                    <div class="type-icon">
                        <img src="../assets/lottery/img_3d.webp" />
                        <img src="../assets/lottery/img_bbpk10.webp" />
                        <img src="../assets/lottery/img_cq.webp" />
                        <img src="../assets/lottery/img_k3.webp" />
                        <img src="../assets/lottery/img_pink11.webp" />
                    </div>
                    <button
                        class="btn linear-blue"
                        @click="openGame('BBIN', 'BBIN')"
                    >
                        进入游戏
                    </button>
                </div>
            </template>
        </div>
        <ul class="nav nav-tabs lottery-tabs" id="myTab" role="tablist">
            <li class="nav-item custom-nav-item" style="margin-left: 120px">
                <a
                    class="nav-link custom-nav-link tcg-nav-link"
                    @click="selectedPlat !== 'TCG' && clickPlat('TCG')"
                    :class="{ active: selectedPlat === 'TCG' }"
                >
                    TCG彩票
                </a>
            </li>
            <li class="nav-item custom-nav-item">
                <a
                    class="nav-link custom-nav-link bbin-nav-link"
                    @click="selectedPlat !== 'BBINDY' && clickPlat('BBINDY')"
                    :class="{ active: selectedPlat === 'BBINDY' }"
                    >bbin 彩票</a
                >
            </li>
        </ul>
    </div>
    <GameModal ref="liveGame"></GameModal>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import GameModal from "@/components/modal/GameModal";
import aos from "aos";
import { gsap, TimelineMax, TweenMax } from "gsap";

export default defineComponent({
    components: {
        GameModal,
    },
    setup() {
        const liveGame = ref(null);
        const platforms = ref([
            {
                code: "TCG",
                name: "TCG",
                image: "tcg",
                message:
                    "TCG，业界首创区块链彩票，汲取区块链的核心技术算法，只为公平、公正的开奖结果。多地域的官方时时彩、11选5、PK10、PC蛋蛋和官方六合彩，足不出户却能无时无刻的尽情游玩！",
            },
            {
                code: "BBINDY",
                name: "BBIN",
                image: "bbin",
                message:
                    "BBIN彩票打造着高品质游戏体验、不断地求新求变，寻找最新的创意，秉持最好的服务……，种种这些都注定BBIN彩票的不俗传说，超百种彩票玩法任您赢！",
            },
        ]);
        const selectedPlat = ref(platforms.value[0].code);

        const clickPlat = (plat) => {
            setTimeout(() => {
                selectedPlat.value = plat;
            }, 300);

            TweenMax.fromTo(
                ".pane-bg",
                {
                    duration: 0.1,
                    scale: 1,
                    opacity: 1,
                },
                {
                    duration: 0.2,
                    scale: 1.5,
                    opacity: 0,
                }
            );

            TweenMax.to(".pane-bg", {
                duration: 0.3,
                scale: 1,
                opacity: 1,
                delay: 0.3,
            });

            TweenMax.fromTo(
                ".lottery-pane-bg",
                {
                    duration: 0.1,
                    scale: 1,
                    opacity: 1,
                },
                {
                    duration: 0.2,
                    scale: 1.5,
                    opacity: 0,
                }
            );

            TweenMax.to(".lottery-pane-right", {
                duration: 0.3,
                y: 600,
                opacity: 0,
            });
        };

        const openGame = (gameName, gameCode) => {
            liveGame.value.open(gameName, gameCode, 'bbkeno_bbws_pc');
        };
        onMounted(() => {
            aos.refresh();
        });
        return {
            platforms,
            selectedPlat,
            clickPlat,
            openGame,
            liveGame,
        };
    },
});
</script>

<style scoped lang="scss">
.game-container {
    width: 1300px;
    // padding-top: 120px;
    // height: 902px;
    margin: auto;
}

.game-tab-content {
    position: relative;
    height: 630px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.pane-bg {
    position: absolute;
    background-image: url("../assets/lottery/bg_water.webp");
    background-repeat: no-repeat;
    width: 712px;
    height: 618px;
}

.lottery-tabs {
    position: relative;
    padding: 0 0 70px 135px;
    justify-content: flex-start;
    border: none;
    display: flex;

    li {
        list-style-type: none;
    }
}

.custom-nav-item {
    margin-right: 34px;
}

.custom-nav-link {
    cursor: pointer;
    width: 222px;
    height: 75px;
    background-image: linear-gradient(0deg, #f2f2f2 0%, #fefefe 100%),
        linear-gradient(#000000, #000000);
    background-blend-mode: normal, normal;
    box-shadow: 0px 6px 20px 2px rgba(103, 204, 255, 0.75);
    border-radius: 6px !important;

    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 2px;
    color: #4474ce;

    &.active,
    &:hover {
        color: #ffffff;
    }
}

.tcg-nav-link::before {
    content: " ";
    background-image: url("../assets/lottery/tcg.png");
    width: 43px;
    height: 43px;
}

.tcg-nav-link:hover::before {
    content: " ";
    background-image: url("../assets/lottery/tcg-hover.png");
}

.tcg-nav-link.active::before {
    content: " ";
    background-image: url("../assets/lottery/tcg-hover.png");
}

.bbin-nav-link::before {
    content: " ";
    background-image: url("../assets/lottery/bbin.png");
    width: 68px;
    height: 26px;
}

.bbin-nav-link:hover::before {
    content: " ";
    background-image: url("../assets/lottery/bbin-hover.png");
}

.bbin-nav-link.active::before {
    content: " ";
    background-image: url("../assets/lottery/bbin-hover.png");
}

.custom-nav-link:hover {
    background-image: linear-gradient(90deg, #2d74f6 0%, #7abdfc 100%),
        linear-gradient(#000000, #000000);
    background-blend-mode: normal, normal;
    box-shadow: 0px 6px 20px 2px rgba(103, 204, 255, 0.75);
}

.custom-nav-link:hover,
.nav-tabs .nav-item.show .nav-link,
.nav-tabs .custom-nav-link.active {
    background-image: linear-gradient(90deg, #2d74f6 0%, #7abdfc 100%),
        linear-gradient(#000000, #000000);
    background-blend-mode: normal, normal;
    box-shadow: 0px 6px 20px 2px rgba(103, 204, 255, 0.75);
}

.lottery-pane-tcg-bg {
    position: relative;
    background-image: url("../assets/lottery/bg-tcg.webp");
    background-repeat: no-repeat;
    background-position: left center;
    width: 668px;
    height: 760px;
    z-index: 0;
}

.tcg-effect-left {
    position: absolute;
    background-image: url("../assets/lottery/img_yellowball.webp");
    width: 81px;
    height: 81px;
    top: 126px;
    left: 85px;
    animation: bonuceDown 8s ease-in-out infinite;
}

.tcg-effect-right {
    position: absolute;
    bottom: 300px;
    right: 0px;
    background-image: url("../assets/lottery/img_buleball.webp");
    width: 76px;
    height: 77px;
    animation: bonuceUp 8s ease-in-out infinite;
}

.bbin-effect-left {
    position: absolute;
    background-image: url("../assets/lottery/img_greenball.webp");
    width: 96px;
    height: 96px;
    top: 126px;
    left: 85px;
    animation: bonuceDown 8s ease-in-out infinite;
}

.bbin-effect-right {
    position: absolute;
    bottom: 300px;
    right: 0px;
    background-image: url("../assets/lottery/img_redball.webp");
    width: 94px;
    height: 92px;
    animation: bonuceUp 8s ease-in-out infinite;
}

@keyframes bonuceDown {
    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, 30px);
    }
}

@keyframes bonuceUp {
    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, -30px);
    }
}

.lottery-pane-bbin-bg {
    position: relative;
    background-image: url("../assets/lottery/bg-bbin.webp");
    background-repeat: no-repeat;
    background-position: left top;
    width: 718px;
    height: 760px;
    z-index: 0;
}

.lottery-pane-right {
    float: right;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10rem;
}

.lottery-pane-right .context {
    margin-top: 55px;
    margin-bottom: 65px;
    font-size: 14px;
    font-weight: normal;
    color: #515151;
}

.lottery-pane-right button {
    margin-top: 48px;
    width: 198px;
    height: 52px;
}

.linear-blue {
    background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%),
        linear-gradient(#000, #000);
    background-blend-mode: normal, normal;
    border-radius: 26px;
    border: none;
    color: #ffffff;
    cursor: pointer;
}
</style>
