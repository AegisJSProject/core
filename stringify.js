import { styleSheetToLink } from './utility.js';

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

const formatEl = el => el.outerHTML;

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
				return formatEl(thing);
			} else if (thing instanceof DocumentFragment) {
				const el = document.createElement('div');
				el.append(thing.cloneNode(true));
				return el.innerHTML;
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
			} else if ('TrustedType' in globalThis && thing instanceof globalThis.TrustedType) {
				return thing;
			} else if ('Iterator' in globalThis && thing instanceof globalThis.Iterator) {
				return stringify([...thing]);
			} else {
				return thing.toString();
			}

		default:
			return thing.toString();
	}
};
