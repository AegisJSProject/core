const lang = navigator.language;

const formatDate = 'Intl' in globalThis && Intl.DateTimeFormat instanceof Function
	? date => new Intl.DateTimeFormat(lang, { dateStyle: 'short', timeStyle: 'short' }).format(date)
	: date => date.toLocaleString();

const formatArray = 'Intl' in globalThis && Intl.ListFormat instanceof Function
	? arr => new Intl.ListFormat().format(arr)
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

export function text(strings, ...values) {
	if (typeof strings === 'string') {
		return text([strings], ...values);
	} else if (! Array.isArray(strings)) {
		throw new TypeError('strings must be an array of strings.');
	} else {
		let str = '';

		for (let i = 0; i < strings.length; i++) {
			if (i < values.length) {
				str += strings[i].toString().concat(stringify(values[i]));
			} else {
				str += strings[i].toString();
			}
		}

		return str;
	}
}

const parseStr = args => text.apply(null, args);

export const getUniqueSelector = (prefix = '_aegis-scope') => `${prefix}-${crypto.randomUUID()}`;

export function createStyleSheet(rules, { media, disabled, baseURL } = {}) {
	const sheet = new CSSStyleSheet({ media, disabled, baseURL });
	sheet.replaceSync(rules);

	return sheet;
}

export function createHTMLParser(config = {}) {
	return (...args) => {
		const el = document.createElement('div');
		const frag = document.createDocumentFragment();
		el.setHTML(parseStr(args), config);
		frag.append(...el.children);

		return frag;
	};
}

export function createCSSParser({ media, disabled, baseURL } = {}) {
	return (...args) => createStyleSheet(parseStr(args), { media, disabled, baseURL });
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

export const html = createHTMLParser({});

export const css = createCSSParser({ baseURL: document.baseURI });

export const json = (...args) => JSON.parse(parseStr(args));

export const svg = (...args) => new DOMParser()
	.parseFromString(parseStr(args), 'image/svg+xml')
	.documentElement;

export const xml = (...args) => new DOMParser()
	.parseFromString(parseStr(args), 'application/xml');
