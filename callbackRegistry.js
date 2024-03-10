let isRegistrationOpen = true;

export const closeRegistration = () => isRegistrationOpen = false;

function $(selector, base = document) {
	return base.querySelectorAll(selector);
}

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
		popup: 'aegis:navigate:popup',
	},
	ui: {
		print: 'aegis:ui:print',
		remove: 'aegis:ui:remove',
		hide: 'aegis:ui:hide',
		unhide: 'aegis:ui:unhide',
		showModal: 'aegis:ui:showModal',
		closeModal: 'aegis:ui:closeModal',
		showPopover: 'aegis:ui:showPopover',
		hidePopover: 'aegis:ui:hidePopover',
		togglePopover: 'aegis:ui:togglePopover',
		enable: 'aegis:ui:enable',
		disable: 'aegis:ui:disable',
		scrollTo: 'aegis:ui:scrollTo',
	},
};

const handlers = new Map([
	[FUNCS.debug.log, console.log],
	[FUNCS.debug.warn, console.warn],
	[FUNCS.debug.error, console.error],
	[FUNCS.debug.info, console.info],
	[FUNCS.navigate.back, () => history.back()],
	[FUNCS.navigate.forward, () => history.forward()],
	[FUNCS.navigate.reload, () => location.reload()],
	[FUNCS.navigate.link, event => {
		if (event.isTrusted) {
			event.preventDefault();
			location.href = event.currentTarget.dataset.url;
		}
	}],
	[FUNCS.navigate.popup, event => {
		if (event.isTrusted) {
			event.preventDefault();
			window.open(event.currentTarget.dataset.url);
		}
	}],
	[FUNCS.ui.hide, ({ currentTarget }) => {
		$(currentTarget.dataset.selector).forEach(el => el.hidden = true);
	}],
	[FUNCS.ui.unhide, ({ currentTarget }) => {
		$(currentTarget.dataset.selector).forEach(el => el.hidden = false);
	}],
	[FUNCS.ui.disable, ({ currentTarget }) => {
		$(currentTarget.dataset.selector).forEach(el => el.disabled = true);
	}],
	[FUNCS.ui.enable, ({ currentTarget }) => {
		$(currentTarget.dataset.selector).forEach(el => el.disabled = false);
	}],
	[FUNCS.ui.remove, ({ currentTarget }) => {
		$(currentTarget.dataset.selector).forEach(el => el.remove());
	}],
	[FUNCS.ui.scrollTo, ({ currentTarget }) => {
		const target = document.querySelector(currentTarget.dataset.selector);

		if (target instanceof Element) {
			target.scrollIntoView({
				behavor: matchMedia('(prefers-reduced-motion: reduce)').matches
					? 'instant'
					: 'smooth',
			});
		}
	}],
	[FUNCS.ui.showModal, ({ currentTarget }) => {
		const target = document.querySelector(currentTarget.dataset.selector);

		if (target instanceof HTMLDialogElement) {
			target.showModal();
		}
	}],
	[FUNCS.ui.closeModal, ({ currentTarget }) => {
		const target = document.querySelector(currentTarget.dataset.selector);

		if (target instanceof HTMLDialogElement) {
			target.close();
		}
	}],
	[FUNCS.ui.showPopover, ({ currentTarget }) => {
		const target = document.querySelector(currentTarget.dataset.selector);

		if (target instanceof HTMLElement) {
			target.showPopover();
		}
	}],
	[FUNCS.ui.hidePopover, ({ currentTarget }) => {
		const target = document.querySelector(currentTarget.dataset.selector);

		if (target instanceof HTMLElement) {
			target.hidePopover();
		}
	}],
	[FUNCS.ui.togglePopover, ({ currentTarget }) => {
		const target = document.querySelector(currentTarget.dataset.selector);

		if (target instanceof HTMLElement) {
			target.togglePopover();
		}
	}],
	[FUNCS.ui.print, () => globalThis.print()],
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
