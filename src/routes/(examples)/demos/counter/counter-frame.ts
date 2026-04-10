// Types
import type { FrameMeta } from '$/lib/frame'

export const clampCount = (n: number) => (
	Math.max(0, Math.min(9_999, Number.isFinite(n) ? Math.floor(n) : 0))
)

export const counterFrameMeta = (count: number): FrameMeta => {
	const c = clampCount(count)
	return {
		image: {
			url: `/demos/counter?count=${c}`,
			aspectRatio: '1.91:1',
		},
		buttons: [
			{
				label: '‹ Demos',
				action: 'post',
				targetUrl: '/?/demos',
			},
			{
				label: '+1',
				action: 'post',
				targetUrl: `/demos/counter?/bump&count=${c}&delta=1`,
			},
			{
				label: '+10',
				action: 'post',
				targetUrl: `/demos/counter?/bump&count=${c}&delta=10`,
			},
			{
				label: 'Reset',
				action: 'post',
				targetUrl: '/demos/counter?/set&to=0',
			},
		],
	}
}
