<template>
    <div class="sponsor">
        <div class="sponsor-container">
            <div class="sponsor-banner">
                <img src="../assets/images/sponsor/bg3.jpg" alt="" title="" />
            </div>
            <div class="sponsor-content-wrapper">
                <div class="sponsor-title">
                    <h2>带您了解MAD LIONS</h2>
                </div>
                <div class="sponsor-desc-container">
                    <div class="sponsor-desc-img">
                        <img
                            src="../assets/images/sponsor/figure1.jpg"
                            alt=""
                            title=""
                        />
                    </div>
                    <div class="sponsor-desc-txt">
                        <div class="sponsor-desc-logo">
                            <img
                                src="../assets/images/sponsor/logo.png"
                                alt=""
                                title=""
                            />
                        </div>
                        <p>
                            MAD
                            Lions是来自丹麦的一支CSGO战队，现世界排名已经来到了第13，在AcilioN上任后队伍的实力不断地进步，雷火电竞平台以赞助商的身份联手MAD
                            Lions俱乐部，将给为俱乐部增添新的助力，推动MAD
                            Lions的持续发展
                        </p>
                    </div>
                </div>
                <div class="sponsor-title pt">
                    <h2>MAD LIONS队员展示</h2>
                </div>
                <div class="sponsor-players-container">
                    <div class="sponsor-player">
                        <div class="player-num">1</div>
                        <div class="player-img">
                            <img
                                src="../assets/images/sponsor/player1.png"
                                alt=""
                            />
                        </div>
                        <div class="player-name">TMB</div>
                    </div>

                    <div class="sponsor-player">
                        <div class="player-num">2</div>
                        <div class="player-img">
                            <img
                                src="../assets/images/sponsor/player2.png"
                                alt=""
                            />
                        </div>
                        <div class="player-name">tudsoN</div>
                    </div>

                    <div class="sponsor-player">
                        <div class="player-num">3</div>
                        <div class="player-img">
                            <img
                                src="../assets/images/sponsor/player3.png"
                                alt=""
                            />
                        </div>
                        <div class="player-name">Woro2k</div>
                    </div>

                    <div class="sponsor-player">
                        <div class="player-num">4</div>
                        <div class="player-img">
                            <img
                                src="../assets/images/sponsor/player4.png"
                                alt=""
                            />
                        </div>
                        <div class="player-name">sausol</div>
                    </div>

                    <div class="sponsor-player">
                        <div class="player-num">5</div>
                        <div class="player-img">
                            <img
                                src="../assets/images/sponsor/player5.png"
                                alt=""
                            />
                        </div>
                        <div class="player-name">jL</div>
                    </div>
                </div>

                <div class="sponsor-cert">
                    <img
                        src="../assets/images/sponsor/certification.png"
                        alt=""
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import { defineComponent, onMounted, ref } from "vue";
</script>

<style lang="scss">
.sponsor {
    color: #000000;
    background-color: #ffffff;
    background-image: url(../assets/images/sponsor/bg2.jpg);
    background-size: 100%;

    .sponsor-container {
        .sponsor-banner {
            img {
                display: block;
                width: 100%;
            }
        }

        .sponsor-content-wrapper {
            padding: 20px;
            max-width: 1200px;
            margin: auto;
        }

        .sponsor-desc-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;

            .sponsor-desc-logo {
                img {
                    display: block;
                    width: 100%;
                    max-width: 86px;
                }
            }

            p {
                line-height: 1.8;
                letter-spacing: 1px;
                color: #3c4147;
            }
        }

        .sponsor-title {
            text-align: center;
            font-size: 40px;
            letter-spacing: 5px;
            color: #0094ff;

            &.pt {
                padding-top: 70px;
            }
        }

        .sponsor-players-container {
            display: flex;
            gap: 40px;
            justify-content: center;

            .sponsor-player {
                .player-img {
                    img {
                        display: block;
                        width: 100%;
                    }
                }

                .player-num {
                    color: #c2c2c2;
                    font-size: 14px;
                    text-align: right;
                }

                .player-name {
                    text-align: center;
                    font-size: 12px;
                    margin-top: 5px;
                }
            }
        }

        .sponsor-cert {
            margin: 40px 0 80px;
        }
    }
}
</style>
