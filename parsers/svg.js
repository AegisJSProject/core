import { stringify } from '../stringify.js';

export const svg = (strings, ...values) => {
	const parsedStr = String.raw(strings, ...values.map(stringify));

	// Check for xmlns on <svg>
	if (! parsedStr.match(/^\s*<svg\s[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
		// Add xmlns to the root SVG element
		return svg({ raw: [parsedStr.replace(/^\s*<svg\s+/, '<svg xmlns="http://www.w3.org/2000/svg" ')] });
	} else {
		return new DOMParser().parseFromString(parsedStr, 'image/svg+xml').documentElement;
	}
};
