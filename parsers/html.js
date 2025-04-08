import { stringify } from '../stringify.js';
import { sanitizer as sanitizerConfig } from '@aegisjsproject/sanitizer/config/base.js';
import { getRegisteredComponentTags } from '../componentRegistry.js';
import { createHTMLParser, doc } from '@aegisjsproject/parsers/html.js';
import { isTrustPolicy } from '../trust.js';

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

export function createTrustedHTMLTemplate(policy) {
	if (isTrustPolicy(policy)) {
		return (...args) => policy.createHTML(String.raw.apply(null, args));
	} else {
		return String.raw;
	}
}

export function htmlUnsafe(strings, ...values) {
	const html = String.raw(strings, ...values.map(stringify));
	const frag = document.createDocumentFragment();
	const tmp = document.createElement('div');
	tmp.setHTMLUnsafe(html);
	frag.append(...tmp.childNodes);

	return frag;
}

export function docUnsafe(strings, ...values) {
	const html = String.raw(strings, ...values.map(stringify));
	return Document.parseHTMLUnsafe(html);
}

export function htmlToFile(html, filename = 'document.html', {
	elements = sanitizerConfig.elements,
	attributes = sanitizerConfig.attributes,
	comments = sanitizerConfig.comments,
	...rest
} = sanitizerConfig) {
	const doc = Document.parseHTML(html, { elements, attributes, comments, ...rest });

	return new File(
		[
			`<!DOCTYPE ${doc.doctype instanceof Node ? doc.doctype.name : 'html' }>`,
			doc.documentElement.outerHTML,
		],
		filename,
		{ type: doc.contentType }
	);
}

export { createHTMLParser, doc };
