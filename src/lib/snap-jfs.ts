import type { FrameSignaturePacket } from '$/lib/frame'

export type SnapJfsPayload = {
	fid: number
	inputs: Record<string, unknown>
	timestamp?: number
	nonce?: string
	audience?: string
}

type SnapJfsEnvelope = {
	header: string
	payload: string
	signature: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
	typeof value === 'object'
	&& value !== null
)

const isSnapJfsPayload = (value: unknown): value is SnapJfsPayload => (
	isRecord(value)
	&& typeof value.fid === 'number'
	&& isRecord(value.inputs)
	&& (value.timestamp === undefined || typeof value.timestamp === 'number')
	&& (value.nonce === undefined || typeof value.nonce === 'string')
	&& (value.audience === undefined || typeof value.audience === 'string')
)

const isFrameSignaturePacketLike = (value: unknown): value is FrameSignaturePacket => (
	isRecord(value)
	&& isRecord(value.untrustedData)
	&& isRecord(value.trustedData)
)

const JFS_PARTS = 3

export const isLikelyJfsCompact = (text: string) => {
	const trimmed = text.trim()
	const parts = trimmed.split('.')
	return (
		parts.length === JFS_PARTS
		&& parts.every((p) => p.length > 0)
	)
}

const parseSnapJfsEnvelope = (
	text: string,
): SnapJfsEnvelope | undefined => {
	const trimmed = text.trim()

	if (isLikelyJfsCompact(trimmed)) {
		const [header, payload, signature] = trimmed.split('.')
		return {
			header,
			payload,
			signature,
		}
	}

	try {
		const value = JSON.parse(trimmed)
		if (
			isRecord(value)
			&& typeof value.header === 'string'
			&& typeof value.payload === 'string'
			&& typeof value.signature === 'string'
		) {
			return {
				header: value.header,
				payload: value.payload,
				signature: value.signature,
			}
		}
	} catch {
		/* not JSON */
	}

	return undefined
}

export const hasSnapJfsEnvelope = (text: string) => (
	parseSnapJfsEnvelope(text) !== undefined
)

export const parseFrameSignatureJson = (
	text: string,
): FrameSignaturePacket | undefined => {
	try {
		const value = JSON.parse(text)
		if (isFrameSignaturePacketLike(value)) {
			return value
		}
	} catch {
		/* not JSON */
	}

	return undefined
}

export const readSnapJfsPayload = async (
	jfsBody: string,
	_requestUrl: URL | string,
) => {
	const envelope = parseSnapJfsEnvelope(jfsBody)
	if (!envelope) {
		throw new Error('snap: invalid JFS body')
	}

	const payload = JSON.parse(
		Buffer
			.from(envelope.payload, 'base64url')
			.toString('utf8'),
	)

	if (!isSnapJfsPayload(payload)) {
		throw new Error('snap: invalid JFS payload')
	}

	return payload
}
