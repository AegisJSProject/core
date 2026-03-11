import { Signal } from '@shgysk8zer0/signals';

/**
 * @type {boolean}
 */
let updating = false;

/**
 * @type {number}
 */
let n = 0;

/**
 *
 * @param {string} [prefix="ref-"]
 * @returns {string}
 */
const getRef = (prefix = 'ref') => `${prefix}-${n++}`;

/**
 * @type {Map<string, Signal.State<T>}
 */
const signalReg = new Map();

/**
 *
 * @returns {never}
 */
const noop = () => undefined;

/**
 * @typedef {Object} AsyncDisposableStackInterface
 * @property {boolean} disposed
 * @property {() => Promise<void>} disposeAsync
 * @property {<T>(value: T) => T} use
 * @property {<T>(value: T, onDispose: (val: T) => void) => T} adopt
 * @property {(onDispose: () => void) => void} defer
 * @property {() => AsyncDisposableStackInterface} move
 */

/**
 * @template T
 * @typedef {Signal.State<T>|Signal.Computed<T>} AnySignal<T>
 */

/**
 * @typedef {Object} SignalObserverParams
 * @property {AsyncDisposableStackInterface} stack
 * @property {AbortSignal} signal
 * @property {number} timeStamp
 */

/**
 * @template T
 * @callback SignalObserverCallback
 * @param {T} value
 * @param {SignalObserverParams} params
 * @returns {void}
 */

/**
 * @template T
 * @type {WeakMap<AnySignal<T>, SignalObserverCallback<T>>}
 */
const registry = new WeakMap();

/**
 * @type {Signal.subtle.Watcher}
 */
const watcher = new Signal.subtle.Watcher(function() {
	if (! updating) {
		updating = true;

		queueMicrotask(async () => {
			/**
			 * @type {AsyncDisposableStackInterface}
			 */
			const stack = new AsyncDisposableStack();
			const { signal } = stack.adopt(new AbortController(), controller => controller.abort());
			const config = Object.freeze({ stack, signal, timeStamp: performance.now() });

			await Promise.allSettled(
				watcher.getPending().map(
					src => Promise.try(registry.get(src) ?? noop, src.get(), config)
						.finally(() => registry.has(src) && watcher.watch(src))
				)
			);

			stack.disposeAsync()
				.catch(globalThis.reportError?.bind(globalThis))
				.finally(() => updating = false);
		});
	}
});

/**
 * Calls `callback` when `signal` is updated.
 *
 * @template T
 * @param {AnySignal<T>} signal
 * @param {SignalObserverCallback<T>} callback
 */
export function watchSignal(signal, callback) {
	if (! (signal instanceof Signal.State || signal instanceof Signal.Computed)) {
		throw new TypeError('Signal must be a `Signal.State` or `Signal.Computed.');
	} else if (typeof callback !== 'function') {
		throw new TypeError('Callback must be a function.');
	} else {
		registry.set(signal, callback);
		watcher.watch(signal);
	}
}

/**
 * Unregister `signal` from the signal registry
 *
 * @template T
 * @param {AnySignal<T>} signal
 * @returns {boolean} True if the signal was successfully removed/unwatched
 */
export function unwatchSignal(signal) {
	const result = registry.delete(signal);
	watcher.unwatch(signal);
	return result;
}

/**
 *
 * @param {string} ref
 * @returns {Signal.State|undefined}
 */
export const getSignalFromRef = ref => signalReg.get(ref);

export class DisposableState extends Signal.State {
	#ref = getRef('__signal_ref');
	#disposed = false;

	constructor(value) {
		super(value, {
			equals: (a, b) => ! this.#disposed && Object.is(a, b)
		});

		signalReg.set(this.#ref, this);
	}

	get ref() {
		return this.#ref;
	}

	get disposed() {
		return this.#disposed;
	}

	[Symbol.dispose]() {
		if (! this.#disposed) {
			this.#disposed = true;
			signalReg.delete(this.#ref);
			console.info(`Disposing of ${this.#ref}`);

			Signal.subtle.introspectSinks(this).forEach(source => {
				if (source instanceof Signal.subtle.Watcher) {
					source.unwatch(this);
				}
			});
		}
	}
}

export class DisposableComputed extends Signal.Computed {
	#ref = getRef('__signal_ref');
	#disposed = false;

	constructor(callback) {
		super(callback, {
			equals: (a, b) => ! this.#disposed && Object.is(a, b)
		});

		signalReg.set(this.#ref, this);
	}

	get ref() {
		return this.#ref;
	}

	get disposed() {
		return this.#disposed;
	}

	[Symbol.dispose]() {
		if (! this.#disposed) {
			this.#disposed = true;
			signalReg.delete(this.#ref);
			console.info(`Disposing of ${this.#ref}`);

			Signal.subtle.introspectSinks(this).forEach(source => {
				if (source instanceof Signal.subtle.Watcher) {
					source.unwatch(this);
				}
			});
		}
	}
}

export class TextState extends DisposableState {
	toString() {
		return `<!-- ${this.ref} -->`;
	}
}

export class TextComputed extends DisposableComputed {
	toString() {
		return `<!-- ${this.ref} -->`;
	}
}

export class AttrState extends DisposableState {
	#name;

	constructor(name, value) {
		super(value);
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	toString() {
		return `data-attr-signal="${this.ref}"`;
	}
}

export class AttrComputed extends DisposableComputed {
	#name;

	constructor(name, callback) {
		super(callback);
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	toString() {
		return `data-attr-signal="${this.ref}"`;
	}
}

export function observeTextSignalRefs(root = document.body, { stack, signal } = {}) {
	const it = document.createNodeIterator(
		root,
		NodeFilter.SHOW_COMMENT,
		comment => signalReg.has(comment.textContent.trim()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
	);

	let comment;

	while ((comment = it.nextNode())) {
		const sig = signalReg.get(comment.textContent.trim());
		const textNode = document.createTextNode(sig.get());
		comment.parentElement.replaceChild(textNode, comment);
		watchSignal(sig, text => textNode.textContent = text);
		stack?.defer?.(() => sig[Symbol.dispose]());
		signal?.addEventListener?.('abort', () => sig[Symbol.dispose](), { once: true });
	}

	return root;
}

export function observeAttrSignalRefs(root = document.body, { stack, signal } = {}) {
	const els = root.querySelectorAll('[data-attr-signal]');

	for (const el of els) {
		const key = el.dataset.attrSignal;

		if (signalReg.has(key)) {
			const sig = signalReg.get(key);
			const attr = document.createAttribute(sig.name);
			attr.value = sig.get();
			el.setAttributeNode(attr);
			el.removeAttribute('data-attr-signal');
			watchSignal(sig, newVal => attr.value = newVal);
			stack?.defer?.(() => unwatchSignal(sig));
			signal?.addEventListener?.('abort', () => unwatchSignal(sig), { once: true });
		}
	}

	return root;
}

export function observeSignalRefs(root = document.body, { stack, signal } = {}) {
	observeTextSignalRefs(root, { stack, signal });
	observeAttrSignalRefs(root, { stack, signal });
	return root;
}

// {
// 	using attr = new AttrState('foo');
// 	using text = new TextState('Hello, World!');
// 	console.log(`<div ${attr}>${text}</div>`);
// }
