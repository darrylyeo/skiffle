// Types
import type { FrameMeta } from '$/lib/frame'

type TicTacToeStatus = 'turn' | 'invalid' | 'x-win' | 'o-win' | 'draw'

type TicTacToeState = {
	board: string,
	status: TicTacToeStatus,
}

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

const statusFromQuery = (value: string | null | undefined): TicTacToeStatus => (
	value === 'invalid' || value === 'x-win' || value === 'o-win' || value === 'draw'
		? value
	:
		'turn'
)

const nextBotCell = (board: string) => (
	board[4] === '-'
		? 4
		: board.indexOf('-')
)

const withMove = (
	board: string,
	index: number,
	mark: 'X' | 'O',
) => (
	`${board.slice(0, index)}${mark}${board.slice(index + 1)}`
)

export const parseTicTacToeState = (url: URL): TicTacToeState => {
	const board = normalizeBoard(url.searchParams.get('board'))
	const terminal = boardTerminalStatus(board)
	return {
		board,
		status: terminal === 'turn'
			? statusFromQuery(url.searchParams.get('status'))
			: terminal,
	}
}

export const ticTacToeMessage = (status: TicTacToeStatus) => (
	status === 'x-win'
		? 'You win.'
	: status === 'o-win'
		? 'Computer wins.'
	: status === 'draw'
		? 'Draw.'
	: status === 'invalid'
		? 'Pick an open cell from 1 to 9.'
	:
		'Enter your move (1-9).'
)

export const ticTacToeBoardRows = (board: string) => (
	[
		board.slice(0, 3),
		board.slice(3, 6),
		board.slice(6, 9),
	].map((row) => (
		row
			.split('')
			.map((cell) => cell === '-' ? '·' : cell)
	))
)

export const buildTicTacToeFrame = ({ board, status }: TicTacToeState): FrameMeta => ({
	image: {
		url: `/farcaster/demos/tic-tac-toe?board=${board}&status=${status}`,
		aspectRatio: '1.91:1',
	},
	textInput: 'Move (1-9)',
	buttons: [
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: '/?/demos',
		},
		{
			label: 'Play',
			action: 'post',
			targetUrl: `/farcaster/demos/tic-tac-toe?/play&board=${board}`,
		},
		{
			label: 'Reset',
			action: 'post',
			targetUrl: '/farcaster/demos/tic-tac-toe?/open',
		},
	],
})

export const nextTicTacToeState = (
	board: string,
	moveText: string | undefined,
): TicTacToeState => {
	if (boardTerminalStatus(board) !== 'turn') {
		return {
			board,
			status: boardTerminalStatus(board),
		}
	}

	const move = Number.parseInt(moveText ?? '', 10) - 1
	if (!Number.isInteger(move) || move < 0 || move > 8 || board[move] !== '-') {
		return {
			board,
			status: 'invalid',
		}
	}

	const playerBoard = withMove(board, move, 'X')
	const afterPlayer = boardTerminalStatus(playerBoard)
	if (afterPlayer !== 'turn') {
		return {
			board: playerBoard,
			status: afterPlayer,
		}
	}

	const botCell = nextBotCell(playerBoard)
	if (botCell < 0) {
		return {
			board: playerBoard,
			status: 'draw',
		}
	}

	const finalBoard = withMove(playerBoard, botCell, 'O')
	return {
		board: finalBoard,
		status: boardTerminalStatus(finalBoard),
	}
}

export const boardFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return normalizeBoard(new URL(href).searchParams.get('board'))
	} catch {
		return undefined
	}
}
