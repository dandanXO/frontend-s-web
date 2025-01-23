<template>
    <div class="congrats-container">
        <q-btn icon="close" round dense v-close-popup class="congrats-close" />
        <div class="congrats-header">
            <svg class="gradient-amount-wrapper" preserveAspectRatio='xMinYMin' xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="make-money-together" gradientTransform="rotate(90)">
                        <stop offset="0%" stop-color="#fff" />
                        <stop offset="100%" stop-color="#fff" />
                    </linearGradient>
                </defs>
                <text id="test" x="135" y="25" class="amount">Make Money</text>
                <text id="test" x="130" y="65" class="amount">Together</text>
            </svg>
        </div>
        <div class="qr-img-wrapper">
            <VueQRCodeComponent size="120" :text="selfTgurl" class="qr-img" id="the-qrcode" />
        </div>

        <div class="congrats-button">
            <q-btn @click="downloadQRImg" no-caps unelevated class="save-btn" :loading="false">
                {{ $t("hotPromo.referWheel.save") }}
            </q-btn>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import VueQRCodeComponent from 'vue-qrcode-component'
import { api } from "src/boot/axios";
import { userStore } from "src/stores";
import { Platform } from "quasar";
import html2canvas from "html2canvas";
import { Filesystem, Directory } from "@capacitor/filesystem";

const store = userStore();
const props = defineProps(['selfTgurl']);
const selfTgurl = props.selfTgurl;

const downloadQRImg = async () => {
    if (Platform.is.capacitor && Platform.is.android) {
        try {
            html2canvas(document.querySelector("#the-qrcode")).then(async function (canvas) {
                document.body.appendChild(canvas);
                const dataUrl = canvas.toDataURL("image/jpeg");
                // console.log(dataUrl);

                // Save the image to the photo gallery
                await Filesystem.writeFile({
                    path: `Pictures/myreferral.jpg`,
                    data: dataUrl,
                    directory: Directory.Documents,
                    recursive: true
                });

                console.log("QR Code image saved to gallery.");

                $q.notify({
                    color: "positive",
                    position: "top",
                    message: "QR Code image saved to photo gallery.",
                    icon: "check_circle_outline"
                });

                canvas.style.display = "none";
            });
        } catch (error) {
            console.error("Error saving QR Code image:", error);
        }
    } else {
        const link = window.document.createElement("a");
        const imgElement = document.querySelector('img[alt="Scan me!"]');
        link.href = imgElement.src;
        link.download = "myreferral";

        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }
};

onMounted(() => {
});
</script>

<style lang="scss" scoped>
.gradient-amount-wrapper {
    height: 100px;

    .amount {
        font-size: 30px;
        fill: url(#make-money-together);
        text-shadow: 4px 4px #064600;
        font-family: 'Poppins';
        font-weight: 500;
        text-anchor: middle;
        dominant-baseline: middle;
    }
}

.congrats-button {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    width: 100%;
    display: flex;
    justify-content: center;
}

.congrats-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.congrats-container {
    background-color: #1e371f;
    border: 1px solid #337e3a;
    border-radius: 10px !important;
    max-width: 400px;
    width: 100%;
    padding: 16px;
    position: relative;
    overflow: visible;
    border-radius: 12px;

    .congrats-header {
        display: flex;
        justify-content: center;
        font-size: 35px;
        text-align: center;
        margin-top: 60px;
    }

    .qr-img-wrapper {
        background-color: #006A4C;
        width: fit-content;
        padding: 6px;
        border-radius: 25px;
        display: flex;
        margin: 0 auto;

        .qr-img {
            border-radius: 25px;
            background-color: #fff;
            padding: 12px;
        }
    }

    .congrats-title {
        color: #ffffff;
        display: flex;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
    }
}

.congrats-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.1);
}

.save-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #000a01;
    width: 80%;
}

.congrats-container {
    background: url(../../../assets/images/promotion/hotpromo/refer-spinwheel/qr-popup-bg.png) no-repeat center center;
    background-size: 100% 100%;
    border: none;
    height: 400px;
    width: 300px;
}
</style>