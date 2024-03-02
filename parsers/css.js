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
