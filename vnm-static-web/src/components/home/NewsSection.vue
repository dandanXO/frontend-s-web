<template>
    <div class="news-section">
        <el-card>
            <img src="../../assets/logo.svg">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane :label="t('home.soccerBetting')" name="first">
                    <div class="news-listing">
                        
                        <div class="news" v-for="news in 5">
                            <div class="news-image">
                                <img src="../../assets/home/news/image.png">
                            </div>
                            <div class="news-contents">
                                <div class="news-title">
                                    Rồng hổ TF88 là gì? Kinh nghiệm...
                                </div>
                                <div class="news-content">
                                    Rồng hổ TF88 là một trò chơi casino trực tuyến được rất nhiều anh em Việt Nam yêu thích. Sở hữu luật chơi đơn giản, cửa đặt cược tỷ lệ thắng cao, cùng với đó là hàng ngàn chương trình khuyến mãi hấp dẫn tạo điều kiện thuận lợi cho người chơi tham gia. Mời anh em cùng tham khảo những kinh nghiệm chơi Rồng hổ hiệu quả nhất hiện nay nhé!
                                </div>
                                 <button class="standard-button btn-color-blue">More details</button>
                            </div>
                        </div>
                    </div>    
                </el-tab-pane>
                <el-tab-pane :label="t('home.footballNews')" name="second">{{ $t('home.footballNews') }}</el-tab-pane>
                <el-tab-pane :label="t('home.soccerBetting')" name="third">{{ $t('home.soccerBetting') }}</el-tab-pane>
                <el-tab-pane :label="t('home.soccerBetting')" name="fourth">{{ $t('home.soccerBetting') }}</el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script lang="js" setup>
import { ref } from 'vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const activeName = ref('first')
</script>
<style lang="scss">
    .news-section {
        max-width: 1350px;
        margin: 50px auto;
        .el-card {
            border-radius: 15px;
        }
        .news-listing {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            .news {
                display: flex;
                gap: 20px;
                &:first-child {
                    grid-column: span 2;
                    .news-image {
                        width: 556px;
                        height: 240px;
                    }
                }
                .news-image {
                    flex: 2;
                    width: 270px;
                    height: 165px;
                    overflow: hidden;
                    border-radius: 20px;
                    img {
                        height: 100%;
                    }
                }
                .news-contents {
                    position: relative;
                    padding: 0 30px 30px 0;
                    flex: 3;
                    .news-title {
                        color: #7A80A1;
                        font-size: 20px;
                        font-weight: 700;
                    }
                    .news-content {
                        height: 92px;
                        font-size: 14px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: #A4AABB;
                        margin: 15px 0;
                    }
                    .standard-button {
                        position: absolute;
                        bottom: 0px;
                        right: 30px;
                    }
                }
            }
        }
    }
</style>