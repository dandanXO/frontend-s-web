<template>
    <q-btn @click="onClickButtonHandler" :label="props.label" type="button"
        :class="`form-button ${['blue', 'yellow'].includes(props.color) ? props.color : 'blue'}`"
        rounded flat :loading="props.loading" :disable="props.loading" />
</template>

<script setup>
const props = defineProps(['onClickButton', 'color', 'label', 'loading']);

const onClickButtonHandler = () => {
    props?.onClickButton?.();
}
</script>

<style lang="scss" scoped>
.form-button {
    width: 100%;
    height: auto;
    max-height: 70px;
    max-width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-bottom: 5px;
    margin: auto 10px;
    white-space: nowrap;

    &:hover {
        filter: brightness(1.1);
    }

    &:active {
        transform: translateY(2px);
    }

    &.blue {
        background: url("../../assets/home/btn-blue.svg") no-repeat center center;
        background-size: 100% 100%;
    }

    &.yellow {
        background: url("../../assets/home/btn-orange.svg") no-repeat center center;
        background-size: 100% 100%;
    }
}
</style>