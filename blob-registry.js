const SOURCE_REGISTRY = new WeakMap();

/**
 * Create and register a `blob:` URI for a source.
 *
 * @param {Blob} source The `Blob` to regsiter.
 * @returns {string} A `blob:` URI for the Object Source.
 * @throws {TypeError} If the `source` is an invalid type.
 */
export function registerBlob(source) {
	if (! (source instanceof Blob)) {
		throw new TypeError('Expected a `Blob`');
	} else if (SOURCE_REGISTRY.has(source)) {
		return SOURCE_REGISTRY.get(source);
	} else {
		const uri = URL.createObjectURL(source);
		SOURCE_REGISTRY.set(source, uri);
		return uri;
	}
}

/**
 * Revoke an Object URL and remove it from the registry.
 *
 * @param {any} source The Object registered for a `blob:` URI.
 * @returns {boolean} Whether or not the URI was revoked and unregistered.
 */
export function unregisterBlob(source) {
	if (SOURCE_REGISTRY.has(source)) {
		const uri = SOURCE_REGISTRY.get(source);
		URL.revokeObjectURL(uri);
		SOURCE_REGISTRY.delete(source);
		return true;
	} else {
		return false;
	}
}

/**
 * Get a registered `blob:` URI for a Source Object.
 *
 * @param {Blob} source The `Blob` the URI is registered to.
 * @returns {string|undefined} The corresponding `blob:` URI.
 */
export const getBlobURL = source => SOURCE_REGISTRY.get(source);

/**
 * Check if an Object Source has a registered `blob:` URI.
 *
 * @param {Blob} source The `Blob` to check for.
 * @returns {boolean} Whether or not the source has a registered `blob:` URI.
 */
export const hasBlobURL = source => SOURCE_REGISTRY.has(source);
