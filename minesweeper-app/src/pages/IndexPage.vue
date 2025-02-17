<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
  row: number
  col: number
}

interface GameConfig {
  rows: number
  cols: number
  mines: number
}

interface DifficultyOption {
  label: string
  value: string
  rows: number
  cols: number
  mines: number
}

const $q = useQuasar()

// 定义难度选项
const difficulties: DifficultyOption[] = [
  { label: '低', value: 'low', rows: 9, cols: 9, mines: 10 },
  { label: '中', value: 'medium', rows: 14, cols: 12, mines: 20 },
  { label: '高', value: 'high', rows: 16, cols: 12, mines: 40 },
]

// 难度选单 v-model
const selectedDifficulty = ref({ label: '低', value: 'low', rows: 9, cols: 9, mines: 10 })
const difficultyOptions = computed(() =>
  difficulties.map((d) => ({ label: d.label, value: d.value })),
)

// 游戏配置（预设采用低难度）
const config = ref<GameConfig>({
  rows: 9,
  cols: 9,
  mines: 10,
})

// 当难度选择改变时，更新游戏配置并重新开始新游戏
watch(selectedDifficulty, (newValue) => {
  const diff = difficulties.find((d) => d.value === newValue.value)
  
  if (diff) {
    config.value = { rows: diff.rows, cols: diff.cols, mines: diff.mines }
    newGame()
  }
})

// 游戏状态
const board = ref<Cell[][]>([])
const gameOver = ref<boolean>(false)
const gameWon = ref<boolean>(false)
const flagCount = ref<number>(0)
const timer = ref<number>(0)
const timerInterval = ref<number | null>(null)

// 计算属性
const minesLeft = computed(() => config.value.mines - flagCount.value)
const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60)
  const seconds = timer.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
})

// 检查座标是否在边界内
function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < config.value.rows && col < config.value.cols && col >= 0
}

// 安全地取得格子
function getCell(board: Cell[][], row: number, col: number): Cell | null {
  if (!isInBounds(row, col)) return null
  return board[row]?.[col] ?? null
}

// 初始化游戏板
function initBoard(): Cell[][] {
  const rows = config.value.rows
  const cols = config.value.cols
  const mines = config.value.mines

  // 创建空白游戏板
  const newBoard: Cell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
      row,
      col,
    })),
  )

  // 随机放置地雷
  let minesPlaced = 0
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)
    const cell = getCell(newBoard, row, col)

    if (cell && !cell.isMine) {
      cell.isMine = true
      minesPlaced++
    }
  }

  // 计算邻近地雷数
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = getCell(newBoard, row, col)
      if (cell && !cell.isMine) {
        cell.neighborMines = countNeighborMines(newBoard, row, col)
      }
    }
  }

  return newBoard
}

// 计算邻近地雷数
function countNeighborMines(board: Cell[][], row: number, col: number): number {
  let count = 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue

      const newRow = row + i
      const newCol = col + j
      const cell = getCell(board, newRow, newCol)

      if (cell?.isMine) {
        count++
      }
    }
  }

  return count
}

// 开启格子
function revealCell(row: number, col: number): void {
  const cell = getCell(board.value, row, col)

  if (!cell || cell.isRevealed || cell.isFlagged) {
    return
  }

  cell.isRevealed = true

  // 如果是空格子，递回开启周围格子
  if (cell.neighborMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        revealCell(row + i, col + j)
      }
    }
  }
}

// 新增：打开已揭露数字周围未揭露的格子功能
function revealAdjacentCells(cell: Cell): void {
  let flaggedCount = 0

  // 计算周围插旗数量
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue
      const neighbor = getCell(board.value, cell.row + i, cell.col + j)
      if (neighbor && neighbor.isFlagged) {
        flaggedCount++
      }
    }
  }

  // 如果旗帜数等于该数字，则打开所有相邻未翻开且未插旗的格子
  if (flaggedCount === cell.neighborMines) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const neighbor = getCell(board.value, cell.row + i, cell.col + j)
        if (neighbor && !neighbor.isRevealed && !neighbor.isFlagged) {
          if (neighbor.isMine) {
            // 如果有未插旗的地雷则触发游戏结束
            neighbor.isRevealed = true
            gameOver.value = true
            gameWon.value = false
            stopTimer()
            revealAllMines()
            showGameOverDialog()
            return
          } else {
            revealCell(neighbor.row, neighbor.col)
          }
        }
      }
    }
    checkWin()
  }
}

// 处理点击事件
function handleClick(cell: Cell): void {
  if (gameOver.value || cell.isFlagged) return

  // 如果格子已揭露，且有数字，则尝试打开周围格子
  if (cell.isRevealed) {
    if (cell.neighborMines > 0) {
      revealAdjacentCells(cell)
    }
    return
  }

  startTimer()

  if (cell.isMine) {
    gameOver.value = true
    gameWon.value = false
    stopTimer()
    revealAllMines()
    showGameOverDialog()
  } else {
    revealCell(cell.row, cell.col)
    checkWin()
  }
}

// 切换旗帜
function toggleFlag(cell: Cell): void {
  if (gameOver.value || cell.isRevealed) return

  startTimer()

  cell.isFlagged = !cell.isFlagged
  flagCount.value += cell.isFlagged ? 1 : -1
}

// 显示所有地雷
function revealAllMines(): void {
  board.value.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.isRevealed = true
      }
    })
  })
}

// 检查是否获胜
function checkWin(): void {
  const allNonMinesRevealed = board.value.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed),
  )

  if (allNonMinesRevealed) {
    gameOver.value = true
    gameWon.value = true
    stopTimer()
    showWinDialog()
  }
}

// 计时器功能
function startTimer(): void {
  if (timerInterval.value === null) {
    timerInterval.value = window.setInterval(() => {
      timer.value++
    }, 1000)
  }
}

function stopTimer(): void {
  if (timerInterval.value !== null) {
    window.clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// 对话框
function showGameOverDialog(): void {
  $q.dialog({
    title: '游戏结束',
    message: '很遗憾，你踩到地雷了！',
    ok: {
      label: '重新开始',
      flat: true,
      color: 'primary',
    },
  }).onOk(() => {
    newGame()
  })
}

function showWinDialog(): void {
  $q.dialog({
    title: '恭喜获胜',
    message: `你用了 ${formattedTime.value} 完成游戏！`,
    ok: {
      label: '重新开始',
      flat: true,
      color: 'primary',
    },
  }).onOk(() => {
    newGame()
  })
}

// 开始新游戏
function newGame(): void {
  board.value = initBoard()
  gameOver.value = false
  gameWon.value = false
  flagCount.value = 0
  timer.value = 0
  stopTimer()
}

// 取得格子颜色
function getCellColor(cell: Cell): string {
  if (cell.isFlagged) return 'warning'
  if (!cell.isRevealed) return 'grey-3'
  if (cell.isMine) return 'negative'
  return 'revealed'
}

// 取得数字颜色
function getNumberColor(num: number): string {
  const colors = ['blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'grey']
  return colors[num - 1] || 'black'
}

// 初始化游戏
newGame()
</script>

<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column items-center q-gutter-y-md">
      <!-- 游戏资讯 -->
      <div class="game-controls">
        <q-btn color="primary" label="新游戏" @click="newGame" />
        <!-- 难度下拉选单 -->
        <q-select
          :color="selectedDifficulty.value === 'low' ? 'green' : selectedDifficulty.value === 'medium' ? 'orange' : 'red'"
          
          v-model="selectedDifficulty"
          :options="difficultyOptions"
          label="难度"
          dense
          outlined
          style="min-width: 120px;"
        />
        <q-chip icon="flag" color="red" text-color="white"> 剩余地雷：{{ minesLeft }} </q-chip>
        <q-chip icon="timer" color="primary" text-color="white"> 时间：{{ formattedTime }} </q-chip>
      </div>

      <!-- 游戏版面 -->
      <q-card flat bordered class="minesweeper-board">
        <q-card-section class="q-pa-none">
          <div class="board-container">
            <div class="board-row" v-for="(row, index) in board" :key="index">
              <q-btn
                v-for="cell in row"
                :key="`${cell.row}-${cell.col}`"
                :color="getCellColor(cell)"
                class="mine-cell"
                square
                dense
                no-caps
                @click="handleClick(cell)"
                @contextmenu.prevent="toggleFlag(cell)"
              >
                <template v-if="cell.isRevealed && !cell.isMine && cell.neighborMines">
                  <span :style="{ color: getNumberColor(cell.neighborMines) }">
                    {{ cell.neighborMines }}
                  </span>
                </template>
                <template v-else-if="cell.isFlagged"> 🚩 </template>
                <template v-else-if="cell.isRevealed && cell.isMine"> 💣 </template>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
/* 定义全局变数方便调整配色 */
:root {
  --border-color: #666;
  --background-color: #757575;
  --cell-bg: #fafafa;
  --cell-border: #bbb;
  --cell-shadow: rgba(0, 0, 0, 0.15);
  --flag-bg: #ffd700;
  --mine-bg: #ff4444;
  --hover-bg: #e0e0e0;
  --revealed-hover-bg: #dcdcdc;
}

/* 地雷扫描器棋盘容器 */
.minesweeper-board {
  border: 3px solid var(--border-color);
  padding: 4px;
  background: var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px var(--cell-shadow);
}

/* 游戏控制区域 */
.game-controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

/* 棋盘容器 */
.board-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

/* 棋盘每一行 */
.board-row {
  display: flex;
  height: 40px;
}

/* 格子样式 */
.mine-cell {
  width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  margin: 1px !important;
  font-weight: bold;
  font-size: 1.2em;
  border: 1px solid var(--cell-border) !important;
  background: var(--background-color);
  color: #333;
  border-radius: 4px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}

/* 按钮额外调整：移除圆角 */
.mine-cell.q-btn {
  border-radius: 4px !important;
}

/* 格子内文字垂直与水平置中 */
.mine-cell .q-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 已揭露格子样式 */
.mine-cell.revealed {
  background: var(--cell-bg) !important;
  color: #000 !important;
  box-shadow: inset 0 0 5px var(--cell-shadow);
}

/* 未揭露格子的悬停效果 */
.mine-cell:not(.revealed):hover {
  background: var(--hover-bg) !important;
  transform: translateY(-1px);
}

/* 已揭露格子的悬停效果 */
.mine-cell.revealed:hover {
  background: var(--revealed-hover-bg) !important;
}

/* 旗帜格子样式 */
.mine-cell.q-btn--warning {
  background: var(--flag-bg) !important;
  color: #333 !important;
  box-shadow: 0 2px 4px var(--cell-shadow);
}

/* 地雷格子样式 */
.mine-cell.q-btn--negative {
  background: var(--mine-bg) !important;
  color: #fff !important;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
}

/* 数字样式：保持文字粗体 */
.mine-cell.revealed span {
  font-weight: bold;
}

/* RWD 调整：小萤幕版 */
@media screen and (max-width: 450px) {
  /* 控制区域垂直排列 */
  .game-controls {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  /* 控制按钮、计数器与选单占满宽度 */
  .game-controls .q-btn,
  .game-controls .q-chip,
  .game-controls .q-select {
    width: 100%;
    justify-content: center;
  }

  /* 调整棋盘行高 */
  .board-row {
    height: 30px;
  }

  /* 调整格子尺寸与字体大小 */
  .mine-cell {
    width: 30px !important;
    height: 30px !important;
    min-height: 30px !important;
    font-size: 1.2em !important;
  }

  /* 格子内内容字体大小 */
  .mine-cell .q-btn__content {
    font-size: 0.8em;
  }

  /* 调整表情符号字体大小 */
  .mine-cell .q-btn__content span {
    font-size: 0.8em;
  }
}

</style>
