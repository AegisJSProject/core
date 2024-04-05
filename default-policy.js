if (! ('trustedTypes' in globalThis)) {
	console.warn('Trusted Types is not supported.');
} else if (trustedTypes.defaultPolicy !== null) {
	console.warn('Default policy already created.');
} else {
	try {
		trustedTypes.createPolicy('default', {
			createHTML(input, sanitizer) {
				const el = document.createElement('div');
				el.setHTML(input, { sanitizer });
				return el.innerHTML;
			}
		});
	} catch(err) {
		console.error(err);
	}
}
