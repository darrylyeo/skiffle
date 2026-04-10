const isRecord = (value: unknown): value is Record<string, unknown> => (
	typeof value === 'object'
	&& value !== null
)

const numberFromValue = (value: unknown) => (
	typeof value === 'number' && Number.isFinite(value) ?
		Math.trunc(value)
	: typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value.trim())) ?
		Math.trunc(Number(value.trim()))
	:
		undefined
)

export type SnapGridSelection = {
	row: number
	col: number
}

export const snapGridSelection = (value: unknown): SnapGridSelection | undefined => {
	if (typeof value === 'string') {
		const trimmed = value.trim()

		if (!trimmed) {
			return undefined
		}

		try {
			return snapGridSelection(JSON.parse(trimmed))
		} catch {
			return undefined
		}
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			const selection = snapGridSelection(item)

			if (selection) {
				return selection
			}
		}

		return undefined
	}

	if (!isRecord(value)) {
		return undefined
	}

	const row = numberFromValue(value.row)
	const col = numberFromValue(value.col)

	if (row !== undefined && col !== undefined) {
		return {
			row,
			col,
		}
	}

	return (
		snapGridSelection(value.value)
		?? snapGridSelection(value.selected)
		?? snapGridSelection(value.selection)
	)
}
