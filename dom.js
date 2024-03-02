import { attachListeners } from './events.js';

export const getUniqueSelector = (prefix = '_aegis-scope') => `${prefix}-${crypto.randomUUID()}`;

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

export function appendTo(target, ...items) {
	if (! (target instanceof Node)) {
		throw new TypeError('Target must be a Node.');
	} else {
		const styles = items.filter(item => item instanceof CSSStyleSheet);
		const children = items.filter(item => typeof item === 'string' || item instanceof Node);

		if (styles.length !== 0) {
			addStyles(target, ...styles);
		}

		if (children.length !== 0) {
			target.append(...children);
		}

		attachListeners(target instanceof ShadowRoot ? target.host : target);
	}
}

export function prependTo(target, ...items) {
	if (! (target instanceof Node)) {
		throw new TypeError('Target must be a Node.');
	} else {
		const styles = items.filter(item => item instanceof CSSStyleSheet);
		const children = items.filter(item => typeof item === 'string' || item instanceof Node);

		if (styles.length !== 0) {
			addStyles(target, ...styles);
		}

		if (children.length !== 0) {
			target.prepend(...children);
		}

		attachListeners(target instanceof ShadowRoot ? target.host : target);
	}
}

export function replace(target, ...items) {
	if (! (target instanceof Node)) {
		throw new TypeError('Target must be a Node.');
	} else {
		const styles = items.filter(item => item instanceof CSSStyleSheet);
		const children = items.filter(item => typeof item === 'string' || item instanceof Node);

		if (styles.length !== 0) {
			replaceStyles(target, ...styles);
		}

		if (children.length !== 0) {
			target.replaceChildren(...children);
		}

		attachListeners(target instanceof ShadowRoot ? target.host : target);
	}
}
