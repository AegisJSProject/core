import { elements, attributes } from '@aegisjsproject/sanitizer/config/mathml.js';

export function math(strings, ...args) {
	return Document.parseHTML(
		String.raw(strings, ...args),
		{ sanitizer: { elements: elements.concat(['html', 'body', 'head']), attributes }}
	).body.firstElementChild;
}
