import { defineStore } from 'pinia'
import { useGeneral } from '@/store'
import {
  BOARD_SIZE,
  MINE_COUNT,
  GAME_STATUS,
  ADJACENT_GRID_DELTA,
  TOAST_MSG,
} from '@/handler/constants'
import { shuffle, isCellValid, detectDevice, detectOS } from '@/handler/utils'
import Denque from 'denque'

type BoardItem = {
  isMine: boolean;
  isFlagged: boolean;
  isRevealed: boolean;
  count: number;
}

type CellItem = {
  row: number;
  col: number;
}

type GameType = {
  userDevice: string;
  userOS: string;
  board: BoardItem[][];
  startFirstStep: boolean;
  gameStatus: GAME_STATUS;
}

const state = (): GameType => ({
  userDevice: '',
  userOS: '',
  board: [],
  startFirstStep: false,
  gameStatus: GAME_STATUS.DEFAULT
})

export default defineStore('game', {
  state,
  actions: {
    checkDeviceInfo()
    {
      this.userDevice = detectDevice()
      this.userOS = detectOS()
    },
    initBoard()
    {
      const flatBoard: BoardItem[] = shuffle(
        Array.apply([], Array(BOARD_SIZE * BOARD_SIZE)).map((_, key) => ({
          isMine: key < MINE_COUNT,
          isFlagged: false,
          isRevealed: false,
          count: 0
        }))
      )

      for (let i = 0; i < BOARD_SIZE; i++) {
        this.board[i] = flatBoard.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE)
      }
    },
    handleReset()
    {
      this.startFirstStep = false
      this.updateGameStatus(GAME_STATUS.DEFAULT)
      this.initBoard()

      // clear toast when restart
      const generalStore = useGeneral()

      if (generalStore.currentToast) {
        generalStore.removeToast()
      }
    },
    handleStart()
    {
      if (this.gameStatus === GAME_STATUS.DEFAULT) {
        this.updateGameStatus(GAME_STATUS.PLAY)
      }
    },
    handleCellClick(row: number, col: number)
    {
      this.handleStart()

      if (this.gameStatus !== GAME_STATUS.PLAY) return

      const { isFlagged, isRevealed } = this.board[row][col]

      if (isFlagged || isRevealed) return

      this.checkFirstStep(row, col)

      // after checking first step, the position of the mine may change
      if (this.board[row][col].isMine) {
        this.updateGameStatus(GAME_STATUS.LOSE)
      } else {
        this.revealCell(row, col)
      }
    },
    // @param isExpand imply the current cell is from expandFromCell, need to force check adjacent cells
    revealCell(row: number, col: number, isExpand = false)
    {
      const queue = new Denque([{ row, col }])

      while (queue.length) {
        const item = queue.shift() as CellItem
        const isExpandStartCell = isExpand && item.row === row && item.col === col

        if (this.board[item.row][item.col].isRevealed && !isExpandStartCell) {
          continue
        }

        this.board[item.row][item.col].isRevealed = true

        const tempQueue: CellItem[] = [] // store unrevealed adjacent cells

        for (const [r, c] of ADJACENT_GRID_DELTA) {
          if (!isCellValid(item.row, item.col, r, c)) continue

          const { isMine, isFlagged, isRevealed } = this.board[item.row + r][item.col + c]

          if (!isExpandStartCell) {
            this.board[item.row][item.col].count += Number(isMine)
          }
          if (!isRevealed && !isFlagged && !isMine) {
            tempQueue.push({ row: item.row + r, col: item.col + c })
          }
        }

        if (!this.board[item.row][item.col].count || isExpandStartCell) {
          tempQueue.forEach((el) => queue.push(el))
        }
      }

      this.checkWinStatus()
    },
    checkFirstStep(row: number, col: number)
    {
      if (this.startFirstStep) return

      this.startFirstStep = true

      if (!this.board[row][col].isMine) return

      for (let i = 0; i < this.flatBoard.length; i++) {
        if (!this.flatBoard[i].isMine) {
          const targetRow = Math.floor(i / BOARD_SIZE)
          const targetCol = i % BOARD_SIZE
          this.board[row][col].isMine = false
          this.board[targetRow][targetCol].isMine = true
          break
        }
      }
    },
    handleCellFlag(row: number, col: number)
    {
      this.handleStart()

      if (this.gameStatus !== GAME_STATUS.PLAY) return
      if (this.board[row][col].isRevealed) return

      this.board[row][col].isFlagged = !this.board[row][col].isFlagged
      this.checkWinStatus()
    },
    checkWinStatus()
    {
      if (this.gameStatus !== GAME_STATUS.PLAY) return
      if (this.remainMines !== 0) return

      for (const el of this.flatBoard) {
        if (!el.isRevealed && !el.isFlagged) return // not fully opened
        if (el.isMine && !el.isFlagged) return // not fully flagged
      }

      this.updateGameStatus(GAME_STATUS.WIN)
    },
    expandFromCell(row: number, col: number)
    {
      if (this.gameStatus !== GAME_STATUS.PLAY) return

      const { isRevealed, count } = this.board[row][col]

      if (!isRevealed || !count) return

      // check flags around is eual to mine count
      let flagCount = 0
      let hasErrorFlag = false

      for (const [r, c] of ADJACENT_GRID_DELTA) {
        if (!isCellValid(row, col, r, c)) continue

        const { isFlagged, isMine } = this.board[row + r][col + c]

        flagCount += Number(isFlagged)

        if (isFlagged && !isMine) {
          hasErrorFlag = true
        }
      }

      if (flagCount !== count) return

      if (hasErrorFlag) {
        this.updateGameStatus(GAME_STATUS.LOSE)
        return
      }

      this.revealCell(row, col, true)
    },
    updateGameStatus(status: GAME_STATUS)
    {
      this.gameStatus = status

      const { addToast } = useGeneral()

      switch (status) {
        case GAME_STATUS.WIN:
          addToast(TOAST_MSG.WIN)
          break
        case GAME_STATUS.LOSE:
          addToast(TOAST_MSG.LOSE)
          break
      }
    }
  },
  getters: {
    flatBoard(state) {
      return state.board.flat()
    },
    remainMines(): number {
      return MINE_COUNT - this.flatBoard.filter((el) => el.isFlagged).length
    },
    isMobile(state) {
      return state.userDevice === 'mobile'
    },
    isIOS(state) {
      return state.userOS === 'iOS'
    }
  }
})
