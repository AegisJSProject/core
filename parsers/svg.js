import { elements, attributes } from '@aegisjsproject/sanitizer/config/svg.js';

export function svg(strings, ...args) {
	return Document.parseHTML(
		String.raw(strings, ...args),
		{ sanitizer: { elements: elements.concat(['html', 'body', 'head']), attributes }}
	).body.firstElementChild;
}
