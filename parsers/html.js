import { stringify } from '../stringify.js';
import { sanitizer as sanitizerConfig } from '@aegisjsproject/sanitizer/config/base.js';
import { getRegisteredComponentTags } from '../componentRegistry.js';

export function sanitizeString(str, {
	elements = sanitizerConfig.elements,
	attributes = sanitizerConfig.attributes,
	comments = sanitizerConfig.comments,
	...rest
} = sanitizerConfig) {
	const el = document.createElement('div');
	const frag = document.createDocumentFragment();
	const registeredTags = getRegisteredComponentTags();

	el.setHTML(str, {
		sanitizer: {
			/* Allow all registered web components automatically */
			elements: [...elements, ...registeredTags],
			attributes: ['theme', ...attributes],
			comments, ...rest,
		}
	});

	frag.append(...el.children);

	return frag;
}

export function createHTMLParser({
	elements = sanitizerConfig.elements,
	attributes = sanitizerConfig.attributes,
	comments = sanitizerConfig.comments,
	...rest
} = sanitizerConfig) {
	return (strings, ...values) => sanitizeString(String.raw(strings, ...values.map(stringify)), {
		elements, attributes, comments, ...rest,
	});
}

export const html = createHTMLParser(sanitizerConfig);

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
