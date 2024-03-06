import { stringify } from '../stringify.js';
import * as sanitizerConfig from '../sanitizerConfig.js';
import { getRegisteredComponentTags } from '../componentRegistry.js';

export function sanitizeString(str, {
	allowElements = sanitizerConfig.allowElements,
	allowAttributes = sanitizerConfig.allowAttributes,
	allowCustomElements = sanitizerConfig.allowCustomElements,
	allowUnknownMarkup = sanitizerConfig.allowUnknownMarkup,
	allowComments = sanitizerConfig.allowComments,
} = sanitizerConfig) {
	const el = document.createElement('div');
	const frag = document.createDocumentFragment();
	const registeredTags = getRegisteredComponentTags();

	el.setHTML(str, {
		/* Allow all registered web components automatically */
		allowElements: [...allowElements, ...registeredTags],
		allowAttributes: { theme: registeredTags, ...allowAttributes },
		allowCustomElements, allowUnknownMarkup, allowComments,
	});

	frag.append(...el.children);

	return frag;
}

export function createHTMLParser({
	allowElements = sanitizerConfig.allowElements,
	allowAttributes = sanitizerConfig.allowAttributes,
	allowCustomElements = sanitizerConfig.allowCustomElements,
	allowUnknownMarkup = sanitizerConfig.allowUnknownMarkup,
	allowComments = sanitizerConfig.allowComments,
	...rest
} = sanitizerConfig) {
	return (strings, ...values) => sanitizeString(String.raw(strings, ...values.map(stringify)), {
		allowElements, allowAttributes, allowCustomElements,
		allowUnknownMarkup, allowComments, ...rest,
	});
}

export const html = createHTMLParser(sanitizerConfig);

export function htmlToFile(html, filename = 'document.html', {
	allowElements = sanitizerConfig.allowElements,
	allowAttributes = sanitizerConfig.allowAttributes,
	allowCustomElements = sanitizerConfig.allowCustomElements,
	allowUnknownMarkup = sanitizerConfig.allowUnknownMarkup,
	allowComments = sanitizerConfig.allowComments,
	...rest
} = sanitizerConfig) {
	const doc = Document.parseHTML(html, {
		allowElements, allowAttributes, allowCustomElements,
		allowUnknownMarkup, allowComments, ...rest,
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
