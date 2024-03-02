import { stringify } from '../stringify.js';
import * as sanitizerConfig from '../sanitizerConfig.js';

export function sanitizeString(str, {
	allowElements = sanitizerConfig.allowElements,
	allowAttributes = sanitizerConfig.allowAttributes,
	allowCustomElements = sanitizerConfig.allowCustomElements,
	allowUnknownMarkup = sanitizerConfig.allowUnknownMarkup,
	allowComments = sanitizerConfig.allowComments,
} = sanitizerConfig) {
	const el = document.createElement('div');
	const frag = document.createDocumentFragment();

	el.setHTML(str, {
		allowElements, allowAttributes, allowCustomElements,
		allowUnknownMarkup, allowComments,
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
