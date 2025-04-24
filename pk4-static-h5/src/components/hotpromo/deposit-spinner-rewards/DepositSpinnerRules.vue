<template>
    <div class="rules-container">
        <div class="rule-title">
            {{ $t('hotPromo.depositSpinWheel.activityRules')}}
        </div>
        <ul>
            <li>{{ $t('hotPromo.depositSpinWheel.rule_01')}}</li>
            <li>{{ $t('hotPromo.depositSpinWheel.rule_02')}}</li>
            <li>{{ $t('hotPromo.depositSpinWheel.rule_03')}}</li>
            <li>{{ $t('hotPromo.depositSpinWheel.rule_04')}}</li>
            <li>{{ $t('hotPromo.depositSpinWheel.rule_05')}}</li>
        </ul>
        <div class="badges">
            <div class="badge" :key="index" v-for="(badge,index) in badgesList">
                <img :src="require(`./img/spin-${index+1}.png`)">
                <span class="badgetitle">{{ badge.title }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref } from "vue";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();
    const badgesList = ref([
        {
            title: t('hotPromo.depositSpinWheel.silver')
        },
        {
            title: t('hotPromo.depositSpinWheel.gold')
        },
        {
            title: t('hotPromo.depositSpinWheel.diamond')
        },
        {
            title: t('hotPromo.depositSpinWheel.supreme')
        }
    ])
</script>
<style lang="scss">
    .rules-container {
        width: 100%;
        padding: 10px;
        margin: 0 auto;
        background: url(./img/rules-bg-img.png)no-repeat center top;
        background-size: cover;
        .rule-title {
            display: flex;
            justify-content: center;
            color: #f9f9f9;
            font-family: Poppins;
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
            flex:2;
            justify-content: center;
            align-items: center;
            width: 70%;
            margin: 0 auto;
            &:before, &:after {
                content: "";
                background: url(./img/decal.png)no-repeat center center;
                height: 15px;
                width: 80%;
                background-size: contain;
                flex:1;
            }
            &:before {
                transform: rotateZ(180deg);
            }
        }
        ul {
            margin: 25px auto;
        }
        .badges {
            display: flex; 
            gap: 5px;
            width: 95%;
            margin: 10px auto;
            .badge {
                background: url(./img/greensquare.png)no-repeat center center;
                background-size: contain;
                padding: 5px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: 1;
                
                img {
                    width: 70%;
                    margin: 0 auto;
                }
            }
        }
    }
</style>