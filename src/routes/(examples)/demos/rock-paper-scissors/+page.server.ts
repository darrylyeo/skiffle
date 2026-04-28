// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'
import { demosBackUrl } from '$/routes/(examples)/demos'

// Functions
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { frameButtons } from '$/lib/frame'
import { SnapButtonVariants, SnapDirections, SnapEffects, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

// Data
import type { Actions, PageServerLoad } from './$types'

type RpsPick = 'rock' | 'paper' | 'scissors'
type RpsOutcome = 'win' | 'loss' | 'draw'

type RockPaperScissorsState = {
	rounds: number
	wins: number
	losses: number
	draws: number
	lastPlayer?: RpsPick
	lastCpu?: RpsPick
	outcome?: RpsOutcome
}

const PICKS = ['rock', 'paper', 'scissors'] as const satisfies readonly RpsPick[]

const EMPTY_STATE = {
	rounds: 0,
	wins: 0,
	losses: 0,
	draws: 0,
} as const

const clamp = (value: number) => (
	Math.max(0, Math.min(9_999, Number.isFinite(value) ? Math.floor(value) : 0))
)

const parsePick = (value: string | null | undefined): RpsPick | undefined => (
	PICKS.find((pick) => pick === value)
)

const parseOutcome = (value: string | null | undefined): RpsOutcome | undefined => (
	value === 'win' || value === 'loss' || value === 'draw'
		? value
		: undefined
)

const cpuPickForRound = (
	round: number,
	fid: number,
): RpsPick => (
	PICKS[(round * 17 + fid * 31) % PICKS.length]
)

const outcomeForRound = (
	player: RpsPick,
	cpu: RpsPick,
): RpsOutcome => (
	player === cpu
		? 'draw'
	: (
		(player === 'rock' && cpu === 'scissors')
		|| (player === 'paper' && cpu === 'rock')
		|| (player === 'scissors' && cpu === 'paper')
	)
		? 'win'
		: 'loss'
)

const pickLabel = (pick: RpsPick | undefined) => (
	pick
		? `${pick[0].toUpperCase()}${pick.slice(1)}`
		: 'None'
)

const pickButtonLabel = (pick: RpsPick) => (
	pick === 'rock' ?
		'✊ Rock'
	: pick === 'paper' ?
		'✋ Paper'
	:
		'✌️ Scissors'
)

const showdownLabel = (
	player: RpsPick,
	cpu: RpsPick,
) => (
	player === cpu
		? `${pickLabel(player)} meets ${pickLabel(cpu)}`
	: player === 'rock' && cpu === 'scissors'
		? 'Rock crushes Scissors'
	: player === 'paper' && cpu === 'rock'
		? 'Paper covers Rock'
	: player === 'scissors' && cpu === 'paper'
		? 'Scissors cut Paper'
	: cpu === 'rock' && player === 'scissors'
		? 'Rock crushes Scissors'
	: cpu === 'paper' && player === 'rock'
		? 'Paper covers Rock'
	:
		'Scissors cut Paper'
)

const parseRockPaperScissorsState = (url: URL): RockPaperScissorsState => ({
	rounds: clamp(Number(url.searchParams.get('rounds') ?? 0)),
	wins: clamp(Number(url.searchParams.get('wins') ?? 0)),
	losses: clamp(Number(url.searchParams.get('losses') ?? 0)),
	draws: clamp(Number(url.searchParams.get('draws') ?? 0)),
	lastPlayer: parsePick(url.searchParams.get('lastPlayer')),
	lastCpu: parsePick(url.searchParams.get('lastCpu')),
	outcome: parseOutcome(url.searchParams.get('outcome')),
})

const buildRockPaperScissorsFrame = ({
	rounds,
	wins,
	losses,
	draws,
	lastPlayer,
	lastCpu,
	outcome,
}: RockPaperScissorsState): FrameMeta => ({
	image: {
		url: `/demos/rock-paper-scissors?${new URLSearchParams({
			rounds: String(rounds),
			wins: String(wins),
			losses: String(losses),
			draws: String(draws),
			...(lastPlayer ? { lastPlayer } : {}),
			...(lastCpu ? { lastCpu } : {}),
			...(outcome ? { outcome } : {}),
		})}`,
		aspectRatio: '1:1',
	},
	buttons: frameButtons(
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: demosBackUrl('rock-paper-scissors'),
		},
		{
			label: pickButtonLabel('rock'),
			action: 'post',
			targetUrl: `/demos/rock-paper-scissors?/play&pick=rock&rounds=${rounds}&wins=${wins}&losses=${losses}&draws=${draws}`,
		},
		{
			label: pickButtonLabel('paper'),
			action: 'post',
			targetUrl: `/demos/rock-paper-scissors?/play&pick=paper&rounds=${rounds}&wins=${wins}&losses=${losses}&draws=${draws}`,
		},
		{
			label: pickButtonLabel('scissors'),
			action: 'post',
			targetUrl: `/demos/rock-paper-scissors?/play&pick=scissors&rounds=${rounds}&wins=${wins}&losses=${losses}&draws=${draws}`,
		},
	),
})

const buildRockPaperScissorsSnap = ({
	rounds,
	wins,
	losses,
	draws,
	lastPlayer,
	lastCpu,
	outcome,
}: RockPaperScissorsState): AppSnapPage => ({
	effects: outcome === 'win' ? [SnapEffects.Confetti] : undefined,
	castIntent: {
		text: `Playing Rock Paper Scissors on the SKIFFLE demo snapsite. ${rockPaperScissorsSummary({ rounds, wins, losses, draws, lastPlayer, lastCpu, outcome })} ✂️`,
	},
	theme: {
		accent: (
			outcome === 'win' ?
				SnapPaletteColors.Green
			: outcome === 'loss' ?
				SnapPaletteColors.Red
			: outcome === 'draw' ?
				SnapPaletteColors.Blue
			:
				SnapPaletteColors.Purple
		),
	},
	buttons: [
		snapButtonGroup({
			direction: SnapDirections.Horizontal,
			gap: SnapGaps.Sm,
			justify: SnapJustifyValues.Center,
			children: [
				snapTargetButton({
					label: pickButtonLabel('rock'),
					role: AppSnapButtonRoles.Cta,
					variant: SnapButtonVariants.Primary,
					action: 'post',
					targetUrl: `/demos/rock-paper-scissors?/play&pick=rock&rounds=${rounds}&wins=${wins}&losses=${losses}&draws=${draws}`,
				}),
				snapTargetButton({
					label: pickButtonLabel('paper'),
					role: AppSnapButtonRoles.Cta,
					variant: SnapButtonVariants.Primary,
					action: 'post',
					targetUrl: `/demos/rock-paper-scissors?/play&pick=paper&rounds=${rounds}&wins=${wins}&losses=${losses}&draws=${draws}`,
				}),
				snapTargetButton({
					label: pickButtonLabel('scissors'),
					role: AppSnapButtonRoles.Cta,
					variant: SnapButtonVariants.Primary,
					action: 'post',
					targetUrl: `/demos/rock-paper-scissors?/play&pick=scissors&rounds=${rounds}&wins=${wins}&losses=${losses}&draws=${draws}`,
				}),
			],
		}),
		snapButtonGroup({
			direction: SnapDirections.Horizontal,
			gap: SnapGaps.Sm,
			justify: SnapJustifyValues.Center,
			children: [
				snapTargetButton({
					label: '‹ Demos',
					role: AppSnapButtonRoles.Back,
					action: 'post',
					targetUrl: demosBackUrl('rock-paper-scissors'),
				}),
				snapTargetButton({
					label: 'Reset',
					action: 'post',
					targetUrl: '/demos/rock-paper-scissors',
				}),
			],
		}),
	],
})

const rockPaperScissorsSummary = ({
	rounds,
	lastPlayer,
	lastCpu,
	outcome,
}: RockPaperScissorsState) => (
	lastPlayer && lastCpu && outcome
		? `${outcome === 'win' ? 'Win' : outcome === 'loss' ? 'Loss' : 'Draw'}: ${showdownLabel(lastPlayer, lastCpu)}`
	: rounds > 0
		? 'Pick rock, paper, or scissors.'
	:
		'Pick rock, paper, or scissors to start.'
)

const nextRockPaperScissorsState = (
	state: RockPaperScissorsState,
	pick: RpsPick | undefined,
	fid: number,
): RockPaperScissorsState => {
	if (!pick) {
		return state
	}

	const rounds = clamp(state.rounds + 1)
	const lastCpu = cpuPickForRound(rounds, fid)
	const outcome = outcomeForRound(pick, lastCpu)

	return {
		rounds,
		wins: clamp(state.wins + (outcome === 'win' ? 1 : 0)),
		losses: clamp(state.losses + (outcome === 'loss' ? 1 : 0)),
		draws: clamp(state.draws + (outcome === 'draw' ? 1 : 0)),
		lastPlayer: pick,
		lastCpu,
		outcome,
	}
}

const rockPaperScissorsStateFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return parseRockPaperScissorsState(new URL(href))
	} catch {
		return undefined
	}
}

const parseRpsPick = (value: string | null | undefined) => (
	parsePick(value)
)

export const load: PageServerLoad = async ({ url }) => {
	const state = parseRockPaperScissorsState(url)
	return {
		title: 'Rock Paper Scissors',
		...state,
		summary: rockPaperScissorsSummary(state),
		frame: buildRockPaperScissorsFrame(state),
		snap: buildRockPaperScissorsSnap(state),
	}
}

export const actions: Actions = {
	default: async () => ({
		frame: buildRockPaperScissorsFrame(EMPTY_STATE),
		snap: buildRockPaperScissorsSnap(EMPTY_STATE),
	}),
	play: async ({ locals, url }) => {
		const state = (
			rockPaperScissorsStateFromHref(locals.frameSignaturePacket?.untrustedData.url)
			?? parseRockPaperScissorsState(url)
		)

		const nextState = nextRockPaperScissorsState(
			state,
			parseRpsPick(url.searchParams.get('pick')),
			locals.farcasterViewerFid ?? 0,
		)

		return {
			frame: buildRockPaperScissorsFrame(nextState),
			snap: buildRockPaperScissorsSnap(nextState),
		}
	},
}
