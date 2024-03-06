import { eventAttrs, EVENT_PREFIX_LENGTH } from './sanitizerConfig.js';
import { hasCallback, getCallback } from './callbackRegistry.js';

export const AEGIS_EVENT_HANDLER_CLASS = '_aegis-event-handler';
const selector = eventAttrs.map(attr => `[${CSS.escape(attr)}]`).join(', ');

export const EVENTS = Object.fromEntries(eventAttrs.map(attr => [
	`on${attr[EVENT_PREFIX_LENGTH].toUpperCase() + attr.substring(EVENT_PREFIX_LENGTH + 1)}`,
	attr
]));

export function attachListeners(target, { signal } = {}) {
	target.querySelectorAll(selector).forEach(el => {
		for (const attr of el.getAttributeNames().filter(name => eventAttrs.includes(name))) {
			const val = el.getAttribute(attr);

			try {
				if (typeof val === 'string' && val.length !== 0 && hasCallback(val)) {
					const event = attr.substring(EVENT_PREFIX_LENGTH).trim();
					const callback = getCallback(val);
					const passive = el.hasAttribute('aegis:event:passive');
					const capture = el.hasAttribute('aegis:event:capture');
					const once = el.hasAttribute('aegis:event:once');
					el.addEventListener(event, callback, { passive, capture, once, signal });
				} else {
					console.warn(`No handler registered for ${val}`);
				}
			} catch(err) {
				console.error(err);
			} finally {
				el.removeAttribute(attr);
				el.removeAttribute('aegis:event:passive');
				el.removeAttribute('aegis:event:capture');
				el.removeAttribute('aegis:event:once');

				if (el.classList.length === 1) {
					el.removeAttribute('class');
				} else {
					el.classList.remove(AEGIS_EVENT_HANDLER_CLASS);
				}
			}
		}
	});

	return target;
}
