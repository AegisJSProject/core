import { stringify } from '../stringify.js';
import { sanitizer as sanitizerConfig } from '@aegisjsproject/sanitizer/config/base.js';
import { getRegisteredComponentTags } from '../componentRegistry.js';
import { createHTMLParser, doc } from '@aegisjsproject/parsers/html.js';
import { isTrustPolicy } from '../trust.js';
import { observeEvents } from '@aegisjsproject/callback-registry';

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
	sanitizer = sanitizerConfig,
	exportParts,
	callback = ({ shadowRoot }) => observeEvents(shadowRoot),
} = {}) {
	const parser = createHTMLParser(sanitizer, { mapper: stringify });

	if (Array.isArray(exportParts)) {
		exportParts = exportParts.join(', ');
	} else if (typeof exportParts === 'object') {
		exportParts =  Object.entries(exportParts).map(([k, v]) => `${k}: ${v}`).join(', ');
	}

	return (...args) => {
		const host = document.createElement(tagName);
		const shadowRoot = host.attachShadow({ mode, clonable, serializable, delegatesFocus, slotAssignment });
		const template = parser.apply(parser, args);

		shadowRoot.adoptedStyleSheets = Array.from(
			template.querySelectorAll('style'),
			style => {
				const sheet = new CSSStyleSheet({
					media: style.media,
					disabled: style.hasAttribute('disabled'), // `style.disabled` != `<style disabled>`
					baseURL: style.dataset.baseUrl, // Nothing maps to `baseURL`, so use `data-base-url`
				});

				sheet.replaceSync(style.textContent);
				style.remove();
				return sheet;
			}
		);

		shadowRoot.append(template);

		if (typeof exportParts === 'string') {
			host.setAttribute('exportparts', exportParts);
		}

		if (callback instanceof Function) {
			callback.call(host, { shadowRoot, host });
		}

		return host;
	};
}

export const shadow = createShadowParser();
export const styledShadow = createShadowParser({
	mode: 'closed',
	clonable: false,
	sanitizer: { elements: [...sanitizerConfig.elements, 'style'] },
});

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
