import { back, forward, reload } from '@aegisjsproject/router/router.js';

let isRegistrationOpen = true;

export const closeRegistration = () => isRegistrationOpen = false;

const $$ = (selector, base = document) => base.querySelectorAll(selector);

const $ = (selector, base = document) => base.querySelector(selector);

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
		prevent: 'aegis:ui:prevent',
	},
};

const handlers = new Map([
	[FUNCS.debug.log, console.log],
	[FUNCS.debug.warn, console.warn],
	[FUNCS.debug.error, console.error],
	[FUNCS.debug.info, console.info],
	[FUNCS.navigate.back, back],
	[FUNCS.navigate.forward, forward],
	[FUNCS.navigate.reload, reload],
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
		$$(currentTarget.dataset.hideSelector).forEach(el => el.hidden = true);
	}],
	[FUNCS.ui.unhide, ({ currentTarget }) => {
		$$(currentTarget.dataset.unhideSelector).forEach(el => el.hidden = false);
	}],
	[FUNCS.ui.disable, ({ currentTarget }) => {
		$$(currentTarget.dataset.disableSelector).forEach(el => el.disabled = true);
	}],
	[FUNCS.ui.enable, ({ currentTarget }) => {
		$$(currentTarget.dataset.enableSelector).forEach(el => el.disabled = false);
	}],
	[FUNCS.ui.remove, ({ currentTarget }) => {
		$$(currentTarget.dataset.removeSelector).forEach(el => el.remove());
	}],
	[FUNCS.ui.scrollTo, ({ currentTarget }) => {
		const target = $(currentTarget.dataset.scrollToSelector);

		if (target instanceof Element) {
			target.scrollIntoView({
				behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
					? 'instant'
					: 'smooth',
			});
		}
	}],
	[FUNCS.ui.showModal, ({ currentTarget }) => {
		const target = $(currentTarget.dataset.showModalSelector);

		if (target instanceof HTMLDialogElement) {
			target.showModal();
		}
	}],
	[FUNCS.ui.closeModal, ({ currentTarget }) => {
		const target = $(currentTarget.dataset.closeModalSelector);

		if (target instanceof HTMLDialogElement) {
			target.close();
		}
	}],
	[FUNCS.ui.showPopover, ({ currentTarget }) => {
		const target = $(currentTarget.dataset.showPopoverSelector);

		if (target instanceof HTMLElement) {
			target.showPopover();
		}
	}],
	[FUNCS.ui.hidePopover, ({ currentTarget }) => {
		const target = $(currentTarget.dataset.hidePopoverSelector);

		if (target instanceof HTMLElement) {
			target.hidePopover();
		}
	}],
	[FUNCS.ui.togglePopover, ({ currentTarget }) => {
		const target = $(currentTarget.dataset.togglePopoverSelector);

		if (target instanceof HTMLElement) {
			target.togglePopover();
		}
	}],
	[FUNCS.ui.print, () => globalThis.print()],
	[FUNCS.ui.prevent, event => event.preventDefault()],
]);

export const listCallbacks = () => Object.freeze(Array.from(handlers.keys()));

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
	return registerCallback('aegis:callback:' + crypto.randomUUID(), callback);
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
	} else {
		return name;
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
