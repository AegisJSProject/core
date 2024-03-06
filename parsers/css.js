export function createStyleSheet(rules, { media, disabled, baseURL } = {}) {
	if (media instanceof MediaQueryList) {
		return createStyleSheet(rules, { media: media.media, disabled, baseURL });
	} else {
		const sheet = new CSSStyleSheet({ media, disabled, baseURL });
		sheet.replaceSync(rules);

		return sheet;
	}
}

export function createCSSParser({ media, disabled, baseURL } = {}) {
	return (...args) => createStyleSheet(String.raw.apply(null, args), { media, disabled, baseURL });
}

export const css = createCSSParser({ baseURL: document.baseURI });

export const lightCSS = createCSSParser({ media: '(prefers-color-scheme: light)', baseURL: document.baseURI });

export const darkCSS = createCSSParser({ media: '(prefers-color-scheme: dark)', baseURL: document.baseURI });

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
