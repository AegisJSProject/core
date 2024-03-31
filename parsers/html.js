import { stringify } from '../stringify.js';
import { sanitizer as sanitizerConfig } from '@aegisjsproject/sanitizer/config/base.js';
import { getRegisteredComponentTags } from '../componentRegistry.js';
import { createHTMLParser } from '@aegisjsproject/parsers/html.js';

const sanitizer = Object.freeze({
	...sanitizerConfig,
	get elements() {
		return [...sanitizerConfig.elements, ...getRegisteredComponentTags()];
	},
	get attributes() {
		return ['theme', ...sanitizerConfig.attributes];
	},
});

export const html = createHTMLParser(sanitizer, { mapper: stringify });

export function htmlToFile(html, filename = 'document.html', {
	elements = sanitizerConfig.elements,
	attributes = sanitizerConfig.attributes,
	comments = sanitizerConfig.comments,
	...rest
} = sanitizerConfig) {
	const doc = Document.parseHTML(html, {
		sanitizer: { elements, attributes, comments, ...rest },
	});

	return new File(
		[
			`<!DOCTYPE ${doc.doctype instanceof Node ? doc.doctype.name : 'html' }>`,
			doc.documentElement.outerHTML,
		],
		filename,
		{ type: doc.contentType }
	);
}

export { createHTMLParser };
