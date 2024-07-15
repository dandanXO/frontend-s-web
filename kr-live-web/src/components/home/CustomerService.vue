<template>
    <q-page-sticky position="bottom-right" :offset="[40, 40]" style="z-index:999999" class="floating">
        <div class="floating-cs-img">
            <q-popup-proxy>
                <q-banner style="background:transparent;padding:0;">
                    <iframe src="https://csweb01.amv4xjcbd.com/?partnerId=12&lang=kr&way=H5" class="cs-iframe" />
                </q-banner>
            </q-popup-proxy>
        </div>
    </q-page-sticky>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.floating-cs-img {
    background: url("../../assets/images/index/cs-icon.png") no-repeat center center;
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
    aspect-ratio: 60/60;
    cursor: pointer;

    &:hover {
        filter: brightness(0.86);
    }

    &:active {
        filter: brightness(0.75);
    }

    @media (max-width: 600px) {
        width: 40px;
        height: 40px;
        margin: 0px -5px;
    }
}

.cs-iframe {
    width: 500px;
    height: 800px;
    border-radius: 12px;

    @media (max-width: 600px) {
        width: 80vw;
        height: 80vh;
    }
}
</style>