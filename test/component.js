import { reset, btn, componentBase, componentDarkTheme, componentLightTheme } from './styles.js';
import { replaceStyles } from '@shgysk8zer0/aegis';

export const registerComponent = (...args) => customElements.define.apply(customElements, args);

export const getComponent = async tag => await customElements.whenDefined(tag);

export const symbols = {
	render: Symbol.for('aegis:render'),
};

export class AegisComponent extends HTMLElement {
	#shadow;
	#internals;

	constructor(init, {
		role = 'document',
		mode = 'closed',
		clonable = false,
		delegatesFocus = false,
		slotAssignment = 'named',
	} = {}) {
		super();
		this.#shadow = this.attachShadow({ mode, clonable, delegatesFocus, slotAssignment });
		this.#internals = this.attachInternals();
		this.#internals.role = role;

		replaceStyles(this.#shadow, reset, btn, componentBase, componentDarkTheme, componentLightTheme);

		if (init instanceof Function) {
			init.call(this, {
				shadow: this.#shadow,
				internals: this.#internals,
			});
		}
	}

	get [Symbol.toStringTag]() {
		return `AegisComponent:<${this.tagName.toLowerCase()}>`;
	}

	async connectedCallback() {
		this.dispatchEvent(new Event('connected'));
		await this.triggerUpdate('connected');
	}

	async disconnectedCallback() {
		this.dispatchEvent(new Event('disconnected'));
		await this.triggerUpdate('disconnected');
	}

	async adoptedCallback() {
		this.dispatchEvent(new Event('adopted'));
		await this.triggerUpdate('adopted');
	}

	async attributeChangedCallback(name, oldValue, newValue) {
		if (this.isConnected && oldValue !== newValue) {
			await this.triggerUpdate('attribute', { name, oldValue, newValue });
		}
	}

	async triggerUpdate(type = 'other', data) {
		await new Promise((resolve, reject) => {
			if (this[symbols.render] instanceof Function) {
				requestAnimationFrame(async timestamp => {
					this.#internals.ariaBusy = 'true';

					try {
						await this[symbols.render](type, {
							shadow: this.#shadow,
							internals: this.#internals,
							timestamp,
							data,
						});

						resolve();
					} catch(err) {
						reject(err);
					} finally {
						this.#internals.ariaBusy = 'false';
					}
				});
			} else {
				throw new Error(`<${this.tagName.toLowerCase()}> does not have a [${symbols.render.toString()}] method.`);
			}
		});
	}

	get connected() {
		return new Promise(resolve => {
			if (this.isConnected) {
				resolve();
			} else {
				this.addEventListener('connected', () => resolve(), { once: true });
			}
		});
	}

	get loading() {
		if (this.hasAttribute('loading')) {
			return this.getAttribute('loading');
		} else {
			return 'auto';
		}
	}

	set loading(val) {
		if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('loading', val);
		} else {
			this.removeAttribute('loading');
		}
	}

	get theme() {
		if (this.hasAttribute('theme')) {
			return this.getAttribute('theme');
		} else {
			return 'auto';
		}
	}

	set theme(val) {
		if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('theme', val);
		} else {
			this.removeAttribute('theme');
		}
	}

	static get observedAttributes() {
		return ['theme'];
	}
}
