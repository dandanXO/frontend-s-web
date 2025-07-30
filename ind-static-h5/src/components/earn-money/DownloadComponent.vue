<template>
    <div class="download-container">
        <div class="download-icon">
            <img src="../../assets/images/earn-money/download-icon.png">
        </div>
        <div class="download-title">
            BANNER PACK
        </div>
        <div class="download-details">
            Multilingual kit includes activities, animated banners and more...
        </div>
        <q-btn class="download-btn" icon="cloud_download">
            DOWNLOAD <span style="color: #FFCC00;">(200MB)</span>
        </q-btn>
    </div>
</template>
<style lang="scss" scoped>
.download-container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .download-icon {
        width: 150px;
        margin: 0 auto 20px;
        img { 
            width: 100%;
            display: block;
        }
    }
    .download-title {
        font-size: 20px;
        font-weight: bold;
    }
    .download-details {
        margin: 10px auto 20px;
        font-size: 16px;
        color: #ffffffcc;
    }
}
.download-btn {
    background: #5C46E7; color: #ffffff; width: 100%;
    padding: 10px;
    :deep(.q-btn__content) {
        gap: 10px;
    }
}
</style>