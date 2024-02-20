/**
 * @copyright 2023-2024 Chris Zuber <admin@kernvalley.us>
 * @see https://wicg.github.io/sanitizer-api/#default-configuration-dictionary
 */

import {
	allowCustomElements, allowUnknownMarkup, allowComments, allowElements,
	allowAttributes,
} from './sanitizerConfig.js';

export const sanitizerConfig = {
	allowCustomElements, allowUnknownMarkup, allowComments, allowElements,
	allowAttributes,
};

export {
	setProp, setAttr, isTrustPolicy, hasDefaultPolicy, getAttributeType,
	getPropertyType, isHTML, isScript, isScriptURL, isTrustedType, createHTML,
	createScript, createScriptURL, createPolicy, getDefaultPolicy,
} from './trust.js';

export const DATE_FORMAT = {
	weekday: 'short',
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit',
};

export const formatDate = (date, {
	weekday = DATE_FORMAT.weekday,
	month = DATE_FORMAT.month,
	day = DATE_FORMAT.day,
	year = DATE_FORMAT.year,
	hour = DATE_FORMAT.hour,
	minute = DATE_FORMAT.minute,
} = DATE_FORMAT) => date.toLocaleString(navigator.language, {
	weekday, month, day, year, hour, minute,
});

const formatArray = 'Intl' in globalThis && Intl.ListFormat instanceof Function
	? arr => new Intl.ListFormat().format(arr.map(stringify))
	: arr => arr.join(', ');

const formatNumber = 'Intl' in globalThis && Intl.NumberFormat instanceof Function
	? num => new Intl.NumberFormat().format(num)
	: num => num.toString();

const formatEl = el => el.outerHTML;

const stringify = thing => {
	switch(typeof thing) {
		case 'string':
			return thing;

		case 'number':
			return formatNumber(thing);

		case 'object':
			if (Array.isArray(thing)) {
				return formatArray(thing);
			} else if (thing instanceof Element) {
				return formatEl(thing);
			} else if(thing instanceof Date) {
				return formatDate(thing);
			} else if ('Iterator' in globalThis && thing instanceof globalThis.Iterator) {
				return stringify([...thing]);
			} else if (thing === null) {
				return '';
			} else {
				return thing.toString();
			}

		case 'undefined':
			return '';

		default:
			return thing.toString();
	}
};

export const text = (raw, ...args) => String.raw(Array.isArray(raw) ? raw : [raw], args.map(stringify));

export const getUniqueSelector = (prefix = '_aegis-scope') => `${prefix}-${crypto.randomUUID()}`;

export function createStyleSheet(rules, { media, disabled, baseURL } = {}) {
	if (media instanceof MediaQueryList) {
		return createStyleSheet(rules, { media: media.media, disabled, baseURL });
	} else {
		const sheet = new CSSStyleSheet({ media, disabled, baseURL });
		sheet.replaceSync(rules);

		return sheet;
	}
}

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
		allowUnknownMarkup, allowComments
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
} = sanitizerConfig) {
	return (strings, ...args) =>  sanitizeString(text(strings, ...args), {
		allowElements, allowAttributes, allowCustomElements,
		allowUnknownMarkup, allowComments
	});
}

export function createCSSParser({ media, disabled, baseURL } = {}) {
	return (strings, ...args) => createStyleSheet(text(strings, ...args), { media, disabled, baseURL });
}

export function replaceStyles(target, ...sheets) {
	if (! (target instanceof Node)) {
		throw new TypeError('Expected target to be a Document, DocumentFragment, ShadowRoot, or Element.');
	} else if (target instanceof Document || target instanceof ShadowRoot) {
		target.adoptedStyleSheets = sheets;
	} else if (! (target instanceof Element || DocumentFragment)) {
		throw new TypeError('Expected target to be a Document, DocumentFragment, ShadowRoot, or Element.');
	} else if (target.shadowRoot instanceof ShadowRoot) {
		return replaceStyles(target.shadowRoot, ...sheets);
	} else if (! target.isConnected) {
		throw new TypeError('Target is not connected to the document yet.');
	} else {
		return replaceStyles(target.getRootNode({ composed: false }), ...sheets);
	}
}

export function addStyles(target, ...sheets) {
	if (! (target instanceof Node)) {
		throw new TypeError('Expected target to be a Document, DocumentFragment, ShadowRoot, or Element.');
	} else if (target instanceof Document || target instanceof ShadowRoot) {
		replaceStyles(target, ...target.adoptedStyleSheets, ...sheets);
	} else if (target.shadowRoot instanceof ShadowRoot) {
		return addStyles(target.shadowRoot, ...sheets);
	} else {
		return addStyles(target.getRootNode({ composed: false }), ...sheets);
	}
}

export const html = createHTMLParser(sanitizerConfig);

export const css = createCSSParser({ baseURL: document.baseURI });

export const lightCSS = createCSSParser({ media: '(prefers-color-scheme: light)', baseURL: document.baseURI });

export const darkCSS = createCSSParser({ media: '(prefers-color-scheme: dark)', baseURL: document.baseURI });

export const json = (strings, ...args) => JSON.parse(text(strings, args));

export const svg = (strings, ...args) => {
	const parsedStr = text(strings, ...args);

	// Check for xmlns on <svg>
	if (! parsedStr.match(/^\s*<svg\s[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
		// Add xmlns to the root SVG element
		return svg([parsedStr.replace(/^\s*<svg\s+/, '<svg xmlns="http://www.w3.org/2000/svg" ')]);
	} else {
		return new DOMParser().parseFromString(parsedStr, 'image/svg+xml').documentElement;
	}

};

export const xml = (strings, ...args) => new DOMParser()
	.parseFromString(text(strings, ...args), 'application/xml');

export function appendTo(target, ...items) {
	if (! (target instanceof Node)) {
		throw new TypeError('Target must be a Node.');
	} else {
		const styles = items.filter(item => item instanceof CSSStyleSheet);
		const children = items.filter(item => typeof item === 'string' || item instanceof Node);

		if (styles.length !== 0) {
			addStyles(target, ...styles);
		}

		if (children.length !== 0) {
			target.append(...children);
		}
	}
}

export function prependTo(target, ...items) {
	if (! (target instanceof Node)) {
		throw new TypeError('Target must be a Node.');
	} else {
		const styles = items.filter(item => item instanceof CSSStyleSheet);
		const children = items.filter(item => typeof item === 'string' || item instanceof Node);

		if (styles.length !== 0) {
			addStyles(target, ...styles);
		}

		if (children.length !== 0) {
			target.prepend(...children);
		}
	}
}

export function replace(target, ...items) {
	if (! (target instanceof Node)) {
		throw new TypeError('Target must be a Node.');
	} else {
		const styles = items.filter(item => item instanceof CSSStyleSheet);
		const children = items.filter(item => typeof item === 'string' || item instanceof Node);

		if (styles.length !== 0) {
			replaceStyles(target, ...styles);
		}

		if (children.length !== 0) {
			target.replaceChildren(...children);
		}
	}
}
