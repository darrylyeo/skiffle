// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'
import { demosBackUrl } from '$/routes/(examples)/demos'

// Functions
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { isTruthy } from '$/lib/isTruthy'
import { frameButtons } from '$/lib/frame'
import { snapGridSelection } from '$/lib/snap-grid'
import { SnapButtonVariants, SnapDirections, SnapEffects, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

// Data
import type { Actions, PageServerLoad } from './$types'

type TicTacToeStatus = 'turn' | 'invalid' | 'x-win' | 'o-win' | 'draw'

type TicTacToeState = {
	board: string
	status: TicTacToeStatus
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

const CORNER_CELLS = [0, 2, 6, 8] as const

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

const withMove = (
	board: string,
	index: number,
	mark: 'X' | 'O',
) => (
	`${board.slice(0, index)}${mark}${board.slice(index + 1)}`
)

const winningLine = (board: string) => (
	WIN_LINES.find(([a, b, c]) => (
		board[a] !== '-'
		&& board[a] === board[b]
		&& board[b] === board[c]
	))
)

const emptyCellInLine = (
	board: string,
	line: readonly [number, number, number],
) => (
	line.find((index) => board[index] === '-')
)

const criticalCellForMark = (
	board: string,
	mark: 'X' | 'O',
) => (
	WIN_LINES
		.map((line) => (
			line.filter((index) => board[index] === mark).length === 2
			&& line.filter((index) => board[index] === '-').length === 1 ?
				emptyCellInLine(board, line)
			:
				undefined
		))
		.find((index) => index !== undefined)
)

const nextBotCell = (board: string) => (
	criticalCellForMark(board, 'O')
		?? criticalCellForMark(board, 'X')
		?? (
			board[4] === '-'
				? 4
			: CORNER_CELLS.find((index) => board[index] === '-')
		)
		?? board.indexOf('-')
)

const canPlay = (status: TicTacToeStatus) => (
	status === 'turn' || status === 'invalid'
)

const isFreshBoard = (board: string) => (
	board === EMPTY_BOARD
)

const parseTicTacToeState = (url: URL): TicTacToeState => {
	const board = normalizeBoard(url.searchParams.get('board'))
	const terminal = boardTerminalStatus(board)

	return {
		board,
		status: terminal === 'turn'
			? statusFromQuery(url.searchParams.get('status'))
			: terminal,
	}
}

const ticTacToeMessage = (status: TicTacToeStatus) => (
	status === 'x-win'
		? 'I win.'
	: status === 'o-win'
		? 'Computer wins.'
	: status === 'draw'
		? "It's a draw."
	: status === 'invalid'
		? 'Your turn (X) — pick an empty square. CPU is O.'
	:
		'Your turn (X). CPU is O.'
)

const ticTacToeBoardRows = (board: string) => (
	[
		board.slice(0, 3),
		board.slice(3, 6),
		board.slice(6, 9),
	].map((row, rowIndex) => (
		row.split('').map((cell, cellIndex) => ({
			id: `${rowIndex}:${cellIndex}`,
			label: (
				cell === '-'
					? String(rowIndex * 3 + cellIndex + 1)
					: cell
			),
			occupied: cell !== '-',
			highlighted: (
				winningLine(board)
					?.some((index) => index === rowIndex * 3 + cellIndex)
				?? false
			),
		}))
	))
)

const buildTicTacToeFrame = ({ board, status }: TicTacToeState): FrameMeta => ({
	image: {
		url: `/demos/tic-tac-toe?board=${board}&status=${status}`,
		aspectRatio: '1:1',
	},
	textInput: canPlay(status) ? 'Move (1-9)' : undefined,
	buttons: frameButtons(
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: demosBackUrl('tic-tac-toe'),
		},
		canPlay(status) && {
			label: status === 'invalid' ? 'Try Again' : 'Play',
			action: 'post',
			targetUrl: `/demos/tic-tac-toe?/play&board=${board}`,
		},
		(!isFreshBoard(board) || !canPlay(status)) && {
			label: canPlay(status) ? 'Reset' : 'Play Again',
			action: 'post',
			targetUrl: '/demos/tic-tac-toe?/open',
		},
	),
})

const buildTicTacToeSnap = ({ board, status }: TicTacToeState): AppSnapPage => ({
	effects: status === 'x-win' ? [SnapEffects.Confetti] : undefined,
	castIntent: {
		text: `Playing Tic-tac-toe on the SKIFFLE demo snapsite. ${ticTacToeMessage(status)} ⭕`,
	},
	theme: {
		accent: (
			status === 'x-win' ?
				SnapPaletteColors.Blue
			: status === 'o-win' || status === 'invalid' ?
				SnapPaletteColors.Red
			: status === 'draw' ?
				SnapPaletteColors.Gray
			:
				SnapPaletteColors.Amber
		),
	},
	buttons: [
		snapButtonGroup({
			direction: SnapDirections.Horizontal,
			gap: SnapGaps.Sm,
			justify: SnapJustifyValues.Center,
			children: [
				snapTargetButton({
					label: '‹ Demos',
					role: AppSnapButtonRoles.Back,
					action: 'post',
					targetUrl: demosBackUrl('tic-tac-toe'),
				}),
				canPlay(status) && snapTargetButton({
					label: status === 'invalid' ? 'Try Again' : 'Play',
					role: AppSnapButtonRoles.Cta,
					variant: SnapButtonVariants.Primary,
					action: 'post',
					targetUrl: `/demos/tic-tac-toe?/play&board=${board}`,
				}),
			].filter(isTruthy),
		}),
		...(!isFreshBoard(board) || !canPlay(status)
			? [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: [
						snapTargetButton({
							label: canPlay(status) ? 'Reset' : 'Play Again',
							action: 'post',
							targetUrl: '/demos/tic-tac-toe?/open',
						}),
					],
				}),
			]
			: []),
	],
})

const nextTicTacToeState = (
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

const boardFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return normalizeBoard(new URL(href).searchParams.get('board'))
	} catch {
		return undefined
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const state = parseTicTacToeState(url)
	return {
		title: 'Tic-tac-toe',
		board: state.board,
		rows: ticTacToeBoardRows(state.board),
		status: state.status,
		message: ticTacToeMessage(state.status),
		frame: buildTicTacToeFrame(state),
		snap: buildTicTacToeSnap(state),
	}
}

const ticTacToeCellFromRaw = (raw: unknown): string => {
	const selection = snapGridSelection(raw)

	if (selection) {
		return String(selection.row * 3 + selection.col + 1)
	}

	if (typeof raw === 'number' && Number.isFinite(raw)) {
		const d = Math.trunc(raw)

		return d >= 1 && d <= 9 ? String(d) : ''
	}

	if (typeof raw === 'string') {
		const t = raw.trim()

		if (/^[1-9]$/.test(t)) {
			return t
		}
	}

	return ''
}

const actionInputText = async ({
	locals,
	request,
}: {
	locals: {
		snapJfsInputs?: Record<string, unknown>
		frameSignaturePacket?: { untrustedData?: { inputText?: string, ticTacToeCell?: unknown } }
	}
	request: Request,
}) => (
	ticTacToeCellFromRaw(
		locals.snapJfsInputs?.ticTacToeCell
		?? locals.frameSignaturePacket?.untrustedData?.ticTacToeCell
		?? locals.frameSignaturePacket?.untrustedData?.inputText,
	)
	|| await request
		.formData()
		.then((formData) => (
			ticTacToeCellFromRaw(
				formData.get('ticTacToeCell')
				?? formData.get('inputText'),
			)
		))
		.catch(() => '')
)

export const actions: Actions = {
	open: async () => ({
		frame: buildTicTacToeFrame({
			board: '---------',
			status: 'turn',
		}),
		snap: buildTicTacToeSnap({
			board: '---------',
			status: 'turn',
		}),
	}),
	play: async ({ locals, request, url }) => {
		const board = (
			boardFromHref(locals.frameSignaturePacket?.untrustedData.url)
			?? parseTicTacToeState(url).board
		)
		const state = nextTicTacToeState(board, await actionInputText({ locals, request }))
		return {
			frame: buildTicTacToeFrame(state),
			snap: buildTicTacToeSnap(state),
		}
	},
}
