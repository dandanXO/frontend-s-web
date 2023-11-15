<template>
  <el-card class="box-card">
    <el-input
      v-model="qrcodeData"
      size="small"
      style="width: 200px;margin:2px"
      placeholder="qrcode Data"
    />
    <el-input
      v-model="radius"
      size="small"
      style="width: 200px;margin:2px"
      placeholder="radius"
    />
    <pick-colors v-model="darkColor" format="hex" show-alpha @close-picker="pickDark" />
    <pick-colors v-model="lightColor" format="hex" show-alpha @close-picker="pickLight" />
    <el-button size="small" @click="generateQrcode" type="primary">
      generate
    </el-button>
  </el-card>
  <el-card>
    <el-input
      v-model="text1"
      size="small"
      style="width: 200px;margin:2px"
      placeholder="text"
    />
    <pick-colors v-model="text1Color" format="hex" show-alpha @close-picker="pickText1" />
    <el-button size="small" @click="addText1" type="primary">
      add
    </el-button>
  </el-card>
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
const text1Color = ref('#000000')
const radius = ref(0)
const qrcodeData = ref()
const text1 = ref()
const myCanvas = ref(null)
const maxWidth = 800;
const maxHeight = 1000;
let poster;

async function generateQrcode() {
  await poster.qrcode({ data: qrcodeData.value, dark: darkColor.value, light: lightColor.value, radius: radius.value });
}

function pickDark(color) {
  darkColor.value = color;
}

function pickLight(color) {
  lightColor.value = color;
}

function pickText1(color) {
  text1Color.value = color;
}

let textId;

async function addText1() {
  textId = await poster.text({
    text: text1.value,
    color: text1Color.value,
    id: textId,
    fontSize: 30,
    fontFamily: "Courier New"
  })
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
