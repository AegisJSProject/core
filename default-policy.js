if (! ('trustedTypes' in globalThis && trustedTypes.createPolicy instanceof Function)) {
	console.warn('Trusted Types is not supported.');
} else if (trustedTypes.defaultPolicy !== null) {
	console.warn('Default policy already created.');
} else if (! (HTMLElement.prototype.setHTML instanceof Function)) {
	console.warn('The Sanitizer API is not supported.');
} else {
	try {
		trustedTypes.createPolicy('default', {
			createHTML(input, {
				elements,
				attributes,
				comments = false,
				dataAttributes = true,
				...rest
			} = {}) {
				const el = document.createElement('div');
				el.setHTML(input, { sanitizer: { elements, attributes, comments, dataAttributes, ...rest }});

				return el.innerHTML;
			},
			createScriptURL(input, allowedSources = []) {
				if (! Array.isArray(allowedSources)) {
					throw new TypeError('`allowedSources` must be an array.');
				} else if (allowedSources.length === 0) {
					throw new TypeError('No `allowedSources` given to `createScriptURL`.');
				} else {
					const src = new URL(input, document.baseURI);
					const mapped = allowedSources.map(src => src instanceof URL
						? src
						: new URL(src, document.baseURI)
					);

					if (mapped.some(({ origin, pathname }) => (
						src.origin ===  origin
						&& src.pathname.startsWith(pathname))
					)) {
						return src.href;
					} else {
						throw new TypeError(`${src.href} is not an allowed script URL.`);
					}
				}
			}
		});
	} catch(err) {
		console.error(err);
	}
}
