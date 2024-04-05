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

				el.setHTML(input, { sanitizer: Object.freeze({
					elements, attributes, comments, dataAttributes, ...rest,
				})});

				return el.innerHTML;
			}
		});
	} catch(err) {
		console.error(err);
	}
}
