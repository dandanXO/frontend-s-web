<template>
  <div ref="container" :style="{height: height, width: width}" />
</template>

<script setup>
import { onMounted, ref, defineProps, watch, toRefs } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  name: {
    type: String,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: 'container',
    required: false,
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '350px'
  },
  // eslint-disable-next-line vue/require-prop-type-constructor
  options: {
    type: Object,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: {},
    required: true,
  },
  theme: {
    type: String,
    default: '', // dark为深色模式
    required: false,
  },
})
const { options } = toRefs(props)
const container = ref(null)

/*
line graph does not show tooltip
solution >>>> https://github.com/apache/echarts/issues/14342
const chart = ref(null)
*/
let chart = null

// 组件挂载后将echarts挂载在container上，并将给echarts设置传入的options
onMounted(() => {
  chart = echarts.init(container.value, props.options.theme, {
    height: 400
  });
  chart.setOption(props.options);
  window.addEventListener('resize', function() {
    chart.resize();
  });
})

// 监听options发生变化时，重新给echarts设置传入的options
watch(
  options,
  newOptions => {
    chart.setOption(newOptions)
  },
  { deep: true }
)
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
