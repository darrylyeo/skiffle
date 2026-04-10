// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'
import {
	SnapAlignments,
	SnapElementTypes,
	SnapPaletteColors,
	SnapTextSizes,
} from '$/lib/snap-spec'

const EMPTY_BOARD = '---------'

const WIN_LINES = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
] as const

const normalizeBoard = (value: string | null | undefined) => (
	value && /^[XO-]{9}$/.test(value)
		? value
		: EMPTY_BOARD
)

const winnerForBoard = (board: string) => (
	WIN_LINES
		.map(([a, b, c]) => board[a] !== '-' && board[a] === board[b] && board[b] === board[c] ? board[a] : undefined)
		.find((winner) => winner !== undefined)
)

const boardTerminalStatus = (board: string) => (
	winnerForBoard(board) === 'X'
		? 'x-win'
	: winnerForBoard(board) === 'O'
		? 'o-win'
	: board.includes('-')
		? 'turn'
	:
		'draw'
)

const statusFromQuery = (value: string | null | undefined) => (
	value === 'invalid' || value === 'x-win' || value === 'o-win' || value === 'draw'
		? value
	:
		'turn'
)

const canPlay = (status: string) => (
	status === 'turn' || status === 'invalid'
)

const winningLine = (board: string) => (
	WIN_LINES.find(([a, b, c]) => (
		board[a] !== '-'
		&& board[a] === board[b]
		&& board[b] === board[c]
	))
)

const parseTicTacToeState = (url: URL) => {
	const board = normalizeBoard(url.searchParams.get('board'))
	const terminal = boardTerminalStatus(board)

	return {
		board,
		status: terminal === 'turn'
			? statusFromQuery(url.searchParams.get('status'))
			: terminal,
	}
}

export const ticTacToeSnapExtraElements = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)
		if (stateUrl.pathname !== '/demos/tic-tac-toe') {
			return undefined
		}

		const state = parseTicTacToeState(stateUrl)
		if (!canPlay(state.status)) {
			return undefined
		}

		const highlights = winningLine(state.board) ?? []

		return {
			hideInput: true,
			children: [
				'tic-tac-toe-picker-label',
				'tic-tac-toe-picker-grid',
			],
			elements: {
				'tic-tac-toe-picker-label': {
					type: SnapElementTypes.Text,
					props: {
						content: 'Pick a square',
						size: SnapTextSizes.Sm,
						align: SnapAlignments.Center,
					},
				},
				'tic-tac-toe-picker-grid': {
					type: SnapElementTypes.CellGrid,
					props: {
						name: 'ticTacToeCell',
						cols: 3,
						rows: 3,
						rowHeight: 54,
						select: 'single',
						gap: 'sm',
						cells: Array.from({ length: 9 }, (_, index) => ({
							row: Math.floor(index / 3),
							col: index % 3,
							content: state.board[index] === '-' ? String(index + 1) : state.board[index],
							color: (
								highlights.includes(index) ?
									SnapPaletteColors.Green
								: state.board[index] === 'X' ?
									SnapPaletteColors.Purple
								: state.board[index] === 'O' ?
									SnapPaletteColors.Red
								:
									SnapPaletteColors.Gray
							),
						})),
					},
				},
			},
		} satisfies SnapExtraElements
	} catch {
		return undefined
	}
}
