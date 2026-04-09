/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import type { JSXElement } from 'satori/jsx'
import { html as htmlToVNode } from 'satori-html'


/**
 * Merges fetched CSS with the SSR HTML document using Satori's built-in JSX runtime
 * (see `satori/jsx`, Satori 0.26+). Avoids embedding `<style>` via string concatenation.
 */
export const styledHtmlDocumentForSatori = (
	styleText: string,
	fullPageHtml: string,
): JSXElement => (
	<>
		<style>{styleText}</style>
		{htmlToVNode(fullPageHtml)}
	</>
)
