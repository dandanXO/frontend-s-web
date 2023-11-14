<template>
  <el-input
    v-model="qrcodeData"
    size="small"
    style="width: 200px;margin:2px"
    placeholder="qrcode Data"
  />
  <pick-colors v-model="darkColor" format="hex" show-alpha @close-picker="pickDark" />
  <pick-colors v-model="lightColor" format="hex" show-alpha @close-picker="pickLight" />
  <el-button size="small" @click="generateQrcode" type="primary">
    generate
  </el-button>
  <el-button size="small" @click="download" type="primary">
    download
  </el-button>

  <canvas ref="myCanvas" id="poster" />
</template>

<script setup>
import { ref, onMounted } from '@vue/runtime-core'
import Poster from './Poster';
import PickColors from 'vue-pick-colors'
import testBg from "./1125-3181.jpg";

const darkColor = ref('#000000')
const lightColor = ref('#ffffff')
const qrcodeData = ref()
const myCanvas = ref(null)
const maxWidth = 500;
const maxHeight = 800;
let poster;

async function generateQrcode() {
  await poster.qrcode(qrcodeData.value, { type: "svg", dark: darkColor.value, light: lightColor.value });
}

function pickDark(color) {
  darkColor.value = color;
}

function pickLight(color) {
  lightColor.value = color;
}

function download() {
  poster.download();
}

function initCanvas() {
  poster.background(testBg);
}

onMounted(async () => {
  poster = new Poster(myCanvas.value, maxWidth, maxHeight);
  initCanvas();
})
</script>

<style>
#poster {
  border: 1px solid rgb(199, 198, 198);
}
</style>
