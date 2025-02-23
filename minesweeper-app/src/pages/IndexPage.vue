<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column items-center q-gutter-y-md">
      <!-- 游戏资讯 -->
      <div class="game-controls">
        <q-btn color="primary" label="新游戏" @click="newGame" />
        <!-- 难度下拉选单 -->
        <q-select
          v-model="selectedDifficulty"
          :options="difficultyOptions"
          label="难度"
          dense
          outlined
          style="min-width: 120px;"
        />
        <!-- 当选择自定义时，显示自定义配置输入框 -->
        <div v-if="selectedDifficulty.value === 'custom'" class="custom-config q-gutter-sm">
          <q-input
            v-model.number="customRows"
            label="行数"
            type="number"
            dense
            outlined
            style="width: 80px;"
          />
          <q-input
            v-model.number="customCols"
            label="列数"
            type="number"
            dense
            outlined
            style="width: 80px;"
          />
          <q-input
            v-model.number="customMines"
            label="地雷数量"
            type="number"
            dense
            outlined
            style="width: 80px;"
          />
        </div>
        <q-chip icon="flag" color="red" text-color="white">
          剩余地雷：{{ minesLeft }}
        </q-chip>
        <q-chip icon="timer" color="primary" text-color="white">
          时间：{{ formattedTime }}
        </q-chip>
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

// 定义难度选项，包括自定义
const difficulties: DifficultyOption[] = [
  { label: '低', value: 'low', rows: 9, cols: 9, mines: 10 },
  { label: '中', value: 'medium', rows: 14, cols: 12, mines: 20 },
  { label: '高', value: 'high', rows: 16, cols: 12, mines: 40 },
  { label: '自定义', value: 'custom', rows: 10, cols: 10, mines: 10 },
]

// 难度选单 v-model（默认低难度）
const selectedDifficulty = ref({ label: '低', value: 'low', rows: 9, cols: 9, mines: 10 })
const difficultyOptions = computed(() =>
  difficulties.map((d) => ({ label: d.label, value: d.value }))
)

// 自定义配置参数（初始值与自定义选项一致）
const customRows = ref<number>(10)
const customCols = ref<number>(10)
const customMines = ref<number>(10)

// 游戏配置（初始采用低难度）
const config = ref<GameConfig>({
  rows: 9,
  cols: 9,
  mines: 10,
})

// 当难度选择改变时更新游戏配置并新开一局
watch(selectedDifficulty, (newValue) => {
  const diff = difficulties.find((d) => d.value === newValue.value)
  if (diff) {
    if (diff.value === 'custom') {
      config.value = { rows: customRows.value, cols: customCols.value, mines: customMines.value }
    } else {
      config.value = { rows: diff.rows, cols: diff.cols, mines: diff.mines }
    }
    newGame()
  }
})

// 当自定义配置变化时更新 config（仅在自定义难度下有效）
watch([customRows, customCols, customMines], ([newRows, newCols, newMines]) => {
  if (selectedDifficulty.value.value === 'custom') {
    config.value = { rows: newRows, cols: newCols, mines: newMines }
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

// 新增：标识是否为第一次点击
const isFirstClick = ref<boolean>(true)

// 计算属性：剩余地雷数和格式化时间
const minesLeft = computed(() => config.value.mines - flagCount.value)
const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60)
  const seconds = timer.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 检查坐标是否在边界内
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

  // 创建空白棋盘
  const newBoard: Cell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
      row,
      col,
    }))
  )

  // 随机布雷
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

  // 计算每个格子的邻近地雷数
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
      if (cell?.isMine) count++
    }
  }
  return count
}

// 新增：获取安全区内的格子（点击的格子及其周围 8 个格子）
function getSafeZoneCells(row: number, col: number): Cell[] {
  const cells: Cell[] = []
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      const cell = getCell(board.value, i, j)
      if (cell) cells.push(cell)
    }
  }
  return cells
}

// 新增：重新计算所有格子的邻近地雷数
function recalcNeighborMines(): void {
  for (let r = 0; r < config.value.rows; r++) {
    for (let c = 0; c < config.value.cols; c++) {
      const cell = getCell(board.value, r, c)
      if (cell && !cell.isMine) {
        cell.neighborMines = countNeighborMines(board.value, r, c)
      }
    }
  }
}

// 新增：确保第一次点击安全区无地雷，并将移除的地雷重新放置
function ensureSafeZone(safeRow: number, safeCol: number): void {
  const safeCells = getSafeZoneCells(safeRow, safeCol)
  const safePositions = new Set(safeCells.map(cell => `${cell.row},${cell.col}`))
  let minesRemoved = 0

  // 移除安全区内的地雷，并统计移除数量
  safeCells.forEach(cell => {
    if (cell.isMine) {
      cell.isMine = false
      minesRemoved++
    }
  })

  // 将移除的地雷随机放到非安全区内未有地雷的位置
  for (let i = 0; i < minesRemoved; i++) {
    let placed = false
    while (!placed) {
      const row = Math.floor(Math.random() * config.value.rows)
      const col = Math.floor(Math.random() * config.value.cols)
      const key = `${row},${col}`
      if (!safePositions.has(key)) {
        const cell = getCell(board.value, row, col)
        if (cell && !cell.isMine) {
          cell.isMine = true
          placed = true
        }
      }
    }
  }

  // 重新计算所有格子的邻近地雷数
  recalcNeighborMines()
}

// 开启格子（若为空则递归展开周围格子）
function revealCell(row: number, col: number): void {
  const cell = getCell(board.value, row, col)
  if (!cell || cell.isRevealed || cell.isFlagged) return
  cell.isRevealed = true
  if (cell.neighborMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        revealCell(row + i, col + j)
      }
    }
  }
}

// 当点击已揭示数字格子时，尝试自动展开周围未揭示格子
function revealAdjacentCells(cell: Cell): void {
  let flaggedCount = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue
      const neighbor = getCell(board.value, cell.row + i, cell.col + j)
      if (neighbor && neighbor.isFlagged) flaggedCount++
    }
  }
  if (flaggedCount === cell.neighborMines) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const neighbor = getCell(board.value, cell.row + i, cell.col + j)
        if (neighbor && !neighbor.isRevealed && !neighbor.isFlagged) {
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
      }
    }
    checkWin()
  }
}

// 处理点击事件
function handleClick(cell: Cell): void {
  if (gameOver.value || cell.isFlagged) return

  // 第一次点击时确保安全区无地雷
  if (isFirstClick.value) {
    ensureSafeZone(cell.row, cell.col)
    isFirstClick.value = false
  }

  // 如果已揭示，则尝试展开周围格子
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
      if (cell.isMine) cell.isRevealed = true
    })
  })
}

// 检查是否获胜
function checkWin(): void {
  const allNonMinesRevealed = board.value.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed)
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
  isFirstClick.value = true
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

<style scoped>
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

.minesweeper-board {
  border: 3px solid var(--border-color);
  padding: 4px;
  background: var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px var(--cell-shadow);
}

.game-controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.custom-config {
  display: flex;
  gap: 0.5rem;
}

.board-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
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
  border: 1px solid var(--cell-border) !important;
  background: var(--background-color);
  color: #333;
  border-radius: 4px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}

.mine-cell.q-btn {
  border-radius: 4px !important;
}

.mine-cell .q-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.mine-cell.revealed {
  background: var(--cell-bg) !important;
  color: #000 !important;
  box-shadow: inset 0 0 5px var(--cell-shadow);
}

.mine-cell:not(.revealed):hover {
  background: var(--hover-bg) !important;
  transform: translateY(-1px);
}

.mine-cell.revealed:hover {
  background: var(--revealed-hover-bg) !important;
}

.mine-cell.q-btn--warning {
  background: var(--flag-bg) !important;
  color: #333 !important;
  box-shadow: 0 2px 4px var(--cell-shadow);
}

.mine-cell.q-btn--negative {
  background: var(--mine-bg) !important;
  color: #fff !important;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
}

.mine-cell.revealed span {
  font-weight: bold;
}

@media screen and (max-width: 450px) {
  .game-controls {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
  .game-controls .q-btn,
  .game-controls .q-chip,
  .game-controls .q-select {
    width: 100%;
    justify-content: center;
  }
  .board-row {
    height: 30px;
  }
  .mine-cell {
    width: 30px !important;
    height: 30px !important;
    min-height: 30px !important;
    font-size: 1.2em !important;
  }
  .mine-cell .q-btn__content {
    font-size: 0.8em;
  }
  .mine-cell .q-btn__content span {
    font-size: 0.8em;
  }
}
</style>
