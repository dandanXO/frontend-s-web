<template>
    <div class="forgot-pwd-page-container">
        <div class="center">
            <div class="logo">
                <img src="@/assets/app/logo.png" />
            </div>
            <div class="card-bg">

                <el-tabs>
                    <el-tab-pane :label="$t('login.findPasswordPhone')">
                        <PhoneOrEmailFindPwd type="phone" />
                    </el-tab-pane>
                    <el-tab-pane :label="$t('login.findPasswordEmail')">
                        <PhoneOrEmailFindPwd type="email" />
                    </el-tab-pane>
                    <el-tab-pane :label="$t('login.findAccountEmail')">
                        <EmailFindPwd />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import EmailFindPwd from "@/components/auth/EmailFindPwd.vue";
import PhoneOrEmailFindPwd from "@/components/auth/PhoneOrEmailFindPwd.vue";


</script>

<style lang="scss">
.forgot-pwd-page-container {
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background: url("@/assets/home/auth/login-page-bg.jpg") no-repeat center center;
    background-size: cover;
    display: flex;

    .el-tabs__active-bar,
    .el-tabs__nav-wrap::after {
        display: none;
    }


    .el-tabs__nav {
        border-radius: 30px;
        box-shadow: 0px -1.7px 6.09px 0px #a2bff4 inset;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 5px;
        width: 100%;
    }

    .el-tabs--top .el-tabs__item.is-top {
        font-size: 14px;
        border-radius: 30px;
        color: #468CFF;
        // box-shadow: 0px -1.7px 6.09px 0px #a2bff4 inset;
        display: flex;
        width: 150px;
        padding: 0;
        width: 100%;
        min-width: 100px;

        &.is-active {
            background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
            box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
            color: #fff;
            font-size: 14px;
            border-radius: 30px;
        }
    }
}

.center {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
    margin: 5% auto;
    width: 100%;
    max-width: 600px;
}

.logo img {
    width: 200px;
}

.card-bg {
    background-color: #F7F9FC;
    box-shadow: 0px 0px 10px 0px #0000001A;
    padding: 50px;
    border-radius: 10px;
}
</style>
  