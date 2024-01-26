export function text(strings, ...values) {
	if (! Array.isArray(strings)) {
		throw new TypeError('strings must be an array of strings.');
	} else {
		let str = '';

		for (let i = 0; i < strings.length; i++) {
			if (i < values.length) {
				str += strings[i].toString().concat(values[i]);
			} else {
				str += strings[i].toString();
			}
		}

		return str;
	}
}

export const getUniqueSelector = (prefix = '_aegis-scope') => `${prefix}-${crypto.randomUUID()}`;

const parseStr = args => text.apply(null, args);

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
	if (target instanceof Document || target instanceof ShadowRoot) {
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
	if (target instanceof Document || target instanceof ShadowRoot) {
		replaceStyles(target, ...target.adoptedStyleSheets, ...sheets);
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
