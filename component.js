export function clone(el, deep = true) {
	if (el.shadowRoot instanceof ShadowRoot && el.shadowRoot.clonable) {
		const clone = el.cloneNode(deep);
		clone.shadowRoot.adoptedStyleSheets = el.shadowRoot.adoptedStyleSheets;
		return clone;
	} else {
		return el.cloneNode(deep);
	}
}

export function createComponent({
	tag = 'div',
	template = '<slot></slot>',
	styles,
	mode = 'open',
	delegatesFocus = false,
	clonable = true,
	slotAssignment = 'named',
	exportParts,
	sanitizer: {
		elements,
		attributes,
		comments,
	} = {},
}) {
	const el = document.createElement(tag);
	const shadow = el.attachShadow({ mode, clonable, delegatesFocus, slotAssignment });

	if (typeof template === 'string' && template.length !== 0) {
		const tmp = document.createElement('div');
		tmp.setHTML(template, { sanitizer: { elements, attributes, comments }});
		shadow.append(...tmp.children);
	} else if (! (template instanceof Node)) {
		throw new TypeError('Missing or invalid template.');
	} else if (template instanceof HTMLTemplateElement) {
		shadow.append(template.content.cloneNode(true));
	} else if (template instanceof DocumentFragment) {
		shadow.append(template.cloneNode(true));
	} else {
		shadow.append(template);
	}

	if (Array.isArray(styles)) {
		Promise.all(styles.map(sheet => typeof sheet === 'string'
			? new CSSStyleSheet().replace(sheet)
			: sheet
		)).then(sheets => shadow.adoptedStyleSheets = sheets);
	} else if (typeof styles === 'string' && styles.length !== 0) {
		new CSSStyleSheet().replace(styles)
			.then(sheet => shadow.adoptedStyleSheets = [sheet]);
	}

	if (typeof exportParts === 'string') {
		el.setAttribute('exportparts', exportParts);
	} else if (Array.isArray(exportParts)){
		el.setAttributes('exportparts', exportParts.join(', '));
	} else if (typeof exportParts === 'object' && exportParts !== null) {
		el.setAttribute(
			'exportparts',
			Object.entries(exportParts).map(([k, v]) => `${k}:${v}`).join(', ')
		);
	}

	return el;
}
