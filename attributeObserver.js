const registry = new WeakMap();

const observer = new MutationObserver(records => {
	const timestamp = performance.now();

	for (const { target, attributeName: name, oldValue } of records) {
		if (registry.has(target)) {
			const map = registry.get(target);

			if (map.has(name)) {
				const newValue = target.getAttribute(name);
				const args = Object.freeze({ target, name, oldValue, newValue, timestamp });

				map.get(name).forEach(callback => callback.call(target, args));
			}
		}
	}
});

export function observeAttribute(target, attributeName, callback, { signal, base = document.body } = {}) {
	if (typeof target === 'string') {
		observeAttribute(base.querySelector(target), attributeName, callback, { signal });
	} else if (! (target instanceof Element)) {
		throw new TypeError('Target must be an element.');
	} else if (typeof attributeName !== 'string' || attributeName.length === 0) {
		throw new TypeError('Attribute name must be a non-empty string.');
	} else if (! (callback instanceof Function)) {
		throw new TypeError('Callback must be a function.');
	} else if (signal instanceof AbortSignal && signal.aborted) {
		throw signal.reason;
	} else {
		let addedAttr = false;

		if (! registry.has(target)) {
			// New target & new Attribute
			registry.set(target, new Map([[attributeName, new Set([callback])]]));
			addedAttr = true;
		} else {
			registry.get(target).emplace(attributeName, {
				insert: () => {
					// New attribute not already observed
					addedAttr = true;
					return new Set([callback]);
				},
				update: callbacks => callbacks.add(callback),
			});
		}

		// Only touch observer if target or attributes changed
		if (addedAttr) {
			observer.observe(target, {
				attributes: true,
				attributeFilter: Array.from(registry.get(target).keys()),
				attributeOldValue: true,
			});
		}

		if (signal instanceof AbortSignal) {
			signal.addEventListener('abort', () => {
				unobserveAttribute(target, attributeName, callback);
			}, { once: true });
		}
	}
}

export function observeAttributes(target, attrs, { base = document.body, signal } = {}) {
	if (typeof target === 'string') {
		observeAttributes(base.querySelector(target), attrs, { signal });
	} else if (! (target instanceof Element)) {
		throw new TypeError('Target must be an element.');
	} else if (typeof attrs !== 'object' || attrs === null) {
		throw new TypeError('Attrs must be a `{ attribute: callback } object.');
	} else if (signal instanceof AbortSignal && signal.aborted) {
		throw signal.reason;
	} else {
		let addedAttr = false;

		Object.entries(attrs).forEach(([attributeName, callback]) => {
			if (typeof attributeName !== 'string' || attributeName.length === 0) {
				throw new TypeError('Attribute name must be a non-empty string.');
			} else if (! (callback instanceof Function)) {
				throw new TypeError('Callback must be a function.');
			} else if (! registry.has(target)) {
				// New target & new Attribute
				registry.set(target, new Map([[attributeName, new Set([callback])]]));
				addedAttr = true;
			} else {
				registry.get(target).emplace(attributeName, {
					insert: () => {
						// New attribute not already observed
						addedAttr = true;
						return new Set([callback]);
					},
					update: (callbacks) => callbacks.add(callback),
				});
			}
		});

		// Only touch observer if target or attributes changed
		if (addedAttr) {
			observer.observe(target, {
				attributes: true,
				attributeFilter: Array.from(registry.get(target).keys()),
				attributeOldValue: true,
			});
		}

		if (signal instanceof AbortSignal) {
			signal.addEventListener('abort', () => {
				Object.entries(attrs).forEach(([attributeName, callback]) => {
					unobserveAttribute(target, attributeName, callback);
				});
			}, { once: true });
		}
	}
}

export function unobserveAttribute(target, attributeName, callback, { base = document.body } = {}) {
	if (typeof target === 'string') {
		return unobserveAttribute(base.querySelector(target), attributeName, callback);
	} else if (! (target instanceof Element)) {
		throw new TypeError('Target must be an element.');
	} else if (typeof attributeName !== 'string' || attributeName.length === 0) {
		throw new TypeError('Attribute name must be a non-empty string.');
	} else if (! (callback instanceof Function)) {
		throw new TypeError('Callback must be a function.');
	} else if (! registry.has(target)) {
		return false;
	} else {
		const registered = registry.get(target);

		if (! registered.has(attributeName)) {
			return false;
		} else {
			// Callbacks - [[attr, callback], [attr, callback], ...]
			const callbacks = registered.get(attributeName);

			if (! callbacks.has(callback)) {
				return false;
			} else if (callbacks.size !== 1) {
				// Deleting callback leaves non-empty set of callbacks
				callbacks.delete(callback);
				return true;
			} else {
				// No callbacks will remain for attr, so change the observed attributes
				registered.delete(attributeName);

				observer.observe(target, {
					attributes: true,
					attributeFilter: Array.from(registered.keys()),
					attributeOldValue: true,
				});

				// If there are no attributes to observe, remove the target from reg
				if (registered.size === 0) {
					registry.delete(target);
				}

				return true;
			}
		}
	}
}
