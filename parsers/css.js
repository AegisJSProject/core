import { createStyleSheet, createCSSParser, css, setStyleSheets, addStyleSheets } from '@aegisjsproject/parsers/css.js';

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

	link.href = URL.createObjectURL(file);

	return link;
}

export { createStyleSheet, createCSSParser, css, setStyleSheets, addStyleSheets };
