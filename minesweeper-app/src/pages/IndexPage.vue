<script lang="ts" setup>
import { ref, computed } from 'vue'
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

const $q = useQuasar()
console.log($q)

// 遊戲配置
const config = ref<GameConfig>({
  rows: 10,
  cols: 10,
  mines: 10,
})

// 遊戲狀態
const board = ref<Cell[][]>([])
const gameOver = ref<boolean>(false)
const gameWon = ref<boolean>(false)
const flagCount = ref<number>(0)
const timer = ref<number>(0)
const timerInterval = ref<number | null>(null)

// 計算屬性
const minesLeft = computed(() => config.value.mines - flagCount.value)
const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60)
  const seconds = timer.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 檢查座標是否在邊界內
function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < config.value.rows && col >= 0 && col < config.value.cols
}

// 安全地取得格子
function getCell(board: Cell[][], row: number, col: number): Cell | null {
  if (!isInBounds(row, col)) return null
  return board[row]?.[col] ?? null
}

// 初始化遊戲板
function initBoard(): Cell[][] {
  const rows = config.value.rows
  const cols = config.value.cols
  const mines = config.value.mines

  // 創建空白遊戲板
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

  // 隨機放置地雷
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

  // 計算鄰近地雷數
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

// 計算鄰近地雷數
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

// 開啟格子
function revealCell(row: number, col: number): void {
  const cell = getCell(board.value, row, col)

  if (!cell || cell.isRevealed || cell.isFlagged) {
    return
  }

  cell.isRevealed = true

  // 如果是空格子，遞迴開啟周圍格子
  if (cell.neighborMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        revealCell(row + i, col + j)
      }
    }
  }
}

// 處理點擊事件
function handleClick(cell: Cell): void {
  if (gameOver.value || cell.isFlagged) return

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

// 切換旗幟
function toggleFlag(cell: Cell): void {
  if (gameOver.value || cell.isRevealed) return

  startTimer()

  cell.isFlagged = !cell.isFlagged
  flagCount.value += cell.isFlagged ? 1 : -1
}

// 顯示所有地雷
function revealAllMines(): void {
  board.value.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.isRevealed = true
      }
    })
  })
}

// 檢查是否獲勝
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

// 計時器功能
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

// 對話框
function showGameOverDialog(): void {
  $q.dialog({
    title: '遊戲結束',
    message: '很遺憾，你踩到地雷了！',
    ok: {
      label: '重新開始',
      flat: true,
      color: 'primary',
    },
  }).onOk(() => {
    newGame()
  })
}

function showWinDialog(): void {
  $q.dialog({
    title: '恭喜獲勝',
    message: `你用了 ${formattedTime.value} 完成遊戲！`,
    ok: {
      label: '重新開始',
      flat: true,
      color: 'primary',
    },
  }).onOk(() => {
    newGame()
  })
}

// 開始新遊戲
function newGame(): void {
  board.value = initBoard()
  gameOver.value = false
  gameWon.value = false
  flagCount.value = 0
  timer.value = 0
  stopTimer()
}

// 取得格子顏色
function getCellColor(cell: Cell): string {
  if (cell.isFlagged) return 'warning'
  if (!cell.isRevealed) return 'grey-3'
  if (cell.isMine) return 'negative'
  // 已揭露的格子不再使用 positive 顏色
  return 'revealed'
}

// 取得數字顏色
function getNumberColor(num: number): string {
  const colors = ['blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'grey']
  return colors[num - 1] || 'black'
}

// 初始化遊戲
newGame()
</script>

<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column items-center q-gutter-y-md">
      <!-- 遊戲資訊 -->
      <div class="game-controls">
        <q-btn color="primary" label="新遊戲" @click="newGame" />
        <q-chip icon="flag" color="warning" text-color="white"> 剩餘地雷: {{ minesLeft }} </q-chip>
        <q-chip icon="timer" color="primary" text-color="white"> 時間: {{ formattedTime }} </q-chip>
      </div>

      <!-- 遊戲版面 -->
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
.minesweeper-board {
  border: 3px solid #666;
  padding: 0;
  background: #666;
}

/* 遊戲控制區域樣式 */
.game-controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.board-container {
  display: flex;
  flex-direction: column;
}

.board-row {
  display: flex;
  height: 40px;
}

.mine-cell {
  width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  margin: 1px !important;
  font-weight: bold;
  font-size: 1.2em;
  border: 1px solid #999 !important;
}

/* 覆蓋 Quasar 的預設按鈕樣式 */
.mine-cell.q-btn {
  border-radius: 0 !important;
}

/* 已揭露格子的樣式 */
.mine-cell.revealed {
  background: #e8e8e8 !important;
  color: #000 !important;
}

/* 未揭露格子的懸停效果 */
.mine-cell.q-btn--grey-3:hover {
  background: #dcdcdc !important;
}

/* 已揭露格子的懸停效果 */
.mine-cell.revealed:hover {
  background: #e0e0e0 !important;
}

/* 旗幟格子樣式 */
.mine-cell.q-btn--warning {
  background: #ffd700 !important;
  color: #000 !important;
}

/* 地雷格子樣式 */
.mine-cell.q-btn--negative {
  background: #ff4444 !important;
  color: #fff !important;
}

/* 確保內容垂直置中 */
.mine-cell .q-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 數字顏色 */
.mine-cell.revealed span {
  font-weight: bold;
}

/* RWD 設定 */
@media screen and (max-width: 450px) {
  /* 控制按鈕改為垂直排列 */
  .game-controls {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  /* 讓按鈕和計數器占滿寬度 */
  .game-controls .q-btn,
  .game-controls .q-chip {
    width: 100%;
    justify-content: center;
  }

  /* 縮小格子尺寸 */
  .board-row {
    height: 30px;
  }

  .mine-cell {
    width: 30px !important;
    height: 30px !important;
    min-height: 30px !important;
    font-size: 0.8em !important;
  }

  /* 調整內容大小 */
  .mine-cell .q-btn__content {
    font-size: 0.8em;
  }

  /* 縮小表情符號大小 */
  .mine-cell .q-btn__content span {
    font-size: 0.8em;
  }
}
</style>
