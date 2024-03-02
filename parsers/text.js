import { stringify } from '../stringify.js';

export const text = (strings, ...values) => Array.isArray(strings) && Array.isArray(strings.raw)
	? String.raw(strings, ...values.map(stringify))
	: String.raw({ raw: Array.isArray(strings) ? strings : [strings] }, ...values.map(stringify));
