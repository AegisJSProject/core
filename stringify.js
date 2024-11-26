import { styleSheetToLink } from './parsers/css.js';
import { createCallback } from  '@aegisjsproject/callback-registry/callbackRegistry.js';
import { registerSignal, registerController } from '@aegisjsproject/callback-registry/callbackRegistry.js';
import { stringifyAttr, createAttribute } from './dom.js';

const toData = ([name, val]) => ['data-' + name.replaceAll(/[A-Z]/g, c => `-${c.toLowerCase()}`), val];

export const attr = attrs => Object.entries(attrs).map(([attr, val]) => {
	switch(typeof val) {
		case 'string':
			return createAttribute(attr, val);

		case 'number':
		case 'bigint':
			return Number.isNaN(val) ? undefined : createAttribute(attr, val.toString());

		case 'boolean':
			return val ? createAttribute(attr) : undefined;

		case 'undefined':
			return undefined;

		case 'function':
			return createCallback(val);

		case 'object':
			if (val === null) {
				return undefined;
			} else if (val instanceof URL) {
				return createAttribute(attr, val.href);
			} else if (val instanceof Date) {
				return createAttribute(attr, val.toISOString());
			} else {
				return createAttribute(attr, val.toString());
			}

		case 'symbol':
			return createAttribute(attr, val.description);

		default:
			return createAttribute(attr, val.toString());
	}
}).filter(attr => attr instanceof Attr)
	.map(stringifyAttr)
	.join(' ');

export function data(dataObj) {
	return attr(Object.fromEntries(Object.entries(dataObj).map(toData)));
}

export const DATE_FORMAT = {
	weekday: 'short',
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit',
};

export const formatDate = (date, {
	weekday = DATE_FORMAT.weekday,
	month = DATE_FORMAT.month,
	day = DATE_FORMAT.day,
	year = DATE_FORMAT.year,
	hour = DATE_FORMAT.hour,
	minute = DATE_FORMAT.minute,
} = DATE_FORMAT) => date.toLocaleString(navigator.language, {
	weekday, month, day, year, hour, minute,
});

const formatArray = 'Intl' in globalThis && Intl.ListFormat instanceof Function
	? arr => new Intl.ListFormat().format(arr.map(stringify))
	: arr => arr.join(', ');

const formatNumber = 'Intl' in globalThis && Intl.NumberFormat instanceof Function
	? num => new Intl.NumberFormat().format(num)
	: num => num.toString();

export const stringify = thing => {
	switch(typeof thing) {
		case 'string':
			return thing;

		case 'boolean':
			return thing ? 'true' : 'false';

		case 'symbol':
			return thing.description;

		case 'number':
		case 'bigint':
			return formatNumber(thing);

		case 'undefined':
			return '';

		case 'function':
			return createCallback(thing);

		case 'object':
			if (thing === null) {
				return '';
			} else if (Array.isArray(thing)) {
				return formatArray(thing);
			} else if (thing instanceof HTMLTemplateElement) {
				const el = document.createElement('div');
				el.append(thing.content.cloneNode(true));
				return el.innerHTML;
			} else if (thing instanceof Element) {
				return thing.outerHTML;
			} else if (thing instanceof DocumentFragment) {
				const el = document.createElement('div');
				el.append(thing.cloneNode(true));
				return el.innerHTML;
			} else if (thing instanceof Blob) {
				return URL.createObjectURL(thing);
			} else if(thing instanceof Date) {
				return formatDate(thing);
			} else if (thing instanceof CSSStyleSheet) {
				return styleSheetToLink(thing).outerHTML;
			} else if (thing instanceof DOMTokenList) {
				return [...thing].join(' ');
			} else if (thing instanceof NodeList || thing instanceof HTMLCollection || thing instanceof HTMLFormControlsCollection) {
				return [...thing].map(el => el.outerHTML).join('\n');
			} else if (thing instanceof MediaList) {
				return thing.mediaText;
			} else if (thing instanceof Attr) {
				return stringifyAttr(thing);
			} else if (thing instanceof NamedNodeMap) {
				return Array.from(thing, stringifyAttr).join(' ');
			} else if ('TrustedType' in globalThis && thing instanceof globalThis.TrustedType) {
				return thing;
			} else if ('Iterator' in globalThis && thing instanceof globalThis.Iterator) {
				return stringify([...thing]);
			} else if (thing instanceof AbortSignal) {
				return registerSignal(thing);
			} else if (thing instanceof AbortController) {
				return registerController(thing);
			} else {
				return thing.toString();
			}

		default:
			return thing.toString();
	}
};
