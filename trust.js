/**
 * @copyright 2023-2024 Chris Zuber <admin@kernvalley.us>
 */

export const SUPPORTS_TRUSTED_TYPES = 'trustedTypes' in globalThis;

export function setProp(el, prop, val, {
	policy,
} = {}) {
	switch(getPropertyType(el.tagName, prop)) {
		case 'TrustedScript':
			el[prop] = createScript(val, { policy });
			break;

		case 'TrustedScriptURL':
			el[prop] = createScriptURL(val, { policy });
			break;

		case 'TrustedHTML':
			el[prop] = createHTML(val, { policy });
			break;

		default:
			el[prop] = val;
	}
}

export function setAttr(el, attr, val, {
	elementNs,
	policy,
} = {}) {
	switch(getAttributeType(el.tagName, attr, elementNs)) {
		case 'TrustedScriptURL':
			if (typeof elementNs === 'string') {
				el.setAttributeNs(elementNs, attr, createScriptURL(val, { policy }));
			} else {
				el.setAttribute(attr, createScriptURL(val, { policy }));
			}
			break;

		case 'TrustedScript':
			if (typeof elementNs === 'string') {
				el.setAttributeNS(elementNs, attr, createScript(val, { policy }));
			} else {
				el.setAttribute(attr, createScript(val, { policy }));
			}
			break;

		case 'TrustedHTML':
			if (typeof elementNs === 'string') {
				el.setAttributeNS(elementNs, attr, createHTML(val, { policy }));
			} else {
				el.setAttribute(attr, createHTML(val, { policy }));
			}
			break;

		default:
			if (typeof elementNs === 'string') {
				el.setAttributeNS(elementNs, attr, val);
			} else {
				el.setAttribute(attr, val);
			}
	}
}

export function supported() {
	return 'trustedTypes' in globalThis && trustedTypes.createPolicy instanceof Function;
}

export function isTrustPolicy(policy) {
	if ('TrustedTypePolicy' in globalThis && policy instanceof TrustedTypePolicy) {
		return true;
	} else {
		return policy != null && policy.createHTML instanceof Function;
	}
}

export function hasDefaultPolicy() {
	return supported() && isTrustPolicy(trustedTypes.defaultPolicy);
}

export function getAttributeType(tagName, attribute, elementNs) {
	if (supported()) {
		return trustedTypes.getAttributeType(tagName.toLowerCase(), attribute, elementNs);
	} else {
		return null;
	}
}

export function getPropertyType(tagName, property) {
	if (supported()) {
		return trustedTypes.getPropertyType(tagName.toLowerCase(), property);
	} else {
		return null;
	}
}

export function isHTML(input) {
	if (supported()) {
		return trustedTypes.isHTML(input);
	} else {
		return typeof input === 'string';
	}
}

export function isScript(input) {
	if (supported()) {
		return trustedTypes.isScript(input);
	} else {
		return typeof input === 'string';
	}
}

export function isScriptURL(input) {
	if (supported()) {
		return trustedTypes.isScriptURL(input);
	} else {
		return typeof input === 'string' || input instanceof URL;
	}
}

export function isTrustedType(input) {
	if (supported()) {
		return trustedTypes.isHTML(input) || trustedTypes.isScript(input) || trustedTypes.isScriptURL(input);
	} else {
		return true;
	}
}

export function createHTML(input, { policy = getDefaultPolicy() } = {}) {
	if (isTrustPolicy(policy) && ! isHTML(input)) {
		return policy.createHTML(input);
	} else {
		return input;
	}
}

export function createScript(input, { policy = getDefaultPolicy() } = {}) {
	if (isTrustPolicy(policy) && ! isScript(input)) {
		return policy.createScript(input);
	} else {
		return input;
	}
}

export function createScriptURL(input, { policy = getDefaultPolicy() } = {}) {
	if (isTrustPolicy(policy) && ! isScriptURL(input)) {
		return policy.createScriptURL(input);
	} else {
		return input;
	}
}

export function createPolicy(name, {
	createHTML = () => {
		throw new TypeError('This policy does not provide `createHTML()`');
	},
	createScript = () => {
		throw new TypeError('This policy does not provide `createScript()`');
	},
	createScriptURL = () => {
		throw new TypeError('This policy does not provide `createScriptURL()`');
	},
}) {
	if (supported()) {
		return trustedTypes.createPolicy(name, { createHTML, createScript, createScriptURL });
	} else {
		return Object.freeze({
			name,
			createHTML: (input, ...args) => createHTML(input.toString(), ...args),
			createScript: (input, ...args) => createScript(input.toString(), ...args),
			createScriptURL: (input, ...args) => createScriptURL(input.toString(), ...args),
		});
	}
}

export function createSanitizerPolicy(name = 'aegis#html') {
	return createPolicy(name, {
		createHTML(input, sanitizer) {
			const el = document.createElement('div');
			el.setHTML(input, { sanitizer });
			return el.innerHTML;
		}
	});
}

export function getDefaultPolicy() {
	return 'trustedTypes' in globalThis ? trustedTypes.defaultPolicy : null;
}
