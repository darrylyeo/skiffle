import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import {
	SnapButtonVariants,
	SnapDirections,
	SnapGaps,
	SnapIcons,
	SnapJustifyValues,
} from '$/lib/snap-spec'
import type { PageLoad } from './$types'

const githubBranchUrl = 'https://github.com/darrylyeo/skiffle/tree/snap'

export const load: PageLoad = async () => {
	return {
		title: 'SKIFFLE – a website in a snap 🫰',
		snap: {
			castIntent: {
				text: 'Check out SKIFFLE, a framework for embedding a server-rendered website in a Farcaster snap 🫰\n\nby @darrylyeo',
			},
			buttons: [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: [
						snapTargetButton({
							label: 'About',
							role: AppSnapButtonRoles.Cta,
							icon: SnapIcons.Info,
							action: 'post',
							targetUrl: '/about',
						}),
						snapTargetButton({
							label: 'Demos...',
							role: AppSnapButtonRoles.Pager,
							variant: SnapButtonVariants.Primary,
							icon: SnapIcons.Play,
							action: 'post',
							targetUrl: '?/demos',
						}),
						snapTargetButton({
							label: 'GitHub',
							role: AppSnapButtonRoles.External,
							icon: SnapIcons.Star,
							action: 'link',
							targetUrl: githubBranchUrl,
						}),
					],
				}),
			],
		},
		frame: {
			buttons: [
				{
					label: 'ℹ️ About',
					action: 'post',
					targetUrl: '/about',
				},
				{
					label: '▶️ Demos...',
					action: 'post',
					targetUrl: '?/demos',
				},
				{
					label: 'Follow',
					action: 'link',
					targetUrl: 'https://farcaster.xyz/darrylyeo',
				},
				{
					label: 'GitHub',
					action: 'link',
					targetUrl: githubBranchUrl,
				},
			]
		}
	}
}
