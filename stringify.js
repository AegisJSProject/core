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

		case 'number':
			return formatNumber(thing);

		case 'object':
			if (Array.isArray(thing)) {
				return formatArray(thing);
			} else if (thing instanceof Element) {
				return formatEl(thing);
			} else if(thing instanceof Date) {
				return formatDate(thing);
			} else if ('Iterator' in globalThis && thing instanceof globalThis.Iterator) {
				return stringify([...thing]);
			} else if (thing === null) {
				return '';
			} else {
				return thing.toString();
			}

		case 'undefined':
			return '';

		default:
			return thing.toString();
	}
};
