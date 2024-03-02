let isRegistrationOpen = true;

export const closeRegistration = () => isRegistrationOpen = false;

export const FUNCS = {
	debug: {
		log: 'aegis:debug:log',
		info: 'aegis:debug:info',
		warn: 'aegis:debug:warn',
		error: 'aegis:debug:error',
	},
	navigate: {
		back: 'aegis:navigate:back',
		forward: 'aegis:navigate:forward',
		reload: 'aegis:navigate:reload',
		link: 'aegis:navigate:go',
	},
	print: 'aegis:print',
};

const handlers = new Map([
	[FUNCS.debuglog, console.log],
	[FUNCS.debug.warn, console.warn],
	[FUNCS.debug.error, console.error],
	[FUNCS.debug.info, console.info],
	[FUNCS.navigate.back, () => history.back()],
	[FUNCS.navigate.forward, () => history.forward()],
	[FUNCS.navigate.reload, () => location.reload()],
	[FUNCS.navigate.link, event => {
		if (event.isTrusted) {
			event.preventDefault();
			location.href = event.currentTarget.href;
		}
	}],
	[FUNCS.print, () => globalThis.print()],
]);


export const listCallbacks = () => Array.from(handlers.keys());

export const hasCallback = name => handlers.has(name);

export const getCallback = name => handlers.get(name);

export function callCallback(name, ...args) {
	if (handlers.has(name)) {
		return handlers.get(name).apply(this || globalThis, args);
	} else {
		throw new Error(`No ${name} function registered.`);
	}
}

export function createCallback(callback) {
	const name = [
		Date.now().toString(16),
		...Array.from(crypto.getRandomValues(new Uint8Array(3))).map(i => i.toString(16))
	].join(':');

	return registerCallback(name, callback);
}

export function registerCallback(name, callback) {
	if (typeof name !==  'string' || name.length === 0) {
		throw new TypeError('Callback name must be a string.');
	} if (! (callback instanceof Function)) {
		throw new TypeError('Callback must be a function.');
	} else if (isRegistrationOpen) {
		if (handlers.has(name)) {
			throw new Error(`Handler "${name}" is already registered.`);
		} else {
			handlers.set(name, callback);
			return name;
		}
	}
}

export function getHost(target) {
	if (target instanceof Event) {
		return getHost(target.currentTarget);
	} else if (target instanceof Document) {
		return target;
	} else if (target instanceof Element) {
		return getHost(target.getRootNode());
	} else if (target instanceof ShadowRoot) {
		return target.host;
	}
}
