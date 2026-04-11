import type { JSXElement } from 'satori/jsx'
import { html as htmlToVNode } from 'satori-html'

export const styledHtmlDocumentForSatori = (
	styleText: string,
	fullPageHtml: string,
): JSXElement => (
	htmlToVNode(`<style>${styleText}</style>${fullPageHtml}`)
)
