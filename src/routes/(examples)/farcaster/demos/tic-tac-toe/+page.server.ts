// Functions
import {
	boardFromHref,
	buildTicTacToeFrame,
	nextTicTacToeState,
	parseTicTacToeState,
	ticTacToeBoardRows,
	ticTacToeMessage,
} from './tic-tac-toe-frame'

// Data
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const state = parseTicTacToeState(url)
	return {
		board: state.board,
		rows: ticTacToeBoardRows(state.board),
		status: state.status,
		message: ticTacToeMessage(state.status),
		frame: buildTicTacToeFrame(state),
	}
}

const actionInputText = async ({
	locals,
	request,
}: {
	locals: { frameSignaturePacket?: { untrustedData?: { inputText?: string } } },
	request: Request,
}) => (
	locals.frameSignaturePacket?.untrustedData.inputText
		?? await (
			request
				.formData()
				.then((formData) => (
					`${formData.get('inputText') ?? ''}`.trim()
				))
				.catch(() => '')
		)
)

export const actions: Actions = {
	open: async () => ({
		frame: buildTicTacToeFrame({
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
		}
	},
}
