import { hasCallback, getCallback } from './callbackRegistry.js';

const EVENT_PREFIX = 'data-aegis-event-on-';
const EVENT_PREFIX_LENGTH = EVENT_PREFIX.length;
const DATA_PREFIX = 'aegisEventOn';
const DATA_PREFIX_LENGTH = DATA_PREFIX.length;

const once = 'data-aegis-event-once',
	passive = 'data-aegis-event-passive',
	capture = 'data-aegis-event-capture';

const eventAttrs = [
	EVENT_PREFIX + 'abort',
	EVENT_PREFIX + 'blur',
	EVENT_PREFIX + 'focus',
	EVENT_PREFIX + 'cancel',
	EVENT_PREFIX + 'auxclick',
	EVENT_PREFIX + 'beforeinput',
	EVENT_PREFIX + 'beforetoggle',
	EVENT_PREFIX + 'canplay',
	EVENT_PREFIX + 'canplaythrough',
	EVENT_PREFIX + 'change',
	EVENT_PREFIX + 'click',
	EVENT_PREFIX + 'close',
	EVENT_PREFIX + 'contextmenu',
	EVENT_PREFIX + 'copy',
	EVENT_PREFIX + 'cuechange',
	EVENT_PREFIX + 'cut',
	EVENT_PREFIX + 'dblclick',
	EVENT_PREFIX + 'drag',
	EVENT_PREFIX + 'dragend',
	EVENT_PREFIX + 'dragenter',
	EVENT_PREFIX + 'dragexit',
	EVENT_PREFIX + 'dragleave',
	EVENT_PREFIX + 'dragover',
	EVENT_PREFIX + 'dragstart',
	EVENT_PREFIX + 'drop',
	EVENT_PREFIX + 'durationchange',
	EVENT_PREFIX + 'emptied',
	EVENT_PREFIX + 'ended',
	EVENT_PREFIX + 'formdata',
	EVENT_PREFIX + 'input',
	EVENT_PREFIX + 'invalid',
	EVENT_PREFIX + 'keydown',
	EVENT_PREFIX + 'keypress',
	EVENT_PREFIX + 'keyup',
	EVENT_PREFIX + 'load',
	EVENT_PREFIX + 'loadeddata',
	EVENT_PREFIX + 'loadedmetadata',
	EVENT_PREFIX + 'loadstart',
	EVENT_PREFIX + 'mousedown',
	EVENT_PREFIX + 'mouseenter',
	EVENT_PREFIX + 'mouseleave',
	EVENT_PREFIX + 'mousemove',
	EVENT_PREFIX + 'mouseout',
	EVENT_PREFIX + 'mouseover',
	EVENT_PREFIX + 'mouseup',
	EVENT_PREFIX + 'wheel',
	EVENT_PREFIX + 'paste',
	EVENT_PREFIX + 'pause',
	EVENT_PREFIX + 'play',
	EVENT_PREFIX + 'playing',
	EVENT_PREFIX + 'progress',
	EVENT_PREFIX + 'ratechange',
	EVENT_PREFIX + 'reset',
	EVENT_PREFIX + 'resize',
	EVENT_PREFIX + 'scroll',
	EVENT_PREFIX + 'scrollend',
	EVENT_PREFIX + 'securitypolicyviolation',
	EVENT_PREFIX + 'seeked',
	EVENT_PREFIX + 'seeking',
	EVENT_PREFIX + 'select',
	EVENT_PREFIX + 'slotchange',
	EVENT_PREFIX + 'stalled',
	EVENT_PREFIX + 'submit',
	EVENT_PREFIX + 'suspend',
	EVENT_PREFIX + 'timeupdate',
	EVENT_PREFIX + 'volumechange',
	EVENT_PREFIX + 'waiting',
	EVENT_PREFIX + 'selectstart',
	EVENT_PREFIX + 'selectionchange',
	EVENT_PREFIX + 'toggle',
	EVENT_PREFIX + 'pointercancel',
	EVENT_PREFIX + 'pointerdown',
	EVENT_PREFIX + 'pointerup',
	EVENT_PREFIX + 'pointermove',
	EVENT_PREFIX + 'pointerout',
	EVENT_PREFIX + 'pointerover',
	EVENT_PREFIX + 'pointerenter',
	EVENT_PREFIX + 'pointerleave',
	EVENT_PREFIX + 'gotpointercapture',
	EVENT_PREFIX + 'lostpointercapture',
	EVENT_PREFIX + 'mozfullscreenchange',
	EVENT_PREFIX + 'mozfullscreenerror',
	EVENT_PREFIX + 'animationcancel',
	EVENT_PREFIX + 'animationend',
	EVENT_PREFIX + 'animationiteration',
	EVENT_PREFIX + 'animationstart',
	EVENT_PREFIX + 'transitioncancel',
	EVENT_PREFIX + 'transitionend',
	EVENT_PREFIX + 'transitionrun',
	EVENT_PREFIX + 'transitionstart',
	EVENT_PREFIX + 'webkitanimationend',
	EVENT_PREFIX + 'webkitanimationiteration',
	EVENT_PREFIX + 'webkitanimationstart',
	EVENT_PREFIX + 'webkittransitionend',
	EVENT_PREFIX + 'error',
];

const observer = new MutationObserver(records => {
	records.forEach(record  => {
		switch(record.type) {
			case 'childList':
				[...record.addedNodes]
					.filter(node => node.nodeType === Node.ELEMENT_NODE)
					.forEach(node => attachListeners(node));
				break;

			case 'attributes':
				if (typeof record.oldValue === 'string' && hasCallback(record.oldValue)) {
					record.target.removeEventListener(
						record.attributeName.substring(EVENT_PREFIX_LENGTH),
						getCallback(record.oldValue), {
							once: record.target.hasAttribute(once),
							capture: record.target.hasAttribute(capture),
							passive: record.target.hasAttribute(passive),
						}
					);
				}

				if (
					record.target.hasAttribute(record.attributeName)
					&& hasCallback(record.target.getAttribute(record.attributeName))
				) {
					record.target.addEventListener(
						record.attributeName.substring(EVENT_PREFIX_LENGTH),
						getCallback(record.target.getAttribute(record.attributeName)), {
							once: record.target.hasAttribute(once),
							capture: record.target.hasAttribute(capture),
							passive: record.target.hasAttribute(passive),
						}
					);
				}
				break;
		}
	});
});

const selector = eventAttrs.map(attr => `[${CSS.escape(attr)}]`).join(', ');

const DATA_EVENTS = Object.fromEntries([...eventAttrs].map(attr => [
	`on${attr[EVENT_PREFIX_LENGTH].toUpperCase()}${attr.substring(EVENT_PREFIX_LENGTH + 1)}`,
	attr
]));

export const EVENTS = { ...DATA_EVENTS, once, passive, capture };

const isEventDataAttr = ([name]) => name.substring(0, DATA_PREFIX_LENGTH) === DATA_PREFIX;

export function attachListeners(target, { signal } = {}) {
	const nodes = target instanceof Element && target.matches(selector)
		? [target, ...target.querySelectorAll(selector)]
		: target.querySelectorAll(selector);

	nodes.forEach(el => {
		const dataset = el.dataset;

		for (const [attr, val] of Object.entries(dataset).filter(isEventDataAttr)) {
			try {
				const event = 'on' + attr.substring(DATA_PREFIX_LENGTH);

				if (EVENTS.hasOwnProperty(event) && hasCallback(val)) {
					el.addEventListener(event.substring(2).toLowerCase(), getCallback(val), {
						passive: dataset.hasOwnProperty('aegisEventPassive'),
						capture: dataset.hasOwnProperty('aegisEventCapture'),
						once: dataset.hasOwnProperty('aegisEventOnce'),
						signal,
					});
				}
			} catch(err) {
				console.error(err);
			}
		}
	});

	return target;
}

export const observeEvents = (root = document.body) => {
	attachListeners(root);
	observer.observe(root, {
		subtree: true,
		childList:true,
		attributes: true,
		attributeOldValue: true,
		attributeFilter: eventAttrs,
	});
};

export const disconnectEventsObserver = () => observer.disconnect();
