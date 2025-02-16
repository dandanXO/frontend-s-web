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

// 游戏配置
const config = ref<GameConfig>({
  rows: 10,
  cols: 10,
  mines: 10,
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
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 检查座标是否在边界内
function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < config.value.rows && col >= 0 && col < config.value.cols
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

// 处理点击事件
function handleClick(cell: Cell): void {
  if (gameOver.value) return

  startTimer()

  // 如果该格已翻开且有数字（不为 0），执行自动打开周边格子的功能
  if (cell.isRevealed && cell.neighborMines > 0) {
    let flagCount = 0
    const unopenedNeighbors: Cell[] = []

    // 遍历八个方向
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const neighbor = getCell(board.value, cell.row + i, cell.col + j)
        if (!neighbor) continue

        if (neighbor.isFlagged) {
          flagCount++
        }
        // 收集尚未翻开且未标记的邻近格子
        if (!neighbor.isRevealed && !neighbor.isFlagged) {
          unopenedNeighbors.push(neighbor)
        }
      }
    }

    // 如果已标记的数量正好等于该格显示的数字，
    // 就自动打开所有尚未翻开且未标记的邻近格子
    if (flagCount === cell.neighborMines) {
      for (const neighbor of unopenedNeighbors) {
        // 如果打开的其中一个邻近格子是炸弹，直接结束游戏
        if (neighbor.isMine) {
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
      checkWin()
    }
    return
  }

  // 如果该格尚未翻开
  if (!cell.isRevealed) {
    if (cell.isFlagged) return

    // 一般情况：点击未翻开的格子
    if (cell.isMine) {
      cell.isRevealed = true
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
  // 已揭露的格子不再使用 positive 颜色
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
        <q-chip icon="flag" color="warning" text-color="white"> 剩余地雷：{{ minesLeft }} </q-chip>
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
.minesweeper-board {
  border: 3px solid #666;
  padding: 0;
  background: #666;
}

/* 游戏控制区域样式 */
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

/* 覆盖 Quasar 的预设按钮样式 */
.mine-cell.q-btn {
  border-radius: 0 !important;
}

/* 已揭露格子的样式 */
.mine-cell.revealed {
  background: #e8e8e8 !important;
  color: #000 !important;
}

/* 未揭露格子的悬停效果 */
.mine-cell.q-btn--grey-3:hover {
  background: #dcdcdc !important;
}

/* 已揭露格子的悬停效果 */
.mine-cell.revealed:hover {
  background: #e0e0e0 !important;
}

/* 旗帜格子样式 */
.mine-cell.q-btn--warning {
  background: #ffd700 !important;
  color: #000 !important;
}

/* 地雷格子样式 */
.mine-cell.q-btn--negative {
  background: #ff4444 !important;
  color: #fff !important;
}

/* 确保内容垂直置中 */
.mine-cell .q-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 数字颜色 */
.mine-cell.revealed span {
  font-weight: bold;
}

/* RWD 设定 */
@media screen and (max-width: 450px) {
  /* 控制按钮改为垂直排列 */
  .game-controls {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  /* 让按钮和计数器占满宽度 */
  .game-controls .q-btn,
  .game-controls .q-chip {
    width: 100%;
    justify-content: center;
  }

  /* 缩小格子尺寸 */
  .board-row {
    height: 30px;
  }

  .mine-cell {
    width: 30px !important;
    height: 30px !important;
    min-height: 30px !important;
    font-size: 0.8em !important;
  }

  /* 调整内容大小 */
  .mine-cell .q-btn__content {
    font-size: 0.8em;
  }

  /* 缩小表情符号大小 */
  .mine-cell .q-btn__content span {
    font-size: 0.8em;
  }
}
</style>
