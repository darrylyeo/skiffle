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

const selectionFromRowColString = (part: string): SnapGridSelection | undefined => {
	const m = /^(\d+)\s*,\s*(\d+)$/.exec(part.trim())

	if (!m) {
		return undefined
	}

	const row = Math.trunc(Number(m[1]))
	const col = Math.trunc(Number(m[2]))

	return (
		Number.isFinite(row) && Number.isFinite(col)
			? { row, col }
		:
			undefined
	)
}

/**
 * Parse Farcaster `cell_grid` values: `inputs[name]` is `"row,col"` (0-based), or several
 * `"r,c;r2,c2"` for `select: "multiple"` (first pair wins for single-move handlers).
 */
export const snapGridSelection = (value: unknown): SnapGridSelection | undefined => {
	if (typeof value === 'string') {
		const trimmed = value.trim()

		if (!trimmed) {
			return undefined
		}

		if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
			const segments = (
				trimmed.includes(';')
					? trimmed.split(';').map((p) => p.trim()).filter(Boolean)
				:
					[trimmed]
			)

			for (const part of segments) {
				const fromComma = selectionFromRowColString(part)

				if (fromComma) {
					return fromComma
				}
			}
		}

		try {
			return snapGridSelection(JSON.parse(trimmed))
		} catch {
			return undefined
		}
	}

	if (Array.isArray(value)) {
		if (value.length === 2) {
			const row = numberFromValue(value[0])
			const col = numberFromValue(value[1])

			if (row !== undefined && col !== undefined) {
				return {
					row,
					col,
				}
			}
		}

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

	const row = (
		numberFromValue(value.row)
		?? numberFromValue('r' in value ? value.r : undefined)
	)
	const col = (
		numberFromValue(value.col)
		?? numberFromValue('column' in value ? value.column : undefined)
		?? numberFromValue('c' in value ? value.c : undefined)
	)

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
