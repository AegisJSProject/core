import { createStyleSheet, createCSSParser, css, setStyleSheets, addStyleSheets } from '@aegisjsproject/parsers/css.js';
import { registerBlob } from '../blob-registry.js';

function stringify(thing) {
	switch(typeof thing) {
		case 'string':
		case 'number':
		case 'bigint':
			return thing;

		case 'undefined':
		case 'symbol':
			return '';

		case 'object':
			if (thing instanceof Blob) {
				return `url(${registerBlob(thing)})`;
			} else if (thing instanceof URL) {
				return `url(${thing.href})`;
			} else if (thing === null) {
				return '';
			} else {
				return thing.toString();
			}
		default:
			return thing.toString();
	}
}

const PREFIX = '_aegis_style_scope_';

/**
 * Creates a scoped CSSStyleSheet and returns a tagged template function for generating
 * unique class names within that scope.
 *
 * @param {Object} [options]  Configuration options.
 * @param {string} [options.baseURL] The base URL used to resolve relative URLs in the stylesheet.
 * @param {string|MediaList|MediaQueryList} [options.media] The intended media for the stylesheet (e.g., "screen", "print").
 * @param {boolean} [options.disabled] Whether the stylesheet is disabled by default.
 * @param {string} [options.prefix] A custom prefix for generated class names.
 * @returns {readonly [CSSStyleSheet, (strings: TemplateStringsArray, ...values: any[]) => string]} A tagged template function that
 * inserts a new CSS rule and returns the generated class name, along with the `CSSStyleSheet` created.
 */
export function useScopedStyle({ baseURL, media, disabled, prefix = PREFIX } = {}) {
	const sheet = new CSSStyleSheet({ baseURL, media: media instanceof MediaQueryList ? media.media : media, disabled });

	return Object.freeze([sheet, (strings, ...values) => {
		const uuid = crypto.randomUUID();
		const className = `${prefix}${uuid}`;
		const rule = `.${CSS.escape(prefix) + uuid} { ${String.raw(strings, ...values.map(stringify))} }`;
		sheet.insertRule(rule, sheet.cssRules.length);

		return className;
	}]);
}

/**
 * @deprecated
 * @param {Document | ShadowRoot | Element} [root=document] The DOM scope to attach the stylesheet to.
 * If an Element is passed, its root node (Document or ShadowRoot) is used.
 *
 * @param {Object} [options]  Configuration options.
 * @param {string} [options.baseURL] The base URL used to resolve relative URLs in the stylesheet.
 * @param {string|MediaList|MediaQueryList} [options.media] The intended media for the stylesheet (e.g., "screen", "print").
 * @param {boolean} [options.disabled] Whether the stylesheet is disabled by default.
 * @param {string} [options.prefix] A custom prefix for generated class names.
 * @returns {(strings: TemplateStringsArray, ...values: any[]) => string} A tagged template function that
 * inserts a new CSS rule and returns the generated class name.
 */
export function createStyleScope(root = document, { baseURL, media, disabled, prefix = PREFIX } = {}) {
	console.warn('`createStyleScope()` is deprecated. Please use `useScopedStyle()` instead.');
	const result = useScopedStyle({ baseURL, media, disabled, prefix });
	root.adoptedStyleSheets = [...document.adoptedStyleSheets, result[0]];
	return result[1];
}

export const lightCSS = createCSSParser({ media: '(prefers-color-scheme: light)', baseURL: document.baseURI });

export const darkCSS = createCSSParser({ media: '(prefers-color-scheme: dark)', baseURL: document.baseURI });

export function prefixCSSRules(prefix, thing) {
	if (thing instanceof CSSStyleSheet || thing instanceof CSSConditionRule || thing instanceof CSSMediaRule) {
		prefixCSSRules(prefix, thing.cssRules);
	} else if (thing instanceof CSSRuleList) {
		for (const rule of thing) {
			prefixCSSRules(prefix, rule);
		}
	} else if (thing instanceof CSSStyleRule) {
		thing.selectorText = `${prefix} ${thing.selectorText}`;
	}
}

export function createBoundParser({ root = document, media, disabled = false, baseURL = document.baseURI, prefix } = {}) {
	if (root instanceof HTMLElement) {
		return createBoundParser({ root: root.getRootNode(), media, disabled, baseURL });
	} else if (typeof prefix === 'string') {
		const parser = createCSSParser({ media, disabled, baseURL });

		return (...args) => root.adoptedStyleSheets = [...root.adoptedStyleSheets, prefixCSSRules(prefix, parser.apply(null, args))];
	} else {
		const parser = createCSSParser({ media, disabled, baseURL });

		return (...args) => root.adoptedStyleSheets = [...root.adoptedStyleSheets, parser.apply(null, args)];
	}
}

export const adoptStyles = createBoundParser();

export function styleSheetToFile(styleSheet, filename = 'styles.css') {
	if (! (styleSheet instanceof CSSStyleSheet)) {
		throw new TypeError('Not a CSSStyleSheet.');
	} else {
		const css = Array.from(styleSheet.cssRules, rule => rule.cssText);
		return new File(css, filename, { type: styleSheet.type });
	}
}

export function styleSheetToLink(styleSheet) {
	const file = styleSheetToFile(styleSheet);
	const link = document.createElement('link');

	link.relList.add('stylesheet');
	link.disabled = styleSheet.disabled;

	if (styleSheet.media.length !== 0) {
		link.media = styleSheet.media.mediaText;
	}

	link.href = registerBlob(file);

	return link;
}

export { createStyleSheet, createCSSParser, css, setStyleSheets, addStyleSheets };
