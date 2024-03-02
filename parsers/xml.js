import { stringify } from '../stringify.js';

export const xml = (strings, ...values) => new DOMParser()
	.parseFromString(String.raw(strings, ...values.map(stringify)), 'application/xml');
