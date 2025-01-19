<template>
    <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.bindEmail") }}</div>

        <div class="desc">{{ $t("form.bindEmailDesc") }}</div>

        <q-btn rounded flat no-caps class="btn-primary btn-primary__full" @click="onClickProceed">
            {{ $t("btn.proceed") }}
        </q-btn>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const emits = defineEmits(["test"]);

const router = useRouter();

const onClickProceed = () => {
    emits("closeBindEmailKYCDialog");
    router.push('/account/profile?bindEmail=true');
}
</script>

<style lang="scss" scoped>
.popout-dialog-container {
    gap: 15px;

    .desc {
        font-size: 15px;
        color: #8f8f8f;
    }
}
</style>