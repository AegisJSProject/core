const registry = new Set();

export function registerComponent(tag, constructor, opts) {
	if (registry.has(tag)) {
		throw new Error(`<${tag}> is already registered.`);
	} else {
		customElements.define(tag, constructor, opts);
		registry.add(tag);
		return constructor;
	}
}

export function getRegisteredComponentTags() {
	return Object.freeze(Array.from(registry));
}

export function getRegisteredComponents() {
	return Object.freeze(Array.from(registry, tag => customElements.get(tag)));
}

export function getAttributes(tag) {
	const constructor = customElements.get(tag);

	return constructor instanceof Function ? constructor.observedAttributes() : [];
}
