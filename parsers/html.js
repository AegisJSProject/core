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

export const el = (...args) => html.apply(null, args)?.firstElementChild;

export function createShadowParser({
	tagName = 'div',
	mode = 'open',
	clonable = true,
	serializable = true,
	delegatesFocus = false,
	slotAssignment = 'named',
	sanitizer: sanitizerConfig = sanitizer,
	exportParts,
} = {}) {
	const parser = createHTMLParser(sanitizerConfig, { mapper: stringify });

	if (Array.isArray(exportParts)) {
		exportParts = exportParts.join(', ');
	} else if (typeof exportParts === 'object') {
		exportParts =  Object.entries(exportParts).map(([k, v]) => `${k}: ${v}`).join(', ');
	}

	return (...args) => {
		const host = document.createElement(tagName);
		const shadowRoot = host.attachShadow({ mode, clonable, serializable, delegatesFocus, slotAssignment });

		shadowRoot.append(parser.apply(parser, args));

		if (typeof exportParts === 'string') {
			host.setAttribute('exportparts', exportParts);
		}

		return host;
	};
}

export const shadow = createShadowParser();

export function createTrustedHTMLTemplate(policy) {
	if (isTrustPolicy(policy)) {
		return (strings, ...values) => policy.createHTML(String.raw(strings, ...values.map(stringify)));
	} else {
		throw new TypeError('Not a Trusted Types Policy.');
	}
}

export function trustedHTML(strings, ...values) {
	if (isTrustPolicy(trustedTypes?.defaultPolicy)) {
		return trustedTypes.defaultPolicy.createHTML(String.raw(strings, ...values.map(stringify)));
	} else if (! ('trustedTypes' in globalThis)) {
		throw new Error('Trusted Types is not supported.');
	} else {
		throw new TypeError('No default Trusted Types Policy is available.');
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
